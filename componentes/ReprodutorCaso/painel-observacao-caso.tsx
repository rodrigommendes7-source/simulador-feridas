import Image from "next/image";
import type { ModeloCaso, IdObservacao, EstadoRevisao } from "@/lib/clinico/indice";


function reviewDetailStyle(status: EstadoRevisao | null): React.CSSProperties {
  const base: React.CSSProperties = {
    borderRadius: "var(--radius-lg)",
    padding: "var(--space-md)",
    border: "0.5px solid",
  };
  if (status === "correto") return { ...base, background: "var(--color-success-subtle)", borderColor: "var(--color-success-border)" };
  if (status === "incorreto") return { ...base, background: "var(--color-error-subtle)", borderColor: "var(--color-error-border)" };
  return { ...base, background: "var(--color-info-subtle)", borderColor: "var(--color-info-border)" };
}

export function PainelObservacaoCaso({
  modelo,
  observationIds,
  estadoRevisaoPorId,
  modoRevisao = false,
  aoRevelar,
}: {
  modelo: ModeloCaso;
  observationIds: IdObservacao[];
  estadoRevisaoPorId?: Partial<Record<IdObservacao, EstadoRevisao>>;
  modoRevisao?: boolean;
  aoRevelar: (id: IdObservacao) => void;
}) {
  const imageSeen = modoRevisao || observationIds.includes("imagem");

  return (
    <div className="case-observation-grid">
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
                src={modelo.srcImagem}
                alt={modelo.altImagem}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{
                  objectFit: modelo.id === "3" ? "contain" : "cover",
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
              onClick={() => aoRevelar("imagem")}
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

        {modoRevisao ? (
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
              não foi selecionado.
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
          minHeight: 0,
          flex: 1,
        }}
      >
        <p className="text-label">Observação guiada</p>

        <div className="case-observation-slots">
          {modelo.definicoesObservacao
            .filter((def) => def.id !== "imagem")
            .map((def) => {
              const revealed =
                observationIds.includes(def.id) ||
                estadoRevisaoPorId?.[def.id] === "omitido";
              const status = estadoRevisaoPorId?.[def.id] ?? null;
              const detail = modelo.detalhesObservacao[def.id];

              if (revealed && detail) {
                return (
                  <div
                    key={def.id}
                    className="reveal-enter"
                    style={{
                      ...reviewDetailStyle(status),
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <p className="text-label" style={{ color: "var(--color-info)" }}>
                      {def.rotulo}
                    </p>
                    <p className="text-body" style={{ marginTop: "var(--space-xs)" }}>
                      {detail.detalhe}
                    </p>
                  </div>
                );
              }

              return (
                <button
                  key={def.id}
                  type="button"
                  onClick={() => aoRevelar(def.id)}
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
                  {def.instrucao}
                </button>
              );
            })}
        </div>
      </div>
    </div>
  );
}
