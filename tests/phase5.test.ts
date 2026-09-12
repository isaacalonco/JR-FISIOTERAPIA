import { describe, it } from "node:test";
import assert from "node:assert";
import {
  physiotherapyRecordSchema,
  clinicalEvolutionSchema,
  treatmentPlanSchema,
  clinicalReportSchema,
} from "../utils/validators/clinical.schema";

describe("JR SAÚDE 1.0 - Testes da FASE 5 (Prontuário Eletrônico & Fisioterapia)", () => {
  it("deve validar ficha fisioterapêutica válida no physiotherapyRecordSchema", () => {
    const validPhysio = {
      patientId: "123e4567-e89b-12d3-a456-426614174000",
      clinicalHistory: "Paciente com dor lombar crônica após esforço físico há 3 meses.",
      functionalDiagnosis: "Lombalgia mecânica funcional com limitação de flexão de tronco.",
      painScaleInitial: 7,
      biomechanicalAssessment: "Encurtamento de isquiotibiais bilaterais.",
      posturalEvaluation: "Hiperlordose lombar e retificação cervical.",
    };

    const result = physiotherapyRecordSchema.safeParse(validPhysio);
    assert.strictEqual(result.success, true);
  });

  it("deve rejeitar escala de dor inválida (maior que 10) no physiotherapyRecordSchema", () => {
    const invalidPain = {
      patientId: "123e4567-e89b-12d3-a456-426614174000",
      clinicalHistory: "Histórico básico",
      functionalDiagnosis: "Diagnóstico básico",
      painScaleInitial: 15, // Invalido (>10)
    };

    const result = physiotherapyRecordSchema.safeParse(invalidPain);
    assert.strictEqual(result.success, false);
  });

  it("deve validar evolução diária SOAP no clinicalEvolutionSchema", () => {
    const validEvolution = {
      patientId: "123e4567-e89b-12d3-a456-426614174000",
      evolutionNotes: "Paciente relata melhora substancial da dor após a sessão anterior. ADM de flexão aumentada em 15 graus.",
      conduct: "Cinesioterapia de fortalecimento de core e liberação miofascial de paravertebrais.",
      painLevel: 3,
    };

    const result = clinicalEvolutionSchema.safeParse(validEvolution);
    assert.strictEqual(result.success, true);
  });

  it("deve validar plano terapêutico com metas e estimativa de sessões", () => {
    const validPlan = {
      patientId: "123e4567-e89b-12d3-a456-426614174000",
      shortTermGoals: "Redução da escala de dor de 7 para 3 em 4 semanas.",
      longTermGoals: "Retorno completo às atividades esportivas sem dor.",
      estimatedSessions: 12,
    };

    const result = treatmentPlanSchema.safeParse(validPlan);
    assert.strictEqual(result.success, true);
  });

  it("deve validar emissão de laudo no clinicalReportSchema", () => {
    const validReport = {
      patientId: "123e4567-e89b-12d3-a456-426614174000",
      title: "Laudo Fisioterapêutico para Fins Previdenciários",
      content: "Atesto para os devidos fins que o paciente encontra-se em tratamento fisioterapêutico intensivo...",
      cidCode: "M54.5",
    };

    const result = clinicalReportSchema.safeParse(validReport);
    assert.strictEqual(result.success, true);
  });
});
