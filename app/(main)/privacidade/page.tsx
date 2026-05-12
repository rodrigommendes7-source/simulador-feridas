import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidade",
};

export default function PrivacidadePage() {
  return (
    <main style={{ maxWidth: "720px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "var(--space-2xl)" }}>
      <div>
        <p className="text-label" style={{ color: "var(--color-accent)" }}>Legal</p>
        <h1 style={{ marginTop: "var(--space-sm)", fontSize: "var(--text-h1)", fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)" }}>
          Política de Privacidade
        </h1>
        <p className="text-body" style={{ marginTop: "var(--space-sm)", color: "var(--color-text-secondary)" }}>
          Última atualização: abril de 2026 · Versão 1.1
        </p>
      </div>

      <section className="card" style={{ padding: "var(--space-xl)", display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>

        <div>
          <h2 style={{ fontSize: "var(--text-h2)", fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)" }}>1. Identidade do responsável</h2>
          <p className="text-body" style={{ marginTop: "var(--space-sm)" }}>
            Esta plataforma é desenvolvida e mantida a título individual pelo seu autor, no âmbito de um projeto de carácter académico e pedagógico sem fins lucrativos. Para contacto, consulte a página{" "}
            <Link href="/sobre" style={{ color: "var(--color-info)", textDecoration: "underline" }}>Sobre</Link>.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: "var(--text-h2)", fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)" }}>2. Dados recolhidos</h2>
          <div style={{ marginTop: "var(--space-sm)", background: "var(--color-success-subtle)", border: "0.5px solid var(--color-success-border)", borderRadius: "var(--radius-md)", padding: "var(--space-md)" }}>
            <p className="text-body" style={{ color: "var(--color-success)", fontWeight: "var(--weight-medium)" }}>
              Esta plataforma não recolhe, não armazena nem transmite qualquer dado pessoal para servidores externos.
            </p>
          </div>
          <p className="text-body" style={{ marginTop: "var(--space-sm)" }}>
            Não existe registo de utilizadores, não é necessário criar conta e não são utilizados cookies de rastreamento, ferramentas de análise de comportamento (como Google Analytics) nem publicidade.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: "var(--text-h2)", fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)" }}>3. Dados armazenados localmente (localStorage)</h2>
          <p className="text-body" style={{ marginTop: "var(--space-sm)" }}>
            O progresso do utilizador — nomeadamente as tentativas de resolução de casos clínicos e as respetivas pontuações — é guardado exclusivamente no próprio dispositivo, através do mecanismo <em>localStorage</em> do browser. Estes dados:
          </p>
          <ul style={{ marginTop: "var(--space-sm)", paddingLeft: "var(--space-lg)", display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
            {[
              "Nunca são enviados para servidores externos",
              "Não estão associados a qualquer identidade pessoal ou endereço IP",
              "Não são partilhados com terceiros",
              "São perdidos se o utilizador limpar os dados do browser ou aceder de outro dispositivo",
              "Podem ser eliminados a qualquer momento nas definições do browser (Definições → Privacidade → Limpar dados do site)",
            ].map((item) => (
              <li key={item} className="text-body">{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 style={{ fontSize: "var(--text-h2)", fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)" }}>4. Cookies</h2>
          <p className="text-body" style={{ marginTop: "var(--space-sm)" }}>
            Esta plataforma não utiliza cookies de sessão, de rastreamento, de análise nem de publicidade. O único mecanismo de persistência utilizado é o <em>localStorage</em>, descrito na secção anterior, que é diferente dos cookies e não é transmitido automaticamente em pedidos HTTP.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: "var(--text-h2)", fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)" }}>5. Serviços de terceiros</h2>
          <p className="text-body" style={{ marginTop: "var(--space-sm)" }}>
            A plataforma pode carregar fontes tipográficas do Google Fonts (fonts.googleapis.com / fonts.gstatic.com), o que implica um pedido HTTP ao servidor da Google aquando do carregamento da página. Este pedido pode revelar o endereço IP do utilizador à Google, de acordo com a{" "}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-info)", textDecoration: "underline" }}>Política de Privacidade da Google</a>.
            Não são utilizados quaisquer outros serviços de terceiros.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: "var(--text-h2)", fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)" }}>6. Direitos do utilizador (RGPD)</h2>
          <p className="text-body" style={{ marginTop: "var(--space-sm)" }}>
            Dado que esta plataforma não recolhe nem processa dados pessoais identificáveis, os direitos de acesso, retificação, apagamento, portabilidade e oposição previstos no Regulamento Geral sobre a Proteção de Dados (RGPD) não são aplicáveis neste contexto.
          </p>
          <p className="text-body" style={{ marginTop: "var(--space-sm)" }}>
            O utilizador tem controlo total sobre os dados locais armazenados no seu dispositivo e pode eliminá-los a qualquer momento.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: "var(--text-h2)", fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)" }}>7. Segurança</h2>
          <p className="text-body" style={{ marginTop: "var(--space-sm)" }}>
            A plataforma é servida exclusivamente via HTTPS. São aplicados cabeçalhos de segurança HTTP que incluem Content-Security-Policy, X-Frame-Options, X-Content-Type-Options e Referrer-Policy, com o objetivo de proteger os utilizadores contra ataques comuns de injeção e rastreamento.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: "var(--text-h2)", fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)" }}>8. Alterações a esta política</h2>
          <p className="text-body" style={{ marginTop: "var(--space-sm)" }}>
            Esta política pode ser atualizada para refletir alterações técnicas ou legais. A data de última atualização é sempre indicada no topo da página. O uso continuado da plataforma após uma atualização implica a aceitação da nova versão.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: "var(--text-h2)", fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)" }}>9. Contacto</h2>
          <p className="text-body" style={{ marginTop: "var(--space-sm)" }}>
            Para questões relacionadas com privacidade ou proteção de dados, utilize o endereço de contacto disponível na página{" "}
            <Link href="/sobre" style={{ color: "var(--color-info)", textDecoration: "underline" }}>Sobre</Link>.
          </p>
        </div>

      </section>

      <div style={{ display: "flex", gap: "var(--space-md)", flexWrap: "wrap" }}>
        <Link href="/termos" className="btn btn-secondary">Termos de Utilização</Link>
        <Link href="/" className="btn btn-ghost">Voltar ao início</Link>
      </div>
    </main>
  );
}
