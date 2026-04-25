import Image from "next/image";
import type { CaseSession, ObservationId, ReviewStatus } from "@/lib/clinical";


function reviewDetailStyle(status: ReviewStatus | null): React.CSSProperties {
  const base: React.CSSProperties = {
    borderRadius: "var(--radius-lg)",
    padding: "var(--space-md)",
    border: "0.5px solid",
  };
  if (status === "correct") return { ...base, background: "var(--color-success-subtle)", borderColor: "var(--color-success-border)" };
  if (status === "incorrect") return { ...base, background: "var(--color-error-subtle)", borderColor: "var(--color-error-border)" };
  return { ...base, background: "var(--color-info-subtle)", borderColor: "var(--color-info-border)" };
}

export function CaseObservationPanel({
  session,
  observationIds,
  reviewStatusById,
  reviewMode = false,
  onReveal,
}: {
  session: CaseSession;
  observationIds: ObservationId[];
  reviewStatusById?: Partial<Record<ObservationId, ReviewStatus>>;
  reviewMode?: boolean;
  onReveal: (id: ObservationId) => void;
}) {
  const imageSeen = reviewMode || observationIds.includes("imagem");

  return (
    <div
      style={{
        display: "grid",
        height: "100%",
        gap: "var(--space-md)",
        gridTemplateColumns: "1.2fr 0.8fr",
      }}
    >
      {/* Coluna esquerda — imagem */}
      <div
        className="card"
        style={{ padding: "var(--space-lg)", display: "flex", flexDirection: "column" }}
      >
        <div
          style={{
            flex: 1,
            position: "relative",
            background: "var(--color-base)",
            borderRadius: "var(--radius-lg)",
            border: "var(--border-default)",
            overflow: "hidden",
            minHeight: "320px",
          }}
        >
          {imageSeen ? (
            <>
              <Image
                src={session.template.imageSrc}
                alt={session.template.imageAlt}
                fill
                style={{
                  objectFit: session.template.id === "3" ? "contain" : "cover",
                  borderRadius: "var(--radius-lg)",
                }}
              />
              <p style={{ position: "absolute", bottom: 0, left: 0, right: 0, margin: 0, padding: "4px var(--space-sm)", fontSize: "10px", color: "rgba(255,255,255,0.75)", background: "rgba(0,0,0,0.45)", textAlign: "right", borderBottomLeftRadius: "var(--radius-lg)", borderBottomRightRadius: "var(--radius-lg)" }}>
                © Medetec Medical Images — medetec.co.uk
              </p>
            </>
          ) : (
            <button
              type="button"
              onClick={() => onReveal("imagem")}
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                maxWidth: "100%",
                textAlign: "center",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "var(--text-body)",
                fontWeight: "var(--weight-medium)",
                color: "var(--color-text-secondary)",
                padding: "var(--space-xl)",
              }}
            >
              Seleciona{" "}
              <span style={{ color: "var(--color-info)", textDecoration: "underline" }}>
                Ver imagem da ferida
              </span>{" "}
              para abrir a fotografia clínica.
            </button>
          )}
        </div>

        {reviewMode ? (
          <div
            className="card"
            style={{ marginTop: "var(--space-md)", padding: "var(--space-md)" }}
          >
            <p
              style={{ fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)" }}
            >
              Legenda da revisão
            </p>
            <p className="text-body" style={{ marginTop: "var(--space-xs)" }}>
              Verde: observação correta. Vermelho: escolha desnecessária ou errada. Azul claro:
              faltou selecionar.
            </p>
          </div>
        ) : null}
      </div>

      {/* Coluna direita — grelha de slots de observação */}
      <div
        className="card"
        style={{
          padding: "var(--space-lg)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-md)",
          overflowY: "auto",
        }}
      >
        <p className="text-label">Observação guiada</p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "var(--space-sm)",
          }}
        >
          {session.template.observationDefinitions
            .filter((def) => def.id !== "imagem")
            .map((def) => {
              const revealed =
                observationIds.includes(def.id) ||
                reviewStatusById?.[def.id] === "missed";
              const status = reviewStatusById?.[def.id] ?? null;
              const detail = session.variant.observationDetails[def.id];

              if (revealed && detail) {
                return (
                  <div
                    key={def.id}
                    style={{
                      ...reviewDetailStyle(status),
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <p className="text-label" style={{ color: "var(--color-info)" }}>
                      {def.label}
                    </p>
                    <p className="text-body" style={{ marginTop: "var(--space-xs)" }}>
                      {detail.detail}
                    </p>
                  </div>
                );
              }

              return (
                <button
                  key={def.id}
                  type="button"
                  onClick={() => onReveal(def.id)}
                  style={{
                    borderRadius: "var(--radius-lg)",
                    padding: "var(--space-md)",
                    border: "0.5px solid var(--color-border)",
                    background: "var(--color-elevated)",
                    color: "var(--color-text-secondary)",
                    fontSize: "var(--text-body)",
                    fontWeight: "var(--weight-medium)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    textAlign: "left",
                    transition: "border-color 150ms ease, background 150ms ease",
                  }}
                >
                  {def.prompt}
                </button>
              );
            })}
        </div>
      </div>
    </div>
  );
}
