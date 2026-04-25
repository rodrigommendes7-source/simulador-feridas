"use client";

import { startTransition, useEffect, useMemo, useState } from "react";
import {
  buildAttemptRecord,
  buildAttemptReview,
  buildVariantRotation,
  countAttemptsForCase,
  evaluateCaseAttempt,
  getCaseSession,
  getCaseTemplate,
  type ApplicationId,
  type DialogueId,
  type ObservationId,
  loadAttemptHistory,
  saveAttemptRecord,
  getPreviousBestScoreForCase,
} from "@/lib/clinical";
import {
  WOUND_VARIABLE_DISPLAY_LABELS,
  WOUND_VARIABLES_EXTRA,
  WOUND_VARIABLES_MAIN,
  getWoundVariableLabel,
} from "@/lib/clinical/wound-display";
import type { WoundVariables } from "@/lib/clinical";

// Mapeia cada variável clínica à observação ou pergunta de diálogo que a desvenda
const VARIABLE_UNLOCK_MAP: Record<keyof WoundVariables, { type: "observation" | "dialogue"; id: string }> = {
  exsudado:          { type: "observation", id: "exsudado" },
  infeccao:          { type: "observation", id: "tecidos" },
  tecido:            { type: "observation", id: "tecidos" },
  odor:              { type: "observation", id: "cheiro" },
  humidade:          { type: "observation", id: "exsudado" },
  profundidade:      { type: "observation", id: "dimensoes" },
  bordos:            { type: "observation", id: "imagem" },
  pele_perilesional: { type: "observation", id: "pele_perilesional" },
  dor:               { type: "dialogue",    id: "dor" },
  hemorragia:        { type: "observation", id: "imagem" },
  etiologia:         { type: "dialogue",    id: "duracao" },
  perfusao:          { type: "dialogue",    id: "mobilidade" },
};
import { CaseDialoguePanel } from "@/components/case-player/case-dialogue-panel";
import { CaseIntro } from "@/components/case-player/case-intro";
import { CaseObservationPanel } from "@/components/case-player/case-observation-panel";
import { CaseResultSummary } from "@/components/case-player/case-result-summary";
import { CaseTreatmentPlanner } from "@/components/case-player/case-treatment-planner";
import { CaseVisualIdentification } from "@/components/case-player/case-visual-identification";
import type { VisualIdentificationSubmission } from "@/lib/clinical/types";

type Step = "observacao" | "identificacao" | "dialogo" | "tratamento" | "resultado";

function resolveSession(templateId: string) {
  const history = loadAttemptHistory();
  const attemptCount = countAttemptsForCase(history, templateId);
  const rotatedVariant = buildVariantRotation(templateId, attemptCount);

  return getCaseSession(templateId, rotatedVariant?.id) ?? getCaseSession(templateId);
}

export function CasePlayer({ templateId }: { templateId: string }) {
  const template = getCaseTemplate(templateId);

  if (!template) {
    throw new Error(`Case template not found: ${templateId}`);
  }

  const [session, setSession] = useState(() => {
    const resolvedSession = getCaseSession(templateId);
    if (!resolvedSession) {
      throw new Error(`Case template has no variant: ${templateId}`);
    }
    return resolvedSession;
  });

  const [started, setStarted] = useState(false);
  const [step, setStep] = useState<Step>("observacao");
  const [reviewMode, setReviewMode] = useState(false);
  const [showTutorial, setShowTutorial] = useState(() => {
    if (typeof window === "undefined") return false;
    return !localStorage.getItem("tutorial-visto");
  });
const [startedAt, setStartedAt] = useState<number | null>(null);
  const [observationIds, setObservationIds] = useState<ObservationId[]>([]);
  const [visualSubmission, setVisualSubmission] = useState<VisualIdentificationSubmission>({ tissues: [], exudate: [], edges: [] });
  const [dialogueIds, setDialogueIds] = useState<DialogueId[]>([]);
  const [activeDialogueId, setActiveDialogueId] = useState<DialogueId | null>(null);
  const [treatmentIds, setTreatmentIds] = useState<string[]>([]);
  const [applicationIds, setApplicationIds] = useState<ApplicationId[]>([]);
  const [previousBestScore, setPreviousBestScore] = useState<number | null>(null);

  const attempt = useMemo(
    () => ({
      observationIds,
      visualSubmission,
      dialogueIds,
      treatmentIds,
      applicationIds,
    }),
    [observationIds, visualSubmission, dialogueIds, treatmentIds, applicationIds]
  );

  const evaluation = useMemo(() => evaluateCaseAttempt(session, attempt), [session, attempt]);
  const review = useMemo(() => buildAttemptReview(session, attempt), [session, attempt]);

  const completedObservation = observationIds.includes("imagem") && observationIds.length >= 3;
  const completedVisualIdentification = step !== "observacao" || observationIds.includes("imagem");
  const completedDialogue = dialogueIds.length >= 2;
  const completedTreatment = treatmentIds.length >= 1;
  const completedApplication = applicationIds.length >= 1;
  const readyToSubmit =
    completedObservation && completedDialogue && completedTreatment && completedApplication;

  function resetCase() {
    const nextSession = resolveSession(templateId);

    setStarted(false);
    setStep("observacao");
    setReviewMode(false);
    setStartedAt(null);
    setObservationIds([]);
    setVisualSubmission({ tissues: [], exudate: [], edges: [] });
    setDialogueIds([]);
    setActiveDialogueId(null);
    setTreatmentIds([]);
    setApplicationIds([]);
    setPreviousBestScore(null);
    if (nextSession) {
      setSession(nextSession);
    }
  }

  function startCase() {
    setStarted(true);
    setReviewMode(false);
    setStartedAt(Date.now());
  }

  function revealObservation(id: ObservationId) {
    if (reviewMode) return;
    setObservationIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }

  function askDialogue(id: DialogueId) {
    if (!reviewMode) {
      setDialogueIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    }
    setActiveDialogueId(id);
  }

  function toggleTreatment(id: string) {
    if (reviewMode) return;
    setTreatmentIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  function toggleApplication(id: ApplicationId) {
    if (reviewMode) return;
    setApplicationIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  function finishCase() {
    if (!readyToSubmit) return;

    const history = loadAttemptHistory();
    const priorBestScore = getPreviousBestScoreForCase(history, session.template.id);

    saveAttemptRecord(
      buildAttemptRecord({
        evaluation,
        history,
        templateId: session.template.id,
        variantId: session.variant.id,
        attempt,
        durationSeconds: startedAt ? Math.round((Date.now() - startedAt) / 1000) : 0,
      })
    );

    setPreviousBestScore(priorBestScore);
    setReviewMode(false);
    setStep("resultado");
  }

  function openReview() {
    setReviewMode(true);
    setStep("observacao");
    setActiveDialogueId(dialogueIds[0] ?? review.idealAttempt.dialogueIds[0] ?? null);
  }

  const stageGuidance = reviewMode
    ? "Estás em modo de revisão. As escolhas corretas aparecem a verde, as erradas a vermelho e o que faltou selecionar aparece a azul claro."
    : step === "observacao"
      ? completedObservation
        ? "Já tens observação mínima suficiente. Avança para identificar os tecidos e o exsudado visíveis."
        : observationIds.includes("imagem")
          ? "Agora confirma os achados-chave do leito para definires o problema dominante."
          : "Começa por observar a imagem e por recolher pelo menos dois achados clínicos essenciais."
      : step === "identificacao"
        ? "Com base na imagem, seleciona os tecidos, o exsudado e as características dos bordos que identificas."
        : step === "dialogo"
          ? completedDialogue
            ? "Já recolheste dados suficientes para justificar a decisão terapêutica."
            : dialogueIds.length === 0
              ? "Explora primeiro a dor e o contexto funcional para enquadrar o risco e o conforto."
              : "Falta consolidar o diálogo com mais uma pergunta clinicamente relevante."
          : completedTreatment && completedApplication
            ? "O plano e a técnica já estão completos para receberes o feedback final."
            : completedTreatment
              ? "Já tens materiais escolhidos, mas ainda falta definir a técnica de aplicação."
              : "Escolhe um material principal e confirma como o vais aplicar de forma segura.";

  useEffect(() => {
    startTransition(() => {
      const resolvedSession = resolveSession(templateId);
      if (resolvedSession) {
        setSession((current) =>
          current.variant.id === resolvedSession.variant.id ? current : resolvedSession
        );
      }
    });
  }, [templateId]);

  const completedVisualStep =
    visualSubmission.tissues.length > 0 ||
    visualSubmission.exudate.length > 0 ||
    visualSubmission.edges.length > 0 ||
    step !== "observacao";

  const progressChecklist = [
    {
      label: "Observação mínima",
      done: completedObservation,
      detail: completedObservation
        ? `${observationIds.length} achados observados`
        : "Revê a imagem e recolhe pelo menos três achados clínicos",
    },
    {
      label: "Identificação visual",
      done: completedVisualStep,
      detail: completedVisualStep
        ? "Tecidos, exsudado e bordos identificados"
        : "Interpreta o que vês na imagem",
    },
    {
      label: "Avaliação e diálogo",
      done: completedDialogue,
      detail: completedDialogue
        ? `${dialogueIds.length} perguntas feitas`
        : "Faz pelo menos duas perguntas clinicamente relevantes",
    },
    {
      label: "Plano terapêutico",
      done: completedTreatment,
      detail: completedTreatment
        ? `${treatmentIds.length} ${treatmentIds.length === 1 ? "material selecionado" : "materiais selecionados"}`
        : "Seleciona pelo menos um material principal",
    },
    {
      label: "Técnica de aplicação",
      done: completedApplication,
      detail: completedApplication
        ? `${applicationIds.length} decisões de aplicação`
        : "Escolhe pelo menos uma decisão técnica",
    },
  ];

  function dismissTutorial() {
    localStorage.setItem("tutorial-visto", "1");
    setShowTutorial(false);
  }

  return (
    <>
    {showTutorial && (
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1000,
          background: "rgba(0,0,0,0.65)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "var(--space-2xl)",
        }}
        onClick={dismissTutorial}
      >
        <div
          style={{
            background: "var(--color-surface)",
            border: "var(--border-default)",
            borderRadius: "var(--radius-xl)",
            padding: "var(--space-3xl)",
            maxWidth: "480px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-lg)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div>
            <p className="text-label" style={{ color: "var(--color-accent)", marginBottom: "var(--space-xs)" }}>
              Como funciona
            </p>
            <h2 className="text-h2">Simulador de Feridas</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
            {[
              { step: "1", title: "Observa a ferida", body: "Começa por rever a imagem clínica e recolhe os achados essenciais: exsudado, tecidos e pele perilesional." },
              { step: "2", title: "Identifica o que vês", body: "Classifica os tecidos, o exsudado e as características dos bordos com base na imagem observada." },
              { step: "3", title: "Faz perguntas e define o plano", body: "Usa o diálogo para completar a leitura clínica, depois escolhe materiais e técnica de aplicação." },
              { step: "4", title: "Recebe feedback detalhado", body: "Cada escolha é avaliada com base nos objetivos clínicos do caso e nos princípios de decisão." },
            ].map(({ step: s, title, body }) => (
              <div key={s} style={{ display: "flex", gap: "var(--space-md)" }}>
                <div
                  style={{
                    flexShrink: 0,
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: "var(--color-accent-subtle)",
                    border: "var(--border-accent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "var(--text-label)",
                    fontWeight: "var(--weight-medium)",
                    color: "var(--color-accent)",
                  }}
                >
                  {s}
                </div>
                <div>
                  <p style={{ fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)", fontSize: "var(--text-body)" }}>{title}</p>
                  <p className="text-body" style={{ marginTop: "2px" }}>{body}</p>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="btn btn-primary"
            style={{ width: "100%" }}
            onClick={dismissTutorial}
          >
            Começar
          </button>
        </div>
      </div>
    )}
    <main className="-mx-6 -my-4 flex h-[calc(100vh-52px)] overflow-hidden">
      {!started ? (
        <div className="h-full w-full overflow-y-auto">
          <CaseIntro session={session} onStart={startCase} />
        </div>
      ) : step === "resultado" ? (
        <div className="h-full w-full overflow-y-auto">
          <CaseResultSummary
            session={session}
            evaluation={evaluation}
            attempt={attempt}
            previousBestScore={previousBestScore}
            onReview={openReview}
            onReset={resetCase}
          />
        </div>
      ) : (
        <>
          {/* ── Sidebar ─────────────────────────────────────────────────────── */}
          <aside
            style={{
              width: "14rem",
              flexShrink: 0,
              overflowY: "auto",
              borderRight: "var(--border-default)",
              padding: "var(--space-sm)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-sm)",
            }}
          >
            {/* Identidade do caso */}
            <div
              style={{
                background: "var(--color-surface)",
                border: "var(--border-default)",
                borderRadius: "var(--radius-lg)",
                padding: "var(--space-md)",
              }}
            >
              <p className="text-label" style={{ color: "var(--color-accent)" }}>
                Caso ativo
              </p>
              <h1
                style={{
                  marginTop: "var(--space-xs)",
                  fontSize: "var(--text-h3)",
                  fontWeight: "var(--weight-medium)",
                  color: "var(--color-text-primary)",
                }}
              >
                {session.template.shortTitle}
              </h1>
              <p
                className="text-body"
                style={{ marginTop: "2px", color: "var(--color-text-secondary)" }}
              >
                {session.template.title}
              </p>
              <div
                style={{
                  marginTop: "var(--space-xs)",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "var(--space-xs)",
                }}
              >
                <span className="badge badge-info">{session.template.difficulty}</span>
                <span className="badge badge-info">{session.template.estimatedMinutes} min</span>
              </div>
            </div>

            {/* Navegação */}
            <div
              style={{
                background: "var(--color-surface)",
                border: "var(--border-default)",
                borderRadius: "var(--radius-lg)",
                padding: "var(--space-md)",
              }}
            >
              <p className="text-label" style={{ color: "var(--color-warning)" }}>
                Navegação
              </p>
              <div
                style={{
                  marginTop: "var(--space-sm)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-xs)",
                }}
              >
                {([
                  ["observacao", "Observação"],
                  ["identificacao", "Identificação"],
                  ["dialogo", "Diálogo"],
                  ["tratamento", "Tratamento"],
                ] as [Step, string][]).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setStep(id)}
                    style={
                      step === id
                        ? {
                            width: "100%",
                            textAlign: "left",
                            padding: "var(--space-xs) var(--space-sm)",
                            borderRadius: "var(--radius-md)",
                            border: "0.5px solid var(--color-accent)",
                            background: "var(--color-elevated)",
                            color: "var(--color-accent)",
                            fontWeight: "var(--weight-medium)",
                            fontSize: "var(--text-body)",
                            cursor: "pointer",
                          }
                        : {
                            width: "100%",
                            textAlign: "left",
                            padding: "var(--space-xs) var(--space-sm)",
                            borderRadius: "var(--radius-md)",
                            border: "var(--border-default)",
                            background: "transparent",
                            color: "var(--color-text-secondary)",
                            fontSize: "var(--text-body)",
                            cursor: "pointer",
                          }
                    }
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Progresso */}
            <div
              style={{
                background: "var(--color-surface)",
                border: "var(--border-default)",
                borderRadius: "var(--radius-lg)",
                padding: "var(--space-md)",
              }}
            >
              <p className="text-label" style={{ color: "var(--color-info)" }}>
                Progresso
              </p>
              <div
                style={{
                  marginTop: "var(--space-sm)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-xs)",
                }}
              >
                {progressChecklist.map((item) => (
                  <div
                    key={item.label}
                    style={
                      item.done
                        ? {
                            borderRadius: "var(--radius-md)",
                            border: "0.5px solid var(--color-success-border)",
                            background: "var(--color-success-subtle)",
                            padding: "var(--space-xs) var(--space-sm)",
                          }
                        : {
                            borderRadius: "var(--radius-md)",
                            border: "var(--border-default)",
                            background: "var(--color-elevated)",
                            padding: "var(--space-xs) var(--space-sm)",
                          }
                    }
                  >
                    <p
                      style={{
                        fontSize: "var(--text-label)",
                        fontWeight: "var(--weight-medium)",
                        color: "var(--color-text-primary)",
                        textTransform: "uppercase",
                        letterSpacing: "var(--tracking-label)",
                      }}
                    >
                      {item.label}
                    </p>
                    <p
                      style={{
                        marginTop: "1px",
                        fontSize: "var(--text-label)",
                        color: "var(--color-text-secondary)",
                        lineHeight: 1.4,
                      }}
                    >
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Variáveis clínicas — desbloqueadas progressivamente */}
            {session.variant.woundVariables ? (() => {
              const isUnlocked = (key: keyof WoundVariables) => {
                if (reviewMode) return true;
                const rule = VARIABLE_UNLOCK_MAP[key];
                return rule.type === "observation"
                  ? observationIds.includes(rule.id as ObservationId)
                  : dialogueIds.includes(rule.id as DialogueId);
              };
              const visibleMain  = WOUND_VARIABLES_MAIN.filter(isUnlocked);
              const visibleExtra = reviewMode ? WOUND_VARIABLES_EXTRA.filter(isUnlocked) : [];
              const anyVisible   = visibleMain.length > 0 || visibleExtra.length > 0;

              return (
                <div
                  style={{
                    background: "var(--color-surface)",
                    border: "var(--border-default)",
                    borderRadius: "var(--radius-lg)",
                    padding: "var(--space-md)",
                  }}
                >
                  <p className="text-label" style={{ color: "var(--color-warning)" }}>
                    Variáveis clínicas
                  </p>
                  {anyVisible ? (
                    <div
                      style={{
                        marginTop: "var(--space-sm)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--space-xs)",
                      }}
                    >
                      {[...visibleMain, ...visibleExtra].map((key) => {
                        const value = session.variant.woundVariables![key] as number;
                        return (
                          <div
                            key={key}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: "var(--space-sm)",
                              borderRadius: "var(--radius-md)",
                              border: "var(--border-default)",
                              background: "var(--color-elevated)",
                              padding: "2px var(--space-sm)",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "var(--text-label)",
                                color: "var(--color-text-secondary)",
                              }}
                            >
                              {WOUND_VARIABLE_DISPLAY_LABELS[key]}
                            </span>
                            <span
                              style={{
                                fontSize: "var(--text-label)",
                                fontWeight: "var(--weight-medium)",
                                color: "var(--color-text-primary)",
                              }}
                            >
                              {getWoundVariableLabel(key, value)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p
                      className="text-body"
                      style={{ marginTop: "var(--space-xs)", color: "var(--color-text-disabled)" }}
                    >
                      Aparece à medida que observas e perguntas.
                    </p>
                  )}
                </div>
              );
            })() : null}
          </aside>

          {/* ── Área principal ──────────────────────────────────────────────── */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-sm)",
              overflow: "hidden",
              padding: "var(--space-md)",
            }}
          >
            {/* Banner contextual + guidance — linha única */}
            <div
              style={{
                flexShrink: 0,
                display: "flex",
                gap: "var(--space-sm)",
              }}
            >
              <div
                style={{
                  flex: 1,
                  background: "var(--color-surface)",
                  border: "var(--border-default)",
                  borderRadius: "var(--radius-lg)",
                  padding: "var(--space-xs) var(--space-md)",
                  display: "flex",
                  alignItems: "baseline",
                  gap: "var(--space-sm)",
                }}
              >
                <span className="text-label" style={{ color: "var(--color-info)", flexShrink: 0 }}>Contexto</span>
                <span style={{ fontSize: "var(--text-label)", color: "var(--color-text-secondary)" }}>{session.variant.patientBanner}</span>
              </div>
              <div
                style={{
                  flex: 1,
                  background: "var(--color-elevated)",
                  border: "var(--border-default)",
                  borderRadius: "var(--radius-lg)",
                  padding: "var(--space-xs) var(--space-md)",
                  display: "flex",
                  alignItems: "baseline",
                  gap: "var(--space-sm)",
                }}
              >
                <span className="text-label" style={{ color: "var(--color-warning)", flexShrink: 0 }}>
                  {reviewMode ? "Revisão" : "Orientação"}
                </span>
                <span style={{ fontSize: "var(--text-label)", color: "var(--color-text-secondary)" }}>{stageGuidance}</span>
              </div>
            </div>

            {/* Painel do passo atual */}
            <div style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
              {step === "observacao" ? (
                <CaseObservationPanel
                  session={session}
                  observationIds={observationIds}
                  reviewStatusById={reviewMode ? review.observationStatus : undefined}
                  reviewMode={reviewMode}
                  onReveal={reviewMode ? () => undefined : revealObservation}
                />
              ) : step === "identificacao" ? (
                <CaseVisualIdentification
                  submission={visualSubmission}
                  onChange={setVisualSubmission}
                  onContinue={() => setStep("dialogo")}
                />
              ) : step === "dialogo" ? (
                <CaseDialoguePanel
                  session={session}
                  dialogueIds={dialogueIds}
                  activeDialogueId={activeDialogueId}
                  reviewStatusById={reviewMode ? review.dialogueStatus : undefined}
                  reviewMode={reviewMode}
                  onAsk={askDialogue}
                />
              ) : (
                <CaseTreatmentPlanner
                  session={session}
                  treatmentIds={treatmentIds}
                  applicationIds={applicationIds}
                  treatmentStatusById={reviewMode ? review.treatmentStatus : undefined}
                  applicationStatusById={reviewMode ? review.applicationStatus : undefined}
                  reviewMode={reviewMode}
                  onToggleTreatment={toggleTreatment}
                  onToggleApplication={toggleApplication}
                />
              )}
            </div>

            {/* Barra de ações */}
            <div
              style={{
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "var(--space-md)",
                background: "var(--color-surface)",
                border: "var(--border-default)",
                borderRadius: "var(--radius-lg)",
                padding: "var(--space-xs) var(--space-md)",
              }}
            >
              <p style={{ fontSize: "var(--text-label)", color: "var(--color-text-secondary)" }}>
                {reviewMode
                  ? "Navega pelas etapas para comparar a tua resolução."
                  : readyToSubmit
                    ? "Já reuniste informação suficiente para receber a avaliação final."
                    : "Conclui a observação, o diálogo, o plano e a técnica para desbloquear o resultado."}
              </p>
              <div style={{ display: "flex", flexShrink: 0, gap: "var(--space-sm)" }}>
                {reviewMode ? (
                  <button
                    type="button"
                    onClick={() => setStep("resultado")}
                    className="btn btn-ghost"
                  >
                    Voltar ao resultado
                  </button>
                ) : null}
                {!reviewMode ? (
                  <button
                    type="button"
                    onClick={finishCase}
                    disabled={!readyToSubmit}
                    className={readyToSubmit ? "btn btn-primary" : "btn"}
                    style={
                      !readyToSubmit
                        ? {
                            cursor: "not-allowed",
                            opacity: 0.4,
                            background: "var(--color-elevated)",
                            color: "var(--color-text-secondary)",
                          }
                        : undefined
                    }
                  >
                    Finalizar caso
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </>
      )}
    </main>
    </>
  );
}
