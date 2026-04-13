import Image from "next/image";
import type { CaseSession, ObservationId, ReviewStatus } from "@/lib/clinical";

function reviewCardClass(status: ReviewStatus, selected: boolean) {
  if (status === "correct") return "border-emerald-400/40 bg-emerald-500/15 text-emerald-50";
  if (status === "incorrect") return "border-rose-400/40 bg-rose-500/15 text-rose-50";
  if (status === "missed") return "border-sky-300/50 bg-sky-400/15 text-sky-50";
  if (selected) return "border-sky-400 bg-sky-500/10 text-sky-100";
  return "border-white/10 bg-slate-950/70 text-white hover:border-sky-400";
}

export function CaseObservationPanel({
  session,
  observationIds,
  reviewStatusById,
  reviewMode = false,
  onReveal,
}: {
  session: CaseSession;
  observationIds: ObservationId[];
  reviewStatusById?: Partial<Record<ObservationId, ReviewStatus>>;
  reviewMode?: boolean;
  onReveal: (id: ObservationId) => void;
}) {
  const imageSeen = reviewMode || observationIds.includes("imagem");
  const visibleObservationIds = new Set(
    session.template.observationDefinitions
      .filter(
        (definition) =>
          definition.id !== "imagem" &&
          (observationIds.includes(definition.id) || reviewStatusById?.[definition.id] === "missed")
      )
      .map((definition) => definition.id)
  );

  const revealedObservations = session.template.observationDefinitions
    .filter((definition) => visibleObservationIds.has(definition.id))
    .map((definition) => ({
      definition,
      detail: session.variant.observationDetails[definition.id],
      status: reviewStatusById?.[definition.id] ?? null,
    }))
    .filter((item) => item.detail);

  return (
    <div className="grid h-full gap-4 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="flex flex-col overflow-y-auto rounded-[28px] border border-white/10 bg-slate-950/60 p-4">
        <div className="flex min-h-[240px] flex-1 items-center justify-center overflow-hidden rounded-[24px] border border-white/10 bg-black/50 p-4">
          {imageSeen ? (
            <Image
              src={session.template.imageSrc}
              alt={session.template.imageAlt}
              width={1600}
              height={1200}
              className="h-full w-full rounded-[18px] object-contain"
            />
          ) : (
            <button
              type="button"
              onClick={() => onReveal("imagem")}
              className="max-w-md text-balance text-lg font-semibold text-slate-300"
            >
              Seleciona <span className="text-sky-300 underline">Ver imagem da ferida</span> para
              abrir a fotografia clínica.
            </button>
          )}
        </div>

        {reviewMode ? (
          <div className="mt-4 rounded-[24px] border border-white/10 bg-slate-900/60 p-4 text-sm text-slate-200">
            <p className="font-black text-white">Legenda da revisão</p>
            <p className="mt-2 leading-6">
              Verde: selecionaste uma observação correta. Vermelho: escolheste algo desnecessário ou
              errado. Azul claro: faltou selecionar uma observação importante.
            </p>
          </div>
        ) : null}

        <div className="mt-4 space-y-3">
          {revealedObservations.length > 0 ? (
            revealedObservations.map(({ definition, detail, status }) => (
              <div
                key={definition.id}
                className={`rounded-[24px] border p-4 text-center ${
                  status === "correct"
                    ? "border-emerald-400/30 bg-emerald-500/10"
                    : status === "incorrect"
                      ? "border-rose-400/30 bg-rose-500/10"
                      : status === "missed"
                        ? "border-sky-300/40 bg-sky-400/10"
                        : "border-sky-500/20 bg-sky-500/10"
                }`}
              >
                <p className="text-sm font-black uppercase tracking-[0.18em] text-sky-100">
                  {definition.label}
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-100">{detail.detail}</p>
              </div>
            ))
          ) : (
            <div className="rounded-[24px] border border-white/10 bg-slate-900/60 p-4 text-center text-sm text-slate-300">
              Seleciona uma observação para ver o detalhe aqui, por baixo da imagem.
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/80 p-4">
        <p className="shrink-0 text-sm font-black uppercase tracking-[0.2em] text-sky-300">
          Observação guiada
        </p>
        <div className="mt-3 flex-1 space-y-2 overflow-y-auto">
          {session.template.observationDefinitions
            .filter((definition) => definition.id !== "imagem")
            .map((definition) => {
              const revealed = observationIds.includes(definition.id);
              const status = reviewStatusById?.[definition.id] ?? null;

              return (
                <button
                  key={definition.id}
                  type="button"
                  onClick={() => onReveal(definition.id)}
                  className={`w-full rounded-2xl border px-4 py-2.5 text-left text-sm font-bold transition ${reviewCardClass(
                    status,
                    revealed
                  )}`}
                >
                  {definition.prompt}
                </button>
              );
            })}
        </div>
      </div>
    </div>
  );
}
