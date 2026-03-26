"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type AvaliacaoSecao = {
  nome: string;
  pontuacao: number;
  maximo: number;
  acertou: string[];
  errou: string[];
  faltou: string[];
  excesso: string[];
};

type FeedbackLink = {
  material: string;
  correto?: string;
  titulo: string;
  url: string;
  explicacao: string;
};

type HistoricoResolucao = {
  id: string;
  casoId: string;
  casoTitulo: string;
  pontuacao: number;
  data: string;
  observacoes: string[];
  perguntas: string[];
  tratamentos: string[];
  aplicacoes: string[];
  feedbackResumo: string;
  secoes: AvaliacaoSecao[];
  artigos: FeedbackLink[];
};

const STORAGE_KEY = "historico_resolucoes_feridas";

function formatarDataHora(iso: string) {
  return new Date(iso).toLocaleString("pt-PT");
}

export default function HistoricoPage() {
  const [resolucoes, setResolucoes] = useState<HistoricoResolucao[]>([]);
  const [expandido, setExpandido] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const historicoGuardado = localStorage.getItem(STORAGE_KEY);
    const historico: HistoricoResolucao[] = historicoGuardado
      ? JSON.parse(historicoGuardado)
      : [];

    setResolucoes(historico);
  }, []);

  function limparHistorico() {
    localStorage.removeItem(STORAGE_KEY);
    setResolucoes([]);
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
    <main className="min-h-screen bg-[#0b1220] px-6 py-8 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#3b82f6]">
              Registo
            </p>
            <h1 className="mt-2 text-4xl font-black text-[#f8fafc]">
              Histórico de resolução
            </h1>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-2xl border border-[#334155] bg-white px-5 py-3 font-black text-[#0f172a] hover:bg-[#f8fafc]"
            >
              Página inicial
            </Link>

            <Link
              href="/casos"
              className="rounded-2xl bg-[#facc15] px-5 py-3 font-black text-[#0f172a] hover:bg-[#fde047]"
            >
              Casos
            </Link>

            <button
              onClick={limparHistorico}
              className="rounded-2xl border border-[#334155] bg-[#111827] px-5 py-3 font-black text-white hover:bg-[#1f2937]"
            >
              Limpar histórico
            </button>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-[28px] border border-[#334155] bg-[#111827] p-6 shadow-2xl">
            <h2 className="text-2xl font-black text-[#f8fafc]">
              Resoluções guardadas
            </h2>

            <div className="mt-5 space-y-4">
              {resolucoes.length === 0 && (
                <div className="rounded-2xl border border-dashed border-[#334155] bg-[#0f172a] p-6 text-center">
                  <p className="text-lg font-bold text-[#cbd5e1]">
                    Ainda não tens resoluções guardadas.
                  </p>
                  <p className="mt-2 text-sm text-[#94a3b8]">
                    Termina um caso para ele aparecer aqui automaticamente.
                  </p>
                </div>
              )}

              {resolucoes.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-[#334155] bg-[#0f172a] p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-lg font-black text-white">
                      {item.casoTitulo}
                    </p>

                    <span
                      className={`rounded-full px-3 py-1 text-sm font-black ${
                        item.pontuacao >= 85
                          ? "bg-[#22c55e] text-[#0f172a]"
                          : item.pontuacao >= 70
                          ? "bg-[#1d4ed8] text-white"
                          : item.pontuacao >= 50
                          ? "bg-[#facc15] text-[#0f172a]"
                          : "bg-[#64748b] text-white"
                      }`}
                    >
                      {item.pontuacao}/100
                    </span>
                  </div>

                  <p className="mt-2 text-sm font-semibold text-[#94a3b8]">
                    {formatarDataHora(item.data)}
                  </p>

                  <p className="mt-3 text-base text-[#cbd5e1]">
                    {item.feedbackResumo}
                  </p>

                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div className="rounded-xl border border-[#334155] bg-[#111827] p-3">
                      <p className="mb-2 text-sm font-black uppercase tracking-wide text-[#3b82f6]">
                        Observações
                      </p>
                      <p className="text-sm text-white">
                        {item.observacoes.length > 0
                          ? item.observacoes.join(", ")
                          : "nenhuma"}
                      </p>
                    </div>

                    <div className="rounded-xl border border-[#334155] bg-[#111827] p-3">
                      <p className="mb-2 text-sm font-black uppercase tracking-wide text-[#3b82f6]">
                        Perguntas
                      </p>
                      <p className="text-sm text-white">
                        {item.perguntas.length > 0
                          ? item.perguntas.join(", ")
                          : "nenhuma"}
                      </p>
                    </div>

                    <div className="rounded-xl border border-[#334155] bg-[#111827] p-3">
                      <p className="mb-2 text-sm font-black uppercase tracking-wide text-[#3b82f6]">
                        Tratamentos
                      </p>
                      <p className="text-sm text-white">
                        {item.tratamentos.length > 0
                          ? item.tratamentos.join(", ")
                          : "nenhum"}
                      </p>
                    </div>

                    <div className="rounded-xl border border-[#334155] bg-[#111827] p-3">
                      <p className="mb-2 text-sm font-black uppercase tracking-wide text-[#3b82f6]">
                        Aplicação
                      </p>
                      <p className="text-sm text-white">
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
                    className="mt-4 rounded-xl bg-[#1d4ed8] px-4 py-2 text-sm font-black text-white hover:bg-[#2563eb]"
                  >
                    {expandido[item.id]
                      ? "Esconder detalhe"
                      : "Ver detalhe completo"}
                  </button>

                  {expandido[item.id] && (
                    <div className="mt-4 space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        {item.secoes.map((secao) => (
                          <div
                            key={secao.nome}
                            className="rounded-xl border border-[#334155] bg-[#111827] p-4"
                          >
                            <div className="mb-3 flex items-center justify-between gap-3">
                              <p className="text-lg font-black text-[#3b82f6]">
                                {secao.nome}
                              </p>
                              <span className="rounded-full bg-[#0f172a] px-3 py-1 text-xs font-black text-white">
                                {secao.pontuacao}/{secao.maximo}
                              </span>
                            </div>

                            <div className="space-y-3 text-sm text-white">
                              <div>
                                <p className="mb-1 font-black text-[#22c55e]">
                                  Acertos
                                </p>
                                {secao.acertou.length > 0 ? (
                                  secao.acertou.map((linha, i) => (
                                    <div key={i}>• {linha}</div>
                                  ))
                                ) : (
                                  <div>Sem acertos assinaláveis.</div>
                                )}
                              </div>

                              <div>
                                <p className="mb-1 font-black text-[#facc15]">
                                  Faltou
                                </p>
                                {secao.faltou.length > 0 ? (
                                  secao.faltou.map((linha, i) => (
                                    <div key={i}>• {linha}</div>
                                  ))
                                ) : (
                                  <div>Sem omissões relevantes.</div>
                                )}
                              </div>

                              <div>
                                <p className="mb-1 font-black text-[#f87171]">
                                  Erros
                                </p>
                                {secao.errou.length > 0 ? (
                                  secao.errou.map((linha, i) => (
                                    <div key={i}>• {linha}</div>
                                  ))
                                ) : (
                                  <div>Sem erros críticos.</div>
                                )}
                              </div>

                              <div>
                                <p className="mb-1 font-black text-[#c084fc]">
                                  Excesso
                                </p>
                                {secao.excesso.length > 0 ? (
                                  secao.excesso.map((linha, i) => (
                                    <div key={i}>• {linha}</div>
                                  ))
                                ) : (
                                  <div>Sem excesso relevante.</div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="rounded-xl border border-[#334155] bg-[#111827] p-4">
                        <p className="mb-3 text-lg font-black text-[#3b82f6]">
                          Artigos e justificação
                        </p>

                        <div className="space-y-3 text-sm text-white">
                          {item.artigos.length > 0 ? (
                            item.artigos.map((artigo, i) => (
                              <div
                                key={`${artigo.material}-${i}`}
                                className="rounded-xl border border-[#334155] bg-[#0f172a] p-3"
                              >
                                <p className="font-black">{artigo.material}</p>
                                {artigo.correto && (
                                  <p className="mt-1 text-[#facc15]">
                                    Alternativa mais adequada: {artigo.correto}
                                  </p>
                                )}
                                <p className="mt-2 text-[#cbd5e1]">
                                  {artigo.explicacao}
                                </p>
                                <a
                                  href={artigo.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mt-2 inline-block text-[#93c5fd] underline hover:text-white"
                                >
                                  {artigo.titulo}
                                </a>
                              </div>
                            ))
                          ) : (
                            <div>
                              Não há artigos guardados para esta resolução.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <aside className="rounded-[28px] border border-[#334155] bg-[#111827] p-6 shadow-2xl">
            <h2 className="text-2xl font-black text-[#f8fafc]">
              Resumo
            </h2>

            <div className="mt-5 grid gap-4">
              <div className="rounded-2xl border border-[#334155] bg-[#0f172a] p-4">
                <p className="text-sm font-bold uppercase tracking-wide text-[#3b82f6]">
                  Total de tentativas
                </p>
                <p className="mt-2 text-3xl font-black text-white">
                  {resolucoes.length}
                </p>
              </div>

              <div className="rounded-2xl border border-[#334155] bg-[#0f172a] p-4">
                <p className="text-sm font-bold uppercase tracking-wide text-[#3b82f6]">
                  Melhor pontuação
                </p>
                <p className="mt-2 text-3xl font-black text-white">
                  {melhorPontuacao}
                </p>
              </div>

              <div className="rounded-2xl border border-[#334155] bg-[#0f172a] p-4">
                <p className="text-sm font-bold uppercase tracking-wide text-[#3b82f6]">
                  Média
                </p>
                <p className="mt-2 text-3xl font-black text-white">
                  {mediaPontuacao}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}