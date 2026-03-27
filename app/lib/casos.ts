export type CasoStatus = "disponivel" | "preparacao";

export type CasoCatalogoItem = {
  id: string;
  titulo: string;
  descricao: string;
  competencias: string;
  status: CasoStatus;
};

export const casosCatalogo: CasoCatalogoItem[] = [
  {
    id: "1",
    titulo: "Lesão por pressão",
    descricao:
      "Avaliação de ferida, observação do leito, diálogo com o utente e seleção de abordagem terapêutica.",
    competencias:
      "Observação, colheita de dados, escolha de penso e decisão clínica",
    status: "disponivel",
  },
  {
    id: "2",
    titulo: "Ferida cirúrgica com deiscência",
    descricao:
      "Avaliação de deiscência cirúrgica, suspeita de infeção local, gestão de exsudado e decisão terapêutica.",
    competencias:
      "Infeção, exsudado, desbridamento e seleção de antimicrobianos",
    status: "disponivel",
  },
  {
    id: "3",
    titulo: "Ferida pós-amputação com infeção e exsudado abundante",
    descricao:
      "Avaliação de ferida pós-amputação no pé diabético com exsudado abundante, odor, tecido desvitalizado e maceração perilesional.",
    competencias:
      "Controlo de infeção, gestão de exsudado, desbridamento e proteção perilesional",
    status: "disponivel",
  },
];