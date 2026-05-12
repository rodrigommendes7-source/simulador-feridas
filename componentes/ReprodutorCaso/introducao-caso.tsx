import type { ModeloCaso } from "@/lib/clinico/indice";
import { InfoBanner } from "@/componentes/InfoBanner";

export function IntroducaoCaso({
  modelo,
  aoIniciar,
}: {
  modelo: ModeloCaso;
  aoIniciar: () => void;
}) {
  return (
    <div
      className="card"
      style={{
        textAlign: "center",
        padding: "var(--space-3xl)",
        maxWidth: "48rem",
        margin: "var(--space-3xl) auto",
      }}
    >
      <p className="text-label" style={{ color: "var(--color-accent)" }}>
        Caso clínico
      </p>
      <h1
        style={{
          marginTop: "var(--space-sm)",
          fontSize: "var(--text-h1)",
          fontWeight: "var(--weight-medium)",
          color: "var(--color-text-primary)",
        }}
      >
        {modelo.tituloAbreviado} · {modelo.titulo}
      </h1>
      <p
        className="text-body"
        style={{ marginTop: "var(--space-md)", maxWidth: "40rem", margin: "var(--space-md) auto 0" }}
      >
        {modelo.resumoIntro}
      </p>

      <div className="card" style={{ textAlign: "left", marginTop: "var(--space-lg)" }}>
        <p className="text-label" style={{ color: "var(--color-warning)" }}>
          Contexto clínico
        </p>
        <p className="text-body" style={{ marginTop: "var(--space-sm)" }}>
          {modelo.contextoPaciente}
        </p>
      </div>

      <div className="card" style={{ textAlign: "left", marginTop: "var(--space-md)" }}>
        <p className="text-label" style={{ color: "var(--color-info)" }}>
          Objetivo
        </p>
        <p className="text-body" style={{ marginTop: "var(--space-sm)" }}>
          {modelo.objetivo}
        </p>
      </div>

      <div style={{ marginTop: "var(--space-lg)", display: "flex", justifyContent: "center" }}>
        <InfoBanner variant="info">
          Ferramenta de treino clínico. Não substitui decisão clínica real nem é usada para classificação.
        </InfoBanner>
      </div>

      <button
        type="button"
        onClick={aoIniciar}
        className="btn btn-primary"
        style={{ marginTop: "var(--space-lg)" }}
      >
        Iniciar caso
      </button>
    </div>
  );
}
