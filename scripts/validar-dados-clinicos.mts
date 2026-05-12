import { validateClinicalDomain } from "../lib/clinico/validacao.ts";

const report = validateClinicalDomain();

if (report.issues.length === 0) {
  console.log("Validação do domínio clínico concluída sem problemas.");
  process.exit(0);
}

for (const issue of report.issues) {
  const prefix = issue.level === "error" ? "ERRO" : "AVISO";
  console.log(`[${prefix}] ${issue.scope}: ${issue.message}`);
}

if (!report.ok) {
  process.exit(1);
}

console.log("Validação do domínio clínico concluída com avisos.");
