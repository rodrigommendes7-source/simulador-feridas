import type { ReferenciaEvidencia } from "../../lib/clinical/types.ts";

export const evidenceReferences: ReferenciaEvidencia[] = [
  // ─── Guidelines internacionais transversais ────────────────────────────────
  {
    id: "epuap-2019",
    titulo: "EPUAP/NPIAP/PPPIA — Prevention and Treatment of Pressure Ulcers/Injuries: Clinical Practice Guideline (3rd ed., 2019)",
    url: "https://www.internationalguideline.com/2019",
    resumo: "Guideline internacional de referência para prevenção e tratamento de UPP. A 4ª edição está em rollout (2025); a 3ª edição mantém-se a versão completa de referência.",
  },
  {
    id: "epuap-pt-qrg",
    titulo: "Prevenção e Tratamento de Úlceras por Pressão — Guia de Consulta Rápida (edição portuguesa, 2014)",
    url: "https://www.sociedadeferidas.pt/Prevencao_e_Tratamento_de_Ulceras.pdf",
    resumo: "Tradução portuguesa do Quick Reference Guide EPUAP/NPIAP/PPPIA, alojada pela Sociedade Portuguesa de Feridas (ELCOS). Útil para consulta em PT.",
  },
  {
    id: "iwgdf-2023-practical",
    titulo: "IWGDF — Practical guidelines on the prevention and management of diabetes-related foot disease (2023 update)",
    url: "https://pubmed.ncbi.nlm.nih.gov/37243927/",
    resumo: "Atualização 2023 das guidelines práticas para prevenção e tratamento do pé diabético, incluindo classificação, descarga, infeção e cicatrização.",
  },
  {
    id: "iwgdf-idsa-2023-infection",
    titulo: "IWGDF/IDSA — Guidelines on the Diagnosis and Treatment of Diabetes-related Foot Infections (2023)",
    url: "https://pubmed.ncbi.nlm.nih.gov/37779457/",
    resumo: "Guideline conjunta IWGDF/IDSA 2023 sobre diagnóstico e tratamento de infeção do pé diabético — critérios de gravidade, antibioterapia, escalada cirúrgica.",
  },
  {
    id: "iwii-2022",
    titulo: "IWII — Wound Infection in Clinical Practice: International Consensus Update (2022)",
    url: "https://pubmed.ncbi.nlm.nih.gov/35797226/",
    resumo: "Consenso IWII 2022 sobre o continuum de infeção em feridas (contaminação → colonização → infeção local → propagação → sistémica) e gestão do biofilme.",
  },

  // ─── Wound Bed Preparation / TIME ──────────────────────────────────────────
  {
    id: "wbp-2024",
    titulo: "Wound Bed Preparation 2024 — Delphi Consensus on Foot Ulcer Management (Smart, Sibbald et al.)",
    url: "https://pubmed.ncbi.nlm.nih.gov/38354304/",
    resumo: "8ª iteração do paradigma Wound Bed Preparation (2024), via Delphi internacional. Reforça os 3 pilares: tecido (desbridamento), inflamação/infeção (biofilme) e equilíbrio da humidade (exsudado).",
  },
  {
    id: "wbp-2021",
    titulo: "Wound Bed Preparation 2021 (Sibbald et al.)",
    url: "https://pubmed.ncbi.nlm.nih.gov/33739948/",
    resumo: "Atualização 2021 do framework Wound Bed Preparation, integrando avaliação holística, comorbilidades, microambiente e progressão da cicatrização.",
  },

  // ─── Tecidos, leito da ferida, desbridamento ───────────────────────────────
  {
    id: "debridement-review",
    titulo: "Schultz et al. — Wound bed preparation: a systematic approach to wound management",
    url: "https://pubmed.ncbi.nlm.nih.gov/15530741/",
    resumo: "Artigo seminal sobre preparação do leito da ferida e princípios de desbridamento. Mantém-se como referência canónica.",
  },
  {
    id: "collagenase-review",
    titulo: "Ramundo & Gray — Collagenase for enzymatic debridement: a systematic review",
    url: "https://pubmed.ncbi.nlm.nih.gov/19918148/",
    resumo: "Revisão sistemática sobre desbridamento enzimático com colagenase em feridas crónicas.",
  },
  {
    id: "wounds-intl-autolytic-2025",
    titulo: "Wounds International — Autolytic continuous debridement with a focus on biofilm management (Made Easy, 2025)",
    url: "https://woundsinternational.com/made-easy/autolytic-continuous-debridement-with-a-focus-on-biofilm-management/",
    resumo: "Documento prático Wounds International 2025 sobre desbridamento autolítico contínuo, com foco na gestão do biofilme. Aborda hidrogéis, hidrocolóides e seleção do método.",
  },

  // ─── Gestão do exsudado ────────────────────────────────────────────────────
  {
    id: "hydrofiber-review",
    titulo: "Walker & Parsons — Hydrofiber technology: its role in exudate management",
    url: "https://pubmed.ncbi.nlm.nih.gov/24527288/",
    resumo: "Revisão sobre tecnologia hidrofibra (carboximetilcelulose) na gestão do exsudado moderado a abundante.",
  },
  {
    id: "alginate-review",
    titulo: "Thomas — Alginate dressings in surgery and wound management",
    url: "https://pubmed.ncbi.nlm.nih.gov/11915683/",
    resumo: "Revisão sobre alginatos em feridas cirúrgicas e crónicas exsudativas.",
  },
  {
    id: "foam-review",
    titulo: "Pensos de espuma — revisão clínica",
    url: "https://pubmed.ncbi.nlm.nih.gov/22306877/",
    resumo: "Revisão clínica sobre pensos de espuma de poliuretano para exsudado moderado, incluindo versões com prata e com rebordo.",
  },
  {
    id: "wuwhs-exudate-2019",
    titulo: "WUWHS — Wound Exudate: Effective Assessment and Management (consensus, 2019)",
    url: "https://woundsinternational.com/consensus-documents/wuwhs-consensus-document-wound-exudate-effective-assessment-and-management/",
    resumo: "Documento de consenso WUWHS sobre avaliação e gestão do exsudado: caracterização, escolha do material absorvente, sinais de extravasamento e maceração.",
  },

  // ─── Antimicrobianos / antissépticos / prata ───────────────────────────────
  {
    id: "silver-consensus",
    titulo: "Wounds International — Appropriate use of silver dressings in wounds (consensus)",
    url: "https://pubmed.ncbi.nlm.nih.gov/22994382/",
    resumo: "Consenso internacional Wounds International sobre uso apropriado de pensos com prata: critérios de início, duração de 2 semanas e reavaliação.",
  },
  {
    id: "aptferidas-infecao-2025",
    titulo: "APTFeridas — White Paper: Material de penso de ação terapêutica para a gestão da inflamação e da infeção (2025)",
    url: "https://www.aptferidas.com/Ficheiros/White%20Paper/APTFeridas%20-%20WhitePaper%20VT%20MatPenso%20A%C3%A7Terap%20GIeI.pdf",
    resumo: "White Paper APTFeridas 2025, em PT, sobre seleção de material de penso para inflamação e infeção. Cobre prata, iodopovidona, PHMB, octenidina e mel medicinal.",
  },
  {
    id: "antiseptic-review-2022",
    titulo: "Sandri et al. — Antiseptic Agents for Chronic Wounds: A Systematic Review (Antibiotics, 2022)",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8944418/",
    resumo: "Revisão sistemática 2022 dos principais antissépticos em feridas crónicas: iodopovidona, cadexómero de iodo, polihexanida (PHMB), octenidina e clorhexidina.",
  },

  // ─── Feridas agudas e cirúrgicas ───────────────────────────────────────────
  {
    id: "aptferidas-agudas-2025",
    titulo: "APTFeridas — White Paper: Feridas Agudas, Não Cirúrgicas, mas Complexas (modelo C.O.R.E., 2025)",
    url: "https://www.aptferidas.com/Ficheiros/White%20Paper/APTFeridas%20-%20WhitePaper%20FerAgudas%20C2025.pdf",
    resumo: "White Paper APTFeridas 2025, em PT, com o modelo C.O.R.E. para abordagem de feridas agudas complexas. Útil para casos traumáticos e com risco de cronicidade.",
  },

  // ─── Limpeza / soro / proteção peri-ferida ─────────────────────────────────
  {
    id: "water-cleansing",
    titulo: "Fernandez & Griffiths — Water for wound cleansing (Cochrane Review, 2012)",
    url: "https://pubmed.ncbi.nlm.nih.gov/22336796/",
    resumo: "Revisão Cochrane sobre limpeza de feridas com água potável vs. solução salina. Não há evidência de superioridade entre os dois métodos.",
  },
  {
    id: "skin-barrier-review",
    titulo: "Higiene cutânea e proteção peri-ferida — revisão",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3601933/",
    resumo: "Revisão sobre proteção peri-ferida e barreiras cutâneas (películas em spray, óxido de zinco, hidrocolóide perilesional).",
  },

  // ─── Outros materiais específicos ──────────────────────────────────────────
  {
    id: "odor-review",
    titulo: "Pensos de carvão ativado no controlo do odor em feridas",
    url: "https://pubmed.ncbi.nlm.nih.gov/17077872/",
    resumo: "Referência canónica sobre carvão ativado para controlo do odor — relevante em feridas com colonização anaeróbia.",
  },
  {
    id: "honey-cochrane-2015",
    titulo: "Jull et al. — Honey as a topical treatment for wounds (Cochrane Review, 2015)",
    url: "https://pubmed.ncbi.nlm.nih.gov/25742878/",
    resumo: "Revisão Cochrane 2015 sobre mel medicinal em feridas: evidência de benefício em queimaduras parciais e cicatrização de feridas pós-operatórias contaminadas.",
  },
  {
    id: "hydrogel-cochrane-2013",
    titulo: "Dumville et al. — Hydrogel dressings for healing diabetic foot ulcers (Cochrane Review, 2013)",
    url: "https://pubmed.ncbi.nlm.nih.gov/23846869/",
    resumo: "Revisão Cochrane sobre hidrogéis em úlceras diabéticas: alguma evidência de benefício no desbridamento autolítico de tecido desvitalizado.",
  },

  // ─── Documentos portugueses ────────────────────────────────────────────────
  {
    id: "dgs-017-2011",
    titulo: "Norma DGS 017/2011 — Escala de Braden: versão adulto e pediátrica",
    url: "https://www.dgs.pt/departamento-da-qualidade-na-saude/ficheiros-anexos/orientacao_ulceraspdf-pdf.aspx",
    resumo: "Norma DGS 2011 que estabelece a Escala de Braden como instrumento de avaliação do risco de UPP em Portugal, adulto e pediátrico.",
  },
  {
    id: "aptferidas-estagnada-2025",
    titulo: "APTFeridas — White Paper: Material de penso de ação terapêutica para a gestão da ferida estagnada (2025)",
    url: "https://www.aptferidas.com/Ficheiros/White%20Paper/APTFeridas%20-%20WhitePaper%20VT%20MatPenso%20A%C3%A7Terap%20FerEstag.pdf",
    resumo: "White Paper APTFeridas 2025, em PT, sobre material de penso para ferida estagnada (regeneração e remodelação). Inclui matrizes moduladoras de proteases e bioativos.",
  },
];
