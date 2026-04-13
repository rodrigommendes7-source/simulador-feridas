import Link from "next/link";

const navItems = [
  { href: "/casos", label: "Resolver casos" },
  { href: "/aprender", label: "Aprender" },
  { href: "/historico", label: "Histórico" },
];

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <header className="nav">
        <div>
          <Link href="/" className="text-h3" style={{ display: "block" }}>
            Simulador de Feridas
          </Link>
          <p className="text-caption" style={{ marginTop: "2px" }}>
            Aprendizagem clínica orientada pelo progresso
          </p>
        </div>
        <nav style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-xs)" }}>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="nav-link">
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <div style={{ padding: "var(--space-3xl) var(--space-2xl)" }}>
        {children}
      </div>
    </div>
  );
}
