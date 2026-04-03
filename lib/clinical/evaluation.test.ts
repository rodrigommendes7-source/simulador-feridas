import assert from "node:assert/strict";
import { getCaseSession, listCaseTemplates } from "./catalog.ts";
import { evaluateCaseAttempt, getIdealAttempt } from "./evaluation.ts";
import type { AttemptInput } from "./types.ts";

function buildEmptyAttempt(): AttemptInput {
  return {
    observationIds: [],
    dialogueIds: [],
    treatmentIds: [],
    applicationIds: [],
  };
}

function findBestSelection<T>(
  options: readonly T[],
  applySelection: (attempt: AttemptInput, selection: T[]) => AttemptInput,
  getSectionScore: (attempt: AttemptInput) => number
) {
  let bestScore = -1;
  let bestSelection: T[] = [];
  const subsetCount = 1 << options.length;

  for (let mask = 0; mask < subsetCount; mask += 1) {
    const selection: T[] = [];

    for (let index = 0; index < options.length; index += 1) {
      if ((mask & (1 << index)) !== 0) {
        selection.push(options[index]!);
      }
    }

    const score = getSectionScore(applySelection(buildEmptyAttempt(), selection));
    if (score > bestScore) {
      bestScore = score;
      bestSelection = selection;
    }
  }

  return bestSelection;
}

function run() {
  for (const template of listCaseTemplates()) {
    for (const variant of template.variants) {
      const session = { template, variant };

      const idealAttempt = getIdealAttempt(session);
      const evaluation = evaluateCaseAttempt(session, idealAttempt);

      assert.equal(
        evaluation.score,
        100,
        `Expected ${template.id}/${variant.id} to allow a perfect score, got ${evaluation.score}.`
      );

      const referenceAttempt = {
        observationIds: findBestSelection(
          template.observationDefinitions.map((item) => item.id),
          (attempt, selection) => ({ ...attempt, observationIds: selection }),
          (attempt) => evaluateCaseAttempt(session, attempt).sections[0]?.score ?? 0
        ),
        dialogueIds: findBestSelection(
          template.dialoguePrompts.map((item) => item.id),
          (attempt, selection) => ({ ...attempt, dialogueIds: selection }),
          (attempt) => evaluateCaseAttempt(session, attempt).sections[1]?.score ?? 0
        ),
        treatmentIds: findBestSelection(
          variant.availableTreatments,
          (attempt, selection) => ({ ...attempt, treatmentIds: selection }),
          (attempt) => evaluateCaseAttempt(session, attempt).sections[2]?.score ?? 0
        ),
        applicationIds: findBestSelection(
          variant.applicationOptions,
          (attempt, selection) => ({ ...attempt, applicationIds: selection }),
          (attempt) => evaluateCaseAttempt(session, attempt).sections[3]?.score ?? 0
        ),
      };

      assert.deepEqual(
        idealAttempt,
        referenceAttempt,
        `Expected helper ideal attempt to match exhaustive search for ${template.id}/${variant.id}.`
      );
    }
  }

  const case1Session = getCaseSession("1", "1A");
  assert.ok(case1Session);
  const case1Ideal = getIdealAttempt(case1Session);
  assert.deepEqual(case1Ideal.applicationIds, [
    "com_protecao_perilesional",
    "sem_desbridamento_agressivo",
    "fixacao_atraumatica",
  ]);
  assert.equal(case1Ideal.treatmentIds.length, 5);

  const case2Session = getCaseSession("2", "2A");
  assert.ok(case2Session);
  const case2Ideal = getIdealAttempt(case2Session);
  assert.deepEqual(case2Ideal.applicationIds, [
    "apos_limpeza",
    "com_protecao_perilesional",
    "fixacao_atraumatica",
  ]);
  assert.ok(case2Ideal.treatmentIds.includes("cloreto-sodio-09"));
  assert.ok(
    case2Ideal.treatmentIds.includes("octenilin-solucao-lavagem") ||
      case2Ideal.treatmentIds.includes("iodopovidona-solucao")
  );
  assert.ok(case2Ideal.treatmentIds.includes("colagenase"));
  assert.ok(case2Ideal.treatmentIds.includes("aquacel-simples"));
  assert.ok(case2Ideal.treatmentIds.includes("oxido-zinco"));

  const case3Session = getCaseSession("3", "3B");
  assert.ok(case3Session);
  const case3Ideal = getIdealAttempt(case3Session);
  assert.deepEqual(case3Ideal.applicationIds, [
    "apos_limpeza",
    "com_protecao_perilesional",
    "fixacao_atraumatica",
  ]);
  assert.ok(case3Ideal.treatmentIds.includes("cloreto-sodio-09"));
  assert.ok(
    case3Ideal.treatmentIds.includes("octenilin-solucao-lavagem") ||
      case3Ideal.treatmentIds.includes("iodopovidona-solucao")
  );
  assert.ok(case3Ideal.treatmentIds.includes("colagenase"));
  assert.ok(
    case3Ideal.treatmentIds.includes("aquacel-simples") ||
      case3Ideal.treatmentIds.includes("vliwasorb")
  );
  assert.ok(case3Ideal.treatmentIds.includes("actisorb-plus-prata"));
  assert.ok(case3Ideal.treatmentIds.includes("oxido-zinco"));

  const case4Session = getCaseSession("4", "4A");
  assert.ok(case4Session);
  const case4Ideal = getIdealAttempt(case4Session);
  assert.deepEqual(case4Ideal.applicationIds, [
    "apos_limpeza",
    "com_protecao_perilesional",
    "sem_desbridamento_agressivo",
    "fixacao_atraumatica",
  ]);
  assert.ok(case4Ideal.treatmentIds.includes("cloreto-sodio-09"));
  assert.ok(case4Ideal.treatmentIds.includes("octenilin-solucao-lavagem"));
  assert.ok(case4Ideal.treatmentIds.includes("colagenase"));
  assert.ok(
    case4Ideal.treatmentIds.includes("aquacel-simples") ||
      case4Ideal.treatmentIds.includes("fibrosol") ||
      case4Ideal.treatmentIds.includes("allevyn")
  );

  console.log("Clinical evaluation tests passed.");
}

run();
