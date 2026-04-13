// ─── Variáveis clínicas numéricas ───────────────────────────────────────────

/** Representação numérica do estado da ferida. Utilizada na avaliação por material. */
export type WoundVariables = {
  /** 1=ausente  2=ligeiro  3=moderado  4=abundante */
  exsudado: 1 | 2 | 3 | 4;
  /** 0=ausente  1=local  2=marcada  3=sistémica */
  infeccao: 0 | 1 | 2 | 3;
  /** 1=necrose  2=fibrina  3=granulação  4=epitelização */
  tecido: 1 | 2 | 3 | 4;
  /** 0=ausente  1=ligeiro  2=moderado  3=intenso */
  odor: 0 | 1 | 2 | 3;
  /** 1=seca  2=ligeira  3=moderada  4=maceração */
  humidade: 1 | 2 | 3 | 4;
  /** 1=superficial  2=moderada  3=profunda  4=cavidade */
  profundidade: 1 | 2 | 3 | 4;
  /** 1=indefinidos  2=irregulares  3=regulares  4=em epitelização */
  bordos: 1 | 2 | 3 | 4;
  /** 1=macerada  2=frágil  3=eritematosa  4=íntegra */
  pele_perilesional: 1 | 2 | 3 | 4;
  /** 0=ausente  1=ligeira  2=moderada  3=intensa */
  dor: 0 | 1 | 2 | 3;
  /** 0=ausente  1=ligeira  2=moderada  3=abundante */
  hemorragia: 0 | 1 | 2 | 3;
  /** 1=pressão  2=venosa  3=arterial  4=diabética  5=traumática  6=cirúrgica */
  etiologia: 1 | 2 | 3 | 4 | 5 | 6;
  /** 0=comprometida  1=adequada */
  perfusao: 0 | 1;
};

/**
 * Condição de avaliação: cada chave mapeia para lista de valores válidos.
 * Uma condição com objecto vazio {} corresponde a "aplicável a qualquer ferida".
 * A lógica é AND: todas as chaves presentes têm de corresponder.
 */
export type WoundVariableCondition = Partial<Record<keyof WoundVariables, number[]>>;

/** Regras clínicas de um material ou técnica. */
export type MaterialRules = {
  /** Condições para classificação "correto" — deve satisfazer todas as chaves */
  condicoes_ideais: WoundVariableCondition;
  /** Condições para classificação "parcial" (opcional) */
  condicoes_parciais?: WoundVariableCondition;
  /** Lista de condições de contraindicação — basta uma corresponder para "incorreto" */
  contraindicacoes: WoundVariableCondition[];
  /** Condições para bónus adicional de 0,25 pts */
  bonus?: WoundVariableCondition;
};

/** Classificação por material no novo sistema de avaliação */
export type MaterialClassification = "correto" | "parcial" | "incorreto";

/** Resultado da avaliação de um material individual */
export type MaterialScore = {
  materialId: string;
  label: string;
  nome_comercial?: string | null;
  substancia_ativa?: string;
  classification: MaterialClassification;
  /** 1.0 = correto  |  0.5 = parcial  |  0 = incorreto  (+ 0.25 se hasBonus) */
  score: number;
  hasBonus: boolean;
  justificacao: string;
};

/** Item de feedback por material */
export type MaterialFeedbackItem = {
  material: string;
  justificacao: string;
};

/** Feedback estruturado gerado após avaliação de materiais */
export type MaterialFeedback = {
  corretos: MaterialFeedbackItem[];
  parciais: MaterialFeedbackItem[];
  incorretos: MaterialFeedbackItem[];
  /** Materiais não selecionados que seriam ideais para esta ferida */
  sugestoes: MaterialFeedbackItem[];
};

// ─── Tipos existentes ────────────────────────────────────────────────────────

export type TreatmentFunction =
  | "cleanse"
  | "absorb"
  | "control-bioburden"
  | "debride"
  | "protect-periwound"
  | "hydrate"
  | "atraumatic-cover"
  | "manage-odor"
  | "offload-pressure";

export type ClinicalIntent =
  | "control-exudate"
  | "control-bioburden"
  | "debridement"
  | "protect-periwound"
  | "manage-odor"
  | "offload-pressure"
  | "atraumatic-cover"
  | "cleanse-wound";

export type EvaluationClassification =
  | "essencial"
  | "adequado"
  | "redundante"
  | "inadequado";

export type ObservationId =
  | "imagem"
  | "dimensoes"
  | "exsudado"
  | "cheiro"
  | "tecidos"
  | "pele_perilesional";

export type DialogueId =
  | "dor"
  | "duracao"
  | "posicao"
  | "pensos"
  | "febre"
  | "mobilidade";

export type ApplicationId =
  | "apos_limpeza"
  | "com_protecao_perilesional"
  | "sem_desbridamento_agressivo"
  | "fixacao_atraumatica"
  | "compressao_forte"
  | "direto_seco"
  // Técnicas de tratamento adicionadas
  | "penso_rapido"
  | "penso_simples"
  | "ligadura"
  | "penso_impermeavel"
  | "terapia_compressiva"
  | "sem_protecao";

export type EvidenceReference = {
  id: string;
  title: string;
  url: string;
  summary: string;
};

export type TreatmentDefinition = {
  id: string;
  label: string;
  canonicalId: string;
  equivalenceGroup: string;
  category: string;
  subCategory: string;
  functions: TreatmentFunction[];
  indications: string[];
  contraindications: string[];
  evidenceRefs: string[];
  learningTopicIds: string[];
  uiTags: string[];
  /** Nome comercial de referência (ex: "Aquacel®"); null quando não existe nome comercial relevante */
  nome_comercial?: string | null;
  /** Substância ativa ou denominação comum (ex: "Carboximetilcelulose sódica") */
  substancia_ativa?: string;
  /** Categoria para o sistema de avaliação por material */
  categoria_clinica?: "apositos" | "liquidos" | "pomadas" | "outros";
  /** Regras clínicas para avaliação correto/parcial/incorreto */
  regras?: MaterialRules;
};

export type CommonMistake = {
  id: string;
  title: string;
  explanation: string;
  relatedTreatmentIds?: string[];
};

export type LearningTopic = {
  id: string;
  title: string;
  pedagogicalDifficulty: "base" | "intermedio" | "avancado";
  definition: string;
  indications: string[];
  contraindications: string[];
  warningSigns: string[];
  commonMistakes: CommonMistake[];
  evidenceIds: string[];
  treatmentIds: string[];
  caseIds: string[];
  relatedTopicIds: string[];
};

export type ObservationDefinition = {
  id: ObservationId;
  label: string;
  priority: "essencial" | "adequado";
  prompt: string;
  learningTopicIds: string[];
};

export type DialoguePrompt = {
  id: DialogueId;
  label: string;
  question: string;
  priority: "essencial" | "adequado";
  learningTopicIds: string[];
};

export type ApplicationOption = {
  id: ApplicationId;
  label: string;
  learningTopicIds: string[];
  /** Regras clínicas para avaliação da técnica (correto/parcial/incorreto) */
  regras?: MaterialRules;
};

export type GoalMatcher = {
  treatmentIds?: string[];
  treatmentFunctions?: TreatmentFunction[];
  applicationIds?: ApplicationId[];
};

export type CaseGoal = {
  id: string;
  label: string;
  intent: ClinicalIntent;
  priority: "essencial" | "adequado";
  rationale: string;
  learningTopicIds: string[];
  matcher: GoalMatcher;
};

export type EvaluationRule = {
  id: string;
  target: "treatment" | "application";
  appliesToIds: string[];
  classification: EvaluationClassification;
  reason: string;
  learningTopicIds: string[];
};

export type WoundState = {
  exudate: "baixo" | "moderado" | "abundante";
  infection: "ausente" | "suspeita-local" | "marcada";
  tissue: "granulacao" | "granulacao-fibrina" | "fibrina" | "desvitalizado";
  periwound: "integra" | "fragil" | "macerada";
  odor: "ausente" | "ligeiro" | "presente";
};

export type ObservationDetail = {
  detail: string;
  priority?: "essencial" | "adequado";
};

export type CaseVariant = {
  id: string;
  title: string;
  patientContext: string;
  patientBanner: string;
  woundState: WoundState;
  /** Variáveis clínicas numéricas — usadas no motor de avaliação por material */
  woundVariables?: WoundVariables;
  observationDetails: Record<ObservationId, ObservationDetail>;
  dialogueResponses: Record<DialogueId, string>;
  availableTreatments: string[];
  applicationOptions: ApplicationId[];
  clinicalTargets: CaseGoal[];
  evaluationRules: EvaluationRule[];
  learningTopicIds: string[];
  recommendedPlan: {
    minimum: string[];
    optimized: string[];
  };
};

export type CaseTemplate = {
  id: string;
  slug: string;
  shortTitle: string;
  title: string;
  description: string;
  competencies: string;
  difficulty: "introdutorio" | "intermedio" | "avancado";
  sequence: number;
  estimatedMinutes: number;
  status: "disponivel" | "preparacao";
  imageSrc: string;
  imageAlt: string;
  introSummary: string;
  objective: string;
  observationDefinitions: ObservationDefinition[];
  dialoguePrompts: DialoguePrompt[];
  applicationDefinitions: ApplicationOption[];
  variants: CaseVariant[];
};

export type CaseSession = {
  template: CaseTemplate;
  variant: CaseVariant;
};

export type AttemptInput = {
  observationIds: ObservationId[];
  dialogueIds: DialogueId[];
  treatmentIds: string[];
  applicationIds: ApplicationId[];
};

export type EvaluationItem = {
  id: string;
  sourceId?: string;
  label: string;
  classification: EvaluationClassification;
  explanation: string;
  learningTopicIds: string[];
};

export type ReviewStatus = "correct" | "incorrect" | "missed" | null;

export type AttemptReview = {
  idealAttempt: AttemptInput;
  observationStatus: Partial<Record<ObservationId, ReviewStatus>>;
  dialogueStatus: Partial<Record<DialogueId, ReviewStatus>>;
  treatmentStatus: Record<string, ReviewStatus>;
  applicationStatus: Partial<Record<ApplicationId, ReviewStatus>>;
};

export type EvaluationSection = {
  id:
    | "observation"
    | "assessment"
    | "treatment-plan"
    | "application-technique";
  title: string;
  score: number;
  maxScore: number;
  items: EvaluationItem[];
};

export type RecommendedPlanComparison = {
  minimum: string[];
  optimized: string[];
  differences: string[];
};

export type LearningRecommendation = {
  topicId: string;
  title: string;
  reason: string;
  priority: "alta" | "media";
};

export type CaseEvaluation = {
  score: number;
  sections: EvaluationSection[];
  reasoningSummary: {
    reading: string;
    essential: string[];
    correct: string[];
    redundant: string[];
    inadequate: string[];
    nextStep: string;
  };
  recommendedPlan: RecommendedPlanComparison;
  learningRecommendations: LearningRecommendation[];
};

export type AttemptRecord = {
  version: 2;
  id: string;
  templateId: string;
  variantId: string;
  caseTitle: string;
  variantTitle: string;
  score: number;
  previousBestScoreForCase: number | null;
  sectionScores: Record<string, number>;
  mistakeCodes: string[];
  learningRecommendations: string[];
  templateLearningTopicIds: string[];
  recommendedNextCaseIds: string[];
  dominantWeakTopics: string[];
  selectedObservationIds: ObservationId[];
  selectedDialogueIds: DialogueId[];
  selectedTreatmentIds: string[];
  selectedApplicationIds: ApplicationId[];
  summary: string;
  timestamp: string;
  durationSeconds: number;
};

export type TopicMastery = {
  topicId: string;
  title: string;
  masteryScore: number;
  recommendationCount: number;
  weakSignalCount: number;
  exposureCount: number;
};

export type RecommendedCase = {
  templateId: string;
  title: string;
  shortTitle: string;
  difficulty: CaseTemplate["difficulty"];
  reason: string;
  matchTopics: string[];
  averageScore: number | null;
  attempts: number;
};

export type CaseProgress = {
  templateId: string;
  title: string;
  attempts: number;
  averageScore: number | null;
  bestScore: number | null;
  latestScore: number | null;
  previousBestScore: number | null;
  hasCompleted: boolean;
};
