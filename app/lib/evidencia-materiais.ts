import type { TratamentoId } from "@/app/types/simulador";
import { getTreatmentById } from "@/lib/treatments";

export type EvidenciaMaterial = {
  titulo: string;
  url: string;
  explicacao: string;
};

const evidenciaPorCategoria: Record<string, EvidenciaMaterial> = {
  Limpeza: {
    titulo: "Wound cleansing for pressure ulcers (Cochrane review)",
    url: "https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD004983.pub4/full",
    explicacao: "Revisão sistemática sobre estratégias de limpeza e impacto na cicatrização.",
  },
  "Antissépsia": {
    titulo: "Povidone iodine in wound healing: current concepts and practices",
    url: "https://pubmed.ncbi.nlm.nih.gov/28693375/",
    explicacao: "Revisão clínica sobre antissépticos iodados e controlo de infeção local.",
  },
  Desbridamento: {
    titulo: "Debridement for venous leg ulcers (Cochrane review)",
    url: "https://pubmed.ncbi.nlm.nih.gov/21735417/",
    explicacao: "Evidência sobre técnicas de desbridamento em feridas crónicas.",
  },
  "Gestão de exsudado": {
    titulo: "Hydrofiber dressings in wound care (review)",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC2817785/",
    explicacao: "Revisão sobre materiais absorventes/hidrofibra e desempenho clínico.",
  },
  "Controlo de infeção": {
    titulo: "Effect of silver-containing Hydrofiber dressing on chronic wounds",
    url: "https://pubmed.ncbi.nlm.nih.gov/16618321/",
    explicacao: "Estudo clínico sobre pensos com prata e evolução do leito da ferida.",
  },
  Hemostase: {
    titulo: "Topical haemostatic agents in surgery (systematic review)",
    url: "https://pubmed.ncbi.nlm.nih.gov/34633740/",
    explicacao: "Revisão sobre hemostáticos tópicos e controlo de sangramento.",
  },
  "Proteção da pele perilesional": {
    titulo: "Incontinence-associated dermatitis and skin barrier products",
    url: "https://pubmed.ncbi.nlm.nih.gov/27861176/",
    explicacao: "Evidência para barreira cutânea e proteção da pele fragilizada.",
  },
  Fixação: {
    titulo: "Medical adhesives and patient safety (review)",
    url: "https://pubmed.ncbi.nlm.nih.gov/25376375/",
    explicacao: "Revisão sobre adesivos, fixação e prevenção de lesão cutânea.",
  },
  "Fármacos tópicos": {
    titulo: "Topical steroids for chronic wounds displaying excessive inflammation",
    url: "https://pubmed.ncbi.nlm.nih.gov/17552408/",
    explicacao: "Discussão clínica do uso seletivo de fármacos tópicos em feridas.",
  },
  "Outros pensos úteis": {
    titulo: "Activated charcoal dressings for odor control in wounds",
    url: "https://pubmed.ncbi.nlm.nih.gov/17077872/",
    explicacao: "Evidência de pensos com carvão ativado no controlo de odor.",
  },
};

const evidenciaPorId: Partial<Record<TratamentoId, EvidenciaMaterial>> = {
  "iodopovidona-solucao": evidenciaPorCategoria["Antissépsia"],
  inadine: evidenciaPorCategoria["Antissépsia"],
  "aquacel-ag": evidenciaPorCategoria["Controlo de infeção"],
  "aquacel-ag-infeccao": evidenciaPorCategoria["Controlo de infeção"],
  silvercel: evidenciaPorCategoria["Controlo de infeção"],
  "silvercel-infeccao": evidenciaPorCategoria["Controlo de infeção"],
};

export function obterEvidenciaMaterial(id: TratamentoId): EvidenciaMaterial | null {
  if (evidenciaPorId[id]) {
    return evidenciaPorId[id] ?? null;
  }

  const tratamento = getTreatmentById(id);
  if (!tratamento) {
    return null;
  }

  return evidenciaPorCategoria[tratamento.categoria] ?? null;
}
