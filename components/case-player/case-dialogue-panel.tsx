import type { CaseSession, DialogueId, ReviewStatus } from "@/lib/clinical";

function reviewButtonClass(status: ReviewStatus, selected: boolean) {
  if (status === "correct") return "border-emerald-400/40 bg-emerald-500/15 text-emerald-50";
  if (status === "incorrect") return "border-rose-400/40 bg-rose-500/15 text-rose-50";
  if (status === "missed") return "border-sky-300/50 bg-sky-400/15 text-sky-50";
  if (selected) return "border-sky-400 bg-sky-500/10 text-sky-100";
  return "border-white/10 bg-slate-950/70 text-white hover:border-sky-400";
}

export function CaseDialoguePanel({
  session,
  dialogueIds,
  activeDialogueId,
  reviewStatusById,
  reviewMode = false,
  onAsk,
}: {
  session: CaseSession;
  dialogueIds: DialogueId[];
  activeDialogueId: DialogueId | null;
  reviewStatusById?: Partial<Record<DialogueId, ReviewStatus>>;
  reviewMode?: boolean;
  onAsk: (id: DialogueId) => void;
}) {
  return (
    <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-4">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-sky-300">
          Perguntas clínicas
        </p>
        <div className="mt-4 space-y-3">
          {session.template.dialoguePrompts.map((prompt) => {
            const asked = dialogueIds.includes(prompt.id);
            const status = reviewStatusById?.[prompt.id] ?? null;

            return (
              <button
                key={prompt.id}
                type="button"
                onClick={() => onAsk(prompt.id)}
                className={`w-full rounded-2xl border px-4 py-3 text-left text-sm font-bold transition ${reviewButtonClass(
                  status,
                  asked
                )}`}
              >
                {prompt.label}
              </button>
            );
          })}
        </div>
        <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/70 p-3 text-sm text-slate-300">
          {reviewMode
            ? "As perguntas assinaladas a azul claro eram úteis e não foram selecionadas."
            : dialogueIds.length > 0
              ? `Já exploraste ${dialogueIds.length} pergunta(s) desta variante.`
              : "Ainda não iniciaste o diálogo clínico."}
        </div>
      </div>

      <div className="rounded-[28px] border border-white/10 bg-slate-950/60 p-4">
        {activeDialogueId ? (
          <div className="space-y-4">
            <div className="rounded-3xl border border-sky-500/20 bg-sky-500/10 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-200">Tu</p>
              <p className="mt-3 text-lg font-semibold text-white">
                {
                  session.template.dialoguePrompts.find((prompt) => prompt.id === activeDialogueId)
                    ?.question
                }
              </p>
            </div>
            <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-200">
                Utente
              </p>
              <p className="mt-3 text-lg font-semibold text-white">
                {session.variant.dialogueResponses[activeDialogueId]}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex min-h-[280px] items-center justify-center rounded-3xl border border-dashed border-white/10 text-center text-lg font-semibold text-slate-400">
            Seleciona uma pergunta para iniciar o diálogo clínico.
          </div>
        )}
      </div>
    </div>
  );
}
