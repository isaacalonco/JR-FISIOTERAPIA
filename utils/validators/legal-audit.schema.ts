import { z } from "zod";

export const legalCaseSchema = z.object({
  case_number: z.string().min(2, "Número do processo/caso é obrigatório"),
  title: z.string().min(3, "Título do caso é obrigatório"),
  case_type: z.enum(["processo", "notificacao", "acordo", "consultoria"]),
  status: z.enum(["em_andamento", "concluido", "arquivado", "pendente"]).default("em_andamento"),
  patient_id: z.string().uuid().optional().nullable(),
  lawyer_name: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  due_date: z.string().optional().nullable(),
});

export const legalContractSchema = z.object({
  title: z.string().min(3, "Título do contrato é obrigatório"),
  contract_type: z.enum(["prestacao_servico", "termo_lgpd", "parceria", "trabalhista"]),
  status: z.enum(["rascunho", "vigente", "encerrado", "cancelado"]).default("rascunho"),
  patient_id: z.string().uuid().optional().nullable(),
  content: z.string().optional().nullable(),
  signed_at: z.string().optional().nullable(),
  expires_at: z.string().optional().nullable(),
});

export const auditFilterSchema = z.object({
  action: z.string().optional(),
  entity_type: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  limit: z.number().optional().default(50),
});

export type LegalCaseInput = z.infer<typeof legalCaseSchema>;
export type LegalContractInput = z.infer<typeof legalContractSchema>;
export type AuditFilterInput = z.infer<typeof auditFilterSchema>;
