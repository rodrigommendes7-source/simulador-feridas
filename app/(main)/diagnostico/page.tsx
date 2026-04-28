import { redirect } from "next/navigation";
import { validateClinicalDomain } from "@/lib/clinical";

export default function DiagnosticoPage() {
  redirect("/");
  const report = validateClinicalDomain();
  const errors = report.issues.filter((issue) => issue.level === "error");
  const warnings = report.issues.filter((issue) => issue.level === "warning");

  return (
    <main style={{ display: "flex", flexDirection: "column", gap: "var(--space-2xl)" }}>

      {/* ── Cabeçalho ── */}
      <section className="card">
        <p className="text-label">Diagnóstico técnico</p>
        <h1
          style={{
            marginTop: "var(--space-sm)",
            fontSize: "var(--text-h1)",
            fontWeight: "var(--weight-medium)",
            color: "var(--color-text-primary)",
          }}
        >
          Validação clínica
        </h1>
        <p className="text-body" style={{ marginTop: "var(--space-sm)", maxWidth: "48rem" }}>
          Verifica a integridade do domínio clínico: referências cruzadas entre casos, tratamentos e tópicos pedagógicos.
        </p>
      </section>

      {/* ── Grid principal ── */}
      <div className="grid lg:grid-cols-[280px_1fr]" style={{ gap: "var(--space-md)" }}>

        {/* Sidebar de estatísticas */}
        <aside
          className="card"
          style={{
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
                color: errors.length > 0 ? "var(--color-error)" : "var(--color-text-primary)",
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
                color: warnings.length > 0 ? "var(--color-warning)" : "var(--color-text-primary)",
              }}
            >
              {warnings.length}
            </p>
          </div>
        </aside>

        {/* Resultados */}
        <section className="card">
          <p className="text-label" style={{ color: "var(--color-info)" }}>Resultados</p>
          <h2
            style={{
              marginTop: "var(--space-xs)",
              fontSize: "var(--text-h2)",
              fontWeight: "var(--weight-medium)",
              color: "var(--color-text-primary)",
            }}
          >
            Validação do domínio
          </h2>

          {report.issues.length === 0 ? (
            <div
              style={{
                marginTop: "var(--space-lg)",
                background: "var(--color-success-subtle)",
                border: "0.5px solid var(--color-success-border)",
                borderRadius: "var(--radius-lg)",
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
                          borderRadius: "var(--radius-lg)",
                          padding: "var(--space-lg)",
                        }
                      : {
                          background: "var(--color-warning-subtle)",
                          border: "0.5px solid var(--color-warning-border)",
                          borderRadius: "var(--radius-lg)",
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
                      className={issue.level === "error" ? "badge badge-avance" : "badge badge-inter"}
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
