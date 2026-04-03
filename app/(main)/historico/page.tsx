"use client";

import Link from "next/link";
import { startTransition, useEffect, useMemo, useState } from "react";
import {
  clearAttemptHistory,
  type AttemptRecord,
  getAverageScore,
  getBestScore,
  getCaseRetryPriority,
  getMostRecommendedTopics,
  getStudyPlan,
  getTopicMastery,
  getWeakestSections,
  loadAttemptHistory,
} from "@/lib/clinical";

const SECTION_LABELS: Record<string, string> = {
  observation: "Observação",
  assessment: "Avaliação e diálogo",
  "treatment-plan": "Plano terapêutico",
  "application-technique": "Técnica de aplicação",
};

function formatDate(value: string) {
  return new Date(value).toLocaleString("pt-PT");
}

export default function HistoryPage() {
  const [history, setHistory] = useState<AttemptRecord[]>([]);

  useEffect(() => {
    startTransition(() => {
      setHistory(loadAttemptHistory());
    });
  }, []);

  const averageScore = useMemo(() => getAverageScore(history), [history]);
  const bestScore = useMemo(() => getBestScore(history), [history]);
  const weakestSections = useMemo(() => getWeakestSections(history), [history]);
  const recommendedTopics = useMemo(() => getMostRecommendedTopics(history), [history]);
  const retryPriority = useMemo(() => getCaseRetryPriority(history), [history]);
  const topicMastery = useMemo(() => getTopicMastery(history), [history]);
  const studyPlan = useMemo(() => getStudyPlan(history), [history]);

  function handleClear() {
    clearAttemptHistory();
    setHistory([]);
  }

  return (
    <main className="space-y-6">
      <section className="flex flex-wrap items-start justify-between gap-4 rounded-[32px] border border-white/10 bg-slate-950/60 p-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-sky-300">Histórico</p>
          <h1 className="mt-3 text-4xl font-black text-white">Progressão do utilizador</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
            Vista detalhada do percurso local-first com comparação de tentativas, temas a reforçar
            e um plano de estudo derivado do teu próprio histórico.
          </p>
        </div>
        <button
          type="button"
          onClick={handleClear}
          className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm font-black text-rose-100"
        >
          Limpar histórico
        </button>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Tentativas", history.length],
          ["Melhor pontuação", bestScore],
          ["Média global", averageScore],
          ["Casos com dados", retryPriority.length],
        ].map(([label, value]) => (
          <div key={label as string} className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-300">{label}</p>
            <p className="mt-3 text-4xl font-black text-white">{value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-amber-300">
            Repetir a seguir
          </p>
          <p className="mt-3 font-black text-white">
            {studyPlan.retryCase?.title ?? "Ainda sem prioridade definida"}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            {studyPlan.retryCase
              ? `Média atual: ${studyPlan.retryCase.average}/100 em ${studyPlan.retryCase.attempts} tentativa(s).`
              : "Conclui alguns casos para gerar uma prioridade de repetição."}
          </p>
          {studyPlan.retryCase ? (
            <Link
              href={`/casos/${studyPlan.retryCase.templateId}`}
              className="mt-4 inline-flex text-sm font-black text-sky-200 underline"
            >
              Reabrir caso
            </Link>
          ) : null}
        </div>

        <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-sky-300">
            Rever tema
          </p>
          <p className="mt-3 font-black text-white">
            {studyPlan.reviewTopic?.title ?? "Tema ainda por identificar"}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            {studyPlan.reviewTopic
              ? `Domínio atual: ${studyPlan.reviewTopic.masteryScore}/100.`
              : "O tema prioritário aparece depois das primeiras tentativas."}
          </p>
          {studyPlan.reviewTopic ? (
            <Link
              href={`/aprender?topic=${studyPlan.reviewTopic.topicId}&source=history`}
              className="mt-4 inline-flex text-sm font-black text-sky-200 underline"
            >
              Abrir tema
            </Link>
          ) : null}
        </div>

        <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-300">
            Tentar depois
          </p>
          <p className="mt-3 font-black text-white">
            {studyPlan.followUpCase?.title ?? "Sem sugestão ainda"}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            {studyPlan.followUpCase?.reason ?? "A próxima tentativa recomendada vai aparecer aqui."}
          </p>
          {studyPlan.followUpCase ? (
            <Link
              href={`/casos/${studyPlan.followUpCase.templateId}`}
              className="mt-4 inline-flex text-sm font-black text-sky-200 underline"
            >
              Abrir caso sugerido
            </Link>
          ) : null}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-amber-300">
            Casos a repetir prioritariamente
          </p>
          <div className="mt-4 space-y-3">
            {retryPriority.length > 0 ? (
              retryPriority.map((item) => (
                <div key={item.templateId} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-black text-white">{item.title}</p>
                    <span className="text-xs uppercase tracking-wide text-slate-400">
                      {item.average}/100
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-300">
                    {item.attempts} tentativa(s) registada(s)
                  </p>
                  <Link
                    href={`/casos/${item.templateId}`}
                    className="mt-3 inline-flex text-sm font-black text-sky-200 underline"
                  >
                    Reabrir caso
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">Ainda não existem tentativas guardadas.</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-sky-300">
              Domínios mais frágeis
            </p>
            <div className="mt-4 space-y-2">
              {weakestSections.length > 0 ? (
                weakestSections.map((section) => (
                  <div key={section.sectionId} className="rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-slate-200">
                    {SECTION_LABELS[section.sectionId] ?? section.sectionId}: {section.average}
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-400">Sem dados ainda.</p>
              )}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-amber-300">
              Temas mais recomendados
            </p>
            <div className="mt-4 space-y-2">
              {recommendedTopics.length > 0 ? (
                recommendedTopics.map((topic) => (
                  <Link
                    key={topic.topicId}
                    href={`/aprender?topic=${topic.topicId}&source=history`}
                    className="block rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-slate-200 transition hover:border-sky-400"
                  >
                    {topic.title} · {topic.count} vez(es)
                  </Link>
                ))
              ) : (
                <p className="text-sm text-slate-400">Sem recomendações ainda.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-sky-300">
          Domínio por tema
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {topicMastery.length > 0 ? (
            topicMastery.map((topic) => (
              <Link
                key={topic.topicId}
                href={`/aprender?topic=${topic.topicId}&source=mastery`}
                className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 transition hover:border-sky-400"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-black text-white">{topic.title}</p>
                  <span className="text-sm font-black text-sky-200">{topic.masteryScore}/100</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {topic.recommendationCount} recomendação(ões) · {topic.weakSignalCount} sinal(is) de fragilidade.
                </p>
              </Link>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/70 p-6 text-sm text-slate-400">
              Conclui um caso para desbloquear o mapa de domínio por tema.
            </div>
          )}
        </div>
      </section>

      <section className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-sky-300">
          Tentativas registadas
        </p>
        <div className="mt-4 space-y-3">
          {history.length > 0 ? (
            history.map((entry) => (
              <div key={entry.id} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-black text-white">{entry.caseTitle}</p>
                    <p className="mt-1 text-xs uppercase tracking-wide text-slate-400">
                      {entry.variantTitle}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-white">{entry.score}/100</p>
                    <p className="text-xs text-slate-400">{formatDate(entry.timestamp)}</p>
                  </div>
                </div>
                {entry.previousBestScoreForCase !== null ? (
                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    Melhor registo anterior neste caso: {entry.previousBestScoreForCase}/100.
                  </p>
                ) : null}
                <p className="mt-3 text-sm leading-6 text-slate-300">{entry.summary}</p>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/70 p-6 text-sm text-slate-400">
              Ainda não existem resoluções guardadas. Conclui um caso para o veres aqui.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
