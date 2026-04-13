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
} from "@/lib/clinical/material-evaluation";
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

type Step = "observacao" | "dialogo" | "tratamento" | "resultado";

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
  // Controla a expansão das variáveis clínicas secundárias no painel lateral
  const [showExtraVars, setShowExtraVars] = useState(false);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [observationIds, setObservationIds] = useState<ObservationId[]>([]);
  const [dialogueIds, setDialogueIds] = useState<DialogueId[]>([]);
  const [activeDialogueId, setActiveDialogueId] = useState<DialogueId | null>(null);
  const [treatmentIds, setTreatmentIds] = useState<string[]>([]);
  const [applicationIds, setApplicationIds] = useState<ApplicationId[]>([]);
  const [filter, setFilter] = useState("");
  const [previousBestScore, setPreviousBestScore] = useState<number | null>(null);

  const attempt = useMemo(
    () => ({
      observationIds,
      dialogueIds,
      treatmentIds,
      applicationIds,
    }),
    [observationIds, dialogueIds, treatmentIds, applicationIds]
  );

  const evaluation = useMemo(() => evaluateCaseAttempt(session, attempt), [session, attempt]);
  const review = useMemo(() => buildAttemptReview(session, attempt), [session, attempt]);

  const completedObservation = observationIds.includes("imagem") && observationIds.length >= 3;
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
    setDialogueIds([]);
    setActiveDialogueId(null);
    setTreatmentIds([]);
    setApplicationIds([]);
    setFilter("");
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
        ? "Já tens observação mínima suficiente para sustentar a leitura do caso."
        : observationIds.includes("imagem")
          ? "Agora confirma os achados-chave do leito para definires o problema dominante."
          : "Começa por observar a imagem e por recolher pelo menos dois achados clínicos essenciais."
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

  const progressChecklist = [
    {
      label: "Observação mínima",
      done: completedObservation,
      detail: completedObservation
        ? `${observationIds.length} achados observados`
        : "Revê a imagem e recolhe pelo menos três achados clínicos",
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
        ? `${treatmentIds.length} material(is) selecionado(s)`
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

  return (
    <main className="-mx-6 -my-8 flex h-[calc(100vh-52px)] overflow-hidden">
      {!started ? (
        <div className="h-full w-full overflow-y-auto">
          <CaseIntro session={session} onStart={startCase} />
        </div>
      ) : step === "resultado" ? (
        <div className="h-full w-full overflow-y-auto">
          <CaseResultSummary
            session={session}
            evaluation={evaluation}
            previousBestScore={previousBestScore}
            onReview={openReview}
            onReset={resetCase}
          />
        </div>
      ) : (
        <>
          {/* ── Sidebar ─────────────────────────────────────────────────────── */}
          <aside className="w-56 shrink-0 space-y-3 overflow-y-auto border-r border-white/10 p-3">

            {/* Identidade do caso */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-sky-300">Caso ativo</p>
              <h1 className="mt-2 text-lg font-black text-white">{session.template.shortTitle}</h1>
              <p className="mt-1 text-xs leading-5 text-slate-300">{session.template.title}</p>
              <div className="mt-2 flex flex-wrap gap-1 text-[10px] font-bold uppercase tracking-wide">
                <span className="rounded-full bg-sky-500/20 px-2 py-0.5 text-sky-100">
                  {session.template.difficulty}
                </span>
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-slate-200">
                  {session.template.estimatedMinutes} min
                </span>
              </div>
            </div>

            {/* Navegação */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-amber-300">Navegação</p>
              <div className="mt-2 space-y-1.5">
                {[
                  ["observacao", "Observação"],
                  ["dialogo", "Diálogo"],
                  ["tratamento", "Tratamento"],
                ].map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setStep(id as Step)}
                    className={`w-full rounded-xl border px-3 py-2 text-left text-xs font-black transition ${
                      step === id
                        ? "border-sky-400 bg-sky-500/10 text-sky-100"
                        : "border-white/10 bg-slate-950/70 text-slate-200 hover:border-sky-400"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Progresso */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-sky-300">Progresso</p>
              <div className="mt-2 space-y-1.5">
                {progressChecklist.map((item) => (
                  <div
                    key={item.label}
                    className={`rounded-xl border px-3 py-2 ${
                      item.done
                        ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-50"
                        : "border-white/10 bg-slate-950/70 text-slate-400"
                    }`}
                  >
                    <p className="text-xs font-black">{item.label}</p>
                    <p className="mt-0.5 text-[10px] leading-4 opacity-70">{item.detail}</p>
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
              // Variáveis extra apenas em modo revisão; sem botão de toggle na sidebar
              const visibleMain  = WOUND_VARIABLES_MAIN.filter(isUnlocked);
              const visibleExtra = reviewMode ? WOUND_VARIABLES_EXTRA.filter(isUnlocked) : [];
              const anyVisible   = visibleMain.length > 0 || visibleExtra.length > 0;

              return (
                <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-amber-300">Variáveis clínicas</p>
                  {anyVisible ? (
                    <div className="mt-2 space-y-1.5">
                      {[...visibleMain, ...visibleExtra].map((key) => {
                        const value = session.variant.woundVariables![key] as number;
                        return (
                          <div
                            key={key}
                            className="flex items-center justify-between rounded-lg border border-white/10 bg-slate-950/60 px-2 py-1.5 text-[10px]"
                          >
                            <span className="font-bold text-slate-300">{WOUND_VARIABLE_DISPLAY_LABELS[key]}</span>
                            <span className="font-black text-white capitalize">{getWoundVariableLabel(key, value)}</span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="mt-2 text-[10px] leading-4 text-slate-400">
                      Aparece à medida que observas e perguntas.
                    </p>
                  )}
                </div>
              );
            })() : null}
          </aside>

          {/* ── Área principal ──────────────────────────────────────────────── */}
          <div className="flex flex-1 flex-col gap-3 overflow-hidden p-4">

            {/* Banner contextual */}
            <div className="shrink-0 rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-sky-300">Contexto atual</p>
              <p className="mt-1.5 text-sm leading-5 text-slate-200">{session.variant.patientBanner}</p>
            </div>

            {/* Guidance bar */}
            <div className="shrink-0 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-amber-300">
                {reviewMode ? "Modo de revisão" : "O que ainda falta fechar"}
              </p>
              <p className="mt-1.5 text-xs leading-5 text-slate-200">{stageGuidance}</p>
            </div>

            {/* Painel do passo atual — cresce, scroll interno */}
            <div className="min-h-0 flex-1 overflow-hidden">
              {step === "observacao" ? (
                <CaseObservationPanel
                  session={session}
                  observationIds={observationIds}
                  reviewStatusById={reviewMode ? review.observationStatus : undefined}
                  reviewMode={reviewMode}
                  onReveal={reviewMode ? () => undefined : revealObservation}
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
                  filter={filter}
                  onFilterChange={setFilter}
                  onToggleTreatment={toggleTreatment}
                  onToggleApplication={toggleApplication}
                />
              )}
            </div>

            {/* Barra de ações */}
            <div className="shrink-0 flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3">
              <p className="text-xs text-slate-300">
                {reviewMode
                  ? "Podes navegar pelas etapas para comparar a tua resolução com a resposta máxima desta variante."
                  : readyToSubmit
                    ? "Já reuniste informação suficiente para receber a avaliação final."
                    : "Conclui a observação, o diálogo, o plano e a técnica para desbloquear o resultado final."}
              </p>
              <div className="flex shrink-0 gap-3">
                {reviewMode ? (
                  <button
                    type="button"
                    onClick={() => setStep("resultado")}
                    className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-2 text-xs font-black text-white"
                  >
                    Voltar ao resultado
                  </button>
                ) : null}
                {!reviewMode ? (
                  <button
                    type="button"
                    onClick={finishCase}
                    disabled={!readyToSubmit}
                    className={`rounded-2xl px-4 py-2 text-xs font-black transition ${
                      readyToSubmit
                        ? "bg-sky-500 text-white hover:bg-sky-400"
                        : "cursor-not-allowed bg-slate-700 text-slate-300"
                    }`}
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
  );
}
