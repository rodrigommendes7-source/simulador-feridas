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

const nomesPerguntas: Record<PerguntaId, string> = {
  dor: "dor",
  duracao: "duração",
  posicao: "posição",
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

export default function CasoUmPage() {
  const [abaAtiva, setAbaAtiva] = useState<Aba>("observacao");

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

  const pontuacao = useMemo(() => {
    let score = 0;

    if (observacaoImagemVista) score += 8;
    if (observacaoDimensoesVista) score += 8;
    if (observacaoExsudadoVista) score += 6;
    if (observacaoCheiroVista) score += 6;
    if (observacaoTecidoVista) score += 8;
    if (observacaoPerilesionalVista) score += 8;

    if (perguntasFeitas.includes("dor")) score += 8;
    if (perguntasFeitas.includes("duracao")) score += 5;
    if (perguntasFeitas.includes("posicao")) score += 8;
    if (perguntasFeitas.includes("febre")) score += 4;
    if (perguntasFeitas.includes("mobilidade")) score += 7;
    if (perguntasFeitas.includes("pensos")) score += 3;

    if (tratamentosSelecionados.includes("hidrofibra")) score += 10;
    if (tratamentosSelecionados.includes("carboximetilcelulose")) score += 8;
    if (tratamentosSelecionados.includes("hidrogel")) score += 3;
    if (tratamentosSelecionados.includes("colagenase")) score += 2;
    if (tratamentosSelecionados.includes("prata")) score += 2;
    if (tratamentosSelecionados.includes("iodo")) score += 1;
    if (tratamentosSelecionados.includes("emolientes_ags")) score += 4;

    if (tratamentosSelecionados.includes("mel")) score += 1;
    if (tratamentosSelecionados.includes("betametasona")) score += 0;
    if (tratamentosSelecionados.includes("nitrato_prata")) score += 0;

    if (tratamentosSelecionados.includes("alcool")) score -= 15;
    if (tratamentosSelecionados.includes("gaze_seca")) score -= 12;

    const numeroTratamentos = tratamentosSelecionados.length;
    if (numeroTratamentos === 0) score -= 15;
    if (numeroTratamentos === 1) score += 4;
    if (numeroTratamentos === 2) score += 6;
    if (numeroTratamentos === 3) score -= 3;
    if (numeroTratamentos >= 4) score -= 10;
    if (numeroTratamentos >= 5) score -= 18;

    if (aplicacoesSelecionadas.includes("apos_limpeza")) score += 8;
    if (aplicacoesSelecionadas.includes("com_protecao_perilesional")) score += 8;
    if (aplicacoesSelecionadas.includes("sem_desbridamento")) score += 2;
    if (aplicacoesSelecionadas.includes("direto_seco")) score -= 10;
    if (aplicacoesSelecionadas.includes("compressao_forte")) score -= 12;
    if (aplicacoesSelecionadas.length >= 4) score -= 6;

    if (score < 0) score = 0;
    if (score > 100) score = 100;

    return score;
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

  const avaliacaoTexto = useMemo(() => {
    if (pontuacao >= 85) {
      return "Desempenho muito bom. Fizeste uma avaliação abrangente, recolheste dados relevantes junto do utente e escolheste uma abordagem terapêutica globalmente adequada para o caso.";
    }

    if (pontuacao >= 70) {
      return "Bom desempenho. Identificaste vários elementos importantes, mas ainda faltaram alguns dados de avaliação ou houve escolhas terapêuticas menos ajustadas.";
    }

    if (pontuacao >= 50) {
      return "Desempenho intermédio. Observaste parte do necessário, mas a recolha de dados e/ou a seleção do tratamento ficou incompleta.";
    }

    return "Desempenho insuficiente. Faltaram etapas importantes de avaliação e houve decisões terapêuticas desadequadas para este caso.";
  }, [pontuacao]);

  const resumoPontosFortes = useMemo(() => {
    const pontos: string[] = [];

    if (observacaoDimensoesVista) {
      pontos.push("Consultaste as dimensões da ferida.");
    }
    if (observacaoTecidoVista) {
      pontos.push("Observaste o tipo de tecido presente no leito.");
    }
    if (perguntasFeitas.includes("dor")) {
      pontos.push("Avaliaste a dor do utente.");
    }
    if (perguntasFeitas.includes("mobilidade")) {
      pontos.push("Exploraste a mobilidade e dependência.");
    }
    if (tratamentosSelecionados.includes("hidrofibra")) {
      pontos.push("Selecionaste hidrofibra para gestão do exsudado.");
    }
    if (tratamentosSelecionados.includes("carboximetilcelulose")) {
      pontos.push("Consideraste um material absorvente dirigido ao exsudado.");
    }
    if (aplicacoesSelecionadas.includes("com_protecao_perilesional")) {
      pontos.push("Consideraste proteção da pele perilesional.");
    }

    return pontos;
  }, [
    observacaoDimensoesVista,
    observacaoTecidoVista,
    perguntasFeitas,
    tratamentosSelecionados,
    aplicacoesSelecionadas,
  ]);

  const resumoMelhorar = useMemo(() => {
    const pontos: string[] = [];

    if (!observacaoCheiroVista) {
      pontos.push("Faltou verificar o odor da ferida.");
    }
    if (!observacaoPerilesionalVista) {
      pontos.push("Faltou observar a pele perilesional.");
    }
    if (!perguntasFeitas.includes("dor")) {
      pontos.push("Faltou avaliar a dor.");
    }
    if (!perguntasFeitas.includes("posicao")) {
      pontos.push(
        "Faltou explorar alívio de pressão e posicionamento."
      );
    }
    if (tratamentosSelecionados.includes("alcool")) {
      pontos.push("A aplicação de álcool na ferida é desadequada.");
    }
    if (tratamentosSelecionados.includes("gaze_seca")) {
      pontos.push("A gaze seca pode traumatizar o leito da ferida.");
    }
    if (aplicacoesSelecionadas.includes("compressao_forte")) {
      pontos.push("Compressão forte não é adequada neste contexto.");
    }
    if (aplicacoesSelecionadas.includes("direto_seco")) {
      pontos.push(
        "A aplicação direta em seco não respeita uma abordagem húmida adequada."
      );
    }
    if (tratamentosSelecionados.length >= 4) {
      pontos.push(
        "Selecionaste materiais em excesso; o penso deve ser mais dirigido e menos cumulativo."
      );
    }
    if (
      tratamentosSelecionados.includes("hidrofibra") &&
      tratamentosSelecionados.includes("carboximetilcelulose")
    ) {
      pontos.push(
        "Hidrofibra e carboximetilcelulose podem sobrepor função no controlo do exsudado; revê se precisas mesmo de ambas."
      );
    }
    if (tratamentosSelecionados.length === 1) {
      pontos.push(
        "Podias justificar melhor a tua escolha principal com base no objetivo terapêutico."
      );
    }
    if (pontos.length === 0) {
      pontos.push(
        "Resolução globalmente muito forte; para melhorar ainda mais, torna a tua seleção de materiais mais explicitamente justificada pelo objetivo principal da ferida."
      );
    }

    return pontos;
  }, [
    observacaoCheiroVista,
    observacaoPerilesionalVista,
    perguntasFeitas,
    tratamentosSelecionados,
    aplicacoesSelecionadas,
  ]);

  const linksMateriaisSelecionados = useMemo(() => {
    return tratamentosSelecionados
      .filter((item) => linksEvidencia[item])
      .map((item) => ({
        nome: nomesTratamentos[item],
        titulo: linksEvidencia[item]!.titulo,
        url: linksEvidencia[item]!.url,
      }));
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
                Observar
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
              <p className="text-[14px] font-bold text-[#1d4ed8]">
                Objetivo
              </p>
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

        <section className="flex h-full min-w-0 flex-1 flex-col rounded-[34px] border border-[#334155] bg-[#111827] p-4 shadow-2xl">
          {abaAtiva !== "resultado" && (
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
                        <div className="px-8 text-center text-[18px] font-semibold text-[#94a3b8]">
                          Clica em{" "}
                          <span className="font-black text-[#1d4ed8]">
                            Ver imagem da ferida
                          </span>{" "}
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
                                {
                                  {
                                    dor: "Tem dor? Se sim, quanto daria numa escala de 0 a 10?",
                                    duracao:
                                      "Há quanto tempo tem esta ferida?",
                                    posicao:
                                      "Consegue mudar de posição? Passa muito tempo na mesma postura?",
                                    pensos:
                                      "Sabe que tipo de pensos lhe têm sido feitos?",
                                    febre: "Tem tido febre ou arrepios?",
                                    mobilidade:
                                      "Consegue mobilizar-se sozinho ou precisa de ajuda?",
                                  }[perguntaAtual]
                                }
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
                                  <div key={item}>
                                    • {nomesTratamentos[item]}
                                  </div>
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
                                  <div key={item}>
                                    • {nomesAplicacoes[item]}
                                  </div>
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
                              aproximadamente 4 cm x 3 cm, profundidade ligeira
                              a moderada.
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
                              <strong className="text-[#1d4ed8]">Cheiro:</strong>{" "}
                              ligeiro, sem odor fétido intenso.
                            </div>
                          )}
                          {observacaoTecidoVista && (
                            <div className="rounded-2xl border border-[#334155] bg-[#0f172a] p-3 text-[14px] font-semibold text-white">
                              <strong className="text-[#1d4ed8]">
                                Tecido presente:
                              </strong>{" "}
                              granulação viável com áreas de
                              fibrina/amarelecida.
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
          )}

          {abaAtiva === "resultado" && (
            <div className="flex h-full min-h-0 flex-col gap-4">
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
              </div>

              <div className="grid min-h-0 flex-1 grid-cols-3 gap-4">
                <div className="rounded-[24px] border border-[#334155] bg-[#111827] p-4">
                  <h3 className="mb-3 text-[22px] font-black text-[#22c55e]">
                    Pontos positivos
                  </h3>
                  <div className="space-y-2 text-[15px] font-semibold text-white">
                    {resumoPontosFortes.length > 0 ? (
                      resumoPontosFortes.map((item, index) => (
                        <div key={index}>• {item}</div>
                      ))
                    ) : (
                      <div>
                        Ainda não há pontos fortes suficientes registados.
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-[24px] border border-[#334155] bg-[#111827] p-4">
                  <h3 className="mb-3 text-[22px] font-black text-[#facc15]">
                    Aspetos a melhorar
                  </h3>
                  <div className="space-y-2 text-[15px] font-semibold text-white">
                    {resumoMelhorar.length > 0 ? (
                      resumoMelhorar.map((item, index) => (
                        <div key={index}>• {item}</div>
                      ))
                    ) : (
                      <div>
                        Não foram identificados aspetos de melhoria relevantes.
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-[24px] border border-[#334155] bg-[#111827] p-4">
                  <h3 className="mb-3 text-[22px] font-black text-[#1d4ed8]">
                    Resumo
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

                  <div className="mt-4 rounded-2xl border border-[#334155] bg-[#0f172a] p-3">
                    <p className="mb-2 text-[14px] font-black text-[#1d4ed8]">
                      Evidência científica dos materiais selecionados
                    </p>

                    {linksMateriaisSelecionados.length > 0 ? (
                      <div className="space-y-2 text-[14px] font-semibold text-white">
                        {linksMateriaisSelecionados.map((item) => (
                          <div key={item.url}>
                            • {item.nome}:{" "}
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#93c5fd] underline hover:text-white"
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
              </div>

              <div className="flex gap-3">
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