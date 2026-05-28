﻿"use client";

import Link from "next/link";
import { startTransition, useEffect, useMemo, useState } from "react";
import {
  limparHistoricoTentativas,
  type RegistoTentativa,
  obterPontuacaoMedia,
  obterMelhorPontuacao,
  obterPrioridadeRepeticaoCaso,
  obterTopicosRecomendados,
  obterPlanoEstudo,
  obterMestriaTema,
  obterSeccoesMaisFracas,
  carregarHistoricoTentativas,
} from "@/lib/clinico/indice";
import { GraficoRadar } from "@/componentes/grafico-radar";

const SECTION_LABELS: Record<string, string> = {
  observacao: "Observação",
  "identificacao-visual": "Identificação visual",
  avaliacao: "Avaliação e diálogo",
  "plano-terapeutico": "Plano terapêutico",
  "tecnica-aplicacao": "Técnica de aplicação",
};

function formatDate(value: string) {
  return new Date(value).toLocaleString("pt-PT");
}

function metricValue(value: number) {
  return value === 0 ? "—" : value;
}

function formatDuration(seconds?: number) {
  if (!seconds) return null;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

function obterTendencia(historico: RegistoTentativa[], entry: RegistoTentativa, indexAtual: number) {
  const tentativaAnterior = historico.slice(indexAtual + 1).find(h => h.idCaso === entry.idCaso);
  if (!tentativaAnterior) return null;
  return entry.pontuacao - tentativaAnterior.pontuacao;
}

function contarUsoMaterial(idTratamento: string, historico: RegistoTentativa[]) {
  return historico.filter(h => h.tratamentosSeleccionados.includes(idTratamento)).length;
}

export default function HistoryPage() {
  const [historico, setHistory] = useState<RegistoTentativa[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null)


  useEffect(() => {
    startTransition(() => {
      setHistory(carregarHistoricoTentativas());
    });
  }, []);

  const averageScore = useMemo(() => obterPontuacaoMedia(historico), [historico]);
  const bestScore = useMemo(() => obterMelhorPontuacao(historico), [historico]);
  const weakestSections = useMemo(() => obterSeccoesMaisFracas(historico), [historico]);
  const recommendedTopics = useMemo(() => obterTopicosRecomendados(historico), [historico]);
  const retryPriority = useMemo(() => obterPrioridadeRepeticaoCaso(historico), [historico]);
  const topicMastery = useMemo(() => obterMestriaTema(historico), [historico]);
  const studyPlan = useMemo(() => obterPlanoEstudo(historico), [historico]);

  function handleClear() {
    limparHistoricoTentativas();
    setHistory([]);
  }

  const hasHistory = historico.length > 0;

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
              ["Tentativas", historico.length],
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
                {studyPlan.casoARepetir?.titulo ?? "Ainda sem prioridade definida"}
              </p>
              <p className="text-body" style={{ marginTop: "var(--space-xs)" }}>
                {studyPlan.casoARepetir
                  ? `Média atual: ${studyPlan.casoARepetir.media}/100 em ${studyPlan.casoARepetir.tentativas} ${studyPlan.casoARepetir.tentativas === 1 ? "tentativa" : "tentativas"}.`
                  : "Conclui alguns casos para gerar uma prioridade de repetição."}
              </p>
              {studyPlan.casoARepetir ? (
                <Link
                  href={`/casos/${studyPlan.casoARepetir.idModelo}`}
                  style={{ display: "inline-flex", marginTop: "var(--space-md)", color: "var(--color-info)", textDecoration: "underline", fontSize: "var(--text-body)", fontWeight: "var(--weight-medium)" }}
                >
                  Reabrir caso
                </Link>
              ) : null}
            </div>

            <div className="card">
              <p className="text-label" style={{ color: "var(--color-info)" }}>Rever tema</p>
              <p style={{ marginTop: "var(--space-sm)", fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)" }}>
                {studyPlan.temaARever?.titulo ?? "Tema ainda por identificar"}
              </p>
              <p className="text-body" style={{ marginTop: "var(--space-xs)" }}>
                {studyPlan.temaARever
                  ? `Domínio atual: ${studyPlan.temaARever.pontuacaoMestria}/100.`
                  : "O tema prioritário aparece depois das primeiras tentativas."}
              </p>
              {studyPlan.temaARever ? (
                <Link
                  href={`/aprender?topic=${studyPlan.temaARever.idTema}&source=historico`}
                  style={{ display: "inline-flex", marginTop: "var(--space-md)", color: "var(--color-info)", textDecoration: "underline", fontSize: "var(--text-body)", fontWeight: "var(--weight-medium)" }}
                >
                  Abrir tema
                </Link>
              ) : null}
            </div>

            <div className="card">
              <p className="text-label" style={{ color: "var(--color-success)" }}>Tentar depois</p>
              <p style={{ marginTop: "var(--space-sm)", fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)" }}>
                {studyPlan.casoSeguimento?.titulo ?? "Sem sugestão ainda"}
              </p>
              <p className="text-body" style={{ marginTop: "var(--space-xs)" }}>
                {studyPlan.casoSeguimento?.motivo ?? "A próxima tentativa recomendada vai aparecer aqui."}
              </p>
              {studyPlan.casoSeguimento ? (
                <Link
                  href={`/casos/${studyPlan.casoSeguimento.idModelo}`}
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
                      key={item.idModelo}
                      style={{
                        background: "var(--color-elevated)",
                        border: "var(--border-default)",
                        borderRadius: "var(--radius-lg)",
                        padding: "var(--space-md)",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-md)" }}>
                        <p style={{ fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)" }}>{item.titulo}</p>
                        <span
                          style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-mono)", color: "var(--color-text-secondary)" }}
                        >
                          {item.media}/100
                        </span>
                      </div>
                      <p className="text-body" style={{ marginTop: "var(--space-xs)" }}>
                        {item.tentativas} {item.tentativas === 1 ? "tentativa registada" : "tentativas registadas"}
                      </p>
                      <Link
                        href={`/casos/${item.idModelo}`}
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
                <p className="text-label" style={{ color: "var(--color-info)" }}>Desempenho por secção</p>
                <div style={{ marginTop: "var(--space-md)", display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
                  <GraficoRadar historico={historico} />
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
                    {weakestSections.length > 0 ? (
                      weakestSections.map((section) => (
                        <div
                          key={section.idSeccao}
                          style={{
                            background: "var(--color-elevated)",
                            border: "var(--border-default)",
                            borderRadius: "var(--radius-md)",
                            padding: "var(--space-xs) var(--space-sm)",
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <p className="text-body">
                            {SECTION_LABELS[section.idSeccao] ?? section.idSeccao}
                          </p>
                          <p className="text-body" style={{ fontWeight: "var(--weight-medium)" }}>
                            {section.media} pts
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-body">Sem dados ainda.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="card">
                <p className="text-label" style={{ color: "var(--color-warning)" }}>Temas mais recomendados</p>
                <div style={{ marginTop: "var(--space-md)", display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
                  {recommendedTopics.length > 0 ? (
                    recommendedTopics.map((topic) => (
                      <Link
                        key={topic.idTema}
                        href={`/aprender?topic=${topic.idTema}&source=historico`}
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
                        {topic.titulo} · {topic.count === 1 ? "1 vez" : `${topic.count} vezes`}
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
                  key={topic.idTema}
                  href={`/aprender?topic=${topic.idTema}&source=mastery`}
                  className="card card-clickable"
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-md)" }}>
                    <p style={{ fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)" }}>{topic.titulo}</p>
                    <span
                      style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-mono)", color: "var(--color-accent)" }}
                    >
                      {topic.pontuacaoMestria}/100
                    </span>
                  </div>
                  <p className="text-body" style={{ marginTop: "var(--space-xs)" }}>
                    {topic.contadorRecomendacoes} recomendação(ões) · {topic.contadorSinalFraco} sinal(is) de fragilidade.
                  </p>
                </Link>
              ))}
            </div>
          </section>

          {/* ── Tentativas registadas ────────────────────────────────────────── */}
          <section className="card">
            <p className="text-label" style={{ color: "var(--color-info)" }}>Tentativas registadas</p>
            <div style={{ marginTop: "var(--space-md)", display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
              {historico.map((entry, index) => {
                const isExpanded = expandedId === entry.id;
                const tendencia = obterTendencia(historico, entry, index);
                
                return (
                 <div
                  key={entry.id}
                  style={{
                    background: "var(--color-elevated)",
                    border: "var(--border-default)",
                    borderRadius: "var(--radius-lg)",
                    padding: "var(--space-md)",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                  onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                >
                  {/* VISTA GERAL */}
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "var(--space-md)" }}>
                    <div>
                      <p style={{ fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)" }}>{entry.tituloCaso}</p>
                      <p className="text-body" style={{ marginTop: "var(--space-xs)" }}>
                        {formatDate(entry.data)}
                        {entry.duracaoSegundos > 0 ? ` · ${formatDuration(entry.duracaoSegundos)}` : ""}
                      </p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
                        {tendencia !== null && (
                          <span style={{ 
                            fontSize: "var(--text-caption)", 
                            color: tendencia > 0 ? "var(--color-success)" : tendencia < 0 ? "var(--color-error)" : "var(--color-text-secondary)",
                            background: "var(--color-surface)", padding: "2px 6px", borderRadius: "var(--radius-sm)"
                          }}>
                            {tendencia > 0 ? `+${tendencia}` : tendencia} pts
                          </span>
                        )}
                        <p style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-h2)", fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)" }}>
                          {entry.pontuacao}/100
                        </p>
                      </div>
                    </div>
                  </div>

                  {!isExpanded && (
                    <p className="text-body" style={{ marginTop: "var(--space-sm)", color: "var(--color-text-secondary)" }}>
                      {entry.resumo} <span style={{ color: "var(--color-info)", fontSize: "var(--text-caption)", marginLeft: "8px" }}>Ver detalhes ↓</span>
                    </p>
                  )}

                  {/* VISTA DETALHADA */}
                  {isExpanded && (
                    <div style={{ marginTop: "var(--space-lg)", paddingTop: "var(--space-md)", borderTop: "1px dashed var(--border-default)" }} onClick={(e) => e.stopPropagation()}>
                      
                      {entry.seccoesAvaliacao ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
                          
                          {/* Análise de Diálogo */}
                          {entry.seccoesAvaliacao.filter(s => s.id === "avaliacao").map(seccao => {
                            const acertos = seccao.itens.filter(i => i.classificacao === "essencial" || i.classificacao === "adequado").length;
                            const total = seccao.itens.length;
                            return (
                              <div key={seccao.id}>
                                <p className="text-label">Diálogo ({acertos}/{total} perguntas adequadas)</p>
                                <ul style={{ marginTop: "var(--space-xs)", paddingLeft: "16px", display: "flex", flexDirection: "column", gap: "4px" }}>
                                  {seccao.itens.map(item => (
                                    <li key={item.id} className="text-body" style={{ 
                                      color: item.classificacao === "inadequado" ? "var(--color-error)" : "var(--color-text-secondary)",
                                      listStyleType: item.classificacao === "inadequado" ? "circle" : "disc" 
                                    }}>
                                      {item.explicacao}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            );
                          })}

                          {/* Análise de Materiais/Tratamento */}
                          {entry.seccoesAvaliacao.filter(s => s.id === "plano-terapeutico").map(seccao => (
                            <div key={seccao.id}>
                              <p className="text-label">Materiais Escolhidos</p>
                              <div style={{ marginTop: "var(--space-xs)", display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
                                {seccao.itens.map(item => {
                                  const usageCount = item.idOrigem ? contarUsoMaterial(item.idOrigem, historico) : 0;
                                  return (
                                    <div key={item.id} style={{ padding: "var(--space-xs)", background: "var(--color-surface)", borderRadius: "var(--radius-sm)" }}>
                                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <strong className="text-body">{item.rotulo}</strong>
                                        {usageCount > 0 && <span className="text-caption">Usado {usageCount}x no histórico</span>}
                                      </div>
                                      <p className="text-caption" style={{ color: item.classificacao === "inadequado" || item.classificacao === "redundante" ? "var(--color-error)" : "var(--color-success)" }}>
                                        {item.explicacao}
                                      </p>
                                      {item.justificacaoCorreta !== undefined && item.justificacaoCorreta !== null && (
                                        <p className="text-caption" style={{ marginTop: "2px", fontStyle: "italic" }}>
                                          Justificação: {item.justificacaoCorreta ? "✅ Correta" : "❌ Incorreta"}
                                        </p>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}

                        </div>
                      ) : (
                        <p className="text-body" style={{ color: "var(--color-text-secondary)" }}>
                          Detalhes completos não disponíveis para tentativas antigas.
                        </p>
                      )}

                    </div>
                  )}
                </div>
              )})}
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
