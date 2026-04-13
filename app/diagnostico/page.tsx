import Link from "next/link";
import { validateClinicalDomain } from "@/lib/clinical";

export default function DiagnosticoPage() {
  const report = validateClinicalDomain();
  const errors = report.issues.filter((issue) => issue.level === "error");
  const warnings = report.issues.filter((issue) => issue.level === "warning");

  return (
    <main style={{ display: "flex", flexDirection: "column", gap: "var(--space-2xl)" }}>

      {/* ── Cabeçalho ── */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "var(--space-md)",
        }}
      >
        <div>
          <p className="text-label" style={{ color: "var(--color-accent)" }}>Diagnóstico técnico</p>
          <h1
            style={{
              marginTop: "var(--space-xs)",
              fontSize: "var(--text-h1)",
              fontWeight: "var(--weight-medium)",
              color: "var(--color-text-primary)",
            }}
          >
            Validação clínica
          </h1>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <Link href="/" className="btn btn-secondary">Início</Link>
          <Link href="/casos" className="btn btn-primary">Casos</Link>
        </div>
      </div>

      {/* ── Grid principal ── */}
      <div className="grid lg:grid-cols-[280px_1fr]" style={{ gap: "var(--space-md)" }}>

        {/* Sidebar de estatísticas */}
        <aside
          style={{
            background: "var(--color-surface)",
            border: "var(--border-default)",
            borderRadius: "var(--radius-xl)",
            padding: "var(--space-lg)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-md)",
            alignSelf: "start",
          }}
        >
          <div
            style={{
              background: "var(--color-elevated)",
              border: "var(--border-default)",
              borderRadius: "var(--radius-lg)",
              padding: "var(--space-lg)",
            }}
          >
            <p className="text-label">Estado geral</p>
            <p
              style={{
                marginTop: "var(--space-sm)",
                fontSize: "var(--text-h2)",
                fontWeight: "var(--weight-medium)",
                color: report.ok ? "var(--color-success)" : "var(--color-error)",
              }}
            >
              {report.ok ? "Domínio válido" : "Existem erros"}
            </p>
          </div>

          <div
            style={{
              background: "var(--color-elevated)",
              border: "var(--border-default)",
              borderRadius: "var(--radius-lg)",
              padding: "var(--space-lg)",
            }}
          >
            <p className="text-label">Erros</p>
            <p
              style={{
                marginTop: "var(--space-sm)",
                fontSize: "var(--text-h1)",
                fontFamily: "var(--font-mono)",
                fontWeight: "var(--weight-medium)",
                color: "var(--color-text-primary)",
              }}
            >
              {errors.length}
            </p>
          </div>

          <div
            style={{
              background: "var(--color-elevated)",
              border: "var(--border-default)",
              borderRadius: "var(--radius-lg)",
              padding: "var(--space-lg)",
            }}
          >
            <p className="text-label">Avisos</p>
            <p
              style={{
                marginTop: "var(--space-sm)",
                fontSize: "var(--text-h1)",
                fontFamily: "var(--font-mono)",
                fontWeight: "var(--weight-medium)",
                color: "var(--color-text-primary)",
              }}
            >
              {warnings.length}
            </p>
          </div>
        </aside>

        {/* Resultados */}
        <section
          style={{
            background: "var(--color-surface)",
            border: "var(--border-default)",
            borderRadius: "var(--radius-xl)",
            padding: "var(--space-xl)",
          }}
        >
          <h2
            style={{
              fontSize: "var(--text-h2)",
              fontWeight: "var(--weight-medium)",
              color: "var(--color-info)",
            }}
          >
            Resultados da validação
          </h2>

          {report.issues.length === 0 ? (
            <div
              style={{
                marginTop: "var(--space-lg)",
                background: "var(--color-success-subtle)",
                border: "0.5px solid var(--color-success-border)",
                borderRadius: "var(--radius-xl)",
                padding: "var(--space-lg)",
              }}
            >
              <p className="text-body">
                Não foram encontrados erros nem avisos no domínio clínico.
              </p>
            </div>
          ) : (
            <div
              style={{
                marginTop: "var(--space-lg)",
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-sm)",
              }}
            >
              {report.issues.map((issue, index) => (
                <div
                  key={`${issue.scope}-${index}`}
                  style={
                    issue.level === "error"
                      ? {
                          background: "var(--color-error-subtle)",
                          border: "0.5px solid var(--color-error-border)",
                          borderRadius: "var(--radius-xl)",
                          padding: "var(--space-lg)",
                        }
                      : {
                          background: "var(--color-warning-subtle)",
                          border: "0.5px solid var(--color-warning-border)",
                          borderRadius: "var(--radius-xl)",
                          padding: "var(--space-lg)",
                        }
                  }
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "var(--space-sm)",
                    }}
                  >
                    <p style={{ fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)" }}>
                      {issue.scope}
                    </p>
                    <span
                      style={
                        issue.level === "error"
                          ? {
                              background: "var(--color-error)",
                              color: "#fff",
                              borderRadius: "var(--radius-md)",
                              padding: "2px var(--space-sm)",
                              fontSize: "var(--text-label)",
                              fontWeight: "var(--weight-medium)",
                              textTransform: "uppercase",
                              letterSpacing: "var(--tracking-label)",
                            }
                          : {
                              background: "var(--color-warning)",
                              color: "#000",
                              borderRadius: "var(--radius-md)",
                              padding: "2px var(--space-sm)",
                              fontSize: "var(--text-label)",
                              fontWeight: "var(--weight-medium)",
                              textTransform: "uppercase",
                              letterSpacing: "var(--tracking-label)",
                            }
                      }
                    >
                      {issue.level}
                    </span>
                  </div>
                  <p className="text-body" style={{ marginTop: "var(--space-xs)" }}>
                    {issue.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
