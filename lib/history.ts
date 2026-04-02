import type { HistoricoResolucao } from "@/app/types/simulador";

export function getBestScore(entries: HistoricoResolucao[]) {
  if (entries.length === 0) return 0;
  return Math.max(...entries.map((entry) => entry.pontuacao));
}

export function getAverageScore(entries: HistoricoResolucao[]) {
  if (entries.length === 0) return 0;
  const total = entries.reduce((acc, entry) => acc + entry.pontuacao, 0);
  return Math.round(total / entries.length);
}

export function groupAttemptsByCase(entries: HistoricoResolucao[]) {
  return entries.reduce<Record<string, HistoricoResolucao[]>>((acc, entry) => {
    if (!acc[entry.casoId]) {
      acc[entry.casoId] = [];
    }
    acc[entry.casoId].push(entry);
    return acc;
  }, {});
}

export function getAverageScoreByCase(entries: HistoricoResolucao[]) {
  return Object.entries(groupAttemptsByCase(entries)).map(([caseId, caseEntries]) => ({
    caseId,
    title: caseEntries[0]?.casoTitulo ?? caseId,
    average: Math.round(
      caseEntries.reduce((acc, entry) => acc + entry.pontuacao, 0) / caseEntries.length
    ),
    attempts: caseEntries.length,
  }));
}

export function getCaseToRetry(entries: HistoricoResolucao[]) {
  const ordered = getAverageScoreByCase(entries).sort((a, b) => a.average - b.average);
  return ordered[0];
}
