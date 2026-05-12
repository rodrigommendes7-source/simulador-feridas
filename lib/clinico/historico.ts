import {
  obterModeloCaso,
  obterTituloCaso,
  obterTema,
  obterIdsTemasCaso,
  listarModelosCaso,
} from "./catalogo.ts";
import type {
  EntradaTentativa,
  RegistoTentativa,
  AvaliacaoCaso,
  ProgressoCaso,
  CasoRecomendado,
  MestriaTema,
} from "./types.ts";

export const HISTORY_STORAGE_KEY = "historico_resolucoes_feridas";

type EntradaLegado = {
  id?: string;
  casoId?: string;
  casoTitulo?: string;
  pontuacao?: number;
  data?: string;
  feedback?: string;
};

export function criarIdTentativa() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `tentativa-${Date.now()}`;
}

function analisarIdModeloLegado(value: string | undefined) {
  if (!value) return "legado";
  return value.replace("caso-", "");
}

function normalizarIdTema(idTema: string) {
  return idTema === "materiais-desadequados" ? "decisao-clinica" : idTema;
}

function removerDuplicadosIdsTema(idsTema: string[]) {
  return Array.from(new Set(idsTema.map(normalizarIdTema)));
}

function obterMelhorPontuacaoAntes(historico: RegistoTentativa[], idModelo: string) {
  const scores = historico
    .filter((entry) => entry.idCaso === idModelo)
    .map((entry) => entry.pontuacao);

  return scores.length > 0 ? Math.max(...scores) : null;
}

function obterPontuacaoMediaCasoInterno(historico: RegistoTentativa[], idModelo: string) {
  const entries = historico.filter((entry) => entry.idCaso === idModelo);
  if (entries.length === 0) return null;
  return Math.round(entries.reduce((acc, entry) => acc + entry.pontuacao, 0) / entries.length);
}

function migrarEntradasLegado(raw: unknown): RegistoTentativa[] {
  if (!Array.isArray(raw)) return [];

  return raw.map((item, index) => {
    const legacy = item as EntradaLegado;
    return {
      version: 3,
      id: legacy.id ?? `legado-${index}`,
      idCaso: analisarIdModeloLegado(legacy.casoId),
      tituloCaso: legacy.casoTitulo ?? "Caso legado",
      pontuacao: Number(legacy.pontuacao) || 0,
      melhorPontuacaoAnteriorCaso: null,
      pontuacoesPorSeccao: {},
      codigosErro: [],
      recomendacoesAprendizagem: [],
      idsTemasCaso: [],
      idsProximosCasos: [],
      temasFracosDominantes: [],
      observacoesSeleccionadas: [],
      dialogosSeleccionados: [],
      tratamentosSeleccionados: [],
      aplicacoesSeleccionadas: [],
      resumo: legacy.feedback ?? "",
      data: legacy.data ?? new Date().toISOString(),
      duracaoSegundos: 0,
    };
  });
}

function normalizarRegisto(item: unknown): RegistoTentativa | null {
  if (!item || typeof item !== "object") return null;
  const record = item as Partial<RegistoTentativa> & { version?: unknown; variantId?: unknown; variantTitle?: unknown; idModelo?: unknown; caseTitle?: unknown; score?: unknown; timestamp?: unknown; sectionScores?: unknown; mistakeCodes?: unknown; learningRecommendations?: unknown; templateLearningTopicIds?: unknown; recommendedNextCaseIds?: unknown; dominantWeakTopics?: unknown; selectedObservationIds?: unknown; selectedDialogueIds?: unknown; selectedTreatmentIds?: unknown; selectedApplicationIds?: unknown; summary?: unknown; durationSeconds?: unknown; previousBestScoreForCase?: unknown };
  if (record.version !== 3 && record.version !== 2) return null;

  // Support both old field names (idModelo, caseTitle, etc.) and new ones (idCaso, tituloCaso, etc.)
  const idCaso = typeof record.idCaso === "string" ? record.idCaso
    : typeof record.idModelo === "string" ? record.idModelo
    : "desconhecido";
  const tituloCaso = typeof record.tituloCaso === "string" ? record.tituloCaso
    : typeof record.tituloCaso === "string" ? record.tituloCaso
    : "Caso";
  const pontuacao = typeof record.pontuacao === "number" ? record.pontuacao
    : typeof record.pontuacao === "number" ? record.pontuacao
    : 0;
  const melhorPontuacaoAnteriorCaso = typeof record.melhorPontuacaoAnteriorCaso === "number" ? record.melhorPontuacaoAnteriorCaso
    : typeof record.melhorPontuacaoAnteriorCaso === "number" ? record.melhorPontuacaoAnteriorCaso
    : null;
  const pontuacoesPorSeccao = typeof record.pontuacoesPorSeccao === "object" && record.pontuacoesPorSeccao ? record.pontuacoesPorSeccao
    : typeof record.sectionScores === "object" && record.sectionScores ? record.sectionScores as Record<string, number>
    : {};
  const codigosErro = Array.isArray(record.codigosErro) ? record.codigosErro
    : Array.isArray(record.mistakeCodes) ? record.mistakeCodes
    : [];
  const recomendacoesAprendizagem = Array.isArray(record.recomendacoesAprendizagem) ? record.recomendacoesAprendizagem.map(normalizarIdTema)
    : Array.isArray(record.recomendacoesAprendizagem) ? (record.recomendacoesAprendizagem as string[]).map(normalizarIdTema)
    : [];
  const idsTemasCaso = Array.isArray(record.idsTemasCaso) ? removerDuplicadosIdsTema(record.idsTemasCaso)
    : Array.isArray(record.templateLearningTopicIds) ? removerDuplicadosIdsTema(record.templateLearningTopicIds as string[])
    : removerDuplicadosIdsTema(obterIdsTemasCaso(idCaso));
  const idsProximosCasos = Array.isArray(record.idsProximosCasos) ? record.idsProximosCasos
    : Array.isArray(record.recommendedNextCaseIds) ? record.recommendedNextCaseIds
    : [];
  const temasFracosDominantes = Array.isArray(record.temasFracosDominantes) ? removerDuplicadosIdsTema(record.temasFracosDominantes)
    : Array.isArray(record.dominantWeakTopics) ? removerDuplicadosIdsTema(record.dominantWeakTopics as string[])
    : [];
  const observacoesSeleccionadas = Array.isArray(record.observacoesSeleccionadas) ? record.observacoesSeleccionadas
    : Array.isArray(record.selectedObservationIds) ? record.selectedObservationIds
    : [];
  const dialogosSeleccionados = Array.isArray(record.dialogosSeleccionados) ? record.dialogosSeleccionados
    : Array.isArray(record.selectedDialogueIds) ? record.selectedDialogueIds
    : [];
  const tratamentosSeleccionados = Array.isArray(record.tratamentosSeleccionados) ? record.tratamentosSeleccionados
    : Array.isArray(record.selectedTreatmentIds) ? record.selectedTreatmentIds
    : [];
  const aplicacoesSeleccionadas = Array.isArray(record.aplicacoesSeleccionadas) ? record.aplicacoesSeleccionadas
    : Array.isArray(record.selectedApplicationIds) ? record.selectedApplicationIds
    : [];
  const resumo = typeof record.resumo === "string" ? record.resumo
    : typeof record.resumo === "string" ? record.resumo
    : "";
  const data = typeof record.data === "string" ? record.data
    : typeof record.data === "string" ? record.data
    : new Date().toISOString();
  const duracaoSegundos = typeof record.duracaoSegundos === "number" ? record.duracaoSegundos
    : typeof record.durationSeconds === "number" ? record.durationSeconds
    : 0;

  return {
    version: 3,
    id: typeof record.id === "string" ? record.id : criarIdTentativa(),
    idCaso,
    tituloCaso,
    pontuacao,
    melhorPontuacaoAnteriorCaso,
    pontuacoesPorSeccao,
    codigosErro,
    recomendacoesAprendizagem,
    idsTemasCaso,
    idsProximosCasos,
    temasFracosDominantes,
    observacoesSeleccionadas,
    dialogosSeleccionados,
    tratamentosSeleccionados,
    aplicacoesSeleccionadas,
    resumo,
    data,
    duracaoSegundos,
  };
}

export function carregarHistoricoTentativas(): RegistoTentativa[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
  if (!raw) return [];

  let parsed: unknown;

  try {
    parsed = JSON.parse(raw) as unknown;
  } catch {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
    return [];
  }

  if (Array.isArray(parsed) && parsed.every((item) => (item as RegistoTentativa).version === 3 || (item as { version?: unknown }).version === 2)) {
    return parsed
      .map((item) => normalizarRegisto(item))
      .filter((item): item is RegistoTentativa => Boolean(item));
  }

  const migrated = migrarEntradasLegado(parsed);
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(migrated));
  return migrated;
}

export function guardarRegistoTentativa(registo: RegistoTentativa) {
  if (typeof window === "undefined") return;
  const current = carregarHistoricoTentativas();
  current.unshift(registo);
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(current));
}

export function limparHistoricoTentativas() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(HISTORY_STORAGE_KEY);
}

export function exportarHistoricoComoJson(): void {
  if (typeof window === "undefined") return;
  const historico = carregarHistoricoTentativas();
  const date = new Date().toISOString().slice(0, 10);
  const blob = new Blob([JSON.stringify(historico, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `progresso-feridas-${date}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export type ResultadoImportacao = { ok: true; count: number } | { ok: false; error: string };

export function importarHistoricoDeJson(raw: unknown): ResultadoImportacao {
  if (typeof window === "undefined") return { ok: false, error: "Não disponível no servidor." };
  if (!Array.isArray(raw)) return { ok: false, error: "O ficheiro não contém um array de tentativas." };

  const CAMPOS_OBRIGATORIOS: Array<string> = ["version", "id"];
  const valid = raw.filter((item): item is RegistoTentativa => {
    if (!item || typeof item !== "object") return false;
    const r = item as Partial<RegistoTentativa> & { version?: unknown };
    return (r.version === 3 || r.version === 2) && CAMPOS_OBRIGATORIOS.every((f) => f in r);
  });

  if (valid.length === 0) {
    return { ok: false, error: "Nenhum registo válido encontrado. Verifica se o ficheiro foi exportado nesta aplicação." };
  }
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(valid));
  return { ok: true, count: valid.length };
}

export function contarTentativasCaso(historico: RegistoTentativa[], idModelo: string) {
  return historico.filter((entry) => entry.idCaso === idModelo).length;
}

export function obterMelhorPontuacaoAnteriorCaso(historico: RegistoTentativa[], idModelo: string) {
  return obterMelhorPontuacaoAntes(historico, idModelo);
}

export function obterProgressoCaso(
  historico: RegistoTentativa[],
  idModelo: string
): ProgressoCaso {
  const entries = historico.filter((entry) => entry.idCaso === idModelo);
  const scores = entries.map((entry) => entry.pontuacao);
  const ultimaPontuacao = entries[0]?.pontuacao ?? null;
  const melhorPontuacao = scores.length > 0 ? Math.max(...scores) : null;
  const melhorPontuacaoAnterior =
    scores.length > 1 ? Math.max(...scores.slice(1)) : entries[0]?.melhorPontuacaoAnteriorCaso ?? null;

  return {
    idModelo,
    titulo: obterTituloCaso(idModelo),
    tentativas: entries.length,
    pontuacaoMedia: entries.length > 0 ? Math.round(scores.reduce((acc, score) => acc + score, 0) / entries.length) : null,
    melhorPontuacao,
    ultimaPontuacao,
    melhorPontuacaoAnterior,
    concluido: entries.length > 0,
  };
}

function ordenarPorPrioridade(items: CasoRecomendado[]) {
  return items.sort((a, b) => {
    if (a.pontuacaoMedia === null && b.pontuacaoMedia !== null) return 1;
    if (a.pontuacaoMedia !== null && b.pontuacaoMedia === null) return -1;
    if (a.pontuacaoMedia !== null && b.pontuacaoMedia !== null && a.pontuacaoMedia !== b.pontuacaoMedia) {
      return a.pontuacaoMedia - b.pontuacaoMedia;
    }
    return a.tentativas - b.tentativas;
  });
}

export function obterCasosRecomendadosSeguintes(historico: RegistoTentativa[]): CasoRecomendado[] {
  const weakTopics = obterMestriaTema(historico).slice(0, 3).map((topic) => topic.idTema);

  return ordenarPorPrioridade(
    listarModelosCaso()
      .filter((modelo) => modelo.status === "disponivel")
      .map((modelo) => {
        const progress = obterProgressoCaso(historico, modelo.id);
        const topicIds = obterIdsTemasCaso(modelo.id).map(normalizarIdTema);
        const topicosCorrespondentes = topicIds.filter((idTema) => weakTopics.includes(idTema));
        const fallbackTopic = topicIds[0];

        if (topicosCorrespondentes.length === 0 && progress.tentativas > 0) return null;

        return {
          idModelo: modelo.id,
          titulo: modelo.titulo,
          tituloAbreviado: modelo.tituloAbreviado,
          dificuldade: modelo.dificuldade,
          motivo:
            topicosCorrespondentes.length > 0
              ? `Ajuda a reforçar ${topicosCorrespondentes
                  .map((idTema) => obterTema(idTema)?.titulo ?? idTema)
                  .join(", ")}.`
              : `Bom próximo passo para consolidar ${obterTema(fallbackTopic)?.titulo ?? "o raciocínio clínico"}.`,
          topicosCorrespondentes: topicosCorrespondentes.length > 0 ? topicosCorrespondentes : fallbackTopic ? [fallbackTopic] : [],
          pontuacaoMedia: progress.pontuacaoMedia,
          tentativas: progress.tentativas,
        } satisfies CasoRecomendado;
      })
      .filter((item): item is CasoRecomendado => Boolean(item))
  ).slice(0, 4);
}

export function construirRegistoTentativa(params: {
  avaliacao: AvaliacaoCaso;
  historico: RegistoTentativa[];
  idModelo: string;
  duracaoSegundos: number;
  tentativa: EntradaTentativa;
}): RegistoTentativa {
  const modelo = obterModeloCaso(params.idModelo);
  const inadequateItems = params.avaliacao.seccoes
    .flatMap((seccao) => seccao.itens)
    .filter((item) => item.classificacao === "inadequado" || item.classificacao === "redundante");
  const recomendacoesAprendizagem = params.avaliacao.recomendacoesAprendizagem.map(
    (recommendation) => recommendation.idTema
  );
  const temasFracosDominantes = removerDuplicadosIdsTema(
    params.avaliacao.seccoes
      .flatMap((seccao) =>
        seccao.itens
          .filter((item) => item.classificacao === "inadequado" || item.classificacao === "redundante")
          .flatMap((item) => item.idsTemas)
      )
      .slice(0, 6)
  );
  const syntheticHistory = [
    ...params.historico,
    {
      version: 3,
      id: "previsao",
      idCaso: params.idModelo,
      tituloCaso: modelo?.titulo ?? params.idModelo,
      pontuacao: params.avaliacao.pontuacao,
      melhorPontuacaoAnteriorCaso: obterMelhorPontuacaoAntes(params.historico, params.idModelo),
      pontuacoesPorSeccao: Object.fromEntries(
        params.avaliacao.seccoes.map((seccao) => [seccao.id, seccao.pontuacao])
      ),
      codigosErro: inadequateItems.map((item) => item.id),
      recomendacoesAprendizagem,
      idsTemasCaso: removerDuplicadosIdsTema(obterIdsTemasCaso(params.idModelo)),
      idsProximosCasos: [],
      temasFracosDominantes,
      observacoesSeleccionadas: params.tentativa.idsObservacao,
      dialogosSeleccionados: params.tentativa.idsDialogo,
      tratamentosSeleccionados: params.tentativa.idsTratamento,
      aplicacoesSeleccionadas: params.tentativa.idsAplicacao,
      resumo: params.avaliacao.resumoRaciocinio.proximoPasso,
      data: new Date().toISOString(),
      duracaoSegundos: params.duracaoSegundos,
    } satisfies RegistoTentativa,
  ];

  return {
    version: 3,
    id: criarIdTentativa(),
    idCaso: params.idModelo,
    tituloCaso: modelo?.titulo ?? params.idModelo,
    pontuacao: params.avaliacao.pontuacao,
    melhorPontuacaoAnteriorCaso: obterMelhorPontuacaoAntes(params.historico, params.idModelo),
    pontuacoesPorSeccao: Object.fromEntries(
      params.avaliacao.seccoes.map((seccao) => [seccao.id, seccao.pontuacao])
    ),
    codigosErro: inadequateItems.map((item) => item.id),
    recomendacoesAprendizagem,
    idsTemasCaso: removerDuplicadosIdsTema(obterIdsTemasCaso(params.idModelo)),
    idsProximosCasos: obterCasosRecomendadosSeguintes(syntheticHistory).map((item) => item.idModelo),
    temasFracosDominantes,
    observacoesSeleccionadas: params.tentativa.idsObservacao,
    dialogosSeleccionados: params.tentativa.idsDialogo,
    tratamentosSeleccionados: params.tentativa.idsTratamento,
    aplicacoesSeleccionadas: params.tentativa.idsAplicacao,
    resumo: params.avaliacao.resumoRaciocinio.proximoPasso,
    data: new Date().toISOString(),
    duracaoSegundos: params.duracaoSegundos,
  };
}

export function obterPontuacaoMedia(historico: RegistoTentativa[]) {
  if (historico.length === 0) return 0;
  return Math.round(historico.reduce((acc, entry) => acc + entry.pontuacao, 0) / historico.length);
}

export function obterMelhorPontuacao(historico: RegistoTentativa[]) {
  if (historico.length === 0) return 0;
  return Math.max(...historico.map((entry) => entry.pontuacao));
}

export function obterSeccoesMaisFracas(historico: RegistoTentativa[]) {
  const totals = new Map<string, { total: number; count: number }>();

  for (const entry of historico) {
    for (const [idSeccao, pontuacao] of Object.entries(entry.pontuacoesPorSeccao)) {
      const current = totals.get(idSeccao) ?? { total: 0, count: 0 };
      current.total += pontuacao;
      current.count += 1;
      totals.set(idSeccao, current);
    }
  }

  return Array.from(totals.entries())
    .map(([idSeccao, value]) => ({
      idSeccao,
      media: Math.round(value.total / value.count),
    }))
    .sort((a, b) => a.media - b.media);
}

export function obterTopicosRecomendados(historico: RegistoTentativa[]) {
  const totals = new Map<string, number>();

  for (const entry of historico) {
    for (const idTema of entry.recomendacoesAprendizagem) {
      const normalizedIdTema = normalizarIdTema(idTema);
      totals.set(normalizedIdTema, (totals.get(normalizedIdTema) ?? 0) + 1);
    }
  }

  return Array.from(totals.entries())
    .map(([idTema, count]) => ({
      idTema,
      count,
      titulo: obterTema(idTema)?.titulo ?? idTema,
    }))
    .sort((a, b) => b.count - a.count);
}

export function obterMestriaTema(historico: RegistoTentativa[]): MestriaTema[] {
  const exposureCounts = new Map<string, number>();
  const recommendationCounts = new Map<string, number>();
  const weakSignalCounts = new Map<string, number>();

  for (const entry of historico) {
    for (const idTema of entry.idsTemasCaso) {
      const normalizedIdTema = normalizarIdTema(idTema);
      exposureCounts.set(normalizedIdTema, (exposureCounts.get(normalizedIdTema) ?? 0) + 1);
    }

    for (const idTema of entry.recomendacoesAprendizagem) {
      const normalizedIdTema = normalizarIdTema(idTema);
      recommendationCounts.set(
        normalizedIdTema,
        (recommendationCounts.get(normalizedIdTema) ?? 0) + 1
      );
    }

    for (const idTema of entry.temasFracosDominantes) {
      const normalizedIdTema = normalizarIdTema(idTema);
      weakSignalCounts.set(normalizedIdTema, (weakSignalCounts.get(normalizedIdTema) ?? 0) + 1);
    }
  }

  const allTopicIds = new Set<string>([
    ...exposureCounts.keys(),
    ...recommendationCounts.keys(),
    ...weakSignalCounts.keys(),
  ]);

  return Array.from(allTopicIds)
    .map((idTema) => {
      const contadorExposicao = exposureCounts.get(idTema) ?? 0;
      const contadorRecomendacoes = recommendationCounts.get(idTema) ?? 0;
      const contadorSinalFraco = weakSignalCounts.get(idTema) ?? 0;
      const pontuacaoMestria = Math.max(
        0,
        Math.min(100, 76 + contadorExposicao * 6 - contadorRecomendacoes * 12 - contadorSinalFraco * 8)
      );

      return {
        idTema,
        titulo: obterTema(idTema)?.titulo ?? idTema,
        pontuacaoMestria,
        contadorRecomendacoes,
        contadorSinalFraco,
        contadorExposicao,
      };
    })
    .sort((a, b) => a.pontuacaoMestria - b.pontuacaoMestria);
}

export function obterPrioridadeRepeticaoCaso(historico: RegistoTentativa[]) {
  const totals = new Map<string, { total: number; count: number }>();

  for (const entry of historico) {
    const current = totals.get(entry.idCaso) ?? { total: 0, count: 0 };
    current.total += entry.pontuacao;
    current.count += 1;
    totals.set(entry.idCaso, current);
  }

  return Array.from(totals.entries())
    .map(([idModelo, value]) => ({
      idModelo,
      media: Math.round(value.total / value.count),
      tentativas: value.count,
      titulo: obterModeloCaso(idModelo)?.titulo ?? idModelo,
    }))
    .sort((a, b) => a.media - b.media);
}

export function obterPlanoEstudo(historico: RegistoTentativa[]) {
  const casoARepetir = obterPrioridadeRepeticaoCaso(historico)[0] ?? null;
  const temaARever = obterMestriaTema(historico)[0] ?? null;
  const casoSeguimento = obterCasosRecomendadosSeguintes(historico).find(
    (item) => item.idModelo !== casoARepetir?.idModelo
  ) ?? null;

  return {
    casoARepetir,
    temaARever,
    casoSeguimento,
  };
}

export function obterMelhorPontuacaoRecente(historico: RegistoTentativa[]) {
  return historico[0]?.pontuacao ?? 0;
}

export function obterContadorCasosConcluidos(historico: RegistoTentativa[]) {
  return new Set(historico.map((entry) => entry.idCaso)).size;
}

export function obterAlvoContinuarAprendizagem(historico: RegistoTentativa[]) {
  const latest = historico[0];
  if (!latest) return null;

  const idProximoCaso = latest.idsProximosCasos[0] ?? latest.idCaso;

  return {
    tituloUltimoCaso: latest.tituloCaso,
    idTemaRevisao: latest.recomendacoesAprendizagem[0] ?? latest.temasFracosDominantes[0] ?? null,
    idProximoCaso,
    tituloProximoCaso: obterTituloCaso(idProximoCaso),
  };
}

export function obterPontuacaoMediaCaso(historico: RegistoTentativa[], idModelo: string) {
  return obterPontuacaoMediaCasoInterno(historico, idModelo);
}
