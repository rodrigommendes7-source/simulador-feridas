import {
  obterRotuloAplicacao,
  obterTema,
  obterTituloTema,
  obterTratamento,
  obterRotuloTratamento,
} from "./catalog.ts";
import { gerarTodasPerguntasJustificacao, gerarPerguntaJustificacao } from "./justification-engine.ts";
import { avaliarAnotacao } from "./annotation-evaluator.ts";
import type {
  RevisaoTentativa,
  IdAplicacao,
  EntradaTentativa,
  AvaliacaoCaso,
  ModeloCaso,
  ClassificacaoAvaliacao,
  SeccaoAvaliacao,
  RespostaJustificacao,
  RecomendacaoAprendizagem,
  EstadoRevisao,
  MarcadorTecido,
  DefinicaoTratamento,
  FuncaoTratamento,
  OpcaoTecidoVisual,
  OpcaoExsudadoVisual,
  OpcaoBordosVisual,
} from "./types.ts";

const pesosClassificacao: Record<ClassificacaoAvaliacao, number> = {
  essencial: 12,
  adequado: 6,
  redundante: -3,
  inadequado: -8,
};


function normalizarIdTema(idTema: string) {
  return idTema === "materiais-desadequados" ? "decisao-clinica" : idTema;
}

function criarSeccao(
  id: SeccaoAvaliacao["id"],
  title: string,
  pontuacaoMaxima: number
): SeccaoAvaliacao {
  return { id, title, pontuacao: 0, pontuacaoMaxima, itens: [] };
}

function adicionarItem(
  seccao: SeccaoAvaliacao,
  idOrigem: string | undefined,
  rotulo: string,
  classificacao: ClassificacaoAvaliacao,
  explicacao: string,
  idsTemas: string[]
) {
  seccao.itens.push({
    id: `${seccao.id}-${seccao.itens.length + 1}`,
    idOrigem,
    rotulo,
    classificacao,
    explicacao,
    idsTemas,
  });
}

function obterPontuacaoBrutaSeccao(seccao: SeccaoAvaliacao) {
  return seccao.itens.reduce((acc, item) => {
    if (item.pesoOverride !== undefined) {
      const sign =
        item.classificacao === "inadequado" ? -1
        : item.classificacao === "redundante" ? -0.25
        : 1;
      return acc + item.pesoOverride * sign;
    }
    return acc + pesosClassificacao[item.classificacao];
  }, 0);
}

function finalizarPontuacaoSeccao(seccao: SeccaoAvaliacao, tetoBrutoAtingivel: number) {
  const pontuacaoBruta = Math.max(0, Math.min(tetoBrutoAtingivel, obterPontuacaoBrutaSeccao(seccao)));
  seccao.pontuacao =
    tetoBrutoAtingivel > 0 ? Math.round((pontuacaoBruta / tetoBrutoAtingivel) * seccao.pontuacaoMaxima) : 0;
  return seccao;
}

function tratamentosCanonicosSemDuplicados(idsTratamento: string[]) {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  const selected: DefinicaoTratamento[] = [];

  for (const idTratamento of idsTratamento) {
    const tratamento = obterTratamento(idTratamento);
    if (!tratamento) continue;

    if (seen.has(tratamento.equivalenceGroup)) {
      duplicates.add(tratamento.id);
      continue;
    }

    seen.add(tratamento.equivalenceGroup);
    selected.push(tratamento);
  }

  return { selected, duplicates };
}

function tratamentoCorrespondeAObjetivo(
  tratamento: DefinicaoTratamento,
  correspondencia: { idsTratamento?: string[]; funcoesTratamento?: FuncaoTratamento[] }
) {
  if (correspondencia.idsTratamento?.includes(tratamento.id)) return true;
  if (correspondencia.funcoesTratamento?.some((fn) => tratamento.funcoes.includes(fn))) return true;
  // Equivalência clínica: materiais do mesmo grupo equivalem-se nos goals por idsTratamento
  if (correspondencia.idsTratamento) {
    for (const matcherId of correspondencia.idsTratamento) {
      const matcherTreatment = obterTratamento(matcherId);
      if (matcherTreatment && matcherTreatment.equivalenceGroup === tratamento.equivalenceGroup) {
        return true;
      }
    }
  }
  return false;
}

function construirSeccaoObservacao(modelo: ModeloCaso, tentativa: EntradaTentativa) {
  const seccao = criarSeccao("observacao", "Observação", 5);
  const selected = new Set(tentativa.idsObservacao);

  for (const definition of modelo.definicoesObservacao) {
    const detail = modelo.detalhesObservacao[definition.id];
    if (!detail) continue;

    if (selected.has(definition.id)) {
      adicionarItem(
        seccao,
        definition.id,
        definition.rotulo,
        definition.prioridade === "essencial" ? "essencial" : "adequado",
        `Observaste ${definition.rotulo.toLowerCase()}: ${detail.detalhe}`,
        definition.idsTemas
      );
    } else if (definition.prioridade === "essencial") {
      // Itens essenciais não observados penalizam — adequados omitidos são silenciosos
      adicionarItem(
        seccao,
        definition.id,
        definition.rotulo,
        "inadequado",
        `Faltou observar ${definition.rotulo.toLowerCase()}, o que limita a leitura clínica do caso.`,
        definition.idsTemas
      );
    }
  }

  return seccao;
}

function construirSeccaoAvaliacao(modelo: ModeloCaso, tentativa: EntradaTentativa) {
  const seccao = criarSeccao("avaliacao", "Avaliação e diálogo", 10);
  const selected = new Set(tentativa.idsDialogo);

  for (const prompt of modelo.promptsDialogo) {
    if (selected.has(prompt.id)) {
      adicionarItem(
        seccao,
        prompt.id,
        prompt.rotulo,
        prompt.prioridade === "essencial" ? "essencial" : "adequado",
        `Perguntaste sobre ${prompt.rotulo.toLowerCase().replace("perguntar sobre ", "")}: ${modelo.respostasDialogo[prompt.id]}`,
        prompt.idsTemas
      );
    } else if (prompt.prioridade === "essencial") {
      // Perguntas essenciais omitidas penalizam — adequadas omitidas são silenciosas
      adicionarItem(
        seccao,
        prompt.id,
        prompt.rotulo,
        "inadequado",
        "Faltou recolher este dado clínico, que influencia a segurança do plano.",
        prompt.idsTemas
      );
    }
  }

  return seccao;
}

function construirSeccaoTratamento(modelo: ModeloCaso, tentativa: EntradaTentativa) {
  const seccao = criarSeccao("plano-terapeutico", "Plano terapêutico", 45);
  const { selected, duplicates } = tratamentosCanonicosSemDuplicados(tentativa.idsTratamento);
  const regraEspeciais = modelo.regrasAvaliacao.filter((rule) => rule.alvo === "treatment");
  const claimedGoalIds = new Set<string>();

  function obterEstadoJustificacao(idTratamento: string): boolean | null {
    if (!tentativa.respostasJustificacao) return null;
    const answer = tentativa.respostasJustificacao.find((a) => a.idTratamento === idTratamento);
    if (!answer) return null;
    const question = gerarPerguntaJustificacao(idTratamento, modelo);
    if (!question) return null;
    return answer.idOpcaoSelecionada === question.idOpcaoCorreta;
  }

  function adicionarItemTratamento(
    idTratamento: string,
    rotulo: string,
    classificacao: ClassificacaoAvaliacao,
    motivo: string,
    idsTemas: string[]
  ) {
    const justificacaoCorreta = obterEstadoJustificacao(idTratamento);
    seccao.itens.push({
      id: `${seccao.id}-${seccao.itens.length + 1}`,
      idOrigem: idTratamento,
      rotulo,
      classificacao,
      explicacao: motivo,
      idsTemas,
      justificacaoCorreta,
    });
  }

  for (const tratamento of selected) {
    const regraForcada = regraEspeciais.find((rule) => rule.aplicavelAIds.includes(tratamento.id));

    if (regraForcada) {
      adicionarItemTratamento(
        tratamento.id,
        tratamento.rotulo,
        regraForcada.classificacao,
        regraForcada.motivo,
        regraForcada.idsTemas
      );
      continue;
    }

    const objetivosCorrespondentes = modelo.objetivosClinicosAlvo.filter((goal) =>
      tratamentoCorrespondeAObjetivo(tratamento, goal.correspondencia)
    );
    const objetivosDisponiveis = objetivosCorrespondentes.filter((goal) => !claimedGoalIds.has(goal.id));

    if (objetivosCorrespondentes.length === 0) {
      // Limpeza e antissépsia universais são sempre corretas — nunca penalizar
      const isUniversalCleanser =
        tratamento.avisos_contraindicacao.length === 0 &&
        (tratamento.funcoes.includes("limpar") || tratamento.funcoes.includes("antisseptico"));
      if (isUniversalCleanser) {
        adicionarItemTratamento(
          tratamento.id,
          tratamento.rotulo,
          "adequado",
          "Limpeza e antissépsia são sempre adequadas como preparação do leito da ferida.",
          tratamento.learningTopicIds
        );
        continue;
      }
      adicionarItemTratamento(
        tratamento.id,
        tratamento.rotulo,
        "redundante",
        "Este tratamento não responde claramente ao problema dominante da variante atual.",
        tratamento.learningTopicIds
      );
      continue;
    }

    if (objetivosDisponiveis.length === 0) {
      adicionarItemTratamento(
        tratamento.id,
        tratamento.rotulo,
        "redundante",
        "Este tratamento repete uma função já coberta no plano e não acrescenta novo valor clínico.",
        tratamento.learningTopicIds
      );
      continue;
    }

    const objetivoEssencial = objetivosDisponiveis.find((goal) => goal.prioridade === "essencial");
    const objetivoEscolhido = objetivoEssencial ?? objetivosDisponiveis[0];
    claimedGoalIds.add(objetivoEscolhido.id);
    adicionarItemTratamento(
      tratamento.id,
      tratamento.rotulo,
      objetivoEscolhido.prioridade === "essencial" ? "essencial" : "adequado",
      objetivoEscolhido.justificativa,
      [...objetivoEscolhido.idsTemas, ...tratamento.learningTopicIds]
    );
  }

  for (const duplicateId of duplicates) {
    adicionarItemTratamento(
      duplicateId,
      obterRotuloTratamento(duplicateId),
      "redundante",
      "Selecionaste um material equivalente ao já escolhido, sem acrescentar novo valor clínico.",
      ["materiais-desadequados", "decisao-clinica"]
    );
  }

  for (const goal of modelo.objetivosClinicosAlvo.filter(
    (item) => item.correspondencia.idsTratamento || item.correspondencia.funcoesTratamento
  )) {
    const fulfilled = selected.some((tratamento) => tratamentoCorrespondeAObjetivo(tratamento, goal.correspondencia));
    if (!fulfilled && goal.prioridade === "essencial") {
      adicionarItem(
        seccao,
        undefined,
        goal.rotulo,
        "inadequado",
        `Faltou um elemento essencial: ${goal.justificativa}`,
        goal.idsTemas
      );
    }
  }

  if (selected.length === 0) {
    adicionarItem(
      seccao,
      undefined,
      "Sem tratamento selecionado",
      "inadequado",
      "Sem plano terapêutico, não é possível responder ao estado da ferida.",
      ["decisao-clinica"]
    );
  }

  return seccao;
}

function avaliarCategoriaVisual<T extends string>(
  seccao: SeccaoAvaliacao,
  categoriaId: string,
  categoriaRotulo: string,
  expected: T[],
  selected: T[],
  idsTemas: string[]
) {
  const expectedSet = new Set(expected);
  const selectedSet = new Set(selected);
  const isCorrect =
    expectedSet.size === selectedSet.size &&
    [...expectedSet].every((item) => selectedSet.has(item));

  if (isCorrect) {
    adicionarItem(
      seccao,
      `visual-${categoriaId}`,
      categoriaRotulo,
      "essencial",
      expected.length === 0
        ? `Identificaste corretamente que não há ${categoriaRotulo.toLowerCase()} relevante nesta ferida.`
        : `Identificaste corretamente: ${expected.join(", ")}.`,
      idsTemas
    );
  } else {
    const missed = expected.filter((item) => !selectedSet.has(item));
    const extra = [...selectedSet].filter((item) => !expectedSet.has(item as T));
    const parts: string[] = [];
    if (missed.length > 0) parts.push(`não identificaste: ${missed.join(", ")}`);
    if (extra.length > 0) parts.push(`identificaste incorretamente: ${extra.join(", ")}`);
    adicionarItem(
      seccao,
      `visual-${categoriaId}`,
      categoriaRotulo,
      "inadequado",
      `Identificação incorreta — ${parts.join("; ")}. Revê os tipos visíveis na imagem.`,
      idsTemas
    );
  }
}

function construirSeccaoIdentificacaoVisual(modelo: ModeloCaso, tentativa: EntradaTentativa) {
  const seccao = criarSeccao("identificacao-visual", "Identificação visual", 25);
  const targets = modelo.objetivosVisuais;
  const submission = tentativa.submissaoVisual;

  avaliarCategoriaVisual<OpcaoTecidoVisual>(
    seccao, "tecidos", "Tecidos",
    targets.tecidos, submission.tecidos, ["tecidos-e-leito"]
  );
  avaliarCategoriaVisual<OpcaoExsudadoVisual>(
    seccao, "exsudado", "Exsudado",
    targets.exsudado, submission.exsudado, ["gestao-exsudado"]
  );
  avaliarCategoriaVisual<OpcaoBordosVisual>(
    seccao, "bordos", "Bordos e pele perilesional",
    targets.bordos, submission.bordos, ["protecao-perilesional"]
  );

  const zonasTecido = modelo.zonasTecido ?? [];
  if (zonasTecido.length > 0) {
    const avaliacaoAnotacao = avaliarAnotacao(tentativa.marcadoresTecido ?? [], zonasTecido);

    // peso da anotação = soma dos pesos positivos dos items da checkbox (para 50/50)
    const checkboxAttainable = seccao.itens.reduce(
      (acc, it) => acc + Math.max(0, pesosClassificacao[it.classificacao]),
      0
    );

    const classificacaoAnotacao: ClassificacaoAvaliacao =
      avaliacaoAnotacao.pontuacao >= 0.85 ? "essencial"
      : avaliacaoAnotacao.pontuacao >= 0.5 ? "adequado"
      : avaliacaoAnotacao.pontuacao > 0 ? "redundante"
      : "inadequado";

    const explicacao =
      avaliacaoAnotacao.tiposOmitidos.length > 0
        ? `Tipos identificados na imagem: ${avaliacaoAnotacao.tiposCorretos.join(", ") || "nenhum"}. Em falta: ${avaliacaoAnotacao.tiposOmitidos.join(", ")}.`
        : avaliacaoAnotacao.marcadoresForaZona > 0
        ? `Todos os tipos correctamente apontados, mas ${avaliacaoAnotacao.marcadoresForaZona} marcador(es) fora das zonas esperadas.`
        : "Todos os tecidos correctamente identificados na imagem.";

    seccao.itens.push({
      id: `${seccao.id}-annotation`,
      idOrigem: undefined,
      rotulo: "Anotação dos tecidos na imagem",
      classificacao: classificacaoAnotacao,
      explicacao,
      idsTemas: ["tecidos-e-leito"],
      pesoOverride: avaliacaoAnotacao.pontuacao * checkboxAttainable,
    });
  }

  return seccao;
}

function aplicacaoCorrespondeAObjetivo(
  idAplicacao: IdAplicacao,
  correspondencia: { idsAplicacao?: IdAplicacao[] }
) {
  return correspondencia.idsAplicacao?.includes(idAplicacao) ?? false;
}

function classificarAplicacaoPorRegras(
  appDef: { regras?: { condicoes_ideais: Record<string, number[]>; condicoes_parciais?: Record<string, number[]>; contraindicacoes: Record<string, number[]>[] } },
  variavelFerida: Record<string, number>
): "correto" | "parcial" | "incorreto" | null {
  if (!appDef.regras) return null;
  const { condicoes_ideais, condicoes_parciais, contraindicacoes } = appDef.regras;

  function matchesAll(cond: Record<string, number[]>): boolean {
    for (const [key, vals] of Object.entries(cond)) {
      if (!vals || vals.length === 0) continue;
      if (!vals.includes(variavelFerida[key] as number)) return false;
    }
    return true;
  }

  if (contraindicacoes.some((c) => matchesAll(c))) return "incorreto";
  if (matchesAll(condicoes_ideais)) return "correto";
  if (condicoes_parciais && matchesAll(condicoes_parciais)) return "parcial";
  return "parcial";
}

function construirSeccaoAplicacao(modelo: ModeloCaso, tentativa: EntradaTentativa) {
  const seccao = criarSeccao("tecnica-aplicacao", "Técnica de aplicação", 15);
  const selected = new Set(tentativa.idsAplicacao);
  const regraEspeciais = modelo.regrasAvaliacao.filter((rule) => rule.alvo === "application");
  const variavelFerida = (modelo.variavelFerida ?? {}) as Record<string, number>;

  for (const idAplicacao of modelo.opcoesAplicacao) {
    const rotulo = obterRotuloAplicacao(modelo, idAplicacao);
    const regraEspecial = regraEspeciais.find((rule) => rule.aplicavelAIds.includes(idAplicacao));

    if (selected.has(idAplicacao) && regraEspecial) {
      adicionarItem(
        seccao,
        idAplicacao,
        rotulo,
        regraEspecial.classificacao,
        regraEspecial.motivo,
        regraEspecial.idsTemas
      );
      continue;
    }

    const objetivoCorrespondente = modelo.objetivosClinicosAlvo.find((goal) =>
      aplicacaoCorrespondeAObjetivo(idAplicacao, goal.correspondencia)
    );

    if (!selected.has(idAplicacao) && objetivoCorrespondente?.prioridade === "essencial") {
      adicionarItem(
        seccao,
        idAplicacao,
        rotulo,
        "inadequado",
        `Faltou esta decisão técnica: ${objetivoCorrespondente.justificativa}`,
        objetivoCorrespondente.idsTemas
      );
      continue;
    }

    if (selected.has(idAplicacao) && objetivoCorrespondente) {
      adicionarItem(
        seccao,
        idAplicacao,
        rotulo,
        objetivoCorrespondente.prioridade === "essencial" ? "essencial" : "adequado",
        objetivoCorrespondente.justificativa,
        objetivoCorrespondente.idsTemas
      );
      continue;
    }

    // Sem goal específico: avaliar pela regras da definicoesAplicacao (condicoes_ideais/contraindicacoes)
    if (!objetivoCorrespondente) {
      const appDef = modelo.definicoesAplicacao.find((d) => d.id === idAplicacao);
      if (appDef) {
        const ruleClassification = classificarAplicacaoPorRegras(appDef as Parameters<typeof classificarAplicacaoPorRegras>[0], variavelFerida);
        if (ruleClassification !== null) {
          if (selected.has(idAplicacao)) {
            if (ruleClassification === "incorreto") {
              adicionarItem(seccao, idAplicacao, rotulo, "inadequado",
                "Esta técnica está contraindicada para o estado atual da ferida.",
                appDef.idsTemas);
            } else {
              adicionarItem(seccao, idAplicacao, rotulo,
                ruleClassification === "correto" ? "adequado" : "redundante",
                ruleClassification === "correto"
                  ? "Técnica adequada para o estado atual da ferida."
                  : "Técnica aplicável, mas existem opções mais indicadas para o estado atual da ferida.",
                appDef.idsTemas);
            }
          }
          // Técnica não selecionada e sem goal específico: silenciosa (não penaliza nem bonifica)
        }
      }
    }
  }

  if (selected.size === 0) {
    adicionarItem(
      seccao,
      undefined,
      "Sem técnica registada",
      "inadequado",
      "O plano terapêutico precisa de uma forma de aplicação coerente para ser clinicamente seguro.",
      ["decisao-clinica"]
    );
  }

  return seccao;
}

const SUBMISSAO_VISUAL_VAZIA = { tecidos: [], exsudado: [], bordos: [] };

function construirTentativaComSelecao<K extends keyof EntradaTentativa>(
  field: K,
  selection: EntradaTentativa[K]
): EntradaTentativa {
  return {
    idsObservacao: [],
    submissaoVisual: SUBMISSAO_VISUAL_VAZIA,
    idsDialogo: [],
    idsTratamento: [],
    idsAplicacao: [],
    [field]: selection,
  };
}

function selecaoGulosaOtima<T, K extends keyof EntradaTentativa>(
  options: readonly T[],
  field: K,
  buildSection: (modelo: ModeloCaso, tentativa: EntradaTentativa) => SeccaoAvaliacao,
  modelo: ModeloCaso
): T[] {
  // Greedy forward: repeatedly add the option that most improves the score.
  // Falls back to no-item if all additions would hurt (negative marginal contribution).
  const currentSelection: T[] = [];
  let currentScore = obterPontuacaoBrutaSeccao(
    buildSection(modelo, construirTentativaComSelecao(field, currentSelection as unknown as EntradaTentativa[K]))
  );

  while (true) {
    let bestGain = 0;
    let bestOption: T | null = null;

    for (const option of options) {
      if (currentSelection.includes(option)) continue;
      const candidate = [...currentSelection, option];
      const score = obterPontuacaoBrutaSeccao(
        buildSection(modelo, construirTentativaComSelecao(field, candidate as unknown as EntradaTentativa[K]))
      );
      const gain = score - currentScore;
      if (gain > bestGain) {
        bestGain = gain;
        bestOption = option;
      }
    }

    if (bestOption === null) break;
    currentSelection.push(bestOption);
    currentScore += bestGain;
  }

  // Return items in the same order as the original options array for determinism
  const selectionSet = new Set(currentSelection);
  return options.filter((opt) => selectionSet.has(opt));
}

function obterMelhorPontuacaoBrutaSelecoes<T, K extends keyof EntradaTentativa>(
  options: readonly T[],
  field: K,
  buildSection: (modelo: ModeloCaso, tentativa: EntradaTentativa) => SeccaoAvaliacao,
  modelo: ModeloCaso
) {
  const bestSelection = selecaoGulosaOtima(options, field, buildSection, modelo);
  const tentativa = construirTentativaComSelecao(field, bestSelection as unknown as EntradaTentativa[K]);
  return Math.max(0, obterPontuacaoBrutaSeccao(buildSection(modelo, tentativa)));
}

function obterMelhorSelecaoSelecoes<T, K extends keyof EntradaTentativa>(
  options: readonly T[],
  field: K,
  buildSection: (modelo: ModeloCaso, tentativa: EntradaTentativa) => SeccaoAvaliacao,
  modelo: ModeloCaso
) {
  return selecaoGulosaOtima(options, field, buildSection, modelo);
}

// Teto fixo baseado apenas nos goals essenciais — selecionar só os essenciais já dá 100/100
function obterTetoBrutoEssencial(
  modelo: ModeloCaso,
  seccaoId: SeccaoAvaliacao["id"]
): number {
  const PESO_ESSENCIAL = pesosClassificacao.essencial; // 12

  if (seccaoId === "observacao") {
    const count = modelo.definicoesObservacao.filter(
      (d) => d.prioridade === "essencial"
    ).length;
    return count * PESO_ESSENCIAL;
  }
  if (seccaoId === "avaliacao") {
    const count = modelo.promptsDialogo.filter(
      (d) => d.prioridade === "essencial"
    ).length;
    return count * PESO_ESSENCIAL;
  }
  if (seccaoId === "plano-terapeutico") {
    const count = modelo.objetivosClinicosAlvo.filter(
      (g) =>
        g.prioridade === "essencial" &&
        (g.correspondencia.idsTratamento !== undefined || g.correspondencia.funcoesTratamento !== undefined)
    ).length;
    return count * PESO_ESSENCIAL;
  }
  if (seccaoId === "tecnica-aplicacao") {
    const count = modelo.objetivosClinicosAlvo.filter(
      (g) => g.prioridade === "essencial" && g.correspondencia.idsAplicacao !== undefined
    ).length;
    return count * PESO_ESSENCIAL;
  }
  return 0;
}

function paraEstadoRevisao(classificacao: ClassificacaoAvaliacao): EstadoRevisao {
  if (classificacao === "essencial" || classificacao === "adequado") return "correto";
  if (classificacao === "redundante" || classificacao === "inadequado") return "incorreto";
  return null;
}

function construirMapaEstado(
  availableIds: readonly string[],
  selectedIds: readonly string[],
  idealIds: readonly string[],
  selectedStatuses: Map<string, EstadoRevisao>
) {
  return Object.fromEntries(
    availableIds.map((id) => {
      const explicitStatus = selectedStatuses.get(id) ?? null;
      if (explicitStatus) return [id, explicitStatus];
      if (!selectedIds.includes(id) && idealIds.includes(id)) return [id, "omitido"];
      return [id, null];
    })
  ) as Record<string, EstadoRevisao>;
}

function construirRecomendacoesAprendizagem(seccoes: SeccaoAvaliacao[]): RecomendacaoAprendizagem[] {
  const frequencies = new Map<string, { count: number; reasons: string[] }>();

  for (const seccao of seccoes) {
    for (const item of seccao.itens) {
      if (item.classificacao === "essencial" || item.classificacao === "adequado") continue;
      for (const idTema of item.idsTemas) {
        const normalizedIdTema = normalizarIdTema(idTema);
        const current = frequencies.get(normalizedIdTema) ?? { count: 0, reasons: [] };
        current.count += 1;
        current.reasons.push(item.explicacao);
        frequencies.set(normalizedIdTema, current);
      }
    }
  }

  return Array.from(frequencies.entries())
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 4)
    .map(([idTema, value]) => ({
      idTema,
      titulo: obterTituloTema(idTema),
      motivo:
        value.reasons[0] ??
        `Vale a pena rever ${obterTituloTema(idTema).toLowerCase()} para ganhar consistência.`,
      prioridade: value.count >= 2 ? "alta" : "media",
    }));
}

function resumirPorClassificacao(
  seccoes: SeccaoAvaliacao[],
  classificacao: ClassificacaoAvaliacao
) {
  return seccoes
    .flatMap((seccao) => seccao.itens)
    .filter((item) => item.classificacao === classificacao)
    .map((item) => `${item.rotulo}: ${item.explicacao}`)
    .slice(0, 5);
}

function construirDiferencasPlanoRecomendado(modelo: ModeloCaso, tentativa: EntradaTentativa) {
  const selectedLabels = new Set(tentativa.idsTratamento.map((item) => obterRotuloTratamento(item)));
  const applicationLabels = new Set(
    tentativa.idsAplicacao.map((item) => obterRotuloAplicacao(modelo, item))
  );

  const diferencas = [
    ...modelo.planoRecomendado.minimo,
    ...modelo.planoRecomendado.otimizado,
  ]
    .filter((label, index, arr) => arr.indexOf(label) === index)
    .filter((label) => !selectedLabels.has(label) && !applicationLabels.has(label));

  return {
    minimo: modelo.planoRecomendado.minimo,
    otimizado: modelo.planoRecomendado.otimizado,
    diferencas,
  };
}

function construirLeitura(modelo: ModeloCaso) {
  const { estadoFerida } = modelo;
  const infectionLabel: Record<typeof estadoFerida.infeccao, string> = {
    "contaminacao": "contaminação (sem sinais clínicos)",
    "colonizacao": "colonização (sem resposta do hospedeiro)",
    "infecao-local-encoberta": "infeção local encoberta — sinais subtis",
    "infecao-local-evidente": "infeção local evidente — sinais clássicos",
    "infecao-em-propagacao": "infeção em propagação — escalamento urgente",
    "infecao-sistemica": "infeção sistémica — emergência clínica",
  };
  return `Ferida com exsudado ${estadoFerida.exsudado}, tecido ${estadoFerida.tecido.replace(/-/g, " ")}, infeção: ${infectionLabel[estadoFerida.infeccao]} e pele peri-ferida ${estadoFerida.perilesional}.`;
}

function percentagemSeccao(seccao: SeccaoAvaliacao) {
  if (seccao.pontuacaoMaxima <= 0) return 0;
  return Math.round((seccao.pontuacao / seccao.pontuacaoMaxima) * 100);
}

export function avaliarTentativaCaso(
  modelo: ModeloCaso,
  tentativa: EntradaTentativa
): AvaliacaoCaso {
  const seccoes = [
    finalizarPontuacaoSeccao(
      construirSeccaoObservacao(modelo, tentativa),
      obterTetoBrutoEssencial(modelo, "observacao")
    ),
    // Identificação visual: teto fixo = 3 categorias × peso essencial (3 × 12 = 36)
    finalizarPontuacaoSeccao(
      construirSeccaoIdentificacaoVisual(modelo, tentativa),
      3 * 12
    ),
    finalizarPontuacaoSeccao(
      construirSeccaoAvaliacao(modelo, tentativa),
      obterTetoBrutoEssencial(modelo, "avaliacao")
    ),
    finalizarPontuacaoSeccao(
      construirSeccaoTratamento(modelo, tentativa),
      obterTetoBrutoEssencial(modelo, "plano-terapeutico")
    ),
    finalizarPontuacaoSeccao(
      construirSeccaoAplicacao(modelo, tentativa),
      obterTetoBrutoEssencial(modelo, "tecnica-aplicacao")
    ),
  ];

  const rawTotalScore = Math.round(seccoes.reduce((acc, seccao) => acc + seccao.pontuacao, 0));

  const justificacoesErradas = seccoes
    .flatMap((s) => s.itens)
    .filter((item) => item.justificacaoCorreta === false).length;
  const penalizacaoJustificacao = Math.min(30, justificacoesErradas * 10);
  const totalScore = Math.max(0, rawTotalScore - penalizacaoJustificacao);

  const essenciais = resumirPorClassificacao(seccoes, "essencial");
  const corretos = resumirPorClassificacao(seccoes, "adequado");
  const redundantes = resumirPorClassificacao(seccoes, "redundante");
  const inadequados = resumirPorClassificacao(seccoes, "inadequado");
  const seccaoMaisFraca = [...seccoes].sort(
    (a, b) => percentagemSeccao(a) - percentagemSeccao(b)
  )[0];
  const temaMaisFraco = seccaoMaisFraca.itens
    .flatMap((item) => item.idsTemas)
    .map(normalizarIdTema)
    .find((idTema) => obterTema(idTema));
  const recomendacoesAprendizagem = construirRecomendacoesAprendizagem(seccoes);

  return {
    pontuacao: Math.max(0, Math.min(100, totalScore)),
    penalizacaoJustificacao,
    justificacoesErradas,
    seccoes,
    resumoRaciocinio: {
      leitura: construirLeitura(modelo),
      essenciais,
      corretos,
      redundantes,
      inadequados,
      proximoPasso: temaMaisFraco
        ? `Reforça o tema "${obterTema(temaMaisFraco)?.titulo}" para corrigires o domínio mais frágil desta tentativa.`
        : "Mantém um plano focado no problema dominante e reavalia a resposta clínica.",
    },
    planoRecomendado: construirDiferencasPlanoRecomendado(modelo, tentativa),
    recomendacoesAprendizagem,
  };
}

export function obterTentativaIdeal(modelo: ModeloCaso): EntradaTentativa {
  const idealTreatmentIds = obterMelhorSelecaoSelecoes(
    modelo.tratamentosDisponiveis,
    "idsTratamento",
    construirSeccaoTratamento,
    modelo
  );

  const idealJustificationAnswers: RespostaJustificacao[] = gerarTodasPerguntasJustificacao(
    idealTreatmentIds,
    modelo
  ).map((q) => ({
    idTratamento: q.idTratamento,
    idOpcaoSelecionada: q.idOpcaoCorreta,
  }));

  const idealTissuePins: MarcadorTecido[] = (modelo.zonasTecido ?? []).map((zone, i) => ({
    id: `ideal-pin-${i}`,
    tipoTecido: zone.tipoTecido,
    x: zone.retangulo.x + zone.retangulo.w / 2,
    y: zone.retangulo.y + zone.retangulo.h / 2,
  }));

  return {
    idsObservacao: obterMelhorSelecaoSelecoes(
      modelo.definicoesObservacao.map((item) => item.id),
      "idsObservacao",
      construirSeccaoObservacao,
      modelo
    ),
    submissaoVisual: {
      tecidos: [...modelo.objetivosVisuais.tecidos],
      exsudado: [...modelo.objetivosVisuais.exsudado],
      bordos: [...modelo.objetivosVisuais.bordos],
    },
    idsDialogo: obterMelhorSelecaoSelecoes(
      modelo.promptsDialogo.map((item) => item.id),
      "idsDialogo",
      construirSeccaoAvaliacao,
      modelo
    ),
    idsTratamento: idealTreatmentIds,
    idsAplicacao: obterMelhorSelecaoSelecoes(
      modelo.opcoesAplicacao,
      "idsAplicacao",
      construirSeccaoAplicacao,
      modelo
    ),
    respostasJustificacao: idealJustificationAnswers,
    marcadoresTecido: idealTissuePins,
  };
}

export function construirRevisaoTentativa(
  modelo: ModeloCaso,
  tentativa: EntradaTentativa
): RevisaoTentativa {
  const tentativaIdeal = obterTentativaIdeal(modelo);
  const avaliacao = avaliarTentativaCaso(modelo, tentativa);
  const selectedStatuses = new Map<string, EstadoRevisao>();

  for (const seccao of avaliacao.seccoes) {
    for (const item of seccao.itens) {
      if (!item.idOrigem) continue;
      const status = paraEstadoRevisao(item.classificacao);
      if (status) {
        selectedStatuses.set(item.idOrigem, status);
      }
    }
  }

  return {
    tentativaIdeal,
    estadoObservacao: construirMapaEstado(
      modelo.definicoesObservacao.map((item) => item.id),
      tentativa.idsObservacao,
      tentativaIdeal.idsObservacao,
      selectedStatuses
    ),
    estadoDialogo: construirMapaEstado(
      modelo.promptsDialogo.map((item) => item.id),
      tentativa.idsDialogo,
      tentativaIdeal.idsDialogo,
      selectedStatuses
    ),
    estadoTratamento: construirMapaEstado(
      modelo.tratamentosDisponiveis,
      tentativa.idsTratamento,
      tentativaIdeal.idsTratamento,
      selectedStatuses
    ),
    estadoAplicacao: construirMapaEstado(
      modelo.opcoesAplicacao,
      tentativa.idsAplicacao,
      tentativaIdeal.idsAplicacao,
      selectedStatuses
    ),
  };
}

// ─── Re-exports com nomes antigos para compatibilidade ───────────────────────
/** @deprecated Use avaliarTentativaCaso */
export const evaluateCaseAttempt = avaliarTentativaCaso;
/** @deprecated Use obterTentativaIdeal */
export const getIdealAttempt = obterTentativaIdeal;
/** @deprecated Use construirRevisaoTentativa */
export const buildAttemptReview = construirRevisaoTentativa;
