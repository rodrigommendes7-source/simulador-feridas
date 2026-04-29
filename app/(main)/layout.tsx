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

      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "var(--page-padding-y) var(--page-padding-x)", display: "flex", flexDirection: "column" }}>
        {children}
      </div>


    </div>
  );
}
