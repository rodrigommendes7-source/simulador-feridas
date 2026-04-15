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

  console.log("Clinical evaluation tests passed.");
}

run();
