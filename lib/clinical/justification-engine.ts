import type {
  OpcaoJustificacao,
  PerguntaJustificacao,
  DefinicaoTratamento,
  VariaveisFerida,
  ModeloCaso,
} from "./types.ts";
import { obterTratamento, listarTratamentos } from "./catalog.ts";
import {
  variableLabels,
  genericDistractors,
  FALLBACK_CORRETA,
} from "../../data/clinical/justificacoes.ts";

// Shuffle determinístico — Fisher-Yates com PRNG seeded.
// O determinismo é necessário para que gerarPerguntaJustificacao produza a
// mesma ordem de opções entre SSR/CSR e entre execuções dos testes.
function calcularSementeDaString(input: string): number {
  // FNV-1a 32-bit
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function baralharDeterministico<T>(items: T[], seed: string): T[] {
  const rng = mulberry32(calcularSementeDaString(seed));
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function eElegívelParaJustificacao(tratamento: DefinicaoTratamento): boolean {
  return (
    !tratamento.funcoes.includes("limpar") &&
    !tratamento.funcoes.includes("antisseptico")
  );
}

function construirFraseCorreta(
  tratamento: DefinicaoTratamento,
  variavelFerida: VariaveisFerida
): string {
  if (!tratamento.regras) return FALLBACK_CORRETA;

  const { condicoes_ideais } = tratamento.regras;
  const matchedPhrases: string[] = [];

  for (const [key, allowedValues] of Object.entries(condicoes_ideais)) {
    if (!allowedValues || allowedValues.length === 0) continue;
    const variableKey = key as keyof VariaveisFerida;
    const woundValue = variavelFerida[variableKey];
    if (allowedValues.includes(woundValue as number)) {
      const phrase = variableLabels[variableKey]?.[woundValue as number];
      if (phrase) matchedPhrases.push(phrase);
    }
  }

  if (matchedPhrases.length === 0) return FALLBACK_CORRETA;

  const combined = matchedPhrases.join(" + ");
  return combined.charAt(0).toUpperCase() + combined.slice(1);
}

function construirFraseContraindicacao(
  tratamento: DefinicaoTratamento,
  variavelFerida: VariaveisFerida
): string {
  if (!tratamento.regras) return "Este material está contraindicado neste contexto";

  for (const contra of tratamento.regras.contraindicacoes) {
    const violatedKeys: string[] = [];
    let allMatch = true;

    for (const [key, values] of Object.entries(contra)) {
      const variableKey = key as keyof VariaveisFerida;
      const woundValue = variavelFerida[variableKey];
      if (!values || !values.includes(woundValue as number)) {
        allMatch = false;
        break;
      }
      const phrase = variableLabels[variableKey]?.[woundValue as number];
      if (phrase) violatedKeys.push(phrase);
    }

    if (allMatch && violatedKeys.length > 0) {
      return `Este material está contraindicado: ${violatedKeys.join(" + ")}`;
    }
  }

  return "Este material está contraindicado neste contexto";
}

function classificarTipoPergunta(
  tratamento: DefinicaoTratamento,
  variavelFerida: VariaveisFerida
): PerguntaJustificacao["tipo"] {
  if (!tratamento.regras) return "sem-correspondencia";

  for (const contra of tratamento.regras.contraindicacoes) {
    let allMatch = true;
    for (const [key, values] of Object.entries(contra)) {
      const variableKey = key as keyof VariaveisFerida;
      const woundValue = variavelFerida[variableKey];
      if (!values || !values.includes(woundValue as number)) {
        allMatch = false;
        break;
      }
    }
    if (allMatch) return "contraindicado";
  }

  const { condicoes_ideais } = tratamento.regras;
  let allIdealMatch = true;
  let hasIdealConditions = false;
  for (const [key, values] of Object.entries(condicoes_ideais)) {
    if (!values || values.length === 0) continue;
    hasIdealConditions = true;
    const variableKey = key as keyof VariaveisFerida;
    const woundValue = variavelFerida[variableKey];
    if (!values.includes(woundValue as number)) {
      allIdealMatch = false;
      break;
    }
  }
  if (hasIdealConditions && allIdealMatch) return "correspondencia-ideal";

  return "redundante";
}

function construirDistratores(
  correctPhrase: string,
  variavelFerida: VariaveisFerida,
  idTratamento: string,
  seed: string,
  count = 3
): string[] {
  const candidates = new Set<string>();

  const allTreatments = listarTratamentos();
  for (const other of allTreatments) {
    if (other.id === idTratamento || !other.regras) continue;
    for (const [key, values] of Object.entries(other.regras.condicoes_ideais)) {
      if (!values || values.length === 0) continue;
      const variableKey = key as keyof VariaveisFerida;
      for (const v of values) {
        const woundValue = variavelFerida[variableKey];
        if (v !== woundValue) {
          const phrase = variableLabels[variableKey]?.[v];
          if (phrase) {
            const formatted = phrase.charAt(0).toUpperCase() + phrase.slice(1);
            if (formatted !== correctPhrase) candidates.add(formatted);
          }
        }
      }
    }
  }

  for (const g of genericDistractors) {
    if (g !== correctPhrase) candidates.add(g);
  }

  const shuffled = baralharDeterministico(Array.from(candidates), `${seed}:distractors`);
  return shuffled.slice(0, count);
}

export function gerarPerguntaJustificacao(
  idTratamento: string,
  modelo: ModeloCaso
): PerguntaJustificacao | null {
  const tratamento = obterTratamento(idTratamento);
  if (!tratamento) return null;
  if (!eElegívelParaJustificacao(tratamento)) return null;
  if (!modelo.variavelFerida) return null;

  const tipo = classificarTipoPergunta(tratamento, modelo.variavelFerida);

  const override = modelo.justificacoesOverride?.[idTratamento];
  if (override) {
    return {
      idTratamento,
      rotuloTratamento: tratamento.rotulo,
      opcoes: override.opcoes,
      idOpcaoCorreta: override.idOpcaoCorreta,
      tipo,
    };
  }

  const seed = `${modelo.id}:${idTratamento}`;

  let correctPhrase: string;
  if (tipo === "contraindicado") {
    correctPhrase = construirFraseContraindicacao(tratamento, modelo.variavelFerida);
  } else {
    correctPhrase = construirFraseCorreta(tratamento, modelo.variavelFerida);
  }

  const distractors = construirDistratores(
    correctPhrase,
    modelo.variavelFerida,
    idTratamento,
    seed
  );

  const correctOption: OpcaoJustificacao = { id: "correto", texto: correctPhrase };
  const distractorOptions: OpcaoJustificacao[] = distractors.map((texto, i) => ({
    id: `d${i + 1}`,
    texto,
  }));

  const allOptions = baralharDeterministico(
    [correctOption, ...distractorOptions],
    `${seed}:options`
  );

  return {
    idTratamento,
    rotuloTratamento: tratamento.rotulo,
    opcoes: allOptions,
    idOpcaoCorreta: "correto",
    tipo,
  };
}

export function gerarTodasPerguntasJustificacao(
  idsTratamento: string[],
  modelo: ModeloCaso
): PerguntaJustificacao[] {
  const questions: PerguntaJustificacao[] = [];
  for (const id of idsTratamento) {
    const q = gerarPerguntaJustificacao(id, modelo);
    if (q) questions.push(q);
  }
  return questions;
}

// ─── Re-exports com nomes antigos para compatibilidade ───────────────────────
/** @deprecated Use gerarPerguntaJustificacao */
export const generateJustificationQuestion = gerarPerguntaJustificacao;
/** @deprecated Use gerarTodasPerguntasJustificacao */
export const generateAllJustificationQuestions = gerarTodasPerguntasJustificacao;
/** @deprecated Use eElegívelParaJustificacao */
export const isEligibleForJustification = eElegívelParaJustificacao;
