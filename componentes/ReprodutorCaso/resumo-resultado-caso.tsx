"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  obterRotuloTratamento,
  listarTratamentos,
  type EntradaTentativa,
  type AvaliacaoCaso,
  type ModeloCaso,
  type SeccaoAvaliacao,
} from "@/lib/clinico/indice";
import { evidenceReferences } from "@/data/clinico/evidencia";

// ─── Helpers de estilo ────────────────────────────────────────────────────────

type BlockColor = "emerald" | "amber" | "rose" | "sky" | "slate";

function blockStyle(color: BlockColor): React.CSSProperties {
  if (color === "emerald")
    return { background: "var(--color-success-subtle)", border: "0.5px solid var(--color-success-border)", borderRadius: "var(--radius-xl)", padding: "var(--space-lg)" };
  if (color === "amber")
    return { background: "var(--color-warning-subtle)", border: "0.5px solid var(--color-warning-border)", borderRadius: "var(--radius-xl)", padding: "var(--space-lg)" };
  if (color === "rose")
    return { background: "var(--color-error-subtle)", border: "0.5px solid var(--color-error-border)", borderRadius: "var(--radius-xl)", padding: "var(--space-lg)" };
  if (color === "sky")
    return { background: "var(--color-info-subtle)", border: "0.5px solid var(--color-info-border)", borderRadius: "var(--radius-xl)", padding: "var(--space-lg)" };
  return { background: "var(--color-elevated)", border: "var(--border-default)", borderRadius: "var(--radius-xl)", padding: "var(--space-lg)" };
}

function blockLabelColor(color: BlockColor): string {
  if (color === "emerald") return "var(--color-success)";
  if (color === "amber") return "var(--color-warning)";
  if (color === "rose") return "var(--color-error)";
  if (color === "sky") return "var(--color-info)";
  return "var(--color-text-secondary)";
}

// ─── Score delta ──────────────────────────────────────────────────────────────

function scoreDeltaLabel(melhorPontuacaoAnterior: number | null, currentScore: number) {
  if (melhorPontuacaoAnterior === null) return "Primeira tentativa registada neste caso.";
  if (currentScore > melhorPontuacaoAnterior)
    return `Melhoraste ${currentScore - melhorPontuacaoAnterior} ponto(s) face ao teu melhor registo anterior.`;
  if (currentScore < melhorPontuacaoAnterior)
    return `Ficaste ${melhorPontuacaoAnterior - currentScore} ponto(s) abaixo do teu melhor registo anterior.`;
  return "Igualaste o teu melhor registo anterior neste caso.";
}

// ─── Badge de classificação ───────────────────────────────────────────────────

function ClassificationBadge({ c }: { c: "essencial" | "adequado" | "redundante" | "inadequado" }) {
  const styles: Record<string, React.CSSProperties> = {
    essencial: { background: "var(--color-info-subtle)", color: "var(--color-info)", border: "0.5px solid var(--color-info-border)" },
    adequado: { background: "var(--color-success-subtle)", color: "var(--color-success)", border: "0.5px solid var(--color-success-border)" },
    redundante: { background: "var(--color-warning-subtle)", color: "var(--color-warning)", border: "0.5px solid var(--color-warning-border)" },
    inadequado: { background: "var(--color-error-subtle)", color: "var(--color-error)", border: "0.5px solid var(--color-error-border)" },
  };
  const labels: Record<string, string> = {
    essencial: "essencial",
    adequado: "adequado",
    redundante: "redundante",
    inadequado: "em falta / erro",
  };
  return (
    <span style={{ ...styles[c], borderRadius: "var(--radius-sm)", padding: "1px 6px", fontSize: "0.7rem", fontWeight: "var(--weight-medium)", whiteSpace: "nowrap" }}>
      {labels[c]}
    </span>
  );
}

// ─── Linha de feedback por item ───────────────────────────────────────────────

function FeedbackItem({ label, explanation, classification }: { label: string; explanation: string; classification: "essencial" | "adequado" | "redundante" | "inadequado" }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2px", paddingTop: "var(--space-xs)", borderTop: "var(--border-default)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-xs)", flexWrap: "wrap" }}>
        <p style={{ fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)", fontSize: "var(--text-body)", flex: 1 }}>{label}</p>
        <ClassificationBadge c={classification} />
      </div>
      <p className="text-body" style={{ color: "var(--color-text-secondary)" }}>{explanation}</p>
    </div>
  );
}

// ─── Mini barra de score por secção ──────────────────────────────────────────

function SectionScorePill({ section }: { section: SeccaoAvaliacao }) {
  const pct = section.pontuacaoMaxima > 0 ? Math.round((section.pontuacao / section.pontuacaoMaxima) * 100) : 0;
  const color = pct >= 80 ? "var(--color-success)" : pct >= 50 ? "var(--color-warning)" : "var(--color-error)";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1, minWidth: "100px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)" }}>{section.titulo}</span>
        <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color }}>
          {section.pontuacao}/{section.pontuacaoMaxima}
        </span>
      </div>
      <div style={{ height: "4px", borderRadius: "2px", background: "var(--color-border)", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: "2px", transition: "width 0.3s" }} />
      </div>
    </div>
  );
}

// ─── Extrai itens de uma secção por classificação ────────────────────────────

function getItems(seccoes: SeccaoAvaliacao[], sectionId: string, ...classifications: Array<"essencial" | "adequado" | "redundante" | "inadequado">) {
  const section = seccoes.find((s) => s.id === sectionId);
  if (!section) return [];
  return section.itens.filter((item) => classifications.includes(item.classificacao));
}

// ─── Título de secção com ícone ───────────────────────────────────────────────

function SectionLabel({ color, children }: { color: BlockColor; children: React.ReactNode }) {
  return (
    <p className="text-label" style={{ color: blockLabelColor(color), marginBottom: "var(--space-sm)" }}>
      {children}
    </p>
  );
}

// ─── Seleção de referências de evidência para o resultado ────────────────────

function selectEvidenceForResult(
  avaliacao: AvaliacaoCaso,
  tentativa: EntradaTentativa
): typeof evidenceReferences {
  const allTreatments = listarTratamentos();
  const evidenceIds = new Set<string>();

  // 1) Prioridade: tratamentos do plano otimizado
  for (const label of avaliacao.planoRecomendado.otimizado) {
    const treatment = allTreatments.find((t) => t.rotulo === label);
    if (treatment) {
      treatment.refsEvidencia.forEach((id) => evidenceIds.add(id));
    }
  }

  // 2) Se ainda < 2 refs únicas, completar com tratamentos do utilizador bem classificados
  if (evidenceIds.size < 2) {
    const treatSection = avaliacao.seccoes.find((s) => s.id === "plano-terapeutico");
    if (treatSection) {
      for (const item of treatSection.itens) {
        if (item.classificacao !== "essencial" && item.classificacao !== "adequado") continue;
        if (!item.idOrigem) continue;
        const treatment = allTreatments.find((t) => t.id === item.idOrigem);
        if (treatment) {
          treatment.refsEvidencia.forEach((id) => evidenceIds.add(id));
        }
      }
    }
  }

  return Array.from(evidenceIds)
    .map((id) => evidenceReferences.find((ref) => ref.id === id))
    .filter((ref): ref is NonNullable<typeof ref> => Boolean(ref))
    .slice(0, 2);
}

// ─── Hook de contagem animada ─────────────────────────────────────────────────

function useAnimatedScore(target: number, durationMs = 900): number {
  const [display, setDisplay] = useState(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const start = performance.now();
    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / durationMs, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * target));
      if (progress < 1) raf.current = requestAnimationFrame(tick);
    }
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [target, durationMs]);

  return display;
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function ResumoResultadoCaso({
  modelo,
  avaliacao,
  tentativa,
  melhorPontuacaoAnterior,
  aoRever,
  aoReiniciar,
}: {
  modelo: ModeloCaso;
  avaliacao: AvaliacaoCaso;
  tentativa: EntradaTentativa;
  melhorPontuacaoAnterior: number | null;
  aoRever: () => void;
  aoReiniciar: () => void;
}) {
  const seccoes = avaliacao.seccoes;
  const relevantEvidence = selectEvidenceForResult(avaliacao, tentativa);
  const animatedScore = useAnimatedScore(avaliacao.pontuacao);

  // Itens corretos (essencial ou adequado) — aquilo que o aluno fez bem
  const correctObs = getItems(seccoes, "observacao", "essencial", "adequado");
  const correctAssess = getItems(seccoes, "avaliacao", "essencial", "adequado");
  const correctTreat = getItems(seccoes, "plano-terapeutico", "essencial", "adequado");
  const correctApp = getItems(seccoes, "tecnica-aplicacao", "essencial", "adequado");
  const hasCorrect = correctObs.length + correctAssess.length + correctTreat.length + correctApp.length > 0;

  // Itens em falta (inadequado por omissão de essencial) — o que deveria ter sido feito
  const missingObs = getItems(seccoes, "observacao", "inadequado");
  const missingAssess = getItems(seccoes, "avaliacao", "inadequado");
  const missingTreat = getItems(seccoes, "plano-terapeutico", "inadequado");
  const missingApp = getItems(seccoes, "tecnica-aplicacao", "inadequado");
  const missingVisual = getItems(seccoes, "identificacao-visual", "inadequado");
  const hasMissing = missingObs.length + missingAssess.length + missingTreat.length + missingApp.length + missingVisual.length > 0;

  // Excessos e erros activos (itens selecionados que penalizam)
  const redundant = [
    ...getItems(seccoes, "observacao", "redundante"),
    ...getItems(seccoes, "avaliacao", "redundante"),
    ...getItems(seccoes, "plano-terapeutico", "redundante"),
    ...getItems(seccoes, "tecnica-aplicacao", "redundante"),
  ];
  const hasRedundant = redundant.length > 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)", padding: "var(--space-2xl)" }}>

      {/* ── Cabeçalho + score + barras por secção ── */}
      <section className="card" style={{ padding: "var(--space-2xl)" }}>
        <p className="text-label" style={{ color: "var(--color-accent)" }}>Leitura clínica do caso</p>
        <h2 style={{ marginTop: "var(--space-sm)", fontSize: "var(--text-h1)", fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)" }}>
          {modelo.tituloAbreviado} · {modelo.titulo}
        </h2>
        <p className="text-body" style={{ marginTop: "var(--space-md)", maxWidth: "64rem" }}>
          {avaliacao.resumoRaciocinio.leitura}
        </p>

        {/* Score global */}
        <div className="progress-track" style={{ marginTop: "var(--space-lg)" }}>
          <div className="progress-fill" style={{ width: `${avaliacao.pontuacao}%` }} />
        </div>
        <div style={{ marginTop: "var(--space-md)", display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "var(--space-md)" }}>
          <div>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-h1)", fontWeight: "var(--weight-medium)", color: "var(--color-accent)" }}>
              {animatedScore}/100
            </p>
            {avaliacao.penalizacaoJustificacao > 0 && (
              <p style={{ marginTop: "var(--space-xs)", fontSize: "var(--text-label)", color: "var(--color-warning, #d97706)" }}>
                −{avaliacao.penalizacaoJustificacao} pts por {avaliacao.justificacoesErradas} justificação{avaliacao.justificacoesErradas !== 1 ? "ões" : ""} incorreta{avaliacao.justificacoesErradas !== 1 ? "s" : ""}
              </p>
            )}
            <p className="text-body" style={{ marginTop: "var(--space-xs)" }}>
              {scoreDeltaLabel(melhorPontuacaoAnterior, avaliacao.pontuacao)}
            </p>
          </div>
          <div className="card" style={{ padding: "var(--space-md)", maxWidth: "28rem" }}>
            <p style={{ fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)" }}>Próximo passo</p>
            <p className="text-body" style={{ marginTop: "var(--space-xs)" }}>{avaliacao.resumoRaciocinio.proximoPasso}</p>
          </div>
        </div>

        {/* Barras por secção */}
        <div style={{ marginTop: "var(--space-lg)", display: "flex", flexWrap: "wrap", gap: "var(--space-md)" }}>
          {seccoes.map((s) => (
            <SectionScorePill key={s.id} section={s} />
          ))}
        </div>
      </section>

      {/* ── O que faltou (itens essenciais não executados) ── */}
      {hasMissing && (
        <section style={blockStyle("rose")}>
          <SectionLabel color="rose">O que faltou fazer</SectionLabel>
          <p className="text-body" style={{ color: "var(--color-text-secondary)", marginBottom: "var(--space-md)" }}>
            Estes itens essenciais foram omitidos e reduziram a pontuação.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
            {missingVisual.length > 0 && (
              <div>
                <p style={{ fontSize: "0.75rem", fontWeight: "var(--weight-medium)", color: "var(--color-text-secondary)", marginBottom: "var(--space-xs)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Identificação visual</p>
                {missingVisual.map((item) => (
                  <FeedbackItem key={item.id} label={item.rotulo} explanation={item.explicacao} classification={item.classificacao} />
                ))}
              </div>
            )}
            {missingObs.length > 0 && (
              <div>
                <p style={{ fontSize: "0.75rem", fontWeight: "var(--weight-medium)", color: "var(--color-text-secondary)", marginBottom: "var(--space-xs)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Observação</p>
                {missingObs.map((item) => (
                  <FeedbackItem key={item.id} label={item.rotulo} explanation={item.explicacao} classification={item.classificacao} />
                ))}
              </div>
            )}
            {missingAssess.length > 0 && (
              <div>
                <p style={{ fontSize: "0.75rem", fontWeight: "var(--weight-medium)", color: "var(--color-text-secondary)", marginBottom: "var(--space-xs)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Avaliação e diálogo</p>
                {missingAssess.map((item) => (
                  <FeedbackItem key={item.id} label={item.rotulo} explanation={item.explicacao} classification={item.classificacao} />
                ))}
              </div>
            )}
            {missingTreat.length > 0 && (
              <div>
                <p style={{ fontSize: "0.75rem", fontWeight: "var(--weight-medium)", color: "var(--color-text-secondary)", marginBottom: "var(--space-xs)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Plano terapêutico</p>
                {missingTreat.map((item) => (
                  <FeedbackItem key={item.id} label={item.rotulo} explanation={item.explicacao} classification={item.classificacao} />
                ))}
              </div>
            )}
            {missingApp.length > 0 && (
              <div>
                <p style={{ fontSize: "0.75rem", fontWeight: "var(--weight-medium)", color: "var(--color-text-secondary)", marginBottom: "var(--space-xs)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Técnica de aplicação</p>
                {missingApp.map((item) => (
                  <FeedbackItem key={item.id} label={item.rotulo} explanation={item.explicacao} classification={item.classificacao} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Decisões corretas ── */}
      {hasCorrect && (
        <section style={blockStyle("emerald")}>
          <SectionLabel color="emerald">Decisões corretas</SectionLabel>
          <p className="text-body" style={{ color: "var(--color-text-secondary)", marginBottom: "var(--space-md)" }}>
            O que fizeste bem, com a justificação clínica de cada escolha.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
            {/* Observação — item único agregado com o que o aluno registou */}
            {correctObs.length > 0 && (
              <FeedbackItem
                label="Observação"
                explanation={correctObs.map((item) => item.explicacao).join(" ")}
                classification={correctObs.some((i) => i.classificacao === "essencial") ? "essencial" : "adequado"}
              />
            )}
            {/* Avaliação e diálogo — item único agregado */}
            {correctAssess.length > 0 && (
              <FeedbackItem
                label="Avaliação e diálogo"
                explanation={correctAssess.map((item) => item.explicacao).join(" ")}
                classification={correctAssess.some((i) => i.classificacao === "essencial") ? "essencial" : "adequado"}
              />
            )}
            {correctTreat.length > 0 && (
              <div>
                <p style={{ fontSize: "0.75rem", fontWeight: "var(--weight-medium)", color: "var(--color-text-secondary)", marginBottom: "var(--space-xs)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Plano terapêutico</p>
                {correctTreat.map((item) => (
                  <FeedbackItem key={item.id} label={item.idOrigem ? obterRotuloTratamento(item.idOrigem) : item.rotulo} explanation={item.explicacao} classification={item.classificacao} />
                ))}
              </div>
            )}
            {correctApp.length > 0 && (
              <div>
                <p style={{ fontSize: "0.75rem", fontWeight: "var(--weight-medium)", color: "var(--color-text-secondary)", marginBottom: "var(--space-xs)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Técnica de aplicação</p>
                {correctApp.map((item) => (
                  <FeedbackItem key={item.id} label={item.rotulo} explanation={item.explicacao} classification={item.classificacao} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Excessos e redundâncias ── */}
      {hasRedundant && (
        <section style={blockStyle("amber")}>
          <SectionLabel color="amber">Excessos e redundâncias</SectionLabel>
          <p className="text-body" style={{ color: "var(--color-text-secondary)", marginBottom: "var(--space-md)" }}>
            Selecionaste materiais ou técnicas que não acrescentam valor clínico neste contexto.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
            {redundant.map((item) => (
              <FeedbackItem key={item.id} label={item.idOrigem ? obterRotuloTratamento(item.idOrigem) : item.rotulo} explanation={item.explicacao} classification={item.classificacao} />
            ))}
          </div>
        </section>
      )}

      {/* ── Plano recomendado + diferenças ── */}
      <section className="result-grid-2">
        <div className="card" style={{ padding: "var(--space-lg)" }}>
          <p className="text-label" style={{ color: "var(--color-warning)" }}>Plano otimizado</p>
          <div style={{ marginTop: "var(--space-md)", display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
            {avaliacao.planoRecomendado.otimizado.map((item) => (
              <div key={item} style={{ background: "var(--color-elevated)", border: "var(--border-default)", borderRadius: "var(--radius-md)", padding: "var(--space-xs) var(--space-sm)" }}>
                <p className="text-body">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: "var(--space-lg)" }}>
          <p className="text-label" style={{ color: "var(--color-info)" }}>O que faria diferença clínica</p>
          <div style={{ marginTop: "var(--space-md)", display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
            {avaliacao.planoRecomendado.diferencas.length > 0 ? (
              avaliacao.planoRecomendado.diferencas.map((item) => (
                <div key={item} style={{ background: "var(--color-elevated)", border: "var(--border-default)", borderRadius: "var(--radius-md)", padding: "var(--space-xs) var(--space-sm)" }}>
                  <p className="text-body">{item}</p>
                </div>
              ))
            ) : (
              <p className="text-body" style={{ color: "var(--color-text-disabled)" }}>
                O plano que montaste já cobre os pontos principais deste caso.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── Evolução esperada (par antes/depois) ── */}
      {modelo.urlImagemDepois && (
        <section className="card" style={{ padding: "var(--space-lg)" }}>
          <p className="text-label" style={{ color: "var(--color-success)" }}>Evolução esperada</p>
          <p className="text-body" style={{ marginTop: "var(--space-xs)", color: "var(--color-text-secondary)" }}>
            Com tratamento adequado, a evolução esperada desta ferida é a seguinte.
          </p>
          <div style={{ marginTop: "var(--space-md)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)" }}>
            <figure style={{ margin: 0 }}>
              <img src={modelo.srcImagem} alt="Estado inicial" style={{ width: "100%", borderRadius: "var(--radius-md)", display: "block" }} />
              <figcaption style={{ marginTop: "var(--space-xs)", fontSize: "var(--text-label)", color: "var(--color-text-secondary)", textAlign: "center" }}>
                Antes
              </figcaption>
            </figure>
            <figure style={{ margin: 0 }}>
              <img src={modelo.urlImagemDepois} alt="Estado pós-tratamento" style={{ width: "100%", borderRadius: "var(--radius-md)", display: "block" }} />
              <figcaption style={{ marginTop: "var(--space-xs)", fontSize: "var(--text-label)", color: "var(--color-text-secondary)", textAlign: "center" }}>
                Depois
              </figcaption>
            </figure>
          </div>
          {modelo.legendaEvolucao && (
            <p className="text-body" style={{ marginTop: "var(--space-md)", color: "var(--color-text-primary)", fontStyle: "italic" }}>
              {modelo.legendaEvolucao}
            </p>
          )}
        </section>
      )}

      {/* ── Evidência clínica relevante ── */}
      {relevantEvidence.length > 0 && (
        <section className="card" style={{ padding: "var(--space-lg)" }}>
          <p className="text-label" style={{ color: "var(--color-info)" }}>Evidência clínica</p>
          <p className="text-body" style={{ marginTop: "var(--space-xs)", color: "var(--color-text-secondary)" }}>
            Referências que sustentam as decisões deste caso.
          </p>
          <div style={{ marginTop: "var(--space-md)", display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
            {relevantEvidence.map((ref) => (
              <a
                key={ref.id}
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card card-clickable"
                style={{ padding: "var(--space-md)", display: "flex", flexDirection: "column", gap: "var(--space-xs)", textDecoration: "none" }}
              >
                <p style={{ fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)", fontSize: "var(--text-body)" }}>
                  {ref.titulo}
                </p>
                <p className="text-body" style={{ color: "var(--color-text-secondary)" }}>
                  {ref.resumo}
                </p>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* ── Reforço recomendado ── */}
      {avaliacao.recomendacoesAprendizagem.length > 0 && (
        <section className="card" style={{ padding: "var(--space-lg)" }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "var(--space-md)" }}>
            <div>
              <p className="text-label" style={{ color: "var(--color-info)" }}>Reforço recomendado</p>
              <p className="text-body" style={{ marginTop: "var(--space-xs)", maxWidth: "40rem" }}>
                Estes temas são os próximos passos mais úteis para melhorares a consistência clínica nas próximas tentativas.
              </p>
            </div>
            <Link href="/aprender" className="btn btn-primary">Ir para Aprender</Link>
          </div>
          <div className="result-grid-2" style={{ marginTop: "var(--space-md)", gap: "var(--space-sm)" }}>
            {avaliacao.recomendacoesAprendizagem.map((rec) => (
              <Link
                key={rec.idTema}
                href={`/aprender?topic=${rec.idTema}&source=result&reason=${encodeURIComponent(rec.motivo)}`}
                className="card card-clickable"
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-sm)" }}>
                  <p style={{ fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)" }}>{rec.titulo}</p>
                  <span className={rec.prioridade === "alta" ? "badge badge-avance" : "badge badge-inter"}>{rec.prioridade}</span>
                </div>
                <p className="text-body" style={{ marginTop: "var(--space-sm)" }}>{rec.motivo}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Ações ── */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-sm)" }}>
        <button type="button" onClick={aoRever} className="btn btn-secondary">Rever resolução</button>
        <button type="button" onClick={aoReiniciar} className="btn btn-primary">Repetir caso</button>
        <Link href="/casos" className="btn btn-ghost">Voltar aos casos</Link>
        <Link href="/historico" className="btn btn-ghost">Ver histórico</Link>
      </div>
    </div>
  );
}
