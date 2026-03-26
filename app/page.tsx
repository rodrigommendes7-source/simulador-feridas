"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#04122b] px-6 py-10 text-white">
      <div className="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-[1.15fr_0.9fr]">
        <section className="rounded-[36px] border border-[#243b63] bg-[#0a1834] p-8 shadow-2xl">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-[#3b82f6]">
            Simulador clínico
          </p>

          <h1 className="mt-4 text-5xl font-black leading-tight text-white">
            Simulador de
            <br />
            Tratamento de Feridas
          </h1>

          <p className="mt-6 max-w-2xl text-xl leading-relaxed text-[#dbeafe]">
            Plataforma educativa para treinar observação da ferida, diálogo com o
            utente, seleção de tratamento e avaliação final da decisão clínica.
          </p>

          <div className="mt-8 rounded-[24px] border border-[#243b63] bg-[#0d1d3d] p-5">
            <p className="text-lg leading-relaxed text-white">
              Este simulador foi criado no âmbito do{" "}
              <strong>Ensino Clínico de Consolidação de Competências</strong> da
              Licenciatura em Enfermagem da{" "}
              <strong>Escola Superior de Saúde da Universidade dos Açores</strong>,
              no <strong>Departamento de Enfermagem, Saúde Mental e Gerontologia</strong>,
              pelo estudante de enfermagem <strong>Rodrigo Marques Mendes</strong>.
            </p>
          </div>
        </section>

        <aside className="rounded-[32px] border border-[#243b63] bg-[#0a1834] p-7 shadow-2xl">
          <div className="rounded-[28px] border border-[#243b63] bg-black p-5">
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm font-black uppercase tracking-[0.28em] text-[#3b82f6]">
                Monitor clínico
              </p>
              <span className="rounded-full bg-[#22c55e] px-4 py-1 text-sm font-black text-black">
                Online
              </span>
            </div>

            <div className="space-y-4">
              <Link
                href="/casos"
                className="block rounded-[22px] border border-[#243b63] bg-[#0a1834] px-6 py-7 text-2xl font-black text-white transition hover:bg-[#102247]"
              >
                Resolver Casos
              </Link>

              <Link
                href="/aprender"
                className="block rounded-[22px] border border-[#243b63] bg-[#0a1834] px-6 py-7 text-2xl font-black text-white transition hover:bg-[#102247]"
              >
                Aprender
              </Link>

              <Link
                href="/historico"
                className="block rounded-[22px] border border-[#243b63] bg-[#0a1834] px-6 py-7 text-2xl font-black text-white transition hover:bg-[#102247]"
              >
                Ver Histórico
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}