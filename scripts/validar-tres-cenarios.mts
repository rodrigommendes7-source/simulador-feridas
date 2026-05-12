/**
 * Validação dos 4 cenários por caso:
 * 1. Apenas essenciais → score 100
 * 2. Apenas adequados (sem essenciais) → score < 100
 * 3. Essenciais + adequados → score 100
 * 4. Essenciais + tratamento penalizante → score < 100
 */
import { obterTratamento, listarModelosCaso } from "../lib/clinico/catalogo.ts";
import { avaliarTentativaCaso } from "../lib/clinico/avaliacao.ts";
import type { EntradaTentativa, ModeloCaso } from "../lib/clinico/types.ts";

function buildEssentialAttempt(modelo: ModeloCaso): EntradaTentativa {
  const obsIds = modelo.definicoesObservacao
    .filter((d) => d.prioridade === "essencial")
    .map((d) => d.id);

  const dialogIds = modelo.promptsDialogo
    .filter((d) => d.prioridade === "essencial")
    .map((d) => d.id);

  const treatIds: string[] = [];
  for (const g of modelo.objetivosClinicosAlvo) {
    if (g.prioridade !== "essencial") continue;
    if (g.correspondencia.idsTratamento && g.correspondencia.idsTratamento.length > 0) {
      treatIds.push(g.correspondencia.idsTratamento[0]!);
    } else if (g.correspondencia.funcoesTratamento && g.correspondencia.funcoesTratamento.length > 0) {
      const fn = g.correspondencia.funcoesTratamento[0]!;
      const match = modelo.tratamentosDisponiveis.find((id) =>
        obterTratamento(id)?.funcoes.includes(fn)
      );
      if (match) treatIds.push(match);
    }
  }

  const appIds = modelo.objetivosClinicosAlvo
    .filter((g) => g.prioridade === "essencial" && g.correspondencia.idsAplicacao?.length)
    .flatMap((g) => g.correspondencia.idsAplicacao!.slice(0, 1));

  return {
    idsObservacao: obsIds,
    submissaoVisual: {
      tecidos: [...modelo.objetivosVisuais.tecidos],
      exsudado: [...modelo.objetivosVisuais.exsudado],
      bordos: [...modelo.objetivosVisuais.bordos],
    },
    idsDialogo: dialogIds,
    idsTratamento: treatIds,
    idsAplicacao: appIds,
  };
}

function buildAdequateAttempt(modelo: ModeloCaso): EntradaTentativa {
  const obsIds = modelo.definicoesObservacao
    .filter((d) => d.prioridade === "adequado")
    .map((d) => d.id);

  const dialogIds = modelo.promptsDialogo
    .filter((d) => d.prioridade === "adequado")
    .map((d) => d.id);

  const treatIds: string[] = [];
  for (const g of modelo.objetivosClinicosAlvo) {
    if (g.prioridade !== "adequado") continue;
    if (g.correspondencia.idsTratamento && g.correspondencia.idsTratamento.length > 0) {
      treatIds.push(g.correspondencia.idsTratamento[0]!);
    }
  }

  const appIds = modelo.objetivosClinicosAlvo
    .filter((g) => g.prioridade === "adequado" && g.correspondencia.idsAplicacao?.length)
    .flatMap((g) => g.correspondencia.idsAplicacao!.slice(0, 1));

  return {
    idsObservacao: obsIds,
    submissaoVisual: { tecidos: [], exsudado: [], bordos: [] },
    idsDialogo: dialogIds,
    idsTratamento: treatIds,
    idsAplicacao: appIds,
  };
}

function findPenaltyTreatment(modelo: ModeloCaso): string | null {
  const penaltyRules = modelo.regrasAvaliacao.filter(
    (r) =>
      r.alvo === "tratamento" &&
      (r.classificacao === "redundante" || r.classificacao === "inadequado")
  );
  for (const rule of penaltyRules) {
    const id = rule.aplicavelAIds.find((id) => modelo.tratamentosDisponiveis.includes(id));
    if (id) return id;
  }
  return null;
}

let allPassed = true;

for (const modelo of listarModelosCaso()) {
  const label = `Caso ${modelo.id}`;
  const failures: string[] = [];

  // Cenário 1: apenas essenciais → 100
  const essentialAttempt = buildEssentialAttempt(modelo);
  const essentialEval = avaliarTentativaCaso(modelo, essentialAttempt);
  if (essentialEval.pontuacao !== 100) {
    failures.push(`  ❌ Cenário 1 (só essenciais): score ${essentialEval.pontuacao} ≠ 100`);
    const breakdown = essentialEval.seccoes
      .map((s) => `    ${s.id}: ${s.pontuacao}/${s.pontuacaoMaxima}`)
      .join("\n");
    failures.push(breakdown);
  }

  // Cenário 2: apenas adequados → < 100
  const adequateAttempt = buildAdequateAttempt(modelo);
  const adequateEval = avaliarTentativaCaso(modelo, adequateAttempt);
  if (adequateEval.pontuacao >= 100) {
    failures.push(`  ❌ Cenário 2 (só adequados): score ${adequateEval.pontuacao} deve ser < 100`);
  }

  // Cenário 3: essenciais + adequados → 100
  const combinedAttempt: EntradaTentativa = {
    idsObservacao: [...essentialAttempt.idsObservacao, ...adequateAttempt.idsObservacao],
    submissaoVisual: essentialAttempt.submissaoVisual,
    idsDialogo: [...essentialAttempt.idsDialogo, ...adequateAttempt.idsDialogo],
    idsTratamento: [...essentialAttempt.idsTratamento, ...adequateAttempt.idsTratamento],
    idsAplicacao: [...essentialAttempt.idsAplicacao, ...adequateAttempt.idsAplicacao],
  };
  const combinedEval = avaliarTentativaCaso(modelo, combinedAttempt);
  if (combinedEval.pontuacao !== 100) {
    failures.push(`  ❌ Cenário 3 (essenciais + adequados): score ${combinedEval.pontuacao} ≠ 100`);
    const breakdown = combinedEval.seccoes
      .map((s) => `    ${s.id}: ${s.pontuacao}/${s.pontuacaoMaxima}`)
      .join("\n");
    failures.push(breakdown);
  }

  // Cenário 4: essenciais + penalizante → < 100
  const penaltyId = findPenaltyTreatment(modelo);
  if (penaltyId) {
    const penaltyAttempt: EntradaTentativa = {
      ...essentialAttempt,
      idsTratamento: [...essentialAttempt.idsTratamento, penaltyId],
    };
    const penaltyEval = avaliarTentativaCaso(modelo, penaltyAttempt);
    if (penaltyEval.pontuacao >= 100) {
      failures.push(`  ❌ Cenário 4 (essenciais + ${penaltyId}): score ${penaltyEval.pontuacao} deve ser < 100`);
    }
  } else {
    failures.push(`  ⚠️  Cenário 4: sem tratamento penalizante disponível (verificar evaluationRules)`);
  }

  if (failures.length > 0) {
    console.log(`\n${label} — FALHOU:`);
    for (const f of failures) console.log(f);
    allPassed = false;
  } else {
    const s1 = essentialEval.pontuacao;
    const s2 = adequateEval.pontuacao;
    const s3 = combinedEval.pontuacao;
    console.log(`${label} ✓  essencial=${s1}  adequado=${s2}  combinado=${s3}`);
  }
}

if (!allPassed) {
  console.log("\n⛔ Alguns cenários falharam.");
  process.exit(1);
} else {
  console.log("\n✅ Todos os cenários passaram.");
}
