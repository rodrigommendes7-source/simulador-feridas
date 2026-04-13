import type { CaseSession } from "@/lib/clinical";

export function CaseIntro({
  session,
  onStart,
}: {
  session: CaseSession;
  onStart: () => void;
}) {
  return (
    <div
      className="card"
      style={{
        textAlign: "center",
        padding: "var(--space-3xl)",
        maxWidth: "48rem",
        margin: "var(--space-3xl) auto",
      }}
    >
      <p className="text-label" style={{ color: "var(--color-accent)" }}>
        Caso clínico
      </p>
      <h1
        style={{
          marginTop: "var(--space-sm)",
          fontSize: "var(--text-h1)",
          fontWeight: "var(--weight-medium)",
          color: "var(--color-text-primary)",
        }}
      >
        {session.template.shortTitle} · {session.template.title}
      </h1>
      <p
        className="text-body"
        style={{ marginTop: "var(--space-md)", maxWidth: "40rem", margin: "var(--space-md) auto 0" }}
      >
        {session.template.introSummary}
      </p>

      <div className="card" style={{ textAlign: "left", marginTop: "var(--space-lg)" }}>
        <p className="text-label" style={{ color: "var(--color-warning)" }}>
          Contexto clínico
        </p>
        <p className="text-body" style={{ marginTop: "var(--space-sm)" }}>
          {session.variant.patientContext}
        </p>
      </div>

      <div className="card" style={{ textAlign: "left", marginTop: "var(--space-md)" }}>
        <p className="text-label" style={{ color: "var(--color-info)" }}>
          Objetivo
        </p>
        <p className="text-body" style={{ marginTop: "var(--space-sm)" }}>
          {session.template.objective}
        </p>
      </div>

      <button
        type="button"
        onClick={onStart}
        className="btn btn-primary"
        style={{ marginTop: "var(--space-2xl)" }}
      >
        Iniciar caso
      </button>
    </div>
  );
}
