import { z } from "zod";

export const professionalSchema = z.object({
  profileId: z.string().uuid("ID de perfil inválido"),
  specialtyId: z.string().uuid("Selecione uma especialidade válida"),
  councilNumber: z
    .string()
    .min(3, "Número do conselho é obrigatório")
    .max(50, "Número de conselho muito longo"),
  councilState: z
    .string()
    .length(2, "UF do conselho deve conter exatamente 2 letras"),
  bio: z.string().optional().nullable(),
  commissionRateDefault: z
    .number()
    .min(0, "A taxa de comissão não pode ser negativa")
    .max(100, "A taxa de comissão não pode exceder 100%"),
});

export type ProfessionalInput = z.infer<typeof professionalSchema>;
