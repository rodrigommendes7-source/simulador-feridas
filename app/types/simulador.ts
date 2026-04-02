export type PerguntaId =
  | "dor"
  | "duracao"
  | "posicao"
  | "pensos"
  | "febre"
  | "mobilidade";

export type TratamentoId = string;

export type AplicacaoId =
  | "apos_limpeza"
  | "direto_seco"
  | "sem_desbridamento"
  | "com_protecao_perilesional"
  | "compressao_forte";

export type AvaliacaoSecao = {
  nome: string;
  pontuacao: number;
  maximo: number;
  acertou: string[];
  errou: string[];
  faltou: string[];
  excesso: string[];
  justificacaoPerda: string[];
};

export type FeedbackLink = {
  material: string;
  correto?: string;
  titulo: string;
  url: string;
  explicacao: string;
};

export type HistoricoResolucao = {
  id: string;
  casoId: string;
  casoTitulo: string;
  dificuldadeCaso?: string;
  pontuacao: number;
  data: string;
  observacoes: string[];
  perguntas: string[];
  tratamentos: string[];
  aplicacoes: string[];
  feedback: string;
  avaliacaoDetalhada: AvaliacaoSecao[];
  linksFeedback: FeedbackLink[];
  recomendacoesAprendizagem?: string[];
};

export const STORAGE_KEY = "historico_resolucoes_feridas";
