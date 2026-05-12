import type { TipoTecidoAnotavel, VariaveisFerida } from "./types.ts";

const ROTULOS_VARIAVEIS_FERIDA: Record<keyof VariaveisFerida, Record<number, string>> = {
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

export const ROTULOS_EXIBICAO_VARIAVEIS_FERIDA: Record<keyof VariaveisFerida, string> = {
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

/** @deprecated Use ROTULOS_EXIBICAO_VARIAVEIS_FERIDA */
export const WOUND_VARIABLE_DISPLAY_LABELS = ROTULOS_EXIBICAO_VARIAVEIS_FERIDA;

export const VARIAVEIS_FERIDA_PRINCIPAIS: readonly (keyof VariaveisFerida)[] = [
  "exsudado",
  "odor",
  "tecido",
  "pele_perilesional",
];

/** @deprecated Use VARIAVEIS_FERIDA_PRINCIPAIS */
export const WOUND_VARIABLES_MAIN = VARIAVEIS_FERIDA_PRINCIPAIS;

export const VARIAVEIS_FERIDA_EXTRAS: readonly (keyof VariaveisFerida)[] = [
  "infeccao",
  "humidade",
  "profundidade",
  "bordos",
  "dor",
  "hemorragia",
  "etiologia",
  "perfusao",
];

/** @deprecated Use VARIAVEIS_FERIDA_EXTRAS */
export const WOUND_VARIABLES_EXTRA = VARIAVEIS_FERIDA_EXTRAS;

export function obterRotuloVariavelFerida(key: keyof VariaveisFerida, value: number): string {
  return ROTULOS_VARIAVEIS_FERIDA[key]?.[value] ?? String(value);
}

/** @deprecated Use obterRotuloVariavelFerida */
export const getWoundVariableLabel = obterRotuloVariavelFerida;

// ─── Anotação de tecidos ───────────────────────────────────────────────────

/** Mapeia o valor de OpcaoTecidoVisual para TipoTecidoAnotavel */
export const tissueValueToAnnotatableType: Record<string, TipoTecidoAnotavel | null> = {
  necrose: "necrose",
  fibrina: "fibrina",
  granulacao: "granulacao",
  epitelial: "epitelial",
  hipergranulacao: "hipergranulacao",
};

/** Cores e rótulos para a UI dos marcadores de anotação. */
export const annotatableTissueDisplay: Record<TipoTecidoAnotavel, { rotulo: string; color: string }> = {
  necrose:         { rotulo: "Necrose",              color: "#1a1a1a" },
  fibrina:         { rotulo: "Fibrina / Esfacelo",   color: "#d4a574" },
  granulacao:      { rotulo: "Granulação",            color: "#c9434b" },
  epitelial:       { rotulo: "Epitelização",          color: "#f5b7b1" },
  hipergranulacao: { rotulo: "Hipergranulação",       color: "#7d2932" },
};
