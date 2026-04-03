import Link from "next/link";
import {
  getEvidence,
  getLearningTopic,
  getRelatedCasesForTopic,
  getTreatmentsForTopic,
  listLearningTopics,
} from "@/lib/clinical";

function capitalizeSentence(value: string) {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function difficultyLabel(value: string) {
  if (value === "base") return "Base";
  if (value === "intermedio") return "Intermédio";
  return "Avançado";
}

export default async function LearningPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const topics = listLearningTopics();
  const topicParam = Array.isArray(resolvedSearchParams.topic)
    ? resolvedSearchParams.topic[0]
    : resolvedSearchParams.topic;
  const sourceParam = Array.isArray(resolvedSearchParams.source)
    ? resolvedSearchParams.source[0]
    : resolvedSearchParams.source;
  const reasonParam = Array.isArray(resolvedSearchParams.reason)
    ? resolvedSearchParams.reason[0]
    : resolvedSearchParams.reason;
  const activeTopic = topics.find((topic) => topic.id === topicParam) ?? topics[0];
  const relatedTreatments = getTreatmentsForTopic(activeTopic.id);
  const relatedCases = getRelatedCasesForTopic(activeTopic.id);
  const relatedTopics = activeTopic.relatedTopicIds
    .map((topicId) => getLearningTopic(topicId))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <main className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="rounded-[32px] border border-white/10 bg-slate-950/60 p-4">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-sky-300">Aprender</p>
        <div className="mt-4 space-y-3">
          {topics.map((topic) => (
            <Link
              key={topic.id}
              href={`/aprender?topic=${topic.id}`}
              className={`block rounded-2xl border px-4 py-3 text-sm font-bold transition ${
                topic.id === activeTopic.id
                  ? "border-amber-300 bg-amber-300 text-slate-950"
                  : "border-white/10 bg-slate-900/80 text-white hover:border-sky-400"
              }`}
            >
              {topic.title}
            </Link>
          ))}
        </div>
      </aside>

      <section className="space-y-5">
        <div className="rounded-[32px] border border-white/10 bg-slate-950/60 p-6">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-amber-300">
              Biblioteca clínica
            </p>
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-200">
              {difficultyLabel(activeTopic.pedagogicalDifficulty)}
            </span>
          </div>
          <h1 className="mt-3 text-4xl font-black text-white">{activeTopic.title}</h1>
          <p className="mt-4 max-w-4xl text-base leading-7 text-slate-300">
            {capitalizeSentence(activeTopic.definition)}
          </p>

          {reasonParam ? (
            <div className="mt-5 rounded-2xl border border-sky-500/20 bg-sky-500/10 p-4 text-sm leading-6 text-sky-50">
              <p className="font-black uppercase tracking-wide text-sky-200">
                Porque este tema te foi recomendado
              </p>
              <p className="mt-2">{reasonParam}</p>
              {sourceParam ? (
                <p className="mt-2 text-xs uppercase tracking-wide text-sky-100/80">
                  Origem: {sourceParam}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-sky-300">
              Quando considerar
            </p>
            <div className="mt-4 space-y-2 text-sm text-slate-200">
              {activeTopic.indications.map((item) => (
                <div key={item} className="rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2">
                  {capitalizeSentence(item)}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-rose-300">
              Quando evitar
            </p>
            <div className="mt-4 space-y-2 text-sm text-slate-200">
              {activeTopic.contraindications.map((item) => (
                <div key={item} className="rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2">
                  {capitalizeSentence(item)}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-amber-300">
              Sinais de alerta
            </p>
            <div className="mt-4 space-y-2 text-sm text-slate-200">
              {activeTopic.warningSigns.map((item) => (
                <div key={item} className="rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2">
                  {capitalizeSentence(item)}
                </div>
              ))}
            </div>

            <p className="mt-6 text-sm font-black uppercase tracking-[0.18em] text-rose-300">
              Erros frequentes
            </p>
            <div className="mt-4 space-y-3">
              {activeTopic.commonMistakes.map((mistake) => (
                <div key={mistake.id} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                  <p className="font-black text-white">{capitalizeSentence(mistake.title)}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {capitalizeSentence(mistake.explanation)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-sky-300">
                Materiais relacionados
              </p>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {relatedTreatments.map((treatment) => (
                  <div key={treatment.id} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                    <p className="font-black text-white">{treatment.label}</p>
                    <p className="mt-2 text-xs uppercase tracking-wide text-sky-300">
                      {treatment.uiTags.map(capitalizeSentence).join(" · ")}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      Indicações: {treatment.indications.map(capitalizeSentence).join(", ")}.
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      Contraindicações:{" "}
                      {treatment.contraindications.length > 0
                        ? treatment.contraindications.map(capitalizeSentence).join(", ")
                        : "Sem registo."}
                    </p>
                    <div className="mt-3 space-y-2">
                      {treatment.evidenceRefs.map((evidenceId) => {
                        const evidence = getEvidence(evidenceId);
                        if (!evidence) return null;
                        return (
                          <a
                            key={evidenceId}
                            href={evidence.url}
                            target="_blank"
                            rel="noreferrer"
                            className="block text-xs text-sky-200 underline"
                          >
                            {evidence.title}
                          </a>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-amber-300">
                Casos em que este tema é central
              </p>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {relatedCases.map((caseItem) => (
                  <Link
                    key={caseItem.id}
                    href={`/casos/${caseItem.id}`}
                    className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 transition hover:border-sky-400"
                  >
                    <p className="font-black text-white">{caseItem.shortTitle}</p>
                    <p className="mt-2 text-sm text-slate-300">{capitalizeSentence(caseItem.title)}</p>
                    <p className="mt-3 text-xs uppercase tracking-wide text-amber-200">
                      Este caso obriga a aplicar {activeTopic.title.toLowerCase()} em contexto.
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-sky-300">
                Temas relacionados
              </p>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {relatedTopics.map((topic) => (
                  <Link
                    key={topic.id}
                    href={`/aprender?topic=${topic.id}`}
                    className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 transition hover:border-sky-400"
                  >
                    <p className="font-black text-white">{topic.title}</p>
                    <p className="mt-2 text-sm text-slate-300">
                      Dificuldade {difficultyLabel(topic.pedagogicalDifficulty).toLowerCase()}.
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
