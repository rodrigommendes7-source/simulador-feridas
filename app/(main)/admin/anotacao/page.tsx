"use client";

import { useMemo, useRef, useState } from "react";
import { caseTemplates } from "@/data/clinico/casos";
import { annotatableTissueDisplay } from "@/lib/clinico/display-ferida";
import type {
  TipoTecidoAnotavel,
  RetanguloRelativo,
  ZonaTecido,
} from "@/lib/clinico/types";

const TIPOS_TECIDO: TipoTecidoAnotavel[] = [
  "necrose",
  "fibrina",
  "granulacao",
  "epitelial",
  "hipergranulacao",
];

export default function AdminAnotacaoPage() {
  const [selectedCaseId, setSelectedCaseId] = useState(
    caseTemplates[0]?.id ?? ""
  );
  const [activeType, setActiveType] = useState<TipoTecidoAnotavel>("fibrina");
  const [zones, setZones] = useState<ZonaTecido[]>([]);
  const [drawing, setDrawing] = useState<RetanguloRelativo | null>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef<{ x: number; y: number } | null>(null);

  const current = useMemo(
    () => caseTemplates.find((t) => t.id === selectedCaseId),
    [selectedCaseId]
  );

  function getRelativeCoords(
    e: React.MouseEvent
  ): { x: number; y: number } | null {
    if (!imageRef.current) return null;
    const rect = imageRef.current.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)),
      y: Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height)),
    };
  }

  function handleMouseDown(e: React.MouseEvent) {
    const coords = getRelativeCoords(e);
    if (!coords) return;
    dragStart.current = coords;
    setDrawing({ x: coords.x, y: coords.y, w: 0, h: 0 });
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (!dragStart.current) return;
    const coords = getRelativeCoords(e);
    if (!coords) return;
    setDrawing({
      x: Math.min(dragStart.current.x, coords.x),
      y: Math.min(dragStart.current.y, coords.y),
      w: Math.abs(coords.x - dragStart.current.x),
      h: Math.abs(coords.y - dragStart.current.y),
    });
  }

  function handleMouseUp() {
    if (!drawing || drawing.w < 0.01 || drawing.h < 0.01) {
      setDrawing(null);
      dragStart.current = null;
      return;
    }
    setZones((prev) => [...prev, { tipoTecido: activeType, retangulo: drawing! }]);
    setDrawing(null);
    dragStart.current = null;
  }

  function removeZone(index: number) {
    setZones((prev) => prev.filter((_, i) => i !== index));
  }

  function loadFromTemplate() {
    if (!current) return;
    setZones(current.zonasTecido ?? []);
  }

  function copyJson() {
    const json = JSON.stringify(zones, null, 2);
    navigator.clipboard.writeText(json).catch(() => undefined);
  }

  if (!current) return <div style={{ padding: "2rem" }}>Sem casos disponíveis</div>;

  return (
    <main style={{ padding: "var(--space-xl)", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ marginBottom: "var(--space-xl)" }}>
        <p
          className="text-label"
          style={{ color: "var(--color-accent)", marginBottom: "var(--space-xs)" }}
        >
          Ferramenta interna
        </p>
        <h1
          style={{
            fontSize: "var(--text-h1)",
            fontWeight: "var(--weight-medium)",
            color: "var(--color-text-primary)",
          }}
        >
          Editor de zonas de anotação
        </h1>
        <p
          className="text-body"
          style={{ marginTop: "var(--space-xs)", color: "var(--color-text-secondary)" }}
        >
          Arrastar para desenhar uma zona → mudar tipo → desenhar próxima zona → copiar JSON →
              colar no campo <code>zonasTecido</code> do caso em{" "}
          <code>data/clinical/casos.ts</code>.
        </p>
      </div>

      {/* Selector de caso */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-sm)",
          flexWrap: "wrap",
          marginBottom: "var(--space-lg)",
        }}
      >
        <label
          className="text-label"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Caso:
        </label>
        <select
          value={selectedCaseId}
          onChange={(e) => {
            setSelectedCaseId(e.target.value);
            setZones([]);
          }}
          style={{
            padding: "var(--space-xs) var(--space-sm)",
            background: "var(--color-elevated)",
            border: "var(--border-default)",
            borderRadius: "var(--radius-md)",
            color: "var(--color-text-primary)",
            fontSize: "var(--text-body)",
          }}
        >
          {caseTemplates.map((t) => (
            <option key={t.id} value={t.id}>
              Caso {t.ordem} · {t.tituloAbreviado} — {t.tituloCenario}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={loadFromTemplate}
        >
          Carregar zonas existentes
        </button>
      </div>

      {/* Selector de tipo activo */}
      <div
        style={{
          display: "flex",
          gap: "var(--space-sm)",
          flexWrap: "wrap",
          marginBottom: "var(--space-lg)",
        }}
      >
        {TIPOS_TECIDO.map((type) => {
          const display = annotatableTissueDisplay[type];
          const isActive = activeType === type;
          return (
            <button
              key={type}
              type="button"
              onClick={() => setActiveType(type)}
              style={{
                padding: "var(--space-xs) var(--space-md)",
                background: isActive ? display.color : "var(--color-elevated)",
                color: isActive ? "white" : "var(--color-text-primary)",
                border: isActive
                  ? `0.5px solid ${display.color}`
                  : "var(--border-default)",
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
                fontSize: "var(--text-body)",
              }}
            >
              {display.rotulo}
            </button>
          );
        })}
      </div>

      {/* Imagem com desenho */}
      <div
        ref={imageRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          setDrawing(null);
          dragStart.current = null;
        }}
        style={{
          position: "relative",
          cursor: "crosshair",
          userSelect: "none",
          maxWidth: "800px",
          border: "var(--border-default)",
          borderRadius: "var(--radius-md)",
          overflow: "hidden",
        }}
      >
        <img
          src={current.srcImagem}
          alt="Ferida"
          style={{ width: "100%", display: "block" }}
          draggable={false}
        />

        {zones.map((zone, i) => {
          const display = annotatableTissueDisplay[zone.tipoTecido];
          return (
            <div
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                removeZone(i);
              }}
              title={`${display.rotulo} — clicar para remover`}
              style={{
                position: "absolute",
                left: `${zone.retangulo.x * 100}%`,
                top: `${zone.retangulo.y * 100}%`,
                width: `${zone.retangulo.w * 100}%`,
                height: `${zone.retangulo.h * 100}%`,
                border: `2px solid ${display.color}`,
                background: `${display.color}44`,
                cursor: "pointer",
              }}
            />
          );
        })}

        {drawing && (
          <div
            style={{
              position: "absolute",
              left: `${drawing.x * 100}%`,
              top: `${drawing.y * 100}%`,
              width: `${drawing.w * 100}%`,
              height: `${drawing.h * 100}%`,
              border: `2px dashed ${annotatableTissueDisplay[activeType].color}`,
              background: `${annotatableTissueDisplay[activeType].color}22`,
              pointerEvents: "none",
            }}
          />
        )}
      </div>

      {/* Output JSON */}
      <div style={{ marginTop: "var(--space-lg)", maxWidth: "800px" }}>
        <div
          style={{
            display: "flex",
            gap: "var(--space-sm)",
            alignItems: "center",
            marginBottom: "var(--space-sm)",
          }}
        >
          <p className="text-label" style={{ color: "var(--color-text-secondary)" }}>
            JSON ({zones.length} zona{zones.length !== 1 ? "s" : ""})
          </p>
          <button type="button" className="btn btn-ghost" onClick={copyJson}>
            Copiar
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setZones([])}
          >
            Limpar tudo
          </button>
        </div>
        <pre
          style={{
            padding: "var(--space-md)",
            background: "var(--color-elevated)",
            border: "var(--border-default)",
            borderRadius: "var(--radius-md)",
            fontSize: "12px",
            overflowX: "auto",
            maxHeight: "300px",
            color: "var(--color-text-primary)",
          }}
        >
          {JSON.stringify(zones, null, 2)}
        </pre>
      </div>
    </main>
  );
}
