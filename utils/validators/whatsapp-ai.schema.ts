import { z } from "zod";

// Schema para disparo de mensagens de lembrete no WhatsApp
export const sendWhatsAppMessageSchema = z.object({
  appointmentId: z.string().uuid("ID de agendamento inválido"),
  phoneNumber: z
    .string()
    .min(10, "Telefone deve conter DDD e ao menos 10 dígitos")
    .max(20, "Telefone com formato inválido"),
  customMessage: z.string().optional(),
});

export type SendWhatsAppMessageInput = z.infer<typeof sendWhatsAppMessageSchema>;

// Schema para confirmação ativa via token público
export const whatsappConfirmationSchema = z.object({
  token: z.string().min(8, "Token de confirmação inválido"),
  action: z.enum(["CONFIRM", "CANCEL"], {
    errorMap: () => ({ message: "Ação de confirmação deve ser CONFIRM ou CANCEL" }),
  }),
  reason: z.string().optional(),
});

export type WhatsAppConfirmationInput = z.infer<typeof whatsappConfirmationSchema>;

// Schema para submissão de áudio / texto para transcrição IA
export const aiTranscriptionInputSchema = z.object({
  patientId: z.string().uuid("Selecione um paciente válido"),
  appointmentId: z.string().uuid().optional(),
  audioUrl: z.string().optional(),
  rawText: z.string().min(5, "Informe o texto ou transcrição inicial com ao menos 5 caracteres"),
});

export type AITranscriptionInput = z.infer<typeof aiTranscriptionInputSchema>;

// Schema para Validação Humana Clínica Obrigatória
export const humanVerificationSchema = z.object({
  transcriptionId: z.string().uuid("ID da transcrição inválido"),
  chiefComplaint: z.string().min(3, "Insira a queixa principal verificada pelo profissional"),
  painLevel: z
    .number()
    .min(0, "A escala de dor deve ser no mínimo 0")
    .max(10, "A escala de dor deve ser no máximo 10"),
  conductOrNotes: z.string().optional(),
});

export type HumanVerificationInput = z.infer<typeof humanVerificationSchema>;
