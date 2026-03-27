"use client";

import Link from "next/link";

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
      "Deiscência cirúrgica com tecido desvitalizado: associar estratégia de desbridamento + controlo de exsudado.",
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
      "Sobreposição de materiais com a mesma função absorvente sem benefício clínico.",
    ],
    exemplosPraticos: [
      "Lesão por pressão com exsudado: escolher um material absorvente principal e reavaliar em 24–48h.",
      "Maceração peri-ferida: otimizar absorção + reforçar proteção cutânea periférica.",
    ],
  },
  {
    titulo: "Antimicrobianos",
    objetivoClinico:
      "Reduzir carga microbiana local quando há suspeita de infeção crítica ou infeção local estabelecida.",
    quandoUsar: [
      "Sinais locais de infeção: aumento de exsudado, odor, dor, atraso de cicatrização, tecido friável.",
      "Contextos com risco aumentado de colonização crítica em feridas complexas.",
    ],
    quandoEvitar: [
      "Uso prolongado sem critérios de reavaliação clínica.",
      "Ferida sem sinais clínicos de carga microbiana problemática.",
    ],
    exemplosPraticos: [
      "Ferida cirúrgica deiscente com febre ligeira: ponderar prata/iodo e monitorizar resposta clínica.",
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
      "Secção de segurança clínica: identificar o que não deve ser escolhido como rotina.",
    ],
    quandoEvitar: [
      "Álcool no leito da ferida (citotoxicidade).",
      "Gaze seca em contacto direto com tecido viável (aderência traumática).",
      "Corticoterapia tópica fora de indicação específica e sem plano clínico.",
    ],
    exemplosPraticos: [
      "Trocar abordagem agressiva por limpeza adequada + cobertura húmida dirigida ao objetivo da ferida.",
      "Se houver dúvida terapêutica, priorizar materiais com benefício claro para o problema dominante.",
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

export default function AprenderPage() {
  return (
    <main className="min-h-screen bg-[#0a0f1e] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#60a5fa]">
              Área pedagógica
            </p>
            <h1 className="mb-3 text-4xl font-bold text-white">Aprender</h1>
            <p className="max-w-3xl text-sm text-[#64748b]">
              Guia de estudo para apoio à decisão clínica em tratamento de
              feridas, com foco em raciocínio terapêutico e segurança.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/"
              className="rounded-lg border border-[#1e293b] bg-[#0f172a] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#1e293b]"
            >
              Página inicial
            </Link>

            <Link
              href="/casos"
              className="rounded-lg bg-[#2563eb] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#1d4ed8]"
            >
              Resolver casos
            </Link>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {secoes.map((secao) => (
            <section
              key={secao.titulo}
              className="rounded-2xl border border-[#1e293b] bg-[#0f172a] p-6"
            >
              <h2 className="mb-4 text-lg font-semibold text-white">
                {secao.titulo}
              </h2>

              <div className="space-y-4 text-sm leading-relaxed text-[#94a3b8]">
                <div>
                  <p className="mb-1 font-semibold text-[#60a5fa]">
                    Objetivo clínico
                  </p>
                  <p>{secao.objetivoClinico}</p>
                </div>

                <div>
                  <p className="mb-1 font-semibold text-[#60a5fa]">Quando usar</p>
                  <ul className="list-disc space-y-1 pl-5">
                    {secao.quandoUsar.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="mb-1 font-semibold text-[#60a5fa]">
                    Quando evitar
                  </p>
                  <ul className="list-disc space-y-1 pl-5">
                    {secao.quandoEvitar.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="mb-1 font-semibold text-[#60a5fa]">
                    Exemplos práticos
                  </p>
                  <ul className="list-disc space-y-1 pl-5">
                    {secao.exemplosPraticos.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}