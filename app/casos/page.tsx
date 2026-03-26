import Link from "next/link";

export default function CasosPage() {
  return (
    <main className="min-h-screen bg-[#0a0f1e] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#60a5fa]">
              Biblioteca clínica
            </p>
            <h1 className="text-4xl font-bold text-white">
              Casos clínicos
            </h1>
          </div>

          <div className="flex gap-3">
            <Link
              href="/"
              className="rounded-lg border border-[#1e293b] bg-[#0f172a] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#1e293b]"
            >
              Página inicial
            </Link>

            <Link
              href="/historico"
              className="rounded-lg bg-[#2563eb] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#1d4ed8]"
            >
              Histórico
            </Link>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/casos/1"
            className="group rounded-2xl border border-[#1e293b] bg-[#0f172a] p-6 transition hover:border-[#3b82f6]"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="inline-flex rounded-md bg-[#1e40af] px-3 py-1 text-xs font-medium text-white">
                Caso 1
              </span>
              <span className="text-xs font-medium text-[#64748b]">Disponível</span>
            </div>

            <h2 className="mb-3 text-xl font-semibold text-white">
              Lesão por pressão
            </h2>

            <p className="mb-4 text-sm leading-relaxed text-[#64748b]">
              Avaliação de ferida, observação do leito, diálogo com o utente
              e seleção de abordagem terapêutica.
            </p>

            <div className="rounded-lg border border-[#1e293b] bg-[#0a0f1e] p-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#60a5fa]">
                Competências
              </p>
              <p className="text-xs text-[#94a3b8]">
                Observação, colheita de dados, escolha de penso e decisão clínica
              </p>
            </div>
          </Link>

          <Link
            href="/casos/2"
            className="group rounded-2xl border border-[#1e293b] bg-[#0f172a] p-6 transition hover:border-[#3b82f6]"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="inline-flex rounded-md bg-[#1e40af] px-3 py-1 text-xs font-medium text-white">
                Caso 2
              </span>
              <span className="text-xs font-medium text-[#64748b]">Disponível</span>
            </div>

            <h2 className="mb-3 text-xl font-semibold text-white">
              Ferida cirúrgica com deiscência
            </h2>

            <p className="mb-4 text-sm leading-relaxed text-[#64748b]">
              Avaliação de deiscência cirúrgica, suspeita de infeção local,
              gestão de exsudado e decisão terapêutica.
            </p>

            <div className="rounded-lg border border-[#1e293b] bg-[#0a0f1e] p-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#60a5fa]">
                Competências
              </p>
              <p className="text-xs text-[#94a3b8]">
                Infeção, exsudado, desbridamento e seleção de antimicrobianos
              </p>
            </div>
          </Link>

          <div className="rounded-2xl border border-dashed border-[#1e293b] bg-[#0f172a] p-6 opacity-60">
            <div className="mb-4 flex items-center justify-between">
              <span className="inline-flex rounded-md bg-[#1e293b] px-3 py-1 text-xs font-medium text-[#64748b]">
                Futuro
              </span>
              <span className="text-xs font-medium text-[#64748b]">Planeado</span>
            </div>

            <h2 className="mb-3 text-xl font-semibold text-white">
              Novos casos
            </h2>

            <p className="mb-4 text-sm leading-relaxed text-[#64748b]">
              Espaço para casos aleatórios, simulações específicas e histórico
              mais avançado.
            </p>

            <div className="rounded-lg border border-[#1e293b] bg-[#0a0f1e] p-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#60a5fa]">
                Ideia
              </p>
              <p className="text-xs text-[#94a3b8]">
                Biblioteca modular com vários níveis de dificuldade
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}