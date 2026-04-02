"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { agruparTratamentosPorCategoriaESubcategoria } from "@/app/lib/tratamentos-helper";
import { criarHistoricoId, guardarHistorico } from "@/app/lib/simulador";
import type {
  AplicacaoId,
  HistoricoResolucao,
  PerguntaId,
  TratamentoId,
} from "@/app/types/simulador";
import { evaluateCaseAttempt } from "@/lib/case-evaluation";
import { getCaseById } from "@/lib/cases";
import { buildCaseProgress, buildLearningRecommendations, buildReasoningSummary } from "@/lib/pedagogy";
import type { CaseDifficulty, ObservationId } from "@/types/clinical";

type Aba = "observacao" | "dialogo" | "tratamento" | "resultado";

const DIALOGUE_BUTTON_LABELS: Record<PerguntaId, string> = {
  dor: "Perguntar sobre dor",
  duracao: "Perguntar duração do problema",
  posicao: "Perguntar sobre alívio de pressão",
  pensos: "Perguntar sobre pensos anteriores",
  febre: "Perguntar sobre febre",
  mobilidade: "Perguntar sobre mobilidade",
};

const DIFFICULTY_LABELS: Record<CaseDifficulty, string> = {
  introdutorio: "Introdutório",
  intermedio: "Intermédio",
  avancado: "Avançado",
};

export function CasePlayer({ caseId }: { caseId: string }) {
  const resolvedCaseDefinition = getCaseById(caseId);
  if (!resolvedCaseDefinition) {
    throw new Error(`Case not found: ${caseId}`);
  }
  const caseDefinition = resolvedCaseDefinition;

  const { config, imageFit = "contain" } = caseDefinition;
  const { respostasDialogo, textoPerguntas, nomesPerguntas, nomesAplicacoes } = config;
  const [started, setStarted] = useState(false);
  const [tab, setTab] = useState<Aba>("observacao");
  const [showDetails, setShowDetails] = useState(false);
  const [observationIds, setObservationIds] = useState<ObservationId[]>([]);
  const [questionIds, setQuestionIds] = useState<PerguntaId[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<PerguntaId | null>(null);
  const [treatmentIds, setTreatmentIds] = useState<TratamentoId[]>([]);
  const [applicationIds, setApplicationIds] = useState<AplicacaoId[]>([]);

  const groupedTreatments = useMemo(
    () =>
      Object.entries(agruparTratamentosPorCategoriaESubcategoria()).map(
        ([categoria, subcategorias]) => ({
          categoria,
          subcategorias: Object.entries(subcategorias).map(([subcategoria, tratamentos]) => ({
            subcategoria,
            itens: tratamentos.map((tratamento) => ({
              id: tratamento.id as TratamentoId,
              nome: tratamento.nome,
            })),
          })),
        })
      ),
    []
  );

  const treatmentNames = useMemo(
    () =>
      Object.fromEntries(
        groupedTreatments.flatMap((grupo) =>
          grupo.subcategorias.flatMap((subgrupo) =>
            subgrupo.itens.map((item) => [item.id, item.nome])
          )
        )
      ) as Record<TratamentoId, string>,
    [groupedTreatments]
  );

  const evaluation = evaluateCaseAttempt(
    caseDefinition,
    {
      observationIds,
      questionIds,
      treatmentIds,
      applicationIds,
    },
    treatmentNames
  );
  const progress = buildCaseProgress(caseDefinition, {
    observationIds,
    questionIds,
    treatmentIds,
    applicationIds,
  });
  const reasoningSummary = buildReasoningSummary(evaluation.sections);
  const learningRecommendations = buildLearningRecommendations(
    caseDefinition,
    evaluation.sections
  );

  function revealObservation(id: ObservationId) {
    setObservationIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }

  function askQuestion(id: PerguntaId) {
    setQuestionIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setCurrentQuestion(id);
  }

  function toggleTreatment(id: TratamentoId) {
    const name = treatmentNames[id];
    const relatedIds = (Object.entries(treatmentNames) as [TratamentoId, string][])
      .filter(([, treatmentName]) => treatmentName === name)
      .map(([treatmentId]) => treatmentId);

    setTreatmentIds((prev) => {
      const allSelected = relatedIds.every((item) => prev.includes(item));
      return allSelected
        ? prev.filter((item) => !relatedIds.includes(item))
        : [...new Set([...prev, ...relatedIds])];
    });
  }

  function toggleApplication(id: AplicacaoId) {
    setApplicationIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  function resetCase() {
    setStarted(false);
    setTab("observacao");
    setShowDetails(false);
    setObservationIds([]);
    setQuestionIds([]);
    setCurrentQuestion(null);
    setTreatmentIds([]);
    setApplicationIds([]);
  }

  function saveHistory() {
    const historyEntry: HistoricoResolucao = {
      id: criarHistoricoId(),
      casoId: `caso-${caseDefinition.id}`,
      casoTitulo: caseDefinition.caseTitleForHistory,
      dificuldadeCaso: DIFFICULTY_LABELS[caseDefinition.difficulty],
      pontuacao: evaluation.score,
      data: new Date().toISOString(),
      observacoes: observationIds.map(
        (id) =>
          caseDefinition.observationItems.find((item) => item.id === id)?.detailLabel.toLowerCase() ??
          id
      ),
      perguntas: questionIds.map((id) => nomesPerguntas[id]),
      tratamentos: treatmentIds.map((id) => treatmentNames[id]),
      aplicacoes: applicationIds.map((id) => nomesAplicacoes[id]),
      feedback: evaluation.feedback,
      avaliacaoDetalhada: evaluation.sections,
      linksFeedback: evaluation.feedbackLinks,
      recomendacoesAprendizagem: learningRecommendations.map((topic) => topic.title),
    };

    guardarHistorico(historyEntry);
  }

  function finishCase() {
    if (tab === "resultado" || !progress.readyToSubmit) return;
    saveHistory();
    setTab("resultado");
    setShowDetails(false);
  }

  const actionButton =
    "w-full rounded-xl border border-[#334155] bg-white px-4 py-3 text-left text-sm font-semibold text-[#0f172a] transition hover:bg-[#f8fafc]";
  const checkboxCard =
    "flex w-full items-start gap-3 rounded-xl border border-[#334155] bg-white px-4 py-3 text-left text-sm font-semibold text-[#0f172a] transition hover:bg-[#f8fafc]";

  return (
    <main className="min-h-screen bg-[#0b1220] p-4 text-white">
      <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[260px_1fr]">
        <aside className="rounded-[28px] border border-[#334155] bg-[#111827] p-4">
          <div className="rounded-[20px] border border-[#334155] bg-[#0f172a] p-4">
            <h1 className="text-3xl font-black">{caseDefinition.shortTitle}</h1>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wide">
              <span className="rounded-full bg-[#1d4ed8] px-3 py-1 text-white">
                {DIFFICULTY_LABELS[caseDefinition.difficulty]}
              </span>
              <span className="rounded-full bg-[#1f2937] px-3 py-1 text-[#cbd5e1]">
                Percurso {caseDefinition.sequence}
              </span>
              <span className="rounded-full bg-[#1f2937] px-3 py-1 text-[#cbd5e1]">
                {caseDefinition.estimatedMinutes} min
              </span>
            </div>
          </div>

          <div className="mt-4 rounded-[20px] border border-[#334155] bg-[#1f2937] p-4">
            <p className="mb-4 text-center text-2xl font-black text-[#1d4ed8]">Ações</p>
            {[
              ["observacao", "Observação"],
              ["dialogo", "Diálogo"],
              ["tratamento", "Tratamento"],
            ].map(([id, label]) => (
              <button
                key={id}
                onClick={() => setTab(id as Aba)}
                disabled={!started}
                className={`mb-3 w-full rounded-xl border px-4 py-3 text-left text-base font-bold ${
                  !started
                    ? "cursor-not-allowed border-[#334155] bg-[#475569] text-[#cbd5e1]"
                    : tab === id
                      ? "border-[#1d4ed8] bg-[#0f172a] text-[#1d4ed8]"
                      : "border-[#334155] bg-white text-[#0f172a]"
                }`}
              >
                {label}
              </button>
            ))}
            <div className="rounded-[18px] border border-[#334155] bg-[#0f172a] p-3">
              <p className="text-sm font-bold text-[#1d4ed8]">Objetivo</p>
              <p className="mt-1 text-sm text-[#cbd5e1]">{caseDefinition.objective}</p>
            </div>
          </div>

          <div className="mt-4 rounded-[20px] border border-[#334155] bg-[#0f172a] p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[#60a5fa]">
                  ProgressÃ£o
                </p>
                <p className="mt-1 text-lg font-black text-white">{progress.currentStageLabel}</p>
              </div>
              <span className="rounded-full bg-[#1d4ed8] px-3 py-1 text-sm font-black text-white">
                {progress.percentage}%
              </span>
            </div>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#1f2937]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#1d4ed8] to-[#facc15]"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
            <div className="mt-4 space-y-2 text-sm">
              {progress.checklist.map((item) => (
                <div
                  key={item.label}
                  className={`rounded-xl border px-3 py-2 ${
                    item.done
                      ? "border-[#14532d] bg-[#052e16] text-[#dcfce7]"
                      : "border-[#334155] bg-[#111827] text-[#cbd5e1]"
                  }`}
                >
                  <p className="font-bold">{item.label}</p>
                  <p className="mt-1 text-xs">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <Link href="/casos" className="block rounded-xl border border-[#334155] bg-[#111827] px-4 py-3 text-center font-bold text-[#0f172a]">
              Voltar aos casos
            </Link>
            <Link href="/historico" className="block rounded-xl border border-[#334155] bg-[#b91c1c] px-4 py-3 text-center font-bold text-[#0f172a]">
              Histórico
            </Link>
          </div>
        </aside>

        <section className="rounded-[28px] border border-[#334155] bg-[#111827] p-4">
          {!started ? (
            <div className="mx-auto max-w-3xl rounded-[28px] border border-[#334155] bg-[#0f172a] p-8 text-center">
              {caseDefinition.introEyebrow ? (
                <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#1d4ed8]">
                  {caseDefinition.introEyebrow}
                </p>
              ) : null}
              <h2 className="mt-4 text-4xl font-black">{caseDefinition.introTitle}</h2>
              <p className="mt-6 text-lg text-[#cbd5e1]">{caseDefinition.introSummary}</p>
              <div className="mt-8 rounded-2xl border border-[#334155] bg-[#111827] p-5 text-left">
                {caseDefinition.introFocusLabel ? (
                  <p className="text-sm font-bold uppercase tracking-wide text-[#1d4ed8]">
                    {caseDefinition.introFocusLabel}
                  </p>
                ) : null}
                <p className={`${caseDefinition.introFocusLabel ? "mt-2" : ""} text-base`}>
                  {caseDefinition.introFocusText}
                </p>
              </div>
              <button
                onClick={() => setStarted(true)}
                className="mt-8 rounded-2xl bg-[#facc15] px-8 py-4 text-lg font-black text-[#0f172a]"
              >
                Iniciar caso
              </button>
            </div>
          ) : tab !== "resultado" ? (
            <div className="space-y-4">
              <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
                <div className="rounded-2xl border border-[#334155] bg-[#0f172a] px-5 py-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#60a5fa]">
                    Etapa atual
                  </p>
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xl font-black text-white">{progress.currentStageLabel}</p>
                    <p className="text-sm font-semibold text-[#cbd5e1]">
                      {progress.completedSteps}/{progress.totalSteps} etapas completas
                    </p>
                  </div>
                </div>

                <div
                  className={`rounded-2xl border px-5 py-4 text-sm ${
                    progress.readyToSubmit
                      ? "border-[#14532d] bg-[#052e16] text-[#dcfce7]"
                      : "border-[#78350f] bg-[#1c1917] text-[#fde68a]"
                  }`}
                >
                  <p className="font-black">
                    {progress.readyToSubmit
                      ? "Pronto para finalizar"
                      : "Finalização bloqueada até observação mínima"}
                  </p>
                  <p className="mt-2">
                    {progress.readyToSubmit
                      ? "Já reuniste informação suficiente para receber feedback final."
                      : "Revê a imagem, recolhe dados do utente e regista pelo menos uma decisão terapêutica e uma forma de aplicação."}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-[#334155] bg-[#0f172a] px-5 py-3 font-bold text-[#e2e8f0]">
                {caseDefinition.patientBanner}
              </div>

              <div className="grid gap-4 xl:grid-cols-[1.35fr_0.85fr]">
                <div className="rounded-[24px] border border-[#334155] bg-[#0f172a] p-4">
                  <div className="flex min-h-[420px] items-center justify-center overflow-hidden rounded-[20px] border border-[#334155] bg-black p-4">
                    {tab === "observacao" ? (
                      observationIds.includes("imagem") ? (
                        <Image
                          src={caseDefinition.imageSrc}
                          alt={caseDefinition.imageAlt}
                          width={1600}
                          height={1200}
                          className={`h-full w-full rounded-[16px] ${
                            imageFit === "cover" ? "object-cover" : "object-contain"
                          }`}
                        />
                      ) : (
                        <button
                          type="button"
                          onClick={() => revealObservation("imagem")}
                          className="text-lg font-semibold text-[#94a3b8]"
                        >
                          Clica em{" "}
                          <span className="font-black text-[#1d4ed8] underline">Ver imagem da ferida</span>{" "}
                          para visualizar a fotografia.
                        </button>
                      )
                    ) : tab === "dialogo" ? (
                      !currentQuestion ? (
                        <div className="text-center text-lg font-semibold text-[#94a3b8]">
                          Seleciona uma pergunta para iniciar o diálogo com o utente.
                        </div>
                      ) : (
                        <div className="w-full space-y-4">
                          <div className="rounded-[20px] border border-[#334155] bg-[#111827] p-4">
                            <p className="mb-1 text-sm font-black uppercase tracking-wide text-[#1d4ed8]">Tu</p>
                            <p className="text-lg font-semibold">{textoPerguntas[currentQuestion]}</p>
                          </div>
                          <div className="rounded-[20px] border border-[#334155] bg-[#1f2937] p-4">
                            <p className="mb-1 text-sm font-black uppercase tracking-wide text-[#22c55e]">Utente</p>
                            <p className="text-lg font-semibold">{respostasDialogo[currentQuestion]}</p>
                          </div>
                        </div>
                      )
                    ) : (
                      <div className="max-h-[420px] w-full overflow-auto rounded-[20px] border border-[#334155] bg-[#111827] p-4">
                        <p className="mb-3 text-sm font-black uppercase tracking-wide text-[#facc15]">
                          Materiais disponíveis
                        </p>
                        <div className="space-y-4">
                          {groupedTreatments.map((grupo) => (
                            <section
                              key={grupo.categoria}
                              className="rounded-[18px] border border-[#334155] bg-[#0f172a] p-3"
                            >
                              <p className="text-sm font-black text-[#60a5fa]">{grupo.categoria}</p>
                              <div className="mt-3 space-y-3">
                                {grupo.subcategorias.map((subcategoria) => (
                                  <div key={subcategoria.subcategoria} className="space-y-2">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-[#f87171]">
                                      {subcategoria.subcategoria}
                                    </p>
                                    <div className="grid gap-2 md:grid-cols-2">
                                      {subcategoria.itens.map((item) => (
                                        <label
                                          key={`${grupo.categoria}-${item.id}`}
                                          className={checkboxCard}
                                        >
                                          <input
                                            type="checkbox"
                                            checked={treatmentIds.includes(item.id)}
                                            onChange={() => toggleTreatment(item.id)}
                                            className="mt-1 h-4 w-4 shrink-0"
                                          />
                                          <span className="leading-snug">{item.nome}</span>
                                        </label>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </section>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-[24px] border border-[#334155] bg-[#1f2937] p-4">
                  <div className="rounded-[18px] border border-[#334155] bg-[#0f172a] px-4 py-3">
                    <p className="text-sm font-black uppercase tracking-wide text-[#e2e8f0]">
                      Informação relevante
                    </p>
                  </div>

                  <div className="mt-3 space-y-3 rounded-[20px] bg-[#111827] p-3">
                    {tab === "observacao" &&
                      caseDefinition.observationItems
                        .filter((item) => item.id !== "imagem")
                        .map((item) => (
                          <div key={item.id}>
                            <button onClick={() => revealObservation(item.id)} className={actionButton}>
                              {item.actionLabel}
                            </button>
                            {observationIds.includes(item.id) ? (
                              <div className="mt-2 rounded-xl border border-[#334155] bg-[#0f172a] p-3 text-sm font-semibold">
                                <strong className="text-[#1d4ed8]">{item.detailLabel}:</strong>{" "}
                                {item.detailText}
                              </div>
                            ) : null}
                          </div>
                        ))}

                    {tab === "dialogo" && (
                      <>
                        {(Object.keys(DIALOGUE_BUTTON_LABELS) as PerguntaId[]).map((id) => (
                          <button key={id} onClick={() => askQuestion(id)} className={actionButton}>
                            {DIALOGUE_BUTTON_LABELS[id]}
                          </button>
                        ))}
                        {questionIds.length > 0 ? (
                          <div className="rounded-xl border border-[#334155] bg-[#0f172a] p-3 text-sm font-semibold">
                            {questionIds.map((id) => (
                              <div key={id}>• {nomesPerguntas[id]}</div>
                            ))}
                          </div>
                        ) : null}
                      </>
                    )}

                    {tab === "tratamento" && (
                      <>
                        <div className="max-h-40 overflow-auto rounded-xl border border-[#334155] bg-[#0f172a] p-3 text-sm text-[#cbd5e1]">
                          {treatmentIds.length > 0
                            ? treatmentIds.map((id) => <div key={id}>• {treatmentNames[id]}</div>)
                            : "Nenhum produto selecionado."}
                        </div>
                        <div className="rounded-xl border border-[#334155] bg-[#0f172a] p-3">
                          <p className="text-xs font-black uppercase tracking-wide text-[#60a5fa]">
                            Forma de aplicaÃ§Ã£o
                          </p>
                          <div className="mt-3 max-h-64 space-y-2 overflow-auto">
                        {(Object.entries(nomesAplicacoes) as [AplicacaoId, string][]).map(
                          ([id, label]) => (
                            <label key={id} className={checkboxCard}>
                              <input
                                type="checkbox"
                                checked={applicationIds.includes(id)}
                                onChange={() => toggleApplication(id)}
                                className="mt-1 h-4 w-4 shrink-0"
                              />
                              <span className="leading-snug">{label}</span>
                            </label>
                          )
                        )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={finishCase}
                disabled={!progress.readyToSubmit}
                className={`rounded-2xl px-5 py-3 text-lg font-black ${
                  progress.readyToSubmit
                    ? "bg-[#1d4ed8]"
                    : "cursor-not-allowed bg-[#475569] text-[#cbd5e1]"
                }`}
              >
                Finalizar caso
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-[24px] border border-[#334155] bg-[#0f172a] p-5">
                <h2 className="text-4xl font-black">Resultado final</h2>
                <p className="mt-2 text-lg font-semibold text-[#94a3b8]">
                  A pontuação só aparece no final da interação.
                </p>
                <div className="mt-5 h-7 overflow-hidden rounded-full bg-[#1f2937]">
                  <div
                    className={`h-7 rounded-full ${
                      evaluation.score >= 85
                        ? "bg-[#22c55e]"
                        : evaluation.score >= 70
                          ? "bg-[#1d4ed8]"
                          : evaluation.score >= 50
                            ? "bg-[#facc15]"
                            : "bg-[#64748b]"
                    }`}
                    style={{ width: `${evaluation.score}%` }}
                  />
                </div>
                <p className="mt-3 text-3xl font-black">{evaluation.score}/100</p>
                <div className="mt-4 rounded-[20px] border border-[#334155] bg-[#111827] p-4 text-base font-semibold">
                  {evaluation.feedback}
                </div>
                <div className="mt-4 grid gap-3 lg:grid-cols-3">
                  <div className="rounded-[18px] border border-[#14532d] bg-[#052e16] p-4">
                    <p className="text-sm font-black text-[#86efac]">O que fizeste bem</p>
                    <div className="mt-2 space-y-1 text-sm text-[#dcfce7]">
                      {(reasoningSummary.strengths.length > 0
                        ? reasoningSummary.strengths
                        : ["Há espaço para consolidar melhor os passos essenciais."]).map(
                        (item, index) => (
                          <div key={index}>• {item}</div>
                        )
                      )}
                    </div>
                  </div>
                  <div className="rounded-[18px] border border-[#78350f] bg-[#1c1917] p-4">
                    <p className="text-sm font-black text-[#fde68a]">O que faltou</p>
                    <div className="mt-2 space-y-1 text-sm text-[#fef3c7]">
                      {(reasoningSummary.gaps.length > 0
                        ? reasoningSummary.gaps
                        : ["Não há falhas críticas assinaláveis nesta tentativa."]).map(
                        (item, index) => (
                          <div key={index}>• {item}</div>
                        )
                      )}
                    </div>
                  </div>
                  <div className="rounded-[18px] border border-[#1d4ed8] bg-[#0b1a3a] p-4">
                    <p className="text-sm font-black text-[#93c5fd]">Conduta mais segura</p>
                    <p className="mt-2 text-sm text-[#dbeafe]">{reasoningSummary.safeConduct}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetails((prev) => !prev)}
                  className="mt-4 rounded-xl border border-[#334155] bg-white px-4 py-3 text-sm font-black text-[#0f172a]"
                >
                  {showDetails ? "Ocultar avaliação detalhada" : "Mostrar avaliação detalhada"}
                </button>
              </div>

              {showDetails ? (
                <div className="grid gap-4 lg:grid-cols-2">
                  {evaluation.sections.map((section) => (
                    <div key={section.nome} className="rounded-[22px] border border-[#334155] bg-[#111827] p-4">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <h3 className="text-2xl font-black text-[#1d4ed8]">{section.nome}</h3>
                        <span className="rounded-full bg-[#0f172a] px-3 py-1 text-sm font-black">
                          {section.pontuacao}/{section.maximo}
                        </span>
                      </div>
                      {[
                        ["Acertos", section.acertou, "#22c55e"],
                        ["Erros", section.errou, "#ef4444"],
                        ["Faltou", section.faltou, "#facc15"],
                        ["Excesso", section.excesso, "#93c5fd"],
                        ["Porque não tiveste a pontuação máxima", section.justificacaoPerda, "#f59e0b"],
                      ].map(([title, items, color]) => (
                        <div key={title as string} className="mb-4">
                          <p className="mb-2 font-black" style={{ color: color as string }}>{title}</p>
                          {(items as string[]).length > 0 ? (
                            <div className="space-y-1 text-sm font-semibold">
                              {(items as string[]).map((item, index) => (
                                <div key={index}>• {item}</div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-sm text-[#94a3b8]">Sem registos.</div>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ) : null}

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-[22px] border border-[#334155] bg-[#111827] p-4">
                  <h3 className="mb-3 text-2xl font-black text-[#1d4ed8]">Resumo da resolução</h3>
                  <div className="space-y-3 text-sm font-semibold">
                    <div>
                      <strong>Observações:</strong>{" "}
                      {observationIds.length > 0
                        ? observationIds
                            .map(
                              (id) =>
                                caseDefinition.observationItems.find((item) => item.id === id)?.detailLabel.toLowerCase() ??
                                id
                            )
                            .join(", ")
                        : "nenhuma"}
                    </div>
                    <div>
                      <strong>Perguntas:</strong>{" "}
                      {questionIds.length > 0 ? questionIds.map((id) => nomesPerguntas[id]).join(", ") : "nenhuma"}
                    </div>
                    <div>
                      <strong>Tratamentos:</strong>{" "}
                      {treatmentIds.length > 0 ? treatmentIds.map((id) => treatmentNames[id]).join(", ") : "nenhum"}
                    </div>
                    <div>
                      <strong>Aplicação:</strong>{" "}
                      {applicationIds.length > 0 ? applicationIds.map((id) => nomesAplicacoes[id]).join(", ") : "nenhuma"}
                    </div>
                  </div>
                </div>

                <div className="rounded-[22px] border border-[#334155] bg-[#111827] p-4">
                  <h3 className="mb-3 text-2xl font-black text-[#1d4ed8]">Artigos e justificações</h3>
                  {evaluation.feedbackLinks.length > 0 ? (
                    <div className="space-y-3 text-sm font-semibold">
                      {evaluation.feedbackLinks.map((item) => (
                        <div key={`${item.material}-${item.url}`} className="rounded-xl border border-[#334155] bg-[#0f172a] p-3">
                          <p className="font-black">{item.material}</p>
                          {item.correto ? (
                            <p className="mt-1 text-[#facc15]">Alternativa mais adequada: {item.correto}</p>
                          ) : null}
                          <p className="mt-2 text-[#cbd5e1]">{item.explicacao}</p>
                          <a href={item.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-[#93c5fd] underline">
                            {item.titulo}
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm font-semibold">
                      Não há artigos associados aos materiais selecionados nesta tentativa.
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-[22px] border border-[#334155] bg-[#111827] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-2xl font-black text-[#1d4ed8]">Reforço recomendado</h3>
                  <Link
                    href="/aprender"
                    className="rounded-xl bg-[#facc15] px-4 py-2 text-sm font-black text-[#0f172a]"
                  >
                    Ir para Aprender
                  </Link>
                </div>
                {learningRecommendations.length > 0 ? (
                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    {learningRecommendations.map((topic) => (
                      <Link
                        key={topic.id}
                        href={`/aprender?topic=${topic.id}`}
                        className="rounded-xl border border-[#334155] bg-[#0f172a] p-4 transition hover:border-[#60a5fa]"
                      >
                        <p className="text-sm font-black text-white">{topic.title}</p>
                        <p className="mt-2 text-xs text-[#cbd5e1]">
                          Rever este tema ajuda a corrigir falhas vistas nesta tentativa.
                        </p>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-[#cbd5e1]">
                    Continua a rever os temas da biblioteca pedagógica para consolidar decisão
                    clínica.
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <button onClick={resetCase} className="rounded-2xl bg-[#1d4ed8] px-5 py-3 text-lg font-black">
                  Repetir caso
                </button>
                <Link href="/casos" className="rounded-2xl bg-[#facc15] px-5 py-3 text-lg font-black text-[#0f172a]">
                  Voltar aos casos
                </Link>
                <Link href="/historico" className="rounded-2xl border border-[#334155] bg-[#b91c1c] px-5 py-3 text-lg font-black text-[#0f172a]">
                  Histórico
                </Link>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
