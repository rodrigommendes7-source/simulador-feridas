import Link from "next/link";
import {
  getApplicationLabel,
  getIdealAttempt,
  getTreatmentLabel,
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

function buildIdealResponse(session: CaseSession) {
  const idealAttempt = getIdealAttempt(session);
  return {
    observations: session.template.observationDefinitions
      .filter((item) => idealAttempt.observationIds.includes(item.id))
      .map((item) => item.label),
    questions: session.template.dialoguePrompts
      .filter((item) => idealAttempt.dialogueIds.includes(item.id))
      .map((item) => item.label.replace("Perguntar sobre ", "")),
    treatments: idealAttempt.treatmentIds.map((item) => getTreatmentLabel(item)),
    applications: idealAttempt.applicationIds.map((item) =>
      getApplicationLabel(session.template, item)
    ),
  };
}

export function CaseResultSummary({
  session,
  evaluation,
  previousBestScore,
  onReview,
  onReset,
}: {
  session: CaseSession;
  evaluation: CaseEvaluation;
  previousBestScore: number | null;
  onReview: () => void;
  onReset: () => void;
}) {
  const idealResponse = buildIdealResponse(session);
  const hasPenalties = evaluation.clinicalPenalties.length > 0;

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
            {hasPenalties && (
              <p className="text-body" style={{ marginTop: "var(--space-xs)", color: "var(--color-error)" }}>
                Inclui {evaluation.clinicalPenalties.reduce((a, p) => a + p.points, 0)} pontos de penalização por materiais clinicamente inadequados.
              </p>
            )}
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

      {/* ── Penalizações clínicas (se existirem) ── */}
      {hasPenalties && (
        <section
          style={{
            background: "var(--color-error-subtle)",
            border: "0.5px solid var(--color-error-border)",
            borderRadius: "var(--radius-xl)",
            padding: "var(--space-lg)",
          }}
        >
          <p className="text-label" style={{ color: "var(--color-error)" }}>
            Penalizações clínicas
          </p>
          <div
            style={{
              marginTop: "var(--space-md)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-sm)",
            }}
          >
            {evaluation.clinicalPenalties.map((penalty) => (
              <div
                key={penalty.treatmentId}
                style={{
                  background: "var(--color-surface)",
                  border: "var(--border-default)",
                  borderRadius: "var(--radius-md)",
                  padding: "var(--space-sm) var(--space-md)",
                }}
              >
                <p
                  style={{ fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)" }}
                >
                  {penalty.treatmentLabel} — {penalty.reason}
                </p>
                <p className="text-body" style={{ marginTop: "2px", color: "var(--color-error)" }}>
                  Penalização: -{penalty.points} pontos.
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── 4 blocos de decisão ── */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "var(--space-md)",
        }}
      >
        {(
          [
            ["Decisões essenciais", evaluation.reasoningSummary.essential, "sky"],
            ["Decisões corretas", evaluation.reasoningSummary.correct, "emerald"],
            ["Excessos ou redundâncias", evaluation.reasoningSummary.redundant, "amber"],
            ["Erros com impacto clínico", evaluation.reasoningSummary.inadequate, "rose"],
          ] as [string, string[], BlockColor][]
        ).map(([title, items, color]) => (
          <div key={title} style={blockStyle(color)}>
            <p className="text-label" style={{ color: blockLabelColor(color) }}>
              {title}
            </p>
            <div
              style={{
                marginTop: "var(--space-md)",
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-xs)",
              }}
            >
              {items.length > 0 ? (
                items.map((item, index) => (
                  <p key={index} className="text-body">
                    {item}
                  </p>
                ))
              ) : (
                <p className="text-body" style={{ color: "var(--color-text-disabled)" }}>
                  Sem registos relevantes nesta categoria.
                </p>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* ── Plano recomendado + diferenças ── */}
      <section
        style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "var(--space-md)" }}
      >
        <div className="card" style={{ padding: "var(--space-lg)" }}>
          <p className="text-label" style={{ color: "var(--color-warning)" }}>
            Plano recomendado
          </p>
          <div style={{ marginTop: "var(--space-md)", display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
            <div>
              <p style={{ fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)" }}>
                Plano mínimo seguro
              </p>
              <div style={{ marginTop: "var(--space-sm)", display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
                {evaluation.recommendedPlan.minimum.map((item) => (
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
            <div>
              <p style={{ fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)" }}>
                Plano otimizado
              </p>
              <div style={{ marginTop: "var(--space-sm)", display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
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

      {/* ── Resposta ideal ── */}
      <section
        style={{
          background: "var(--color-success-subtle)",
          border: "0.5px solid var(--color-success-border)",
          borderRadius: "var(--radius-xl)",
          padding: "var(--space-lg)",
        }}
      >
        <p className="text-label" style={{ color: "var(--color-success)" }}>
          Resposta real com pontuação máxima
        </p>
        <div
          style={{
            marginTop: "var(--space-md)",
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "var(--space-md)",
          }}
        >
          {[
            ["Observação", idealResponse.observations],
            ["Perguntas", idealResponse.questions],
            ["Tratamento", idealResponse.treatments],
            ["Aplicação", idealResponse.applications],
          ].map(([label, items]) => (
            <div key={label as string}>
              <p style={{ fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)" }}>
                {label}
              </p>
              <div style={{ marginTop: "var(--space-sm)", display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
                {(items as string[]).map((item) => (
                  <div
                    key={item}
                    style={{
                      background: "var(--color-surface)",
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
          ))}
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
