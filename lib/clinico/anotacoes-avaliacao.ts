﻿import type {
  TipoTecidoAnotavel,
  MarcadorTecido,
  ZonaTecido,
  PontoBidimensional,
} from "./types.ts";

function pontoNoPoligono(x: number, y: number, poligono: PontoBidimensional[]): boolean {
  let dentro = false;
  for (let i = 0, j = poligono.length - 1; i < poligono.length; j = i++) {
    const xi = poligono[i].x, yi = poligono[i].y;
    const xj = poligono[j].x, yj = poligono[j].y;
    
    const interseta = ((yi > y) !== (yj > y)) &&
        (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (interseta) dentro = !dentro;
  }
  return dentro;
}

function marcadorAtingZonaCorreta(pin: MarcadorTecido, zones: ZonaTecido[]): boolean {
  return zones.some(
    (zone) =>
      zone.tipoTecido === pin.tipoTecido && pontoNoPoligono(pin.x, pin.y, zone.poligono)
  );
}

function marcadorAtingQualquerZona(pin: MarcadorTecido, zones: ZonaTecido[]): boolean {
  return zones.some((zone) => pontoNoPoligono(pin.x, pin.y, zone.poligono));
}

export type AvaliacaoAnotacao = {
  /** Sub-score 0-1 */
  pontuacao: number;
  tiposCorretos: TipoTecidoAnotavel[];
  tiposOmitidos: TipoTecidoAnotavel[];
  marcadoresForaZona: number;
};

/** @deprecated Use AvaliacaoAnotacao */
export type AnnotationEvaluation = AvaliacaoAnotacao;

/**
 * Avalia a anotação do aluno.
 *
 * pontuacao = max(0, (acertos / total_tipos) - (pins_fora / pins_total) × 0.3)
 */
export function avaliarAnotacao(
  pins: MarcadorTecido[],
  zones: ZonaTecido[]
): AvaliacaoAnotacao {
  const expectedTypes = Array.from(new Set(zones.map((z) => z.tipoTecido)));

  const tiposCorretos: TipoTecidoAnotavel[] = [];
  for (const type of expectedTypes) {
    const hasCorrectPin = pins.some(
      (pin) => pin.tipoTecido === type && marcadorAtingZonaCorreta(pin, zones)
    );
    if (hasCorrectPin) tiposCorretos.push(type);
  }

  const tiposOmitidos = expectedTypes.filter((t) => !tiposCorretos.includes(t));
  const marcadoresForaZona = pins.filter((pin) => !marcadorAtingQualquerZona(pin, zones)).length;

  if (expectedTypes.length === 0) {
    return { pontuacao: 1, tiposCorretos: [], tiposOmitidos: [], marcadoresForaZona };
  }

  const baseScore = tiposCorretos.length / expectedTypes.length;
  const penaltyRatio = pins.length > 0 ? marcadoresForaZona / pins.length : 0;
  const pontuacao = Math.max(0, baseScore - penaltyRatio * 0.3);

  return { pontuacao, tiposCorretos, tiposOmitidos, marcadoresForaZona };
}

/** @deprecated Use avaliarAnotacao */
export const evaluateAnnotation = avaliarAnotacao;
