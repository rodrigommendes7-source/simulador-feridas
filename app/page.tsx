import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen px-6 py-16">
      <div className="mx-auto max-w-6xl space-y-10">
        <section className="grid gap-8 rounded-[32px] border border-[#334155] bg-[#0f172a]/90 p-8 lg:grid-cols-[1.2fr_0.8fr] lg:p-12">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#facc15]">
              Ferramenta pedagógica
            </p>
            <h1 className="max-w-3xl text-5xl font-black leading-tight text-white lg:text-6xl">
              Simulador de tratamento de feridas para treino clínico orientado.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#cbd5e1]">
              Plataforma educativa para treinar observação, diálogo com o utente e
              seleção fundamentada de materiais no tratamento de feridas.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/casos"
                className="rounded-2xl bg-[#1d4ed8] px-6 py-3 font-black text-white transition hover:bg-[#2563eb]"
              >
                Iniciar percurso clínico
              </Link>
              <Link
                href="/aprender"
                className="rounded-2xl border border-[#334155] bg-[#111827] px-6 py-3 font-black text-white transition hover:border-[#facc15]"
              >
                Explorar biblioteca pedagógica
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-3xl border border-[#334155] bg-[#081120] p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-[#60a5fa]">
                Percurso
              </p>
              <p className="mt-2 text-3xl font-black text-white">4 casos</p>
              <p className="mt-2 text-sm text-[#94a3b8]">
                Sequência progressiva entre nível introdutório, intermédio e avançado.
              </p>
            </div>
            <div className="rounded-3xl border border-[#334155] bg-[#081120] p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-[#60a5fa]">
                Aprendizagem
              </p>
              <p className="mt-2 text-3xl font-black text-white">7 temas</p>
              <p className="mt-2 text-sm text-[#94a3b8]">
                Conteúdo estruturado com comparações rápidas e mini-quizzes.
              </p>
            </div>
            <div className="rounded-3xl border border-[#334155] bg-[#081120] p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-[#60a5fa]">
                Feedback
              </p>
              <p className="mt-2 text-3xl font-black text-white">Por domínio</p>
              <p className="mt-2 text-sm text-[#94a3b8]">
                Observação, diálogo, tratamento e forma de aplicação.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <Link
            href="/casos"
            className="rounded-3xl border border-[#334155] bg-[#0f172a] p-8 transition hover:border-[#60a5fa] hover:bg-[#111827]"
          >
            <p className="text-sm font-black uppercase tracking-wide text-[#60a5fa]">
              Resolver casos
            </p>
            <h2 className="mt-3 text-3xl font-black text-white">Treinar decisão terapêutica</h2>
            <p className="mt-3 text-sm leading-relaxed text-[#94a3b8]">
              Casos clínicos com progressão visível, bloqueio contra finalização precoce
              e feedback detalhado.
            </p>
          </Link>

          <Link
            href="/aprender"
            className="rounded-3xl border border-[#334155] bg-[#0f172a] p-8 transition hover:border-[#facc15] hover:bg-[#111827]"
          >
            <p className="text-sm font-black uppercase tracking-wide text-[#facc15]">
              Aprender
            </p>
            <h2 className="mt-3 text-3xl font-black text-white">Rever fundamentos clínicos</h2>
            <p className="mt-3 text-sm leading-relaxed text-[#94a3b8]">
              Gestão de exsudado, antimicrobianos, leito da ferida, proteção peri-ferida
              e erros frequentes.
            </p>
          </Link>

          <Link
            href="/historico"
            className="rounded-3xl border border-[#334155] bg-[#0f172a] p-8 transition hover:border-[#ef4444] hover:bg-[#111827]"
          >
            <p className="text-sm font-black uppercase tracking-wide text-[#ef4444]">
              Histórico
            </p>
            <h2 className="mt-3 text-3xl font-black text-white">Acompanhar progresso</h2>
            <p className="mt-3 text-sm leading-relaxed text-[#94a3b8]">
              Melhor score, média por caso, domínios mais frágeis e temas que merecem
              reforço.
            </p>
          </Link>
        </section>

        <section className="rounded-[32px] border border-[#334155] bg-[#0f172a] p-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#facc15]">
            Sobre o projeto
          </p>
          <p className="mt-4 max-w-4xl text-sm leading-relaxed text-[#cbd5e1]">
            Criado no âmbito do Ensino Clínico de Consolidação de Competências da
            Licenciatura em Enfermagem da Escola Superior de Saúde da Universidade dos
            Açores, pelo estudante{" "}
            <span className="font-bold text-white">Rodrigo Marques Mendes</span>. Esta
            plataforma é uma ferramenta educativa e não substitui avaliação clínica
            supervisionada nem decisão terapêutica em contexto assistencial real.
          </p>
        </section>
      </div>
    </main>
  );
}
