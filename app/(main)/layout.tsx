"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
  const pathname = usePathname();

  return (
    <div className="min-h-screen">
      <header className="nav">
        <Link href="/" className="text-h3" style={{ display: "block" }}>
          Simulador de Feridas
        </Link>
        <nav style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-xs)" }}>
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className="nav-link"
                style={
                  isActive
                    ? {
                        color: "var(--color-accent)",
                        fontWeight: "var(--weight-medium)",
                        background: "var(--color-elevated)",
                      }
                    : undefined
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <div style={{ padding: "var(--space-3xl) var(--space-2xl)" }}>
        {children}
      </div>
    </div>
  );
}
