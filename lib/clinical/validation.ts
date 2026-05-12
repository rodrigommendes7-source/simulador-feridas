import { caseTemplates } from "../../data/clinical/casos.ts";
import { evidenceReferences } from "../../data/clinical/evidencia.ts";
import { learningTopics } from "../../data/clinical/topicos-aprendizagem.ts";
import { treatmentCatalog } from "../../data/clinical/tratamentos.ts";
import { avaliarTentativaCaso, obterTentativaIdeal } from "./evaluation.ts";

export type ValidationIssue = {
  level: "error" | "warning";
  scope: string;
  message: string;
};

function normalizarIdTema(idTema: string) {
  return idTema === "materiais-desadequados" ? "decisao-clinica" : idTema;
}

export function validarDominioClinico() {
  const issues: ValidationIssue[] = [];
  const treatmentIds = new Set(treatmentCatalog.map((item) => item.id));
  const evidenceIds = new Set(evidenceReferences.map((item) => item.id));
  const topicIds = new Set(learningTopics.map((item) => item.id));

  for (const treatment of treatmentCatalog) {
    for (const evidenceId of treatment.refsEvidencia) {
      if (!evidenceIds.has(evidenceId)) {
        issues.push({
          level: "error",
          scope: `treatment:${treatment.id}`,
          message: `Referência de evidência inexistente: "${evidenceId}".`,
        });
      }
    }

    for (const topicId of treatment.learningTopicIds) {
      const normalizedTopicId = normalizarIdTema(topicId);
      if (!topicIds.has(normalizedTopicId)) {
        issues.push({
          level: "error",
          scope: `treatment:${treatment.id}`,
          message: `Tema inexistente referenciado: "${topicId}".`,
        });
      }
    }
  }

  for (const topic of learningTopics) {
    for (const evidenceId of topic.idsEvidencia) {
      if (!evidenceIds.has(evidenceId)) {
        issues.push({
          level: "error",
          scope: `learning:${topic.id}`,
          message: `Tema referencia evidência inexistente: "${evidenceId}".`,
        });
      }
    }

    for (const treatmentId of topic.idsTratamento) {
      if (!treatmentIds.has(treatmentId)) {
        issues.push({
          level: "error",
          scope: `learning:${topic.id}`,
          message: `Tema referencia tratamento inexistente: "${treatmentId}".`,
        });
      }
    }
  }

  for (const template of caseTemplates) {
    const scope = `case:${template.id}`;
    const applicationDefinitionIds = new Set(
      template.definicoesAplicacao.map((item) => item.id)
    );

    for (const treatmentId of template.tratamentosDisponiveis) {
      if (!treatmentIds.has(treatmentId)) {
        issues.push({
          level: "error",
          scope,
          message: `Tratamento disponível não encontrado: "${treatmentId}".`,
        });
      }
    }

    // opcoesAplicacao têm de ter definição correspondente em definicoesAplicacao
    for (const applicationId of template.opcoesAplicacao) {
      if (!applicationDefinitionIds.has(applicationId)) {
        issues.push({
          level: "error",
          scope,
          message: `opcoesAplicacao refere técnica sem definição no modelo: "${applicationId}".`,
        });
      }
    }

    const templateApplicationOptions = new Set(template.opcoesAplicacao);

    for (const goal of template.objetivosClinicosAlvo) {
      for (const topicId of goal.idsTemas) {
        const normalizedTopicId = normalizarIdTema(topicId);
        if (!topicIds.has(normalizedTopicId)) {
          issues.push({
            level: "error",
            scope,
            message: `Objetivo clínico referencia tema inexistente: "${topicId}".`,
          });
        }
      }

      for (const treatmentId of goal.correspondencia.idsTratamento ?? []) {
        if (!template.tratamentosDisponiveis.includes(treatmentId)) {
          issues.push({
            level: "error",
            scope,
            message: `Objetivo clínico refere tratamento não disponível no caso: "${treatmentId}".`,
          });
        }
      }

      // correspondencia.idsAplicacao têm de estar em opcoesAplicacao do modelo
      for (const applicationId of goal.correspondencia.idsAplicacao ?? []) {
        if (!templateApplicationOptions.has(applicationId)) {
          issues.push({
            level: "error",
            scope,
            message: `Objetivo clínico refere técnica não disponível no caso: "${applicationId}".`,
          });
        }
      }
    }

    for (const rule of template.regrasAvaliacao) {
      for (const ruleId of rule.aplicavelAIds) {
        if (rule.alvo === "treatment" && !template.tratamentosDisponiveis.includes(ruleId)) {
          issues.push({
            level: "error",
            scope,
            message: `Regra de avaliação refere tratamento não disponível: "${ruleId}".`,
          });
        }

        // alvo === "application" tem de existir em opcoesAplicacao do modelo
        if (rule.alvo === "application" && !templateApplicationOptions.has(ruleId as never)) {
          issues.push({
            level: "error",
            scope,
            message: `Regra de avaliação refere técnica não disponível: "${ruleId}".`,
          });
        }
      }

      for (const topicId of rule.idsTemas) {
        const normalizedTopicId = normalizarIdTema(topicId);
        if (!topicIds.has(normalizedTopicId)) {
          issues.push({
            level: "error",
            scope,
            message: `Regra de avaliação referencia tema inexistente: "${topicId}".`,
          });
        }
      }
    }

    // Simulação 100/100: o caso tem de ser perfeitamente solucionável
    try {
      const idealAttempt = obterTentativaIdeal(template);
      const evaluation = avaliarTentativaCaso(template, idealAttempt);

      if (evaluation.pontuacao !== 100) {
        const sectionDetail = evaluation.seccoes
          .filter((seccao) => seccao.pontuacao < seccao.pontuacaoMaxima)
          .map((seccao) => `${seccao.id}=${seccao.pontuacao}/${seccao.pontuacaoMaxima}`)
          .join(", ");

        issues.push({
          level: "error",
          scope,
          message: `Caso não atinge 100/100 com tentativa ideal (score=${evaluation.pontuacao}; secções abaixo do máximo: ${sectionDetail || "nenhuma"}).`,
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      issues.push({
        level: "error",
        scope,
        message: `Falha ao simular tentativa ideal: ${message}`,
      });
    }
  }

  return {
    ok: !issues.some((issue) => issue.level === "error"),
    issues,
  };
}

// ─── Re-exports com nomes antigos para compatibilidade ───────────────────────
/** @deprecated Use validarDominioClinico */
export const validateClinicalDomain = validarDominioClinico;
