import type {
  JustificationOption,
  JustificationQuestion,
  TreatmentDefinition,
  WoundVariables,
  CaseTemplate,
} from "./types.ts";
import { getTreatment, listTreatments } from "./catalog.ts";
import {
  variableLabels,
  genericDistractors,
  FALLBACK_CORRECT,
} from "../../data/clinical/justificacoes.ts";

export function isEligibleForJustification(treatment: TreatmentDefinition): boolean {
  return (
    !treatment.functions.includes("cleanse") &&
    !treatment.functions.includes("antiseptic")
  );
}

function buildCorrectPhrase(
  treatment: TreatmentDefinition,
  woundVariables: WoundVariables
): string {
  if (!treatment.regras) return FALLBACK_CORRECT;

  const { condicoes_ideais } = treatment.regras;
  const matchedPhrases: string[] = [];

  for (const [key, allowedValues] of Object.entries(condicoes_ideais)) {
    if (!allowedValues || allowedValues.length === 0) continue;
    const variableKey = key as keyof WoundVariables;
    const woundValue = woundVariables[variableKey];
    if (allowedValues.includes(woundValue as number)) {
      const phrase = variableLabels[variableKey]?.[woundValue as number];
      if (phrase) matchedPhrases.push(phrase);
    }
  }

  if (matchedPhrases.length === 0) return FALLBACK_CORRECT;

  const combined = matchedPhrases.join(" + ");
  return combined.charAt(0).toUpperCase() + combined.slice(1);
}

function buildContraindicationPhrase(
  treatment: TreatmentDefinition,
  woundVariables: WoundVariables
): string {
  if (!treatment.regras) return "Este material está contraindicado neste contexto";

  for (const contra of treatment.regras.contraindicacoes) {
    const violatedKeys: string[] = [];
    let allMatch = true;

    for (const [key, values] of Object.entries(contra)) {
      const variableKey = key as keyof WoundVariables;
      const woundValue = woundVariables[variableKey];
      if (!values || !values.includes(woundValue as number)) {
        allMatch = false;
        break;
      }
      const phrase = variableLabels[variableKey]?.[woundValue as number];
      if (phrase) violatedKeys.push(phrase);
    }

    if (allMatch && violatedKeys.length > 0) {
      return `Este material está contraindicado: ${violatedKeys.join(" + ")}`;
    }
  }

  return "Este material está contraindicado neste contexto";
}

function classifyQuestionKind(
  treatment: TreatmentDefinition,
  woundVariables: WoundVariables
): JustificationQuestion["kind"] {
  if (!treatment.regras) return "no-match";

  for (const contra of treatment.regras.contraindicacoes) {
    let allMatch = true;
    for (const [key, values] of Object.entries(contra)) {
      const variableKey = key as keyof WoundVariables;
      const woundValue = woundVariables[variableKey];
      if (!values || !values.includes(woundValue as number)) {
        allMatch = false;
        break;
      }
    }
    if (allMatch) return "contraindicated";
  }

  const { condicoes_ideais } = treatment.regras;
  let allIdealMatch = true;
  let hasIdealConditions = false;
  for (const [key, values] of Object.entries(condicoes_ideais)) {
    if (!values || values.length === 0) continue;
    hasIdealConditions = true;
    const variableKey = key as keyof WoundVariables;
    const woundValue = woundVariables[variableKey];
    if (!values.includes(woundValue as number)) {
      allIdealMatch = false;
      break;
    }
  }
  if (hasIdealConditions && allIdealMatch) return "ideal-match";

  return "redundant";
}

function buildDistractors(
  correctPhrase: string,
  woundVariables: WoundVariables,
  treatmentId: string,
  count = 3
): string[] {
  const candidates = new Set<string>();

  const allTreatments = listTreatments();
  for (const other of allTreatments) {
    if (other.id === treatmentId || !other.regras) continue;
    for (const [key, values] of Object.entries(other.regras.condicoes_ideais)) {
      if (!values || values.length === 0) continue;
      const variableKey = key as keyof WoundVariables;
      for (const v of values) {
        const woundValue = woundVariables[variableKey];
        if (v !== woundValue) {
          const phrase = variableLabels[variableKey]?.[v];
          if (phrase) {
            const formatted = phrase.charAt(0).toUpperCase() + phrase.slice(1);
            if (formatted !== correctPhrase) candidates.add(formatted);
          }
        }
      }
    }
  }

  for (const g of genericDistractors) {
    if (g !== correctPhrase) candidates.add(g);
  }

  const shuffled = Array.from(candidates).sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function generateJustificationQuestion(
  treatmentId: string,
  variant: CaseTemplate
): JustificationQuestion | null {
  const treatment = getTreatment(treatmentId);
  if (!treatment) return null;
  if (!isEligibleForJustification(treatment)) return null;
  if (!variant.woundVariables) return null;

  const kind = classifyQuestionKind(treatment, variant.woundVariables);

  const override = variant.justificacoesOverride?.[treatmentId];
  if (override) {
    return {
      treatmentId,
      treatmentLabel: treatment.label,
      options: override.options,
      correctOptionId: override.correctOptionId,
      kind,
    };
  }

  let correctPhrase: string;
  if (kind === "contraindicated") {
    correctPhrase = buildContraindicationPhrase(treatment, variant.woundVariables);
  } else {
    correctPhrase = buildCorrectPhrase(treatment, variant.woundVariables);
  }

  const distractors = buildDistractors(
    correctPhrase,
    variant.woundVariables,
    treatmentId
  );

  const correctOption: JustificationOption = { id: "correct", text: correctPhrase };
  const distractorOptions: JustificationOption[] = distractors.map((text, i) => ({
    id: `d${i + 1}`,
    text,
  }));

  const allOptions = [correctOption, ...distractorOptions].sort(
    () => Math.random() - 0.5
  );

  return {
    treatmentId,
    treatmentLabel: treatment.label,
    options: allOptions,
    correctOptionId: "correct",
    kind,
  };
}

export function generateAllJustificationQuestions(
  treatmentIds: string[],
  variant: CaseTemplate
): JustificationQuestion[] {
  const questions: JustificationQuestion[] = [];
  for (const id of treatmentIds) {
    const q = generateJustificationQuestion(id, variant);
    if (q) questions.push(q);
  }
  return questions;
}
