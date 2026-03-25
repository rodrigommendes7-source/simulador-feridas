import Link from "next/link";

export default function CasosPage() {
  return (
    <main className="min-h-screen bg-[#0b1220] px-6 py-8 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#3b82f6]">
              Biblioteca clínica
            </p>
            <h1 className="mt-2 text-4xl font-black text-[#f8fafc]">
              Casos clínicos
            </h1>
          </div>

          <div className="flex gap-3">
            <Link
              href="/"
              className="rounded-2xl border border-[#334155] bg-white px-5 py-3 font-black text-[#0f172a] hover:bg-[#f8fafc]"
            >
              Página inicial
            </Link>

            <Link
              href="/historico"
              className="rounded-2xl bg-[#facc15] px-5 py-3 font-black text-[#0f172a] hover:bg-[#fde047]"
            >
              Histórico
            </Link>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <Link
            href="/casos/1"
            className="rounded-[28px] border border-[#334155] bg-[#111827] p-6 shadow-2xl transition hover:-translate-y-1 hover:border-[#3b82f6]"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="rounded-full bg-[#3b82f6] px-3 py-1 text-xs font-black uppercase tracking-wide text-white">
                Caso 1
              </span>
              <span className="text-sm font-bold text-[#94a3b8]">Disponível</span>
            </div>

            <h2 className="text-2xl font-black text-[#f8fafc]">
              Lesão por pressão
            </h2>

            <p className="mt-3 text-base leading-relaxed text-[#cbd5e1]">
              Avaliação de ferida, observação do leito, diálogo com o utente
              e seleção de abordagem terapêutica.
            </p>

            <div className="mt-5 rounded-2xl border border-[#334155] bg-[#0f172a] p-4">
              <p className="text-sm font-bold uppercase tracking-wide text-[#3b82f6]">
                Competências
              </p>
              <p className="mt-2 text-sm font-semibold text-white">
                Observação, colheita de dados, escolha de penso e decisão clínica
              </p>
            </div>
          </Link>

         <Link
  href="/casos/2"
  className="rounded-[28px] border border-[#334155] bg-[#111827] p-6 shadow-2xl transition hover:-translate-y-1 hover:border-[#3b82f6]"
>
  <div className="mb-4 flex items-center justify-between">
    <span className="rounded-full bg-[#3b82f6] px-3 py-1 text-xs font-black uppercase tracking-wide text-white">
      Caso 2
    </span>
    <span className="text-sm font-bold text-[#94a3b8]">Disponível</span>
  </div>

  <h2 className="text-2xl font-black text-[#f8fafc]">
    Ferida cirúrgica com deiscência
  </h2>

  <p className="mt-3 text-base leading-relaxed text-[#cbd5e1]">
    Avaliação de deiscência cirúrgica, suspeita de infeção local,
    gestão de exsudado e decisão terapêutica.
  </p>

  <div className="mt-5 rounded-2xl border border-[#334155] bg-[#0f172a] p-4">
    <p className="text-sm font-bold uppercase tracking-wide text-[#3b82f6]">
      Competências
    </p>
    <p className="mt-2 text-sm font-semibold text-white">
      Infeção, exsudado, desbridamento e seleção de antimicrobianos
    </p>
  </div>
</Link>

          <div className="rounded-[28px] border border-dashed border-[#334155] bg-[#111827] p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <span className="rounded-full bg-[#0f172a] px-3 py-1 text-xs font-black uppercase tracking-wide text-[#cbd5e1]">
                Futuro
              </span>
              <span className="text-sm font-bold text-[#94a3b8]">Planeado</span>
            </div>

            <h2 className="text-2xl font-black text-[#f8fafc]">
              Novos casos
            </h2>

            <p className="mt-3 text-base leading-relaxed text-[#cbd5e1]">
              Espaço para casos aleatórios, simulações específicas e histórico
              mais avançado.
            </p>

            <div className="mt-5 rounded-2xl border border-[#334155] bg-[#0f172a] p-4">
              <p className="text-sm font-bold uppercase tracking-wide text-[#3b82f6]">
                Ideia
              </p>
              <p className="mt-2 text-sm font-semibold text-white">
                Biblioteca modular com vários níveis de dificuldade
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}