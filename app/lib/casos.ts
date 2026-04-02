import { listCases } from "@/lib/cases";

export type CasoStatus = "disponivel" | "preparacao";

export type CasoCatalogoItem = {
  id: string;
  titulo: string;
  descricao: string;
  competencias: string;
  status: CasoStatus;
};

export const casosCatalogo: CasoCatalogoItem[] = listCases().map((item) => ({
  id: item.id,
  titulo: item.title,
  descricao: item.description,
  competencias: item.competencies,
  status: item.status,
}));
