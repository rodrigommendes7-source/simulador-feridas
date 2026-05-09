import assert from "node:assert/strict";
import { getTreatment, listCaseTemplates } from "./catalog.ts";
import { evaluateCaseAttempt, getIdealAttempt } from "./evaluation.ts";
import type { AttemptInput, CaseTemplate } from "./types.ts";

function buildEmptyAttempt(): AttemptInput {
  return {
    observationIds: [],
    visualSubmission: { tissues: [], exudate: [], edges: [] },
    dialogueIds: [],
    treatmentIds: [],
    applicationIds: [],
  };
}

// Constrói tentativa com apenas os IDs essenciais de cada secção
function buildEssentialAttempt(template: CaseTemplate): AttemptInput {
  const obsIds = template.observationDefinitions
    .filter((d) => d.priority === "essencial")
    .map((d) => d.id);

  const dialogIds = template.dialoguePrompts
    .filter((d) => d.priority === "essencial")
    .map((d) => d.id);

  // Para cada goal essencial de tratamento, escolher o primeiro representante disponível
  const treatIds: string[] = [];
  for (const g of template.clinicalTargets) {
    if (g.priority !== "essencial") continue;
    if (g.matcher.treatmentIds && g.matcher.treatmentIds.length > 0) {
      treatIds.push(g.matcher.treatmentIds[0]!);
    } else if (g.matcher.treatmentFunctions && g.matcher.treatmentFunctions.length > 0) {
      const fn = g.matcher.treatmentFunctions[0]!;
      const match = template.availableTreatments.find((id) =>
        getTreatment(id)?.functions.includes(fn)
      );
      if (match) treatIds.push(match);
    }
  }

  const appIds = template.clinicalTargets
    .filter((g) => g.priority === "essencial" && g.matcher.applicationIds?.length)
    .flatMap((g) => g.matcher.applicationIds!.slice(0, 1));

  return {
    observationIds: obsIds,
    visualSubmission: {
      tissues: [...template.visualTargets.tissues],
      exudate: [...template.visualTargets.exudate],
      edges: [...template.visualTargets.edges],
    },
    dialogueIds: dialogIds,
    treatmentIds: treatIds,
    applicationIds: appIds,
  };
}

// Constrói tentativa com apenas os IDs adequados (sem nenhum essencial)
function buildAdequateAttempt(template: CaseTemplate): AttemptInput {
  const obsIds = template.observationDefinitions
    .filter((d) => d.priority === "adequado")
    .map((d) => d.id);

  const dialogIds = template.dialoguePrompts
    .filter((d) => d.priority === "adequado")
    .map((d) => d.id);

  const treatIds: string[] = [];
  for (const g of template.clinicalTargets) {
    if (g.priority !== "adequado") continue;
    if (g.matcher.treatmentIds && g.matcher.treatmentIds.length > 0) {
      treatIds.push(g.matcher.treatmentIds[0]!);
    }
  }

  const appIds = template.clinicalTargets
    .filter((g) => g.priority === "adequado" && g.matcher.applicationIds?.length)
    .flatMap((g) => g.matcher.applicationIds!.slice(0, 1));

  return {
    observationIds: obsIds,
    visualSubmission: { tissues: [], exudate: [], edges: [] },
    dialogueIds: dialogIds,
    treatmentIds: treatIds,
    applicationIds: appIds,
  };
}

// Encontra um tratamento penalizante (redundante ou inadequado) para o cenário 4
function findPenaltyTreatment(template: CaseTemplate): string | null {
  const penaltyRules = template.evaluationRules.filter(
    (r) =>
      r.target === "treatment" &&
      (r.classification === "redundante" || r.classification === "inadequado")
  );
  for (const rule of penaltyRules) {
    const id = rule.appliesToIds.find((id) => template.availableTreatments.includes(id));
    if (id) return id;
  }
  return null;
}

function run() {
  for (const template of listCaseTemplates()) {
    const label = template.id;

    // 1. getIdealAttempt deve dar 100
    const idealAttempt = getIdealAttempt(template);
    const idealScore = evaluateCaseAttempt(template, idealAttempt).score;
    assert.equal(idealScore, 100, `[${label}] getIdealAttempt score deve ser 100, foi ${idealScore}`);

    // 2. Apenas essenciais deve dar 100
    const essentialAttempt = buildEssentialAttempt(template);
    const essentialScore = evaluateCaseAttempt(template, essentialAttempt).score;
    assert.equal(
      essentialScore,
      100,
      `[${label}] score com só essenciais deve ser 100, foi ${essentialScore}`
    );

    // 3. Apenas adequados (sem essenciais) deve ser < 100
    const adequateAttempt = buildAdequateAttempt(template);
    const adequateScore = evaluateCaseAttempt(template, adequateAttempt).score;
    assert.ok(
      adequateScore < 100,
      `[${label}] score com só adequados deve ser < 100, foi ${adequateScore}`
    );

    // 4. Essenciais + tratamento penalizante deve ser < 100
    const penaltyId = findPenaltyTreatment(template);
    if (penaltyId) {
      const penaltyAttempt: AttemptInput = {
        ...essentialAttempt,
        treatmentIds: [...essentialAttempt.treatmentIds, penaltyId],
      };
      const penaltyScore = evaluateCaseAttempt(template, penaltyAttempt).score;
      assert.ok(
        penaltyScore < 100,
        `[${label}] essenciais + penalizante (${penaltyId}) deve ser < 100, foi ${penaltyScore}`
      );
    }
  }

  console.log("Todos os testes de avaliação clínica passaram.");
}

run();
