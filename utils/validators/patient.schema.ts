import { z } from "zod";
import { cpfSchema, phoneSchema, emailSchema } from "../validators";

export const patientSchema = z.object({
  fullName: z
    .string()
    .min(3, "Nome completo deve ter no mínimo 3 caracteres")
    .max(255, "Nome muito longo"),
  cpf: cpfSchema,
  rg: z.string().max(30).optional().nullable(),
  birthDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data de nascimento deve estar no formato AAAA-MM-DD"),
  gender: z.enum(["MASCULINO", "FEMININO", "OUTRO"], {
    errorMap: () => ({ message: "Selecione um gênero válido" }),
  }),
  phone: phoneSchema,
  whatsapp: z.string().max(30).optional().nullable(),
  email: emailSchema.optional().nullable().or(z.literal("")),
  emergencyContactName: z.string().max(255).optional().nullable(),
  emergencyContactPhone: z.string().max(30).optional().nullable(),
  addressStreet: z.string().max(255).optional().nullable(),
  addressNumber: z.string().max(30).optional().nullable(),
  addressComplement: z.string().max(100).optional().nullable(),
  addressNeighborhood: z.string().max(100).optional().nullable(),
  addressCity: z.string().max(100).optional().nullable(),
  addressState: z.string().max(2).optional().nullable(),
  addressZipCode: z.string().max(15).optional().nullable(),
  administrativeNotes: z.string().optional().nullable(),
});

export type PatientInput = z.infer<typeof patientSchema>;
