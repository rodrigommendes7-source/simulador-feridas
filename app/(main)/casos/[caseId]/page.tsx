import { notFound } from "next/navigation";
import { CasePlayer } from "@/components/case-player";
import { obterModeloCaso, obterIdsCasosPublicados } from "@/lib/clinico/indice";

export function generateStaticParams() {
  return obterIdsCasosPublicados().map((caseId) => ({ caseId }));
}

export default async function CasePage({
  params,
}: {
  params: Promise<{ caseId: string }>;
}) {
  const { caseId } = await params;
  const modelo = obterModeloCaso(caseId);

  if (!modelo || modelo.status !== "disponivel") {
    notFound();
  }

  return <CasePlayer idModelo={caseId} />;
}
