"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { carregarHistoricoSeguro } from "@/app/lib/simulador";
import { STORAGE_KEY, type HistoricoResolucao } from "@/app/types/simulador";
import { getAverageScore, getBestScore, groupAttemptsByCase } from "@/lib/history";

type SummaryCard = [title: string, items: string[], fallback: string];
type DetailBlock = [title: string, items: string[], color: string, fallback: string];

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("pt-PT");
}

export default function HistoricoPage() {
  const [entries, setEntries] = useState<HistoricoResolucao[]>(carregarHistoricoSeguro);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  function clearHistory() {
    localStorage.removeItem(STORAGE_KEY);
    setEntries([]);
    setExpanded({});
  }

  const bestScore = useMemo(() => getBestScore(entries), [entries]);
  const averageScore = useMemo(() => getAverageScore(entries), [entries]);
  const attemptsByCase = useMemo(() => groupAttemptsByCase(entries), [entries]);

  return (
    <main className="min-h-screen bg-[#0a0f1e] px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#facc15]">
              Registo
            </p>
            <h1 className="text-4xl font-bold text-white">Histórico de resolução</h1>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-lg border border-[#1e293b] bg-[#0f172a] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#1e293b]"
            >
              Página inicial
            </Link>
            <Link
              href="/casos"
              className="rounded-lg bg-[#1d4ed8] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#1e40af]"
            >
              Casos
            </Link>
            <button
              onClick={clearHistory}
              className="rounded-lg border border-[#7f1d1d] bg-[#0f172a] px-4 py-2.5 text-sm font-medium text-[#fecaca] transition hover:bg-[#1e293b]"
            >
              Limpar histórico
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <section className="rounded-2xl border border-[#1e293b] bg-[#0f172a] p-6">
            <h2 className="mb-6 text-xl font-semibold text-white">Resoluções guardadas</h2>

            <div className="space-y-4">
              {entries.length === 0 ? (
                <div className="rounded-lg border border-dashed border-[#1e293b] bg-[#0a0f1e] p-8 text-center">
                  <p className="text-sm font-medium text-[#94a3b8]">
                    Ainda não tens resoluções guardadas.
                  </p>
                  <p className="mt-2 text-xs text-[#64748b]">
                    Termina um caso para ele aparecer aqui automaticamente.
                  </p>
                </div>
              ) : null}

              {entries.map((entry) => {
                const detailedSections = entry.avaliacaoDetalhada ?? [];
                const detailedArticles = entry.linksFeedback ?? [];

                return (
                  <div
                    key={entry.id}
                    className="rounded-lg border border-[#1e293b] bg-[#0a0f1e] p-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-base font-semibold text-white">{entry.casoTitulo}</p>
                      <span
                        className={`rounded-md px-2.5 py-1 text-xs font-medium ${
                          entry.pontuacao >= 85
                            ? "bg-[#059669] text-white"
                            : entry.pontuacao >= 70
                              ? "bg-[#2563eb] text-white"
                              : entry.pontuacao >= 50
                                ? "bg-[#d97706] text-white"
                                : "bg-[#64748b] text-white"
                        }`}
                      >
                        {entry.pontuacao}/100
                      </span>
                    </div>

                    <p className="mt-2 text-xs text-[#64748b]">{formatDateTime(entry.data)}</p>
                    <p className="mt-3 text-sm leading-relaxed text-[#94a3b8]">
                      {entry.feedback || "Sem feedback disponível."}
                    </p>

                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      {([
                        ["Observações", entry.observacoes, "nenhuma"],
                        ["Perguntas", entry.perguntas, "nenhuma"],
                        ["Tratamentos", entry.tratamentos, "nenhum"],
                        ["Aplicação", entry.aplicacoes, "nenhuma"],
                      ] as SummaryCard[]).map(([title, items, fallback]) => (
                        <div
                          key={title}
                          className="rounded-lg border border-[#1e293b] bg-[#0f172a] p-3"
                        >
                          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#60a5fa]">
                            {title}
                          </p>
                          <p className="text-xs text-[#94a3b8]">
                            {items.length > 0 ? items.join(", ") : fallback}
                          </p>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() =>
                        setExpanded((prev) => ({
                          ...prev,
                          [entry.id]: !prev[entry.id],
                        }))
                      }
                      className="mt-4 rounded-lg bg-[#2563eb] px-4 py-2 text-xs font-medium text-white transition hover:bg-[#1d4ed8]"
                    >
                      {expanded[entry.id] ? "Esconder detalhe" : "Ver detalhe completo"}
                    </button>

                    {expanded[entry.id] ? (
                      <div className="mt-4 space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          {detailedSections.length > 0 ? (
                            detailedSections.map((section) => (
                              <div
                                key={section.nome}
                                className="rounded-lg border border-[#1e293b] bg-[#0f172a] p-4"
                              >
                                <div className="mb-3 flex items-center justify-between gap-3">
                                  <p className="text-sm font-semibold text-white">{section.nome}</p>
                                  <span className="rounded-md bg-[#1e293b] px-2 py-0.5 text-xs font-medium text-[#94a3b8]">
                                    {section.pontuacao}/{section.maximo}
                                  </span>
                                </div>

                                {([
                                  ["Acertos", section.acertou, "#10b981", "Sem acertos assinaláveis."],
                                  ["Faltou", section.faltou, "#f59e0b", "Sem omissões relevantes."],
                                  ["Erros", section.errou, "#ef4444", "Sem erros críticos."],
                                  ["Excesso", section.excesso, "#a855f7", "Sem excesso relevante."],
                                ] as DetailBlock[]).map(([title, items, color, fallback]) => (
                                  <div key={title} className="mb-3 text-xs">
                                    <p className="mb-1 font-semibold" style={{ color }}>
                                      {title}
                                    </p>
                                    {items.length > 0 ? (
                                      items.map((line, index) => (
                                        <div key={index} className="text-[#94a3b8]">
                                          • {line}
                                        </div>
                                      ))
                                    ) : (
                                      <div className="text-[#64748b]">{fallback}</div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ))
                          ) : (
                            <div className="rounded-lg border border-[#1e293b] bg-[#0f172a] p-4 text-xs text-[#64748b] md:col-span-2">
                              Esta resolução foi guardada com o formato antigo e não tem avaliação
                              detalhada.
                            </div>
                          )}
                        </div>

                        <div className="rounded-lg border border-[#1e293b] bg-[#0f172a] p-4">
                          <p className="mb-3 text-sm font-semibold text-white">
                            Artigos e justificação
                          </p>

                          <div className="space-y-3 text-xs">
                            {detailedArticles.length > 0 ? (
                              detailedArticles.map((article, index) => (
                                <div
                                  key={`${article.material}-${article.url}-${index}`}
                                  className="rounded-lg border border-[#1e293b] bg-[#0a0f1e] p-3"
                                >
                                  <p className="font-semibold text-white">{article.material}</p>
                                  {article.titulo ? (
                                    <p className="mt-1 text-[#94a3b8]">{article.titulo}</p>
                                  ) : null}
                                  <a
                                    href={article.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-2 inline-block text-[#60a5fa] hover:text-[#93c5fd]"
                                  >
                                    Abrir recurso ↗
                                  </a>
                                </div>
                              ))
                            ) : (
                              <div className="rounded-lg border border-dashed border-[#1e293b] p-3 text-[#64748b]">
                                Não existem links detalhados para esta resolução.
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </section>

          <aside className="rounded-2xl border border-[#1e293b] bg-[#0f172a] p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">Resumo</h2>

            <div className="space-y-4">
              <div className="rounded-lg border border-[#1e293b] bg-[#0a0f1e] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#60a5fa]">
                  Tentativas
                </p>
                <p className="mt-2 text-3xl font-bold text-white">{entries.length}</p>
              </div>

              <div className="rounded-lg border border-[#1e293b] bg-[#0a0f1e] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#60a5fa]">
                  Melhor pontuação
                </p>
                <p className="mt-2 text-3xl font-bold text-white">{bestScore}/100</p>
              </div>

              <div className="rounded-lg border border-[#1e293b] bg-[#0a0f1e] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#60a5fa]">
                  Média
                </p>
                <p className="mt-2 text-3xl font-bold text-white">{averageScore}/100</p>
              </div>

              <div className="rounded-lg border border-[#1e293b] bg-[#0a0f1e] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#60a5fa]">
                  Casos resolvidos
                </p>
                <div className="mt-3 space-y-2 text-sm text-[#e2e8f0]">
                  {Object.entries(attemptsByCase).length > 0 ? (
                    Object.entries(attemptsByCase).map(([caseId, caseEntries]) => (
                      <div key={caseId} className="flex items-center justify-between gap-3">
                        <span>{caseEntries[0]?.casoTitulo ?? caseId}</span>
                        <span className="rounded-md bg-[#1e293b] px-2 py-0.5 text-xs">
                          {caseEntries.length} tentativa(s)
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-[#64748b]">Sem dados ainda.</div>
                  )}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
