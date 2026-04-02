import { existsSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";
import { tratamentos } from "../data/tratamentos.ts";
import { learningTopics } from "../data/learning.ts";
import { treatmentCategories } from "../data/treatment-categories.ts";

type Issue = {
  level: "error" | "warning";
  scope: string;
  message: string;
};

function loadCaseJson(fileName: string) {
  const filePath = join(process.cwd(), "data", "casos", fileName);
  return JSON.parse(readFileSync(filePath, "utf8")) as {
    textoPerguntas: Record<string, string>;
    respostasDialogo: Record<string, string>;
    linksEvidencia: Record<string, unknown>;
    recomendacoesPorErro: Record<string, unknown>;
    materiaisPorCategoria: { itens: { id: string }[] }[];
  };
}

const issues: Issue[] = [];
const categoryLabels = new Set(treatmentCategories.map((category) => category.label));
const treatmentIds = new Set(tratamentos.map((treatment) => treatment.id));
const aliasMap = new Map<string, string>([
  ["iodo", "iodopovidona-solucao"],
  ["povidona-iodo", "iodopovidona-solucao"],
  ["hidrofibra", "aquacel-simples"],
  ["carboximetilcelulose", "aquacel-simples"],
  ["prata", "silvercel"],
  ["alginato com prata", "silvercel"],
  ["hidrofibra com prata", "aquacel-ag"],
]);

function resolvesTreatmentId(term: string) {
  return treatmentIds.has(term) || aliasMap.has(term.toLowerCase());
}

for (const treatment of tratamentos) {
  if (!categoryLabels.has(treatment.categoria)) {
    issues.push({
      level: "error",
      scope: `treatment:${treatment.id}`,
      message: `Categoria não registada: "${treatment.categoria}".`,
    });
  }
}

for (const [caseId, fileName, imageName] of [
  ["1", "caso1.json", "caso1.jpg"],
  ["2", "caso2.json", "caso2.png"],
  ["3", "caso3.json", "caso3.jpeg"],
] as const) {
  const scope = `case:${caseId}`;
  const caseJson = loadCaseJson(fileName);
  const imagePath = join(process.cwd(), "public", basename(imageName));

  if (!existsSync(imagePath)) {
    issues.push({
      level: "error",
      scope,
      message: `Imagem em falta: ${imageName}.`,
    });
  }

  for (const questionId of Object.keys(caseJson.textoPerguntas)) {
    if (!(questionId in caseJson.respostasDialogo)) {
      issues.push({
        level: "error",
        scope,
        message: `Pergunta "${questionId}" não tem resposta correspondente.`,
      });
    }
  }

  for (const treatmentId of Object.keys(caseJson.linksEvidencia)) {
    if (!resolvesTreatmentId(treatmentId)) {
      issues.push({
        level: "warning",
        scope,
        message: `linksEvidencia referencia "${treatmentId}" fora do catálogo atual.`,
      });
    }
  }

  for (const treatmentId of Object.keys(caseJson.recomendacoesPorErro)) {
    if (!resolvesTreatmentId(treatmentId)) {
      issues.push({
        level: "warning",
        scope,
        message: `recomendacoesPorErro referencia "${treatmentId}" fora do catálogo atual.`,
      });
    }
  }

  for (const item of caseJson.materiaisPorCategoria.flatMap((group) => group.itens)) {
    if (!resolvesTreatmentId(item.id)) {
      issues.push({
        level: "warning",
        scope,
        message: `materiaisPorCategoria referencia "${item.id}" fora do catálogo atual.`,
      });
    }
  }
}

for (const topic of learningTopics) {
  for (const treatmentId of topic.relatedTreatmentIds ?? []) {
    if (!treatmentIds.has(treatmentId)) {
      issues.push({
        level: "error",
        scope: `learning:${topic.id}`,
        message: `Tratamento inexistente referenciado: "${treatmentId}".`,
      });
    }
  }
}

if (issues.length === 0) {
  console.log("Clinical data validation passed with no issues.");
  process.exit(0);
}

for (const issue of issues) {
  const prefix = issue.level === "error" ? "ERROR" : "WARN";
  console.log(`[${prefix}] ${issue.scope}: ${issue.message}`);
}

if (issues.some((issue) => issue.level === "error")) {
  process.exit(1);
}

console.log("Clinical data validation completed with warnings only.");
