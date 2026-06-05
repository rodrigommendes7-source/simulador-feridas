"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { ModeloCaso, RegistoTentativa } from "@/lib/clinico/types";
import { carregarHistoricoTentativas } from "@/lib/clinico/historico";

export default function CaseListClient({ casos }: { casos: ModeloCaso[] }) {
  const [mounted, setMounted] = useState(false);
  const [historico, setHistorico] = useState<RegistoTentativa[]>([]);
  const [filtroNivel, setFiltroNivel] = useState<string>("Todos");
  const [filtroEstado, setFiltroEstado] = useState<string>("Todos");

  useEffect(() => {
    setHistorico(carregarHistoricoTentativas());
    setMounted(true);
  }, []);

  const bestScores = casos.reduce((acc, c) => {
    const tentativas = historico.filter((h) => h.idCaso === c.id);
    if (tentativas.length > 0) {
      acc[c.id] = Math.max(...tentativas.map((t) => t.pontuacao));
    }
    return acc;
  }, {} as Record<string, number>);

  const totalCases = casos.length;
  const resolvedCount = Object.keys(bestScores).length;
  const perfectCount = Object.values(bestScores).filter((s) => s === 100).length;

  const casosFiltrados = casos.filter((c) => {
    if (filtroNivel !== "Todos") {
      const mapNivel: Record<string, string> = {
        "Introdutório": "introdutorio",
        "Intermédio": "intermedio",
        "Avançado": "avancado",
      };
      if (c.dificuldade !== mapNivel[filtroNivel]) return false;
    }

    if (mounted && filtroEstado !== "Todos") {
      const score = bestScores[c.id];
      if (filtroEstado === "Não tentado" && score !== undefined) return false;
      if (filtroEstado === "Tentado" && score === undefined) return false;
      if (filtroEstado === "Pontuação perfeita" && score !== 100) return false;
    }

    return true;
  });

  return (
    <div className="flex flex-col gap-8">
      {mounted ? (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-3">
          <div>
            <h2 className="text-lg font-medium text-gray-900">O seu progresso</h2>
            <p className="text-sm text-gray-500">
              {resolvedCount} de {totalCases} casos resolvidos · {perfectCount} de {totalCases} com pontuação perfeita (100/100)
            </p>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${totalCases > 0 ? (resolvedCount / totalCases) * 100 : 0}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 h-[104px] rounded-xl border border-gray-100 animate-pulse" />
      )}

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm font-medium text-gray-700 mr-2">Dificuldade:</span>
          {["Todos", "Introdutório", "Intermédio", "Avançado"].map((level) => (
            <button
              key={level}
              onClick={() => setFiltroNivel(level)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filtroNivel === level
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {level}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 items-center min-h-[32px]">
          {mounted && (
            <>
              <span className="text-sm font-medium text-gray-700 mr-2">Estado:</span>
              {["Todos", "Não tentado", "Tentado", "Pontuação perfeita"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFiltroEstado(status)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    filtroEstado === status
                      ? "bg-teal-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {status}
                </button>
              ))}
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {casosFiltrados.map((c) => {
          const isResolved = mounted && bestScores[c.id] !== undefined;
          const score = mounted ? bestScores[c.id] : null;

          return (
            <Link href={`/casos/${c.slug}`} key={c.id} className="card p-6 flex flex-col gap-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow bg-white">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  {c.dificuldade === "introdutorio" ? "Introdutório" : c.dificuldade === "intermedio" ? "Intermédio" : "Avançado"}
                </span>
                {isResolved && (
                  <span className={`text-xs font-bold px-2 py-1 rounded ${score === 100 ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                    {score}/100
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">{c.titulo}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mt-1">{c.descricao}</p>
              </div>
            </Link>
          );
        })}
        {casosFiltrados.length === 0 && mounted && (
          <p className="text-gray-500 col-span-full">Nenhum caso encontrado com os filtros atuais.</p>
        )}
      </div>
    </div>
  );
}