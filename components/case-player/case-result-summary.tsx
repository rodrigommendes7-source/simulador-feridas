import Link from "next/link";
import {
  getTreatmentLabel,
  type AttemptInput,
  type CaseEvaluation,
  type CaseSession,
} from "@/lib/clinical";

type BlockColor = "emerald" | "amber" | "rose" | "sky";

function blockStyle(color: BlockColor): React.CSSProperties {
  if (color === "emerald") return { background: "var(--color-success-subtle)", border: "0.5px solid var(--color-success-border)", borderRadius: "var(--radius-xl)", padding: "var(--space-lg)" };
  if (color === "amber") return { background: "var(--color-warning-subtle)", border: "0.5px solid var(--color-warning-border)", borderRadius: "var(--radius-xl)", padding: "var(--space-lg)" };
  if (color === "rose") return { background: "var(--color-error-subtle)", border: "0.5px solid var(--color-error-border)", borderRadius: "var(--radius-xl)", padding: "var(--space-lg)" };
  return { background: "var(--color-info-subtle)", border: "0.5px solid var(--color-info-border)", borderRadius: "var(--radius-xl)", padding: "var(--space-lg)" };
}

function blockLabelColor(color: BlockColor): string {
  if (color === "emerald") return "var(--color-success)";
  if (color === "amber") return "var(--color-warning)";
  if (color === "rose") return "var(--color-error)";
  return "var(--color-info)";
}

function scoreDeltaLabel(previousBestScore: number | null, currentScore: number) {
  if (previousBestScore === null) return "Primeira tentativa registada neste caso.";
  if (currentScore > previousBestScore) {
    return `Melhoraste ${currentScore - previousBestScore} ponto(s) face ao teu melhor registo anterior.`;
  }
  if (currentScore < previousBestScore) {
    return `Ficaste ${previousBestScore - currentScore} ponto(s) abaixo do teu melhor registo anterior.`;
  }
  return "Igualaste o teu melhor registo anterior neste caso.";
}

// Constrói a lista "Decisões essenciais": observações + diálogos + técnica que foram essenciais
function buildEssentialLines(session: CaseSession, attempt: AttemptInput, evaluation: CaseEvaluation): string[] {
  const lines: string[] = [];

  // Observações essenciais seleccionadas
  const obsSection = evaluation.sections.find((s) => s.id === "observation");
  if (obsSection) {
    for (const item of obsSection.items) {
      if (item.classification === "essencial" && item.sourceId && attempt.observationIds.includes(item.sourceId as never)) {
        lines.push(`Observaste ${item.label.toLowerCase()}.`);
      }
    }
  }

  // Diálogos essenciais seleccionados
  const assessSection = evaluation.sections.find((s) => s.id === "assessment");
  if (assessSection) {
    for (const item of assessSection.items) {
      if (item.classification === "essencial" && item.sourceId && attempt.dialogueIds.includes(item.sourceId as never)) {
        lines.push(`Perguntaste sobre ${item.label.toLowerCase()}.`);
      }
    }
  }

  // Técnica essencial seleccionada
  const appSection = evaluation.sections.find((s) => s.id === "application-technique");
  if (appSection) {
    for (const item of appSection.items) {
      if (item.classification === "essencial" && item.sourceId && attempt.applicationIds.includes(item.sourceId as never)) {
        lines.push(`Técnica: ${item.label}.`);
      }
    }
  }

  return lines;
}

// Constrói a lista "Tratamentos corretos": label + justificação de 1 linha
function buildCorrectTreatmentLines(attempt: AttemptInput, evaluation: CaseEvaluation): { label: string; explanation: string }[] {
  const treatSection = evaluation.sections.find((s) => s.id === "treatment-plan");
  if (!treatSection) return [];

  return treatSection.items
    .filter(
      (item) =>
        (item.classification === "essencial" || item.classification === "adequado") &&
        item.sourceId &&
        attempt.treatmentIds.includes(item.sourceId)
    )
    .map((item) => ({
      label: getTreatmentLabel(item.sourceId!),
      explanation: item.explanation,
    }));
}

export function CaseResultSummary({
  session,
  evaluation,
  attempt,
  previousBestScore,
  onReview,
  onReset,
}: {
  session: CaseSession;
  evaluation: CaseEvaluation;
  attempt: AttemptInput;
  previousBestScore: number | null;
  onReview: () => void;
  onReset: () => void;
}) {
  const essentialLines = buildEssentialLines(session, attempt, evaluation);
  const correctTreatments = buildCorrectTreatmentLines(attempt, evaluation);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)", padding: "var(--space-2xl)" }}>

      {/* ── Cabeçalho + pontuação ── */}
      <section className="card" style={{ padding: "var(--space-2xl)" }}>
        <p className="text-label" style={{ color: "var(--color-accent)" }}>
          Leitura clínica do caso
        </p>
        <h2
          style={{
            marginTop: "var(--space-sm)",
            fontSize: "var(--text-h1)",
            fontWeight: "var(--weight-medium)",
            color: "var(--color-text-primary)",
          }}
        >
          {session.template.shortTitle} · {session.template.title}
        </h2>
        <p
          className="text-body"
          style={{ marginTop: "var(--space-md)", maxWidth: "64rem" }}
        >
          {evaluation.reasoningSummary.reading}
        </p>

        {/* Barra de progresso */}
        <div className="progress-track" style={{ marginTop: "var(--space-lg)" }}>
          <div className="progress-fill" style={{ width: `${evaluation.score}%` }} />
        </div>

        <div
          style={{
            marginTop: "var(--space-md)",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "var(--space-md)",
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-h1)",
                fontWeight: "var(--weight-medium)",
                color: "var(--color-accent)",
              }}
            >
              {evaluation.score}/100
            </p>
            <p className="text-body" style={{ marginTop: "var(--space-xs)" }}>
              {scoreDeltaLabel(previousBestScore, evaluation.score)}
            </p>
          </div>
          <div className="card" style={{ padding: "var(--space-md)", maxWidth: "28rem" }}>
            <p style={{ fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)" }}>
              Próximo passo
            </p>
            <p className="text-body" style={{ marginTop: "var(--space-xs)" }}>
              {evaluation.reasoningSummary.nextStep}
            </p>
          </div>
        </div>
      </section>

      {/* ── 4 blocos de decisão ── */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "var(--space-md)",
        }}
      >
          {/* Decisões essenciais */}
        <div style={blockStyle("sky")}>
          <p className="text-label" style={{ color: blockLabelColor("sky") }}>Decisões essenciais</p>
          <div style={{ marginTop: "var(--space-md)", display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
            {essentialLines.length > 0 ? (
              essentialLines.map((item, index) => (
                <p key={index} className="text-body">{item}</p>
              ))
            ) : (
              <p className="text-body" style={{ color: "var(--color-text-disabled)" }}>Sem registos relevantes nesta categoria.</p>
            )}
          </div>
        </div>

        {/* Tratamentos corretos */}
        <div style={blockStyle("emerald")}>
          <p className="text-label" style={{ color: blockLabelColor("emerald") }}>Tratamentos corretos</p>
          <div style={{ marginTop: "var(--space-md)", display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
            {correctTreatments.length > 0 ? (
              correctTreatments.map((item, index) => (
                <div key={index}>
                  <p style={{ fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)", fontSize: "var(--text-body)" }}>{item.label}</p>
                  <p className="text-body" style={{ marginTop: "2px" }}>{item.explanation}</p>
                </div>
              ))
            ) : (
              <p className="text-body" style={{ color: "var(--color-text-disabled)" }}>Sem registos relevantes nesta categoria.</p>
            )}
          </div>
        </div>

        {/* Excessos ou redundâncias */}
        <div style={blockStyle("amber")}>
          <p className="text-label" style={{ color: blockLabelColor("amber") }}>Excessos ou redundâncias</p>
          <div style={{ marginTop: "var(--space-md)", display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
            {evaluation.reasoningSummary.redundant.length > 0 ? (
              evaluation.reasoningSummary.redundant.map((item, index) => (
                <p key={index} className="text-body">{item}</p>
              ))
            ) : (
              <p className="text-body" style={{ color: "var(--color-text-disabled)" }}>Sem registos relevantes nesta categoria.</p>
            )}
          </div>
        </div>

        {/* Erros com impacto clínico */}
        <div style={blockStyle("rose")}>
          <p className="text-label" style={{ color: blockLabelColor("rose") }}>Erros com impacto clínico</p>
          <div style={{ marginTop: "var(--space-md)", display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
            {evaluation.reasoningSummary.inadequate.length > 0 ? (
              evaluation.reasoningSummary.inadequate.map((item, index) => (
                <p key={index} className="text-body">{item}</p>
              ))
            ) : (
              <p className="text-body" style={{ color: "var(--color-text-disabled)" }}>Sem registos relevantes nesta categoria.</p>
            )}
          </div>
        </div>
      </section>

      {/* ── Plano recomendado + diferenças ── */}
      <section
        style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "var(--space-md)" }}
      >
        <div className="card" style={{ padding: "var(--space-lg)" }}>
          <p className="text-label" style={{ color: "var(--color-warning)" }}>
            Plano otimizado
          </p>
          <div style={{ marginTop: "var(--space-md)", display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
            {evaluation.recommendedPlan.optimized.map((item) => (
              <div
                key={item}
                style={{
                  background: "var(--color-elevated)",
                  border: "var(--border-default)",
                  borderRadius: "var(--radius-md)",
                  padding: "var(--space-xs) var(--space-sm)",
                }}
              >
                <p className="text-body">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: "var(--space-lg)" }}>
          <p className="text-label" style={{ color: "var(--color-info)" }}>
            O que faria diferença clínica
          </p>
          <div style={{ marginTop: "var(--space-md)", display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
            {evaluation.recommendedPlan.differences.length > 0 ? (
              evaluation.recommendedPlan.differences.map((item) => (
                <div
                  key={item}
                  style={{
                    background: "var(--color-elevated)",
                    border: "var(--border-default)",
                    borderRadius: "var(--radius-md)",
                    padding: "var(--space-xs) var(--space-sm)",
                  }}
                >
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

      {/* ── Reforço recomendado ── */}
      <section className="card" style={{ padding: "var(--space-lg)" }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "var(--space-md)",
          }}
        >
          <div>
            <p className="text-label" style={{ color: "var(--color-info)" }}>
              Reforço recomendado
            </p>
            <p className="text-body" style={{ marginTop: "var(--space-xs)", maxWidth: "40rem" }}>
              Estes temas são os próximos passos mais úteis para melhorares a consistência clínica
              nas próximas tentativas.
            </p>
          </div>
          <Link href="/aprender" className="btn btn-primary">
            Ir para Aprender
          </Link>
        </div>
        <div
          style={{
            marginTop: "var(--space-md)",
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "var(--space-sm)",
          }}
        >
          {evaluation.learningRecommendations.map((recommendation) => (
            <Link
              key={recommendation.topicId}
              href={`/aprender?topic=${recommendation.topicId}&source=result&reason=${encodeURIComponent(
                recommendation.reason
              )}`}
              className="card card-clickable"
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "var(--space-sm)",
                }}
              >
                <p style={{ fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)" }}>
                  {recommendation.title}
                </p>
                <span
                  className={recommendation.priority === "alta" ? "badge badge-avance" : "badge badge-inter"}
                >
                  {recommendation.priority}
                </span>
              </div>
              <p className="text-body" style={{ marginTop: "var(--space-sm)" }}>
                {recommendation.reason}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Ações ── */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-sm)" }}>
        <button
          type="button"
          onClick={onReview}
          className="btn btn-secondary"
        >
          Rever resolução
        </button>
        <button
          type="button"
          onClick={onReset}
          className="btn btn-primary"
        >
          Repetir caso
        </button>
        <Link href="/casos" className="btn btn-ghost">
          Voltar aos casos
        </Link>
        <Link href="/historico" className="btn btn-ghost">
          Ver histórico
        </Link>
      </div>
    </div>
  );
}
