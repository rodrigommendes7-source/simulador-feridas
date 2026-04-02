import type { AvaliacaoSecao, HistoricoResolucao } from "@/app/types/simulador";
import type { CaseAttempt, CaseDefinition } from "@/types/clinical";

const TOPIC_LABELS: Record<string, string> = {
  "decisao-clinica": "Princípios de decisão clínica",
  "gestao-exsudado": "Gestão de exsudado",
  "protecao-perilesional": "Proteção da pele peri-ferida",
  desbridamento: "Desbridamento",
  antimicrobianos: "Antimicrobianos",
  "tecidos-e-leito": "Leito da ferida e identificação de tecidos",
  "materiais-desadequados": "Materiais desadequados",
};

export type CaseProgress = {
  completedSteps: number;
  totalSteps: number;
  percentage: number;
  readyToSubmit: boolean;
  currentStageLabel: string;
  checklist: { label: string; done: boolean; detail: string }[];
};

function normalizeText(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function buildCaseProgress(caseDefinition: CaseDefinition, attempt: CaseAttempt): CaseProgress {
  const imageSeen = attempt.observationIds.includes("imagem");
  const observationMinimum = imageSeen && attempt.observationIds.length >= 3;
  const dialogueMinimum = attempt.questionIds.length >= 2;
  const treatmentMinimum = attempt.treatmentIds.length >= 1;
  const applicationMinimum = attempt.applicationIds.length >= 1;

  const checklist = [
    {
      label: "Observação mínima",
      done: observationMinimum,
      detail: imageSeen
        ? `${attempt.observationIds.length}/${caseDefinition.observationItems.length} achados observados`
        : "Revê a imagem e pelo menos três achados clínicos",
    },
    {
      label: "Colheita de dados",
      done: dialogueMinimum,
      detail:
        attempt.questionIds.length > 0
          ? `${attempt.questionIds.length}/${caseDefinition.dialogueRules.length} perguntas feitas`
          : "Faz pelo menos duas perguntas clinicamente relevantes",
    },
    {
      label: "Escolha terapêutica",
      done: treatmentMinimum,
      detail:
        attempt.treatmentIds.length > 0
          ? `${attempt.treatmentIds.length} material(is) selecionado(s)`
          : "Escolhe pelo menos um material principal",
    },
    {
      label: "Forma de aplicação",
      done: applicationMinimum,
      detail:
        attempt.applicationIds.length > 0
          ? `${attempt.applicationIds.length} decisão(ões) de aplicação registada(s)`
          : "Define pelo menos uma regra de aplicação",
    },
  ];

  const completedSteps = checklist.filter((item) => item.done).length;
  const totalSteps = checklist.length;
  const percentage = Math.round((completedSteps / totalSteps) * 100);

  let currentStageLabel = "Observação inicial";
  if (observationMinimum) currentStageLabel = "Colheita de dados";
  if (observationMinimum && dialogueMinimum) currentStageLabel = "Plano terapêutico";
  if (observationMinimum && dialogueMinimum && treatmentMinimum && applicationMinimum) {
    currentStageLabel = "Pronto para submissão";
  }

  return {
    completedSteps,
    totalSteps,
    percentage,
    readyToSubmit: checklist.every((item) => item.done),
    currentStageLabel,
    checklist,
  };
}

export function buildLearningRecommendations(
  caseDefinition: CaseDefinition,
  sections: AvaliacaoSecao[]
) {
  const recommended = new Set<string>();
  const lowerSections = sections.filter(
    (section) =>
      section.pontuacao < section.maximo ||
      section.faltou.length > 0 ||
      section.errou.length > 0 ||
      section.excesso.length > 0
  );

  if (lowerSections.some((section) => normalizeText(section.nome).includes("observ"))) {
    recommended.add("tecidos-e-leito");
    recommended.add("decisao-clinica");
  }

  if (lowerSections.some((section) => normalizeText(section.nome).includes("dialog"))) {
    recommended.add("decisao-clinica");
  }

  if (lowerSections.some((section) => normalizeText(section.nome).includes("tratamento"))) {
    for (const topicId of caseDefinition.learningTopicIds) {
      recommended.add(topicId);
    }
  }

  if (lowerSections.some((section) => normalizeText(section.nome).includes("aplicacao"))) {
    recommended.add("protecao-perilesional");
    recommended.add("decisao-clinica");
  }

  return Array.from(recommended).slice(0, 3).map((topicId) => ({
    id: topicId,
    title: TOPIC_LABELS[topicId] ?? topicId,
  }));
}

export function buildReasoningSummary(sections: AvaliacaoSecao[]) {
  const strengths = sections.flatMap((section) => section.acertou).slice(0, 3);
  const gaps = sections.flatMap((section) => [...section.faltou, ...section.errou, ...section.excesso]).slice(0, 4);
  const safeConduct =
    sections
      .flatMap((section) => section.justificacaoPerda)
      .find(Boolean) ?? "Mantém um plano focado no problema dominante e reavalia a resposta clínica.";

  return {
    strengths,
    gaps,
    safeConduct,
  };
}

export function getWeakestDomains(entries: HistoricoResolucao[]) {
  const aggregates = new Map<string, { total: number; max: number; count: number }>();

  for (const entry of entries) {
    for (const section of entry.avaliacaoDetalhada ?? []) {
      const current = aggregates.get(section.nome) ?? { total: 0, max: 0, count: 0 };
      current.total += section.pontuacao;
      current.max += section.maximo;
      current.count += 1;
      aggregates.set(section.nome, current);
    }
  }

  return Array.from(aggregates.entries())
    .map(([name, value]) => ({
      name,
      score: value.max > 0 ? Math.round((value.total / value.max) * 100) : 0,
    }))
    .sort((a, b) => a.score - b.score);
}

export function getFrequentLearningRecommendations(entries: HistoricoResolucao[]) {
  const totals = new Map<string, number>();

  for (const entry of entries) {
    for (const topic of entry.recomendacoesAprendizagem ?? []) {
      totals.set(topic, (totals.get(topic) ?? 0) + 1);
    }
  }

  return Array.from(totals.entries())
    .map(([title, total]) => ({ title, total }))
    .sort((a, b) => b.total - a.total);
}
