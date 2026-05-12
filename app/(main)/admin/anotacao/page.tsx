"use client";

import { useMemo, useRef, useState } from "react";
import { caseTemplates } from "@/data/clinico/casos";
import { annotatableTissueDisplay } from "@/lib/clinico/display-ferida";
import type {
  TipoTecidoAnotavel,
  PontoBidimensional,
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
  const [currentPolygon, setCurrentPolygon] = useState<PontoBidimensional[]>([]);
  const [mousePos, setMousePos] = useState<PontoBidimensional | null>(null);
  const imageRef = useRef<HTMLDivElement>(null);

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

  function handleImageClick(e: React.MouseEvent) {
    const coords = getRelativeCoords(e);
    if (!coords) return;
    setCurrentPolygon((prev) => [...prev, coords]);
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (currentPolygon.length === 0) return;
    const coords = getRelativeCoords(e);
    if (coords) setMousePos(coords);
  }

  function handleFinishPolygon() {
    if (currentPolygon.length >= 3) {
      setZones((prev) => [...prev, { tipoTecido: activeType, poligono: currentPolygon }]);
    }
    setCurrentPolygon([]);
    setMousePos(null);
  }

  function removeZone(index: number) {
    setZones((prev) => prev.filter((_, i) => i !== index));
  }

  function loadFromTemplate() {
    if (!current) return;
    // Suporta carregamento de retângulos antigos (convertendo-os) e polígonos novos
    const loadedZones = (current.zonasTecido ?? []).map((z: any) => {
      if (z.poligono) return z;
      if (z.retangulo) {
        return {
          tipoTecido: z.tipoTecido,
          poligono: [
            { x: z.retangulo.x, y: z.retangulo.y },
            { x: z.retangulo.x + z.retangulo.w, y: z.retangulo.y },
            { x: z.retangulo.x + z.retangulo.w, y: z.retangulo.y + z.retangulo.h },
            { x: z.retangulo.x, y: z.retangulo.y + z.retangulo.h },
          ]
        };
      }
      return z;
    });
    setZones(loadedZones as ZonaTecido[]);
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
          Clicar para adicionar vértices do polígono → Clicar "Concluir Forma" → desenhar próxima zona → copiar JSON →
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

        {currentPolygon.length > 0 && (
          <div style={{ display: "flex", gap: "var(--space-sm)", marginLeft: "auto" }}>
            <button type="button" className="btn btn-primary" onClick={handleFinishPolygon}>
              Concluir Forma
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => setCurrentPolygon([])}>
              Cancelar
            </button>
          </div>
        )}
      </div>

      {/* Imagem com desenho */}
      <div
        ref={imageRef}
        onClick={handleImageClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          setMousePos(null);
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

        <svg
          viewBox="0 0 1000 1000"
          preserveAspectRatio="none"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        >
          {zones.map((zone, i) => {
            const display = annotatableTissueDisplay[zone.tipoTecido];
            const pointsStr = zone.poligono.map(p => `${p.x * 1000},${p.y * 1000}`).join(" ");
            return (
              <polygon
                key={i}
                points={pointsStr}
                fill={`${display.color}44`}
                stroke={display.color}
                strokeWidth="2"
                style={{ pointerEvents: "auto", cursor: "pointer" }}
                onClick={(e) => {
                  e.stopPropagation();
                  removeZone(i);
                }}
              >
                <title>{display.rotulo} — clicar para remover</title>
              </polygon>
            );
          })}

          {currentPolygon.length > 0 && (
            <polyline
              points={
                currentPolygon.map(p => `${p.x * 1000},${p.y * 1000}`).join(" ") +
                (mousePos ? ` ${mousePos.x * 1000},${mousePos.y * 1000}` : "")
              }
              fill="none"
              stroke={annotatableTissueDisplay[activeType].color}
              strokeWidth="2"
              strokeDasharray="4"
            />
          )}
          
          {currentPolygon.map((p, i) => (
            <circle
              key={`cp-${i}`}
              cx={p.x * 1000}
              cy={p.y * 1000}
              r="4"
              fill={annotatableTissueDisplay[activeType].color}
            />
          ))}
        </svg>
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
