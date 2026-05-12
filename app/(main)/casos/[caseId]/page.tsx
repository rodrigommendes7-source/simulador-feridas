import { notFound } from "next/navigation";
import { SimuladorCaso } from "@/componentes/reprodutor-caso";
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

  return <SimuladorCaso idModelo={caseId} />;
}
