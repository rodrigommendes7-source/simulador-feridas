"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { tratamentos } from "@/data/tratamentos";
import { obterEvidenciaMaterial } from "@/app/lib/evidencia-materiais";
import type { TratamentoId } from "@/app/types/simulador";

type SecaoAprendizagem = {
  titulo: string;
  objetivoClinico: string;
  quandoUsar: string[];
  quandoEvitar: string[];
  exemplosPraticos: string[];
};

const secoes: SecaoAprendizagem[] = [
  {
    titulo: "Desbridamento",
    objetivoClinico:
      "Remover tecido desvitalizado/biofilme para reduzir carga inflamatória e preparar o leito da ferida.",
    quandoUsar: [
      "Presença de fibrina aderente, necrose húmida ou tecido desvitalizado que atrasa granulação.",
      "Feridas com cicatrização estagnada por barreira mecânica no leito.",
    ],
    quandoEvitar: [
      "Leito totalmente limpo e em granulação ativa, sem tecido desvitalizado.",
      "Isquemia crítica sem avaliação vascular prévia e sem plano de vigilância.",
    ],
    exemplosPraticos: [
      "Ferida com fibrina amarela aderente: considerar colagenase quando o desbridamento enzimático é viável.",
      "Deiscência cirúrgica com tecido desvitalizado: associar desbridamento e controlo de exsudado.",
    ],
  },
  {
    titulo: "Gestão de exsudado",
    objetivoClinico:
      "Controlar humidade, prevenir maceração peri-ferida e manter ambiente terapêutico para cicatrização.",
    quandoUsar: [
      "Exsudado moderado/abundante com risco de extravasamento e dano cutâneo.",
      "Necessidade de absorção sustentada (ex.: hidrofibra ou CMC).",
    ],
    quandoEvitar: [
      "Feridas secas, com necessidade principal de hidratação do leito.",
      "Sobreposição de materiais absorventes sem benefício clínico.",
    ],
    exemplosPraticos: [
      "Lesão por pressão com exsudado: escolher material absorvente principal e reavaliar em 24–48h.",
      "Maceração peri-ferida: otimizar absorção e reforçar proteção cutânea periférica.",
    ],
  },
  {
    titulo: "Antimicrobianos",
    objetivoClinico:
      "Reduzir carga microbiana local quando há suspeita de infeção crítica ou infeção local estabelecida.",
    quandoUsar: [
      "Sinais locais de infeção: aumento de exsudado, odor, dor e atraso de cicatrização.",
      "Contextos com risco aumentado de colonização crítica em feridas complexas.",
    ],
    quandoEvitar: [
      "Uso prolongado sem critérios de reavaliação clínica.",
      "Ferida sem sinais clínicos de carga microbiana problemática.",
    ],
    exemplosPraticos: [
      "Ferida deiscente com febre ligeira: ponderar prata/iodo e monitorizar resposta clínica.",
      "Sem melhoria após ciclo antimicrobiano: rever diagnóstico, técnica e fatores sistémicos.",
    ],
  },
  {
    titulo: "Proteção da pele peri-ferida",
    objetivoClinico:
      "Preservar integridade cutânea adjacente, reduzindo maceração, dermatite por exsudado e dor ao penso.",
    quandoUsar: [
      "Sempre que há exsudado com contacto frequente com a pele peri-ferida.",
      "Pele frágil, irritada ou com risco de lesão por adesivos.",
    ],
    quandoEvitar: [
      "Aplicação excessiva que comprometa adesão do penso sem necessidade.",
      "Uso de produtos sem compatibilidade com a cobertura selecionada.",
    ],
    exemplosPraticos: [
      "Aplicar barreira cutânea/AGE na periferia antes da cobertura absorvente.",
      "Se há descolamento recorrente do penso, rever preparação da pele e técnica de fixação.",
    ],
  },
  {
    titulo: "Materiais desadequados",
    objetivoClinico:
      "Evitar intervenções que lesionem tecido viável, atrasem cicatrização ou aumentem dor e trauma.",
    quandoUsar: [
      "Secção de segurança clínica para identificar o que não deve ser escolhido como rotina.",
    ],
    quandoEvitar: [
      "Álcool no leito da ferida (citotoxicidade).",
      "Gaze seca em contacto direto com tecido viável (aderência traumática).",
      "Corticoterapia tópica sem indicação específica.",
    ],
    exemplosPraticos: [
      "Trocar abordagem agressiva por limpeza adequada + cobertura húmida dirigida ao objetivo da ferida.",
    ],
  },
  {
    titulo: "Princípios de decisão clínica",
    objetivoClinico:
      "Tomar decisões estruturadas, reproduzíveis e centradas no problema clínico dominante da ferida.",
    quandoUsar: [
      "Em qualquer avaliação: observar → recolher dados → definir objetivo terapêutico → selecionar cobertura.",
      "Sempre com reavaliação temporal da resposta ao plano instituído.",
    ],
    quandoEvitar: [
      "Polimedicação tópica sem hipótese clínica clara.",
      "Manter plano ineficaz sem ajustar após reavaliação objetiva.",
    ],
    exemplosPraticos: [
      "Problema dominante = exsudado: priorizar absorção e proteção peri-ferida.",
      "Problema dominante = tecido desvitalizado: incluir desbridamento e monitorizar evolução do leito.",
    ],
  },
];

function materiaisRelacionados(secao: string) {
  if (secao === "Desbridamento") return tratamentos.filter((t) => t.categoria === "Desbridamento");
  if (secao === "Gestão de exsudado") return tratamentos.filter((t) => t.categoria === "Gestão de exsudado");
  if (secao === "Antimicrobianos") {
    return tratamentos.filter(
      (t) =>
        t.categoria === "Controlo de infeção" ||
        t.categoria === "Antissépsia" ||
        t.funcoes.includes("controlo_microbiano")
    );
  }
  if (secao === "Proteção da pele peri-ferida") {
    return tratamentos.filter((t) => t.categoria === "Proteção da pele perilesional" || t.categoria === "Fixação");
  }
  if (secao === "Materiais desadequados") {
    return tratamentos.filter((t) =>
      ["alcool-70", "agua-oxigenada"].includes(t.id) || t.categoria === "Fármacos tópicos"
    );
  }
  return tratamentos.filter((t) => ["Limpeza", "Desbridamento", "Gestão de exsudado"].includes(t.categoria));
}

export default function AprenderPage() {
  const [secaoAtiva, setSecaoAtiva] = useState<SecaoAprendizagem>(secoes[0]);

  const materiaisPorCategoria = useMemo(() => {
    return materiaisRelacionados(secaoAtiva.titulo).reduce<Record<string, (typeof tratamentos)[number][]>>((acc, item) => {
      if (!acc[item.categoria]) acc[item.categoria] = [];
      acc[item.categoria].push(item);
      return acc;
    }, {});
  }, [secaoAtiva.titulo]);

  return (
    <main className="min-h-screen bg-[#0a0f1e] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#60a5fa]">Área pedagógica</p>
            <h1 className="mt-1 text-4xl font-black">Aprender</h1>
          </div>
          <div className="flex gap-3">
            <Link href="/" className="rounded-xl border border-[#334155] bg-[#111827] px-4 py-2 font-bold hover:bg-[#1f2937]">Início</Link>
            <Link href="/casos" className="rounded-xl bg-[#1d4ed8] px-4 py-2 font-bold text-white hover:bg-[#2563eb]">Casos</Link>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="rounded-[34px] border-2 border-[#334155] bg-[#111827] p-4">
            <div className="space-y-3">
              {secoes.map((secao) => (
                <button
                  key={secao.titulo}
                  onClick={() => setSecaoAtiva(secao)}
                  className={`w-full rounded-2xl border-2 px-4 py-3 text-left text-base font-black transition ${
                    secaoAtiva.titulo === secao.titulo
                      ? "border-[#facc15] bg-[#1d4ed8] text-white"
                      : "border-[#334155] bg-[#0f172a] hover:border-[#60a5fa]"
                  }`}
                >
                  {secao.titulo}
                </button>
              ))}
            </div>
          </aside>

          <section className="rounded-[34px] border-2 border-[#334155] bg-[#111827] p-6">
            <h2 className="text-3xl font-black text-[#60a5fa]">{secaoAtiva.titulo}</h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-[#e2e8f0]">
              <div>
                <p className="font-black text-[#facc15]">Objetivo</p>
                <p>{secaoAtiva.objetivoClinico}</p>
              </div>
              <div>
                <p className="font-black text-[#60a5fa]">Quando usar</p>
                <ul className="list-disc pl-6">
                  {secaoAtiva.quandoUsar.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-black text-[#ef4444]">Quando evitar</p>
                <ul className="list-disc pl-6">
                  {secaoAtiva.quandoEvitar.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-black text-[#60a5fa]">Exemplos práticos</p>
                <ul className="list-disc pl-6">
                  {secaoAtiva.exemplosPraticos.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 rounded-3xl border-2 border-[#334155] bg-[#0f172a] p-5">
              <h3 className="text-xl font-black text-[#facc15]">Materiais relacionados com este tratamento</h3>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {Object.entries(materiaisPorCategoria).map(([categoria, itens]) => (
                  <div key={categoria} className="rounded-2xl border border-[#334155] bg-[#111827] p-4">
                    <p className="mb-2 font-black text-[#60a5fa]">{categoria}</p>
                    <ul className="space-y-1 text-sm text-[#e2e8f0]">
                      {itens.map((tratamento) => (
                        <li key={tratamento.id}>
                          • {tratamento.nome}
                          {(() => {
                            const evidencia = obterEvidenciaMaterial(
                              tratamento.id as TratamentoId
                            );
                            if (!evidencia) return null;
                            return (
                              <a
                                href={evidencia.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-2 text-xs text-[#93c5fd] underline"
                              >
                                artigo científico
                              </a>
                            );
                          })()}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
             </div>
          </section>
        </div>
      </div>
    </main>
  );
}