import type { TemaAprendizagem } from "../../lib/clinical/types.ts";

export const learningTopics: TemaAprendizagem[] = [
  {
    id: "tecidos-e-leito",
    dificuldade: "base",
    titulo: "Leito da ferida e identificação de tecidos",
    definition:
      "Distinguir granulação, fibrina e tecido desvitalizado para definir o objetivo terapêutico dominante.",
    indicacoes: ["Observação inicial", "Mudança de evolução", "Dúvida sobre desbridamento"],
    avisos_contraindicacao: ["Decidir sem olhar para o tecido dominante"],
    sinais_alerta: ["Fibrina aderente", "Leito estagnado", "Tecido frágil", "Odor com tecido desvitalizado"],
    erros_comuns: [
      {
        id: "tissue-generic",
        titulo: "Descrever o leito de forma vaga",
        explicacao:
          "Sem identificar o tecido dominante, o plano tende a ser menos focado e mais redundante. \"Ferida com mau aspeto\" não orienta a decisão clínica — granulação, fibrina e necrose exigem respostas diferentes.",
      },
      {
        id: "tissue-same-material",
        titulo: "Usar a mesma cobertura independentemente do tecido",
        explicacao:
          "Escolher o mesmo material para um leito em granulação ativa e para um leito com fibrina ou necrose ignora o estado do tecido. A cobertura ideal varia com o que o leito apresenta.",
      },
      {
        id: "tissue-granulation-vs-epithelization",
        titulo: "Confundir granulação frágil com epitelização",
        explicacao:
          "Granulação ativa pode ter um aspeto rosado semelhante ao tecido em epitelização, mas ainda necessita de proteção e humidade adequada. Tratar como epitelização antecipa uma fase que ainda não foi atingida.",
        idsTratamentoRelacionado: ["urgotul"],
      },
      {
        id: "hipergran-causa",
        titulo: "Tratar hipergranulação sem identificar causa",
        explicacao:
          "Hipergranulação é frequentemente iatrogénica — oclusão excessiva, prata prolongada (>2 semanas), atrito. Reduzir o tecido sem remover a causa leva a recorrência. Rever cobertura e duração do tratamento antes de recorrer a cauterização.",
        idsTratamentoRelacionado: ["aquacel-ag", "silvercel", "betametasona"],
      },
    ],
    idsEvidencia: ["debridement-review"],
    idsTratamento: ["colagenase", "hidrogel", "urgotul"],
    idsCaso: ["1", "2", "3", "4"],
    idsTopicoRelacionado: ["desbridamento", "decisao-clinica"],
    tabelas: [
      {
        id: "tipos-tecido",
        titulo: "Tipos de tecido no leito da ferida",
        descricao:
          "O leito da ferida é avaliado em percentagem de cada tipo de tecido. O objetivo clínico é maximizar granulação e epitelização.",
        cabecalhos: ["Tecido", "Aspeto", "Significado", "Ação clínica"],
        linhas: [
          {
            celulas: [
              "Granulação",
              "Vermelho, rugoso, húmido, bem vascularizado",
              "Cicatrização ativa e favorável",
              "Manter ambiente húmido; não traumatizar na mudança",
            ],
          },
          {
            celulas: [
              "Fibrina / esfacelo",
              "Amarelo, mole, húmido, pode ter odor",
              "Tecido desvitalizado — impede cicatrização",
              "Desbridamento autolítico (hidrogel) ou enzimático (colagenase)",
            ],
          },
          {
            celulas: [
              "Necrose seca",
              "Preta/castanha, dura, desidratada",
              "Tecido morto — barreira mecânica",
              "Hidratação prévia + desbridamento enzimático ou sharp",
            ],
          },
          {
            celulas: [
              "Necrose húmida",
              "Mole, escura, odor fétido",
              "Risco elevado de infeção grave",
              "Desbridamento urgente + avaliação médica imediata",
            ],
          },
          {
            celulas: [
              "Epitelização",
              "Rosa pálido, brilhante, avança das bordas",
              "Fecho da ferida em curso",
              "Proteger; não traumatizar; manter húmido sem macerar",
            ],
          },
          {
            celulas: [
              "Hipergranulação",
              "Tecido acima do nível da pele, vermelho, friável",
              "Impede a epitelização",
              "Nitrato de prata (lápis), corticoide tópico ou pressão local",
            ],
          },
        ],
      },
    ],
    conceitosChave: [
      {
        id: "tecido-define-plano",
        titulo: "O tecido define o plano",
        corpo: "O tipo de tecido determina o método de desbridamento e o penso a utilizar. Avaliar e registar em percentagem em cada observação.",
      },
    ],
  },
  {
    id: "bordos-da-ferida",
    dificuldade: "base",
    titulo: "Bordos da ferida",
    definition:
      "Os bordos fornecem informação sobre a dinâmica de cicatrização: epitelização ativa, estagnação, maceração ou causa subjacente não controlada.",
    indicacoes: ["Avaliação inicial", "Monitorização da progressão", "Suspeita de neoplasia ou vasculite"],
    avisos_contraindicacao: ["Decidir o plano sem observar os bordos"],
    sinais_alerta: [
      "Bordos enrolados (rolled/epibole)",
      "Bordos fixos e pallidos",
      "Bordos irregulares de aparecimento rápido",
    ],
    erros_comuns: [
      {
        id: "bordos-ignore",
        titulo: "Não registar os bordos na avaliação inicial",
        explicacao:
          "Documentar apenas o leito sem os bordos perde dados sobre cicatrização. Bordos enrolados (epibole) indicam estagnação e podem requerer desbridamento mecânico ou estimulação física.",
      },
      {
        id: "bordos-macerated-vs-epibole",
        titulo: "Confundir bordos macerados com epibole",
        explicacao:
          "Bordos esbranquiçados por maceração (húmidos, amolecidos) diferem dos bordos enrolados por estagnação. A causa é diferente — a primeira é humidade excessiva, a segunda é falha de migração epitelial — e a resposta clínica também.",
      },
    ],
    idsEvidencia: ["debridement-review"],
    idsTratamento: [],
    idsCaso: ["1", "2", "3", "4"],
    idsTopicoRelacionado: ["tecidos-e-leito", "desbridamento"],
    tabelas: [
      {
        id: "tipos-bordos",
        titulo: "Tipos de bordos e interpretação clínica",
        descricao: "O aspeto dos bordos orienta a suspeita diagnóstica e o foco terapêutico.",
        cabecalhos: ["Tipo de bordo", "Aspeto", "Significado clínico", "Ação"],
        linhas: [
          {
            celulas: [
              "Em epitelização",
              "Fino, translúcido, avançando sobre o leito",
              "Cicatrização ativa — bom sinal",
              "Manter humidade; não interferir",
            ],
          },
          {
            celulas: [
              "Regulares / definidos",
              "Nítidos, planos, sem descolamento",
              "Ferida estável, sem progressão positiva ou negativa",
              "Avaliar se há bloqueio à cicatrização",
            ],
          },
          {
            celulas: [
              "Macerados",
              "Esbranquiçados, amolecidos, húmidos",
              "Exsudado excessivo ou penso inadequado",
              "Aumentar absorção; aplicar barreira perilesional",
            ],
          },
          {
            celulas: [
              "Enrolados (epibole)",
              "Bordos dobrados sobre si, espessados",
              "Estagnação da migração epitelial (ferida crónica)",
              "Desbridamento mecânico dos bordos; reavaliar causa",
            ],
          },
          {
            celulas: [
              "Indefinidos / irregulares",
              "Limites imprecisos, eritema perilesional",
              "Infeção local, vasculite, neoplasia",
              "Não progredir sem diagnóstico; referência médica se suspeita de neoplasia",
            ],
          },
        ],
      },
    ],
    conceitosChave: [
      {
        id: "bordos-mirror",
        titulo: "Os bordos espelham o que acontece no leito",
        corpo: "Um leito em granulação ativa com bordos parados ou enrolados indica que a cicatrização está bloqueada apesar de aparência positiva. Os bordos devem avançar acompanhando o leito — quando não avançam, há um problema por identificar.",
      },
    ],
  },
  {
    id: "gestao-exsudado",
    dificuldade: "base",
    titulo: "Gestão do exsudado",
    definition:
      "Controlar a humidade, proteger a pele adjacente e escolher um material absorvente proporcional ao exsudado.",
    indicacoes: [
      "Exsudado moderado ou abundante",
      "Maceração peri-ferida",
      "Necessidade de manter um plano simples e focado",
    ],
    avisos_contraindicacao: [
      "Feridas secas em que a prioridade é hidratar",
      "Sobrepor vários absorventes sem benefício clínico claro",
    ],
    sinais_alerta: ["Extravasamento", "Maceração", "Odor associado a humidade persistente"],
    erros_comuns: [
      {
        id: "exs-hydrogel",
        titulo: "Hidrogel em ferida muito exsudativa",
        explicacao:
          "Aumenta a humidade num contexto em que a prioridade clínica é absorver e proteger a periferia. Reservar o hidrogel para feridas secas ou com exsudado leve.",
        idsTratamentoRelacionado: ["hidrogel"],
      },
      {
        id: "exs-high-absorb-low-exudate",
        titulo: "Absorvente de alta capacidade em ferida com exsudado baixo",
        explicacao:
          "Usar vliwasorb ou aquacel num leito com exsudado leve pode provocar dessecação do tecido de granulação. A capacidade absorvente deve ser proporcional ao volume real de exsudado.",
        idsTratamentoRelacionado: ["vliwasorb"],
      },
      {
        id: "exs-no-periwound",
        titulo: "Controlar o exsudado sem proteger a pele peri-ferida",
        explicacao:
          "Gerir a humidade com uma cobertura absorvente não elimina o risco de maceração se o exsudado que extravasa pelo bordo atingir a pele adjacente. A proteção perilesional é parte do plano de gestão do exsudado.",
        idsTratamentoRelacionado: ["oxido-zinco", "protetor-spray"],
      },
    ],
    idsEvidencia: ["hydrofiber-review", "alginate-review", "foam-review"],
    idsTratamento: ["aquacel", "fibrosol", "vliwasorb", "silvercel", "aquacel-ag", "allevyn"],
    idsCaso: ["1", "2", "3", "4"],
    idsTopicoRelacionado: ["protecao-perilesional", "decisao-clinica"],
    tabelas: [
      {
        id: "tipos-exsudado",
        titulo: "Tipos e significado clínico do exsudado",
        descricao:
          "O exsudado é avaliado em quantidade, consistência e odor — indicador fundamental para a escolha do penso e deteção de infeção.",
        cabecalhos: ["Parâmetro", "Aspeto", "Significado clínico"],
        linhas: [
          {
            celulas: [
              "Seroso",
              "Claro, aquoso, transparente",
              "Normal. Fase inflamatória precoce ou ferida limpa em granulação.",
            ],
          },
          {
            celulas: [
              "Serossanguinolento",
              "Rosado, levemente turvo",
              "Normal em feridas recentes, após desbridamento ou trauma mecânico.",
            ],
          },
          {
            celulas: [
              "Sanguinolento",
              "Vermelho, sangue vivo ou escuro",
              "Traumatismo recente, fragilidade vascular, anticoagulação.",
            ],
          },
          {
            celulas: [
              "Purulento",
              "Espesso, opaco, amarelo/verde/acastanhado",
              "Infeção estabelecida. Ação clínica imediata. Avaliar antibioterapia.",
            ],
          },
          {
            celulas: [
              "Odor fétido",
              "Cheiro intenso, desagradável",
              "Infeção ou necrose. Considerar carvão ativado ou mel médico.",
            ],
          },
        ],
      },
      {
        id: "absorcao-por-nivel",
        titulo: "Escolha do penso por nível de exsudado",
        descricao:
          "A capacidade de absorção deve ser proporcional ao volume real — nem sub nem sobredimensionada.",
        cabecalhos: ["Nível", "Objetivo", "Materiais de eleição"],
        linhas: [
          {
            celulas: [
              "Escasso",
              "Reter humidade; evitar ressecamento",
              "Hidrogel · Hidrocoloide · Urgotul · Vaselina gaze",
            ],
          },
          {
            celulas: [
              "Moderado",
              "Absorção controlada; ambiente húmido sem excesso",
              "Allevyn · Aquacel · Varihesive · Urgo Clean",
            ],
          },
          {
            celulas: [
              "Abundante",
              "Alta absorção; prevenir maceração",
              "Vliwasorb · Exufiber · Alginato de cálcio · Silvercel",
            ],
          },
          {
            celulas: [
              "Peri-lesional",
              "Barreira contra exsudado e maceração",
              "Spray protetor acrílico · Óxido de zinco · ATL",
            ],
          },
        ],
      },
    ],
    conceitosChave: [
      {
        id: "regra-saturacao",
        titulo: "Regra prática de saturação",
        corpo: "Se o penso satura antes do prazo previsto — subir para maior absorção. Se a ferida macera — descer a absorção ou aumentar o intervalo de mudança.",
      },
    ],
    alertas: [
      {
        id: "purulento-sistemico",
        gravidade: "critico",
        titulo: "Exsudado purulento + odor + febre + taquicardia",
        corpo: "Suspeita de infeção sistémica. Escalar imediatamente para avaliação médica.",
      },
    ],
  },
  {
    id: "antimicrobianos",
    dificuldade: "intermedio",
    titulo: "Controlo da infeção local",
    definition:
      "Selecionar soluções de antissépsia e materiais antimicrobianos de forma coerente com os sinais locais e com o objetivo clínico do caso.",
    indicacoes: [
      "Odor",
      "Dor agravada",
      "Aumento de exsudado",
      "Tecido desvitalizado com suspeita de colonização crítica",
    ],
    avisos_contraindicacao: ["Uso rotineiro sem reavaliação do caso", "Manter prata ou iodo sem revisão clínica"],
    sinais_alerta: ["Odor persistente", "Agravamento da dor", "Aumento do exsudado", "Febre"],
    erros_comuns: [
      {
        id: "anti-routine",
        titulo: "Antimicrobianos sem reavaliação",
        explicacao:
          "A antissépsia e os pensos com prata não devem substituir a leitura clínica do caso nem o controlo do problema dominante. Usar prata de forma sistemática sem sinais de infeção é um erro de raciocínio.",
        idsTratamentoRelacionado: ["silvercel", "aquacel-ag", "betadine-solucao"],
      },
      {
        id: "anti-double-silver",
        titulo: "Dois materiais com prata no mesmo plano",
        explicacao:
          "Associar Silvercel® e Aquacel Ag® em simultâneo é redundante — a concentração de prata duplicada não aumenta a eficácia antimicrobiana e reduz o foco terapêutico sem benefício clínico demonstrado.",
        idsTratamentoRelacionado: ["silvercel", "aquacel-ag"],
      },
      {
        id: "anti-odor-vs-infection",
        titulo: "Confundir odor com infeção sistémica",
        explicacao:
          "Odor isolado não confirma infeção — pode ter origem em colonização, exsudado em decomposição ou tecido necrótico. O plano antimicrobiano deve basear-se no conjunto de sinais locais, e não apenas no odor.",
        idsTratamentoRelacionado: ["actisorb-silver"],
      },
    ],
    idsEvidencia: ["silver-consensus", "antiseptic-review-2022", "aptferidas-infecao-2025"],
    idsTratamento: ["silvercel", "aquacel-ag", "betadine-solucao", "actisorb-silver"],
    idsCaso: ["2", "3"],
    idsTopicoRelacionado: ["gestao-exsudado", "decisao-clinica"],
    tabelas: [
      {
        id: "abordagem-por-nivel",
        titulo: "Abordagem à infeção por nível",
        descricao:
          "Antissépticos NÃO são usados de forma rotineira em feridas em cicatrização — são citotóxicos para o tecido de granulação.",
        cabecalhos: ["Nível", "Características", "Abordagem", "Materiais"],
        linhas: [
          {
            celulas: [
              "Contaminação",
              "Microrganismos presentes, sem proliferação",
              "Limpeza com soro. Sem antisséptico.",
              "Soro fisiológico 0,9%",
            ],
          },
          {
            celulas: [
              "Colonização",
              "Microrganismos presentes sem resposta do hospedeiro",
              "Limpeza + penso antimicrobiano se estagnação",
              "Aquacel Ag · Urgotul Ag · Mel médico",
            ],
          },
          {
            celulas: [
              "Biofilme",
              "Comunidade bacteriana protegida por matriz",
              "Desbridamento mecânico + antisséptico tópico + penso antimicrobiano",
              "Octenilin · Mel médico · Cadexómero de iodo",
            ],
          },
          {
            celulas: [
              "Infeção local",
              "Calor, rubor, dor, pus",
              "Antisséptico tópico + penso antimicrobiano. Avaliar antibiótico oral.",
              "Betadine · Octiset · Silvercel · Aquacel Ag",
            ],
          },
          {
            celulas: [
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
        titulo: "Sinais subtis em feridas crónicas",
        descricao:
          "Em feridas crónicas ou em imunossuprimidos, os sinais clássicos podem estar ausentes. Manter alto índice de suspeição.",
        cabecalhos: ["Sinal subtil", "Implicação clínica"],
        linhas: [
          {
            celulas: [
              "Aumento inexplicado da dor",
              "Pode preceder outros sinais. Investigar sempre.",
            ],
          },
          {
            celulas: [
              "Granulação friável que sangra com facilidade",
              "Tecido de má qualidade por carga bacteriana elevada.",
            ],
          },
          {
            celulas: [
              "Odor sem exsudado purulento visível",
              "Biofilme ou anaerobiose. Antisséptico tópico + desbridamento.",
            ],
          },
          {
            celulas: [
              "Estagnação da cicatrização",
              "Sem evolução após 2–4 semanas. Suspeita de infeção crónica.",
            ],
          },
          {
            celulas: [
              "Aumento súbito do exsudado",
              "Sem causa aparente. Avaliar colonização crítica ou infeção.",
            ],
          },
        ],
      },
    ],
    conceitosChave: [
      {
        id: "octenidina-biocompativel",
        titulo: "Octenidina como antisséptico de eleição",
        corpo: "A octenidina (Octiset, Octenilin) é um dos antissépticos mais biocompatíveis: segura em feridas abertas, sem coloração e sem interferência com cultura microbiológica. Preferir ao betadine em feridas em cicatrização.",
      },
    ],
    alertas: [
      {
        id: "sepsis",
        gravidade: "critico",
        titulo: "Sinais sistémicos — possível sépsis",
        corpo: "Febre · taquicardia · hipotensão · alteração do estado de consciência. Contacto médico imediato. Não aguardar.",
      },
      {
        id: "diabetico-imunossuprimido",
        gravidade: "aviso",
        titulo: "Doente diabético, imunossuprimido ou com isquemia",
        corpo: "Os sinais inflamatórios podem estar muito atenuados. Manter alto índice de suspeição mesmo sem sinais clássicos.",
      },
    ],
  },
  {
    id: "protecao-perilesional",
    dificuldade: "base",
    titulo: "Proteção da pele peri-ferida",
    definition:
      "Proteger a pele adjacente para evitar maceração, dermatite por exsudado e trauma relacionado com o penso.",
    indicacoes: ["Maceração", "Pele frágil", "Risco de adesivo", "Exsudado persistente"],
    avisos_contraindicacao: ["Aplicação excessiva que comprometa a adesão sem necessidade"],
    sinais_alerta: ["Eritema", "Maceração", "Descamação", "Dor ao retirar o penso"],
    erros_comuns: [
      {
        id: "peri-without-exudate",
        titulo: "Aplicar barreira sem rever o exsudado",
        explicacao:
          "A proteção peri-ferida é mais eficaz quando acompanha o controlo da humidade. Uma barreira sem cobertura absorvente adequada não evita a maceração se o exsudado continuar a extravazar.",
        idsTratamentoRelacionado: ["oxido-zinco", "protetor-spray"],
      },
      {
        id: "peri-omit-maceration",
        titulo: "Omitir proteção perilesional em pele macerada",
        explicacao:
          "Quando a pele adjacente está já macerada, não incluir um protetor cutâneo no plano prolonga o dano e aumenta o risco de dermatite por exsudado, mesmo que a cobertura principal seja adequada.",
        idsTratamentoRelacionado: ["oxido-zinco", "protetor-spray"],
      },
      {
        id: "peri-betamethasone",
        titulo: "Usar betametasona como protetor peri-ferida",
        explicacao:
          "Corticosteroides tópicos como a betametasona não têm função protetora na pele perilesional. O seu uso pode mascarar sinais de infeção e fragilizar ainda mais a pele adjacente.",
        idsTratamentoRelacionado: ["betametasona"],
      },
    ],
    idsEvidencia: ["skin-barrier-review"],
    idsTratamento: ["oxido-zinco", "protetor-spray"],
    idsCaso: ["1", "2", "3", "4"],
    idsTopicoRelacionado: ["gestao-exsudado", "decisao-clinica"],
    tabelas: [
      {
        id: "alteracoes-peri-lesionais",
        titulo: "Alterações da pele peri-lesional",
        descricao:
          "A pele à volta da ferida é um indicador clínico rico. Cada alteração tem uma causa provável e uma resposta terapêutica distinta.",
        cabecalhos: ["Alteração", "Aspeto", "Causa provável", "Ação clínica"],
        linhas: [
          {
            celulas: [
              "Maceração",
              "Pele esbranquiçada, amolecida, com aspeto encharcado",
              "Exsudado excessivo ou penso pouco absorvente",
              "Trocar para cobertura mais absorvente; aplicar barreira cutânea (óxido de zinco ou spray protetor)",
            ],
          },
          {
            celulas: [
              "Eritema / rubor",
              "Vermelhidão, com ou sem calor local",
              "Reação alérgica ao adesivo, pressão ou início de infeção",
              "Identificar causa; considerar penso hipoalergénico; rever etiologia da ferida",
            ],
          },
          {
            celulas: [
              "Edema perilesional",
              "Pele tensa, brilhante, sinal de godet positivo",
              "Insuficiência venosa, linfedema, infeção local",
              "Elevar o membro; considerar terapia compressiva se indicada; avaliar sinais de infeção",
            ],
          },
          {
            celulas: [
              "Hiperqueratose",
              "Pele espessada, esbranquiçada, descamativa",
              "Pressão crónica, exsudado persistente, calçado inadequado",
              "Desbridamento da hiperqueratose se necessário; controlo da causa mecânica",
            ],
          },
          {
            celulas: [
              "Pele seca / descamação",
              "Pele fina, rugosa, com descamação fina",
              "Idade avançada, desidratação, insuficiência venosa crónica",
              "Aplicar emoliente não comedogénico; rever hidratação sistémica",
            ],
          },
          {
            celulas: [
              "Lesão por adesivo (MARSI)",
              "Erosão, flictena ou eritema no local do adesivo",
              "Remoção traumática, sensibilidade cutânea, penso inadequado",
              "Usar técnica de remoção atraumática; mudar para penso sem adesivo agressivo; aplicar spray protetor",
            ],
          },
        ],
      },
    ],
    conceitosChave: [
      {
        id: "peri-barrier-first",
        titulo: "A barreira peri-lesional não substitui o controlo do exsudado",
        corpo: "Aplicar óxido de zinco ou spray protetor sem rever a cobertura absorvente é tratar o sintoma e não a causa. O objetivo é reduzir o exsudado que chega à pele — a barreira é sempre complementar.",
      },
      {
        id: "marsi-prevention",
        titulo: "MARSI — a lesão que ninguém documenta",
        corpo: "A lesão relacionada com adesivos médicos (MARSI) é subnotificada. Remoção rápida, pele húmida e pele geriátrica frágil são os principais fatores de risco. Sempre remover o penso com tração paralela à pele, nunca perpendicular.",
      },
    ],
  },
  {
    id: "desbridamento",
    dificuldade: "intermedio",
    titulo: "Desbridamento e preparação do leito",
    definition:
      "Remover ou mobilizar tecido desvitalizado para que a cobertura atue sobre um leito preparado e clinicamente legível.",
    indicacoes: ["Fibrina aderente", "Tecido desvitalizado", "Ferida estagnada"],
    avisos_contraindicacao: ["Leito limpo em granulação ativa", "Abordagem agressiva sem contexto clínico"],
    sinais_alerta: ["Fibrina persistente", "Odor com tecido desvitalizado", "Falta de progressão"],
    erros_comuns: [
      {
        id: "deb-absorb-only",
        titulo: "Cobertura absorvente sem preparar o leito",
        explicacao:
          "Controlar o exsudado sem abordar tecido desvitalizado pode deixar o problema dominante por resolver. Fibrina aderente não desaparece apenas com absorção — precisa de ser abordada diretamente.",
        idsTratamentoRelacionado: ["aquacel", "vliwasorb"],
      },
      {
        id: "deb-hydrogel-wet",
        titulo: "Hidrogel em ferida com exsudado abundante",
        explicacao:
          "O desbridamento autolítico com hidrogel é indicado em leitos secos ou com exsudado leve. Em feridas muito exsudativas, o hidrogel agrava o excesso de humidade e não resolve o tecido desvitalizado.",
        idsTratamentoRelacionado: ["hidrogel"],
      },
      {
        id: "deb-without-tissue-id",
        titulo: "Iniciar desbridamento sem identificar o tecido dominante",
        explicacao:
          "Aplicar colagenase ou outro agente sem confirmar a presença de fibrina ou necrose pode sobretratamento em leitos já em granulação ativa, atrasando a epitelização.",
        idsTratamentoRelacionado: ["colagenase"],
      },
    ],
    idsEvidencia: ["debridement-review", "collagenase-review"],
    idsTratamento: ["colagenase", "hidrogel"],
    idsCaso: ["1", "2", "3", "4"],
    idsTopicoRelacionado: ["tecidos-e-leito", "decisao-clinica"],
    tabelas: [
      {
        id: "metodos-desbridamento",
        titulo: "Métodos de desbridamento",
        descricao:
          "A escolha do método depende do tipo e extensão do tecido desvitalizado, da perfusão local e dos recursos disponíveis.",
        cabecalhos: ["Método", "Mecanismo", "Indicação principal", "Limitação"],
        linhas: [
          {
            celulas: [
              "Autolítico",
              "Humidade mantida activa as enzimas endógenas do leito",
              "Fibrina leve a moderada; doente cooperante; ambulatório",
              "Lento (dias a semanas); ineficaz em necrose extensa",
            ],
          },
          {
            celulas: [
              "Enzimático",
              "Colagenase cliva fibras de colagénio desnaturado",
              "Fibrina aderente moderada; quando o desbridamento cirúrgico não é viável",
              "Requer prescrição; pode causar irritação perilesional",
            ],
          },
          {
            celulas: [
              "Mecânico (irrigação)",
              "Força física remove detritos e exsudado",
              "Limpeza de cavidades; feridas com fibrina lassa",
              "Pode traumatizar tecido de granulação; não desbridante para fibrina aderente",
            ],
          },
          {
            celulas: [
              "Cirúrgico / sharp",
              "Bisturi ou tesoura remove tecido macroscopicamente",
              "Necrose extensa; urgência clínica; ferida com biofilme",
              "Requer competência especializada; risco hemorrágico",
            ],
          },
          {
            celulas: [
              "Biológico (larvas)",
              "Larvas de Lucilia sericata digerem tecido necrótico",
              "Feridas crónicas com tecido desvitalizado extenso; resistência a outros métodos",
              "Aceitação limitada; disponibilidade restrita",
            ],
          },
        ],
      },
    ],
    conceitosChave: [
      {
        id: "deb-wound-bed-prep",
        titulo: "Desbridamento é preparação, não tratamento final",
        corpo: "O objetivo do desbridamento é tornar o leito clinicamente legível — remover o que obstrui a avaliação e a cicatrização. A cobertura definitiva vem depois, uma vez que o tecido dominante é identificado com clareza.",
      },
      {
        id: "deb-autolytic-moisture",
        titulo: "Autólise requer humidade — mas não excesso",
        corpo: "O desbridamento autolítico só funciona quando o leito está húmido o suficiente para ativar enzimas endógenas. Hidrogel em ferida exsudativa agrava a maceração sem acelerar a autólise. O equilíbrio de humidade é a chave.",
      },
    ],
    alertas: [
      {
        id: "deb-ischemia-contraindication",
        gravidade: "critico" as const,
        titulo: "Não desbridar tecido isquémico sem avaliação vascular",
        corpo: "Em feridas arteriais ou mistas com necrose seca, o desbridamento pode precipitar uma lesão irreversível se a perfusão for insuficiente. Avaliar o índice tornozelo-braço (ITB) antes de qualquer abordagem agressiva.",
      },
      {
        id: "deb-collagenase-perilesional",
        gravidade: "aviso" as const,
        titulo: "Proteger a pele perilesional ao usar colagenase",
        corpo: "A colagenase é enzima proteolítica não seletiva — pode macerar a pele sã ao redor da ferida. Aplicar sempre pasta de óxido de zinco ou barreira cutânea na pele perilesional antes de usar colagenase.",
      },
    ],
  },
  {
    id: "escolha-do-penso",
    dificuldade: "base",
    titulo: "Princípios de escolha do penso",
    definition:
      "A cobertura ideal resolve o problema dominante da ferida, mantém equilíbrio de humidade, protege a pele perilesional e minimiza o trauma na remoção.",
    indicacoes: ["Qualquer decisão de cobertura primária ou secundária"],
    avisos_contraindicacao: [
      "Escolher por hábito ou disponibilidade sem avaliar o leito",
      "Usar o mesmo penso independentemente da evolução",
    ],
    sinais_alerta: [
      "Penso colado ao leito (leito demasiado seco)",
      "Exsudado a extravasar dos bordos do penso (absorção insuficiente)",
      "Deterioração do leito apesar do penso",
    ],
    erros_comuns: [
      {
        id: "penso-habit",
        titulo: "Escolher o penso por hábito ou protocolo fixo",
        explicacao:
          "Um protocolo de ferida genérico ignora a variabilidade clínica. O penso certo é aquele que resolve o problema dominante desta ferida, neste momento — e muda quando o leito muda.",
      },
      {
        id: "penso-too-many",
        titulo: "Combinar materiais sem função aditiva",
        explicacao:
          "Usar cobertura primária + secundária + adjuvante sem papel clínico definido aumenta o custo e o trauma de remoção sem melhorar o resultado. Cada material do plano deve resolver um problema específico.",
      },
    ],
    idsEvidencia: ["foam-review", "hydrofiber-review", "alginate-review"],
    idsTratamento: ["aquacel", "biatain", "urgotul", "mepilex"],
    idsCaso: ["1", "2", "3", "4", "5", "6"],
    idsTopicoRelacionado: ["tecidos-e-leito", "gestao-exsudado", "protecao-perilesional"],
    tabelas: [
      {
        id: "penso-por-problema",
        titulo: "Cobertura por problema dominante",
        descricao: "Guia rápido para alinhar a escolha do penso com o problema clínico identificado.",
        cabecalhos: ["Problema dominante", "Cobertura preferencial", "Evitar"],
        linhas: [
          {
            celulas: [
              "Exsudado abundante",
              "Alginate, hidrofiber, espuma de alta absorção",
              "Hidrogel, TLC-Ag sem camada absorvente",
            ],
          },
          {
            celulas: [
              "Exsudado baixo / leito seco",
              "Hidrogel, TLC-Nosf, interface não aderente",
              "Alginate, espuma de alta absorção",
            ],
          },
          {
            celulas: [
              "Infeção local (encoberta / evidente)",
              "Prata (hidrofiber, espuma, TLC-Ag), iodopovidona",
              "Coberturas oclusivas sem ação antimicrobiana",
            ],
          },
          {
            celulas: [
              "Fibrina / tecido desvitalizado",
              "Colagenase (enzimático), hidrogel (autolítico), TLC-Nosf",
              "Alginate seco; espuma sem humidade ativa",
            ],
          },
          {
            celulas: [
              "Granulação ativa / epitelização",
              "Interface atraumática (TLC, silicone), espuma suave",
              "Gaze seca; cobertura aderente",
            ],
          },
          {
            celulas: [
              "Hipergranulação",
              "Espuma com compressão suave, nitrato de prata (se indicado)",
              "Coberturas que promovam humidade adicional",
            ],
          },
        ],
      },
    ],
    conceitosChave: [
      {
        id: "penso-primary-secondary",
        titulo: "Cobertura primária vs. secundária",
        corpo: "A cobertura primária contacta diretamente o leito (ex: TLC, alginate, hidrogel). A secundária cobre e fixa a primária (ex: espuma, compressa). Nem sempre são necessárias as duas — simplificar quando possível.",
      },
      {
        id: "penso-moisture-balance",
        titulo: "Equilíbrio de humidade — nem seco nem encharcado",
        corpo: "O leito ideal é húmido mas não macerado. Um penso que seca o leito impede a migração epitelial; um penso que encharque macera a pele perilesional. O objetivo é o equilíbrio, não a humidade máxima.",
      },
    ],
  },
  {
    id: "fixacao-e-remocao",
    dificuldade: "base",
    titulo: "Fixação e remoção atraumática do penso",
    definition:
      "A técnica de fixação e remoção influencia a dor, o trauma da pele perilesional e a eficácia da cobertura. A remoção atraumática é um objetivo clínico, não um luxo.",
    indicacoes: [
      "Pele frágil (geriátrica, sob corticóides, edematosa)",
      "MARSI prévia",
      "Dor ao retirar penso referida pelo doente",
    ],
    avisos_contraindicacao: ["Remoção rápida ou seca sem humedecimento prévio em pele frágil"],
    sinais_alerta: [
      "Eritema no local do adesivo após remoção",
      "Flictenas ou erosões no contorno do penso",
      "Doente recusa mudança de penso por antecipação de dor",
    ],
    erros_comuns: [
      {
        id: "fixacao-tape-fragile",
        titulo: "Usar adesivo convencional em pele geriátrica ou frágil",
        explicacao:
          "Fita adesiva convencional em pele frágil causa MARSI — a força de remoção supera a resistência da epiderme. Preferir fixações com silicone ou tubular elástico. Remover sempre com tração paralela à pele.",
      },
      {
        id: "fixacao-no-framework",
        titulo: "Não fixar o penso de forma segura",
        explicacao:
          "Um penso mal fixo desloca-se, perde a função de barreira e aumenta o risco de contaminação. A fixação faz parte do plano de tratamento — não é um detalhe de enfermagem menor.",
      },
    ],
    idsEvidencia: ["skin-barrier-review"],
    idsTratamento: ["protetor-spray"],
    idsCaso: ["1", "2", "3", "4"],
    idsTopicoRelacionado: ["protecao-perilesional", "escolha-do-penso", "concerns-do-utente"],
    conceitosChave: [
      {
        id: "remocao-traction",
        titulo: "Regra da tração paralela",
        corpo: "Ao remover qualquer penso ou adesivo, segurar a pele à frente e puxar o penso paralelo à superfície cutânea (ângulo de 0°), nunca perpendicular (90°). Esta técnica reduz drasticamente o trauma da epiderme.",
      },
      {
        id: "remocao-humedecer",
        titulo: "Humedecer antes de remover em penso aderido",
        corpo: "Se o penso estiver colado ao leito ou à pele perilesional, aplicar soro fisiológico ou água na interface durante 1-2 minutos antes de remover. Nunca arrancar — a dor e o trauma são iatrogénicos.",
      },
    ],
    alertas: [
      {
        id: "marsi-risk",
        gravidade: "aviso" as const,
        titulo: "MARSI — risco aumentado em pele frágil",
        corpo: "Doentes com > 70 anos, a tomar corticóides sistémicos, com edema crónico ou malnutrição têm risco muito elevado de MARSI. Documentar na avaliação inicial e planear fixação atraumática desde o primeiro penso.",
      },
    ],
  },
  {
    id: "biofilme",
    dificuldade: "intermedio",
    titulo: "Biofilme em feridas crónicas",
    definition:
      "Comunidade microbiana estruturada, aderente ao leito, protegida por matriz extracelular. Resiste a antimicrobianos tópicos isolados e é causa frequente de estagnação de feridas crónicas.",
    indicacoes: [
      "Ferida crónica >4 semanas sem progressão",
      "Exsudado viscoso/gelatinoso recorrente",
      "Tecido friável que sangra facilmente",
      "Fibrina que reaparece após desbridamento",
    ],
    avisos_contraindicacao: [],
    sinais_alerta: [
      "Recidivas de infeção após cursos de antibiótico",
      "Ferida estagnada apesar de cuidado aparentemente adequado",
    ],
    erros_comuns: [
      {
        id: "prata-isolada-biofilme",
        titulo: "Usar prata como única estratégia contra biofilme",
        explicacao:
          "O biofilme exige combinação: desbridamento mecânico/enzimático repetido + antisséptico de espectro amplo (octenidina, PHMB) + cobertura adequada. Prata isolada não é suficiente.",
        idsTratamentoRelacionado: ["aquacel-ag", "silvercel"],
      },
    ],
    idsEvidencia: ["iwii-2022"],
    idsTratamento: ["octenilin-solucao", "colagenase", "aquacel-ag"],
    idsCaso: ["5"],
    idsTopicoRelacionado: ["antimicrobianos", "desbridamento"],
  },
  {
    id: "concerns-do-utente",
    dificuldade: "intermedio",
    titulo: "Preocupações centradas no utente",
    definition:
      "A componente Social/Patient-centered do TIMERS reconhece que a cicatrização depende de fatores humanos: dor, adesão ao tratamento, mobilidade, suporte social e recursos económicos.",
    indicacoes: [
      "Avaliar dor sistematicamente com escala validada (EVA/NRS)",
      "Identificar barreiras à adesão (horários, custos, capacidade cognitiva)",
      "Envolver família/cuidadores quando a pessoa tem dependência",
    ],
    avisos_contraindicacao: [],
    sinais_alerta: [
      "Dor não controlada que impede o penso",
      "Faltas repetidas a consultas",
      "Isolamento social ou desnutrição",
    ],
    erros_comuns: [
      {
        id: "ignorar-dor",
        titulo: "Fazer penso sem avaliar dor",
        explicacao:
          "A dor compromete adesão e cicatrização; avaliar e controlar antes de intervir. Dor ≥4/10 justifica analgesia prévia ao penso.",
      },
      {
        id: "mobilidade-ignorada",
        titulo: "Não avaliar impacto da ferida na mobilidade",
        explicacao:
          "Em doentes com mobilidade comprometida (LPP, pé diabético), o alívio de pressão e a capacidade de autocuidado são determinantes para o prognóstico. Envolver cuidadores é parte do plano.",
      },
    ],
    idsEvidencia: [],
    idsTratamento: [],
    idsCaso: ["2", "3", "4", "5"],
    idsTopicoRelacionado: ["decisao-clinica"],
  },
  {
    id: "decisao-clinica",
    dificuldade: "base",
    titulo: "Princípios de decisão clínica",
    definition:
      "Observar, recolher dados, definir o problema dominante e escolher o plano mínimo seguro antes de otimizar.",
    indicacoes: ["Todos os casos do simulador"],
    avisos_contraindicacao: [
      "Finalizar sem observação mínima",
      "Escolher materiais sem problema clínico definido",
    ],
    sinais_alerta: ["Excesso de materiais", "Perguntas insuficientes", "Foco pouco claro"],
    erros_comuns: [
      {
        id: "decision-overload",
        titulo: "Confundir quantidade com qualidade",
        explicacao:
          "Mais materiais não significam um plano melhor. O foco terapêutico é um marcador de raciocínio clínico — um plano com 2 ou 3 materiais bem justificados vale mais do que 6 escolhas sem coerência.",
      },
      {
        id: "inad-betamethasone",
        titulo: "Betametasona como resposta automática",
        explicacao:
          "Não responde ao problema dominante dos casos do simulador e fragiliza o raciocínio clínico. A betametasona tem indicações específicas que não se aplicam ao contexto das feridas crónicas e agudas simuladas.",
        idsTratamentoRelacionado: ["betametasona"],
      },
      {
        id: "decision-no-observation",
        titulo: "Finalizar sem observação mínima",
        explicacao:
          "Omitir a imagem, o exsudado ou o estado perilesional significa decidir sem dados suficientes. O plano resultante tende a não alinhar com o problema dominante porque o problema dominante nunca foi claramente identificado.",
      },
    ],
    idsEvidencia: ["water-cleansing", "debridement-review"],
    idsTratamento: ["cloreto-sodio", "octenilin-solucao", "betametasona"],
    idsCaso: ["1", "2", "3", "4"],
    idsTopicoRelacionado: ["tecidos-e-leito", "gestao-exsudado", "desbridamento"],
  },
  {
    id: "sinais-de-alarme",
    dificuldade: "intermedio",
    titulo: "Sinais de alarme e escalamento clínico",
    definition:
      "Reconhecer sinais sistémicos e locais que requerem escalamento imediato fora da competência do enfermeiro de cuidados gerais.",
    indicacoes: [
      "Febre ≥ 38 °C associada a ferida",
      "Eritema progressivo > 2 cm",
      "Linfangite",
      "Deterioração aguda do estado geral",
    ],
    avisos_contraindicacao: ["Aguardar mais avaliações antes de escalar quando há sinais sistémicos"],
    sinais_alerta: [
      "Febre + ferida = escalar imediatamente",
      "Eritema que não regride após 24-48 h de antibiótico local",
      "Hipotensão + ferida infetada = sepsis até prova em contrário",
    ],
    erros_comuns: [
      {
        id: "alarm-delay",
        titulo: "Aguardar a próxima avaliação antes de escalar",
        explicacao:
          "Na infeção em propagação e na infeção sistémica, horas contam. Escalar deve ser a primeira ação, não a última depois de tentar todas as coberturas.",
      },
      {
        id: "alarm-local-only",
        titulo: "Tratar infeção sistémica apenas com antimicrobiano local",
        explicacao:
          "Sinais sistémicos (febre, sépsis) requerem antibiótico sistémico. Pensos com prata ou iodo não atingem concentrações sanguíneas eficazes — são complementares, não substitutos.",
      },
    ],
    idsEvidencia: ["iwii-2022"],
    idsTratamento: [],
    idsCaso: ["3", "5", "7"],
    idsTopicoRelacionado: ["antimicrobianos", "biofilme", "concerns-do-utente"],
    tabelas: [
      {
        id: "continuum-infeccao",
        titulo: "Continuum de infeção (IWII 2022)",
        descricao: "Da contaminação à infeção sistémica — cada nível tem sinais e resposta distintos.",
        cabecalhos: ["Nível", "Sinais chave", "Resposta clínica"],
        linhas: [
          {
            celulas: [
              "Contaminação",
              "Micro-organismos presentes, sem multiplicação, sem sinais",
              "Limpeza regular; vigiar",
            ],
          },
          {
            celulas: [
              "Colonização",
              "Micro-organismos multiplicam-se, sem resposta do hospedeiro",
              "Otimizar limpeza; não usar antimicrobianos",
            ],
          },
          {
            celulas: [
              "Infeção local encoberta",
              "Granulação friável, odor, atraso na cicatrização",
              "Antimicrobiano tópico (prata, iodo); reavaliar em 2 semanas",
            ],
          },
          {
            celulas: [
              "Infeção local evidente",
              "Eritema, dor, calor, exsudado purulento",
              "Antimicrobiano tópico; considerar antibiótico sistémico; referência médica",
            ],
          },
          {
            celulas: [
              "Infeção em propagação",
              "Eritema > 2 cm, linfangite, febre",
              "Escalar imediatamente; antibiótico sistémico urgente",
            ],
          },
          {
            celulas: [
              "Infeção sistémica",
              "Sépsis, hipotensão, febre alta",
              "Emergência médica — transferência hospitalar",
            ],
          },
        ],
      },
    ],
    alertas: [
      {
        id: "sepsis-alert",
        gravidade: "critico" as const,
        titulo: "Sépsis associada a ferida — emergência médica",
        corpo: "Febre > 38,5 °C, taquicardia > 100 bpm e ferida com sinais de infeção = critérios de sépsis até prova em contrário. Escalar imediatamente. Não aguardar próxima avaliação.",
      },
      {
        id: "spreading-alert",
        gravidade: "aviso" as const,
        titulo: "Eritema progressivo — reavaliar em 24 horas",
        corpo: "Eritema que ultrapassa os bordos da ferida ou não regride com antimicrobiano local em 24-48 h deve levar a referência médica urgente para avaliação de antibioterapia sistémica.",
      },
    ],
  },
];
