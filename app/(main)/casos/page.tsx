"use client";

import Link from "next/link";
import { startTransition, useEffect, useMemo, useState } from "react";
import {
  type AttemptRecord,
  getCaseProgress,
  getRecommendedNextCases,
  listCaseTemplates,
  loadAttemptHistory,
} from "@/lib/clinical";

function difficultyLabel(value: string) {
  if (value === "introdutorio") return "Introdutório";
  if (value === "intermedio") return "Intermédio";
  return "Avançado";
}

export default function CasesPage() {
  const cases = listCaseTemplates().filter((item) => item.status === "disponivel");
  const [history, setHistory] = useState<AttemptRecord[]>([]);

  useEffect(() => {
    startTransition(() => {
      setHistory(loadAttemptHistory());
    });
  }, []);

  const recommendedCaseIds = useMemo(
    () => new Set(getRecommendedNextCases(history).map((item) => item.templateId)),
    [history]
  );

  return (
    <main className="space-y-6">
      <section className="rounded-[32px] border border-white/10 bg-slate-950/60 p-6">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-sky-300">
          Resolver casos
        </p>
        <h1 className="mt-3 text-4xl font-black text-white">Casos clínicos</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
          Cada caso foi organizado como um percurso clínico único para treinar a leitura do leito,
          a priorização terapêutica e a coerência entre tratamentos, técnica e feedback.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cases.map((item) => {
          const progress = getCaseProgress(history, item.id);
          const recommended = recommendedCaseIds.has(item.id);

          return (
            <Link
              key={item.id}
              href={`/casos/${item.id}`}
              className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5 transition hover:border-sky-400"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-sky-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-sky-100">
                  {item.shortTitle}
                </span>
                <span className="text-xs uppercase tracking-wide text-slate-400">
                  {item.estimatedMinutes} min
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-bold uppercase tracking-wide">
                <span className="rounded-full border border-white/10 px-3 py-1 text-slate-200">
                  {difficultyLabel(item.difficulty)}
                </span>
                {recommended ? (
                  <span className="rounded-full bg-amber-300 px-3 py-1 text-slate-950">
                    Recomendado
                  </span>
                ) : null}
              </div>

              <h2 className="mt-4 text-2xl font-black text-white">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">{item.description}</p>

              <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-xs leading-6 text-slate-300">
                <p className="font-black uppercase tracking-wide text-sky-300">Competências</p>
                <p className="mt-2">{item.competencies}</p>
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300">
                {progress.hasCompleted ? (
                  <>
                    <p className="font-black text-white">
                      Melhor {progress.bestScore}/100 · Média {progress.averageScore}/100
                    </p>
                    <p className="mt-2 leading-6">
                      {progress.attempts} tentativa(s) registada(s).
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-black text-white">Ainda não tentado</p>
                    <p className="mt-2 leading-6">
                      Bom caso para iniciar ou diversificar o treino individual.
                    </p>
                  </>
                )}
              </div>
            </Link>
          );
        })}
      </section>
    </main>
  );
}
