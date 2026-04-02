import { existsSync } from "node:fs";
import { basename, join } from "node:path";
import { caseDefinitions } from "@/data/cases";
import { learningTopics } from "@/data/learning";
import { getCatalogIntegrityIssues, getTreatmentById, listTreatments, resolveTreatment } from "@/lib/treatments";

type ValidationLevel = "error" | "warning";

export type ValidationIssue = {
  level: ValidationLevel;
  scope: string;
  message: string;
};

export type ValidationReport = {
  ok: boolean;
  issues: ValidationIssue[];
};

function createIssue(level: ValidationLevel, scope: string, message: string): ValidationIssue {
  return { level, scope, message };
}

function hasUniqueValues(values: string[]) {
  return new Set(values).size === values.length;
}

export function validateClinicalDomain(): ValidationReport {
  const issues: ValidationIssue[] = [];

  for (const issue of getCatalogIntegrityIssues()) {
    issues.push(createIssue("error", "treatments", issue));
  }

  const treatmentIds = listTreatments().map((treatment) => treatment.id);
  if (!hasUniqueValues(treatmentIds)) {
    issues.push(createIssue("error", "treatments", "Existem ids de tratamentos duplicados."));
  }

  const caseIds = caseDefinitions.map((item) => item.id);
  const caseSlugs = caseDefinitions.map((item) => item.slug);

  if (!hasUniqueValues(caseIds)) {
    issues.push(createIssue("error", "cases", "Existem ids de casos duplicados."));
  }

  if (!hasUniqueValues(caseSlugs)) {
    issues.push(createIssue("error", "cases", "Existem slugs de casos duplicados."));
  }

  for (const caseDefinition of caseDefinitions) {
    const scope = `case:${caseDefinition.id}`;
    const imagePath = join(process.cwd(), "public", basename(caseDefinition.imageSrc));

    if (!existsSync(imagePath)) {
      issues.push(
        createIssue(
          "error",
          scope,
          `Imagem não encontrada para o caso: ${caseDefinition.imageSrc}.`
        )
      );
    }

    const observationScore = caseDefinition.observationItems.reduce(
      (acc, item) => acc + item.score,
      0
    );
    if (observationScore !== 15) {
      issues.push(
        createIssue(
          "warning",
          scope,
          `A secção de observação soma ${observationScore} pontos em vez de 15.`
        )
      );
    }

    const dialogueScore = caseDefinition.dialogueRules.reduce(
      (acc, item) => acc + item.score,
      0
    );
    if (dialogueScore !== 15) {
      issues.push(
        createIssue(
          "warning",
          scope,
          `A secção de diálogo soma ${dialogueScore} pontos em vez de 15.`
        )
      );
    }

    const applicationPositiveScore = caseDefinition.applicationRules.reduce((acc, rule) => {
      if (rule.type === "required" || rule.type === "bonus") {
        return acc + rule.score;
      }
      return acc;
    }, 0);

    if (applicationPositiveScore !== 20) {
      issues.push(
        createIssue(
          "warning",
          scope,
          `A secção de aplicação tem máximo positivo de ${applicationPositiveScore} pontos em vez de 20.`
        )
      );
    }

    for (const questionId of Object.keys(caseDefinition.config.textoPerguntas)) {
      if (!(questionId in caseDefinition.config.respostasDialogo)) {
        issues.push(
          createIssue(
            "error",
            scope,
            `Pergunta "${questionId}" não tem resposta correspondente em respostasDialogo.`
          )
        );
      }
    }

    for (const treatmentId of Object.keys(caseDefinition.config.linksEvidencia)) {
      if (!resolveTreatment(treatmentId)) {
        issues.push(
          createIssue(
            "warning",
            scope,
            `linksEvidencia referencia "${treatmentId}", que não resolve no catálogo atual.`
          )
        );
      }
    }

    for (const treatmentId of Object.keys(caseDefinition.config.recomendacoesPorErro)) {
      if (!resolveTreatment(treatmentId)) {
        issues.push(
          createIssue(
            "warning",
            scope,
            `recomendacoesPorErro referencia "${treatmentId}", que não resolve no catálogo atual.`
          )
        );
      }
    }

    for (const item of caseDefinition.config.materiaisPorCategoria.flatMap((group) => group.itens)) {
      if (!resolveTreatment(item.id)) {
        issues.push(
          createIssue(
            "warning",
            scope,
            `materiaisPorCategoria referencia "${item.id}", que não resolve no catálogo atual.`
          )
        );
      }
    }
  }

  for (const topic of learningTopics) {
    const scope = `learning:${topic.id}`;

    for (const caseId of topic.relatedCaseIds ?? []) {
      if (!caseDefinitions.find((item) => item.id === caseId)) {
        issues.push(
          createIssue(
            "error",
            scope,
            `Tema de aprendizagem referencia caso inexistente: "${caseId}".`
          )
        );
      }
    }

    for (const treatmentId of topic.relatedTreatmentIds ?? []) {
      if (!getTreatmentById(treatmentId)) {
        issues.push(
          createIssue(
            "error",
            scope,
            `Tema de aprendizagem referencia tratamento inexistente: "${treatmentId}".`
          )
        );
      }
    }
  }

  return {
    ok: !issues.some((issue) => issue.level === "error"),
    issues,
  };
}
