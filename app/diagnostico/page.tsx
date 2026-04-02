import Link from "next/link";
import { validateClinicalDomain } from "@/lib/clinical-validation";

export default function DiagnosticoPage() {
  const report = validateClinicalDomain();
  const errors = report.issues.filter((issue) => issue.level === "error");
  const warnings = report.issues.filter((issue) => issue.level === "warning");

  return (
    <main className="min-h-screen bg-[#0a0f1e] px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#60a5fa]">
              Diagnóstico técnico
            </p>
            <h1 className="mt-1 text-4xl font-black">Validação clínica</h1>
          </div>
          <div className="flex gap-3">
            <Link
              href="/"
              className="rounded-xl border border-[#334155] bg-[#111827] px-4 py-2 font-bold hover:bg-[#1f2937]"
            >
              Início
            </Link>
            <Link
              href="/casos"
              className="rounded-xl bg-[#1d4ed8] px-4 py-2 font-bold text-white hover:bg-[#2563eb]"
            >
              Casos
            </Link>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <aside className="rounded-[28px] border border-[#334155] bg-[#111827] p-5">
            <div className="space-y-4">
              <div className="rounded-2xl border border-[#334155] bg-[#0f172a] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#60a5fa]">
                  Estado geral
                </p>
                <p
                  className={`mt-2 text-2xl font-black ${
                    report.ok ? "text-[#22c55e]" : "text-[#ef4444]"
                  }`}
                >
                  {report.ok ? "Domínio válido" : "Existem erros"}
                </p>
              </div>

              <div className="rounded-2xl border border-[#334155] bg-[#0f172a] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#60a5fa]">
                  Erros
                </p>
                <p className="mt-2 text-3xl font-black text-white">{errors.length}</p>
              </div>

              <div className="rounded-2xl border border-[#334155] bg-[#0f172a] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#60a5fa]">
                  Avisos
                </p>
                <p className="mt-2 text-3xl font-black text-white">{warnings.length}</p>
              </div>
            </div>
          </aside>

          <section className="rounded-[28px] border border-[#334155] bg-[#111827] p-6">
            <h2 className="text-2xl font-black text-[#60a5fa]">Resultados da validação</h2>

            {report.issues.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-[#14532d] bg-[#052e16] p-5 text-[#dcfce7]">
                Não foram encontrados erros nem avisos no domínio clínico.
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                {report.issues.map((issue, index) => (
                  <div
                    key={`${issue.scope}-${index}`}
                    className={`rounded-2xl border p-4 ${
                      issue.level === "error"
                        ? "border-[#7f1d1d] bg-[#1f1111]"
                        : "border-[#78350f] bg-[#1c1917]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-black text-white">{issue.scope}</p>
                      <span
                        className={`rounded-md px-2 py-1 text-xs font-bold uppercase ${
                          issue.level === "error"
                            ? "bg-[#ef4444] text-white"
                            : "bg-[#f59e0b] text-black"
                        }`}
                      >
                        {issue.level}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-[#e2e8f0]">{issue.message}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
