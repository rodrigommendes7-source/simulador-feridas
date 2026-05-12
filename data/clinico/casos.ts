import type {
  OpcaoAplicacao,
  ObjetivoCaso,
  ModeloCaso,
  PerguntaDialogo,
  DefinicaoObservacao,
} from "../../lib/clinico/types.ts";

const observationDefinitions: DefinicaoObservacao[] = [
  { id: "imagem", rotulo: "Imagem", prioridade: "essencial", instrucao: "Ver imagem da ferida", idsTemas: ["tecidos-e-leito"] },
  { id: "dimensoes", rotulo: "Dimensões", prioridade: "essencial", instrucao: "Ver dimensões", idsTemas: ["decisao-clinica"] },
  { id: "exsudado", rotulo: "Exsudado", prioridade: "essencial", instrucao: "Ver exsudado", idsTemas: ["gestao-exsudado"] },
  { id: "cheiro", rotulo: "Odor", prioridade: "adequado", instrucao: "Ver odor", idsTemas: ["antimicrobianos"] },
  { id: "tecidos", rotulo: "Tecidos", prioridade: "essencial", instrucao: "Ver tecidos presentes", idsTemas: ["tecidos-e-leito", "desbridamento"] },
  { id: "bordos", rotulo: "Bordos", prioridade: "essencial", instrucao: "Ver bordos da ferida", idsTemas: ["tecidos-e-leito"] },
  { id: "pele_perilesional", rotulo: "Pele peri-ferida", prioridade: "essencial", instrucao: "Ver pele peri-ferida", idsTemas: ["protecao-perilesional"] },
];

const dialoguePrompts: PerguntaDialogo[] = [
  { id: "dor", rotulo: "Perguntar sobre dor", pergunta: "Tem dor? Se sim, quanto daria numa escala de 0 a 10?", prioridade: "essencial", idsTemas: ["decisao-clinica"] },
  { id: "duracao", rotulo: "Perguntar sobre duração", pergunta: "Há quanto tempo existe este problema e como tem evoluído?", prioridade: "adequado", idsTemas: ["decisao-clinica"] },
  { id: "posicao", rotulo: "Perguntar sobre alívio de pressão / posicionamento", pergunta: "Como é o posicionamento ou descarga da zona afetada no dia a dia?", prioridade: "essencial", idsTemas: ["decisao-clinica"] },
  { id: "pensos", rotulo: "Perguntar sobre pensos prévios", pergunta: "Que tipo de pensos lhe têm sido feitos e com que frequência?", prioridade: "adequado", idsTemas: ["decisao-clinica"] },
  { id: "febre", rotulo: "Perguntar sobre febre", pergunta: "Teve febre, arrepios ou sinais de agravamento sistémico?", prioridade: "adequado", idsTemas: ["antimicrobianos"] },
  { id: "mobilidade", rotulo: "Perguntar sobre mobilidade", pergunta: "Consegue mobilizar-se sozinho ou precisa de ajuda?", prioridade: "adequado", idsTemas: ["decisao-clinica"] },
];

const applicationDefinitions: OpcaoAplicacao[] = [
  { id: "direto_seco", rotulo: "Aplicar material diretamente em seco", idsTemas: ["materiais-desadequados"] },
  {
    id: "penso_rapido",
    rotulo: "Penso rápido",
    idsTemas: ["decisao-clinica"],
    regras: {
    condicoes_ideais: { profundidade: [1] },
    condicoes_parciais: { profundidade: [2] },
    contraindicacoes: [{ profundidade: [3, 4] }, { infeccao: [2, 3] }],
    },
  },
  {
    id: "penso_simples",
    rotulo: "Penso simples protetor",
    idsTemas: ["decisao-clinica"],
    regras: {
    condicoes_ideais: {},
    contraindicacoes: [],
    },
  },
  {
    id: "ligadura",
    rotulo: "Ligadura",
    idsTemas: ["decisao-clinica"],
    regras: {
    condicoes_ideais: { etiologia: [2, 4, 5] },
    condicoes_parciais: { etiologia: [1, 6] },
    contraindicacoes: [{ etiologia: [3] }, { perfusao: [0] }],
    },
  },
  {
    id: "penso_impermeavel",
    rotulo: "Penso impermeável",
    idsTemas: ["decisao-clinica"],
    regras: {
    condicoes_ideais: { profundidade: [1], infeccao: [0] },
    condicoes_parciais: { profundidade: [2], infeccao: [0] },
    contraindicacoes: [{ infeccao: [2, 3] }],
    },
  },
  {
    id: "terapia_compressiva",
    rotulo: "Terapia compressiva",
    idsTemas: ["decisao-clinica"],
    regras: {
    condicoes_ideais: { etiologia: [2] },
    condicoes_parciais: { etiologia: [4] },
    contraindicacoes: [{ etiologia: [3] }, { perfusao: [0] }],
    },
  },
  {
    id: "sem_protecao",
    rotulo: "Sem proteção / exposição ao ar",
    idsTemas: ["decisao-clinica"],
    regras: {
    condicoes_ideais: {},
    contraindicacoes: [{ infeccao: [1, 2, 3] }, { exsudado: [2, 3, 4] }],
    },
  },
];

function goal(
  id: string,
  rotulo: string,
  intencao: ObjetivoCaso["intencao"],
  prioridade: ObjetivoCaso["prioridade"],
  justificativa: string,
  correspondencia: ObjetivoCaso["correspondencia"],
  idsTemas: string[]
): ObjetivoCaso {
  return { id, rotulo, intencao, prioridade, justificativa, correspondencia, idsTemas };
}

const cases: ModeloCaso[] = [
  // ─── Caso 1 ──────────────────────────────────────────────────────────────────
  {
    id: "1",
    slug: "1",
    tituloAbreviado: "Caso 1",
    titulo: "Lesão por pressão",
    descricao: "Treinar leitura de esfacelo, desbridamento e seleção de cobertura absorvente.",
    competencias: "Observação, leitura de esfacelo, desbridamento e gestão de exsudado",
    dificuldade: "introdutorio",
    ordem: 1,
    minutosEstimados: 8,
    status: "disponivel",
    srcImagem: "/caso1.jpg",
    altImagem: "Lesão sacrococcígea em utente acamado — © Medetec Medical Images (medetec.co.uk)",
    resumoIntro: "Utente acamado com lesão por pressão na região sacrococcígea.",
    objetivo: "Identificar o tecido dominante e selecionar cobertura absorvente e desbridante adequadas.",
    definicoesObservacao: observationDefinitions,
    promptsDialogo: dialoguePrompts,
    definicoesAplicacao: applicationDefinitions,
    objetivosVisuais: {
    tecidos: ["fibrina", "necrose"],
    exsudado: ["seroso"],
    bordos: ["rubor"],
    },
    tituloCenario: "UPP categoria III/IV",
    contextoPaciente: "Utente de 82 anos, acamado com dependência total para mobilização, com lesão sacrococcígea com evolução de 2 semanas.",
    bannerPaciente: "Lesão sacrococcígea em utente acamado — © Medetec Medical Images (medetec.co.uk)",
    estadoFerida: { exsudado: "moderado", infeccao: "contaminacao", tecido: "necrose-fibrina", perilesional: "integra", odor: "ausente" },
    variavelFerida: { exsudado: 3, infeccao: 0, tecido: 2, odor: 0, humidade: 3, profundidade: 3, bordos: 2, pele_perilesional: 4, dor: 1, hemorragia: 0, etiologia: 1, perfusao: 1 },
    detalhesObservacao: {
    imagem: { detalhe: "Lesão sacrococcígea com leito de aparência mista e pele antiga cicatrizada adjacente." },
    dimensoes: { detalhe: "≈4 × 3 cm; profundidade não determinável pela imagem (provável categoria III/IV)." },
    exsudado: { detalhe: "Moderado, transparente e rosado." },
    cheiro: { detalhe: "Sem odor." },
    tecidos: { detalhe: "Zona amarelada predominante no leito; área preta e seca num canto; alguma zona avermelhada visível." },
    bordos: { detalhe: "Bordos irregulares." },
    pele_perilesional: { detalhe: "Pele cicatrizada em redor, com área avermelhada mas íntegra." },
    },
    respostasDialogo: {
    dor: "Sinto desconforto quando me mexem, mas não é muito intenso — daria um 2 em 10.",
    duracao: "A ferida apareceu há cerca de duas semanas e não mudou muito desde então.",
    posicao: "Preciso que me virem na cama — não consigo fazê-lo sozinho.",
    pensos: "Tenho feito penso com compressas, mas não sei dizer mais.",
    febre: "Não tive febre.",
    mobilidade: "Estou totalmente dependente para sair da cama.",
    },
    tratamentosDisponiveis: ["cloreto-sodio", "octenilin-solucao", "betadine-solucao", "octiset", "colagenase", "hidrogel", "aquacel", "alginato-calcio", "exufiber", "allevyn", "hidrocoloide", "betametasona", "alcool-etilico", "agua-oxigenada"],
    opcoesAplicacao: ["penso_rapido", "penso_simples", "penso_impermeavel", "ligadura", "terapia_compressiva", "direto_seco", "sem_protecao"],
    objetivosClinicosAlvo: [
    goal("cleanse", "Fazer limpeza antes da cobertura", "limpar-ferida", "essencial", "A limpeza do leito precede qualquer cobertura para remover detritos e reduzir carga microbiana.", { idsTratamento: ["cloreto-sodio", "octenilin-solucao"] }, ["decisao-clinica"]),
    goal("antisepsis", "Associar antissépsia local", "controlar-bioburden", "essencial", "A antissépsia local prepara o leito e reduz o risco de colonização crítica.", { idsTratamento: ["betadine-solucao", "octiset"] }, ["antimicrobianos", "decisao-clinica"]),
    goal("desbridamento", "Desbridar o esfacelo dominante", "desbridamento", "essencial", "O esfacelo bloqueia a progressão do leito — a colagenase é o desbridante enzimático de eleição.", { idsTratamento: ["colagenase"] }, ["desbridamento", "tecidos-e-leito"]),
    goal("exudate", "Controlar o exsudado moderado", "controlar-exsudado", "essencial", "A cobertura absorvente mantém o equilíbrio de humidade e protege o leito em cicatrização.", { idsTratamento: ["aquacel", "alginato-calcio", "exufiber"] }, ["gestao-exsudado"]),
    goal("app-cover", "Aplicar penso simples protetor", "cobertura-atraumatica", "essencial", "Penso simples protetor é a técnica correta — protege sem comprimir nem aderir ao leito.", { idsAplicacao: ["penso_simples"] }, ["decisao-clinica"]),
    goal("debride-autolytic", "Considerar hidrogel na necrose seca focal", "desbridamento", "adequado", "O hidrogel reidrata a necrose seca e prepara o leito para desbridamento autolítico.", { idsTratamento: ["hidrogel"] }, ["desbridamento"]),
    goal("secondary-cover", "Penso secundário absorvente", "controlar-exsudado", "adequado", "O Allevyn como cobertura secundária dá conforto e protege o penso primário.", { idsTratamento: ["allevyn"] }, ["gestao-exsudado"]),
    ],
    regrasAvaliacao: [
    { id: "hidrocoloide-upp1", alvo: "tratamento", aplicavelAIds: ["hidrocoloide"], classificacao: "redundante", motivo: "O hidrocolóide tem baixa capacidade absortiva — o exsudado moderado neste caso limita a sua utilidade como cobertura principal.", idsTemas: ["gestao-exsudado"] },
    { id: "betametasona-upp1", alvo: "tratamento", aplicavelAIds: ["betametasona"], classificacao: "inadequado", motivo: "A betametasona não tem indicação neste caso — o problema dominante é o esfacelo e o exsudado, não inflamação perilesional.", idsTemas: ["decisao-clinica"] },
    { id: "agua-oxigenada-upp1", alvo: "tratamento", aplicavelAIds: ["agua-oxigenada"], classificacao: "redundante", motivo: "A água oxigenada não é recomendada em feridas crónicas — é citotóxica e não acrescenta valor clínico ao plano.", idsTemas: ["antimicrobianos"] },
    { id: "alcool-upp1", alvo: "tratamento", aplicavelAIds: ["alcool-etilico"], classificacao: "inadequado", motivo: "O álcool é citotóxico e destrói o tecido de granulação — está contraindicado em qualquer ferida crónica.", idsTemas: ["antimicrobianos"] },
    { id: "direto-seco-upp1", alvo: "aplicacao", aplicavelAIds: ["direto_seco"], classificacao: "inadequado", motivo: "Aplicar material em seco adere ao leito e causa trauma na remoção — inadequado em ferida com esfacelo e tecido viável.", idsTemas: ["decisao-clinica"] },
    { id: "sem-protecao-upp1", alvo: "aplicacao", aplicavelAIds: ["sem_protecao"], classificacao: "inadequado", motivo: "Exposição da ferida sem cobertura aumenta o risco de contaminação e ressecamento do leito.", idsTemas: ["decisao-clinica"] },
    { id: "penso-rapido-upp1", alvo: "aplicacao", aplicavelAIds: ["penso_rapido"], classificacao: "inadequado", motivo: "Penso rápido é aderente e não indicado em ferida profunda com esfacelo — causa trauma na remoção.", idsTemas: ["decisao-clinica"] },
    { id: "ligadura-upp1", alvo: "aplicacao", aplicavelAIds: ["ligadura"], classificacao: "inadequado", motivo: "Ligadura não é a técnica adequada para lesão por pressão sacrococcígea — não há indicação de compressão neste contexto.", idsTemas: ["decisao-clinica"] },
    { id: "terapia-compressiva-upp1", alvo: "aplicacao", aplicavelAIds: ["terapia_compressiva"], classificacao: "inadequado", motivo: "Terapia compressiva está contraindicada em lesão por pressão — aumentaria a pressão local e agravaria a isquemia.", idsTemas: ["decisao-clinica"] },
    ],
    zonasTecido: [
  {
    "tipoTecido": "fibrina",
    "poligono": [
      {
        "x": 0.398125,
        "y": 0.5227121320535912
      },
      {
        "x": 0.418125,
        "y": 0.5274494806188161
      },
      {
        "x": 0.419375,
        "y": 0.552715339633349
      },
      {
        "x": 0.406875,
        "y": 0.568506501517432
      },
      {
        "x": 0.385625,
        "y": 0.5716647338942485
      },
      {
        "x": 0.376875,
        "y": 0.5606109205753904
      },
      {
        "x": 0.374375,
        "y": 0.5495571072565324
      },
      {
        "x": 0.383125,
        "y": 0.5400824101260826
      },
      {
        "x": 0.395625,
        "y": 0.5242912482419996
      }
    ]
  },
  {
    "tipoTecido": "necrose",
    "poligono": [
      {
        "x": 0.474375,
        "y": 0.5290285968072245
      },
      {
        "x": 0.485625,
        "y": 0.5542944558217573
      },
      {
        "x": 0.496875,
        "y": 0.5479779910681241
      },
      {
        "x": 0.475625,
        "y": 0.5306077129956328
      }
    ]
  },
  {
    "tipoTecido": "necrose",
    "poligono": [
      {
        "x": 0.494375,
        "y": 0.48639245972020034
      },
      {
        "x": 0.490625,
        "y": 0.46270571689407586
      },
      {
        "x": 0.471875,
        "y": 0.46744306545930076
      },
      {
        "x": 0.448125,
        "y": 0.47691776258975055
      },
      {
        "x": 0.463125,
        "y": 0.4879715759086086
      },
      {
        "x": 0.490625,
        "y": 0.4879715759086086
      }
    ]
  },
  {
    "tipoTecido": "fibrina",
    "poligono": [
      {
        "x": 0.484375,
        "y": 0.6095635224160477
      },
      {
        "x": 0.499375,
        "y": 0.6095635224160477
      },
      {
        "x": 0.510625,
        "y": 0.5969305929087814
      },
      {
        "x": 0.531875,
        "y": 0.5795603148362901
      },
      {
        "x": 0.549375,
        "y": 0.5795603148362901
      },
      {
        "x": 0.566875,
        "y": 0.5700856177058402
      },
      {
        "x": 0.566875,
        "y": 0.5416615263144908
      },
      {
        "x": 0.558125,
        "y": 0.532186829184041
      },
      {
        "x": 0.561875,
        "y": 0.5037627377926917
      },
      {
        "x": 0.549375,
        "y": 0.4879715759086086
      },
      {
        "x": 0.524375,
        "y": 0.48007599496656717
      },
      {
        "x": 0.496875,
        "y": 0.47218041402452565
      },
      {
        "x": 0.475625,
        "y": 0.45954748451725924
      },
      {
        "x": 0.455625,
        "y": 0.4658639492708925
      },
      {
        "x": 0.441875,
        "y": 0.48165511115497545
      },
      {
        "x": 0.425625,
        "y": 0.49902538922746675
      },
      {
        "x": 0.414375,
        "y": 0.5100792025463249
      },
      {
        "x": 0.429375,
        "y": 0.5132374349231414
      },
      {
        "x": 0.448125,
        "y": 0.5085000863579165
      },
      {
        "x": 0.455625,
        "y": 0.5227121320535912
      },
      {
        "x": 0.463125,
        "y": 0.5242912482419996
      },
      {
        "x": 0.459375,
        "y": 0.5463988748797157
      },
      {
        "x": 0.448125,
        "y": 0.5779811986478818
      },
      {
        "x": 0.451875,
        "y": 0.5937723605319648
      },
      {
        "x": 0.470625,
        "y": 0.6032470576624146
      },
      {
        "x": 0.490625,
        "y": 0.6095635224160477
      }
    ]
  },
  {
    "tipoTecido": "granulacao",
    "poligono": [
      {
        "x": 0.510625,
        "y": 0.6458831947494387
      },
      {
        "x": 0.490625,
        "y": 0.6174591033580893
      },
      {
        "x": 0.518125,
        "y": 0.5969305929087814
      },
      {
        "x": 0.536875,
        "y": 0.5827185472131067
      },
      {
        "x": 0.565625,
        "y": 0.5764020824594734
      },
      {
        "x": 0.571875,
        "y": 0.5432406425028992
      },
      {
        "x": 0.560625,
        "y": 0.5258703644304079
      },
      {
        "x": 0.563125,
        "y": 0.49112980828542524
      },
      {
        "x": 0.585625,
        "y": 0.5100792025463249
      },
      {
        "x": 0.601875,
        "y": 0.5337659453724494
      },
      {
        "x": 0.605625,
        "y": 0.5558735720101655
      },
      {
        "x": 0.600625,
        "y": 0.5858767795899232
      },
      {
        "x": 0.589375,
        "y": 0.6095635224160477
      },
      {
        "x": 0.568125,
        "y": 0.6221964519233142
      },
      {
        "x": 0.545625,
        "y": 0.6364084976189889
      },
      {
        "x": 0.520625,
        "y": 0.6427249623726221
      },
      {
        "x": 0.509375,
        "y": 0.6490414271262552
      },
      {
        "x": 0.485625,
        "y": 0.6553578918798885
      },
      {
        "x": 0.458125,
        "y": 0.6506205433146636
      },
      {
        "x": 0.430625,
        "y": 0.6411458461842138
      },
      {
        "x": 0.396875,
        "y": 0.6253546843001307
      },
      {
        "x": 0.366875,
        "y": 0.6221964519233142
      },
      {
        "x": 0.351875,
        "y": 0.6048261738508228
      },
      {
        "x": 0.343125,
        "y": 0.5764020824594734
      },
      {
        "x": 0.353125,
        "y": 0.5558735720101655
      },
      {
        "x": 0.361875,
        "y": 0.5400824101260826
      },
      {
        "x": 0.374375,
        "y": 0.5637691529522071
      },
      {
        "x": 0.388125,
        "y": 0.5748229662710652
      },
      {
        "x": 0.405625,
        "y": 0.5732438500826569
      },
      {
        "x": 0.419375,
        "y": 0.5621900367637988
      },
      {
        "x": 0.428125,
        "y": 0.5511362234449406
      },
      {
        "x": 0.426875,
        "y": 0.5337659453724494
      },
      {
        "x": 0.416875,
        "y": 0.5242912482419996
      },
      {
        "x": 0.408125,
        "y": 0.5211330158651829
      },
      {
        "x": 0.413125,
        "y": 0.5148165511115498
      },
      {
        "x": 0.429375,
        "y": 0.516395667299958
      },
      {
        "x": 0.445625,
        "y": 0.516395667299958
      },
      {
        "x": 0.460625,
        "y": 0.5290285968072245
      },
      {
        "x": 0.454375,
        "y": 0.5495571072565324
      },
      {
        "x": 0.446875,
        "y": 0.5732438500826569
      },
      {
        "x": 0.451875,
        "y": 0.595351476720373
      },
      {
        "x": 0.464375,
        "y": 0.6032470576624146
      },
      {
        "x": 0.481875,
        "y": 0.6111426386044561
      },
      {
        "x": 0.486875,
        "y": 0.6143008709812726
      }
    ]
  }
    ],
    idsTemas: ["tecidos-e-leito", "desbridamento", "gestao-exsudado", "decisao-clinica"],
    planoRecomendado: {
    minimo: ["Limpeza com soro fisiológico ou antisséptico", "Desbridamento enzimático do esfacelo", "Cobertura absorvente proporcional ao exsudado", "Penso simples protetor"],
    otimizado: ["Limpeza com soro fisiológico ou antisséptico", "Desbridamento enzimático do esfacelo", "Hidratação da necrose seca com hidrogel", "Cobertura absorvente proporcional ao exsudado", "Penso secundário absorvente (Allevyn)", "Penso simples protetor", "Reposicionamento a cada 2 h e superfície de alívio de pressão"],
    },
  },

  // ─── Caso 2 ──────────────────────────────────────────────────────────────────
  {
    id: "2",
    slug: "2",
    tituloAbreviado: "Caso 2",
    titulo: "Deiscência cirúrgica",
    descricao: "Reconhecer leito viável exposto, controlar exsudado e proteger sem sobrocluir.",
    competencias: "Gestão de exsudado, cobertura atraumática e proteção de tecido viável exposto",
    dificuldade: "intermedio",
    ordem: 2,
    minutosEstimados: 10,
    status: "disponivel",
    srcImagem: "/caso2.jpg",
    altImagem: "Ferida cirúrgica abdominal com deiscência e pontos de retenção — © Medetec Medical Images (medetec.co.uk)",
    resumoIntro: "Utente de 58 anos com deiscência cirúrgica abdominal após laparotomia, sem sinais de infeção.",
    objetivo: "Proteger o tecido viável exposto, controlar o exsudado e evitar oclusão excessiva.",
    definicoesObservacao: observationDefinitions,
    promptsDialogo: dialoguePrompts,
    definicoesAplicacao: applicationDefinitions,
    objetivosVisuais: {
    tecidos: ["fibrina"],
    exsudado: ["hematico"],
    bordos: ["integra"],
    },
    tituloCenario: "Deiscência cirúrgica aguda",
    contextoPaciente: "Utente de 58 anos com deiscência longitudinal extensa de ferida abdominal após laparotomia, com pontos de retenção ainda visíveis, depósito fibrinoso no leito e bordos cirúrgicos íntegros.",
    bannerPaciente: "Ferida cirúrgica abdominal com deiscência e pontos de retenção — © Medetec Medical Images (medetec.co.uk)",
    estadoFerida: { exsudado: "moderado", infeccao: "contaminacao", tecido: "fibrina", perilesional: "fragil", odor: "ausente" },
    variavelFerida: { exsudado: 3, infeccao: 0, tecido: 2, odor: 0, humidade: 3, profundidade: 3, bordos: 3, pele_perilesional: 2, dor: 2, hemorragia: 1, etiologia: 6, perfusao: 1 },
    detalhesObservacao: {
    imagem: { detalhe: "Ferida cirúrgica com abertura longitudinal extensa e pontos de retenção visíveis." },
    dimensoes: { detalhe: "≈12 × 3 cm de extensão longitudinal." },
    exsudado: { detalhe: "Moderado a abundante, transparente e rosado." },
    cheiro: { detalhe: "Sem odor." },
    tecidos: { detalhe: "Zona amarelada no leito; tecido profundo visível nas margens." },
    bordos: { detalhe: "Bordos cirúrgicos abertos ao longo da incisão." },
    pele_perilesional: { detalhe: "Húmida e brilhante; área arroxeada; aspeto frágil em redor da incisão." },
    },
    respostasDialogo: {
    dor: "Dói bastante quando me mexo ou toco na zona — daria um 6 em 10.",
    duracao: "A ferida abriu nos dias a seguir à cirurgia e não voltou a fechar.",
    posicao: "Estou maioritariamente deitado, levanto-me com ajuda.",
    pensos: "Têm-me feito penso todos os dias aqui no hospital.",
    febre: "Não tive febre.",
    mobilidade: "Preciso de ajuda para sair da cama por causa da dor.",
    },
    tratamentosDisponiveis: ["cloreto-sodio", "octenilin-solucao", "betadine-solucao", "octiset", "colagenase", "aquacel", "alginato-calcio", "exufiber", "urgotul", "allevyn-nao-adesivo", "vliwasorb", "aquacel-ag", "silvercel", "hidrogel", "hidrocoloide", "betametasona", "alcool-etilico"],
    opcoesAplicacao: ["penso_rapido", "penso_simples", "penso_impermeavel", "ligadura", "terapia_compressiva", "direto_seco", "sem_protecao"],
    objetivosClinicosAlvo: [
    goal("cleanse", "Fazer limpeza antes da cobertura", "limpar-ferida", "essencial", "A limpeza remove o depósito fibrinoso solto e prepara o leito antes de qualquer cobertura.", { idsTratamento: ["cloreto-sodio", "octenilin-solucao"] }, ["decisao-clinica"]),
    goal("antisepsis", "Associar antissépsia local", "controlar-bioburden", "essencial", "A antissépsia reduz o risco de colonização no leito com fibrina.", { idsTratamento: ["betadine-solucao", "octiset"] }, ["antimicrobianos", "decisao-clinica"]),
    goal("desbridamento", "Desbridar o depósito fibrinoso", "desbridamento", "essencial", "A fibrina aderente bloqueia a progressão para granulação — a colagenase dissolve-a enzimáticamente sem lesar os bordos íntegros.", { idsTratamento: ["colagenase"] }, ["desbridamento", "tecidos-e-leito"]),
    goal("absorb", "Cobertura absorvente proporcional ao exsudado", "controlar-exsudado", "essencial", "O exsudado moderado a abundante exige cobertura absorvente que mantenha o equilíbrio de humidade.", { idsTratamento: ["aquacel", "alginato-calcio", "exufiber"] }, ["gestao-exsudado"]),
    goal("atraumatic", "Cobertura não aderente sobre o leito", "cobertura-atraumatica", "essencial", "O leito em desbridamento exige cobertura não aderente para evitar trauma na remoção.", { idsTratamento: ["urgotul"] }, ["tecidos-e-leito", "fixacao-e-remocao"]),
    goal("app-cover", "Aplicar penso simples protetor", "cobertura-atraumatica", "essencial", "Penso simples é a técnica correta — protege sem comprimir nem ocluir em excesso.", { idsAplicacao: ["penso_simples"] }, ["decisao-clinica"]),
    goal("secondary-cover", "Cobertura secundária absorvente", "controlar-exsudado", "adequado", "Cobertura secundária protege e absorve o excesso de exsudado.", { idsTratamento: ["allevyn-nao-adesivo", "vliwasorb"] }, ["gestao-exsudado"]),
    ],
    regrasAvaliacao: [
    { id: "prata-sem-infeccao-2", alvo: "tratamento", aplicavelAIds: ["aquacel-ag", "silvercel"], classificacao: "inadequado", motivo: "Sem sinais de infeção, a prata não é necessária e aumenta o custo sem benefício clínico adicional.", idsTemas: ["antimicrobianos"] },
    { id: "hidrogel-dehiscence-2", alvo: "tratamento", aplicavelAIds: ["hidrogel"], classificacao: "inadequado", motivo: "O hidrogel aumenta a humidade num leito profundo com exsudado presente — risco de maceração e atraso na cicatrização.", idsTemas: ["gestao-exsudado"] },
    { id: "hidrocoloide-dehiscence-2", alvo: "tratamento", aplicavelAIds: ["hidrocoloide"], classificacao: "inadequado", motivo: "O hidrocolóide oclusivo não é adequado em ferida profunda recente com exsudado abundante.", idsTemas: ["gestao-exsudado"] },
    { id: "betametasona-dehiscence-2", alvo: "tratamento", aplicavelAIds: ["betametasona"], classificacao: "inadequado", motivo: "A betametasona não tem indicação nesta deiscência sem componente inflamatório perilesional justificado.", idsTemas: ["decisao-clinica"] },
    { id: "alcool-dehiscence-2", alvo: "tratamento", aplicavelAIds: ["alcool-etilico"], classificacao: "inadequado", motivo: "O álcool é citotóxico — destrói o tecido em desbridamento e está contraindicado em ferida cirúrgica.", idsTemas: ["antimicrobianos"] },
    { id: "direto-seco-dehiscence-2", alvo: "aplicacao", aplicavelAIds: ["direto_seco"], classificacao: "inadequado", motivo: "Aplicar material em seco adere ao leito em desbridamento e causa trauma grave na remoção.", idsTemas: ["decisao-clinica"] },
    { id: "sem-protecao-dehiscence-2", alvo: "aplicacao", aplicavelAIds: ["sem_protecao"], classificacao: "inadequado", motivo: "Deiscência sem cobertura expõe o leito a contaminação e ressecamento.", idsTemas: ["decisao-clinica"] },
    { id: "penso-impermeavel-dehiscence-2", alvo: "aplicacao", aplicavelAIds: ["penso_impermeavel"], classificacao: "inadequado", motivo: "Penso oclusivo retém o exsudado e aumenta risco de maceração perilesional nesta deiscência.", idsTemas: ["gestao-exsudado"] },
    { id: "penso-rapido-dehiscence-2", alvo: "aplicacao", aplicavelAIds: ["penso_rapido"], classificacao: "inadequado", motivo: "Penso rápido é aderente e não indicado em ferida cirúrgica profunda com exsudado — causa trauma na remoção.", idsTemas: ["decisao-clinica"] },
    { id: "terapia-compressiva-dehiscence-2", alvo: "aplicacao", aplicavelAIds: ["terapia_compressiva"], classificacao: "inadequado", motivo: "Terapia compressiva não tem indicação numa deiscência cirúrgica abdominal — a etiologia é cirúrgica, não venosa.", idsTemas: ["decisao-clinica"] },
    ],
    zonasTecido: [
  {
    "tipoTecido": "fibrina",
    "poligono": [
      {
        "x": 0.168125,
        "y": 0.37578146235390053
      },
      {
        "x": 0.146875,
        "y": 0.3862190812720848
      },
      {
        "x": 0.141875,
        "y": 0.40361511280239193
      },
      {
        "x": 0.161875,
        "y": 0.4001359064963305
      },
      {
        "x": 0.193125,
        "y": 0.3949170970372384
      },
      {
        "x": 0.224375,
        "y": 0.4001359064963305
      },
      {
        "x": 0.259375,
        "y": 0.4175319380266377
      },
      {
        "x": 0.259375,
        "y": 0.3949170970372384
      },
      {
        "x": 0.255625,
        "y": 0.3670834465887469
      },
      {
        "x": 0.253125,
        "y": 0.33577058983419406
      },
      {
        "x": 0.258125,
        "y": 0.31837455830388695
      },
      {
        "x": 0.240625,
        "y": 0.2835824952432726
      },
      {
        "x": 0.223125,
        "y": 0.2574884479478119
      },
      {
        "x": 0.210625,
        "y": 0.22965479749932047
      },
      {
        "x": 0.195625,
        "y": 0.2331340038053819
      },
      {
        "x": 0.200625,
        "y": 0.25053003533568907
      },
      {
        "x": 0.214375,
        "y": 0.26096765425387336
      },
      {
        "x": 0.220625,
        "y": 0.2905409078553955
      },
      {
        "x": 0.214375,
        "y": 0.3009785267735798
      },
      {
        "x": 0.191875,
        "y": 0.29923892362054905
      },
      {
        "x": 0.174375,
        "y": 0.29575971731448764
      },
      {
        "x": 0.163125,
        "y": 0.2905409078553955
      },
      {
        "x": 0.160625,
        "y": 0.3148953519978255
      },
      {
        "x": 0.171875,
        "y": 0.33577058983419406
      },
      {
        "x": 0.195625,
        "y": 0.34446860559934767
      },
      {
        "x": 0.210625,
        "y": 0.3514270182114705
      },
      {
        "x": 0.201875,
        "y": 0.3618646371296548
      },
      {
        "x": 0.171875,
        "y": 0.3705626528948084
      }
    ]
  },
  {
    "tipoTecido": "fibrina",
    "poligono": [
      {
        "x": 0.289375,
        "y": 0.4244903506387605
      },
      {
        "x": 0.278125,
        "y": 0.37578146235390053
      },
      {
        "x": 0.275625,
        "y": 0.3305517803751019
      },
      {
        "x": 0.294375,
        "y": 0.32881217722207123
      },
      {
        "x": 0.320625,
        "y": 0.3409893992932862
      },
      {
        "x": 0.341875,
        "y": 0.33577058983419406
      },
      {
        "x": 0.354375,
        "y": 0.3409893992932862
      },
      {
        "x": 0.366875,
        "y": 0.3601250339766241
      },
      {
        "x": 0.381875,
        "y": 0.3775210655069312
      },
      {
        "x": 0.410625,
        "y": 0.3775210655069312
      },
      {
        "x": 0.425625,
        "y": 0.3810002718129927
      },
      {
        "x": 0.424375,
        "y": 0.39143789073117696
      },
      {
        "x": 0.381875,
        "y": 0.40535471595542266
      },
      {
        "x": 0.338125,
        "y": 0.4175319380266377
      },
      {
        "x": 0.301875,
        "y": 0.42796955694482197
      },
      {
        "x": 0.290625,
        "y": 0.4244903506387605
      }
    ]
  },
  {
    "tipoTecido": "fibrina",
    "poligono": [
      {
        "x": 0.298125,
        "y": 0.2835824952432726
      },
      {
        "x": 0.295625,
        "y": 0.22791519434628976
      },
      {
        "x": 0.278125,
        "y": 0.2331340038053819
      },
      {
        "x": 0.264375,
        "y": 0.23661321011144332
      },
      {
        "x": 0.236875,
        "y": 0.2331340038053819
      },
      {
        "x": 0.229375,
        "y": 0.23139440065235117
      },
      {
        "x": 0.233125,
        "y": 0.2470508290296276
      },
      {
        "x": 0.238125,
        "y": 0.2592280511008426
      },
      {
        "x": 0.258125,
        "y": 0.2679260668659962
      },
      {
        "x": 0.281875,
        "y": 0.2835824952432726
      },
      {
        "x": 0.299375,
        "y": 0.2835824952432726
      }
    ]
  },
  {
    "tipoTecido": "fibrina",
    "poligono": [
      {
        "x": 0.576875,
        "y": 0.3879586844251155
      },
      {
        "x": 0.610625,
        "y": 0.4140527317205762
      },
      {
        "x": 0.639375,
        "y": 0.4140527317205762
      },
      {
        "x": 0.658125,
        "y": 0.41231312856754554
      },
      {
        "x": 0.645625,
        "y": 0.39317749388420764
      },
      {
        "x": 0.631875,
        "y": 0.37926066865996194
      },
      {
        "x": 0.603125,
        "y": 0.3879586844251155
      },
      {
        "x": 0.580625,
        "y": 0.3879586844251155
      }
    ]
  },
  {
    "tipoTecido": "granulacao",
    "poligono": [
      {
        "x": 0.138125,
        "y": 0.4244903506387605
      },
      {
        "x": 0.200625,
        "y": 0.476678445229682
      },
      {
        "x": 0.266875,
        "y": 0.49929328621908126
      },
      {
        "x": 0.291875,
        "y": 0.5079913019842348
      },
      {
        "x": 0.263125,
        "y": 0.4210111443326991
      },
      {
        "x": 0.231875,
        "y": 0.4088339222614841
      },
      {
        "x": 0.203125,
        "y": 0.40535471595542266
      },
      {
        "x": 0.185625,
        "y": 0.40535471595542266
      },
      {
        "x": 0.171875,
        "y": 0.40535471595542266
      },
      {
        "x": 0.151875,
        "y": 0.4105735254145148
      },
      {
        "x": 0.138125,
        "y": 0.4088339222614841
      },
      {
        "x": 0.145625,
        "y": 0.38273987496602335
      },
      {
        "x": 0.166875,
        "y": 0.3740418592008698
      },
      {
        "x": 0.206875,
        "y": 0.35490622451753195
      },
      {
        "x": 0.159375,
        "y": 0.3305517803751019
      },
      {
        "x": 0.160625,
        "y": 0.3027181299266105
      },
      {
        "x": 0.164375,
        "y": 0.2870617015493341
      },
      {
        "x": 0.186875,
        "y": 0.2940201141614569
      },
      {
        "x": 0.211875,
        "y": 0.29923892362054905
      },
      {
        "x": 0.219375,
        "y": 0.2922805110084262
      },
      {
        "x": 0.213125,
        "y": 0.26444686055993477
      },
      {
        "x": 0.196875,
        "y": 0.2557488447947812
      },
      {
        "x": 0.195625,
        "y": 0.24183201957053546
      },
      {
        "x": 0.175625,
        "y": 0.25053003533568907
      },
      {
        "x": 0.150625,
        "y": 0.2679260668659962
      },
      {
        "x": 0.133125,
        "y": 0.2870617015493341
      },
      {
        "x": 0.114375,
        "y": 0.30967654253873333
      },
      {
        "x": 0.105625,
        "y": 0.34272900244631693
      },
      {
        "x": 0.110625,
        "y": 0.37578146235390053
      },
      {
        "x": 0.121875,
        "y": 0.4001359064963305
      },
      {
        "x": 0.131875,
        "y": 0.4175319380266377
      },
      {
        "x": 0.136875,
        "y": 0.4227507474857298
      }
    ]
  },
  {
    "tipoTecido": "granulacao",
    "poligono": [
      {
        "x": 0.225625,
        "y": 0.2331340038053819
      },
      {
        "x": 0.215625,
        "y": 0.23139440065235117
      },
      {
        "x": 0.231875,
        "y": 0.26444686055993477
      },
      {
        "x": 0.256875,
        "y": 0.30793693938570266
      },
      {
        "x": 0.260625,
        "y": 0.27488447947811906
      },
      {
        "x": 0.240625,
        "y": 0.26444686055993477
      },
      {
        "x": 0.228125,
        "y": 0.2348736069584126
      }
    ]
  },
  {
    "tipoTecido": "granulacao",
    "poligono": [
      {
        "x": 0.273125,
        "y": 0.2801032889372112
      },
      {
        "x": 0.288125,
        "y": 0.2905409078553955
      },
      {
        "x": 0.301875,
        "y": 0.2870617015493341
      },
      {
        "x": 0.300625,
        "y": 0.2348736069584126
      },
      {
        "x": 0.331875,
        "y": 0.2331340038053819
      },
      {
        "x": 0.349375,
        "y": 0.23835281326447405
      },
      {
        "x": 0.373125,
        "y": 0.24183201957053546
      },
      {
        "x": 0.406875,
        "y": 0.2470508290296276
      },
      {
        "x": 0.435625,
        "y": 0.25053003533568907
      },
      {
        "x": 0.444375,
        "y": 0.25053003533568907
      },
      {
        "x": 0.463125,
        "y": 0.34272900244631693
      },
      {
        "x": 0.474375,
        "y": 0.4140527317205762
      },
      {
        "x": 0.473125,
        "y": 0.464501223158467
      },
      {
        "x": 0.473125,
        "y": 0.49581407991301985
      },
      {
        "x": 0.451875,
        "y": 0.501032889372112
      },
      {
        "x": 0.399375,
        "y": 0.5062516988312041
      },
      {
        "x": 0.353125,
        "y": 0.513210111443327
      },
      {
        "x": 0.324375,
        "y": 0.513210111443327
      },
      {
        "x": 0.304375,
        "y": 0.5097309051372656
      },
      {
        "x": 0.293125,
        "y": 0.464501223158467
      },
      {
        "x": 0.285625,
        "y": 0.4314487632508834
      },
      {
        "x": 0.325625,
        "y": 0.42622995379179124
      },
      {
        "x": 0.365625,
        "y": 0.4175319380266377
      },
      {
        "x": 0.401875,
        "y": 0.4070943191084534
      },
      {
        "x": 0.430625,
        "y": 0.4001359064963305
      },
      {
        "x": 0.431875,
        "y": 0.3775210655069312
      },
      {
        "x": 0.399375,
        "y": 0.3740418592008698
      },
      {
        "x": 0.379375,
        "y": 0.36534384343571624
      },
      {
        "x": 0.365625,
        "y": 0.34272900244631693
      },
      {
        "x": 0.353125,
        "y": 0.3305517803751019
      },
      {
        "x": 0.318125,
        "y": 0.33577058983419406
      },
      {
        "x": 0.295625,
        "y": 0.3235933677629791
      },
      {
        "x": 0.276875,
        "y": 0.32881217722207123
      },
      {
        "x": 0.275625,
        "y": 0.3061973362326719
      },
      {
        "x": 0.274375,
        "y": 0.28532209839630335
      }
    ]
  },
  {
    "tipoTecido": "fibrina",
    "poligono": [
      {
        "x": 0.558125,
        "y": 0.46276162000543625
      },
      {
        "x": 0.536875,
        "y": 0.46102201685240557
      },
      {
        "x": 0.530625,
        "y": 0.4314487632508834
      },
      {
        "x": 0.525625,
        "y": 0.3949170970372384
      },
      {
        "x": 0.509375,
        "y": 0.39143789073117696
      },
      {
        "x": 0.495625,
        "y": 0.39143789073117696
      },
      {
        "x": 0.493125,
        "y": 0.37578146235390053
      },
      {
        "x": 0.523125,
        "y": 0.37578146235390053
      },
      {
        "x": 0.549375,
        "y": 0.37230225604783906
      },
      {
        "x": 0.576875,
        "y": 0.3705626528948084
      },
      {
        "x": 0.598125,
        "y": 0.35664582767056263
      },
      {
        "x": 0.605625,
        "y": 0.35490622451753195
      },
      {
        "x": 0.594375,
        "y": 0.3705626528948084
      },
      {
        "x": 0.569375,
        "y": 0.3775210655069312
      },
      {
        "x": 0.546875,
        "y": 0.38273987496602335
      },
      {
        "x": 0.531875,
        "y": 0.3844794781190541
      },
      {
        "x": 0.536875,
        "y": 0.4105735254145148
      },
      {
        "x": 0.548125,
        "y": 0.4366675727099755
      },
      {
        "x": 0.554375,
        "y": 0.4505843979342213
      },
      {
        "x": 0.559375,
        "y": 0.46102201685240557
      }
    ]
  },
  {
    "tipoTecido": "granulacao",
    "poligono": [
      {
        "x": 0.488125,
        "y": 0.3740418592008698
      },
      {
        "x": 0.569375,
        "y": 0.36882304974177765
      },
      {
        "x": 0.599375,
        "y": 0.3531666213645012
      },
      {
        "x": 0.628125,
        "y": 0.35838543082359337
      },
      {
        "x": 0.678125,
        "y": 0.3775210655069312
      },
      {
        "x": 0.705625,
        "y": 0.3862190812720848
      },
      {
        "x": 0.689375,
        "y": 0.31837455830388695
      },
      {
        "x": 0.651875,
        "y": 0.29749932046751837
      },
      {
        "x": 0.611875,
        "y": 0.28532209839630335
      },
      {
        "x": 0.578125,
        "y": 0.27836368578418047
      },
      {
        "x": 0.544375,
        "y": 0.27488447947811906
      },
      {
        "x": 0.509375,
        "y": 0.26444686055993477
      },
      {
        "x": 0.489375,
        "y": 0.26096765425387336
      },
      {
        "x": 0.466875,
        "y": 0.27140527317205765
      },
      {
        "x": 0.476875,
        "y": 0.32185376460994836
      },
      {
        "x": 0.488125,
        "y": 0.3740418592008698
      }
    ]
  },
  {
    "tipoTecido": "granulacao",
    "poligono": [
      {
        "x": 0.491875,
        "y": 0.49929328621908126
      },
      {
        "x": 0.543125,
        "y": 0.49929328621908126
      },
      {
        "x": 0.530625,
        "y": 0.4801576515357434
      },
      {
        "x": 0.538125,
        "y": 0.47145963577058986
      },
      {
        "x": 0.550625,
        "y": 0.476678445229682
      },
      {
        "x": 0.570625,
        "y": 0.4836368578418048
      },
      {
        "x": 0.590625,
        "y": 0.48537646099483556
      },
      {
        "x": 0.600625,
        "y": 0.4905952704539277
      },
      {
        "x": 0.628125,
        "y": 0.4784180483827127
      },
      {
        "x": 0.656875,
        "y": 0.464501223158467
      },
      {
        "x": 0.689375,
        "y": 0.44884479478119055
      },
      {
        "x": 0.708125,
        "y": 0.4297091600978527
      },
      {
        "x": 0.710625,
        "y": 0.4175319380266377
      },
      {
        "x": 0.703125,
        "y": 0.39143789073117696
      },
      {
        "x": 0.681875,
        "y": 0.3810002718129927
      },
      {
        "x": 0.660625,
        "y": 0.37578146235390053
      },
      {
        "x": 0.646875,
        "y": 0.36882304974177765
      },
      {
        "x": 0.631875,
        "y": 0.3775210655069312
      },
      {
        "x": 0.659375,
        "y": 0.4070943191084534
      },
      {
        "x": 0.659375,
        "y": 0.41927154117966836
      },
      {
        "x": 0.644375,
        "y": 0.4227507474857298
      },
      {
        "x": 0.623125,
        "y": 0.4210111443326991
      },
      {
        "x": 0.615625,
        "y": 0.4175319380266377
      },
      {
        "x": 0.605625,
        "y": 0.4140527317205762
      },
      {
        "x": 0.594375,
        "y": 0.4070943191084534
      },
      {
        "x": 0.581875,
        "y": 0.3983963033432998
      },
      {
        "x": 0.575625,
        "y": 0.38969828757814623
      },
      {
        "x": 0.563125,
        "y": 0.3844794781190541
      },
      {
        "x": 0.549375,
        "y": 0.39143789073117696
      },
      {
        "x": 0.556875,
        "y": 0.40535471595542266
      },
      {
        "x": 0.553125,
        "y": 0.4244903506387605
      },
      {
        "x": 0.553125,
        "y": 0.43492796955694485
      },
      {
        "x": 0.565625,
        "y": 0.4436259853220984
      },
      {
        "x": 0.564375,
        "y": 0.4662408263114977
      },
      {
        "x": 0.551875,
        "y": 0.4662408263114977
      },
      {
        "x": 0.531875,
        "y": 0.46276162000543625
      },
      {
        "x": 0.526875,
        "y": 0.4331883664039141
      },
      {
        "x": 0.521875,
        "y": 0.40187550964936125
      },
      {
        "x": 0.521875,
        "y": 0.3966567001902691
      },
      {
        "x": 0.498125,
        "y": 0.3966567001902691
      },
      {
        "x": 0.489375,
        "y": 0.37578146235390053
      },
      {
        "x": 0.489375,
        "y": 0.4001359064963305
      },
      {
        "x": 0.493125,
        "y": 0.4314487632508834
      },
      {
        "x": 0.491875,
        "y": 0.46276162000543625
      },
      {
        "x": 0.494375,
        "y": 0.4784180483827127
      },
      {
        "x": 0.491875,
        "y": 0.49581407991301985
      }
    ]
  },
  {
    "tipoTecido": "granulacao",
    "poligono": [
      {
        "x": 0.569375,
        "y": 0.3810002718129927
      },
      {
        "x": 0.599375,
        "y": 0.37230225604783906
      },
      {
        "x": 0.608125,
        "y": 0.35664582767056263
      },
      {
        "x": 0.639375,
        "y": 0.36534384343571624
      },
      {
        "x": 0.631875,
        "y": 0.37578146235390053
      },
      {
        "x": 0.599375,
        "y": 0.3844794781190541
      },
      {
        "x": 0.569375,
        "y": 0.3862190812720848
      }
    ]
  },
  {
    "tipoTecido": "fibrina",
    "poligono": [
      {
        "x": 0.549375,
        "y": 0.4331883664039141
      },
      {
        "x": 0.553125,
        "y": 0.41231312856754554
      },
      {
        "x": 0.546875,
        "y": 0.3879586844251155
      },
      {
        "x": 0.536875,
        "y": 0.38969828757814623
      }
    ]
  },
  {
    "tipoTecido": "fibrina",
    "poligono": [
      {
        "x": 0.555625,
        "y": 0.5045120956781735
      },
      {
        "x": 0.591875,
        "y": 0.49581407991301985
      },
      {
        "x": 0.539375,
        "y": 0.476678445229682
      },
      {
        "x": 0.536875,
        "y": 0.48189725468877415
      },
      {
        "x": 0.551875,
        "y": 0.5027724925251427
      }
    ]
  },
  {
    "tipoTecido": "granulacao",
    "poligono": [
      {
        "x": 0.710625,
        "y": 0.32533297091600977
      },
      {
        "x": 0.726875,
        "y": 0.4105735254145148
      },
      {
        "x": 0.768125,
        "y": 0.3636042402826855
      },
      {
        "x": 0.711875,
        "y": 0.32881217722207123
      }
    ]
  }
    ],
    idsTemas: ["gestao-exsudado", "tecidos-e-leito", "fixacao-e-remocao", "desbridamento", "decisao-clinica"],
    planoRecomendado: {
    minimo: ["Limpeza com soro fisiológico ou antisséptico", "Desbridamento enzimático da fibrina (colagenase)", "Cobertura não aderente sobre o leito", "Cobertura absorvente proporcional ao exsudado", "Penso simples protetor"],
    otimizado: ["Limpeza com soro fisiológico ou antisséptico", "Desbridamento enzimático da fibrina (colagenase)", "Cobertura não aderente sobre o leito (Urgotul)", "Cobertura absorvente proporcional ao exsudado", "Cobertura secundária absorvente (Allevyn não adesivo)", "Penso simples protetor", "Vigilância diária de sinais de infeção"],
    },
  },

  // ─── Caso 3 ──────────────────────────────────────────────────────────────────
  {
    id: "3",
    slug: "3",
    tituloAbreviado: "Caso 3",
    titulo: "Úlcera diabética",
    descricao: "Caso avançado com esfacelo interdigital, hiperqueratose e perfusão comprometida.",
    competencias: "Controlo de bioburden, desbridamento cauteloso, proteção perilesional em pé diabético",
    dificuldade: "avancado",
    ordem: 3,
    minutosEstimados: 12,
    status: "disponivel",
    srcImagem: "/caso3.jpg",
    altImagem: "Úlcera interdigital no pé diabético com hiperqueratose periférica — © Medetec Medical Images (medetec.co.uk)",
    resumoIntro: "Utente com diabetes mellitus tipo 2 e úlcera interdigital no pé com hiperqueratose extensa.",
    objetivo: "Combinar desbridamento cauteloso com controlo de bioburden e proteção da pele perilesional num pé diabético com perfusão comprometida.",
    definicoesObservacao: observationDefinitions,
    promptsDialogo: dialoguePrompts,
    definicoesAplicacao: applicationDefinitions,
    objetivosVisuais: {
    tecidos: ["fibrina"],
    exsudado: ["seroso"],
    bordos: ["hiperqueratose"],
    },
    tituloCenario: "Úlcera interdigital do pé diabético",
    contextoPaciente: "Utente com diabetes mellitus tipo 2 mal controlada e úlcera no espaço interdigital do pé, com hiperqueratose extensa, esfacelo no leito e maceração adjacente. Perfusão periférica comprometida.",
    bannerPaciente: "Úlcera interdigital no pé diabético com hiperqueratose periférica — © Medetec Medical Images (medetec.co.uk)",
    estadoFerida: { exsudado: "escasso", infeccao: "infecao-local-encoberta", tecido: "fibrina", perilesional: "macerada", odor: "ausente" },
    variavelFerida: { exsudado: 2, infeccao: 1, tecido: 2, odor: 0, humidade: 2, profundidade: 2, bordos: 3, pele_perilesional: 1, dor: 1, hemorragia: 0, etiologia: 4, perfusao: 0 },
    detalhesObservacao: {
    imagem: { detalhe: "Úlcera interdigital pequena, pele espessada e esbranquiçada no perímetro." },
    dimensoes: { detalhe: "≈1,5 × 1 cm." },
    exsudado: { detalhe: "Baixo a moderado, transparente." },
    cheiro: { detalhe: "Sem odor." },
    tecidos: { detalhe: "Zona amarelada no fundo da lesão." },
    bordos: { detalhe: "Bordos com pele espessa e esbranquiçada em redor." },
    pele_perilesional: { detalhe: "Pele espessada e descamativa; zona esbranquiçada entre os dedos." },
    },
    respostasDialogo: {
    dor: "Sinto pouca coisa no pé — quase não tenho sensibilidade. Talvez um 1 em 10.",
    duracao: "A ferida começou há algumas semanas sem que eu desse conta, foi a minha filha que viu.",
    posicao: "Continuo a andar normal, não tenho descarregado o pé.",
    pensos: "Tenho feito penso em casa com o que tinha.",
    febre: "Não tive febre, mas sinto-me um pouco cansado.",
    mobilidade: "Ando normalmente, mas sem calçado adequado.",
    },
    tratamentosDisponiveis: ["cloreto-sodio", "octenilin-solucao", "betadine-solucao", "octiset", "hidrogel", "colagenase", "aquacel", "varihesive-extra-fino", "inadine", "aquacel-ag", "urgotul-ag", "atl", "creme-hidratante", "vliwasorb", "alginato-calcio", "betametasona", "oxido-zinco", "alcool-etilico"],
    opcoesAplicacao: ["penso_rapido", "penso_simples", "penso_impermeavel", "ligadura", "terapia_compressiva", "direto_seco", "sem_protecao"],
    objetivosClinicosAlvo: [
    goal("cleanse", "Fazer limpeza antes da cobertura", "limpar-ferida", "essencial", "A limpeza remove detritos e prepara o leito antes do desbridamento.", { idsTratamento: ["cloreto-sodio", "octenilin-solucao"] }, ["decisao-clinica"]),
    goal("antisepsis", "Associar antissépsia local", "controlar-bioburden", "essencial", "A antissépsia é essencial em pé diabético mesmo sem sinais evidentes — a colonização crítica exige controlo.", { idsTratamento: ["betadine-solucao", "octiset"] }, ["antimicrobianos", "decisao-clinica"]),
    goal("desbridamento", "Desbridar o esfacelo com cautela", "desbridamento", "essencial", "O esfacelo no leito bloqueia a cicatrização; hidrogel ou colagenase são opções cautelosas.", { idsTratamento: ["hidrogel", "colagenase"] }, ["desbridamento", "tecidos-e-leito"]),
    goal("exudate", "Cobertura absorvente proporcional ao baixo exsudado", "controlar-exsudado", "essencial", "O baixo exsudado exige cobertura de baixa absorção que mantenha o equilíbrio de humidade.", { idsTratamento: ["aquacel", "varihesive-extra-fino"] }, ["gestao-exsudado"]),
    goal("app-cover", "Aplicar penso simples protetor", "cobertura-atraumatica", "essencial", "Penso simples protege sem aderir ao leito nem traumatizar a pele frágil do pé diabético.", { idsAplicacao: ["penso_simples"] }, ["decisao-clinica"]),
    goal("bioburden-cautela", "Antisséptico mantido em pé diabético", "controlar-bioburden", "adequado", "O Inadine mantém antissépsia local de forma contínua em feridas de pé diabético com colonização.", { idsTratamento: ["inadine"] }, ["antimicrobianos"]),
    goal("prata-cautela", "Cobertura com prata como cautela", "controlar-bioburden", "adequado", "Com suspeita de colonização crítica, a prata como cobertura acrescenta controlo de bioburden.", { idsTratamento: ["aquacel-ag", "urgotul-ag"] }, ["antimicrobianos"]),
    goal("periwound", "Tratar a hiperqueratose perilesional", "proteger-perilesional", "adequado", "A hiperqueratose extensa exige hidratação ou proteção para evitar agravamento das bordas.", { idsTratamento: ["atl", "creme-hidratante"] }, ["protecao-perilesional"]),
    ],
    regrasAvaliacao: [
    { id: "vliwasorb-diabetico-3", alvo: "tratamento", aplicavelAIds: ["vliwasorb"], classificacao: "redundante", motivo: "Vliwasorb tem alta capacidade absortiva — sobreabsorção numa ferida pequena com baixo exsudado pode ressecar o leito.", idsTemas: ["gestao-exsudado"] },
    { id: "alginato-diabetico-3", alvo: "tratamento", aplicavelAIds: ["alginato-calcio"], classificacao: "redundante", motivo: "O alginato de cálcio tem capacidade absortiva elevada, desproporcionada para o baixo exsudado desta ferida interdigital.", idsTemas: ["gestao-exsudado"] },
    { id: "oxido-zinco-diabetico-3", alvo: "tratamento", aplicavelAIds: ["oxido-zinco"], classificacao: "inadequado", motivo: "O óxido de zinco é oclusivo e dificulta a observação e drenagem numa ferida interdigital — contraindicado neste contexto.", idsTemas: ["protecao-perilesional"] },
    { id: "betametasona-diabetico-3", alvo: "tratamento", aplicavelAIds: ["betametasona"], classificacao: "inadequado", motivo: "A betametasona está contraindicada no pé diabético com colonização crítica — pode mascarar sinais de agravamento.", idsTemas: ["decisao-clinica"] },
    { id: "alcool-diabetico-3", alvo: "tratamento", aplicavelAIds: ["alcool-etilico"], classificacao: "inadequado", motivo: "O álcool é citotóxico e agrava a isquemia local — contraindicado em pé diabético com perfusão comprometida.", idsTemas: ["antimicrobianos"] },
    { id: "direto-seco-diabetico-3", alvo: "aplicacao", aplicavelAIds: ["direto_seco"], classificacao: "inadequado", motivo: "Aplicar material em seco traumatiza a ferida na remoção — especialmente perigoso em pele diabética frágil.", idsTemas: ["decisao-clinica"] },
    { id: "sem-protecao-diabetico-3", alvo: "aplicacao", aplicavelAIds: ["sem_protecao"], classificacao: "inadequado", motivo: "Pé diabético sem cobertura fica exposto a contaminação e trauma — clinicamente inseguro.", idsTemas: ["decisao-clinica"] },
    { id: "penso-rapido-diabetico-3", alvo: "aplicacao", aplicavelAIds: ["penso_rapido"], classificacao: "inadequado", motivo: "Penso rápido é aderente — causa trauma na remoção numa pele diabética frágil e isquémica.", idsTemas: ["decisao-clinica"] },
    { id: "penso-impermeavel-diabetico-3", alvo: "aplicacao", aplicavelAIds: ["penso_impermeavel"], classificacao: "inadequado", motivo: "Penso impermeável não é adequado em pé diabético com colonização crítica — oclusão excessiva favorece crescimento bacteriano.", idsTemas: ["decisao-clinica"] },
    { id: "terapia-compressiva-diabetico-3", alvo: "aplicacao", aplicavelAIds: ["terapia_compressiva"], classificacao: "inadequado", motivo: "Terapia compressiva está contraindicada no pé diabético com perfusão comprometida — risco de isquemia distal agravada.", idsTemas: ["decisao-clinica"] },
    { id: "ligadura-diabetico-3", alvo: "aplicacao", aplicavelAIds: ["ligadura"], classificacao: "inadequado", motivo: "Ligadura está contraindicada no pé diabético com perfusão comprometida — pode reduzir o fluxo arterial residual.", idsTemas: ["decisao-clinica"] },
    ],
    zonasTecido: [
  {
    "tipoTecido": "fibrina",
    "poligono": [
      {
        "x": 0.545625,
        "y": 0.44826701557248777
      },
      {
        "x": 0.519375,
        "y": 0.5073757664383386
      },
      {
        "x": 0.505625,
        "y": 0.5599168783190949
      },
      {
        "x": 0.514375,
        "y": 0.6009646219759358
      },
      {
        "x": 0.524375,
        "y": 0.6452961851253239
      },
      {
        "x": 0.541875,
        "y": 0.6797762897970702
      },
      {
        "x": 0.565625,
        "y": 0.6879858385284384
      },
      {
        "x": 0.581875,
        "y": 0.6535057338566921
      },
      {
        "x": 0.600625,
        "y": 0.6255932681700402
      },
      {
        "x": 0.634375,
        "y": 0.5911131634982939
      },
      {
        "x": 0.655625,
        "y": 0.5714102465430103
      },
      {
        "x": 0.656875,
        "y": 0.5303625028861695
      },
      {
        "x": 0.663125,
        "y": 0.49588239821442315
      },
      {
        "x": 0.656875,
        "y": 0.46796993252777136
      },
      {
        "x": 0.620625,
        "y": 0.45319274481130867
      },
      {
        "x": 0.594375,
        "y": 0.4384155570948459
      },
      {
        "x": 0.573125,
        "y": 0.4318479181097514
      },
      {
        "x": 0.549375,
        "y": 0.451550835065035
      }
    ]
  }
    ],
    idsTemas: ["antimicrobianos", "desbridamento", "gestao-exsudado", "protecao-perilesional", "decisao-clinica"],
    planoRecomendado: {
    minimo: ["Limpeza com soro fisiológico ou antisséptico", "Desbridamento cauteloso do esfacelo", "Cobertura de baixa absorção proporcional ao exsudado", "Penso simples protetor"],
    otimizado: ["Limpeza com soro fisiológico ou antisséptico", "Desbridamento cauteloso do esfacelo (hidrogel ou colagenase)", "Cobertura de baixa absorção proporcional ao exsudado", "Antisséptico de manutenção (Inadine) em colonização crítica", "Tratamento da hiperqueratose perilesional (ATL ou creme hidratante)", "Penso simples protetor", "Descarga do pé — avaliação do calçado e ortóteses"],
    },
  },

  // ─── Caso 4 ──────────────────────────────────────────────────────────────────
  {
    id: "4",
    slug: "4",
    tituloAbreviado: "Caso 4",
    titulo: "Úlcera venosa",
    descricao: "Leitura do leito, compressão e proteção da dermatite de estase.",
    competencias: "Gestão de exsudado, terapia compressiva e proteção perilesional em dermatite de estase",
    dificuldade: "intermedio",
    ordem: 4,
    minutosEstimados: 9,
    status: "disponivel",
    srcImagem: "/caso4.jpg",
    altImagem: "Úlcera venosa no maléolo com dermatite de estase perilesional — © Medetec Medical Images (medetec.co.uk)",
    resumoIntro: "Utente de 65 anos com úlcera venosa no terço distal da perna e dermatite de estase clássica.",
    objetivo: "Selecionar cobertura absorvente, aplicar compressão após ABPI e proteger a dermatite de estase perilesional.",
    definicoesObservacao: observationDefinitions,
    promptsDialogo: dialoguePrompts,
    definicoesAplicacao: applicationDefinitions,
    objetivosVisuais: {
    tecidos: ["granulacao", "fibrina"],
    exsudado: ["seroso"],
    bordos: ["pele-seca"],
    },
    tituloCenario: "Úlcera venosa típica",
    contextoPaciente: "Utente de 65 anos, com insuficiência venosa crónica e úlcera no maléolo/terço distal com leito de granulação e dermatite de estase clássica perilesional.",
    bannerPaciente: "Úlcera venosa no maléolo com dermatite de estase perilesional — © Medetec Medical Images (medetec.co.uk)",
    estadoFerida: { exsudado: "moderado", infeccao: "contaminacao", tecido: "granulacao-fibrina", perilesional: "fragil", odor: "ausente" },
    variavelFerida: { exsudado: 3, infeccao: 0, tecido: 3, odor: 0, humidade: 3, profundidade: 2, bordos: 2, pele_perilesional: 2, dor: 2, hemorragia: 0, etiologia: 2, perfusao: 1 },
    detalhesObservacao: {
    imagem: { detalhe: "Úlcera no tornozelo/terço distal da perna com leito avermelhado e pele perilesional muito alterada." },
    dimensoes: { detalhe: "≈6 × 4 cm." },
    exsudado: { detalhe: "Moderado, transparente e amarelado." },
    cheiro: { detalhe: "Sem odor." },
    tecidos: { detalhe: "Leito maioritariamente avermelhado; zonas amareladas junto às margens." },
    bordos: { detalhe: "Bordos irregulares." },
    pele_perilesional: { detalhe: "Pele escurecida e descamativa em redor." },
    },
    respostasDialogo: {
    dor: "Arde sobretudo à noite e ao fim do dia — uns 5 em 10.",
    duracao: "Tenho esta ferida há dois meses. Já tive uma parecida há alguns anos.",
    posicao: "Passo o dia sentado no trabalho, pouco de pé.",
    pensos: "Tenho feito penso em casa com compressas.",
    febre: "Não tive febre.",
    mobilidade: "Consigo andar, embora o tornozelo esteja inchado.",
    },
    tratamentosDisponiveis: ["cloreto-sodio", "octenilin-solucao", "betadine-solucao", "octiset", "aquacel", "alginato-calcio", "exufiber", "allevyn", "urgo-start", "colagenase", "atl", "creme-hidratante", "oxido-zinco", "tintura-benjoim", "protetor-spray", "betametasona", "aquacel-ag", "hidrogel", "alcool-etilico"],
    opcoesAplicacao: ["penso_rapido", "penso_simples", "penso_impermeavel", "ligadura", "terapia_compressiva", "direto_seco", "sem_protecao"],
    objetivosClinicosAlvo: [
    goal("cleanse", "Fazer limpeza antes da cobertura", "limpar-ferida", "essencial", "A limpeza do leito precede qualquer cobertura.", { idsTratamento: ["cloreto-sodio", "octenilin-solucao"] }, ["decisao-clinica"]),
    goal("antisepsis", "Associar antissépsia local", "controlar-bioburden", "essencial", "A antissépsia local prepara o leito antes da cobertura.", { idsTratamento: ["betadine-solucao", "octiset"] }, ["antimicrobianos", "decisao-clinica"]),
    goal("absorb", "Cobertura absorvente proporcional ao exsudado", "controlar-exsudado", "essencial", "O exsudado moderado exige cobertura absorvente que mantenha o equilíbrio de humidade.", { idsTratamento: ["aquacel", "alginato-calcio", "exufiber", "allevyn"] }, ["gestao-exsudado"]),
    goal("granulation-cover", "Cobertura de suporte à granulação", "cobertura-atraumatica", "essencial", "Urgo-Start promove a granulação ativa e a preparação do leito na úlcera venosa.", { idsTratamento: ["urgo-start"] }, ["tecidos-e-leito"]),
    goal("periwound", "Proteger a dermatite de estase perilesional", "proteger-perilesional", "essencial", "A dermatite de estase exige proteção ativa da pele perilesional para evitar alargamento da lesão.", { idsTratamento: ["atl", "creme-hidratante", "oxido-zinco", "tintura-benjoim", "protetor-spray"] }, ["protecao-perilesional"]),
    goal("app-simples", "Aplicar penso simples protetor", "cobertura-atraumatica", "essencial", "Penso simples é a cobertura de base correta para úlcera venosa — protege sem comprimir.", { idsAplicacao: ["penso_simples"] }, ["decisao-clinica"]),
    goal("app-compressao", "Aplicar terapia compressiva após ABPI", "aliviar-pressao", "essencial", "A terapia compressiva é o pilar do tratamento da úlcera venosa — ABPI deve ser confirmado primeiro.", { idsAplicacao: ["terapia_compressiva"] }, ["decisao-clinica"]),
    // Betametasona: goal adequado em dermatite de estase — sem evaluationRule forçada, o motor usa este goal
    goal("betametasona-estase", "Tratar a dermatite de estase com corticoide tópico", "proteger-perilesional", "adequado", "A betametasona tópica é uma opção válida em dermatite de estase perilesional ativa.", { idsTratamento: ["betametasona"] }, ["protecao-perilesional", "decisao-clinica"]),
    goal("desbridamento", "Desbridar a fibrina peri-bordo", "desbridamento", "adequado", "A colagenase pode ajudar a remover a fibrina aderente e preparar os bordos para epitelização.", { idsTratamento: ["colagenase"] }, ["desbridamento"]),
    ],
    regrasAvaliacao: [
    { id: "aquacel-ag-venosa-4", alvo: "tratamento", aplicavelAIds: ["aquacel-ag"], classificacao: "inadequado", motivo: "Sem sinais de infeção, a cobertura com prata não é necessária e não responde ao problema dominante.", idsTemas: ["antimicrobianos"] },
    { id: "hidrogel-venosa-4", alvo: "tratamento", aplicavelAIds: ["hidrogel"], classificacao: "inadequado", motivo: "O hidrogel aumenta a humidade numa ferida com exsudado moderado — risco de maceração perilesional.", idsTemas: ["gestao-exsudado"] },
    { id: "alcool-venosa-4", alvo: "tratamento", aplicavelAIds: ["alcool-etilico"], classificacao: "inadequado", motivo: "O álcool é citotóxico — destrói a granulação e está contraindicado em qualquer ferida crónica.", idsTemas: ["antimicrobianos"] },
    { id: "direto-seco-venosa-4", alvo: "aplicacao", aplicavelAIds: ["direto_seco"], classificacao: "inadequado", motivo: "Aplicar material em seco adere à granulação e causa trauma na remoção.", idsTemas: ["decisao-clinica"] },
    { id: "sem-protecao-venosa-4", alvo: "aplicacao", aplicavelAIds: ["sem_protecao"], classificacao: "inadequado", motivo: "Úlcera venosa sem cobertura fica exposta a contaminação e agravamento da maceração.", idsTemas: ["decisao-clinica"] },
    { id: "penso-rapido-venosa-4", alvo: "aplicacao", aplicavelAIds: ["penso_rapido"], classificacao: "inadequado", motivo: "Penso rápido é aderente e não indicado em úlcera venosa com granulação — causa trauma na remoção.", idsTemas: ["decisao-clinica"] },
    { id: "penso-impermeavel-venosa-4", alvo: "aplicacao", aplicavelAIds: ["penso_impermeavel"], classificacao: "inadequado", motivo: "Penso impermeável é oclusivo e não compatível com terapia compressiva — dificulta a transpiração e aumenta risco de maceração.", idsTemas: ["gestao-exsudado"] },
    { id: "ligadura-venosa-4", alvo: "aplicacao", aplicavelAIds: ["ligadura"], classificacao: "redundante", motivo: "A ligadura pode complementar a proteção mas a terapia compressiva estruturada é a técnica de eleição na úlcera venosa.", idsTemas: ["decisao-clinica"] },
    ],
    zonasTecido: [
{
    "tipoTecido": "granulacao",
    "poligono": [
      {
        "x": 0.273125,
        "y": 0.4151101118413467
      },
      {
        "x": 0.298125,
        "y": 0.3689899688689035
      },
      {
        "x": 0.340625,
        "y": 0.35423152311772166
      },
      {
        "x": 0.358125,
        "y": 0.34685230024213076
      },
      {
        "x": 0.388125,
        "y": 0.3671451631500058
      },
      {
        "x": 0.394375,
        "y": 0.3689899688689035
      },
      {
        "x": 0.388125,
        "y": 0.3892828317767785
      },
      {
        "x": 0.403125,
        "y": 0.4040412775279603
      },
      {
        "x": 0.429375,
        "y": 0.41879972327914217
      },
      {
        "x": 0.448125,
        "y": 0.4298685575925285
      },
      {
        "x": 0.473125,
        "y": 0.4317133633114263
      },
      {
        "x": 0.480625,
        "y": 0.44462700334371036
      },
      {
        "x": 0.463125,
        "y": 0.46123025481378993
      },
      {
        "x": 0.446875,
        "y": 0.49074714631615357
      },
      {
        "x": 0.428125,
        "y": 0.5110400092240286
      },
      {
        "x": 0.391875,
        "y": 0.5313328721319036
      },
      {
        "x": 0.375625,
        "y": 0.5405569007263923
      },
      {
        "x": 0.366875,
        "y": 0.5774530151043469
      },
      {
        "x": 0.336875,
        "y": 0.5719185979476537
      },
      {
        "x": 0.310625,
        "y": 0.5442465121641877
      },
      {
        "x": 0.306875,
        "y": 0.5202640378185173
      },
      {
        "x": 0.288125,
        "y": 0.5018159806295399
      },
      {
        "x": 0.281875,
        "y": 0.4852127291594604
      },
      {
        "x": 0.278125,
        "y": 0.4464718090626081
      },
      {
        "x": 0.273125,
        "y": 0.41879972327914217
      }
    ]
  },
  {
    "tipoTecido": "fibrina",
    "poligono": [
      {
        "x": 0.264375,
        "y": 0.41695491756024444
      },
      {
        "x": 0.273125,
        "y": 0.433558169030324
      },
      {
        "x": 0.281875,
        "y": 0.4925919520350513
      },
      {
        "x": 0.304375,
        "y": 0.5221088435374149
      },
      {
        "x": 0.318125,
        "y": 0.5590049579153695
      },
      {
        "x": 0.350625,
        "y": 0.5792978208232445
      },
      {
        "x": 0.371875,
        "y": 0.5792978208232445
      },
      {
        "x": 0.379375,
        "y": 0.5442465121641877
      },
      {
        "x": 0.409375,
        "y": 0.5257984549752104
      },
      {
        "x": 0.444375,
        "y": 0.5110400092240286
      },
      {
        "x": 0.464375,
        "y": 0.4796783120027672
      },
      {
        "x": 0.480625,
        "y": 0.45200622621930125
      },
      {
        "x": 0.485625,
        "y": 0.44278219762481263
      },
      {
        "x": 0.475625,
        "y": 0.42617894615473306
      },
      {
        "x": 0.445625,
        "y": 0.4224893347169376
      },
      {
        "x": 0.409375,
        "y": 0.4040412775279603
      },
      {
        "x": 0.394375,
        "y": 0.3874380260578808
      },
      {
        "x": 0.398125,
        "y": 0.3579211345555171
      },
      {
        "x": 0.423125,
        "y": 0.3376282716476421
      },
      {
        "x": 0.460625,
        "y": 0.3486971059610285
      },
      {
        "x": 0.494375,
        "y": 0.3763691917444944
      },
      {
        "x": 0.519375,
        "y": 0.3819036089011876
      },
      {
        "x": 0.579375,
        "y": 0.37267958030669895
      },
      {
        "x": 0.629375,
        "y": 0.37083477458780123
      },
      {
        "x": 0.646875,
        "y": 0.4796783120027672
      },
      {
        "x": 0.610625,
        "y": 0.48890234059725585
      },
      {
        "x": 0.545625,
        "y": 0.4925919520350513
      },
      {
        "x": 0.535625,
        "y": 0.5202640378185173
      },
      {
        "x": 0.511875,
        "y": 0.5571601521964719
      },
      {
        "x": 0.491875,
        "y": 0.6088147123256082
      },
      {
        "x": 0.481875,
        "y": 0.6494004381413583
      },
      {
        "x": 0.438125,
        "y": 0.6586244667358468
      },
      {
        "x": 0.388125,
        "y": 0.6641588838925401
      },
      {
        "x": 0.318125,
        "y": 0.6309523809523809
      },
      {
        "x": 0.276875,
        "y": 0.5885218494177332
      },
      {
        "x": 0.260625,
        "y": 0.5202640378185173
      },
      {
        "x": 0.250625,
        "y": 0.474143894846074
      },
      {
        "x": 0.258125,
        "y": 0.4224893347169376
      },
      {
        "x": 0.263125,
        "y": 0.4151101118413467
      }
    ]
  }
    ],
    idsTemas: ["gestao-exsudado", "protecao-perilesional", "tecidos-e-leito", "decisao-clinica"],
    planoRecomendado: {
    minimo: ["Limpeza com soro fisiológico ou antisséptico", "Cobertura absorvente proporcional ao exsudado", "Proteção da dermatite de estase perilesional", "Penso simples protetor", "Terapia compressiva após confirmação do ABPI"],
    otimizado: ["Limpeza com soro fisiológico ou antisséptico", "Cobertura de suporte à granulação (Urgo-Start)", "Cobertura absorvente proporcional ao exsudado", "Desbridamento da fibrina peri-bordo (colagenase)", "Proteção da dermatite de estase (ATL, protetor spray ou betametasona tópica)", "Penso simples protetor", "Terapia compressiva após confirmação do ABPI"],
    },
  },

  // ─── Caso 5 ──────────────────────────────────────────────────────────────────
  {
    id: "5",
    slug: "5",
    tituloAbreviado: "Caso 5",
    titulo: "Úlcera venosa",
    descricao: "Úlcera venosa com esfacelo abundante, exsudado elevado e perilesão muito reativa.",
    competencias: "Controlo de bioburden, desbridamento, absorção elevada e proteção perilesional",
    dificuldade: "avancado",
    ordem: 5,
    minutosEstimados: 10,
    status: "disponivel",
    srcImagem: "/caso5.jpg",
    altImagem: "Úlcera venosa na perna com lesões satélite e perilesão reativa — © Medetec Medical Images (medetec.co.uk)",
    resumoIntro: "Utente de 71 anos com úlcera venosa extensa, exsudado abundante e perilesão papular reativa.",
    objetivo: "Desbridar o esfacelo, absorver o exsudado abundante e proteger a perilesão muito reativa.",
    definicoesObservacao: observationDefinitions,
    promptsDialogo: dialoguePrompts,
    definicoesAplicacao: applicationDefinitions,
    objetivosVisuais: {
    tecidos: ["fibrina", "granulacao"],
    exsudado: ["purulento"],
    bordos: ["rubor", "maceracao"],
    },
    tituloCenario: "Úlcera venosa com perilesão reativa",
    contextoPaciente: "Utente de 71 anos com insuficiência venosa crónica bilateral, úlcera venosa extensa com esfacelo amarelo abundante, lesões satélite e perilesão papular/petequial muito reativa.",
    bannerPaciente: "Úlcera venosa na perna com lesões satélite e perilesão reativa — © Medetec Medical Images (medetec.co.uk)",
    estadoFerida: { exsudado: "abundante", infeccao: "infecao-local-encoberta", tecido: "fibrina", perilesional: "eritematosa", odor: "ligeiro" },
    variavelFerida: { exsudado: 4, infeccao: 1, tecido: 2, odor: 1, humidade: 4, profundidade: 2, bordos: 3, pele_perilesional: 2, dor: 2, hemorragia: 0, etiologia: 2, perfusao: 1 },
    detalhesObservacao: {
    imagem: { detalhe: "Úlcera venosa extensa com pequenas lesões avermelhadas dispersas na periferia." },
    dimensoes: { detalhe: "≈7 × 5 cm; lesões satélite dispersas." },
    exsudado: { detalhe: "Abundante, transparente e amarelado." },
    cheiro: { detalhe: "Ligeiro odor presente." },
    tecidos: { detalhe: "Zonas avermelhadas no leito separadas por zonas amareladas." },
    bordos: { detalhe: "Bordos irregulares." },
    pele_perilesional: { detalhe: "Avermelhada e muito irritada em redor." },
    },
    respostasDialogo: {
    dor: "Arde bastante, especialmente à tarde — daria um 6 em 10.",
    duracao: "A ferida está assim há 6 semanas. Nunca esteve tão grande.",
    posicao: "Passo o dia sentada, raramente levanto os pés.",
    pensos: "Tenho feito penso com compressas, mas ensopa muito rápido.",
    febre: "Não tenho febre, mas a perna está mais quente.",
    mobilidade: "Ando com dificuldade por causa do peso e do edema.",
    },
    tratamentosDisponiveis: ["cloreto-sodio", "octenilin-solucao", "betadine-solucao", "octiset", "colagenase", "vliwasorb", "aquacel", "alginato-calcio", "exufiber", "aquacel-ag", "silvercel", "urgotul-ag", "exufiber-ag", "actisorb-silver", "protetor-spray", "oxido-zinco", "atl", "tintura-benjoim", "hidrogel", "hidrocoloide", "urgo-start", "betametasona", "alcool-etilico"],
    opcoesAplicacao: ["penso_rapido", "penso_simples", "penso_impermeavel", "ligadura", "terapia_compressiva", "direto_seco", "sem_protecao"],
    objetivosClinicosAlvo: [
    goal("cleanse", "Fazer limpeza antes da cobertura", "limpar-ferida", "essencial", "A limpeza remove o esfacelo solto e o exsudado antes de qualquer cobertura.", { idsTratamento: ["cloreto-sodio", "octenilin-solucao"] }, ["decisao-clinica"]),
    goal("antisepsis", "Associar antissépsia local", "controlar-bioburden", "essencial", "A antissépsia local é essencial com colonização crítica suspeita.", { idsTratamento: ["betadine-solucao", "octiset"] }, ["antimicrobianos", "decisao-clinica"]),
    goal("desbridamento", "Desbridar o esfacelo dominante", "desbridamento", "essencial", "O esfacelo abundante impede a progressão para granulação e mantém o bioburden elevado.", { idsTratamento: ["colagenase"] }, ["desbridamento", "tecidos-e-leito"]),
    goal("absorb-high", "Absorção elevada do exsudado abundante", "controlar-exsudado", "essencial", "O exsudado abundante exige cobertura de alta capacidade absortiva para proteger a perilesão.", { idsTratamento: ["vliwasorb", "aquacel", "alginato-calcio", "exufiber"] }, ["gestao-exsudado"]),
    goal("periwound", "Proteger a perilesão muito reativa", "proteger-perilesional", "essencial", "A perilesão papular/petequial exige proteção ativa para evitar propagação das lesões satélite.", { idsTratamento: ["protetor-spray", "oxido-zinco", "atl", "tintura-benjoim"] }, ["protecao-perilesional"]),
    goal("app-simples", "Aplicar penso simples protetor", "cobertura-atraumatica", "essencial", "Penso simples é a cobertura de base correta para úlcera venosa.", { idsAplicacao: ["penso_simples"] }, ["decisao-clinica"]),
    goal("app-compressao", "Aplicar terapia compressiva após ABPI", "aliviar-pressao", "essencial", "A compressão é o pilar do tratamento venoso — confirmar ABPI antes de aplicar.", { idsAplicacao: ["terapia_compressiva"] }, ["decisao-clinica"]),
    goal("prata-colonizacao", "Cobertura com prata em colonização crítica", "controlar-bioburden", "adequado", "Com suspeita de colonização crítica, a prata acrescenta controlo de bioburden ao plano.", { idsTratamento: ["aquacel-ag", "silvercel", "urgotul-ag", "exufiber-ag"] }, ["antimicrobianos"]),
    goal("actisorb-odor", "Controlo de odor e carga microbiana com carvão", "gerir-odor", "adequado", "O Actisorb complementa o controlo de bioburden e odor ligeiro.", { idsTratamento: ["actisorb-silver"] }, ["antimicrobianos"]),
    ],
    regrasAvaliacao: [
    { id: "hidrogel-venosa5", alvo: "tratamento", aplicavelAIds: ["hidrogel"], classificacao: "inadequado", motivo: "O hidrogel aumenta a humidade num leito com exsudado abundante e maceração perilesional — contraindicado.", idsTemas: ["gestao-exsudado"] },
    { id: "hidrocoloide-venosa5", alvo: "tratamento", aplicavelAIds: ["hidrocoloide"], classificacao: "inadequado", motivo: "O hidrocolóide é oclusivo e tem baixa capacidade absortiva — inadequado com exsudado abundante.", idsTemas: ["gestao-exsudado"] },
    { id: "urgo-start-venosa5", alvo: "tratamento", aplicavelAIds: ["urgo-start"], classificacao: "inadequado", motivo: "Urgo-Start é indicado em granulação ativa — com esfacelo dominante não é a prioridade e não resolve o problema principal.", idsTemas: ["tecidos-e-leito"] },
    { id: "betametasona-venosa5", alvo: "tratamento", aplicavelAIds: ["betametasona"], classificacao: "inadequado", motivo: "A betametasona não responde ao problema dominante deste caso — esfacelo, exsudado abundante e bioburden.", idsTemas: ["decisao-clinica"] },
    { id: "alcool-venosa5", alvo: "tratamento", aplicavelAIds: ["alcool-etilico"], classificacao: "inadequado", motivo: "O álcool é citotóxico e não acrescenta valor clínico neste plano.", idsTemas: ["antimicrobianos"] },
    { id: "direto-seco-venosa5", alvo: "aplicacao", aplicavelAIds: ["direto_seco"], classificacao: "inadequado", motivo: "Aplicar material em seco adere ao leito e traumatiza a granulação frágil.", idsTemas: ["decisao-clinica"] },
    { id: "sem-protecao-venosa5", alvo: "aplicacao", aplicavelAIds: ["sem_protecao"], classificacao: "inadequado", motivo: "Ferida venosa com exsudado abundante sem cobertura expõe a perilesão a maceração e contaminação.", idsTemas: ["decisao-clinica"] },
    { id: "penso-rapido-venosa5", alvo: "aplicacao", aplicavelAIds: ["penso_rapido"], classificacao: "inadequado", motivo: "Penso rápido é aderente e não indicado em úlcera venosa com granulação frágil — causa trauma na remoção.", idsTemas: ["decisao-clinica"] },
    { id: "penso-impermeavel-venosa5", alvo: "aplicacao", aplicavelAIds: ["penso_impermeavel"], classificacao: "inadequado", motivo: "Penso impermeável oclusivo com exsudado abundante aumenta risco de maceração — incompatível com compressão.", idsTemas: ["gestao-exsudado"] },
    { id: "ligadura-venosa5", alvo: "aplicacao", aplicavelAIds: ["ligadura"], classificacao: "redundante", motivo: "A ligadura pode complementar a proteção mas a terapia compressiva estruturada é a técnica de eleição na úlcera venosa.", idsTemas: ["decisao-clinica"] },
    ],
    zonasTecido: [
  {
    "tipoTecido": "fibrina",
    "poligono": [
      {
        "x": 0.250625,
        "y": 0.419607736013986
      },
      {
        "x": 0.249375,
        "y": 0.4528245192307692
      },
      {
        "x": 0.234375,
        "y": 0.46506228146853146
      },
      {
        "x": 0.241875,
        "y": 0.5035238199300699
      },
      {
        "x": 0.271875,
        "y": 0.517509833916084
      },
      {
        "x": 0.286875,
        "y": 0.5000273164335665
      },
      {
        "x": 0.281875,
        "y": 0.46855878496503495
      },
      {
        "x": 0.274375,
        "y": 0.4510762674825175
      },
      {
        "x": 0.273125,
        "y": 0.4108664772727273
      },
      {
        "x": 0.255625,
        "y": 0.41785948426573427
      }
    ]
  },
  {
    "tipoTecido": "fibrina",
    "poligono": [
      {
        "x": 0.340625,
        "y": 0.48953780594405594
      },
      {
        "x": 0.335625,
        "y": 0.5349923513986014
      },
      {
        "x": 0.356875,
        "y": 0.5682091346153846
      },
      {
        "x": 0.369375,
        "y": 0.5489783653846154
      },
      {
        "x": 0.400625,
        "y": 0.5612161276223776
      },
      {
        "x": 0.406875,
        "y": 0.5542231206293706
      },
      {
        "x": 0.409375,
        "y": 0.5192580856643356
      },
      {
        "x": 0.398125,
        "y": 0.5035238199300699
      },
      {
        "x": 0.390625,
        "y": 0.5227545891608392
      },
      {
        "x": 0.366875,
        "y": 0.5227545891608392
      },
      {
        "x": 0.351875,
        "y": 0.5140133304195804
      },
      {
        "x": 0.361875,
        "y": 0.4982790646853147
      },
      {
        "x": 0.345625,
        "y": 0.48953780594405594
      }
    ]
  },
  {
    "tipoTecido": "fibrina",
    "poligono": [
      {
        "x": 0.456875,
        "y": 0.4982790646853147
      },
      {
        "x": 0.451875,
        "y": 0.5419853583916084
      },
      {
        "x": 0.475625,
        "y": 0.5437336101398601
      },
      {
        "x": 0.496875,
        "y": 0.5682091346153846
      },
      {
        "x": 0.510625,
        "y": 0.5891881555944056
      },
      {
        "x": 0.566875,
        "y": 0.5856916520979021
      },
      {
        "x": 0.586875,
        "y": 0.5559713723776224
      },
      {
        "x": 0.588125,
        "y": 0.5332440996503497
      },
      {
        "x": 0.608125,
        "y": 0.5507266171328671
      },
      {
        "x": 0.620625,
        "y": 0.5402371066433567
      },
      {
        "x": 0.609375,
        "y": 0.5245028409090909
      },
      {
        "x": 0.579375,
        "y": 0.5227545891608392
      },
      {
        "x": 0.569375,
        "y": 0.5140133304195804
      },
      {
        "x": 0.551875,
        "y": 0.5297475961538461
      },
      {
        "x": 0.528125,
        "y": 0.5402371066433567
      },
      {
        "x": 0.499375,
        "y": 0.5419853583916084
      },
      {
        "x": 0.460625,
        "y": 0.5035238199300699
      }
    ]
  },
  {
    "tipoTecido": "fibrina",
    "poligono": [
      {
        "x": 0.591875,
        "y": 0.33918815559440557
      },
      {
        "x": 0.594375,
        "y": 0.38114619755244755
      },
      {
        "x": 0.621875,
        "y": 0.3759014423076923
      },
      {
        "x": 0.626875,
        "y": 0.3496776660839161
      },
      {
        "x": 0.628125,
        "y": 0.33394340034965037
      },
      {
        "x": 0.608125,
        "y": 0.3321951486013986
      },
      {
        "x": 0.596875,
        "y": 0.33394340034965037
      }
    ]
  },
  {
    "tipoTecido": "fibrina",
    "poligono": [
      {
        "x": 0.654375,
        "y": 0.5157615821678322
      },
      {
        "x": 0.654375,
        "y": 0.5542231206293706
      },
      {
        "x": 0.683125,
        "y": 0.5437336101398601
      },
      {
        "x": 0.671875,
        "y": 0.5245028409090909
      },
      {
        "x": 0.656875,
        "y": 0.5140133304195804
      }
    ]
  },
  {
    "tipoTecido": "fibrina",
    "poligono": [
      {
        "x": 0.700625,
        "y": 0.44233500874125875
      },
      {
        "x": 0.686875,
        "y": 0.40387347027972026
      },
      {
        "x": 0.666875,
        "y": 0.40387347027972026
      },
      {
        "x": 0.671875,
        "y": 0.44932801573426573
      },
      {
        "x": 0.703125,
        "y": 0.4370902534965035
      }
    ]
  },
  {
    "tipoTecido": "granulacao",
    "poligono": [
      {
        "x": 0.276875,
        "y": 0.39513221153846156
      },
      {
        "x": 0.291875,
        "y": 0.4930343094405594
      },
      {
        "x": 0.321875,
        "y": 0.46331402972027974
      },
      {
        "x": 0.331875,
        "y": 0.4965308129370629
      },
      {
        "x": 0.350625,
        "y": 0.48604130244755245
      },
      {
        "x": 0.366875,
        "y": 0.5140133304195804
      },
      {
        "x": 0.386875,
        "y": 0.5140133304195804
      },
      {
        "x": 0.401875,
        "y": 0.5000273164335665
      },
      {
        "x": 0.414375,
        "y": 0.5262510926573427
      },
      {
        "x": 0.411875,
        "y": 0.5577196241258742
      },
      {
        "x": 0.446875,
        "y": 0.5472301136363636
      },
      {
        "x": 0.454375,
        "y": 0.48953780594405594
      },
      {
        "x": 0.499375,
        "y": 0.5367406031468531
      },
      {
        "x": 0.566875,
        "y": 0.5122650786713286
      },
      {
        "x": 0.609375,
        "y": 0.5227545891608392
      },
      {
        "x": 0.635625,
        "y": 0.5367406031468531
      },
      {
        "x": 0.650625,
        "y": 0.5332440996503497
      },
      {
        "x": 0.649375,
        "y": 0.5087685751748252
      },
      {
        "x": 0.670625,
        "y": 0.5192580856643356
      },
      {
        "x": 0.690625,
        "y": 0.5437336101398601
      },
      {
        "x": 0.703125,
        "y": 0.5262510926573427
      },
      {
        "x": 0.701875,
        "y": 0.48604130244755245
      },
      {
        "x": 0.695625,
        "y": 0.46506228146853146
      },
      {
        "x": 0.670625,
        "y": 0.454572770979021
      },
      {
        "x": 0.661875,
        "y": 0.4108664772727273
      },
      {
        "x": 0.646875,
        "y": 0.3968804632867133
      },
      {
        "x": 0.664375,
        "y": 0.38464270104895104
      },
      {
        "x": 0.664375,
        "y": 0.35492242132867136
      },
      {
        "x": 0.643125,
        "y": 0.34443291083916083
      },
      {
        "x": 0.629375,
        "y": 0.38114619755244755
      },
      {
        "x": 0.611875,
        "y": 0.3933839597902098
      },
      {
        "x": 0.581875,
        "y": 0.38464270104895104
      },
      {
        "x": 0.573125,
        "y": 0.4091182255244755
      },
      {
        "x": 0.546875,
        "y": 0.419607736013986
      },
      {
        "x": 0.523125,
        "y": 0.412614729020979
      },
      {
        "x": 0.516875,
        "y": 0.3968804632867133
      },
      {
        "x": 0.491875,
        "y": 0.3968804632867133
      },
      {
        "x": 0.473125,
        "y": 0.40562172202797203
      },
      {
        "x": 0.440625,
        "y": 0.42135598776223776
      },
      {
        "x": 0.418125,
        "y": 0.419607736013986
      },
      {
        "x": 0.406875,
        "y": 0.38114619755244755
      },
      {
        "x": 0.384375,
        "y": 0.3461811625874126
      },
      {
        "x": 0.358125,
        "y": 0.33743990384615385
      },
      {
        "x": 0.338125,
        "y": 0.33918815559440557
      },
      {
        "x": 0.320625,
        "y": 0.3566706730769231
      },
      {
        "x": 0.286875,
        "y": 0.3863909527972028
      },
      {
        "x": 0.279375,
        "y": 0.391635708041958
      }
    ]
  },
  {
    "tipoTecido": "granulacao",
    "poligono": [
      {
        "x": 0.440625,
        "y": 0.2954818618881119
      },
      {
        "x": 0.438125,
        "y": 0.32345388986013984
      },
      {
        "x": 0.463125,
        "y": 0.34443291083916083
      },
      {
        "x": 0.485625,
        "y": 0.35492242132867136
      },
      {
        "x": 0.499375,
        "y": 0.33918815559440557
      },
      {
        "x": 0.499375,
        "y": 0.3147126311188811
      },
      {
        "x": 0.479375,
        "y": 0.29373361013986016
      },
      {
        "x": 0.464375,
        "y": 0.2849923513986014
      },
      {
        "x": 0.448125,
        "y": 0.2954818618881119
      }
    ]
  },
  {
    "tipoTecido": "granulacao",
    "poligono": [
      {
        "x": 0.689375,
        "y": 0.391635708041958
      },
      {
        "x": 0.705625,
        "y": 0.44233500874125875
      },
      {
        "x": 0.718125,
        "y": 0.454572770979021
      },
      {
        "x": 0.726875,
        "y": 0.3968804632867133
      },
      {
        "x": 0.695625,
        "y": 0.3933839597902098
      }
    ]
  },
  {
    "tipoTecido": "fibrina",
    "poligono": [
      {
        "x": 0.733125,
        "y": 0.40037696678321677
      },
      {
        "x": 0.749375,
        "y": 0.419607736013986
      },
      {
        "x": 0.744375,
        "y": 0.4510762674825175
      },
      {
        "x": 0.729375,
        "y": 0.46855878496503495
      },
      {
        "x": 0.713125,
        "y": 0.4580692744755245
      },
      {
        "x": 0.731875,
        "y": 0.40212521853146854
      }
    ]
  }
    ],
    idsTemas: ["gestao-exsudado", "desbridamento", "antimicrobianos", "protecao-perilesional", "decisao-clinica"],
    planoRecomendado: {
    minimo: ["Limpeza com soro fisiológico ou antisséptico", "Desbridamento do esfacelo dominante", "Cobertura de alta absorção", "Proteção da perilesão reativa", "Penso simples protetor", "Terapia compressiva após confirmação do ABPI"],
    otimizado: ["Limpeza com soro fisiológico ou antisséptico", "Desbridamento do esfacelo dominante (colagenase)", "Cobertura de alta absorção (Vliwasorb ou Exufiber)", "Cobertura com prata em colonização crítica", "Proteção da perilesão muito reativa (protetor spray, ATL ou tintura de benjoim)", "Penso simples protetor", "Terapia compressiva após confirmação do ABPI"],
    },
  },

  // ─── Caso 6 ──────────────────────────────────────────────────────────────────
  {
    id: "6",
    slug: "6",
    tituloAbreviado: "Caso 6",
    titulo: "Queimadura",
    descricao: "Reconhecer hipergranulação e reduzir sem traumatizar o leito.",
    competencias: "Reconhecimento de hipergranulação, redução de tecido excessivo e seleção de cobertura não aderente",
    dificuldade: "intermedio",
    ordem: 6,
    minutosEstimados: 10,
    status: "disponivel",
    srcImagem: "/caso6.jpg",
    altImagem: "Ferida venosa com hipergranulação acima do plano da pele — © Medetec Medical Images (medetec.co.uk)",
    resumoIntro: "Utente com ferida venosa e hipergranulação confirmada com tecido exuberante acima do plano da pele.",
    objetivo: "Reduzir a hipergranulação sem traumatizar e selecionar cobertura não aderente adequada.",
    definicoesObservacao: observationDefinitions,
    promptsDialogo: dialoguePrompts,
    definicoesAplicacao: applicationDefinitions,
    objetivosVisuais: {
    tecidos: ["hipergranulacao"],
    exsudado: ["seroso"],
    bordos: ["maceracao"],
    },
    tituloCenario: "Queimadura com tecido exuberante",
    contextoPaciente: "Utente com ferida venosa de evolução longa, com granulação exuberante vermelho-vivo que ultrapassa o plano da pele, inibindo a migração epitelial. Sem sinais de infeção.",
    bannerPaciente: "Ferida venosa com hipergranulação acima do plano da pele — © Medetec Medical Images (medetec.co.uk)",
    estadoFerida: { exsudado: "escasso", infeccao: "contaminacao", tecido: "hipergranulacao", perilesional: "integra", odor: "ausente" },
    variavelFerida: { exsudado: 2, infeccao: 0, tecido: 5, odor: 0, humidade: 2, profundidade: 1, bordos: 3, pele_perilesional: 4, dor: 1, hemorragia: 0, etiologia: 2, perfusao: 1 },
    detalhesObservacao: {
    imagem: { detalhe: "Lesão com tecido vermelho-vivo saliente e lobular a transbordar o nível da pele circundante." },
    dimensoes: { detalhe: "≈8 × 4 cm." },
    exsudado: { detalhe: "Escasso a moderado, transparente." },
    cheiro: { detalhe: "Sem odor." },
    tecidos: { detalhe: "Tecido avermelhado volumoso, com aspeto lobular, elevado acima do plano da pele." },
    bordos: { detalhe: "Bordos completamente encobertos pelo tecido elevado; sem faixa rosada de crescimento nas margens." },
    pele_perilesional: { detalhe: "Pele seca, fina e descamativa." },
    },
    respostasDialogo: {
    dor: "Sangra facilmente quando toco. A dor é ligeira — uns 2 em 10.",
    duracao: "A ferida começou a piorar há um mês. Parecia estar a melhorar e depois parou.",
    posicao: "Passo o dia sentado, perna pendente.",
    pensos: "Tenho feito penso com uma cobertura oclusiva desde o início.",
    febre: "Não tive febre nem sinais de infeção.",
    mobilidade: "Consigo andar, mas com desconforto.",
    },
    tratamentosDisponiveis: ["cloreto-sodio", "octenilin-solucao", "betadine-solucao", "octiset", "nitrato-prata", "betametasona", "urgotul", "urgo-clean", "aquacel", "hidrogel", "hidrocoloide", "aquacel-ag", "urgo-start", "alcool-etilico", "agua-oxigenada"],
    opcoesAplicacao: ["penso_rapido", "penso_simples", "penso_impermeavel", "ligadura", "terapia_compressiva", "direto_seco", "sem_protecao"],
    objetivosClinicosAlvo: [
    goal("cleanse", "Fazer limpeza suave antes da cobertura", "limpar-ferida", "essencial", "A limpeza suave preserva o tecido viável sem traumatizar a granulação frágil.", { idsTratamento: ["cloreto-sodio", "octenilin-solucao"] }, ["decisao-clinica"]),
    goal("antisepsis", "Associar antissépsia local", "controlar-bioburden", "essencial", "A antissépsia prepara o leito e reduz o estímulo inflamatório antes da redução do tecido.", { idsTratamento: ["betadine-solucao", "octiset"] }, ["antimicrobianos", "decisao-clinica"]),
    goal("reduce-hypergranulation", "Reduzir o excesso de granulação", "desbridamento", "essencial", "O nitrato de prata cauteriza o tecido exuberante — é o tratamento de eleição para hipergranulação.", { idsTratamento: ["nitrato-prata"] }, ["tecidos-e-leito", "decisao-clinica"]),
    goal("non-adherent-cover", "Cobertura não aderente sobre o leito", "cobertura-atraumatica", "essencial", "Urgotul ou Urgo-Clean protegem sem aderir nem estimular o tecido excessivo.", { idsTratamento: ["urgotul", "urgo-clean"] }, ["tecidos-e-leito", "fixacao-e-remocao"]),
    goal("app-cover", "Aplicar penso simples protetor", "cobertura-atraumatica", "essencial", "Penso simples não aderente é a cobertura de eleição para hipergranulação.", { idsAplicacao: ["penso_simples"] }, ["decisao-clinica"]),
    goal("betametasona-hipergran", "Betametasona como alternativa de redução", "desbridamento", "adequado", "A betametasona tópica é uma alternativa ao nitrato de prata para redução da hipergranulação.", { idsTratamento: ["betametasona"] }, ["tecidos-e-leito", "decisao-clinica"]),
    ],
    regrasAvaliacao: [
    { id: "hidrogel-hipergran6", alvo: "tratamento", aplicavelAIds: ["hidrogel"], classificacao: "inadequado", motivo: "O hidrogel aumenta a humidade do leito — perpetua a hipergranulação ao invés de a reduzir.", idsTemas: ["gestao-exsudado", "tecidos-e-leito"] },
    { id: "hidrocoloide-hipergran6", alvo: "tratamento", aplicavelAIds: ["hidrocoloide"], classificacao: "inadequado", motivo: "O hidrocolóide oclusivo aumenta a humidade e o estímulo angiogénico — contraindicado na hipergranulação.", idsTemas: ["gestao-exsudado", "tecidos-e-leito"] },
    { id: "aquacel-ag-hipergran6", alvo: "tratamento", aplicavelAIds: ["aquacel-ag"], classificacao: "inadequado", motivo: "A cobertura com prata mantém a humidade elevada — foi provavelmente o que gerou a hipergranulação. Continuar perpetua o problema.", idsTemas: ["tecidos-e-leito"] },
    { id: "urgo-start-hipergran6", alvo: "tratamento", aplicavelAIds: ["urgo-start"], classificacao: "inadequado", motivo: "Urgo-Start estimula a granulação — é exatamente o efeito contrário ao pretendido na hipergranulação.", idsTemas: ["tecidos-e-leito"] },
    { id: "agua-oxigenada-hipergran6", alvo: "tratamento", aplicavelAIds: ["agua-oxigenada"], classificacao: "inadequado", motivo: "A água oxigenada é citotóxica e não tem indicação clínica no tratamento de feridas crónicas.", idsTemas: ["antimicrobianos"] },
    { id: "alcool-hipergran6", alvo: "tratamento", aplicavelAIds: ["alcool-etilico"], classificacao: "inadequado", motivo: "O álcool é citotóxico e agrava a inflamação local — contraindicado.", idsTemas: ["antimicrobianos"] },
    { id: "penso-rapido-hipergran6", alvo: "aplicacao", aplicavelAIds: ["penso_rapido"], classificacao: "inadequado", motivo: "O penso rápido é aderente e traumatiza a granulação ao ser removido, agravando o sangramento e o estímulo inflamatório.", idsTemas: ["decisao-clinica"] },
    { id: "penso-impermeavel-hipergran6", alvo: "aplicacao", aplicavelAIds: ["penso_impermeavel"], classificacao: "inadequado", motivo: "Penso impermeável aumenta a oclusão e a humidade — perpetua o problema dominante.", idsTemas: ["gestao-exsudado"] },
    { id: "direto-seco-hipergran6", alvo: "aplicacao", aplicavelAIds: ["direto_seco"], classificacao: "inadequado", motivo: "Aplicar material em seco adere à granulação e provoca trauma e hemorragia na remoção.", idsTemas: ["decisao-clinica"] },
    { id: "sem-protecao-hipergran6", alvo: "aplicacao", aplicavelAIds: ["sem_protecao"], classificacao: "inadequado", motivo: "Sem cobertura, a ferida fica exposta a trauma mecânico e contaminação.", idsTemas: ["decisao-clinica"] },
    { id: "ligadura-hipergran6", alvo: "aplicacao", aplicavelAIds: ["ligadura"], classificacao: "inadequado", motivo: "Ligadura não é adequada para hipergranulação venosa sem exsudado significativo — compressão excessiva pode traumatizar o tecido exuberante.", idsTemas: ["decisao-clinica"] },
    { id: "terapia-compressiva-hipergran6", alvo: "aplicacao", aplicavelAIds: ["terapia_compressiva"], classificacao: "redundante", motivo: "A compressão pode ser considerada após resolução da hipergranulação, mas não é a intervenção prioritária neste momento.", idsTemas: ["decisao-clinica"] },
    ],
    zonasTecido: [
  {
    "tipoTecido": "hipergranulacao",
    "poligono": [
      {
        "x": 0.109375,
        "y": 0.384232388756117
      },
      {
        "x": 0.114375,
        "y": 0.4588881301923296
      },
      {
        "x": 0.144375,
        "y": 0.4661716171617162
      },
      {
        "x": 0.198125,
        "y": 0.4406794127688631
      },
      {
        "x": 0.239375,
        "y": 0.41518720837601003
      },
      {
        "x": 0.245625,
        "y": 0.3987993626948902
      },
      {
        "x": 0.281875,
        "y": 0.45342551496528966
      },
      {
        "x": 0.326875,
        "y": 0.48802207806987596
      },
      {
        "x": 0.376875,
        "y": 0.49712643678160917
      },
      {
        "x": 0.411875,
        "y": 0.5044099237509958
      },
      {
        "x": 0.438125,
        "y": 0.5335438716285421
      },
      {
        "x": 0.485625,
        "y": 0.5317229998861955
      },
      {
        "x": 0.499375,
        "y": 0.5390064868555821
      },
      {
        "x": 0.499375,
        "y": 0.580886536929555
      },
      {
        "x": 0.514375,
        "y": 0.5990952543530215
      },
      {
        "x": 0.526875,
        "y": 0.6391544326846478
      },
      {
        "x": 0.524375,
        "y": 0.6937805849550472
      },
      {
        "x": 0.515625,
        "y": 0.715631045863207
      },
      {
        "x": 0.396875,
        "y": 0.7338397632866734
      },
      {
        "x": 0.338125,
        "y": 0.7411232502560601
      },
      {
        "x": 0.494375,
        "y": 0.7447649937407533
      },
      {
        "x": 0.616875,
        "y": 0.7320188915443269
      },
      {
        "x": 0.744375,
        "y": 0.7265562763172869
      },
      {
        "x": 0.821875,
        "y": 0.7174519176055537
      },
      {
        "x": 0.866875,
        "y": 0.6864970979856606
      },
      {
        "x": 0.946875,
        "y": 0.684676226243314
      },
      {
        "x": 0.936875,
        "y": 0.6446170479116877
      },
      {
        "x": 0.890625,
        "y": 0.6646466370775008
      },
      {
        "x": 0.813125,
        "y": 0.648258791396381
      },
      {
        "x": 0.759375,
        "y": 0.6318709457152611
      },
      {
        "x": 0.723125,
        "y": 0.5881700238989416
      },
      {
        "x": 0.700625,
        "y": 0.5881700238989416
      },
      {
        "x": 0.698125,
        "y": 0.5262603846591556
      },
      {
        "x": 0.709375,
        "y": 0.4898429498122226
      },
      {
        "x": 0.716875,
        "y": 0.43885854102651645
      },
      {
        "x": 0.734375,
        "y": 0.41518720837601003
      },
      {
        "x": 0.793125,
        "y": 0.3987993626948902
      },
      {
        "x": 0.809375,
        "y": 0.3951576192101969
      },
      {
        "x": 0.810625,
        "y": 0.43885854102651645
      },
      {
        "x": 0.828125,
        "y": 0.42429156708774324
      },
      {
        "x": 0.841875,
        "y": 0.3951576192101969
      },
      {
        "x": 0.830625,
        "y": 0.37148628655969046
      },
      {
        "x": 0.836875,
        "y": 0.3423523386821441
      },
      {
        "x": 0.826875,
        "y": 0.31139751906225105
      },
      {
        "x": 0.799375,
        "y": 0.26223398201889153
      },
      {
        "x": 0.786875,
        "y": 0.22581654717195856
      },
      {
        "x": 0.769375,
        "y": 0.20942870149083873
      },
      {
        "x": 0.761875,
        "y": 0.23310003414134517
      },
      {
        "x": 0.739375,
        "y": 0.23492090588369183
      },
      {
        "x": 0.690625,
        "y": 0.24038352111073177
      },
      {
        "x": 0.690625,
        "y": 0.25495049504950495
      },
      {
        "x": 0.653125,
        "y": 0.24038352111073177
      },
      {
        "x": 0.600625,
        "y": 0.24584613633777172
      },
      {
        "x": 0.559375,
        "y": 0.22217480368726528
      },
      {
        "x": 0.516875,
        "y": 0.2003243427791055
      },
      {
        "x": 0.498125,
        "y": 0.18211562535563902
      },
      {
        "x": 0.480625,
        "y": 0.16936952315921247
      },
      {
        "x": 0.458125,
        "y": 0.1784738818709457
      },
      {
        "x": 0.446875,
        "y": 0.1857573688403323
      },
      {
        "x": 0.450625,
        "y": 0.2039660862637988
      },
      {
        "x": 0.450625,
        "y": 0.21671218846022533
      },
      {
        "x": 0.426875,
        "y": 0.22035393194491862
      },
      {
        "x": 0.409375,
        "y": 0.20942870149083873
      },
      {
        "x": 0.393125,
        "y": 0.2076078297484921
      },
      {
        "x": 0.363125,
        "y": 0.218533060202572
      },
      {
        "x": 0.359375,
        "y": 0.23310003414134517
      },
      {
        "x": 0.316875,
        "y": 0.2604131102765449
      },
      {
        "x": 0.275625,
        "y": 0.26951746898827816
      },
      {
        "x": 0.225625,
        "y": 0.2676965972459315
      },
      {
        "x": 0.201875,
        "y": 0.29683054512347784
      },
      {
        "x": 0.173125,
        "y": 0.33324797997041083
      },
      {
        "x": 0.144375,
        "y": 0.3642027995903039
      },
      {
        "x": 0.114375,
        "y": 0.3769489017867304
      }
    ]
  }
    ],
    idsTemas: ["tecidos-e-leito", "fixacao-e-remocao", "gestao-exsudado", "decisao-clinica"],
    planoRecomendado: {
    minimo: ["Limpeza suave com soro fisiológico", "Redução da hipergranulação com nitrato de prata", "Cobertura não aderente (Urgotul ou Urgo-Clean)", "Penso simples protetor"],
    otimizado: ["Limpeza suave com soro fisiológico", "Redução da hipergranulação com nitrato de prata (ou betametasona tópica como alternativa)", "Cobertura não aderente (Urgotul ou Urgo-Clean)", "Penso simples protetor", "Reavaliação a cada 3–4 dias — ajustar se hipergranulação persistir"],
    },
  },

  // ─── Caso 7 ──────────────────────────────────────────────────────────────────
  {
    id: "7",
    slug: "7",
    tituloAbreviado: "Caso 7",
    titulo: "Ferida cirúrgica",
    descricao: "Ferida cirúrgica com necrose, exsudado purulento e sinais de infeção marcada.",
    competencias: "Controlo antimicrobiano local, desbridamento em contexto de infeção e limites de autonomia do enfermeiro",
    dificuldade: "avancado",
    ordem: 7,
    minutosEstimados: 12,
    status: "disponivel",
    srcImagem: "/caso7.jpg",
    altImagem: "Ferida cirúrgica abdominal com área comprometida e eritema peri-incisional — © Medetec Medical Images (medetec.co.uk)",
    resumoIntro: "Homem de 74 anos, diabético, com infeção do local cirúrgico após laparotomia.",
    objetivo: "Controlar a infeção local, preparar o leito e respeitar os limites de autonomia do enfermeiro na necrose.",
    definicoesObservacao: observationDefinitions,
    promptsDialogo: dialoguePrompts,
    definicoesAplicacao: applicationDefinitions,
    objetivosVisuais: {
    tecidos: ["necrose", "fibrina"],
    exsudado: ["purulento"],
    bordos: ["rubor"],
    },
    tituloCenario: "Ferida cirúrgica complicada",
    contextoPaciente: "Homem de 74 anos, diabético tipo 2 mal controlado, com infeção do local cirúrgico após laparotomia — necrose negra central e exsudado purulento ao longo da incisão.",
    bannerPaciente: "Ferida cirúrgica abdominal com área comprometida e eritema peri-incisional — © Medetec Medical Images (medetec.co.uk)",
    estadoFerida: { exsudado: "abundante", infeccao: "infecao-local-evidente", tecido: "necrose-fibrina", perilesional: "eritematosa", odor: "presente" },
    variavelFerida: { exsudado: 4, infeccao: 2, tecido: 1, odor: 2, humidade: 3, profundidade: 3, bordos: 3, pele_perilesional: 2, dor: 2, hemorragia: 0, etiologia: 6, perfusao: 1 },
    detalhesObservacao: {
    imagem: { detalhe: "Ferida cirúrgica abdominal com zona central escura e líquido espesso visível." },
    dimensoes: { detalhe: "≈7 × 2 cm de área comprometida dentro da incisão." },
    exsudado: { detalhe: "Moderado a abundante, turvo e amarelado." },
    cheiro: { detalhe: "Odor intenso e desagradável." },
    tecidos: { detalhe: "Zona central preta e seca; zonas amareladas em redor." },
    bordos: { detalhe: "Bordos abertos com material amarelado aderente; sem faixa rosada de cicatrização." },
    pele_perilesional: { detalhe: "Avermelhada e quente ao longo do trajeto da incisão." },
    },
    respostasDialogo: {
    dor: "Dói muito ao toque e quando me mexo — uns 8 em 10.",
    duracao: "A ferida nunca fechou bem e nos últimos dias piorou muito visivelmente.",
    posicao: "Estou deitado quase sempre. Levanto-me com ajuda para ir à casa de banho.",
    pensos: "Têm-me feito o penso todos os dias aqui no internamento.",
    febre: "Tive 38,3°C ontem à noite.",
    mobilidade: "Preciso de ajuda — a dor limita muito qualquer movimento.",
    },
    tratamentosDisponiveis: ["cloreto-sodio", "octenilin-solucao", "betadine-solucao", "octiset", "colagenase", "hidrogel", "aquacel-ag", "silvercel", "allevyn-ag", "urgotul-ag", "exufiber-ag", "octenilin-gel", "actisorb-silver", "sulfadiazina-prata", "betadine-pomada", "l-mesitran", "vliwasorb", "aquacel", "urgo-start", "hidrocoloide", "betametasona", "alcool-etilico"],
    opcoesAplicacao: ["penso_rapido", "penso_simples", "penso_impermeavel", "ligadura", "terapia_compressiva", "direto_seco", "sem_protecao"],
    objetivosClinicosAlvo: [
    goal("cleanse", "Fazer limpeza antes da cobertura", "limpar-ferida", "essencial", "A limpeza remove o exsudado purulento e prepara o leito antes de qualquer cobertura.", { idsTratamento: ["octenilin-solucao"] }, ["decisao-clinica"]),
    goal("antisepsis", "Associar antissépsia adequada", "controlar-bioburden", "essencial", "A infeção local estabelecida exige antissépsia robusta antes da cobertura.", { idsTratamento: ["betadine-solucao", "octiset"] }, ["antimicrobianos", "decisao-clinica"]),
    goal("desbridamento", "Preparar o leito com desbridamento contextual", "desbridamento", "essencial", "A necrose e o esfacelo exigem desbridamento — enzimático ou autolítico, aguardando avaliação médica.", { idsTratamento: ["colagenase", "hidrogel"] }, ["desbridamento", "tecidos-e-leito"]),
    goal("antimicrobial-cover", "Cobertura antimicrobiana local", "controlar-bioburden", "essencial", "A infeção local marcada exige cobertura com agente antimicrobiano.", { idsTratamento: ["aquacel-ag", "silvercel", "allevyn-ag", "urgotul-ag", "exufiber-ag"] }, ["antimicrobianos"]),
    goal("app-cover", "Aplicar penso simples protetor", "cobertura-atraumatica", "essencial", "Penso simples protetor é a técnica correta — protege sem comprimir e permite vigilância.", { idsAplicacao: ["penso_simples"] }, ["decisao-clinica"]),
    goal("octenilin-gel-cavity", "Octenilin gel em cavidade infetada", "controlar-bioburden", "adequado", "O gel de octenidina é adequado em cavidades infetadas com necrose.", { idsTratamento: ["octenilin-gel"] }, ["antimicrobianos"]),
    goal("actisorb-odor", "Controlo de odor com carvão + prata", "gerir-odor", "adequado", "O Actisorb Silver complementa o controlo de odor e carga microbiana.", { idsTratamento: ["actisorb-silver"] }, ["antimicrobianos"]),
    goal("alternativas-topicas", "Alternativas tópicas antimicrobianas", "controlar-bioburden", "adequado", "Sulfadiazina de prata, betadine pomada ou mel (L-Mesitran) como alternativas ao plano antimicrobiano.", { idsTratamento: ["sulfadiazina-prata", "betadine-pomada", "l-mesitran"] }, ["antimicrobianos"]),
    ],
    regrasAvaliacao: [
    { id: "aquacel-sem-antimicrobiano-7", alvo: "tratamento", aplicavelAIds: ["aquacel", "vliwasorb"], classificacao: "redundante", motivo: "Cobertura absorvente sem componente antimicrobiano não responde ao problema dominante — a infeção marcada exige antimicrobiano local.", idsTemas: ["antimicrobianos"] },
    { id: "urgo-start-ilc-7", alvo: "tratamento", aplicavelAIds: ["urgo-start"], classificacao: "inadequado", motivo: "Urgo-Start estimula a granulação — contraindicado quando há infeção marcada e necrose no leito.", idsTemas: ["tecidos-e-leito", "antimicrobianos"] },
    { id: "hidrocoloide-ilc-7", alvo: "tratamento", aplicavelAIds: ["hidrocoloide"], classificacao: "inadequado", motivo: "Hidrocolóide oclusivo em infeção marcada retém calor e exsudado infetado — contraindicado.", idsTemas: ["gestao-exsudado", "antimicrobianos"] },
    { id: "betametasona-ilc-7", alvo: "tratamento", aplicavelAIds: ["betametasona"], classificacao: "inadequado", motivo: "A betametasona está contraindicada em infeção local ativa — pode mascarar sinais e agravar o quadro.", idsTemas: ["decisao-clinica"] },
    { id: "alcool-ilc-7", alvo: "tratamento", aplicavelAIds: ["alcool-etilico"], classificacao: "inadequado", motivo: "O álcool é citotóxico e não tem indicação em ferida cirúrgica infetada.", idsTemas: ["antimicrobianos"] },
    { id: "penso-impermeavel-ilc-7", alvo: "aplicacao", aplicavelAIds: ["penso_impermeavel"], classificacao: "inadequado", motivo: "Penso oclusivo sobre infeção marcada retém calor e exsudado infetado — agrava o quadro.", idsTemas: ["gestao-exsudado"] },
    { id: "direto-seco-ilc-7", alvo: "aplicacao", aplicavelAIds: ["direto_seco"], classificacao: "inadequado", motivo: "Aplicar material em seco adere ao tecido infetado e causa trauma grave na remoção.", idsTemas: ["decisao-clinica"] },
    { id: "sem-protecao-ilc-7", alvo: "aplicacao", aplicavelAIds: ["sem_protecao"], classificacao: "inadequado", motivo: "Ferida cirúrgica infetada sem cobertura é um erro de segurança — risco de contaminação exógena e agravamento.", idsTemas: ["decisao-clinica"] },
    { id: "penso-rapido-ilc-7", alvo: "aplicacao", aplicavelAIds: ["penso_rapido"], classificacao: "inadequado", motivo: "Penso rápido é aderente e não indicado em ferida cirúrgica profunda infetada — causa trauma na remoção.", idsTemas: ["decisao-clinica"] },
    { id: "terapia-compressiva-ilc-7", alvo: "aplicacao", aplicavelAIds: ["terapia_compressiva"], classificacao: "inadequado", motivo: "Terapia compressiva não tem indicação numa infeção do local cirúrgico abdominal — a etiologia é cirúrgica, não venosa.", idsTemas: ["decisao-clinica"] },
    { id: "ligadura-ilc-7", alvo: "aplicacao", aplicavelAIds: ["ligadura"], classificacao: "redundante", motivo: "A ligadura pode ser usada como fixação secundária, mas não resolve o problema dominante — infeção e necrose exigem antimicrobiano e desbridamento.", idsTemas: ["decisao-clinica"] },
    ],
    zonasTecido: [
  {
    "tipoTecido": "necrose",
    "poligono": [
      {
        "x": 0.460625,
        "y": 0.5149762142479591
      },
      {
        "x": 0.481875,
        "y": 0.5713572561226288
      },
      {
        "x": 0.496875,
        "y": 0.5807540964350737
      },
      {
        "x": 0.484375,
        "y": 0.5300111587478711
      },
      {
        "x": 0.470625,
        "y": 0.5018206378105362
      },
      {
        "x": 0.463125,
        "y": 0.5093381100604921
      }
    ]
  },
  {
    "tipoTecido": "necrose",
    "poligono": [
      {
        "x": 0.428125,
        "y": 0.535649262935338
      },
      {
        "x": 0.429375,
        "y": 0.5807540964350737
      },
      {
        "x": 0.444375,
        "y": 0.535649262935338
      },
      {
        "x": 0.426875,
        "y": 0.535649262935338
      }
    ]
  },
  {
    "tipoTecido": "necrose",
    "poligono": [
      {
        "x": 0.381875,
        "y": 0.5694778880601398
      },
      {
        "x": 0.381875,
        "y": 0.6033065131849416
      },
      {
        "x": 0.396875,
        "y": 0.5957890409349856
      },
      {
        "x": 0.390625,
        "y": 0.5732366241851178
      },
      {
        "x": 0.383125,
        "y": 0.5638397838726729
      }
    ]
  },
  {
    "tipoTecido": "necrose",
    "poligono": [
      {
        "x": 0.779375,
        "y": 0.5694778880601398
      },
      {
        "x": 0.789375,
        "y": 0.6014271451224525
      },
      {
        "x": 0.809375,
        "y": 0.5863922006225407
      },
      {
        "x": 0.794375,
        "y": 0.5675985199976508
      },
      {
        "x": 0.783125,
        "y": 0.5675985199976508
      }
    ]
  },
  {
    "tipoTecido": "fibrina",
    "poligono": [
      {
        "x": 0.261875,
        "y": 0.4398014917483996
      },
      {
        "x": 0.258125,
        "y": 0.46987138074822343
      },
      {
        "x": 0.285625,
        "y": 0.49618253362306924
      },
      {
        "x": 0.298125,
        "y": 0.5243730545604041
      },
      {
        "x": 0.329375,
        "y": 0.5525635754977389
      },
      {
        "x": 0.349375,
        "y": 0.5751159922476068
      },
      {
        "x": 0.368125,
        "y": 0.6014271451224525
      },
      {
        "x": 0.386875,
        "y": 0.6145827215598755
      },
      {
        "x": 0.406875,
        "y": 0.6014271451224525
      },
      {
        "x": 0.431875,
        "y": 0.6164620896223645
      },
      {
        "x": 0.465625,
        "y": 0.6239795618723204
      },
      {
        "x": 0.475625,
        "y": 0.5957890409349856
      },
      {
        "x": 0.504375,
        "y": 0.6239795618723204
      },
      {
        "x": 0.521875,
        "y": 0.6390145063722323
      },
      {
        "x": 0.540625,
        "y": 0.6164620896223645
      },
      {
        "x": 0.551875,
        "y": 0.6014271451224525
      },
      {
        "x": 0.554375,
        "y": 0.5769953603100957
      },
      {
        "x": 0.573125,
        "y": 0.6014271451224525
      },
      {
        "x": 0.589375,
        "y": 0.6033065131849416
      },
      {
        "x": 0.586875,
        "y": 0.5732366241851178
      },
      {
        "x": 0.568125,
        "y": 0.5582016796852058
      },
      {
        "x": 0.543125,
        "y": 0.533769894872849
      },
      {
        "x": 0.501875,
        "y": 0.5074587419980032
      },
      {
        "x": 0.478125,
        "y": 0.4905444294356023
      },
      {
        "x": 0.451875,
        "y": 0.46987138074822343
      },
      {
        "x": 0.426875,
        "y": 0.44919833206084453
      },
      {
        "x": 0.420625,
        "y": 0.46235390849826746
      },
      {
        "x": 0.395625,
        "y": 0.46047454043577846
      },
      {
        "x": 0.368125,
        "y": 0.44919833206084453
      },
      {
        "x": 0.353125,
        "y": 0.45107770012333354
      },
      {
        "x": 0.338125,
        "y": 0.4228871791859987
      },
      {
        "x": 0.313125,
        "y": 0.41349033887355374
      },
      {
        "x": 0.293125,
        "y": 0.4379221236859106
      },
      {
        "x": 0.274375,
        "y": 0.43228401949844364
      },
      {
        "x": 0.264375,
        "y": 0.4398014917483996
      }
    ]
  }    ],
    idsTemas: ["antimicrobianos", "desbridamento", "tecidos-e-leito", "sinais-de-alarme", "decisao-clinica"],
    planoRecomendado: {
    minimo: ["Limpeza com octenilin solução ou antisséptico equivalente", "Cobertura antimicrobiana local", "Desbridamento contextual (enzimático ou autolítico)", "Penso simples protetor"],
    otimizado: ["Limpeza com octenilin solução", "Cobertura antimicrobiana local (aquacel-ag ou equivalente de prata)", "Desbridamento contextual do esfacelo e necrose", "Octenilin gel em cavidade se indicado", "Penso simples protetor", "Documentação fotográfica antes e após penso", "Registo clínico dos sinais de infeção e comunicação à equipa médica"],
    },
  },

  // ─── Caso 8 ──────────────────────────────────────────────────────────────────
  {
    id: "8",
    slug: "8",
    tituloAbreviado: "Caso 8",
    titulo: "Queimadura",
    descricao: "Queimadura profunda com biofilme, esfacelo e colonização crítica.",
    competencias: "Controlo de biofilme, desbridamento em queimadura e cobertura antimicrobiana",
    dificuldade: "avancado",
    ordem: 8,
    minutosEstimados: 15,
    status: "disponivel",
    srcImagem: "/caso8.jpg",
    altImagem: "Queimadura extensa do membro inferior com escara e esfacelo — © Medetec Medical Images (medetec.co.uk)",
    resumoIntro: "Utente com queimadura profunda extensa no membro inferior com biofilme central e escara periférica.",
    objetivo: "Controlar o biofilme, preparar o leito para desbridamento e selecionar cobertura antimicrobiana adequada.",
    definicoesObservacao: observationDefinitions,
    promptsDialogo: dialoguePrompts,
    definicoesAplicacao: applicationDefinitions,
    objetivosVisuais: {
    tecidos: ["necrose", "fibrina"],
    exsudado: ["seroso"],
    bordos: ["pele-seca"],
    },
    tituloCenario: "Queimadura profunda",
    contextoPaciente: "Utente com queimadura profunda extensa no membro inferior, com escara negra periférica, esfacelo amarelo e biofilme gelatinoso central. Sinais de colonização crítica.",
    bannerPaciente: "Queimadura extensa do membro inferior com escara e esfacelo — © Medetec Medical Images (medetec.co.uk)",
    estadoFerida: { exsudado: "moderado", infeccao: "infecao-local-encoberta", tecido: "necrose-mista", perilesional: "fragil", odor: "ligeiro" },
    variavelFerida: { exsudado: 3, infeccao: 1, tecido: 1, odor: 1, humidade: 3, profundidade: 4, bordos: 3, pele_perilesional: 2, dor: 2, hemorragia: 0, etiologia: 7, perfusao: 1 },
    detalhesObservacao: {
    imagem: { detalhe: "Queimadura extensa do membro inferior com zonas escuras na periferia e material gelatinoso brilhante central." },
    dimensoes: { detalhe: "≈15 × 7 cm." },
    exsudado: { detalhe: "Abundante, difícil de quantificar sob a camada central." },
    cheiro: { detalhe: "Odor adocicado e desagradável." },
    tecidos: { detalhe: "Zonas pretas e secas na periferia; zonas amareladas no centro; pequenas áreas avermelhadas nas laterais." },
    bordos: { detalhe: "Bordos irregulares com transição abrupta para a pele circundante." },
    pele_perilesional: { detalhe: "Pele com manchas escuras e roxas em redor; descamativa distalmente." },
    },
    respostasDialogo: {
    dor: "A zona mais escura não dói muito, mas as margens ardem — uns 5 em 10.",
    duracao: "A queimadura foi há 3 semanas. No início parecia a melhorar, mas depois estabilizou.",
    posicao: "Tenho o membro elevado mas dificuldade em mantê-lo assim todo o dia.",
    pensos: "Tenho feito penso em casa com o que havia disponível.",
    febre: "Tive febrícula — 37,8°C. Ontem chegou a 38°C à noite.",
    mobilidade: "Tenho dificuldade em apoiar o membro. Dependo de ajuda.",
    },
    tratamentosDisponiveis: ["cloreto-sodio", "octenilin-solucao", "betadine-solucao", "octiset", "octenilin-gel", "sulfadiazina-prata", "colagenase", "l-mesitran", "aquacel-ag", "urgotul-ag", "exufiber-ag", "silvercel", "actisorb-silver", "hidrogel", "aquacel", "urgo-start", "hidrocoloide", "betametasona", "alcool-etilico"],
    opcoesAplicacao: ["penso_rapido", "penso_simples", "penso_impermeavel", "ligadura", "terapia_compressiva", "direto_seco", "sem_protecao"],
    objetivosClinicosAlvo: [
    goal("cleanse", "Fazer limpeza suave antes da cobertura", "limpar-ferida", "essencial", "Limpeza suave com octenilin — pele perilesional friável, não traumatizar.", { idsTratamento: ["octenilin-solucao"] }, ["decisao-clinica"]),
    goal("antisepsis", "Associar antisséptico para controlo de bioburden", "controlar-bioburden", "essencial", "Redução de bioburden e biofilme antes de qualquer cobertura.", { idsTratamento: ["betadine-solucao", "octiset"] }, ["antimicrobianos", "decisao-clinica"]),
    goal("anti-biofilme", "Controlo do biofilme com octenilin gel", "controlar-bioburden", "essencial", "O octenilin gel penetra em profundidade e dissolve o biofilme — problema dominante após escara.", { idsTratamento: ["octenilin-gel"] }, ["biofilme", "antimicrobianos"]),
    goal("sulfadiazina", "Cobertura com sulfadiazina de prata", "controlar-bioburden", "essencial", "A sulfadiazina de prata é o gold standard na queimadura infetada — amplo espectro antimicrobiano.", { idsTratamento: ["sulfadiazina-prata"] }, ["antimicrobianos", "biofilme"]),
    goal("desbridamento", "Desbridamento do esfacelo e escara", "desbridamento", "essencial", "A colagenase desbridante prepara o leito ao remover o esfacelo e amolecer a escara.", { idsTratamento: ["colagenase"] }, ["desbridamento", "tecidos-e-leito"]),
    goal("app-cover", "Aplicar penso simples protetor", "cobertura-atraumatica", "essencial", "Penso simples protetor é a cobertura correta sobre o antimicrobiano — permite vigilância da queimadura.", { idsAplicacao: ["penso_simples"] }, ["decisao-clinica"]),
    goal("mesitran-alternativo", "L-Mesitran como alternativa anti-biofilme", "controlar-bioburden", "adequado", "O mel medicinal (L-Mesitran) tem actividade anti-biofilme e pode substituir ou complementar o octenilin gel.", { idsTratamento: ["l-mesitran"] }, ["biofilme", "antimicrobianos"]),
    goal("prata-aposito", "Cobertura com prata em apósito", "controlar-bioburden", "adequado", "Cobertura com prata em apósito complementa o controlo de bioburden e o exsudado.", { idsTratamento: ["aquacel-ag", "urgotul-ag", "exufiber-ag", "silvercel"] }, ["antimicrobianos"]),
    goal("actisorb-odor", "Actisorb Silver para odor e carga microbiana", "gerir-odor", "adequado", "O Actisorb Silver complementa o controlo de odor e bioburden na queimadura.", { idsTratamento: ["actisorb-silver"] }, ["antimicrobianos"]),
    ],
    regrasAvaliacao: [
    { id: "hidrogel-biofilme-8", alvo: "tratamento", aplicavelAIds: ["hidrogel"], classificacao: "redundante", motivo: "O hidrogel isolado aumenta a humidade sem controlar o biofilme — risco de progressão da colonização crítica.", idsTemas: ["biofilme", "gestao-exsudado"] },
    { id: "aquacel-sem-antimicrobiano-8", alvo: "tratamento", aplicavelAIds: ["aquacel"], classificacao: "redundante", motivo: "Cobertura absorvente sem antimicrobiano não responde ao biofilme e colonização crítica dominantes.", idsTemas: ["biofilme", "antimicrobianos"] },
    { id: "urgo-start-queimadura-8", alvo: "tratamento", aplicavelAIds: ["urgo-start"], classificacao: "inadequado", motivo: "Urgo-Start estimula a granulação — contraindicado com biofilme e colonização crítica no leito.", idsTemas: ["tecidos-e-leito"] },
    { id: "hidrocoloide-queimadura-8", alvo: "tratamento", aplicavelAIds: ["hidrocoloide"], classificacao: "inadequado", motivo: "Hidrocolóide oclusivo em queimadura com biofilme e colonização crítica favorece crescimento bacteriano.", idsTemas: ["biofilme", "gestao-exsudado"] },
    { id: "betametasona-queimadura-8", alvo: "tratamento", aplicavelAIds: ["betametasona"], classificacao: "inadequado", motivo: "A betametasona não tem indicação em queimadura com colonização crítica — pode agravar o risco infecioso.", idsTemas: ["decisao-clinica"] },
    { id: "alcool-queimadura-8", alvo: "tratamento", aplicavelAIds: ["alcool-etilico"], classificacao: "inadequado", motivo: "O álcool é citotóxico e destrói o tecido de granulação remanescente — contraindicado.", idsTemas: ["antimicrobianos"] },
    { id: "penso-impermeavel-queimadura-8", alvo: "aplicacao", aplicavelAIds: ["penso_impermeavel"], classificacao: "inadequado", motivo: "Penso oclusivo sobre queimadura com colonização crítica retém calor e humidade excessivos, favorecendo crescimento bacteriano.", idsTemas: ["gestao-exsudado"] },
    { id: "direto-seco-queimadura-8", alvo: "aplicacao", aplicavelAIds: ["direto_seco"], classificacao: "inadequado", motivo: "Aplicar material em seco adere à queimadura e provoca dor intensa e trauma na remoção.", idsTemas: ["decisao-clinica"] },
    { id: "sem-protecao-queimadura-8", alvo: "aplicacao", aplicavelAIds: ["sem_protecao"], classificacao: "inadequado", motivo: "Queimadura extensa sem cobertura fica exposta a contaminação, perda de calor e dor incontrolada.", idsTemas: ["decisao-clinica"] },
    { id: "penso-rapido-queimadura-8", alvo: "aplicacao", aplicavelAIds: ["penso_rapido"], classificacao: "inadequado", motivo: "Penso rápido é aderente e não indicado em queimadura profunda — provoca dor intensa e trauma grave na remoção.", idsTemas: ["decisao-clinica"] },
    { id: "terapia-compressiva-queimadura-8", alvo: "aplicacao", aplicavelAIds: ["terapia_compressiva"], classificacao: "inadequado", motivo: "Terapia compressiva não tem indicação em queimadura — a etiologia não é venosa e a compressão pode comprometer a perfusão local.", idsTemas: ["decisao-clinica"] },
    { id: "ligadura-queimadura-8", alvo: "aplicacao", aplicavelAIds: ["ligadura"], classificacao: "redundante", motivo: "A ligadura pode ser usada para fixação secundária do penso, mas não resolve nenhum objetivo clínico principal desta queimadura.", idsTemas: ["decisao-clinica"] },
    ],
    zonasTecido: [
  {
    "tipoTecido": "necrose",
    "poligono": [
      {
        "x": 0.226875,
        "y": 0.3296062364857175
      },
      {
        "x": 0.224375,
        "y": 0.37148628655969046
      },
      {
        "x": 0.233125,
        "y": 0.3769489017867304
      },
      {
        "x": 0.249375,
        "y": 0.35874018436326394
      },
      {
        "x": 0.270625,
        "y": 0.34781495390918404
      },
      {
        "x": 0.295625,
        "y": 0.3623819278479572
      },
      {
        "x": 0.295625,
        "y": 0.34781495390918404
      },
      {
        "x": 0.273125,
        "y": 0.33324797997041083
      },
      {
        "x": 0.241875,
        "y": 0.3314271082280642
      },
      {
        "x": 0.233125,
        "y": 0.3314271082280642
      }
    ]
  },
  {
    "tipoTecido": "necrose",
    "poligono": [
      {
        "x": 0.138125,
        "y": 0.33324797997041083
      },
      {
        "x": 0.146875,
        "y": 0.37876977352907704
      },
      {
        "x": 0.164375,
        "y": 0.3623819278479572
      },
      {
        "x": 0.155625,
        "y": 0.3387105951974508
      },
      {
        "x": 0.145625,
        "y": 0.3314271082280642
      }
    ]
  },
  {
    "tipoTecido": "necrose",
    "poligono": [
      {
        "x": 0.343125,
        "y": 0.3405314669397974
      },
      {
        "x": 0.336875,
        "y": 0.36056105610561057
      },
      {
        "x": 0.363125,
        "y": 0.3514566973938773
      },
      {
        "x": 0.399375,
        "y": 0.36784454307499714
      },
      {
        "x": 0.406875,
        "y": 0.38969500398315693
      },
      {
        "x": 0.429375,
        "y": 0.4188289518607033
      },
      {
        "x": 0.443125,
        "y": 0.38969500398315693
      },
      {
        "x": 0.465625,
        "y": 0.40426197792193014
      },
      {
        "x": 0.484375,
        "y": 0.4188289518607033
      },
      {
        "x": 0.503125,
        "y": 0.4115454648913167
      },
      {
        "x": 0.503125,
        "y": 0.44250028451120976
      },
      {
        "x": 0.528125,
        "y": 0.4370376692841698
      },
      {
        "x": 0.529375,
        "y": 0.41518720837601003
      },
      {
        "x": 0.569375,
        "y": 0.43521679754182313
      },
      {
        "x": 0.595625,
        "y": 0.43157505405712987
      },
      {
        "x": 0.614375,
        "y": 0.39151587572550356
      },
      {
        "x": 0.629375,
        "y": 0.353277569136224
      },
      {
        "x": 0.583125,
        "y": 0.35691931262091725
      },
      {
        "x": 0.570625,
        "y": 0.36784454307499714
      },
      {
        "x": 0.569375,
        "y": 0.3878741322408103
      },
      {
        "x": 0.525625,
        "y": 0.3642027995903039
      },
      {
        "x": 0.485625,
        "y": 0.35691931262091725
      },
      {
        "x": 0.433125,
        "y": 0.353277569136224
      },
      {
        "x": 0.423125,
        "y": 0.3642027995903039
      },
      {
        "x": 0.386875,
        "y": 0.3496358256515307
      },
      {
        "x": 0.346875,
        "y": 0.3314271082280642
      }
    ]
  },
  {
    "tipoTecido": "necrose",
    "poligono": [
      {
        "x": 0.903125,
        "y": 0.4115454648913167
      },
      {
        "x": 0.869375,
        "y": 0.42429156708774324
      },
      {
        "x": 0.856875,
        "y": 0.45160464322294297
      },
      {
        "x": 0.878125,
        "y": 0.4862012063275293
      },
      {
        "x": 0.914375,
        "y": 0.4916638215545692
      },
      {
        "x": 0.938125,
        "y": 0.45160464322294297
      },
      {
        "x": 0.949375,
        "y": 0.43521679754182313
      },
      {
        "x": 0.915625,
        "y": 0.42064982360305
      },
      {
        "x": 0.910625,
        "y": 0.4097245931489701
      }
    ]
  },
  {
    "tipoTecido": "necrose",
    "poligono": [
      {
        "x": 0.770625,
        "y": 0.38969500398315693
      },
      {
        "x": 0.786875,
        "y": 0.41336633663366334
      },
      {
        "x": 0.760625,
        "y": 0.43157505405712987
      },
      {
        "x": 0.738125,
        "y": 0.44978377148059634
      },
      {
        "x": 0.715625,
        "y": 0.4297541823147832
      },
      {
        "x": 0.699375,
        "y": 0.41518720837601003
      },
      {
        "x": 0.670625,
        "y": 0.4097245931489701
      },
      {
        "x": 0.716875,
        "y": 0.3951576192101969
      },
      {
        "x": 0.726875,
        "y": 0.3769489017867304
      },
      {
        "x": 0.760625,
        "y": 0.3642027995903039
      },
      {
        "x": 0.775625,
        "y": 0.35874018436326394
      },
      {
        "x": 0.775625,
        "y": 0.38241151701377035
      }
    ]
  },
  {
    "tipoTecido": "granulacao",
    "poligono": [
      {
        "x": 0.116875,
        "y": 0.3660236713326505
      },
      {
        "x": 0.104375,
        "y": 0.4115454648913167
      },
      {
        "x": 0.111875,
        "y": 0.44250028451120976
      },
      {
        "x": 0.105625,
        "y": 0.4716342323887561
      },
      {
        "x": 0.114375,
        "y": 0.5080516672356891
      },
      {
        "x": 0.131875,
        "y": 0.5317229998861955
      },
      {
        "x": 0.176875,
        "y": 0.5207977694321156
      },
      {
        "x": 0.155625,
        "y": 0.46252987367702286
      },
      {
        "x": 0.170625,
        "y": 0.4406794127688631
      },
      {
        "x": 0.188125,
        "y": 0.4079037214066234
      },
      {
        "x": 0.196875,
        "y": 0.36966541481734383
      },
      {
        "x": 0.169375,
        "y": 0.38059064527142367
      },
      {
        "x": 0.163125,
        "y": 0.41336633663366334
      },
      {
        "x": 0.139375,
        "y": 0.39151587572550356
      },
      {
        "x": 0.119375,
        "y": 0.37148628655969046
      }
    ]
  },
  {
    "tipoTecido": "granulacao",
    "poligono": [
      {
        "x": 0.756875,
        "y": 0.715631045863207
      },
      {
        "x": 0.734375,
        "y": 0.7702571981336065
      },
      {
        "x": 0.705625,
        "y": 0.8121372482075794
      },
      {
        "x": 0.771875,
        "y": 0.8230624786616593
      },
      {
        "x": 0.839375,
        "y": 0.8303459656310459
      },
      {
        "x": 0.864375,
        "y": 0.7939285307841129
      },
      {
        "x": 0.861875,
        "y": 0.7484067372254467
      },
      {
        "x": 0.865625,
        "y": 0.6883179697280073
      },
      {
        "x": 0.844375,
        "y": 0.6701092523045408
      },
      {
        "x": 0.791875,
        "y": 0.6591840218504609
      },
      {
        "x": 0.779375,
        "y": 0.6719301240468875
      },
      {
        "x": 0.768125,
        "y": 0.7119893023785138
      },
      {
        "x": 0.763125,
        "y": 0.7174519176055537
      }
    ]
  },
  {
    "tipoTecido": "fibrina",
    "poligono": [
      {
        "x": 0.659375,
        "y": 0.5390064868555821
      },
      {
        "x": 0.681875,
        "y": 0.7138101741208603
      },
      {
        "x": 0.695625,
        "y": 0.8066746329805394
      },
      {
        "x": 0.678125,
        "y": 0.8321668373733925
      },
      {
        "x": 0.619375,
        "y": 0.8230624786616593
      },
      {
        "x": 0.566875,
        "y": 0.8230624786616593
      },
      {
        "x": 0.513125,
        "y": 0.8048537612381927
      },
      {
        "x": 0.483125,
        "y": 0.7811824285876864
      },
      {
        "x": 0.435625,
        "y": 0.7793615568453397
      },
      {
        "x": 0.424375,
        "y": 0.8012120177534995
      },
      {
        "x": 0.364375,
        "y": 0.7720780698759531
      },
      {
        "x": 0.326875,
        "y": 0.7556902241948332
      },
      {
        "x": 0.298125,
        "y": 0.7429441219984068
      },
      {
        "x": 0.276875,
        "y": 0.6956014566973939
      },
      {
        "x": 0.250625,
        "y": 0.6719301240468875
      },
      {
        "x": 0.260625,
        "y": 0.6318709457152611
      },
      {
        "x": 0.249375,
        "y": 0.5990952543530215
      },
      {
        "x": 0.238125,
        "y": 0.5663195629907818
      },
      {
        "x": 0.245625,
        "y": 0.518976897689769
      },
      {
        "x": 0.278125,
        "y": 0.4898429498122226
      },
      {
        "x": 0.299375,
        "y": 0.4588881301923296
      },
      {
        "x": 0.320625,
        "y": 0.42429156708774324
      },
      {
        "x": 0.363125,
        "y": 0.4406794127688631
      },
      {
        "x": 0.424375,
        "y": 0.47709684761579607
      },
      {
        "x": 0.488125,
        "y": 0.4679924889040628
      },
      {
        "x": 0.526875,
        "y": 0.4570672584499829
      },
      {
        "x": 0.588125,
        "y": 0.45342551496528966
      },
      {
        "x": 0.639375,
        "y": 0.45342551496528966
      },
      {
        "x": 0.659375,
        "y": 0.5244395129168089
      },
      {
        "x": 0.664375,
        "y": 0.5590360760213953
      }
    ]
  },
  {
    "tipoTecido": "epitelial",
    "poligono": [
      {
        "x": 0.854375,
        "y": 0.5736030499601684
      },
      {
        "x": 0.881875,
        "y": 0.5044099237509958
      },
      {
        "x": 0.859375,
        "y": 0.4698133606464095
      },
      {
        "x": 0.865625,
        "y": 0.40608284966427677
      },
      {
        "x": 0.839375,
        "y": 0.39151587572550356
      },
      {
        "x": 0.795625,
        "y": 0.4406794127688631
      },
      {
        "x": 0.759375,
        "y": 0.43885854102651645
      },
      {
        "x": 0.726875,
        "y": 0.4570672584499829
      },
      {
        "x": 0.694375,
        "y": 0.43157505405712987
      },
      {
        "x": 0.661875,
        "y": 0.4115454648913167
      },
      {
        "x": 0.704375,
        "y": 0.3951576192101969
      },
      {
        "x": 0.646875,
        "y": 0.37148628655969046
      },
      {
        "x": 0.639375,
        "y": 0.3969784909525435
      },
      {
        "x": 0.631875,
        "y": 0.4333959257994765
      },
      {
        "x": 0.650625,
        "y": 0.446142027995903
      },
      {
        "x": 0.650625,
        "y": 0.4679924889040628
      },
      {
        "x": 0.693125,
        "y": 0.4679924889040628
      },
      {
        "x": 0.713125,
        "y": 0.47527597587344944
      },
      {
        "x": 0.708125,
        "y": 0.5153351542050757
      },
      {
        "x": 0.691875,
        "y": 0.5608569477637418
      },
      {
        "x": 0.715625,
        "y": 0.5845282804142483
      },
      {
        "x": 0.728125,
        "y": 0.5590360760213953
      },
      {
        "x": 0.729375,
        "y": 0.5280812564015022
      },
      {
        "x": 0.784375,
        "y": 0.518976897689769
      },
      {
        "x": 0.804375,
        "y": 0.5553943325367019
      },
      {
        "x": 0.826875,
        "y": 0.5736030499601684
      },
      {
        "x": 0.801875,
        "y": 0.648258791396381
      },
      {
        "x": 0.826875,
        "y": 0.6300500739729146
      },
      {
        "x": 0.845625,
        "y": 0.580886536929555
      },
      {
        "x": 0.854375,
        "y": 0.5699613064754752
      }
    ]
  },
  {
    "tipoTecido": "epitelial",
    "poligono": [
      {
        "x": 0.154375,
        "y": 0.5353647433708888
      },
      {
        "x": 0.164375,
        "y": 0.617303971776488
      },
      {
        "x": 0.180625,
        "y": 0.6446170479116877
      },
      {
        "x": 0.189375,
        "y": 0.6009161260953682
      },
      {
        "x": 0.178125,
        "y": 0.549931717309662
      },
      {
        "x": 0.165625,
        "y": 0.5335438716285421
      },
      {
        "x": 0.158125,
        "y": 0.5335438716285421
      }
    ]
  },
  {
    "tipoTecido": "necrose",
    "poligono": [
      {
        "x": 0.075625,
        "y": 0.46070900193467623
      },
      {
        "x": 0.070625,
        "y": 0.5535734607943553
      },
      {
        "x": 0.101875,
        "y": 0.5972743826106749
      },
      {
        "x": 0.121875,
        "y": 0.6264083304882212
      },
      {
        "x": 0.135625,
        "y": 0.6537214066234209
      },
      {
        "x": 0.165625,
        "y": 0.6682883805621942
      },
      {
        "x": 0.146875,
        "y": 0.6264083304882212
      },
      {
        "x": 0.123125,
        "y": 0.5845282804142483
      },
      {
        "x": 0.129375,
        "y": 0.5353647433708888
      },
      {
        "x": 0.083125,
        "y": 0.44978377148059634
      }
    ]
  },
  {
    "tipoTecido": "necrose",
    "poligono": [
      {
        "x": 0.008125,
        "y": 0.8430920678274724
      },
      {
        "x": 0.066875,
        "y": 0.8175998634346193
      },
      {
        "x": 0.091875,
        "y": 0.8066746329805394
      },
      {
        "x": 0.043125,
        "y": 0.7429441219984068
      },
      {
        "x": 0.053125,
        "y": 0.7083475588938204
      },
      {
        "x": 0.064375,
        "y": 0.721093661090247
      },
      {
        "x": 0.089375,
        "y": 0.7757198133606464
      },
      {
        "x": 0.103125,
        "y": 0.8066746329805394
      },
      {
        "x": 0.128125,
        "y": 0.783003300330033
      },
      {
        "x": 0.116875,
        "y": 0.7538693524524867
      },
      {
        "x": 0.164375,
        "y": 0.7484067372254467
      },
      {
        "x": 0.201875,
        "y": 0.7411232502560601
      },
      {
        "x": 0.199375,
        "y": 0.7083475588938204
      },
      {
        "x": 0.174375,
        "y": 0.7010640719244339
      },
      {
        "x": 0.155625,
        "y": 0.7192727893479003
      },
      {
        "x": 0.153125,
        "y": 0.6937805849550472
      },
      {
        "x": 0.190625,
        "y": 0.6737509957892341
      },
      {
        "x": 0.205625,
        "y": 0.6646466370775008
      },
      {
        "x": 0.224375,
        "y": 0.6883179697280073
      },
      {
        "x": 0.243125,
        "y": 0.7083475588938204
      },
      {
        "x": 0.229375,
        "y": 0.7411232502560601
      },
      {
        "x": 0.215625,
        "y": 0.7647945829065665
      },
      {
        "x": 0.210625,
        "y": 0.7702571981336065
      },
      {
        "x": 0.226875,
        "y": 0.7993911460111528
      },
      {
        "x": 0.203125,
        "y": 0.7702571981336065
      },
      {
        "x": 0.184375,
        "y": 0.7811824285876864
      },
      {
        "x": 0.145625,
        "y": 0.8103163764652327
      },
      {
        "x": 0.110625,
        "y": 0.8321668373733925
      },
      {
        "x": 0.063125,
        "y": 0.850375554796859
      },
      {
        "x": 0.030625,
        "y": 0.8594799135085922
      },
      {
        "x": 0.008125,
        "y": 0.8394503243427791
      }
    ]
  }
    ],
    idsTemas: ["biofilme", "antimicrobianos", "desbridamento", "tecidos-e-leito", "decisao-clinica"],
    planoRecomendado: {
    minimo: ["Limpeza suave com octenilin solução", "Controlo do biofilme com octenilin gel", "Cobertura com sulfadiazina de prata", "Desbridamento do esfacelo e escara (colagenase)", "Penso simples protetor"],
    otimizado: ["Limpeza suave com octenilin solução", "Controlo do biofilme com octenilin gel (ou L-Mesitran como alternativa)", "Cobertura com sulfadiazina de prata", "Desbridamento do esfacelo e escara (colagenase)", "Cobertura com prata em apósito sobre o leito", "Penso simples protetor", "Controlo da dor antes e durante o penso"],
    },
  },
  // ─── Caso 9 ───────────────────────────────────────────────────────────────────
  {
    id: "9",
    slug: "9",
    tituloAbreviado: "Caso 9",
    titulo: "Úlcera diabética",
    descricao: "Treinar reconhecimento de lesão plantar pequena mas profunda em pé diabético — descarga de pressão e cobertura proporcional.",
    competencias: "Avaliação de lesão plantar, reconhecimento de profundidade desproporcional ao tamanho, descarga, cobertura adequada",
    dificuldade: "intermedio",
    ordem: 9,
    minutosEstimados: 10,
    status: "disponivel",
    srcImagem: "/caso9.jpg",
    altImagem: "Lesão plantar lateral em pé diabético — © Medetec Medical Images (medetec.co.uk)",
    resumoIntro: "Utente diabético com pequena lesão plantar lateral aparentemente superficial mas com profundidade desproporcionada.",
    objetivo: "Identificar lesão plantar profunda em pé diabético, instituir cobertura adequada e referir descarga.",
    definicoesObservacao: observationDefinitions,
    promptsDialogo: dialoguePrompts,
    definicoesAplicacao: applicationDefinitions,
    objetivosVisuais: { tecidos: ["fibrina"], exsudado: ["seroso"], bordos: ["integra"] },
    tituloCenario: "Lesão plantar do pé diabético",
    contextoPaciente: "Utente de 64 anos com diabetes mellitus tipo 2 mal controlada, neuropatia periférica conhecida, lesão plantar lateral notada há 3 semanas.",
    bannerPaciente: "Lesão plantar lateral em pé diabético — © Medetec Medical Images (medetec.co.uk)",
    estadoFerida: { exsudado: "escasso", infeccao: "contaminacao", tecido: "fibrina", perilesional: "integra", odor: "ausente" },
    variavelFerida: { exsudado: 2, infeccao: 0, tecido: 2, odor: 0, humidade: 2, profundidade: 3, bordos: 2, pele_perilesional: 4, dor: 0, hemorragia: 0, etiologia: 4, perfusao: 1 },
    detalhesObservacao: {
    imagem: { detalhe: "Pequena lesão arredondada na face lateral do pé com bordos definidos e leito amarelado profundo." },
    dimensoes: { detalhe: "≈1×1 cm de abertura visível mas profundidade significativa — sondagem revela cavidade." },
    exsudado: { detalhe: "Ligeiro, transparente." },
    cheiro: { detalhe: "Sem odor." },
    tecidos: { detalhe: "Leito amarelado em profundidade; bordos com calo à volta." },
    bordos: { detalhe: "Bordos irregulares, com calo à volta da abertura." },
    pele_perilesional: { detalhe: "Pele íntegra com calo plantar; sem maceração nem vermelhidão marcada." },
    },
    respostasDialogo: {
    dor: "Não me dói nada — nem sequer reparei na ferida no início.",
    duracao: "Notei há cerca de 3 semanas, quando a meia ficou suja.",
    posicao: "Continuo a andar normalmente. Trabalho em pé.",
    pensos: "Tenho posto compressas e adesivo. Mudo todos os dias.",
    febre: "Não tive febre.",
    mobilidade: "Mexo-me bem, ando o dia todo.",
    },
    tratamentosDisponiveis: [
    "cloreto-sodio", "octenilin-solucao",
    "betadine-solucao", "octiset",
    "colagenase",
    "aquacel", "alginato-calcio", "exufiber",
    "mepilex", "allevyn",
    "varihesive-extra-fino",
    "hidrogel",
    "agua-oxigenada", "alcool-etilico",
    ],
    opcoesAplicacao: ["penso_simples", "penso_impermeavel", "ligadura", "terapia_compressiva", "direto_seco", "sem_protecao", "penso_rapido"],
    objetivosClinicosAlvo: [
    goal("cleanse", "Limpar e irrigar o leito profundo", "limpar-ferida", "essencial",
    "Soro fisiológico para irrigação que alcance a cavidade. Octenidina é alternativa razoável.",
    { idsTratamento: ["cloreto-sodio", "octenilin-solucao"] }, ["decisao-clinica", "antimicrobianos"]),
    goal("desbridamento", "Desbridar a fibrina presente", "desbridamento", "essencial",
    "A fibrina interfere com cicatrização — colagenase é o desbridante enzimático adequado em pé diabético sem isquemia significativa.",
    { idsTratamento: ["colagenase"] }, ["desbridamento", "tecidos-e-leito"]),
    goal("fill-cavity", "Preencher a cavidade com material absorvente", "controlar-exsudado", "essencial",
    "Lesão plantar profunda em pé diabético exige preenchimento da cavidade — hidrofibra ou alginato moldam-se ao espaço sem deixar áreas sem contacto.",
    { idsTratamento: ["aquacel", "alginato-calcio", "exufiber"] }, ["gestao-exsudado", "escolha-do-penso"]),
    goal("secondary-cover", "Cobertura secundária absorvente", "controlar-exsudado", "essencial",
    "Espuma absorvente sobre o material primário.",
    { idsTratamento: ["mepilex", "allevyn"] }, ["gestao-exsudado", "escolha-do-penso"]),
    goal("app-cover", "Penso simples protetor", "cobertura-atraumatica", "essencial",
    "Penso simples protetor — descarga de pressão é referida no plano mas exige outros recursos (palmilha, calçado).",
    { idsAplicacao: ["penso_simples"] }, ["decisao-clinica"]),
    ],
    regrasAvaliacao: [
    { id: "antiseticos-c9", alvo: "tratamento", aplicavelAIds: ["betadine-solucao", "octiset"], classificacao: "redundante",
    motivo: "Sem sinais de infeção, antissépticos clássicos não estão indicados — soro ou octenidina são suficientes.",
    idsTemas: ["antimicrobianos"] },
    { id: "hidrocoloide-c9", alvo: "tratamento", aplicavelAIds: ["varihesive-extra-fino"], classificacao: "inadequado",
    motivo: "Hidrocolóide fino não preenche cavidade nem absorve adequadamente — inadequado para lesão plantar profunda.",
    idsTemas: ["escolha-do-penso", "gestao-exsudado"] },
    { id: "hidrogel-c9", alvo: "tratamento", aplicavelAIds: ["hidrogel"], classificacao: "redundante",
    motivo: "Hidrogel pode ajudar a amolecer fibrina mas em cavidade com exsudado próprio é desproporcionado — colagenase é mais eficaz.",
    idsTemas: ["desbridamento"] },
    { id: "agua-oxigenada-c9", alvo: "tratamento", aplicavelAIds: ["agua-oxigenada"], classificacao: "inadequado",
    motivo: "A água oxigenada é citotóxica e contraindicada.",
    idsTemas: ["antimicrobianos"] },
    { id: "alcool-c9", alvo: "tratamento", aplicavelAIds: ["alcool-etilico"], classificacao: "inadequado",
    motivo: "O álcool destrói tecido viável.",
    idsTemas: ["antimicrobianos"] },
    { id: "compressiva-c9", alvo: "aplicacao", aplicavelAIds: ["terapia_compressiva"], classificacao: "inadequado",
    motivo: "Terapia compressiva não está indicada em pé diabético — sem avaliação de perfusão pode ser perigosa.",
    idsTemas: ["decisao-clinica"] },
    { id: "ligadura-c9", alvo: "aplicacao", aplicavelAIds: ["ligadura"], classificacao: "inadequado",
    motivo: "Ligadura compressiva não está indicada em pé diabético sem avaliação vascular.",
    idsTemas: ["decisao-clinica"] },
    { id: "direto-seco-c9", alvo: "aplicacao", aplicavelAIds: ["direto_seco"], classificacao: "inadequado",
    motivo: "Material a seco adere ao leito profundo.",
    idsTemas: ["decisao-clinica"] },
    { id: "sem-protecao-c9", alvo: "aplicacao", aplicavelAIds: ["sem_protecao"], classificacao: "inadequado",
    motivo: "Sem cobertura, risco de contaminação aumenta — em pé diabético é particularmente perigoso.",
    idsTemas: ["decisao-clinica"] },
    { id: "penso-rapido-c9", alvo: "aplicacao", aplicavelAIds: ["penso_rapido"], classificacao: "inadequado",
    motivo: "Penso rápido aderente é insuficiente para lesão profunda.",
    idsTemas: ["decisao-clinica"] },
    ],
    zonasTecido: [
  {
    "tipoTecido": "fibrina",
    "poligono": [
      {
        "x": 0.495625,
        "y": 0.4978151945933349
      },
      {
        "x": 0.486875,
        "y": 0.5127301328361688
      },
      {
        "x": 0.489375,
        "y": 0.5406956420414821
      },
      {
        "x": 0.504375,
        "y": 0.555610580284316
      },
      {
        "x": 0.514375,
        "y": 0.531373805639711
      },
      {
        "x": 0.510625,
        "y": 0.5052726637147518
      },
      {
        "x": 0.498125,
        "y": 0.4978151945933349
      }
    ]
  }
    ],
    idsTemas: ["tecidos-e-leito", "desbridamento", "gestao-exsudado", "escolha-do-penso", "decisao-clinica", "sinais-de-alarme"],
    planoRecomendado: {
    minimo: ["Limpeza com soro fisiológico", "Desbridamento enzimático", "Hidrofibra/alginato no leito", "Cobertura secundária", "Penso simples"],
    otimizado: ["Limpeza com soro fisiológico (ou octenilin) — irrigar a cavidade", "Desbridamento enzimático da fibrina (colagenase)", "Preenchimento com hidrofibra ou alginato (Aquacel, Alginato Cálcio, Exufiber)", "Cobertura secundária absorvente (Mepilex, Allevyn)", "Penso simples protetor", "Descarga de pressão IMPRESCINDÍVEL — referir para palmilha/calçado adequado e avaliação podológica", "Avaliar perfusão (índice tornozelo-braço) e estado glicémico — pé diabético exige abordagem multidisciplinar"],
    },
  },
  // ─── Caso 10 ──────────────────────────────────────────────────────────────────
  {
    id: "10",
    slug: "10",
    tituloAbreviado: "Caso 10",
    titulo: "Laceração cutânea",
    descricao: "Treinar abordagem a skin tear em pele frágil — proteção atraumática e cobertura adequada.",
    competencias: "Reconhecimento de skin tear, classificação ISTAP, escolha de cobertura atraumática",
    dificuldade: "introdutorio",
    ordem: 10,
    minutosEstimados: 8,
    status: "disponivel",
    srcImagem: "/caso10.jpg",
    altImagem: "Skin tear em pele frágil — © Medetec Medical Images (medetec.co.uk)",
    resumoIntro: "Utente idoso com skin tear no dorso da mão após pequeno trauma.",
    objetivo: "Identificar skin tear, escolher cobertura atraumática que respeite a pele frágil.",
    definicoesObservacao: observationDefinitions,
    promptsDialogo: dialoguePrompts,
    definicoesAplicacao: applicationDefinitions,
    objetivosVisuais: { tecidos: ["granulacao"], exsudado: ["seroso", "hematico"], bordos: ["pele-seca"] },
    tituloCenario: "Laceração em pele geriátrica",
    contextoPaciente: "Utente de 82 anos com pele frágil por idade e corticoterapia crónica, lesão após pequeno trauma há 2 dias.",
    bannerPaciente: "Skin tear geriátrica — © Medetec Medical Images (medetec.co.uk)",
    estadoFerida: { exsudado: "escasso", infeccao: "contaminacao", tecido: "granulacao", perilesional: "fragil", odor: "ausente" },
    variavelFerida: { exsudado: 2, infeccao: 0, tecido: 3, odor: 0, humidade: 2, profundidade: 1, bordos: 2, pele_perilesional: 2, dor: 2, hemorragia: 1, etiologia: 5, perfusao: 1 },
    detalhesObservacao: {
    imagem: { detalhe: "Lesão ovalada no dorso da mão, leito vermelho-escuro com áreas pálidas, bordos irregulares e flap cutâneo parcialmente preservado." },
    dimensoes: { detalhe: "≈3×4 cm; superficial." },
    exsudado: { detalhe: "Ligeiro, transparente e rosado." },
    cheiro: { detalhe: "Sem odor." },
    tecidos: { detalhe: "Leito superficial, avermelhado com áreas pálidas; flap cutâneo parcialmente preservado e reaproximável." },
    bordos: { detalhe: "Bordos irregulares, com flap cutâneo periférico." },
    pele_perilesional: { detalhe: "Pele frágil, fina e descamativa." },
    },
    respostasDialogo: {
    dor: "Dói um pouco — uns 3 em 10. Sensível ao toque.",
    duracao: "Foi há 2 dias. Bati com a mão na esquina da mesa.",
    posicao: "Tenho cuidado com a mão, evito bater.",
    pensos: "Pus uma compressa com adesivo. Dói quando tiro.",
    febre: "Não tive febre.",
    mobilidade: "Mexo-me bem, é só uma mão que evito usar.",
    },
    tratamentosDisponiveis: [
    "cloreto-sodio", "octenilin-solucao",
    "betadine-solucao", "octiset",
    "urgotul",
    "mepilex", "allevyn-nao-adesivo",
    "varihesive-extra-fino",
    "aquacel", "alginato-calcio",
    "hidrogel",
    "agua-oxigenada", "alcool-etilico",
    ],
    opcoesAplicacao: ["penso_simples", "penso_impermeavel", "ligadura", "terapia_compressiva", "direto_seco", "sem_protecao", "penso_rapido"],
    objetivosClinicosAlvo: [
    goal("cleanse", "Limpar suavemente o leito", "limpar-ferida", "essencial",
    "Soro fisiológico para limpeza muito suave que respeita a pele frágil. Octenidina é alternativa razoável.",
    { idsTratamento: ["cloreto-sodio", "octenilin-solucao"] }, ["decisao-clinica", "antimicrobianos"]),
    goal("cobertura-atraumatica", "Cobertura atraumática", "cobertura-atraumatica", "essencial",
    "Skin tear exige cobertura que NÃO adira ao leito nem à pele peri-lesional — contacto não-aderente (Urgotul) ou espuma de silicone (Mepilex, Allevyn não-adesivo) são as escolhas de eleição.",
    { idsTratamento: ["urgotul", "mepilex", "allevyn-nao-adesivo"] }, ["escolha-do-penso", "fixacao-e-remocao"]),
    goal("app-cover", "Penso simples protetor", "cobertura-atraumatica", "essencial",
    "Penso simples protetor — sem adesivo direto na pele frágil.",
    { idsAplicacao: ["penso_simples"] }, ["decisao-clinica"]),
    ],
    regrasAvaliacao: [
    { id: "antiseticos-c10", alvo: "tratamento", aplicavelAIds: ["betadine-solucao", "octiset"], classificacao: "redundante",
    motivo: "Sem sinais de infeção, antissépticos clássicos não estão indicados em skin tear — citotoxicidade pode atrasar epitelização em pele frágil.",
    idsTemas: ["antimicrobianos"] },
    { id: "hidrocoloide-c10", alvo: "tratamento", aplicavelAIds: ["varihesive-extra-fino"], classificacao: "redundante",
    motivo: "Hidrocolóide adesivo pode arrancar pele frágil peri-lesional na remoção — preferir contacto não-aderente.",
    idsTemas: ["escolha-do-penso", "fixacao-e-remocao"] },
    { id: "alginatos-c10", alvo: "tratamento", aplicavelAIds: ["aquacel", "alginato-calcio"], classificacao: "redundante",
    motivo: "Hidrofibra/alginato são desproporcionados para exsudado ligeiro em skin tear superficial — sobre-secam o leito.",
    idsTemas: ["gestao-exsudado", "escolha-do-penso"] },
    { id: "hidrogel-c10", alvo: "tratamento", aplicavelAIds: ["hidrogel"], classificacao: "inadequado",
    motivo: "Adicionar humidade pode macerar o flap cutâneo.",
    idsTemas: ["gestao-exsudado"] },
    { id: "agua-oxigenada-c10", alvo: "tratamento", aplicavelAIds: ["agua-oxigenada"], classificacao: "inadequado",
    motivo: "Citotóxica — particularmente prejudicial em pele frágil.",
    idsTemas: ["antimicrobianos"] },
    { id: "alcool-c10", alvo: "tratamento", aplicavelAIds: ["alcool-etilico"], classificacao: "inadequado",
    motivo: "O álcool destrói tecido viável.",
    idsTemas: ["antimicrobianos"] },
    { id: "compressiva-c10", alvo: "aplicacao", aplicavelAIds: ["terapia_compressiva"], classificacao: "inadequado",
    motivo: "Terapia compressiva não está indicada em skin tear da mão.",
    idsTemas: ["decisao-clinica"] },
    { id: "ligadura-c10", alvo: "aplicacao", aplicavelAIds: ["ligadura"], classificacao: "inadequado",
    motivo: "Ligadura compressiva não está indicada.",
    idsTemas: ["decisao-clinica"] },
    { id: "direto-seco-c10", alvo: "aplicacao", aplicavelAIds: ["direto_seco"], classificacao: "inadequado",
    motivo: "Material a seco adere ao leito e arranca o flap cutâneo na remoção.",
    idsTemas: ["decisao-clinica", "fixacao-e-remocao"] },
    { id: "sem-protecao-c10", alvo: "aplicacao", aplicavelAIds: ["sem_protecao"], classificacao: "inadequado",
    motivo: "Skin tear exposta perde o flap viável e infeta-se.",
    idsTemas: ["decisao-clinica"] },
    { id: "penso-rapido-c10", alvo: "aplicacao", aplicavelAIds: ["penso_rapido"], classificacao: "inadequado",
    motivo: "Penso rápido aderente arranca pele frágil — particularmente perigoso em skin tear.",
    idsTemas: ["decisao-clinica", "fixacao-e-remocao"] },
    ],
    zonasTecido: [
  {
    "tipoTecido": "fibrina",
    "poligono": [
      {
        "x": 0.408125,
        "y": 0.5404168634860652
      },
      {
        "x": 0.400625,
        "y": 0.591432451582428
      },
      {
        "x": 0.386875,
        "y": 0.6084376476145489
      },
      {
        "x": 0.371875,
        "y": 0.6027692489371752
      },
      {
        "x": 0.354375,
        "y": 0.5460852621634388
      },
      {
        "x": 0.375625,
        "y": 0.5460852621634388
      },
      {
        "x": 0.396875,
        "y": 0.5517536608408125
      },
      {
        "x": 0.406875,
        "y": 0.5441957959376477
      }
    ]
  },
  {
    "tipoTecido": "granulacao",
    "poligono": [
      {
        "x": 0.334375,
        "y": 0.4723960793575815
      },
      {
        "x": 0.319375,
        "y": 0.5404168634860652
      },
      {
        "x": 0.345625,
        "y": 0.5725377893245158
      },
      {
        "x": 0.371875,
        "y": 0.6311112423240435
      },
      {
        "x": 0.385625,
        "y": 0.6537848370335381
      },
      {
        "x": 0.414375,
        "y": 0.6537848370335381
      },
      {
        "x": 0.421875,
        "y": 0.5989903164855929
      },
      {
        "x": 0.413125,
        "y": 0.5800956542276807
      },
      {
        "x": 0.396875,
        "y": 0.6065481813887577
      },
      {
        "x": 0.375625,
        "y": 0.6103271138403401
      },
      {
        "x": 0.359375,
        "y": 0.5800956542276807
      },
      {
        "x": 0.353125,
        "y": 0.5460852621634388
      },
      {
        "x": 0.361875,
        "y": 0.5347484648086915
      },
      {
        "x": 0.381875,
        "y": 0.5366379310344828
      },
      {
        "x": 0.409375,
        "y": 0.5404168634860652
      },
      {
        "x": 0.418125,
        "y": 0.5366379310344828
      },
      {
        "x": 0.419375,
        "y": 0.5139643363249882
      },
      {
        "x": 0.411875,
        "y": 0.48184341048653756
      },
      {
        "x": 0.414375,
        "y": 0.4516119508738781
      },
      {
        "x": 0.439375,
        "y": 0.4516119508738781
      },
      {
        "x": 0.455625,
        "y": 0.46483821445441664
      },
      {
        "x": 0.476875,
        "y": 0.4761750118091639
      },
      {
        "x": 0.504375,
        "y": 0.4894012753897024
      },
      {
        "x": 0.518125,
        "y": 0.45916981577704297
      },
      {
        "x": 0.523125,
        "y": 0.43649622106754843
      },
      {
        "x": 0.530625,
        "y": 0.4194910250354275
      },
      {
        "x": 0.530625,
        "y": 0.3817017005196032
      },
      {
        "x": 0.513125,
        "y": 0.3571386395843174
      },
      {
        "x": 0.500625,
        "y": 0.3363545111006141
      },
      {
        "x": 0.491875,
        "y": 0.33257557864903164
      },
      {
        "x": 0.481875,
        "y": 0.35902810581010863
      },
      {
        "x": 0.465625,
        "y": 0.36091757203589986
      },
      {
        "x": 0.448125,
        "y": 0.3684754369390647
      },
      {
        "x": 0.438125,
        "y": 0.3684754369390647
      },
      {
        "x": 0.429375,
        "y": 0.40437529522909776
      },
      {
        "x": 0.408125,
        "y": 0.40248582900330654
      },
      {
        "x": 0.389375,
        "y": 0.41004369390647144
      },
      {
        "x": 0.363125,
        "y": 0.4402751535191308
      },
      {
        "x": 0.363125,
        "y": 0.47050661313179026
      },
      {
        "x": 0.358125,
        "y": 0.5101854038734057
      },
      {
        "x": 0.340625,
        "y": 0.5082959376476146
      },
      {
        "x": 0.339375,
        "y": 0.4723960793575815
      },
      {
        "x": 0.320625,
        "y": 0.46861714690599904
      }
    ]
  }
    ],
    idsTemas: ["tecidos-e-leito", "escolha-do-penso", "fixacao-e-remocao", "decisao-clinica"],
    planoRecomendado: {
    minimo: ["Limpeza com soro fisiológico", "Reaproximação do flap se viável", "Cobertura atraumática (silicone ou contacto não-aderente)", "Penso simples"],
    otimizado: ["Limpeza com soro fisiológico (ou octenilin)", "Reaproximação do flap cutâneo se ainda viável", "Cobertura atraumática — Urgotul, Mepilex ou Allevyn não-adesivo", "Penso simples sem adesivo direto na pele frágil", "Marcar seta na cobertura indicando direção de remoção (ISTAP)", "Avaliar prevenção de novos skin tears: hidratação cutânea, calçar mangas/protetores, ajuste da medicação se possível"],
    },
  },
  // ─── Caso 11 ──────────────────────────────────────────────────────────────────
  {
    id: "11",
    slug: "11",
    tituloAbreviado: "Caso 11",
    titulo: "Ferida iatrogénica",
    descricao: "Treinar abordagem a ferida pós-extravasação em fase de granulação — cobertura proporcional sem agressividade.",
    competencias: "Reconhecimento de ferida iatrogénica, gestão de ferida em granulação, cobertura proporcional",
    dificuldade: "intermedio",
    ordem: 11,
    minutosEstimados: 9,
    status: "disponivel",
    srcImagem: "/caso11.jpg",
    altImagem: "Ferida por extravasação em granulação — © Medetec Medical Images (medetec.co.uk)",
    resumoIntro: "Utente com ferida no dorso da mão por extravasação de fluido endovenoso, agora em fase de granulação avançada.",
    objetivo: "Manter cobertura adequada que respeite tecido em granulação sem trauma na pele frágil peri-lesional.",
    definicoesObservacao: observationDefinitions,
    promptsDialogo: dialoguePrompts,
    definicoesAplicacao: applicationDefinitions,
    objetivosVisuais: { tecidos: ["granulacao"], exsudado: ["seroso"], bordos: ["integra"] },
    tituloCenario: "Ferida por extravasação",
    contextoPaciente: "Utente de 78 anos com ferida iatrogénica no dorso da mão por extravasação venosa há 3 semanas. Em fase de granulação avançada.",
    bannerPaciente: "Ferida por extravasação — © Medetec Medical Images (medetec.co.uk)",
    estadoFerida: { exsudado: "moderado", infeccao: "contaminacao", tecido: "granulacao", perilesional: "integra", odor: "ausente" },
    variavelFerida: { exsudado: 3, infeccao: 0, tecido: 3, odor: 0, humidade: 3, profundidade: 2, bordos: 3, pele_perilesional: 2, dor: 1, hemorragia: 0, etiologia: 5, perfusao: 1 },
    detalhesObservacao: {
    imagem: { detalhe: "Ferida ovalada no dorso da mão, leito todo em granulação vermelho-vivo brilhante." },
    dimensoes: { detalhe: "≈4×3 cm; profundidade moderada — em retração." },
    exsudado: { detalhe: "Moderado, transparente." },
    cheiro: { detalhe: "Sem odor." },
    tecidos: { detalhe: "Leito todo avermelhado; sem zonas amareladas nem pretas." },
    bordos: { detalhe: "Bordos regulares, em retração progressiva." },
    pele_perilesional: { detalhe: "Pele frágil e descamativa em redor." },
    },
    respostasDialogo: {
    dor: "Já não me dói praticamente — uns 1 em 10.",
    duracao: "Há cerca de 3 semanas saiu o soro do veia e fez-me um buraco. Está a fechar.",
    posicao: "Tento não pressionar a mão.",
    pensos: "Têm-me posto uma compressa simples com adesivo. Mudo de 2 em 2 dias.",
    febre: "Não tive febre.",
    mobilidade: "Mexo bem a outra mão. Esta evito usar.",
    },
    tratamentosDisponiveis: [
    "cloreto-sodio", "octenilin-solucao",
    "betadine-solucao", "octiset",
    "aquacel", "alginato-calcio", "exufiber",
    "mepilex", "allevyn-nao-adesivo",
    "urgotul",
    "varihesive-extra-fino",
    "hidrogel",
    "agua-oxigenada", "alcool-etilico",
    ],
    opcoesAplicacao: ["penso_simples", "penso_impermeavel", "ligadura", "terapia_compressiva", "direto_seco", "sem_protecao", "penso_rapido"],
    objetivosClinicosAlvo: [
    goal("cleanse", "Limpar o leito antes da cobertura", "limpar-ferida", "essencial",
    "Soro fisiológico para limpeza suave. Octenidina é alternativa razoável.",
    { idsTratamento: ["cloreto-sodio", "octenilin-solucao"] }, ["decisao-clinica", "antimicrobianos"]),
    goal("absorbent-proportional", "Material absorvente proporcional", "controlar-exsudado", "essencial",
    "Em ferida em granulação com exsudado moderado, hidrofibra ou alginato dão controlo adequado.",
    { idsTratamento: ["aquacel", "alginato-calcio", "exufiber"] }, ["gestao-exsudado", "escolha-do-penso"]),
    goal("cobertura-atraumatica", "Cobertura atraumática para pele frágil", "cobertura-atraumatica", "essencial",
    "Pele peri-lesional frágil exige cobertura sem adesivo direto — silicone (Mepilex, Allevyn não-adesivo) ou contacto não-aderente (Urgotul).",
    { idsTratamento: ["mepilex", "allevyn-nao-adesivo", "urgotul"] }, ["escolha-do-penso"]),
    goal("app-cover", "Penso simples protetor", "cobertura-atraumatica", "essencial",
    "Penso simples protetor.",
    { idsAplicacao: ["penso_simples"] }, ["decisao-clinica"]),
    ],
    regrasAvaliacao: [
    { id: "antiseticos-c11", alvo: "tratamento", aplicavelAIds: ["betadine-solucao", "octiset"], classificacao: "redundante",
    motivo: "Sem sinais de infeção, antissépticos clássicos não estão indicados — em granulação podem atrasar a evolução.",
    idsTemas: ["antimicrobianos"] },
    { id: "hidrocoloide-c11", alvo: "tratamento", aplicavelAIds: ["varihesive-extra-fino"], classificacao: "redundante",
    motivo: "Hidrocolóide adesivo pode arrancar pele frágil peri-lesional na remoção — preferir contacto não-aderente.",
    idsTemas: ["escolha-do-penso"] },
    { id: "hidrogel-c11", alvo: "tratamento", aplicavelAIds: ["hidrogel"], classificacao: "inadequado",
    motivo: "Adicionar humidade em ferida em granulação com exsudado é contraproducente.",
    idsTemas: ["gestao-exsudado"] },
    { id: "agua-oxigenada-c11", alvo: "tratamento", aplicavelAIds: ["agua-oxigenada"], classificacao: "inadequado",
    motivo: "Citotóxica.",
    idsTemas: ["antimicrobianos"] },
    { id: "alcool-c11", alvo: "tratamento", aplicavelAIds: ["alcool-etilico"], classificacao: "inadequado",
    motivo: "O álcool destrói tecido viável.",
    idsTemas: ["antimicrobianos"] },
    { id: "compressiva-c11", alvo: "aplicacao", aplicavelAIds: ["terapia_compressiva"], classificacao: "inadequado",
    motivo: "Terapia compressiva não está indicada em ferida do dorso da mão.",
    idsTemas: ["decisao-clinica"] },
    { id: "ligadura-c11", alvo: "aplicacao", aplicavelAIds: ["ligadura"], classificacao: "inadequado",
    motivo: "Ligadura compressiva não está indicada nesta região.",
    idsTemas: ["decisao-clinica"] },
    { id: "direto-seco-c11", alvo: "aplicacao", aplicavelAIds: ["direto_seco"], classificacao: "inadequado",
    motivo: "Material a seco adere ao leito em granulação e arranca tecido na remoção.",
    idsTemas: ["decisao-clinica"] },
    { id: "sem-protecao-c11", alvo: "aplicacao", aplicavelAIds: ["sem_protecao"], classificacao: "inadequado",
    motivo: "Sem cobertura, ferida em granulação fica exposta.",
    idsTemas: ["decisao-clinica"] },
    { id: "penso-rapido-c11", alvo: "aplicacao", aplicavelAIds: ["penso_rapido"], classificacao: "inadequado",
    motivo: "Penso rápido aderente arranca pele frágil.",
    idsTemas: ["decisao-clinica"] },
    ],
    zonasTecido: [
  {
    "tipoTecido": "granulacao",
    "poligono": [
      {
        "x": 0.221875,
        "y": 0.4414742451154529
      },
      {
        "x": 0.201875,
        "y": 0.49452338661930134
      },
      {
        "x": 0.216875,
        "y": 0.5589402013025458
      },
      {
        "x": 0.239375,
        "y": 0.5949378330373002
      },
      {
        "x": 0.285625,
        "y": 0.6138839550029603
      },
      {
        "x": 0.330625,
        "y": 0.6214624037892243
      },
      {
        "x": 0.371875,
        "y": 0.6176731793960923
      },
      {
        "x": 0.398125,
        "y": 0.6082001184132623
      },
      {
        "x": 0.451875,
        "y": 0.6138839550029603
      },
      {
        "x": 0.473125,
        "y": 0.5873593842510361
      },
      {
        "x": 0.500625,
        "y": 0.5475725281231498
      },
      {
        "x": 0.528125,
        "y": 0.49073416222616933
      },
      {
        "x": 0.543125,
        "y": 0.45852575488454705
      },
      {
        "x": 0.539375,
        "y": 0.42821195973949083
      },
      {
        "x": 0.508125,
        "y": 0.4054766133806986
      },
      {
        "x": 0.468125,
        "y": 0.3732682060390764
      },
      {
        "x": 0.429375,
        "y": 0.3524274718768502
      },
      {
        "x": 0.388125,
        "y": 0.33537596210775605
      },
      {
        "x": 0.348125,
        "y": 0.3543220840734162
      },
      {
        "x": 0.320625,
        "y": 0.39221432800473655
      },
      {
        "x": 0.288125,
        "y": 0.4111604499703967
      },
      {
        "x": 0.251875,
        "y": 0.43389579632918884
      },
      {
        "x": 0.224375,
        "y": 0.447158081705151
      }
    ]
  }
    ],
    idsTemas: ["tecidos-e-leito", "gestao-exsudado", "escolha-do-penso", "decisao-clinica"],
    planoRecomendado: {
    minimo: ["Limpeza com soro fisiológico", "Hidrofibra/alginato no leito", "Cobertura atraumática", "Penso simples"],
    otimizado: ["Limpeza com soro fisiológico (ou octenilin)", "Hidrofibra ou alginato no leito (Aquacel, Alginato Cálcio, Exufiber)", "Cobertura atraumática que respeita pele frágil peri-lesional (Mepilex, Allevyn não-adesivo, Urgotul)", "Penso simples sem adesivo direto na pele frágil", "Vigiar evolução e ajustar cobertura à medida que ferida retrai"],
    },
  },
  // ─── Caso 12 ──────────────────────────────────────────────────────────────────
  {
    id: "12",
    slug: "12",
    tituloAbreviado: "Caso 12",
    titulo: "Úlcera venosa",
    descricao: "Treinar reconhecimento de penso insuficiente para o nível de exsudado e gestão de maceração peri-lesional.",
    competencias: "Avaliação de exsudado, escolha proporcional do material absorvente, proteção peri-lesional, terapia compressiva",
    dificuldade: "intermedio",
    ordem: 12,
    minutosEstimados: 12,
    status: "disponivel",
    srcImagem: "/caso12.jpg",
    altImagem: "Úlcera venosa com penso saturado e maceração peri-lesional — © Medetec Medical Images (medetec.co.uk)",
    resumoIntro: "Utente com úlcera venosa de longa duração, exsudado muito superior ao que o penso atual consegue absorver.",
    objetivo: "Identificar inadequação do material atual, selecionar penso absorvente proporcional ao exsudado, proteger pele peri-lesional e instituir compressão.",
    definicoesObservacao: observationDefinitions,
    promptsDialogo: dialoguePrompts,
    definicoesAplicacao: applicationDefinitions,
    objetivosVisuais: { tecidos: ["granulacao"], exsudado: ["seroso"], bordos: ["maceracao"] },
    tituloCenario: "Úlcera venosa com maceração perilesional",
    contextoPaciente: "Utente de 72 anos, úlcera de perna com mais de 6 meses de evolução, com história de IVC e edema dos membros inferiores. Sem sinais de infeção sistémica.",
    bannerPaciente: "Úlcera venosa exsudativa com maceração — © Medetec Medical Images (medetec.co.uk)",
    estadoFerida: { exsudado: "abundante", infeccao: "contaminacao", tecido: "granulacao", perilesional: "macerada", odor: "ligeiro" },
    variavelFerida: { exsudado: 4, infeccao: 0, tecido: 3, odor: 1, humidade: 4, profundidade: 2, bordos: 2, pele_perilesional: 1, dor: 2, hemorragia: 0, etiologia: 2, perfusao: 1 },
    detalhesObservacao: {
    imagem: { detalhe: "Úlcera de perna com leito vermelho-vivo brilhante, área peri-lesional extensa eritematosa e descamativa, com penso de espuma (Lyofoam) saturado e parcialmente destacado." },
    dimensoes: { detalhe: "≈10×6 cm visíveis no leito; área de maceração peri-lesional estende-se vários cm para além dos bordos da ferida." },
    exsudado: { detalhe: "Abundante, turvo — penso saturado e a extravasar." },
    cheiro: { detalhe: "Ligeiro odor presente." },
    tecidos: { detalhe: "Leito predominantemente avermelhado com áreas isoladas mais pálidas." },
    bordos: { detalhe: "Bordos esbranquiçados e amolecidos." },
    pele_perilesional: { detalhe: "Esbranquiçada e amolecida em redor, com zonas avermelhadas e descamativas." },
    },
    respostasDialogo: {
    dor: "A perna anda muito incomodada — uns 4 ou 5 em 10. Pior quando o penso está cheio.",
    duracao: "Esta ferida tem mais de meio ano. Já tentei várias coisas, mas o penso enche-se sempre antes do tempo.",
    posicao: "Estou levantado a maior parte do dia. Sento-me com a perna baixa porque dói muito quando elevo.",
    pensos: "Têm-me posto uma espuma. Cheia logo no primeiro dia, mas dizem para deixar até à próxima visita.",
    febre: "Febre não tive.",
    mobilidade: "Ando mas com dificuldade. A perna fica muito inchada ao fim do dia.",
    },
    tratamentosDisponiveis: [
    "cloreto-sodio", "octenilin-solucao",
    "betadine-solucao", "octiset",
    "aquacel", "alginato-calcio", "exufiber",
    "fibrosol", "vliwasorb",
    "mepilex", "allevyn", "biatain",
    "varihesive-extra-fino",
    "hidrogel",
    "oxido-zinco", "atl",
    "protetor-spray",
    "agua-oxigenada", "alcool-etilico",
    ],
    opcoesAplicacao: ["penso_simples", "penso_impermeavel", "ligadura", "terapia_compressiva", "direto_seco", "sem_protecao", "penso_rapido"],
    objetivosClinicosAlvo: [
    goal("cleanse", "Limpar o leito e a pele peri-lesional", "limpar-ferida", "essencial",
    "Soro fisiológico para o leito e para descontaminar a pele macerada peri-lesional. Octenidina é alternativa razoável.",
    { idsTratamento: ["cloreto-sodio", "octenilin-solucao"] }, ["decisao-clinica", "antimicrobianos"]),
    goal("absorbent", "Aplicar material altamente absorvente", "controlar-exsudado", "essencial",
    "Exsudado abundante exige hidrofibra ou alginato de alta absorção — o penso atual (espuma simples) é insuficiente.",
    { idsTratamento: ["aquacel", "alginato-calcio", "exufiber", "fibrosol", "vliwasorb"] }, ["gestao-exsudado", "escolha-do-penso"]),
    goal("proteger-perilesional", "Proteger a pele peri-lesional macerada", "proteger-pele", "essencial",
    "Pele peri-lesional macerada precisa de barreira protetora — película em spray ou óxido de zinco previnem agravamento e permitem regeneração.",
    { idsTratamento: ["protetor-spray", "oxido-zinco"] }, ["protecao-perilesional"]),
    goal("compression", "Aplicar terapia compressiva", "compressao-venosa", "essencial",
    "A terapia compressiva multi-camada é o pilar do tratamento da úlcera venosa — sem compressão, qualquer plano local é insuficiente.",
    { idsAplicacao: ["terapia_compressiva"] }, ["decisao-clinica"]),
    goal("secondary-cover", "Espuma absorvente como cobertura secundária", "controlar-exsudado", "adequado",
    "Sobre a hidrofibra/alginato, espuma absorvente reforça a gestão de exsudado e dá conforto.",
    { idsTratamento: ["mepilex", "allevyn", "biatain"] }, ["gestao-exsudado", "escolha-do-penso"]),
    goal("ligature-alt", "Ligadura compressiva como alternativa adequada", "compressao-venosa", "adequado",
    "Quando terapia compressiva multi-camada não está disponível, ligadura compressiva é alternativa razoável.",
    { idsAplicacao: ["ligadura"] }, ["decisao-clinica"]),
    ],
    regrasAvaliacao: [
    { id: "antiseticos-c12", alvo: "tratamento", aplicavelAIds: ["betadine-solucao", "octiset"], classificacao: "redundante",
    motivo: "Sem sinais de infeção, antissépticos clássicos não estão indicados — soro ou octenidina são suficientes.",
    idsTemas: ["antimicrobianos"] },
    { id: "hidrocoloide-c12", alvo: "tratamento", aplicavelAIds: ["varihesive-extra-fino"], classificacao: "inadequado",
    motivo: "Hidrocolóide fino tem absorção muito limitada — repetiria o problema do penso atual e agravaria a maceração.",
    idsTemas: ["gestao-exsudado", "escolha-do-penso"] },
    { id: "hidrogel-c12", alvo: "tratamento", aplicavelAIds: ["hidrogel"], classificacao: "inadequado",
    motivo: "O leito está em granulação com exsudado abundante — adicionar humidade é diretamente contraproducente.",
    idsTemas: ["gestao-exsudado"] },
    { id: "atl-c12", alvo: "tratamento", aplicavelAIds: ["atl"], classificacao: "redundante",
    motivo: "ATL hidrata mas não tem ação barreira eficaz contra exsudado — película em spray ou óxido de zinco são preferíveis para proteção peri-lesional.",
    idsTemas: ["protecao-perilesional"] },
    { id: "agua-oxigenada-c12", alvo: "tratamento", aplicavelAIds: ["agua-oxigenada"], classificacao: "inadequado",
    motivo: "A água oxigenada é citotóxica e está contraindicada em feridas crónicas.",
    idsTemas: ["antimicrobianos"] },
    { id: "alcool-c12", alvo: "tratamento", aplicavelAIds: ["alcool-etilico"], classificacao: "inadequado",
    motivo: "O álcool destrói tecido viável e está contraindicado em qualquer ferida.",
    idsTemas: ["antimicrobianos"] },
    { id: "direto-seco-c12", alvo: "aplicacao", aplicavelAIds: ["direto_seco"], classificacao: "inadequado",
    motivo: "Material a seco adere ao leito — em ferida exsudativa também impede gestão adequada do exsudado.",
    idsTemas: ["decisao-clinica"] },
    { id: "sem-protecao-c12", alvo: "aplicacao", aplicavelAIds: ["sem_protecao"], classificacao: "inadequado",
    motivo: "Sem cobertura, exsudado abundante macera ainda mais a pele peri-lesional.",
    idsTemas: ["decisao-clinica"] },
    { id: "penso-simples-c12", alvo: "aplicacao", aplicavelAIds: ["penso_simples"], classificacao: "redundante",
    motivo: "Penso simples sem compressão não trata úlcera venosa — pode acompanhar mas é insuficiente como técnica única.",
    idsTemas: ["decisao-clinica"] },
    { id: "penso-rapido-c12", alvo: "aplicacao", aplicavelAIds: ["penso_rapido"], classificacao: "inadequado",
    motivo: "Penso rápido aderente é insuficiente para ferida exsudativa e adere ao leito.",
    idsTemas: ["decisao-clinica"] },
    ],
    zonasTecido: [
  {
    "tipoTecido": "fibrina",
    "poligono": [
      {
        "x": 0.165625,
        "y": 0.4068702062255648
      },
      {
        "x": 0.186875,
        "y": 0.4775420061479691
      },
      {
        "x": 0.204375,
        "y": 0.5463037574238219
      },
      {
        "x": 0.236875,
        "y": 0.5768645357686454
      },
      {
        "x": 0.283125,
        "y": 0.5749544871220938
      },
      {
        "x": 0.343125,
        "y": 0.5272032709583072
      },
      {
        "x": 0.363125,
        "y": 0.5386635628376161
      },
      {
        "x": 0.385625,
        "y": 0.5482138060703734
      },
      {
        "x": 0.451875,
        "y": 0.5348434655445131
      },
      {
        "x": 0.476875,
        "y": 0.5329334168979616
      },
      {
        "x": 0.541875,
        "y": 0.5348434655445131
      },
      {
        "x": 0.571875,
        "y": 0.5348434655445131
      },
      {
        "x": 0.631875,
        "y": 0.5252932223117558
      },
      {
        "x": 0.645625,
        "y": 0.5214731250186528
      },
      {
        "x": 0.641875,
        "y": 0.4011400602859104
      },
      {
        "x": 0.606875,
        "y": 0.3190079684841973
      },
      {
        "x": 0.554375,
        "y": 0.26743665502730773
      },
      {
        "x": 0.509375,
        "y": 0.24833616856179305
      },
      {
        "x": 0.468125,
        "y": 0.24451607126869013
      },
      {
        "x": 0.384375,
        "y": 0.25406631450144745
      },
      {
        "x": 0.376875,
        "y": 0.2597964604411019
      },
      {
        "x": 0.333125,
        "y": 0.2502462172083445
      },
      {
        "x": 0.350625,
        "y": 0.30945772525144
      },
      {
        "x": 0.316875,
        "y": 0.3266481630704032
      },
      {
        "x": 0.269375,
        "y": 0.3438386008893664
      },
      {
        "x": 0.236875,
        "y": 0.35338884412212374
      },
      {
        "x": 0.211875,
        "y": 0.3839496224669472
      },
      {
        "x": 0.183125,
        "y": 0.395409914346256
      },
      {
        "x": 0.183125,
        "y": 0.39923001163935895
      },
      {
        "x": 0.183125,
        "y": 0.4068702062255648
      },
      {
        "x": 0.170625,
        "y": 0.4068702062255648
      }
    ]
  }
    ],
    idsTemas: ["tecidos-e-leito", "gestao-exsudado", "escolha-do-penso", "protecao-perilesional", "decisao-clinica"],
    planoRecomendado: {
    minimo: ["Limpeza com soro fisiológico", "Hidrofibra ou alginato altamente absorvente", "Proteção peri-lesional com película ou óxido de zinco", "Terapia compressiva"],
    otimizado: ["Limpeza com soro fisiológico (ou octenilin-solução) do leito e da pele peri-lesional", "Hidrofibra ou alginato altamente absorvente (Aquacel / Alginato Cálcio / Exufiber / Fibrosol)", "Proteção peri-lesional com película em spray ou óxido de zinco", "Espuma absorvente como cobertura secundária (Mepilex / Allevyn / Biatain)", "Terapia compressiva multi-camada (preferível) ou ligadura compressiva", "Avaliar índice tornozelo-braço se ainda não documentado para confirmar adequação da compressão"],
    },
  },
  // ─── Caso 13 ──────────────────────────────────────────────────────────────────
  {
    id: "13",
    slug: "13",
    tituloAbreviado: "Caso 13",
    titulo: "Ferida complicada",
    descricao: "Treinar abordagem a ferida traumática infetada com necrose — desbridamento e antimicrobiano tópico.",
    competencias: "Reconhecimento de infeção secundária a trauma, desbridamento, antimicrobiano com prata",
    dificuldade: "intermedio",
    ordem: 13,
    minutosEstimados: 11,
    status: "disponivel",
    srcImagem: "/caso13.jpg",
    altImagem: "Ferida necrótica pós-picada de inseto — © Medetec Medical Images (medetec.co.uk)",
    resumoIntro: "Utente com ferida na perna pós-picada de inseto, agora com necrose e sinais de infeção local.",
    objetivo: "Reconhecer infeção secundária com necrose e instituir desbridamento + antimicrobiano tópico.",
    definicoesObservacao: observationDefinitions,
    promptsDialogo: dialoguePrompts,
    definicoesAplicacao: applicationDefinitions,
    objetivosVisuais: { tecidos: ["necrose", "fibrina"], exsudado: ["seroso", "purulento"], bordos: ["rubor"] },
    tituloCenario: "Ferida pós-picada de inseto",
    contextoPaciente: "Utente de 56 anos com lesão pós-picada de inseto há 10 dias, com agravamento progressivo nos últimos 3-4 dias.",
    bannerPaciente: "Ferida necrótica pós-picada — © Medetec Medical Images (medetec.co.uk)",
    estadoFerida: { exsudado: "moderado", infeccao: "infecao-local-evidente", tecido: "necrose-fibrina", perilesional: "eritematosa", odor: "ligeiro" },
    variavelFerida: { exsudado: 3, infeccao: 1, tecido: 1, odor: 1, humidade: 3, profundidade: 2, bordos: 1, pele_perilesional: 3, dor: 3, hemorragia: 0, etiologia: 5, perfusao: 1 },
    detalhesObservacao: {
    imagem: { detalhe: "Lesão arredondada com necrose central e fibrina periférica, halo eritematoso marcado." },
    dimensoes: { detalhe: "≈3×3 cm; profundidade moderada." },
    exsudado: { detalhe: "Moderado, turvo." },
    cheiro: { detalhe: "Ligeiro odor." },
    tecidos: { detalhe: "Zona central preta e zonas amareladas em redor; sem áreas avermelhadas visíveis." },
    bordos: { detalhe: "Bordos irregulares, avermelhados." },
    pele_perilesional: { detalhe: "Avermelhada em redor, com edema ligeiro." },
    },
    respostasDialogo: {
    dor: "Dói bastante — uns 5 em 10. Aumentou nos últimos dias.",
    duracao: "Picou-me há cerca de 10 dias. Inchou logo, mas há 3 ou 4 dias começou a piorar muito.",
    posicao: "Tento manter a perna elevada.",
    pensos: "Tenho posto compressas. Mudo todos os dias.",
    febre: "Senti-me um bocado quente ontem mas não medi.",
    mobilidade: "Ando mas custa-me apoiar a perna.",
    },
    tratamentosDisponiveis: [
    "cloreto-sodio", "octenilin-solucao",
    "betadine-solucao", "octiset",
    "colagenase",
    "aquacel-ag", "silvercel", "exufiber-ag", "allevyn-ag",
    "actisorb-silver",
    "aquacel", "alginato-calcio",
    "mepilex", "allevyn",
    "varihesive-extra-fino",
    "hidrogel",
    "agua-oxigenada", "alcool-etilico",
    ],
    opcoesAplicacao: ["penso_simples", "penso_impermeavel", "ligadura", "terapia_compressiva", "direto_seco", "sem_protecao", "penso_rapido"],
    objetivosClinicosAlvo: [
    goal("cleanse", "Limpar e irrigar o leito", "limpar-ferida", "essencial",
    "Soro fisiológico ou octenidina — irrigação importante para remover detritos.",
    { idsTratamento: ["cloreto-sodio", "octenilin-solucao"] }, ["decisao-clinica", "antimicrobianos"]),
    goal("desbridamento", "Desbridar necrose e fibrina", "desbridamento", "essencial",
    "Necrose e fibrina bloqueiam a evolução — colagenase é o desbridante enzimático adequado.",
    { idsTratamento: ["colagenase"] }, ["desbridamento", "tecidos-e-leito"]),
    goal("antimicrobial", "Antimicrobiano tópico para controlo local", "controlar-bioburden", "essencial",
    "Sinais de infeção local exigem antimicrobiano com prata — combina ação antimicrobiana com absorção.",
    { idsTratamento: ["aquacel-ag", "silvercel", "exufiber-ag", "allevyn-ag", "actisorb-silver"] }, ["antimicrobianos", "biofilme"]),
    goal("secondary-cover", "Cobertura secundária absorvente", "controlar-exsudado", "essencial",
    "Espuma absorvente sobre o material primário.",
    { idsTratamento: ["mepilex", "allevyn"] }, ["gestao-exsudado", "escolha-do-penso"]),
    goal("app-cover", "Penso simples protetor", "cobertura-atraumatica", "essencial",
    "Penso simples protetor é a técnica adequada.",
    { idsAplicacao: ["penso_simples"] }, ["decisao-clinica"]),
    ],
    regrasAvaliacao: [
    { id: "antiseticos-c13", alvo: "tratamento", aplicavelAIds: ["betadine-solucao", "octiset"], classificacao: "adequado",
    motivo: "Em ferida com sinais de infeção local, antissépsia tópica de curta duração é apropriada como adjuvante — não substitui antimicrobiano de penso.",
    idsTemas: ["antimicrobianos"] },
    { id: "hidrofibra-sem-prata-c13", alvo: "tratamento", aplicavelAIds: ["aquacel", "alginato-calcio"], classificacao: "redundante",
    motivo: "Hidrofibra/alginato sem prata não controla bioburden — versão com prata é preferível.",
    idsTemas: ["antimicrobianos", "escolha-do-penso"] },
    { id: "hidrocoloide-c13", alvo: "tratamento", aplicavelAIds: ["varihesive-extra-fino"], classificacao: "inadequado",
    motivo: "Hidrocolóide está contraindicado em ferida com sinais de infeção — favorece anaerobiose.",
    idsTemas: ["escolha-do-penso", "antimicrobianos"] },
    { id: "hidrogel-c13", alvo: "tratamento", aplicavelAIds: ["hidrogel"], classificacao: "inadequado",
    motivo: "Adicionar humidade em ferida com bioburden é contraproducente.",
    idsTemas: ["gestao-exsudado"] },
    { id: "agua-oxigenada-c13", alvo: "tratamento", aplicavelAIds: ["agua-oxigenada"], classificacao: "inadequado",
    motivo: "A água oxigenada é citotóxica.",
    idsTemas: ["antimicrobianos"] },
    { id: "alcool-c13", alvo: "tratamento", aplicavelAIds: ["alcool-etilico"], classificacao: "inadequado",
    motivo: "O álcool destrói tecido viável.",
    idsTemas: ["antimicrobianos"] },
    { id: "compressiva-c13", alvo: "aplicacao", aplicavelAIds: ["terapia_compressiva"], classificacao: "inadequado",
    motivo: "Terapia compressiva não está indicada em ferida traumática infetada aguda.",
    idsTemas: ["decisao-clinica"] },
    { id: "ligadura-c13", alvo: "aplicacao", aplicavelAIds: ["ligadura"], classificacao: "inadequado",
    motivo: "Ligadura compressiva não está indicada.",
    idsTemas: ["decisao-clinica"] },
    { id: "direto-seco-c13", alvo: "aplicacao", aplicavelAIds: ["direto_seco"], classificacao: "inadequado",
    motivo: "Material a seco adere ao leito.",
    idsTemas: ["decisao-clinica"] },
    { id: "sem-protecao-c13", alvo: "aplicacao", aplicavelAIds: ["sem_protecao"], classificacao: "inadequado",
    motivo: "Ferida infetada exposta agrava risco de progressão.",
    idsTemas: ["decisao-clinica"] },
    { id: "penso-rapido-c13", alvo: "aplicacao", aplicavelAIds: ["penso_rapido"], classificacao: "inadequado",
    motivo: "Penso rápido aderente é insuficiente e adere à fibrina/necrose.",
    idsTemas: ["decisao-clinica"] },
    ],
    zonasTecido: [
  {
    "tipoTecido": "fibrina",
    "poligono": [
      {
        "x": 0.318125,
        "y": 0.39008922443376803
      },
      {
        "x": 0.331875,
        "y": 0.3725188743994509
      },
      {
        "x": 0.341875,
        "y": 0.3865751544269046
      },
      {
        "x": 0.343125,
        "y": 0.41293067947838025
      },
      {
        "x": 0.349375,
        "y": 0.432258064516129
      },
      {
        "x": 0.359375,
        "y": 0.44104323953328756
      },
      {
        "x": 0.365625,
        "y": 0.4287439945092656
      },
      {
        "x": 0.365625,
        "y": 0.40238846945779
      },
      {
        "x": 0.364375,
        "y": 0.3795470144131778
      },
      {
        "x": 0.371875,
        "y": 0.3496774193548387
      },
      {
        "x": 0.394375,
        "y": 0.35494852436513386
      },
      {
        "x": 0.391875,
        "y": 0.39008922443376803
      },
      {
        "x": 0.393125,
        "y": 0.432258064516129
      },
      {
        "x": 0.384375,
        "y": 0.47091283459162664
      },
      {
        "x": 0.381875,
        "y": 0.5060535346602608
      },
      {
        "x": 0.366875,
        "y": 0.5042964996568291
      },
      {
        "x": 0.348125,
        "y": 0.4972683596431023
      },
      {
        "x": 0.339375,
        "y": 0.47091283459162664
      },
      {
        "x": 0.330625,
        "y": 0.45685655456417296
      },
      {
        "x": 0.319375,
        "y": 0.44104323953328756
      },
      {
        "x": 0.316875,
        "y": 0.4006314344543583
      },
      {
        "x": 0.316875,
        "y": 0.39184625943719975
      }
    ]
  },
  {
    "tipoTecido": "fibrina",
    "poligono": [
      {
        "x": 0.419375,
        "y": 0.47794097460535345
      },
      {
        "x": 0.413125,
        "y": 0.5183527796842827
      },
      {
        "x": 0.413125,
        "y": 0.553493479752917
      },
      {
        "x": 0.414375,
        "y": 0.5851201098146878
      },
      {
        "x": 0.438125,
        "y": 0.5991763898421414
      },
      {
        "x": 0.439375,
        "y": 0.637831159917639
      },
      {
        "x": 0.444375,
        "y": 0.6606726149622512
      },
      {
        "x": 0.469375,
        "y": 0.6606726149622512
      },
      {
        "x": 0.481875,
        "y": 0.6395881949210707
      },
      {
        "x": 0.498125,
        "y": 0.6290459849004805
      },
      {
        "x": 0.511875,
        "y": 0.6009334248455731
      },
      {
        "x": 0.525625,
        "y": 0.5780919698009609
      },
      {
        "x": 0.526875,
        "y": 0.5341660947151682
      },
      {
        "x": 0.525625,
        "y": 0.5007824296499657
      },
      {
        "x": 0.516875,
        "y": 0.47794097460535345
      },
      {
        "x": 0.506875,
        "y": 0.44982841455044614
      },
      {
        "x": 0.496875,
        "y": 0.42698695950583393
      },
      {
        "x": 0.483125,
        "y": 0.4287439945092656
      },
      {
        "x": 0.484375,
        "y": 0.39008922443376803
      },
      {
        "x": 0.500625,
        "y": 0.38130404941660945
      },
      {
        "x": 0.491875,
        "y": 0.3672477693891558
      },
      {
        "x": 0.478125,
        "y": 0.36021962937542895
      },
      {
        "x": 0.459375,
        "y": 0.3795470144131778
      },
      {
        "x": 0.461875,
        "y": 0.41468771448181196
      },
      {
        "x": 0.469375,
        "y": 0.44982841455044614
      },
      {
        "x": 0.469375,
        "y": 0.4744269045984901
      },
      {
        "x": 0.488125,
        "y": 0.4656417295813315
      },
      {
        "x": 0.505625,
        "y": 0.47266986959505836
      },
      {
        "x": 0.494375,
        "y": 0.49199725463280713
      },
      {
        "x": 0.488125,
        "y": 0.5130816746739877
      },
      {
        "x": 0.488125,
        "y": 0.5376801647220316
      },
      {
        "x": 0.480625,
        "y": 0.5640356897735072
      },
      {
        "x": 0.470625,
        "y": 0.5868771448181195
      },
      {
        "x": 0.458125,
        "y": 0.5868771448181195
      },
      {
        "x": 0.456875,
        "y": 0.5640356897735072
      },
      {
        "x": 0.454375,
        "y": 0.5376801647220316
      },
      {
        "x": 0.440625,
        "y": 0.5148387096774194
      },
      {
        "x": 0.435625,
        "y": 0.4832120796156486
      },
      {
        "x": 0.428125,
        "y": 0.4744269045984901
      },
      {
        "x": 0.428125,
        "y": 0.4814550446122169
      }
    ]
  },
  {
    "tipoTecido": "necrose",
    "poligono": [
      {
        "x": 0.408125,
        "y": 0.6026904598490048
      },
      {
        "x": 0.429375,
        "y": 0.625531914893617
      },
      {
        "x": 0.433125,
        "y": 0.6062045298558683
      },
      {
        "x": 0.420625,
        "y": 0.5939052848318462
      },
      {
        "x": 0.418125,
        "y": 0.5921482498284145
      }
    ]
  },
  {
    "tipoTecido": "necrose",
    "poligono": [
      {
        "x": 0.416875,
        "y": 0.6360741249142072
      },
      {
        "x": 0.439375,
        "y": 0.6624296499656829
      },
      {
        "x": 0.438125,
        "y": 0.6360741249142072
      },
      {
        "x": 0.420625,
        "y": 0.6343170899107755
      }
    ]
  },
  {
    "tipoTecido": "fibrina",
    "poligono": [
      {
        "x": 0.441875,
        "y": 0.49551132463967057
      },
      {
        "x": 0.489375,
        "y": 0.5025394646533974
      },
      {
        "x": 0.470625,
        "y": 0.5816060398078243
      },
      {
        "x": 0.445625,
        "y": 0.49902539464653395
      }
    ]
  }
    ],
    idsTemas: ["tecidos-e-leito", "desbridamento", "antimicrobianos", "biofilme", "escolha-do-penso", "decisao-clinica", "sinais-de-alarme"],
    planoRecomendado: {
    minimo: ["Limpeza com soro fisiológico", "Desbridamento enzimático (colagenase)", "Antimicrobiano tópico com prata", "Cobertura secundária absorvente", "Penso simples"],
    otimizado: ["Limpeza com soro fisiológico (ou octenilin)", "Desbridamento enzimático da necrose e fibrina (colagenase)", "Antimicrobiano tópico com prata (Aquacel Ag, Silvercel, Exufiber Ag, Allevyn Ag) — reavaliar duração às 2 semanas", "Cobertura secundária absorvente (Mepilex, Allevyn)", "Penso simples protetor", "Sinalizar à equipa médica para avaliação sistémica e considerar antibioterapia", "Vigilância: sinais de progressão (eritema, febre, dor crescente)"],
    },
  },
  // ─── Caso 14 ──────────────────────────────────────────────────────────────────
  {
    id: "14",
    slug: "14",
    tituloAbreviado: "Caso 14",
    titulo: "Úlcera venosa",
    descricao: "Treinar reconhecimento de úlcera venosa atípica e decisão de compressão em utente com obesidade.",
    competencias: "Avaliação de úlcera venosa em localização atípica, gestão de exsudado moderado, compressão em obesidade",
    dificuldade: "intermedio",
    ordem: 14,
    minutosEstimados: 11,
    status: "disponivel",
    srcImagem: "/caso14.jpg",
    altImagem: "Úlcera venosa da coxa em utente com obesidade — © Medetec Medical Images (medetec.co.uk)",
    resumoIntro: "Utente com obesidade severa e úlcera de longa duração na face anterior da coxa.",
    objetivo: "Reconhecer úlcera venosa atípica e estabelecer plano com gestão proporcional de exsudado e terapia compressiva.",
    definicoesObservacao: observationDefinitions,
    promptsDialogo: dialoguePrompts,
    definicoesAplicacao: applicationDefinitions,
    objetivosVisuais: { tecidos: ["granulacao"], exsudado: ["seroso"], bordos: ["maceracao"] },
    tituloCenario: "Úlcera venosa da coxa em obesidade",
    contextoPaciente: "Utente de 64 anos, IMC 42, com edema crónico dos membros inferiores e mobilidade limitada. Úlcera presente há cerca de 4 meses.",
    bannerPaciente: "Úlcera venosa da coxa em obesidade — © Medetec Medical Images (medetec.co.uk)",
    estadoFerida: { exsudado: "moderado", infeccao: "contaminacao", tecido: "granulacao", perilesional: "macerada", odor: "ausente" },
    variavelFerida: { exsudado: 3, infeccao: 0, tecido: 3, odor: 0, humidade: 3, profundidade: 2, bordos: 2, pele_perilesional: 1, dor: 2, hemorragia: 0, etiologia: 2, perfusao: 1 },
    detalhesObservacao: {
    imagem: { detalhe: "Úlcera ovalada extensa na face anterior da coxa, leito predominantemente vermelho-vivo brilhante." },
    dimensoes: { detalhe: "≈7×5 cm; profundidade superficial." },
    exsudado: { detalhe: "Moderado, transparente." },
    cheiro: { detalhe: "Sem odor significativo." },
    tecidos: { detalhe: "Leito todo avermelhado com pequenas áreas centrais mais pálidas." },
    bordos: { detalhe: "Bordos esbranquiçados e amolecidos." },
    pele_perilesional: { detalhe: "Esbranquiçada e amolecida em redor." },
    },
    respostasDialogo: {
    dor: "Tenho dor moderada — uns 4 em 10. Sobretudo ao fim do dia, quando a perna fica mais inchada.",
    duracao: "Tenho esta ferida há cerca de 4 meses. Antes era mais pequena, foi alargando.",
    posicao: "Estou sentado a maior parte do dia. Tenho dificuldade em andar muito tempo.",
    pensos: "Tenho posto compressas com uma pomada que me deram. Mudo de 2 em 2 dias.",
    febre: "Não, febre nunca tive.",
    mobilidade: "Mexo-me com dificuldade. As pernas incham e custa-me andar.",
    },
    tratamentosDisponiveis: [
    "cloreto-sodio", "octenilin-solucao",
    "betadine-solucao", "octiset",
    "aquacel", "alginato-calcio", "exufiber",
    "fibrosol",
    "mepilex", "allevyn", "biatain",
    "varihesive-extra-fino",
    "hidrogel",
    "oxido-zinco", "atl",
    "protetor-spray",
    "agua-oxigenada", "alcool-etilico",
    ],
    opcoesAplicacao: ["penso_simples", "penso_impermeavel", "ligadura", "terapia_compressiva", "direto_seco", "sem_protecao", "penso_rapido"],
    objetivosClinicosAlvo: [
    goal("cleanse", "Limpar o leito e a pele peri-lesional", "limpar-ferida", "essencial",
    "Soro fisiológico para o leito e para a pele macerada peri-lesional. Octenidina é alternativa razoável.",
    { idsTratamento: ["cloreto-sodio", "octenilin-solucao"] }, ["decisao-clinica", "antimicrobianos"]),
    goal("absorbent", "Aplicar material absorvente proporcional", "controlar-exsudado", "essencial",
    "Exsudado moderado: hidrofibra ou alginato dão absorção adequada sem sobre-secar o leito.",
    { idsTratamento: ["aquacel", "alginato-calcio", "exufiber", "fibrosol"] }, ["gestao-exsudado", "escolha-do-penso"]),
    goal("proteger-perilesional", "Proteger a pele peri-lesional macerada", "proteger-pele", "essencial",
    "Pele peri-lesional macerada precisa de barreira protetora — película em spray ou óxido de zinco previnem agravamento.",
    { idsTratamento: ["protetor-spray", "oxido-zinco"] }, ["protecao-perilesional"]),
    goal("compression", "Aplicar terapia compressiva", "compressao-venosa", "essencial",
    "A terapia compressiva é o pilar do tratamento da úlcera venosa, incluindo localizações atípicas como a coxa em obesidade. Sistemas adaptados podem ser necessários.",
    { idsAplicacao: ["terapia_compressiva"] }, ["decisao-clinica"]),
    goal("secondary-cover", "Espuma absorvente como cobertura secundária", "controlar-exsudado", "adequado",
    "Espuma sobre o material primário gere o exsudado adicional e dá conforto.",
    { idsTratamento: ["mepilex", "allevyn", "biatain"] }, ["gestao-exsudado", "escolha-do-penso"]),
    goal("ligature-alt", "Ligadura compressiva como alternativa adequada", "compressao-venosa", "adequado",
    "Quando terapia compressiva multi-camada não está disponível, ligadura compressiva é alternativa razoável.",
    { idsAplicacao: ["ligadura"] }, ["decisao-clinica"]),
    ],
    regrasAvaliacao: [
    { id: "antiseticos-c14", alvo: "tratamento", aplicavelAIds: ["betadine-solucao", "octiset"], classificacao: "redundante",
    motivo: "Sem sinais de infeção, antissépticos clássicos não estão indicados — soro ou octenidina são suficientes.",
    idsTemas: ["antimicrobianos"] },
    { id: "hidrocoloide-c14", alvo: "tratamento", aplicavelAIds: ["varihesive-extra-fino"], classificacao: "redundante",
    motivo: "Hidrocolóide fino tem absorção limitada para exsudado moderado — agravaria a maceração já presente.",
    idsTemas: ["gestao-exsudado", "escolha-do-penso"] },
    { id: "hidrogel-c14", alvo: "tratamento", aplicavelAIds: ["hidrogel"], classificacao: "inadequado",
    motivo: "Leito em granulação com exsudado moderado — adicionar humidade é contraproducente.",
    idsTemas: ["gestao-exsudado"] },
    { id: "atl-c14", alvo: "tratamento", aplicavelAIds: ["atl"], classificacao: "redundante",
    motivo: "ATL hidrata mas não tem ação barreira eficaz — película em spray ou óxido de zinco são preferíveis para proteção peri-lesional.",
    idsTemas: ["protecao-perilesional"] },
    { id: "agua-oxigenada-c14", alvo: "tratamento", aplicavelAIds: ["agua-oxigenada"], classificacao: "inadequado",
    motivo: "A água oxigenada é citotóxica e está contraindicada em feridas crónicas.",
    idsTemas: ["antimicrobianos"] },
    { id: "alcool-c14", alvo: "tratamento", aplicavelAIds: ["alcool-etilico"], classificacao: "inadequado",
    motivo: "O álcool destrói tecido viável e está contraindicado em qualquer ferida.",
    idsTemas: ["antimicrobianos"] },
    { id: "direto-seco-c14", alvo: "aplicacao", aplicavelAIds: ["direto_seco"], classificacao: "inadequado",
    motivo: "Material a seco adere ao leito e impede gestão de exsudado.",
    idsTemas: ["decisao-clinica"] },
    { id: "sem-protecao-c14", alvo: "aplicacao", aplicavelAIds: ["sem_protecao"], classificacao: "inadequado",
    motivo: "Sem cobertura, exsudado macera ainda mais a pele peri-lesional.",
    idsTemas: ["decisao-clinica"] },
    { id: "penso-simples-c14", alvo: "aplicacao", aplicavelAIds: ["penso_simples"], classificacao: "redundante",
    motivo: "Penso simples sem compressão não trata úlcera venosa — pode acompanhar mas é insuficiente como técnica única.",
    idsTemas: ["decisao-clinica"] },
    { id: "penso-rapido-c14", alvo: "aplicacao", aplicavelAIds: ["penso_rapido"], classificacao: "inadequado",
    motivo: "Penso rápido aderente é insuficiente para ferida exsudativa e adere ao leito.",
    idsTemas: ["decisao-clinica"] },
    ],
    zonasTecido: [
  {
    "tipoTecido": "granulacao",
    "poligono": [
      {
        "x": 0.339375,
        "y": 0.43600643069293443
      },
      {
        "x": 0.328125,
        "y": 0.47786043216436414
      },
      {
        "x": 0.323125,
        "y": 0.5179705169078177
      },
      {
        "x": 0.340625,
        "y": 0.5319218507316276
      },
      {
        "x": 0.330625,
        "y": 0.5598245183792474
      },
      {
        "x": 0.340625,
        "y": 0.5947028529387721
      },
      {
        "x": 0.360625,
        "y": 0.5999346031227009
      },
      {
        "x": 0.369375,
        "y": 0.6313251042262732
      },
      {
        "x": 0.373125,
        "y": 0.6644595220578218
      },
      {
        "x": 0.394375,
        "y": 0.6871304395215129
      },
      {
        "x": 0.425625,
        "y": 0.6975939398893702
      },
      {
        "x": 0.440625,
        "y": 0.7254966075369901
      },
      {
        "x": 0.460625,
        "y": 0.7394479413608
      },
      {
        "x": 0.488125,
        "y": 0.7272405242649663
      },
      {
        "x": 0.515625,
        "y": 0.7202648573530613
      },
      {
        "x": 0.553125,
        "y": 0.695850023161394
      },
      {
        "x": 0.584375,
        "y": 0.6696912722417504
      },
      {
        "x": 0.596875,
        "y": 0.6435325213221069
      },
      {
        "x": 0.613125,
        "y": 0.5981906863947246
      },
      {
        "x": 0.630625,
        "y": 0.5912150194828197
      },
      {
        "x": 0.629375,
        "y": 0.572031935475081
      },
      {
        "x": 0.614375,
        "y": 0.5563366849232949
      },
      {
        "x": 0.594375,
        "y": 0.5214583503637701
      },
      {
        "x": 0.590625,
        "y": 0.4900678492601978
      },
      {
        "x": 0.578125,
        "y": 0.4639090983405542
      },
      {
        "x": 0.553125,
        "y": 0.44646993106079186
      },
      {
        "x": 0.530625,
        "y": 0.4482138477887681
      },
      {
        "x": 0.499375,
        "y": 0.4272868470530532
      },
      {
        "x": 0.469375,
        "y": 0.4133355132292433
      },
      {
        "x": 0.445625,
        "y": 0.4115915965012671
      },
      {
        "x": 0.415625,
        "y": 0.38892067903757593
      },
      {
        "x": 0.395625,
        "y": 0.37496934521376607
      },
      {
        "x": 0.388125,
        "y": 0.38892067903757593
      },
      {
        "x": 0.383125,
        "y": 0.4081037630453146
      },
      {
        "x": 0.351875,
        "y": 0.4081037630453146
      },
      {
        "x": 0.345625,
        "y": 0.4220550968691245
      },
      {
        "x": 0.336875,
        "y": 0.4412381808768631
      }
    ]
  }
    ],
    idsTemas: ["tecidos-e-leito", "gestao-exsudado", "escolha-do-penso", "protecao-perilesional", "decisao-clinica"],
    planoRecomendado: {
    minimo: ["Limpeza com soro fisiológico", "Hidrofibra ou alginato absorvente", "Proteção peri-lesional", "Terapia compressiva"],
    otimizado: ["Limpeza com soro fisiológico (ou octenilin-solução) do leito e da pele peri-lesional", "Hidrofibra ou alginato proporcional ao exsudado moderado (Aquacel / Alginato Cálcio / Exufiber / Fibrosol)", "Proteção peri-lesional com película em spray ou óxido de zinco", "Espuma absorvente como cobertura secundária (Mepilex / Allevyn / Biatain)", "Terapia compressiva — em obesidade, considerar sistemas adaptados à circunferência da coxa", "Avaliar índice tornozelo-braço se ainda não documentado e abordar fatores predisponentes (peso, mobilidade, IVC)"],
    },
  },
  // ─── Caso 15 ──────────────────────────────────────────────────────────────────
  {
    id: "15",
    slug: "15",
    tituloAbreviado: "Caso 15",
    titulo: "Úlcera neuroisquémica",
    descricao: "Treinar abordagem a ferida plantar com etiologia mista — perfusão guia a decisão de desbridamento.",
    competencias: "Reconhecimento de lesão neuroisquémica, decisão guiada pela perfusão, abordagem multidisciplinar",
    dificuldade: "avancado",
    ordem: 15,
    minutosEstimados: 13,
    status: "disponivel",
    srcImagem: "/caso15.jpg",
    altImagem: "Lesão plantar com componente isquémico e pressórico — © Medetec Medical Images (medetec.co.uk)",
    resumoIntro: "Utente com diabetes e doença arterial periférica, lesão plantar de evolução prolongada com componente misto.",
    objetivo: "Reconhecer lesão plantar com componente isquémico, evitar desbridamento agressivo até estabelecer perfusão, gerir localmente.",
    definicoesObservacao: observationDefinitions,
    promptsDialogo: dialoguePrompts,
    definicoesAplicacao: applicationDefinitions,
    objetivosVisuais: { tecidos: ["fibrina"], exsudado: ["seroso"], bordos: ["integra"] },
    tituloCenario: "Lesão plantar neuroisquémica",
    contextoPaciente: "Utente de 73 anos com diabetes tipo 2 e doença arterial periférica conhecida. Lesão plantar com 3 meses de evolução.",
    bannerPaciente: "Lesão plantar neuroisquémica — © Medetec Medical Images (medetec.co.uk)",
    estadoFerida: { exsudado: "escasso", infeccao: "contaminacao", tecido: "fibrina", perilesional: "integra", odor: "ausente" },
    variavelFerida: { exsudado: 2, infeccao: 0, tecido: 2, odor: 0, humidade: 2, profundidade: 3, bordos: 2, pele_perilesional: 4, dor: 0, hemorragia: 0, etiologia: 4, perfusao: 0 },
    detalhesObservacao: {
    imagem: { detalhe: "Lesão plantar com leito amarelado e bordos elevados, hiperqueratose envolvente." },
    dimensoes: { detalhe: "≈2×2 cm de abertura, profundidade moderada." },
    exsudado: { detalhe: "Ligeiro, transparente." },
    cheiro: { detalhe: "Sem odor." },
    tecidos: { detalhe: "Leito amarelado; sem zonas avermelhadas; tecido pálido." },
    bordos: { detalhe: "Bordos irregulares com calo periférico." },
    pele_perilesional: { detalhe: "Pele íntegra mas pálida." },
    },
    respostasDialogo: {
    dor: "Não me dói porque tenho a sensibilidade reduzida. Sinto formigueiros no pé.",
    duracao: "Tenho esta ferida há cerca de 3 meses. Não fecha apesar dos pensos.",
    posicao: "Tento andar menos mas é difícil. Calço sapatos largos.",
    pensos: "Têm-me posto compressas e uma pomada que sai branca. Mudo de 2 em 2 dias.",
    febre: "Não tenho tido febre.",
    mobilidade: "Ando devagar — as pernas cansam-se rápido nos últimos meses.",
    },
    urlImagemDepois: "/caso15_2.jpg",
    legendaEvolucao: "Após 4 meses de tratamento com cobertura adequada, descarga de pressão e revascularização (intervenção vascular para corrigir perfusão), a lesão cicatrizou completamente — a perfusão restabelecida foi determinante para a evolução.",
    tratamentosDisponiveis: [
    "cloreto-sodio", "octenilin-solucao",
    "betadine-solucao", "octiset",
    "colagenase",
    "aquacel", "alginato-calcio", "exufiber",
    "mepilex", "allevyn",
    "urgotul",
    "varihesive-extra-fino",
    "hidrogel",
    "agua-oxigenada", "alcool-etilico",
    ],
    opcoesAplicacao: ["penso_simples", "penso_impermeavel", "ligadura", "terapia_compressiva", "direto_seco", "sem_protecao", "penso_rapido"],
    objetivosClinicosAlvo: [
    goal("cleanse", "Limpar o leito sem agressividade", "limpar-ferida", "essencial",
    "Soro fisiológico para limpeza suave. Em lesão neuroisquémica, evitar fricção que possa traumatizar tecido pouco perfundido.",
    { idsTratamento: ["cloreto-sodio", "octenilin-solucao"] }, ["decisao-clinica", "antimicrobianos"]),
    goal("absorbent-fill", "Material absorvente para o leito", "controlar-exsudado", "essencial",
    "Hidrofibra, alginato ou contacto não-aderente — opções proporcionais ao exsudado ligeiro sem agredir leito pouco perfundido.",
    { idsTratamento: ["aquacel", "alginato-calcio", "exufiber", "urgotul"] }, ["gestao-exsudado", "escolha-do-penso"]),
    goal("secondary-cover", "Cobertura secundária atraumática", "cobertura-atraumatica", "essencial",
    "Espuma de baixa-média absorção como cobertura secundária — atraumática.",
    { idsTratamento: ["mepilex", "allevyn"] }, ["escolha-do-penso"]),
    goal("app-cover", "Penso simples protetor", "cobertura-atraumatica", "essencial",
    "Penso simples protetor é a técnica adequada.",
    { idsAplicacao: ["penso_simples"] }, ["decisao-clinica"]),
    goal("conservative-debridement", "Desbridamento conservador da fibrina superficial", "desbridamento", "adequado",
    "Em lesão com perfusão comprometida, desbridamento agressivo está contraindicado. Colagenase pode ser usada com prudência apenas em fibrina superficial.",
    { idsTratamento: ["colagenase"] }, ["desbridamento"]),
    ],
    regrasAvaliacao: [
    { id: "antiseticos-c15", alvo: "tratamento", aplicavelAIds: ["betadine-solucao", "octiset"], classificacao: "redundante",
    motivo: "Sem sinais de infeção, antissépticos clássicos não estão indicados.",
    idsTemas: ["antimicrobianos"] },
    { id: "hidrocoloide-c15", alvo: "tratamento", aplicavelAIds: ["varihesive-extra-fino"], classificacao: "inadequado",
    motivo: "Hidrocolóide oclui sinais de progressão e pode favorecer anaerobiose em pé com perfusão comprometida.",
    idsTemas: ["escolha-do-penso"] },
    { id: "hidrogel-c15", alvo: "tratamento", aplicavelAIds: ["hidrogel"], classificacao: "inadequado",
    motivo: "Em lesão com perfusão comprometida, adicionar humidade pode macerar tecido frágil sem benefício no desbridamento.",
    idsTemas: ["desbridamento", "gestao-exsudado"] },
    { id: "agua-oxigenada-c15", alvo: "tratamento", aplicavelAIds: ["agua-oxigenada"], classificacao: "inadequado",
    motivo: "Citotóxica — particularmente prejudicial em tecido com perfusão limítrofe.",
    idsTemas: ["antimicrobianos"] },
    { id: "alcool-c15", alvo: "tratamento", aplicavelAIds: ["alcool-etilico"], classificacao: "inadequado",
    motivo: "O álcool destrói tecido viável.",
    idsTemas: ["antimicrobianos"] },
    { id: "compressiva-c15", alvo: "aplicacao", aplicavelAIds: ["terapia_compressiva"], classificacao: "inadequado",
    motivo: "Terapia compressiva está CONTRAINDICADA em isquemia — agrava a perfusão já comprometida.",
    idsTemas: ["decisao-clinica", "sinais-de-alarme"] },
    { id: "ligadura-c15", alvo: "aplicacao", aplicavelAIds: ["ligadura"], classificacao: "inadequado",
    motivo: "Ligadura compressiva está contraindicada em isquemia.",
    idsTemas: ["decisao-clinica"] },
    { id: "direto-seco-c15", alvo: "aplicacao", aplicavelAIds: ["direto_seco"], classificacao: "inadequado",
    motivo: "Material a seco adere ao leito.",
    idsTemas: ["decisao-clinica"] },
    { id: "sem-protecao-c15", alvo: "aplicacao", aplicavelAIds: ["sem_protecao"], classificacao: "inadequado",
    motivo: "Pé com perfusão comprometida exposto agrava risco de progressão.",
    idsTemas: ["decisao-clinica"] },
    { id: "penso-rapido-c15", alvo: "aplicacao", aplicavelAIds: ["penso_rapido"], classificacao: "inadequado",
    motivo: "Penso rápido aderente arranca tecido frágil.",
    idsTemas: ["decisao-clinica"] },
    ],
    zonasTecido: [
  {
    "tipoTecido": "fibrina",
    "poligono": [
      {
        "x": 0.468125,
        "y": 0.30045465281058104
      },
      {
        "x": 0.438125,
        "y": 0.3514702409069438
      },
      {
        "x": 0.399375,
        "y": 0.4081542276806802
      },
      {
        "x": 0.368125,
        "y": 0.47995394426074633
      },
      {
        "x": 0.348125,
        "y": 0.5404168634860652
      },
      {
        "x": 0.360625,
        "y": 0.591432451582428
      },
      {
        "x": 0.388125,
        "y": 0.6405585734529995
      },
      {
        "x": 0.416875,
        "y": 0.6632321681624941
      },
      {
        "x": 0.440625,
        "y": 0.6594532357109116
      },
      {
        "x": 0.445625,
        "y": 0.6311112423240435
      },
      {
        "x": 0.479375,
        "y": 0.6311112423240435
      },
      {
        "x": 0.526875,
        "y": 0.6386691072272083
      },
      {
        "x": 0.555625,
        "y": 0.6386691072272083
      },
      {
        "x": 0.535625,
        "y": 0.600879782711384
      },
      {
        "x": 0.504375,
        "y": 0.5536431270666037
      },
      {
        "x": 0.490625,
        "y": 0.5045170051960322
      },
      {
        "x": 0.504375,
        "y": 0.4572803495512518
      },
      {
        "x": 0.525625,
        "y": 0.41004369390647144
      },
      {
        "x": 0.550625,
        "y": 0.35902810581010863
      },
      {
        "x": 0.564375,
        "y": 0.3136809163911195
      },
      {
        "x": 0.578125,
        "y": 0.28344945677846006
      },
      {
        "x": 0.561875,
        "y": 0.2758915918752952
      },
      {
        "x": 0.535625,
        "y": 0.29289678790741613
      },
      {
        "x": 0.499375,
        "y": 0.3099019839395371
      },
      {
        "x": 0.478125,
        "y": 0.3155703826169107
      },
      {
        "x": 0.464375,
        "y": 0.30423358526216343
      }
    ]
  }
    ],
    idsTemas: ["tecidos-e-leito", "desbridamento", "escolha-do-penso", "decisao-clinica", "sinais-de-alarme"],
    planoRecomendado: {
    minimo: ["Limpeza com soro fisiológico", "Material absorvente atraumático", "Cobertura secundária", "Penso simples", "Sinalizar à equipa vascular"],
    otimizado: ["Sinalizar IMEDIATAMENTE para avaliação vascular — perfusão comprometida exige investigação urgente (Doppler, índice tornozelo-braço, eventual revascularização)", "Limpeza com soro fisiológico (ou octenilin)", "Desbridamento conservador apenas de fibrina superficial — aguardar revascularização para desbridamento alargado", "Material absorvente atraumático (Aquacel, Alginato Cálcio, Exufiber, Urgotul)", "Cobertura secundária (Mepilex, Allevyn)", "Penso simples protetor", "Descarga rigorosa de pressão", "Controlo glicémico, abordagem multidisciplinar (vascular, podologia, endocrinologia)"],
    },
  },
  // ─── Caso 16 ──────────────────────────────────────────────────────────────────
  {
    id: "16",
    slug: "16",
    tituloAbreviado: "Caso 16",
    titulo: "Lesão por pressão",
    descricao: "Treinar reconhecimento de UPP categoria II e proteção do tecido viável.",
    competencias: "Identificação de UPP precoce, alívio de pressão, proteção de tecido",
    dificuldade: "introdutorio",
    ordem: 16,
    minutosEstimados: 8,
    status: "disponivel",
    srcImagem: "/caso16.jpg",
    altImagem: "Lesão por pressão no calcâneo — © Medetec Medical Images (medetec.co.uk)",
    resumoIntro: "Utente acamado com lesão por pressão recente no calcâneo direito.",
    objetivo: "Identificar UPP precoce e selecionar cobertura protetora sem desbridamento agressivo desnecessário.",
    definicoesObservacao: observationDefinitions,
    promptsDialogo: dialoguePrompts,
    definicoesAplicacao: applicationDefinitions,
    objetivosVisuais: { tecidos: ["fibrina"], exsudado: ["seroso"], bordos: ["integra"] },
    tituloCenario: "UPP categoria II do calcâneo",
    contextoPaciente: "Utente de 76 anos, internado há 8 dias por descompensação de IC, com mobilidade muito reduzida.",
    bannerPaciente: "UPP de calcâneo categoria II — © Medetec Medical Images (medetec.co.uk)",
    estadoFerida: { exsudado: "escasso", infeccao: "contaminacao", tecido: "fibrina", perilesional: "integra", odor: "ausente" },
    variavelFerida: { exsudado: 2, infeccao: 0, tecido: 2, odor: 0, humidade: 2, profundidade: 2, bordos: 3, pele_perilesional: 4, dor: 1, hemorragia: 1, etiologia: 1, perfusao: 1 },
    detalhesObservacao: {
    imagem: { detalhe: "Lesão arredondada de ~3×3 cm na face posterior do calcâneo." },
    dimensoes: { detalhe: "≈3×3 cm; profundidade superficial — categoria II provável." },
    exsudado: { detalhe: "Ligeiro, transparente." },
    cheiro: { detalhe: "Sem odor." },
    tecidos: { detalhe: "Leito heterogéneo: pequena área avermelhada-escura central, com zonas amareladas ligeiras em redor." },
    bordos: { detalhe: "Bordos regulares, bem definidos, sem descolamento." },
    pele_perilesional: { detalhe: "Pele íntegra; sem maceração nem vermelhidão marcada." },
    },
    respostasDialogo: {
    dor: "Sinto algum desconforto quando me apoio nesta perna — uns 3 em 10.",
    duracao: "Notei a marca há 2 ou 3 dias. Apareceu durante o internamento.",
    posicao: "Estou quase sempre na cama. Tento mexer-me mas custa-me sozinho.",
    pensos: "Ainda não fizeram penso aqui — só me viram a pele.",
    febre: "Não tenho tido febre.",
    mobilidade: "Levanto-me com ajuda só para a sanita, e custa.",
    },
    tratamentosDisponiveis: [
    "cloreto-sodio", "octenilin-solucao",
    "betadine-solucao", "octiset",
    "colagenase",
    "varihesive-extra-fino",
    "mepilex", "allevyn-nao-adesivo",
    "hidrogel",
    "alginato-calcio", "aquacel",
    "agua-oxigenada", "alcool-etilico",
    ],
    opcoesAplicacao: ["penso_simples", "penso_impermeavel", "ligadura", "terapia_compressiva", "direto_seco", "sem_protecao", "penso_rapido"],
    objetivosClinicosAlvo: [
    goal("cleanse-16", "Limpar o leito antes da cobertura", "limpar-ferida", "essencial",
    "A limpeza com soro fisiológico é o padrão. Octenidina é uma alternativa razoável com baixa citotoxicidade quando se quer associar efeito antimicrobiano suave.",
    { idsTratamento: ["cloreto-sodio", "octenilin-solucao"] }, ["decisao-clinica", "antimicrobianos"]),
    goal("debride-16", "Desbridar a fibrina presente", "desbridamento", "essencial",
    "A fibrina interfere com a progressão da cicatrização — a colagenase é o desbridante enzimático adequado para fibrina superficial.",
    { idsTratamento: ["colagenase"] }, ["desbridamento", "tecidos-e-leito"]),
    goal("cover-thin-16", "Aplicar cobertura protetora fina", "cobertura-atraumatica", "essencial",
    "Em UPP categoria II superficial, o hidrocolóide fino protege o leito viável e mantém ambiente húmido equilibrado.",
    { idsTratamento: ["varihesive-extra-fino"] }, ["escolha-do-penso", "tecidos-e-leito"]),
    goal("app-cover-16", "Penso simples protetor", "cobertura-atraumatica", "essencial",
    "Penso simples protetor é a técnica adequada — protege sem comprimir nem aderir.",
    { idsAplicacao: ["penso_simples"] }, ["decisao-clinica"]),
    goal("alt-foam-16", "Espuma de baixa absorção como alternativa", "cobertura-atraumatica", "adequado",
    "Mepilex ou Allevyn não-adesivo são alternativas razoáveis quando o hidrocolóide não está disponível.",
    { idsTratamento: ["mepilex", "allevyn-nao-adesivo"] }, ["escolha-do-penso"]),
    ],
    regrasAvaliacao: [
    { id: "antiseticos-c16", alvo: "tratamento", aplicavelAIds: ["betadine-solucao", "octiset"], classificacao: "redundante",
    motivo: "Em UPP categoria II sem sinais de infeção, antissépticos clássicos como iodopovidona têm citotoxicidade que pode atrasar a cicatrização — soro fisiológico ou octenidina são preferíveis.",
    idsTemas: ["antimicrobianos"] },
    { id: "hidrogel-c16", alvo: "tratamento", aplicavelAIds: ["hidrogel"], classificacao: "inadequado",
    motivo: "O leito não está seco — adicionar humidade aumentaria a maceração.",
    idsTemas: ["gestao-exsudado"] },
    { id: "alginato-c16", alvo: "tratamento", aplicavelAIds: ["alginato-calcio", "aquacel"], classificacao: "redundante",
    motivo: "Para exsudado ligeiro num leito superficial, alginatos/hidrofibras são desproporcionados — secam excessivamente o leito.",
    idsTemas: ["gestao-exsudado"] },
    { id: "agua-oxigenada-c16", alvo: "tratamento", aplicavelAIds: ["agua-oxigenada"], classificacao: "inadequado",
    motivo: "A água oxigenada é citotóxica e não acrescenta valor em feridas crónicas.",
    idsTemas: ["antimicrobianos"] },
    { id: "alcool-c16", alvo: "tratamento", aplicavelAIds: ["alcool-etilico"], classificacao: "inadequado",
    motivo: "O álcool destrói tecido viável e está contraindicado em qualquer ferida.",
    idsTemas: ["antimicrobianos"] },
    { id: "direto-seco-c16", alvo: "aplicacao", aplicavelAIds: ["direto_seco"], classificacao: "inadequado",
    motivo: "Material aplicado a seco adere ao leito e causa trauma na remoção.",
    idsTemas: ["decisao-clinica"] },
    { id: "sem-protecao-c16", alvo: "aplicacao", aplicavelAIds: ["sem_protecao"], classificacao: "inadequado",
    motivo: "Expor a ferida sem cobertura aumenta o risco de contaminação.",
    idsTemas: ["decisao-clinica"] },
    { id: "compressiva-c16", alvo: "aplicacao", aplicavelAIds: ["terapia_compressiva"], classificacao: "inadequado",
    motivo: "Terapia compressiva está contraindicada em UPP — agravaria a pressão local.",
    idsTemas: ["decisao-clinica"] },
    { id: "ligadura-c16", alvo: "aplicacao", aplicavelAIds: ["ligadura"], classificacao: "inadequado",
    motivo: "Não há indicação para compressão.",
    idsTemas: ["decisao-clinica"] },
    { id: "penso-rapido-c16", alvo: "aplicacao", aplicavelAIds: ["penso_rapido"], classificacao: "redundante",
    motivo: "Penso rápido aderente pode causar trauma na remoção sobre tecido frágil.",
    idsTemas: ["decisao-clinica"] },
    ],
    zonasTecido: [],
    idsTemas: ["tecidos-e-leito", "desbridamento", "escolha-do-penso", "decisao-clinica"],
    planoRecomendado: {
    minimo: ["Limpeza com soro fisiológico", "Desbridamento enzimático da fibrina", "Hidrocolóide fino protetor", "Penso simples"],
    otimizado: ["Limpeza com soro fisiológico (ou octenilin-solução)", "Desbridamento enzimático da fibrina (colagenase)", "Hidrocolóide fino protetor (Varihesive extra-fino)", "Penso simples protetor", "Alívio de pressão: tornozelos elevados, sem peso no calcâneo, reposicionamento 2/2h"],
    },
  },
  // ─── Caso 17 ──────────────────────────────────────────────────────────────────
  {
    id: "17",
    slug: "17",
    tituloAbreviado: "Caso 17",
    titulo: "Lesão por pressão",
    descricao: "Treinar reconhecimento de UPP avançada com necrose e bioburden — desbridamento e antimicrobiano tópico.",
    competencias: "Reconhecimento de necrose, decisão de desbridamento, controlo de carga microbiana, escolha de cobertura para ferida profunda exsudativa",
    dificuldade: "avancado",
    ordem: 17,
    minutosEstimados: 14,
    status: "disponivel",
    srcImagem: "/caso17.jpg",
    altImagem: "Lesão por pressão sacra necrótica — © Medetec Medical Images (medetec.co.uk)",
    resumoIntro: "Utente acamado com lesão por pressão sacra de evolução prolongada e aspeto necrótico.",
    objetivo: "Reconhecer UPP avançada com bioburden elevado e selecionar plano de desbridamento + antimicrobiano + cobertura adequada.",
    definicoesObservacao: observationDefinitions,
    promptsDialogo: dialoguePrompts,
    definicoesAplicacao: applicationDefinitions,
    objetivosVisuais: { tecidos: ["necrose", "fibrina"], exsudado: ["seroso", "purulento"], bordos: ["rubor"] },
    tituloCenario: "UPP sacra — categoria III/IV",
    contextoPaciente: "Utente de 84 anos, dependência total há vários meses, lesão presente há cerca de 6 semanas com agravamento progressivo. Sem febre.",
    bannerPaciente: "UPP sacra necrótica — © Medetec Medical Images (medetec.co.uk)",
    estadoFerida: { exsudado: "moderado", infeccao: "infecao-local-evidente", tecido: "necrose-fibrina", perilesional: "eritematosa", odor: "ligeiro" },
    variavelFerida: { exsudado: 3, infeccao: 1, tecido: 1, odor: 1, humidade: 3, profundidade: 3, bordos: 1, pele_perilesional: 3, dor: 2, hemorragia: 0, etiologia: 1, perfusao: 1 },
    detalhesObservacao: {
    imagem: { detalhe: "Lesão sacra extensa com necrose central preta húmida e fibrina amarela em redor; bordos elevados eritematosos." },
    dimensoes: { detalhe: "≈8×6 cm visíveis; profundidade real provavelmente significativa — categoria III-IV." },
    exsudado: { detalhe: "Moderado, turvo." },
    cheiro: { detalhe: "Ligeiro odor presente." },
    tecidos: { detalhe: "Zona central preta húmida; zonas amareladas em redor; sem áreas avermelhadas visíveis." },
    bordos: { detalhe: "Bordos irregulares, elevados e avermelhados." },
    pele_perilesional: { detalhe: "Avermelhada e inflamada em redor." },
    },
    respostasDialogo: {
    dor: "Tenho dor — uns 5 ou 6 em 10. Aumentou nas últimas semanas.",
    duracao: "Já tenho esta ferida há mais de mês e meio. Tem vindo a piorar.",
    posicao: "Estou na cama o dia todo. Tentam virar-me mas não posso ficar muito tempo do lado.",
    pensos: "Mudam o penso todos os dias. Tem vindo a sair mais líquido nos últimos tempos.",
    febre: "Não, febre não tive. Mas estou mais cansado do que o costume.",
    mobilidade: "Sou totalmente dependente para tudo na cama.",
    },
    tratamentosDisponiveis: [
    "cloreto-sodio", "octenilin-solucao",
    "betadine-solucao", "octiset",
    "colagenase",
    "hidrogel",
    "aquacel-ag", "silvercel", "exufiber-ag", "allevyn-ag",
    "actisorb-silver",
    "aquacel", "alginato-calcio",
    "mepilex", "allevyn",
    "varihesive-extra-fino",
    "agua-oxigenada", "alcool-etilico",
    ],
    opcoesAplicacao: ["penso_simples", "penso_impermeavel", "ligadura", "terapia_compressiva", "direto_seco", "sem_protecao", "penso_rapido"],
    objetivosClinicosAlvo: [
    goal("cleanse", "Limpar e irrigar o leito", "limpar-ferida", "essencial",
    "Soro fisiológico ou octenilin para limpeza inicial — irrigação ajuda a remover detritos e expor a extensão da necrose.",
    { idsTratamento: ["cloreto-sodio", "octenilin-solucao"] }, ["decisao-clinica", "antimicrobianos"]),
    goal("desbridamento", "Desbridar necrose e fibrina", "desbridamento", "essencial",
    "A necrose extensa e a fibrina bloqueiam a progressão — desbridamento enzimático com colagenase é a base; combina-se com hidrogel para amolecer áreas de necrose seca focal.",
    { idsTratamento: ["colagenase"] }, ["desbridamento", "tecidos-e-leito"]),
    goal("antimicrobial", "Controlar a carga microbiana com antimicrobiano tópico", "controlar-bioburden", "essencial",
    "Há sinais de infeção local (eritema marcado, odor, exsudado turvo). Antimicrobiano tópico com prata é a escolha — combina ação antimicrobiana com absorção de exsudado.",
    { idsTratamento: ["aquacel-ag", "silvercel", "exufiber-ag", "allevyn-ag", "actisorb-silver"] }, ["antimicrobianos", "biofilme"]),
    goal("secondary-cover", "Cobertura secundária absorvente", "controlar-exsudado", "essencial",
    "Sobre o material primário, espuma absorvente como cobertura secundária dá conforto e gere o exsudado adicional.",
    { idsTratamento: ["mepilex", "allevyn"] }, ["gestao-exsudado", "escolha-do-penso"]),
    goal("app-cover", "Penso simples protetor", "cobertura-atraumatica", "essencial",
    "Penso simples protetor é a técnica adequada — protege sem comprimir.",
    { idsAplicacao: ["penso_simples"] }, ["decisao-clinica"]),
    goal("hydrate-necrosis", "Hidratar áreas de necrose seca focal", "desbridamento", "adequado",
    "Hidrogel ajuda a amolecer áreas de necrose seca, facilitando a ação da colagenase.",
    { idsTratamento: ["hidrogel"] }, ["desbridamento"]),
    ],
    regrasAvaliacao: [
    { id: "antiseticos-c17", alvo: "tratamento", aplicavelAIds: ["betadine-solucao", "octiset"], classificacao: "adequado",
    motivo: "Em UPP com sinais de infeção local, antissépsia tópica de curta duração é apropriada como adjuvante — octenidina ou iodopovidona em durações limitadas. Não substitui antimicrobiano de penso (prata).",
    idsTemas: ["antimicrobianos"] },
    { id: "hidrofibra-sem-prata-c17", alvo: "tratamento", aplicavelAIds: ["aquacel", "alginato-calcio"], classificacao: "redundante",
    motivo: "Hidrofibra ou alginato sem prata não controla o bioburden — neste caso há indicação clínica para antimicrobiano de penso. Versão com prata é preferível.",
    idsTemas: ["antimicrobianos", "escolha-do-penso"] },
    { id: "hidrocoloide-c17", alvo: "tratamento", aplicavelAIds: ["varihesive-extra-fino"], classificacao: "inadequado",
    motivo: "Hidrocolóide fino é insuficiente para ferida profunda com necrose, exsudado moderado e bioburden — favorece anaerobiose.",
    idsTemas: ["escolha-do-penso", "antimicrobianos"] },
    { id: "agua-oxigenada-c17", alvo: "tratamento", aplicavelAIds: ["agua-oxigenada"], classificacao: "inadequado",
    motivo: "A água oxigenada é citotóxica e está contraindicada em feridas crónicas, mesmo com necrose.",
    idsTemas: ["antimicrobianos"] },
    { id: "alcool-c17", alvo: "tratamento", aplicavelAIds: ["alcool-etilico"], classificacao: "inadequado",
    motivo: "O álcool destrói tecido viável adjacente e está contraindicado em qualquer ferida.",
    idsTemas: ["antimicrobianos"] },
    { id: "direto-seco-c17", alvo: "aplicacao", aplicavelAIds: ["direto_seco"], classificacao: "inadequado",
    motivo: "Material a seco adere à necrose e à fibrina, causando trauma na remoção.",
    idsTemas: ["decisao-clinica"] },
    { id: "sem-protecao-c17", alvo: "aplicacao", aplicavelAIds: ["sem_protecao"], classificacao: "inadequado",
    motivo: "Ferida profunda exposta sem cobertura permite contaminação adicional e dessecação periférica.",
    idsTemas: ["decisao-clinica"] },
    { id: "compressiva-c17", alvo: "aplicacao", aplicavelAIds: ["terapia_compressiva"], classificacao: "inadequado",
    motivo: "Terapia compressiva está contraindicada em UPP — agravaria a pressão local na zona sacra.",
    idsTemas: ["decisao-clinica"] },
    { id: "ligadura-c17", alvo: "aplicacao", aplicavelAIds: ["ligadura"], classificacao: "inadequado",
    motivo: "Ligadura compressiva não está indicada em UPP sacra — não há componente venoso e a anatomia não comporta ligadura nesta região.",
    idsTemas: ["decisao-clinica"] },
    { id: "penso-rapido-c17", alvo: "aplicacao", aplicavelAIds: ["penso_rapido"], classificacao: "inadequado",
    motivo: "Penso rápido aderente é insuficiente para ferida profunda exsudativa e adere à fibrina/necrose.",
    idsTemas: ["decisao-clinica"] },
    ],
    zonasTecido: [],
    idsTemas: ["tecidos-e-leito", "desbridamento", "antimicrobianos", "biofilme", "gestao-exsudado", "escolha-do-penso", "decisao-clinica", "sinais-de-alarme"],
    planoRecomendado: {
    minimo: ["Limpeza com soro fisiológico", "Desbridamento enzimático (colagenase)", "Antimicrobiano tópico com prata", "Cobertura secundária absorvente", "Penso simples protetor", "Sinalizar a equipa médica"],
    otimizado: ["Limpeza com soro fisiológico ou octenilin-solução", "Desbridamento enzimático da necrose e fibrina (colagenase) com hidrogel adjuvante em áreas secas focais", "Antimicrobiano tópico com prata para controlo de bioburden (Aquacel Ag / Silvercel / Exufiber Ag / Allevyn Ag) — reavaliar duração às 2 semanas", "Cobertura secundária absorvente (Mepilex / Allevyn)", "Penso simples protetor", "Reposicionamento 2/2h e superfície de alívio de pressão imediata", "Sinalizar à equipa médica para avaliação sistémica e considerar desbridamento cortante"],
    },
  },

  // ─── Caso 18 ──────────────────────────────────────────────────────────────────
  {
    id: "18",
    slug: "18",
    tituloAbreviado: "Caso 18",
    titulo: "Lesão por pressão",
    descricao: "Treinar reconhecimento de undermining e adequação da cobertura à profundidade real.",
    competencias: "Identificação de descolamento, exploração de cavidade, escolha de material para ferida cavitada",
    dificuldade: "intermedio",
    ordem: 18,
    minutosEstimados: 12,
    status: "disponivel",
    srcImagem: "/caso18.jpg",
    altImagem: "Lesão por pressão com descolamento — © Medetec Medical Images (medetec.co.uk)",
    resumoIntro: "Utente com lesão por pressão e descolamento marcado para além dos bordos visíveis.",
    objetivo: "Reconhecer undermining e selecionar material capaz de preencher a cavidade real da ferida.",
    definicoesObservacao: observationDefinitions,
    promptsDialogo: dialoguePrompts,
    definicoesAplicacao: applicationDefinitions,
    objetivosVisuais: { tecidos: ["granulacao"], exsudado: ["seroso"], bordos: ["integra"] },
    tituloCenario: "UPP categoria III com descolamento",
    contextoPaciente: "Utente de 79 anos, com mobilidade muito reduzida há vários meses, lesão presente há cerca de 4 semanas com aparente estagnação.",
    bannerPaciente: "UPP com descolamento marcado — © Medetec Medical Images (medetec.co.uk)",
    estadoFerida: { exsudado: "moderado", infeccao: "contaminacao", tecido: "granulacao", perilesional: "integra", odor: "ausente" },
    variavelFerida: { exsudado: 3, infeccao: 0, tecido: 3, odor: 0, humidade: 3, profundidade: 4, bordos: 2, pele_perilesional: 4, dor: 2, hemorragia: 0, etiologia: 1, perfusao: 1 },
    detalhesObservacao: {
    imagem: { detalhe: "Ferida com abertura central pequena mas bordos demarcados a tracejado mostrando extensão de descolamento subjacente." },
    dimensoes: { detalhe: "Abertura visível ≈3 cm; descolamento estende-se ~5-6 cm para além do bordo visível (cavidade real significativamente maior)." },
    exsudado: { detalhe: "Moderado, transparente." },
    cheiro: { detalhe: "Sem odor significativo." },
    tecidos: { detalhe: "Leito visível avermelhado; cavidade subjacente não diretamente avaliável." },
    bordos: { detalhe: "Bordos da abertura irregulares; descolamento marcado a tracejado." },
    pele_perilesional: { detalhe: "Pele íntegra, sem maceração nem vermelhidão marcada." },
    },
    respostasDialogo: {
    dor: "Sinto algum incómodo quando me deito desse lado, mas não é uma dor forte — uns 3 em 10.",
    duracao: "A ferida abriu há cerca de 1 mês. Já fizeram pensos várias vezes mas parece estar igual.",
    posicao: "Passo muito tempo deitado. Tento mexer-me mas nem sempre consigo.",
    pensos: "Têm-me posto compressas e umas espumas, mudam de 2 em 2 dias.",
    febre: "Não tenho tido febre.",
    mobilidade: "Mexo-me com dificuldade — preciso de ajuda para virar na cama.",
    },
    tratamentosDisponiveis: [
    "cloreto-sodio", "octenilin-solucao",
    "betadine-solucao", "octiset",
    "aquacel", "alginato-calcio", "exufiber", "fibrosol",
    "mepilex", "allevyn",
    "varihesive-extra-fino",
    "hidrogel",
    "agua-oxigenada", "alcool-etilico",
    ],
    opcoesAplicacao: ["penso_simples", "penso_impermeavel", "ligadura", "terapia_compressiva", "direto_seco", "sem_protecao", "penso_rapido"],
    objetivosClinicosAlvo: [
    goal("cleanse-18", "Limpar o leito e a cavidade", "limpar-ferida", "essencial",
    "A irrigação com soro fisiológico permite limpar não só o leito visível mas também a cavidade subjacente.",
    { idsTratamento: ["cloreto-sodio", "octenilin-solucao"] }, ["decisao-clinica"]),
    goal("fill-cavity-18", "Preencher a cavidade com material apropriado", "controlar-exsudado", "essencial",
    "Feridas com descolamento exigem preenchimento da cavidade — alginatos ou hidrofibras moldam-se ao espaço, absorvem exsudado e evitam acumulação.",
    { idsTratamento: ["aquacel", "alginato-calcio", "exufiber", "fibrosol"] }, ["gestao-exsudado", "escolha-do-penso"]),
    goal("secondary-cover-18", "Penso secundário absorvente", "controlar-exsudado", "essencial",
    "Sobre o material de preenchimento, espuma absorvente como cobertura secundária dá conforto e gere o exsudado adicional.",
    { idsTratamento: ["mepilex", "allevyn"] }, ["gestao-exsudado", "escolha-do-penso"]),
    goal("app-cover-18", "Penso simples protetor", "cobertura-atraumatica", "essencial",
    "Penso simples protetor é a técnica adequada — protege sem comprimir nem aderir.",
    { idsAplicacao: ["penso_simples"] }, ["decisao-clinica"]),
    ],
    regrasAvaliacao: [
    { id: "antiseticos-c18", alvo: "tratamento", aplicavelAIds: ["betadine-solucao", "octiset"], classificacao: "redundante",
    motivo: "Sem sinais de infeção, antissépticos clássicos não estão indicados — soro ou octenidina são suficientes.",
    idsTemas: ["antimicrobianos"] },
    { id: "hidrocoloide-c18", alvo: "tratamento", aplicavelAIds: ["varihesive-extra-fino"], classificacao: "inadequado",
    motivo: "Hidrocolóide fino não preenche cavidades nem absorve exsudado moderado — inadequado para ferida com descolamento.",
    idsTemas: ["escolha-do-penso", "gestao-exsudado"] },
    { id: "hidrogel-c18", alvo: "tratamento", aplicavelAIds: ["hidrogel"], classificacao: "inadequado",
    motivo: "O leito está em granulação e o exsudado é moderado — adicionar humidade é contraproducente.",
    idsTemas: ["gestao-exsudado"] },
    { id: "agua-oxigenada-c18", alvo: "tratamento", aplicavelAIds: ["agua-oxigenada"], classificacao: "inadequado",
    motivo: "A água oxigenada é citotóxica e está contraindicada em feridas crónicas.",
    idsTemas: ["antimicrobianos"] },
    { id: "alcool-c18", alvo: "tratamento", aplicavelAIds: ["alcool-etilico"], classificacao: "inadequado",
    motivo: "O álcool destrói tecido viável e está contraindicado em qualquer ferida.",
    idsTemas: ["antimicrobianos"] },
    { id: "direto-seco-c18", alvo: "aplicacao", aplicavelAIds: ["direto_seco"], classificacao: "inadequado",
    motivo: "Material aplicado a seco adere ao leito e causa trauma na remoção.",
    idsTemas: ["decisao-clinica"] },
    { id: "sem-protecao-c18", alvo: "aplicacao", aplicavelAIds: ["sem_protecao"], classificacao: "inadequado",
    motivo: "Cavidade exposta sem cobertura permite contaminação e seca o leito.",
    idsTemas: ["decisao-clinica"] },
    { id: "compressiva-c18", alvo: "aplicacao", aplicavelAIds: ["terapia_compressiva"], classificacao: "inadequado",
    motivo: "Terapia compressiva está contraindicada em UPP — agravaria a pressão local.",
    idsTemas: ["decisao-clinica"] },
    { id: "ligadura-c18", alvo: "aplicacao", aplicavelAIds: ["ligadura"], classificacao: "inadequado",
    motivo: "Não há indicação para compressão — UPP não tem componente venoso.",
    idsTemas: ["decisao-clinica"] },
    { id: "penso-rapido-c18", alvo: "aplicacao", aplicavelAIds: ["penso_rapido"], classificacao: "inadequado",
    motivo: "Penso rápido aderente é insuficiente para ferida com cavidade e exsudado moderado.",
    idsTemas: ["decisao-clinica"] },
    ],
    zonasTecido: [],
    idsTemas: ["tecidos-e-leito", "gestao-exsudado", "escolha-do-penso", "decisao-clinica"],
    planoRecomendado: {
    minimo: ["Limpeza com soro fisiológico", "Material de preenchimento absorvente na cavidade", "Cobertura secundária com espuma", "Penso simples protetor"],
    otimizado: ["Limpeza com soro fisiológico (ou octenilin-solução) com irrigação da cavidade", "Preenchimento da cavidade com hidrofibra ou alginato (Aquacel / Alginato Cálcio / Exufiber)", "Cobertura secundária com espuma absorvente (Mepilex / Allevyn)", "Penso simples protetor", "Reposicionamento 2/2h e superfície de alívio de pressão", "Reavaliar a cada penso e medir extensão do descolamento"],
    },
  },
  // ─── Caso 19 ──────────────────────────────────────────────────────────────────
  {
    id: "19",
    slug: "19",
    tituloAbreviado: "Caso 19",
    titulo: "Queimadura",
    descricao: "Treinar a abordagem atraumática a queimadura de espessura parcial superficial na região facial/cefálica.",
    competencias: "Limpeza atraumática, seleção de cobertura em queimadura, controlo de exsudado, proteção da pele circundante",
    dificuldade: "intermedio",
    ordem: 19,
    minutosEstimados: 12,
    status: "disponivel",
    srcImagem: "/caso19.jpg",
    altImagem: "Queimadura espessura parcial cabeça — © Medetec Medical Images (medetec.co.uk)",
    resumoIntro: "Utente com queimadura de espessura parcial superficial na região cefálica, bolha parcialmente rota, exsudado seroso moderado.",
    objetivo: "Selecionar cobertura não aderente adequada para queimadura superficial com bolha e controlar o exsudado sem desbridar tecido viável.",
    definicoesObservacao: observationDefinitions,
    promptsDialogo: dialoguePrompts,
    definicoesAplicacao: applicationDefinitions,
    objetivosVisuais: { tecidos: ["epitelial", "granulacao"], exsudado: ["seroso"], bordos: ["integra"] },
    tituloCenario: "Queimadura de espessura parcial — cabeça",
    contextoPaciente: "Utente de 42 anos, queimadura térmica acidental há 48h. Bolha parcialmente rota, base eritematosa e húmida, muito dolorosa ao toque.",
    bannerPaciente: "Queimadura espessura parcial — cabeça — © Medetec Medical Images (medetec.co.uk)",
    estadoFerida: { exsudado: "moderado", infeccao: "contaminacao", tecido: "granulacao", perilesional: "eritematosa", odor: "ausente" },
    variavelFerida: { exsudado: 3, infeccao: 0, tecido: 4, odor: 0, humidade: 3, profundidade: 1, bordos: 4, pele_perilesional: 3, dor: 3, hemorragia: 0, etiologia: 7, perfusao: 1 },
    detalhesObservacao: {
    imagem: { detalhe: "Queimadura de espessura parcial superficial com base eritematosa brilhante; bolha parcialmente rota com cobertura epidérmica fina." },
    dimensoes: { detalhe: "≈6×4 cm; espessura parcial superficial, sem atingimento dérmico profundo aparente." },
    exsudado: { detalhe: "Moderado, transparente — abundante nos primeiros dias." },
    cheiro: { detalhe: "Sem odor." },
    tecidos: { detalhe: "Leito rosado e húmido." },
    bordos: { detalhe: "Bordos bem delimitados, pele adjacente avermelhada mas íntegra." },
    pele_perilesional: { detalhe: "Avermelhada em redor, sem maceração." },
    },
    respostasDialogo: {
    dor: "Dói muito — uns 8 em 10 quando tocam. Qualquer coisa que cole então é insuportável.",
    duracao: "Foi há dois dias. Derrubei líquido a ferver.",
    posicao: "Estou sentado, consigo andar normalmente.",
    pensos: "Puseram uma compressa simples na urgência e disseram para vir aqui.",
    febre: "Não tive febre.",
    mobilidade: "Totalmente independente.",
    },
    tratamentosDisponiveis: [
    "cloreto-sodio", "octenilin-solucao",
    "mepitel-one", "urgotul",
    "aquacel", "alginato-calcio",
    "mepilex", "allevyn",
    "varihesive-extra-fino",
    "betadine-solucao",
    "hidrogel",
    "agua-oxigenada", "alcool-etilico",
    ],
    opcoesAplicacao: ["penso_simples", "penso_impermeavel", "ligadura", "direto_seco", "sem_protecao", "penso_rapido"],
    objetivosClinicosAlvo: [
    goal("cleanse", "Limpar atraumaticamente o leito da queimadura", "limpar-ferida", "essencial",
    "Em queimaduras superficiais com bolha, a limpeza deve ser gentil com soro fisiológico ou solução antisséptica suave — nunca usar antissépticos citotóxicos.",
    { idsTratamento: ["cloreto-sodio", "octenilin-solucao"] }, ["decisao-clinica"]),
    goal("protect", "Aplicar cobertura não aderente adequada para queimadura", "cobertura-atraumatica", "essencial",
    "Interfaces não aderentes (Mepitel One, Urgotul) são o padrão de ouro em queimaduras superficiais — minimizam dor na troca e protegem o tecido em regeneração.",
    { idsTratamento: ["mepitel-one", "urgotul"] }, ["decisao-clinica", "escolha-do-penso"]),
    goal("manage-exudate", "Controlar o exsudado seroso moderado", "controlar-exsudado", "essencial",
    "O exsudado em queimadura superficial é fisiológico — deve ser absorvido sem dessecação. Usar absorvente secundário proporcional ao débito.",
    { idsTratamento: ["aquacel", "alginato-calcio", "mepilex", "allevyn"] }, ["gestao-exsudado"]),
    goal("proteger-pele", "Proteger a pele perilesional eritematosa", "proteger-perilesional", "adequado",
    "O eritema perilesional é reativo — proteger com barreira ou cobertura extra-fina evita progressão para maceração.",
    {}, ["decisao-clinica"]),
    goal("application-cover", "Fixar com ligadura não compressiva", "cobertura-atraumatica", "essencial",
    "Em queimadura cefálica, a ligadura permite fixação atraumática sem adesivos, que adeririam à pele frágil periférica e à interface não aderente.",
    { idsAplicacao: ["ligadura"] }, ["fixacao-e-remocao"]),
    ],
    regrasAvaliacao: [
    { id: "hidrogel-c19", alvo: "tratamento", aplicavelAIds: ["hidrogel"], classificacao: "redundante",
    motivo: "Hidrogel aumenta humidade numa ferida já muito exsudativa — risco de maceração perilesional.",
    idsTemas: ["gestao-exsudado"] },
    { id: "varihesive-c19", alvo: "tratamento", aplicavelAIds: ["varihesive-extra-fino"], classificacao: "redundante",
    motivo: "Hidrocolóide não é indicado para queimaduras com exsudado moderado a abundante — risco de acumulação de exsudado e maceração.",
    idsTemas: ["gestao-exsudado", "decisao-clinica"] },
    { id: "betadine-c19", alvo: "tratamento", aplicavelAIds: ["betadine-solucao"], classificacao: "inadequado",
    motivo: "Betadine é citotóxico para queratinócitos e fibroblastos — retarda a reepitelização em queimadura superficial.",
    idsTemas: ["decisao-clinica", "antimicrobianos"] },
    { id: "agua-oxigenada-c19", alvo: "tratamento", aplicavelAIds: ["agua-oxigenada"], classificacao: "inadequado",
    motivo: "Citotóxico e ineficaz — não deve ser usado em queimaduras.",
    idsTemas: ["decisao-clinica", "antimicrobianos"] },
    { id: "alcool-c19", alvo: "tratamento", aplicavelAIds: ["alcool-etilico"], classificacao: "inadequado",
    motivo: "Álcool é profundamente citotóxico e causa dor intensa — absolutamente contraindicado em queimaduras.",
    idsTemas: ["decisao-clinica", "antimicrobianos"] },
    { id: "direto-seco-c19", alvo: "aplicacao", aplicavelAIds: ["direto_seco", "sem_protecao"], classificacao: "inadequado",
    motivo: "Queimadura superficial requer cobertura não aderente — penso seco adere à base e causa dor e dano tissular na remoção.",
    idsTemas: ["decisao-clinica", "escolha-do-penso"] },
    { id: "penso-rapido-c19", alvo: "aplicacao", aplicavelAIds: ["penso_rapido"], classificacao: "inadequado",
    motivo: "Penso rápido aderente é contraindicado em queimaduras — causa dor intensa e remoção traumática.",
    idsTemas: ["decisao-clinica", "escolha-do-penso"] },
    ],
    zonasTecido: [],
    idsTemas: ["decisao-clinica", "gestao-exsudado", "escolha-do-penso", "fixacao-e-remocao", "antimicrobianos"],
    planoRecomendado: {
    minimo: ["Limpeza com soro fisiológico (irrigação gentil)", "Interface não aderente (Mepitel One ou Urgotul)", "Cobertura secundária absorvente (espuma ou alginato)", "Penso simples de fixação"],
    otimizado: ["Limpeza gentil com soro fisiológico morno ou Octenilin-solução", "Interface de silicone Mepitel One diretamente sobre a queimadura", "Cobertura secundária com Mepilex Border ou Allevyn", "Fixação suave com ligadura ou adesivo hipoalergénico", "Reavaliar em 48-72h sem remover interface se sem sinais de infeção"],
    },
  },
  // ─── Caso 20 ──────────────────────────────────────────────────────────────────
  {
    id: "20",
    slug: "20",
    tituloAbreviado: "Caso 20",
    titulo: "Queimadura",
    descricao: "Caso avançado de queimadura de espessura parcial profunda com risco de infeção e necessidade de decisão antimicrobiana.",
    competencias: "Avaliação de profundidade, decisão antimicrobiana em queimadura, gestão de exsudado abundante, reconhecimento de limites de autonomia",
    dificuldade: "avancado",
    ordem: 20,
    minutosEstimados: 15,
    status: "disponivel",
    srcImagem: "/caso20.jpg",
    altImagem: "Queimadura extensa coxa — © Medetec Medical Images (medetec.co.uk)",
    resumoIntro: "Utente com queimadura de espessura parcial profunda extensa na coxa, exsudado abundante, base pálida com áreas de fibrina, sem sensibilidade térmica.",
    objetivo: "Identificar profundidade, decidir sobre cobertura antimicrobiana e reconhecer quando referenciar para especialidade.",
    definicoesObservacao: observationDefinitions,
    promptsDialogo: dialoguePrompts,
    definicoesAplicacao: applicationDefinitions,
    objetivosVisuais: { tecidos: ["fibrina", "granulacao"], exsudado: ["seroso", "hematico"], bordos: ["pele-seca"] },
    tituloCenario: "Queimadura extensa da coxa",
    contextoPaciente: "Utente de 55 anos, queimadura por chama há 72h, extensa — ≈15% SCT coxa direita. Base pálida com áreas de fibrina, insensível ao toque leve. Sem febre mas leucocitose ligeira.",
    bannerPaciente: "Queimadura extensa coxa — © Medetec Medical Images (medetec.co.uk)",
    estadoFerida: { exsudado: "abundante", infeccao: "infecao-local-encoberta", tecido: "granulacao-fibrina", perilesional: "fragil", odor: "ligeiro" },
    variavelFerida: { exsudado: 4, infeccao: 1, tecido: 2, odor: 1, humidade: 4, profundidade: 3, bordos: 3, pele_perilesional: 2, dor: 2, hemorragia: 1, etiologia: 7, perfusao: 1 },
    detalhesObservacao: {
    imagem: { detalhe: "Queimadura extensa com base pálida e brilhante; áreas de fibrina amarela; hemorragia punctiforme dispersa; bordos bem delimitados mas pele perilesional seca e frágil." },
    dimensoes: { detalhe: "≈18×12 cm (≈15% SCT); espessura parcial profunda — derme reticular atingida." },
    exsudado: { detalhe: "Abundante, transparente e rosado — penso anterior saturado rapidamente." },
    cheiro: { detalhe: "Ligeiro odor presente." },
    tecidos: { detalhe: "Leito predominantemente pálido; zonas amareladas dispersas; sem áreas avermelhadas estabelecidas." },
    bordos: { detalhe: "Bordos bem delimitados; pele perilesional seca e descamativa." },
    pele_perilesional: { detalhe: "Frágil, seca e descamativa." },
    },
    respostasDialogo: {
    dor: "A dor é menos do que esperava — uns 4 em 10. O médico disse que isso é mau sinal, da profundidade.",
    duracao: "Aconteceu há 3 dias. Já estive na urgência — fizeram limpeza e puseram uma compressa.",
    posicao: "Estou na cama, não consigo apoiar a perna.",
    pensos: "Mudam todos os dias — sai imenso líquido, ensopa logo o penso.",
    febre: "Não tive febre. Mas fizeram análises e disseram que os glóbulos brancos estavam ligeiramente altos.",
    mobilidade: "Dependente para a mobilidade do membro afetado.",
    },
    tratamentosDisponiveis: [
    "cloreto-sodio", "octenilin-solucao",
    "mepitel-one",
    "aquacel-ag", "silvercel", "exufiber-ag", "allevyn-ag",
    "mepilex", "allevyn",
    "aquacel", "alginato-calcio",
    "urgotul",
    "betadine-solucao",
    "hidrogel",
    "colagenase",
    "agua-oxigenada", "alcool-etilico",
    ],
    opcoesAplicacao: ["penso_simples", "penso_impermeavel", "ligadura", "terapia_compressiva", "direto_seco", "sem_protecao", "penso_rapido"],
    objetivosClinicosAlvo: [
    goal("cleanse", "Limpar e irrigar o leito com solução adequada", "limpar-ferida", "essencial",
    "Em queimadura profunda com sinais de bioburden, preferir Octenilin-solução a soro simples.",
    { idsTratamento: ["cloreto-sodio", "octenilin-solucao"] }, ["decisao-clinica"]),
    goal("controlar-bioburden", "Aplicar cobertura antimicrobiana sobre interface não aderente", "controlar-bioburden", "essencial",
    "Queimadura de espessura parcial profunda com sinais de infeção local requer cobertura com prata ou outro antimicrobiano tópico.",
    { idsTratamento: ["aquacel-ag", "silvercel", "exufiber-ag", "allevyn-ag"] }, ["decisao-clinica", "antimicrobianos"]),
    goal("manage-exudate", "Controlar exsudado abundante com absorvente de alta capacidade", "controlar-exsudado", "adequado",
    "O exsudado abundante em queimadura profunda exige cobertura secundária com alta capacidade absortiva para evitar maceração perilesional.",
    { idsTratamento: ["aquacel-ag", "silvercel", "exufiber-ag", "allevyn-ag", "mepilex", "allevyn"] }, ["gestao-exsudado"]),
    goal("proteger-pele", "Proteger a pele perilesional frágil", "proteger-perilesional", "adequado",
    "Pele seca e frágil em redor de queimadura extensa deve ser protegida com barreira ou cobertura extra-fina para evitar extensão.",
    {}, ["decisao-clinica"]),
    goal("application-cover", "Fixar com ligadura não compressiva", "cobertura-atraumatica", "essencial",
    "Numa queimadura extensa da coxa com exsudado abundante, a ligadura mantém o penso firme sem compressão circunferencial e sem adesivos sobre pele perilesional frágil.",
    { idsAplicacao: ["ligadura"] }, ["fixacao-e-remocao"]),
    ],
    regrasAvaliacao: [
    { id: "hidrogel-c20", alvo: "tratamento", aplicavelAIds: ["hidrogel"], classificacao: "inadequado",
    motivo: "Hidrogel numa queimadura com exsudado abundante agrava a maceração e não tem papel clínico neste contexto.",
    idsTemas: ["gestao-exsudado", "decisao-clinica"] },
    { id: "colagenase-c20", alvo: "tratamento", aplicavelAIds: ["colagenase"], classificacao: "redundante",
    motivo: "Colagenase é para desbridamento enzimático de necrose — não há necrose franca neste caso; pode danificar derme viável.",
    idsTemas: ["desbridamento", "decisao-clinica"] },
    { id: "betadine-c20", alvo: "tratamento", aplicavelAIds: ["betadine-solucao"], classificacao: "inadequado",
    motivo: "Betadine é citotóxico para queratinócitos — retarda cicatrização em queimadura parcial profunda.",
    idsTemas: ["decisao-clinica", "antimicrobianos"] },
    { id: "agua-oxigenada-c20", alvo: "tratamento", aplicavelAIds: ["agua-oxigenada"], classificacao: "inadequado",
    motivo: "Citotóxico — contraindicado em queimaduras.",
    idsTemas: ["decisao-clinica", "antimicrobianos"] },
    { id: "alcool-c20", alvo: "tratamento", aplicavelAIds: ["alcool-etilico"], classificacao: "inadequado",
    motivo: "Absolutamente contraindicado em queimaduras — causa dor intensa e destruição tecidual.",
    idsTemas: ["decisao-clinica", "antimicrobianos"] },
    { id: "terapia-compressiva-c20", alvo: "aplicacao", aplicavelAIds: ["terapia_compressiva"], classificacao: "inadequado",
    motivo: "Terapia compressiva é contraindicada em queimaduras agudas — risco de isquémia e agravamento da lesão.",
    idsTemas: ["decisao-clinica"] },
    { id: "direto-seco-c20", alvo: "aplicacao", aplicavelAIds: ["direto_seco", "sem_protecao"], classificacao: "inadequado",
    motivo: "Queimadura profunda sem cobertura adequada expõe ao risco de infeção e dessecação — contraindicado.",
    idsTemas: ["decisao-clinica", "escolha-do-penso"] },
    { id: "penso-rapido-c20", alvo: "aplicacao", aplicavelAIds: ["penso_rapido"], classificacao: "inadequado",
    motivo: "Penso rápido aderente é contraindicado em queimaduras extensas.",
    idsTemas: ["decisao-clinica", "escolha-do-penso"] },
    ],
    zonasTecido: [],
    idsTemas: ["decisao-clinica", "antimicrobianos", "gestao-exsudado", "escolha-do-penso", "fixacao-e-remocao"],
    planoRecomendado: {
    minimo: ["Limpeza com Octenilin-solução ou soro fisiológico", "Interface não aderente (Mepitel One)", "Cobertura antimicrobiana com prata (Aquacel Ag / Allevyn Ag)", "Fixação com ligadura não compressiva"],
    otimizado: ["Limpeza irrigada com Octenilin-solução", "Interface de silicone Mepitel One", "Aquacel Ag+ ou Silvercel de alta absorção sobre a interface", "Cobertura secundária com espuma alta capacidade (Mepilex Transfer ou Allevyn Plus)", "Ligadura de fixação ligeira", "Referenciação para consulta de queimados se sem melhoria em 5-7 dias ou progressão de sinais de infeção"],
    },
  },
  // ─── Caso 21 ──────────────────────────────────────────────────────────────────
  {
    id: "21",
    slug: "21",
    tituloAbreviado: "Caso 21",
    titulo: "Deiscência abdominal",
    descricao: "Treinar manutenção de plano eficaz numa deiscência cirúrgica em granulação avançada.",
    competencias: "Reconhecimento de evolução positiva, cobertura proporcional, vigilância pós-cirúrgica",
    dificuldade: "intermedio",
    ordem: 21,
    minutosEstimados: 10,
    status: "disponivel",
    srcImagem: "/caso21.jpg",
    altImagem: "Deiscência abdominal em cicatrização — © Medetec Medical Images (medetec.co.uk)",
    resumoIntro: "Utente em pós-cirurgia abdominal com deiscência da ferida operatória, atualmente em fase de cicatrização sob hidrocolóide.",
    objetivo: "Reconhecer evolução positiva e manter plano adequado sem trocas desnecessárias de material.",
    definicoesObservacao: observationDefinitions,
    promptsDialogo: dialoguePrompts,
    definicoesAplicacao: applicationDefinitions,
    objetivosVisuais: { tecidos: ["granulacao"], exsudado: ["seroso"], bordos: ["integra"] },
    tituloCenario: "Deiscência abdominal em cicatrização",
    contextoPaciente: "Utente de 67 anos, 5 semanas após laparotomia eletiva, com deiscência parcial da ferida operatória atualmente em granulação franca.",
    bannerPaciente: "Deiscência abdominal em cicatrização — © Medetec Medical Images (medetec.co.uk)",
    estadoFerida: { exsudado: "moderado", infeccao: "contaminacao", tecido: "granulacao", perilesional: "integra", odor: "ausente" },
    variavelFerida: { exsudado: 3, infeccao: 0, tecido: 3, odor: 0, humidade: 3, profundidade: 3, bordos: 3, pele_perilesional: 4, dor: 1, hemorragia: 0, etiologia: 6, perfusao: 1 },
    detalhesObservacao: {
    imagem: { detalhe: "Ferida ovalada na parede abdominal, leito vermelho-vivo brilhante (granulação) ocupando toda a área visível, bordos definidos." },
    dimensoes: { detalhe: "≈6×4 cm; profundidade moderada — leito visível, sem cavidade extensa." },
    exsudado: { detalhe: "Moderado, transparente." },
    cheiro: { detalhe: "Sem odor." },
    tecidos: { detalhe: "Leito todo avermelhado; sem zonas amareladas nem pretas." },
    bordos: { detalhe: "Bordos regulares, bem definidos, sem descolamento." },
    pele_perilesional: { detalhe: "Pele íntegra, sem maceração nem vermelhidão marcada." },
    },
    respostasDialogo: {
    dor: "Já não me dói — talvez 1 em 10. Só sinto desconforto na mudança do penso.",
    duracao: "A operação foi há cerca de 5 semanas. A ferida abriu uns dias depois e tem vindo a fechar bem desde então.",
    posicao: "Estou a andar normalmente, deito-me de costas para não puxar a ferida.",
    pensos: "Têm-me posto um hidrocolóide, mudo a cada 3 ou 4 dias.",
    febre: "Não tive febre.",
    mobilidade: "Mexo-me bem, ando todos os dias um bocado.",
    },
    tratamentosDisponiveis: [
    "cloreto-sodio", "octenilin-solucao",
    "betadine-solucao", "octiset",
    "hidrocoloide", "varihesive-extra-fino",
    "aquacel", "alginato-calcio", "exufiber",
    "mepilex", "allevyn", "biatain",
    "urgotul",
    "hidrogel",
    "agua-oxigenada", "alcool-etilico",
    ],
    opcoesAplicacao: ["penso_simples", "penso_impermeavel", "ligadura", "terapia_compressiva", "direto_seco", "sem_protecao", "penso_rapido"],
    objetivosClinicosAlvo: [
    goal("cleanse", "Limpar o leito antes da cobertura", "limpar-ferida", "essencial",
    "Soro fisiológico para limpeza suave que preserva o tecido em granulação. Octenidina é alternativa razoável.",
    { idsTratamento: ["cloreto-sodio", "octenilin-solucao"] }, ["decisao-clinica", "antimicrobianos"]),
    goal("cover-proportional", "Manter cobertura adequada à profundidade e exsudado", "cobertura-atraumatica", "essencial",
    "Em deiscência com leito em granulação e exsudado moderado, hidrocolóide ou hidrofibra/alginato dão controlo de exsudado e ambiente húmido — manter material que está a funcionar.",
    { idsTratamento: ["hidrocoloide", "aquacel", "alginato-calcio", "exufiber"] }, ["escolha-do-penso", "tecidos-e-leito"]),
    goal("secondary-cover", "Cobertura secundária absorvente", "controlar-exsudado", "essencial",
    "Sobre a hidrofibra/alginato, espuma absorvente reforça gestão do exsudado e protege o leito.",
    { idsTratamento: ["mepilex", "allevyn", "biatain"] }, ["gestao-exsudado", "escolha-do-penso"]),
    goal("app-cover", "Penso simples protetor", "cobertura-atraumatica", "essencial",
    "Penso simples protetor é a técnica adequada — protege sem comprimir nem aderir.",
    { idsAplicacao: ["penso_simples"] }, ["decisao-clinica"]),
    ],
    regrasAvaliacao: [
    { id: "antiseticos-c21", alvo: "tratamento", aplicavelAIds: ["betadine-solucao", "octiset"], classificacao: "redundante",
    motivo: "Sem sinais de infeção, antissépticos clássicos não estão indicados. Em ferida em granulação, citotoxicidade pode atrasar progressão.",
    idsTemas: ["antimicrobianos"] },
    { id: "hidrocoloide-fino-c21", alvo: "tratamento", aplicavelAIds: ["varihesive-extra-fino"], classificacao: "redundante",
    motivo: "Hidrocolóide fino tem absorção limitada para exsudado moderado em ferida com profundidade — preferir versão regular ou hidrofibra.",
    idsTemas: ["gestao-exsudado", "escolha-do-penso"] },
    { id: "urgotul-c21", alvo: "tratamento", aplicavelAIds: ["urgotul"], classificacao: "redundante",
    motivo: "Urgotul é contacto não-aderente útil em epitelização — em granulação franca com exsudado moderado, hidrocolóide ou hidrofibra são preferíveis.",
    idsTemas: ["escolha-do-penso"] },
    { id: "hidrogel-c21", alvo: "tratamento", aplicavelAIds: ["hidrogel"], classificacao: "inadequado",
    motivo: "O leito está em granulação húmida — adicionar humidade é contraproducente.",
    idsTemas: ["gestao-exsudado"] },
    { id: "agua-oxigenada-c21", alvo: "tratamento", aplicavelAIds: ["agua-oxigenada"], classificacao: "inadequado",
    motivo: "A água oxigenada é citotóxica e está contraindicada em feridas crónicas e em granulação.",
    idsTemas: ["antimicrobianos"] },
    { id: "alcool-c21", alvo: "tratamento", aplicavelAIds: ["alcool-etilico"], classificacao: "inadequado",
    motivo: "O álcool destrói tecido viável — proibido em qualquer ferida.",
    idsTemas: ["antimicrobianos"] },
    { id: "compressiva-c21", alvo: "aplicacao", aplicavelAIds: ["terapia_compressiva"], classificacao: "inadequado",
    motivo: "Terapia compressiva não está indicada em ferida cirúrgica abdominal.",
    idsTemas: ["decisao-clinica"] },
    { id: "ligadura-c21", alvo: "aplicacao", aplicavelAIds: ["ligadura"], classificacao: "inadequado",
    motivo: "Ligadura compressiva não tem aplicação em ferida cirúrgica abdominal.",
    idsTemas: ["decisao-clinica"] },
    { id: "direto-seco-c21", alvo: "aplicacao", aplicavelAIds: ["direto_seco"], classificacao: "inadequado",
    motivo: "Material a seco adere ao leito em granulação e arranca tecido na remoção.",
    idsTemas: ["decisao-clinica"] },
    { id: "sem-protecao-c21", alvo: "aplicacao", aplicavelAIds: ["sem_protecao"], classificacao: "inadequado",
    motivo: "Sem cobertura, ferida fica exposta a contaminação e dessecação.",
    idsTemas: ["decisao-clinica"] },
    { id: "penso-rapido-c21", alvo: "aplicacao", aplicavelAIds: ["penso_rapido"], classificacao: "inadequado",
    motivo: "Penso rápido aderente é insuficiente para ferida com profundidade e adere ao leito.",
    idsTemas: ["decisao-clinica"] },
    ],
    zonasTecido: [],
    idsTemas: ["tecidos-e-leito", "escolha-do-penso", "gestao-exsudado", "decisao-clinica"],
    planoRecomendado: {
    minimo: ["Limpeza com soro fisiológico", "Hidrocolóide ou hidrofibra adequada à profundidade", "Cobertura secundária absorvente", "Penso simples protetor"],
    otimizado: ["Limpeza com soro fisiológico (ou octenilin-solução)", "Manter hidrocolóide ou alternar para hidrofibra/alginato (Aquacel, Alginato Cálcio, Exufiber) consoante exsudado", "Cobertura secundária absorvente (Mepilex, Allevyn, Biatain)", "Penso simples protetor", "Reavaliar a cada penso e monitorizar sinais de infeção (calor, dor, eritema, exsudado purulento, febre)"],
    },
  },
  // ─── Caso 22 ──────────────────────────────────────────────────────────────────
  {
    id: "22",
    slug: "22",
    tituloAbreviado: "Caso 22",
    titulo: "Úlcera venosa",
    descricao: "Treinar ajuste do plano em ferida que está a evoluir bem — proporcionalidade e manutenção da compressão.",
    competencias: "Reconhecimento de evolução positiva, ajuste proporcional do material, manutenção da terapia compressiva",
    dificuldade: "intermedio",
    ordem: 22,
    minutosEstimados: 10,
    status: "disponivel",
    srcImagem: "/caso22.jpg",
    altImagem: "Úlcera venosa em cicatrização — © Medetec Medical Images (medetec.co.uk)",
    resumoIntro: "Utente com úlcera venosa em fase avançada de cicatrização sob tratamento prévio.",
    objetivo: "Identificar evolução positiva e ajustar o plano sem comprometer o que está a funcionar — proporcionalidade do material e manutenção da compressão.",
    definicoesObservacao: observationDefinitions,
    promptsDialogo: dialoguePrompts,
    definicoesAplicacao: applicationDefinitions,
    objetivosVisuais: { tecidos: ["granulacao", "epitelial"], exsudado: ["seroso"], bordos: ["integra"] },
    tituloCenario: "Úlcera venosa em cicatrização",
    contextoPaciente: "Utente de 68 anos, úlcera venosa de evolução prolongada, agora em fase de melhoria após várias semanas de tratamento adequado com compressão.",
    bannerPaciente: "Úlcera venosa em cicatrização — © Medetec Medical Images (medetec.co.uk)",
    estadoFerida: { exsudado: "escasso", infeccao: "contaminacao", tecido: "granulacao", perilesional: "integra", odor: "ausente" },
    variavelFerida: { exsudado: 2, infeccao: 0, tecido: 3, odor: 0, humidade: 2, profundidade: 1, bordos: 4, pele_perilesional: 4, dor: 1, hemorragia: 0, etiologia: 2, perfusao: 1 },
    detalhesObservacao: {
    imagem: { detalhe: "Úlcera de perna com leito predominantemente em granulação vermelho-vivo e áreas de epitelização inicial nas bordas." },
    dimensoes: { detalhe: "≈4×3 cm; profundidade superficial — ferida em retração." },
    exsudado: { detalhe: "Ligeiro, transparente." },
    cheiro: { detalhe: "Sem odor." },
    tecidos: { detalhe: "Leito avermelhado em progressão, com pele rosada a avançar pelas bordas." },
    bordos: { detalhe: "Bordos em retração com pele rosada a invadir progressivamente o leito." },
    pele_perilesional: { detalhe: "Pele íntegra, sem maceração; pode estar escurecida por zonas residuais." },
    },
    respostasDialogo: {
    dor: "Já não me dói praticamente nada — talvez 1 em 10. Antes era muito pior.",
    duracao: "Tive esta ferida muito tempo — quase 8 meses. Mas há umas 6 semanas começou a fechar.",
    posicao: "Tento andar mais e elevar a perna quando me sento.",
    pensos: "Têm-me posto uma espuma fina e uma ligadura por cima. Mudo de 3 em 3 dias.",
    febre: "Não tenho tido febre.",
    mobilidade: "Ando bem agora. Já não me incomoda como antes.",
    },
    tratamentosDisponiveis: [
    "cloreto-sodio", "octenilin-solucao",
    "betadine-solucao", "octiset",
    "varihesive-extra-fino",
    "mepilex", "allevyn-nao-adesivo",
    "urgotul",
    "aquacel", "alginato-calcio", "exufiber",
    "biatain",
    "hidrogel",
    "agua-oxigenada", "alcool-etilico",
    ],
    opcoesAplicacao: ["penso_simples", "penso_impermeavel", "ligadura", "terapia_compressiva", "direto_seco", "sem_protecao", "penso_rapido"],
    objetivosClinicosAlvo: [
    goal("cleanse", "Limpar o leito antes da cobertura", "limpar-ferida", "essencial",
    "Soro fisiológico para limpeza suave — preserva o tecido em epitelização. Octenidina é alternativa razoável.",
    { idsTratamento: ["cloreto-sodio", "octenilin-solucao"] }, ["decisao-clinica", "antimicrobianos"]),
    goal("cover-thin", "Cobertura proporcional e atraumática", "cobertura-atraumatica", "essencial",
    "Em ferida em cicatrização avançada com exsudado ligeiro, prioriza-se proteção atraumática: hidrocolóide fino, espuma de baixa absorção ou contacto não-aderente.",
    { idsTratamento: ["varihesive-extra-fino", "mepilex", "allevyn-nao-adesivo", "urgotul"] }, ["escolha-do-penso", "tecidos-e-leito"]),
    goal("compression", "Manter terapia compressiva", "compressao-venosa", "essencial",
    "A terapia compressiva mantém-se até resolução completa e como prevenção após — interromper antes da cicatrização total agrava o risco de recidiva.",
    { idsAplicacao: ["terapia_compressiva"] }, ["decisao-clinica"]),
    goal("ligature-alt", "Ligadura compressiva como alternativa adequada", "compressao-venosa", "adequado",
    "Quando terapia compressiva multi-camada não está disponível, ligadura compressiva é alternativa razoável.",
    { idsAplicacao: ["ligadura"] }, ["decisao-clinica"]),
    ],
    regrasAvaliacao: [
    { id: "antiseticos-c22", alvo: "tratamento", aplicavelAIds: ["betadine-solucao", "octiset"], classificacao: "redundante",
    motivo: "Sem sinais de infeção, antissépticos clássicos não estão indicados — soro ou octenidina são suficientes. Em fase de epitelização, citotoxicidade pode parar a evolução positiva.",
    idsTemas: ["antimicrobianos"] },
    { id: "alginatos-c22", alvo: "tratamento", aplicavelAIds: ["aquacel", "alginato-calcio", "exufiber"], classificacao: "redundante",
    motivo: "Em ferida com exsudado ligeiro e tecido em epitelização, hidrofibras/alginatos de alta absorção sobre-secam o leito e podem comprometer a evolução.",
    idsTemas: ["gestao-exsudado", "escolha-do-penso"] },
    { id: "biatain-c22", alvo: "tratamento", aplicavelAIds: ["biatain"], classificacao: "redundante",
    motivo: "Espuma de alta absorção é desproporcionada para exsudado ligeiro — espumas finas (Mepilex, Allevyn não-adesivo) ou hidrocolóide fino são preferíveis.",
    idsTemas: ["gestao-exsudado", "escolha-do-penso"] },
    { id: "hidrogel-c22", alvo: "tratamento", aplicavelAIds: ["hidrogel"], classificacao: "inadequado",
    motivo: "O leito não está seco — adicionar humidade pode macerar tecido em epitelização e parar a evolução.",
    idsTemas: ["gestao-exsudado", "tecidos-e-leito"] },
    { id: "agua-oxigenada-c22", alvo: "tratamento", aplicavelAIds: ["agua-oxigenada"], classificacao: "inadequado",
    motivo: "A água oxigenada é citotóxica e está particularmente contraindicada em ferida em epitelização — destruiria células em proliferação.",
    idsTemas: ["antimicrobianos"] },
    { id: "alcool-c22", alvo: "tratamento", aplicavelAIds: ["alcool-etilico"], classificacao: "inadequado",
    motivo: "O álcool destrói tecido viável e está contraindicado em qualquer ferida.",
    idsTemas: ["antimicrobianos"] },
    { id: "direto-seco-c22", alvo: "aplicacao", aplicavelAIds: ["direto_seco"], classificacao: "inadequado",
    motivo: "Material a seco adere ao leito e arranca tecido em epitelização na remoção — particularmente prejudicial nesta fase.",
    idsTemas: ["decisao-clinica"] },
    { id: "sem-protecao-c22", alvo: "aplicacao", aplicavelAIds: ["sem_protecao"], classificacao: "inadequado",
    motivo: "Sem cobertura, ferida em epitelização fica exposta a contaminação e dessecação.",
    idsTemas: ["decisao-clinica"] },
    { id: "penso-simples-c22", alvo: "aplicacao", aplicavelAIds: ["penso_simples"], classificacao: "redundante",
    motivo: "Penso simples sem compressão é insuficiente em úlcera venosa, mesmo em fase de cicatrização — a compressão mantém-se até à resolução completa.",
    idsTemas: ["decisao-clinica"] },
    { id: "penso-rapido-c22", alvo: "aplicacao", aplicavelAIds: ["penso_rapido"], classificacao: "inadequado",
    motivo: "Penso rápido aderente arranca tecido em epitelização na remoção.",
    idsTemas: ["decisao-clinica"] },
    ],
    zonasTecido: [],
    idsTemas: ["tecidos-e-leito", "escolha-do-penso", "decisao-clinica", "concerns-do-utente"],
    planoRecomendado: {
    minimo: ["Limpeza com soro fisiológico", "Cobertura fina atraumática", "Manter terapia compressiva"],
    otimizado: ["Limpeza com soro fisiológico (ou octenilin-solução)", "Cobertura fina e atraumática — hidrocolóide fino, espuma de baixa absorção ou contacto não-aderente (Varihesive extra-fino, Mepilex, Allevyn não-adesivo, Urgotul)", "Manter terapia compressiva até cicatrização completa e considerar manutenção como prevenção", "Reavaliar ao fim de 1-2 semanas para confirmar progressão"],
    },
  },

  // ─── Caso 23 ──────────────────────────────────────────────────────────────────
  {
    id: "23",
    slug: "23",
    tituloAbreviado: "Caso 23",
    titulo: "Sinus pilonidal estagnado",
    descricao: "Treinar abordagem a cavidade pós-cirúrgica em região sacrococcígea com cicatrização estagnada.",
    competencias: "Gestão de cavidade pós-cirúrgica, suspeita de biofilme, cuidados em região anatómica difícil",
    dificuldade: "avancado",
    ordem: 23,
    minutosEstimados: 11,
    status: "disponivel",
    srcImagem: "/caso23.jpg",
    altImagem: "Sinus pilonidal estagnado — © Medetec Medical Images (medetec.co.uk)",
    resumoIntro: "Utente em pós-operatório de excisão de sinus pilonidal, ferida em segunda intenção que não progride.",
    objetivo: "Identificar cicatrização estagnada, instituir plano com material absorvente + suspeita de biofilme.",
    definicoesObservacao: observationDefinitions,
    promptsDialogo: dialoguePrompts,
    definicoesAplicacao: applicationDefinitions,
    objetivosVisuais: { tecidos: ["fibrina"], exsudado: ["seroso"], bordos: ["pele-seca"] },
    tituloCenario: "Sinus pilonidal estagnado",
    contextoPaciente: "Utente de 32 anos, 8 semanas após excisão de sinus pilonidal, ferida em segunda intenção sem progressão nas últimas 4 semanas.",
    bannerPaciente: "Sinus pilonidal estagnado — © Medetec Medical Images (medetec.co.uk)",
    estadoFerida: { exsudado: "moderado", infeccao: "contaminacao", tecido: "fibrina", perilesional: "integra", odor: "ligeiro" },
    variavelFerida: { exsudado: 3, infeccao: 0, tecido: 2, odor: 1, humidade: 3, profundidade: 3, bordos: 2, pele_perilesional: 4, dor: 2, hemorragia: 0, etiologia: 6, perfusao: 1 },
    detalhesObservacao: {
    imagem: { detalhe: "Cavidade na região sacrococcígea com leito amarelado, exsudado moderado e bordos sem retração." },
    dimensoes: { detalhe: "≈3×2 cm de abertura, profundidade significativa — cavidade." },
    exsudado: { detalhe: "Moderado, transparente." },
    cheiro: { detalhe: "Ligeiro odor." },
    tecidos: { detalhe: "Leito amarelado; sem zonas avermelhadas dominantes; aspeto estagnado." },
    bordos: { detalhe: "Bordos sem progressão de retração nas últimas semanas." },
    pele_perilesional: { detalhe: "Pele íntegra; pelos peri-lesionais presentes." },
    },
    respostasDialogo: {
    dor: "Tenho dor moderada — uns 3 em 10. Pior quando me sento muito tempo.",
    duracao: "Operação foi há 8 semanas. Ao início parecia fechar, mas há um mês está parada.",
    posicao: "Evito sentar-me no plano duro. Tento andar mais.",
    pensos: "Mudo todos os dias — costumam encher-se.",
    febre: "Não tive febre.",
    mobilidade: "Mexo-me bem, é sobretudo o desconforto ao sentar.",
    },
    tratamentosDisponiveis: [
    "cloreto-sodio", "octenilin-solucao",
    "betadine-solucao", "octiset",
    "colagenase",
    "aquacel", "alginato-calcio", "exufiber",
    "aquacel-ag", "exufiber-ag",
    "actisorb-silver",
    "mepilex", "allevyn",
    "urgo-clean", "urgo-start",
    "varihesive-extra-fino",
    "hidrogel",
    "agua-oxigenada", "alcool-etilico",
    ],
    opcoesAplicacao: ["penso_simples", "penso_impermeavel", "ligadura", "terapia_compressiva", "direto_seco", "sem_protecao", "penso_rapido"],
    objetivosClinicosAlvo: [
    goal("cleanse", "Limpar e irrigar a cavidade", "limpar-ferida", "essencial",
    "Soro fisiológico ou octenidina — irrigação para alcançar a cavidade.",
    { idsTratamento: ["cloreto-sodio", "octenilin-solucao"] }, ["decisao-clinica", "antimicrobianos"]),
    goal("desbridamento", "Desbridar a fibrina presente", "desbridamento", "essencial",
    "A fibrina e suspeita de biofilme bloqueiam progressão — colagenase como desbridante enzimático.",
    { idsTratamento: ["colagenase"] }, ["desbridamento"]),
    goal("fill-cavity", "Preencher a cavidade com material absorvente", "controlar-exsudado", "essencial",
    "Cavidade exige preenchimento — hidrofibra ou alginato moldam-se ao espaço.",
    { idsTratamento: ["aquacel", "alginato-calcio", "exufiber"] }, ["gestao-exsudado", "escolha-do-penso"]),
    goal("biofilm-suspect", "Considerar antimicrobiano com prata por suspeita de biofilme", "controlar-bioburden", "adequado",
    "Estagnação prolongada com odor ligeiro sugere biofilme — antimicrobiano com prata pode ser útil em ciclo curto (2 semanas).",
    { idsTratamento: ["aquacel-ag", "exufiber-ag", "actisorb-silver"] }, ["antimicrobianos"]),
    goal("secondary-cover", "Cobertura secundária absorvente", "controlar-exsudado", "essencial",
    "Espuma absorvente sobre o material primário.",
    { idsTratamento: ["mepilex", "allevyn"] }, ["gestao-exsudado", "escolha-do-penso"]),
    goal("app-cover", "Penso simples protetor", "cobertura-atraumatica", "essencial",
    "Penso simples protetor.",
    { idsAplicacao: ["penso_simples"] }, ["decisao-clinica"]),
    ],
    regrasAvaliacao: [
    { id: "antiseticos-c23", alvo: "tratamento", aplicavelAIds: ["betadine-solucao", "octiset"], classificacao: "adequado",
    motivo: "Antissépsia tópica de curta duração pode ajudar em suspeita de biofilme — adjuvante razoável.",
    idsTemas: ["antimicrobianos"] },
    { id: "hidrocoloide-c23", alvo: "tratamento", aplicavelAIds: ["varihesive-extra-fino"], classificacao: "inadequado",
    motivo: "Hidrocolóide fino não preenche cavidade nem absorve adequadamente — inadequado para esta região.",
    idsTemas: ["escolha-do-penso", "gestao-exsudado"] },
    { id: "hidrogel-c23", alvo: "tratamento", aplicavelAIds: ["hidrogel"], classificacao: "inadequado",
    motivo: "Adicionar humidade em cavidade com exsudado moderado é contraproducente.",
    idsTemas: ["gestao-exsudado"] },
    { id: "agua-oxigenada-c23", alvo: "tratamento", aplicavelAIds: ["agua-oxigenada"], classificacao: "inadequado",
    motivo: "Citotóxica.",
    idsTemas: ["antimicrobianos"] },
    { id: "alcool-c23", alvo: "tratamento", aplicavelAIds: ["alcool-etilico"], classificacao: "inadequado",
    motivo: "O álcool destrói tecido viável.",
    idsTemas: ["antimicrobianos"] },
    { id: "compressiva-c23", alvo: "aplicacao", aplicavelAIds: ["terapia_compressiva"], classificacao: "inadequado",
    motivo: "Terapia compressiva não está indicada na região sacrococcígea.",
    idsTemas: ["decisao-clinica"] },
    { id: "ligadura-c23", alvo: "aplicacao", aplicavelAIds: ["ligadura"], classificacao: "inadequado",
    motivo: "Ligadura compressiva não está indicada nesta região.",
    idsTemas: ["decisao-clinica"] },
    { id: "direto-seco-c23", alvo: "aplicacao", aplicavelAIds: ["direto_seco"], classificacao: "inadequado",
    motivo: "Material a seco adere ao leito.",
    idsTemas: ["decisao-clinica"] },
    { id: "sem-protecao-c23", alvo: "aplicacao", aplicavelAIds: ["sem_protecao"], classificacao: "inadequado",
    motivo: "Cavidade exposta sem cobertura.",
    idsTemas: ["decisao-clinica"] },
    { id: "penso-rapido-c23", alvo: "aplicacao", aplicavelAIds: ["penso_rapido"], classificacao: "inadequado",
    motivo: "Penso rápido aderente é insuficiente para cavidade.",
    idsTemas: ["decisao-clinica"] },
    ],
    zonasTecido: [],
    idsTemas: ["tecidos-e-leito", "desbridamento", "antimicrobianos", "gestao-exsudado", "escolha-do-penso", "decisao-clinica"],
    planoRecomendado: {
    minimo: ["Limpeza com soro fisiológico", "Desbridamento da fibrina", "Hidrofibra/alginato (com prata se biofilme)", "Cobertura secundária", "Penso simples"],
    otimizado: ["Limpeza com soro fisiológico (ou octenilin) — irrigar a cavidade", "Desbridamento enzimático (colagenase)", "Material absorvente — considerar versão com prata por suspeita de biofilme (Aquacel Ag, Exufiber Ag, Actisorb-Silver) durante 2 semanas, reavaliar", "Cobertura secundária absorvente (Mepilex, Allevyn)", "Penso simples protetor", "Cuidados específicos da região: depilação peri-lesional, evitar pressão prolongada sentado, higiene rigorosa", "Se persistir estagnação, considerar matrizes lipido-colóide (Urgo-Clean, Urgo-Start) e referir à cirurgia para reavaliação"],
    },
  },
  // ─── Caso 24 ──────────────────────────────────────────────────────────────────
  {
    id: "24",
    slug: "24",
    tituloAbreviado: "Caso 24",
    titulo: "Úlcera de etiologia incerta",
    descricao: "Treinar gestão local de úlcera sem diagnóstico definitivo — investigar antes de comprimir.",
    competencias: "Reconhecimento de etiologia incerta, gestão local rigorosa, decisão de não comprimir sem avaliação vascular",
    dificuldade: "avancado",
    ordem: 24,
    minutosEstimados: 13,
    status: "disponivel",
    srcImagem: "/caso24.jpg",
    altImagem: "Úlcera de perna extensa de etiologia incerta — © Medetec Medical Images (medetec.co.uk)",
    resumoIntro: "Utente com úlcera extensa da perna sem etiologia confirmada, em fase exsudativa.",
    objetivo: "Estabelecer plano local rigoroso e referir para investigação etiológica antes de impor compressão.",
    definicoesObservacao: observationDefinitions,
    promptsDialogo: dialoguePrompts,
    definicoesAplicacao: applicationDefinitions,
    objetivosVisuais: { tecidos: ["granulacao", "fibrina"], exsudado: ["seroso"], bordos: ["pele-seca"] },
    tituloCenario: "Úlcera de perna de etiologia incerta",
    contextoPaciente: "Utente de 64 anos, úlcera de perna extensa há 5 meses sem etiologia confirmada — investigação ainda em curso (Doppler, biopsia, autoanticorpos).",
    bannerPaciente: "Úlcera extensa de etiologia incerta — © Medetec Medical Images (medetec.co.uk)",
    estadoFerida: { exsudado: "abundante", infeccao: "contaminacao", tecido: "granulacao", perilesional: "macerada", odor: "ausente" },
    variavelFerida: { exsudado: 4, infeccao: 0, tecido: 3, odor: 0, humidade: 4, profundidade: 2, bordos: 2, pele_perilesional: 1, dor: 3, hemorragia: 0, etiologia: 2, perfusao: 1 },
    detalhesObservacao: {
    imagem: { detalhe: "Úlcera extensa da perna, leito heterogéneo com áreas de granulação e fibrina, bordos irregulares." },
    dimensoes: { detalhe: "Área extensa — vários decímetros quadrados; profundidade superficial." },
    exsudado: { detalhe: "Abundante, transparente." },
    cheiro: { detalhe: "Sem odor significativo." },
    tecidos: { detalhe: "Zonas avermelhadas intercaladas com zonas amareladas; sem áreas pretas." },
    bordos: { detalhe: "Bordos irregulares." },
    pele_perilesional: { detalhe: "Esbranquiçada e amolecida em redor por contacto prolongado com exsudado." },
    },
    respostasDialogo: {
    dor: "Dói bastante — uns 5 em 10. Aumenta ao fim do dia.",
    duracao: "Esta ferida apareceu há cerca de 5 meses. Os médicos estão a fazer exames.",
    posicao: "Tento manter a perna elevada.",
    pensos: "Tenho posto compressas — ficam encharcadas todos os dias.",
    febre: "Não tive febre.",
    mobilidade: "Ando com dificuldade pela dor.",
    },
    urlImagemDepois: "/caso24_2.jpg",
    legendaEvolucao: "Após investigação completa e tratamento dirigido à etiologia identificada, com gestão local rigorosa do exsudado e proteção peri-lesional, a úlcera evoluiu para encerramento completo — o diagnóstico correto foi determinante para a evolução.",
    tratamentosDisponiveis: [
    "cloreto-sodio", "octenilin-solucao",
    "betadine-solucao", "octiset",
    "aquacel", "alginato-calcio", "exufiber",
    "fibrosol", "vliwasorb",
    "mepilex", "allevyn", "biatain",
    "varihesive-extra-fino",
    "hidrogel",
    "oxido-zinco", "atl",
    "protetor-spray",
    "agua-oxigenada", "alcool-etilico",
    ],
    opcoesAplicacao: ["penso_simples", "penso_impermeavel", "ligadura", "terapia_compressiva", "direto_seco", "sem_protecao", "penso_rapido"],
    objetivosClinicosAlvo: [
    goal("cleanse", "Limpar o leito e a pele peri-lesional", "limpar-ferida", "essencial",
    "Soro fisiológico para o leito e para a pele macerada peri-lesional. Octenidina alternativa razoável.",
    { idsTratamento: ["cloreto-sodio", "octenilin-solucao"] }, ["decisao-clinica", "antimicrobianos"]),
    goal("absorbent", "Material altamente absorvente", "controlar-exsudado", "essencial",
    "Exsudado abundante exige hidrofibra ou alginato de alta absorção — gestão de exsudado é prioridade enquanto aguarda diagnóstico.",
    { idsTratamento: ["aquacel", "alginato-calcio", "exufiber", "fibrosol", "vliwasorb"] }, ["gestao-exsudado", "escolha-do-penso"]),
    goal("proteger-perilesional", "Proteger pele peri-lesional macerada", "proteger-pele", "essencial",
    "Maceração extensa exige barreira protetora — película em spray ou óxido de zinco.",
    { idsTratamento: ["protetor-spray", "oxido-zinco"] }, ["protecao-perilesional"]),
    goal("secondary-cover", "Cobertura secundária absorvente", "controlar-exsudado", "essencial",
    "Espuma absorvente sobre o material primário.",
    { idsTratamento: ["mepilex", "allevyn", "biatain"] }, ["gestao-exsudado", "escolha-do-penso"]),
    goal("compression-conditional", "Terapia compressiva — apenas após confirmação de etiologia venosa e exclusão de isquemia", "compressao-venosa", "adequado",
    "Em úlcera de etiologia incerta, a compressão NÃO é essencial — pode ser perigosa se houver componente arterial não detetado. Considerar apenas após Doppler e índice tornozelo-braço normais.",
    { idsAplicacao: ["terapia_compressiva"] }, ["decisao-clinica"]),
    goal("app-cover", "Penso simples protetor", "cobertura-atraumatica", "essencial",
    "Penso simples protetor é a técnica de aplicação adequada enquanto se aguarda diagnóstico.",
    { idsAplicacao: ["penso_simples"] }, ["decisao-clinica"]),
    ],
    regrasAvaliacao: [
    { id: "antiseticos-c24", alvo: "tratamento", aplicavelAIds: ["betadine-solucao", "octiset"], classificacao: "redundante",
    motivo: "Sem sinais de infeção, antissépticos clássicos não estão indicados — soro ou octenidina são suficientes.",
    idsTemas: ["antimicrobianos"] },
    { id: "hidrocoloide-c24", alvo: "tratamento", aplicavelAIds: ["varihesive-extra-fino"], classificacao: "inadequado",
    motivo: "Hidrocolóide fino tem absorção muito limitada para exsudado abundante — agravaria a maceração.",
    idsTemas: ["gestao-exsudado", "escolha-do-penso"] },
    { id: "hidrogel-c24", alvo: "tratamento", aplicavelAIds: ["hidrogel"], classificacao: "inadequado",
    motivo: "Adicionar humidade em ferida exsudativa é contraproducente.",
    idsTemas: ["gestao-exsudado"] },
    { id: "atl-c24", alvo: "tratamento", aplicavelAIds: ["atl"], classificacao: "redundante",
    motivo: "ATL hidrata mas não tem ação barreira eficaz contra exsudado abundante.",
    idsTemas: ["protecao-perilesional"] },
    { id: "agua-oxigenada-c24", alvo: "tratamento", aplicavelAIds: ["agua-oxigenada"], classificacao: "inadequado",
    motivo: "Citotóxica.",
    idsTemas: ["antimicrobianos"] },
    { id: "alcool-c24", alvo: "tratamento", aplicavelAIds: ["alcool-etilico"], classificacao: "inadequado",
    motivo: "O álcool destrói tecido viável.",
    idsTemas: ["antimicrobianos"] },
    { id: "ligadura-c24", alvo: "aplicacao", aplicavelAIds: ["ligadura"], classificacao: "redundante",
    motivo: "Ligadura compressiva é alternativa razoável quando compressão estiver confirmada como segura — neste caso ainda em investigação.",
    idsTemas: ["decisao-clinica"] },
    { id: "direto-seco-c24", alvo: "aplicacao", aplicavelAIds: ["direto_seco"], classificacao: "inadequado",
    motivo: "Material a seco adere ao leito.",
    idsTemas: ["decisao-clinica"] },
    { id: "sem-protecao-c24", alvo: "aplicacao", aplicavelAIds: ["sem_protecao"], classificacao: "inadequado",
    motivo: "Sem cobertura, exsudado abundante macera ainda mais a pele.",
    idsTemas: ["decisao-clinica"] },
    { id: "penso-rapido-c24", alvo: "aplicacao", aplicavelAIds: ["penso_rapido"], classificacao: "inadequado",
    motivo: "Penso rápido aderente é insuficiente para ferida exsudativa.",
    idsTemas: ["decisao-clinica"] },
    ],
    zonasTecido: [],
    idsTemas: ["tecidos-e-leito", "gestao-exsudado", "escolha-do-penso", "protecao-perilesional", "decisao-clinica"],
    planoRecomendado: {
    minimo: ["Limpeza com soro fisiológico", "Hidrofibra/alginato altamente absorvente", "Proteção peri-lesional", "Cobertura secundária", "Penso simples"],
    otimizado: ["Limpeza com soro fisiológico (ou octenilin) do leito e da pele peri-lesional", "Hidrofibra ou alginato altamente absorvente (Aquacel, Alginato Cálcio, Exufiber, Fibrosol, Vliwasorb)", "Proteção peri-lesional com película em spray ou óxido de zinco", "Cobertura secundária absorvente (Mepilex, Allevyn, Biatain)", "Penso simples protetor", "INVESTIGAR ETIOLOGIA antes de comprimir — Doppler arterial, índice tornozelo-braço, biopsia se necessário, autoanticorpos", "Compressão SÓ após confirmação de etiologia venosa e exclusão de isquemia"],
    },
  },
  // ─── Caso 25 ──────────────────────────────────────────────────────────────────
  {
    id: "25",
    slug: "25",
    tituloAbreviado: "Caso 25",
    titulo: "Lesão por pressão",
    descricao: "Treinar desbridamento de fibrina e seleção de cobertura proporcional em UPP superficial.",
    competencias: "Reconhecimento de UPP superficial com fibrina, desbridamento enzimático, seleção proporcional",
    dificuldade: "introdutorio",
    ordem: 25,
    minutosEstimados: 9,
    status: "disponivel",
    srcImagem: "/caso25.jpg",
    altImagem: "Lesão por pressão superficial — © Medetec Medical Images (medetec.co.uk)",
    resumoIntro: "Utente acamado com lesão por pressão superficial e leito predominantemente fibrinoso.",
    objetivo: "Selecionar plano coerente para UPP superficial: desbridar fibrina, controlar exsudado e proteger leito.",
    definicoesObservacao: observationDefinitions,
    promptsDialogo: dialoguePrompts,
    definicoesAplicacao: applicationDefinitions,
    objetivosVisuais: { tecidos: ["fibrina"], exsudado: ["seroso"], bordos: ["integra"] },
    tituloCenario: "UPP superficial — categoria II",
    contextoPaciente: "Utente de 81 anos, em internamento prolongado, lesão presente há cerca de 2 semanas com aparência estável.",
    bannerPaciente: "UPP superficial com fibrina — © Medetec Medical Images (medetec.co.uk)",
    estadoFerida: { exsudado: "escasso", infeccao: "contaminacao", tecido: "fibrina", perilesional: "integra", odor: "ausente" },
    variavelFerida: { exsudado: 2, infeccao: 0, tecido: 2, odor: 0, humidade: 2, profundidade: 2, bordos: 3, pele_perilesional: 4, dor: 1, hemorragia: 0, etiologia: 1, perfusao: 1 },
    detalhesObservacao: {
    imagem: { detalhe: "Lesão ovalada com leito amarelado homogéneo e bordos ligeiramente eritematosos." },
    dimensoes: { detalhe: "≈4×3 cm; profundidade superficial, sem cavidade." },
    exsudado: { detalhe: "Ligeiro, transparente." },
    cheiro: { detalhe: "Sem odor." },
    tecidos: { detalhe: "Leito predominantemente amarelado; sem zonas pretas nem avermelhadas significativas." },
    bordos: { detalhe: "Bordos regulares com ligeira vermelhidão no rebordo; sem descolamento." },
    pele_perilesional: { detalhe: "Pele íntegra, sem maceração; ligeiramente avermelhada no rebordo imediato." },
    },
    respostasDialogo: {
    dor: "Quase não dói — talvez um 1 em 10. Só sinto quando me viram.",
    duracao: "Apareceu há cerca de 2 semanas e tem ficado mais ou menos na mesma.",
    posicao: "Estou muito tempo na cama. Tentam virar-me mas não chega.",
    pensos: "Têm-me posto compressas. Mudam de 2 em 2 dias.",
    febre: "Não tive febre.",
    mobilidade: "Mexo-me pouco — preciso de ajuda para tudo na cama.",
    },
    tratamentosDisponiveis: [
    "cloreto-sodio", "octenilin-solucao",
    "betadine-solucao", "octiset",
    "colagenase",
    "varihesive-extra-fino",
    "mepilex", "allevyn-nao-adesivo",
    "aquacel", "alginato-calcio",
    "hidrogel",
    "agua-oxigenada", "alcool-etilico",
    ],
    opcoesAplicacao: ["penso_simples", "penso_impermeavel", "ligadura", "terapia_compressiva", "direto_seco", "sem_protecao", "penso_rapido"],
    objetivosClinicosAlvo: [
    goal("cleanse-25", "Limpar o leito antes da cobertura", "limpar-ferida", "essencial",
    "Soro fisiológico é o padrão. Octenidina é uma alternativa razoável com baixa citotoxicidade.",
    { idsTratamento: ["cloreto-sodio", "octenilin-solucao"] }, ["decisao-clinica", "antimicrobianos"]),
    goal("debride-25", "Desbridar a fibrina dominante", "desbridamento", "essencial",
    "A fibrina ocupa praticamente todo o leito — a colagenase é o desbridante enzimático adequado para fibrina superficial.",
    { idsTratamento: ["colagenase"] }, ["desbridamento", "tecidos-e-leito"]),
    goal("cover-thin-25", "Cobertura proporcional para ferida superficial", "cobertura-atraumatica", "essencial",
    "UPP superficial com exsudado ligeiro: hidrocolóide fino ou espuma de baixa absorção dão proteção sem desidratar nem sobrecarregar.",
    { idsTratamento: ["varihesive-extra-fino", "mepilex", "allevyn-nao-adesivo"] }, ["escolha-do-penso", "tecidos-e-leito"]),
    goal("app-cover-25", "Penso simples protetor", "cobertura-atraumatica", "essencial",
    "Penso simples protetor é a técnica adequada — protege sem comprimir nem aderir.",
    { idsAplicacao: ["penso_simples"] }, ["decisao-clinica"]),
    ],
    regrasAvaliacao: [
    { id: "antiseticos-c25", alvo: "tratamento", aplicavelAIds: ["betadine-solucao", "octiset"], classificacao: "redundante",
    motivo: "Sem sinais de infeção, antissépticos clássicos não estão indicados — soro ou octenidina são suficientes.",
    idsTemas: ["antimicrobianos"] },
    { id: "alginato-c25", alvo: "tratamento", aplicavelAIds: ["aquacel", "alginato-calcio"], classificacao: "redundante",
    motivo: "Para exsudado ligeiro num leito superficial, hidrofibras/alginatos são desproporcionados — secam excessivamente o leito.",
    idsTemas: ["gestao-exsudado", "escolha-do-penso"] },
    { id: "hidrogel-c25", alvo: "tratamento", aplicavelAIds: ["hidrogel"], classificacao: "inadequado",
    motivo: "O leito tem fibrina húmida — adicionar humidade aumenta a maceração sem benefício.",
    idsTemas: ["gestao-exsudado"] },
    { id: "agua-oxigenada-c25", alvo: "tratamento", aplicavelAIds: ["agua-oxigenada"], classificacao: "inadequado",
    motivo: "A água oxigenada é citotóxica e não acrescenta valor em feridas crónicas.",
    idsTemas: ["antimicrobianos"] },
    { id: "alcool-c25", alvo: "tratamento", aplicavelAIds: ["alcool-etilico"], classificacao: "inadequado",
    motivo: "O álcool destrói tecido viável e está contraindicado em qualquer ferida.",
    idsTemas: ["antimicrobianos"] },
    { id: "direto-seco-c25", alvo: "aplicacao", aplicavelAIds: ["direto_seco"], classificacao: "inadequado",
    motivo: "Material aplicado a seco adere ao leito e causa trauma na remoção.",
    idsTemas: ["decisao-clinica"] },
    { id: "sem-protecao-c25", alvo: "aplicacao", aplicavelAIds: ["sem_protecao"], classificacao: "inadequado",
    motivo: "Expor a ferida sem cobertura aumenta o risco de contaminação.",
    idsTemas: ["decisao-clinica"] },
    { id: "compressiva-c25", alvo: "aplicacao", aplicavelAIds: ["terapia_compressiva"], classificacao: "inadequado",
    motivo: "Terapia compressiva está contraindicada em UPP — agravaria a pressão local.",
    idsTemas: ["decisao-clinica"] },
    { id: "ligadura-c25", alvo: "aplicacao", aplicavelAIds: ["ligadura"], classificacao: "inadequado",
    motivo: "Não há indicação para compressão.",
    idsTemas: ["decisao-clinica"] },
    { id: "penso-rapido-c25", alvo: "aplicacao", aplicavelAIds: ["penso_rapido"], classificacao: "redundante",
    motivo: "Penso rápido aderente pode causar trauma na remoção sobre tecido frágil.",
    idsTemas: ["decisao-clinica"] },
    ],
    zonasTecido: [],
    idsTemas: ["tecidos-e-leito", "desbridamento", "escolha-do-penso", "decisao-clinica"],
    planoRecomendado: {
    minimo: ["Limpeza com soro fisiológico", "Desbridamento enzimático da fibrina", "Cobertura proporcional (hidrocolóide fino ou espuma de baixa absorção)", "Penso simples protetor"],
    otimizado: ["Limpeza com soro fisiológico (ou octenilin-solução)", "Desbridamento enzimático da fibrina (colagenase)", "Cobertura fina proporcional ao exsudado (Varihesive extra-fino, Mepilex ou Allevyn não-adesivo)", "Penso simples protetor", "Alívio de pressão e reposicionamento 2/2h"],
    },
  },
  // ─── Caso 26 ──────────────────────────────────────────────────────────────────
  {
    id: "26",
    slug: "26",
    tituloAbreviado: "Caso 26",
    titulo: "Ferida cirúrgica",
    descricao: "Treinar reconhecimento de sinais de ILC e decisão de escalada vs. tratamento local.",
    competencias: "Reconhecimento de infeção do local cirúrgico, decisão de escalada, controlo local com antimicrobiano",
    dificuldade: "avancado",
    ordem: 26,
    minutosEstimados: 12,
    status: "disponivel",
    srcImagem: "/caso26.jpg",
    altImagem: "Ferida cirúrgica da anca com suspeita de infeção — © Medetec Medical Images (medetec.co.uk)",
    resumoIntro: "Utente em pós-operatório de cirurgia da anca com ferida cirúrgica que apresenta sinais sugestivos de infeção do local cirúrgico.",
    objetivo: "Reconhecer sinais de ILC, sinalizar à equipa médica para cultura e decisão sistémica, e instituir antimicrobiano tópico adequado.",
    definicoesObservacao: observationDefinitions,
    promptsDialogo: dialoguePrompts,
    definicoesAplicacao: applicationDefinitions,
    objetivosVisuais: { tecidos: ["fibrina"], exsudado: ["seroso", "purulento"], bordos: ["rubor"] },
    tituloCenario: "Ferida cirúrgica da anca com complicação",
    contextoPaciente: "Utente de 71 anos, 12 dias após artroplastia da anca, com ferida cirúrgica que apresenta eritema crescente, dor aumentada e exsudado mais turvo nos últimos dias.",
    bannerPaciente: "Ferida cirúrgica da anca com suspeita de ILC — © Medetec Medical Images (medetec.co.uk)",
    estadoFerida: { exsudado: "moderado", infeccao: "infecao-local-evidente", tecido: "fibrina", perilesional: "eritematosa", odor: "ligeiro" },
    variavelFerida: { exsudado: 3, infeccao: 1, tecido: 2, odor: 1, humidade: 3, profundidade: 2, bordos: 1, pele_perilesional: 3, dor: 3, hemorragia: 0, etiologia: 6, perfusao: 1 },
    detalhesObservacao: {
    imagem: { detalhe: "Ferida cirúrgica linear na anca com áreas de fibrina, halo eritematoso marcado e exsudado seroso a turvo." },
    dimensoes: { detalhe: "Incisão ≈12 cm com áreas de abertura parcial; profundidade moderada." },
    exsudado: { detalhe: "Moderado, turvo." },
    cheiro: { detalhe: "Ligeiro odor presente." },
    tecidos: { detalhe: "Zonas amareladas ao longo da incisão; sem zonas pretas; sem áreas avermelhadas dominantes." },
    bordos: { detalhe: "Bordos irregulares, avermelhados, estendendo-se vários cm para além da linha de sutura." },
    pele_perilesional: { detalhe: "Avermelhada e edemaciada em redor da incisão." },
    },
    respostasDialogo: {
    dor: "Tenho dor — uns 5 ou 6 em 10. Aumentou nos últimos 3 ou 4 dias.",
    duracao: "Foi operado há 12 dias. Tudo correu bem inicialmente, mas há cerca de 3 dias começou a doer mais e a ficar mais vermelho.",
    posicao: "Tento mexer-me com cuidado, mas dói quando me apoio nesse lado.",
    pensos: "Têm-me posto compressas com solução salina e cobrindo. Mudam todos os dias.",
    febre: "Senti um pouco de calafrios ontem. Não medi a temperatura mas sinto-me quente.",
    mobilidade: "Ando com canadianas mas custa-me mais agora.",
    },
    tratamentosDisponiveis: [
    "cloreto-sodio", "octenilin-solucao",
    "betadine-solucao", "octiset",
    "aquacel-ag", "silvercel", "exufiber-ag", "allevyn-ag",
    "actisorb-silver",
    "aquacel", "alginato-calcio",
    "mepilex", "allevyn",
    "hidrocoloide", "varihesive-extra-fino",
    "hidrogel",
    "agua-oxigenada", "alcool-etilico",
    ],
    opcoesAplicacao: ["penso_simples", "penso_impermeavel", "ligadura", "terapia_compressiva", "direto_seco", "sem_protecao", "penso_rapido"],
    objetivosClinicosAlvo: [
    goal("cleanse", "Limpar e irrigar o leito", "limpar-ferida", "essencial",
    "Soro fisiológico ou octenidina para limpeza inicial — irrigação ajuda a remover detritos e exsudado.",
    { idsTratamento: ["cloreto-sodio", "octenilin-solucao"] }, ["decisao-clinica", "antimicrobianos"]),
    goal("antimicrobial", "Antimicrobiano tópico para controlo local de bioburden", "controlar-bioburden", "essencial",
    "Sinais de infeção local exigem antimicrobiano de penso com prata como adjuvante — não substitui antibioterapia sistémica se indicada.",
    { idsTratamento: ["aquacel-ag", "silvercel", "exufiber-ag", "allevyn-ag", "actisorb-silver"] }, ["antimicrobianos", "biofilme"]),
    goal("secondary-cover", "Cobertura secundária absorvente", "controlar-exsudado", "essencial",
    "Espuma absorvente sobre o material primário gere o exsudado adicional.",
    { idsTratamento: ["mepilex", "allevyn"] }, ["gestao-exsudado", "escolha-do-penso"]),
    goal("app-cover", "Penso simples protetor", "cobertura-atraumatica", "essencial",
    "Penso simples protetor é a técnica adequada.",
    { idsAplicacao: ["penso_simples"] }, ["decisao-clinica"]),
    goal("antiseptic-adjunct", "Antissépsia tópica de curta duração como adjuvante", "controlar-bioburden", "adequado",
    "Em suspeita de ILC, antissépsia local de curta duração é apropriada como adjuvante — octenidina ou iodopovidona em durações limitadas.",
    { idsTratamento: ["betadine-solucao", "octiset"] }, ["antimicrobianos"]),
    ],
    regrasAvaliacao: [
    { id: "hidrofibra-sem-prata-c26", alvo: "tratamento", aplicavelAIds: ["aquacel", "alginato-calcio"], classificacao: "redundante",
    motivo: "Hidrofibra/alginato sem prata não controla bioburden — neste caso há indicação para antimicrobiano de penso. Versão com prata é preferível.",
    idsTemas: ["antimicrobianos", "escolha-do-penso"] },
    { id: "hidrocoloide-c26", alvo: "tratamento", aplicavelAIds: ["hidrocoloide", "varihesive-extra-fino"], classificacao: "inadequado",
    motivo: "Hidrocolóide está contraindicado em ferida com sinais de infeção — favorece anaerobiose e oclui sinais de progressão.",
    idsTemas: ["escolha-do-penso", "antimicrobianos"] },
    { id: "hidrogel-c26", alvo: "tratamento", aplicavelAIds: ["hidrogel"], classificacao: "inadequado",
    motivo: "Adicionar humidade em ferida com bioburden e exsudado moderado é contraproducente.",
    idsTemas: ["gestao-exsudado"] },
    { id: "agua-oxigenada-c26", alvo: "tratamento", aplicavelAIds: ["agua-oxigenada"], classificacao: "inadequado",
    motivo: "A água oxigenada é citotóxica e contraindicada em feridas, mesmo infetadas.",
    idsTemas: ["antimicrobianos"] },
    { id: "alcool-c26", alvo: "tratamento", aplicavelAIds: ["alcool-etilico"], classificacao: "inadequado",
    motivo: "O álcool destrói tecido viável — proibido em qualquer ferida.",
    idsTemas: ["antimicrobianos"] },
    { id: "compressiva-c26", alvo: "aplicacao", aplicavelAIds: ["terapia_compressiva"], classificacao: "inadequado",
    motivo: "Terapia compressiva não está indicada em ferida cirúrgica da anca.",
    idsTemas: ["decisao-clinica"] },
    { id: "ligadura-c26", alvo: "aplicacao", aplicavelAIds: ["ligadura"], classificacao: "inadequado",
    motivo: "Ligadura compressiva não tem aplicação nesta região.",
    idsTemas: ["decisao-clinica"] },
    { id: "direto-seco-c26", alvo: "aplicacao", aplicavelAIds: ["direto_seco"], classificacao: "inadequado",
    motivo: "Material a seco adere ao leito.",
    idsTemas: ["decisao-clinica"] },
    { id: "sem-protecao-c26", alvo: "aplicacao", aplicavelAIds: ["sem_protecao"], classificacao: "inadequado",
    motivo: "Ferida com suspeita de infeção exposta agrava risco de progressão.",
    idsTemas: ["decisao-clinica"] },
    { id: "penso-rapido-c26", alvo: "aplicacao", aplicavelAIds: ["penso_rapido"], classificacao: "inadequado",
    motivo: "Penso rápido aderente é insuficiente e adere à fibrina.",
    idsTemas: ["decisao-clinica"] },
    ],
    zonasTecido: [],
    idsTemas: ["tecidos-e-leito", "antimicrobianos", "biofilme", "escolha-do-penso", "decisao-clinica", "sinais-de-alarme"],
    planoRecomendado: {
    minimo: ["Limpeza com soro fisiológico", "Antimicrobiano tópico com prata", "Cobertura secundária absorvente", "Penso simples", "Sinalizar à equipa médica para cultura e avaliação sistémica"],
    otimizado: ["Sinalizar IMEDIATAMENTE à equipa médica — suspeita de ILC pós-artroplastia exige avaliação para cultura microbiológica e decisão sobre antibioterapia sistémica", "Limpeza com soro fisiológico ou octenilin-solução", "Antimicrobiano tópico com prata como adjuvante (Aquacel Ag, Silvercel, Exufiber Ag, Allevyn Ag) — reavaliar duração às 2 semanas", "Cobertura secundária absorvente (Mepilex, Allevyn)", "Penso simples protetor", "Monitorização rigorosa: sinais sistémicos (febre, calafrios), evolução do eritema, dor, exsudado"],
    },
  },
  // ─── Caso 27 ──────────────────────────────────────────────────────────────────
  {
    id: "27",
    slug: "27",
    tituloAbreviado: "Caso 27",
    titulo: "Ferida traumática em cicatrização",
    descricao: "Treinar o reconhecimento de evolução positiva numa ferida traumática e a proporcionalidade da intervenção.",
    competencias: "Leitura de granulação, proporcionalidade terapêutica, manutenção de plano eficaz, decisão de continuidade",
    dificuldade: "intermedio",
    ordem: 27,
    minutosEstimados: 10,
    status: "disponivel",
    srcImagem: "/caso27.jpg",
    altImagem: "Ferida traumática em cicatrização — © Medetec Medical Images (medetec.co.uk)",
    resumoIntro: "Utente com ferida traumática por queda, atualmente em fase de granulação ativa, sem sinais de infeção, exsudado reduzido.",
    objetivo: "Reconhecer evolução favorável e manter plano proporcional sem intervenções desnecessárias.",
    definicoesObservacao: observationDefinitions,
    promptsDialogo: dialoguePrompts,
    definicoesAplicacao: applicationDefinitions,
    objetivosVisuais: { tecidos: ["granulacao", "epitelial"], exsudado: ["seroso"], bordos: ["integra"] },
    tituloCenario: "Ferida traumática em cicatrização",
    contextoPaciente: "Utente de 38 anos, ferida por queda de bicicleta há 10 dias no membro inferior. Boa higiene, sem comorbilidades. Granulação viva, epitelização visível nas bordas, exsudado seroso escasso.",
    bannerPaciente: "Ferida traumática em cicatrização — © Medetec Medical Images (medetec.co.uk)",
    estadoFerida: { exsudado: "escasso", infeccao: "contaminacao", tecido: "granulacao", perilesional: "integra", odor: "ausente" },
    variavelFerida: { exsudado: 1, infeccao: 0, tecido: 3, odor: 0, humidade: 1, profundidade: 1, bordos: 4, pele_perilesional: 4, dor: 1, hemorragia: 0, etiologia: 5, perfusao: 1 },
    detalhesObservacao: {
    imagem: { detalhe: "Ferida com leito em granulação vermelho vivo, uniforme; epitelização visível na periferia; sem exsudado significativo." },
    dimensoes: { detalhe: "≈4×3 cm; profundidade superficial, em fase avançada de granulação." },
    exsudado: { detalhe: "Escasso, transparente." },
    cheiro: { detalhe: "Sem odor." },
    tecidos: { detalhe: "Leito avermelhado, uniforme. Pele rosada a avançar das bordas." },
    bordos: { detalhe: "Bordos bem definidos, com halo rosado nas margens." },
    pele_perilesional: { detalhe: "Pele íntegra, seca, sem vermelhidão nem maceração." },
    },
    respostasDialogo: {
    dor: "Só dói um pouco quando tocam — uns 2 em 10. Está muito melhor do que estava.",
    duracao: "Aconteceu há dez dias. Está a melhorar visivelmente.",
    posicao: "Consigo andar, mas evito esforço com a perna.",
    pensos: "Têm mudado o penso em dias alternados. Está quase seco.",
    febre: "Não tive febre nenhuma.",
    mobilidade: "Independente com limitação ligeira.",
    },
    tratamentosDisponiveis: [
    "cloreto-sodio",
    "varihesive-extra-fino",
    "mepitel-one", "urgotul",
    "mepilex", "allevyn",
    "aquacel",
    "aquacel-ag", "allevyn-ag",
    "betadine-solucao",
    "hidrogel",
    "colagenase",
    "agua-oxigenada", "alcool-etilico",
    ],
    opcoesAplicacao: ["penso_simples", "penso_impermeavel", "ligadura", "direto_seco", "sem_protecao", "penso_rapido"],
    objetivosClinicosAlvo: [
    goal("cleanse", "Limpar atraumaticamente o leito em granulação", "limpar-ferida", "essencial",
    "Soro fisiológico é suficiente — granulação ativa não requer antisséptico.",
    { idsTratamento: ["cloreto-sodio"] }, ["tecidos-e-leito"]),
    goal("protect", "Aplicar cobertura não aderente proporcional ao exsudado escasso", "cobertura-atraumatica", "essencial",
    "Cobertura não aderente que mantenha humidade sem excesso — hidrocolóide ou interface com absorvente fino são opções proporcionais.",
    { idsTratamento: ["varihesive-extra-fino", "mepitel-one", "urgotul"] }, ["escolha-do-penso"]),
    goal("manage-exudate", "Manter equilíbrio hídrico sem dessecação nem maceração", "controlar-exsudado", "adequado",
    "Exsudado escasso requer cobertura que mantenha humidade fisiológica — absorventes de alta capacidade são desproporcionais.",
    {}, ["gestao-exsudado"]),
    goal("application-cover", "Aplicar penso simples protetor", "cobertura-atraumatica", "essencial",
    "Penso simples protetor é proporcional ao estado da ferida — protege a granulação ativa e a epitelização sem comprimir nem aderir.",
    { idsAplicacao: ["penso_simples"] }, ["fixacao-e-remocao"]),
    ],
    regrasAvaliacao: [
    { id: "mepilex-c27", alvo: "tratamento", aplicavelAIds: ["mepilex", "allevyn"], classificacao: "redundante",
    motivo: "Espuma absorvente de alta capacidade é desproporcional para exsudado escasso — pode dessecificar o leito.",
    idsTemas: ["gestao-exsudado", "escolha-do-penso"] },
    { id: "aquacel-c27", alvo: "tratamento", aplicavelAIds: ["aquacel"], classificacao: "redundante",
    motivo: "Hidrofibra em leito com exsudado escasso pode aderir e traumatizar o tecido de granulação.",
    idsTemas: ["gestao-exsudado"] },
    { id: "aquacel-ag-c27", alvo: "tratamento", aplicavelAIds: ["aquacel-ag", "allevyn-ag"], classificacao: "redundante",
    motivo: "Antimicrobiano desnecessário numa ferida sem sinais de infeção — uso não indicado prolonga desnecessariamente o custo e não beneficia o utente.",
    idsTemas: ["antimicrobianos", "decisao-clinica"] },
    { id: "hidrogel-c27", alvo: "tratamento", aplicavelAIds: ["hidrogel"], classificacao: "redundante",
    motivo: "Hidrogel num leito com exsudado escasso pode ser útil, mas aumenta risco de maceração — hidrocolóide é mais proporcional.",
    idsTemas: ["gestao-exsudado"] },
    { id: "colagenase-c27", alvo: "tratamento", aplicavelAIds: ["colagenase"], classificacao: "inadequado",
    motivo: "Desbridamento enzimático não tem indicação — não há necrose nem fibrina. Pode danificar granulação ativa.",
    idsTemas: ["desbridamento", "decisao-clinica"] },
    { id: "betadine-c27", alvo: "tratamento", aplicavelAIds: ["betadine-solucao"], classificacao: "inadequado",
    motivo: "Betadine inibe a granulação — contraindicado em feridas em cicatrização ativa sem infeção.",
    idsTemas: ["antimicrobianos", "decisao-clinica"] },
    { id: "agua-oxigenada-c27", alvo: "tratamento", aplicavelAIds: ["agua-oxigenada"], classificacao: "inadequado",
    motivo: "Citotóxico — destrói tecido de granulação ativo.",
    idsTemas: ["antimicrobianos"] },
    { id: "alcool-c27", alvo: "tratamento", aplicavelAIds: ["alcool-etilico"], classificacao: "inadequado",
    motivo: "Álcool é citotóxico e causa dor — contraindicado em feridas abertas.",
    idsTemas: ["antimicrobianos"] },
    { id: "direto-seco-c27", alvo: "aplicacao", aplicavelAIds: ["direto_seco"], classificacao: "inadequado",
    motivo: "Penso seco adere à granulação e causa trauma na remoção — prejudica a epitelização.",
    idsTemas: ["escolha-do-penso"] },
    { id: "sem-protecao-c27", alvo: "aplicacao", aplicavelAIds: ["sem_protecao"], classificacao: "inadequado",
    motivo: "Ferida em granulação sem cobertura fica exposta a contaminação e dessecação.",
    idsTemas: ["escolha-do-penso"] },
    { id: "penso-rapido-c27", alvo: "aplicacao", aplicavelAIds: ["penso_rapido"], classificacao: "redundante",
    motivo: "Penso rápido aderente pode traumatizar bordos de epitelização — preferir cobertura não aderente.",
    idsTemas: ["escolha-do-penso"] },
    ],
    zonasTecido: [],
    idsTemas: ["tecidos-e-leito", "gestao-exsudado", "escolha-do-penso", "decisao-clinica"],
    planoRecomendado: {
    minimo: ["Limpeza com soro fisiológico", "Cobertura não aderente (hidrocolóide extra-fino ou interface)", "Penso secundário simples se necessário"],
    otimizado: ["Limpeza atraumática com soro fisiológico morno", "Varihesive extra-fino ou Mepitel One com cobertura absorvente fina", "Troca em 3-5 dias ou se saturado", "Documentar progressão da epitelização"],
    },
  },
  // ─── Caso 28 ──────────────────────────────────────────────────────────────────
  {
    id: "28",
    slug: "28",
    tituloAbreviado: "Caso 28",
    titulo: "Ferida cirúrgica",
    descricao: "Treinar abordagem a ferida cirúrgica estagnada com hemorragia ligeira ao penso.",
    competencias: "Avaliação de ferida estagnada, gestão de hemorragia ligeira, reavaliação de plano",
    dificuldade: "intermedio",
    ordem: 28,
    minutosEstimados: 11,
    status: "disponivel",
    srcImagem: "/caso28.jpg",
    altImagem: "Ferida cirúrgica ortopédica com má cicatrização — © Medetec Medical Images (medetec.co.uk)",
    resumoIntro: "Utente em pós-operatório ortopédico com ferida cirúrgica que apresenta evolução lenta e hemorragia ligeira aos pensos.",
    objetivo: "Reavaliar plano em ferida estagnada e gerir hemorragia ligeira sem comprometer leito.",
    definicoesObservacao: observationDefinitions,
    promptsDialogo: dialoguePrompts,
    definicoesAplicacao: applicationDefinitions,
    objetivosVisuais: { tecidos: ["fibrina"], exsudado: ["seroso", "hematico"], bordos: ["pele-seca"] },
    tituloCenario: "Ferida cirúrgica ortopédica",
    contextoPaciente: "Utente de 58 anos, 4 semanas após cirurgia ortopédica do membro inferior, com ferida que não progride como esperado e apresenta sangramento ligeiro nos pensos.",
    bannerPaciente: "Ferida ortopédica com má cicatrização — © Medetec Medical Images (medetec.co.uk)",
    estadoFerida: { exsudado: "moderado", infeccao: "contaminacao", tecido: "fibrina", perilesional: "integra", odor: "ausente" },
    variavelFerida: { exsudado: 3, infeccao: 0, tecido: 2, odor: 0, humidade: 3, profundidade: 2, bordos: 2, pele_perilesional: 4, dor: 2, hemorragia: 1, etiologia: 6, perfusao: 1 },
    detalhesObservacao: {
    imagem: { detalhe: "Ferida cirúrgica linear com áreas de fibrina, leito heterogéneo com pequenas zonas de sangue seco e exsudado serohemático moderado." },
    dimensoes: { detalhe: "≈8 cm de comprimento, profundidade moderada." },
    exsudado: { detalhe: "Moderado, transparente e rosado — alguma componente sanguínea ligeira." },
    cheiro: { detalhe: "Sem odor." },
    tecidos: { detalhe: "Zonas amareladas; sem zonas pretas; sem áreas avermelhadas dominantes; alguns pontos de sangue seco." },
    bordos: { detalhe: "Bordos irregulares, sem retração significativa." },
    pele_perilesional: { detalhe: "Pele íntegra, sem maceração, sem vermelhidão marcada." },
    },
    respostasDialogo: {
    dor: "Tenho dor moderada — uns 3 ou 4 em 10. Mais quando mexem o penso.",
    duracao: "Operação foi há cerca de 4 semanas. A ferida não tem fechado como o cirurgião esperava.",
    posicao: "Tento manter a perna elevada, mas continua a sangrar um pouco aos pensos.",
    pensos: "Mudam todos os dias. Sai sempre algum sangue para o penso.",
    febre: "Não tive febre.",
    mobilidade: "Ando com auxiliar de marcha. Limitado mas sem grandes problemas.",
    },
    tratamentosDisponiveis: [
    "cloreto-sodio", "octenilin-solucao",
    "betadine-solucao", "octiset",
    "alginato-calcio", "aquacel", "exufiber",
    "esponja-hemostatica",
    "fibrosol",
    "mepilex", "allevyn", "biatain",
    "hidrocoloide",
    "urgo-clean", "urgo-start",
    "hidrogel",
    "agua-oxigenada", "alcool-etilico",
    ],
    opcoesAplicacao: ["penso_simples", "penso_impermeavel", "ligadura", "terapia_compressiva", "direto_seco", "sem_protecao", "penso_rapido"],
    objetivosClinicosAlvo: [
    goal("cleanse", "Limpar o leito antes da cobertura", "limpar-ferida", "essencial",
    "Soro fisiológico para limpeza suave que respeita tecido frágil. Octenidina é alternativa razoável.",
    { idsTratamento: ["cloreto-sodio", "octenilin-solucao"] }, ["decisao-clinica", "antimicrobianos"]),
    goal("haemostatic-absorbent", "Material com propriedade hemostática e absorvente", "controlar-exsudado", "essencial",
    "Em ferida com hemorragia ligeira persistente, alginato de cálcio combina absorção de exsudado com efeito hemostático local — escolha de eleição.",
    { idsTratamento: ["alginato-calcio"] }, ["gestao-exsudado", "escolha-do-penso"]),
    goal("alternative-fiber", "Hidrofibra como alternativa absorvente", "controlar-exsudado", "adequado",
    "Aquacel ou Exufiber são alternativas para gestão de exsudado moderado, embora sem o efeito hemostático específico do alginato.",
    { idsTratamento: ["aquacel", "exufiber", "fibrosol"] }, ["gestao-exsudado", "escolha-do-penso"]),
    goal("secondary-cover", "Cobertura secundária absorvente", "controlar-exsudado", "essencial",
    "Espuma absorvente sobre o material primário.",
    { idsTratamento: ["mepilex", "allevyn", "biatain"] }, ["gestao-exsudado", "escolha-do-penso"]),
    goal("app-cover", "Penso simples protetor", "cobertura-atraumatica", "essencial",
    "Penso simples protetor é a técnica adequada.",
    { idsAplicacao: ["penso_simples"] }, ["decisao-clinica"]),
    ],
    regrasAvaliacao: [
    { id: "antiseticos-c28", alvo: "tratamento", aplicavelAIds: ["betadine-solucao", "octiset"], classificacao: "redundante",
    motivo: "Sem sinais de infeção, antissépticos clássicos não estão indicados.",
    idsTemas: ["antimicrobianos"] },
    { id: "esponja-c28", alvo: "tratamento", aplicavelAIds: ["esponja-hemostatica"], classificacao: "redundante",
    motivo: "Esponja hemostática é mais adequada para hemorragia ativa abundante (uso pontual). Para sangramento ligeiro persistente, alginato de cálcio dá efeito hemostático com absorção continuada.",
    idsTemas: ["gestao-exsudado", "escolha-do-penso"] },
    { id: "hidrocoloide-c28", alvo: "tratamento", aplicavelAIds: ["hidrocoloide"], classificacao: "redundante",
    motivo: "Hidrocolóide tem absorção limitada para exsudado serohemático moderado e pode mascarar evolução em ferida estagnada.",
    idsTemas: ["gestao-exsudado", "escolha-do-penso"] },
    { id: "urgo-c28", alvo: "tratamento", aplicavelAIds: ["urgo-clean", "urgo-start"], classificacao: "adequado",
    motivo: "Pensos de matriz lipido-colóide podem ajudar em feridas estagnadas — Urgo-Clean para desbridamento autolítico, Urgo-Start como modulador de proteases. Considerar se a estagnação persistir.",
    idsTemas: ["escolha-do-penso", "decisao-clinica"] },
    { id: "hidrogel-c28", alvo: "tratamento", aplicavelAIds: ["hidrogel"], classificacao: "inadequado",
    motivo: "Adicionar humidade em ferida com exsudado moderado e hemorragia é contraproducente.",
    idsTemas: ["gestao-exsudado"] },
    { id: "agua-oxigenada-c28", alvo: "tratamento", aplicavelAIds: ["agua-oxigenada"], classificacao: "inadequado",
    motivo: "A água oxigenada é citotóxica e contraindicada em feridas crónicas.",
    idsTemas: ["antimicrobianos"] },
    { id: "alcool-c28", alvo: "tratamento", aplicavelAIds: ["alcool-etilico"], classificacao: "inadequado",
    motivo: "O álcool destrói tecido viável.",
    idsTemas: ["antimicrobianos"] },
    { id: "compressiva-c28", alvo: "aplicacao", aplicavelAIds: ["terapia_compressiva"], classificacao: "inadequado",
    motivo: "Terapia compressiva não está indicada em ferida cirúrgica ortopédica.",
    idsTemas: ["decisao-clinica"] },
    { id: "ligadura-c28", alvo: "aplicacao", aplicavelAIds: ["ligadura"], classificacao: "inadequado",
    motivo: "Ligadura compressiva não está indicada.",
    idsTemas: ["decisao-clinica"] },
    { id: "direto-seco-c28", alvo: "aplicacao", aplicavelAIds: ["direto_seco"], classificacao: "inadequado",
    motivo: "Material a seco adere ao leito e arranca tecido frágil.",
    idsTemas: ["decisao-clinica"] },
    { id: "sem-protecao-c28", alvo: "aplicacao", aplicavelAIds: ["sem_protecao"], classificacao: "inadequado",
    motivo: "Sem cobertura, ferida fica exposta e a hemorragia agrava-se.",
    idsTemas: ["decisao-clinica"] },
    { id: "penso-rapido-c28", alvo: "aplicacao", aplicavelAIds: ["penso_rapido"], classificacao: "inadequado",
    motivo: "Penso rápido aderente é insuficiente e adere ao leito frágil.",
    idsTemas: ["decisao-clinica"] },
    ],
    zonasTecido: [],
    idsTemas: ["tecidos-e-leito", "gestao-exsudado", "escolha-do-penso", "decisao-clinica"],
    planoRecomendado: {
    minimo: ["Limpeza com soro fisiológico", "Alginato de cálcio (efeito hemostático + absorção)", "Cobertura secundária absorvente", "Penso simples protetor"],
    otimizado: ["Limpeza com soro fisiológico (ou octenilin-solução)", "Alginato de cálcio para gestão simultânea de exsudado e sangramento ligeiro", "Cobertura secundária absorvente (Mepilex, Allevyn, Biatain)", "Penso simples protetor", "Reavaliação a 1 semana — se persistir estagnação, considerar matriz lipido-colóide (Urgo-Clean ou Urgo-Start) e sinalizar à equipa cirúrgica"],
    },
  },
  // ─── Caso 29 ──────────────────────────────────────────────────────────────────
  {
    id: "29",
    slug: "29",
    tituloAbreviado: "Caso 29",
    titulo: "Lesão por sépsis",
    descricao: "Treinar abordagem a lesão cutânea de doença sistémica grave — cobertura permeável e não-intervenção local.",
    competencias: "Reconhecimento de lesão como manifestação sistémica, cobertura oxigénio-permeável, decisão de não desbridar",
    dificuldade: "avancado",
    ordem: 29,
    minutosEstimados: 12,
    status: "disponivel",
    srcImagem: "/caso29.jpg",
    altImagem: "Lesão purpúrica meningocócica — © Medetec Medical Images (medetec.co.uk)",
    resumoIntro: "Utente em recuperação de sépsis meningocócica com lesões cutâneas purpúricas extensas por trombose microvascular.",
    objetivo: "Reconhecer lesão como manifestação cutânea de doença sistémica — não desbridar, cobertura permeável, vigilância apertada.",
    definicoesObservacao: observationDefinitions,
    promptsDialogo: dialoguePrompts,
    definicoesAplicacao: applicationDefinitions,
    objetivosVisuais: { tecidos: ["granulacao"], exsudado: ["seroso"], bordos: ["rubor"] },
    tituloCenario: "Lesão cutânea pós-sépsis meningocócica",
    contextoPaciente: "Utente de 27 anos em recuperação de sépsis meningocócica com púrpura fulminante. Lesão cutânea por trombose microvascular agora em fase pós-aguda.",
    bannerPaciente: "Lesão purpúrica meningocócica — © Medetec Medical Images (medetec.co.uk)",
    estadoFerida: { exsudado: "escasso", infeccao: "contaminacao", tecido: "granulacao", perilesional: "eritematosa", odor: "ausente" },
    variavelFerida: { exsudado: 2, infeccao: 0, tecido: 3, odor: 0, humidade: 2, profundidade: 2, bordos: 2, pele_perilesional: 3, dor: 2, hemorragia: 0, etiologia: 5, perfusao: 0 },
    detalhesObservacao: {
    imagem: { detalhe: "Lesão arredondada no antebraço com tecido eritematoso brilhante elevado, halo eritematoso." },
    dimensoes: { detalhe: "≈3×3 cm; profundidade moderada." },
    exsudado: { detalhe: "Ligeiro, transparente." },
    cheiro: { detalhe: "Sem odor." },
    tecidos: { detalhe: "Tecido avermelhado elevado, sobre fundo cutâneo com sequelas de lesão isquémica." },
    bordos: { detalhe: "Bordos irregulares." },
    pele_perilesional: { detalhe: "Avermelhada em redor; pele escurecida por zonas residuais das lesões anteriores." },
    },
    respostasDialogo: {
    dor: "Dói moderado — uns 4 em 10. Sensível ao toque.",
    duracao: "Estive muito doente há 3 semanas — meningite. Estas marcas apareceram nessa altura.",
    posicao: "Estou a recuperar, ainda fraco.",
    pensos: "Têm-me posto uma compressa fina, mudam todos os dias.",
    febre: "Já não tenho febre desde alta.",
    mobilidade: "Ando com ajuda — ainda fraco da doença.",
    },
    tratamentosDisponiveis: [
    "cloreto-sodio", "octenilin-solucao",
    "betadine-solucao", "octiset",
    "urgotul",
    "mepilex", "allevyn-nao-adesivo",
    "varihesive-extra-fino",
    "colagenase",
    "aquacel", "alginato-calcio",
    "hidrogel",
    "agua-oxigenada", "alcool-etilico",
    ],
    opcoesAplicacao: ["penso_simples", "penso_impermeavel", "ligadura", "terapia_compressiva", "direto_seco", "sem_protecao", "penso_rapido"],
    objetivosClinicosAlvo: [
    goal("cleanse", "Limpar o leito suavemente", "limpar-ferida", "essencial",
    "Soro fisiológico para limpeza muito suave que não traumatiza tecido com perfusão ainda comprometida.",
    { idsTratamento: ["cloreto-sodio", "octenilin-solucao"] }, ["decisao-clinica", "antimicrobianos"]),
    goal("permeable-cover", "Cobertura permeável e atraumática", "cobertura-atraumatica", "essencial",
    "Lesão de etiologia microvascular beneficia de cobertura PERMEÁVEL ao oxigénio (não oclusiva) — contacto não-aderente (Urgotul) ou espuma de silicone (Mepilex, Allevyn não-adesivo) são as escolhas de eleição.",
    { idsTratamento: ["urgotul", "mepilex", "allevyn-nao-adesivo"] }, ["escolha-do-penso", "tecidos-e-leito"]),
    goal("app-cover", "Penso simples protetor", "cobertura-atraumatica", "essencial",
    "Penso simples protetor — sem qualquer compressão.",
    { idsAplicacao: ["penso_simples"] }, ["decisao-clinica"]),
    ],
    regrasAvaliacao: [
    { id: "antiseticos-c29", alvo: "tratamento", aplicavelAIds: ["betadine-solucao", "octiset"], classificacao: "redundante",
    motivo: "Sem sinais de infeção local, antissépticos clássicos não estão indicados — citotoxicidade pode atrasar regeneração em tecido com perfusão limítrofe.",
    idsTemas: ["antimicrobianos"] },
    { id: "hidrocoloide-c29", alvo: "tratamento", aplicavelAIds: ["varihesive-extra-fino"], classificacao: "inadequado",
    motivo: "Hidrocolóide é OCLUSIVO — em lesão de etiologia microvascular prefere-se cobertura permeável ao oxigénio.",
    idsTemas: ["escolha-do-penso", "tecidos-e-leito"] },
    { id: "colagenase-c29", alvo: "tratamento", aplicavelAIds: ["colagenase"], classificacao: "inadequado",
    motivo: "DESBRIDAMENTO ESTÁ CONTRAINDICADO em lesão de origem microvascular com perfusão comprometida — pode aprofundar dano tecidular.",
    idsTemas: ["desbridamento"] },
    { id: "alginatos-c29", alvo: "tratamento", aplicavelAIds: ["aquacel", "alginato-calcio"], classificacao: "redundante",
    motivo: "Hidrofibra/alginato são desproporcionados para exsudado ligeiro — preferir contacto não-aderente em lesão pós-isquémica.",
    idsTemas: ["gestao-exsudado", "escolha-do-penso"] },
    { id: "hidrogel-c29", alvo: "tratamento", aplicavelAIds: ["hidrogel"], classificacao: "inadequado",
    motivo: "Adicionar humidade pode favorecer maceração e infeção em tecido com perfusão limítrofe.",
    idsTemas: ["gestao-exsudado"] },
    { id: "agua-oxigenada-c29", alvo: "tratamento", aplicavelAIds: ["agua-oxigenada"], classificacao: "inadequado",
    motivo: "Citotóxica — particularmente prejudicial em tecido com perfusão comprometida.",
    idsTemas: ["antimicrobianos"] },
    { id: "alcool-c29", alvo: "tratamento", aplicavelAIds: ["alcool-etilico"], classificacao: "inadequado",
    motivo: "O álcool destrói tecido viável.",
    idsTemas: ["antimicrobianos"] },
    { id: "compressiva-c29", alvo: "aplicacao", aplicavelAIds: ["terapia_compressiva"], classificacao: "inadequado",
    motivo: "Terapia compressiva é PERIGOSA em lesão de etiologia isquémica/microvascular — pode agravar a perfusão.",
    idsTemas: ["decisao-clinica"] },
    { id: "ligadura-c29", alvo: "aplicacao", aplicavelAIds: ["ligadura"], classificacao: "inadequado",
    motivo: "Ligadura compressiva está contraindicada em lesão isquémica.",
    idsTemas: ["decisao-clinica"] },
    { id: "direto-seco-c29", alvo: "aplicacao", aplicavelAIds: ["direto_seco"], classificacao: "inadequado",
    motivo: "Material a seco adere ao tecido frágil.",
    idsTemas: ["decisao-clinica"] },
    { id: "sem-protecao-c29", alvo: "aplicacao", aplicavelAIds: ["sem_protecao"], classificacao: "inadequado",
    motivo: "Lesão exposta agrava risco de infeção em utente com sistema imune comprometido pós-sépsis.",
    idsTemas: ["decisao-clinica"] },
    { id: "penso-rapido-c29", alvo: "aplicacao", aplicavelAIds: ["penso_rapido"], classificacao: "inadequado",
    motivo: "Penso rápido aderente arranca tecido frágil.",
    idsTemas: ["decisao-clinica"] },
    ],
    zonasTecido: [],
    idsTemas: ["tecidos-e-leito", "escolha-do-penso", "decisao-clinica"],
    planoRecomendado: {
    minimo: ["Limpeza com soro fisiológico", "Cobertura permeável atraumática", "Penso simples", "Vigilância sistémica em equipa multidisciplinar"],
    otimizado: ["Limpeza com soro fisiológico (ou octenilin) — limpeza suave que respeita tecido frágil", "Cobertura PERMEÁVEL ao oxigénio — Urgotul, Mepilex ou Allevyn não-adesivo (evitar hidrocolóides oclusivos)", "Penso simples sem compressão", "NÃO desbridar — perfusão microvascular ainda em recuperação", "Vigilância apertada: progressão da lesão, sinais sistémicos (febre, dor), estado de coagulação", "Acompanhamento multidisciplinar: infeciologia, hematologia, cirurgia plástica se sequela extensa"],
    },
  },
  // ─── Caso 30 ──────────────────────────────────────────────────────────────────
  {
    id: "30",
    slug: "30",
    tituloAbreviado: "Caso 30",
    titulo: "Ferida cirúrgica",
    descricao: "Treinar gestão de ferida cirúrgica em fase de cicatrização normal — vigilância sem intervenção desnecessária.",
    competencias: "Reconhecimento de evolução normal, vigilância pós-cirúrgica, cobertura proporcional",
    dificuldade: "introdutorio",
    ordem: 30,
    minutosEstimados: 8,
    status: "disponivel",
    srcImagem: "/caso30.jpg",
    altImagem: "Ferida cirúrgica do joelho — © Medetec Medical Images (medetec.co.uk)",
    resumoIntro: "Utente em pós-operatório de cirurgia do joelho com ferida cirúrgica em fase inicial de cicatrização, sem complicações.",
    objetivo: "Reconhecer evolução normal pós-cirúrgica e aplicar cobertura simples sem intervenção desnecessária.",
    definicoesObservacao: observationDefinitions,
    promptsDialogo: dialoguePrompts,
    definicoesAplicacao: applicationDefinitions,
    objetivosVisuais: { tecidos: ["epitelial"], exsudado: ["seroso"], bordos: ["integra"] },
    tituloCenario: "Ferida cirúrgica em cicatrização",
    contextoPaciente: "Utente de 62 anos, 10 dias após artroplastia do joelho, ferida cirúrgica linear sem sinais de complicação.",
    bannerPaciente: "Ferida cirúrgica do joelho — © Medetec Medical Images (medetec.co.uk)",
    estadoFerida: { exsudado: "escasso", infeccao: "contaminacao", tecido: "granulacao", perilesional: "integra", odor: "ausente" },
    variavelFerida: { exsudado: 1, infeccao: 0, tecido: 4, odor: 0, humidade: 2, profundidade: 1, bordos: 4, pele_perilesional: 4, dor: 1, hemorragia: 0, etiologia: 6, perfusao: 1 },
    detalhesObservacao: {
    imagem: { detalhe: "Ferida cirúrgica linear no joelho com bordos aproximados, em fase de epitelização." },
    dimensoes: { detalhe: "≈10 cm de comprimento; superficial — bordos em coaptação." },
    exsudado: { detalhe: "Ligeiro, transparente." },
    cheiro: { detalhe: "Sem odor." },
    tecidos: { detalhe: "Leito rosado ao longo da incisão; sem zonas amareladas nem pretas." },
    bordos: { detalhe: "Bordos regulares, em coaptação, sem descolamento." },
    pele_perilesional: { detalhe: "Pele íntegra, sem vermelhidão, sem edema." },
    },
    respostasDialogo: {
    dor: "Tenho dor controlada — uns 2 em 10 com a medicação.",
    duracao: "Operação foi há 10 dias. Tudo bem até agora.",
    posicao: "Tento manter a perna elevada quando estou sentado.",
    pensos: "Penso simples, mudo todos os dias.",
    febre: "Não tive febre.",
    mobilidade: "Ando com canadianas, com fisioterapia diária.",
    },
    urlImagemDepois: "/caso30_2.jpg",
    legendaEvolucao: "Aos 6 meses pós-operatórios, a ferida cirúrgica está completamente cicatrizada com cicatriz linear estabelecida — evolução típica de cirurgia do joelho com cicatrização normal e cuidados pós-operatórios adequados.",
    tratamentosDisponiveis: [
    "cloreto-sodio", "octenilin-solucao",
    "betadine-solucao", "octiset",
    "varihesive-extra-fino",
    "mepilex", "allevyn-nao-adesivo",
    "urgotul",
    "aquacel", "alginato-calcio",
    "hidrocoloide",
    "hidrogel",
    "agua-oxigenada", "alcool-etilico",
    ],
    opcoesAplicacao: ["penso_simples", "penso_impermeavel", "ligadura", "terapia_compressiva", "direto_seco", "sem_protecao", "penso_rapido"],
    objetivosClinicosAlvo: [
    goal("cleanse", "Limpar a incisão antes da cobertura", "limpar-ferida", "essencial",
    "Soro fisiológico para limpeza suave que preserva o tecido em epitelização.",
    { idsTratamento: ["cloreto-sodio", "octenilin-solucao"] }, ["decisao-clinica", "antimicrobianos"]),
    goal("cover-thin", "Cobertura simples e atraumática", "cobertura-atraumatica", "essencial",
    "Em ferida cirúrgica em epitelização com exsudado ligeiro, hidrocolóide fino, espuma de baixa absorção ou contacto não-aderente são adequados.",
    { idsTratamento: ["varihesive-extra-fino", "mepilex", "allevyn-nao-adesivo", "urgotul"] }, ["escolha-do-penso", "tecidos-e-leito"]),
    goal("app-cover", "Penso simples protetor", "cobertura-atraumatica", "essencial",
    "Penso simples protetor é a técnica adequada.",
    { idsAplicacao: ["penso_simples"] }, ["decisao-clinica"]),
    ],
    regrasAvaliacao: [
    { id: "antiseticos-c30", alvo: "tratamento", aplicavelAIds: ["betadine-solucao", "octiset"], classificacao: "redundante",
    motivo: "Sem sinais de infeção, antissépticos clássicos não estão indicados — em epitelização, citotoxicidade pode parar progressão.",
    idsTemas: ["antimicrobianos"] },
    { id: "alginatos-c30", alvo: "tratamento", aplicavelAIds: ["aquacel", "alginato-calcio"], classificacao: "redundante",
    motivo: "Hidrofibra/alginato são desproporcionados para exsudado ligeiro em ferida em epitelização — sobre-secam o leito.",
    idsTemas: ["gestao-exsudado", "escolha-do-penso"] },
    { id: "hidrocoloide-c30", alvo: "tratamento", aplicavelAIds: ["hidrocoloide"], classificacao: "redundante",
    motivo: "Hidrocolóide regular é desproporcionado — versão fina é suficiente para esta fase.",
    idsTemas: ["escolha-do-penso"] },
    { id: "hidrogel-c30", alvo: "tratamento", aplicavelAIds: ["hidrogel"], classificacao: "inadequado",
    motivo: "Adicionar humidade em ferida cirúrgica em epitelização pode macerar tecido novo.",
    idsTemas: ["gestao-exsudado", "tecidos-e-leito"] },
    { id: "agua-oxigenada-c30", alvo: "tratamento", aplicavelAIds: ["agua-oxigenada"], classificacao: "inadequado",
    motivo: "A água oxigenada é citotóxica — particularmente prejudicial em epitelização.",
    idsTemas: ["antimicrobianos"] },
    { id: "alcool-c30", alvo: "tratamento", aplicavelAIds: ["alcool-etilico"], classificacao: "inadequado",
    motivo: "O álcool destrói tecido viável.",
    idsTemas: ["antimicrobianos"] },
    { id: "compressiva-c30", alvo: "aplicacao", aplicavelAIds: ["terapia_compressiva"], classificacao: "inadequado",
    motivo: "Terapia compressiva não está indicada em ferida cirúrgica do joelho.",
    idsTemas: ["decisao-clinica"] },
    { id: "ligadura-c30", alvo: "aplicacao", aplicavelAIds: ["ligadura"], classificacao: "inadequado",
    motivo: "Ligadura compressiva não está indicada.",
    idsTemas: ["decisao-clinica"] },
    { id: "direto-seco-c30", alvo: "aplicacao", aplicavelAIds: ["direto_seco"], classificacao: "inadequado",
    motivo: "Material a seco adere ao tecido em epitelização.",
    idsTemas: ["decisao-clinica"] },
    { id: "sem-protecao-c30", alvo: "aplicacao", aplicavelAIds: ["sem_protecao"], classificacao: "inadequado",
    motivo: "Ferida cirúrgica recente exposta agrava risco de contaminação.",
    idsTemas: ["decisao-clinica"] },
    { id: "penso-rapido-c30", alvo: "aplicacao", aplicavelAIds: ["penso_rapido"], classificacao: "redundante",
    motivo: "Penso rápido aderente pode causar trauma na remoção sobre tecido em epitelização.",
    idsTemas: ["decisao-clinica"] },
    ],
    zonasTecido: [],
    idsTemas: ["tecidos-e-leito", "escolha-do-penso", "decisao-clinica"],
    planoRecomendado: {
    minimo: ["Limpeza com soro fisiológico", "Cobertura fina atraumática", "Penso simples protetor"],
    otimizado: ["Limpeza com soro fisiológico (ou octenilin-solução)", "Cobertura fina e atraumática (Varihesive extra-fino, Mepilex, Allevyn não-adesivo, Urgotul)", "Penso simples protetor", "Vigilância de sinais de complicação: eritema, calor, dor crescente, exsudado purulento, febre"],
    },
  },
  // ─── Caso 31 ──────────────────────────────────────────────────────────────────
  {
    id: "31",
    slug: "31",
    tituloAbreviado: "Caso 31",
    titulo: "Úlcera venosa",
    descricao: "Treinar reconhecimento de dermatite de contacto secundária ao tratamento — parar tópico ofensivo e mudar para plano hipoalergénico.",
    competencias: "Reconhecimento de iatrogenia, identificação de reação alérgica ou irritativa, mudança para plano hipoalergénico",
    dificuldade: "avancado",
    ordem: 31,
    minutosEstimados: 12,
    status: "disponivel",
    srcImagem: "/caso31.jpg",
    altImagem: "Úlcera venosa com reação cutânea — © Medetec Medical Images (medetec.co.uk)",
    resumoIntro: "Utente com úlcera venosa em cicatrização que desenvolveu reação cutânea peri-lesional ao tratamento tópico que estava a usar.",
    objetivo: "Reconhecer dermatite de contacto secundária ao tratamento, parar o material ofensivo e mudar para plano hipoalergénico, mantendo compressão.",
    definicoesObservacao: observationDefinitions,
    promptsDialogo: dialoguePrompts,
    definicoesAplicacao: applicationDefinitions,
    objetivosVisuais: { tecidos: ["epitelial", "granulacao"], exsudado: ["seroso"], bordos: ["integra"] },
    tituloCenario: "Úlcera venosa com dermatite de contacto",
    contextoPaciente: "Utente de 70 anos com úlcera venosa de longa duração em cicatrização avançada, agora com reação cutânea peri-lesional ao tratamento tópico atual.",
    bannerPaciente: "Úlcera venosa com reação ao tópico — © Medetec Medical Images (medetec.co.uk)",
    estadoFerida: { exsudado: "escasso", infeccao: "contaminacao", tecido: "granulacao", perilesional: "eritematosa", odor: "ausente" },
    variavelFerida: { exsudado: 2, infeccao: 0, tecido: 4, odor: 0, humidade: 2, profundidade: 1, bordos: 4, pele_perilesional: 3, dor: 2, hemorragia: 0, etiologia: 2, perfusao: 1 },
    detalhesObservacao: {
    imagem: { detalhe: "Úlcera de perna em fase de cicatrização avançada com tecido em epitelização; pele peri-lesional com eritema descamativo extenso, sugestivo de dermatite de contacto." },
    dimensoes: { detalhe: "≈3×3 cm de leito visível; profundidade superficial." },
    exsudado: { detalhe: "Ligeiro, transparente." },
    cheiro: { detalhe: "Sem odor." },
    tecidos: { detalhe: "Leito avermelhado em progressão com pele rosada nas bordas; sem zonas amareladas nem pretas." },
    bordos: { detalhe: "Bordos em retração, sem maceração." },
    pele_perilesional: { detalhe: "Avermelhada e descamativa de forma extensa em redor, com prurido." },
    },
    respostasDialogo: {
    dor: "Já não me dói no leito — uns 1 em 10. Mas a pele em redor coça e arde — uns 4 em 10.",
    duracao: "Tive a ferida 6 meses, está quase fechada. Mas há 2 semanas começou a dar-me comichão na pele à volta.",
    posicao: "Tento elevar a perna.",
    pensos: "Tenho posto uma pomada com antibiótico que me deu o farmacêutico. É desde aí que começou a coçar.",
    febre: "Não tive febre.",
    mobilidade: "Ando bem.",
    },
    tratamentosDisponiveis: [
    "cloreto-sodio", "octenilin-solucao",
    "betadine-solucao", "octiset",
    "urgotul",
    "mepilex", "allevyn-nao-adesivo",
    "varihesive-extra-fino",
    "aquacel", "alginato-calcio",
    "oxido-zinco", "atl",
    "protetor-spray",
    "hidrogel",
    "agua-oxigenada", "alcool-etilico",
    ],
    opcoesAplicacao: ["penso_simples", "penso_impermeavel", "ligadura", "terapia_compressiva", "direto_seco", "sem_protecao", "penso_rapido"],
    objetivosClinicosAlvo: [
    goal("cleanse", "Limpar o leito sem agentes irritativos", "limpar-ferida", "essencial",
    "Soro fisiológico — em suspeita de reação alérgica/irritativa, evitar agentes que possam reforçar a sensibilização. Octenidina é alternativa razoável.",
    { idsTratamento: ["cloreto-sodio", "octenilin-solucao"] }, ["decisao-clinica", "antimicrobianos"]),
    goal("hypoallergenic-cover", "Cobertura hipoalergénica não-aderente", "cobertura-atraumatica", "essencial",
    "Em dermatite de contacto, escolher cobertura hipoalergénica — silicone (Mepilex, Allevyn não-adesivo) ou contacto não-aderente (Urgotul) sem adesivos diretos na pele inflamada.",
    { idsTratamento: ["urgotul", "mepilex", "allevyn-nao-adesivo"] }, ["escolha-do-penso"]),
    goal("proteger-perilesional", "Proteger a pele peri-lesional inflamada", "proteger-pele", "essencial",
    "Pele peri-lesional com dermatite precisa de barreira protetora — película em spray ou óxido de zinco. ATL pode hidratar mas não substitui barreira.",
    { idsTratamento: ["protetor-spray", "oxido-zinco"] }, ["protecao-perilesional"]),
    goal("compression", "Manter terapia compressiva", "compressao-venosa", "essencial",
    "Apesar da reação cutânea, a compressão mantém-se essencial em úlcera venosa — apenas se ajusta o material em contacto direto com a pele.",
    { idsAplicacao: ["terapia_compressiva"] }, ["decisao-clinica"]),
    goal("ligature-alt", "Ligadura compressiva como alternativa", "compressao-venosa", "adequado",
    "Quando terapia compressiva multi-camada não está disponível, ligadura compressiva é alternativa razoável.",
    { idsAplicacao: ["ligadura"] }, ["decisao-clinica"]),
    ],
    regrasAvaliacao: [
    { id: "antiseticos-c31", alvo: "tratamento", aplicavelAIds: ["betadine-solucao", "octiset"], classificacao: "inadequado",
    motivo: "Em dermatite de contacto, antissépticos clássicos podem AGRAVAR a reação cutânea — citotoxicidade e potencial alergeno. EVITAR.",
    idsTemas: ["antimicrobianos", "protecao-perilesional"] },
    { id: "hidrocoloide-c31", alvo: "tratamento", aplicavelAIds: ["varihesive-extra-fino"], classificacao: "redundante",
    motivo: "Hidrocolóide adesivo pode perpetuar reação cutânea por contacto da pele frágil com o adesivo — preferir contacto não-aderente.",
    idsTemas: ["escolha-do-penso"] },
    { id: "alginatos-c31", alvo: "tratamento", aplicavelAIds: ["aquacel", "alginato-calcio"], classificacao: "redundante",
    motivo: "Hidrofibra/alginato são desproporcionados para exsudado ligeiro em ferida em epitelização.",
    idsTemas: ["gestao-exsudado", "escolha-do-penso"] },
    { id: "atl-c31", alvo: "tratamento", aplicavelAIds: ["atl"], classificacao: "redundante",
    motivo: "ATL hidrata a pele mas não tem ação barreira — película em spray ou óxido de zinco são preferíveis para proteção da pele inflamada.",
    idsTemas: ["protecao-perilesional"] },
    { id: "hidrogel-c31", alvo: "tratamento", aplicavelAIds: ["hidrogel"], classificacao: "inadequado",
    motivo: "Adicionar humidade em ferida em epitelização e pele peri-lesional inflamada pode macerar.",
    idsTemas: ["gestao-exsudado"] },
    { id: "agua-oxigenada-c31", alvo: "tratamento", aplicavelAIds: ["agua-oxigenada"], classificacao: "inadequado",
    motivo: "Citotóxica — particularmente prejudicial em pele inflamada.",
    idsTemas: ["antimicrobianos"] },
    { id: "alcool-c31", alvo: "tratamento", aplicavelAIds: ["alcool-etilico"], classificacao: "inadequado",
    motivo: "O álcool destrói tecido viável e agrava dermatite.",
    idsTemas: ["antimicrobianos"] },
    { id: "direto-seco-c31", alvo: "aplicacao", aplicavelAIds: ["direto_seco"], classificacao: "inadequado",
    motivo: "Material a seco adere ao tecido em epitelização.",
    idsTemas: ["decisao-clinica"] },
    { id: "sem-protecao-c31", alvo: "aplicacao", aplicavelAIds: ["sem_protecao"], classificacao: "inadequado",
    motivo: "Sem cobertura, ferida em epitelização fica exposta.",
    idsTemas: ["decisao-clinica"] },
    { id: "penso-simples-c31", alvo: "aplicacao", aplicavelAIds: ["penso_simples"], classificacao: "redundante",
    motivo: "Penso simples sem compressão é insuficiente em úlcera venosa — a compressão mantém-se até cicatrização completa.",
    idsTemas: ["decisao-clinica"] },
    { id: "penso-rapido-c31", alvo: "aplicacao", aplicavelAIds: ["penso_rapido"], classificacao: "inadequado",
    motivo: "Penso rápido aderente agrava dermatite por contacto com adesivo.",
    idsTemas: ["decisao-clinica"] },
    ],
    zonasTecido: [],
    idsTemas: ["tecidos-e-leito", "escolha-do-penso", "protecao-perilesional", "decisao-clinica"],
    planoRecomendado: {
    minimo: ["Parar tópico ofensivo", "Limpeza com soro fisiológico", "Cobertura hipoalergénica", "Proteção peri-lesional com película ou óxido de zinco", "Manter compressão"],
    otimizado: ["IDENTIFICAR e PARAR o tópico ofensivo (no caso, pomada antibiótica usada por iniciativa do utente)", "Limpeza com soro fisiológico (ou octenilin)", "Cobertura hipoalergénica não-aderente — Urgotul, Mepilex ou Allevyn não-adesivo", "Proteção peri-lesional com película em spray ou óxido de zinco para barreira contra novos contactos", "Manter terapia compressiva — ajustar interface para evitar contacto direto com pele inflamada", "Educar o utente sobre auto-medicação tópica e potencial de sensibilização cutânea", "Reavaliar 1-2 semanas — se persistir dermatite, considerar referir a dermatologia para testes de contacto"],
    },
  },
  // ─── Caso 32 ──────────────────────────────────────────────────────────────────
  {
    id: "32",
    slug: "32",
    tituloAbreviado: "Caso 32",
    titulo: "Lesão digital isquémica",
    descricao: "Caso avançado de isquémia arterial distal com necrose seca — treinar a decisão de não desbridar e o papel da proteção.",
    competencias: "Reconhecimento de isquémia arterial, contraindicação absoluta ao desbridamento em necrose seca isquémica, proteção e encaminhamento",
    dificuldade: "avancado",
    ordem: 32,
    minutosEstimados: 15,
    status: "disponivel",
    srcImagem: "/caso32.jpg",
    altImagem: "Necrose digital arterial — © Medetec Medical Images (medetec.co.uk)",
    resumoIntro: "Utente com diabetes e doença arterial periférica grave, necrose seca no hálux direito, sem pulso pedioso palpável, sem exsudado.",
    objetivo: "Reconhecer necrose isquémica seca como contraindicação ao desbridamento e proteger sem intervir sobre o tecido necrótico.",
    definicoesObservacao: observationDefinitions,
    promptsDialogo: dialoguePrompts,
    definicoesAplicacao: applicationDefinitions,
    objetivosVisuais: { tecidos: ["necrose"], exsudado: ["seroso"], bordos: ["pele-seca"] },
    tituloCenario: "Lesão digital isquémica — arteriopatia",
    contextoPaciente: "Utente de 71 anos, diabetes tipo 2 há 25 anos, doença arterial periférica documentada (ABI 0.4). Hálux direito com necrose seca preta desde há 3 semanas. Sem febre. Sem pulso pedioso. Dor de repouso.",
    bannerPaciente: "Necrose digital arterial — © Medetec Medical Images (medetec.co.uk)",
    estadoFerida: { exsudado: "escasso", infeccao: "contaminacao", tecido: "necrose-fibrina", perilesional: "fragil", odor: "ausente" },
    variavelFerida: { exsudado: 1, infeccao: 0, tecido: 1, odor: 0, humidade: 1, profundidade: 3, bordos: 1, pele_perilesional: 2, dor: 3, hemorragia: 0, etiologia: 4, perfusao: 0 },
    detalhesObservacao: {
    imagem: { detalhe: "Hálux direito com necrose seca preta, dura, bem delimitada — escara seca isquémica. Sem exsudado. Sem odor." },
    dimensoes: { detalhe: "Necrose total do hálux distal; extensão proximal indefinida — limite depende de perfusão residual." },
    exsudado: { detalhe: "Ausente. Sem humidade visível." },
    cheiro: { detalhe: "Sem odor." },
    tecidos: { detalhe: "Zona preta, seca e dura, com delimitação nítida para o tecido viável proximal." },
    bordos: { detalhe: "Linha de demarcação entre a zona preta e a pele viável adjacente." },
    pele_perilesional: { detalhe: "Pele dos artelhos adjacentes pálida e fria." },
    },
    respostasDialogo: {
    dor: "Tenho dor de repouso nos pés — uns 7 ou 8 em 10. Piora quando levanto a perna.",
    duracao: "O dedo ficou assim há três semanas. Não sei se está a piorar ou a estabilizar.",
    posicao: "Fico sentado com os pés para baixo — alivia a dor. Não consigo andar muito.",
    pensos: "Tinham posto betadine e compressa. Ninguém disse nada de específico.",
    febre: "Não tive febre.",
    mobilidade: "Ando com dificuldade. Os pés ficam muito frios de noite.",
    },
    tratamentosDisponiveis: [
    "cloreto-sodio", "octenilin-solucao",
    "betadine-solucao",
    "colagenase",
    "hidrogel",
    "varihesive-extra-fino",
    "mepitel-one",
    "mepilex", "allevyn",
    "aquacel", "alginato-calcio",
    "aquacel-ag", "allevyn-ag",
    "agua-oxigenada", "alcool-etilico",
    ],
    opcoesAplicacao: ["penso_simples", "penso_impermeavel", "ligadura", "terapia_compressiva", "direto_seco", "sem_protecao", "penso_rapido"],
    objetivosClinicosAlvo: [
    goal("protect", "Proteger a necrose seca sem a remover nem humedecer", "cobertura-atraumatica", "essencial",
    "Em necrose isquémica seca sem sinais de infeção, a necrose funciona como escara protetora natural — desbridar é contraindicado sem revascularização prévia.",
    { idsTratamento: ["mepitel-one"] }, ["sinais-de-alarme", "desbridamento"]),
    goal("proteger-pele", "Proteger os artelhos adjacentes e a pele frágil perilesional", "proteger-perilesional", "essencial",
    "A pele isquémica dos artelhos adjacentes é extremamente frágil — qualquer trauma pode criar novas lesões.",
    {}, ["sinais-de-alarme"]),
    goal("cleanse", "Limpar superficialmente sem traumatizar nem humedecer a necrose", "limpar-ferida", "adequado",
    "Limpeza gentil da periferia com soro — não irrigar nem amolecer a necrose seca.",
    { idsTratamento: ["cloreto-sodio"] }, ["sinais-de-alarme"]),
    goal("application-cover", "Fixação mínima e não compressiva com penso simples", "cobertura-atraumatica", "essencial",
    "Penso simples protetor é a forma de fixação adequada em isquemia arterial — mantém cobertura mínima sem compressão, alinhado com o objetivo de manter a necrose seca enquanto se aguarda avaliação vascular.",
    { idsAplicacao: ["penso_simples"] }, ["sinais-de-alarme"]),
    ],
    regrasAvaliacao: [
    { id: "varihesive-c32", alvo: "tratamento", aplicavelAIds: ["varihesive-extra-fino"], classificacao: "redundante",
    motivo: "Hidrocolóide humidifica a necrose — pode amolecê-la e criar condições para infeção anaeróbica numa zona sem perfusão.",
    idsTemas: ["sinais-de-alarme", "decisao-clinica"] },
    { id: "colagenase-c32", alvo: "tratamento", aplicavelAIds: ["colagenase"], classificacao: "inadequado",
    motivo: "Desbridamento enzimático está ABSOLUTAMENTE contraindicado em necrose isquémica seca sem revascularização — risco de gangrena húmida e amputação emergente.",
    idsTemas: ["sinais-de-alarme", "desbridamento", "decisao-clinica"] },
    { id: "hidrogel-c32", alvo: "tratamento", aplicavelAIds: ["hidrogel"], classificacao: "inadequado",
    motivo: "Hidrogel humidifica a necrose seca — converte necrose seca (controlada) em necrose húmida (risco de infeção grave).",
    idsTemas: ["sinais-de-alarme", "desbridamento", "decisao-clinica"] },
    { id: "aquacel-c32", alvo: "tratamento", aplicavelAIds: ["aquacel", "alginato-calcio"], classificacao: "redundante",
    motivo: "Materiais absortivos são desnecessários — sem exsudado. Podem aderir à linha de demarcação e traumatizar tecido viável.",
    idsTemas: ["gestao-exsudado", "sinais-de-alarme"] },
    { id: "aquacel-ag-c32", alvo: "tratamento", aplicavelAIds: ["aquacel-ag", "allevyn-ag"], classificacao: "redundante",
    motivo: "Antimicrobiano sem indicação — sem sinais de infeção. Não altera o prognóstico isquémico.",
    idsTemas: ["antimicrobianos", "decisao-clinica"] },
    { id: "mepilex-c32", alvo: "tratamento", aplicavelAIds: ["mepilex", "allevyn"], classificacao: "redundante",
    motivo: "Espuma sem indicação — sem exsudado. Pode servir como proteção secundária mas não é prioritária.",
    idsTemas: ["gestao-exsudado"] },
    { id: "betadine-c32", alvo: "tratamento", aplicavelAIds: ["betadine-solucao"], classificacao: "redundante",
    motivo: "Betadine é citotóxico e pode interferir com a linha de demarcação — em isquémia, preferir não aplicar soluções que alterem o ambiente local.",
    idsTemas: ["antimicrobianos", "sinais-de-alarme"] },
    { id: "octenilin-c32", alvo: "tratamento", aplicavelAIds: ["octenilin-solucao"], classificacao: "redundante",
    motivo: "Antisséptico não indicado sem sinais de infeção — usar soro simples se necessário limpar periferia.",
    idsTemas: ["antimicrobianos", "sinais-de-alarme"] },
    { id: "agua-oxigenada-c32", alvo: "tratamento", aplicavelAIds: ["agua-oxigenada"], classificacao: "inadequado",
    motivo: "Citotóxico e contraindicado — particularmente perigoso em tecido isquémico extremamente frágil.",
    idsTemas: ["antimicrobianos"] },
    { id: "alcool-c32", alvo: "tratamento", aplicavelAIds: ["alcool-etilico"], classificacao: "inadequado",
    motivo: "Álcool é citotóxico — absolutamente contraindicado em isquémia.",
    idsTemas: ["antimicrobianos"] },
    { id: "terapia-compressiva-c32", alvo: "aplicacao", aplicavelAIds: ["terapia_compressiva"], classificacao: "inadequado",
    motivo: "Terapia compressiva está ABSOLUTAMENTE contraindicada em isquémia arterial grave (ABI < 0.6) — pode precipitar necrose extensa e amputação.",
    idsTemas: ["sinais-de-alarme", "decisao-clinica"] },
    { id: "ligadura-c32", alvo: "aplicacao", aplicavelAIds: ["ligadura"], classificacao: "redundante",
    motivo: "Ligadura compressiva contraindicada — só fixação absolutamente mínima se necessário.",
    idsTemas: ["sinais-de-alarme", "fixacao-e-remocao"] },
    { id: "direto-seco-c32", alvo: "aplicacao", aplicavelAIds: ["direto_seco"], classificacao: "redundante",
    motivo: "Manter penso direto em seco sem interface pode aderir à linha de demarcação isquémica e traumatizar tecido viável — preferir interface de silicone com fixação mínima.",
    idsTemas: ["sinais-de-alarme", "decisao-clinica"] },
    { id: "sem-protecao-c32", alvo: "aplicacao", aplicavelAIds: ["sem_protecao"], classificacao: "redundante",
    motivo: "Deixar sem cobertura expõe a contaminação e trauma mecânico — alguma proteção mínima é indicada.",
    idsTemas: ["sinais-de-alarme"] },
    ],
    zonasTecido: [],
    idsTemas: ["sinais-de-alarme", "desbridamento", "decisao-clinica", "antimicrobianos", "escolha-do-penso"],
    planoRecomendado: {
    minimo: ["Não desbridar", "Manter a necrose seca", "Cobertura protetora seca e não compressiva", "Referenciação urgente para cirurgia vascular"],
    otimizado: ["Não desbridar — necrose isquémica seca sem infeção é uma escara protetora", "Limpeza gentil da periferia com soro fisiológico (não sobre a necrose)", "Cobertura protetora seca e atraumática (Mepitel One ou gaze vaselinada seca)", "Fixação mínima sem compressão", "Referenciação urgente para avaliação vascular (angiografia/revascularização)", "Monitorização diária de sinais de infeção: eritema, calor, odor, exsudado purulento"],
    },
  },
];

export const caseTemplates: ModeloCaso[] = cases;
