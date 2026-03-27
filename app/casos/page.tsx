import Link from "next/link";
import { casosCatalogo } from "@/app/lib/casos";

function cardClass(status: "disponivel" | "preparacao") {
  if (status === "disponivel") {
    return "group rounded-2xl border border-[#1e293b] bg-[#0f172a] p-6 transition hover:border-[#3b82f6]";
  }

  return "rounded-2xl border border-dashed border-[#1e293b] bg-[#0f172a] p-6 opacity-70";
}

export default function CasosPage() {
  return (
    <main className="min-h-screen bg-[#0a0f1e] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#60a5fa]">
              Biblioteca clínica
            </p>
                        <h1 className="text-4xl font-bold text-white">Casos clínicos</h1>
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
            {casosCatalogo.map((caso) => {
              const statusDisponivel = caso.status === "disponivel";

            const content = (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <span
                    className={`inline-flex rounded-md px-3 py-1 text-xs font-medium ${
                      statusDisponivel
                        ? "bg-[#1e40af] text-white"
                        : "bg-[#1e293b] text-[#64748b]"
                    }`}
                  >
                    Caso {caso.id}
                  </span>
                  <span className="text-xs font-medium text-[#64748b]">
                    {statusDisponivel ? "Disponível" : "Em preparação"}
                  </span>
                </div>

                <h2 className="mb-3 text-xl font-semibold text-white">{caso.titulo}</h2>

                <p className="mb-4 text-sm leading-relaxed text-[#64748b]">{caso.descricao}</p>

                <div className="rounded-lg border border-[#1e293b] bg-[#0a0f1e] p-4">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#60a5fa]">
                    Competências
                  </p>
                  <p className="text-xs text-[#94a3b8]">{caso.competencias}</p>
                </div>
              </>
            );

            if (!statusDisponivel) {
              return (
                <div key={caso.id} className={cardClass(caso.status)}>
                  {content}
                </div>
              );
            }
            return (
              <Link
                key={caso.id}
                href={`/casos/${caso.id}`}
                className={cardClass(caso.status)}
              >
                {content}
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}