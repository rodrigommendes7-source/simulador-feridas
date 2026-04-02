export type TreatmentCategoryDefinition = {
  id: string;
  label: string;
  description: string;
};

export const treatmentCategories: TreatmentCategoryDefinition[] = [
  {
    id: "limpeza",
    label: "Limpeza",
    description: "Soluções e materiais dirigidos à limpeza e irrigação da ferida.",
  },
  {
    id: "antissepsia",
    label: "Antissépsia",
    description: "Produtos para controlo microbiano e antissépsia local.",
  },
  {
    id: "desbridamento",
    label: "Desbridamento",
    description: "Materiais e agentes que promovem remoção de tecido desvitalizado.",
  },
  {
    id: "gestao-exsudado",
    label: "Gestão de exsudado",
    description: "Coberturas absorventes e estratégias de controlo de humidade.",
  },
  {
    id: "controlo-infeccao",
    label: "Controlo de infeção",
    description: "Materiais focados em infeção local, prata e controlo de odor.",
  },
  {
    id: "hemostase",
    label: "Hemostase",
    description: "Agentes hemostáticos para controlo de sangramento.",
  },
  {
    id: "protecao-perilesional",
    label: "Proteção da pele perilesional",
    description: "Produtos de barreira e hidratação da pele peri-ferida.",
  },
  {
    id: "fixacao",
    label: "Fixação",
    description: "Materiais de fixação e suporte do penso.",
  },
  {
    id: "farmacos-topicos",
    label: "Fármacos tópicos",
    description: "Fármacos tópicos com indicação contextual.",
  },
  {
    id: "outros",
    label: "Outros pensos úteis",
    description: "Materiais complementares úteis em cenários específicos.",
  },
];
