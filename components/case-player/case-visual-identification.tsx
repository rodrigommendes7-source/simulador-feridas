"use client";

import {
  VISUAL_EDGE_OPTIONS,
  VISUAL_EXUDATE_OPTIONS,
  VISUAL_TISSUE_OPTIONS,
} from "@/data/clinical/visualOptions";
import type {
  VisualEdgeOption,
  VisualExudateOption,
  VisualIdentificationSubmission,
  VisualTissueOption,
} from "@/lib/clinical/types";

type Props = {
  submission: VisualIdentificationSubmission;
  onChange: (next: VisualIdentificationSubmission) => void;
};

function toggle<T extends string>(arr: T[], value: T): T[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

function CheckboxGroup<T extends string>({
  label,
  options,
  selected,
  note,
  onToggle,
}: {
  label: string;
  options: { id: T; label: string; description?: string }[];
  selected: T[];
  note?: string;
  onToggle: (id: T) => void;
}) {
  return (
    <div
      style={{
        background: "var(--color-surface)",
        border: "var(--border-default)",
        borderRadius: "var(--radius-lg)",
        padding: "var(--space-lg)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-sm)",
      }}
    >
      <p
        style={{
          fontSize: "var(--text-body)",
          fontWeight: "var(--weight-medium)",
          color: "var(--color-text-primary)",
        }}
      >
        {label}
      </p>
      {note && (
        <p
          style={{
            fontSize: "var(--text-label)",
            color: "var(--color-info)",
            background: "var(--color-info-subtle)",
            border: "0.5px solid var(--color-info-border)",
            borderRadius: "var(--radius-md)",
            padding: "var(--space-xs) var(--space-sm)",
          }}
        >
          {note}
        </p>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
        {options.map((opt) => {
          const isSelected = selected.includes(opt.id);
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onToggle(opt.id)}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "var(--space-sm)",
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
                width: "100%",
              }}
            >
              <span
                style={{
                  flexShrink: 0,
                  width: "16px",
                  height: "16px",
                  marginTop: "2px",
                  borderRadius: "var(--radius-xs)",
                  border: isSelected
                    ? "2px solid var(--color-accent)"
                    : "1.5px solid var(--color-border-strong)",
                  background: isSelected ? "var(--color-accent)" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {isSelected && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <span>
                <span
                  style={{
                    fontSize: "var(--text-body)",
                    fontWeight: isSelected ? "var(--weight-medium)" : undefined,
                    color: "var(--color-text-primary)",
                  }}
                >
                  {opt.label}
                </span>
                {opt.description && (
                  <span
                    style={{
                      display: "block",
                      fontSize: "var(--text-label)",
                      color: "var(--color-text-secondary)",
                      marginTop: "1px",
                    }}
                  >
                    {opt.description}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function CaseVisualIdentification({ submission, onChange }: Props) {
  return (
    <div
      style={{
        height: "100%",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-md)",
        padding: "var(--space-xs)",
      }}
    >
      <div>
        <p
          style={{
            fontSize: "var(--text-label)",
            fontWeight: "var(--weight-medium)",
            color: "var(--color-accent)",
            textTransform: "uppercase",
            letterSpacing: "var(--tracking-label)",
          }}
        >
          Identificação visual
        </p>
        <p className="text-body" style={{ marginTop: "var(--space-xs)", color: "var(--color-text-secondary)" }}>
          Com base na imagem que observaste, seleciona o que identificas em cada categoria. Podes selecionar zero ou várias opções.
        </p>
      </div>

      <CheckboxGroup<VisualTissueOption>
        label="Tecidos presentes no leito"
        options={VISUAL_TISSUE_OPTIONS}
        selected={submission.tissues}
        onToggle={(id) => onChange({ ...submission, tissues: toggle(submission.tissues, id) })}
      />

      <CheckboxGroup<VisualExudateOption>
        label="Tipo de exsudado"
        options={VISUAL_EXUDATE_OPTIONS}
        selected={submission.exudate}
        note="Para combinações como hematicoseroso, seleciona ambos."
        onToggle={(id) => onChange({ ...submission, exudate: toggle(submission.exudate, id) })}
      />

      <CheckboxGroup<VisualEdgeOption>
        label="Bordos e pele perilesional"
        options={VISUAL_EDGE_OPTIONS}
        selected={submission.edges}
        onToggle={(id) => onChange({ ...submission, edges: toggle(submission.edges, id) })}
      />

    </div>
  );
}
