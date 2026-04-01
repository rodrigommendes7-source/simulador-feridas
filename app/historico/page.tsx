"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { carregarHistoricoSeguro } from "../lib/simulador";
import { STORAGE_KEY, type HistoricoResolucao } from "../types/simulador";

function formatarDataHora(iso: string) {
  return new Date(iso).toLocaleString("pt-PT");
}

export default function HistoricoPage() {
  const [resolucoes, setResolucoes] = useState<HistoricoResolucao[]>(
    carregarHistoricoSeguro
  );  
  const [expandido, setExpandido] = useState<Record<string, boolean>>({});

  function limparHistorico() {
    localStorage.removeItem(STORAGE_KEY);
    setResolucoes([]);
    setExpandido({});
  }

  const melhorPontuacao = useMemo(() => {
    if (resolucoes.length === 0) return 0;
    return Math.max(...resolucoes.map((item) => item.pontuacao));
  }, [resolucoes]);

  const mediaPontuacao = useMemo(() => {
    if (resolucoes.length === 0) return 0;
    const total = resolucoes.reduce((acc, item) => acc + item.pontuacao, 0);
    return Math.round(total / resolucoes.length);
  }, [resolucoes]);

  return (
    <main className="min-h-screen bg-[#0a0f1e] px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#facc15]">
              Registo
            </p>
            <h1 className="text-4xl font-bold text-white">
              Histórico de resolução
            </h1>
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
              onClick={limparHistorico}   
              className="rounded-lg border border-[#7f1d1d] bg-[#0f172a] px-4 py-2.5 text-sm font-medium text-[#fecaca] transition hover:bg-[#1e293b]"
            >
              Limpar histórico
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <section className="rounded-2xl border border-[#1e293b] bg-[#0f172a] p-6">
            <h2 className="mb-6 text-xl font-semibold text-white">
              Resoluções guardadas
            </h2>

            <div className="space-y-4">
              {resolucoes.length === 0 && (
                <div className="rounded-lg border border-dashed border-[#1e293b] bg-[#0a0f1e] p-8 text-center">
                  <p className="text-sm font-medium text-[#94a3b8]">
                    Ainda não tens resoluções guardadas.
                  </p>
                  <p className="mt-2 text-xs text-[#64748b]">
                    Termina um caso para ele aparecer aqui automaticamente.
                  </p>
                </div>
              )}

              {resolucoes.map((item) => {
                const secoesDetalhadas = item.avaliacaoDetalhada ?? [];
                const artigosDetalhados = item.linksFeedback ?? [];
                return (
                  <div
                    key={item.id}
                    className="rounded-lg border border-[#1e293b] bg-[#0a0f1e] p-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-base font-semibold text-white">
                        {item.casoTitulo}
                      </p>

                      <span
                        className={`rounded-md px-2.5 py-1 text-xs font-medium ${
                          item.pontuacao >= 85
                            ? "bg-[#059669] text-white"
                            : item.pontuacao >= 70
                            ? "bg-[#2563eb] text-white"
                            : item.pontuacao >= 50
                            ? "bg-[#d97706] text-white"
                            : "bg-[#64748b] text-white"
                        }`}
                      >
                        {item.pontuacao}/100
                      </span>
                    </div>

                    <p className="mt-2 text-xs text-[#64748b]">
                      {formatarDataHora(item.data)}
                    </p>

                    <p className="mt-3 text-sm leading-relaxed text-[#94a3b8]">
                      {item.feedback || "Sem feedback disponível."}
                    </p>

                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      <div className="rounded-lg border border-[#1e293b] bg-[#0f172a] p-3">
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#60a5fa]">
                          Observações
                        </p>
                        <p className="text-xs text-[#94a3b8]">
                          {item.observacoes.length > 0
                            ? item.observacoes.join(", ")
                            : "nenhuma"}
                        </p>
                      </div>

                      <div className="rounded-lg border border-[#1e293b] bg-[#0f172a] p-3">
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#60a5fa]">
                          Perguntas
                        </p>
                        <p className="text-xs text-[#94a3b8]">
                          {item.perguntas.length > 0
                            ? item.perguntas.join(", ")
                            : "nenhuma"}
                        </p>
                      </div>

                      <div className="rounded-lg border border-[#1e293b] bg-[#0f172a] p-3">
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#60a5fa]">
                          Tratamentos
                        </p>
                        <p className="text-xs text-[#94a3b8]">
                          {item.tratamentos.length > 0
                            ? item.tratamentos.join(", ")
                            : "nenhum"}
                        </p>
                      </div>

                      <div className="rounded-lg border border-[#1e293b] bg-[#0f172a] p-3">
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#60a5fa]">
                          Aplicação
                        </p>
                        <p className="text-xs text-[#94a3b8]">
                          {item.aplicacoes.length > 0
                            ? item.aplicacoes.join(", ")
                            : "nenhuma"}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        setExpandido((prev) => ({
                          ...prev,
                          [item.id]: !prev[item.id],
                        }))
                      }
                      className="mt-4 rounded-lg bg-[#2563eb] px-4 py-2 text-xs font-medium text-white transition hover:bg-[#1d4ed8]"
                    >
                      {expandido[item.id]
                        ? "Esconder detalhe"
                        : "Ver detalhe completo"}
                    </button>

                    {expandido[item.id] && (
                      <div className="mt-4 space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          {secoesDetalhadas.length > 0 ? (
                            secoesDetalhadas.map((secao) => (
                              <div
                                key={secao.nome}
                                className="rounded-lg border border-[#1e293b] bg-[#0f172a] p-4"
                              >
                                <div className="mb-3 flex items-center justify-between gap-3">
                                  <p className="text-sm font-semibold text-white">
                                    {secao.nome}
                                  </p>
                                  <span className="rounded-md bg-[#1e293b] px-2 py-0.5 text-xs font-medium text-[#94a3b8]">
                                    {secao.pontuacao}/{secao.maximo}
                                  </span>
                                </div>

                                <div className="space-y-3 text-xs">
                                  <div>
                                    <p className="mb-1 font-semibold text-[#10b981]">
                                      Acertos
                                    </p>
                                    {secao.acertou.length > 0 ? (
                                      secao.acertou.map((linha, i) => (
                                        <div key={i} className="text-[#94a3b8]">• {linha}</div>
                                      ))
                                    ) : (
                                      <div className="text-[#64748b]">Sem acertos assinaláveis.</div>
                                    )}
                                  </div>

                                  <div>
                                    <p className="mb-1 font-semibold text-[#f59e0b]">
                                      Faltou
                                    </p>
                                    {secao.faltou.length > 0 ? (
                                      secao.faltou.map((linha, i) => (
                                        <div key={i} className="text-[#94a3b8]">• {linha}</div>
                                      ))
                                    ) : (
                                      <div className="text-[#64748b]">Sem omissões relevantes.</div>
                                    )}
                                  </div>

                                  <div>
                                    <p className="mb-1 font-semibold text-[#ef4444]">
                                      Erros
                                    </p>
                                    {secao.errou.length > 0 ? (
                                      secao.errou.map((linha, i) => (
                                        <div key={i} className="text-[#94a3b8]">• {linha}</div>
                                      ))
                                    ) : (
                                      <div className="text-[#64748b]">Sem erros críticos.</div>
                                    )}
                                  </div>

                                  <div>
                                    <p className="mb-1 font-semibold text-[#a855f7]">
                                      Excesso
                                    </p>
                                    {secao.excesso.length > 0 ? (
                                      secao.excesso.map((linha, i) => (
                                        <div key={i} className="text-[#94a3b8]">• {linha}</div>
                                      ))
                                    ) : (
                                      <div className="text-[#64748b]">Sem excesso relevante.</div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="rounded-lg border border-[#1e293b] bg-[#0f172a] p-4 text-xs text-[#64748b] md:col-span-2">
                              Esta resolução foi guardada com o formato antigo e
                              não tem avaliação detalhada.
                            </div>
                          )}
                        </div>

                        <div className="rounded-lg border border-[#1e293b] bg-[#0f172a] p-4">
                          <p className="mb-3 text-sm font-semibold text-white">
                            Artigos e justificação
                          </p>

                          <div className="space-y-3 text-xs">
                            {artigosDetalhados.length > 0 ? (
                              artigosDetalhados.map((artigo, i) => (
                                <div
                                  key={`${artigo.material}-${artigo.url}-${i}`}
                                  className="rounded-lg border border-[#1e293b] bg-[#0a0f1e] p-3"
                                >
                                  <p className="font-semibold text-white">{artigo.material}</p>

                                  {artigo.titulo && (
                                    <p className="mt-1 text-[#94a3b8]">{artigo.titulo}</p>
                                  )}

                                  {artigo.motivo && (
                                    <p className="mt-2 text-[#f59e0b]">{artigo.motivo}</p>
                                  )}

                                  <a
                                    href={artigo.url}
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
                    )}
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
                <p className="mt-2 text-3xl font-bold text-white">{resolucoes.length}</p>
              </div>

              <div className="rounded-lg border border-[#1e293b] bg-[#0a0f1e] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#60a5fa]">
                  Melhor pontuação
                </p>
                <p className="mt-2 text-3xl font-bold text-white">{melhorPontuacao}/100</p>
              </div>

              <div className="rounded-lg border border-[#1e293b] bg-[#0a0f1e] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#60a5fa]">
                  Média
                </p>
                <p className="mt-2 text-3xl font-bold text-white">{mediaPontuacao}/100</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}