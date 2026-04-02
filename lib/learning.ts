import { learningTopics, type LearningTopic } from "@/data/learning";
import { getCaseById } from "@/lib/cases";
import type { Tratamento } from "@/data/tratamentos";
import { listTreatments } from "@/lib/treatments";

export function listLearningTopics(): LearningTopic[] {
  return learningTopics;
}

export function getLearningTopic(topicId: string): LearningTopic | undefined {
  return learningTopics.find((topic) => topic.id === topicId);
}

export function getLearningTopicsByIds(topicIds: string[]) {
  return topicIds
    .map((topicId) => getLearningTopic(topicId))
    .filter((topic): topic is LearningTopic => Boolean(topic));
}

export function getTreatmentsForLearningTopic(topic: LearningTopic): Tratamento[] {
  return listTreatments().filter((treatment) => {
    const matchesCategory =
      topic.relatedCategories?.includes(treatment.categoria) ?? false;
    const matchesFunction =
      topic.relatedFunctions?.some((funcao) => treatment.funcoes.includes(funcao)) ?? false;
    const matchesId = topic.relatedTreatmentIds?.includes(treatment.id) ?? false;

    return matchesCategory || matchesFunction || matchesId;
  });
}

export function groupTreatmentsByCategory(treatmentsToGroup: Tratamento[]) {
  return treatmentsToGroup.reduce<Record<string, Tratamento[]>>((acc, treatment) => {
    if (!acc[treatment.categoria]) {
      acc[treatment.categoria] = [];
    }
    acc[treatment.categoria].push(treatment);
    return acc;
  }, {});
}

export function getCasesForLearningTopic(topic: LearningTopic) {
  return (topic.relatedCaseIds ?? [])
    .map((caseId) => getCaseById(caseId))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
}
