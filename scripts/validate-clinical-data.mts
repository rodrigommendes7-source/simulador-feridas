import { validateClinicalDomain } from "../lib/clinical/validation.ts";

const report = validateClinicalDomain();

if (report.issues.length === 0) {
  console.log("Clinical data validation passed with no issues.");
  process.exit(0);
}

for (const issue of report.issues) {
  const prefix = issue.level === "error" ? "ERROR" : "WARN";
  console.log(`[${prefix}] ${issue.scope}: ${issue.message}`);
}

if (!report.ok) {
  process.exit(1);
}

console.log("Clinical data validation completed with warnings only.");
