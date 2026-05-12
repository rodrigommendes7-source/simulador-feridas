import Link from "next/link";
import {
  obterEvidencia,
  obterTema,
  obterCasosRelacionadosComTema,
  obterTratamentosParaTema,
  listarTemas,
} from "@/lib/clinico/indice";

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
  const topics = listarTemas();
  const topicParam = Array.isArray(resolvedSearchParams.topic)
    ? resolvedSearchParams.topic[0]
    : resolvedSearchParams.topic;
  const sourceParam = Array.isArray(resolvedSearchParams.source)
    ? resolvedSearchParams.source[0]
    : resolvedSearchParams.source;
  const reasonParam = Array.isArray(resolvedSearchParams.motivo)
    ? resolvedSearchParams.motivo[0]
    : resolvedSearchParams.motivo;
  const activeTopic = topics.find((topic) => topic.id === topicParam) ?? topics[0];
  const relatedTreatments = obterTratamentosParaTema(activeTopic.id);
  const relatedCases = obterCasosRelacionadosComTema(activeTopic.id);
  const relatedTopics = activeTopic.idsTopicoRelacionado
    .map((topicId) => obterTema(topicId))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <main className="grid lg:grid-cols-[280px_1fr]" style={{ gap: "var(--space-2xl)", height: "100%" }}>

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
              {topic.titulo}
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
              {topicDifficultyLabel(activeTopic.dificuldade)}
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
            {activeTopic.titulo}
          </h1>
          <p className="text-body" style={{ marginTop: "var(--space-md)", maxWidth: "64rem" }}>
            {capitalizeSentence(activeTopic.definicao)}
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

          {activeTopic.conceitosChave && activeTopic.conceitosChave.length > 0 && (
            <div
              style={{
                marginTop: "var(--space-xl)",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "var(--space-sm)",
              }}
            >
              {activeTopic.conceitosChave.map((concept) => (
                <div
                  key={concept.id}
                  style={{
                    background: "var(--color-elevated)",
                    border: "var(--border-default)",
                    borderRadius: "var(--radius-md)",
                    padding: "var(--space-md)",
                  }}
                >
                  <p className="text-label" style={{ color: "var(--color-accent)" }}>
                    {concept.titulo}
                  </p>
                  <p className="text-body" style={{ marginTop: "var(--space-xs)" }}>
                    {concept.corpo}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tabelas clínicas */}
        {activeTopic.tabelas && activeTopic.tabelas.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
            {activeTopic.tabelas.map((table) => (
              <div
                key={table.id}
                style={{
                  background: "var(--color-surface)",
                  border: "var(--border-default)",
                  borderRadius: "var(--radius-xl)",
                  padding: "var(--space-xl)",
                }}
              >
                <p className="text-label" style={{ color: "var(--color-warning)" }}>
                  {table.titulo}
                </p>
                {table.descricao && (
                  <p
                    className="text-body"
                    style={{ marginTop: "var(--space-xs)", color: "var(--color-text-secondary)" }}
                  >
                    {table.descricao}
                  </p>
                )}
                <div style={{ marginTop: "var(--space-md)", overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--text-body)" }}>
                    <thead>
                      <tr>
                        {table.cabecalhos.map((header) => (
                          <th
                            key={header}
                            style={{
                              textAlign: "left",
                              padding: "var(--space-xs) var(--space-sm)",
                              borderBottom: "var(--border-default)",
                              color: "var(--color-accent)",
                              fontWeight: "var(--weight-medium)",
                              fontSize: "var(--text-label)",
                              textTransform: "uppercase",
                              letterSpacing: "var(--tracking-label)",
                            }}
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {table.linhas.map((row, rowIdx) => (
                        <tr key={rowIdx}>
                          {row.celulas.map((cell, cellIdx) => (
                            <td
                              key={cellIdx}
                              style={{
                                padding: "var(--space-xs) var(--space-sm)",
                                borderBottom: "var(--border-default)",
                                verticalAlign: "top",
                                color: cellIdx === 0 ? "var(--color-text-primary)" : "var(--color-text-secondary)",
                                fontWeight: cellIdx === 0 ? "var(--weight-medium)" : "normal",
                              }}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Alertas clínicos */}
        {activeTopic.alertas && activeTopic.alertas.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
            {activeTopic.alertas.map((alert) => {
              const severityColor =
                alert.gravidade === "critico"
                  ? "var(--color-error)"
                  : alert.gravidade === "aviso"
                  ? "var(--color-warning)"
                  : "var(--color-info)";
              return (
                <div
                  key={alert.id}
                  style={{
                    background: "var(--color-surface)",
                    border: "var(--border-default)",
                    borderLeft: `4px solid ${severityColor}`,
                    borderRadius: "var(--radius-md)",
                    padding: "var(--space-md)",
                  }}
                >
                  <p className="text-label" style={{ color: severityColor }}>
                    {alert.titulo}
                  </p>
                  <p className="text-body" style={{ marginTop: "var(--space-xs)" }}>
                    {alert.corpo}
                  </p>
                </div>
              );
            })}
          </div>
        )}

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
              {activeTopic.indicacoes.map((item) => (
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
              {activeTopic.avisos_contraindicacao.map((item) => (
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
              {activeTopic.sinais_alerta.map((item) => (
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
              {activeTopic.erros_comuns.map((mistake) => (
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
                    {capitalizeSentence(mistake.titulo)}
                  </p>
                  <p className="text-body" style={{ marginTop: "var(--space-xs)" }}>
                    {capitalizeSentence(mistake.explicacao)}
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
                        {treatment.rotulo}
                      </p>
                      {treatment.etiquetas.length > 0 && (
                        <p className="text-caption" style={{ marginTop: "2px" }}>
                          {treatment.etiquetas.map(capitalizeSentence).join(" · ")}
                        </p>
                      )}
                    </div>
                    {/* Linha 2: indicações + contraindicações */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                      <p className="text-body" style={{ fontSize: "var(--text-label)" }}>
                        {treatment.indicacoes.slice(0, 2).map(capitalizeSentence).join(". ")}.
                      </p>
                      {treatment.avisos_contraindicacao.length > 0 && (
                        <p
                          className="text-body"
                          style={{ fontSize: "var(--text-label)", color: "var(--color-text-disabled)" }}
                        >
                          Evitar: {treatment.avisos_contraindicacao.slice(0, 2).map(capitalizeSentence).join(", ")}.
                        </p>
                      )}
                    </div>
                    {/* Links de evidência */}
                    {treatment.refsEvidencia.length > 0 && (
                      <div
                        style={{
                          borderTop: "var(--border-default)",
                          paddingTop: "var(--space-xs)",
                          display: "flex",
                          flexDirection: "column",
                          gap: "2px",
                        }}
                      >
                        {treatment.refsEvidencia.map((evidenceId) => {
                          const evidence = obterEvidencia(evidenceId);
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
                              {evidence.titulo}
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
                        {caseItem.tituloAbreviado}
                      </p>
                      <span className={caseDifficultyBadgeClass(caseItem.dificuldade)}>
                        {caseDifficultyLabel(caseItem.dificuldade)}
                      </span>
                    </div>
                    <p className="text-body" style={{ marginTop: "var(--space-xs)" }}>
                      {capitalizeSentence(caseItem.titulo)}
                    </p>
                    <p
                      className="text-label"
                      style={{ marginTop: "var(--space-sm)", color: "var(--color-warning)" }}
                    >
                      Treina {activeTopic.titulo.toLowerCase()} neste contexto clínico.
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
                      {topic.titulo}
                    </p>
                    <p className="text-body" style={{ marginTop: "var(--space-xs)" }}>
                      Dificuldade {topicDifficultyLabel(topic.dificuldade).toLowerCase()}.
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
