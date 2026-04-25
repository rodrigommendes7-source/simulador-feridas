import Link from "next/link";
import { MainNav } from "@/components/main-nav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <header className="nav" style={{ flexShrink: 0 }}>
        <Link href="/" className="text-h3" style={{ display: "block" }}>
          Simulador de Feridas
        </Link>
        <MainNav />
      </header>

      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "var(--space-lg) var(--space-2xl)" }}>
        {children}
      </div>

      <footer style={{ flexShrink: 0, borderTopWidth: "0.5px", borderTopStyle: "solid", borderTopColor: "var(--color-border)", padding: "var(--space-md) var(--space-2xl)", display: "flex", flexWrap: "wrap", gap: "var(--space-md)", alignItems: "center", justifyContent: "space-between" }}>
        <span className="text-label" style={{ color: "var(--color-text-tertiary)" }}>
          Simulador de Feridas · Uso pedagógico
        </span>
        <nav style={{ display: "flex", gap: "var(--space-md)" }}>
          {[
            { href: "/sobre", label: "Sobre" },
            { href: "/termos", label: "Termos" },
            { href: "/privacidade", label: "Privacidade" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-label"
              style={{ color: "var(--color-text-tertiary)", textDecoration: "none" }}
            >
              {label}
            </Link>
          ))}
        </nav>
      </footer>
    </div>
  );
}
