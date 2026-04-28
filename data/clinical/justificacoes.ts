import type { WoundVariables } from "../../lib/clinical/types.ts";

export const variableLabels: {
  [K in keyof WoundVariables]: Record<number, string>;
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
  humidade: {
    1: "leito seco",
    2: "humidade ligeira",
    3: "humidade moderada",
    4: "maceração",
  },
  profundidade: {
    1: "ferida superficial",
    2: "profundidade moderada",
    3: "ferida profunda",
    4: "cavidade",
  },
  bordos: {
    1: "bordos indefinidos",
    2: "bordos irregulares",
    3: "bordos regulares",
    4: "bordos em epitelização",
  },
  pele_perilesional: {
    1: "pele peri-ferida macerada",
    2: "pele peri-ferida frágil",
    3: "pele peri-ferida eritematosa",
    4: "pele peri-ferida íntegra",
  },
  dor: {
    0: "ausência de dor",
    1: "dor ligeira",
    2: "dor moderada",
    3: "dor intensa",
  },
  hemorragia: {
    0: "sem hemorragia",
    1: "hemorragia ligeira",
    2: "hemorragia moderada",
    3: "hemorragia abundante",
  },
  etiologia: {
    1: "etiologia por pressão",
    2: "etiologia venosa",
    3: "etiologia arterial",
    4: "etiologia diabética",
    5: "etiologia traumática",
    6: "etiologia cirúrgica",
    7: "queimadura",
  },
  perfusao: {
    0: "perfusão comprometida",
    1: "perfusão adequada",
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

export const FALLBACK_CORRECT = "Adequado ao estado atual da ferida";
