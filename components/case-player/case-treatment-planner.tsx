"use client";

import { useMemo, useState } from "react";
import type { ApplicationId, CaseTemplate, ReviewStatus } from "@/lib/clinical";
import { getTreatment, listTreatments } from "@/lib/clinical";

function reviewCardStyle(status: ReviewStatus, selected: boolean): React.CSSProperties {
  const base: React.CSSProperties = {
    display: "flex",
    alignItems: "flex-start",
    gap: "var(--space-sm)",
    borderRadius: "var(--radius-lg)",
    padding: "var(--space-md)",
    border: "0.5px solid",
    cursor: "pointer",
    transition: "opacity 0.15s",
  };
  if (status === "correct") return { ...base, background: "var(--color-success-subtle)", borderColor: "var(--color-success-border)" };
  if (status === "incorrect") return { ...base, background: "var(--color-error-subtle)", borderColor: "var(--color-error-border)" };
  if (status === "missed") return { ...base, background: "var(--color-info-subtle)", borderColor: "var(--color-info-border)" };
  if (selected) return { ...base, background: "var(--color-info-subtle)", borderColor: "var(--color-info-border)" };
  return { ...base, background: "var(--color-elevated)", borderColor: "var(--color-border)" };
}

export function CaseTreatmentPlanner({
  template,
  treatmentIds,
  applicationIds,
  treatmentStatusById,
  applicationStatusById,
  reviewMode = false,
  onToggleTreatment,
  onToggleApplication,
}: {
  template: CaseTemplate;
  treatmentIds: string[];
  applicationIds: ApplicationId[];
  treatmentStatusById?: Record<string, ReviewStatus>;
  applicationStatusById?: Partial<Record<ApplicationId, ReviewStatus>>;
  reviewMode?: boolean;
  onToggleTreatment: (id: string) => void;
  onToggleApplication: (id: ApplicationId) => void;
}) {
  const [labelMode, setLabelMode] = useState<"nome_comercial" | "substancia_ativa">(
    "substancia_ativa"
  );

  const groupedTreatments = useMemo(() => {
    const visible = listTreatments();

    const CATEGORY_ORDER = ["Apósito", "Líquidos", "Pomadas", "Outros"];
    const grouped = visible.reduce<Record<string, typeof visible>>((acc, treatment) => {
      if (!acc[treatment.category]) acc[treatment.category] = [];
      acc[treatment.category].push(treatment);
      return acc;
    }, {});
    return Object.fromEntries(
      CATEGORY_ORDER
        .filter((cat) => cat in grouped)
        .concat(Object.keys(grouped).filter((cat) => !CATEGORY_ORDER.includes(cat)))
        .map((cat) => [cat, grouped[cat]])
    );
  }, []);

  function getTreatmentDisplayLabel(treatment: ReturnType<typeof getTreatment>) {
    if (!treatment) return "";
    if (labelMode === "substancia_ativa") return treatment.substancia_ativa ?? treatment.label;
    return treatment.nome_comercial ?? treatment.label;
  }

  return (
    <div className="case-treatment-grid">
      {/* Coluna esquerda — catálogo */}
      <div
        className="card"
        style={{
          padding: "var(--space-lg)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Cabeçalho */}
        <div
          style={{
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-sm)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "var(--space-sm)",
            }}
          >
            <p className="text-label">Plano terapêutico</p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "var(--color-elevated)",
                border: "var(--border-default)",
                borderRadius: "var(--radius-lg)",
                padding: "2px",
                fontSize: "var(--text-label)",
                fontWeight: "var(--weight-medium)",
              }}
            >
              <button
                type="button"
                onClick={() => setLabelMode("nome_comercial")}
                style={{
                  borderRadius: "var(--radius-md)",
                  padding: "var(--space-xs) var(--space-sm)",
                  background: labelMode === "nome_comercial" ? "var(--color-accent)" : "transparent",
                  color: labelMode === "nome_comercial" ? "var(--color-base)" : "var(--color-text-secondary)",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                Nome comercial
              </button>
              <button
                type="button"
                onClick={() => setLabelMode("substancia_ativa")}
                style={{
                  borderRadius: "var(--radius-md)",
                  padding: "var(--space-xs) var(--space-sm)",
                  background: labelMode === "substancia_ativa" ? "var(--color-accent)" : "transparent",
                  color: labelMode === "substancia_ativa" ? "var(--color-base)" : "var(--color-text-secondary)",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                Substância ativa
              </button>
            </div>
          </div>

          {reviewMode ? (
            <p
              className="text-body"
              style={{
                padding: "var(--space-sm) var(--space-md)",
                background: "var(--color-elevated)",
                border: "var(--border-default)",
                borderRadius: "var(--radius-md)",
                color: "var(--color-text-secondary)",
              }}
            >
              Verde: correto · Vermelho: desnecessário · Azul claro: em falta.
            </p>
          ) : null}
        </div>

        {/* Categorias com scroll */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            marginTop: "var(--space-md)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-sm)",
          }}
        >
          {Object.entries(groupedTreatments).map(([category, items]) => (
            <div
              key={category}
              style={{
                background: "var(--color-elevated)",
                border: "var(--border-default)",
                borderRadius: "var(--radius-xl)",
                padding: "var(--space-md)",
              }}
            >
              <p
                className="text-label"
                style={{ color: "var(--color-accent)" }}
              >
                {category}
              </p>
              <div
                style={{
                  marginTop: "var(--space-sm)",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 220px), 1fr))",
                  gap: "var(--space-sm)",
                }}
              >
                {items.map((treatment) => {
                  const selected = treatmentIds.includes(treatment.id);
                  const status = treatmentStatusById?.[treatment.id] ?? null;
                  const displayLabel = getTreatmentDisplayLabel(treatment);

                  return (
                    <label
                      key={treatment.id}
                      style={reviewCardStyle(status, selected)}
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => onToggleTreatment(treatment.id)}
                        disabled={reviewMode}
                        style={{ marginTop: "2px", flexShrink: 0, width: "14px", height: "14px" }}
                      />
                      <span style={{ minWidth: 0 }}>
                        <span
                          style={{
                            display: "block",
                            fontWeight: "var(--weight-medium)",
                            color: "var(--color-text-primary)",
                            fontSize: "var(--text-body)",
                            wordBreak: "break-word",
                          }}
                        >
                          {displayLabel}
                        </span>
                        <span
                          style={{
                            display: "block",
                            marginTop: "2px",
                            fontSize: "var(--text-label)",
                            color: "var(--color-text-disabled)",
                            wordBreak: "break-word",
                          }}
                        >
                          {labelMode === "nome_comercial"
                            ? (treatment.substancia_ativa ?? treatment.label)
                            : (treatment.nome_comercial ?? treatment.label)}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Coluna direita — seleção e técnica */}
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)", overflowY: "auto" }}>
        {/* Materiais escolhidos */}
        <div className="card" style={{ padding: "var(--space-lg)" }}>
          <p className="text-label" style={{ color: "var(--color-warning)" }}>
            Materiais escolhidos
          </p>
          <div
            style={{
              marginTop: "var(--space-md)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-xs)",
            }}
          >
            {treatmentIds.length > 0 ? (
              treatmentIds.map((treatmentId) => {
                const treatment = getTreatment(treatmentId);
                const status = treatmentStatusById?.[treatmentId] ?? null;
                const displayLabel = getTreatmentDisplayLabel(treatment);

                return (
                  <div
                    key={treatmentId}
                    style={{
                      ...reviewCardStyle(status, true),
                      display: "block",
                      padding: "var(--space-xs) var(--space-sm)",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: "var(--weight-medium)",
                        color: "var(--color-text-primary)",
                        fontSize: "var(--text-body)",
                      }}
                    >
                      {displayLabel}
                    </span>
                    {treatment && (
                      <span
                        style={{
                          marginLeft: "var(--space-xs)",
                          fontSize: "var(--text-label)",
                          color: "var(--color-text-disabled)",
                        }}
                      >
                        {labelMode === "nome_comercial"
                          ? (treatment.substancia_ativa ?? "")
                          : (treatment.nome_comercial ?? "")}
                      </span>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-body" style={{ color: "var(--color-text-disabled)" }}>
                Ainda não selecionaste materiais.
              </p>
            )}
          </div>
        </div>

        {/* Técnica de aplicação */}
        <div className="card" style={{ padding: "var(--space-lg)" }}>
          <p className="text-label" style={{ color: "var(--color-info)" }}>
            Técnica de aplicação
          </p>
          <div
            style={{
              marginTop: "var(--space-md)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-sm)",
            }}
          >
            {template.applicationOptions.map((applicationId) => {
              const definition = template.applicationDefinitions.find(
                (item) => item.id === applicationId
              );
              const selected = applicationIds.includes(applicationId);
              const status = applicationStatusById?.[applicationId] ?? null;

              return (
                <label key={applicationId} style={reviewCardStyle(status, selected)}>
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => onToggleApplication(applicationId)}
                    disabled={reviewMode}
                    style={{ marginTop: "2px", flexShrink: 0, width: "14px", height: "14px" }}
                  />
                  <span
                    style={{
                      fontSize: "var(--text-body)",
                      fontWeight: "var(--weight-medium)",
                      color: "var(--color-text-primary)",
                    }}
                  >
                    {definition?.label}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
