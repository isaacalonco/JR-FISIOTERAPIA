import { z } from "zod";

export const unitSchema = z.object({
  name: z.string().min(3, "Nome da unidade/filial é obrigatório"),
  address: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  is_active: z.boolean().default(true),
});

export const reportFilterSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  unitId: z.string().optional(),
  professionalId: z.string().optional(),
});

export type UnitInput = z.infer<typeof unitSchema>;
export type ReportFilterInput = z.infer<typeof reportFilterSchema>;
