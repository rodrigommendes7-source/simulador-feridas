export type LearningComparison = {
  title: string;
  useWhen: string;
  avoidWhen: string;
  classicError: string;
};

export type LearningQuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  rationale: string;
};

export type LearningTopic = {
  id: string;
  title: string;
  objective: string;
  keySignals: string[];
  whenToUse: string[];
  whenToAvoid: string[];
  practicalExamples: string[];
  commonMistakes: string[];
  comparisons: LearningComparison[];
  quickCheck: LearningQuizQuestion[];
  relatedCategories?: string[];
  relatedFunctions?: string[];
  relatedTreatmentIds?: string[];
  relatedCaseIds?: string[];
};

export const learningTopics: LearningTopic[] = [
  {
    id: "desbridamento",
    title: "Desbridamento",
    objective:
      "Remover tecido desvitalizado e preparar o leito da ferida para uma cicatrização mais eficiente.",
    keySignals: [
      "Fibrina aderente ou tecido desvitalizado visível.",
      "Ferida estagnada, sem progressão de granulação.",
      "Necessidade de preparar o leito antes de coberturas mais definitivas.",
    ],
    whenToUse: [
      "Presença de fibrina aderente, necrose húmida ou tecido desvitalizado que atrasa a granulação.",
      "Feridas com evolução estagnada por barreira mecânica no leito.",
    ],
    whenToAvoid: [
      "Leito limpo e em granulação ativa, sem tecido desvitalizado.",
      "Isquemia crítica sem avaliação vascular prévia e sem vigilância estruturada.",
    ],
    practicalExamples: [
      "Ferida com fibrina amarela aderente: ponderar colagenase quando o desbridamento enzimático é viável.",
      "Deiscência cirúrgica com tecido desvitalizado: associar desbridamento e controlo de exsudado.",
    ],
    commonMistakes: [
      "Adiar desbridamento apesar de tecido desvitalizado evidente.",
      "Escolher apenas cobertura absorvente sem atuar sobre a barreira fibrinosa.",
      "Usar estratégias agressivas sem reavaliar dor, vascularização e objetivo clínico.",
    ],
    comparisons: [
      {
        title: "Colagenase vs hidrogel",
        useWhen: "Colagenase para fibrina aderente; hidrogel para hidratar leitos secos e facilitar autólise.",
        avoidWhen: "Evitar hidrogel como única prioridade quando exsudado é elevado.",
        classicError: "Escolher hidrogel num caso húmido e infetado, atrasando controlo do problema dominante.",
      },
    ],
    quickCheck: [
      {
        id: "desb-1",
        question: "Perante tecido desvitalizado e fibrina aderente, qual é a prioridade clínica?",
        options: [
          "Considerar estratégia de desbridamento",
          "Aplicar apenas creme hidratante",
          "Evitar qualquer revisão do leito",
        ],
        correctIndex: 0,
        rationale:
          "A presença de tecido desvitalizado justifica estratégia de desbridamento adequada ao contexto clínico.",
      },
    ],
    relatedCategories: ["Desbridamento"],
    relatedFunctions: ["desbridamento", "desbridamento_enzimatico", "desbridamento_autolitico"],
    relatedCaseIds: ["1", "2", "3", "4"],
  },
  {
    id: "gestao-exsudado",
    title: "Gestão de exsudado",
    objective:
      "Controlar humidade, prevenir maceração peri-ferida e manter um ambiente terapêutico favorável.",
    keySignals: [
      "Exsudado moderado ou abundante com extravasamento.",
      "Pele peri-ferida húmida, macerada ou irritada.",
      "Necessidade de absorção sustentada sem perder coerência terapêutica.",
    ],
    whenToUse: [
      "Exsudado moderado ou abundante com risco de extravasamento e dano cutâneo.",
      "Necessidade de absorção sustentada com materiais absorventes.",
    ],
    whenToAvoid: [
      "Feridas secas em que a prioridade é hidratar o leito.",
      "Sobreposição de vários materiais absorventes sem benefício clínico claro.",
    ],
    practicalExamples: [
      "Lesão por pressão com exsudado: escolher um material absorvente principal e reavaliar em 24-48 horas.",
      "Maceração peri-ferida: otimizar absorção e reforçar proteção cutânea periférica.",
    ],
    commonMistakes: [
      "Usar hidrogel em feridas já muito húmidas.",
      "Juntar múltiplas coberturas absorventes com a mesma função.",
      "Ignorar a pele peri-ferida apesar de exsudado persistente.",
    ],
    comparisons: [
      {
        title: "Hidrofibra vs alginato",
        useWhen: "Ambos são úteis no controlo de exsudado; hidrofibra tende a integrar-se bem em exsudado moderado e alginato destaca-se em exsudado mais elevado.",
        avoidWhen: "Evitar usá-los em feridas secas sem necessidade absorvente.",
        classicError: "Escolher material hidratante quando o problema dominante é a maceração.",
      },
    ],
    quickCheck: [
      {
        id: "exs-1",
        question: "Qual é o melhor foco quando a pele peri-ferida está macerada?",
        options: [
          "Controlar exsudado e proteger a pele adjacente",
          "Aumentar humidade com hidrogel",
          "Aplicar material diretamente em seco",
        ],
        correctIndex: 0,
        rationale:
          "Maceração sugere excesso de humidade; a prioridade é absorção adequada e proteção cutânea.",
      },
    ],
    relatedCategories: ["Gestão de exsudado"],
    relatedFunctions: ["controlo_exsudado", "absorcao"],
    relatedCaseIds: ["1", "2", "3", "4"],
  },
  {
    id: "antimicrobianos",
    title: "Antimicrobianos",
    objective:
      "Reduzir carga microbiana local quando há suspeita de infeção crítica ou infeção local estabelecida.",
    keySignals: [
      "Aumento de exsudado, odor e dor local.",
      "Atraso de cicatrização com sinais clínicos compatíveis com infeção.",
      "Necessidade de reavaliação temporal da resposta ao antimicrobiano.",
    ],
    whenToUse: [
      "Aumento de exsudado, odor, dor e atraso de cicatrização compatíveis com infeção local.",
      "Feridas complexas com risco elevado de colonização crítica.",
    ],
    whenToAvoid: [
      "Uso prolongado sem critérios explícitos de reavaliação clínica.",
      "Feridas sem sinais de carga microbiana clinicamente problemática.",
    ],
    practicalExamples: [
      "Ferida deiscente com febre ligeira: ponderar prata ou iodo e monitorizar resposta clínica.",
      "Sem melhoria após um ciclo antimicrobiano: rever hipótese diagnóstica, técnica e fatores sistémicos.",
    ],
    commonMistakes: [
      "Usar antimicrobianos por rotina sem sinais locais compatíveis.",
      "Manter o mesmo produto sem reavaliação da resposta.",
      "Substituir controlo de exsudado por antimicrobiano isolado.",
    ],
    comparisons: [
      {
        title: "Prata vs iodo",
        useWhen: "Ambos podem ser úteis no controlo microbiano local; a escolha deve considerar contexto, objetivo e tolerância.",
        avoidWhen: "Evitar uso indefinido sem plano de reavaliação.",
        classicError: "Tratar todo o leito como infetado sem correlacionar sinais clínicos.",
      },
    ],
    quickCheck: [
      {
        id: "anti-1",
        question: "Qual destes sinais reforça suspeita de infeção local?",
        options: [
          "Odor, dor e aumento de exsudado",
          "Leito limpo e granulação estável",
          "Ferida seca sem alteração recente",
        ],
        correctIndex: 0,
        rationale:
          "Odor, dor e exsudado crescente são sinais clínicos que justificam valorização de carga microbiana.",
      },
    ],
    relatedCategories: ["Controlo de infeção", "Antissépsia"],
    relatedFunctions: ["controlo_microbiano", "prata", "antisseptico"],
    relatedCaseIds: ["2", "3"],
  },
  {
    id: "protecao-perilesional",
    title: "Proteção da pele peri-ferida",
    objective:
      "Preservar a integridade cutânea adjacente, reduzindo maceração, dermatite por exsudado e trauma ao penso.",
    keySignals: [
      "Eritema, maceração ou fragilidade da pele adjacente.",
      "Feridas com exsudado frequente em contacto com a periferia.",
      "Risco de trauma relacionado com adesivos ou remoção do penso.",
    ],
    whenToUse: [
      "Sempre que o exsudado entra em contacto frequente com a pele peri-ferida.",
      "Pele frágil, irritada ou com risco de lesão por adesivos.",
    ],
    whenToAvoid: [
      "Aplicação excessiva que comprometa a adesão do penso sem necessidade.",
      "Uso de produtos incompatíveis com a cobertura escolhida.",
    ],
    practicalExamples: [
      "Aplicar barreira cutânea antes da cobertura absorvente.",
      "Se há descolamento recorrente do penso, rever preparação da pele e técnica de fixação.",
    ],
    commonMistakes: [
      "Focar apenas o leito e esquecer a periferia da ferida.",
      "Usar proteção cutânea sem controlar o exsudado que a agride continuamente.",
      "Aplicar camadas excessivas que prejudicam a fixação do penso.",
    ],
    comparisons: [
      {
        title: "Barreira cutânea vs creme gordo",
        useWhen: "Barreira cutânea para contacto com exsudado; creme gordo para pele seca e frágil fora da zona crítica de adesão.",
        avoidWhen: "Evitar produtos gordos sob áreas onde a adesão do penso é decisiva.",
        classicError: "Aplicar proteção sem rever porque a pele continua a macerar.",
      },
    ],
    quickCheck: [
      {
        id: "peri-1",
        question: "Qual combinação é mais coerente perante maceração peri-ferida?",
        options: [
          "Absorção adequada + proteção da pele peri-ferida",
          "Compressão forte sobre a lesão",
          "Aplicação em seco sem limpeza",
        ],
        correctIndex: 0,
        rationale:
          "A proteção periférica funciona melhor quando acompanha controlo do exsudado e técnica correta.",
      },
    ],
    relatedCategories: ["Proteção da pele perilesional", "Fixação"],
    relatedFunctions: ["protecao_perilesional", "barreira_cutanea", "hidratacao_pele"],
    relatedCaseIds: ["1", "2", "3", "4"],
  },
  {
    id: "tecidos-e-leito",
    title: "Leito da ferida e identificação de tecidos",
    objective:
      "Reconhecer tecido de granulação, fibrina e tecido desvitalizado para ajustar o objetivo terapêutico dominante.",
    keySignals: [
      "Granulação vermelha viva sugere tecido viável.",
      "Fibrina amarelada sugere necessidade de limpeza/desbridamento contextual.",
      "Mistura de tecidos exige plano orientado ao objetivo dominante e à evolução.",
    ],
    whenToUse: [
      "Na observação inicial de qualquer ferida.",
      "Sempre que o plano terapêutico depende do tipo de tecido presente no leito.",
    ],
    whenToAvoid: [
      "Assumir o mesmo plano para todos os tecidos sem diferenciação visual.",
    ],
    practicalExamples: [
      "Leito com granulação e fibrina: combinar controlo do exsudado com estratégia de preparação do leito.",
      "Leito limpo e vermelho: evitar desbridamento desnecessário.",
    ],
    commonMistakes: [
      "Confundir fibrina com tecido saudável.",
      "Escolher cobertura sem relacionar o tipo de tecido com o objetivo clínico.",
      "Não rever a imagem da ferida antes de decidir.",
    ],
    comparisons: [
      {
        title: "Granulação vs fibrina",
        useWhen: "Granulação orienta proteção do tecido viável; fibrina orienta preparação do leito.",
        avoidWhen: "Evitar linguagem vaga sem descrever o tecido dominante.",
        classicError: "Chamar granulação a qualquer área avermelhada sem olhar para a superfície e aderência.",
      },
    ],
    quickCheck: [
      {
        id: "tec-1",
        question: "Se o leito mistura granulação e fibrina, qual deve ser o raciocínio?",
        options: [
          "Definir o problema dominante e ajustar o plano ao tecido presente",
          "Escolher sempre o mesmo penso independentemente do tecido",
          "Ignorar a observação do leito e decidir só pela localização",
        ],
        correctIndex: 0,
        rationale:
          "A identificação dos tecidos orienta o objetivo terapêutico e evita decisões automáticas.",
      },
    ],
    relatedFunctions: ["desbridamento", "desbridamento_enzimatico", "desbridamento_autolitico"],
    relatedCaseIds: ["1", "2", "3", "4"],
  },
  {
    id: "materiais-desadequados",
    title: "Materiais desadequados",
    objective:
      "Evitar intervenções que lesionem tecido viável, atrasem cicatrização ou aumentem dor e trauma.",
    keySignals: [
      "Produtos agressivos sem indicação clara.",
      "Seleção baseada em hábito e não no problema dominante.",
      "Planos com excesso de materiais redundantes.",
    ],
    whenToUse: [
      "Como secção de segurança clínica para identificar escolhas que não devem ser rotina.",
    ],
    whenToAvoid: [
      "Álcool no leito da ferida.",
      "Gaze seca em contacto direto com tecido viável.",
      "Corticoterapia tópica sem indicação específica.",
    ],
    practicalExamples: [
      "Substituir uma abordagem agressiva por limpeza adequada e cobertura húmida dirigida ao objetivo clínico dominante.",
    ],
    commonMistakes: [
      "Aplicar betametasona por reflexo em contextos em que não é prioridade.",
      "Usar material em seco sobre tecido viável.",
      "Acumular várias opções semelhantes sem coerência clínica.",
    ],
    comparisons: [
      {
        title: "Escolha dirigida vs escolha por hábito",
        useWhen: "Escolher o material mais alinhado com o objetivo dominante do caso.",
        avoidWhen: "Evitar repetir sempre o mesmo produto independentemente do leito e exsudado.",
        classicError: "Selecionar mais produtos para 'garantir' melhor resultado, criando excesso e ruído terapêutico.",
      },
    ],
    quickCheck: [
      {
        id: "mat-1",
        question: "Qual destas escolhas é tipicamente desadequada sem indicação específica?",
        options: ["Betametasona tópica", "Barreira cutânea", "Cloreto de sódio 0,9%"],
        correctIndex: 0,
        rationale:
          "Betametasona não é uma escolha de rotina na maioria dos cenários do simulador e deve ter indicação específica.",
      },
    ],
    relatedCategories: ["Fármacos tópicos"],
    relatedTreatmentIds: ["betametasona"],
    relatedCaseIds: ["1", "2", "3", "4"],
  },
  {
    id: "decisao-clinica",
    title: "Princípios de decisão clínica",
    objective:
      "Tomar decisões estruturadas, reproduzíveis e centradas no problema clínico dominante da ferida.",
    keySignals: [
      "Observar antes de tratar.",
      "Relacionar achados clínicos com objetivo terapêutico.",
      "Reavaliar e simplificar o plano quando existe excesso de materiais.",
    ],
    whenToUse: [
      "Em qualquer avaliação: observar, recolher dados, definir objetivo terapêutico e selecionar cobertura.",
      "Sempre com reavaliação temporal da resposta ao plano instituído.",
    ],
    whenToAvoid: [
      "Polimedicação tópica sem hipótese clínica clara.",
      "Manter plano ineficaz sem ajustar após reavaliação objetiva.",
    ],
    practicalExamples: [
      "Problema dominante = exsudado: priorizar absorção e proteção peri-ferida.",
      "Problema dominante = tecido desvitalizado: incluir desbridamento e monitorizar evolução do leito.",
    ],
    commonMistakes: [
      "Finalizar o caso sem observação mínima.",
      "Perguntar pouco ao utente e perder dados clínicos importantes.",
      "Tomar decisão baseada só num material preferido.",
    ],
    comparisons: [
      {
        title: "Plano focado vs plano excessivo",
        useWhen: "Escolher poucos materiais com função clara e complementar.",
        avoidWhen: "Evitar sobreposição de produtos com o mesmo objetivo.",
        classicError: "Confundir quantidade de materiais com qualidade de decisão clínica.",
      },
    ],
    quickCheck: [
      {
        id: "dec-1",
        question: "Qual sequência traduz melhor o raciocínio clínico no simulador?",
        options: [
          "Observar, recolher dados, definir objetivo, selecionar tratamento",
          "Selecionar tratamento e depois observar",
          "Ignorar diálogo e decidir apenas pela imagem",
        ],
        correctIndex: 0,
        rationale:
          "A decisão clínica do simulador foi desenhada para seguir uma sequência estruturada de recolha e síntese de dados.",
      },
    ],
    relatedCategories: ["Limpeza", "Desbridamento", "Gestão de exsudado"],
    relatedCaseIds: ["1", "2", "3", "4"],
  },
];
