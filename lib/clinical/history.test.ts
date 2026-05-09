import assert from "node:assert/strict";
import {
  getCaseProgress,
  getRecommendedNextCases,
  getStudyPlan,
  getTopicMastery,
} from "./history.ts";
import type { AttemptRecord } from "./types.ts";

const baseAttempt: AttemptRecord = {
  version: 3,
  id: "attempt-1",
  templateId: "1",
  caseTitle: "Lesao por pressao",
  score: 58,
  previousBestScoreForCase: null,
  sectionScores: {
    observation: 9,
    assessment: 6,
    "treatment-plan": 28,
    "application-technique": 15,
  },
  mistakeCodes: ["treatment-plan-1"],
  learningRecommendations: ["gestao-exsudado", "protecao-perilesional"],
  templateLearningTopicIds: ["gestao-exsudado", "protecao-perilesional", "decisao-clinica"],
  recommendedNextCaseIds: ["4"],
  dominantWeakTopics: ["gestao-exsudado"],
  selectedObservationIds: ["imagem", "exsudado", "tecidos"],
  selectedDialogueIds: ["dor", "posicao"],
  selectedTreatmentIds: ["aquacel-simples"],
  selectedApplicationIds: ["penso_simples"],
  summary: "Reforca a leitura do exsudado.",
  timestamp: "2026-04-02T10:00:00.000Z",
  durationSeconds: 320,
};

const attempts: AttemptRecord[] = [
  {
    ...baseAttempt,
    id: "attempt-2",
    templateId: "2",
    caseTitle: "Ferida cirurgica com deiscencia",
    score: 46,
    previousBestScoreForCase: null,
    learningRecommendations: ["antimicrobianos", "gestao-exsudado"],
    templateLearningTopicIds: ["antimicrobianos", "gestao-exsudado", "decisao-clinica"],
    recommendedNextCaseIds: ["3"],
    dominantWeakTopics: ["antimicrobianos", "gestao-exsudado"],
    timestamp: "2026-04-03T10:00:00.000Z",
  },
  {
    ...baseAttempt,
    id: "attempt-3",
    score: 74,
    previousBestScoreForCase: 58,
    learningRecommendations: ["protecao-perilesional"],
    dominantWeakTopics: ["protecao-perilesional"],
    timestamp: "2026-04-04T10:00:00.000Z",
  },
  baseAttempt,
];

function run() {
  const mastery = getTopicMastery(attempts);
  assert.equal(mastery[0]?.topicId, "gestao-exsudado");
  assert.ok((mastery[0]?.masteryScore ?? 0) <= (mastery[1]?.masteryScore ?? 100));

  const recommendations = getRecommendedNextCases(attempts);
  assert.ok(recommendations.length > 0);
  assert.ok(
    recommendations.some(
      (recommendation) =>
        recommendation.matchTopics.includes("gestao-exsudado") ||
        recommendation.matchTopics.includes("antimicrobianos")
    )
  );

  const progress = getCaseProgress(attempts, "1");
  assert.equal(progress.bestScore, 74);
  assert.equal(progress.previousBestScore, 58);
  assert.equal(progress.attempts, 2);

  const plan = getStudyPlan(attempts);
  assert.ok(plan.retryCase);
  assert.ok(plan.reviewTopic);
  assert.ok(plan.followUpCase);

  console.log("Clinical history tests passed.");
}

run();
