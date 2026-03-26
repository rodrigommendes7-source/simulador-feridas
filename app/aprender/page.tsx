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
    <main className="min-h-screen bg-[#0b1220] px-6 py-8 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.28em] text-[#3b82f6]">
              Área de estudo
            </p>
            <h1 className="mt-2 text-4xl font-black text-white">
              Aprender
            </h1>
            <p className="mt-2 text-lg text-[#cbd5e1]">
              Material de apoio relacionado com a seleção de tratamentos em feridas.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/"
              className="rounded-2xl border border-[#334155] bg-white px-5 py-3 font-black text-[#0f172a] hover:bg-[#f8fafc]"
            >
              Página inicial
            </Link>

            <Link
              href="/casos"
              className="rounded-2xl bg-[#facc15] px-5 py-3 font-black text-[#0f172a] hover:bg-[#fde047]"
            >
              Resolver casos
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {secoes.map((secao) => (
            <section
              key={secao.titulo}
              className="rounded-[26px] border border-[#334155] bg-[#111827] p-6 shadow-xl"
            >
              <h2 className="text-2xl font-black text-[#3b82f6]">
                {secao.titulo}
              </h2>
              <p className="mt-4 text-[16px] leading-relaxed text-white">
                {secao.conteudo}
              </p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}