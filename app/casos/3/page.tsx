import Link from "next/link";

export default function CasoTresPage() {
  return (
    <main className="min-h-screen bg-[#0a0f1e] px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#60a5fa]">
              Caso 3
            </p>
            <h1 className="text-4xl font-bold text-white">Base criada</h1>
          </div>

          <div className="flex gap-3">
            <Link
              href="/casos"
              className="rounded-lg border border-[#1e293b] bg-[#0f172a] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#1e293b]"
            >
              Voltar aos casos
            </Link>
          </div>
        </div>

        <section className="space-y-6 rounded-2xl border border-[#1e293b] bg-[#0f172a] p-6">
          <p className="text-sm leading-relaxed text-[#94a3b8]">
            Esta página serve como ponto de partida para o terceiro caso clínico.
            A estrutura de dados já foi preparada e está pronta para receber
            conteúdo clínico, diálogo e critérios de avaliação.
          </p>

          <div className="rounded-lg border border-[#1e293b] bg-[#0a0f1e] p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#60a5fa]">
              Próximos passos sugeridos
            </p>
            <ul className="space-y-2 text-sm text-[#94a3b8]">
              <li>• Preencher o ficheiro `data/casos/caso3.json` com o cenário.</li>
              <li>• Definir pontuações e critérios de feedback do caso.</li>
              <li>• Ligar esta rota à lógica completa do simulador.</li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
