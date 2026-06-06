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
  { id: "epitelial", rotulo: "Tecido epitelial", descricao: "Tecido rosado/translucido nas margens, sinal de epitelização." },
  { id: "hipergranulacao", rotulo: "Hipergranulação", descricao: "Granulação exuberante acima do nível dos bordos." },
];

export const VISUAL_EXUDATE_OPTIONS: DefinicaoOpcaoVisual<OpcaoExsudadoVisual>[] = [
  { id: "seroso", rotulo: "Seroso", descricao: "Líquido transparente/amarelo claro." },
  { id: "hematico", rotulo: "Hemático", descricao: "Sanguíneo, vermelho." },
  { id: "purulento", rotulo: "Purulento", descricao: "Espesso, amarelado/esverdeado, indicativo de infeção." },
];

export const VISUAL_EDGE_OPTIONS: DefinicaoOpcaoVisual<OpcaoBordosVisual>[] = [
  { id: "integros", rotulo: "Bordos íntegros", descricao: "Bordos sem alterações visíveis, pele peri-ferida saudável." },
  { id: "ruborizados", rotulo: "Ruborizados", descricao: "Eritema/vermelhidão dos bordos, pode indicar infeccião ou pressão." },
  { id: "macerados", rotulo: "Macerados", descricao: "Pele branca/amolecida por humidade excessiva do exsudado." },
  { id: "hiperqueratosados", rotulo: "Hiperqueratosados", descricao: "Espessamento/calosidade da pele junto aos bordos." },
  { id: "fragil", rotulo: "Frágeis", descricao: "Pele muito fina, fácil de lacerar, frágil ao toque." },
];
