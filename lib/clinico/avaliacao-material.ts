/**
 * Motor de avaliação por material.
 *
 * Cada material/técnica é classificado individualmente com base nas variáveis
 * clínicas numéricas da ferida (VariaveisFerida):
 *   correto   → +1.0 pts
 *   parcial   → +0.5 pts
 *   incorreto → +0.0 pts
 *   bonus     → +0.25 pts adicionais
 */

import { obterTratamento, listarTratamentos } from "./catalogo.ts";
import type {
  IdAplicacao,
  OpcaoAplicacao,
  ModeloCaso,
  ClassificacaoMaterial,
  FeedbackMaterial,
  ItemFeedbackMaterial,
  PontuacaoMaterial,
  CondicaoVariavelFerida,
  VariaveisFerida,
} from "./types.ts";

// ─── Utilitários de condição ─────────────────────────────────────────────────

/**
 * Verifica se as variáveis da ferida satisfazem TODAS as condições do objecto.
 * Um objecto vazio {} corresponde a "corresponde sempre" (aplicação universal).
 */
function satisfazTodasCondicoes(
  variavelFerida: VariaveisFerida,
  condition: CondicaoVariavelFerida
): boolean {
  for (const rawKey of Object.keys(condition)) {
    const key = rawKey as keyof VariaveisFerida;
    const allowedValues = condition[key];
    if (!allowedValues) continue;
    const woundValue = variavelFerida[key] as number;
    if (!allowedValues.includes(woundValue)) return false;
  }
  return true; // vazio → sempre verdadeiro
}

/**
 * Verifica se as variáveis da ferida satisfazem ALGUMA das contraindicações.
 * (lógica OR sobre a lista, AND dentro de cada objecto)
 */
function eContraindicado(
  variavelFerida: VariaveisFerida,
  contraindicacoes: CondicaoVariavelFerida[]
): boolean {
  return contraindicacoes.some((condition) => satisfazTodasCondicoes(variavelFerida, condition));
}

// ─── Rótulos legíveis para variáveis numéricas ───────────────────────────────

const ROTULOS_VARIAVEIS_FERIDA: Record<keyof VariaveisFerida, Record<number, string>> = {
  exsudado:          { 1: "Sem exsudado", 2: "Leve", 3: "Moderado", 4: "Abundante" },
  infeccao:          { 0: "Ausente", 1: "Sinais locais", 2: "Infeção local", 3: "Infeção sistémica" },
  tecido:            { 1: "Necrose seca", 2: "Fibrina dominante", 3: "Granulação ativa", 4: "Epitelização", 5: "Hipergranulação" },
  odor:              { 0: "Ausente", 1: "Leve", 2: "Moderado", 3: "Intenso" },
  bordos:            { 1: "Íntegros", 2: "Ruborizados", 3: "Macerados", 4: "Hiperqueratosados", 5: "Frágil" },
  pele_perilesional: { 1: "Íntegra", 2: "Frágil", 3: "Macerada", 4: "Ruborizada" },
};

/** Rótulos apresentáveis para as variáveis principais da ferida */
export const ROTULOS_EXIBICAO_VARIAVEIS_FERIDA: Record<keyof VariaveisFerida, string> = {
  exsudado:          "Exsudado",
  infeccao:          "Infeção",
  tecido:            "Tecido",
  odor:              "Odor",
  bordos:            "Bordos",
  pele_perilesional: "Pele perilesional",
};

/** @deprecated Use ROTULOS_EXIBICAO_VARIAVEIS_FERIDA */
export const WOUND_VARIABLE_DISPLAY_LABELS = ROTULOS_EXIBICAO_VARIAVEIS_FERIDA;

/** Variáveis principais exibidas por defeito */
export const VARIAVEIS_FERIDA_PRINCIPAIS: readonly (keyof VariaveisFerida)[] = [
  "exsudado",
  "infeccao",
  "tecido",
  "odor",
];

/** @deprecated Use VARIAVEIS_FERIDA_PRINCIPAIS */
export const WOUND_VARIABLES_MAIN = VARIAVEIS_FERIDA_PRINCIPAIS;

/** Variáveis secundárias (escondidas atrás de "Ver mais detalhes") */
export const VARIAVEIS_FERIDA_EXTRAS: readonly (keyof VariaveisFerida)[] = [
  "bordos",
  "pele_perilesional",
];

/** @deprecated Use VARIAVEIS_FERIDA_EXTRAS */
export const WOUND_VARIABLES_EXTRA = VARIAVEIS_FERIDA_EXTRAS;

/** Converte valor numérico da variável para texto legível */
export function obterRotuloVariavelFerida(key: keyof VariaveisFerida, value: number): string {
  return ROTULOS_VARIAVEIS_FERIDA[key]?.[value] ?? String(value);
}

/** @deprecated Use obterRotuloVariavelFerida */
export const getWoundVariableLabel = obterRotuloVariavelFerida;

// ─── Geração de justificações ─────────────────────────────────────────────────

function buildJustificacao(
  nome: string,
  classification: ClassificacaoMaterial,
  variavelFerida: VariaveisFerida,
  condition?: CondicaoVariavelFerida
): string {
  const context = condition
    ? Object.entries(condition)
        .map(([k, vals]) => {
          if (!vals) return "";
          const key = k as keyof VariaveisFerida;
          const labels = vals.map((v) => obterRotuloVariavelFerida(key, v)).join(" ou ");
          return `${ROTULOS_EXIBICAO_VARIAVEIS_FERIDA[key].toLowerCase()} ${labels}`;
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
    const exs = obterRotuloVariavelFerida("exsudado", variavelFerida.exsudado);
    const tec = obterRotuloVariavelFerida("tecido", variavelFerida.tecido);
    return `${nome} pode ser utilizado mas não é a escolha prioritária (exsudado ${exs}, tecido ${tec}).`;
  }
  return `${nome} está contraindicado para este estado da ferida.`;
}

// ─── Motor de avaliação ───────────────────────────────────────────────────────

/**
 * Avalia um tratamento individualmente face às variáveis clínicas da ferida.
 * Retorna null se o tratamento não existir no catálogo ou não tiver regras.
 */
export function avaliarMaterialParaFerida(
  idTratamento: string,
  variavelFerida: VariaveisFerida
): PontuacaoMaterial | null {
  const tratamento = obterTratamento(idTratamento);
  if (!tratamento || !tratamento.regras) return null;

  const { regras } = tratamento;
  const nome = tratamento.nome_comercial ?? tratamento.rotulo;

  // 1. Verificar contraindicações (prioridade máxima)
  if (eContraindicado(variavelFerida, regras.contraindicacoes)) {
    const matchedCondition = regras.contraindicacoes.find((c) =>
      satisfazTodasCondicoes(variavelFerida, c)
    );
    return {
      idMaterial: idTratamento,
      rotulo: tratamento.rotulo,
      nome_comercial: tratamento.nome_comercial,
      substancia_ativa: tratamento.substancia_ativa,
      classificacao: "incorreto",
      pontuacao: 0,
      temBonus: false,
      justificacao: buildJustificacao(nome, "incorreto", variavelFerida, matchedCondition),
    };
  }

  // 2. Verificar condições ideais (empty = universal)
  const isIdeal = satisfazTodasCondicoes(variavelFerida, regras.condicoes_ideais);

  if (isIdeal) {
    const temBonus =
      regras.bonus !== undefined && satisfazTodasCondicoes(variavelFerida, regras.bonus);
    return {
      idMaterial: idTratamento,
      rotulo: tratamento.rotulo,
      nome_comercial: tratamento.nome_comercial,
      substancia_ativa: tratamento.substancia_ativa,
      classificacao: "correto",
      pontuacao: temBonus ? 1.25 : 1.0,
      temBonus,
      justificacao: buildJustificacao(nome, "correto", variavelFerida, regras.condicoes_ideais),
    };
  }

  // 3. Verificar condições parciais
  const isPartial =
    regras.condicoes_parciais !== undefined &&
    satisfazTodasCondicoes(variavelFerida, regras.condicoes_parciais);

  if (isPartial) {
    const temBonus =
      regras.bonus !== undefined && satisfazTodasCondicoes(variavelFerida, regras.bonus);
    return {
      idMaterial: idTratamento,
      rotulo: tratamento.rotulo,
      nome_comercial: tratamento.nome_comercial,
      substancia_ativa: tratamento.substancia_ativa,
      classificacao: "parcial",
      pontuacao: temBonus ? 0.75 : 0.5,
      temBonus,
      justificacao: buildJustificacao(nome, "parcial", variavelFerida),
    };
  }

  // 4. Padrão: parcial (não contraindicado, mas não ideal)
  return {
    idMaterial: idTratamento,
    rotulo: tratamento.rotulo,
    nome_comercial: tratamento.nome_comercial,
    substancia_ativa: tratamento.substancia_ativa,
    classificacao: "parcial",
    pontuacao: 0.5,
    temBonus: false,
    justificacao: buildJustificacao(nome, "parcial", variavelFerida),
  };
}

/** @deprecated Use avaliarMaterialParaFerida */
export const evaluateMaterialForWound = avaliarMaterialParaFerida;

/**
 * Avalia uma técnica de aplicação face às variáveis clínicas da ferida.
 */
export function avaliarAplicacaoParaFerida(
  opcaoAplicacao: OpcaoAplicacao,
  variavelFerida: VariaveisFerida
): PontuacaoMaterial | null {
  if (!opcaoAplicacao.regras) return null;

  const { regras } = opcaoAplicacao;
  const nome = opcaoAplicacao.rotulo;

  if (eContraindicado(variavelFerida, regras.contraindicacoes)) {
    const matchedCondition = regras.contraindicacoes.find((c) =>
      satisfazTodasCondicoes(variavelFerida, c)
    );
    return {
      idMaterial: opcaoAplicacao.id,
      rotulo: opcaoAplicacao.rotulo,
      classificacao: "incorreto",
      pontuacao: 0,
      temBonus: false,
      justificacao: buildJustificacao(nome, "incorreto", variavelFerida, matchedCondition),
    };
  }

  const isIdeal = satisfazTodasCondicoes(variavelFerida, regras.condicoes_ideais);
  if (isIdeal) {
    const temBonus =
      regras.bonus !== undefined && satisfazTodasCondicoes(variavelFerida, regras.bonus);
    return {
      idMaterial: opcaoAplicacao.id,
      rotulo: opcaoAplicacao.rotulo,
      classificacao: "correto",
      pontuacao: temBonus ? 1.25 : 1.0,
      temBonus,
      justificacao: buildJustificacao(nome, "correto", variavelFerida, regras.condicoes_ideais),
    };
  }

  const isPartial =
    regras.condicoes_parciais !== undefined &&
    satisfazTodasCondicoes(variavelFerida, regras.condicoes_parciais);

  return {
    idMaterial: opcaoAplicacao.id,
    rotulo: opcaoAplicacao.rotulo,
    classificacao: isPartial ? "parcial" : "parcial",
    pontuacao: 0.5,
    temBonus: false,
    justificacao: buildJustificacao(nome, "parcial", variavelFerida),
  };
}

/** @deprecated Use avaliarAplicacaoParaFerida */
export const evaluateApplicationForWound = avaliarAplicacaoParaFerida;

/**
 * Avalia todos os tratamentos seleccionados face às variáveis da ferida.
 * Filtra materiais sem regras definidas.
 */
export function avaliarMateriaisParaFerida(
  idsTratamento: string[],
  variavelFerida: VariaveisFerida
): PontuacaoMaterial[] {
  return idsTratamento
    .map((id) => avaliarMaterialParaFerida(id, variavelFerida))
    .filter((score): score is PontuacaoMaterial => score !== null);
}

/** @deprecated Use avaliarMateriaisParaFerida */
export const evaluateMaterialsForWound = avaliarMateriaisParaFerida;

/**
 * Calcula a pontuação total dos materiais avaliados.
 * correto → 1.0  |  parcial → 0.5  |  incorreto → 0  |  bonus → +0.25
 */
export function calcularPontuacaoTotalMaterial(scores: PontuacaoMaterial[]): number {
  return scores.reduce((acc, s) => acc + s.pontuacao, 0);
}

/** @deprecated Use calcularPontuacaoTotalMaterial */
export const calculateMaterialTotalScore = calcularPontuacaoTotalMaterial;

/**
 * Constrói o feedback estruturado.
 * As sugestões são materiais disponíveis no catálogo, não seleccionados,
 * que seriam "correto" para a ferida actual.
 */
export function construirFeedbackMaterial(
  scores: PontuacaoMaterial[],
  idsTratamentoSelecionados: string[],
  variavelFerida: VariaveisFerida
): FeedbackMaterial {
  const toItem = (s: PontuacaoMaterial): ItemFeedbackMaterial => ({
    material: s.nome_comercial ?? s.rotulo,
    justificacao: s.justificacao,
  });

  const corretos = scores.filter((s) => s.classificacao === "correto").map(toItem);
  const parciais = scores.filter((s) => s.classificacao === "parcial").map(toItem);
  const incorretos = scores.filter((s) => s.classificacao === "incorreto").map(toItem);

  const selectedSet = new Set(idsTratamentoSelecionados);
  const sugestoes: ItemFeedbackMaterial[] = listarTratamentos()
    .filter((t) => !selectedSet.has(t.id) && t.regras)
    .map((t) => avaliarMaterialParaFerida(t.id, variavelFerida))
    .filter((s): s is PontuacaoMaterial => s !== null && s.classificacao === "correto")
    .slice(0, 3)
    .map(toItem);

  return { corretos, parciais, incorretos, sugestoes };
}

/** @deprecated Use construirFeedbackMaterial */
export const buildMaterialFeedback = construirFeedbackMaterial;

/**
 * Avalia técnicas de aplicação seleccionadas face às variáveis da ferida.
 */
export function avaliarAplicacoesParaFerida(
  idsAplicacaoSelecionados: IdAplicacao[],
  modelo: ModeloCaso,
  variavelFerida: VariaveisFerida
): PontuacaoMaterial[] {
  return idsAplicacaoSelecionados
    .map((appId) => {
      const option = modelo.definicoesAplicacao.find((d) => d.id === appId);
      if (!option) return null;
      return avaliarAplicacaoParaFerida(option, variavelFerida);
    })
    .filter((s): s is PontuacaoMaterial => s !== null);
}

/** @deprecated Use avaliarAplicacoesParaFerida */
export const evaluateApplicationsForWound = avaliarAplicacoesParaFerida;
