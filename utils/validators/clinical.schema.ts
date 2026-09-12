import { z } from "zod";

export const physiotherapyRecordSchema = z.object({
  patientId: z.string().uuid("ID de paciente inválido"),
  clinicalHistory: z
    .string()
    .min(5, "Histórico clínico / Anamnese deve ter no mínimo 5 caracteres"),
  functionalDiagnosis: z
    .string()
    .min(3, "Diagnóstico funcional é obrigatório"),
  painScaleInitial: z
    .number()
    .int()
    .min(0, "Escala de dor mínima é 0")
    .max(10, "Escala de dor máxima é 10"),
  biomechanicalAssessment: z.string().optional().nullable(),
  posturalEvaluation: z.string().optional().nullable(),
});

export const clinicalEvolutionSchema = z.object({
  patientId: z.string().uuid("ID de paciente inválido"),
  appointmentId: z.string().uuid().optional().nullable(),
  evolutionNotes: z
    .string()
    .min(5, "Descrição da evolução da sessão (SOAP) é obrigatória"),
  conduct: z.string().optional().nullable(),
  painLevel: z
    .number()
    .int()
    .min(0, "Nível de dor mínimo é 0")
    .max(10, "Nível de dor máximo é 10")
    .optional()
    .default(0),
});

export const treatmentPlanSchema = z.object({
  patientId: z.string().uuid("ID de paciente inválido"),
  shortTermGoals: z.string().min(5, "Informe os objetivos de curto prazo"),
  longTermGoals: z.string().min(5, "Informe os objetivos de longo prazo"),
  estimatedSessions: z
    .number()
    .int()
    .min(1, "A estimativa mínima é de 1 sessão")
    .max(200, "Estimativa muito alta"),
});

export const clinicalReportSchema = z.object({
  patientId: z.string().uuid("ID de paciente inválido"),
  title: z.string().min(3, "Título do laudo/relatório é obrigatório"),
  content: z.string().min(10, "Conteúdo do relatório é muito curto"),
  cidCode: z.string().max(20).optional().nullable(),
});

export type PhysiotherapyRecordInput = z.infer<typeof physiotherapyRecordSchema>;
export type ClinicalEvolutionInput = z.infer<typeof clinicalEvolutionSchema>;
export type TreatmentPlanInput = z.infer<typeof treatmentPlanSchema>;
export type ClinicalReportInput = z.infer<typeof clinicalReportSchema>;
