"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/casos", rotulo: "Resolver casos" },
  { href: "/aprender", rotulo: "Aprender" },
  { href: "/historico", rotulo: "Histórico" },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-xs)" }}>
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className="nav-link"
            style={
              isActive
                ? { color: "var(--color-accent)", fontWeight: "var(--weight-medium)", background: "var(--color-elevated)" }
                  : { color: "var(--color-text-secondary)", transition: "color var(--transition-fast)" }
            }
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = "var(--color-text-primary)"; }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = "var(--color-text-secondary)"; }}
          >
            {item.rotulo}
          </Link>
        );
      })}
    </nav>
  );
}
