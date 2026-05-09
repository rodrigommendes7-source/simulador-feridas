"use client";

import Link from "next/link";
import { startTransition, useEffect, useMemo, useState } from "react";
import {
  type AttemptRecord,
  getCaseProgress,
  getContinueLearningTarget,
  getRandomCase,
  getRecommendedNextCases,
  listCaseTemplates,
  loadAttemptHistory,
} from "@/lib/clinical";

const CASE_INTRO_PHRASES: Record<string, string> = {
  "1": "Começa aqui — caso introdutório com foco em observação e proteção.",
  "2": "Aprofunda o reconhecimento de infeção e desbridamento.",
  "3": "Caso mais exigente — requer leitura de risco e decisão antimicrobiana.",
  "4": "Treino de proporcionalidade terapêutica e conforto ao penso.",
  "5": "Aprofunda o controlo de bioburden e a proteção perilesional numa úlcera venosa inflamatória.",
  "6": "Treina o reconhecimento e redução de hipergranulação.",
  "7": "Caso avançado de infeção cirúrgica — controlo antimicrobiano e limites de autonomia.",
  "8": "Queimadura profunda com biofilme — o caso mais exigente do simulador.",
  "9": "Úlcera diabética — perfusão comprometida e limites do desbridamento.",
  "10": "Skin tear em pele geriátrica — cobertura atraumática e proteção do flap.",
  "11": "Ferida iatrogénica em granulação — cobertura proporcional sem agressividade.",
  "12": "Úlcera venosa inflamada — compressão, bioburden e proteção perilesional.",
  "13": "Úlcera arterial isquémica — decisão de não desbridar sem revascularização.",
  "14": "Úlcera venosa infectada — antimicrobiano local e compressão.",
  "15": "Pé diabético com isquémia — encaminhamento urgente e limites clínicos.",
  "16": "UPP calcâneo precoce — proteção e alívio de pressão.",
  "17": "UPP sacra com necrose — desbridamento enzimático e antimicrobiano.",
  "18": "UPP com cavidade — preenchimento e cobertura secundária.",
  "19": "Queimadura superficial — cobertura não aderente e controlo de exsudado.",
  "20": "Queimadura extensa — decisão antimicrobiana e referenciação.",
  "21": "Deiscência abdominal em cicatrização — manter plano sem intervenção desnecessária.",
  "22": "Úlcera venosa recidivante — vigilância de hipergranulação e compressão.",
  "23": "Sinus pilonidal estagnado — biofilme, cavidade e cuidados de região difícil.",
  "24": "Úlcera de etiologia incerta — investigar antes de comprimir.",
  "25": "Úlcera diabética com biofilme — antimicrobiano tópico e plano integrado.",
  "26": "Deiscência esternal — gestão de cavidade cirúrgica profunda.",
  "27": "Ferida traumática em cicatrização — proporcionalidade e continuidade do plano.",
  "28": "Ferida ortopédica estagnada — reavaliação e gestão de hemorragia ligeira.",
  "29": "Lesão purpúrica meningocócica — não desbridar, cobertura permeável.",
  "30": "Fistula enterocutânea — proteção da pele e gestão de débito.",
  "31": "Úlcera venosa com dermatite de contacto — identificar e parar o tópico ofensivo.",
  "32": "Necrose digital isquémica — não desbridar, referir para cirurgia vascular.",
};

function difficultyLabel(value: string) {
  if (value === "introdutorio") return "Introdutório";
  if (value === "intermedio") return "Intermédio";
  return "Avançado";
}

function difficultyBadgeClass(value: string) {
  if (value === "introdutorio") return "badge badge-intro";
  if (value === "intermedio") return "badge badge-inter";
  return "badge badge-avance";
}

export default function CasesPage() {
  const cases = listCaseTemplates().filter((item) => item.status === "disponivel");
  const [history, setHistory] = useState<AttemptRecord[]>([]);
  const [historyLoaded, setHistoryLoaded] = useState(false);

  useEffect(() => {
    startTransition(() => {
      setHistory(loadAttemptHistory());
      setHistoryLoaded(true);
    });
  }, []);

  // Mostra o badge "Recomendado" apenas num único caso (o próximo mais adequado)
  const singleRecommendedId = useMemo(
    () => history.length === 0 ? "1" : (getRecommendedNextCases(history)[0]?.templateId ?? null),
    [history]
  );

  const continueTarget = useMemo(() => getContinueLearningTarget(history), [history]);
  const [randomCase, setRandomCase] = useState<ReturnType<typeof getRandomCase> | null>(null);
  useEffect(() => { setRandomCase(getRandomCase()); }, []);

  return (
    <main style={{ display: "flex", flexDirection: "column", gap: "var(--space-2xl)", height: "100%" }}>

      {/* ── Cabeçalho ─────────────────────────────────────────────────────── */}
      <section
        style={{
          background: "var(--color-surface)",
          border: "var(--border-default)",
          borderRadius: "var(--radius-xl)",
          padding: "var(--space-2xl)",
          flexShrink: 0,
        }}
      >
        <p className="text-label">Resolver casos</p>
        <h1
          className="mt-3 text-4xl"
          style={{ fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)" }}
        >
          Casos clínicos
        </h1>
        <p className="text-body mt-3 max-w-3xl">
          Cada caso foi organizado como um percurso clínico único para treinar a leitura do leito,
          a priorização terapêutica e a coerência entre tratamentos, técnica e feedback.
        </p>
      </section>

      {/* ── Ações rápidas ─────────────────────────────────────────────────── */}
      <section style={{ display: "flex", gap: "var(--space-md)", flexWrap: "wrap", flexShrink: 0 }}>
        <Link
          href={continueTarget ? `/casos/${continueTarget.nextCaseId}` : "/casos/1"}
          className={continueTarget ? "btn btn-primary btn-lg" : "btn btn-secondary btn-lg"}
        >
          {continueTarget ? "Continuar a aprender" : "Iniciar primeiro caso"}
        </Link>
        <Link
          href={randomCase ? `/casos/${randomCase.id}` : "/casos"}
          className="btn btn-secondary btn-lg"
        >
          Caso aleatório
        </Link>
      </section>

      {/* ── Grelha de casos ───────────────────────────────────────────────── */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
        {cases.map((item) => {
          const progress = getCaseProgress(history, item.id);
          const recommended = singleRecommendedId === item.id;

          return (
            <Link
              key={item.id}
              href={`/casos/${item.id}`}
              className="card card-clickable"
              style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}
            >
              {/* Topo: shortTitle + duração */}
              <div className="flex items-center justify-between" style={{ gap: "var(--space-sm)" }}>
                <span className="badge badge-info">{item.shortTitle}</span>
                <span className="text-caption">{item.estimatedMinutes} min</span>
              </div>

              {/* Etiquetas de dificuldade e recomendação */}
              <div className="flex flex-wrap" style={{ gap: "var(--space-xs)" }}>
                <span className={difficultyBadgeClass(item.difficulty)}>
                  {difficultyLabel(item.difficulty)}
                </span>
                {recommended && (
                  <span className="badge badge-inter">Recomendado</span>
                )}
              </div>

              {/* Título e descrição */}
              <div>
                <h2
                  className="text-2xl"
                  style={{ fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)" }}
                >
                  {item.title}
                </h2>
                <p className="text-body mt-2">{item.description}</p>
              </div>

              {/* Competências */}
              <div
                style={{
                  background: "var(--color-elevated)",
                  border: "var(--border-default)",
                  borderRadius: "var(--radius-md)",
                  padding: "var(--space-md)",
                }}
              >
                <p className="text-label" style={{ marginBottom: "var(--space-xs)" }}>
                  Competências
                </p>
                <p className="text-body">{item.competencies}</p>
              </div>

              {/* Progresso */}
              <div
                style={{
                  background: "var(--color-elevated)",
                  border: "var(--border-default)",
                  borderRadius: "var(--radius-md)",
                  padding: "var(--space-md)",
                  marginTop: "auto",
                }}
              >
                {!historyLoaded ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
                    <div className="skeleton" style={{ height: "14px", width: "70%" }} />
                    <div className="skeleton" style={{ height: "12px", width: "50%" }} />
                  </div>
                ) : progress.hasCompleted ? (
                  <>
                    <p
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "var(--text-mono)",
                        fontWeight: "var(--weight-medium)",
                        color: "var(--color-accent)",
                      }}
                    >
                      Melhor {progress.bestScore}/100 · Média {progress.averageScore}/100
                    </p>
                    <p className="text-body mt-2">
                      {progress.attempts} {progress.attempts === 1 ? "tentativa registada" : "tentativas registadas"}.
                    </p>
                  </>
                ) : (
                  <>
                    <p style={{ fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)", fontSize: "var(--text-h3)" }}>
                      Ainda não tentado
                    </p>
                    <p className="text-body mt-2">
                      {CASE_INTRO_PHRASES[item.id] ?? "Bom caso para iniciar ou diversificar o treino individual."}
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
