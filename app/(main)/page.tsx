"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { InfoBanner } from "@/components/InfoBanner";

const PRIVACY_BANNER_KEY = "privacy-banner-dismissed";

export default function HomePage() {
  const [showPrivacyBanner, setShowPrivacyBanner] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(PRIVACY_BANNER_KEY)) {
      setShowPrivacyBanner(true);
    }
  }, []);

  function dismissPrivacyBanner() {
    localStorage.setItem(PRIVACY_BANNER_KEY, "1");
    setShowPrivacyBanner(false);
  }

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        padding: "var(--space-2xl)",
        gap: "var(--space-2xl)",
      }}
    >
      {/* Título separado do painel */}
      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-sm)" }}>
        <span className="text-label">Enfermagem clínica</span>
        <h1
          style={{
            fontSize: "var(--text-h1)",
            fontWeight: "var(--weight-medium)",
            color: "var(--color-text-primary)",
            lineHeight: "var(--leading-tight)",
          }}
        >
          Simulador de Feridas
        </h1>
        <p
          style={{
            fontSize: "var(--text-body)",
            color: "var(--color-text-secondary)",
            lineHeight: "var(--leading-loose)",
            maxWidth: "480px",
          }}
        >
          Treino clínico interativo para estudantes de enfermagem. Observa, decide e recebe feedback
          imediato sobre o teu plano terapêutico.
        </p>
      </div>

      {/* Disclaimer pedagógico — centro do flow */}
      <InfoBanner variant="info">
        Ferramenta de treino clínico. Não substitui decisão clínica real nem é usada para classificação.
      </InfoBanner>

      {/* Aviso de privacidade — canto inferior direito, visível apenas na primeira visita */}
      {showPrivacyBanner && (
        <div style={{ position: "fixed", bottom: "calc(var(--space-md) * 2 + 1.5rem)", right: "var(--space-lg)", zIndex: 50, maxWidth: "320px", display: "flex", alignItems: "flex-start", gap: "var(--space-sm)" }}>
          <InfoBanner variant="success">
            Os teus dados ficam guardados apenas no teu browser (localStorage). Nada é enviado para servidores externos.
          </InfoBanner>
          <button
            type="button"
            onClick={dismissPrivacyBanner}
            aria-label="Fechar aviso"
            style={{ flexShrink: 0, background: "none", border: "none", cursor: "pointer", color: "var(--color-text-secondary)", fontSize: "var(--text-body)", lineHeight: 1, padding: "var(--space-xs)" }}
          >
            ×
          </button>
        </div>
      )}

      {/* Painel com os 3 cartões */}
      <div
        style={{
          maxWidth: "960px",
          width: "100%",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "var(--space-lg)",
        }}
      >
        {[
          {
            href: "/casos",
            eyebrow: "Praticar",
            label: "Casos",
            description: "Resolve cenários clínicos reais. Seleciona observações, materiais e técnica — e recebe pontuação detalhada com justificação clínica.",
            accentColor: "var(--color-accent)",
            accentBg: "var(--color-accent-subtle)",
          },
          {
            href: "/aprender",
            eyebrow: "Estudar",
            label: "Aprender",
            description: "Biblioteca de temas clínicos: tecidos, exsudado, infeção, desbridamento e mais. Com tabelas, alertas e conceitos-chave.",
            accentColor: "var(--color-info)",
            accentBg: "var(--color-info-subtle)",
          },
          {
            href: "/historico",
            eyebrow: "Acompanhar",
            label: "Histórico",
            description: "Consulta todas as tuas tentativas anteriores, evolução da pontuação e temas recomendados para reforço.",
            accentColor: "var(--color-success)",
            accentBg: "var(--color-success-subtle)",
          },
        ].map(({ href, eyebrow, label, description, accentColor, accentBg }) => (
          <Link
            key={href}
            href={href}
            className="card card-clickable"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-md)",
              padding: "var(--space-2xl)",
              borderRadius: "var(--radius-xl)",
              borderLeft: `2px solid ${accentColor}`,
              textDecoration: "none",
            }}
          >
            <span
              style={{
                display: "inline-block",
                fontSize: "var(--text-badge)",
                fontWeight: "var(--weight-medium)",
                letterSpacing: "var(--tracking-label)",
                textTransform: "uppercase",
                color: accentColor,
                background: accentBg,
                padding: "3px 8px",
                borderRadius: "var(--radius-xs)",
                alignSelf: "flex-start",
              }}
            >
              {eyebrow}
            </span>
            <span
              style={{
                fontSize: "var(--text-h2)",
                fontWeight: "var(--weight-medium)",
                color: "var(--color-text-primary)",
              }}
            >
              {label}
            </span>
            <span
              style={{
                fontSize: "var(--text-body)",
                color: "var(--color-text-secondary)",
                lineHeight: "var(--leading-loose)",
              }}
            >
              {description}
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
