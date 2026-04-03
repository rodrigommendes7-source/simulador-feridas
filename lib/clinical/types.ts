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
  | "direto_seco";

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
