"use client";

import { useDeferredValue, useMemo, useState } from "react";
import type { ApplicationId, CaseSession, ReviewStatus } from "@/lib/clinical";
import { getTreatment, listTreatments } from "@/lib/clinical";

function reviewCardClass(status: ReviewStatus, selected: boolean) {
  if (status === "correct") return "border-emerald-400/40 bg-emerald-500/15 text-emerald-50";
  if (status === "incorrect") return "border-rose-400/40 bg-rose-500/15 text-rose-50";
  if (status === "missed") return "border-sky-300/50 bg-sky-400/15 text-sky-50";
  if (selected) return "border-sky-400 bg-sky-500/10 text-sky-100";
  return "border-white/10 bg-slate-950/70 text-white hover:border-sky-400";
}

export function CaseTreatmentPlanner({
  session,
  treatmentIds,
  applicationIds,
  treatmentStatusById,
  applicationStatusById,
  reviewMode = false,
  filter,
  onFilterChange,
  onToggleTreatment,
  onToggleApplication,
}: {
  session: CaseSession;
  treatmentIds: string[];
  applicationIds: ApplicationId[];
  treatmentStatusById?: Record<string, ReviewStatus>;
  applicationStatusById?: Partial<Record<ApplicationId, ReviewStatus>>;
  reviewMode?: boolean;
  filter: string;
  onFilterChange: (value: string) => void;
  onToggleTreatment: (id: string) => void;
  onToggleApplication: (id: ApplicationId) => void;
}) {
  const deferredFilter = useDeferredValue(filter);

  // Toggle global: "nome_comercial" ou "substancia_ativa"
  const [labelMode, setLabelMode] = useState<"nome_comercial" | "substancia_ativa">(
    "substancia_ativa"
  );

  const groupedTreatments = useMemo(() => {
    const visible = listTreatments().filter((treatment) => {
      const haystack = [
        treatment.label,
        treatment.nome_comercial ?? "",
        treatment.substancia_ativa ?? "",
        treatment.category,
        treatment.subCategory,
        ...treatment.uiTags,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(deferredFilter.trim().toLowerCase());
    });

    const CATEGORY_ORDER = ["Apósito", "Líquidos", "Pomadas", "Outros"];
    const grouped = visible.reduce<Record<string, typeof visible>>((acc, treatment) => {
      if (!acc[treatment.category]) acc[treatment.category] = [];
      acc[treatment.category].push(treatment);
      return acc;
    }, {});
    // Ordena pelas 4 categorias fixas; categorias desconhecidas vão para o fim
    return Object.fromEntries(
      CATEGORY_ORDER
        .filter((cat) => cat in grouped)
        .concat(Object.keys(grouped).filter((cat) => !CATEGORY_ORDER.includes(cat)))
        .map((cat) => [cat, grouped[cat]])
    );
  }, [deferredFilter]);

  /** Retorna o rótulo do material conforme o modo seleccionado */
  function getTreatmentDisplayLabel(treatment: ReturnType<typeof getTreatment>) {
    if (!treatment) return "";
    if (labelMode === "substancia_ativa") {
      return treatment.substancia_ativa ?? treatment.label;
    }
    return treatment.nome_comercial ?? treatment.label;
  }

  return (
    <div className="grid h-full gap-4 xl:grid-cols-[1.15fr_0.85fr]">
      <div className="flex flex-col overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/60 p-4">
        <div className="shrink-0 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-sky-300">
              Plano terapêutico
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Filtra por função clínica, categoria ou nome do material.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {/* Toggle Nome comercial / Substância ativa */}
            <div className="flex items-center rounded-2xl border border-white/10 bg-slate-900 p-1 text-xs font-black">
              <button
                type="button"
                onClick={() => setLabelMode("nome_comercial")}
                className={`rounded-xl px-3 py-1.5 transition ${
                  labelMode === "nome_comercial"
                    ? "bg-sky-500 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Nome comercial
              </button>
              <button
                type="button"
                onClick={() => setLabelMode("substancia_ativa")}
                className={`rounded-xl px-3 py-1.5 transition ${
                  labelMode === "substancia_ativa"
                    ? "bg-sky-500 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Substância ativa
              </button>
            </div>
            <input
              value={filter}
              onChange={(event) => onFilterChange(event.target.value)}
              placeholder="Ex.: prata, absorvente, barreira"
              className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-400"
            />
          </div>
        </div>

        {reviewMode ? (
          <div className="mt-3 shrink-0 rounded-2xl border border-white/10 bg-slate-900/70 p-3 text-xs leading-5 text-slate-200">
            Verde marca materiais ou técnicas corretos, vermelho mostra o que não devia ter sido
            escolhido e azul claro mostra o que faltou selecionar.
          </div>
        ) : null}

        <div className="mt-3 flex-1 space-y-3 overflow-y-auto">
          {Object.entries(groupedTreatments).map(([category, items]) => (
            <section
              key={category}
              className="rounded-3xl border border-white/10 bg-slate-900/80 p-4"
            >
              <p className="text-sm font-black text-sky-200">{category}</p>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                {items.map((treatment) => {
                  const selected = treatmentIds.includes(treatment.id);
                  const status = treatmentStatusById?.[treatment.id] ?? null;
                  const displayLabel = getTreatmentDisplayLabel(treatment);

                  return (
                    <label
                      key={treatment.id}
                      className={`flex items-start gap-3 rounded-2xl border p-4 transition ${reviewCardClass(
                        status,
                        selected
                      )}`}
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => onToggleTreatment(treatment.id)}
                        disabled={reviewMode}
                        className="mt-1 h-4 w-4"
                      />
                      <span className="min-w-0">
                        <span className="block font-bold">{displayLabel}</span>
                        {/* Mostrar o nome alternativo em segundo plano */}
                        <span className="mt-0.5 block text-xs opacity-60">
                          {labelMode === "nome_comercial"
                            ? (treatment.substancia_ativa ?? treatment.label)
                            : (treatment.nome_comercial ?? treatment.label)}
                        </span>
                        <span className="mt-1 block text-xs text-slate-300">
                          {treatment.uiTags.join(" · ")}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 overflow-y-auto">
        <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-4">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-amber-300">
            Materiais escolhidos
          </p>
          <div className="mt-4 space-y-2 text-sm text-slate-200">
            {treatmentIds.length > 0 ? (
              treatmentIds.map((treatmentId) => {
                const treatment = getTreatment(treatmentId);
                const status = treatmentStatusById?.[treatmentId] ?? null;
                const displayLabel = getTreatmentDisplayLabel(treatment);

                return (
                  <div
                    key={treatmentId}
                    className={`rounded-xl border px-3 py-2 ${reviewCardClass(status, true)}`}
                  >
                    <span className="font-semibold">{displayLabel}</span>
                    {treatment && (
                      <span className="ml-2 text-xs opacity-60">
                        {labelMode === "nome_comercial"
                          ? (treatment.substancia_ativa ?? "")
                          : (treatment.nome_comercial ?? "")}
                      </span>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-slate-400">Ainda não selecionaste materiais.</p>
            )}
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-4">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-sky-300">
            Técnica de aplicação
          </p>
          <div className="mt-4 space-y-3">
            {session.variant.applicationOptions.map((applicationId) => {
              const definition = session.template.applicationDefinitions.find(
                (item) => item.id === applicationId
              );
              const selected = applicationIds.includes(applicationId);
              const status = applicationStatusById?.[applicationId] ?? null;

              return (
                <label
                  key={applicationId}
                  className={`flex items-start gap-3 rounded-2xl border p-4 transition ${reviewCardClass(
                    status,
                    selected
                  )}`}
                >
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => onToggleApplication(applicationId)}
                    disabled={reviewMode}
                    className="mt-1 h-4 w-4"
                  />
                  <span className="text-sm font-semibold">{definition?.label}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
