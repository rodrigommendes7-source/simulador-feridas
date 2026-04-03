import { caseTemplates } from "../../data/clinical/cases.ts";
import { evidenceReferences } from "../../data/clinical/evidence.ts";
import { learningTopics } from "../../data/clinical/learning-topics.ts";
import { treatmentCatalog } from "../../data/clinical/treatments.ts";

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
    const variantIds = new Set<string>();

    for (const variant of template.variants) {
      if (variantIds.has(variant.id)) {
        issues.push({
          level: "error",
          scope: `case:${template.id}`,
          message: `Variante duplicada: "${variant.id}".`,
        });
      }
      variantIds.add(variant.id);

      for (const treatmentId of variant.availableTreatments) {
        if (!treatmentIds.has(treatmentId)) {
          issues.push({
            level: "error",
            scope: `case:${template.id}:${variant.id}`,
            message: `Tratamento disponível não encontrado: "${treatmentId}".`,
          });
        }
      }

      for (const goal of variant.clinicalTargets) {
        for (const topicId of goal.learningTopicIds) {
          const normalizedTopicId = normalizeTopicId(topicId);
          if (!topicIds.has(normalizedTopicId)) {
            issues.push({
              level: "error",
              scope: `case:${template.id}:${variant.id}`,
              message: `Objetivo clínico referencia tema inexistente: "${topicId}".`,
            });
          }
        }

        for (const treatmentId of goal.matcher.treatmentIds ?? []) {
          if (!variant.availableTreatments.includes(treatmentId)) {
            issues.push({
              level: "error",
              scope: `case:${template.id}:${variant.id}`,
              message: `Objetivo clínico refere tratamento não disponível na variante: "${treatmentId}".`,
            });
          }
        }
      }

      for (const rule of variant.evaluationRules) {
        for (const ruleId of rule.appliesToIds) {
          if (rule.target === "treatment" && !variant.availableTreatments.includes(ruleId)) {
            issues.push({
              level: "error",
              scope: `case:${template.id}:${variant.id}`,
              message: `Regra de avaliação refere tratamento não disponível: "${ruleId}".`,
            });
          }
        }

        for (const topicId of rule.learningTopicIds) {
          const normalizedTopicId = normalizeTopicId(topicId);
          if (!topicIds.has(normalizedTopicId)) {
            issues.push({
              level: "error",
              scope: `case:${template.id}:${variant.id}`,
              message: `Regra de avaliação referencia tema inexistente: "${topicId}".`,
            });
          }
        }
      }
    }
  }

  return {
    ok: !issues.some((issue) => issue.level === "error"),
    issues,
  };
}
