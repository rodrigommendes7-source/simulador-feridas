import {
  calcularPontuacao,
  normalizarSecoesAvaliacao,
} from "@/app/lib/simulador";
import { obterEvidenciasMaterial } from "@/app/lib/evidencia-materiais";
import type {
  AplicacaoId,
  AvaliacaoSecao,
  FeedbackLink,
  PerguntaId,
  TratamentoId,
} from "@/app/types/simulador";
import type {
  ApplicationRule,
  CaseAttempt,
  CaseDefinition,
  ObservationId,
} from "@/types/clinical";

function createSection(nome: string, maximo: number): AvaliacaoSecao {
  return {
    nome,
    pontuacao: 0,
    maximo,
    acertou: [],
    errou: [],
    faltou: [],
    excesso: [],
    justificacaoPerda: [],
  };
}

function evaluateObservation(caseDefinition: CaseDefinition, selectedIds: ObservationId[]) {
  const section = createSection("Observação", 15);
  const selectedSet = new Set(selectedIds);

  for (const item of caseDefinition.observationItems) {
    if (selectedSet.has(item.id)) {
      section.pontuacao += item.score;
      section.acertou.push(item.successText);
    } else {
      section.faltou.push(item.missingText);
      section.justificacaoPerda.push(item.lossReason);
    }
  }

  return section;
}

function evaluateDialogue(caseDefinition: CaseDefinition, questionIds: PerguntaId[]) {
  const section = createSection("Diálogo / colheita de dados", 15);
  const selectedSet = new Set(questionIds);

  for (const rule of caseDefinition.dialogueRules) {
    if (selectedSet.has(rule.id)) {
      section.pontuacao += rule.score;
      section.acertou.push(rule.successText);
    } else {
      if (rule.missingText) {
        section.faltou.push(rule.missingText);
      }
      section.justificacaoPerda.push(rule.lossReason);
    }
  }

  return section;
}

function applyApplicationRule(
  section: AvaliacaoSecao,
  rule: ApplicationRule,
  selectedIds: Set<AplicacaoId>
) {
  if (rule.type === "required") {
    if (selectedIds.has(rule.id)) {
      section.pontuacao += rule.score;
      section.acertou.push(rule.successText);
    } else {
      if (rule.missingText) {
        section.faltou.push(rule.missingText);
      }
      section.justificacaoPerda.push(rule.lossReason);
    }
    return;
  }

  if (rule.type === "penalty") {
    if (selectedIds.has(rule.id)) {
      section.pontuacao += rule.score;
      section.errou.push(rule.errorText);
      section.justificacaoPerda.push(rule.lossReason);
    }
    return;
  }

  if (rule.type === "excess") {
    if (selectedIds.size >= rule.minimumSelected) {
      section.pontuacao += rule.score;
      section.excesso.push(rule.excessText);
      section.justificacaoPerda.push(rule.lossReason);
    }
    return;
  }

  const hasAllRequired = rule.requiredIds.every((id) => selectedIds.has(id));
  const hasBlocked = (rule.blockedIds ?? []).some((id) => selectedIds.has(id));

  if (hasAllRequired && !hasBlocked) {
    section.pontuacao += rule.score;
    section.acertou.push(rule.successText);
  } else if (section.pontuacao < section.maximo) {
    section.justificacaoPerda.push(rule.lossReason);
  }
}

function evaluateApplication(caseDefinition: CaseDefinition, applicationIds: AplicacaoId[]) {
  const section = createSection("Forma de aplicação", 20);
  const selectedSet = new Set(applicationIds);

  for (const rule of caseDefinition.applicationRules) {
    applyApplicationRule(section, rule, selectedSet);
  }

  return section;
}

export function buildFeedbackLinks(
  caseDefinition: CaseDefinition,
  selectedTreatmentIds: TratamentoId[],
  treatmentNames: Record<TratamentoId, string>
): FeedbackLink[] {
  const { linksEvidencia, recomendacoesPorErro } = caseDefinition.config;

  const selectedLinksFromCase: FeedbackLink[] = selectedTreatmentIds
    .filter((item) => linksEvidencia[item])
    .map((item) => ({
      material: treatmentNames[item],
      titulo: linksEvidencia[item]!.titulo,
      url: linksEvidencia[item]!.url,
      explicacao: "Artigo de apoio relacionado com o material selecionado.",
    }));

  const selectedLinksFromCatalog: FeedbackLink[] = selectedTreatmentIds.flatMap((item) =>
    obterEvidenciasMaterial(item).map((article) => ({
      material: treatmentNames[item],
      titulo: article.titulo,
      url: article.url,
      explicacao: article.explicacao,
    }))
  );

  const recommendationLinks: FeedbackLink[] = selectedTreatmentIds
    .filter((item) => recomendacoesPorErro[item])
    .map((item) => ({
      material: treatmentNames[item],
      correto: recomendacoesPorErro[item]!.correto,
      titulo: recomendacoesPorErro[item]!.titulo,
      url: recomendacoesPorErro[item]!.url,
      explicacao: recomendacoesPorErro[item]!.explicacao,
    }));

  return [...recommendationLinks, ...selectedLinksFromCase, ...selectedLinksFromCatalog].filter(
    (item, index, arr) =>
      arr.findIndex((current) => current.material === item.material && current.url === item.url) ===
      index
  );
}

export function getScoreFeedback(caseDefinition: CaseDefinition, score: number) {
  return (
    caseDefinition.feedbackBands.find((band) => score >= band.minScore)?.text ??
    caseDefinition.feedbackBands[caseDefinition.feedbackBands.length - 1]?.text ??
    ""
  );
}

export function evaluateCaseAttempt(
  caseDefinition: CaseDefinition,
  attempt: CaseAttempt,
  treatmentNames: Record<TratamentoId, string>
) {
  const sections = normalizarSecoesAvaliacao([
    evaluateObservation(caseDefinition, attempt.observationIds),
    evaluateDialogue(caseDefinition, attempt.questionIds),
    caseDefinition.treatmentEvaluator(attempt.treatmentIds),
    evaluateApplication(caseDefinition, attempt.applicationIds),
  ]);
  const score = calcularPontuacao(sections);

  return {
    sections,
    score,
    feedback: getScoreFeedback(caseDefinition, score),
    feedbackLinks: buildFeedbackLinks(
      caseDefinition,
      attempt.treatmentIds,
      treatmentNames
    ),
  };
}
