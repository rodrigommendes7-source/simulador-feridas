"use client";

import { startTransition, useEffect, useMemo, useRef, useState } from "react";
import {
  buildAttemptRecord,
  buildAttemptReview,
  evaluateCaseAttempt,
  getCaseTemplate,
  type ApplicationId,
  type DialogueId,
  type ObservationId,
  loadAttemptHistory,
  saveAttemptRecord,
  getPreviousBestScoreForCase,
} from "@/lib/clinical";
import {
  VISUAL_TISSUE_OPTIONS,
  VISUAL_EXUDATE_OPTIONS,
  VISUAL_EDGE_OPTIONS,
} from "@/data/clinical/visualOptions";
import { CaseDialoguePanel } from "@/components/case-player/case-dialogue-panel";
import { CaseIntro } from "@/components/case-player/case-intro";
import { CaseJustificationPanel } from "@/components/case-player/case-justification-panel";
import { CaseObservationPanel } from "@/components/case-player/case-observation-panel";
import { CaseResultSummary } from "@/components/case-player/case-result-summary";
import { CaseTreatmentPlanner } from "@/components/case-player/case-treatment-planner";
import { CaseVisualIdentification } from "@/components/case-player/case-visual-identification";
import { generateAllJustificationQuestions } from "@/lib/clinical/justification-engine";
import type { JustificationAnswer, TissuePin, VisualIdentificationSubmission } from "@/lib/clinical/types";

type Step = "observacao" | "identificacao" | "dialogo" | "tratamento" | "justificacao" | "resultado";

export function CasePlayer({ templateId }: { templateId: string }) {
  const template = getCaseTemplate(templateId);

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
  const [tissuePins, setTissuePins] = useState<TissuePin[]>([]);
  const [dialogueIds, setDialogueIds] = useState<DialogueId[]>([]);
  const [activeDialogueId, setActiveDialogueId] = useState<DialogueId | null>(null);
  const [treatmentIds, setTreatmentIds] = useState<string[]>([]);
  const [applicationIds, setApplicationIds] = useState<ApplicationId[]>([]);
  const [justificationAnswers, setJustificationAnswers] = useState<JustificationAnswer[]>([]);
  const [previousBestScore, setPreviousBestScore] = useState<number | null>(null);
  const [showToast, setShowToast] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const attempt = useMemo(
    () => ({
      observationIds,
      visualSubmission,
      tissuePins,
      dialogueIds,
      treatmentIds,
      applicationIds,
      justificationAnswers,
    }),
    [observationIds, visualSubmission, tissuePins, dialogueIds, treatmentIds, applicationIds, justificationAnswers]
  );

  // Todos os hooks têm de ser chamados antes de qualquer early return
  const evaluation = useMemo(
    () => template ? evaluateCaseAttempt(template, attempt) : null,
    [template, attempt]
  );
  const review = useMemo(
    () => template ? buildAttemptReview(template, attempt) : null,
    [template, attempt]
  );

  if (!template) throw new Error(`Case template not found: ${templateId}`);
  // Narrowing explícito para uso em closures — useMemo retorna null só se template é undefined (já guardado acima)
  const safeTemplate = template;
  const safeEvaluation = evaluation as NonNullable<typeof evaluation>;
  const safeReview = review as NonNullable<typeof review>;

  const completedObservation = observationIds.includes("imagem") && observationIds.length >= 3;
  const completedVisualIdentification = step !== "observacao" || observationIds.includes("imagem");
  const completedDialogue = dialogueIds.length >= 2;
  const completedTreatment = treatmentIds.length >= 1;
  const completedApplication = applicationIds.length >= 1;
  const readyToSubmit =
    completedObservation && completedDialogue && completedTreatment && completedApplication;

  function resetCase() {
    setStarted(false);
    setStep("observacao");
    setReviewMode(false);
    setStartedAt(null);
    setObservationIds([]);
    setVisualSubmission({ tissues: [], exudate: [], edges: [] });
    setTissuePins([]);
    setDialogueIds([]);
    setActiveDialogueId(null);
    setTreatmentIds([]);
    setApplicationIds([]);
    setJustificationAnswers([]);
    setPreviousBestScore(null);
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

  function addTissuePin(pin: TissuePin) {
    if (reviewMode) return;
    setTissuePins((prev) => [...prev, pin]);
  }

  function removeTissuePin(id: string) {
    if (reviewMode) return;
    setTissuePins((prev) => prev.filter((p) => p.id !== id));
  }

  const justificationQuestions = useMemo(
    () => generateAllJustificationQuestions(treatmentIds, template),
    [treatmentIds]
  );

  const allJustificationsAnswered =
    justificationQuestions.length === 0 ||
    justificationQuestions.every((q) =>
      justificationAnswers.some((a) => a.treatmentId === q.treatmentId)
    );

  function answerJustification(treatmentId: string, optionId: string) {
    setJustificationAnswers((prev) => {
      const filtered = prev.filter((a) => a.treatmentId !== treatmentId);
      return [...filtered, { treatmentId, selectedOptionId: optionId }];
    });
  }

  function goToJustification() {
    if (!readyToSubmit) return;
    setStep("justificacao");
  }

  function submitFinal() {
    if (!allJustificationsAnswered) return;

    const history = loadAttemptHistory();
    const priorBestScore = getPreviousBestScoreForCase(history, safeTemplate.id);

    saveAttemptRecord(
      buildAttemptRecord({
        evaluation: safeEvaluation,
        history,
        templateId: safeTemplate.id,
        attempt,
        durationSeconds: startedAt ? Math.round((Date.now() - startedAt) / 1000) : 0,
      })
    );

    setPreviousBestScore(priorBestScore);
    setReviewMode(false);
    setStep("resultado");
    setShowToast(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setShowToast(false), 3000);
  }

  function openReview() {
    setReviewMode(true);
    setStep("observacao");
    setActiveDialogueId(dialogueIds[0] ?? safeReview.idealAttempt.dialogueIds[0] ?? null);
  }

  const stageGuidance = reviewMode
    ? "Estás em modo de revisão. As escolhas corretas aparecem a verde, as incorretas a vermelho e as que faltaram a azul claro."
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
          : step === "justificacao"
            ? allJustificationsAnswered
              ? "Justificaste todos os materiais. Podes submeter o caso."
              : "Indica a razão clínica principal para cada material que selecionaste."
            : completedTreatment && completedApplication
              ? "O plano e a técnica já estão completos para receberes o feedback final."
              : completedTreatment
                ? "Já tens materiais escolhidos, mas ainda falta definir a técnica de aplicação."
                : "Escolhe um material principal e confirma como o vais aplicar de forma segura.";

  const completedVisualStep =
    visualSubmission.tissues.length > 0 ||
    visualSubmission.exudate.length > 0 ||
    visualSubmission.edges.length > 0;

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
        : "Seleciona pelo menos uma característica visual",
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
        className="modal-overlay"
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
          className="modal-content"
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
            boxShadow: "var(--shadow-lifted)",
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
    <main className="case-shell">
      {!started ? (
        <div className="h-full w-full overflow-y-auto">
          <CaseIntro template={template} onStart={startCase} />
        </div>
      ) : step === "resultado" ? (
        <div className="h-full w-full overflow-y-auto">
          <CaseResultSummary
            template={template}
            evaluation={safeEvaluation}
            attempt={attempt}
            previousBestScore={previousBestScore}
            onReview={openReview}
            onReset={resetCase}
          />
        </div>
      ) : (
        <>
          {/* ── Sidebar ─────────────────────────────────────────────────────── */}
          <aside className="case-sidebar">
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
                {template.shortTitle}
              </h1>
              <p
                className="text-body"
                style={{ marginTop: "2px", color: "var(--color-text-secondary)" }}
              >
                {template.title}
              </p>
              <div
                style={{
                  marginTop: "var(--space-xs)",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "var(--space-xs)",
                }}
              >
                <span className="badge badge-info">{template.difficulty}</span>
                <span className="badge badge-info">{template.estimatedMinutes} min</span>
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
                  ["observacao", "Observação", completedObservation],
                  ["identificacao", "Identificação", completedVisualStep],
                  ["dialogo", "Diálogo", completedDialogue],
                  ["tratamento", "Tratamento", completedTreatment && completedApplication],
                  ["justificacao", "Justificação", justificationQuestions.length > 0 && allJustificationsAnswered],
                ] as [Step, string, boolean][]).map(([id, label, done]) => {
                  const isActive = step === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setStep(id)}
                      style={
                        isActive
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
                              display: "flex",
                              alignItems: "center",
                              gap: "var(--space-xs)",
                            }
                          : done
                            ? {
                                width: "100%",
                                textAlign: "left",
                                padding: "var(--space-xs) var(--space-sm)",
                                borderRadius: "var(--radius-md)",
                                border: "0.5px solid var(--color-success-border)",
                                background: "var(--color-success-subtle)",
                                color: "var(--color-success)",
                                fontSize: "var(--text-body)",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "var(--space-xs)",
                                transition: "border-color var(--transition-fast), background var(--transition-fast)",
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
                                display: "flex",
                                alignItems: "center",
                                gap: "var(--space-xs)",
                              }
                      }
                    >
                      {done && !isActive ? (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
                          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : null}
                      {label}
                    </button>
                  );
                })}
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
                    className={`progress-item ${item.done ? "progress-item-done" : "progress-item-pending"}`}
                  >
                    <p className="text-label" style={{ color: item.done ? "var(--color-success)" : "var(--color-text-primary)" }}>
                      {item.label}
                    </p>
                    <p style={{ marginTop: "1px", fontSize: "var(--text-label)", color: "var(--color-text-secondary)", lineHeight: 1.4 }}>
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Leitura visual — só aparece a partir do diálogo */}
            {(step === "dialogo" || step === "tratamento" || step === "justificacao") && (() => {
              const tissueLabels = visualSubmission.tissues
                .map((id) => VISUAL_TISSUE_OPTIONS.find((o) => o.id === id)?.label)
                .filter(Boolean).join(", ") || "—";
              const exudateLabels = visualSubmission.exudate
                .map((id) => VISUAL_EXUDATE_OPTIONS.find((o) => o.id === id)?.label)
                .filter(Boolean).join(", ") || "—";
              const edgeLabels = visualSubmission.edges
                .map((id) => VISUAL_EDGE_OPTIONS.find((o) => o.id === id)?.label)
                .filter(Boolean).join(", ") || "—";
              const odorLabels: Record<string, string> = {
                ausente: "Ausente", ligeiro: "Ligeiro", moderado: "Moderado", fetido: "Fétido", presente: "Presente", intenso: "Intenso",
              };
              const odorValue = observationIds.includes("cheiro")
                ? (odorLabels[template.woundState.odor] ?? template.woundState.odor)
                : "—";

              const rows: { label: string; value: string }[] = [
                { label: "Exsudado", value: exudateLabels },
                { label: "Odor", value: odorValue },
                { label: "Tecido", value: tissueLabels },
                { label: "Pele perilesional", value: edgeLabels },
              ];

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
                    A tua leitura
                  </p>
                  <div
                    style={{
                      marginTop: "var(--space-sm)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--space-xs)",
                    }}
                  >
                    {rows.map(({ label, value }) => (
                      <div
                        key={label}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          justifyContent: "space-between",
                          gap: "var(--space-sm)",
                          borderRadius: "var(--radius-md)",
                          border: "var(--border-default)",
                          background: "var(--color-elevated)",
                          padding: "2px var(--space-sm)",
                        }}
                      >
                        <span style={{ fontSize: "var(--text-label)", color: "var(--color-text-secondary)", flexShrink: 0 }}>
                          {label}
                        </span>
                        <span style={{ fontSize: "var(--text-label)", fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)", textAlign: "right" }}>
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </aside>

          {/* ── Área principal ──────────────────────────────────────────────── */}
          <div className="case-main-area">
            {/* Banner contextual + guidance — linha única */}
            <div className="case-banner-row">
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
                <span style={{ fontSize: "var(--text-label)", color: "var(--color-text-secondary)" }}>{template.patientBanner}</span>
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
            <div className="case-active-panel">
              {step === "observacao" ? (
                <CaseObservationPanel
                  template={template}
                  observationIds={observationIds}
                  reviewStatusById={reviewMode ? safeReview.observationStatus : undefined}
                  reviewMode={reviewMode}
                  onReveal={reviewMode ? () => undefined : revealObservation}
                />
              ) : step === "identificacao" ? (
                <CaseVisualIdentification
                  submission={visualSubmission}
                  onChange={setVisualSubmission}
                  imageSrc={template.imageSrc}
                  tissuePins={tissuePins}
                  onAddPin={addTissuePin}
                  onRemovePin={removeTissuePin}
                  hasTissueZones={(template.tissueZones?.length ?? 0) > 0}
                />
              ) : step === "dialogo" ? (
                <CaseDialoguePanel
                  template={template}
                  dialogueIds={dialogueIds}
                  activeDialogueId={activeDialogueId}
                  reviewStatusById={reviewMode ? safeReview.dialogueStatus : undefined}
                  reviewMode={reviewMode}
                  onAsk={askDialogue}
                />
              ) : step === "justificacao" ? (
                <CaseJustificationPanel
                  questions={justificationQuestions}
                  answers={justificationAnswers}
                  onAnswer={answerJustification}
                />
              ) : (
                <CaseTreatmentPlanner
                  template={template}
                  treatmentIds={treatmentIds}
                  applicationIds={applicationIds}
                  treatmentStatusById={reviewMode ? safeReview.treatmentStatus : undefined}
                  applicationStatusById={reviewMode ? safeReview.applicationStatus : undefined}
                  reviewMode={reviewMode}
                  onToggleTreatment={toggleTreatment}
                  onToggleApplication={toggleApplication}
                />
              )}
            </div>

            {/* Barra de ações */}
            <div className="case-action-bar">
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
                {!reviewMode && step === "observacao" ? (
                  <button
                    type="button"
                    onClick={() => setStep("identificacao")}
                    className="btn btn-primary"
                  >
                    Continuar para identificação
                  </button>
                ) : null}
                {!reviewMode && step === "identificacao" ? (
                  <button
                    type="button"
                    onClick={() => setStep("dialogo")}
                    className="btn btn-primary"
                  >
                    Continuar para diálogo
                  </button>
                ) : null}
                {!reviewMode && step === "dialogo" ? (
                  <button
                    type="button"
                    onClick={() => setStep("tratamento")}
                    className="btn btn-primary"
                  >
                    Continuar para tratamento
                  </button>
                ) : null}
                {!reviewMode && step === "tratamento" ? (
                  <button
                    type="button"
                    onClick={goToJustification}
                    disabled={!readyToSubmit}
                    className="btn btn-primary"
                    title={!readyToSubmit ? "Conclui observação, diálogo, plano e técnica para avançar" : undefined}
                  >
                    Avançar para justificação
                  </button>
                ) : null}
                {!reviewMode && step === "justificacao" ? (
                  <button
                    type="button"
                    onClick={submitFinal}
                    disabled={!allJustificationsAnswered}
                    className="btn btn-primary"
                    title={!allJustificationsAnswered ? "Justifica todos os materiais selecionados para submeter" : undefined}
                  >
                    Submeter caso
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </>
      )}
    </main>

    {showToast && (
      <div className="toast toast-success">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3 8l4 4 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Caso submetido com sucesso
      </div>
    )}
    </>
  );
}
