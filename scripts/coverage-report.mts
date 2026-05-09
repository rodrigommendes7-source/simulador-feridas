import { caseTemplates } from "../data/clinical/casos.ts";

// ─── Targets ────────────────────────────────────────────────────────────────

const ETIOLOGIA_TARGETS: Record<string, { label: string; target: number }> = {
  "1": { label: "Pressão",    target: 6 },
  "2": { label: "Venosa",     target: 5 },
  "3": { label: "Arterial",   target: 4 },
  "4": { label: "Diabética",  target: 5 },
  "5": { label: "Traumática", target: 4 },
  "6": { label: "Cirúrgica",  target: 4 },
  "7": { label: "Queimadura", target: 4 },
};

const DIFFICULTY_TARGETS: Record<string, { label: string; target: number }> = {
  introdutorio: { label: "Introdutório", target: 8 },
  intermedio:   { label: "Intermédio",   target: 16 },
  avancado:     { label: "Avançado",     target: 8 },
};

// ─── Gather data ─────────────────────────────────────────────────────────────

const etiologiaCounts: Record<string, number> = {};
const difficultyCounts: Record<string, number> = {};
const casesWithoutZones: string[] = [];
const casesWithoutVars: string[] = [];
const casesWithOverrides: string[] = [];

for (const template of caseTemplates) {
  difficultyCounts[template.difficulty] = (difficultyCounts[template.difficulty] ?? 0) + 1;

  const etiologia = template.woundVariables?.etiologia?.toString() ?? "?";
  etiologiaCounts[etiologia] = (etiologiaCounts[etiologia] ?? 0) + 1;

  if (!template.tissueZones || template.tissueZones.length === 0) {
    casesWithoutZones.push(`Caso ${template.sequence} · ${template.id}`);
  }
  if (!template.woundVariables) {
    casesWithoutVars.push(`Caso ${template.sequence} · ${template.id}`);
  }
  if (template.justificacoesOverride && Object.keys(template.justificacoesOverride).length > 0) {
    casesWithOverrides.push(`Caso ${template.sequence} · ${template.id} (${Object.keys(template.justificacoesOverride).length} overrides)`);
  }
}

const totalCases = caseTemplates.length;

// ─── Print ───────────────────────────────────────────────────────────────────

function bar(current: number, target: number, width = 20): string {
  const filled = Math.min(width, Math.round((current / Math.max(target, 1)) * width));
  const empty = width - filled;
  const pct = target > 0 ? Math.round((current / target) * 100) : 0;
  return `[${"█".repeat(filled)}${"░".repeat(empty)}] ${String(current).padStart(2)}/${target} (${pct}%)`;
}

console.log("\n╔══════════════════════════════════════════════════════╗");
console.log("║        COBERTURA DE CASOS CLÍNICOS                  ║");
console.log(`╠══════════════════════════════════════════════════════╣`);
console.log(`║  Total de casos: ${String(totalCases).padEnd(34)}║`);
console.log("╠══════════════════════════════════════════════════════╣");
console.log("║  Por dificuldade:                                    ║");
for (const [key, { label, target }] of Object.entries(DIFFICULTY_TARGETS)) {
  const count = difficultyCounts[key] ?? 0;
  console.log(`║    ${label.padEnd(14)} ${bar(count, target).padEnd(35)}║`);
}
console.log("╠══════════════════════════════════════════════════════╣");
console.log("║  Por etiologia (woundVariables.etiologia):           ║");
for (const [key, { label, target }] of Object.entries(ETIOLOGIA_TARGETS)) {
  const count = etiologiaCounts[key] ?? 0;
  console.log(`║    ${label.padEnd(14)} ${bar(count, target).padEnd(35)}║`);
}
console.log("╠══════════════════════════════════════════════════════╣");
console.log(`║  Casos sem tissueZones: ${String(casesWithoutZones.length).padEnd(28)}║`);
for (const name of casesWithoutZones) {
  console.log(`║    • ${name.padEnd(48)}║`);
}
console.log(`║  Casos sem woundVariables: ${String(casesWithoutVars.length).padEnd(25)}║`);
for (const name of casesWithoutVars) {
  console.log(`║    • ${name.padEnd(48)}║`);
}
console.log(`║  Casos com justificacoesOverride: ${String(casesWithOverrides.length).padEnd(18)}║`);
for (const name of casesWithOverrides) {
  console.log(`║    • ${name.padEnd(48)}║`);
}
console.log("╚══════════════════════════════════════════════════════╝\n");
