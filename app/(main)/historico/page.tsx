"use client";

import Link from "next/link";
import { startTransition, useEffect, useMemo, useState } from "react";
import {
  clearAttemptHistory,
  type AttemptRecord,
  getAverageScore,
  getBestScore,
  getCaseRetryPriority,
  getMostRecommendedTopics,
  getStudyPlan,
  getTopicMastery,
  getWeakestSections,
  loadAttemptHistory,
} from "@/lib/clinical";

const SECTION_LABELS: Record<string, string> = {
  observation: "Observação",
  assessment: "Avaliação e diálogo",
  "treatment-plan": "Plano terapêutico",
  "application-technique": "Técnica de aplicação",
};

function formatDate(value: string) {
  return new Date(value).toLocaleString("pt-PT");
}

function metricValue(value: number) {
  return value === 0 ? "—" : value;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<AttemptRecord[]>([]);


  useEffect(() => {
    startTransition(() => {
      setHistory(loadAttemptHistory());
    });
  }, []);

  const averageScore = useMemo(() => getAverageScore(history), [history]);
  const bestScore = useMemo(() => getBestScore(history), [history]);
  const weakestSections = useMemo(() => getWeakestSections(history), [history]);
  const recommendedTopics = useMemo(() => getMostRecommendedTopics(history), [history]);
  const retryPriority = useMemo(() => getCaseRetryPriority(history), [history]);
  const topicMastery = useMemo(() => getTopicMastery(history), [history]);
  const studyPlan = useMemo(() => getStudyPlan(history), [history]);

  function handleClear() {
    clearAttemptHistory();
    setHistory([]);
  }

  const hasHistory = history.length > 0;

  return (
    <main style={{ display: "flex", flexDirection: "column", gap: "var(--space-2xl)", height: "100%" }}>

      {/* ── Cabeçalho ─────────────────────────────────────────────────────── */}
      <section
        className="card"
        style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: "var(--space-lg)" }}
      >
        <div>
          <p className="text-label">Histórico</p>
          <h1 style={{ marginTop: "var(--space-sm)", fontSize: "var(--text-h1)", fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)" }}>
            Progressão do utilizador
          </h1>
          <p className="text-body" style={{ marginTop: "var(--space-sm)", maxWidth: "48rem" }}>
            Vista detalhada do percurso local-first com comparação de tentativas, temas a reforçar
            e um plano de estudo derivado do teu próprio histórico.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)", flexWrap: "wrap", alignItems: "center" }}>
          <button
            type="button"
            onClick={handleClear}
            disabled={!hasHistory}
            style={{
              background: "var(--color-error-subtle)",
              border: "0.5px solid var(--color-error-border)",
              borderRadius: "var(--radius-md)",
              padding: "var(--space-sm) var(--space-md)",
              fontSize: "var(--text-body)",
              fontWeight: "var(--weight-medium)",
              color: "var(--color-error)",
              cursor: hasHistory ? "pointer" : "not-allowed",
              opacity: hasHistory ? 1 : 0.4,
            }}
          >
            Limpar histórico
          </button>
        </div>
      </section>


{hasHistory ? (
        <>
          {/* ── 4 Métricas ──────────────────────────────────────────────────── */}
          <section className="grid md:grid-cols-2 xl:grid-cols-4" style={{ gap: "var(--space-md)" }}>
            {([
              ["Tentativas", history.length],
              ["Melhor pontuação", bestScore],
              ["Média global", averageScore],
              ["Casos com dados", retryPriority.length],
            ] as [string, number][]).map(([label, value]) => (
              <div className="card" key={label}>
                <p className="text-label">{label}</p>
                <p
                  style={{
                    fontSize: "var(--text-h1)",
                    fontWeight: "var(--weight-medium)",
                    color: "var(--color-text-primary)",
                    marginTop: "var(--space-sm)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {metricValue(value)}
                </p>
              </div>
            ))}
          </section>

          {/* ── Plano de estudo ─────────────────────────────────────────────── */}
          <section className="grid xl:grid-cols-3" style={{ gap: "var(--space-md)" }}>
            <div className="card">
              <p className="text-label" style={{ color: "var(--color-warning)" }}>Repetir a seguir</p>
              <p style={{ marginTop: "var(--space-sm)", fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)" }}>
                {studyPlan.retryCase?.title ?? "Ainda sem prioridade definida"}
              </p>
              <p className="text-body" style={{ marginTop: "var(--space-xs)" }}>
                {studyPlan.retryCase
                  ? `Média atual: ${studyPlan.retryCase.average}/100 em ${studyPlan.retryCase.attempts} ${studyPlan.retryCase.attempts === 1 ? "tentativa" : "tentativas"}.`
                  : "Conclui alguns casos para gerar uma prioridade de repetição."}
              </p>
              {studyPlan.retryCase ? (
                <Link
                  href={`/casos/${studyPlan.retryCase.templateId}`}
                  style={{ display: "inline-flex", marginTop: "var(--space-md)", color: "var(--color-info)", textDecoration: "underline", fontSize: "var(--text-body)", fontWeight: "var(--weight-medium)" }}
                >
                  Reabrir caso
                </Link>
              ) : null}
            </div>

            <div className="card">
              <p className="text-label" style={{ color: "var(--color-info)" }}>Rever tema</p>
              <p style={{ marginTop: "var(--space-sm)", fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)" }}>
                {studyPlan.reviewTopic?.title ?? "Tema ainda por identificar"}
              </p>
              <p className="text-body" style={{ marginTop: "var(--space-xs)" }}>
                {studyPlan.reviewTopic
                  ? `Domínio atual: ${studyPlan.reviewTopic.masteryScore}/100.`
                  : "O tema prioritário aparece depois das primeiras tentativas."}
              </p>
              {studyPlan.reviewTopic ? (
                <Link
                  href={`/aprender?topic=${studyPlan.reviewTopic.topicId}&source=history`}
                  style={{ display: "inline-flex", marginTop: "var(--space-md)", color: "var(--color-info)", textDecoration: "underline", fontSize: "var(--text-body)", fontWeight: "var(--weight-medium)" }}
                >
                  Abrir tema
                </Link>
              ) : null}
            </div>

            <div className="card">
              <p className="text-label" style={{ color: "var(--color-success)" }}>Tentar depois</p>
              <p style={{ marginTop: "var(--space-sm)", fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)" }}>
                {studyPlan.followUpCase?.title ?? "Sem sugestão ainda"}
              </p>
              <p className="text-body" style={{ marginTop: "var(--space-xs)" }}>
                {studyPlan.followUpCase?.reason ?? "A próxima tentativa recomendada vai aparecer aqui."}
              </p>
              {studyPlan.followUpCase ? (
                <Link
                  href={`/casos/${studyPlan.followUpCase.templateId}`}
                  style={{ display: "inline-flex", marginTop: "var(--space-md)", color: "var(--color-info)", textDecoration: "underline", fontSize: "var(--text-body)", fontWeight: "var(--weight-medium)" }}
                >
                  Abrir caso sugerido
                </Link>
              ) : null}
            </div>
          </section>

          {/* ── Casos a repetir + Domínios + Temas ──────────────────────────── */}
          <section className="grid xl:grid-cols-[1.1fr_0.9fr]" style={{ gap: "var(--space-md)" }}>
            <div className="card">
              <p className="text-label" style={{ color: "var(--color-warning)" }}>Casos a repetir prioritariamente</p>
              <div style={{ marginTop: "var(--space-md)", display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
                {retryPriority.length > 0 ? (
                  retryPriority.map((item) => (
                    <div
                      key={item.templateId}
                      style={{
                        background: "var(--color-elevated)",
                        border: "var(--border-default)",
                        borderRadius: "var(--radius-lg)",
                        padding: "var(--space-md)",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-md)" }}>
                        <p style={{ fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)" }}>{item.title}</p>
                        <span
                          style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-mono)", color: "var(--color-text-secondary)" }}
                        >
                          {item.average}/100
                        </span>
                      </div>
                      <p className="text-body" style={{ marginTop: "var(--space-xs)" }}>
                        {item.attempts} {item.attempts === 1 ? "tentativa registada" : "tentativas registadas"}
                      </p>
                      <Link
                        href={`/casos/${item.templateId}`}
                        style={{ display: "inline-flex", marginTop: "var(--space-sm)", color: "var(--color-info)", textDecoration: "underline", fontSize: "var(--text-body)", fontWeight: "var(--weight-medium)" }}
                      >
                        Reabrir caso
                      </Link>
                    </div>
                  ))
                ) : (
                  <p className="text-body">Ainda não existem tentativas guardadas.</p>
                )}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
              <div className="card">
                <p className="text-label" style={{ color: "var(--color-info)" }}>Domínios mais frágeis</p>
                <div style={{ marginTop: "var(--space-md)", display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
                  {weakestSections.length > 0 ? (
                    weakestSections.map((section) => (
                      <div
                        key={section.sectionId}
                        style={{
                          background: "var(--color-elevated)",
                          border: "var(--border-default)",
                          borderRadius: "var(--radius-md)",
                          padding: "var(--space-xs) var(--space-sm)",
                        }}
                      >
                        <p className="text-body">
                          {SECTION_LABELS[section.sectionId] ?? section.sectionId}: {section.average}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-body">Sem dados ainda.</p>
                  )}
                </div>
              </div>

              <div className="card">
                <p className="text-label" style={{ color: "var(--color-warning)" }}>Temas mais recomendados</p>
                <div style={{ marginTop: "var(--space-md)", display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
                  {recommendedTopics.length > 0 ? (
                    recommendedTopics.map((topic) => (
                      <Link
                        key={topic.topicId}
                        href={`/aprender?topic=${topic.topicId}&source=history`}
                        style={{
                          display: "block",
                          background: "var(--color-elevated)",
                          border: "var(--border-default)",
                          borderRadius: "var(--radius-md)",
                          padding: "var(--space-xs) var(--space-sm)",
                          color: "var(--color-text-primary)",
                          textDecoration: "none",
                          fontSize: "var(--text-body)",
                        }}
                      >
                        {topic.title} · {topic.count === 1 ? "1 vez" : `${topic.count} vezes`}
                      </Link>
                    ))
                  ) : (
                    <p className="text-body">Sem recomendações ainda.</p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* ── Domínio por tema ────────────────────────────────────────────── */}
          <section className="card">
            <p className="text-label" style={{ color: "var(--color-info)" }}>Domínio por tema</p>
            <div
              className="grid md:grid-cols-2 xl:grid-cols-3"
              style={{ marginTop: "var(--space-md)", gap: "var(--space-sm)" }}
            >
              {topicMastery.map((topic) => (
                <Link
                  key={topic.topicId}
                  href={`/aprender?topic=${topic.topicId}&source=mastery`}
                  className="card card-clickable"
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-md)" }}>
                    <p style={{ fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)" }}>{topic.title}</p>
                    <span
                      style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-mono)", color: "var(--color-accent)" }}
                    >
                      {topic.masteryScore}/100
                    </span>
                  </div>
                  <p className="text-body" style={{ marginTop: "var(--space-xs)" }}>
                    {topic.recommendationCount} recomendação(ões) · {topic.weakSignalCount} sinal(is) de fragilidade.
                  </p>
                </Link>
              ))}
            </div>
          </section>

          {/* ── Tentativas registadas ────────────────────────────────────────── */}
          <section className="card">
            <p className="text-label" style={{ color: "var(--color-info)" }}>Tentativas registadas</p>
            <div style={{ marginTop: "var(--space-md)", display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
              {history.map((entry) => (
                <div
                  key={entry.id}
                  style={{
                    background: "var(--color-elevated)",
                    border: "var(--border-default)",
                    borderRadius: "var(--radius-lg)",
                    padding: "var(--space-md)",
                  }}
                >
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "var(--space-md)" }}>
                    <div>
                      <p style={{ fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)" }}>{entry.caseTitle}</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p
                        style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-h2)", fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)" }}
                      >
                        {entry.score}/100
                      </p>
                      <p className="text-caption" style={{ marginTop: "2px" }}>{formatDate(entry.timestamp)}</p>
                    </div>
                  </div>
                  {entry.previousBestScoreForCase !== null ? (
                    <p className="text-body" style={{ marginTop: "var(--space-sm)" }}>
                      Melhor registo anterior neste caso: {entry.previousBestScoreForCase}/100.
                    </p>
                  ) : null}
                  <p className="text-body" style={{ marginTop: "var(--space-sm)" }}>{entry.summary}</p>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : (
        /* ── Estado vazio ─────────────────────────────────────────────────── */
        <div
          className="card"
          style={{ textAlign: "center", padding: "var(--space-4xl)" }}
        >
          <p
            style={{
              fontSize: "var(--text-h2)",
              fontWeight: "var(--weight-medium)",
              color: "var(--color-text-primary)",
            }}
          >
            Ainda sem histórico registado
          </p>
          <p
            className="text-body"
            style={{ marginTop: "var(--space-md)", maxWidth: "480px", margin: "var(--space-md) auto 0" }}
          >
            Completa o primeiro caso para veres a tua progressão, pontos fracos e plano de estudo personalizado.
          </p>
          <Link
            href="/casos/1"
            className="btn btn-primary"
            style={{ marginTop: "var(--space-xl)", display: "inline-flex" }}
          >
            Iniciar primeiro caso
          </Link>
        </div>
      )}
    </main>
  );
}
