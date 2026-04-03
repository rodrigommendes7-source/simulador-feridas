import { notFound } from "next/navigation";
import { CasePlayer } from "@/components/case-player";
import { getCaseTemplate, getPublishedCaseIds } from "@/lib/clinical";

export function generateStaticParams() {
  return getPublishedCaseIds().map((caseId) => ({ caseId }));
}

export default async function CasePage({
  params,
}: {
  params: Promise<{ caseId: string }>;
}) {
  const { caseId } = await params;
  const template = getCaseTemplate(caseId);

  if (!template || template.status !== "disponivel") {
    notFound();
  }

  return <CasePlayer templateId={caseId} />;
}
