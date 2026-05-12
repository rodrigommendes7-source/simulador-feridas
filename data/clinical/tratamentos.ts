import type { DefinicaoTratamento } from "../../lib/clinical/types.ts";

// Lista oficial de materiais — organizada pelas 4 categorias de apresentação.
// category → agrupa para apresentação: "Apósito" | "Líquidos" | "Pomadas" | "Outros"
// categoria_clinica → usada pelo motor de avaliação por material

export const treatmentCatalog: DefinicaoTratamento[] = [

  // ══════════════════════════════════════════════════════════════════════════
  // APÓSITO
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: "alginato-calcio",
    rotulo: "Alginato de cálcio",
    canonicalId: "alginato-calcio",
    equivalenceGroup: "alginato",
    category: "Apósito",
    subCategory: "Absorção",
    funcoes: ["absorver"],
    indicacoes: [
      "exsudado moderado a abundante",
      "ferida com sangramento ligeiro",
      "cavidades com exsudado",
      "úlceras venosas e diabéticas exsudativas",
    ],
    avisos_contraindicacao: ["ferida seca ou pouco exsudativa", "leito em epitelização ativa"],
    refsEvidencia: ["alginate-review", "wuwhs-exudate-2019"],
    learningTopicIds: ["gestao-exsudado"],
    etiquetas: ["absorvente", "alginato"],
    nome_comercial: null,
    substancia_ativa: "Alginato de cálcio",
    categoria_clinica: "apositos",
    // Ideal com exsudado moderado/abundante; parcial com ligeiro; incorreto em seco
    regras: {
      condicoes_ideais: { exsudado: [3, 4] },
      condicoes_parciais: { exsudado: [2] },
      contraindicacoes: [{ exsudado: [1] }],
    },
  },

  {
    id: "hidrocoloide",
    rotulo: "Hidrocólóide",
    canonicalId: "hidrocoloide",
    equivalenceGroup: "hidrocoloide",
    category: "Apósito",
    subCategory: "Autolítico / Baixo exsudado",
    funcoes: ["absorver", "hidratar", "desbridar"],
    indicacoes: [
      "exsudado baixo a moderado",
      "fibrina superficial",
      "desbridamento autolítico",
      "feridas crónicas superficiais com leito pouco exsudativo",
    ],
    avisos_contraindicacao: [
      "exsudado abundante",
      "infeção marcada",
      "feridas profundas ou cavitárias",
    ],
    refsEvidencia: ["foam-review", "wounds-intl-autolytic-2025"],
    learningTopicIds: ["gestao-exsudado", "desbridamento"],
    etiquetas: ["hidrocólóide", "autolítico", "baixo exsudado"],
    nome_comercial: "Varihesive Gel Control",
    substancia_ativa: "Carboximetilcelulose sódica",
    categoria_clinica: "apositos",
    // Ideal em ferida seca/baixo exsudado com fibrina; parcial com moderado; incorreto em abundante ou infeção marcada
    regras: {
      condicoes_ideais: { exsudado: [1, 2], tecido: [2, 3] },
      condicoes_parciais: { exsudado: [3] },
      contraindicacoes: [{ exsudado: [4] }, { infeccao: [2, 3] }],
    },
  },

  {
    id: "allevyn-ag",
    rotulo: "Espuma de poliuretano com prata adesivo",
    canonicalId: "allevyn-ag",
    equivalenceGroup: "espuma-prata",
    category: "Apósito",
    subCategory: "Controlo da infeção + Absorção",
    funcoes: ["absorver", "controlar-bioburden", "cobertura-atraumatica"],
    indicacoes: [
      "infeção local encoberta ou evidente",
      "exsudado moderado a abundante com carga microbiana",
      "feridas crónicas com sinais subtis de infeção",
      "úlceras diabéticas ou venosas infetadas",
    ],
    avisos_contraindicacao: [
      "ausência de sinais de carga microbiana — não usar por rotina",
      "ferida em epitelização sem sinais inflamatórios",
    ],
    refsEvidencia: ["foam-review", "silver-consensus", "aptferidas-infecao-2025"],
    learningTopicIds: ["antimicrobianos", "gestao-exsudado"],
    etiquetas: ["prata", "espuma", "adesivo", "absorvente"],
    nome_comercial: "Allevyn Ag Adesivo",
    substancia_ativa: "Espuma de poliuretano com sulfato de prata",
    categoria_clinica: "apositos",
    // Ideal com infeção + exsudado; incorreto sem infeção
    regras: {
      condicoes_ideais: { infeccao: [1, 2, 3], exsudado: [2, 3, 4] },
      contraindicacoes: [{ infeccao: [0] }],
    },
  },

  {
    id: "allevyn-nao-adesivo",
    rotulo: "Espuma de poliuretano não adesivo",
    canonicalId: "allevyn-nao-adesivo",
    equivalenceGroup: "espuma",
    category: "Apósito",
    subCategory: "Absorção não aderente",
    funcoes: ["absorver", "cobertura-atraumatica"],
    indicacoes: ["exsudado moderado", "pele frágil"],
    avisos_contraindicacao: ["ferida seca"],
    refsEvidencia: ["foam-review", "wuwhs-exudate-2019"],
    learningTopicIds: ["gestao-exsudado"],
    etiquetas: ["espuma", "não aderente", "absorvente"],
    nome_comercial: "Allevyn Non-Adesivo",
    substancia_ativa: "Espuma de poliuretano não adesivo",
    categoria_clinica: "apositos",
    // Ideal com exsudado moderado; parcial com ligeiro ou abundante; incorreto em seco
    regras: {
      condicoes_ideais: { exsudado: [3] },
      condicoes_parciais: { exsudado: [2, 4] },
      contraindicacoes: [{ exsudado: [1] }],
    },
  },

  {
    id: "actisorb-silver",
    rotulo: "Carvão ativado com prata",
    canonicalId: "actisorb-silver",
    equivalenceGroup: "carvao-prata",
    category: "Apósito",
    subCategory: "Controlo do odor e infeção",
    funcoes: ["gerir-odor", "controlar-bioburden"],
    indicacoes: [
      "odor clinicamente relevante",
      "carga microbiana com odor associado",
      "feridas oncológicas com odor intenso",
      "feridas crónicas com biofilme e odor",
    ],
    avisos_contraindicacao: [
      "ferida sem odor nem sinais de carga microbiana",
      "não usar como cobertura primária isolada em ferida exsudativa",
    ],
    refsEvidencia: ["odor-review", "silver-consensus"],
    learningTopicIds: ["antimicrobianos"],
    etiquetas: ["carvão ativado", "prata", "odor"],
    nome_comercial: "Actisorb Silver",
    substancia_ativa: "Carvão ativado com prata",
    categoria_clinica: "apositos",
    // Ideal com odor moderado/intenso + infeção; parcial com odor ligeiro; incorreto sem odor nem infeção
    regras: {
      condicoes_ideais: { odor: [2, 3], infeccao: [1, 2, 3] },
      condicoes_parciais: { odor: [1] },
      contraindicacoes: [{ odor: [0], infeccao: [0] }],
    },
  },

  {
    id: "mepilex",
    rotulo: "Espuma de silicone suave não adesivo",
    canonicalId: "mepilex",
    equivalenceGroup: "espuma",
    category: "Apósito",
    subCategory: "Absorção atraumática",
    funcoes: ["absorver", "cobertura-atraumatica"],
    indicacoes: [
      "exsudado moderado",
      "pele frágil ou perilesional macerada",
      "risco de MARSI",
      "úlceras de pressão categoria 2-3",
    ],
    avisos_contraindicacao: ["ferida seca sem exsudado"],
    refsEvidencia: ["foam-review", "skin-barrier-review", "wuwhs-exudate-2019"],
    learningTopicIds: ["gestao-exsudado", "protecao-perilesional"],
    etiquetas: ["espuma silicone", "atraumático", "não aderente"],
    nome_comercial: "Mepilex",
    substancia_ativa: "Espuma de poliuretano com camada de contacto em silicone suave",
    categoria_clinica: "apositos",
    regras: {
      condicoes_ideais: { exsudado: [2, 3], pele_perilesional: [1, 2] },
      condicoes_parciais: { exsudado: [3] },
      contraindicacoes: [{ exsudado: [1] }],
      bonus: { pele_perilesional: [1] },
    },
  },

  {
    id: "biatain",
    rotulo: "Espuma de poliuretano não adesivo",
    canonicalId: "biatain",
    equivalenceGroup: "espuma",
    category: "Apósito",
    subCategory: "Absorção",
    funcoes: ["absorver", "cobertura-atraumatica"],
    indicacoes: [
      "exsudado moderado a abundante",
      "feridas crónicas exsudativas",
      "úlceras de pressão categoria 2-4",
      "úlceras venosas com terapia compressiva",
    ],
    avisos_contraindicacao: ["ferida seca ou pouco exsudativa"],
    refsEvidencia: ["foam-review", "wuwhs-exudate-2019"],
    learningTopicIds: ["gestao-exsudado"],
    etiquetas: ["espuma", "não aderente", "absorvente"],
    nome_comercial: "Biatain",
    substancia_ativa: "Espuma de poliuretano",
    categoria_clinica: "apositos",
    regras: {
      condicoes_ideais: { exsudado: [3, 4] },
      condicoes_parciais: { exsudado: [2] },
      contraindicacoes: [{ exsudado: [1] }],
    },
  },

  {
    id: "inadine",
    rotulo: "Iodopovidona compressa impregnada",
    canonicalId: "inadine",
    equivalenceGroup: "aposito-iodado",
    category: "Apósito",
    subCategory: "Antissépsia",
    funcoes: ["controlar-bioburden"],
    indicacoes: [
      "infeção local encoberta ou evidente",
      "feridas com carga bacteriana elevada",
      "cuidados paliativos com ferida infetada",
    ],
    avisos_contraindicacao: ["uso prolongado sem reavaliação"],
    refsEvidencia: ["antiseptic-review-2022", "aptferidas-infecao-2025"],
    learningTopicIds: ["antimicrobianos"],
    etiquetas: ["iodo", "compressa", "antissépsia"],
    nome_comercial: "Inadine",
    substancia_ativa: "Iodopovidona compressa impregnada",
    categoria_clinica: "apositos",
    // Ideal com infeção; parcial como preventivo
    regras: {
      condicoes_ideais: { infeccao: [1, 2, 3] },
      condicoes_parciais: { infeccao: [0] },
      contraindicacoes: [],
    },
  },

  {
    id: "aquacel-ag",
    rotulo: "Carboximetilcelulose com prata",
    canonicalId: "aquacel-ag",
    equivalenceGroup: "absorvente-prata",
    category: "Apósito",
    subCategory: "Controlo da infeção + Absorção",
    funcoes: ["absorver", "controlar-bioburden"],
    indicacoes: [
      "infeção local encoberta ou evidente com exsudado moderado a abundante",
      "biofilme suspeito em ferida crónica estagnada",
      "úlceras diabéticas e de pressão infetadas",
      "feridas cirúrgicas com deiscência e infeção",
    ],
    avisos_contraindicacao: [
      "ausência de sinais de carga microbiana — não usar por rotina",
      "ferida limpa em epitelização",
    ],
    refsEvidencia: ["hydrofiber-review", "silver-consensus", "aptferidas-infecao-2025"],
    learningTopicIds: ["antimicrobianos", "gestao-exsudado"],
    etiquetas: ["prata", "hidrofibra", "CMC"],
    nome_comercial: "Aquacel Ag",
    substancia_ativa: "Carboximetilcelulose com prata",
    categoria_clinica: "apositos",
    // Ideal com infeção + exsudado moderado/abundante; incorreto sem infeção
    regras: {
      condicoes_ideais: { infeccao: [1, 2, 3], exsudado: [2, 3, 4] },
      contraindicacoes: [{ infeccao: [0] }],
    },
  },

  {
    id: "aquacel",
    rotulo: "Carboximetilcelulose",
    canonicalId: "aquacel",
    equivalenceGroup: "fibra-absorvente",
    category: "Apósito",
    subCategory: "Absorção",
    funcoes: ["absorver"],
    indicacoes: [
      "exsudado moderado",
      "fibrina com humidade",
      "feridas pós-operatórias com exsudado",
      "úlceras venosas e diabéticas com exsudado moderado",
    ],
    avisos_contraindicacao: [
      "ferida seca ou em epitelização",
      "exsudado abundante sem reforço absorvente secundário",
    ],
    refsEvidencia: ["hydrofiber-review", "wuwhs-exudate-2019"],
    learningTopicIds: ["gestao-exsudado"],
    etiquetas: ["absorvente", "hidrofibra", "CMC"],
    nome_comercial: "Aquacel",
    substancia_ativa: "Carboximetilcelulose",
    categoria_clinica: "apositos",
    // Ideal com exsudado moderado; parcial com ligeiro; incorreto em seco
    regras: {
      condicoes_ideais: { exsudado: [3] },
      condicoes_parciais: { exsudado: [2] },
      contraindicacoes: [{ exsudado: [1] }],
    },
  },

  {
    id: "fibrosol",
    rotulo: "Carboximetilcelulose sódica",
    canonicalId: "fibrosol",
    equivalenceGroup: "fibra-absorvente",
    category: "Apósito",
    subCategory: "Absorção",
    funcoes: ["absorver"],
    indicacoes: ["exsudado moderado"],
    avisos_contraindicacao: ["ferida seca sem exsudado"],
    refsEvidencia: ["hydrofiber-review"],
    learningTopicIds: ["gestao-exsudado"],
    etiquetas: ["absorvente", "fibra hidro"],
    nome_comercial: "Fibrosol",
    substancia_ativa: "Carboximetilcelulose sódica",
    categoria_clinica: "apositos",
    regras: {
      condicoes_ideais: { exsudado: [3] },
      condicoes_parciais: { exsudado: [2] },
      contraindicacoes: [{ exsudado: [1] }],
    },
  },

  {
    id: "varihesive-extra-fino",
    rotulo: "Hidrocólóide extra fino",
    canonicalId: "varihesive-extra-fino",
    equivalenceGroup: "hidrocoloide-fino",
    category: "Apósito",
    subCategory: "Baixo exsudado",
    funcoes: ["absorver", "cobertura-atraumatica"],
    indicacoes: ["exsudado baixo a moderado", "ferida superficial"],
    avisos_contraindicacao: ["exsudado abundante"],
    refsEvidencia: ["foam-review"],
    learningTopicIds: ["gestao-exsudado"],
    etiquetas: ["extra fino", "baixo exsudado"],
    nome_comercial: "Varihesive Extra Fino",
    substancia_ativa: "Carboximetilcelulose sódica extra fino",
    categoria_clinica: "apositos",
    // Ideal com baixo exsudado; parcial com moderado; incorreto em abundante
    regras: {
      condicoes_ideais: { exsudado: [1, 2] },
      condicoes_parciais: { exsudado: [3] },
      contraindicacoes: [{ exsudado: [4] }],
    },
  },

  {
    id: "varihesive-gel-control",
    rotulo: "Hidrocólóide sem rebordo",
    canonicalId: "varihesive-gel-control",
    equivalenceGroup: "hidrocoloide",
    category: "Apósito",
    subCategory: "Autolítico / Baixo exsudado",
    funcoes: ["absorver", "hidratar", "desbridar"],
    indicacoes: ["exsudado baixo a moderado", "desbridamento autolítico"],
    avisos_contraindicacao: ["exsudado abundante", "infeção marcada"],
    refsEvidencia: ["foam-review", "wounds-intl-autolytic-2025"],
    learningTopicIds: ["gestao-exsudado", "desbridamento"],
    etiquetas: ["hidrocólóide", "sem rebordo", "autolítico"],
    nome_comercial: "Varihesive Gel Control",
    substancia_ativa: "Carboximetilcelulose sódica sem rebordo",
    categoria_clinica: "apositos",
    regras: {
      condicoes_ideais: { exsudado: [1, 2], tecido: [2, 3] },
      condicoes_parciais: { exsudado: [3] },
      contraindicacoes: [{ exsudado: [4] }, { infeccao: [2, 3] }],
    },
  },

  {
    id: "vliwasorb",
    rotulo: "Superabsorvente estéril",
    canonicalId: "vliwasorb",
    equivalenceGroup: "superabsorvente",
    category: "Apósito",
    subCategory: "Exsudado elevado",
    funcoes: ["absorver"],
    indicacoes: ["exsudado abundante", "maceração"],
    avisos_contraindicacao: ["ferida seca"],
    refsEvidencia: ["foam-review", "wuwhs-exudate-2019"],
    learningTopicIds: ["gestao-exsudado"],
    etiquetas: ["superabsorvente", "alto exsudado"],
    nome_comercial: "Vliwasorb",
    substancia_ativa: "Superabsorvente estéril",
    categoria_clinica: "apositos",
    // Ideal com exsudado abundante; parcial com moderado; incorreto em seco
    regras: {
      condicoes_ideais: { exsudado: [4] },
      condicoes_parciais: { exsudado: [3] },
      contraindicacoes: [{ exsudado: [1] }],
    },
  },

  {
    id: "l-mesitran",
    rotulo: "Mel em gaze de apósito",
    canonicalId: "l-mesitran",
    equivalenceGroup: "aposito-mel",
    category: "Apósito",
    subCategory: "Antimicrobiano natural",
    funcoes: ["controlar-bioburden", "desbridar", "gerir-odor"],
    indicacoes: [
      "infeção local com tecido desvitalizado",
      "odor clinicamente relevante associado a infeção",
      "fibrina moderada com carga microbiana",
      "alternativa ao antimicrobiano tópico em alergia ao iodo ou prata",
    ],
    avisos_contraindicacao: [
      "ferida limpa em epitelização sem infeção",
      "alergia a produtos apícolas",
    ],
    refsEvidencia: ["honey-cochrane-2015"],
    learningTopicIds: ["antimicrobianos", "desbridamento"],
    etiquetas: ["mel", "antimicrobiano", "desbridante"],
    nome_comercial: "L-Mesitran",
    substancia_ativa: "Mel em gaze de apósito",
    categoria_clinica: "apositos",
    // Ideal com infeção + tecido não viável; parcial com infeção em granulação; incorreto em ferida limpa em epitelização
    regras: {
      condicoes_ideais: { infeccao: [1, 2, 3], tecido: [1, 2] },
      condicoes_parciais: { infeccao: [1, 2, 3], tecido: [3] },
      contraindicacoes: [{ infeccao: [0], tecido: [4] }],
    },
  },

  {
    id: "silvercel",
    rotulo: "Alginato de cálcio com prata",
    canonicalId: "silvercel",
    equivalenceGroup: "absorvente-prata",
    category: "Apósito",
    subCategory: "Controlo da infeção + Absorção",
    funcoes: ["absorver", "controlar-bioburden"],
    indicacoes: ["infeção local", "exsudado abundante"],
    avisos_contraindicacao: ["ausência de sinais de carga microbiana"],
    refsEvidencia: ["alginate-review", "silver-consensus", "aptferidas-infecao-2025"],
    learningTopicIds: ["antimicrobianos", "gestao-exsudado"],
    etiquetas: ["prata", "alginato", "absorvente"],
    nome_comercial: "Silvercel",
    substancia_ativa: "Alginato de cálcio com prata",
    categoria_clinica: "apositos",
    // Ideal com infeção + exsudado elevado; incorreto sem infeção
    regras: {
      condicoes_ideais: { infeccao: [1, 2, 3], exsudado: [3, 4] },
      condicoes_parciais: { infeccao: [1, 2, 3], exsudado: [2] },
      contraindicacoes: [{ infeccao: [0] }],
    },
  },

  {
    id: "urgo-clean",
    rotulo: "Hidroadesivo lipocolóide microaderente",
    canonicalId: "urgo-clean",
    equivalenceGroup: "contacto-atraumatico",
    category: "Apósito",
    subCategory: "Limpeza atraumática",
    funcoes: ["cobertura-atraumatica", "limpar"],
    indicacoes: ["dor ao penso", "tecido frágil", "limpeza suave"],
    avisos_contraindicacao: [],
    refsEvidencia: ["foam-review"],
    learningTopicIds: ["tecidos-e-leito"],
    etiquetas: ["lipocolóide", "atraumático", "limpeza suave"],
    nome_comercial: "Urgo Clean",
    substancia_ativa: "Hidroadesivo lipocolóide microaderente",
    categoria_clinica: "apositos",
    // Ideal com dor ao penso; parcial sem dor
    regras: {
      condicoes_ideais: { dor: [1, 2, 3] },
      condicoes_parciais: { dor: [0] },
      contraindicacoes: [],
    },
  },

  {
    id: "urgotul",
    rotulo: "Interface lipido-colóide não aderente",
    canonicalId: "urgotul",
    equivalenceGroup: "contacto-atraumatico",
    category: "Apósito",
    subCategory: "Contacto não aderente",
    funcoes: ["cobertura-atraumatica"],
    indicacoes: [
      "tecido de granulação frágil",
      "dor intensa na remoção do penso",
      "feridas em epitelização — cobertura primária atraumática",
      "úlceras arteriais e de pressão com leito sensível",
    ],
    avisos_contraindicacao: ["necessidade de absorção isolada — sempre requerer cobertura secundária"],
    refsEvidencia: ["foam-review"],
    learningTopicIds: ["tecidos-e-leito"],
    etiquetas: ["lipocolóide", "não aderente", "contacto"],
    nome_comercial: "Urgotul",
    substancia_ativa: "Lipido-colóide com partículas hidrátias",
    categoria_clinica: "apositos",
    // Ideal com dor ao penso; bónus em tecido de granulação
    regras: {
      condicoes_ideais: { dor: [1, 2, 3] },
      condicoes_parciais: { dor: [0] },
      contraindicacoes: [],
      bonus: { tecido: [3] },
    },
  },

  {
    id: "mepitel-one",
    rotulo: "Interface de silicone macio",
    canonicalId: "mepitel-one",
    equivalenceGroup: "contacto-atraumatico",
    category: "Apósito",
    subCategory: "Contacto não aderente",
    funcoes: ["cobertura-atraumatica"],
    indicacoes: [
      "queimaduras de espessura parcial",
      "tecido de granulação frágil",
      "epitelização ativa",
      "feridas dolorosas à troca de penso",
      "feridas pediátricas e em pele frágil",
    ],
    avisos_contraindicacao: [
      "não absorve — sempre requerer cobertura secundária",
      "feridas com necrose seca aderente (não tem efeito autolítico)",
    ],
    refsEvidencia: ["foam-review"],
    learningTopicIds: ["escolha-do-penso"],
    etiquetas: ["silicone", "não aderente", "interface"],
    nome_comercial: "Mepitel One",
    substancia_ativa: "Interface de silicone macio com poros",
    categoria_clinica: "apositos",
    regras: {
      condicoes_ideais: { tecido: [3, 4], dor: [2, 3] },
      condicoes_parciais: { tecido: [2, 5] },
      contraindicacoes: [{ tecido: [1] }],
    },
  },

  {
    id: "urgo-start",
    rotulo: "Matricial absorvente lipido-colóide não adesivo",
    canonicalId: "urgo-start",
    equivalenceGroup: "matriz-contacto",
    category: "Apósito",
    subCategory: "Estimulação da reparação",
    funcoes: ["cobertura-atraumatica"],
    indicacoes: ["tecido de granulação", "estimulação da cicatrização"],
    avisos_contraindicacao: ["infeção marcada"],
    refsEvidencia: ["foam-review"],
    learningTopicIds: ["tecidos-e-leito"],
    etiquetas: ["lipocolóide", "matricial", "granulação"],
    nome_comercial: "Urgo Start",
    substancia_ativa: "Matricial absorvente lipido-colóide não adesivo",
    categoria_clinica: "apositos",
    // Ideal em granulação ativa; parcial em fibrina; incorreto com infeção marcada
    regras: {
      condicoes_ideais: { tecido: [3, 4] },
      condicoes_parciais: { tecido: [2] },
      contraindicacoes: [{ infeccao: [2, 3] }],
    },
  },

  {
    id: "urgotul-ag",
    rotulo: "Compressa não aderente impregnada com prata",
    canonicalId: "urgotul-ag",
    equivalenceGroup: "contacto-prata",
    category: "Apósito",
    subCategory: "Controlo da infeção não aderente",
    funcoes: ["controlar-bioburden", "cobertura-atraumatica"],
    indicacoes: ["infeção local", "dor ao penso"],
    avisos_contraindicacao: ["ausência de infeção"],
    refsEvidencia: ["silver-consensus", "aptferidas-infecao-2025"],
    learningTopicIds: ["antimicrobianos", "tecidos-e-leito"],
    etiquetas: ["prata", "não aderente", "infeção"],
    nome_comercial: "Urgotul Ag",
    substancia_ativa: "Prata em compressa não aderente impregnada",
    categoria_clinica: "apositos",
    // Ideal com infeção + dor; parcial com infeção sem dor; incorreto sem infeção
    regras: {
      condicoes_ideais: { infeccao: [1, 2, 3], dor: [1, 2, 3] },
      condicoes_parciais: { infeccao: [1, 2, 3], dor: [0] },
      contraindicacoes: [{ infeccao: [0] }],
    },
  },

  {
    id: "allevyn",
    rotulo: "Espuma de poliuretano hidrocelular com rebordo",
    canonicalId: "allevyn",
    equivalenceGroup: "espuma",
    category: "Apósito",
    subCategory: "Absorção",
    funcoes: ["absorver", "cobertura-atraumatica"],
    indicacoes: ["exsudado moderado", "necessidade de cobertura atraumática"],
    avisos_contraindicacao: ["exsudado muito abundante sem reforço"],
    refsEvidencia: ["foam-review", "wuwhs-exudate-2019"],
    learningTopicIds: ["gestao-exsudado"],
    etiquetas: ["espuma", "com rebordo", "atraumático"],
    nome_comercial: "Allevyn",
    substancia_ativa: "Espuma de poliuretano hidrocelular com rebordo",
    categoria_clinica: "apositos",
    // Ideal com exsudado moderado; parcial com ligeiro ou abundante; incorreto em seco
    regras: {
      condicoes_ideais: { exsudado: [3] },
      condicoes_parciais: { exsudado: [2, 4] },
      contraindicacoes: [{ exsudado: [1] }],
    },
  },

  {
    id: "exufiber",
    rotulo: "Fibra de polivinil álcool",
    canonicalId: "exufiber",
    equivalenceGroup: "fibra-absorvente",
    category: "Apósito",
    subCategory: "Alta absorção",
    funcoes: ["absorver"],
    indicacoes: ["exsudado moderado a abundante"],
    avisos_contraindicacao: ["ferida seca"],
    refsEvidencia: ["hydrofiber-review", "wuwhs-exudate-2019"],
    learningTopicIds: ["gestao-exsudado"],
    etiquetas: ["fibra PVA", "alta absorção"],
    nome_comercial: "Exufiber",
    substancia_ativa: "Fibra de polivinil álcool",
    categoria_clinica: "apositos",
    // Ideal com exsudado moderado/abundante; parcial com ligeiro; incorreto em seco
    regras: {
      condicoes_ideais: { exsudado: [3, 4] },
      condicoes_parciais: { exsudado: [2] },
      contraindicacoes: [{ exsudado: [1] }],
    },
  },

  {
    id: "exufiber-ag",
    rotulo: "Fibra de polivinil álcool com prata",
    canonicalId: "exufiber-ag",
    equivalenceGroup: "absorvente-prata",
    category: "Apósito",
    subCategory: "Controlo da infeção + Alta absorção",
    funcoes: ["absorver", "controlar-bioburden"],
    indicacoes: ["infeção local", "exsudado moderado a abundante"],
    avisos_contraindicacao: ["ausência de infeção"],
    refsEvidencia: ["hydrofiber-review", "silver-consensus", "aptferidas-infecao-2025"],
    learningTopicIds: ["antimicrobianos", "gestao-exsudado"],
    etiquetas: ["fibra PVA", "prata", "infeção"],
    nome_comercial: "Exufiber Ag",
    substancia_ativa: "Fibra de polivinil álcool com prata",
    categoria_clinica: "apositos",
    // Ideal com infeção + exsudado moderado/abundante; parcial com infeção + ligeiro; incorreto sem infeção
    regras: {
      condicoes_ideais: { infeccao: [1, 2, 3], exsudado: [3, 4] },
      condicoes_parciais: { infeccao: [1, 2, 3], exsudado: [2] },
      contraindicacoes: [{ infeccao: [0] }],
    },
  },


  // ══════════════════════════════════════════════════════════════════════════
  // LÍQUIDOS
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: "agua-oxigenada",
    rotulo: "Água oxigenada",
    canonicalId: "agua-oxigenada",
    equivalenceGroup: "liquido-antisseptico",
    category: "Líquidos",
    subCategory: "Antisséptico oxidante",
    funcoes: ["controlar-bioburden"],
    indicacoes: ["uso limitado e controverso"],
    avisos_contraindicacao: ["tecido de granulação", "uso prolongado"],
    refsEvidencia: ["antiseptic-review-2022"],
    learningTopicIds: ["antimicrobianos"],
    etiquetas: ["água oxigenada", "controverso", "uso limitado"],
    nome_comercial: null,
    substancia_ativa: "Água oxigenada",
    categoria_clinica: "liquidos",
    // Nunca ideal — sempre parcial
    regras: {
      condicoes_ideais: { exsudado: [] },
      condicoes_parciais: {},
      contraindicacoes: [],
    },
  },

  {
    id: "alcool-etilico",
    rotulo: "Álcool etílico",
    canonicalId: "alcool-etilico",
    equivalenceGroup: "alcool",
    category: "Líquidos",
    subCategory: "Desinfetante",
    funcoes: [],
    indicacoes: [],
    avisos_contraindicacao: ["feridas abertas — nunca usar"],
    refsEvidencia: [],
    learningTopicIds: ["antimicrobianos", "materiais-desadequados"],
    etiquetas: ["álcool", "desinfetante", "não usar em feridas"],
    nome_comercial: null,
    substancia_ativa: "Álcool etílico",
    categoria_clinica: "liquidos",
    // Sempre incorreto em qualquer ferida aberta
    regras: {
      condicoes_ideais: { exsudado: [] },
      contraindicacoes: [{}],
    },
  },

  {
    id: "cloreto-sodio",
    rotulo: "Cloreto de sódio",
    canonicalId: "cloreto-sodio",
    equivalenceGroup: "liquido-limpeza",
    category: "Líquidos",
    subCategory: "Limpeza base",
    funcoes: ["limpar"],
    indicacoes: ["limpeza geral", "ferida aguda", "ferida crónica"],
    avisos_contraindicacao: [],
    refsEvidencia: ["water-cleansing"],
    learningTopicIds: ["decisao-clinica"],
    etiquetas: ["soro", "limpeza", "base"],
    nome_comercial: null,
    substancia_ativa: "Cloreto de sódio",
    categoria_clinica: "liquidos",
    // Limpeza básica universal — sempre correto
    regras: {
      condicoes_ideais: {},
      contraindicacoes: [],
    },
  },

  {
    id: "betadine-solucao",
    rotulo: "Iodopovidona solução cutânea",
    canonicalId: "betadine-solucao",
    equivalenceGroup: "liquido-antisseptico",
    category: "Líquidos",
    subCategory: "Antisséptico iodado",
    funcoes: ["antisseptico"],
    indicacoes: ["suspeita de infeção local", "antissépsia local"],
    avisos_contraindicacao: ["uso prolongado sem reavaliação"],
    refsEvidencia: ["antiseptic-review-2022", "aptferidas-infecao-2025"],
    learningTopicIds: ["antimicrobianos"],
    etiquetas: ["iodo", "solução", "antissépsia"],
    nome_comercial: "Betadine Solução Dérmica",
    substancia_ativa: "Iodopovidona solução cutânea",
    categoria_clinica: "liquidos",
    // Sempre correto — antisséptico válido independentemente do estado da ferida
    regras: {
      condicoes_ideais: {},
      contraindicacoes: [],
    },
  },

  {
    id: "octiset",
    rotulo: "Octenidina com fenoxietanol solução",
    canonicalId: "octiset",
    equivalenceGroup: "liquido-antisseptico",
    category: "Líquidos",
    subCategory: "Antisséptico de largo espectro",
    funcoes: ["antisseptico"],
    indicacoes: [
      "suspeita de biofilme",
      "infeção local encoberta ou evidente",
      "antissépsia antes de cobertura com prata",
      "limpeza de feridas colonizadas criticamente",
    ],
    avisos_contraindicacao: [],
    refsEvidencia: ["antiseptic-review-2022", "aptferidas-infecao-2025"],
    learningTopicIds: ["antimicrobianos", "decisao-clinica"],
    etiquetas: ["octenidina", "antissépsia", "biofilme"],
    nome_comercial: "Octiset",
    substancia_ativa: "Octenidina com fenoxietanol solução",
    categoria_clinica: "liquidos",
    // Sempre correto — antisséptico de largo espectro
    regras: {
      condicoes_ideais: {},
      contraindicacoes: [],
    },
  },

  {
    id: "protetor-spray",
    rotulo: "Polímero acrílico spray protetor",
    canonicalId: "protetor-spray",
    equivalenceGroup: "barreira-perilesional",
    category: "Líquidos",
    subCategory: "Barreira cutânea",
    funcoes: ["proteger-perilesional"],
    indicacoes: ["risco de MARSI", "maceração perilesional"],
    avisos_contraindicacao: [],
    refsEvidencia: ["skin-barrier-review"],
    learningTopicIds: ["protecao-perilesional"],
    etiquetas: ["spray", "barreira", "pele perilesional"],
    nome_comercial: null,
    substancia_ativa: "Polímero acrílico spray protetor",
    categoria_clinica: "liquidos",
    // Ideal com maceração ou pele frágil
    regras: {
      condicoes_ideais: { pele_perilesional: [1, 2] },
      condicoes_parciais: { pele_perilesional: [3] },
      contraindicacoes: [],
    },
  },

  {
    id: "octenilin-solucao",
    rotulo: "Octenidina solução de lavagem",
    canonicalId: "octenilin-solucao",
    equivalenceGroup: "liquido-limpeza",
    category: "Líquidos",
    subCategory: "Limpeza base",
    funcoes: ["limpar"],
    indicacoes: [
      "limpeza de feridas agudas e crónicas",
      "preparação do leito antes de cobertura",
      "feridas com tecido desvitalizado",
    ],
    avisos_contraindicacao: [],
    refsEvidencia: ["antiseptic-review-2022", "aptferidas-infecao-2025"],
    learningTopicIds: ["antimicrobianos", "decisao-clinica"],
    etiquetas: ["octenidina", "antissépsia", "lavagem"],
    nome_comercial: "Octenilin Solução",
    substancia_ativa: "Octenidina solução de lavagem",
    categoria_clinica: "liquidos",
    // Sempre correto — limpeza avançada com ação antisséptica
    regras: {
      condicoes_ideais: {},
      contraindicacoes: [],
    },
  },

  {
    id: "tintura-benjoim",
    rotulo: "Tintura de benjoim",
    canonicalId: "tintura-benjoim",
    equivalenceGroup: "barreira-perilesional",
    category: "Líquidos",
    subCategory: "Proteção perilesional",
    funcoes: ["proteger-perilesional"],
    indicacoes: ["pele perilesional frágil", "reforço de adesão de pensos"],
    avisos_contraindicacao: ["pele macerada"],
    refsEvidencia: ["skin-barrier-review"],
    learningTopicIds: ["protecao-perilesional"],
    etiquetas: ["benjoim", "proteção", "adesão"],
    nome_comercial: null,
    substancia_ativa: "Tintura de benjoim",
    categoria_clinica: "liquidos",
    // Ideal em pele frágil/eritematosa; parcial em pele íntegra; incorreto em maceração
    regras: {
      condicoes_ideais: { pele_perilesional: [2, 3] },
      condicoes_parciais: { pele_perilesional: [4] },
      contraindicacoes: [{ pele_perilesional: [1] }],
    },
  },


  // ══════════════════════════════════════════════════════════════════════════
  // POMADAS
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: "atl",
    rotulo: "Gordura anidra",
    canonicalId: "atl",
    equivalenceGroup: "emoliente-perilesional",
    category: "Pomadas",
    subCategory: "Hidratação / Barreira",
    funcoes: ["proteger-perilesional"],
    indicacoes: ["pele seca", "pele frágil perilesional"],
    avisos_contraindicacao: ["maceração ativa no rebordo"],
    refsEvidencia: ["skin-barrier-review"],
    learningTopicIds: ["protecao-perilesional"],
    etiquetas: ["gordura anidra", "barreira", "hidratação"],
    nome_comercial: "ATL",
    substancia_ativa: "Gordura anidra",
    categoria_clinica: "pomadas",
    // Ideal com pele frágil ou eritematosa; parcial em íntegra; incorreto em maceração
    regras: {
      condicoes_ideais: { pele_perilesional: [2, 3] },
      condicoes_parciais: { pele_perilesional: [4] },
      contraindicacoes: [{ pele_perilesional: [1] }],
    },
  },

  {
    id: "creme-hidratante",
    rotulo: "Creme hidratante",
    canonicalId: "creme-hidratante",
    equivalenceGroup: "emoliente-perilesional",
    category: "Pomadas",
    subCategory: "Hidratação",
    funcoes: ["proteger-perilesional"],
    indicacoes: ["pele seca", "prevenção de maceração"],
    avisos_contraindicacao: ["maceração ativa"],
    refsEvidencia: ["skin-barrier-review"],
    learningTopicIds: ["protecao-perilesional"],
    etiquetas: ["hidratante", "pele perilesional"],
    nome_comercial: null,
    substancia_ativa: "Creme hidratante",
    categoria_clinica: "pomadas",
    // Ideal com pele frágil ou eritematosa; parcial em íntegra; incorreto em maceração
    regras: {
      condicoes_ideais: { pele_perilesional: [2, 3] },
      condicoes_parciais: { pele_perilesional: [4] },
      contraindicacoes: [{ pele_perilesional: [1] }],
    },
  },

  {
    id: "betametasona",
    rotulo: "Betametasona pomada corticosteroide",
    canonicalId: "betametasona",
    equivalenceGroup: "corticoide-topico",
    category: "Pomadas",
    subCategory: "Anti-inflamatório tópico",
    funcoes: [],
    indicacoes: ["indicação dermatológica específica"],
    avisos_contraindicacao: ["uso rotineiro em ferida aberta", "substituir o objetivo dominante"],
    refsEvidencia: [],
    learningTopicIds: ["decisao-clinica", "materiais-desadequados"],
    etiquetas: ["corticosteroide", "uso específico"],
    nome_comercial: "Betnovate",
    substancia_ativa: "Betametasona pomada corticosteroide",
    categoria_clinica: "pomadas",
    // Incorreto em ferida genérica; parcial em dermatite de estase perilesional (pele_perilesional: 2)
    regras: {
      condicoes_ideais: { exsudado: [] },
      condicoes_parciais: { pele_perilesional: [2] },
      contraindicacoes: [{ exsudado: [1, 2, 3, 4], pele_perilesional: [1, 3, 4] }],
    },
  },

  {
    id: "betadine-pomada",
    rotulo: "Iodopovidona pomada",
    canonicalId: "betadine-pomada",
    equivalenceGroup: "iodo-topico",
    category: "Pomadas",
    subCategory: "Antisséptico iodado tópico",
    funcoes: ["controlar-bioburden"],
    indicacoes: ["infeção superficial local"],
    avisos_contraindicacao: ["uso prolongado", "tecido de granulação sensível"],
    refsEvidencia: ["antiseptic-review-2022", "aptferidas-infecao-2025"],
    learningTopicIds: ["antimicrobianos"],
    etiquetas: ["iodo", "pomada", "antissépsia"],
    nome_comercial: "Betadine Pomada",
    substancia_ativa: "Iodopovidona pomada",
    categoria_clinica: "pomadas",
    // Ideal com infeção; parcial como preventivo
    regras: {
      condicoes_ideais: { infeccao: [1, 2, 3] },
      condicoes_parciais: { infeccao: [0] },
      contraindicacoes: [],
    },
  },

  {
    id: "sulfadiazina-prata",
    rotulo: "Sulfadiazina de prata creme",
    canonicalId: "sulfadiazina-prata",
    equivalenceGroup: "prata-topica",
    category: "Pomadas",
    subCategory: "Antimicrobiano tópico",
    funcoes: ["controlar-bioburden"],
    indicacoes: [
      "infeção local em queimaduras",
      "infeção local evidente com carga bacteriana gram-negativa",
      "feridas traumáticas infetadas com tecido desvitalizado",
    ],
    avisos_contraindicacao: [
      "ferida sem infeção documentada",
      "alergia a sulfonamidas",
      "uso em neonatos ou grávidas",
    ],
    refsEvidencia: ["silver-consensus", "aptferidas-infecao-2025"],
    learningTopicIds: ["antimicrobianos"],
    etiquetas: ["prata", "creme", "antimicrobiano"],
    nome_comercial: "Silvederma",
    substancia_ativa: "Sulfadiazina de prata creme",
    categoria_clinica: "pomadas",
    // Ideal com infeção marcada; parcial com suspeita; incorreto sem infeção
    regras: {
      condicoes_ideais: { infeccao: [2, 3] },
      condicoes_parciais: { infeccao: [1] },
      contraindicacoes: [{ infeccao: [0] }],
    },
  },

  {
    id: "colagenase",
    rotulo: "Colagenase pomada desbridante",
    canonicalId: "colagenase",
    equivalenceGroup: "desbridamento-enzimatico",
    category: "Pomadas",
    subCategory: "Desbridamento enzimático",
    funcoes: ["desbridar"],
    indicacoes: [
      "fibrina aderente moderada a extensa",
      "tecido desvitalizado quando cirurgia não viável",
      "feridas crónicas estagnadas por carga de fibrina",
      "complemento ao desbridamento autolítico em leitos mistos",
    ],
    avisos_contraindicacao: [
      "leito limpo em granulação ativa — pode inibir epitelização",
      "necrose seca em membro isquémico sem avaliação vascular",
    ],
    refsEvidencia: ["collagenase-review", "debridement-review", "wbp-2024"],
    learningTopicIds: ["desbridamento", "tecidos-e-leito"],
    etiquetas: ["desbridamento", "enzimático", "fibrina"],
    nome_comercial: "Ulcerase",
    substancia_ativa: "Colagenase pomada desbridante",
    categoria_clinica: "pomadas",
    // Ideal para necrose ou fibrina; parcial com tecido misto; incorreto em epitelização
    regras: {
      condicoes_ideais: { tecido: [1, 2] },
      condicoes_parciais: { tecido: [3] },
      contraindicacoes: [{ tecido: [4] }],
    },
  },

  {
    id: "oxido-zinco",
    rotulo: "Óxido de zinco pomada",
    canonicalId: "oxido-zinco",
    equivalenceGroup: "barreira-perilesional",
    category: "Pomadas",
    subCategory: "Barreira cutânea",
    funcoes: ["proteger-perilesional"],
    indicacoes: ["maceração", "pele frágil perilesional"],
    avisos_contraindicacao: ["uso em excesso sob zona de adesão crítica"],
    refsEvidencia: ["skin-barrier-review"],
    learningTopicIds: ["protecao-perilesional"],
    etiquetas: ["óxido de zinco", "barreira", "maceração"],
    nome_comercial: "Lauroderme / Halibut",
    substancia_ativa: "Óxido de zinco pomada",
    categoria_clinica: "pomadas",
    // Ideal com maceração ou pele frágil; parcial com eritema
    regras: {
      condicoes_ideais: { pele_perilesional: [1, 2] },
      condicoes_parciais: { pele_perilesional: [3] },
      contraindicacoes: [],
    },
  },


  // ══════════════════════════════════════════════════════════════════════════
  // OUTROS
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: "nitrato-prata",
    rotulo: "Nitrato de prata lápis",
    canonicalId: "nitrato-prata",
    equivalenceGroup: "cauterizante",
    category: "Outros",
    subCategory: "Cauterizante",
    funcoes: ["controlar-bioburden"],
    indicacoes: ["hipergranulação", "tecido exuberante"],
    avisos_contraindicacao: ["ferida sem hipergranulação"],
    refsEvidencia: [],
    learningTopicIds: ["tecidos-e-leito"],
    etiquetas: ["cauterizante", "lápis", "hipergranulação"],
    nome_comercial: null,
    substancia_ativa: "Nitrato de prata lápis",
    categoria_clinica: "outros",
    // Ideal em hipergranulação; incorreto em todos os outros contextos
    regras: {
      condicoes_ideais: { tecido: [5] },
      contraindicacoes: [{ tecido: [1] }, { tecido: [2] }, { tecido: [4] }],
    },
  },

  {
    id: "esponja-hemostatica",
    rotulo: "Esponja hemostática de gelatina",
    canonicalId: "esponja-hemostatica",
    equivalenceGroup: "hemostatico",
    category: "Outros",
    subCategory: "Hemostático",
    funcoes: [],
    indicacoes: ["hemorragia ativa"],
    avisos_contraindicacao: ["ferida sem hemorragia"],
    refsEvidencia: [],
    learningTopicIds: ["decisao-clinica"],
    etiquetas: ["hemostático", "gelatina", "hemorragia"],
    nome_comercial: null,
    substancia_ativa: "Esponja hemostática de gelatina",
    categoria_clinica: "outros",
    // Ideal com hemorragia moderada/abundante; parcial com ligeira; incorreto sem hemorragia
    regras: {
      condicoes_ideais: { hemorragia: [2, 3] },
      condicoes_parciais: { hemorragia: [1] },
      contraindicacoes: [{ hemorragia: [0] }],
    },
  },

  {
    id: "hidrogel",
    rotulo: "Hidrogel",
    canonicalId: "hidrogel",
    equivalenceGroup: "gel-hidratante",
    category: "Outros",
    subCategory: "Desbridamento autolítico",
    funcoes: ["hidratar", "desbridar"],
    indicacoes: [
      "ferida seca ou pouco exsudativa com fibrina ou necrose superficial",
      "desbridamento autolítico não invasivo",
      "úlceras de pressão com leito seco e necrose",
      "alívio da dor em leito ressecado",
    ],
    avisos_contraindicacao: [
      "exsudado moderado a abundante — agrava maceração",
      "maceração perilesional",
      "infeção marcada sem antimicrobiano associado",
    ],
    refsEvidencia: ["hydrogel-cochrane-2013", "wounds-intl-autolytic-2025"],
    learningTopicIds: ["desbridamento", "gestao-exsudado"],
    etiquetas: ["hidrogel", "hidrata", "autolítico"],
    nome_comercial: null,
    substancia_ativa: "Hidrogel",
    categoria_clinica: "outros",
    // Ideal em ferida seca com fibrina/necrose; incorreto com exsudado abundante ou maceração
    regras: {
      condicoes_ideais: { tecido: [1, 2], exsudado: [1, 2] },
      condicoes_parciais: { tecido: [1, 2], exsudado: [3] },
      contraindicacoes: [{ exsudado: [4] }, { humidade: [4] }],
    },
  },

  {
    id: "octenilin-gel",
    rotulo: "Octenidina gel",
    canonicalId: "octenilin-gel",
    equivalenceGroup: "liquido-limpeza-avancada",
    category: "Outros",
    subCategory: "Antissético em gel",
    funcoes: ["limpar", "controlar-bioburden"],
    indicacoes: [
      "feridas cavitárias ou túneis com infeção local",
      "biofilme em leito profundo",
      "desbridamento mecânico húmido com ação antisséptica",
      "feridas de difícil acesso onde solução de lavagem não permanece",
    ],
    avisos_contraindicacao: [],
    refsEvidencia: ["antiseptic-review-2022", "aptferidas-infecao-2025"],
    learningTopicIds: ["antimicrobianos"],
    etiquetas: ["octenidina", "gel", "cavidades", "infeção"],
    nome_comercial: "Octenilin Gel",
    substancia_ativa: "Octenidina gel",
    categoria_clinica: "outros",
    // Ideal com infeção; parcial sem infeção; bónus em feridas profundas/cavidades
    regras: {
      condicoes_ideais: { infeccao: [1, 2, 3] },
      condicoes_parciais: { infeccao: [0] },
      contraindicacoes: [],
      bonus: { profundidade: [3, 4] },
    },
  },

  // ══════════════════════════════════════════════════════════════════════════
  // COMO FUNCIONA A LIGAÇÃO CASO → MATERIAL
  //
  // Os materiais disponíveis em cada caso são definidos em duas camadas:
  //
  // 1. availableTreatments (CaseTemplate) — lista os IDs dos materiais que
  //    o estudante pode escolher para aquele caso específico. É o "menu" do
  //    seletor de materiais no CaseTreatmentPlanner.
  //
  // 2. clinicalTargets (CaseTemplate) — define os objetivos clínicos do caso
  //    (ex: controlar infeção, absorver exsudado). Cada objetivo referencia
  //    treatmentIds com as escolhas corretas/parciais esperadas.
  //    O motor de avaliação (evaluation.ts) compara o plano do estudante
  //    com estes objetivos para calcular a pontuação.
  //
  // 3. evaluationRules (CaseTemplate) — regras de penalização ou bónus para
  //    materiais específicos (ex: penalizar uso de álcool etílico). Permitem
  //    refinar a avaliação além dos objetivos.
  //
  // Fluxo:
  //   CaseTemplate.availableTreatments
  //     → mostra opções ao estudante
  //   CaseTemplate.clinicalTargets[].treatmentIds
  //     → define o que é correto/parcial/incorreto
  //   CaseTemplate.evaluationRules[]
  //     → aplica penalizações ou bónus adicionais
  //
  // Para adicionar um material a um caso:
  //   1. Garantir que existe em treatmentCatalog (este ficheiro)
  //   2. Adicionar o ID a CaseTemplate.availableTreatments
  //   3. Referenciar em clinicalTargets e/ou evaluationRules conforme necessário
  // ══════════════════════════════════════════════════════════════════════════
];
