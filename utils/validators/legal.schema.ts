import { z } from "zod";

export const legalProcessTypes = ["INSS", "Observadoria", "Afastamento"] as const;
export type LegalProcessType = (typeof legalProcessTypes)[number];

export const legalCaseSchema = z.object({
  lawyerName: z
    .string()
    .min(2, "O nome do advogado deve ter pelo menos 2 caracteres")
    .max(255, "Nome muito longo"),
  clientName: z
    .string()
    .min(2, "O nome do cliente deve ter pelo menos 2 caracteres")
    .max(255, "Nome muito longo"),
  clientPhone: z
    .string()
    .min(8, "Informe um telefone de contato válido com DDD")
    .max(50, "Telefone muito longo"),
  entryDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "A data de entrada deve estar no formato AAAA-MM-DD"),
  amountPaid: z.coerce
    .number()
    .min(0, "O valor pago não pode ser negativo"),
  processType: z.enum(legalProcessTypes, {
    errorMap: () => ({ message: "Selecione o tipo do processo: INSS, Observadoria ou Afastamento" }),
  }),
  notes: z.string().optional().nullable(),
  statusProgress: z
    .string()
    .min(2, "Informe o andamento ou status atual do processo")
    .max(255, "Andamento muito longo"),
});

export const updateLegalProgressSchema = z.object({
  id: z.string().uuid("ID do processo inválido"),
  statusProgress: z
    .string()
    .min(2, "O andamento do processo deve ter pelo menos 2 caracteres")
    .max(255, "Andamento muito longo"),
  notes: z.string().optional().nullable(),
});

export type LegalCaseInput = z.infer<typeof legalCaseSchema>;
export type UpdateLegalProgressInput = z.infer<typeof updateLegalProgressSchema>;
