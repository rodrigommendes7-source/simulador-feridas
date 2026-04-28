import type { LearningTopic } from "../../lib/clinical/types.ts";

export const learningTopics: LearningTopic[] = [
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
      {
        id: "hipergran-causa",
        title: "Tratar hipergranulação sem identificar causa",
        explanation:
          "Hipergranulação é frequentemente iatrogénica — oclusão excessiva, prata prolongada (>2 semanas), atrito. Reduzir o tecido sem remover a causa leva a recorrência. Rever cobertura e duração do tratamento antes de recorrer a cauterização.",
        relatedTreatmentIds: ["aquacel-ag", "silvercel", "betametasona"],
      },
    ],
    evidenceIds: ["debridement-review"],
    treatmentIds: ["colagenase", "hidrogel", "urgotul"],
    caseIds: ["1", "2", "3", "4"],
    relatedTopicIds: ["desbridamento", "decisao-clinica"],
    tables: [
      {
        id: "tipos-tecido",
        title: "Tipos de tecido no leito da ferida",
        caption:
          "O leito da ferida é avaliado em percentagem de cada tipo de tecido. O objetivo clínico é maximizar granulação e epitelização.",
        headers: ["Tecido", "Aspeto", "Significado", "Ação clínica"],
        rows: [
          {
            cells: [
              "Granulação",
              "Vermelho, rugoso, húmido, bem vascularizado",
              "Cicatrização ativa e favorável",
              "Manter ambiente húmido; não traumatizar na mudança",
            ],
          },
          {
            cells: [
              "Fibrina / esfacelo",
              "Amarelo, mole, húmido, pode ter odor",
              "Tecido desvitalizado — impede cicatrização",
              "Desbridamento autolítico (hidrogel) ou enzimático (colagenase)",
            ],
          },
          {
            cells: [
              "Necrose seca",
              "Preta/castanha, dura, desidratada",
              "Tecido morto — barreira mecânica",
              "Hidratação prévia + desbridamento enzimático ou sharp",
            ],
          },
          {
            cells: [
              "Necrose húmida",
              "Mole, escura, odor fétido",
              "Risco elevado de infeção grave",
              "Desbridamento urgente + avaliação médica imediata",
            ],
          },
          {
            cells: [
              "Epitelização",
              "Rosa pálido, brilhante, avança das bordas",
              "Fecho da ferida em curso",
              "Proteger; não traumatizar; manter húmido sem macerar",
            ],
          },
          {
            cells: [
              "Hipergranulação",
              "Tecido acima do nível da pele, vermelho, friável",
              "Impede a epitelização",
              "Nitrato de prata (lápis), corticoide tópico ou pressão local",
            ],
          },
        ],
      },
    ],
    keyConcepts: [
      {
        id: "tecido-define-plano",
        title: "O tecido define o plano",
        body: "O tipo de tecido determina o método de desbridamento e o penso a utilizar. Avaliar e registar em percentagem em cada observação.",
      },
    ],
  },
  {
    id: "bordos-da-ferida",
    pedagogicalDifficulty: "base",
    title: "Bordos da ferida",
    definition:
      "Os bordos fornecem informação sobre a dinâmica de cicatrização: epitelização ativa, estagnação, maceração ou causa subjacente não controlada.",
    indications: ["Avaliação inicial", "Monitorização da progressão", "Suspeita de neoplasia ou vasculite"],
    contraindications: ["Decidir o plano sem observar os bordos"],
    warningSigns: [
      "Bordos enrolados (rolled/epibole)",
      "Bordos fixos e pallidos",
      "Bordos irregulares de aparecimento rápido",
    ],
    commonMistakes: [
      {
        id: "bordos-ignore",
        title: "Não registar os bordos na avaliação inicial",
        explanation:
          "Documentar apenas o leito sem os bordos perde dados sobre cicatrização. Bordos enrolados (epibole) indicam estagnação e podem requerer desbridamento mecânico ou estimulação física.",
      },
      {
        id: "bordos-macerated-vs-epibole",
        title: "Confundir bordos macerados com epibole",
        explanation:
          "Bordos esbranquiçados por maceração (húmidos, amolecidos) diferem dos bordos enrolados por estagnação. A causa é diferente — a primeira é humidade excessiva, a segunda é falha de migração epitelial — e a resposta clínica também.",
      },
    ],
    evidenceIds: ["debridement-review"],
    treatmentIds: [],
    caseIds: ["1", "2", "3", "4"],
    relatedTopicIds: ["tecidos-e-leito", "desbridamento"],
    tables: [
      {
        id: "tipos-bordos",
        title: "Tipos de bordos e interpretação clínica",
        caption: "O aspeto dos bordos orienta a suspeita diagnóstica e o foco terapêutico.",
        headers: ["Tipo de bordo", "Aspeto", "Significado clínico", "Ação"],
        rows: [
          {
            cells: [
              "Em epitelização",
              "Fino, translúcido, avançando sobre o leito",
              "Cicatrização ativa — bom sinal",
              "Manter humidade; não interferir",
            ],
          },
          {
            cells: [
              "Regulares / definidos",
              "Nítidos, planos, sem descolamento",
              "Ferida estável, sem progressão positiva ou negativa",
              "Avaliar se há bloqueio à cicatrização",
            ],
          },
          {
            cells: [
              "Macerados",
              "Esbranquiçados, amolecidos, húmidos",
              "Exsudado excessivo ou penso inadequado",
              "Aumentar absorção; aplicar barreira perilesional",
            ],
          },
          {
            cells: [
              "Enrolados (epibole)",
              "Bordos dobrados sobre si, espessados",
              "Estagnação da migração epitelial (ferida crónica)",
              "Desbridamento mecânico dos bordos; reavaliar causa",
            ],
          },
          {
            cells: [
              "Indefinidos / irregulares",
              "Limites imprecisos, eritema perilesional",
              "Infeção local, vasculite, neoplasia",
              "Não progredir sem diagnóstico; referência médica se suspeita de neoplasia",
            ],
          },
        ],
      },
    ],
    keyConcepts: [
      {
        id: "bordos-mirror",
        title: "Os bordos espelham o que acontece no leito",
        body: "Um leito em granulação ativa com bordos parados ou enrolados indica que a cicatrização está bloqueada apesar de aparência positiva. Os bordos devem avançar acompanhando o leito — quando não avançam, há um problema por identificar.",
      },
    ],
  },
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
    treatmentIds: ["aquacel", "fibrosol", "vliwasorb", "silvercel", "aquacel-ag", "allevyn"],
    caseIds: ["1", "2", "3", "4"],
    relatedTopicIds: ["protecao-perilesional", "decisao-clinica"],
    tables: [
      {
        id: "tipos-exsudado",
        title: "Tipos e significado clínico do exsudado",
        caption:
          "O exsudado é avaliado em quantidade, consistência e odor — indicador fundamental para a escolha do penso e deteção de infeção.",
        headers: ["Parâmetro", "Aspeto", "Significado clínico"],
        rows: [
          {
            cells: [
              "Seroso",
              "Claro, aquoso, transparente",
              "Normal. Fase inflamatória precoce ou ferida limpa em granulação.",
            ],
          },
          {
            cells: [
              "Serossanguinolento",
              "Rosado, levemente turvo",
              "Normal em feridas recentes, após desbridamento ou trauma mecânico.",
            ],
          },
          {
            cells: [
              "Sanguinolento",
              "Vermelho, sangue vivo ou escuro",
              "Traumatismo recente, fragilidade vascular, anticoagulação.",
            ],
          },
          {
            cells: [
              "Purulento",
              "Espesso, opaco, amarelo/verde/acastanhado",
              "Infeção estabelecida. Ação clínica imediata. Avaliar antibioterapia.",
            ],
          },
          {
            cells: [
              "Odor fétido",
              "Cheiro intenso, desagradável",
              "Infeção ou necrose. Considerar carvão ativado ou mel médico.",
            ],
          },
        ],
      },
      {
        id: "absorcao-por-nivel",
        title: "Escolha do penso por nível de exsudado",
        caption:
          "A capacidade de absorção deve ser proporcional ao volume real — nem sub nem sobredimensionada.",
        headers: ["Nível", "Objetivo", "Materiais de eleição"],
        rows: [
          {
            cells: [
              "Escasso",
              "Reter humidade; evitar ressecamento",
              "Hidrogel · Hidrocoloide · Urgotul · Vaselina gaze",
            ],
          },
          {
            cells: [
              "Moderado",
              "Absorção controlada; ambiente húmido sem excesso",
              "Allevyn · Aquacel · Varihesive · Urgo Clean",
            ],
          },
          {
            cells: [
              "Abundante",
              "Alta absorção; prevenir maceração",
              "Vliwasorb · Exufiber · Alginato de cálcio · Silvercel",
            ],
          },
          {
            cells: [
              "Peri-lesional",
              "Barreira contra exsudado e maceração",
              "Spray protetor acrílico · Óxido de zinco · ATL",
            ],
          },
        ],
      },
    ],
    keyConcepts: [
      {
        id: "regra-saturacao",
        title: "Regra prática de saturação",
        body: "Se o penso satura antes do prazo previsto — subir para maior absorção. Se a ferida macera — descer a absorção ou aumentar o intervalo de mudança.",
      },
    ],
    clinicalAlerts: [
      {
        id: "purulento-sistemico",
        severity: "critical",
        title: "Exsudado purulento + odor + febre + taquicardia",
        body: "Suspeita de infeção sistémica. Escalar imediatamente para avaliação médica.",
      },
    ],
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
        relatedTreatmentIds: ["silvercel", "aquacel-ag", "betadine-solucao"],
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
        relatedTreatmentIds: ["actisorb-silver"],
      },
    ],
    evidenceIds: ["silver-consensus", "antiseptic-review-2022", "aptferidas-infecao-2025"],
    treatmentIds: ["silvercel", "aquacel-ag", "betadine-solucao", "actisorb-silver"],
    caseIds: ["2", "3"],
    relatedTopicIds: ["gestao-exsudado", "decisao-clinica"],
    tables: [
      {
        id: "abordagem-por-nivel",
        title: "Abordagem à infeção por nível",
        caption:
          "Antissépticos NÃO são usados de forma rotineira em feridas em cicatrização — são citotóxicos para o tecido de granulação.",
        headers: ["Nível", "Características", "Abordagem", "Materiais"],
        rows: [
          {
            cells: [
              "Contaminação",
              "Microrganismos presentes, sem proliferação",
              "Limpeza com soro. Sem antisséptico.",
              "Soro fisiológico 0,9%",
            ],
          },
          {
            cells: [
              "Colonização",
              "Microrganismos presentes sem resposta do hospedeiro",
              "Limpeza + penso antimicrobiano se estagnação",
              "Aquacel Ag · Urgotul Ag · Mel médico",
            ],
          },
          {
            cells: [
              "Biofilme",
              "Comunidade bacteriana protegida por matriz",
              "Desbridamento mecânico + antisséptico tópico + penso antimicrobiano",
              "Octenilin · Mel médico · Cadexómero de iodo",
            ],
          },
          {
            cells: [
              "Infeção local",
              "Calor, rubor, dor, pus",
              "Antisséptico tópico + penso antimicrobiano. Avaliar antibiótico oral.",
              "Betadine · Octiset · Silvercel · Aquacel Ag",
            ],
          },
          {
            cells: [
              "Infeção sistémica",
              "Febre, taquicardia, confusão, hipotensão",
              "Escalada médica urgente. Antibiótico IV. UCI se sépsis.",
              "→ Intervenção médica ←",
            ],
          },
        ],
      },
      {
        id: "sinais-subtis",
        title: "Sinais subtis em feridas crónicas",
        caption:
          "Em feridas crónicas ou em imunossuprimidos, os sinais clássicos podem estar ausentes. Manter alto índice de suspeição.",
        headers: ["Sinal subtil", "Implicação clínica"],
        rows: [
          {
            cells: [
              "Aumento inexplicado da dor",
              "Pode preceder outros sinais. Investigar sempre.",
            ],
          },
          {
            cells: [
              "Granulação friável que sangra com facilidade",
              "Tecido de má qualidade por carga bacteriana elevada.",
            ],
          },
          {
            cells: [
              "Odor sem exsudado purulento visível",
              "Biofilme ou anaerobiose. Antisséptico tópico + desbridamento.",
            ],
          },
          {
            cells: [
              "Estagnação da cicatrização",
              "Sem evolução após 2–4 semanas. Suspeita de infeção crónica.",
            ],
          },
          {
            cells: [
              "Aumento súbito do exsudado",
              "Sem causa aparente. Avaliar colonização crítica ou infeção.",
            ],
          },
        ],
      },
    ],
    keyConcepts: [
      {
        id: "octenidina-biocompativel",
        title: "Octenidina como antisséptico de eleição",
        body: "A octenidina (Octiset, Octenilin) é um dos antissépticos mais biocompatíveis: segura em feridas abertas, sem coloração e sem interferência com cultura microbiológica. Preferir ao betadine em feridas em cicatrização.",
      },
    ],
    clinicalAlerts: [
      {
        id: "sepsis",
        severity: "critical",
        title: "Sinais sistémicos — possível sépsis",
        body: "Febre · taquicardia · hipotensão · alteração do estado de consciência. Contacto médico imediato. Não aguardar.",
      },
      {
        id: "diabetico-imunossuprimido",
        severity: "warning",
        title: "Doente diabético, imunossuprimido ou com isquemia",
        body: "Os sinais inflamatórios podem estar muito atenuados. Manter alto índice de suspeição mesmo sem sinais clássicos.",
      },
    ],
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
        relatedTreatmentIds: ["oxido-zinco", "protetor-spray"],
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
    treatmentIds: ["oxido-zinco", "protetor-spray"],
    caseIds: ["1", "2", "3", "4"],
    relatedTopicIds: ["gestao-exsudado", "decisao-clinica"],
    tables: [
      {
        id: "alteracoes-peri-lesionais",
        title: "Alterações da pele peri-lesional",
        caption:
          "A pele à volta da ferida é um indicador clínico rico. Cada alteração tem uma causa provável e uma resposta terapêutica distinta.",
        headers: ["Alteração", "Aspeto", "Causa provável", "Ação clínica"],
        rows: [
          {
            cells: [
              "Maceração",
              "Pele esbranquiçada, amolecida, com aspeto encharcado",
              "Exsudado excessivo ou penso pouco absorvente",
              "Trocar para cobertura mais absorvente; aplicar barreira cutânea (óxido de zinco ou spray protetor)",
            ],
          },
          {
            cells: [
              "Eritema / rubor",
              "Vermelhidão, com ou sem calor local",
              "Reação alérgica ao adesivo, pressão ou início de infeção",
              "Identificar causa; considerar penso hipoalergénico; rever etiologia da ferida",
            ],
          },
          {
            cells: [
              "Edema perilesional",
              "Pele tensa, brilhante, sinal de godet positivo",
              "Insuficiência venosa, linfedema, infeção local",
              "Elevar o membro; considerar terapia compressiva se indicada; avaliar sinais de infeção",
            ],
          },
          {
            cells: [
              "Hiperqueratose",
              "Pele espessada, esbranquiçada, descamativa",
              "Pressão crónica, exsudado persistente, calçado inadequado",
              "Desbridamento da hiperqueratose se necessário; controlo da causa mecânica",
            ],
          },
          {
            cells: [
              "Pele seca / descamação",
              "Pele fina, rugosa, com descamação fina",
              "Idade avançada, desidratação, insuficiência venosa crónica",
              "Aplicar emoliente não comedogénico; rever hidratação sistémica",
            ],
          },
          {
            cells: [
              "Lesão por adesivo (MARSI)",
              "Erosão, flictena ou eritema no local do adesivo",
              "Remoção traumática, sensibilidade cutânea, penso inadequado",
              "Usar técnica de remoção atraumática; mudar para penso sem adesivo agressivo; aplicar spray protetor",
            ],
          },
        ],
      },
    ],
    keyConcepts: [
      {
        id: "peri-barrier-first",
        title: "A barreira peri-lesional não substitui o controlo do exsudado",
        body: "Aplicar óxido de zinco ou spray protetor sem rever a cobertura absorvente é tratar o sintoma e não a causa. O objetivo é reduzir o exsudado que chega à pele — a barreira é sempre complementar.",
      },
      {
        id: "marsi-prevention",
        title: "MARSI — a lesão que ninguém documenta",
        body: "A lesão relacionada com adesivos médicos (MARSI) é subnotificada. Remoção rápida, pele húmida e pele geriátrica frágil são os principais fatores de risco. Sempre remover o penso com tração paralela à pele, nunca perpendicular.",
      },
    ],
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
        relatedTreatmentIds: ["aquacel", "vliwasorb"],
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
    tables: [
      {
        id: "metodos-desbridamento",
        title: "Métodos de desbridamento",
        caption:
          "A escolha do método depende do tipo e extensão do tecido desvitalizado, da perfusão local e dos recursos disponíveis.",
        headers: ["Método", "Mecanismo", "Indicação principal", "Limitação"],
        rows: [
          {
            cells: [
              "Autolítico",
              "Humidade mantida activa as enzimas endógenas do leito",
              "Fibrina leve a moderada; doente cooperante; ambulatório",
              "Lento (dias a semanas); ineficaz em necrose extensa",
            ],
          },
          {
            cells: [
              "Enzimático",
              "Colagenase cliva fibras de colagénio desnaturado",
              "Fibrina aderente moderada; quando o desbridamento cirúrgico não é viável",
              "Requer prescrição; pode causar irritação perilesional",
            ],
          },
          {
            cells: [
              "Mecânico (irrigação)",
              "Força física remove detritos e exsudado",
              "Limpeza de cavidades; feridas com fibrina lassa",
              "Pode traumatizar tecido de granulação; não desbridante para fibrina aderente",
            ],
          },
          {
            cells: [
              "Cirúrgico / sharp",
              "Bisturi ou tesoura remove tecido macroscopicamente",
              "Necrose extensa; urgência clínica; ferida com biofilme",
              "Requer competência especializada; risco hemorrágico",
            ],
          },
          {
            cells: [
              "Biológico (larvas)",
              "Larvas de Lucilia sericata digerem tecido necrótico",
              "Feridas crónicas com tecido desvitalizado extenso; resistência a outros métodos",
              "Aceitação limitada; disponibilidade restrita",
            ],
          },
        ],
      },
    ],
    keyConcepts: [
      {
        id: "deb-wound-bed-prep",
        title: "Desbridamento é preparação, não tratamento final",
        body: "O objetivo do desbridamento é tornar o leito clinicamente legível — remover o que obstrui a avaliação e a cicatrização. A cobertura definitiva vem depois, uma vez que o tecido dominante é identificado com clareza.",
      },
      {
        id: "deb-autolytic-moisture",
        title: "Autólise requer humidade — mas não excesso",
        body: "O desbridamento autolítico só funciona quando o leito está húmido o suficiente para ativar enzimas endógenas. Hidrogel em ferida exsudativa agrava a maceração sem acelerar a autólise. O equilíbrio de humidade é a chave.",
      },
    ],
    clinicalAlerts: [
      {
        id: "deb-ischemia-contraindication",
        severity: "critical" as const,
        title: "Não desbridar tecido isquémico sem avaliação vascular",
        body: "Em feridas arteriais ou mistas com necrose seca, o desbridamento pode precipitar uma lesão irreversível se a perfusão for insuficiente. Avaliar o índice tornozelo-braço (ITB) antes de qualquer abordagem agressiva.",
      },
      {
        id: "deb-collagenase-perilesional",
        severity: "warning" as const,
        title: "Proteger a pele perilesional ao usar colagenase",
        body: "A colagenase é enzima proteolítica não seletiva — pode macerar a pele sã ao redor da ferida. Aplicar sempre pasta de óxido de zinco ou barreira cutânea na pele perilesional antes de usar colagenase.",
      },
    ],
  },
  {
    id: "escolha-do-penso",
    pedagogicalDifficulty: "base",
    title: "Princípios de escolha do penso",
    definition:
      "A cobertura ideal resolve o problema dominante da ferida, mantém equilíbrio de humidade, protege a pele perilesional e minimiza o trauma na remoção.",
    indications: ["Qualquer decisão de cobertura primária ou secundária"],
    contraindications: [
      "Escolher por hábito ou disponibilidade sem avaliar o leito",
      "Usar o mesmo penso independentemente da evolução",
    ],
    warningSigns: [
      "Penso colado ao leito (leito demasiado seco)",
      "Exsudado a extravasar dos bordos do penso (absorção insuficiente)",
      "Deterioração do leito apesar do penso",
    ],
    commonMistakes: [
      {
        id: "penso-habit",
        title: "Escolher o penso por hábito ou protocolo fixo",
        explanation:
          "Um protocolo de ferida genérico ignora a variabilidade clínica. O penso certo é aquele que resolve o problema dominante desta ferida, neste momento — e muda quando o leito muda.",
      },
      {
        id: "penso-too-many",
        title: "Combinar materiais sem função aditiva",
        explanation:
          "Usar cobertura primária + secundária + adjuvante sem papel clínico definido aumenta o custo e o trauma de remoção sem melhorar o resultado. Cada material do plano deve resolver um problema específico.",
      },
    ],
    evidenceIds: ["foam-review", "hydrofiber-review", "alginate-review"],
    treatmentIds: ["aquacel", "biatain", "urgotul", "mepilex"],
    caseIds: ["1", "2", "3", "4", "5", "6"],
    relatedTopicIds: ["tecidos-e-leito", "gestao-exsudado", "protecao-perilesional"],
    tables: [
      {
        id: "penso-por-problema",
        title: "Cobertura por problema dominante",
        caption: "Guia rápido para alinhar a escolha do penso com o problema clínico identificado.",
        headers: ["Problema dominante", "Cobertura preferencial", "Evitar"],
        rows: [
          {
            cells: [
              "Exsudado abundante",
              "Alginate, hidrofiber, espuma de alta absorção",
              "Hidrogel, TLC-Ag sem camada absorvente",
            ],
          },
          {
            cells: [
              "Exsudado baixo / leito seco",
              "Hidrogel, TLC-Nosf, interface não aderente",
              "Alginate, espuma de alta absorção",
            ],
          },
          {
            cells: [
              "Infeção local (encoberta / evidente)",
              "Prata (hidrofiber, espuma, TLC-Ag), iodopovidona",
              "Coberturas oclusivas sem ação antimicrobiana",
            ],
          },
          {
            cells: [
              "Fibrina / tecido desvitalizado",
              "Colagenase (enzimático), hidrogel (autolítico), TLC-Nosf",
              "Alginate seco; espuma sem humidade ativa",
            ],
          },
          {
            cells: [
              "Granulação ativa / epitelização",
              "Interface atraumática (TLC, silicone), espuma suave",
              "Gaze seca; cobertura aderente",
            ],
          },
          {
            cells: [
              "Hipergranulação",
              "Espuma com compressão suave, nitrato de prata (se indicado)",
              "Coberturas que promovam humidade adicional",
            ],
          },
        ],
      },
    ],
    keyConcepts: [
      {
        id: "penso-primary-secondary",
        title: "Cobertura primária vs. secundária",
        body: "A cobertura primária contacta diretamente o leito (ex: TLC, alginate, hidrogel). A secundária cobre e fixa a primária (ex: espuma, compressa). Nem sempre são necessárias as duas — simplificar quando possível.",
      },
      {
        id: "penso-moisture-balance",
        title: "Equilíbrio de humidade — nem seco nem encharcado",
        body: "O leito ideal é húmido mas não macerado. Um penso que seca o leito impede a migração epitelial; um penso que encharque macera a pele perilesional. O objetivo é o equilíbrio, não a humidade máxima.",
      },
    ],
  },
  {
    id: "fixacao-e-remocao",
    pedagogicalDifficulty: "base",
    title: "Fixação e remoção atraumática do penso",
    definition:
      "A técnica de fixação e remoção influencia a dor, o trauma da pele perilesional e a eficácia da cobertura. A remoção atraumática é um objetivo clínico, não um luxo.",
    indications: [
      "Pele frágil (geriátrica, sob corticóides, edematosa)",
      "MARSI prévia",
      "Dor ao retirar penso referida pelo doente",
    ],
    contraindications: ["Remoção rápida ou seca sem humedecimento prévio em pele frágil"],
    warningSigns: [
      "Eritema no local do adesivo após remoção",
      "Flictenas ou erosões no contorno do penso",
      "Doente recusa mudança de penso por antecipação de dor",
    ],
    commonMistakes: [
      {
        id: "fixacao-tape-fragile",
        title: "Usar adesivo convencional em pele geriátrica ou frágil",
        explanation:
          "Fita adesiva convencional em pele frágil causa MARSI — a força de remoção supera a resistência da epiderme. Preferir fixações com silicone ou tubular elástico. Remover sempre com tração paralela à pele.",
      },
      {
        id: "fixacao-no-framework",
        title: "Não fixar o penso de forma segura",
        explanation:
          "Um penso mal fixo desloca-se, perde a função de barreira e aumenta o risco de contaminação. A fixação faz parte do plano de tratamento — não é um detalhe de enfermagem menor.",
      },
    ],
    evidenceIds: ["skin-barrier-review"],
    treatmentIds: ["protetor-spray"],
    caseIds: ["1", "2", "3", "4"],
    relatedTopicIds: ["protecao-perilesional", "escolha-do-penso", "concerns-do-utente"],
    keyConcepts: [
      {
        id: "remocao-traction",
        title: "Regra da tração paralela",
        body: "Ao remover qualquer penso ou adesivo, segurar a pele à frente e puxar o penso paralelo à superfície cutânea (ângulo de 0°), nunca perpendicular (90°). Esta técnica reduz drasticamente o trauma da epiderme.",
      },
      {
        id: "remocao-humedecer",
        title: "Humedecer antes de remover em penso aderido",
        body: "Se o penso estiver colado ao leito ou à pele perilesional, aplicar soro fisiológico ou água na interface durante 1-2 minutos antes de remover. Nunca arrancar — a dor e o trauma são iatrogénicos.",
      },
    ],
    clinicalAlerts: [
      {
        id: "marsi-risk",
        severity: "warning" as const,
        title: "MARSI — risco aumentado em pele frágil",
        body: "Doentes com > 70 anos, a tomar corticóides sistémicos, com edema crónico ou malnutrição têm risco muito elevado de MARSI. Documentar na avaliação inicial e planear fixação atraumática desde o primeiro penso.",
      },
    ],
  },
  {
    id: "biofilme",
    pedagogicalDifficulty: "intermedio",
    title: "Biofilme em feridas crónicas",
    definition:
      "Comunidade microbiana estruturada, aderente ao leito, protegida por matriz extracelular. Resiste a antimicrobianos tópicos isolados e é causa frequente de estagnação de feridas crónicas.",
    indications: [
      "Ferida crónica >4 semanas sem progressão",
      "Exsudado viscoso/gelatinoso recorrente",
      "Tecido friável que sangra facilmente",
      "Fibrina que reaparece após desbridamento",
    ],
    contraindications: [],
    warningSigns: [
      "Recidivas de infeção após cursos de antibiótico",
      "Ferida estagnada apesar de cuidado aparentemente adequado",
    ],
    commonMistakes: [
      {
        id: "prata-isolada-biofilme",
        title: "Usar prata como única estratégia contra biofilme",
        explanation:
          "O biofilme exige combinação: desbridamento mecânico/enzimático repetido + antisséptico de espectro amplo (octenidina, PHMB) + cobertura adequada. Prata isolada não é suficiente.",
        relatedTreatmentIds: ["aquacel-ag", "silvercel"],
      },
    ],
    evidenceIds: ["iwii-2022"],
    treatmentIds: ["octenilin-solucao", "colagenase", "aquacel-ag"],
    caseIds: ["5"],
    relatedTopicIds: ["antimicrobianos", "desbridamento"],
  },
  {
    id: "concerns-do-utente",
    pedagogicalDifficulty: "intermedio",
    title: "Preocupações centradas no utente",
    definition:
      "A componente Social/Patient-centered do TIMERS reconhece que a cicatrização depende de fatores humanos: dor, adesão ao tratamento, mobilidade, suporte social e recursos económicos.",
    indications: [
      "Avaliar dor sistematicamente com escala validada (EVA/NRS)",
      "Identificar barreiras à adesão (horários, custos, capacidade cognitiva)",
      "Envolver família/cuidadores quando a pessoa tem dependência",
    ],
    contraindications: [],
    warningSigns: [
      "Dor não controlada que impede o penso",
      "Faltas repetidas a consultas",
      "Isolamento social ou desnutrição",
    ],
    commonMistakes: [
      {
        id: "ignorar-dor",
        title: "Fazer penso sem avaliar dor",
        explanation:
          "A dor compromete adesão e cicatrização; avaliar e controlar antes de intervir. Dor ≥4/10 justifica analgesia prévia ao penso.",
      },
      {
        id: "mobilidade-ignorada",
        title: "Não avaliar impacto da ferida na mobilidade",
        explanation:
          "Em doentes com mobilidade comprometida (LPP, pé diabético), o alívio de pressão e a capacidade de autocuidado são determinantes para o prognóstico. Envolver cuidadores é parte do plano.",
      },
    ],
    evidenceIds: [],
    treatmentIds: [],
    caseIds: ["2", "3", "4", "5"],
    relatedTopicIds: ["decisao-clinica"],
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
    treatmentIds: ["cloreto-sodio", "octenilin-solucao", "betametasona"],
    caseIds: ["1", "2", "3", "4"],
    relatedTopicIds: ["tecidos-e-leito", "gestao-exsudado", "desbridamento"],
  },
  {
    id: "sinais-de-alarme",
    pedagogicalDifficulty: "intermedio",
    title: "Sinais de alarme e escalamento clínico",
    definition:
      "Reconhecer sinais sistémicos e locais que requerem escalamento imediato fora da competência do enfermeiro de cuidados gerais.",
    indications: [
      "Febre ≥ 38 °C associada a ferida",
      "Eritema progressivo > 2 cm",
      "Linfangite",
      "Deterioração aguda do estado geral",
    ],
    contraindications: ["Aguardar mais avaliações antes de escalar quando há sinais sistémicos"],
    warningSigns: [
      "Febre + ferida = escalar imediatamente",
      "Eritema que não regride após 24-48 h de antibiótico local",
      "Hipotensão + ferida infetada = sepsis até prova em contrário",
    ],
    commonMistakes: [
      {
        id: "alarm-delay",
        title: "Aguardar a próxima avaliação antes de escalar",
        explanation:
          "Na infeção em propagação e na infeção sistémica, horas contam. Escalar deve ser a primeira ação, não a última depois de tentar todas as coberturas.",
      },
      {
        id: "alarm-local-only",
        title: "Tratar infeção sistémica apenas com antimicrobiano local",
        explanation:
          "Sinais sistémicos (febre, sépsis) requerem antibiótico sistémico. Pensos com prata ou iodo não atingem concentrações sanguíneas eficazes — são complementares, não substitutos.",
      },
    ],
    evidenceIds: ["iwii-2022"],
    treatmentIds: [],
    caseIds: ["3", "5", "7"],
    relatedTopicIds: ["antimicrobianos", "biofilme", "concerns-do-utente"],
    tables: [
      {
        id: "continuum-infeccao",
        title: "Continuum de infeção (IWII 2022)",
        caption: "Da contaminação à infeção sistémica — cada nível tem sinais e resposta distintos.",
        headers: ["Nível", "Sinais chave", "Resposta clínica"],
        rows: [
          {
            cells: [
              "Contaminação",
              "Micro-organismos presentes, sem multiplicação, sem sinais",
              "Limpeza regular; vigiar",
            ],
          },
          {
            cells: [
              "Colonização",
              "Micro-organismos multiplicam-se, sem resposta do hospedeiro",
              "Otimizar limpeza; não usar antimicrobianos",
            ],
          },
          {
            cells: [
              "Infeção local encoberta",
              "Granulação friável, odor, atraso na cicatrização",
              "Antimicrobiano tópico (prata, iodo); reavaliar em 2 semanas",
            ],
          },
          {
            cells: [
              "Infeção local evidente",
              "Eritema, dor, calor, exsudado purulento",
              "Antimicrobiano tópico; considerar antibiótico sistémico; referência médica",
            ],
          },
          {
            cells: [
              "Infeção em propagação",
              "Eritema > 2 cm, linfangite, febre",
              "Escalar imediatamente; antibiótico sistémico urgente",
            ],
          },
          {
            cells: [
              "Infeção sistémica",
              "Sépsis, hipotensão, febre alta",
              "Emergência médica — transferência hospitalar",
            ],
          },
        ],
      },
    ],
    clinicalAlerts: [
      {
        id: "sepsis-alert",
        severity: "critical" as const,
        title: "Sépsis associada a ferida — emergência médica",
        body: "Febre > 38,5 °C, taquicardia > 100 bpm e ferida com sinais de infeção = critérios de sépsis até prova em contrário. Escalar imediatamente. Não aguardar próxima avaliação.",
      },
      {
        id: "spreading-alert",
        severity: "warning" as const,
        title: "Eritema progressivo — reavaliar em 24 horas",
        body: "Eritema que ultrapassa os bordos da ferida ou não regride com antimicrobiano local em 24-48 h deve levar a referência médica urgente para avaliação de antibioterapia sistémica.",
      },
    ],
  },
];
