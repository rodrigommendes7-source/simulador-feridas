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
const variantsWithoutZones: string[] = [];
const variantsWithoutVars: string[] = [];
const variantsWithOverrides: string[] = [];

for (const template of caseTemplates) {
  difficultyCounts[template.difficulty] = (difficultyCounts[template.difficulty] ?? 0) + template.variants.length;

  for (const variant of template.variants) {
    const etiologia = variant.woundVariables?.etiologia?.toString() ?? "?";
    etiologiaCounts[etiologia] = (etiologiaCounts[etiologia] ?? 0) + 1;

    if (!variant.tissueZones || variant.tissueZones.length === 0) {
      variantsWithoutZones.push(`Caso ${template.sequence} · ${variant.id}`);
    }
    if (!variant.woundVariables) {
      variantsWithoutVars.push(`Caso ${template.sequence} · ${variant.id}`);
    }
    if (variant.justificacoesOverride && Object.keys(variant.justificacoesOverride).length > 0) {
      variantsWithOverrides.push(`Caso ${template.sequence} · ${variant.id} (${Object.keys(variant.justificacoesOverride).length} overrides)`);
    }
  }
}

const totalVariants = caseTemplates.reduce((acc, t) => acc + t.variants.length, 0);

// ─── Print ───────────────────────────────────────────────────────────────────

function bar(current: number, target: number, width = 20): string {
  const filled = Math.min(width, Math.round((current / Math.max(target, 1)) * width));
  const empty = width - filled;
  const pct = target > 0 ? Math.round((current / target) * 100) : 0;
  return `[${"█".repeat(filled)}${"░".repeat(empty)}] ${String(current).padStart(2)}/${target} (${pct}%)`;
}

console.log("\n╔══════════════════════════════════════════════════════╗");
console.log("║        COBERTURA DE CASOS CLÍNICOS                  ║");
console.log("╚══════════════════════════════════════════════════════╝");

console.log(`\nTotal de variantes: ${totalVariants} | Casos: ${caseTemplates.length}\n`);

// Etiologia
console.log("── Etiologia ─────────────────────────────────────────");
const totalEtiologiaTarget = Object.values(ETIOLOGIA_TARGETS).reduce((a, e) => a + e.target, 0);
for (const [key, { label, target }] of Object.entries(ETIOLOGIA_TARGETS)) {
  const count = etiologiaCounts[key] ?? 0;
  const status = count >= target ? "✓" : count >= Math.ceil(target / 2) ? "~" : "✗";
  console.log(`  ${status} ${label.padEnd(12)} ${bar(count, target)}`);
}
const totalEtiologiaActual = Object.values(etiologiaCounts).reduce((a, b) => a + b, 0);
console.log(`\n  Total etiologia: ${totalEtiologiaActual}/${totalEtiologiaTarget}`);

// Difficulty
console.log("\n── Dificuldade ───────────────────────────────────────");
for (const [key, { label, target }] of Object.entries(DIFFICULTY_TARGETS)) {
  const count = difficultyCounts[key] ?? 0;
  const status = count >= target ? "✓" : count >= Math.ceil(target / 2) ? "~" : "✗";
  console.log(`  ${status} ${label.padEnd(14)} ${bar(count, target)}`);
}

// Data health
console.log("\n── Saúde dos dados ───────────────────────────────────");

if (variantsWithoutZones.length === 0) {
  console.log("  ✓ Todas as variantes têm tissueZones");
} else {
  console.log(`  ✗ Sem tissueZones (${variantsWithoutZones.length}):`);
  variantsWithoutZones.forEach((v) => console.log(`      - ${v}`));
}

if (variantsWithoutVars.length === 0) {
  console.log("  ✓ Todas as variantes têm woundVariables");
} else {
  console.log(`  ✗ Sem woundVariables (${variantsWithoutVars.length}):`);
  variantsWithoutVars.forEach((v) => console.log(`      - ${v}`));
}

if (variantsWithOverrides.length === 0) {
  console.log("  ✓ Nenhuma variante tem justificacoesOverride");
} else {
  console.log(`  ~ Com justificacoesOverride (${variantsWithOverrides.length}):`);
  variantsWithOverrides.forEach((v) => console.log(`      - ${v}`));
}

// Priority list
console.log("\n── Prioridades (etiologias com maior défice) ─────────");
const priorities = Object.entries(ETIOLOGIA_TARGETS)
  .map(([key, { label, target }]) => ({ label, deficit: target - (etiologiaCounts[key] ?? 0) }))
  .filter((e) => e.deficit > 0)
  .sort((a, b) => b.deficit - a.deficit);

if (priorities.length === 0) {
  console.log("  ✓ Todos os targets de etiologia atingidos!");
} else {
  priorities.forEach((e, i) => {
    console.log(`  ${i + 1}. ${e.label.padEnd(12)} faltam ${e.deficit} variante${e.deficit !== 1 ? "s" : ""}`);
  });
}

console.log("");
