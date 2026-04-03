import type { CaseSession } from "@/lib/clinical";

export function CaseIntro({
  session,
  onStart,
}: {
  session: CaseSession;
  onStart: () => void;
}) {
  return (
    <div className="mx-auto max-w-3xl rounded-[32px] border border-white/10 bg-slate-950/60 p-8 text-center shadow-2xl shadow-slate-950/40">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-sky-300">
        Caso clínico
      </p>
      <h1 className="mt-4 text-4xl font-black text-white md:text-5xl">
        {session.template.shortTitle} · {session.template.title}
      </h1>
      <p className="mt-6 text-base leading-7 text-slate-300 md:text-lg">
        {session.template.introSummary}
      </p>
      <div className="mt-8 rounded-3xl border border-white/10 bg-slate-900/80 p-5 text-left">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-300">
          Contexto clínico
        </p>
        <p className="mt-3 text-sm leading-7 text-slate-200">{session.variant.patientContext}</p>
      </div>
      <div className="mt-5 rounded-3xl border border-white/10 bg-slate-900/70 p-5 text-left">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-sky-300">
          Objetivo
        </p>
        <p className="mt-3 text-sm leading-7 text-slate-200">{session.template.objective}</p>
      </div>
      <button
        type="button"
        onClick={onStart}
        className="mt-8 rounded-2xl bg-amber-300 px-7 py-4 text-base font-black text-slate-950 transition hover:bg-amber-200"
      >
        Iniciar caso
      </button>
    </div>
  );
}
