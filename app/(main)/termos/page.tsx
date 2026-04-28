import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Termos de Utilização",
};

export default function TermosPage() {
  return (
    <main style={{ maxWidth: "720px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "var(--space-2xl)" }}>
      <div>
        <p className="text-label" style={{ color: "var(--color-accent)" }}>Legal</p>
        <h1 style={{ marginTop: "var(--space-sm)", fontSize: "var(--text-h1)", fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)" }}>
          Termos de Utilização
        </h1>
        <p className="text-body" style={{ marginTop: "var(--space-sm)", color: "var(--color-text-secondary)" }}>
          Última atualização: abril de 2026 · Versão 1.1
        </p>
      </div>

      <section className="card" style={{ padding: "var(--space-xl)", display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>

        <div>
          <h2 style={{ fontSize: "var(--text-h2)", fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)" }}>1. Finalidade e âmbito</h2>
          <p className="text-body" style={{ marginTop: "var(--space-sm)" }}>
            O Simulador de Feridas é uma ferramenta pedagógica digital destinada exclusivamente ao apoio à aprendizagem de estudantes e profissionais de saúde em contexto educativo. O simulador reproduz cenários clínicos fictícios com o objetivo de desenvolver competências de raciocínio clínico no tratamento de feridas.
          </p>
          <div style={{ marginTop: "var(--space-md)", background: "var(--color-error-subtle)", border: "0.5px solid var(--color-error-border)", borderRadius: "var(--radius-md)", padding: "var(--space-md)" }}>
            <p className="text-body" style={{ color: "var(--color-error)", fontWeight: "var(--weight-medium)" }}>
              Este simulador não é um dispositivo médico, não constitui apoio à decisão clínica e não deve ser utilizado para fundamentar qualquer decisão em contexto de prestação de cuidados reais a doentes.
            </p>
          </div>
        </div>

        <div>
          <h2 style={{ fontSize: "var(--text-h2)", fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)" }}>2. Utilizadores a quem se destina</h2>
          <p className="text-body" style={{ marginTop: "var(--space-sm)" }}>O acesso destina-se a:</p>
          <ul style={{ marginTop: "var(--space-sm)", paddingLeft: "var(--space-lg)", display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
            {["Estudantes de enfermagem e de outras áreas da saúde", "Docentes e formadores em ciências da saúde", "Profissionais de saúde que pretendam rever conteúdos de forma autónoma"].map((item) => (
              <li key={item} className="text-body">{item}</li>
            ))}
          </ul>
          <p className="text-body" style={{ marginTop: "var(--space-sm)" }}>
            A plataforma é de acesso livre e anónimo. Não é necessário criar conta nem fornecer qualquer dado pessoal.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: "var(--text-h2)", fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)" }}>3. Aviso clínico obrigatório</h2>
          <div style={{ marginTop: "var(--space-sm)", background: "var(--color-warning-subtle)", border: "0.5px solid var(--color-warning-border)", borderRadius: "var(--radius-md)", padding: "var(--space-md)" }}>
            <p className="text-body" style={{ color: "var(--color-warning)" }}>
              Os casos clínicos, tratamentos, pontuações e feedback apresentados neste simulador são ficcionais e têm fins exclusivamente pedagógicos. Não refletem protocolos institucionais, não substituem a orientação de profissionais de saúde habilitados e não devem ser aplicados diretamente na prática clínica.
            </p>
          </div>
          <p className="text-body" style={{ marginTop: "var(--space-sm)" }}>
            O desempenho obtido no simulador não avalia competência clínica real. A lógica de avaliação é uma simplificação pedagógica da complexidade clínica real.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: "var(--text-h2)", fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)" }}>4. Dados armazenados localmente</h2>
          <p className="text-body" style={{ marginTop: "var(--space-sm)" }}>
            A plataforma não recolhe nem transmite dados pessoais. O progresso, pontuações e preferências são guardados exclusivamente no próprio dispositivo, através do localStorage do browser. Estes dados:
          </p>
          <ul style={{ marginTop: "var(--space-sm)", paddingLeft: "var(--space-lg)", display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
            {[
              "Nunca são enviados para servidores externos",
              "Não estão associados a qualquer identidade pessoal",
              "Podem ser eliminados limpando os dados do site nas definições do browser",
              "São perdidos se o utilizador limpar os dados do browser ou aceder de outro dispositivo",
            ].map((item) => (
              <li key={item} className="text-body">{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 style={{ fontSize: "var(--text-h2)", fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)" }}>5. Imagens utilizadas</h2>
          <p className="text-body" style={{ marginTop: "var(--space-sm)" }}>
            As imagens clínicas utilizadas provêm da <strong>Medetec Medical Images</strong>, um banco de imagens médicas de uso gratuito para fins educativos e pedagógicos. Cada imagem é claramente atribuída: <em>© Medetec Medical Images — medetec.co.uk</em>.
          </p>
          <p className="text-body" style={{ marginTop: "var(--space-sm)" }}>
            O uso está em conformidade com os termos de licença do Medetec para fins educativos não comerciais. As imagens servem exclusivamente para fins de aprendizagem e nunca devem ser utilizadas para fins comerciais fora deste contexto sem autorização explícita.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: "var(--text-h2)", fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)" }}>6. Propriedade intelectual</h2>
          <p className="text-body" style={{ marginTop: "var(--space-sm)" }}>
            O conteúdo clínico, os casos simulados, a lógica de avaliação e o código desta plataforma são propriedade do autor, salvo indicação em contrário. As referências bibliográficas e evidências científicas citadas pertencem aos respetivos autores e publicações.
          </p>
          <p className="text-body" style={{ marginTop: "var(--space-sm)" }}>
            É proibida a reprodução, distribuição ou adaptação do conteúdo para fins comerciais sem autorização expressa e escrita do autor. O uso em contexto académico não comercial é permitido desde que devidamente citado.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: "var(--text-h2)", fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)" }}>7. Limitação de responsabilidade</h2>
          <p className="text-body" style={{ marginTop: "var(--space-sm)" }}>
            A plataforma é disponibilizada <em>as is</em>, sem garantias de disponibilidade contínua, ausência de erros ou adequação a fins específicos. O responsável pela plataforma não é responsável por quaisquer danos — diretos, indiretos ou consequentes — resultantes do uso da plataforma, incluindo decisões tomadas com base nos conteúdos apresentados.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: "var(--text-h2)", fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)" }}>8. Comunicação de erros clínicos</h2>
          <p className="text-body" style={{ marginTop: "var(--space-sm)" }}>
            O rigor clínico é uma prioridade. Se identificar um erro, inconsistência ou comportamento inesperado com impacto clínico, é encorajado a comunicá-lo através do endereço de contacto disponível na página{" "}
            <Link href="/sobre" style={{ color: "var(--color-info)", textDecoration: "underline" }}>Sobre</Link>.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: "var(--text-h2)", fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)" }}>9. Lei aplicável</h2>
          <p className="text-body" style={{ marginTop: "var(--space-sm)" }}>
            Estes Termos são regidos pela lei portuguesa. Qualquer litígio será submetido à jurisdição dos tribunais competentes em Portugal.
          </p>
        </div>

      </section>

      <div style={{ display: "flex", gap: "var(--space-md)", flexWrap: "wrap" }}>
        <Link href="/privacidade" className="btn btn-secondary">Política de Privacidade</Link>
        <Link href="/" className="btn btn-ghost">Voltar ao início</Link>
      </div>
    </main>
  );
}
