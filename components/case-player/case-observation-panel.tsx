import Image from "next/image";
import type { CaseSession, ObservationId, ReviewStatus } from "@/lib/clinical";

function reviewButtonStyle(status: ReviewStatus, selected: boolean): React.CSSProperties {
  const base: React.CSSProperties = {
    width: "100%",
    textAlign: "left",
    justifyContent: "flex-start",
    padding: "var(--space-sm) var(--space-md)",
    borderRadius: "var(--radius-lg)",
    fontSize: "var(--text-body)",
    fontWeight: "var(--weight-medium)",
    cursor: "pointer",
    border: "0.5px solid",
    transition: "opacity 0.15s",
  };
  if (status === "correct") return { ...base, background: "var(--color-success-subtle)", borderColor: "var(--color-success-border)", color: "var(--color-text-primary)" };
  if (status === "incorrect") return { ...base, background: "var(--color-error-subtle)", borderColor: "var(--color-error-border)", color: "var(--color-text-primary)" };
  if (status === "missed") return { ...base, background: "var(--color-info-subtle)", borderColor: "var(--color-info-border)", color: "var(--color-text-primary)" };
  if (selected) return { ...base, background: "var(--color-info-subtle)", borderColor: "var(--color-info-border)", color: "var(--color-text-primary)" };
  return { ...base, background: "var(--color-elevated)", borderColor: "var(--color-border)", color: "var(--color-text-secondary)" };
}

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

  const visibleObservationIds = new Set(
    session.template.observationDefinitions
      .filter(
        (definition) =>
          definition.id !== "imagem" &&
          (observationIds.includes(definition.id) || reviewStatusById?.[definition.id] === "missed")
      )
      .map((definition) => definition.id)
  );

  const revealedObservations = session.template.observationDefinitions
    .filter((definition) => visibleObservationIds.has(definition.id))
    .map((definition) => ({
      definition,
      detail: session.variant.observationDetails[definition.id],
      status: reviewStatusById?.[definition.id] ?? null,
    }))
    .filter((item) => item.detail);

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
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--color-base)",
            borderRadius: "var(--radius-lg)",
            border: "var(--border-default)",
            overflow: "hidden",
            minHeight: "320px",
          }}
        >
          {imageSeen ? (
            <Image
              src={session.template.imageSrc}
              alt={session.template.imageAlt}
              width={1600}
              height={1200}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                borderRadius: "var(--radius-lg)",
              }}
            />
          ) : (
            <button
              type="button"
              onClick={() => onReveal("imagem")}
              style={{
                maxWidth: "24rem",
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

      {/* Coluna direita — botões + detalhes revelados por baixo */}
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

        {/* Botões de observação */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
          {session.template.observationDefinitions
            .filter((def) => def.id !== "imagem")
            .map((def) => {
              const revealed = observationIds.includes(def.id);
              const status = reviewStatusById?.[def.id] ?? null;
              return (
                <button
                  key={def.id}
                  type="button"
                  onClick={() => onReveal(def.id)}
                  style={reviewButtonStyle(status, revealed)}
                >
                  {def.prompt}
                </button>
              );
            })}
        </div>

        {/* Detalhes revelados — por baixo dos botões */}
        {revealedObservations.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
            {revealedObservations.map(({ definition, detail, status }) => (
              <div key={definition.id} style={reviewDetailStyle(status)}>
                <p className="text-label" style={{ color: "var(--color-info)" }}>
                  {definition.label}
                </p>
                <p className="text-body" style={{ marginTop: "var(--space-xs)" }}>
                  {detail.detail}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p
            className="text-body"
            style={{ color: "var(--color-text-disabled)" }}
          >
            Seleciona uma observação para ver o detalhe aqui.
          </p>
        )}
      </div>
    </div>
  );
}
