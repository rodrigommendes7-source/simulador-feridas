import type { AplicacaoId, PerguntaId, TratamentoId } from "./simulador";

export type ItemMaterialConfig = {
  id: TratamentoId;
  nome: string;
};

export type GrupoMaterialConfig = {
  categoria: string;
  itens: ItemMaterialConfig[];
};

export type RecomendacaoErroConfig = {
  correto: string;
  titulo: string;
  url: string;
  explicacao: string;
};

export type CasoConfig = {
  respostasDialogo: Record<PerguntaId, string>;
  textoPerguntas: Record<PerguntaId, string>;
  nomesPerguntas: Record<PerguntaId, string>;
  nomesTratamentos: Record<TratamentoId, string>;
  nomesAplicacoes: Record<AplicacaoId, string>;
  materiaisPorCategoria: GrupoMaterialConfig[];
  linksEvidencia: Partial<Record<TratamentoId, { titulo: string; url: string }>>;
  recomendacoesPorErro: Partial<Record<TratamentoId, RecomendacaoErroConfig>>;
};