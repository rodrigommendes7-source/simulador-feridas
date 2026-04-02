import type { CasoConfig } from "@/app/types/caso-config";
import type {
  AplicacaoId,
  AvaliacaoSecao,
  FeedbackLink,
  PerguntaId,
  TratamentoId,
} from "@/app/types/simulador";

export type ObservationId =
  | "imagem"
  | "dimensoes"
  | "exsudado"
  | "cheiro"
  | "tecidos"
  | "pele_perilesional";

export type CaseId = "1" | "2" | "3" | "4";

export type CaseDifficulty = "introdutorio" | "intermedio" | "avancado";

export type ObservationDefinition = {
  id: ObservationId;
  actionLabel: string;
  detailLabel: string;
  detailText: string;
  score: number;
  successText: string;
  missingText: string;
  lossReason: string;
};

export type DialogueRule = {
  id: PerguntaId;
  score: number;
  successText: string;
  missingText?: string;
  lossReason: string;
};

export type ApplicationRule =
  | {
      type: "required";
      id: AplicacaoId;
      score: number;
      successText: string;
      missingText?: string;
      lossReason: string;
    }
  | {
      type: "penalty";
      id: AplicacaoId;
      score: number;
      errorText: string;
      lossReason: string;
    }
  | {
      type: "bonus";
      requiredIds: AplicacaoId[];
      blockedIds?: AplicacaoId[];
      score: number;
      successText: string;
      lossReason: string;
    }
  | {
      type: "excess";
      minimumSelected: number;
      score: number;
      excessText: string;
      lossReason: string;
    };

export type ScoreFeedbackBand = {
  minScore: number;
  text: string;
};

export type CaseTreatmentEvaluator = (
  selectedTreatmentIds: TratamentoId[]
) => AvaliacaoSecao;

export type CaseDefinition = {
  id: CaseId;
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  competencies: string;
  status: "disponivel" | "preparacao";
  difficulty: CaseDifficulty;
  sequence: number;
  estimatedMinutes: number;
  learningTopicIds: string[];
  introEyebrow?: string;
  introTitle: string;
  introSummary: string;
  introFocusLabel?: string;
  introFocusText: string;
  patientBanner: string;
  objective: string;
  imageSrc: string;
  imageAlt: string;
  imageFit?: "cover" | "contain";
  caseTitleForHistory: string;
  config: CasoConfig;
  observationItems: ObservationDefinition[];
  dialogueRules: DialogueRule[];
  treatmentEvaluator: CaseTreatmentEvaluator;
  applicationRules: ApplicationRule[];
  feedbackBands: ScoreFeedbackBand[];
};

export type CaseAttempt = {
  observationIds: ObservationId[];
  questionIds: PerguntaId[];
  treatmentIds: TratamentoId[];
  applicationIds: AplicacaoId[];
};

export type CaseEvaluation = {
  sections: AvaliacaoSecao[];
  score: number;
  feedback: string;
  feedbackLinks: FeedbackLink[];
};
