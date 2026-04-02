import type { TratamentoId } from "@/app/types/simulador";

export type EvidenciaMaterial = {
  titulo: string;
  url: string;
  explicacao: string;
};

function criarEvidencia(
  titulo: string,
  url: string,
  explicacao: string
): EvidenciaMaterial {
  return { titulo, url, explicacao };
}

const AGUA_LIMPEZA = criarEvidencia(
  "Water for wound cleansing",
  "https://pubmed.ncbi.nlm.nih.gov/22336796/",
  "Revisao Cochrane sobre limpeza de feridas e irrigacao com agua ou solucao salina."
);

const OCTENIDINA_EFICACIA = criarEvidencia(
  "Consensus on wound antisepsis: update 2018",
  "https://pubmed.ncbi.nlm.nih.gov/29790897/",
  "Atualizacao sobre antissepsia local, com foco na eficacia da octenidina e de outros antissepticos."
);

const IODOPOVIDONA = criarEvidencia(
  "Povidone iodine in wound healing: a review of current concepts and practices",
  "https://pubmed.ncbi.nlm.nih.gov/28648795/",
  "Revisao clinica do papel da iodopovidona no controlo microbiano e na cicatrizacao."
);

const OCTENIDINA = criarEvidencia(
  "Octenidine dihydrochloride: chemical characteristics and antimicrobial properties",
  "https://pmc.ncbi.nlm.nih.gov/articles/PMC5052105/",
  "Revisao das propriedades antimicrobianas da octenidina e do seu uso topico."
);

const COLAGENASE = criarEvidencia(
  "Enzymatic wound debridement",
  "https://pubmed.ncbi.nlm.nih.gov/19918148/",
  "Revisao sobre desbridamento enzimatico com destaque para a colagenase."
);

const EWMA_WBP = criarEvidencia(
  "EWMA Position Document: Wound bed preparation",
  "https://ewma.org/resources/wound-bed-preparation-in-practice/",
  "Documento de referencia sobre preparacao do leito da ferida e desbridamento autolitico."
);

const HIDROCOLOIDES = criarEvidencia(
  "Hydrocolloid dressings in the management of acute wounds: a review of the literature",
  "https://pubmed.ncbi.nlm.nih.gov/19146562/",
  "Revisao sobre hidrocoloides e carboximetilcelulose em feridas com baixo exsudado."
);

const HIDROFIBRA = criarEvidencia(
  "Hydrofiber technology: its role in exudate management",
  "https://pubmed.ncbi.nlm.nih.gov/24527288/",
  "Referencia sobre hidrofibra e carboximetilcelulose na gestao do exsudado."
);

const MEL = criarEvidencia(
  "The potential of honey to promote oral wellness",
  "https://pubmed.ncbi.nlm.nih.gov/11710316/",
  "Referencia classica de Peter Molan frequentemente usada para suporte ao uso terapeutico do mel."
);

const URGOCLEAN = criarEvidencia(
  "Evaluation of a TLC-NOSF dressing in real life practice",
  "https://pubmed.ncbi.nlm.nih.gov/23103478/",
  "Estudo clinico usado como suporte aos pensos lipido-coloides bioativos da gama Urgo."
);

const DESBRIDAMENTO = criarEvidencia(
  "Debridement",
  "https://pubmed.ncbi.nlm.nih.gov/15530741/",
  "Revisao sobre principios e impacto clinico do desbridamento no controlo do leito da ferida."
);

const ALGINATOS = criarEvidencia(
  "Alginate dressings in surgery and wound management-part 1",
  "https://pubmed.ncbi.nlm.nih.gov/11915683/",
  "Revisao sobre alginatos de calcio e sua utilidade em feridas exsudativas."
);

const SUPERABSORVENTES = criarEvidencia(
  "Exudate management made easy",
  "https://woundsinternational.com/wp-content/uploads/2023/02/content_10374.pdf",
  "Documento pratico da Wounds International sobre gestao de exsudado e materiais superabsorventes."
);

const ESPUMAS = criarEvidencia(
  "Foam dressings: a review",
  "https://pubmed.ncbi.nlm.nih.gov/22306877/",
  "Revisao sobre espumas de poliuretano para feridas com exsudado moderado."
);

const PVA_SUPERABSORVENTE = criarEvidencia(
  "Superabsorbent wound dressings: a literature review",
  "https://wounds-uk.com/wp-content/uploads/2023/02/content_10917.pdf",
  "Revisao de suporte para materiais superabsorventes e fibras com elevada retencao de exsudado."
);

const PRATA = criarEvidencia(
  "Appropriate use of silver dressings in wounds: international consensus document",
  "https://pubmed.ncbi.nlm.nih.gov/22994382/",
  "Consenso internacional sobre indicacoes e limites dos pensos com prata."
);

const SULFADIAZINA_PRATA = criarEvidencia(
  "Effect of silver on burn wound infection control and healing: review of the literature",
  "https://pubmed.ncbi.nlm.nih.gov/17306990/",
  "Revisao sobre o papel da prata, incluindo sulfadiazina de prata, em queimaduras e infeccao."
);

const CARVAO_ATIVADO = criarEvidencia(
  "Activated charcoal dressings for control of wound odour",
  "https://pubmed.ncbi.nlm.nih.gov/17077872/",
  "Referencia sobre controlo do odor com pensos de carvao ativado."
);

const HEMOSTASE = criarEvidencia(
  "Hemostats, sealants, and adhesives: a practical guide for the surgeon",
  "https://pubmed.ncbi.nlm.nih.gov/20400115/",
  "Revisao pratica sobre hemostaticos topicos, incluindo esponjas de gelatina."
);

const PELE_BARREIRA = criarEvidencia(
  "Consider skin hygiene and care beyond the wound",
  "https://pmc.ncbi.nlm.nih.gov/articles/PMC3601933/",
  "Revisao sobre barreiras cutaneas, oxido de zinco e protecao da pele fragilizada."
);

const EMOLIENTES = criarEvidencia(
  "The clinical benefit of moisturizers",
  "https://pubmed.ncbi.nlm.nih.gov/14556631/",
  "Revisao sobre emolientes, creme gordo e parafina na restauracao da barreira cutanea."
);

const POLIMERO_ACRILICO = criarEvidencia(
  "Incontinence-associated dermatitis: a comprehensive review and update",
  "https://pubmed.ncbi.nlm.nih.gov/22156907/",
  "Revisao ampla sobre protecao da pele perilesional e produtos barreira."
);

const BETAMETASONA = criarEvidencia(
  "Choosing topical corticosteroids",
  "https://www.aafp.org/pubs/afp/issues/2009/0115/p135.html",
  "Revisao pratica sobre corticosteroides topicos, incluindo potencia e seguranca."
);

const LIPIDOCOLOIDES = criarEvidencia(
  "Evaluation of a lipidocolloid wound dressing in a clinical setting",
  "https://pubmed.ncbi.nlm.nih.gov/12484692/",
  "Estudo clinico sobre pensos de contacto lipido-coloides."
);

const evidenciaPorId: Partial<Record<TratamentoId, EvidenciaMaterial[]>> = {
  "cloreto-sodio-09": [AGUA_LIMPEZA],
  "octenilin-solucao-lavagem": [OCTENIDINA_EFICACIA],
  "iodopovidona-solucao": [IODOPOVIDONA],
  inadine: [IODOPOVIDONA],
  "octenidina-gel": [OCTENIDINA],
  octiset: [OCTENIDINA],
  colagenase: [COLAGENASE],
  hidrogel: [EWMA_WBP],
  "hidrogel-ferida-seca": [EWMA_WBP],
  "hidrocoloide-vari-hesive": [HIDROCOLOIDES],
  "vari-hesive-extra-fino": [HIDROCOLOIDES],
  "vari-hesive-sem-rebordo": [HIDROCOLOIDES],
  "hidrocoloide-gestao": [HIDROCOLOIDES],
  "urgo-clean": [URGOCLEAN],
  "aquacel-simples": [HIDROFIBRA],
  "l-mesitran": [MEL],
  "urgo-start": [URGOCLEAN],
  "irrigacao-soro-desbridamento-mecanico": [AGUA_LIMPEZA, DESBRIDAMENTO],
  vliwasorb: [SUPERABSORVENTES],
  "alginato-hidrogel": [ALGINATOS],
  silvercel: [ALGINATOS, PRATA],
  exufiber: [PVA_SUPERABSORVENTE],
  "aquacel-ag": [HIDROFIBRA, PRATA],
  fibrosol: [HIDROFIBRA],
  allevyn: [ESPUMAS],
  urgotul: [LIPIDOCOLOIDES],
  "allevyn-ag": [ESPUMAS, PRATA],
  "actisorb-plus-prata": [CARVAO_ATIVADO, PRATA],
  "aquacel-ag-infeccao": [HIDROFIBRA, PRATA],
  "exufiber-ag": [PVA_SUPERABSORVENTE, PRATA],
  "silvercel-infeccao": [ALGINATOS, PRATA],
  "urgotul-ag": [LIPIDOCOLOIDES, PRATA],
  "sulfadiazina-prata": [SULFADIAZINA_PRATA],
  "carvao-ativado": [CARVAO_ATIVADO],
  "esponja-hemostatica-gelatina": [HEMOSTASE],
  "oxido-zinco": [PELE_BARREIRA],
  "creme-gordo": [EMOLIENTES],
  "creme-hidratante": [EMOLIENTES],
  "parafina-liquida": [EMOLIENTES],
  "protetor-polimero-acrilico-spray": [POLIMERO_ACRILICO],
  betametasona: [BETAMETASONA],
  "actisorb-carvao": [CARVAO_ATIVADO],
  "allevyn-non-adhesive-cobertura": [ESPUMAS],
};

export function obterEvidenciasMaterial(id: TratamentoId): EvidenciaMaterial[] {
  return evidenciaPorId[id] ?? [];
}

export function obterEvidenciaMaterial(id: TratamentoId): EvidenciaMaterial | null {
  return obterEvidenciasMaterial(id)[0] ?? null;
}
