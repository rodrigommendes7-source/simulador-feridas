/**
 * Motor de avaliação por material.
 *
 * Cada material/técnica é classificado individualmente com base nas variáveis
 * clínicas numéricas da ferida (WoundVariables):
 *   correto   → +1.0 pts
 *   parcial   → +0.5 pts
 *   incorreto → +0.0 pts
 *   bonus     → +0.25 pts adicionais
 */

import { getTreatment, listTreatments } from "./catalog.ts";
import type {
  ApplicationId,
  ApplicationOption,
  CaseTemplate,
  MaterialClassification,
  MaterialFeedback,
  MaterialFeedbackItem,
  MaterialScore,
  WoundVariableCondition,
  WoundVariables,
} from "./types.ts";

// ─── Utilitários de condição ─────────────────────────────────────────────────

/**
 * Verifica se as variáveis da ferida satisfazem TODAS as condições do objecto.
 * Um objecto vazio {} corresponde a "corresponde sempre" (aplicação universal).
 */
function matchesAllConditions(
  woundVars: WoundVariables,
  condition: WoundVariableCondition
): boolean {
  for (const rawKey of Object.keys(condition)) {
    const key = rawKey as keyof WoundVariables;
    const allowedValues = condition[key];
    if (!allowedValues) continue;
    const woundValue = woundVars[key] as number;
    if (!allowedValues.includes(woundValue)) return false;
  }
  return true; // vazio → sempre verdadeiro
}

/**
 * Verifica se as variáveis da ferida satisfazem ALGUMA das contraindicações.
 * (lógica OR sobre a lista, AND dentro de cada objecto)
 */
function isContraindicated(
  woundVars: WoundVariables,
  contraindicacoes: WoundVariableCondition[]
): boolean {
  return contraindicacoes.some((condition) => matchesAllConditions(woundVars, condition));
}

// ─── Rótulos legíveis para variáveis numéricas ───────────────────────────────

const WOUND_VARIABLE_LABELS: Record<keyof WoundVariables, Record<number, string>> = {
  exsudado:          { 1: "Sem exsudado", 2: "Leve", 3: "Moderado", 4: "Abundante" },
  infeccao:          { 0: "Ausente", 1: "Sinais locais", 2: "Infeção local", 3: "Infeção sistémica" },
  tecido:            { 1: "Necrose seca", 2: "Fibrina dominante", 3: "Granulação ativa", 4: "Epitelização" },
  odor:              { 0: "Ausente", 1: "Leve", 2: "Moderado", 3: "Intenso" },
  humidade:          { 1: "Seca", 2: "Leve", 3: "Moderada", 4: "Maceração" },
  profundidade:      { 1: "Superficial", 2: "Espessura parcial", 3: "Espessura total", 4: "Estruturas expostas" },
  bordos:            { 1: "Indefinidos", 2: "Irregulares", 3: "Regulares", 4: "Em epitelização" },
  pele_perilesional: { 1: "Macerada", 2: "Frágil", 3: "Eritematosa", 4: "Íntegra" },
  dor:               { 0: "Ausente", 1: "Leve (1–3)", 2: "Moderada (4–6)", 3: "Intensa (7–10)" },
  hemorragia:        { 0: "Ausente", 1: "Leve", 2: "Moderada", 3: "Abundante" },
  etiologia:         { 1: "Pressão", 2: "Venosa", 3: "Arterial", 4: "Diabética", 5: "Traumática", 6: "Cirúrgica" },
  perfusao:          { 0: "Comprometida", 1: "Adequada" },
};

/** Rótulos apresentáveis para as variáveis principais da ferida */
export const WOUND_VARIABLE_DISPLAY_LABELS: Record<keyof WoundVariables, string> = {
  exsudado:          "Exsudado",
  infeccao:          "Infeção",
  tecido:            "Tecido",
  odor:              "Odor",
  humidade:          "Humidade",
  profundidade:      "Profundidade",
  bordos:            "Bordos",
  pele_perilesional: "Pele perilesional",
  dor:               "Dor",
  hemorragia:        "Hemorragia",
  etiologia:         "Etiologia",
  perfusao:          "Perfusão",
};

/** Variáveis principais exibidas por defeito (sem necessidade de "Ver mais") */
export const WOUND_VARIABLES_MAIN: readonly (keyof WoundVariables)[] = [
  "exsudado",
  "infeccao",
  "tecido",
  "profundidade",
];

/** Variáveis secundárias (escondidas atrás de "Ver mais detalhes") */
export const WOUND_VARIABLES_EXTRA: readonly (keyof WoundVariables)[] = [
  "odor",
  "humidade",
  "bordos",
  "pele_perilesional",
  "dor",
  "hemorragia",
  "etiologia",
  "perfusao",
];

/** Converte valor numérico da variável para texto legível */
export function getWoundVariableLabel(key: keyof WoundVariables, value: number): string {
  return WOUND_VARIABLE_LABELS[key]?.[value] ?? String(value);
}

// ─── Geração de justificações ─────────────────────────────────────────────────

function buildJustificacao(
  nome: string,
  classification: MaterialClassification,
  woundVars: WoundVariables,
  condition?: WoundVariableCondition
): string {
  const context = condition
    ? Object.entries(condition)
        .map(([k, vals]) => {
          if (!vals) return "";
          const key = k as keyof WoundVariables;
          const labels = vals.map((v) => getWoundVariableLabel(key, v)).join(" ou ");
          return `${WOUND_VARIABLE_DISPLAY_LABELS[key].toLowerCase()} ${labels}`;
        })
        .filter(Boolean)
        .join(", ")
    : "";

  if (classification === "correto") {
    return context
      ? `${nome} é a escolha ideal: ${context}.`
      : `${nome} é adequado para este leito.`;
  }
  if (classification === "parcial") {
    const exs = getWoundVariableLabel("exsudado", woundVars.exsudado);
    const tec = getWoundVariableLabel("tecido", woundVars.tecido);
    return `${nome} pode ser utilizado mas não é a escolha prioritária (exsudado ${exs}, tecido ${tec}).`;
  }
  return `${nome} está contraindicado para este estado da ferida.`;
}

// ─── Motor de avaliação ───────────────────────────────────────────────────────

/**
 * Avalia um tratamento individualmente face às variáveis clínicas da ferida.
 * Retorna null se o tratamento não existir no catálogo ou não tiver regras.
 */
export function evaluateMaterialForWound(
  treatmentId: string,
  woundVars: WoundVariables
): MaterialScore | null {
  const treatment = getTreatment(treatmentId);
  if (!treatment || !treatment.regras) return null;

  const { regras } = treatment;
  const nome = treatment.nome_comercial ?? treatment.label;

  // 1. Verificar contraindicações (prioridade máxima)
  if (isContraindicated(woundVars, regras.contraindicacoes)) {
    // Encontrar a condição que activou a contraindicação para a justificação
    const matchedCondition = regras.contraindicacoes.find((c) =>
      matchesAllConditions(woundVars, c)
    );
    return {
      materialId: treatmentId,
      label: treatment.label,
      nome_comercial: treatment.nome_comercial,
      substancia_ativa: treatment.substancia_ativa,
      classification: "incorreto",
      score: 0,
      hasBonus: false,
      justificacao: buildJustificacao(nome, "incorreto", woundVars, matchedCondition),
    };
  }

  // 2. Verificar condições ideais (empty = universal)
  const isIdeal = matchesAllConditions(woundVars, regras.condicoes_ideais);

  if (isIdeal) {
    const hasBonus =
      regras.bonus !== undefined && matchesAllConditions(woundVars, regras.bonus);
    return {
      materialId: treatmentId,
      label: treatment.label,
      nome_comercial: treatment.nome_comercial,
      substancia_ativa: treatment.substancia_ativa,
      classification: "correto",
      score: hasBonus ? 1.25 : 1.0,
      hasBonus,
      justificacao: buildJustificacao(nome, "correto", woundVars, regras.condicoes_ideais),
    };
  }

  // 3. Verificar condições parciais
  const isPartial =
    regras.condicoes_parciais !== undefined &&
    matchesAllConditions(woundVars, regras.condicoes_parciais);

  if (isPartial) {
    const hasBonus =
      regras.bonus !== undefined && matchesAllConditions(woundVars, regras.bonus);
    return {
      materialId: treatmentId,
      label: treatment.label,
      nome_comercial: treatment.nome_comercial,
      substancia_ativa: treatment.substancia_ativa,
      classification: "parcial",
      score: hasBonus ? 0.75 : 0.5,
      hasBonus,
      justificacao: buildJustificacao(nome, "parcial", woundVars),
    };
  }

  // 4. Padrão: parcial (não contraindicicado, mas não ideal)
  return {
    materialId: treatmentId,
    label: treatment.label,
    nome_comercial: treatment.nome_comercial,
    substancia_ativa: treatment.substancia_ativa,
    classification: "parcial",
    score: 0.5,
    hasBonus: false,
    justificacao: buildJustificacao(nome, "parcial", woundVars),
  };
}

/**
 * Avalia uma técnica de aplicação face às variáveis clínicas da ferida.
 */
export function evaluateApplicationForWound(
  applicationOption: ApplicationOption,
  woundVars: WoundVariables
): MaterialScore | null {
  if (!applicationOption.regras) return null;

  const { regras } = applicationOption;
  const nome = applicationOption.label;

  if (isContraindicated(woundVars, regras.contraindicacoes)) {
    const matchedCondition = regras.contraindicacoes.find((c) =>
      matchesAllConditions(woundVars, c)
    );
    return {
      materialId: applicationOption.id,
      label: applicationOption.label,
      classification: "incorreto",
      score: 0,
      hasBonus: false,
      justificacao: buildJustificacao(nome, "incorreto", woundVars, matchedCondition),
    };
  }

  const isIdeal = matchesAllConditions(woundVars, regras.condicoes_ideais);
  if (isIdeal) {
    const hasBonus =
      regras.bonus !== undefined && matchesAllConditions(woundVars, regras.bonus);
    return {
      materialId: applicationOption.id,
      label: applicationOption.label,
      classification: "correto",
      score: hasBonus ? 1.25 : 1.0,
      hasBonus,
      justificacao: buildJustificacao(nome, "correto", woundVars, regras.condicoes_ideais),
    };
  }

  const isPartial =
    regras.condicoes_parciais !== undefined &&
    matchesAllConditions(woundVars, regras.condicoes_parciais);

  return {
    materialId: applicationOption.id,
    label: applicationOption.label,
    classification: isPartial ? "parcial" : "parcial",
    score: 0.5,
    hasBonus: false,
    justificacao: buildJustificacao(nome, "parcial", woundVars),
  };
}

/**
 * Avalia todos os tratamentos seleccionados face às variáveis da ferida.
 * Filtra materiais sem regras definidas.
 */
export function evaluateMaterialsForWound(
  treatmentIds: string[],
  woundVars: WoundVariables
): MaterialScore[] {
  return treatmentIds
    .map((id) => evaluateMaterialForWound(id, woundVars))
    .filter((score): score is MaterialScore => score !== null);
}

/**
 * Calcula a pontuação total dos materiais avaliados.
 * correto → 1.0  |  parcial → 0.5  |  incorreto → 0  |  bonus → +0.25
 */
export function calculateMaterialTotalScore(scores: MaterialScore[]): number {
  return scores.reduce((acc, s) => acc + s.score, 0);
}

/**
 * Constrói o feedback estruturado.
 * As sugestões são materiais disponíveis no catálogo, não seleccionados,
 * que seriam "correto" para a ferida actual.
 */
export function buildMaterialFeedback(
  scores: MaterialScore[],
  selectedTreatmentIds: string[],
  woundVars: WoundVariables
): MaterialFeedback {
  const toItem = (s: MaterialScore): MaterialFeedbackItem => ({
    material: s.nome_comercial ?? s.label,
    justificacao: s.justificacao,
  });

  const corretos = scores.filter((s) => s.classification === "correto").map(toItem);
  const parciais = scores.filter((s) => s.classification === "parcial").map(toItem);
  const incorretos = scores.filter((s) => s.classification === "incorreto").map(toItem);

  // Sugestões: materiais do catálogo com regras, não seleccionados, classificados como "correto"
  const selectedSet = new Set(selectedTreatmentIds);
  const sugestoes: MaterialFeedbackItem[] = listTreatments()
    .filter((t) => !selectedSet.has(t.id) && t.regras)
    .map((t) => evaluateMaterialForWound(t.id, woundVars))
    .filter((s): s is MaterialScore => s !== null && s.classification === "correto")
    .slice(0, 3)
    .map(toItem);

  return { corretos, parciais, incorretos, sugestoes };
}

/**
 * Avalia técnicas de aplicação seleccionadas face às variáveis da ferida.
 */
export function evaluateApplicationsForWound(
  selectedApplicationIds: ApplicationId[],
  template: CaseTemplate,
  woundVars: WoundVariables
): MaterialScore[] {
  return selectedApplicationIds
    .map((appId) => {
      const option = template.applicationDefinitions.find((d) => d.id === appId);
      if (!option) return null;
      return evaluateApplicationForWound(option, woundVars);
    })
    .filter((s): s is MaterialScore => s !== null);
}
