import assert from "node:assert/strict";
import { obterTratamento, listarModelosCaso } from "./catalog.ts";
import { avaliarTentativaCaso, obterTentativaIdeal } from "./evaluation.ts";
import type { EntradaTentativa, ModeloCaso } from "./types.ts";

function construirTentativaVazia(): EntradaTentativa {
  return {
    idsObservacao: [],
    submissaoVisual: { tecidos: [], exsudado: [], bordos: [] },
    idsDialogo: [],
    idsTratamento: [],
    idsAplicacao: [],
  };
}

// Constrói tentativa com apenas os IDs essenciais de cada secção
function construirTentativaEssencial(modelo: ModeloCaso): EntradaTentativa {
  const obsIds = modelo.definicoesObservacao
    .filter((d) => d.prioridade === "essencial")
    .map((d) => d.id);

  const dialogIds = modelo.promptsDialogo
    .filter((d) => d.prioridade === "essencial")
    .map((d) => d.id);

  // Para cada goal essencial de tratamento, escolher o primeiro representante disponível
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

// Constrói tentativa com apenas os IDs adequados (sem nenhum essencial)
function construirTentativaAdequada(modelo: ModeloCaso): EntradaTentativa {
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

// Encontra um tratamento penalizante (redundante ou inadequado) para o cenário 4
function encontrarTratamentoPenalizante(modelo: ModeloCaso): string | null {
  const penaltyRules = modelo.regrasAvaliacao.filter(
    (r) =>
      r.alvo === "treatment" &&
      (r.classificacao === "redundante" || r.classificacao === "inadequado")
  );
  for (const rule of penaltyRules) {
    const id = rule.aplicavelAIds.find((id) => modelo.tratamentosDisponiveis.includes(id));
    if (id) return id;
  }
  return null;
}

function run() {
  for (const modelo of listarModelosCaso()) {
    const label = modelo.id;

    // 1. obterTentativaIdeal deve dar 100
    const idealAttempt = obterTentativaIdeal(modelo);
    const idealScore = avaliarTentativaCaso(modelo, idealAttempt).pontuacao;
    assert.equal(idealScore, 100, `[${label}] obterTentativaIdeal pontuacao deve ser 100, foi ${idealScore}`);

    // 2. Apenas essenciais deve dar 100
    const essentialAttempt = construirTentativaEssencial(modelo);
    const essentialScore = avaliarTentativaCaso(modelo, essentialAttempt).pontuacao;
    assert.equal(
      essentialScore,
      100,
      `[${label}] pontuacao com só essenciais deve ser 100, foi ${essentialScore}`
    );

    // 3. Apenas adequados (sem essenciais) deve ser < 100
    const adequateAttempt = construirTentativaAdequada(modelo);
    const adequateScore = avaliarTentativaCaso(modelo, adequateAttempt).pontuacao;
    assert.ok(
      adequateScore < 100,
      `[${label}] pontuacao com só adequados deve ser < 100, foi ${adequateScore}`
    );

    // 4. Essenciais + tratamento penalizante deve ser < 100
    const penaltyId = encontrarTratamentoPenalizante(modelo);
    if (penaltyId) {
      const penaltyAttempt: EntradaTentativa = {
        ...essentialAttempt,
        idsTratamento: [...essentialAttempt.idsTratamento, penaltyId],
      };
      const penaltyScore = avaliarTentativaCaso(modelo, penaltyAttempt).pontuacao;
      assert.ok(
        penaltyScore < 100,
        `[${label}] essenciais + penalizante (${penaltyId}) deve ser < 100, foi ${penaltyScore}`
      );
    }
  }

  console.log("Todos os testes de avaliação clínica passaram.");
}

run();
