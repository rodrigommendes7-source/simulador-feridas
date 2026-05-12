import type {
  OpcaoBordosVisual,
  OpcaoExsudadoVisual,
  DefinicaoOpcaoVisual,
  OpcaoTecidoVisual,
} from "../../lib/clinico/types.ts";

export const VISUAL_TISSUE_OPTIONS: DefinicaoOpcaoVisual<OpcaoTecidoVisual>[] = [
  { id: "granulacao", rotulo: "Granulação", descricao: "Tecido vermelho-vivo, granular, sinal de cicatrização ativa." },
  { id: "fibrina", rotulo: "Fibrina", descricao: "Tecido amarelado/esbranquiçado, aderente ao leito." },
  { id: "necrose", rotulo: "Necrose", descricao: "Tecido desvitalizado — pode ser seco (escara negra) ou húmido." },
  { id: "epitelial", rotulo: "Tecido epitelial", descricao: "Tecido rosado/translúcido nas margens, sinal de epitelização." },
  { id: "hipergranulacao", rotulo: "Hipergranulação", descricao: "Granulação exuberante acima do nível dos bordos." },
];

export const VISUAL_EXUDATE_OPTIONS: DefinicaoOpcaoVisual<OpcaoExsudadoVisual>[] = [
  { id: "seroso", rotulo: "Seroso", descricao: "Líquido transparente/amarelo claro." },
  { id: "hematico", rotulo: "Hemático", descricao: "Sanguíneo, vermelho." },
  { id: "purulento", rotulo: "Purulento", descricao: "Espesso, amarelado/esverdeado, indicativo de infeção." },
];

export const VISUAL_EDGE_OPTIONS: DefinicaoOpcaoVisual<OpcaoBordosVisual>[] = [
  { id: "integra", rotulo: "Pele íntegra", descricao: "Bordos e pele perilesional sem alterações visíveis." },
  { id: "maceracao", rotulo: "Maceração", descricao: "Pele branca/amolecida por humidade excessiva." },
  { id: "rubor", rotulo: "Rubor", descricao: "Eritema/vermelhidão dos bordos." },
  { id: "hiperqueratose", rotulo: "Hiperqueratose", descricao: "Espessamento da pele junto aos bordos." },
  { id: "pele-seca", rotulo: "Pele seca", descricao: "Pele descamativa, sem hidratação." },
];
