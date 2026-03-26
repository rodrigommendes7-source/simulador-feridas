"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0a0f1e] px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#60a5fa]">
            Simulador clínico
          </p>
          <h1 className="mb-4 text-5xl font-bold text-white lg:text-6xl">
            Tratamento de Feridas
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-[#94a3b8]">
            Plataforma educativa para treinar observação, diálogo com o utente
            e decisão clínica fundamentada.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Link
            href="/casos"
            className="group rounded-2xl border border-[#1e293b] bg-[#0f172a] p-8 transition hover:border-[#3b82f6] hover:bg-[#1e293b]"
          >
            <div className="mb-4 inline-flex rounded-lg bg-[#1e40af] p-3">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="mb-2 text-2xl font-semibold text-white">Resolver Casos</h2>
            <p className="text-sm leading-relaxed text-[#64748b]">
              Casos clínicos reais para treino de decisão terapêutica.
            </p>
          </Link>

          <Link
            href="/aprender"
            className="group rounded-2xl border border-[#1e293b] bg-[#0f172a] p-8 transition hover:border-[#3b82f6] hover:bg-[#1e293b]"
          >
            <div className="mb-4 inline-flex rounded-lg bg-[#1e40af] p-3">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="mb-2 text-2xl font-semibold text-white">Aprender</h2>
            <p className="text-sm leading-relaxed text-[#64748b]">
              Material de apoio sobre seleção de tratamentos.
            </p>
          </Link>

          <Link
            href="/historico"
            className="group rounded-2xl border border-[#1e293b] bg-[#0f172a] p-8 transition hover:border-[#3b82f6] hover:bg-[#1e293b]"
          >
            <div className="mb-4 inline-flex rounded-lg bg-[#1e40af] p-3">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="mb-2 text-2xl font-semibold text-white">Histórico</h2>
            <p className="text-sm leading-relaxed text-[#64748b]">
              Registo das tuas resoluções e evolução.
            </p>
          </Link>
        </div>

        <div className="mt-12 rounded-2xl border border-[#1e293b] bg-[#0f172a] p-8">
          <p className="text-sm leading-relaxed text-[#64748b]">
            Criado no âmbito do <span className="text-white">Ensino Clínico de Consolidação de Competências</span> da
            Licenciatura em Enfermagem da <span className="text-white">Escola Superior de Saúde da Universidade dos Açores</span>,
            no Departamento de Enfermagem, Saúde Mental e Gerontologia,
            pelo estudante <span className="text-white">Rodrigo Marques Mendes</span>.
          </p>
        </div>
      </div>
    </main>
  );
}