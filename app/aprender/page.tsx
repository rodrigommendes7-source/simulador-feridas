"use client";

import Link from "next/link";

const secoes = [
  {
    titulo: "Desbridamento",
    conteudo:
      "A colagenase pode ser útil quando existe tecido desvitalizado ou fibrina aderente. Deve ser usada quando o objetivo é facilitar o desbridamento enzimático.",
  },
  {
    titulo: "Gestão de exsudado",
    conteudo:
      "A hidrofibra e a carboximetilcelulose são materiais dirigidos ao controlo do exsudado. Em muitos casos, basta um deles, dependendo do objetivo e do tipo de penso pretendido.",
  },
  {
    titulo: "Antimicrobianos",
    conteudo:
      "A prata e o iodo podem ser considerados quando existem sinais de infeção local ou risco aumentado de carga microbiana, mas não devem ser usados sem justificação clínica.",
  },
  {
    titulo: "Proteção da pele peri-ferida",
    conteudo:
      "Os emolientes ou AGE ajudam a proteger a pele peri-ferida, especialmente quando existe exsudado ou risco de maceração.",
  },
  {
    titulo: "Materiais desadequados em muitos casos",
    conteudo:
      "Álcool e gaze seca podem ser prejudiciais ao leito da ferida. O álcool é citotóxico e a gaze seca pode aderir ao tecido, provocando trauma à remoção.",
  },
  {
    titulo: "Princípios gerais",
    conteudo:
      "A escolha do tratamento deve ser focada no objetivo principal da ferida: controlo do exsudado, desbridamento, controlo microbiano, proteção peri-ferida e promoção de cicatrização. Evita acumular materiais sem função clara.",
  },
];

export default function AprenderPage() {
  return (
    <main className="min-h-screen bg-[#0a0f1e] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#60a5fa]">
              Área de estudo
            </p>
            <h1 className="mb-3 text-4xl font-bold text-white">
              Aprender
            </h1>
            <p className="max-w-2xl text-sm text-[#64748b]">
              Material de apoio relacionado com a seleção de tratamentos em feridas.
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
              <h2 className="mb-3 text-lg font-semibold text-white">
                {secao.titulo}
              </h2>
              <p className="text-sm leading-relaxed text-[#64748b]">
                {secao.conteudo}
              </p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}