"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Aba = "observacao" | "dialogo" | "tratamento" | "resultado";

type PerguntaId =
  | "dor"
  | "duracao"
  | "posicao"
  | "pensos"
  | "febre"
  | "mobilidade";

type TratamentoId =
  | "colagenase"
  | "hidrogel"
  | "prata"
  | "iodo"
  | "hidrofibra"
  | "carboximetilcelulose"
  | "nitrato_prata"
  | "emolientes_ags"
  | "mel"
  | "betametasona"
  | "alcool"
  | "gaze_seca";

type AplicacaoId =
  | "apos_limpeza"
  | "direto_seco"
  | "sem_desbridamento"
  | "com_protecao_perilesional"
  | "compressao_forte";

type AvaliacaoSecao = {
  nome: string;
  pontuacao: number;
  maximo: number;
  acertou: string[];
  errou: string[];
  faltou: string[];
  excesso: string[];
  justificacaoPerda: string[];
};

type FeedbackLink = {
  material: string;
  correto?: string;
  titulo: string;
  url: string;
  explicacao: string;
};

type HistoricoResolucao = {
  id: string;
  casoId: string;
  casoTitulo: string;
  pontuacao: number;
  data: string;
  observacoes: string[];
  perguntas: string[];
  tratamentos: string[];
  aplicacoes: string[];
  feedbackResumo: string;
  secoes: AvaliacaoSecao[];
  artigos: FeedbackLink[];
};

const STORAGE_KEY = "historico_resolucoes_feridas";

const respostasDialogo: Record<PerguntaId, string> = {
  dor: "Sim, dói bastante, especialmente ao toque, diria 7 em 10.",
  duracao: "Desde a cirurgia que nunca fechou bem.",
  posicao: "Ando pouco, mas fico muito tempo com a perna para baixo.",
  pensos: "Têm feito penso todos os dias, mas tenho notado mais líquido.",
  febre: "Tive febre ligeira ontem.",
  mobilidade: "Consigo andar, mas com dificuldade.",
};

const nomesPerguntas: Record<PerguntaId, string> = {
  dor: "dor",
  duracao: "duração",
  posicao: "posição do membro / tempo em declive",
  pensos: "pensos prévios",
  febre: "febre",
  mobilidade: "mobilidade",
};

const textoPerguntas: Record<PerguntaId, string> = {
  dor: "Tem dor? Se sim, quanto daria numa escala de 0 a 10?",
  duracao: "Há quanto tempo nota que a ferida não está a fechar bem?",
  posicao: "Costuma manter a perna muito tempo para baixo ou elevada?",
  pensos: "Sabe dizer como têm sido feitos os pensos?",
  febre: "Teve febre, arrepios ou sensação de mal-estar?",
  mobilidade: "Consegue andar bem ou tem dificuldade na mobilização?",
};

const nomesTratamentos: Record<TratamentoId, string> = {
  colagenase: "Colagenase",
  hidrogel: "Hidrogel",
  prata: "Prata",
  iodo: "Iodo (povidona-iodo)",
  hidrofibra: "Hidrofibra",
  carboximetilcelulose: "Carboximetilcelulose",
  nitrato_prata: "Nitrato de prata",
  emolientes_ags: "Emolientes (ácidos gordos essenciais)",
  mel: "Mel",
  betametasona: "Betametasona",
  alcool: "Aplicação de álcool",
  gaze_seca: "Gaze seca",
};

const nomesAplicacoes: Record<AplicacaoId, string> = {
  apos_limpeza: "Aplicar cobertura após limpeza adequada",
  direto_seco: "Aplicar material diretamente em seco",
  sem_desbridamento:
    "Não usar desbridamento enzimático como primeira prioridade",
  com_protecao_perilesional: "Proteger pele perilesional",
  compressao_forte: "Fazer compressão forte sobre a lesão",
};

const materiaisPorCategoria = [
  {
    categoria: "Desbridamento",
    itens: [
      { id: "colagenase" as TratamentoId, nome: "Colagenase" },
      { id: "hidrogel" as TratamentoId, nome: "Hidrogel" },
    ],
  },
  {
    categoria: "Antimicrobianos",
    itens: [
      { id: "prata" as TratamentoId, nome: "Prata" },
      { id: "iodo" as TratamentoId, nome: "Iodo (povidona-iodo)" },
    ],
  },
  {
    categoria: "Gestão de exsudado",
    itens: [
      { id: "hidrofibra" as TratamentoId, nome: "Hidrofibra" },
      {
        id: "carboximetilcelulose" as TratamentoId,
        nome: "Carboximetilcelulose",
      },
    ],
  },
  {
    categoria: "Hidratação",
    itens: [{ id: "hidrogel" as TratamentoId, nome: "Hidrogel" }],
  },
  {
    categoria: "Hipergranulação",
    itens: [
      { id: "nitrato_prata" as TratamentoId, nome: "Nitrato de prata" },
    ],
  },
  {
    categoria: "Pele peri-ferida",
    itens: [
      {
        id: "emolientes_ags" as TratamentoId,
        nome: "Emolientes (ácidos gordos essenciais)",
      },
    ],
  },
  {
    categoria: "Cicatrização / bioativos",
    itens: [{ id: "mel" as TratamentoId, nome: "Mel" }],
  },
  {
    categoria: "Anti-inflamatório",
    itens: [{ id: "betametasona" as TratamentoId, nome: "Betametasona" }],
  },
  {
    categoria: "Outros materiais / abordagens",
    itens: [
      { id: "alcool" as TratamentoId, nome: "Aplicação de álcool" },
      { id: "gaze_seca" as TratamentoId, nome: "Gaze seca" },
    ],
  },
];

const linksEvidencia: Partial<
  Record<TratamentoId, { titulo: string; url: string }>
> = {
  colagenase: {
    titulo: "Collagenase for enzymatic debridement: systematic review",
    url: "https://pubmed.ncbi.nlm.nih.gov/19918148/",
  },
  hidrogel: {
    titulo: "Hydrogels and wound healing: review",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10815795/",
  },
  prata: {
    titulo: "Silver-releasing dressings: systematic review",
    url: "https://pubmed.ncbi.nlm.nih.gov/18705778/",
  },
  iodo: {
    titulo: "Povidone iodine in wound healing: review",
    url: "https://pubmed.ncbi.nlm.nih.gov/28648795/",
  },
  hidrofibra: {
    titulo: "Hydrofiber dressing applications: review",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC2817785/",
  },
  carboximetilcelulose: {
    titulo: "Hydrofiber/CMC dressings in exudate management",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7059819/",
  },
  mel: {
    titulo: "Honey in modern wound care: systematic review",
    url: "https://pubmed.ncbi.nlm.nih.gov/23896128/",
  },
  emolientes_ags: {
    titulo: "Essential fatty acids and skin breakdown prevention",
    url: "https://pubmed.ncbi.nlm.nih.gov/9233238/",
  },
  betametasona: {
    titulo: "Topical corticosteroids for hypergranulation: case review",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9498163/",
  },
};

const recomendacoesPorErro: Partial<
  Record<
    TratamentoId,
    {
      correto: string;
      titulo: string;
      url: string;
      explicacao: string;
    }
  >
> = {
  alcool: {
    correto: "Hidrofibra ou carboximetilcelulose, com antimicrobiano se indicado",
    titulo: "Hydrofiber dressing applications: review",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC2817785/",
    explicacao:
      "Num caso com deiscência e exsudado, o álcool é lesivo para o tecido; a prioridade é controlo do exsudado e proteção do leito.",
  },
  gaze_seca: {
    correto: "Hidrofibra ou carboximetilcelulose",
    titulo: "Hydrofiber/CMC dressings in exudate management",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7059819/",
    explicacao:
      "A gaze seca pode aderir ao leito e traumatizar o tecido; materiais absorventes são mais ajustados neste contexto.",
  },
  hidrogel: {
    correto: "Hidrofibra ou carboximetilcelulose",
    titulo: "Hydrofiber/CMC dressings in exudate management",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7059819/",
    explicacao:
      "Com exsudado moderado a abundante, o hidrogel não é a prioridade; o controlo do exsudado é mais importante.",
  },
  betametasona: {
    correto: "Prata ou iodo, e considerar colagenase se houver tecido desvitalizado",
    titulo: "Silver-releasing dressings: systematic review",
    url: "https://pubmed.ncbi.nlm.nih.gov/18705778/",
    explicacao:
      "Num quadro com suspeita de infeção local e deiscência, betametasona não é prioridade terapêutica.",
  },
};

export default function CasoDoisPage() {
  const [abaAtiva, setAbaAtiva] = useState<Aba>("observacao");
  const [iniciado, setIniciado] = useState(false);
  const [mostrarDetalhe, setMostrarDetalhe] = useState(false);

  const [observacaoImagemVista, setObservacaoImagemVista] = useState(false);
  const [observacaoDimensoesVista, setObservacaoDimensoesVista] = useState(false);
  const [observacaoExsudadoVista, setObservacaoExsudadoVista] = useState(false);
  const [observacaoCheiroVista, setObservacaoCheiroVista] = useState(false);
  const [observacaoTecidoVista, setObservacaoTecidoVista] = useState(false);
  const [observacaoPerilesionalVista, setObservacaoPerilesionalVista] = useState(false);

  const [perguntasFeitas, setPerguntasFeitas] = useState<PerguntaId[]>([]);
  const [perguntaAtual, setPerguntaAtual] = useState<PerguntaId | null>(null);

  const [tratamentosSelecionados, setTratamentosSelecionados] = useState<
    TratamentoId[]
  >([]);
  const [aplicacoesSelecionadas, setAplicacoesSelecionadas] = useState<
    AplicacaoId[]
  >([]);

  function toggleTratamento(id: TratamentoId) {
    setTratamentosSelecionados((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  function toggleAplicacao(id: AplicacaoId) {
    setAplicacoesSelecionadas((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  function fazerPergunta(id: PerguntaId) {
    if (!perguntasFeitas.includes(id)) {
      setPerguntasFeitas((prev) => [...prev, id]);
    }
    setPerguntaAtual(id);
  }

  const observacoesRealizadas = useMemo(() => {
    return [
      observacaoImagemVista && "imagem",
      observacaoDimensoesVista && "dimensões",
      observacaoExsudadoVista && "exsudado",
      observacaoCheiroVista && "cheiro",
      observacaoTecidoVista && "tecidos",
      observacaoPerilesionalVista && "pele perilesional",
    ].filter(Boolean) as string[];
  }, [
    observacaoImagemVista,
    observacaoDimensoesVista,
    observacaoExsudadoVista,
    observacaoCheiroVista,
    observacaoTecidoVista,
    observacaoPerilesionalVista,
  ]);

  const avaliacaoDetalhada = useMemo<AvaliacaoSecao[]>(() => {
    const observacao: AvaliacaoSecao = {
      nome: "Observação",
      pontuacao: 0,
      maximo: 40,
      acertou: [],
      errou: [],
      faltou: [],
      excesso: [],
      justificacaoPerda: [],
    };

    if (observacaoImagemVista) {
      observacao.pontuacao += 6;
      observacao.acertou.push("Visualizaste a imagem da ferida.");
    } else {
      observacao.faltou.push("Faltou observar a imagem da ferida.");
      observacao.justificacaoPerda.push(
        "Perdeste pontuação por não observares a imagem da ferida."
      );
    }

    if (observacaoDimensoesVista) {
      observacao.pontuacao += 7;
      observacao.acertou.push("Consultaste as dimensões e extensão da deiscência.");
    } else {
      observacao.faltou.push("Faltou avaliar as dimensões da ferida.");
      observacao.justificacaoPerda.push(
        "Perdeste pontuação por não avaliares as dimensões da ferida."
      );
    }

    if (observacaoExsudadoVista) {
      observacao.pontuacao += 8;
      observacao.acertou.push("Valorizaste o exsudado, essencial neste caso.");
    } else {
      observacao.faltou.push("Faltou avaliar o exsudado.");
      observacao.justificacaoPerda.push(
        "Perdeste pontuação por não avaliares o exsudado."
      );
    }

    if (observacaoCheiroVista) {
      observacao.pontuacao += 5;
      observacao.acertou.push("Observaste o odor da ferida.");
    } else {
      observacao.faltou.push("Faltou observar o cheiro.");
      observacao.justificacaoPerda.push(
        "Perdeste pontuação por não observares o cheiro."
      );
    }

    if (observacaoTecidoVista) {
      observacao.pontuacao += 8;
      observacao.acertou.push("Identificaste tecido fibrinoso/desvitalizado.");
    } else {
      observacao.faltou.push("Faltou avaliar os tecidos presentes.");
      observacao.justificacaoPerda.push(
        "Perdeste pontuação por não avaliares os tecidos presentes."
      );
    }

    if (observacaoPerilesionalVista) {
      observacao.pontuacao += 6;
      observacao.acertou.push("Observaste a pele peri-ferida.");
    } else {
      observacao.faltou.push("Faltou observar a pele peri-ferida.");
      observacao.justificacaoPerda.push(
        "Perdeste pontuação por não observares a pele peri-ferida."
      );
    }

    const dialogo: AvaliacaoSecao = {
      nome: "Diálogo / colheita de dados",
      pontuacao: 0,
      maximo: 25,
      acertou: [],
      errou: [],
      faltou: [],
      excesso: [],
      justificacaoPerda: [],
    };

    if (perguntasFeitas.includes("dor")) {
      dialogo.pontuacao += 5;
      dialogo.acertou.push("Avaliaste a dor.");
    } else {
      dialogo.faltou.push("Faltou avaliar a dor.");
      dialogo.justificacaoPerda.push(
        "Perdeste pontuação por não avaliares a dor."
      );
    }

    if (perguntasFeitas.includes("febre")) {
      dialogo.pontuacao += 7;
      dialogo.acertou.push("Exploraste febre, relevante para suspeita de infeção.");
    } else {
      dialogo.faltou.push("Faltou explorar febre ou sinais sistémicos.");
      dialogo.justificacaoPerda.push(
        "Perdeste pontuação por não explorares febre ou sinais sistémicos."
      );
    }

    if (perguntasFeitas.includes("posicao")) {
      dialogo.pontuacao += 5;
      dialogo.acertou.push("Perguntaste sobre posição/declive do membro.");
    } else {
      dialogo.faltou.push("Faltou perguntar sobre posição da perna.");
      dialogo.justificacaoPerda.push(
        "Perdeste pontuação por não explorares a posição da perna."
      );
    }

    if (perguntasFeitas.includes("duracao")) {
      dialogo.pontuacao += 4;
      dialogo.acertou.push("Exploraste a evolução temporal da ferida.");
    } else {
      dialogo.faltou.push("Faltou perguntar há quanto tempo a ferida evolui mal.");
      dialogo.justificacaoPerda.push(
        "Perdeste pontuação por não explorares a evolução temporal da ferida."
      );
    }

    if (perguntasFeitas.includes("pensos")) {
      dialogo.pontuacao += 2;
      dialogo.acertou.push("Perguntaste pelos pensos prévios.");
    } else {
      dialogo.justificacaoPerda.push(
        "Perdeste pontuação por não explorares os pensos prévios."
      );
    }

    if (perguntasFeitas.includes("mobilidade")) {
      dialogo.pontuacao += 2;
      dialogo.acertou.push("Exploraste a mobilidade.");
    } else {
      dialogo.justificacaoPerda.push(
        "Perdeste pontuação por não explorares a mobilidade."
      );
    }

    const tratamento: AvaliacaoSecao = {
      nome: "Escolha do tratamento",
      pontuacao: 0,
      maximo: 22,
      acertou: [],
      errou: [],
      faltou: [],
      excesso: [],
      justificacaoPerda: [],
    };

    if (
      tratamentosSelecionados.includes("prata") ||
      tratamentosSelecionados.includes("iodo")
    ) {
      tratamento.pontuacao += 8;
      tratamento.acertou.push(
        "Consideraste antimicrobiano perante suspeita de infeção local."
      );
    } else {
      tratamento.faltou.push(
        "Faltou considerar um antimicrobiano, como prata ou iodo."
      );
      tratamento.justificacaoPerda.push(
        "Perdeste pontuação por não considerares cobertura antimicrobiana."
      );
    }

    if (
  tratamentosSelecionados.includes("hidrofibra") ||
  tratamentosSelecionados.includes("carboximetilcelulose")
) {
  tratamento.pontuacao += 8;
  tratamento.acertou.push(
    "Selecionaste um material adequado para gestão do exsudado."
  );
} else {
  tratamento.faltou.push(
    "Faltou selecionar material orientado ao controlo do exsudado."
  );
  tratamento.justificacaoPerda.push(
    "Perdeste pontuação por não controlares adequadamente o exsudado."
  );
}

if (tratamentosSelecionados.includes("hidrofibra")) {
  tratamento.acertou.push(
    "A hidrofibra é adequada para controlo do exsudado neste caso."
  );
}

if (tratamentosSelecionados.includes("carboximetilcelulose")) {
  tratamento.acertou.push(
    "A carboximetilcelulose é adequada para controlo do exsudado neste caso."
  );
}

    if (tratamentosSelecionados.includes("colagenase")) {
      tratamento.pontuacao += 6;
      tratamento.acertou.push(
        "Valorizaste o desbridamento do tecido desvitalizado."
      );
    } else {
      tratamento.faltou.push(
        "Faltou considerar colagenase perante tecido desvitalizado."
      );
      tratamento.justificacaoPerda.push(
        "Perdeste pontuação por não considerares desbridamento enzimático."
      );
    }

    if (tratamentosSelecionados.includes("hidrogel")) {
      tratamento.pontuacao -= 4;
      tratamento.errou.push(
        "O hidrogel não é prioritário num caso com exsudado moderado a abundante."
      );
      tratamento.justificacaoPerda.push(
        "Perdeste pontuação por privilegiares hidrogel num caso em que o exsudado domina."
      );
    }

    if (tratamentosSelecionados.includes("betametasona")) {
      tratamento.pontuacao -= 6;
      tratamento.errou.push(
        "Betametasona não é prioritária neste contexto de deiscência e suspeita de infeção."
      );
      tratamento.justificacaoPerda.push(
        "Perdeste pontuação por selecionares betametasona fora da prioridade clínica."
      );
    }

    if (tratamentosSelecionados.includes("alcool")) {
      tratamento.pontuacao -= 8;
      tratamento.errou.push("A aplicação de álcool na ferida é desadequada.");
      tratamento.justificacaoPerda.push(
        "Perdeste pontuação por selecionares álcool, que é lesivo para o tecido."
      );
    }

    if (tratamentosSelecionados.includes("gaze_seca")) {
      tratamento.pontuacao -= 8;
      tratamento.errou.push(
        "A gaze seca pode aderir ao leito e traumatizar o tecido."
      );
      tratamento.justificacaoPerda.push(
        "Perdeste pontuação por selecionares gaze seca, que pode traumatizar o leito."
      );
    }

    if (tratamentosSelecionados.length >= 4) {
      tratamento.excesso.push(
        "Selecionaste materiais em excesso para o mesmo objetivo terapêutico."
      );
      tratamento.justificacaoPerda.push(
        "Perdeste pontuação por excesso de materiais e menor foco terapêutico."
      );
      tratamento.pontuacao -= 5;
    }

    if (
      tratamentosSelecionados.includes("hidrofibra") &&
      tratamentosSelecionados.includes("carboximetilcelulose")
    ) {
      tratamento.excesso.push(
        "Hidrofibra e carboximetilcelulose podem sobrepor função no controlo do exsudado."
      );
      tratamento.justificacaoPerda.push(
        "Perdeste pontuação por sobreposição funcional entre materiais absorventes."
      );
      tratamento.pontuacao -= 3;
    }

    const aplicacao: AvaliacaoSecao = {
      nome: "Forma de aplicação",
      pontuacao: 0,
      maximo: 10,
      acertou: [],
      errou: [],
      faltou: [],
      excesso: [],
      justificacaoPerda: [],
    };

    if (aplicacoesSelecionadas.includes("apos_limpeza")) {
      aplicacao.pontuacao += 5;
      aplicacao.acertou.push("Prevês aplicação após limpeza adequada.");
    } else {
      aplicacao.faltou.push("Faltou indicar limpeza adequada antes da cobertura.");
      aplicacao.justificacaoPerda.push(
        "Perdeste pontuação por não indicares limpeza adequada antes da cobertura."
      );
    }

    if (aplicacoesSelecionadas.includes("com_protecao_perilesional")) {
      aplicacao.pontuacao += 3;
      aplicacao.acertou.push("Consideraste proteção da pele peri-ferida.");
    } else {
      aplicacao.faltou.push("Faltou proteger a pele peri-ferida.");
      aplicacao.justificacaoPerda.push(
        "Perdeste pontuação por não considerares proteção da pele peri-ferida."
      );
    }

    if (aplicacoesSelecionadas.includes("sem_desbridamento")) {
      aplicacao.pontuacao -= 3;
      aplicacao.errou.push(
        "Assinalaste ausência de desbridamento como prioridade, o que não é o mais ajustado aqui."
      );
      aplicacao.justificacaoPerda.push(
        "Perdeste pontuação por afastares o desbridamento num caso em que pode ser relevante."
      );
    }

    if (aplicacoesSelecionadas.includes("direto_seco")) {
      aplicacao.pontuacao -= 4;
      aplicacao.errou.push(
        "Aplicação direta em seco não é adequada neste contexto."
      );
      aplicacao.justificacaoPerda.push(
        "Perdeste pontuação por escolheres aplicação direta em seco."
      );
    }

    if (aplicacoesSelecionadas.includes("compressao_forte")) {
      aplicacao.pontuacao -= 5;
      aplicacao.errou.push(
        "Compressão forte sobre a lesão não é adequada."
      );
      aplicacao.justificacaoPerda.push(
        "Perdeste pontuação por escolheres compressão forte sobre a lesão."
      );
    }

    if (aplicacoesSelecionadas.length >= 4) {
      aplicacao.excesso.push(
        "Selecionaste demasiadas formas de aplicação em simultâneo."
      );
      aplicacao.justificacaoPerda.push(
        "Perdeste pontuação por excesso de opções de aplicação."
      );
      aplicacao.pontuacao -= 2;
    }

    const aplicacoesErradasSelecionadas =
      aplicacoesSelecionadas.includes("sem_desbridamento") ||
      aplicacoesSelecionadas.includes("direto_seco") ||
      aplicacoesSelecionadas.includes("compressao_forte");

    if (
      aplicacoesSelecionadas.includes("apos_limpeza") &&
      aplicacoesSelecionadas.includes("com_protecao_perilesional") &&
      !aplicacoesErradasSelecionadas
    ) {
      aplicacao.pontuacao += 2;
      aplicacao.acertou.push(
        "Mantiveste uma aplicação global coerente, sem opções desadequadas."
      );
    } else if (aplicacao.pontuacao < aplicacao.maximo) {
      aplicacao.justificacaoPerda.push(
        "Não atingiste a pontuação máxima porque faltou uma aplicação totalmente coerente e sem opções desadequadas."
      );
    }

    const secoes = [observacao, dialogo, tratamento, aplicacao].map((secao) => ({
      ...secao,
      pontuacao: Math.max(0, Math.min(secao.maximo, secao.pontuacao)),
    }));

    return secoes;
  }, [
    observacaoImagemVista,
    observacaoDimensoesVista,
    observacaoExsudadoVista,
    observacaoCheiroVista,
    observacaoTecidoVista,
    observacaoPerilesionalVista,
    perguntasFeitas,
    tratamentosSelecionados,
    aplicacoesSelecionadas,
  ]);

  const pontuacao = useMemo(() => {
    const total = avaliacaoDetalhada.reduce(
      (acc, secao) => acc + secao.pontuacao,
      0
    );
    const totalMaximo = avaliacaoDetalhada.reduce(
      (acc, secao) => acc + secao.maximo,
      0
    );
    if (totalMaximo <= 0) return 0;
    const percentual = (total / totalMaximo) * 100;
    return Math.round(Math.max(0, Math.min(100, percentual)));
  }, [avaliacaoDetalhada]);

  const avaliacaoTexto = useMemo(() => {
    if (pontuacao >= 85) {
      return "Desempenho muito bom. Reconheceste bem os sinais de deiscência, exsudado e provável infeção local, com uma abordagem globalmente adequada.";
    }

    if (pontuacao >= 70) {
      return "Bom desempenho. A tua resolução foi globalmente útil, mas ainda houve aspetos importantes a afinar na escolha dos materiais ou no raciocínio terapêutico.";
    }

    if (pontuacao >= 50) {
      return "Desempenho intermédio. Identificaste parte dos problemas, mas faltaram etapas importantes para uma abordagem mais segura e dirigida ao caso.";
    }

    return "Desempenho insuficiente. Este caso exigia maior atenção à suspeita de infeção, gestão de exsudado, desbridamento e adequação da cobertura.";
  }, [pontuacao]);

  const linksMateriaisSelecionados = useMemo<FeedbackLink[]>(() => {
    const selecionados: FeedbackLink[] = tratamentosSelecionados
      .filter((item) => linksEvidencia[item])
      .map((item) => ({
        material: nomesTratamentos[item],
        titulo: linksEvidencia[item]!.titulo,
        url: linksEvidencia[item]!.url,
        explicacao: "Artigo de apoio relacionado com o material selecionado.",
      }));

    const errados: FeedbackLink[] = tratamentosSelecionados
      .filter((item) => recomendacoesPorErro[item])
      .map((item) => ({
        material: nomesTratamentos[item],
        correto: recomendacoesPorErro[item]!.correto,
        titulo: recomendacoesPorErro[item]!.titulo,
        url: recomendacoesPorErro[item]!.url,
        explicacao: recomendacoesPorErro[item]!.explicacao,
      }));

    const combinados: FeedbackLink[] = [...selecionados, ...errados];

    const unicos = combinados.filter(
      (item, index, arr) =>
        arr.findIndex(
          (x) => x.material === item.material && x.url === item.url
        ) === index
    );

    return unicos;
  }, [tratamentosSelecionados]);

  function guardarNoHistorico() {
    if (typeof window === "undefined") return;

    const novaResolucao: HistoricoResolucao = {
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}`,
      casoId: "caso-2",
      casoTitulo: "Caso 2 — Ferida cirúrgica com deiscência",
      pontuacao,
      data: new Date().toISOString(),
      observacoes: observacoesRealizadas,
      perguntas: perguntasFeitas.map((item) => nomesPerguntas[item]),
      tratamentos: tratamentosSelecionados.map((item) => nomesTratamentos[item]),
      aplicacoes: aplicacoesSelecionadas.map((item) => nomesAplicacoes[item]),
      feedbackResumo: avaliacaoTexto,
      secoes: avaliacaoDetalhada,
      artigos: linksMateriaisSelecionados,
    };

    const historicoGuardado = localStorage.getItem(STORAGE_KEY);
    const historicoAtual: HistoricoResolucao[] = historicoGuardado
      ? JSON.parse(historicoGuardado)
      : [];

    historicoAtual.unshift(novaResolucao);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(historicoAtual));
  }

  function finalizarCaso() {
    guardarNoHistorico();
    setAbaAtiva("resultado");
  }

  function resetarCaso() {
    setIniciado(false);
    setMostrarDetalhe(false);
    setAbaAtiva("observacao");
    setObservacaoImagemVista(false);
    setObservacaoDimensoesVista(false);
    setObservacaoExsudadoVista(false);
    setObservacaoCheiroVista(false);
    setObservacaoTecidoVista(false);
    setObservacaoPerilesionalVista(false);
    setPerguntasFeitas([]);
    setPerguntaAtual(null);
    setTratamentosSelecionados([]);
    setAplicacoesSelecionadas([]);
  }

  const botaoOpcao =
    "block w-full rounded-2xl border border-[#334155] bg-white px-4 py-3 text-left text-[15px] font-semibold text-[#0f172a] transition hover:bg-[#f8fafc]";
  const botaoAcao =
    "w-full rounded-2xl border border-[#334155] bg-white px-4 py-3 text-left text-[15px] font-semibold text-[#0f172a] transition hover:bg-[#f8fafc]";

  return (
    <main className="h-screen overflow-hidden bg-[#0b1220] p-3 text-white">
      <div className="mx-auto flex h-full max-w-[1500px] gap-3">
        <aside className="flex h-full w-[250px] shrink-0 flex-col rounded-[30px] border border-[#334155] bg-[#111827] p-4 shadow-2xl">
          <div className="mb-4 rounded-[24px] border border-[#334155] bg-[#0f172a] px-4 py-4">
            <h1 className="text-[28px] font-black leading-none text-[#f8fafc]">
              Caso 2
            </h1>
          </div>

          <div className="flex-1 rounded-[24px] border border-[#334155] bg-[#1f2937] p-4">
            <p className="mb-4 text-center text-[26px] font-black text-[#1d4ed8]">
              Ações
            </p>

            <div className="space-y-3">
              <button
                onClick={() => setAbaAtiva("observacao")}
                disabled={!iniciado}
                className={`w-full rounded-[18px] border px-4 py-3 text-left text-[19px] font-bold transition ${
                  !iniciado
                    ? "cursor-not-allowed border-[#334155] bg-[#475569] text-[#cbd5e1]"
                    : abaAtiva === "observacao"
                    ? "border-[#1d4ed8] bg-[#0f172a] text-[#1d4ed8]"
                    : "border-[#334155] bg-white text-[#0f172a] hover:bg-[#f8fafc]"
                }`}
              >
                Observar
              </button>

              <button
                onClick={() => setAbaAtiva("dialogo")}
                disabled={!iniciado}
                className={`w-full rounded-[18px] border px-4 py-3 text-left text-[19px] font-bold transition ${
                  !iniciado
                    ? "cursor-not-allowed border-[#334155] bg-[#475569] text-[#cbd5e1]"
                    : abaAtiva === "dialogo"
                    ? "border-[#1d4ed8] bg-[#0f172a] text-[#1d4ed8]"
                    : "border-[#334155] bg-white text-[#0f172a] hover:bg-[#f8fafc]"
                }`}
              >
                Diálogo
              </button>

              <button
                onClick={() => setAbaAtiva("tratamento")}
                disabled={!iniciado}
                className={`w-full rounded-[18px] border px-4 py-3 text-left text-[19px] font-bold transition ${
                  !iniciado
                    ? "cursor-not-allowed border-[#334155] bg-[#475569] text-[#cbd5e1]"
                    : abaAtiva === "tratamento"
                    ? "border-[#1d4ed8] bg-[#0f172a] text-[#1d4ed8]"
                    : "border-[#334155] bg-white text-[#0f172a] hover:bg-[#f8fafc]"
                }`}
              >
                Tratamento
              </button>
            </div>

            <div className="mt-6 rounded-[20px] border border-[#334155] bg-[#0f172a] p-3">
              <p className="text-[14px] font-bold text-[#1d4ed8]">
                Objetivo
              </p>
              <p className="mt-1 text-[13px] leading-snug text-[#cbd5e1]">
                Avaliar deiscência cirúrgica, sinais de infeção local, tecido
                desvitalizado e selecionar um tratamento adequado.
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <button
              onClick={finalizarCaso}
              disabled={!iniciado}
              className={`w-full rounded-[20px] px-4 py-4 text-[24px] font-black shadow ${
                iniciado
                  ? "bg-[#facc15] text-[#0f172a] hover:bg-[#fde047]"
                  : "cursor-not-allowed bg-[#64748b] text-[#e2e8f0]"
              }`}
            >
              Terminar
            </button>

            <Link
              href="/casos"
              className="block w-full rounded-[18px] border border-[#334155] bg-white px-4 py-3 text-center text-[16px] font-black text-[#0f172a] hover:bg-[#f8fafc]"
            >
              Voltar aos casos
            </Link>

            <Link
              href="/historico"
              className="block w-full rounded-[18px] border border-[#334155] bg-white px-4 py-3 text-center text-[16px] font-black text-[#0f172a] hover:bg-[#f8fafc]"
            >
              Histórico
            </Link>
          </div>
        </aside>

        <section className="flex h-full min-w-0 flex-1 flex-col rounded-[34px] border border-[#334155] bg-[#111827] p-4 shadow-2xl">
          {!iniciado && (
            <div className="flex h-full items-center justify-center">
              <div className="w-full max-w-3xl rounded-[30px] border border-[#334155] bg-[#0f172a] p-10 text-center shadow-2xl">
                <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#1d4ed8]">
                  Caso clínico
                </p>
                <h2 className="mt-4 text-4xl font-black text-white">
                  Caso 2 — Ferida cirúrgica com deiscência
                </h2>
                <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[#cbd5e1]">
                  Utente de 72 anos, submetido a cirurgia vascular há 10 dias,
                  com ferida na perna esquerda, na região da canela/tíbia,
                  apresentando abertura parcial da sutura, aumento de exsudado e
                  dor local.
                </p>

                <div className="mt-8 rounded-2xl border border-[#334155] bg-[#111827] p-5 text-left">
                  <p className="text-sm font-bold uppercase tracking-wide text-[#1d4ed8]">
                    Foco do caso
                  </p>
                  <p className="mt-2 text-base text-white">
                    Avaliar deiscência, infeção local, exsudado, tecido
                    desvitalizado e escolher uma abordagem terapêutica coerente.
                  </p>
                </div>

                <button
                  onClick={() => setIniciado(true)}
                  className="mt-8 rounded-2xl bg-[#facc15] px-8 py-4 text-lg font-black text-[#0f172a] hover:bg-[#fde047]"
                >
                  Iniciar caso
                </button>
              </div>
            </div>
          )}

          {iniciado && abaAtiva !== "resultado" && (
            <>
              <div className="mb-3 rounded-[24px] border border-[#334155] bg-[#0f172a] px-5 py-3">
                <p className="text-[16px] font-bold text-[#e2e8f0]">
                  Utente de 72 anos, submetido a cirurgia vascular há 10 dias,
                  com ferida na perna esquerda, região da tíbia, apresentando
                  abertura parcial da sutura. Refere dor local e aumento de
                  exsudado nos últimos dias.
                </p>
              </div>

              <div className="grid min-h-0 flex-1 grid-cols-[1.35fr_0.85fr] gap-3">
                <div className="flex min-h-0 flex-col rounded-[32px] border border-[#334155] bg-[#0f172a] p-4">
                  <div className="mb-3 text-center text-[24px] font-black text-[#1d4ed8]">
                    FOTOGRAFIA
                  </div>

                  <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-[26px] border border-[#334155] bg-black">
                    {abaAtiva === "observacao" ? (
                      observacaoImagemVista ? (
                        <img
                          src="/caso2.png"
                          alt="Ferida cirúrgica com deiscência na perna esquerda"
                          className="max-h-full max-w-full rounded-[20px] object-contain"
                        />
                      ) : (
                        <div className="px-8 text-center text-[18px] font-semibold text-[#94a3b8]">
                          Clica em{" "}
                          <button
                            type="button"
                            onClick={() => setObservacaoImagemVista(true)}
                            className="font-black text-[#1d4ed8] underline hover:text-white"
                          >
                            Ver imagem da ferida
                          </button>{" "}
                          para visualizar a fotografia.
                        </div>
                      )
                    ) : abaAtiva === "dialogo" ? (
                      <div className="w-full px-6">
                        {!perguntaAtual ? (
                          <div className="text-center text-[18px] font-semibold text-[#94a3b8]">
                            Seleciona uma pergunta para iniciar o diálogo com o
                            utente.
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="rounded-[22px] border border-[#334155] bg-[#111827] p-4">
                              <p className="mb-1 text-[14px] font-black uppercase tracking-wide text-[#1d4ed8]">
                                Tu
                              </p>
                              <p className="text-[17px] font-semibold text-white">
                                {textoPerguntas[perguntaAtual]}
                              </p>
                            </div>

                            <div className="rounded-[22px] border border-[#334155] bg-[#1f2937] p-4">
                              <p className="mb-1 text-[14px] font-black uppercase tracking-wide text-[#22c55e]">
                                Utente
                              </p>
                              <p className="text-[17px] font-semibold text-white">
                                {respostasDialogo[perguntaAtual]}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-full px-6">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="rounded-[22px] border border-[#334155] bg-[#111827] p-4">
                            <p className="mb-2 text-[14px] font-black uppercase tracking-wide text-[#1d4ed8]">
                              Produtos selecionados
                            </p>
                            <div className="space-y-2 text-[15px] font-semibold text-white">
                              {tratamentosSelecionados.length > 0 ? (
                                tratamentosSelecionados.map((item) => (
                                  <div key={item}>• {nomesTratamentos[item]}</div>
                                ))
                              ) : (
                                <div className="text-[#94a3b8]">
                                  Nenhum produto selecionado.
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="rounded-[22px] border border-[#334155] bg-[#111827] p-4">
                            <p className="mb-2 text-[14px] font-black uppercase tracking-wide text-[#1d4ed8]">
                              Forma de aplicação
                            </p>
                            <div className="space-y-2 text-[15px] font-semibold text-white">
                              {aplicacoesSelecionadas.length > 0 ? (
                                aplicacoesSelecionadas.map((item) => (
                                  <div key={item}>• {nomesAplicacoes[item]}</div>
                                ))
                              ) : (
                                <div className="text-[#94a3b8]">
                                  Nenhuma forma de aplicação selecionada.
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex min-h-0 flex-col rounded-[28px] border border-[#334155] bg-[#1f2937] p-3">
                  <div className="mb-2 rounded-[20px] border border-[#334155] bg-[#0f172a] px-4 py-3">
                    <p className="text-[16px] font-black uppercase tracking-wide text-[#e2e8f0]">
                      Informação relevante
                    </p>
                  </div>

                  <div className="min-h-0 flex-1 overflow-auto rounded-[22px] bg-[#111827] p-3">
                    {abaAtiva === "observacao" && (
                      <div className="space-y-3">
                        <button
                          onClick={() => setObservacaoDimensoesVista(true)}
                          className={botaoAcao}
                        >
                          Ver dimensões
                        </button>

                        <button
                          onClick={() => setObservacaoExsudadoVista(true)}
                          className={botaoAcao}
                        >
                          Ver exsudado
                        </button>

                        <button
                          onClick={() => setObservacaoCheiroVista(true)}
                          className={botaoAcao}
                        >
                          Ver cheiro
                        </button>

                        <button
                          onClick={() => setObservacaoTecidoVista(true)}
                          className={botaoAcao}
                        >
                          Ver tecidos presentes
                        </button>

                        <button
                          onClick={() => setObservacaoPerilesionalVista(true)}
                          className={botaoAcao}
                        >
                          Ver pele perilesional
                        </button>

                        <div className="space-y-2 pt-2">
                          {observacaoDimensoesVista && (
                            <div className="rounded-2xl border border-[#334155] bg-[#0f172a] p-3 text-[14px] font-semibold text-white">
                              <strong className="text-[#1d4ed8]">Dimensões:</strong>{" "}
                              ferida linear com cerca de 12 cm, com múltiplas
                              áreas de deiscência de aproximadamente 2 a 4 cm.
                            </div>
                          )}
                          {observacaoExsudadoVista && (
                            <div className="rounded-2xl border border-[#334155] bg-[#0f172a] p-3 text-[14px] font-semibold text-white">
                              <strong className="text-[#1d4ed8]">Exsudado:</strong>{" "}
                              moderado a abundante, seroso a seropurulento.
                            </div>
                          )}
                          {observacaoCheiroVista && (
                            <div className="rounded-2xl border border-[#334155] bg-[#0f172a] p-3 text-[14px] font-semibold text-white">
                              <strong className="text-[#1d4ed8]">Cheiro:</strong>{" "}
                              odor ligeiro a moderado.
                            </div>
                          )}
                          {observacaoTecidoVista && (
                            <div className="rounded-2xl border border-[#334155] bg-[#0f172a] p-3 text-[14px] font-semibold text-white">
                              <strong className="text-[#1d4ed8]">Tecido presente:</strong>{" "}
                              presença de fibrina e áreas de tecido desvitalizado.
                            </div>
                          )}
                          {observacaoPerilesionalVista && (
                            <div className="rounded-2xl border border-[#334155] bg-[#0f172a] p-3 text-[14px] font-semibold text-white">
                              <strong className="text-[#1d4ed8]">Pele perilesional:</strong>{" "}
                              eritematosa, ligeiramente macerada.
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {abaAtiva === "dialogo" && (
                      <div className="space-y-3">
                        <button
                          onClick={() => fazerPergunta("dor")}
                          className={botaoOpcao}
                        >
                          Perguntar sobre dor
                        </button>

                        <button
                          onClick={() => fazerPergunta("duracao")}
                          className={botaoOpcao}
                        >
                          Perguntar duração do problema
                        </button>

                        <button
                          onClick={() => fazerPergunta("posicao")}
                          className={botaoOpcao}
                        >
                          Perguntar sobre posição da perna
                        </button>

                        <button
                          onClick={() => fazerPergunta("mobilidade")}
                          className={botaoOpcao}
                        >
                          Perguntar sobre mobilidade
                        </button>

                        <button
                          onClick={() => fazerPergunta("febre")}
                          className={botaoOpcao}
                        >
                          Perguntar sobre febre
                        </button>

                        <button
                          onClick={() => fazerPergunta("pensos")}
                          className={botaoOpcao}
                        >
                          Perguntar sobre pensos anteriores
                        </button>

                        {perguntasFeitas.length > 0 && (
                          <div className="rounded-2xl border border-[#334155] bg-[#0f172a] p-3">
                            <p className="mb-2 text-[14px] font-black text-[#1d4ed8]">
                              Perguntas realizadas
                            </p>
                            <div className="space-y-1 text-[14px] font-semibold text-white">
                              {perguntasFeitas.map((item) => (
                                <div key={item}>• {nomesPerguntas[item]}</div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {abaAtiva === "tratamento" && (
                      <div className="grid gap-4 lg:grid-cols-2">
                        <div className="space-y-4">
                          {materiaisPorCategoria.map((grupo) => (
                            <div key={grupo.categoria} className="space-y-2">
                              <p className="text-[14px] font-black text-[#1d4ed8]">
                                🔹 {grupo.categoria}
                              </p>

                              {grupo.itens.map((item) => (
                                <label
                                  key={`${grupo.categoria}-${item.id}`}
                                  className={botaoOpcao}
                                >
                                  <input
                                    type="checkbox"
                                    checked={tratamentosSelecionados.includes(
                                      item.id
                                    )}
                                    onChange={() => toggleTratamento(item.id)}
                                    className="mr-2"
                                  />
                                  {item.nome}
                                </label>
                              ))}
                            </div>
                          ))}
                        </div>

                        <div className="space-y-3">
                          <p className="mb-1 text-[14px] font-black text-[#1d4ed8]">
                            Aplicação
                          </p>

                          <label className={botaoOpcao}>
                            <input
                              type="checkbox"
                              checked={aplicacoesSelecionadas.includes("apos_limpeza")}
                              onChange={() => toggleAplicacao("apos_limpeza")}
                              className="mr-2"
                            />
                            Aplicar cobertura após limpeza adequada
                          </label>

                          <label className={botaoOpcao}>
                            <input
                              type="checkbox"
                              checked={aplicacoesSelecionadas.includes(
                                "com_protecao_perilesional"
                              )}
                              onChange={() =>
                                toggleAplicacao("com_protecao_perilesional")
                              }
                              className="mr-2"
                            />
                            Proteger a pele perilesional
                          </label>

                          <label className={botaoOpcao}>
                            <input
                              type="checkbox"
                              checked={aplicacoesSelecionadas.includes(
                                "sem_desbridamento"
                              )}
                              onChange={() =>
                                toggleAplicacao("sem_desbridamento")
                              }
                              className="mr-2"
                            />
                            Não usar desbridamento enzimático como primeira prioridade
                          </label>

                          <label className={botaoOpcao}>
                            <input
                              type="checkbox"
                              checked={aplicacoesSelecionadas.includes("direto_seco")}
                              onChange={() => toggleAplicacao("direto_seco")}
                              className="mr-2"
                            />
                            Aplicar material diretamente em seco
                          </label>

                          <label className={botaoOpcao}>
                            <input
                              type="checkbox"
                              checked={aplicacoesSelecionadas.includes(
                                "compressao_forte"
                              )}
                              onChange={() =>
                                toggleAplicacao("compressao_forte")
                              }
                              className="mr-2"
                            />
                            Fazer compressão forte sobre a lesão
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {abaAtiva === "resultado" && (
            <div className="flex h-full min-h-0 flex-col gap-4 overflow-y-auto pr-1">
              <div className="rounded-[28px] border border-[#334155] bg-[#0f172a] p-5">
                <h2 className="text-[34px] font-black text-[#f8fafc]">
                  Resultado final
                </h2>
                <p className="mt-2 text-[17px] font-semibold text-[#94a3b8]">
                  A pontuação só aparece no final da interação.
                </p>

                <div className="mt-5">
                  <div className="h-7 w-full overflow-hidden rounded-full bg-[#1f2937]">
                    <div
                      className={`h-7 rounded-full ${
                        pontuacao >= 85
                          ? "bg-[#22c55e]"
                          : pontuacao >= 70
                          ? "bg-[#1d4ed8]"
                          : pontuacao >= 50
                          ? "bg-[#facc15]"
                          : "bg-[#64748b]"
                      }`}
                      style={{ width: `${pontuacao}%` }}
                    />
                  </div>
                  <p className="mt-3 text-[30px] font-black text-[#f8fafc]">
                    {pontuacao}/100
                  </p>
                </div>

                <div className="mt-4 rounded-[22px] border border-[#334155] bg-[#111827] p-4 text-[16px] font-semibold text-white">
                  {avaliacaoTexto}
                </div>

                <button
                  onClick={() => setMostrarDetalhe((v) => !v)}
                  className="mt-4 rounded-[18px] bg-[#1d4ed8] px-5 py-3 text-[16px] font-black text-white hover:bg-[#2563eb]"
                >
                  {mostrarDetalhe
                    ? "Esconder avaliação detalhada"
                    : "Ver avaliação detalhada"}
                </button>
              </div>

              {mostrarDetalhe && (
                <div className="grid gap-4 lg:grid-cols-2">
                  {avaliacaoDetalhada.map((secao) => (
                    <div
                      key={secao.nome}
                      className="rounded-[24px] border border-[#334155] bg-[#111827] p-4"
                    >
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <h3 className="text-[22px] font-black text-[#1d4ed8]">
                          {secao.nome}
                        </h3>
                        <span className="rounded-full bg-[#0f172a] px-3 py-1 text-sm font-black text-white">
                          {secao.pontuacao}/{secao.maximo}
                        </span>
                      </div>

                      <div className="space-y-4 text-[14px] font-semibold text-white">
                        <div>
                          <p className="mb-2 font-black text-[#22c55e]">Acertos</p>
                          {secao.acertou.length > 0 ? (
                            secao.acertou.map((item, i) => <div key={i}>• {item}</div>)
                          ) : (
                            <div>Sem acertos assinaláveis nesta secção.</div>
                          )}
                        </div>

                        <div>
                          <p className="mb-2 font-black text-[#facc15]">
                            O que faltou
                          </p>
                          {secao.faltou.length > 0 ? (
                            secao.faltou.map((item, i) => <div key={i}>• {item}</div>)
                          ) : (
                            <div>Sem omissões relevantes.</div>
                          )}
                        </div>

                        <div>
                          <p className="mb-2 font-black text-[#f87171]">Erros</p>
                          {secao.errou.length > 0 ? (
                            secao.errou.map((item, i) => <div key={i}>• {item}</div>)
                          ) : (
                            <div>Sem erros críticos nesta secção.</div>
                          )}
                        </div>

                        <div>
                          <p className="mb-2 font-black text-[#c084fc]">Excesso</p>
                          {secao.excesso.length > 0 ? (
                            secao.excesso.map((item, i) => <div key={i}>• {item}</div>)
                          ) : (
                            <div>Sem excesso de opções nesta secção.</div>
                          )}
                        </div>

                        <div>
                          <p className="mb-2 font-black text-[#f59e0b]">
                            Porque não tiveste a pontuação máxima
                          </p>
                          {secao.justificacaoPerda.length > 0 ? (
                            secao.justificacaoPerda.map((item, i) => (
                              <div key={i}>• {item}</div>
                            ))
                          ) : (
                            <div>Tiveste pontuação máxima nesta secção.</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="rounded-[24px] border border-[#334155] bg-[#111827] p-4 lg:col-span-2">
                    <h3 className="mb-3 text-[22px] font-black text-[#1d4ed8]">
                      Artigos e correção de escolhas
                    </h3>

                    <div className="space-y-3 text-[14px] font-semibold text-white">
                      {linksMateriaisSelecionados.length > 0 ? (
                        linksMateriaisSelecionados.map((item, index) => (
                          <div
                            key={`${item.material}-${index}`}
                            className="rounded-2xl border border-[#334155] bg-[#0f172a] p-3"
                          >
                            <p className="font-black text-white">
                              Material: {item.material}
                            </p>
                            {item.correto && (
                              <p className="mt-1 text-[#facc15]">
                                Alternativa mais adequada: {item.correto}
                              </p>
                            )}
                            <p className="mt-2 text-[#cbd5e1]">{item.explicacao}</p>
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-2 inline-block text-[#93c5fd] underline hover:text-white"
                            >
                              {item.titulo}
                            </a>
                          </div>
                        ))
                      ) : (
                        <div>Não há artigos associados às escolhas desta tentativa.</div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pb-2">
                <button
                  onClick={resetarCaso}
                  className="rounded-[18px] bg-[#1d4ed8] px-5 py-3 text-[17px] font-black text-white hover:bg-[#2563eb]"
                >
                  Repetir caso
                </button>

                <Link
                  href="/casos"
                  className="rounded-[18px] bg-[#facc15] px-5 py-3 text-[17px] font-black text-[#0f172a] hover:bg-[#fde047]"
                >
                  Voltar aos casos
                </Link>

                <Link
                  href="/historico"
                  className="rounded-[18px] border border-[#334155] bg-white px-5 py-3 text-[17px] font-black text-[#0f172a] hover:bg-[#f8fafc]"
                >
                  Histórico
                </Link>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}