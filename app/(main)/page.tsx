"use client";

import Link from "next/link";
import { startTransition, useEffect, useMemo, useState } from "react";
import {
  type AttemptRecord,
  getBestScore,
  getCasesCompletedCount,
  getContinueLearningTarget,
  getRecommendedNextCases,
  getRecentBestScore,
  getStudyPlan,
  getTopicMastery,
  listCaseTemplates,
  loadAttemptHistory,
} from "@/lib/clinical";

const CASE_DESCRIPTIONS: Record<string, string> = {
  "1": "Treino de observação do leito, exsudado e proteção peri-ferida numa lesão por pressão.",
  "2": "Reconhecer infeção local e necessidade de controlo do exsudado numa deiscência cirúrgica.",
  "3": "Caso avançado com infeção local, exsudado elevado e leitura de risco clínico.",
  "4": "Leitura do leito, dor ao penso e seleção de cobertura proporcional ao exsudado.",
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

export default function HomePage() {
  const [history, setHistory] = useState<AttemptRecord[]>([]);
  const cases = listCaseTemplates().filter((item) => item.status === "disponivel");

  useEffect(() => {
    startTransition(() => {
      setHistory(loadAttemptHistory());
    });
  }, []);

  const continueTarget = useMemo(() => getContinueLearningTarget(history), [history]);
  const studyPlan = useMemo(() => getStudyPlan(history), [history]);
  const topicMastery = useMemo(() => getTopicMastery(history), [history]);
  const recommendedCases = useMemo(() => getRecommendedNextCases(history), [history]);

  const weakestTopic = topicMastery[0] ?? null;
  const nextTopic = studyPlan.reviewTopic ?? weakestTopic;

  return (
    <main style={{ display: "flex", flexDirection: "column", gap: "var(--space-3xl)" }}>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        className="grid lg:grid-cols-[1.1fr_0.9fr]"
        style={{
          gap: "var(--space-2xl)",
          background: "var(--color-surface)",
          border: "var(--border-default)",
          borderRadius: "var(--radius-xl)",
          padding: "var(--space-3xl)",
        }}
      >
        <div>
          <p className="text-label">Painel de aprendizagem</p>
          <h1
            className="mt-4 max-w-4xl text-4xl leading-tight md:text-5xl"
            style={{ fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)" }}
          >
            Aprende por repetição, foco e comparação entre tentativas.
          </h1>
          <p className="text-body mt-6 max-w-3xl" style={{ lineHeight: "var(--leading-loose)" }}>
            O simulador passa a destacar o que rever, que caso repetir e qual o melhor próximo
            passo para consolidar o raciocínio clínico no tratamento de feridas.
          </p>
          <div className="mt-8 flex flex-wrap" style={{ gap: "var(--space-md)" }}>
            <Link
              href={continueTarget ? `/casos/${continueTarget.nextCaseId}` : "/casos"}
              className="btn btn-primary btn-lg"
            >
              {continueTarget ? "Continuar aprendizagem" : "Começar pelo primeiro caso"}
            </Link>
            <Link
              href={nextTopic ? `/aprender?topic=${nextTopic.topicId}&source=home` : "/aprender"}
              className="btn btn-secondary btn-lg"
            >
              {nextTopic ? "Rever tema prioritário" : "Ver biblioteca clínica"}
            </Link>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid md:grid-cols-2" style={{ gap: "var(--space-md)", alignContent: "start" }}>
          {[
            ["Casos concluídos", getCasesCompletedCount(history)],
            ["Melhor pontuação", getBestScore(history)],
            ["Pontuação recente", getRecentBestScore(history)],
            ["Temas em reforço", topicMastery.length],
          ].map(([label, value]) => (
            <div
              key={label as string}
              style={{
                background: "var(--color-elevated)",
                border: "var(--border-default)",
                borderRadius: "var(--radius-lg)",
                padding: "var(--space-lg)",
              }}
            >
              <p className="text-label">{label}</p>
              <p
                className="mt-2 text-3xl"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontWeight: "var(--weight-medium)",
                  color: "var(--color-accent)",
                }}
              >
                {(value as number) === 0 ? "—" : value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Continuar / Temas / Casos recomendados ────────────────────────── */}
      <section className="grid xl:grid-cols-3" style={{ gap: "var(--space-md)" }}>

        {/* Continuar aprendizagem */}
        <div
          style={{
            background: "var(--color-surface)",
            border: "var(--border-default)",
            borderRadius: "var(--radius-xl)",
            padding: "var(--space-2xl)",
          }}
        >
          <p className="text-label">Continuar aprendizagem</p>
          {continueTarget ? (
            <>
              <h2
                className="mt-3 text-2xl"
                style={{ fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)" }}
              >
                {continueTarget.nextCaseTitle}
              </h2>
              <p className="text-body mt-3">
                Última tentativa: {continueTarget.lastCaseTitle}.
              </p>
              <p className="text-body mt-2">
                Tema a rever antes da próxima ronda:{" "}
                {continueTarget.reviewTopicId ? (
                  <Link
                    href={`/aprender?topic=${continueTarget.reviewTopicId}&source=history`}
                    style={{ color: "var(--color-accent)", fontWeight: "var(--weight-medium)", textDecoration: "underline" }}
                  >
                    {nextTopic?.title ?? continueTarget.reviewTopicId}
                  </Link>
                ) : (
                  "decisão clínica"
                )}
              </p>
              <Link href={`/casos/${continueTarget.nextCaseId}`} className="btn btn-primary mt-4">
                Abrir próximo caso
              </Link>
            </>
          ) : (
            <>
              <h2
                className="mt-3 text-2xl"
                style={{ fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)" }}
              >
                Primeiro percurso clínico
              </h2>
              <p className="text-body mt-3">
                Ainda não existem tentativas guardadas. Começa pelos casos introdutórios e usa o
                feedback para construir uma rotina de observação e decisão.
              </p>
              <Link href={`/casos/${cases[0]?.id ?? "1"}`} className="btn btn-primary mt-4">
                Iniciar primeiro caso
              </Link>
            </>
          )}
        </div>

        {/* Temas a reforçar */}
        <div
          style={{
            background: "var(--color-surface)",
            border: "var(--border-default)",
            borderRadius: "var(--radius-xl)",
            padding: "var(--space-2xl)",
          }}
        >
          <p className="text-label">Temas a reforçar</p>
          {topicMastery.length > 0 ? (
            <div className="mt-4" style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
              {topicMastery.slice(0, 3).map((topic) => (
                <Link
                  key={topic.topicId}
                  href={`/aprender?topic=${topic.topicId}&source=mastery`}
                  className="card card-clickable block"
                >
                  <div className="flex items-center justify-between" style={{ gap: "var(--space-md)" }}>
                    <p style={{ fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)" }}>
                      {topic.title}
                    </p>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "var(--text-mono)",
                        color: "var(--color-accent)",
                      }}
                    >
                      {topic.masteryScore}/100
                    </span>
                  </div>
                  <p className="text-body mt-2">
                    Recomendado {topic.recommendationCount === 1 ? "1 vez" : `${topic.recommendationCount} vezes`}, com {topic.weakSignalCount === 1 ? "1 sinal" : `${topic.weakSignalCount} sinais`} de fragilidade.
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-body mt-4">
              O reforço por tema vai aparecer aqui depois das primeiras tentativas.
            </p>
          )}
        </div>

        {/* Casos recomendados */}
        <div
          style={{
            background: "var(--color-surface)",
            border: "var(--border-default)",
            borderRadius: "var(--radius-xl)",
            padding: "var(--space-2xl)",
          }}
        >
          <p className="text-label">Casos recomendados</p>
          {recommendedCases.length > 0 ? (
            <div className="mt-4" style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
              {recommendedCases.slice(0, 3).map((item) => (
                <Link
                  key={item.templateId}
                  href={`/casos/${item.templateId}`}
                  className="card card-clickable block"
                >
                  <div className="flex items-center justify-between" style={{ gap: "var(--space-md)" }}>
                    <p style={{ fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)" }}>
                      {item.title}
                    </p>
                    <span className={difficultyBadgeClass(item.difficulty)}>
                      {difficultyLabel(item.difficulty)}
                    </span>
                  </div>
                  <p className="text-body mt-2">{CASE_DESCRIPTIONS[item.templateId] ?? item.reason}</p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-body mt-4">
              Depois de alguns casos, este bloco passa a sugerir as melhores próximas tentativas.
            </p>
          )}
        </div>
      </section>

      {/* ── Plano de estudo + Biblioteca ──────────────────────────────────── */}
      <section className="grid lg:grid-cols-[1.1fr_0.9fr]" style={{ gap: "var(--space-md)" }}>

        {/* Plano de estudo pessoal */}
        <div
          style={{
            background: "var(--color-surface)",
            border: "var(--border-default)",
            borderRadius: "var(--radius-xl)",
            padding: "var(--space-2xl)",
          }}
        >
          <p className="text-label">Plano de estudo pessoal</p>
          <div className="mt-5 grid md:grid-cols-3" style={{ gap: "var(--space-md)" }}>
            {[
              {
                key: "Repetir",
                title: studyPlan.retryCase?.title ?? "Completa o primeiro caso para gerar prioridades de repetição.",
                body: studyPlan.retryCase
                  ? `Caso com média de ${studyPlan.retryCase.average}/100.`
                  : "",
              },
              {
                key: "Rever",
                title: studyPlan.reviewTopic?.title ?? "Os temas a reforçar surgem após as primeiras tentativas.",
                body: studyPlan.reviewTopic
                  ? `Domínio atual: ${studyPlan.reviewTopic.masteryScore}/100.`
                  : "",
              },
              {
                key: "Tentar",
                title: studyPlan.followUpCase?.title ?? "Sem sugestão ainda",
                body: studyPlan.followUpCase?.reason ?? "A próxima tentativa recomendada vai aparecer aqui.",
              },
            ].map(({ key, title, body }) => (
              <div
                key={key}
                style={{
                  background: "var(--color-elevated)",
                  border: "var(--border-default)",
                  borderRadius: "var(--radius-lg)",
                  padding: "var(--space-lg)",
                }}
              >
                <p className="text-caption" style={{ textTransform: "uppercase", letterSpacing: "var(--tracking-label)" }}>
                  {key}
                </p>
                <p className="text-h3 mt-2">{title}</p>
                <p className="text-body mt-2">{body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Biblioteca clínica */}
        <div
          style={{
            background: "var(--color-surface)",
            border: "var(--border-default)",
            borderRadius: "var(--radius-xl)",
            padding: "var(--space-2xl)",
          }}
        >
          <p className="text-label">Biblioteca clínica</p>
          <h2
            className="mt-3 text-3xl"
            style={{ fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)" }}
          >
            Aprender com intenção
          </h2>
          <p className="text-body mt-3">
            Cada tema passa a funcionar como apoio direto a uma decisão do caso: quando considerar,
            quando evitar, erros frequentes, materiais relacionados e casos em que esse tema pesa mais.
          </p>
          <div className="mt-5 flex flex-wrap" style={{ gap: "var(--space-md)" }}>
            <Link
              href={nextTopic ? `/aprender?topic=${nextTopic.topicId}&source=home` : "/aprender"}
              className="btn btn-primary"
            >
              Abrir tema prioritário
            </Link>
            <Link href="/historico" className="btn btn-secondary">
              Ver histórico detalhado
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
