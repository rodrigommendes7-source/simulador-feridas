/**
 * Validação dos 4 cenários por caso:
 * 1. Apenas essenciais → score 100
 * 2. Apenas adequados (sem essenciais) → score < 100
 * 3. Essenciais + adequados → score 100
 * 4. Essenciais + tratamento penalizante → score < 100
 */
import { getTreatment, listCaseTemplates } from "../lib/clinical/catalog.ts";
import { evaluateCaseAttempt } from "../lib/clinical/evaluation.ts";
import type { AttemptInput, CaseSession } from "../lib/clinical/types.ts";

function buildEssentialAttempt(session: CaseSession): AttemptInput {
  const obsIds = session.template.observationDefinitions
    .filter((d) => d.priority === "essencial")
    .map((d) => d.id);

  const dialogIds = session.template.dialoguePrompts
    .filter((d) => d.priority === "essencial")
    .map((d) => d.id);

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

let allPassed = true;

for (const template of listCaseTemplates()) {
  for (const variant of template.variants) {
    const session: CaseSession = { template, variant };
    const label = `Caso ${template.id}/${variant.id}`;
    const failures: string[] = [];

    // Cenário 1: apenas essenciais → 100
    const essentialAttempt = buildEssentialAttempt(session);
    const essentialEval = evaluateCaseAttempt(session, essentialAttempt);
    if (essentialEval.score !== 100) {
      failures.push(`  ❌ Cenário 1 (só essenciais): score ${essentialEval.score} ≠ 100`);
      const breakdown = essentialEval.sections
        .map((s) => `    ${s.id}: ${s.score}/${s.maxScore}`)
        .join("\n");
      failures.push(breakdown);
    }

    // Cenário 2: apenas adequados → < 100
    const adequateAttempt = buildAdequateAttempt(session);
    const adequateEval = evaluateCaseAttempt(session, adequateAttempt);
    if (adequateEval.score >= 100) {
      failures.push(`  ❌ Cenário 2 (só adequados): score ${adequateEval.score} deve ser < 100`);
    }

    // Cenário 3: essenciais + adequados → 100
    const combinedAttempt: AttemptInput = {
      observationIds: [...essentialAttempt.observationIds, ...adequateAttempt.observationIds],
      visualSubmission: essentialAttempt.visualSubmission,
      dialogueIds: [...essentialAttempt.dialogueIds, ...adequateAttempt.dialogueIds],
      treatmentIds: [...essentialAttempt.treatmentIds, ...adequateAttempt.treatmentIds],
      applicationIds: [...essentialAttempt.applicationIds, ...adequateAttempt.applicationIds],
    };
    const combinedEval = evaluateCaseAttempt(session, combinedAttempt);
    if (combinedEval.score !== 100) {
      failures.push(`  ❌ Cenário 3 (essenciais + adequados): score ${combinedEval.score} ≠ 100`);
      const breakdown = combinedEval.sections
        .map((s) => `    ${s.id}: ${s.score}/${s.maxScore}`)
        .join("\n");
      failures.push(breakdown);
    }

    // Cenário 4: essenciais + penalizante → < 100
    const penaltyId = findPenaltyTreatment(session);
    if (penaltyId) {
      const penaltyAttempt: AttemptInput = {
        ...essentialAttempt,
        treatmentIds: [...essentialAttempt.treatmentIds, penaltyId],
      };
      const penaltyEval = evaluateCaseAttempt(session, penaltyAttempt);
      if (penaltyEval.score >= 100) {
        failures.push(`  ❌ Cenário 4 (essenciais + ${penaltyId}): score ${penaltyEval.score} deve ser < 100`);
      }
    } else {
      failures.push(`  ⚠️  Cenário 4: sem tratamento penalizante disponível (verificar evaluationRules)`);
    }

    if (failures.length > 0) {
      console.log(`\n${label} — FALHOU:`);
      for (const f of failures) console.log(f);
      allPassed = false;
    } else {
      const s1 = essentialEval.score;
      const s2 = adequateEval.score;
      const s3 = combinedEval.score;
      console.log(`${label} ✓  essencial=${s1}  adequado=${s2}  combinado=${s3}`);
    }
  }
}

if (!allPassed) {
  console.log("\n⛔ Alguns cenários falharam.");
  process.exit(1);
} else {
  console.log("\n✅ Todos os cenários passaram para os 8 casos.");
}
