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
          "Aumenta a humidade num contexto em que a prioridade clínica é absorver e proteger a periferia.",
        relatedTreatmentIds: ["hidrogel"],
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
          "A antissépsia e os pensos com prata não devem substituir a leitura clínica do caso nem o controlo do problema dominante.",
        relatedTreatmentIds: ["silvercel", "aquacel-ag", "iodopovidona-solucao"],
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
          "Controlar o exsudado sem abordar tecido desvitalizado pode deixar o problema dominante por resolver.",
        relatedTreatmentIds: ["aquacel-simples", "vliwasorb"],
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
          "A proteção peri-ferida é mais eficaz quando acompanha o controlo da humidade.",
        relatedTreatmentIds: ["oxido-zinco", "protetor-polimero-acrilico-spray", "creme-gordo"],
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
          "Sem identificar o tecido dominante, o plano tende a ser menos focado e mais redundante.",
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
          "Mais materiais não significam um plano melhor. O foco terapêutico é um marcador de raciocínio clínico.",
      },
      {
        id: "inad-betamethasone",
        title: "Betametasona como resposta automática",
        explanation:
          "Não responde ao problema dominante dos casos do simulador e fragiliza o raciocínio clínico.",
        relatedTreatmentIds: ["betametasona"],
      },
    ],
    evidenceIds: ["water-cleansing", "debridement-review"],
    treatmentIds: ["cloreto-sodio-09", "octenilin-solucao-lavagem", "betametasona"],
    caseIds: ["1", "2", "3", "4"],
    relatedTopicIds: ["tecidos-e-leito", "gestao-exsudado", "desbridamento"],
  },
];
