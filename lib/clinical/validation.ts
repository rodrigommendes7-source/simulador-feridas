import { caseTemplates } from "../../data/clinical/casos.ts";
import { evidenceReferences } from "../../data/clinical/evidencia.ts";
import { learningTopics } from "../../data/clinical/topicos-aprendizagem.ts";
import { treatmentCatalog } from "../../data/clinical/tratamentos.ts";
import { evaluateCaseAttempt, getIdealAttempt } from "./evaluation.ts";

export type ValidationIssue = {
  level: "error" | "warning";
  scope: string;
  message: string;
};

function normalizeTopicId(topicId: string) {
  return topicId === "materiais-desadequados" ? "decisao-clinica" : topicId;
}

export function validateClinicalDomain() {
  const issues: ValidationIssue[] = [];
  const treatmentIds = new Set(treatmentCatalog.map((item) => item.id));
  const evidenceIds = new Set(evidenceReferences.map((item) => item.id));
  const topicIds = new Set(learningTopics.map((item) => item.id));

  for (const treatment of treatmentCatalog) {
    for (const evidenceId of treatment.evidenceRefs) {
      if (!evidenceIds.has(evidenceId)) {
        issues.push({
          level: "error",
          scope: `treatment:${treatment.id}`,
          message: `Referência de evidência inexistente: "${evidenceId}".`,
        });
      }
    }

    for (const topicId of treatment.learningTopicIds) {
      const normalizedTopicId = normalizeTopicId(topicId);
      if (!topicIds.has(normalizedTopicId)) {
        issues.push({
          level: "error",
          scope: `treatment:${treatment.id}`,
          message: `Tema inexistente referenciado: "${topicId}".`,
        });
      }
    }
  }

  for (const topic of learningTopics) {
    for (const evidenceId of topic.evidenceIds) {
      if (!evidenceIds.has(evidenceId)) {
        issues.push({
          level: "error",
          scope: `learning:${topic.id}`,
          message: `Tema referencia evidência inexistente: "${evidenceId}".`,
        });
      }
    }

    for (const treatmentId of topic.treatmentIds) {
      if (!treatmentIds.has(treatmentId)) {
        issues.push({
          level: "error",
          scope: `learning:${topic.id}`,
          message: `Tema referencia tratamento inexistente: "${treatmentId}".`,
        });
      }
    }
  }

  for (const template of caseTemplates) {
    const scope = `case:${template.id}`;
    const applicationDefinitionIds = new Set(
      template.applicationDefinitions.map((item) => item.id)
    );

    for (const treatmentId of template.availableTreatments) {
      if (!treatmentIds.has(treatmentId)) {
        issues.push({
          level: "error",
          scope,
          message: `Tratamento disponível não encontrado: "${treatmentId}".`,
        });
      }
    }

    // applicationOptions têm de ter definição correspondente em applicationDefinitions
    for (const applicationId of template.applicationOptions) {
      if (!applicationDefinitionIds.has(applicationId)) {
        issues.push({
          level: "error",
          scope,
          message: `applicationOptions refere técnica sem definição no template: "${applicationId}".`,
        });
      }
    }

    const templateApplicationOptions = new Set(template.applicationOptions);

    for (const goal of template.clinicalTargets) {
      for (const topicId of goal.learningTopicIds) {
        const normalizedTopicId = normalizeTopicId(topicId);
        if (!topicIds.has(normalizedTopicId)) {
          issues.push({
            level: "error",
            scope,
            message: `Objetivo clínico referencia tema inexistente: "${topicId}".`,
          });
        }
      }

      for (const treatmentId of goal.matcher.treatmentIds ?? []) {
        if (!template.availableTreatments.includes(treatmentId)) {
          issues.push({
            level: "error",
            scope,
            message: `Objetivo clínico refere tratamento não disponível no caso: "${treatmentId}".`,
          });
        }
      }

      // matcher.applicationIds têm de estar em applicationOptions do template
      for (const applicationId of goal.matcher.applicationIds ?? []) {
        if (!templateApplicationOptions.has(applicationId)) {
          issues.push({
            level: "error",
            scope,
            message: `Objetivo clínico refere técnica não disponível no caso: "${applicationId}".`,
          });
        }
      }
    }

    for (const rule of template.evaluationRules) {
      for (const ruleId of rule.appliesToIds) {
        if (rule.target === "treatment" && !template.availableTreatments.includes(ruleId)) {
          issues.push({
            level: "error",
            scope,
            message: `Regra de avaliação refere tratamento não disponível: "${ruleId}".`,
          });
        }

        // target === "application" tem de existir em applicationOptions do template
        if (rule.target === "application" && !templateApplicationOptions.has(ruleId as never)) {
          issues.push({
            level: "error",
            scope,
            message: `Regra de avaliação refere técnica não disponível: "${ruleId}".`,
          });
        }
      }

      for (const topicId of rule.learningTopicIds) {
        const normalizedTopicId = normalizeTopicId(topicId);
        if (!topicIds.has(normalizedTopicId)) {
          issues.push({
            level: "error",
            scope,
            message: `Regra de avaliação referencia tema inexistente: "${topicId}".`,
          });
        }
      }
    }

    // Simulação 100/100: o caso tem de ser perfeitamente solucionável
    try {
      const idealAttempt = getIdealAttempt(template);
      const evaluation = evaluateCaseAttempt(template, idealAttempt);

      if (evaluation.score !== 100) {
        const sectionDetail = evaluation.sections
          .filter((section) => section.score < section.maxScore)
          .map((section) => `${section.id}=${section.score}/${section.maxScore}`)
          .join(", ");

        issues.push({
          level: "error",
          scope,
          message: `Caso não atinge 100/100 com tentativa ideal (score=${evaluation.score}; secções abaixo do máximo: ${sectionDetail || "nenhuma"}).`,
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      issues.push({
        level: "error",
        scope,
        message: `Falha ao simular tentativa ideal: ${message}`,
      });
    }
  }

  return {
    ok: !issues.some((issue) => issue.level === "error"),
    issues,
  };
}
