import { caseDefinitions } from "@/data/cases";
import type { CaseId, CaseDefinition } from "@/types/clinical";

export function listCases(): CaseDefinition[] {
  return caseDefinitions;
}

export function getCaseById(caseId: string): CaseDefinition | undefined {
  return caseDefinitions.find((item) => item.id === caseId);
}

export function getPublishedCaseIds(): CaseId[] {
  return caseDefinitions
    .filter((item) => item.status === "disponivel")
    .map((item) => item.id);
}
