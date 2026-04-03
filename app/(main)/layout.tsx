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
      <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <Link href="/" className="text-sm font-black uppercase tracking-[0.26em] text-white">
              Simulador de Feridas
            </Link>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">
              Aprendizagem clínica orientada pelo progresso
            </p>
          </div>
          <nav className="flex flex-wrap gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-sky-400 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</div>
    </div>
  );
}
