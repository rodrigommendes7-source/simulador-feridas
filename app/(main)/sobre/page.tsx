import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sobre",
};

export default function SobrePage() {
  return (
    <main style={{ maxWidth: "720px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "var(--space-2xl)" }}>
      <div>
        <p className="text-label" style={{ color: "var(--color-accent)" }}>Projeto</p>
        <h1 style={{ marginTop: "var(--space-sm)", fontSize: "var(--text-h1)", fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)" }}>
          Sobre o Simulador
        </h1>
        <p className="text-body" style={{ marginTop: "var(--space-sm)", color: "var(--color-text-secondary)" }}>
          Ferramenta pedagógica de acesso livre para estudantes e profissionais de saúde.
        </p>
      </div>

      <section className="card" style={{ padding: "var(--space-xl)", display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>

        <div>
          <h2 style={{ fontSize: "var(--text-h2)", fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)" }}>O que é</h2>
          <p className="text-body" style={{ marginTop: "var(--space-sm)" }}>
            O Simulador de Feridas é uma plataforma digital de treino clínico interativo, criada para apoiar a aprendizagem de estudantes de enfermagem e outros profissionais de saúde. Apresenta casos clínicos fictícios com o objetivo de desenvolver competências de raciocínio clínico no domínio do tratamento de feridas.
          </p>
          <p className="text-body" style={{ marginTop: "var(--space-sm)" }}>
            O utilizador observa a ferida, seleciona as intervenções que considera adequadas e recebe feedback imediato com justificação clínica baseada em evidência. Não é necessário criar conta — tudo funciona no browser, de forma anónima.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: "var(--text-h2)", fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)" }}>Para quem</h2>
          <ul style={{ marginTop: "var(--space-sm)", paddingLeft: "var(--space-lg)", display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
            {[
              "Estudantes de enfermagem e de outras áreas da saúde",
              "Docentes e formadores em ciências da saúde",
              "Profissionais de saúde que pretendam rever conteúdos de forma autónoma",
            ].map((item) => (
              <li key={item} className="text-body">{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 style={{ fontSize: "var(--text-h2)", fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)" }}>Aviso clínico</h2>
          <div style={{ marginTop: "var(--space-sm)", background: "var(--color-error-subtle)", border: "0.5px solid var(--color-error-border)", borderRadius: "var(--radius-md)", padding: "var(--space-md)" }}>
            <p className="text-body" style={{ color: "var(--color-error)", fontWeight: "var(--weight-medium)" }}>
              Esta ferramenta não é um dispositivo médico e não deve ser usada para fundamentar decisões clínicas reais. Os casos, tratamentos e pontuações são ficcionais e têm fins exclusivamente pedagógicos.
            </p>
          </div>
        </div>

        <div>
          <h2 style={{ fontSize: "var(--text-h2)", fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)" }}>Imagens</h2>
          <p className="text-body" style={{ marginTop: "var(--space-sm)" }}>
            As imagens clínicas utilizadas provêm da <strong>Medetec Medical Images</strong>, um banco de imagens médicas de uso gratuito para fins educativos. Cada imagem é atribuída como: <em>© Medetec Medical Images — medetec.co.uk</em>.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: "var(--text-h2)", fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)" }}>Contacto</h2>
          <p className="text-body" style={{ marginTop: "var(--space-sm)" }}>
            Para comunicar erros clínicos, inconsistências, questões sobre os termos legais ou qualquer outro assunto relacionado com a plataforma, pode enviar um email para:
          </p>
          <p className="text-body" style={{ marginTop: "var(--space-sm)" }}>
            <a
              href="mailto:rodrigommendes7@gmail.com"
              style={{ color: "var(--color-info)", textDecoration: "underline" }}
            >
              rodrigommendes7@gmail.com
            </a>
          </p>
        </div>

      </section>

      <div style={{ display: "flex", gap: "var(--space-md)", flexWrap: "wrap" }}>
        <Link href="/termos" className="btn btn-secondary">Termos de Utilização</Link>
        <Link href="/privacidade" className="btn btn-secondary">Política de Privacidade</Link>
        <Link href="/" className="btn btn-ghost">Voltar ao início</Link>
      </div>
    </main>
  );
}
