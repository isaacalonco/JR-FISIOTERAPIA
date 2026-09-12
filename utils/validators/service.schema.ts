import { z } from "zod";

export const serviceSchema = z.object({
  specialtyId: z.string().uuid().optional().nullable(),
  name: z
    .string()
    .min(3, "Nome do procedimento deve ter no mínimo 3 caracteres")
    .max(255, "Nome muito longo"),
  description: z.string().optional().nullable(),
  price: z
    .number()
    .min(0, "O preço do serviço deve ser maior ou igual a zero"),
  durationMinutes: z
    .number()
    .int("A duração deve ser em minutos inteiros")
    .min(5, "Duração mínima de 5 minutos")
    .max(480, "Duração máxima de 8 horas"),
});

export type ServiceInput = z.infer<typeof serviceSchema>;
