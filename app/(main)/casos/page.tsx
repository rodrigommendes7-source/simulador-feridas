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

function difficultyBadgeClass(value: string) {
  if (value === "introdutorio") return "badge badge-intro";
  if (value === "intermedio") return "badge badge-inter";
  return "badge badge-avance";
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
    <main style={{ display: "flex", flexDirection: "column", gap: "var(--space-2xl)" }}>

      {/* ── Cabeçalho ─────────────────────────────────────────────────────── */}
      <section
        style={{
          background: "var(--color-surface)",
          border: "var(--border-default)",
          borderRadius: "var(--radius-xl)",
          padding: "var(--space-2xl)",
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

      {/* ── Grelha de casos ───────────────────────────────────────────────── */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cases.map((item) => {
          const progress = getCaseProgress(history, item.id);
          const recommended = recommendedCaseIds.has(item.id);

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
                {progress.hasCompleted ? (
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
                      {progress.attempts} tentativa(s) registada(s).
                    </p>
                  </>
                ) : (
                  <>
                    <p style={{ fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)", fontSize: "var(--text-h3)" }}>
                      Ainda não tentado
                    </p>
                    <p className="text-body mt-2">
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
