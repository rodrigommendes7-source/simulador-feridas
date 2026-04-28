"use client";

import type {
  JustificationAnswer,
  JustificationQuestion,
} from "@/lib/clinical/types";

type Props = {
  questions: JustificationQuestion[];
  answers: JustificationAnswer[];
  onAnswer: (treatmentId: string, optionId: string) => void;
};

export function CaseJustificationPanel({ questions, answers, onAnswer }: Props) {
  if (questions.length === 0) {
    return (
      <div style={{ padding: "var(--space-2xl)", textAlign: "center" }}>
        <p className="text-body" style={{ color: "var(--color-text-secondary)" }}>
          Não há materiais que requeiram justificação clínica nesta seleção.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        height: "100%",
        overflowY: "auto",
        padding: "var(--space-xl)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-lg)",
      }}
    >
      <div>
        <p className="text-label" style={{ color: "var(--color-accent)" }}>
          Justificação clínica
        </p>
        <p className="text-body" style={{ marginTop: "var(--space-xs)" }}>
          Para cada material que escolheste, indica qual é a razão clínica principal pela qual o aplicarias neste caso.
        </p>
      </div>

      {questions.map((question) => {
        const currentAnswer = answers.find((a) => a.treatmentId === question.treatmentId);
        return (
          <div
            key={question.treatmentId}
            className="card"
            style={{
              padding: "var(--space-lg)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-md)",
            }}
          >
            <p
              style={{
                fontSize: "var(--text-h3)",
                fontWeight: "var(--weight-medium)",
                color: "var(--color-text-primary)",
              }}
            >
              {question.treatmentLabel}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
              {question.options.map((opt) => {
                const isSelected = currentAnswer?.selectedOptionId === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onAnswer(question.treatmentId, opt.id)}
                    style={{
                      textAlign: "left",
                      padding: "var(--space-sm) var(--space-md)",
                      borderRadius: "var(--radius-md)",
                      border: isSelected
                        ? "0.5px solid var(--color-accent)"
                        : "var(--border-default)",
                      background: isSelected
                        ? "var(--color-accent-subtle)"
                        : "var(--color-elevated)",
                      cursor: "pointer",
                      fontSize: "var(--text-body)",
                      color: "var(--color-text-primary)",
                    }}
                  >
                    {opt.text}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
