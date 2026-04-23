import type { WoundVariables } from "./types.ts";

const WOUND_VARIABLE_LABELS: Record<keyof WoundVariables, Record<number, string>> = {
  exsudado:          { 1: "Sem exsudado", 2: "Leve", 3: "Moderado", 4: "Abundante" },
  infeccao:          { 0: "Contaminação", 1: "Infeção local encoberta", 2: "Infeção em propagação", 3: "Infeção sistémica" },
  tecido:            { 1: "Necrose seca", 2: "Fibrina dominante", 3: "Granulação ativa", 4: "Epitelização", 5: "Hipergranulação" },
  odor:              { 0: "Ausente", 1: "Leve", 2: "Moderado", 3: "Intenso" },
  humidade:          { 1: "Seca", 2: "Leve", 3: "Moderada", 4: "Maceração" },
  profundidade:      { 1: "Superficial", 2: "Espessura parcial", 3: "Espessura total", 4: "Estruturas expostas" },
  bordos:            { 1: "Indefinidos", 2: "Irregulares", 3: "Regulares", 4: "Em epitelização" },
  pele_perilesional: { 1: "Macerada", 2: "Frágil", 3: "Eritematosa", 4: "Íntegra" },
  dor:               { 0: "Ausente", 1: "Leve (1–3)", 2: "Moderada (4–6)", 3: "Intensa (7–10)" },
  hemorragia:        { 0: "Ausente", 1: "Leve", 2: "Moderada", 3: "Abundante" },
  etiologia:         { 1: "Pressão", 2: "Venosa", 3: "Arterial", 4: "Diabética", 5: "Traumática", 6: "Cirúrgica", 7: "Queimadura" },
  perfusao:          { 0: "Comprometida", 1: "Adequada" },
};

export const WOUND_VARIABLE_DISPLAY_LABELS: Record<keyof WoundVariables, string> = {
  exsudado:          "Exsudado",
  infeccao:          "Infeção",
  tecido:            "Tecido",
  odor:              "Odor",
  humidade:          "Humidade",
  profundidade:      "Profundidade",
  bordos:            "Bordos",
  pele_perilesional: "Pele perilesional",
  dor:               "Dor",
  hemorragia:        "Hemorragia",
  etiologia:         "Etiologia",
  perfusao:          "Perfusão",
};

export const WOUND_VARIABLES_MAIN: readonly (keyof WoundVariables)[] = [
  "exsudado",
  "infeccao",
  "tecido",
  "profundidade",
];

export const WOUND_VARIABLES_EXTRA: readonly (keyof WoundVariables)[] = [
  "odor",
  "humidade",
  "bordos",
  "pele_perilesional",
  "dor",
  "hemorragia",
  "etiologia",
  "perfusao",
];

export function getWoundVariableLabel(key: keyof WoundVariables, value: number): string {
  return WOUND_VARIABLE_LABELS[key]?.[value] ?? String(value);
}
