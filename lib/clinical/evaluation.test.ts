import assert from "node:assert/strict";
import { getTreatment, listCaseTemplates } from "./catalog.ts";
import { evaluateCaseAttempt, getIdealAttempt } from "./evaluation.ts";
import type { AttemptInput, CaseSession } from "./types.ts";

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
function buildEssentialAttempt(session: CaseSession): AttemptInput {
  const obsIds = session.template.observationDefinitions
    .filter((d) => d.priority === "essencial")
    .map((d) => d.id);

  const dialogIds = session.template.dialoguePrompts
    .filter((d) => d.priority === "essencial")
    .map((d) => d.id);

  // Para cada goal essencial de tratamento, escolher o primeiro representante disponível
  const treatIds: string[] = [];
  for (const g of session.variant.clinicalTargets) {
    if (g.priority !== "essencial") continue;
    if (g.matcher.treatmentIds && g.matcher.treatmentIds.length > 0) {
      treatIds.push(g.matcher.treatmentIds[0]!);
    } else if (g.matcher.treatmentFunctions && g.matcher.treatmentFunctions.length > 0) {
      const fn = g.matcher.treatmentFunctions[0]!;
      const match = session.variant.availableTreatments.find((id) =>
        getTreatment(id)?.functions.includes(fn)
      );
      if (match) treatIds.push(match);
    }
  }

  const appIds = session.variant.clinicalTargets
    .filter((g) => g.priority === "essencial" && g.matcher.applicationIds?.length)
    .flatMap((g) => g.matcher.applicationIds!.slice(0, 1));

  return {
    observationIds: obsIds,
    visualSubmission: {
      tissues: [...session.variant.visualTargets.tissues],
      exudate: [...session.variant.visualTargets.exudate],
      edges: [...session.variant.visualTargets.edges],
    },
    dialogueIds: dialogIds,
    treatmentIds: treatIds,
    applicationIds: appIds,
  };
}

// Constrói tentativa com apenas os IDs adequados (sem nenhum essencial)
function buildAdequateAttempt(session: CaseSession): AttemptInput {
  const obsIds = session.template.observationDefinitions
    .filter((d) => d.priority === "adequado")
    .map((d) => d.id);

  const dialogIds = session.template.dialoguePrompts
    .filter((d) => d.priority === "adequado")
    .map((d) => d.id);

  const treatIds: string[] = [];
  for (const g of session.variant.clinicalTargets) {
    if (g.priority !== "adequado") continue;
    if (g.matcher.treatmentIds && g.matcher.treatmentIds.length > 0) {
      treatIds.push(g.matcher.treatmentIds[0]!);
    }
  }

  const appIds = session.variant.clinicalTargets
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
function findPenaltyTreatment(session: CaseSession): string | null {
  const penaltyRules = session.variant.evaluationRules.filter(
    (r) =>
      r.target === "treatment" &&
      (r.classification === "redundante" || r.classification === "inadequado")
  );
  for (const rule of penaltyRules) {
    const id = rule.appliesToIds.find((id) => session.variant.availableTreatments.includes(id));
    if (id) return id;
  }
  return null;
}

function run() {
  for (const template of listCaseTemplates()) {
    for (const variant of template.variants) {
      const session: CaseSession = { template, variant };
      const label = `${template.id}/${variant.id}`;

      // 1. getIdealAttempt deve dar 100
      const idealAttempt = getIdealAttempt(session);
      const idealScore = evaluateCaseAttempt(session, idealAttempt).score;
      assert.equal(idealScore, 100, `[${label}] getIdealAttempt score deve ser 100, foi ${idealScore}`);

      // 2. Apenas essenciais deve dar 100
      const essentialAttempt = buildEssentialAttempt(session);
      const essentialScore = evaluateCaseAttempt(session, essentialAttempt).score;
      assert.equal(
        essentialScore,
        100,
        `[${label}] score com só essenciais deve ser 100, foi ${essentialScore}`
      );

      // 3. Apenas adequados (sem essenciais) deve ser < 100
      const adequateAttempt = buildAdequateAttempt(session);
      const adequateScore = evaluateCaseAttempt(session, adequateAttempt).score;
      assert.ok(
        adequateScore < 100,
        `[${label}] score com só adequados deve ser < 100, foi ${adequateScore}`
      );

      // 4. Essenciais + tratamento penalizante deve ser < 100
      const penaltyId = findPenaltyTreatment(session);
      if (penaltyId) {
        const penaltyAttempt: AttemptInput = {
          ...essentialAttempt,
          treatmentIds: [...essentialAttempt.treatmentIds, penaltyId],
        };
        const penaltyScore = evaluateCaseAttempt(session, penaltyAttempt).score;
        assert.ok(
          penaltyScore < 100,
          `[${label}] essenciais + penalizante (${penaltyId}) deve ser < 100, foi ${penaltyScore}`
        );
      }
    }
  }

  console.log("Todos os testes de avaliação clínica passaram.");
}

run();
