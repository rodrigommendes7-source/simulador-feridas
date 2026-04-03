import Link from "next/link";
import {
  getApplicationLabel,
  getIdealAttempt,
  getTreatmentLabel,
  type CaseEvaluation,
  type CaseSession,
} from "@/lib/clinical";

function blockClass(color: "emerald" | "amber" | "rose" | "sky") {
  if (color === "emerald") return "border-emerald-500/20 bg-emerald-500/10 text-emerald-50";
  if (color === "amber") return "border-amber-500/20 bg-amber-500/10 text-amber-50";
  if (color === "rose") return "border-rose-500/20 bg-rose-500/10 text-rose-50";
  return "border-sky-500/20 bg-sky-500/10 text-sky-50";
}

function scoreDeltaLabel(previousBestScore: number | null, currentScore: number) {
  if (previousBestScore === null) return "Primeira tentativa registada neste caso.";
  if (currentScore > previousBestScore) {
    return `Melhoraste ${currentScore - previousBestScore} ponto(s) face ao teu melhor registo anterior.`;
  }
  if (currentScore < previousBestScore) {
    return `Ficaste ${previousBestScore - currentScore} ponto(s) abaixo do teu melhor registo anterior.`;
  }
  return "Igualaste o teu melhor registo anterior neste caso.";
}

function buildIdealResponse(session: CaseSession) {
  const idealAttempt = getIdealAttempt(session);

  return {
    observations: session.template.observationDefinitions
      .filter((item) => idealAttempt.observationIds.includes(item.id))
      .map((item) => item.label),
    questions: session.template.dialoguePrompts
      .filter((item) => idealAttempt.dialogueIds.includes(item.id))
      .map((item) => item.label.replace("Perguntar sobre ", "")),
    treatments: idealAttempt.treatmentIds.map((item) => getTreatmentLabel(item)),
    applications: idealAttempt.applicationIds.map((item) =>
      getApplicationLabel(session.template, item)
    ),
  };
}

export function CaseResultSummary({
  session,
  evaluation,
  previousBestScore,
  onReview,
  onReset,
}: {
  session: CaseSession;
  evaluation: CaseEvaluation;
  previousBestScore: number | null;
  onReview: () => void;
  onReset: () => void;
}) {
  const idealResponse = buildIdealResponse(session);

  return (
    <div className="space-y-5">
      <section className="rounded-[32px] border border-white/10 bg-slate-950/60 p-6">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-sky-300">
          Leitura clínica do caso
        </p>
        <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">
          {session.template.shortTitle} · {session.template.title}
        </h2>
        <p className="mt-4 max-w-4xl text-base leading-7 text-slate-300">
          {evaluation.reasoningSummary.reading}
        </p>
        <div className="mt-6 h-4 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sky-400 via-cyan-300 to-amber-300"
            style={{ width: `${evaluation.score}%` }}
          />
        </div>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-3xl font-black text-white">{evaluation.score}/100</p>
            <p className="mt-2 text-sm text-slate-300">
              {scoreDeltaLabel(previousBestScore, evaluation.score)}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-slate-200">
            <p className="font-black text-white">Próximo passo</p>
            <p className="mt-2 leading-6">{evaluation.reasoningSummary.nextStep}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {[
          ["Decisões essenciais", evaluation.reasoningSummary.essential, "sky"],
          ["Decisões corretas", evaluation.reasoningSummary.correct, "emerald"],
          ["Excessos ou redundâncias", evaluation.reasoningSummary.redundant, "amber"],
          ["Erros com impacto clínico", evaluation.reasoningSummary.inadequate, "rose"],
        ].map(([title, items, color]) => (
          <div
            key={title as string}
            className={`rounded-[28px] border p-5 ${blockClass(color as "emerald" | "amber" | "rose" | "sky")}`}
          >
            <p className="text-sm font-black uppercase tracking-[0.18em]">{title}</p>
            <div className="mt-4 space-y-3 text-sm leading-6">
              {(items as string[]).length > 0 ? (
                (items as string[]).map((item, index) => <p key={index}>{item}</p>)
              ) : (
                <p>Sem registos relevantes nesta categoria.</p>
              )}
            </div>
          </div>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-amber-300">
            Plano recomendado
          </p>
          <div className="mt-4 space-y-4">
            <div>
              <p className="font-black text-white">Plano mínimo seguro</p>
              <div className="mt-2 space-y-2 text-sm text-slate-300">
                {evaluation.recommendedPlan.minimum.map((item) => (
                  <div key={item} className="rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2">
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="font-black text-white">Plano otimizado</p>
              <div className="mt-2 space-y-2 text-sm text-slate-300">
                {evaluation.recommendedPlan.optimized.map((item) => (
                  <div key={item} className="rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-sky-300">
            O que faria diferença clínica
          </p>
          <div className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
            {evaluation.recommendedPlan.differences.length > 0 ? (
              evaluation.recommendedPlan.differences.map((item) => (
                <div key={item} className="rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2">
                  {item}
                </div>
              ))
            ) : (
              <p>O plano que montaste já cobre os pontos principais deste caso.</p>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-emerald-500/20 bg-emerald-500/10 p-5">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-100">
          Resposta real com pontuação máxima
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <p className="font-black text-white">Observação</p>
            <div className="mt-2 space-y-2 text-sm text-emerald-50">
              {idealResponse.observations.map((item) => (
                <div key={item} className="rounded-xl border border-white/10 bg-slate-950/30 px-3 py-2">
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="font-black text-white">Perguntas</p>
            <div className="mt-2 space-y-2 text-sm text-emerald-50">
              {idealResponse.questions.map((item) => (
                <div key={item} className="rounded-xl border border-white/10 bg-slate-950/30 px-3 py-2">
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="font-black text-white">Tratamento</p>
            <div className="mt-2 space-y-2 text-sm text-emerald-50">
              {idealResponse.treatments.map((item) => (
                <div key={item} className="rounded-xl border border-white/10 bg-slate-950/30 px-3 py-2">
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="font-black text-white">Aplicação</p>
            <div className="mt-2 space-y-2 text-sm text-emerald-50">
              {idealResponse.applications.map((item) => (
                <div key={item} className="rounded-xl border border-white/10 bg-slate-950/30 px-3 py-2">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-sky-300">
              Reforço recomendado
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
              Estes temas são os próximos passos mais úteis para melhorares a consistência clínica
              nas próximas tentativas.
            </p>
          </div>
          <Link
            href="/aprender"
            className="rounded-xl bg-amber-300 px-4 py-2 text-sm font-black text-slate-950"
          >
            Ir para Aprender
          </Link>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {evaluation.learningRecommendations.map((recommendation) => (
            <Link
              key={recommendation.topicId}
              href={`/aprender?topic=${recommendation.topicId}&source=result&reason=${encodeURIComponent(
                recommendation.reason
              )}`}
              className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm text-white transition hover:border-sky-400"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-black text-white">{recommendation.title}</p>
                <span className="rounded-full bg-sky-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-sky-100">
                  {recommendation.priority}
                </span>
              </div>
              <p className="mt-3 leading-6 text-slate-300">{recommendation.reason}</p>
            </Link>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onReview}
          className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-3 text-sm font-black text-emerald-50"
        >
          Rever resolução
        </button>
        <button
          type="button"
          onClick={onReset}
          className="rounded-2xl bg-sky-500 px-5 py-3 text-sm font-black text-white"
        >
          Repetir caso
        </button>
        <Link
          href="/casos"
          className="rounded-2xl border border-white/10 bg-slate-900 px-5 py-3 text-sm font-black text-white"
        >
          Voltar aos casos
        </Link>
        <Link
          href="/historico"
          className="rounded-2xl border border-white/10 bg-slate-900 px-5 py-3 text-sm font-black text-white"
        >
          Ver histórico
        </Link>
      </div>
    </div>
  );
}
