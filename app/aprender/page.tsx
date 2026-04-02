"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { obterEvidenciaMaterial } from "@/app/lib/evidencia-materiais";
import type { TratamentoId } from "@/app/types/simulador";
import { listLearningTopics, getTreatmentsForLearningTopic, groupTreatmentsByCategory, getCasesForLearningTopic } from "@/lib/learning";

export default function AprenderPage() {
  const topics = useMemo(() => listLearningTopics(), []);
  const [activeTopicId, setActiveTopicId] = useState(topics[0]?.id ?? "");
  const activeTopic = topics.find((topic) => topic.id === activeTopicId) ?? topics[0];

  const materialsByCategory = useMemo(() => {
    if (!activeTopic) return {};
    return groupTreatmentsByCategory(getTreatmentsForLearningTopic(activeTopic));
  }, [activeTopic]);

  const relatedCases = useMemo(() => {
    if (!activeTopic) return [];
    return getCasesForLearningTopic(activeTopic);
  }, [activeTopic]);

  if (!activeTopic) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#0a0f1e] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#60a5fa]">
              Área pedagógica
            </p>
            <h1 className="mt-1 text-4xl font-black">Aprender</h1>
          </div>
          <div className="flex gap-3">
            <Link
              href="/"
              className="rounded-xl border border-[#334155] bg-[#111827] px-4 py-2 font-bold hover:bg-[#1f2937]"
            >
              Início
            </Link>
            <Link
              href="/casos"
              className="rounded-xl bg-[#1d4ed8] px-4 py-2 font-bold text-white hover:bg-[#2563eb]"
            >
              Casos
            </Link>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="rounded-[34px] border-2 border-[#334155] bg-[#111827] p-4">
            <div className="space-y-3">
              {topics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => setActiveTopicId(topic.id)}
                  className={`w-full rounded-2xl border-2 px-4 py-3 text-left text-base font-black transition ${
                    activeTopic.id === topic.id
                      ? "border-[#facc15] bg-[#1d4ed8] text-white"
                      : "border-[#334155] bg-[#0f172a] hover:border-[#60a5fa]"
                  }`}
                >
                  {topic.title}
                </button>
              ))}
            </div>
          </aside>

          <section className="rounded-[34px] border-2 border-[#334155] bg-[#111827] p-6">
            <h2 className="text-3xl font-black text-[#60a5fa]">{activeTopic.title}</h2>

            <div className="mt-5 space-y-4 text-base leading-relaxed text-[#e2e8f0]">
              <div>
                <p className="font-black text-[#facc15]">Objetivo</p>
                <p>{activeTopic.objective}</p>
              </div>
              <div>
                <p className="font-black text-[#60a5fa]">Quando usar</p>
                <ul className="list-disc pl-6">
                  {activeTopic.whenToUse.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-black text-[#ef4444]">Quando evitar</p>
                <ul className="list-disc pl-6">
                  {activeTopic.whenToAvoid.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-black text-[#60a5fa]">Exemplos práticos</p>
                <ul className="list-disc pl-6">
                  {activeTopic.practicalExamples.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            {relatedCases.length > 0 ? (
              <div className="mt-8 rounded-3xl border-2 border-[#334155] bg-[#0f172a] p-5">
                <h3 className="text-xl font-black text-[#facc15]">Casos onde este tema é central</h3>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {relatedCases.map((relatedCase) => (
                    <Link
                      key={relatedCase.id}
                      href={`/casos/${relatedCase.id}`}
                      className="rounded-2xl border border-[#334155] bg-[#111827] p-4 transition hover:border-[#60a5fa]"
                    >
                      <p className="font-black text-white">{relatedCase.shortTitle}</p>
                      <p className="mt-2 text-sm text-[#cbd5e1]">{relatedCase.title}</p>
                      <p className="mt-3 text-xs uppercase tracking-wide text-[#60a5fa]">
                        Abrir caso
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-8 rounded-3xl border-2 border-[#334155] bg-[#0f172a] p-5">
              <h3 className="text-xl font-black text-[#facc15]">
                Materiais relacionados com este tema
              </h3>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {Object.entries(materialsByCategory).map(([categoria, items]) => (
                  <div
                    key={categoria}
                    className="rounded-2xl border border-[#334155] bg-[#111827] p-4"
                  >
                    <p className="mb-2 font-black text-[#60a5fa]">{categoria}</p>
                    <ul className="space-y-2 text-sm text-[#e2e8f0]">
                      {items.map((treatment) => {
                        const evidence = obterEvidenciaMaterial(treatment.id as TratamentoId);
                        return (
                          <li key={treatment.id}>
                            • {treatment.nome}
                            {evidence ? (
                              <a
                                href={evidence.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-2 text-xs text-[#93c5fd] underline"
                              >
                                artigo científico
                              </a>
                            ) : null}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
