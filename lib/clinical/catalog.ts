import { caseTemplates } from "../../data/clinical/casos.ts";
import { evidenceReferences } from "../../data/clinical/evidencia.ts";
import { learningTopics } from "../../data/clinical/topicos-aprendizagem.ts";
import { treatmentCatalog } from "../../data/clinical/tratamentos.ts";
import type {
  IdAplicacao,
  ModeloCaso,
  ReferenciaEvidencia,
  TemaAprendizagem,
  DefinicaoTratamento,
} from "./types.ts";

const treatmentById = new Map(treatmentCatalog.map((item) => [item.id, item]));
const topicById = new Map(learningTopics.map((item) => [item.id, item]));
const evidenceById = new Map(evidenceReferences.map((item) => [item.id, item]));
const templateById = new Map(caseTemplates.map((item) => [item.id, item]));

export function listarModelosCaso(): ModeloCaso[] {
  return caseTemplates;
}

export function obterModeloCaso(idModelo: string): ModeloCaso | undefined {
  return templateById.get(idModelo);
}

export function obterTituloCaso(idModelo: string) {
  return obterModeloCaso(idModelo)?.title ?? idModelo;
}

export function obterIdsCasosPublicados(): string[] {
  return caseTemplates.filter((item) => item.status === "disponivel").map((item) => item.id);
}

export function obterTratamento(idTratamento: string): DefinicaoTratamento | undefined {
  return treatmentById.get(idTratamento);
}

export function listarTratamentos(): DefinicaoTratamento[] {
  return treatmentCatalog;
}

export function listarTemas(): TemaAprendizagem[] {
  return learningTopics;
}

export function obterTema(idTema: string): TemaAprendizagem | undefined {
  return topicById.get(idTema);
}

export function obterTituloTema(idTema: string) {
  return obterTema(idTema)?.titulo ?? idTema;
}

export function obterEvidencia(idEvidencia: string): ReferenciaEvidencia | undefined {
  return evidenceById.get(idEvidencia);
}

export function obterEvidenciaParaTratamento(idTratamento: string): ReferenciaEvidencia[] {
  const tratamento = obterTratamento(idTratamento);
  if (!tratamento) return [];
  return tratamento.refsEvidencia
    .map((idEvidencia) => obterEvidencia(idEvidencia))
    .filter((item): item is ReferenciaEvidencia => Boolean(item));
}


export function obterRotuloTratamento(idTratamento: string) {
  return obterTratamento(idTratamento)?.rotulo ?? idTratamento;
}

export function obterRotuloAplicacao(modelo: ModeloCaso, idAplicacao: IdAplicacao) {
  return (
    modelo.definicoesAplicacao.find((item) => item.id === idAplicacao)?.rotulo ??
    idAplicacao
  );
}

export function obterIdsTemasCaso(idModelo: string) {
  const modelo = obterModeloCaso(idModelo);
  if (!modelo) return [];

  const topicIds = new Set<string>();

  for (const definition of modelo.definicoesObservacao) {
    for (const topicId of definition.idsTemas) topicIds.add(topicId);
  }

  for (const prompt of modelo.promptsDialogo) {
    for (const topicId of prompt.idsTemas) topicIds.add(topicId);
  }

  for (const application of modelo.definicoesAplicacao) {
    for (const topicId of application.idsTemas) topicIds.add(topicId);
  }

  for (const topicId of modelo.idsTemas) topicIds.add(topicId);
  for (const goal of modelo.objetivosClinicosAlvo) {
    for (const topicId of goal.idsTemas) topicIds.add(topicId);
  }
  for (const rule of modelo.regrasAvaliacao) {
    for (const topicId of rule.idsTemas) topicIds.add(topicId);
  }

  return Array.from(topicIds);
}

export function obterCasoAleatorio(): ModeloCaso | undefined {
  const available = listarModelosCaso().filter((item) => item.status === "disponivel");
  if (available.length === 0) return undefined;
  return available[Math.floor(Math.random() * available.length)];
}

export function obterCasosRelacionadosComTema(idTema: string): ModeloCaso[] {
  const topic = obterTema(idTema);
  if (!topic) return [];
  return topic.idsCaso
    .map((caseId) => obterModeloCaso(caseId))
    .filter((item): item is ModeloCaso => Boolean(item));
}

export function obterTratamentosParaTema(idTema: string): DefinicaoTratamento[] {
  const topic = obterTema(idTema);
  if (!topic) return [];
  return topic.idsTratamento
    .map((idTratamento) => obterTratamento(idTratamento))
    .filter((item): item is DefinicaoTratamento => Boolean(item));
}

// ─── Re-exports com nomes antigos para compatibilidade ───────────────────────
/** @deprecated Use listarModelosCaso */
export const listCaseTemplates = listarModelosCaso;
/** @deprecated Use obterModeloCaso */
export const getCaseTemplate = obterModeloCaso;
/** @deprecated Use obterTituloCaso */
export const getCaseTitle = obterTituloCaso;
/** @deprecated Use obterIdsCasosPublicados */
export const getPublishedCaseIds = obterIdsCasosPublicados;
/** @deprecated Use obterTratamento */
export const getTreatment = obterTratamento;
/** @deprecated Use listarTratamentos */
export const listTreatments = listarTratamentos;
/** @deprecated Use listarTemas */
export const listLearningTopics = listarTemas;
/** @deprecated Use obterTema */
export const getLearningTopic = obterTema;
/** @deprecated Use obterTituloTema */
export const getLearningTopicTitle = obterTituloTema;
/** @deprecated Use obterEvidencia */
export const getEvidence = obterEvidencia;
/** @deprecated Use obterEvidenciaParaTratamento */
export const getEvidenceForTreatment = obterEvidenciaParaTratamento;
/** @deprecated Use obterRotuloTratamento */
export const getTreatmentLabel = obterRotuloTratamento;
/** @deprecated Use obterRotuloAplicacao */
export const getApplicationLabel = obterRotuloAplicacao;
/** @deprecated Use obterIdsTemasCaso */
export const getTemplateLearningTopicIds = obterIdsTemasCaso;
/** @deprecated Use obterCasoAleatorio */
export const getRandomCase = obterCasoAleatorio;
/** @deprecated Use obterCasosRelacionadosComTema */
export const getRelatedCasesForTopic = obterCasosRelacionadosComTema;
/** @deprecated Use obterTratamentosParaTema */
export const getTreatmentsForTopic = obterTratamentosParaTema;
