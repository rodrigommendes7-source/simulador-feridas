import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0b1220] px-6 py-8 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col justify-center">
        <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[32px] border border-[#334155] bg-[#111827] p-8 shadow-2xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-[#3b82f6]">
              Simulador clínico
            </p>

            <h1 className="text-5xl font-black leading-tight text-[#f8fafc]">
              Simulador de
              <br />
              Tratamento de Feridas
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#cbd5e1]">
  Plataforma educativa para treinar observação da ferida, diálogo com o utente,
  seleção de tratamento e avaliação final da decisão clínica.
</p>

<div className="mt-6 rounded-2xl border border-[#334155] bg-[#0f172a] p-5">
  <p className="text-sm leading-relaxed text-[#cbd5e1]">
    Este simulador foi criado no âmbito do{" "}
    <strong className="text-white">
      Ensino Clínico de Consolidação de Competências
    </strong>{" "}
    da Licenciatura em Enfermagem da{" "}
    <strong className="text-white">
      Escola Superior de Saúde da Universidade dos Açores
    </strong>
    , no{" "}
    <strong className="text-white">
      Departamento de Enfermagem, Saúde Mental e Gerontologia
    </strong>
    , pelo estudante de enfermagem{" "}
    <strong className="text-white">Rodrigo Marques Mendes</strong>.
  </p>
</div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/casos"
                className="rounded-2xl bg-[#facc15] px-6 py-4 text-lg font-black text-[#0f172a] transition hover:bg-[#fde047]"
              >
                Entrar nos casos
              </Link>

              <Link
                href="/historico"
                className="rounded-2xl border border-[#334155] bg-white px-6 py-4 text-lg font-black text-[#0f172a] transition hover:bg-[#f8fafc]"
              >
                Ver histórico
              </Link>
            </div>
          </section>

          <section className="rounded-[32px] border border-[#334155] bg-[#111827] p-8 shadow-2xl">
            <div className="rounded-[28px] border border-[#334155] bg-black p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#3b82f6]">
                  Monitor clínico
                </span>
                <span className="rounded-full bg-[#22c55e] px-3 py-1 text-xs font-black text-[#0f172a]">
                  Online
                </span>
              </div>

              <div className="grid gap-4">
                <div className="rounded-2xl border border-[#334155] bg-[#0f172a] p-4">
                  <p className="text-sm font-bold uppercase tracking-wide text-[#3b82f6]">
                    Módulos
                  </p>
                  <p className="mt-2 text-base font-semibold text-white">
                    Observação, diálogo, tratamento e avaliação final
                  </p>
                </div>

                <div className="rounded-2xl border border-[#334155] bg-[#0f172a] p-4">
                  <p className="text-sm font-bold uppercase tracking-wide text-[#3b82f6]">
                    Tipos de caso
                  </p>
                  <p className="mt-2 text-base font-semibold text-white">
                    Lesões por pressão, feridas cirúrgicas, úlceras e casos futuros
                  </p>
                </div>

                <div className="rounded-2xl border border-[#334155] bg-[#0f172a] p-4">
                  <p className="text-sm font-bold uppercase tracking-wide text-[#3b82f6]">
                    Saída final
                  </p>
                  <p className="mt-2 text-base font-semibold text-white">
                    Pontuação de 0 a 100 com feedback da resolução
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}