import { notFound } from "next/navigation";
import { CasePlayer } from "@/components/case-player";
import { getCaseById, getPublishedCaseIds } from "@/lib/cases";

export function generateStaticParams() {
  return getPublishedCaseIds().map((caseId) => ({ caseId }));
}

export default async function CasoPage({
  params,
}: {
  params: Promise<{ caseId: string }>;
}) {
  const { caseId } = await params;
  const caseDefinition = getCaseById(caseId);

  if (!caseDefinition || caseDefinition.status !== "disponivel") {
    notFound();
  }

  return <CasePlayer caseId={caseId} />;
}
