"use client";

import { useRef, useState } from "react";
import {
  VISUAL_EDGE_OPTIONS,
  VISUAL_EXUDATE_OPTIONS,
  VISUAL_TISSUE_OPTIONS,
} from "@/data/clinico/visualOptions";
import {
  annotatableTissueDisplay,
  tissueValueToAnnotatableType,
} from "@/lib/clinico/display-ferida";
import type {
  TipoTecidoAnotavel,
  MarcadorTecido,
  OpcaoBordosVisual,
  OpcaoExsudadoVisual,
  SubmissaoIdentificacaoVisual,
  OpcaoTecidoVisual,
  ZonaTecido,
  ObjetivosIdentificacaoVisual,
} from "@/lib/clinico/types";

type Props = {
  submission: SubmissaoIdentificacaoVisual;
  onChange: (next: SubmissaoIdentificacaoVisual) => void;
  imageSrc: string;
  tissuePins: MarcadorTecido[];
  onAddPin: (pin: MarcadorTecido) => void;
  onRemovePin: (pinId: string) => void;
  hasTissueZones: boolean;
  modoRevisao?: boolean;
  zonasTecido?: ZonaTecido[];
  objetivosVisuais?: ObjetivosIdentificacaoVisual;
};

function toggle<T extends string>(arr: T[], value: T): T[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

function CheckboxGroup<T extends string>({
  label,
  options,
  selected,
  correctOptions,
  modoRevisao,
  note,
  onToggle,
}: {
  label: string;
  options: { id: T; rotulo: string; descricao?: string }[];
  selected: T[];
  correctOptions?: T[];
  modoRevisao?: boolean;
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
          const isCorrect = correctOptions?.includes(opt.id);

          let containerBorder = isSelected ? "0.5px solid var(--color-accent)" : "var(--border-default)";
          let containerBg = isSelected ? "var(--color-accent-subtle)" : "var(--color-elevated)";
          let checkBg = isSelected ? "var(--color-accent)" : "transparent";
          let checkBorder = isSelected ? "2px solid var(--color-accent)" : "1.5px solid var(--color-border-strong)";

          if (modoRevisao) {
            if (isSelected && isCorrect) {
              containerBorder = "0.5px solid var(--color-success-border)";
              containerBg = "var(--color-success-subtle)";
              checkBg = "var(--color-success)";
              checkBorder = "2px solid var(--color-success)";
            } else if (isSelected && !isCorrect) {
              containerBorder = "0.5px solid var(--color-error-border)";
              containerBg = "var(--color-error-subtle)";
              checkBg = "var(--color-error)";
              checkBorder = "2px solid var(--color-error)";
            } else if (!isSelected && isCorrect) {
              containerBorder = "0.5px solid var(--color-info-border)";
              containerBg = "var(--color-info-subtle)";
              checkBg = "transparent";
              checkBorder = "2px solid var(--color-info)";
            } else {
              containerBorder = "var(--border-default)";
              containerBg = "var(--color-elevated)";
              checkBg = "transparent";
              checkBorder = "1.5px solid var(--color-border-strong)";
            }
          }

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => !modoRevisao && onToggle(opt.id)}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "var(--space-sm)",
                textAlign: "left",
                padding: "var(--space-sm) var(--space-md)",
                borderRadius: "var(--radius-md)",
                border: containerBorder,
                background: containerBg,
                cursor: modoRevisao ? "default" : "pointer",
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
                  border: checkBorder,
                  background: checkBg,
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
                  {opt.rotulo}
                </span>
                {opt.descricao && (
                  <span
                    style={{
                      display: "block",
                      fontSize: "var(--text-label)",
                      color: "var(--color-text-secondary)",
                      marginTop: "1px",
                    }}
                  >
                    {opt.descricao}
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

export function IdentificacaoVisualCaso({
  submission,
  onChange,
  imageSrc,
  tissuePins,
  onAddPin,
  onRemovePin,
  hasTissueZones,
  modoRevisao,
  zonasTecido,
  objetivosVisuais,
}: Props) {
  const availableTypes: TipoTecidoAnotavel[] = submission.tecidos
    .map((id) => tissueValueToAnnotatableType[id])
    .filter((t): t is TipoTecidoAnotavel => t !== null);

  const [activeTissueType, setActiveTissueType] = useState<TipoTecidoAnotavel | null>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  function handleImageClick(e: React.MouseEvent<HTMLDivElement>) {
    if (modoRevisao || !activeTissueType || !imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    onAddPin({
      id: `pin-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      tipoTecido: activeTissueType,
      x,
      y,
    });
  }

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
            color: modoRevisao ? "var(--color-warning)" : "var(--color-accent)",
            textTransform: "uppercase",
            letterSpacing: "var(--tracking-label)",
          }}
        >
          {modoRevisao ? "Revisão Visual" : "Identificação visual"}
        </p>
        <p className="text-body" style={{ marginTop: "var(--space-xs)", color: "var(--color-text-secondary)" }}>
          {modoRevisao 
            ? "Verifica os achados visuais corretos assinalados e compara com as tuas seleções e marcadores." 
            : "Com base na imagem que observaste, seleciona o que identificas em cada categoria. Podes selecionar zero ou várias opções."}
        </p>
      </div>

      <CheckboxGroup<OpcaoTecidoVisual>
        label="Tecidos presentes no leito"
        options={VISUAL_TISSUE_OPTIONS}
        selected={submission.tecidos}
        correctOptions={objetivosVisuais?.tecidos}
        modoRevisao={modoRevisao}
        onToggle={(id) => onChange({ ...submission, tecidos: toggle(submission.tecidos, id) })}
      />

      <CheckboxGroup<OpcaoExsudadoVisual>
        label="Tipo de exsudado"
        options={VISUAL_EXUDATE_OPTIONS}
        selected={submission.exsudado}
        correctOptions={objetivosVisuais?.exsudado}
        modoRevisao={modoRevisao}
        note="Para combinações como hematicoseroso, seleciona ambos."
        onToggle={(id) => onChange({ ...submission, exsudado: toggle(submission.exsudado, id) })}
      />

      <CheckboxGroup<OpcaoBordosVisual>
        label="Bordos e pele perilesional"
        options={VISUAL_EDGE_OPTIONS}
        selected={submission.bordos}
        correctOptions={objetivosVisuais?.bordos}
        modoRevisao={modoRevisao}
        onToggle={(id) => onChange({ ...submission, bordos: toggle(submission.bordos, id) })}
      />

      {hasTissueZones && availableTypes.length > 0 && (
        <div
          style={{
            background: "var(--color-surface)",
            border: "var(--border-default)",
            borderRadius: "var(--radius-lg)",
            padding: "var(--space-lg)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-md)",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "var(--text-body)",
                fontWeight: "var(--weight-medium)",
                color: "var(--color-text-primary)",
              }}
            >
              Aponta na imagem
            </p>
            <p
              className="text-body"
              style={{ marginTop: "var(--space-xs)", color: "var(--color-text-secondary)" }}
            >
              Seleciona um tipo de tecido e clica na imagem para o assinalar. Clica num marcador para o remover.
            </p>
          </div>

          {/* Selector de tipo activo */}
          {!modoRevisao && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-sm)" }}>
              {availableTypes.map((type) => {
                const display = annotatableTissueDisplay[type];
                const isActive = activeTissueType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setActiveTissueType(isActive ? null : type)}
                    style={{
                      padding: "var(--space-xs) var(--space-md)",
                      borderRadius: "var(--radius-full)",
                      border: isActive ? `0.5px solid ${display.color}` : "var(--border-default)",
                      background: isActive ? display.color : "var(--color-elevated)",
                      color: isActive ? "white" : "var(--color-text-primary)",
                      cursor: "pointer",
                      fontSize: "var(--text-body)",
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--space-xs)",
                    }}
                  >
                    <span
                      style={{
                        width: "0.6em",
                        height: "0.6em",
                        borderRadius: "50%",
                        background: isActive ? "white" : display.color,
                        flexShrink: 0,
                      }}
                    />
                    {display.rotulo}
                  </button>
                );
              })}
            </div>
          )}

          {/* Imagem com pins */}
          <div
            ref={imageRef}
            onClick={handleImageClick}
            style={{
              position: "relative",
              cursor: (!modoRevisao && activeTissueType) ? "crosshair" : "default",
              userSelect: "none",
            }}
          >
            <img
              src={imageSrc}
              alt="Imagem da ferida"
              style={{ width: "100%", display: "block", borderRadius: "var(--radius-md)" }}
              draggable={false}
            />

            {/* Polígonos de gabarito para revisão */}
            {modoRevisao && zonasTecido && zonasTecido.length > 0 && (
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  pointerEvents: "none",
                  borderRadius: "var(--radius-md)"
                }}
              >
                {zonasTecido.map((zona, idx) => {
                  const color = annotatableTissueDisplay[zona.tipoTecido]?.color || "var(--color-accent)";
                  const points = zona.poligono.map(p => `${p.x * 100},${p.y * 100}`).join(" ");
                  return (
                    <polygon
                      key={idx}
                      points={points}
                      fill={color}
                      fillOpacity={0.4}
                      stroke={color}
                      strokeWidth={0.5}
                    />
                  );
                })}
              </svg>
            )}

            {tissuePins.map((pin) => {
              const display = annotatableTissueDisplay[pin.tipoTecido];
              return (
                <button
                  key={pin.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!modoRevisao) onRemovePin(pin.id);
                  }}
                  title={modoRevisao ? display.rotulo : `${display.rotulo} — clicar para remover`}
                  style={{
                    position: "absolute",
                    left: `${pin.x * 100}%`,
                    top: `${pin.y * 100}%`,
                    transform: "translate(-50%, -50%)",
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background: display.color,
                    border: modoRevisao ? "2px solid white" : "1.5px solid white",
                    boxShadow: modoRevisao ? "0 0 0 2px black" : "0 1px 3px rgba(0,0,0,0.5)",
                    cursor: modoRevisao ? "default" : "pointer",
                    padding: 0,
                  }}
                />
              );
            })}
          </div>

          <p
            style={{
              fontSize: "var(--text-label)",
              color: "var(--color-text-secondary)",
            }}
          >
            {tissuePins.length === 0
              ? "Nenhum marcador colocado ainda."
              : `${tissuePins.length} marcador(es) na imagem.`}
          </p>
        </div>
      )}

    </div>
  );
}
