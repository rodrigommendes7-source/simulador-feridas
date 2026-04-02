import { treatmentCategories } from "@/data/treatment-categories";
import { tratamentos, type Tratamento } from "@/data/tratamentos";

const legacyAliasesById: Record<string, string[]> = {
  "iodopovidona-solucao": ["iodo", "povidona-iodo"],
  "aquacel-simples": ["hidrofibra", "carboximetilcelulose"],
  silvercel: ["prata", "alginato com prata"],
  "aquacel-ag": ["hidrofibra com prata"],
  betametasona: ["corticoterapia topica"],
  "actisorb-carvao": ["gaze seca"],
};

const normalizedTreatments: Tratamento[] = tratamentos.map((treatment) => ({
  ...treatment,
  aliases: [
    ...new Set([...(treatment.aliases ?? []), ...(legacyAliasesById[treatment.id] ?? [])]),
  ],
}));

const treatmentById = new Map(
  normalizedTreatments.map((treatment) => [treatment.id, treatment])
);
const categoryByLabel = new Map(
  treatmentCategories.map((category) => [category.label, category])
);

function uniqueById(items: Tratamento[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

export function listTreatments(): Tratamento[] {
  return normalizedTreatments;
}

export function listTreatmentCategories() {
  return treatmentCategories;
}

export function getTreatmentById(id: string): Tratamento | undefined {
  return treatmentById.get(id);
}

export function getTreatmentsByCategory(categoryLabel: string): Tratamento[] {
  return normalizedTreatments.filter((treatment) => treatment.categoria === categoryLabel);
}

export function getTreatmentsBySubcategory(
  categoryLabel: string,
  subcategoryLabel: string
): Tratamento[] {
  return normalizedTreatments.filter(
    (treatment) =>
      treatment.categoria === categoryLabel &&
      treatment.subcategoria === subcategoryLabel
  );
}

export function getTreatmentsByFunction(funcao: string): Tratamento[] {
  return normalizedTreatments.filter((treatment) =>
    treatment.funcoes.includes(funcao)
  );
}

export function getTreatmentsByAlias(alias: string): Tratamento[] {
  const normalizedAlias = alias.trim().toLowerCase();
  return normalizedTreatments.filter((treatment) =>
    (treatment.aliases ?? []).some((item) => item.toLowerCase() === normalizedAlias)
  );
}

export function resolveTreatment(term: string): Tratamento | undefined {
  return getTreatmentById(term) ?? getTreatmentsByAlias(term)[0];
}

export function groupTreatmentsByCategory() {
  return normalizedTreatments.reduce<Record<string, Tratamento[]>>((acc, treatment) => {
    if (!acc[treatment.categoria]) {
      acc[treatment.categoria] = [];
    }
    acc[treatment.categoria].push(treatment);
    return acc;
  }, {});
}

export function groupTreatmentsByCategoryAndSubcategory() {
  return normalizedTreatments.reduce<Record<string, Record<string, Tratamento[]>>>(
    (acc, treatment) => {
      if (!acc[treatment.categoria]) {
        acc[treatment.categoria] = {};
      }
      if (!acc[treatment.categoria][treatment.subcategoria]) {
        acc[treatment.categoria][treatment.subcategoria] = [];
      }
      acc[treatment.categoria][treatment.subcategoria].push(treatment);
      return acc;
    },
    {}
  );
}

export function getCatalogIntegrityIssues() {
  const issues: string[] = [];

  for (const treatment of normalizedTreatments) {
    if (!categoryByLabel.has(treatment.categoria)) {
      issues.push(
        `Tratamento "${treatment.id}" usa categoria não registada: "${treatment.categoria}".`
      );
    }
  }

  const aliasUsage = new Map<string, string[]>();

  for (const treatment of normalizedTreatments) {
    for (const alias of treatment.aliases ?? []) {
      const normalizedAlias = alias.trim().toLowerCase();
      if (!aliasUsage.has(normalizedAlias)) {
        aliasUsage.set(normalizedAlias, []);
      }
      aliasUsage.get(normalizedAlias)?.push(treatment.id);
    }
  }

  for (const [alias, ids] of aliasUsage.entries()) {
    if (ids.length > 1) {
      issues.push(`Alias duplicado "${alias}" encontrado em: ${ids.join(", ")}.`);
    }
  }

  return issues;
}

export function getRecommendedTreatmentsForCase(caseId: string) {
  if (caseId === "1") {
    return uniqueById([
      ...getTreatmentsByFunction("controlo_exsudado"),
      ...getTreatmentsByFunction("protecao_perilesional"),
    ]);
  }

  if (caseId === "2" || caseId === "3") {
    return uniqueById([
      ...getTreatmentsByFunction("controlo_microbiano"),
      ...getTreatmentsByFunction("controlo_exsudado"),
      ...getTreatmentsByFunction("desbridamento"),
    ]);
  }

  return [];
}
