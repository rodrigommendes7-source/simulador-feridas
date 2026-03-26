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
  feedback: string;
  avaliacaoDetalhada: AvaliacaoSecao[];
  linksFeedback: FeedbackLink[];
};

const STORAGE_KEY = "historico_resolucoes_feridas";

const respostasDialogo: Record<PerguntaId, string> = {
  dor: "Sinto dor sim... diria 6 em 10, principalmente quando mexem ou quando estou muito tempo na mesma posição.",
  duracao: "Já tenho esta ferida há cerca de 3 semanas.",
  posicao: "Passo muito tempo deitado e às vezes custa-me mudar de posição sozinho.",
  pensos: "Têm-me feito penso regularmente, mas não sei bem o nome do material.",
  febre: "Não, não tenho tido febre.",
  mobilidade: "Preciso de ajuda para me virar e para sair da cama.",
};

const textoPerguntas: Record<PerguntaId, string> = {
  dor: "Tem dor? Se sim, quanto daria numa escala de 0 a 10?",
  duracao: "Há quanto tempo tem esta ferida?",
  posicao: "Consegue mudar de posição? Passa muito tempo na mesma postura?",
  pensos: "Sabe que tipo de pensos lhe têm sido feitos?",
  febre: "Tem tido febre ou arrepios?",
  mobilidade: "Consegue mobilizar-se sozinho ou precisa de ajuda?",
};

const nomesPerguntas: Record<PerguntaId, string> = {
  dor: "dor",
  duracao: "duração",
  posicao: "posição / alívio de pressão",
  pensos: "pensos prévios",
  febre: "febre",
  mobilidade: "mobilidade",
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
    correto: "Hidrofibra",
    titulo: "Hydrofiber dressing applications: review",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC2817785/",
    explicacao:
      "O álcool é citotóxico e desadequado no leito da ferida. Neste caso, seria mais apropriado um material dirigido ao controlo do exsudado, como a hidrofibra.",
  },
  gaze_seca: {
    correto: "Hidrofibra ou carboximetilcelulose",
    titulo: "Hydrofiber/CMC dressings in exudate management",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7059819/",
    explicacao:
      "A gaze seca pode aderir ao leito e traumatizar tecido viável. Uma abordagem húmida e absorvente é mais adequada neste contexto.",
  },
  nitrato_prata: {
    correto: "Hidrofibra",
    titulo: "Hydrofiber dressing applications: review",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC2817785/",
    explicacao:
      "O nitrato de prata está mais associado ao controlo de hipergranulação, o que não é o foco principal deste caso.",
  },
  betametasona: {
    correto: "Proteção da pele perilesional e gestão do exsudado",
    titulo: "Essential fatty acids and skin breakdown prevention",
    url: "https://pubmed.ncbi.nlm.nih.gov/9233238/",
    explicacao:
      "A betametasona não é uma escolha de primeira linha neste caso. A prioridade clínica é proteger a pele peri-ferida e controlar o exsudado.",
  },
};

export default function CasoUmPage() {
  const [iniciado, setIniciado] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState<Aba>("observacao");
  const [mostrarDetalhe, setMostrarDetalhe] = useState(false);

  const [observacaoImagemVista, setObservacaoImagemVista] = useState(false);
  const [observacaoDimensoesVista, setObservacaoDimensoesVista] = useState(false);
  const [observacaoExsudadoVista, setObservacaoExsudadoVista] = useState(false);
  const [observacaoCheiroVista, setObservacaoCheiroVista] = useState(false);
  const [observacaoTecidoVista, setObservacaoTecidoVista] = useState(false);
  const [observacaoPerilesionalVista, setObservacaoPerilesionalVista] =
    useState(false);

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
    const secoes: AvaliacaoSecao[] = [];

    const observacao: AvaliacaoSecao = {
      nome: "Observação",
      pontuacao: 0,
      maximo: 25,
      acertou: [],
      errou: [],
      faltou: [],
      excesso: [],
      justificacaoPerda: [],
    };

    if (observacaoImagemVista) {
      observacao.pontuacao += 4;
      observacao.acertou.push("Visualizaste a imagem da ferida.");
    } else {
      observacao.faltou.push("Faltou observar diretamente a imagem da ferida.");
      observacao.justificacaoPerda.push(
        "Perdeste pontuação por não visualizares a imagem da ferida."
      );
    }

    if (observacaoDimensoesVista) {
      observacao.pontuacao += 5;
      observacao.acertou.push("Consultaste as dimensões da ferida.");
    } else {
      observacao.faltou.push("Faltou verificar as dimensões da ferida.");
      observacao.justificacaoPerda.push(
        "Perdeste pontuação por não avaliares as dimensões da ferida."
      );
    }

    if (observacaoExsudadoVista) {
      observacao.pontuacao += 4;
      observacao.acertou.push("Observaste o exsudado.");
    } else {
      observacao.faltou.push("Faltou avaliar o exsudado.");
      observacao.justificacaoPerda.push(
        "Perdeste pontuação por não avaliares o exsudado."
      );
    }

    if (observacaoCheiroVista) {
      observacao.pontuacao += 3;
      observacao.acertou.push("Verificaste o odor da ferida.");
    } else {
      observacao.faltou.push("Faltou verificar o odor da ferida.");
      observacao.justificacaoPerda.push(
        "Perdeste pontuação por não verificares o odor da ferida."
      );
    }

    if (observacaoTecidoVista) {
      observacao.pontuacao += 5;
      observacao.acertou.push("Observaste os tecidos presentes no leito.");
    } else {
      observacao.faltou.push("Faltou avaliar os tecidos presentes no leito.");
      observacao.justificacaoPerda.push(
        "Perdeste pontuação por não identificares os tecidos presentes no leito."
      );
    }

    if (observacaoPerilesionalVista) {
      observacao.pontuacao += 4;
      observacao.acertou.push("Observaste a pele perilesional.");
    } else {
      observacao.faltou.push("Faltou avaliar a pele perilesional.");
      observacao.justificacaoPerda.push(
        "Perdeste pontuação por não avaliares a pele perilesional."
      );
    }

    secoes.push(observacao);

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
      dialogo.pontuacao += 6;
      dialogo.acertou.push("Avaliaste a dor do utente.");
    } else {
      dialogo.faltou.push("Faltou avaliar a dor.");
      dialogo.justificacaoPerda.push(
        "Perdeste pontuação por não avaliares a dor."
      );
    }

    if (perguntasFeitas.includes("duracao")) {
      dialogo.pontuacao += 3;
      dialogo.acertou.push("Perguntaste há quanto tempo existe a ferida.");
    } else {
      dialogo.justificacaoPerda.push(
        "Perdeste pontuação por não explorares a duração da ferida."
      );
    }

    if (perguntasFeitas.includes("posicao")) {
      dialogo.pontuacao += 6;
      dialogo.acertou.push("Exploraste posicionamento e alívio de pressão.");
    } else {
      dialogo.faltou.push("Faltou explorar posicionamento e alívio de pressão.");
      dialogo.justificacaoPerda.push(
        "Perdeste pontuação por não explorares alívio de pressão e posicionamento."
      );
    }

    if (perguntasFeitas.includes("mobilidade")) {
      dialogo.pontuacao += 5;
      dialogo.acertou.push("Avaliaste a mobilidade / dependência.");
    } else {
      dialogo.faltou.push("Faltou avaliar a mobilidade / dependência.");
      dialogo.justificacaoPerda.push(
        "Perdeste pontuação por não avaliares a mobilidade / dependência."
      );
    }

    if (perguntasFeitas.includes("febre")) {
      dialogo.pontuacao += 3;
      dialogo.acertou.push("Questionaste sinais sistémicos como febre.");
    } else {
      dialogo.justificacaoPerda.push(
        "Perdeste pontuação por não explorares sinais sistémicos como febre."
      );
    }

    if (perguntasFeitas.includes("pensos")) {
      dialogo.pontuacao += 2;
      dialogo.acertou.push("Questionaste pensos prévios.");
    } else {
      dialogo.justificacaoPerda.push(
        "Perdeste pontuação por não questionares os pensos prévios."
      );
    }

    secoes.push(dialogo);

    const tratamento: AvaliacaoSecao = {
      nome: "Escolha do tratamento",
      pontuacao: 0,
      maximo: 30,
      acertou: [],
      errou: [],
      faltou: [],
      excesso: [],
      justificacaoPerda: [],
    };

    if (tratamentosSelecionados.includes("hidrofibra")) {
      tratamento.pontuacao += 10;
      tratamento.acertou.push(
        "Selecionaste hidrofibra para controlo do exsudado."
      );
    } else {
      tratamento.faltou.push(
        "Faltou considerar um material absorvente dirigido ao exsudado, como a hidrofibra."
      );
      tratamento.justificacaoPerda.push(
        "Perdeste pontuação por não selecionares um material principal de controlo do exsudado."
      );
    }

    if (tratamentosSelecionados.includes("carboximetilcelulose")) {
      tratamento.pontuacao += 7;
      tratamento.acertou.push(
        "Selecionaste carboximetilcelulose para gestão do exsudado."
      );
    } else {
      tratamento.justificacaoPerda.push(
        "Perdeste pontuação por não considerares carboximetilcelulose como alternativa absorvente."
      );
    }

    if (tratamentosSelecionados.includes("emolientes_ags")) {
      tratamento.pontuacao += 4;
      tratamento.acertou.push(
        "Consideraste proteção da pele perilesional com emolientes / AGE."
      );
    } else {
      tratamento.faltou.push(
        "Faltou considerar proteção da pele perilesional."
      );
      tratamento.justificacaoPerda.push(
        "Perdeste pontuação por não protegeres a pele perilesional."
      );
    }

    if (tratamentosSelecionados.includes("hidrogel")) {
      tratamento.pontuacao += 2;
      tratamento.acertou.push(
        "O hidrogel pode ser útil em alguns contextos, mas não é a prioridade principal aqui."
      );
      tratamento.justificacaoPerda.push(
        "Não tiveste pontuação máxima nesta componente porque o hidrogel é apenas uma opção secundária neste caso."
      );
    }

    if (tratamentosSelecionados.includes("colagenase")) {
      tratamento.pontuacao += 1;
      tratamento.acertou.push(
        "A colagenase pode ter utilidade se houver necessidade clara de desbridamento, mas não é a prioridade principal neste caso."
      );
      tratamento.justificacaoPerda.push(
        "A colagenase foi valorizada apenas parcialmente porque o desbridamento enzimático não é o foco principal aqui."
      );
    }

    if (tratamentosSelecionados.includes("prata")) {
      tratamento.pontuacao += 1;
      tratamento.acertou.push(
        "A prata pode ter lugar em contexto infecioso, mas não é a escolha principal neste cenário."
      );
      tratamento.justificacaoPerda.push(
        "A prata recebeu apenas pontuação parcial porque não há evidência forte de infeção como problema dominante."
      );
    }

    if (tratamentosSelecionados.includes("iodo")) {
      tratamento.pontuacao += 1;
      tratamento.acertou.push(
        "O iodo pode ter utilidade pontual, mas não é a prioridade terapêutica principal aqui."
      );
      tratamento.justificacaoPerda.push(
        "O iodo recebeu apenas pontuação parcial porque não responde ao objetivo terapêutico central deste caso."
      );
    }

    if (tratamentosSelecionados.includes("mel")) {
      tratamento.pontuacao += 1;
      tratamento.acertou.push(
        "O mel tem potencial bioativo, embora não seja a escolha principal neste caso."
      );
      tratamento.justificacaoPerda.push(
        "O mel recebeu apenas pontuação parcial porque não é a escolha prioritária para o problema dominante."
      );
    }

    if (tratamentosSelecionados.includes("betametasona")) {
      tratamento.errou.push(
        "A betametasona não é uma escolha adequada como foco principal neste caso."
      );
      tratamento.justificacaoPerda.push(
        "Perdeste pontuação por selecionares betametasona sem indicação principal neste contexto."
      );
      tratamento.pontuacao -= 4;
    }

    if (tratamentosSelecionados.includes("nitrato_prata")) {
      tratamento.errou.push(
        "O nitrato de prata não responde ao principal problema clínico deste caso."
      );
      tratamento.justificacaoPerda.push(
        "Perdeste pontuação por selecionares nitrato de prata para um caso em que a hipergranulação não é o foco."
      );
      tratamento.pontuacao -= 4;
    }

    if (tratamentosSelecionados.includes("alcool")) {
      tratamento.errou.push(
        "A aplicação de álcool na ferida é desadequada e citotóxica."
      );
      tratamento.justificacaoPerda.push(
        "Perdeste pontuação por escolheres álcool, que é prejudicial ao leito da ferida."
      );
      tratamento.pontuacao -= 12;
    }

    if (tratamentosSelecionados.includes("gaze_seca")) {
      tratamento.errou.push(
        "A gaze seca pode aderir ao leito e traumatizar tecido viável."
      );
      tratamento.justificacaoPerda.push(
        "Perdeste pontuação por escolheres gaze seca, que pode traumatizar a ferida."
      );
      tratamento.pontuacao -= 10;
    }

    if (
      tratamentosSelecionados.includes("hidrofibra") &&
      tratamentosSelecionados.includes("carboximetilcelulose")
    ) {
      tratamento.excesso.push(
        "Hidrofibra e carboximetilcelulose podem sobrepor função; revê se precisas mesmo de ambas."
      );
      tratamento.justificacaoPerda.push(
        "Perdeste parte da pontuação por sobreposição funcional entre materiais absorventes."
      );
      tratamento.pontuacao -= 2;
    }

    if (tratamentosSelecionados.length === 0) {
      tratamento.faltou.push("Não selecionaste qualquer material de tratamento.");
      tratamento.justificacaoPerda.push(
        "Perdeste pontuação por não selecionares materiais de tratamento."
      );
      tratamento.pontuacao -= 10;
    }

    if (tratamentosSelecionados.length >= 4) {
      tratamento.excesso.push(
        "Selecionaste materiais em excesso; o penso deve ser mais dirigido."
      );
      tratamento.justificacaoPerda.push(
        "Perdeste pontuação por excesso de materiais e falta de foco terapêutico."
      );
      tratamento.pontuacao -= 6;
    }

    if (tratamentosSelecionados.length >= 5) {
      tratamento.excesso.push(
        "A seleção ficou demasiado cumulativa e pouco focada no objetivo principal."
      );
      tratamento.justificacaoPerda.push(
        "Perdeste ainda mais pontuação porque a seleção ficou demasiado ampla e pouco criteriosa."
      );
      tratamento.pontuacao -= 4;
    }

    if (tratamento.pontuacao < 0) tratamento.pontuacao = 0;
    if (tratamento.pontuacao > tratamento.maximo)
      tratamento.pontuacao = tratamento.maximo;

    secoes.push(tratamento);

    const aplicacao: AvaliacaoSecao = {
      nome: "Forma de aplicação",
      pontuacao: 0,
      maximo: 20,
      acertou: [],
      errou: [],
      faltou: [],
      excesso: [],
      justificacaoPerda: [],
    };

    if (aplicacoesSelecionadas.includes("apos_limpeza")) {
      aplicacao.pontuacao += 7;
      aplicacao.acertou.push("Indicaste aplicação após limpeza adequada.");
    } else {
      aplicacao.faltou.push("Faltou referir limpeza adequada antes da aplicação.");
      aplicacao.justificacaoPerda.push(
        "Perdeste pontuação por não incluíres limpeza adequada antes da cobertura."
      );
    }

    if (aplicacoesSelecionadas.includes("com_protecao_perilesional")) {
      aplicacao.pontuacao += 7;
      aplicacao.acertou.push("Consideraste proteção da pele perilesional.");
    } else {
      aplicacao.faltou.push("Faltou incluir proteção da pele perilesional.");
      aplicacao.justificacaoPerda.push(
        "Perdeste pontuação por não incluíres proteção da pele perilesional."
      );
    }

    if (aplicacoesSelecionadas.includes("sem_desbridamento")) {
      aplicacao.pontuacao += 3;
      aplicacao.acertou.push(
        "Reconheceste que o desbridamento enzimático não é a prioridade principal nesta fase."
      );
    } else {
      aplicacao.justificacaoPerda.push(
        "Perdeste pontuação por não demonstrares prioridade terapêutica adequada nesta fase."
      );
    }

    if (aplicacoesSelecionadas.includes("direto_seco")) {
      aplicacao.errou.push(
        "A aplicação direta em seco não respeita uma abordagem húmida adequada."
      );
      aplicacao.justificacaoPerda.push(
        "Perdeste pontuação por selecionares aplicação direta em seco."
      );
      aplicacao.pontuacao -= 8;
    }

    if (aplicacoesSelecionadas.includes("compressao_forte")) {
      aplicacao.errou.push(
        "A compressão forte sobre a lesão não é adequada neste contexto."
      );
      aplicacao.justificacaoPerda.push(
        "Perdeste pontuação por selecionares compressão forte sobre a lesão."
      );
      aplicacao.pontuacao -= 10;
    }

    if (aplicacoesSelecionadas.length >= 4) {
      aplicacao.excesso.push(
        "Selecionaste demasiadas formas de aplicação sem foco suficiente."
      );
      aplicacao.justificacaoPerda.push(
        "Perdeste pontuação por excesso de opções de aplicação."
      );
      aplicacao.pontuacao -= 3;
    }

    if (aplicacao.pontuacao < 0) aplicacao.pontuacao = 0;
    if (aplicacao.pontuacao > aplicacao.maximo)
      aplicacao.pontuacao = aplicacao.maximo;

    secoes.push(aplicacao);

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
    if (total < 0) return 0;
    if (total > 100) return 100;
    return total;
  }, [avaliacaoDetalhada]);

  const avaliacaoTexto = useMemo(() => {
    if (pontuacao >= 85) {
      return "Desempenho muito bom. Fizeste uma avaliação abrangente, recolheste dados clinicamente relevantes e selecionaste uma abordagem globalmente adequada para a lesão por pressão.";
    }

    if (pontuacao >= 70) {
      return "Bom desempenho. Identificaste vários elementos importantes, mas ainda faltaram alguns dados de avaliação ou houve escolhas terapêuticas menos ajustadas.";
    }

    if (pontuacao >= 50) {
      return "Desempenho intermédio. Observaste parte do necessário, mas a recolha de dados e/ou a seleção do tratamento ficou incompleta.";
    }

    return "Desempenho insuficiente. Faltaram etapas importantes de avaliação e houve decisões terapêuticas desadequadas para este caso.";
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

    return combinados.filter(
      (item, index, arr) =>
        arr.findIndex(
          (x) => x.material === item.material && x.url === item.url
        ) === index
    );
  }, [tratamentosSelecionados]);

  function guardarNoHistorico() {
    if (typeof window === "undefined") return;

    const novaResolucao: HistoricoResolucao = {
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}`,
      casoId: "caso-1",
      casoTitulo: "Caso 1 — Lesão por pressão",
      pontuacao,
      data: new Date().toISOString(),
      observacoes: observacoesRealizadas,
      perguntas: perguntasFeitas.map((item) => nomesPerguntas[item]),
      tratamentos: tratamentosSelecionados.map((item) => nomesTratamentos[item]),
      aplicacoes: aplicacoesSelecionadas.map((item) => nomesAplicacoes[item]),
      feedback: avaliacaoTexto,
      avaliacaoDetalhada,
      linksFeedback: linksMateriaisSelecionados,
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
    setMostrarDetalhe(false);
  }

  function resetarCaso() {
    setIniciado(false);
    setAbaAtiva("observacao");
    setMostrarDetalhe(false);
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
              Caso 1
            </h1>
          </div>

          <div className="flex-1 rounded-[24px] border border-[#334155] bg-[#1f2937] p-4">
            <p className="mb-4 text-center text-[26px] font-black text-[#1d4ed8]">
              Ações
            </p>

            <div className="space-y-3">
              <button
                onClick={() => setAbaAtiva("observacao")}
                className={`w-full rounded-[18px] border px-4 py-3 text-left text-[19px] font-bold transition ${
                  abaAtiva === "observacao"
                    ? "border-[#1d4ed8] bg-[#0f172a] text-[#1d4ed8]"
                    : "border-[#334155] bg-white text-[#0f172a] hover:bg-[#f8fafc]"
                }`}
              >
                Observação
              </button>

              <button
                onClick={() => setAbaAtiva("dialogo")}
                className={`w-full rounded-[18px] border px-4 py-3 text-left text-[19px] font-bold transition ${
                  abaAtiva === "dialogo"
                    ? "border-[#1d4ed8] bg-[#0f172a] text-[#1d4ed8]"
                    : "border-[#334155] bg-white text-[#0f172a] hover:bg-[#f8fafc]"
                }`}
              >
                Diálogo
              </button>

              <button
                onClick={() => setAbaAtiva("tratamento")}
                className={`w-full rounded-[18px] border px-4 py-3 text-left text-[19px] font-bold transition ${
                  abaAtiva === "tratamento"
                    ? "border-[#1d4ed8] bg-[#0f172a] text-[#1d4ed8]"
                    : "border-[#334155] bg-white text-[#0f172a] hover:bg-[#f8fafc]"
                }`}
              >
                Tratamento
              </button>
            </div>

            <div className="mt-6 rounded-[20px] border border-[#334155] bg-[#0f172a] p-3">
              <p className="text-[14px] font-bold text-[#1d4ed8]">Objetivo</p>
              <p className="mt-1 text-[13px] leading-snug text-[#cbd5e1]">
                Avaliar a lesão, recolher informação relevante e escolher uma
                abordagem terapêutica adequada.
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <button
              onClick={finalizarCaso}
              className="w-full rounded-[20px] bg-[#facc15] px-4 py-4 text-[24px] font-black text-[#0f172a] shadow hover:bg-[#fde047]"
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

        <section className="flex h-full min-w-0 flex-1 flex-col rounded-[34px] border border-[#334155] bg-[#111827] p-4 shadow-2xl overflow-hidden">
          {!iniciado ? (
            <div className="flex h-full items-center justify-center">
              <div className="max-w-[760px] rounded-[28px] border border-[#334155] bg-[#0f172a] p-8 text-center">
                <h2 className="mb-4 text-[32px] font-black text-white">
                  Caso 1 — Lesão por pressão
                </h2>

                <p className="mb-6 text-[16px] text-[#cbd5e1]">
                  Utente de 78 anos, dependente parcial, com lesão por pressão
                  na região sagrada. Apresenta mobilidade reduzida e necessidade
                  de ajuda no posicionamento.
                </p>

                <p className="mb-8 text-[15px] leading-relaxed text-[#94a3b8]">
                  Neste caso deves observar a ferida, recolher informação
                  relevante junto do utente e selecionar uma abordagem
                  terapêutica ajustada ao estado do leito, exsudado e pele
                  peri-ferida.
                </p>

                <button
                  onClick={() => setIniciado(true)}
                  className="rounded-[18px] bg-[#1d4ed8] px-6 py-3 text-[18px] font-black text-white hover:bg-[#2563eb]"
                >
                  Iniciar caso
                </button>
              </div>
            </div>
          ) : abaAtiva !== "resultado" ? (
            <>
              <div className="mb-3 rounded-[24px] border border-[#334155] bg-[#0f172a] px-5 py-3">
                <p className="text-[16px] font-bold text-[#e2e8f0]">
                  Utente de 78 anos, dependente parcial, com lesão por pressão
                  na região sagrada, mobilidade reduzida e necessidade de ajuda
                  no posicionamento.
                </p>
              </div>

              <div className="grid min-h-0 flex-1 grid-cols-[1.35fr_0.85fr] gap-3">
                <div className="flex min-h-0 flex-col rounded-[32px] border border-[#334155] bg-[#0f172a] p-4">
                  <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-[26px] border border-[#334155] bg-black">
                    {abaAtiva === "observacao" ? (
                      observacaoImagemVista ? (
                        <img
                          src="/Pressure-ulcer-copy.jpg"
                          alt="Úlcera por pressão"
                          className="max-h-full max-w-full rounded-[20px] object-contain"
                        />
                      ) : (
                        <button
                          type="button"
                          onClick={() => setObservacaoImagemVista(true)}
                          className="px-8 text-center text-[18px] font-semibold text-[#94a3b8]"
                        >
                          Clica em{" "}
                          <span className="font-black text-[#1d4ed8] underline underline-offset-4">
                            Ver imagem da ferida
                          </span>{" "}
                          para visualizar a fotografia.
                        </button>
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
                          onClick={() => setObservacaoImagemVista(true)}
                          className={botaoAcao}
                        >
                          Ver imagem da ferida
                        </button>

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
                              <strong className="text-[#1d4ed8]">
                                Dimensões:
                              </strong>{" "}
                              aproximadamente 4 cm x 3 cm, profundidade ligeira a
                              moderada.
                            </div>
                          )}
                          {observacaoExsudadoVista && (
                            <div className="rounded-2xl border border-[#334155] bg-[#0f172a] p-3 text-[14px] font-semibold text-white">
                              <strong className="text-[#1d4ed8]">
                                Exsudado:
                              </strong>{" "}
                              moderado, seroso a serossanguinolento.
                            </div>
                          )}
                          {observacaoCheiroVista && (
                            <div className="rounded-2xl border border-[#334155] bg-[#0f172a] p-3 text-[14px] font-semibold text-white">
                              <strong className="text-[#1d4ed8]">
                                Cheiro:
                              </strong>{" "}
                              ligeiro, sem odor fétido intenso.
                            </div>
                          )}
                          {observacaoTecidoVista && (
                            <div className="rounded-2xl border border-[#334155] bg-[#0f172a] p-3 text-[14px] font-semibold text-white">
                              <strong className="text-[#1d4ed8]">
                                Tecido presente:
                              </strong>{" "}
                              granulação viável com áreas de fibrina /
                              amarelecida.
                            </div>
                          )}
                          {observacaoPerilesionalVista && (
                            <div className="rounded-2xl border border-[#334155] bg-[#0f172a] p-3 text-[14px] font-semibold text-white">
                              <strong className="text-[#1d4ed8]">
                                Pele perilesional:
                              </strong>{" "}
                              eritematosa, sensível, sem maceração marcada.
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
                          Perguntar duração da ferida
                        </button>

                        <button
                          onClick={() => fazerPergunta("posicao")}
                          className={botaoOpcao}
                        >
                          Perguntar sobre alívio de pressão
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
                              checked={aplicacoesSelecionadas.includes(
                                "apos_limpeza"
                              )}
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
                            Não priorizar desbridamento enzimático nesta fase
                          </label>

                          <label className={botaoOpcao}>
                            <input
                              type="checkbox"
                              checked={aplicacoesSelecionadas.includes(
                                "direto_seco"
                              )}
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
          ) : (
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
                  onClick={() => setMostrarDetalhe((prev) => !prev)}
                  className="mt-4 rounded-[18px] border border-[#334155] bg-white px-4 py-3 text-[15px] font-black text-[#0f172a] hover:bg-[#f8fafc]"
                >
                  {mostrarDetalhe
                    ? "Ocultar avaliação detalhada"
                    : "Mostrar avaliação detalhada"}
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
                        <span className="rounded-full bg-[#0f172a] px-3 py-1 text-[14px] font-black text-white">
                          {secao.pontuacao}/{secao.maximo}
                        </span>
                      </div>

                      <div className="space-y-4 text-[14px] font-semibold text-white">
                        <div>
                          <p className="mb-2 font-black text-[#22c55e]">
                            Acertos
                          </p>
                          {secao.acertou.length > 0 ? (
                            <div className="space-y-1">
                              {secao.acertou.map((item, index) => (
                                <div key={index}>• {item}</div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-[#94a3b8]">Sem registos.</div>
                          )}
                        </div>

                        <div>
                          <p className="mb-2 font-black text-[#ef4444]">
                            Erros
                          </p>
                          {secao.errou.length > 0 ? (
                            <div className="space-y-1">
                              {secao.errou.map((item, index) => (
                                <div key={index}>• {item}</div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-[#94a3b8]">Sem registos.</div>
                          )}
                        </div>

                        <div>
                          <p className="mb-2 font-black text-[#facc15]">
                            Faltou
                          </p>
                          {secao.faltou.length > 0 ? (
                            <div className="space-y-1">
                              {secao.faltou.map((item, index) => (
                                <div key={index}>• {item}</div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-[#94a3b8]">Sem registos.</div>
                          )}
                        </div>

                        <div>
                          <p className="mb-2 font-black text-[#93c5fd]">
                            Excesso
                          </p>
                          {secao.excesso.length > 0 ? (
                            <div className="space-y-1">
                              {secao.excesso.map((item, index) => (
                                <div key={index}>• {item}</div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-[#94a3b8]">Sem registos.</div>
                          )}
                        </div>

                        <div>
                          <p className="mb-2 font-black text-[#f59e0b]">
                            Porque não tiveste a pontuação máxima
                          </p>
                          {secao.justificacaoPerda.length > 0 ? (
                            <div className="space-y-1">
                              {secao.justificacaoPerda.map((item, index) => (
                                <div key={index}>• {item}</div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-[#94a3b8]">
                              Tiveste pontuação máxima nesta secção.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-[24px] border border-[#334155] bg-[#111827] p-4">
                  <h3 className="mb-3 text-[22px] font-black text-[#1d4ed8]">
                    Resumo da resolução
                  </h3>

                  <div className="space-y-3 text-[14px] font-semibold text-white">
                    <div>
                      <strong>Observações:</strong>{" "}
                      {observacoesRealizadas.join(", ") || "nenhuma"}
                    </div>

                    <div>
                      <strong>Perguntas:</strong>{" "}
                      {perguntasFeitas.length > 0
                        ? perguntasFeitas
                            .map((item) => nomesPerguntas[item])
                            .join(", ")
                        : "nenhuma"}
                    </div>

                    <div>
                      <strong>Tratamentos:</strong>{" "}
                      {tratamentosSelecionados.length > 0
                        ? tratamentosSelecionados
                            .map((item) => nomesTratamentos[item])
                            .join(", ")
                        : "nenhum"}
                    </div>

                    <div>
                      <strong>Aplicação:</strong>{" "}
                      {aplicacoesSelecionadas.length > 0
                        ? aplicacoesSelecionadas
                            .map((item) => nomesAplicacoes[item])
                            .join(", ")
                        : "nenhuma"}
                    </div>
                  </div>
                </div>

                <div className="rounded-[24px] border border-[#334155] bg-[#111827] p-4">
                  <h3 className="mb-3 text-[22px] font-black text-[#1d4ed8]">
                    Artigos e justificações
                  </h3>

                  {linksMateriaisSelecionados.length > 0 ? (
                    <div className="space-y-3 text-[14px] font-semibold text-white">
                      {linksMateriaisSelecionados.map((item) => (
                        <div
                          key={`${item.material}-${item.url}`}
                          className="rounded-2xl border border-[#334155] bg-[#0f172a] p-3"
                        >
                          <p className="font-black text-white">
                            {item.material}
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
                      ))}
                    </div>
                  ) : (
                    <p className="text-[14px] font-semibold text-white">
                      Não há artigos associados aos materiais selecionados nesta
                      tentativa.
                    </p>
                  )}
                </div>
              </div>

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