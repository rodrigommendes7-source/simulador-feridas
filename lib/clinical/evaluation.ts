import {
  getApplicationLabel,
  getLearningTopic,
  getLearningTopicTitle,
  getTreatment,
  getTreatmentLabel,
} from "./catalog.ts";
import type {
  AttemptReview,
  ApplicationId,
  AttemptInput,
  CaseEvaluation,
  CaseSession,
  EvaluationClassification,
  EvaluationSection,
  LearningRecommendation,
  ReviewStatus,
  TreatmentDefinition,
  TreatmentFunction,
} from "./types.ts";

const classificationWeights: Record<EvaluationClassification, number> = {
  essencial: 12,
  adequado: 6,
  redundante: -3,
  inadequado: -8,
};

function normalizeLearningTopicId(topicId: string) {
  return topicId === "materiais-desadequados" ? "decisao-clinica" : topicId;
}

function createSection(
  id: EvaluationSection["id"],
  title: string,
  maxScore: number
): EvaluationSection {
  return { id, title, score: 0, maxScore, items: [] };
}

function pushItem(
  section: EvaluationSection,
  sourceId: string | undefined,
  label: string,
  classification: EvaluationClassification,
  explanation: string,
  learningTopicIds: string[]
) {
  section.items.push({
    id: `${section.id}-${section.items.length + 1}`,
    sourceId,
    label,
    classification,
    explanation,
    learningTopicIds,
  });
}

function getSectionRawScore(section: EvaluationSection) {
  return section.items.reduce(
    (acc, item) => acc + classificationWeights[item.classification],
    0
  );
}

function finalizeSectionScore(section: EvaluationSection, attainableRawMax: number) {
  const rawScore = Math.max(0, Math.min(attainableRawMax, getSectionRawScore(section)));
  section.score =
    attainableRawMax > 0 ? Math.round((rawScore / attainableRawMax) * section.maxScore) : 0;
  return section;
}

function uniqueCanonicalTreatments(treatmentIds: string[]) {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  const selected: TreatmentDefinition[] = [];

  for (const treatmentId of treatmentIds) {
    const treatment = getTreatment(treatmentId);
    if (!treatment) continue;

    if (seen.has(treatment.equivalenceGroup)) {
      duplicates.add(treatment.id);
      continue;
    }

    seen.add(treatment.equivalenceGroup);
    selected.push(treatment);
  }

  return { selected, duplicates };
}

function treatmentMatchesGoal(
  treatment: TreatmentDefinition,
  matcher: { treatmentIds?: string[]; treatmentFunctions?: TreatmentFunction[] }
) {
  if (matcher.treatmentIds?.includes(treatment.id)) return true;
  if (matcher.treatmentFunctions?.some((fn) => treatment.functions.includes(fn))) return true;
  // Equivalência clínica: materiais do mesmo grupo equivalem-se nos goals por treatmentId
  if (matcher.treatmentIds) {
    for (const matcherId of matcher.treatmentIds) {
      const matcherTreatment = getTreatment(matcherId);
      if (matcherTreatment && matcherTreatment.equivalenceGroup === treatment.equivalenceGroup) {
        return true;
      }
    }
  }
  return false;
}

function buildObservationSection(session: CaseSession, attempt: AttemptInput) {
  const section = createSection("observation", "Observação", 15);
  const selected = new Set(attempt.observationIds);

  for (const definition of session.template.observationDefinitions) {
    const detail = session.variant.observationDetails[definition.id];
    if (!detail) continue;

    if (selected.has(definition.id)) {
      pushItem(
        section,
        definition.id,
        definition.label,
        definition.priority === "essencial" ? "essencial" : "adequado",
        `Observaste ${definition.label.toLowerCase()}: ${detail.detail}`,
        definition.learningTopicIds
      );
    } else {
      pushItem(
        section,
        definition.id,
        definition.label,
        definition.priority === "essencial" ? "inadequado" : "redundante",
        definition.priority === "essencial"
          ? `Faltou observar ${definition.label.toLowerCase()}, o que limita a leitura clínica do caso.`
          : `Podias ter explorado ${definition.label.toLowerCase()} para afinar o raciocínio clínico.`,
        definition.learningTopicIds
      );
    }
  }

  return section;
}

function buildAssessmentSection(session: CaseSession, attempt: AttemptInput) {
  const section = createSection("assessment", "Avaliação e diálogo", 15);
  const selected = new Set(attempt.dialogueIds);

  for (const prompt of session.template.dialoguePrompts) {
    if (selected.has(prompt.id)) {
      pushItem(
        section,
        prompt.id,
        prompt.label,
        prompt.priority === "essencial" ? "essencial" : "adequado",
        `Perguntaste sobre ${prompt.label.toLowerCase().replace("perguntar sobre ", "")}: ${session.variant.dialogueResponses[prompt.id]}`,
        prompt.learningTopicIds
      );
    } else {
      pushItem(
        section,
        prompt.id,
        prompt.label,
        prompt.priority === "essencial" ? "inadequado" : "redundante",
        prompt.priority === "essencial"
          ? "Faltou recolher este dado clínico, que influencia a segurança do plano."
          : "Explorar este ponto ajudaria a justificar melhor a decisão final.",
        prompt.learningTopicIds
      );
    }
  }

  return section;
}

function buildTreatmentSection(session: CaseSession, attempt: AttemptInput) {
  const section = createSection("treatment-plan", "Plano terapêutico", 50);
  const { selected, duplicates } = uniqueCanonicalTreatments(attempt.treatmentIds);
  const specialRules = session.variant.evaluationRules.filter((rule) => rule.target === "treatment");
  const claimedGoalIds = new Set<string>();

  for (const treatment of selected) {
    const forcedRule = specialRules.find((rule) => rule.appliesToIds.includes(treatment.id));

    if (forcedRule) {
      pushItem(
        section,
        treatment.id,
        treatment.label,
        forcedRule.classification,
        forcedRule.reason,
        forcedRule.learningTopicIds
      );
      continue;
    }

    const matchedGoals = session.variant.clinicalTargets.filter((goal) =>
      treatmentMatchesGoal(treatment, goal.matcher)
    );
    const availableGoals = matchedGoals.filter((goal) => !claimedGoalIds.has(goal.id));

    if (matchedGoals.length === 0) {
      pushItem(
        section,
        treatment.id,
        treatment.label,
        "redundante",
        "Este tratamento não responde claramente ao problema dominante da variante atual.",
        treatment.learningTopicIds
      );
      continue;
    }

    if (availableGoals.length === 0) {
      pushItem(
        section,
        treatment.id,
        treatment.label,
        "redundante",
        "Este tratamento repete uma função já coberta no plano e não acrescenta novo valor clínico.",
        treatment.learningTopicIds
      );
      continue;
    }

    const essentialGoal = availableGoals.find((goal) => goal.priority === "essencial");
    const chosenGoal = essentialGoal ?? availableGoals[0];
    claimedGoalIds.add(chosenGoal.id);
    pushItem(
      section,
      treatment.id,
      treatment.label,
      chosenGoal.priority === "essencial" ? "essencial" : "adequado",
      chosenGoal.rationale,
      [...chosenGoal.learningTopicIds, ...treatment.learningTopicIds]
    );
  }

  for (const duplicateId of duplicates) {
    pushItem(
      section,
      duplicateId,
      getTreatmentLabel(duplicateId),
      "redundante",
      "Selecionaste um material equivalente ao já escolhido, sem acrescentar novo valor clínico.",
      ["materiais-desadequados", "decisao-clinica"]
    );
  }

  for (const goal of session.variant.clinicalTargets.filter(
    (item) => item.matcher.treatmentIds || item.matcher.treatmentFunctions
  )) {
    const fulfilled = selected.some((treatment) => treatmentMatchesGoal(treatment, goal.matcher));
    if (!fulfilled && goal.priority === "essencial") {
      pushItem(
        section,
        undefined,
        goal.label,
        "inadequado",
        `Faltou um elemento essencial: ${goal.rationale}`,
        goal.learningTopicIds
      );
    }
  }

  if (selected.length === 0) {
    pushItem(
      section,
      undefined,
      "Sem tratamento selecionado",
      "inadequado",
      "Sem plano terapêutico, não é possível responder ao estado da ferida.",
      ["decisao-clinica"]
    );
  }

  return section;
}

function applicationMatchesGoal(
  applicationId: ApplicationId,
  matcher: { applicationIds?: ApplicationId[] }
) {
  return matcher.applicationIds?.includes(applicationId) ?? false;
}

function classifyApplicationByRules(
  applicationDef: { regras?: { condicoes_ideais: Record<string, number[]>; condicoes_parciais?: Record<string, number[]>; contraindicacoes: Record<string, number[]>[] } },
  woundVariables: Record<string, number>
): "correto" | "parcial" | "incorreto" | null {
  if (!applicationDef.regras) return null;
  const { condicoes_ideais, condicoes_parciais, contraindicacoes } = applicationDef.regras;

  function matchesAll(cond: Record<string, number[]>): boolean {
    for (const [key, vals] of Object.entries(cond)) {
      if (!vals || vals.length === 0) continue;
      if (!vals.includes(woundVariables[key] as number)) return false;
    }
    return true;
  }

  if (contraindicacoes.some((c) => matchesAll(c))) return "incorreto";
  if (matchesAll(condicoes_ideais)) return "correto";
  if (condicoes_parciais && matchesAll(condicoes_parciais)) return "parcial";
  return "parcial";
}

function buildApplicationSection(session: CaseSession, attempt: AttemptInput) {
  const section = createSection("application-technique", "Técnica de aplicação", 20);
  const selected = new Set(attempt.applicationIds);
  const specialRules = session.variant.evaluationRules.filter((rule) => rule.target === "application");
  const woundVars = (session.variant.woundVariables ?? {}) as Record<string, number>;

  for (const applicationId of session.variant.applicationOptions) {
    const label = getApplicationLabel(session.template, applicationId);
    const specialRule = specialRules.find((rule) => rule.appliesToIds.includes(applicationId));

    if (selected.has(applicationId) && specialRule) {
      pushItem(
        section,
        applicationId,
        label,
        specialRule.classification,
        specialRule.reason,
        specialRule.learningTopicIds
      );
      continue;
    }

    const matchingGoal = session.variant.clinicalTargets.find((goal) =>
      applicationMatchesGoal(applicationId, goal.matcher)
    );

    if (!selected.has(applicationId) && matchingGoal?.priority === "essencial") {
      pushItem(
        section,
        applicationId,
        label,
        "inadequado",
        `Faltou esta decisão técnica: ${matchingGoal.rationale}`,
        matchingGoal.learningTopicIds
      );
      continue;
    }

    if (selected.has(applicationId) && matchingGoal) {
      pushItem(
        section,
        applicationId,
        label,
        matchingGoal.priority === "essencial" ? "essencial" : "adequado",
        matchingGoal.rationale,
        matchingGoal.learningTopicIds
      );
      continue;
    }

    // Sem goal específico: avaliar pela regras da applicationDefinition (condicoes_ideais/contraindicacoes)
    if (!matchingGoal) {
      const appDef = session.template.applicationDefinitions.find((d) => d.id === applicationId);
      if (appDef) {
        const ruleClassification = classifyApplicationByRules(appDef as Parameters<typeof classifyApplicationByRules>[0], woundVars);
        if (ruleClassification !== null) {
          if (selected.has(applicationId)) {
            if (ruleClassification === "incorreto") {
              pushItem(section, applicationId, label, "inadequado",
                "Esta técnica está contraindicada para o estado atual da ferida.",
                appDef.learningTopicIds);
            } else {
              pushItem(section, applicationId, label,
                ruleClassification === "correto" ? "adequado" : "redundante",
                ruleClassification === "correto"
                  ? "Técnica adequada para o estado atual da ferida."
                  : "Técnica aceitável mas não prioritária para este estado da ferida.",
                appDef.learningTopicIds);
            }
          } else if (ruleClassification === "correto") {
            pushItem(section, applicationId, label, "redundante",
              "Esta técnica seria adequada mas não foi selecionada.",
              appDef.learningTopicIds);
          }
        }
      }
    }
  }

  if (selected.size === 0) {
    pushItem(
      section,
      undefined,
      "Sem técnica registada",
      "inadequado",
      "O plano terapêutico precisa de uma forma de aplicação coerente para ser clinicamente seguro.",
      ["decisao-clinica"]
    );
  }

  return section;
}

function buildAttemptWithSelection<K extends keyof AttemptInput>(
  field: K,
  selection: AttemptInput[K]
): AttemptInput {
  return {
    observationIds: [],
    dialogueIds: [],
    treatmentIds: [],
    applicationIds: [],
    [field]: selection,
  };
}

function getBestRawScoreForSelections<T, K extends keyof AttemptInput>(
  options: readonly T[],
  field: K,
  buildSection: (session: CaseSession, attempt: AttemptInput) => EvaluationSection,
  session: CaseSession
) {
  let bestScore = 0;
  const subsetCount = 1 << options.length;

  for (let mask = 0; mask < subsetCount; mask += 1) {
    const selection: T[] = [];

    for (let index = 0; index < options.length; index += 1) {
      if ((mask & (1 << index)) !== 0) {
        selection.push(options[index]!);
      }
    }

    const attempt = buildAttemptWithSelection(field, selection as AttemptInput[K]);
    bestScore = Math.max(bestScore, getSectionRawScore(buildSection(session, attempt)));
  }

  return bestScore;
}

function getBestSelectionForSelections<T, K extends keyof AttemptInput>(
  options: readonly T[],
  field: K,
  buildSection: (session: CaseSession, attempt: AttemptInput) => EvaluationSection,
  session: CaseSession
) {
  let bestScore = -1;
  let bestSelection: T[] = [];
  const subsetCount = 1 << options.length;

  for (let mask = 0; mask < subsetCount; mask += 1) {
    const selection: T[] = [];

    for (let index = 0; index < options.length; index += 1) {
      if ((mask & (1 << index)) !== 0) {
        selection.push(options[index]!);
      }
    }

    const attempt = buildAttemptWithSelection(field, selection as AttemptInput[K]);
    const score = getSectionRawScore(buildSection(session, attempt));

    if (score > bestScore) {
      bestScore = score;
      bestSelection = selection;
    }
  }

  return bestSelection;
}

function toReviewStatus(classification: EvaluationClassification): ReviewStatus {
  if (classification === "essencial" || classification === "adequado") return "correct";
  if (classification === "redundante" || classification === "inadequado") return "incorrect";
  return null;
}

function buildStatusMap(
  availableIds: readonly string[],
  selectedIds: readonly string[],
  idealIds: readonly string[],
  selectedStatuses: Map<string, ReviewStatus>
) {
  return Object.fromEntries(
    availableIds.map((id) => {
      const explicitStatus = selectedStatuses.get(id) ?? null;
      if (explicitStatus) return [id, explicitStatus];
      if (!selectedIds.includes(id) && idealIds.includes(id)) return [id, "missed"];
      return [id, null];
    })
  ) as Record<string, ReviewStatus>;
}

function buildLearningRecommendations(sections: EvaluationSection[]): LearningRecommendation[] {
  const frequencies = new Map<string, { count: number; reasons: string[] }>();

  for (const section of sections) {
    for (const item of section.items) {
      if (item.classification === "essencial" || item.classification === "adequado") continue;
      for (const topicId of item.learningTopicIds) {
        const normalizedTopicId = normalizeLearningTopicId(topicId);
        const current = frequencies.get(normalizedTopicId) ?? { count: 0, reasons: [] };
        current.count += 1;
        current.reasons.push(item.explanation);
        frequencies.set(normalizedTopicId, current);
      }
    }
  }

  return Array.from(frequencies.entries())
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 4)
    .map(([topicId, value]) => ({
      topicId,
      title: getLearningTopicTitle(topicId),
      reason:
        value.reasons[0] ??
        `Vale a pena rever ${getLearningTopicTitle(topicId).toLowerCase()} para ganhar consistência.`,
      priority: value.count >= 2 ? "alta" : "media",
    }));
}

function summarizeByClassification(
  sections: EvaluationSection[],
  classification: EvaluationClassification
) {
  return sections
    .flatMap((section) => section.items)
    .filter((item) => item.classification === classification)
    .map((item) => `${item.label}: ${item.explanation}`)
    .slice(0, 5);
}

function buildRecommendedPlanDifferences(session: CaseSession, attempt: AttemptInput) {
  const selectedLabels = new Set(attempt.treatmentIds.map((item) => getTreatmentLabel(item)));
  const applicationLabels = new Set(
    attempt.applicationIds.map((item) => getApplicationLabel(session.template, item))
  );

  const differences = [
    ...session.variant.recommendedPlan.minimum,
    ...session.variant.recommendedPlan.optimized,
  ]
    .filter((label, index, arr) => arr.indexOf(label) === index)
    .filter((label) => !selectedLabels.has(label) && !applicationLabels.has(label));

  return {
    minimum: session.variant.recommendedPlan.minimum,
    optimized: session.variant.recommendedPlan.optimized,
    differences,
  };
}

function buildReading(session: CaseSession) {
  const { woundState } = session.variant;
  return `Ferida com exsudado ${woundState.exudate}, tecido ${woundState.tissue.replace("-", " ")}, infeção ${woundState.infection.replace("-", " ")} e pele peri-ferida ${woundState.periwound}.`;
}

function sectionPercentage(section: EvaluationSection) {
  if (section.maxScore <= 0) return 0;
  return Math.round((section.score / section.maxScore) * 100);
}

export function evaluateCaseAttempt(
  session: CaseSession,
  attempt: AttemptInput
): CaseEvaluation {
  const sections = [
    finalizeSectionScore(
      buildObservationSection(session, attempt),
      getBestRawScoreForSelections(
        session.template.observationDefinitions.map((item) => item.id),
        "observationIds",
        buildObservationSection,
        session
      )
    ),
    finalizeSectionScore(
      buildAssessmentSection(session, attempt),
      getBestRawScoreForSelections(
        session.template.dialoguePrompts.map((item) => item.id),
        "dialogueIds",
        buildAssessmentSection,
        session
      )
    ),
    finalizeSectionScore(
      buildTreatmentSection(session, attempt),
      getBestRawScoreForSelections(
        session.variant.availableTreatments,
        "treatmentIds",
        buildTreatmentSection,
        session
      )
    ),
    finalizeSectionScore(
      buildApplicationSection(session, attempt),
      getBestRawScoreForSelections(
        session.variant.applicationOptions,
        "applicationIds",
        buildApplicationSection,
        session
      )
    ),
  ];

  const totalScore = Math.round(sections.reduce((acc, section) => acc + section.score, 0));

  const essential = summarizeByClassification(sections, "essencial");
  const correct = summarizeByClassification(sections, "adequado");
  const redundant = summarizeByClassification(sections, "redundante");
  const inadequate = summarizeByClassification(sections, "inadequado");
  const weakestSection = [...sections].sort(
    (a, b) => sectionPercentage(a) - sectionPercentage(b)
  )[0];
  const weakestTopic = weakestSection.items
    .flatMap((item) => item.learningTopicIds)
    .map(normalizeLearningTopicId)
    .find((topicId) => getLearningTopic(topicId));
  const learningRecommendations = buildLearningRecommendations(sections);

  return {
    score: Math.max(0, Math.min(100, totalScore)),
    sections,
    reasoningSummary: {
      reading: buildReading(session),
      essential,
      correct,
      redundant,
      inadequate,
      nextStep: weakestTopic
        ? `Reforça o tema "${getLearningTopic(weakestTopic)?.title}" para corrigires o domínio mais frágil desta tentativa.`
        : "Mantém um plano focado no problema dominante e reavalia a resposta clínica.",
    },
    recommendedPlan: buildRecommendedPlanDifferences(session, attempt),
    learningRecommendations,
  };
}

export function getIdealAttempt(session: CaseSession): AttemptInput {
  return {
    observationIds: getBestSelectionForSelections(
      session.template.observationDefinitions.map((item) => item.id),
      "observationIds",
      buildObservationSection,
      session
    ),
    dialogueIds: getBestSelectionForSelections(
      session.template.dialoguePrompts.map((item) => item.id),
      "dialogueIds",
      buildAssessmentSection,
      session
    ),
    treatmentIds: getBestSelectionForSelections(
      session.variant.availableTreatments,
      "treatmentIds",
      buildTreatmentSection,
      session
    ),
    applicationIds: getBestSelectionForSelections(
      session.variant.applicationOptions,
      "applicationIds",
      buildApplicationSection,
      session
    ),
  };
}

export function buildAttemptReview(
  session: CaseSession,
  attempt: AttemptInput
): AttemptReview {
  const idealAttempt = getIdealAttempt(session);
  const evaluation = evaluateCaseAttempt(session, attempt);
  const selectedStatuses = new Map<string, ReviewStatus>();

  for (const section of evaluation.sections) {
    for (const item of section.items) {
      if (!item.sourceId) continue;
      const status = toReviewStatus(item.classification);
      if (status) {
        selectedStatuses.set(item.sourceId, status);
      }
    }
  }

  return {
    idealAttempt,
    observationStatus: buildStatusMap(
      session.template.observationDefinitions.map((item) => item.id),
      attempt.observationIds,
      idealAttempt.observationIds,
      selectedStatuses
    ),
    dialogueStatus: buildStatusMap(
      session.template.dialoguePrompts.map((item) => item.id),
      attempt.dialogueIds,
      idealAttempt.dialogueIds,
      selectedStatuses
    ),
    treatmentStatus: buildStatusMap(
      session.variant.availableTreatments,
      attempt.treatmentIds,
      idealAttempt.treatmentIds,
      selectedStatuses
    ),
    applicationStatus: buildStatusMap(
      session.variant.applicationOptions,
      attempt.applicationIds,
      idealAttempt.applicationIds,
      selectedStatuses
    ),
  };
}