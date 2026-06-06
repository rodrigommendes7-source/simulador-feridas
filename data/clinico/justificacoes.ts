import type { VariaveisFerida } from "../../lib/clinico/types.ts";

export const variableLabels: {
  [K in keyof VariaveisFerida]: Record<number, string>;
} = {
  exsudado: {
    1: "ferida seca",
    2: "exsudado ligeiro",
    3: "exsudado moderado",
    4: "exsudado abundante",
  },
  infeccao: {
    0: "ausência de sinais de carga microbiana",
    1: "infeção local",
    2: "infeção marcada",
    3: "infeção sistémica",
  },
  tecido: {
    1: "tecido necrótico",
    2: "fibrina ou esfacelo",
    3: "tecido de granulação",
    4: "tecido em epitelização",
    5: "hipergranulação",
  },
  odor: {
    0: "ausência de odor",
    1: "odor ligeiro",
    2: "odor presente",
    3: "odor intenso",
  },
  bordos: {
    1: "bordos íntegros",
    2: "bordos ruborizados",
    3: "bordos macerados",
    4: "bordos hiperqueratosados",
    5: "bordos frágeis",
  },
  pele_perilesional: {
    1: "pele peri-ferida íntegra",
    2: "pele peri-ferida frágil",
    3: "pele peri-ferida macerada",
    4: "pele peri-ferida ruborizada",
  },
};

export const genericDistractors: string[] = [
  "Hidratar o leito da ferida",
  "Acelerar epitelização",
  "Reduzir o odor",
  "Promover desbridamento autolítico",
  "Controlar carga microbiana",
  "Proteger tecido em granulação",
  "Manter ambiente húmido equilibrado",
  "Reduzir hipergranulação",
];

export const FALLBACK_CORRETA = "Adequado ao estado atual da ferida";

/** @deprecated Use FALLBACK_CORRETA */
export const FALLBACK_CORRECT = FALLBACK_CORRETA;
