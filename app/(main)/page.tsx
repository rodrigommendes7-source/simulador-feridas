"use client";

import Link from "next/link";
import { startTransition, useEffect, useMemo, useState } from "react";
import {
  type AttemptRecord,
  getBestScore,
  getCasesCompletedCount,
  getContinueLearningTarget,
  getRecommendedNextCases,
  getRecentBestScore,
  getStudyPlan,
  getTopicMastery,
  listCaseTemplates,
  loadAttemptHistory,
} from "@/lib/clinical";

function difficultyLabel(value: string) {
  if (value === "introdutorio") return "Introdutório";
  if (value === "intermedio") return "Intermédio";
  return "Avançado";
}

export default function HomePage() {
  const [history, setHistory] = useState<AttemptRecord[]>([]);
  const cases = listCaseTemplates().filter((item) => item.status === "disponivel");

  useEffect(() => {
    startTransition(() => {
      setHistory(loadAttemptHistory());
    });
  }, []);

  const continueTarget = useMemo(() => getContinueLearningTarget(history), [history]);
  const studyPlan = useMemo(() => getStudyPlan(history), [history]);
  const topicMastery = useMemo(() => getTopicMastery(history), [history]);
  const recommendedCases = useMemo(() => getRecommendedNextCases(history), [history]);

  const weakestTopic = topicMastery[0] ?? null;
  const nextTopic = studyPlan.reviewTopic ?? weakestTopic;

  return (
    <main className="space-y-8">
      <section className="grid gap-6 rounded-[36px] border border-white/10 bg-slate-950/60 p-8 lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-300">
            Painel de aprendizagem
          </p>
          <h1 className="mt-4 max-w-4xl text-5xl font-black leading-tight text-white md:text-6xl">
            Aprende por repetição, foco e comparação entre tentativas.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            O simulador passa a destacar o que rever, que caso repetir e qual o melhor próximo
            passo para consolidar o raciocínio clínico no tratamento de feridas.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={continueTarget ? `/casos/${continueTarget.nextCaseId}` : "/casos"}
              className="rounded-2xl bg-sky-500 px-6 py-3 text-sm font-black text-white"
            >
              {continueTarget ? "Continuar aprendizagem" : "Começar pelo primeiro caso"}
            </Link>
            <Link
              href={nextTopic ? `/aprender?topic=${nextTopic.topicId}&source=home` : "/aprender"}
              className="rounded-2xl border border-white/10 bg-slate-900 px-6 py-3 text-sm font-black text-white"
            >
              Rever tema prioritário
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {[
            ["Casos concluídos", getCasesCompletedCount(history)],
            ["Melhor pontuação", getBestScore(history)],
            ["Pontuação recente", getRecentBestScore(history)],
            ["Temas em reforço", topicMastery.length],
          ].map(([label, value]) => (
            <div key={label as string} className="rounded-3xl border border-white/10 bg-slate-900/80 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-300">{label}</p>
              <p className="mt-2 text-3xl font-black text-white">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-300">
            Continuar aprendizagem
          </p>
          {continueTarget ? (
            <>
              <h2 className="mt-3 text-2xl font-black text-white">{continueTarget.nextCaseTitle}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Última tentativa: {continueTarget.lastCaseTitle}.
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Tema a rever antes da próxima ronda:{" "}
                {continueTarget.reviewTopicId ? (
                  <Link
                    href={`/aprender?topic=${continueTarget.reviewTopicId}&source=history`}
                    className="font-black text-sky-200 underline"
                  >
                    {nextTopic?.title ?? continueTarget.reviewTopicId}
                  </Link>
                ) : (
                  "decisão clínica"
                )}
              </p>
              <Link
                href={`/casos/${continueTarget.nextCaseId}`}
                className="mt-4 inline-flex rounded-xl bg-sky-500 px-4 py-2 text-sm font-black text-white"
              >
                Abrir próximo caso
              </Link>
            </>
          ) : (
            <>
              <h2 className="mt-3 text-2xl font-black text-white">Primeiro percurso clínico</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Ainda não existem tentativas guardadas. Começa pelos casos introdutórios e usa o
                feedback para construir uma rotina de observação e decisão.
              </p>
              <Link
                href={`/casos/${cases[0]?.id ?? "1"}`}
                className="mt-4 inline-flex rounded-xl bg-sky-500 px-4 py-2 text-sm font-black text-white"
              >
                Iniciar primeiro caso
              </Link>
            </>
          )}
        </div>

        <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
            Temas a reforçar
          </p>
          {topicMastery.length > 0 ? (
            <div className="mt-4 space-y-3">
              {topicMastery.slice(0, 3).map((topic) => (
                <Link
                  key={topic.topicId}
                  href={`/aprender?topic=${topic.topicId}&source=mastery`}
                  className="block rounded-2xl border border-white/10 bg-slate-950/70 p-4 transition hover:border-sky-400"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-black text-white">{topic.title}</p>
                    <span className="text-sm font-black text-amber-200">{topic.masteryScore}/100</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Recomendado {topic.recommendationCount} vez(es), com {topic.weakSignalCount} sinal(is) de fragilidade.
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm leading-6 text-slate-300">
              O reforço por tema vai aparecer aqui depois das primeiras tentativas.
            </p>
          )}
        </div>

        <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
            Casos recomendados
          </p>
          {recommendedCases.length > 0 ? (
            <div className="mt-4 space-y-3">
              {recommendedCases.slice(0, 3).map((item) => (
                <Link
                  key={item.templateId}
                  href={`/casos/${item.templateId}`}
                  className="block rounded-2xl border border-white/10 bg-slate-950/70 p-4 transition hover:border-sky-400"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-black text-white">{item.title}</p>
                    <span className="text-xs uppercase tracking-wide text-slate-400">
                      {difficultyLabel(item.difficulty)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{item.reason}</p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm leading-6 text-slate-300">
              Depois de alguns casos, este bloco passa a sugerir as melhores próximas tentativas.
            </p>
          )}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[32px] border border-white/10 bg-slate-950/60 p-6">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-sky-300">
            Plano de estudo pessoal
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Repetir</p>
              <p className="mt-2 font-black text-white">
                {studyPlan.retryCase?.title ?? "Ainda sem prioridade definida"}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                {studyPlan.retryCase
                  ? `Caso com média de ${studyPlan.retryCase.average}/100.`
                  : "As prioridades de repetição aparecem depois das primeiras tentativas."}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Rever</p>
              <p className="mt-2 font-black text-white">
                {studyPlan.reviewTopic?.title ?? "Tema ainda por identificar"}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                {studyPlan.reviewTopic
                  ? `Domínio atual: ${studyPlan.reviewTopic.masteryScore}/100.`
                  : "Os temas a reforçar surgem quando houver histórico local."}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Tentar</p>
              <p className="mt-2 font-black text-white">
                {studyPlan.followUpCase?.title ?? "Sem sugestão ainda"}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                {studyPlan.followUpCase?.reason ?? "A próxima tentativa recomendada vai aparecer aqui."}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-slate-950/60 p-6">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-amber-300">
            Biblioteca clínica
          </p>
          <h2 className="mt-3 text-3xl font-black text-white">Aprender com intenção</h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Cada tema passa a funcionar como apoio direto a uma decisão do caso: quando considerar,
            quando evitar, erros frequentes, materiais relacionados e casos em que esse tema pesa mais.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href={nextTopic ? `/aprender?topic=${nextTopic.topicId}&source=home` : "/aprender"}
              className="rounded-2xl bg-amber-300 px-5 py-3 text-sm font-black text-slate-950"
            >
              Abrir tema prioritário
            </Link>
            <Link
              href="/historico"
              className="rounded-2xl border border-white/10 bg-slate-900 px-5 py-3 text-sm font-black text-white"
            >
              Ver histórico detalhado
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
