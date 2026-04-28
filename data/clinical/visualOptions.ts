import type {
  VisualEdgeOption,
  VisualExudateOption,
  VisualOptionDefinition,
  VisualTissueOption,
} from "../../lib/clinical/types.ts";

export const VISUAL_TISSUE_OPTIONS: VisualOptionDefinition<VisualTissueOption>[] = [
  { id: "granulacao", label: "Granulação", description: "Tecido vermelho-vivo, granular, sinal de cicatrização ativa." },
  { id: "fibrina", label: "Fibrina", description: "Tecido amarelado/esbranquiçado, aderente ao leito." },
  { id: "necrose", label: "Necrose", description: "Tecido desvitalizado — pode ser seco (escara negra) ou húmido." },
  { id: "epitelial", label: "Tecido epitelial", description: "Tecido rosado/translúcido nas margens, sinal de epitelização." },
  { id: "hipergranulacao", label: "Hipergranulação", description: "Granulação exuberante acima do nível dos bordos." },
];

export const VISUAL_EXUDATE_OPTIONS: VisualOptionDefinition<VisualExudateOption>[] = [
  { id: "seroso", label: "Seroso", description: "Líquido transparente/amarelo claro." },
  { id: "hematico", label: "Hemático", description: "Sanguíneo, vermelho." },
  { id: "purulento", label: "Purulento", description: "Espesso, amarelado/esverdeado, indicativo de infeção." },
];

export const VISUAL_EDGE_OPTIONS: VisualOptionDefinition<VisualEdgeOption>[] = [
  { id: "integra", label: "Pele íntegra", description: "Bordos e pele perilesional sem alterações visíveis." },
  { id: "maceracao", label: "Maceração", description: "Pele branca/amolecida por humidade excessiva." },
  { id: "rubor", label: "Rubor", description: "Eritema/vermelhidão dos bordos." },
  { id: "hiperqueratose", label: "Hiperqueratose", description: "Espessamento da pele junto aos bordos." },
  { id: "pele-seca", label: "Pele seca", description: "Pele descamativa, sem hidratação." },
];
