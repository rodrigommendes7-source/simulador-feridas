import Link from "next/link";
import {
  getEvidence,
  getLearningTopic,
  getRelatedCasesForTopic,
  getTreatmentsForTopic,
  listLearningTopics,
} from "@/lib/clinical";

function capitalizeSentence(value: string) {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function topicDifficultyLabel(value: string) {
  if (value === "base") return "Base";
  if (value === "intermedio") return "Intermédio";
  return "Avançado";
}

function caseDifficultyLabel(value: string) {
  if (value === "introdutorio") return "Introdutório";
  if (value === "intermedio") return "Intermédio";
  return "Avançado";
}

function caseDifficultyBadgeClass(value: string) {
  if (value === "introdutorio") return "badge badge-intro";
  if (value === "intermedio") return "badge badge-inter";
  return "badge badge-avance";
}

export default async function LearningPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const topics = listLearningTopics();
  const topicParam = Array.isArray(resolvedSearchParams.topic)
    ? resolvedSearchParams.topic[0]
    : resolvedSearchParams.topic;
  const sourceParam = Array.isArray(resolvedSearchParams.source)
    ? resolvedSearchParams.source[0]
    : resolvedSearchParams.source;
  const reasonParam = Array.isArray(resolvedSearchParams.reason)
    ? resolvedSearchParams.reason[0]
    : resolvedSearchParams.reason;
  const activeTopic = topics.find((topic) => topic.id === topicParam) ?? topics[0];
  const relatedTreatments = getTreatmentsForTopic(activeTopic.id);
  const relatedCases = getRelatedCasesForTopic(activeTopic.id);
  const relatedTopics = activeTopic.relatedTopicIds
    .map((topicId) => getLearningTopic(topicId))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <main className="grid lg:grid-cols-[280px_1fr]" style={{ gap: "var(--space-2xl)" }}>

      {/* ── Sidebar de temas ─────────────────────────────────────────────── */}
      <aside
        style={{
          background: "var(--color-surface)",
          border: "var(--border-default)",
          borderRadius: "var(--radius-xl)",
          padding: "var(--space-lg)",
          alignSelf: "start",
        }}
      >
        <p className="text-label">Aprender</p>
        <div style={{ marginTop: "var(--space-md)", display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
          {topics.map((topic) => (
            <Link
              key={topic.id}
              href={`/aprender?topic=${topic.id}`}
              style={
                topic.id === activeTopic.id
                  ? {
                      display: "block",
                      background: "var(--color-accent)",
                      color: "var(--color-base)",
                      border: "var(--border-default)",
                      borderRadius: "var(--radius-lg)",
                      padding: "var(--space-sm) var(--space-md)",
                      fontWeight: "var(--weight-medium)",
                      fontSize: "var(--text-body)",
                      textDecoration: "none",
                    }
                  : {
                      display: "block",
                      background: "var(--color-elevated)",
                      color: "var(--color-text-secondary)",
                      border: "var(--border-default)",
                      borderRadius: "var(--radius-lg)",
                      padding: "var(--space-sm) var(--space-md)",
                      fontSize: "var(--text-body)",
                      textDecoration: "none",
                    }
              }
            >
              {topic.title}
            </Link>
          ))}
        </div>
      </aside>

      {/* ── Conteúdo do tema ─────────────────────────────────────────────── */}
      <section style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>

        {/* Cabeçalho do tema */}
        <div
          style={{
            background: "var(--color-surface)",
            border: "var(--border-default)",
            borderRadius: "var(--radius-xl)",
            padding: "var(--space-2xl)",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "var(--space-sm)" }}>
            <p className="text-label" style={{ color: "var(--color-accent)" }}>Biblioteca clínica</p>
            <span
              style={{
                border: "var(--border-default)",
                borderRadius: "var(--radius-pill)",
                padding: "2px var(--space-sm)",
                fontSize: "var(--text-label)",
                fontWeight: "var(--weight-medium)",
                color: "var(--color-text-secondary)",
                textTransform: "uppercase",
                letterSpacing: "var(--tracking-label)",
              }}
            >
              {topicDifficultyLabel(activeTopic.pedagogicalDifficulty)}
            </span>
          </div>
          <h1
            style={{
              marginTop: "var(--space-sm)",
              fontSize: "var(--text-h1)",
              fontWeight: "var(--weight-medium)",
              color: "var(--color-text-primary)",
            }}
          >
            {activeTopic.title}
          </h1>
          <p className="text-body" style={{ marginTop: "var(--space-md)", maxWidth: "64rem" }}>
            {capitalizeSentence(activeTopic.definition)}
          </p>

          {reasonParam ? (
            <div className="alert alert-info" style={{ marginTop: "var(--space-lg)" }}>
              <p style={{ fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)" }}>
                Porque este tema te foi recomendado
              </p>
              <p className="text-body" style={{ marginTop: "var(--space-xs)" }}>{reasonParam}</p>
              {sourceParam ? (
                <p
                  className="text-caption"
                  style={{
                    marginTop: "var(--space-xs)",
                    textTransform: "uppercase",
                    letterSpacing: "var(--tracking-label)",
                  }}
                >
                  Origem: {sourceParam}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>

        {/* Quando considerar / Quando evitar */}
        <div className="grid md:grid-cols-2" style={{ gap: "var(--space-md)" }}>
          <div
            style={{
              background: "var(--color-surface)",
              border: "var(--border-default)",
              borderRadius: "var(--radius-xl)",
              padding: "var(--space-xl)",
            }}
          >
            <p className="text-label" style={{ color: "var(--color-info)" }}>Quando considerar</p>
            <div style={{ marginTop: "var(--space-md)", display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
              {activeTopic.indications.map((item) => (
                <div
                  key={item}
                  style={{
                    background: "var(--color-elevated)",
                    border: "var(--border-default)",
                    borderRadius: "var(--radius-md)",
                    padding: "var(--space-xs) var(--space-sm)",
                  }}
                >
                  <p className="text-body">{capitalizeSentence(item)}</p>
                </div>
              ))}
            </div>
          </div>
          <div
            style={{
              background: "var(--color-surface)",
              border: "var(--border-default)",
              borderRadius: "var(--radius-xl)",
              padding: "var(--space-xl)",
            }}
          >
            <p className="text-label" style={{ color: "var(--color-error)" }}>Quando evitar</p>
            <div style={{ marginTop: "var(--space-md)", display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
              {activeTopic.contraindications.map((item) => (
                <div
                  key={item}
                  style={{
                    background: "var(--color-elevated)",
                    border: "var(--border-default)",
                    borderRadius: "var(--radius-md)",
                    padding: "var(--space-xs) var(--space-sm)",
                  }}
                >
                  <p className="text-body">{capitalizeSentence(item)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sinais + Erros / Materiais + Casos + Temas */}
        <div className="grid xl:grid-cols-[0.9fr_1.1fr]" style={{ gap: "var(--space-md)" }}>

          {/* Sinais de alerta + Erros frequentes */}
          <div
            style={{
              background: "var(--color-surface)",
              border: "var(--border-default)",
              borderRadius: "var(--radius-xl)",
              padding: "var(--space-xl)",
            }}
          >
            <p className="text-label" style={{ color: "var(--color-warning)" }}>Sinais de alerta</p>
            <div style={{ marginTop: "var(--space-md)", display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
              {activeTopic.warningSigns.map((item) => (
                <div
                  key={item}
                  style={{
                    background: "var(--color-elevated)",
                    border: "var(--border-default)",
                    borderRadius: "var(--radius-md)",
                    padding: "var(--space-xs) var(--space-sm)",
                  }}
                >
                  <p className="text-body">{capitalizeSentence(item)}</p>
                </div>
              ))}
            </div>

            <p className="text-label" style={{ color: "var(--color-error)", marginTop: "var(--space-xl)" }}>
              Erros frequentes
            </p>
            <div style={{ marginTop: "var(--space-md)", display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
              {activeTopic.commonMistakes.map((mistake) => (
                <div
                  key={mistake.id}
                  style={{
                    background: "var(--color-elevated)",
                    border: "var(--border-default)",
                    borderRadius: "var(--radius-lg)",
                    padding: "var(--space-md)",
                  }}
                >
                  <p style={{ fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)" }}>
                    {capitalizeSentence(mistake.title)}
                  </p>
                  <p className="text-body" style={{ marginTop: "var(--space-xs)" }}>
                    {capitalizeSentence(mistake.explanation)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Materiais + Casos + Temas relacionados */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>

            {/* Materiais relacionados */}
            <div
              style={{
                background: "var(--color-surface)",
                border: "var(--border-default)",
                borderRadius: "var(--radius-xl)",
                padding: "var(--space-xl)",
              }}
            >
              <p className="text-label" style={{ color: "var(--color-info)" }}>Materiais relacionados</p>
              <div
                className="grid md:grid-cols-2"
                style={{ marginTop: "var(--space-md)", gap: "var(--space-sm)" }}
              >
                {relatedTreatments.map((treatment) => (
                  <div
                    key={treatment.id}
                    className="card"
                    style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}
                  >
                    {/* Linha 1: nome + tags */}
                    <div>
                      <p style={{ fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)" }}>
                        {treatment.label}
                      </p>
                      {treatment.uiTags.length > 0 && (
                        <p className="text-caption" style={{ marginTop: "2px" }}>
                          {treatment.uiTags.map(capitalizeSentence).join(" · ")}
                        </p>
                      )}
                    </div>
                    {/* Linha 2: indicações + contraindicações */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                      <p className="text-body" style={{ fontSize: "var(--text-label)" }}>
                        {treatment.indications.slice(0, 2).map(capitalizeSentence).join(". ")}.
                      </p>
                      {treatment.contraindications.length > 0 && (
                        <p
                          className="text-body"
                          style={{ fontSize: "var(--text-label)", color: "var(--color-text-disabled)" }}
                        >
                          Evitar: {treatment.contraindications.slice(0, 2).map(capitalizeSentence).join(", ")}.
                        </p>
                      )}
                    </div>
                    {/* Links de evidência */}
                    {treatment.evidenceRefs.length > 0 && (
                      <div
                        style={{
                          borderTop: "var(--border-default)",
                          paddingTop: "var(--space-xs)",
                          display: "flex",
                          flexDirection: "column",
                          gap: "2px",
                        }}
                      >
                        {treatment.evidenceRefs.map((evidenceId) => {
                          const evidence = getEvidence(evidenceId);
                          if (!evidence) return null;
                          return (
                            <a
                              key={evidenceId}
                              href={evidence.url}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                fontSize: "var(--text-label)",
                                color: "var(--color-info)",
                                textDecoration: "underline",
                                opacity: 0.7,
                              }}
                            >
                              {evidence.title}
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Casos em que este tema é central */}
            <div
              style={{
                background: "var(--color-surface)",
                border: "var(--border-default)",
                borderRadius: "var(--radius-xl)",
                padding: "var(--space-xl)",
              }}
            >
              <p className="text-label" style={{ color: "var(--color-warning)" }}>
                Casos em que este tema é central
              </p>
              <div
                className="grid md:grid-cols-2"
                style={{ marginTop: "var(--space-md)", gap: "var(--space-sm)" }}
              >
                {relatedCases.map((caseItem) => (
                  <Link
                    key={caseItem.id}
                    href={`/casos/${caseItem.id}`}
                    className="card card-clickable"
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "var(--space-xs)" }}>
                      <p style={{ fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)" }}>
                        {caseItem.shortTitle}
                      </p>
                      <span className={caseDifficultyBadgeClass(caseItem.difficulty)}>
                        {caseDifficultyLabel(caseItem.difficulty)}
                      </span>
                    </div>
                    <p className="text-body" style={{ marginTop: "var(--space-xs)" }}>
                      {capitalizeSentence(caseItem.title)}
                    </p>
                    <p
                      className="text-label"
                      style={{ marginTop: "var(--space-sm)", color: "var(--color-warning)" }}
                    >
                      Este caso obriga a aplicar {activeTopic.title.toLowerCase()} em contexto.
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Temas relacionados */}
            <div
              style={{
                background: "var(--color-surface)",
                border: "var(--border-default)",
                borderRadius: "var(--radius-xl)",
                padding: "var(--space-xl)",
              }}
            >
              <p className="text-label" style={{ color: "var(--color-info)" }}>Temas relacionados</p>
              <div
                className="grid md:grid-cols-2"
                style={{ marginTop: "var(--space-md)", gap: "var(--space-sm)" }}
              >
                {relatedTopics.map((topic) => (
                  <Link
                    key={topic.id}
                    href={`/aprender?topic=${topic.id}`}
                    className="card card-clickable"
                  >
                    <p style={{ fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)" }}>
                      {topic.title}
                    </p>
                    <p className="text-body" style={{ marginTop: "var(--space-xs)" }}>
                      Dificuldade {topicDifficultyLabel(topic.pedagogicalDifficulty).toLowerCase()}.
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
