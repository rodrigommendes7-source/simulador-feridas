import type {
  AnnotatableTissueType,
  TissuePin,
  TissueZone,
  RelativeRect,
} from "./types.ts";

function pointInRect(x: number, y: number, rect: RelativeRect): boolean {
  return (
    x >= rect.x &&
    x <= rect.x + rect.w &&
    y >= rect.y &&
    y <= rect.y + rect.h
  );
}

function pinHitsCorrectZone(pin: TissuePin, zones: TissueZone[]): boolean {
  return zones.some(
    (zone) =>
      zone.tissueType === pin.tissueType && pointInRect(pin.x, pin.y, zone.rect)
  );
}

function pinHitsAnyZone(pin: TissuePin, zones: TissueZone[]): boolean {
  return zones.some((zone) => pointInRect(pin.x, pin.y, zone.rect));
}

export type AnnotationEvaluation = {
  /** Sub-score 0-1 */
  score: number;
  correctTypes: AnnotatableTissueType[];
  missedTypes: AnnotatableTissueType[];
  pinsOutOfZones: number;
};

/**
 * Avalia a anotação do aluno.
 *
 * score = max(0, (acertos / total_tipos) - (pins_fora / pins_total) × 0.3)
 */
export function evaluateAnnotation(
  pins: TissuePin[],
  zones: TissueZone[]
): AnnotationEvaluation {
  const expectedTypes = Array.from(new Set(zones.map((z) => z.tissueType)));

  const correctTypes: AnnotatableTissueType[] = [];
  for (const type of expectedTypes) {
    const hasCorrectPin = pins.some(
      (pin) => pin.tissueType === type && pinHitsCorrectZone(pin, zones)
    );
    if (hasCorrectPin) correctTypes.push(type);
  }

  const missedTypes = expectedTypes.filter((t) => !correctTypes.includes(t));
  const pinsOutOfZones = pins.filter((pin) => !pinHitsAnyZone(pin, zones)).length;

  if (expectedTypes.length === 0) {
    return { score: 1, correctTypes: [], missedTypes: [], pinsOutOfZones };
  }

  const baseScore = correctTypes.length / expectedTypes.length;
  const penaltyRatio = pins.length > 0 ? pinsOutOfZones / pins.length : 0;
  const score = Math.max(0, baseScore - penaltyRatio * 0.3);

  return { score, correctTypes, missedTypes, pinsOutOfZones };
}
