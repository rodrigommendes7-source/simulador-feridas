/**
 * Validação dos 4 cenários por caso:
 * 1. Apenas essenciais → score 100
 * 2. Apenas adequados (sem essenciais) → score < 100
 * 3. Essenciais + adequados → score 100
 * 4. Essenciais + tratamento penalizante → score < 100
 */
import { getTreatment, listCaseTemplates } from "../lib/clinical/catalog.ts";
import { evaluateCaseAttempt } from "../lib/clinical/evaluation.ts";
import type { AttemptInput, CaseTemplate } from "../lib/clinical/types.ts";

function buildEssentialAttempt(template: CaseTemplate): AttemptInput {
  const obsIds = template.observationDefinitions
    .filter((d) => d.priority === "essencial")
    .map((d) => d.id);

  const dialogIds = template.dialoguePrompts
    .filter((d) => d.priority === "essencial")
    .map((d) => d.id);

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

let allPassed = true;

for (const template of listCaseTemplates()) {
  const label = `Caso ${template.id}`;
  const failures: string[] = [];

  // Cenário 1: apenas essenciais → 100
  const essentialAttempt = buildEssentialAttempt(template);
  const essentialEval = evaluateCaseAttempt(template, essentialAttempt);
  if (essentialEval.score !== 100) {
    failures.push(`  ❌ Cenário 1 (só essenciais): score ${essentialEval.score} ≠ 100`);
    const breakdown = essentialEval.sections
      .map((s) => `    ${s.id}: ${s.score}/${s.maxScore}`)
      .join("\n");
    failures.push(breakdown);
  }

  // Cenário 2: apenas adequados → < 100
  const adequateAttempt = buildAdequateAttempt(template);
  const adequateEval = evaluateCaseAttempt(template, adequateAttempt);
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
  const combinedEval = evaluateCaseAttempt(template, combinedAttempt);
  if (combinedEval.score !== 100) {
    failures.push(`  ❌ Cenário 3 (essenciais + adequados): score ${combinedEval.score} ≠ 100`);
    const breakdown = combinedEval.sections
      .map((s) => `    ${s.id}: ${s.score}/${s.maxScore}`)
      .join("\n");
    failures.push(breakdown);
  }

  // Cenário 4: essenciais + penalizante → < 100
  const penaltyId = findPenaltyTreatment(template);
  if (penaltyId) {
    const penaltyAttempt: AttemptInput = {
      ...essentialAttempt,
      treatmentIds: [...essentialAttempt.treatmentIds, penaltyId],
    };
    const penaltyEval = evaluateCaseAttempt(template, penaltyAttempt);
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

if (!allPassed) {
  console.log("\n⛔ Alguns cenários falharam.");
  process.exit(1);
} else {
  console.log("\n✅ Todos os cenários passaram.");
}
