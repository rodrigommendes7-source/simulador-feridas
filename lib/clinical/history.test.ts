import assert from "node:assert/strict";
import {
  obterProgressoCaso,
  obterCasosRecomendadosSeguintes,
  obterPlanoEstudo,
  obterMestriaTema,
} from "./history.ts";
import type { RegistoTentativa } from "./types.ts";

const baseAttempt: RegistoTentativa = {
  version: 3,
  id: "tentativa-1",
  idCaso: "1",
  tituloCaso: "Lesao por pressao",
  pontuacao: 58,
  melhorPontuacaoAnteriorCaso: null,
  pontuacoesPorSeccao: {
    observacao: 9,
    avaliacao: 6,
    "plano-terapeutico": 28,
    "tecnica-aplicacao": 15,
  },
  codigosErro: ["plano-terapeutico-1"],
  recomendacoesAprendizagem: ["gestao-exsudado", "protecao-perilesional"],
  idsTemasCaso: ["gestao-exsudado", "protecao-perilesional", "decisao-clinica"],
  idsProximosCasos: ["4"],
  temasFracosDominantes: ["gestao-exsudado"],
  observacoesSeleccionadas: ["imagem", "exsudado", "tecidos"],
  dialogosSeleccionados: ["dor", "posicao"],
  tratamentosSeleccionados: ["aquacel-simples"],
  aplicacoesSeleccionadas: ["penso_simples"],
  resumo: "Reforca a leitura do exsudado.",
  data: "2026-04-02T10:00:00.000Z",
  duracaoSegundos: 320,
};

const attempts: RegistoTentativa[] = [
  {
    ...baseAttempt,
    id: "tentativa-2",
    idCaso: "2",
    tituloCaso: "Ferida cirurgica com deiscencia",
    pontuacao: 46,
    melhorPontuacaoAnteriorCaso: null,
    recomendacoesAprendizagem: ["antimicrobianos", "gestao-exsudado"],
    idsTemasCaso: ["antimicrobianos", "gestao-exsudado", "decisao-clinica"],
    idsProximosCasos: ["3"],
    temasFracosDominantes: ["antimicrobianos", "gestao-exsudado"],
    data: "2026-04-03T10:00:00.000Z",
  },
  {
    ...baseAttempt,
    id: "tentativa-3",
    pontuacao: 74,
    melhorPontuacaoAnteriorCaso: 58,
    recomendacoesAprendizagem: ["protecao-perilesional"],
    temasFracosDominantes: ["protecao-perilesional"],
    data: "2026-04-04T10:00:00.000Z",
  },
  baseAttempt,
];

function run() {
  const mastery = obterMestriaTema(attempts);
  assert.equal(mastery[0]?.idTema, "gestao-exsudado");
  assert.ok((mastery[0]?.pontuacaoMestria ?? 0) <= (mastery[1]?.pontuacaoMestria ?? 100));

  const recommendations = obterCasosRecomendadosSeguintes(attempts);
  assert.ok(recommendations.length > 0);
  assert.ok(
    recommendations.some(
      (recommendation) =>
        recommendation.topicosCorrespondentes.includes("gestao-exsudado") ||
        recommendation.topicosCorrespondentes.includes("antimicrobianos")
    )
  );

  const progress = obterProgressoCaso(attempts, "1");
  assert.equal(progress.melhorPontuacao, 74);
  assert.equal(progress.melhorPontuacaoAnterior, 58);
  assert.equal(progress.tentativas, 2);

  const plan = obterPlanoEstudo(attempts);
  assert.ok(plan.retryCase);
  assert.ok(plan.reviewTopic);
  assert.ok(plan.followUpCase);

  console.log("Testes de histórico clínico concluídos.");
}

run();
