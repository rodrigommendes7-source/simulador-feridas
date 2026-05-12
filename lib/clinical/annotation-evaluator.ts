import type {
  TipoTecidoAnotavel,
  MarcadorTecido,
  ZonaTecido,
  RetanguloRelativo,
} from "./types.ts";

function pontoNoRetangulo(x: number, y: number, rect: RetanguloRelativo): boolean {
  return (
    x >= rect.x &&
    x <= rect.x + rect.w &&
    y >= rect.y &&
    y <= rect.y + rect.h
  );
}

function marcadorAtingZonaCorreta(pin: MarcadorTecido, zones: ZonaTecido[]): boolean {
  return zones.some(
    (zone) =>
      zone.tipoTecido === pin.tipoTecido && pontoNoRetangulo(pin.x, pin.y, zone.retangulo)
  );
}

function marcadorAtingQualquerZona(pin: MarcadorTecido, zones: ZonaTecido[]): boolean {
  return zones.some((zone) => pontoNoRetangulo(pin.x, pin.y, zone.retangulo));
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
