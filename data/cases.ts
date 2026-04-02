import {
  calcularPontuacaoTratamentoCaso1,
  calcularPontuacaoTratamentoCaso2,
  calcularPontuacaoTratamentoCaso3,
  calcularPontuacaoTratamentoCaso4,
} from "@/app/lib/avaliacao-tratamentos";
import type { CasoConfig } from "@/app/types/caso-config";
import caso1Raw from "@/data/casos/caso1.json";
import caso2Raw from "@/data/casos/caso2.json";
import caso3Raw from "@/data/casos/caso3.json";
import caso4Raw from "@/data/casos/caso4.json";
import type { ApplicationRule, CaseDefinition, DialogueRule, ObservationDefinition } from "@/types/clinical";

const caso1 = caso1Raw as CasoConfig;
const caso2 = caso2Raw as CasoConfig;
const caso3 = caso3Raw as CasoConfig;
const caso4 = caso4Raw as CasoConfig;

const obs = (
  id: ObservationDefinition["id"],
  actionLabel: string,
  detailLabel: string,
  detailText: string,
  score: number,
  successText: string,
  missingText: string,
  lossReason: string
): ObservationDefinition => ({ id, actionLabel, detailLabel, detailText, score, successText, missingText, lossReason });

const dialogue = (
  id: DialogueRule["id"],
  score: number,
  successText: string,
  lossReason: string,
  missingText?: string
): DialogueRule => ({ id, score, successText, lossReason, missingText });

const required = (
  id: Extract<ApplicationRule, { type: "required" }>["id"],
  score: number,
  successText: string,
  lossReason: string,
  missingText?: string
): ApplicationRule => ({ type: "required", id, score, successText, lossReason, missingText });

const penalty = (
  id: Extract<ApplicationRule, { type: "penalty" }>["id"],
  score: number,
  errorText: string,
  lossReason: string
): ApplicationRule => ({ type: "penalty", id, score, errorText, lossReason });

const excess = (
  minimumSelected: number,
  score: number,
  excessText: string,
  lossReason: string
): ApplicationRule => ({ type: "excess", minimumSelected, score, excessText, lossReason });

const bonus = (
  requiredIds: Extract<ApplicationRule, { type: "bonus" }>["requiredIds"],
  blockedIds: Extract<ApplicationRule, { type: "bonus" }>["blockedIds"],
  score: number,
  successText: string,
  lossReason: string
): ApplicationRule => ({ type: "bonus", requiredIds, blockedIds, score, successText, lossReason });

export const caseDefinitions: CaseDefinition[] = [
  {
    id: "1",
    slug: "1",
    title: "Lesao por pressao",
    shortTitle: "Caso 1",
    description: "Avaliacao de lesao por pressao com foco em observacao, dialogo e escolha de cobertura.",
    competencies: "Observacao, colheita de dados, escolha de penso e decisao clinica",
    status: "disponivel",
    difficulty: "introdutorio",
    sequence: 1,
    estimatedMinutes: 8,
    learningTopicIds: ["decisao-clinica", "gestao-exsudado", "protecao-perilesional"],
    introTitle: "Caso 1 - Lesao por pressao",
    introSummary: "Utente de 78 anos, dependente parcial, com lesao por pressao na regiao sagrada e mobilidade reduzida.",
    introFocusText: "Observar a ferida, recolher informacao relevante e selecionar uma abordagem ajustada ao exsudado e a pele peri-ferida.",
    patientBanner: "Utente de 78 anos com lesao por pressao na regiao sagrada, mobilidade reduzida e necessidade de ajuda no posicionamento.",
    objective: "Avaliar a lesao, recolher informacao relevante e escolher uma abordagem adequada.",
    imageSrc: "/caso1.jpg",
    imageAlt: "Ulcera por pressao",
    imageFit: "cover",
    caseTitleForHistory: "Caso 1 - Lesao por pressao",
    config: caso1,
    observationItems: [
      obs("imagem", "Ver imagem da ferida", "Imagem", "Fotografia clinica disponivel para inspecao direta do leito da ferida.", 3, "Visualizaste a imagem da ferida.", "Faltou observar diretamente a imagem da ferida.", "Perdeste pontuacao por nao visualizares a imagem da ferida."),
      obs("dimensoes", "Ver dimensoes", "Dimensoes", "aproximadamente 4 cm x 3 cm, profundidade ligeira a moderada.", 3, "Consultaste as dimensoes da ferida.", "Faltou verificar as dimensoes da ferida.", "Perdeste pontuacao por nao avaliares as dimensoes da ferida."),
      obs("exsudado", "Ver exsudado", "Exsudado", "moderado, seroso a serossanguinolento.", 3, "Observaste o exsudado.", "Faltou avaliar o exsudado.", "Perdeste pontuacao por nao avaliares o exsudado."),
      obs("cheiro", "Ver cheiro", "Cheiro", "ligeiro, sem odor fetido intenso.", 2, "Verificaste o odor da ferida.", "Faltou verificar o odor da ferida.", "Perdeste pontuacao por nao verificares o odor da ferida."),
      obs("tecidos", "Ver tecidos presentes", "Tecido presente", "granulacao viavel com areas de fibrina amarelada.", 2, "Observaste os tecidos presentes no leito.", "Faltou avaliar os tecidos presentes no leito.", "Perdeste pontuacao por nao identificares os tecidos presentes no leito."),
      obs("pele_perilesional", "Ver pele perilesional", "Pele perilesional", "eritematosa, sensivel, sem maceracao marcada.", 2, "Observaste a pele perilesional.", "Faltou avaliar a pele perilesional.", "Perdeste pontuacao por nao avaliares a pele perilesional."),
    ],
    dialogueRules: [
      dialogue("dor", 4, "Avaliaste a dor do utente.", "Perdeste pontuacao por nao avaliares a dor.", "Faltou avaliar a dor."),
      dialogue("duracao", 2, "Perguntaste ha quanto tempo existe a ferida.", "Perdeste pontuacao por nao explorares a duracao da ferida."),
      dialogue("posicao", 4, "Exploraste posicionamento e alivio de pressao.", "Perdeste pontuacao por nao explorares alivio de pressao e posicionamento.", "Faltou explorar posicionamento e alivio de pressao."),
      dialogue("mobilidade", 3, "Avaliaste a mobilidade e dependencia.", "Perdeste pontuacao por nao avaliares a mobilidade e dependencia.", "Faltou avaliar a mobilidade e dependencia."),
      dialogue("febre", 1, "Questionaste sinais sistemicos como febre.", "Perdeste pontuacao por nao explorares sinais sistemicos."),
      dialogue("pensos", 1, "Questionaste pensos previos.", "Perdeste pontuacao por nao questionares os pensos previos."),
    ],
    treatmentEvaluator: calcularPontuacaoTratamentoCaso1,
    applicationRules: [
      required("apos_limpeza", 7, "Indicaste aplicacao apos limpeza adequada.", "Perdeste pontuacao por nao incluires limpeza adequada antes da cobertura.", "Faltou referir limpeza adequada antes da aplicacao."),
      required("com_protecao_perilesional", 7, "Consideraste protecao da pele perilesional.", "Perdeste pontuacao por nao incluires protecao da pele perilesional.", "Faltou incluir protecao da pele perilesional."),
      required("sem_desbridamento", 3, "Reconheceste que o desbridamento enzimatico nao e prioridade nesta fase.", "Perdeste pontuacao por nao demonstrares prioridade terapeutica adequada nesta fase."),
      penalty("direto_seco", -8, "A aplicacao direta em seco nao respeita uma abordagem humida adequada.", "Perdeste pontuacao por selecionares aplicacao direta em seco."),
      penalty("compressao_forte", -10, "A compressao forte sobre a lesao nao e adequada neste contexto.", "Perdeste pontuacao por selecionares compressao forte sobre a lesao."),
      excess(4, -3, "Selecionaste demasiadas formas de aplicacao sem foco suficiente.", "Perdeste pontuacao por excesso de opcoes de aplicacao."),
      bonus(["apos_limpeza", "com_protecao_perilesional"], ["direto_seco", "compressao_forte"], 3, "Mantiveste uma aplicacao global coerente, sem opcoes desadequadas.", "Nao atingiste a pontuacao maxima porque faltou uma aplicacao totalmente coerente."),
    ],
    feedbackBands: [
      { minScore: 85, text: "Desempenho muito bom. Fizeste uma avaliacao abrangente e escolheste uma abordagem globalmente adequada." },
      { minScore: 70, text: "Bom desempenho. Identificaste varios elementos importantes, mas ainda faltaram alguns dados ou afinacoes terapeuticas." },
      { minScore: 50, text: "Desempenho intermedio. A recolha de dados e ou a selecao do tratamento ficou incompleta." },
      { minScore: 0, text: "Desempenho insuficiente. Faltaram etapas importantes de avaliacao e houve decisoes terapeuticas desadequadas." },
    ],
  },
  {
    id: "2",
    slug: "2",
    title: "Ferida cirurgica com deiscencia",
    shortTitle: "Caso 2",
    description: "Avaliacao de deiscencia cirurgica com suspeita de infeccao local, exsudado e tecido desvitalizado.",
    competencies: "Infeccao, exsudado, desbridamento e selecao de antimicrobianos",
    status: "disponivel",
    difficulty: "intermedio",
    sequence: 2,
    estimatedMinutes: 10,
    learningTopicIds: ["antimicrobianos", "desbridamento", "gestao-exsudado"],
    introEyebrow: "Caso clinico",
    introTitle: "Caso 2 - Ferida cirurgica com deiscencia",
    introSummary: "Utente de 72 anos, submetido a cirurgia vascular ha 10 dias, com abertura parcial da sutura, aumento de exsudado e dor local.",
    introFocusLabel: "Foco do caso",
    introFocusText: "Avaliar deiscencia, infeccao local, exsudado, tecido desvitalizado e escolher uma abordagem coerente.",
    patientBanner: "Utente de 72 anos com ferida na perna esquerda, abertura parcial da sutura, dor local e aumento de exsudado nos ultimos dias.",
    objective: "Avaliar deiscencia, infeccao local, exsudado, tecido desvitalizado e escolher uma abordagem terapeutica coerente.",
    imageSrc: "/caso2.png",
    imageAlt: "Ferida cirurgica com deiscencia",
    imageFit: "contain",
    caseTitleForHistory: "Caso 2 - Ferida cirurgica com deiscencia",
    config: caso2,
    observationItems: [
      obs("imagem", "Ver imagem da ferida", "Imagem", "Fotografia clinica disponivel para inspecao direta da deiscencia.", 3, "Visualizaste a imagem da ferida.", "Faltou observar a imagem da ferida.", "Perdeste pontuacao por nao observares a imagem da ferida."),
      obs("dimensoes", "Ver dimensoes", "Dimensoes", "ferida linear com cerca de 12 cm, com multiplas areas de deiscencia entre 2 e 4 cm.", 3, "Consultaste as dimensoes da deiscencia.", "Faltou avaliar as dimensoes da ferida.", "Perdeste pontuacao por nao avaliares as dimensoes da ferida."),
      obs("exsudado", "Ver exsudado", "Exsudado", "moderado a abundante, seroso a seropurulento.", 3, "Valorizaste o exsudado, essencial neste caso.", "Faltou avaliar o exsudado.", "Perdeste pontuacao por nao avaliares o exsudado."),
      obs("cheiro", "Ver cheiro", "Cheiro", "odor ligeiro a moderado.", 2, "Observaste o odor da ferida.", "Faltou observar o cheiro.", "Perdeste pontuacao por nao observares o cheiro."),
      obs("tecidos", "Ver tecidos presentes", "Tecido presente", "presenca de fibrina e areas de tecido desvitalizado.", 2, "Identificaste tecido fibrinoso e desvitalizado.", "Faltou avaliar os tecidos presentes.", "Perdeste pontuacao por nao avaliares os tecidos presentes."),
      obs("pele_perilesional", "Ver pele perilesional", "Pele perilesional", "eritematosa, ligeiramente macerada.", 2, "Observaste a pele peri-ferida.", "Faltou observar a pele peri-ferida.", "Perdeste pontuacao por nao observares a pele peri-ferida."),
    ],
    dialogueRules: [
      dialogue("dor", 3, "Avaliaste a dor.", "Perdeste pontuacao por nao avaliares a dor.", "Faltou avaliar a dor."),
      dialogue("febre", 4, "Exploraste febre, relevante para suspeita de infeccao.", "Perdeste pontuacao por nao explorares febre ou sinais sistemicos.", "Faltou explorar febre ou sinais sistemicos."),
      dialogue("posicao", 3, "Perguntaste sobre posicao do membro.", "Perdeste pontuacao por nao explorares a posicao da perna.", "Faltou perguntar sobre posicao da perna."),
      dialogue("duracao", 3, "Exploraste a evolucao temporal da ferida.", "Perdeste pontuacao por nao explorares a evolucao temporal da ferida.", "Faltou perguntar ha quanto tempo a ferida evolui mal."),
      dialogue("pensos", 1, "Perguntaste pelos pensos previos.", "Perdeste pontuacao por nao explorares os pensos previos."),
      dialogue("mobilidade", 1, "Exploraste a mobilidade.", "Perdeste pontuacao por nao explorares a mobilidade."),
    ],
    treatmentEvaluator: calcularPontuacaoTratamentoCaso2,
    applicationRules: [
      required("apos_limpeza", 9, "Preves aplicacao apos limpeza adequada.", "Perdeste pontuacao por nao indicares limpeza adequada antes da cobertura.", "Faltou indicar limpeza adequada antes da cobertura."),
      required("com_protecao_perilesional", 7, "Consideraste protecao da pele peri-ferida.", "Perdeste pontuacao por nao considerares protecao da pele peri-ferida.", "Faltou proteger a pele peri-ferida."),
      penalty("sem_desbridamento", -3, "Assinalaste ausencia de desbridamento como prioridade, o que nao e o mais ajustado aqui.", "Perdeste pontuacao por afastares o desbridamento num caso em que pode ser relevante."),
      penalty("direto_seco", -4, "Aplicacao direta em seco nao e adequada neste contexto.", "Perdeste pontuacao por escolheres aplicacao direta em seco."),
      penalty("compressao_forte", -5, "Compressao forte sobre a lesao nao e adequada.", "Perdeste pontuacao por escolheres compressao forte sobre a lesao."),
      excess(4, -2, "Selecionaste demasiadas formas de aplicacao em simultaneo.", "Perdeste pontuacao por excesso de opcoes de aplicacao."),
      bonus(["apos_limpeza", "com_protecao_perilesional"], ["sem_desbridamento", "direto_seco", "compressao_forte"], 4, "Mantiveste uma aplicacao global coerente, sem opcoes desadequadas.", "Nao atingiste a pontuacao maxima porque faltou uma aplicacao totalmente coerente."),
    ],
    feedbackBands: [
      { minScore: 85, text: "Desempenho muito bom. Reconheceste bem os sinais de deiscencia, exsudado e provavel infeccao local." },
      { minScore: 70, text: "Bom desempenho. A resolucao foi globalmente util, mas ainda houve aspetos importantes a afinar." },
      { minScore: 50, text: "Desempenho intermedio. Identificaste parte dos problemas, mas faltaram etapas importantes." },
      { minScore: 0, text: "Desempenho insuficiente. Este caso exigia maior atencao a suspeita de infeccao, gestao de exsudado e desbridamento." },
    ],
  },
  {
    id: "3",
    slug: "3",
    title: "Ferida pos-amputacao com infeccao e exsudado abundante",
    shortTitle: "Caso 3",
    description: "Avaliacao de ferida pos-amputacao no pe diabetico com infeccao local, exsudado abundante e maceracao perilesional.",
    competencies: "Controlo de infeccao, gestao de exsudado, desbridamento e protecao perilesional",
    status: "disponivel",
    difficulty: "avancado",
    sequence: 3,
    estimatedMinutes: 12,
    learningTopicIds: ["antimicrobianos", "gestao-exsudado", "protecao-perilesional", "desbridamento"],
    introEyebrow: "Caso clinico",
    introTitle: "Caso 3 - Ferida pos-amputacao com infeccao",
    introSummary: "Utente com ferida na extremidade distal do pe apos amputacao digital, com evolucao desfavoravel, exsudado abundante, odor e tecido desvitalizado.",
    introFocusLabel: "Foco do caso",
    introFocusText: "Controlar infeccao local, gerir exsudado abundante, promover desbridamento e proteger pele perilesional macerada.",
    patientBanner: "Utente com ferida pos-amputacao, dor moderada, exsudado abundante, odor presente e episodios previos de infeccao local.",
    objective: "Controlar infeccao local, gerir exsudado abundante, promover desbridamento e proteger pele perilesional macerada.",
    imageSrc: "/caso3.jpeg",
    imageAlt: "Ferida pos-amputacao na extremidade distal do pe",
    imageFit: "contain",
    caseTitleForHistory: "Caso 3 - Ferida pos-amputacao com infeccao",
    config: caso3,
    observationItems: [
      obs("imagem", "Ver imagem da ferida", "Imagem", "Fotografia clinica disponivel para inspecao direta da ferida pos-amputacao.", 3, "Visualizaste a imagem da ferida.", "Faltou observar a imagem da ferida.", "Perdeste pontuacao por nao observares a imagem da ferida."),
      obs("dimensoes", "Ver dimensoes", "Dimensoes", "3,5 cm de comprimento x 3,0 cm de largura x 1,0 cm de profundidade.", 3, "Consultaste as dimensoes da ferida.", "Faltou avaliar as dimensoes da ferida.", "Perdeste pontuacao por nao avaliares as dimensoes da ferida."),
      obs("exsudado", "Ver exsudado", "Exsudado", "abundante.", 3, "Valorizaste o exsudado, essencial neste caso.", "Faltou avaliar o exsudado.", "Perdeste pontuacao por nao avaliares o exsudado."),
      obs("cheiro", "Ver cheiro", "Cheiro", "presente.", 2, "Observaste o odor da ferida.", "Faltou observar o cheiro.", "Perdeste pontuacao por nao observares o cheiro."),
      obs("tecidos", "Ver tecidos presentes", "Tecido presente", "50% granulacao e 50% tecido desvitalizado.", 2, "Identificaste tecido fibrinoso e desvitalizado.", "Faltou avaliar os tecidos presentes.", "Perdeste pontuacao por nao avaliares os tecidos presentes."),
      obs("pele_perilesional", "Ver pele perilesional", "Pele perilesional", "macerada e descamativa.", 2, "Observaste a pele peri-ferida.", "Faltou observar a pele peri-ferida.", "Perdeste pontuacao por nao observares a pele peri-ferida."),
    ],
    dialogueRules: [
      dialogue("dor", 3, "Avaliaste a dor.", "Perdeste pontuacao por nao avaliares a dor.", "Faltou avaliar a dor."),
      dialogue("febre", 4, "Exploraste febre, relevante para suspeita de infeccao.", "Perdeste pontuacao por nao explorares febre ou sinais sistemicos.", "Faltou explorar febre ou sinais sistemicos."),
      dialogue("posicao", 3, "Perguntaste sobre alivio de pressao.", "Perdeste pontuacao por nao explorares alivio de pressao na zona do pe.", "Faltou perguntar sobre alivio de pressao na zona do pe."),
      dialogue("duracao", 3, "Exploraste a evolucao temporal da ferida.", "Perdeste pontuacao por nao explorares a evolucao temporal da ferida.", "Faltou perguntar ha quanto tempo a ferida evolui mal."),
      dialogue("pensos", 1, "Perguntaste pelos pensos previos.", "Perdeste pontuacao por nao explorares os pensos previos."),
      dialogue("mobilidade", 1, "Exploraste a mobilidade.", "Perdeste pontuacao por nao explorares a mobilidade."),
    ],
    treatmentEvaluator: calcularPontuacaoTratamentoCaso3,
    applicationRules: [
      required("apos_limpeza", 9, "Preves aplicacao apos limpeza adequada.", "Perdeste pontuacao por nao indicares limpeza adequada antes da cobertura.", "Faltou indicar limpeza adequada antes da cobertura."),
      required("com_protecao_perilesional", 7, "Consideraste protecao da pele peri-ferida.", "Perdeste pontuacao por nao considerares protecao da pele peri-ferida.", "Faltou proteger a pele peri-ferida."),
      penalty("sem_desbridamento", -3, "Assinalaste ausencia de desbridamento como prioridade, o que nao e o mais ajustado aqui.", "Perdeste pontuacao por afastares o desbridamento num caso em que pode ser relevante."),
      penalty("direto_seco", -4, "Aplicacao direta em seco nao e adequada neste contexto.", "Perdeste pontuacao por escolheres aplicacao direta em seco."),
      penalty("compressao_forte", -5, "Compressao forte sobre a lesao nao e adequada.", "Perdeste pontuacao por escolheres compressao forte sobre a lesao."),
      excess(4, -2, "Selecionaste demasiadas formas de aplicacao em simultaneo.", "Perdeste pontuacao por excesso de opcoes de aplicacao."),
      bonus(["apos_limpeza", "com_protecao_perilesional"], ["sem_desbridamento", "direto_seco", "compressao_forte"], 4, "Mantiveste uma aplicacao global coerente, sem opcoes desadequadas.", "Nao atingiste a pontuacao maxima porque faltou uma aplicacao totalmente coerente."),
    ],
    feedbackBands: [
      { minScore: 85, text: "A abordagem foi adequada. Identificaste corretamente desbridamento, controlo de infeccao, gestao do exsudado e protecao da pele perilesional." },
      { minScore: 70, text: "A abordagem foi parcialmente adequada, mas faltaram elementos importantes para otimizar a evolucao da ferida." },
      { minScore: 50, text: "A abordagem foi parcialmente adequada, mas persistem falhas na selecao e sequencia terapeutica." },
      { minScore: 0, text: "A abordagem escolhida nao foi adequada ao estado da ferida. Reve sinais de infeccao, tecido desvitalizado e necessidade de controlar exsudado abundante." },
    ],
  },
  {
    id: "4",
    slug: "4",
    title: "Ulcera no tornozelo com fibrina e exsudado moderado",
    shortTitle: "Caso 4",
    description: "Avaliacao de ulcera no tornozelo com tecido viavel, fibrina superficial, exsudado moderado e necessidade de proteger a pele peri-ferida.",
    competencies: "Leito da ferida, controlo de exsudado, protecao peri-ferida e foco terapeutico",
    status: "disponivel",
    difficulty: "intermedio",
    sequence: 4,
    estimatedMinutes: 9,
    learningTopicIds: ["tecidos-e-leito", "gestao-exsudado", "desbridamento", "protecao-perilesional"],
    introEyebrow: "Caso clinico",
    introTitle: "Caso 4 - Ulcera do tornozelo",
    introSummary: "Utente com lesao ulcerada na regiao maleolar, dolorosa ao penso, com tecido de granulacao, areas de fibrina e exsudado moderado.",
    introFocusLabel: "Foco do caso",
    introFocusText: "Reconhecer o tipo de tecido presente, controlar exsudado, preparar o leito quando necessario e proteger a pele peri-ferida sem excesso terapeutico.",
    patientBanner: "Utente com lesao ulcerada na regiao do tornozelo, dor local moderada durante o penso e exsudado persistente. Refere pele adjacente sensivel.",
    objective: "Identificar o problema dominante do leito e selecionar um plano focado no controlo de exsudado, preparacao do leito e protecao peri-ferida.",
    imageSrc: "/caso4.jpeg",
    imageAlt: "Ulcera maleolar com granulacao e fibrina superficial",
    imageFit: "contain",
    caseTitleForHistory: "Caso 4 - Ulcera do tornozelo",
    config: caso4,
    observationItems: [
      obs("imagem", "Ver imagem da ferida", "Imagem", "Fotografia clinica disponivel para observacao do leito e bordos da ferida.", 3, "Observaste a imagem da ferida.", "Faltou observar a imagem clinica da ferida.", "Perdeste pontuacao por nao observares a imagem da ferida."),
      obs("dimensoes", "Ver dimensoes", "Dimensoes", "aproximadamente 5 cm x 3 cm, profundidade superficial a ligeira.", 3, "Consultaste as dimensoes da ferida.", "Faltou avaliar as dimensoes da ferida.", "Perdeste pontuacao por nao avaliares as dimensoes da ferida."),
      obs("exsudado", "Ver exsudado", "Exsudado", "moderado, seroso.", 3, "Valorizaste o exsudado presente.", "Faltou avaliar o exsudado.", "Perdeste pontuacao por nao avaliares o exsudado."),
      obs("cheiro", "Ver cheiro", "Cheiro", "sem odor intenso.", 2, "Observaste o odor da ferida.", "Faltou observar o odor da ferida.", "Perdeste pontuacao por nao observares o odor da ferida."),
      obs("tecidos", "Ver tecidos presentes", "Tecido presente", "granulacao viavel com areas superficiais de fibrina aderente.", 2, "Identificaste os tecidos presentes no leito.", "Faltou identificar os tecidos presentes.", "Perdeste pontuacao por nao avaliares os tecidos do leito."),
      obs("pele_perilesional", "Ver pele perilesional", "Pele perilesional", "sensivel, ligeiramente eritematosa, sem maceracao marcada.", 2, "Observaste a pele peri-ferida.", "Faltou observar a pele peri-ferida.", "Perdeste pontuacao por nao observares a pele peri-ferida."),
    ],
    dialogueRules: [
      dialogue("dor", 3, "Avaliaste a dor local.", "Perdeste pontuacao por nao avaliares a dor.", "Faltou avaliar a dor."),
      dialogue("duracao", 3, "Exploraste a evolucao temporal da ferida.", "Perdeste pontuacao por nao explorares a evolucao temporal da ferida.", "Faltou explorar a evolucao temporal da ferida."),
      dialogue("posicao", 2, "Questionaste edema e posicao do membro.", "Perdeste pontuacao por nao explorares posicao do membro e rotina diaria.", "Faltou explorar a posicao do membro e tempo em ortostatismo."),
      dialogue("pensos", 3, "Perguntaste pelos pensos previos e frequencia das mudancas.", "Perdeste pontuacao por nao explorares os pensos previos.", "Faltou explorar pensos previos."),
      dialogue("febre", 1, "Confirmaste ausencia de sinais sistemicos marcados.", "Perdeste pontuacao por nao valorizares sinais sistemicos de agravamento."),
      dialogue("mobilidade", 3, "Avaliaste mobilidade e impacto funcional no membro.", "Perdeste pontuacao por nao avaliares a mobilidade.", "Faltou avaliar mobilidade."),
    ],
    treatmentEvaluator: calcularPontuacaoTratamentoCaso4,
    applicationRules: [
      required("apos_limpeza", 8, "Preves aplicacao apos limpeza adequada.", "Perdeste pontuacao por nao incluires limpeza adequada antes da cobertura.", "Faltou referir limpeza adequada antes da cobertura."),
      required("com_protecao_perilesional", 8, "Consideraste protecao da pele peri-ferida.", "Perdeste pontuacao por nao incluires protecao da pele peri-ferida.", "Faltou proteger a pele peri-ferida."),
      required("sem_desbridamento", 1, "Reconheceste que a preparacao do leito deve ser contextualizada e nao excessiva.", "Perdeste pontuacao por nao demonstrares prudencia na preparacao do leito."),
      penalty("direto_seco", -5, "Aplicacao direta em seco nao e adequada para este leito.", "Perdeste pontuacao por escolheres aplicacao direta em seco."),
      penalty("compressao_forte", -6, "Compressao forte sobre a lesao nao e adequada como forma de aplicacao do penso.", "Perdeste pontuacao por selecionares compressao forte sobre a lesao."),
      excess(4, -2, "Selecionaste demasiadas formas de aplicacao em simultaneo.", "Perdeste pontuacao por excesso de opcoes de aplicacao."),
      bonus(["apos_limpeza", "com_protecao_perilesional"], ["direto_seco", "compressao_forte"], 3, "Mantiveste uma aplicacao global coerente e protetora do leito.", "Nao atingiste a pontuacao maxima porque faltou uma aplicacao totalmente coerente."),
    ],
    feedbackBands: [
      { minScore: 85, text: "Desempenho muito bom. Identificaste bem o leito da ferida e mantiveste um plano terapeutico focado no exsudado, preparacao do leito e protecao peri-ferida." },
      { minScore: 70, text: "Bom desempenho. A decisao foi globalmente coerente, mas ainda faltou afinar observacao, foco terapeutico ou protecao periferica." },
      { minScore: 50, text: "Desempenho intermedio. Recolheste parte dos dados uteis, mas o plano ainda ficou incompleto ou com excesso de opcoes." },
      { minScore: 0, text: "Desempenho insuficiente. Este caso exigia mais foco na leitura do leito, controlo de exsudado e protecao da pele peri-ferida." },
    ],
  },
];
