import type { LearningTopic } from "../../lib/clinical/types.ts";

export const learningTopics: LearningTopic[] = [
  {
    id: "gestao-exsudado",
    pedagogicalDifficulty: "base",
    title: "Gestão do exsudado",
    definition:
      "Controlar a humidade, proteger a pele adjacente e escolher um material absorvente proporcional ao exsudado.",
    indications: [
      "Exsudado moderado ou abundante",
      "Maceração peri-ferida",
      "Necessidade de manter um plano simples e focado",
    ],
    contraindications: [
      "Feridas secas em que a prioridade é hidratar",
      "Sobrepor vários absorventes sem benefício clínico claro",
    ],
    warningSigns: ["Extravasamento", "Maceração", "Odor associado a humidade persistente"],
    commonMistakes: [
      {
        id: "exs-hydrogel",
        title: "Hidrogel em ferida muito exsudativa",
        explanation:
          "Aumenta a humidade num contexto em que a prioridade clínica é absorver e proteger a periferia. Reservar o hidrogel para feridas secas ou com exsudado leve.",
        relatedTreatmentIds: ["hidrogel"],
      },
      {
        id: "exs-high-absorb-low-exudate",
        title: "Absorvente de alta capacidade em ferida com exsudado baixo",
        explanation:
          "Usar vliwasorb ou aquacel num leito com exsudado leve pode provocar dessecação do tecido de granulação. A capacidade absorvente deve ser proporcional ao volume real de exsudado.",
        relatedTreatmentIds: ["vliwasorb"],
      },
      {
        id: "exs-no-periwound",
        title: "Controlar o exsudado sem proteger a pele peri-ferida",
        explanation:
          "Gerir a humidade com uma cobertura absorvente não elimina o risco de maceração se o exsudado que extravasa pelo bordo atingir a pele adjacente. A proteção perilesional é parte do plano de gestão do exsudado.",
        relatedTreatmentIds: ["oxido-zinco", "protetor-spray"],
      },
    ],
    evidenceIds: ["hydrofiber-review", "alginate-review", "foam-review"],
    treatmentIds: ["aquacel-simples", "fibrosol", "vliwasorb", "silvercel", "aquacel-ag", "allevyn"],
    caseIds: ["1", "2", "3", "4"],
    relatedTopicIds: ["protecao-perilesional", "decisao-clinica"],
  },
  {
    id: "antimicrobianos",
    pedagogicalDifficulty: "intermedio",
    title: "Controlo da infeção local",
    definition:
      "Selecionar soluções de antissépsia e materiais antimicrobianos de forma coerente com os sinais locais e com o objetivo clínico do caso.",
    indications: [
      "Odor",
      "Dor agravada",
      "Aumento de exsudado",
      "Tecido desvitalizado com suspeita de colonização crítica",
    ],
    contraindications: ["Uso rotineiro sem reavaliação do caso", "Manter prata ou iodo sem revisão clínica"],
    warningSigns: ["Odor persistente", "Agravamento da dor", "Aumento do exsudado", "Febre"],
    commonMistakes: [
      {
        id: "anti-routine",
        title: "Antimicrobianos sem reavaliação",
        explanation:
          "A antissépsia e os pensos com prata não devem substituir a leitura clínica do caso nem o controlo do problema dominante. Usar prata de forma sistemática sem sinais de infeção é um erro de raciocínio.",
        relatedTreatmentIds: ["silvercel", "aquacel-ag", "iodopovidona-solucao"],
      },
      {
        id: "anti-double-silver",
        title: "Dois materiais com prata no mesmo plano",
        explanation:
          "Associar Silvercel® e Aquacel Ag® em simultâneo é redundante — a concentração de prata duplicada não aumenta a eficácia antimicrobiana e reduz o foco terapêutico sem benefício clínico demonstrado.",
        relatedTreatmentIds: ["silvercel", "aquacel-ag"],
      },
      {
        id: "anti-odor-vs-infection",
        title: "Confundir odor com infeção sistémica",
        explanation:
          "Odor isolado não confirma infeção — pode ter origem em colonização, exsudado em decomposição ou tecido necrótico. O plano antimicrobiano deve basear-se no conjunto de sinais locais, e não apenas no odor.",
        relatedTreatmentIds: ["actisorb-plus-prata"],
      },
    ],
    evidenceIds: ["silver-consensus", "povidone-review", "octenidine-consensus"],
    treatmentIds: ["silvercel", "aquacel-ag", "iodopovidona-solucao", "actisorb-plus-prata"],
    caseIds: ["2", "3"],
    relatedTopicIds: ["gestao-exsudado", "decisao-clinica"],
  },
  {
    id: "desbridamento",
    pedagogicalDifficulty: "intermedio",
    title: "Desbridamento e preparação do leito",
    definition:
      "Remover ou mobilizar tecido desvitalizado para que a cobertura atue sobre um leito preparado e clinicamente legível.",
    indications: ["Fibrina aderente", "Tecido desvitalizado", "Ferida estagnada"],
    contraindications: ["Leito limpo em granulação ativa", "Abordagem agressiva sem contexto clínico"],
    warningSigns: ["Fibrina persistente", "Odor com tecido desvitalizado", "Falta de progressão"],
    commonMistakes: [
      {
        id: "deb-absorb-only",
        title: "Cobertura absorvente sem preparar o leito",
        explanation:
          "Controlar o exsudado sem abordar tecido desvitalizado pode deixar o problema dominante por resolver. Fibrina aderente não desaparece apenas com absorção — precisa de ser abordada diretamente.",
        relatedTreatmentIds: ["aquacel-simples", "vliwasorb"],
      },
      {
        id: "deb-hydrogel-wet",
        title: "Hidrogel em ferida com exsudado abundante",
        explanation:
          "O desbridamento autolítico com hidrogel é indicado em leitos secos ou com exsudado leve. Em feridas muito exsudativas, o hidrogel agrava o excesso de humidade e não resolve o tecido desvitalizado.",
        relatedTreatmentIds: ["hidrogel"],
      },
      {
        id: "deb-without-tissue-id",
        title: "Iniciar desbridamento sem identificar o tecido dominante",
        explanation:
          "Aplicar colagenase ou outro agente sem confirmar a presença de fibrina ou necrose pode sobretratamento em leitos já em granulação ativa, atrasando a epitelização.",
        relatedTreatmentIds: ["colagenase"],
      },
    ],
    evidenceIds: ["debridement-review", "collagenase-review"],
    treatmentIds: ["colagenase", "hidrogel"],
    caseIds: ["1", "2", "3", "4"],
    relatedTopicIds: ["tecidos-e-leito", "decisao-clinica"],
  },
  {
    id: "protecao-perilesional",
    pedagogicalDifficulty: "base",
    title: "Proteção da pele peri-ferida",
    definition:
      "Proteger a pele adjacente para evitar maceração, dermatite por exsudado e trauma relacionado com o penso.",
    indications: ["Maceração", "Pele frágil", "Risco de adesivo", "Exsudado persistente"],
    contraindications: ["Aplicação excessiva que comprometa a adesão sem necessidade"],
    warningSigns: ["Eritema", "Maceração", "Descamação", "Dor ao retirar o penso"],
    commonMistakes: [
      {
        id: "peri-without-exudate",
        title: "Aplicar barreira sem rever o exsudado",
        explanation:
          "A proteção peri-ferida é mais eficaz quando acompanha o controlo da humidade. Uma barreira sem cobertura absorvente adequada não evita a maceração se o exsudado continuar a extravazar.",
        relatedTreatmentIds: ["oxido-zinco", "protetor-polimero-acrilico-spray", "creme-gordo"],
      },
      {
        id: "peri-omit-maceration",
        title: "Omitir proteção perilesional em pele macerada",
        explanation:
          "Quando a pele adjacente está já macerada, não incluir um protetor cutâneo no plano prolonga o dano e aumenta o risco de dermatite por exsudado, mesmo que a cobertura principal seja adequada.",
        relatedTreatmentIds: ["oxido-zinco", "protetor-spray"],
      },
      {
        id: "peri-betamethasone",
        title: "Usar betametasona como protetor peri-ferida",
        explanation:
          "Corticosteroides tópicos como a betametasona não têm função protetora na pele perilesional. O seu uso pode mascarar sinais de infeção e fragilizar ainda mais a pele adjacente.",
        relatedTreatmentIds: ["betametasona"],
      },
    ],
    evidenceIds: ["skin-barrier-review"],
    treatmentIds: ["oxido-zinco", "protetor-polimero-acrilico-spray", "creme-gordo"],
    caseIds: ["1", "2", "3", "4"],
    relatedTopicIds: ["gestao-exsudado", "decisao-clinica"],
  },
  {
    id: "tecidos-e-leito",
    pedagogicalDifficulty: "base",
    title: "Leito da ferida e identificação de tecidos",
    definition:
      "Distinguir granulação, fibrina e tecido desvitalizado para definir o objetivo terapêutico dominante.",
    indications: ["Observação inicial", "Mudança de evolução", "Dúvida sobre desbridamento"],
    contraindications: ["Decidir sem olhar para o tecido dominante"],
    warningSigns: ["Fibrina aderente", "Leito estagnado", "Tecido frágil", "Odor com tecido desvitalizado"],
    commonMistakes: [
      {
        id: "tissue-generic",
        title: "Descrever o leito de forma vaga",
        explanation:
          "Sem identificar o tecido dominante, o plano tende a ser menos focado e mais redundante. \"Ferida com mau aspeto\" não orienta a decisão clínica — granulação, fibrina e necrose exigem respostas diferentes.",
      },
      {
        id: "tissue-same-material",
        title: "Usar a mesma cobertura independentemente do tecido",
        explanation:
          "Escolher o mesmo material para um leito em granulação ativa e para um leito com fibrina ou necrose ignora o estado do tecido. A cobertura ideal varia com o que o leito apresenta.",
      },
      {
        id: "tissue-granulation-vs-epithelization",
        title: "Confundir granulação frágil com epitelização",
        explanation:
          "Granulação ativa pode ter um aspeto rosado semelhante ao tecido em epitelização, mas ainda necessita de proteção e humidade adequada. Tratar como epitelização antecipa uma fase que ainda não foi atingida.",
        relatedTreatmentIds: ["urgotul"],
      },
    ],
    evidenceIds: ["debridement-review"],
    treatmentIds: ["colagenase", "hidrogel", "urgotul"],
    caseIds: ["1", "2", "3", "4"],
    relatedTopicIds: ["desbridamento", "decisao-clinica"],
  },
  {
    id: "decisao-clinica",
    pedagogicalDifficulty: "base",
    title: "Princípios de decisão clínica",
    definition:
      "Observar, recolher dados, definir o problema dominante e escolher o plano mínimo seguro antes de otimizar.",
    indications: ["Todos os casos do simulador"],
    contraindications: [
      "Finalizar sem observação mínima",
      "Escolher materiais sem problema clínico definido",
    ],
    warningSigns: ["Excesso de materiais", "Perguntas insuficientes", "Foco pouco claro"],
    commonMistakes: [
      {
        id: "decision-overload",
        title: "Confundir quantidade com qualidade",
        explanation:
          "Mais materiais não significam um plano melhor. O foco terapêutico é um marcador de raciocínio clínico — um plano com 2 ou 3 materiais bem justificados vale mais do que 6 escolhas sem coerência.",
      },
      {
        id: "inad-betamethasone",
        title: "Betametasona como resposta automática",
        explanation:
          "Não responde ao problema dominante dos casos do simulador e fragiliza o raciocínio clínico. A betametasona tem indicações específicas que não se aplicam ao contexto das feridas crónicas e agudas simuladas.",
        relatedTreatmentIds: ["betametasona"],
      },
      {
        id: "decision-no-observation",
        title: "Finalizar sem observação mínima",
        explanation:
          "Omitir a imagem, o exsudado ou o estado perilesional significa decidir sem dados suficientes. O plano resultante tende a não alinhar com o problema dominante porque o problema dominante nunca foi claramente identificado.",
      },
    ],
    evidenceIds: ["water-cleansing", "debridement-review"],
    treatmentIds: ["cloreto-sodio-09", "octenilin-solucao-lavagem", "betametasona"],
    caseIds: ["1", "2", "3", "4"],
    relatedTopicIds: ["tecidos-e-leito", "gestao-exsudado", "desbridamento"],
  },
];
