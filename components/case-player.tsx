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
    <main className="space-y-6">
      {!started ? (
        <CaseIntro session={session} onStart={startCase} />
      ) : step === "resultado" ? (
        <CaseResultSummary
          session={session}
          evaluation={evaluation}
          previousBestScore={previousBestScore}
          onReview={openReview}
          onReset={resetCase}
        />
      ) : (
        <section className="grid gap-4 xl:grid-cols-[280px_1fr]">
          <aside className="rounded-[32px] border border-white/10 bg-slate-950/60 p-4">
            <div className="rounded-[24px] border border-white/10 bg-slate-900/80 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-sky-300">
                Caso ativo
              </p>
              <h1 className="mt-3 text-3xl font-black text-white">{session.template.shortTitle}</h1>
              <p className="mt-3 text-sm leading-6 text-slate-300">{session.template.title}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wide">
                <span className="rounded-full bg-sky-500/20 px-3 py-1 text-sky-100">
                  {session.template.difficulty}
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-slate-200">
                  {session.template.estimatedMinutes} min
                </span>
              </div>
            </div>

            <div className="mt-4 rounded-[24px] border border-white/10 bg-slate-900/80 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-300">
                Navegação
              </p>
              <div className="mt-4 space-y-2">
                {[
                  ["observacao", "Observação"],
                  ["dialogo", "Diálogo"],
                  ["tratamento", "Tratamento"],
                ].map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setStep(id as Step)}
                    className={`w-full rounded-2xl border px-4 py-3 text-left text-sm font-black transition ${
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

            <div className="mt-4 rounded-[24px] border border-white/10 bg-slate-900/80 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-sky-300">
                Progresso
              </p>
              <div className="mt-4 space-y-3">
                {progressChecklist.map((item) => (
                  <div
                    key={item.label}
                    className={`rounded-2xl border p-3 ${
                      item.done
                        ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-50"
                        : "border-white/10 bg-slate-950/70 text-slate-300"
                    }`}
                  >
                    <p className="font-black">{item.label}</p>
                    <p className="mt-1 text-xs leading-5">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <div className="space-y-4">
            <div className="rounded-[28px] border border-white/10 bg-slate-900/80 px-5 py-4">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-sky-300">
                Contexto atual
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-200">{session.variant.patientBanner}</p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-slate-950/60 px-5 py-4">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-300">
                {reviewMode ? "Modo de revisão" : "O que ainda falta fechar"}
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-200">{stageGuidance}</p>
            </div>

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

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-[28px] border border-white/10 bg-slate-950/60 px-5 py-4">
              <p className="text-sm text-slate-300">
                {reviewMode
                  ? "Podes navegar pelas etapas para comparar a tua resolução com a resposta máxima desta variante."
                  : readyToSubmit
                    ? "Já reuniste informação suficiente para receber a avaliação final."
                    : "Conclui a observação, o diálogo, o plano e a técnica para desbloquear o resultado final."}
              </p>
              <div className="flex flex-wrap gap-3">
                {reviewMode ? (
                  <button
                    type="button"
                    onClick={() => setStep("resultado")}
                    className="rounded-2xl border border-white/10 bg-slate-900 px-5 py-3 text-sm font-black text-white"
                  >
                    Voltar ao resultado
                  </button>
                ) : null}
                {!reviewMode ? (
                  <button
                    type="button"
                    onClick={finishCase}
                    disabled={!readyToSubmit}
                    className={`rounded-2xl px-5 py-3 text-sm font-black transition ${
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
        </section>
      )}
    </main>
  );
}
