import {
  getCaseTemplate,
  getCaseTitle,
  getCaseVariant,
  getLearningTopic,
  getTemplateLearningTopicIds,
  listCaseTemplates,
} from "./catalog.ts";
import type {
  AttemptInput,
  AttemptRecord,
  CaseEvaluation,
  CaseProgress,
  RecommendedCase,
  TopicMastery,
} from "./types.ts";

export const HISTORY_STORAGE_KEY = "historico_resolucoes_feridas";

type LegacyEntry = {
  id?: string;
  casoId?: string;
  casoTitulo?: string;
  pontuacao?: number;
  data?: string;
  feedback?: string;
};

export function createAttemptId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `attempt-${Date.now()}`;
}

function parseLegacyTemplateId(value: string | undefined) {
  if (!value) return "legacy";
  return value.replace("caso-", "");
}

function normalizeTopicId(topicId: string) {
  return topicId === "materiais-desadequados" ? "decisao-clinica" : topicId;
}

function dedupeTopicIds(topicIds: string[]) {
  return Array.from(new Set(topicIds.map(normalizeTopicId)));
}

function getBestScoreBefore(history: AttemptRecord[], templateId: string) {
  const scores = history
    .filter((entry) => entry.templateId === templateId)
    .map((entry) => entry.score);

  return scores.length > 0 ? Math.max(...scores) : null;
}

function getAverageScoreForCase(history: AttemptRecord[], templateId: string) {
  const entries = history.filter((entry) => entry.templateId === templateId);
  if (entries.length === 0) return null;
  return Math.round(entries.reduce((acc, entry) => acc + entry.score, 0) / entries.length);
}

function migrateLegacyEntries(raw: unknown): AttemptRecord[] {
  if (!Array.isArray(raw)) return [];

  return raw.map((item, index) => {
    const legacy = item as LegacyEntry;
    return {
      version: 2,
      id: legacy.id ?? `legacy-${index}`,
      templateId: parseLegacyTemplateId(legacy.casoId),
      variantId: "legacy",
      caseTitle: legacy.casoTitulo ?? "Caso legado",
      variantTitle: "Tentativa anterior",
      score: Number(legacy.pontuacao) || 0,
      previousBestScoreForCase: null,
      sectionScores: {},
      mistakeCodes: [],
      learningRecommendations: [],
      templateLearningTopicIds: [],
      recommendedNextCaseIds: [],
      dominantWeakTopics: [],
      selectedObservationIds: [],
      selectedDialogueIds: [],
      selectedTreatmentIds: [],
      selectedApplicationIds: [],
      summary: legacy.feedback ?? "",
      timestamp: legacy.data ?? new Date().toISOString(),
      durationSeconds: 0,
    };
  });
}

function normalizeRecord(item: unknown): AttemptRecord | null {
  if (!item || typeof item !== "object") return null;
  const record = item as Partial<AttemptRecord>;
  if (record.version !== 2) return null;

  return {
    version: 2,
    id: typeof record.id === "string" ? record.id : createAttemptId(),
    templateId: typeof record.templateId === "string" ? record.templateId : "unknown",
    variantId: typeof record.variantId === "string" ? record.variantId : "unknown",
    caseTitle: typeof record.caseTitle === "string" ? record.caseTitle : "Caso",
    variantTitle: typeof record.variantTitle === "string" ? record.variantTitle : "Caso",
    score: typeof record.score === "number" ? record.score : 0,
    previousBestScoreForCase:
      typeof record.previousBestScoreForCase === "number" ? record.previousBestScoreForCase : null,
    sectionScores:
      typeof record.sectionScores === "object" && record.sectionScores ? record.sectionScores : {},
    mistakeCodes: Array.isArray(record.mistakeCodes) ? record.mistakeCodes : [],
    learningRecommendations: Array.isArray(record.learningRecommendations)
      ? record.learningRecommendations.map(normalizeTopicId)
      : [],
    templateLearningTopicIds: Array.isArray(record.templateLearningTopicIds)
      ? dedupeTopicIds(record.templateLearningTopicIds)
      : dedupeTopicIds(getTemplateLearningTopicIds(typeof record.templateId === "string" ? record.templateId : "")),
    recommendedNextCaseIds: Array.isArray(record.recommendedNextCaseIds)
      ? record.recommendedNextCaseIds
      : [],
    dominantWeakTopics: Array.isArray(record.dominantWeakTopics)
      ? dedupeTopicIds(record.dominantWeakTopics)
      : [],
    selectedObservationIds: Array.isArray(record.selectedObservationIds)
      ? record.selectedObservationIds
      : [],
    selectedDialogueIds: Array.isArray(record.selectedDialogueIds) ? record.selectedDialogueIds : [],
    selectedTreatmentIds: Array.isArray(record.selectedTreatmentIds)
      ? record.selectedTreatmentIds
      : [],
    selectedApplicationIds: Array.isArray(record.selectedApplicationIds)
      ? record.selectedApplicationIds
      : [],
    summary: typeof record.summary === "string" ? record.summary : "",
    timestamp: typeof record.timestamp === "string" ? record.timestamp : new Date().toISOString(),
    durationSeconds: typeof record.durationSeconds === "number" ? record.durationSeconds : 0,
  };
}

export function loadAttemptHistory(): AttemptRecord[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
  if (!raw) return [];

  let parsed: unknown;

  try {
    parsed = JSON.parse(raw) as unknown;
  } catch {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
    return [];
  }

  if (Array.isArray(parsed) && parsed.every((item) => (item as AttemptRecord).version === 2)) {
    return parsed
      .map((item) => normalizeRecord(item))
      .filter((item): item is AttemptRecord => Boolean(item));
  }

  const migrated = migrateLegacyEntries(parsed);
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(migrated));
  return migrated;
}

export function saveAttemptRecord(record: AttemptRecord) {
  if (typeof window === "undefined") return;
  const current = loadAttemptHistory();
  current.unshift(record);
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(current));
}

export function clearAttemptHistory() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(HISTORY_STORAGE_KEY);
}

export function exportHistoryAsJson(): void {
  if (typeof window === "undefined") return;
  const history = loadAttemptHistory();
  const date = new Date().toISOString().slice(0, 10);
  const blob = new Blob([JSON.stringify(history, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `progresso-feridas-${date}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export type ImportResult = { ok: true; count: number } | { ok: false; error: string };

export function importHistoryFromJson(raw: unknown): ImportResult {
  if (typeof window === "undefined") return { ok: false, error: "Não disponível no servidor." };
  if (!Array.isArray(raw)) return { ok: false, error: "O ficheiro não contém um array de tentativas." };

  const REQUIRED: Array<keyof AttemptRecord> = ["version", "id", "templateId", "variantId", "caseTitle", "score", "timestamp"];
  const valid = raw.filter((item): item is AttemptRecord => {
    if (!item || typeof item !== "object") return false;
    const r = item as Partial<AttemptRecord>;
    return r.version === 2 && REQUIRED.every((f) => f in r);
  });

  if (valid.length === 0) {
    return { ok: false, error: "Nenhum registo válido encontrado. Verifica se o ficheiro foi exportado nesta aplicação." };
  }
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(valid));
  return { ok: true, count: valid.length };
}

export function countAttemptsForCase(history: AttemptRecord[], templateId: string) {
  return history.filter((entry) => entry.templateId === templateId).length;
}

export function getPreviousBestScoreForCase(history: AttemptRecord[], templateId: string) {
  return getBestScoreBefore(history, templateId);
}

export function getCaseProgress(
  history: AttemptRecord[],
  templateId: string
): CaseProgress {
  const entries = history.filter((entry) => entry.templateId === templateId);
  const scores = entries.map((entry) => entry.score);
  const latestScore = entries[0]?.score ?? null;
  const bestScore = scores.length > 0 ? Math.max(...scores) : null;
  const previousBestScore =
    scores.length > 1 ? Math.max(...scores.slice(1)) : entries[0]?.previousBestScoreForCase ?? null;

  return {
    templateId,
    title: getCaseTitle(templateId),
    attempts: entries.length,
    averageScore: entries.length > 0 ? Math.round(scores.reduce((acc, score) => acc + score, 0) / entries.length) : null,
    bestScore,
    latestScore,
    previousBestScore,
    hasCompleted: entries.length > 0,
  };
}

function sortByPriority(items: RecommendedCase[]) {
  return items.sort((a, b) => {
    if (a.averageScore === null && b.averageScore !== null) return 1;
    if (a.averageScore !== null && b.averageScore === null) return -1;
    if (a.averageScore !== null && b.averageScore !== null && a.averageScore !== b.averageScore) {
      return a.averageScore - b.averageScore;
    }
    return a.attempts - b.attempts;
  });
}

export function getRecommendedNextCases(history: AttemptRecord[]): RecommendedCase[] {
  const weakTopics = getTopicMastery(history).slice(0, 3).map((topic) => topic.topicId);

  return sortByPriority(
    listCaseTemplates()
      .filter((template) => template.status === "disponivel")
      .map((template) => {
        const progress = getCaseProgress(history, template.id);
        const topicIds = getTemplateLearningTopicIds(template.id).map(normalizeTopicId);
        const matchTopics = topicIds.filter((topicId) => weakTopics.includes(topicId));
        const fallbackTopic = topicIds[0];

        if (matchTopics.length === 0 && progress.attempts > 0) return null;

        return {
          templateId: template.id,
          title: template.title,
          shortTitle: template.shortTitle,
          difficulty: template.difficulty,
          reason:
            matchTopics.length > 0
              ? `Ajuda a reforçar ${matchTopics
                  .map((topicId) => getLearningTopic(topicId)?.title ?? topicId)
                  .join(", ")}.`
              : `Bom próximo passo para consolidar ${getLearningTopic(fallbackTopic)?.title ?? "o raciocínio clínico"}.`,
          matchTopics: matchTopics.length > 0 ? matchTopics : fallbackTopic ? [fallbackTopic] : [],
          averageScore: progress.averageScore,
          attempts: progress.attempts,
        } satisfies RecommendedCase;
      })
      .filter((item): item is RecommendedCase => Boolean(item))
  ).slice(0, 4);
}

export function buildAttemptRecord(params: {
  evaluation: CaseEvaluation;
  history: AttemptRecord[];
  templateId: string;
  variantId: string;
  durationSeconds: number;
  attempt: AttemptInput;
}): AttemptRecord {
  const template = getCaseTemplate(params.templateId);
  const variant = getCaseVariant(params.templateId, params.variantId);
  const inadequateItems = params.evaluation.sections
    .flatMap((section) => section.items)
    .filter((item) => item.classification === "inadequado" || item.classification === "redundante");
  const learningRecommendations = params.evaluation.learningRecommendations.map(
    (recommendation) => recommendation.topicId
  );
  const dominantWeakTopics = dedupeTopicIds(
    params.evaluation.sections
      .flatMap((section) =>
        section.items
          .filter((item) => item.classification === "inadequado" || item.classification === "redundante")
          .flatMap((item) => item.learningTopicIds)
      )
      .slice(0, 6)
  );
  const syntheticHistory = [
    ...params.history,
    {
      version: 2,
      id: "preview",
      templateId: params.templateId,
      variantId: params.variantId,
      caseTitle: template?.title ?? params.templateId,
      variantTitle: variant?.title ?? params.variantId,
      score: params.evaluation.score,
      previousBestScoreForCase: getBestScoreBefore(params.history, params.templateId),
      sectionScores: Object.fromEntries(
        params.evaluation.sections.map((section) => [section.id, section.score])
      ),
      mistakeCodes: inadequateItems.map((item) => item.id),
      learningRecommendations,
      templateLearningTopicIds: dedupeTopicIds(getTemplateLearningTopicIds(params.templateId)),
      recommendedNextCaseIds: [],
      dominantWeakTopics,
      selectedObservationIds: params.attempt.observationIds,
      selectedDialogueIds: params.attempt.dialogueIds,
      selectedTreatmentIds: params.attempt.treatmentIds,
      selectedApplicationIds: params.attempt.applicationIds,
      summary: params.evaluation.reasoningSummary.nextStep,
      timestamp: new Date().toISOString(),
      durationSeconds: params.durationSeconds,
    } satisfies AttemptRecord,
  ];

  return {
    version: 2,
    id: createAttemptId(),
    templateId: params.templateId,
    variantId: params.variantId,
    caseTitle: template?.title ?? params.templateId,
    variantTitle: variant?.title ?? template?.title ?? params.variantId,
    score: params.evaluation.score,
    previousBestScoreForCase: getBestScoreBefore(params.history, params.templateId),
    sectionScores: Object.fromEntries(
      params.evaluation.sections.map((section) => [section.id, section.score])
    ),
    mistakeCodes: inadequateItems.map((item) => item.id),
    learningRecommendations,
    templateLearningTopicIds: dedupeTopicIds(getTemplateLearningTopicIds(params.templateId)),
    recommendedNextCaseIds: getRecommendedNextCases(syntheticHistory).map((item) => item.templateId),
    dominantWeakTopics,
    selectedObservationIds: params.attempt.observationIds,
    selectedDialogueIds: params.attempt.dialogueIds,
    selectedTreatmentIds: params.attempt.treatmentIds,
    selectedApplicationIds: params.attempt.applicationIds,
    summary: params.evaluation.reasoningSummary.nextStep,
    timestamp: new Date().toISOString(),
    durationSeconds: params.durationSeconds,
  };
}

export function getAverageScore(history: AttemptRecord[]) {
  if (history.length === 0) return 0;
  return Math.round(history.reduce((acc, entry) => acc + entry.score, 0) / history.length);
}

export function getBestScore(history: AttemptRecord[]) {
  if (history.length === 0) return 0;
  return Math.max(...history.map((entry) => entry.score));
}

export function getWeakestSections(history: AttemptRecord[]) {
  const totals = new Map<string, { total: number; count: number }>();

  for (const entry of history) {
    for (const [sectionId, score] of Object.entries(entry.sectionScores)) {
      const current = totals.get(sectionId) ?? { total: 0, count: 0 };
      current.total += score;
      current.count += 1;
      totals.set(sectionId, current);
    }
  }

  return Array.from(totals.entries())
    .map(([sectionId, value]) => ({
      sectionId,
      average: Math.round(value.total / value.count),
    }))
    .sort((a, b) => a.average - b.average);
}

export function getMostRecommendedTopics(history: AttemptRecord[]) {
  const totals = new Map<string, number>();

  for (const entry of history) {
    for (const topicId of entry.learningRecommendations) {
      const normalizedTopicId = normalizeTopicId(topicId);
      totals.set(normalizedTopicId, (totals.get(normalizedTopicId) ?? 0) + 1);
    }
  }

  return Array.from(totals.entries())
    .map(([topicId, count]) => ({
      topicId,
      count,
      title: getLearningTopic(topicId)?.title ?? topicId,
    }))
    .sort((a, b) => b.count - a.count);
}

export function getTopicMastery(history: AttemptRecord[]): TopicMastery[] {
  const exposureCounts = new Map<string, number>();
  const recommendationCounts = new Map<string, number>();
  const weakSignalCounts = new Map<string, number>();

  for (const entry of history) {
    for (const topicId of entry.templateLearningTopicIds) {
      const normalizedTopicId = normalizeTopicId(topicId);
      exposureCounts.set(normalizedTopicId, (exposureCounts.get(normalizedTopicId) ?? 0) + 1);
    }

    for (const topicId of entry.learningRecommendations) {
      const normalizedTopicId = normalizeTopicId(topicId);
      recommendationCounts.set(
        normalizedTopicId,
        (recommendationCounts.get(normalizedTopicId) ?? 0) + 1
      );
    }

    for (const topicId of entry.dominantWeakTopics) {
      const normalizedTopicId = normalizeTopicId(topicId);
      weakSignalCounts.set(normalizedTopicId, (weakSignalCounts.get(normalizedTopicId) ?? 0) + 1);
    }
  }

  const allTopicIds = new Set<string>([
    ...exposureCounts.keys(),
    ...recommendationCounts.keys(),
    ...weakSignalCounts.keys(),
  ]);

  return Array.from(allTopicIds)
    .map((topicId) => {
      const exposureCount = exposureCounts.get(topicId) ?? 0;
      const recommendationCount = recommendationCounts.get(topicId) ?? 0;
      const weakSignalCount = weakSignalCounts.get(topicId) ?? 0;
      const masteryScore = Math.max(
        0,
        Math.min(100, 76 + exposureCount * 6 - recommendationCount * 12 - weakSignalCount * 8)
      );

      return {
        topicId,
        title: getLearningTopic(topicId)?.title ?? topicId,
        masteryScore,
        recommendationCount,
        weakSignalCount,
        exposureCount,
      };
    })
    .sort((a, b) => a.masteryScore - b.masteryScore);
}

export function getCaseRetryPriority(history: AttemptRecord[]) {
  const totals = new Map<string, { total: number; count: number }>();

  for (const entry of history) {
    const current = totals.get(entry.templateId) ?? { total: 0, count: 0 };
    current.total += entry.score;
    current.count += 1;
    totals.set(entry.templateId, current);
  }

  return Array.from(totals.entries())
    .map(([templateId, value]) => ({
      templateId,
      average: Math.round(value.total / value.count),
      attempts: value.count,
      title: getCaseTemplate(templateId)?.title ?? templateId,
    }))
    .sort((a, b) => a.average - b.average);
}

export function getStudyPlan(history: AttemptRecord[]) {
  const retryCase = getCaseRetryPriority(history)[0] ?? null;
  const reviewTopic = getTopicMastery(history)[0] ?? null;
  const followUpCase = getRecommendedNextCases(history).find(
    (item) => item.templateId !== retryCase?.templateId
  ) ?? null;

  return {
    retryCase,
    reviewTopic,
    followUpCase,
  };
}

export function getRecentBestScore(history: AttemptRecord[]) {
  return history[0]?.score ?? 0;
}

export function getCasesCompletedCount(history: AttemptRecord[]) {
  return new Set(history.map((entry) => entry.templateId)).size;
}

export function getContinueLearningTarget(history: AttemptRecord[]) {
  const latest = history[0];
  if (!latest) return null;

  const nextCaseId = latest.recommendedNextCaseIds[0] ?? latest.templateId;

  return {
    lastCaseTitle: latest.caseTitle,
    reviewTopicId: latest.learningRecommendations[0] ?? latest.dominantWeakTopics[0] ?? null,
    nextCaseId,
    nextCaseTitle: getCaseTitle(nextCaseId),
  };
}

export function getCaseAverageScore(history: AttemptRecord[], templateId: string) {
  return getAverageScoreForCase(history, templateId);
}
