import type { CaseTemplate, DialogueId, ReviewStatus } from "@/lib/clinical";

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

export function CaseDialoguePanel({
  template,
  dialogueIds,
  activeDialogueId,
  reviewStatusById,
  reviewMode = false,
  onAsk,
}: {
  template: CaseTemplate;
  dialogueIds: DialogueId[];
  activeDialogueId: DialogueId | null;
  reviewStatusById?: Partial<Record<DialogueId, ReviewStatus>>;
  reviewMode?: boolean;
  onAsk: (id: DialogueId) => void;
}) {
  return (
    <div className="case-dialogue-grid">
      {/* Coluna esquerda — perguntas */}
      <div
        className="card"
        style={{
          padding: "var(--space-lg)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <p className="text-label" style={{ flexShrink: 0 }}>
          Perguntas clínicas
        </p>
        <div
          style={{
            marginTop: "var(--space-md)",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-xs)",
            overflowY: "auto",
          }}
        >
          {template.dialoguePrompts.map((prompt) => {
            const asked = dialogueIds.includes(prompt.id);
            const status = reviewStatusById?.[prompt.id] ?? null;
            return (
              <button
                key={prompt.id}
                type="button"
                onClick={() => onAsk(prompt.id)}
                style={reviewButtonStyle(status, asked)}
              >
                {prompt.label}
              </button>
            );
          })}
        </div>
        <p
          className="text-body"
          style={{
            flexShrink: 0,
            marginTop: "var(--space-md)",
            padding: "var(--space-sm) var(--space-md)",
            background: "var(--color-elevated)",
            border: "var(--border-default)",
            borderRadius: "var(--radius-md)",
            color: "var(--color-text-secondary)",
          }}
        >
          {reviewMode
            ? "As perguntas assinaladas a azul eram úteis e não foram selecionadas."
            : dialogueIds.length > 0
              ? `Já exploraste ${dialogueIds.length} pergunta(s) desta variante.`
              : "Ainda não iniciaste o diálogo clínico."}
        </p>
      </div>

      {/* Coluna direita — resposta */}
      <div
        className="card"
        style={{ padding: "var(--space-lg)", overflowY: "auto" }}
      >
        {activeDialogueId ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
            <div
              style={{
                background: "var(--color-info-subtle)",
                border: "0.5px solid var(--color-info-border)",
                borderRadius: "var(--radius-xl)",
                padding: "var(--space-lg)",
              }}
            >
              <p className="text-label" style={{ color: "var(--color-info)" }}>Tu</p>
              <p
                style={{
                  marginTop: "var(--space-sm)",
                  fontSize: "var(--text-h3)",
                  fontWeight: "var(--weight-medium)",
                  color: "var(--color-text-primary)",
                }}
              >
                {template.dialoguePrompts.find((p) => p.id === activeDialogueId)?.question}
              </p>
            </div>
            <div
              style={{
                background: "var(--color-success-subtle)",
                border: "0.5px solid var(--color-success-border)",
                borderRadius: "var(--radius-xl)",
                padding: "var(--space-lg)",
              }}
            >
              <p className="text-label" style={{ color: "var(--color-success)" }}>Utente</p>
              <p
                style={{
                  marginTop: "var(--space-sm)",
                  fontSize: "var(--text-h3)",
                  fontWeight: "var(--weight-medium)",
                  color: "var(--color-text-primary)",
                }}
              >
                {template.dialogueResponses[activeDialogueId]}
              </p>
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              minHeight: "280px",
              alignItems: "center",
              justifyContent: "center",
              border: "1px dashed var(--color-border)",
              borderRadius: "var(--radius-xl)",
              textAlign: "center",
            }}
          >
            <p
              className="text-body"
              style={{ color: "var(--color-text-disabled)", maxWidth: "20rem" }}
            >
              Seleciona uma pergunta para iniciar o diálogo clínico.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
