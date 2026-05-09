import { caseTemplates } from "../../data/clinical/casos.ts";
import { evidenceReferences } from "../../data/clinical/evidencia.ts";
import { learningTopics } from "../../data/clinical/topicos-aprendizagem.ts";
import { treatmentCatalog } from "../../data/clinical/tratamentos.ts";
import type {
  ApplicationId,
  CaseTemplate,
  EvidenceReference,
  LearningTopic,
  TreatmentDefinition,
} from "./types.ts";

const treatmentById = new Map(treatmentCatalog.map((item) => [item.id, item]));
const topicById = new Map(learningTopics.map((item) => [item.id, item]));
const evidenceById = new Map(evidenceReferences.map((item) => [item.id, item]));
const templateById = new Map(caseTemplates.map((item) => [item.id, item]));

export function listCaseTemplates(): CaseTemplate[] {
  return caseTemplates;
}

export function getCaseTemplate(templateId: string): CaseTemplate | undefined {
  return templateById.get(templateId);
}

export function getCaseTitle(templateId: string) {
  return getCaseTemplate(templateId)?.title ?? templateId;
}

export function getPublishedCaseIds(): string[] {
  return caseTemplates.filter((item) => item.status === "disponivel").map((item) => item.id);
}

export function getTreatment(treatmentId: string): TreatmentDefinition | undefined {
  return treatmentById.get(treatmentId);
}

export function listTreatments(): TreatmentDefinition[] {
  return treatmentCatalog;
}

export function listLearningTopics(): LearningTopic[] {
  return learningTopics;
}

export function getLearningTopic(topicId: string): LearningTopic | undefined {
  return topicById.get(topicId);
}

export function getLearningTopicTitle(topicId: string) {
  return getLearningTopic(topicId)?.title ?? topicId;
}

export function getEvidence(evidenceId: string): EvidenceReference | undefined {
  return evidenceById.get(evidenceId);
}

export function getEvidenceForTreatment(treatmentId: string): EvidenceReference[] {
  const treatment = getTreatment(treatmentId);
  if (!treatment) return [];
  return treatment.evidenceRefs
    .map((evidenceId) => getEvidence(evidenceId))
    .filter((item): item is EvidenceReference => Boolean(item));
}


export function getTreatmentLabel(treatmentId: string) {
  return getTreatment(treatmentId)?.label ?? treatmentId;
}

export function getApplicationLabel(template: CaseTemplate, applicationId: ApplicationId) {
  return (
    template.applicationDefinitions.find((item) => item.id === applicationId)?.label ??
    applicationId
  );
}

export function getTemplateLearningTopicIds(templateId: string) {
  const template = getCaseTemplate(templateId);
  if (!template) return [];

  const topicIds = new Set<string>();

  for (const definition of template.observationDefinitions) {
    for (const topicId of definition.learningTopicIds) topicIds.add(topicId);
  }

  for (const prompt of template.dialoguePrompts) {
    for (const topicId of prompt.learningTopicIds) topicIds.add(topicId);
  }

  for (const application of template.applicationDefinitions) {
    for (const topicId of application.learningTopicIds) topicIds.add(topicId);
  }

  for (const topicId of template.learningTopicIds) topicIds.add(topicId);
  for (const goal of template.clinicalTargets) {
    for (const topicId of goal.learningTopicIds) topicIds.add(topicId);
  }
  for (const rule of template.evaluationRules) {
    for (const topicId of rule.learningTopicIds) topicIds.add(topicId);
  }

  return Array.from(topicIds);
}

export function getRandomCase(): CaseTemplate | undefined {
  const available = listCaseTemplates().filter((item) => item.status === "disponivel");
  if (available.length === 0) return undefined;
  return available[Math.floor(Math.random() * available.length)];
}

export function getRelatedCasesForTopic(topicId: string): CaseTemplate[] {
  const topic = getLearningTopic(topicId);
  if (!topic) return [];
  return topic.caseIds
    .map((caseId) => getCaseTemplate(caseId))
    .filter((item): item is CaseTemplate => Boolean(item));
}

export function getTreatmentsForTopic(topicId: string): TreatmentDefinition[] {
  const topic = getLearningTopic(topicId);
  if (!topic) return [];
  return topic.treatmentIds
    .map((treatmentId) => getTreatment(treatmentId))
    .filter((item): item is TreatmentDefinition => Boolean(item));
}
