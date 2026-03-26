import {
  type AvaliacaoSecao,
  type FeedbackLink,
  type HistoricoResolucao,
  STORAGE_KEY,
} from "../types/simulador";

export function normalizarSecoesAvaliacao(
  secoes: AvaliacaoSecao[]
): AvaliacaoSecao[] {
  return secoes.map((secao) => ({
    ...secao,
    pontuacao: Math.max(0, Math.min(secao.maximo, secao.pontuacao)),
  }));
}

export function calcularPontuacao(secoes: AvaliacaoSecao[]): number {
  const total = secoes.reduce((acc, secao) => acc + secao.pontuacao, 0);
  const totalMaximo = secoes.reduce((acc, secao) => acc + secao.maximo, 0);

  if (totalMaximo <= 0) return 0;

  const percentual = (total / totalMaximo) * 100;
  return Math.round(Math.max(0, Math.min(100, percentual)));
}

export function guardarHistorico(resolucao: HistoricoResolucao) {
  if (typeof window === "undefined") return;

  const historicoGuardado = localStorage.getItem(STORAGE_KEY);
  const historicoAtual: HistoricoResolucao[] = historicoGuardado
    ? JSON.parse(historicoGuardado)
    : [];

  historicoAtual.unshift(resolucao);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(historicoAtual));
}

export function criarHistoricoId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}`;
}

function garantirArray<T>(valor: unknown): T[] {
  return Array.isArray(valor) ? (valor as T[]) : [];
}

function normalizarSecaoHistorico(valor: unknown): AvaliacaoSecao[] {
  const secoes = garantirArray<Partial<AvaliacaoSecao>>(valor);

  return secoes.map((secao) => ({
    nome: typeof secao.nome === "string" ? secao.nome : "Secção",
    pontuacao:
      typeof secao.pontuacao === "number" ? secao.pontuacao : Number(secao.pontuacao) || 0,
    maximo: typeof secao.maximo === "number" ? secao.maximo : Number(secao.maximo) || 0,
    acertou: garantirArray<string>(secao.acertou),
    errou: garantirArray<string>(secao.errou),
    faltou: garantirArray<string>(secao.faltou),
    excesso: garantirArray<string>(secao.excesso),
    justificacaoPerda: garantirArray<string>(secao.justificacaoPerda),
  }));
}

export function carregarHistoricoSeguro(): HistoricoResolucao[] {
  if (typeof window === "undefined") return [];

  const historicoGuardado = localStorage.getItem(STORAGE_KEY);
  const historicoBruto = historicoGuardado ? JSON.parse(historicoGuardado) : [];

  if (!Array.isArray(historicoBruto)) return [];

  return historicoBruto.map((item, index) => ({
    id:
      typeof item?.id === "string" && item.id.trim()
        ? item.id
        : `historico-${index}-${Date.now()}`,
    casoId: typeof item?.casoId === "string" ? item.casoId : "caso-desconhecido",
    casoTitulo:
      typeof item?.casoTitulo === "string" ? item.casoTitulo : "Caso sem título",
    pontuacao:
      typeof item?.pontuacao === "number" ? item.pontuacao : Number(item?.pontuacao) || 0,
    data: typeof item?.data === "string" ? item.data : new Date().toISOString(),
    observacoes: garantirArray<string>(item?.observacoes),
    perguntas: garantirArray<string>(item?.perguntas),
    tratamentos: garantirArray<string>(item?.tratamentos),
    aplicacoes: garantirArray<string>(item?.aplicacoes),
    feedback:
      typeof item?.feedback === "string"
        ? item.feedback
        : typeof item?.feedbackResumo === "string"
          ? item.feedbackResumo
          : "",
    avaliacaoDetalhada: normalizarSecaoHistorico(
      item?.avaliacaoDetalhada ?? item?.secoes
    ),
    linksFeedback: garantirArray<FeedbackLink>(item?.linksFeedback ?? item?.artigos),
  }));
}
