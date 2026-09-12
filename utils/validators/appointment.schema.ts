import { z } from "zod";

export const appointmentSchema = z
  .object({
    patientId: z.string().uuid("Selecione um paciente válido"),
    professionalId: z.string().uuid("Selecione um profissional válido"),
    serviceId: z.string().uuid("Selecione um procedimento/serviço válido"),
    roomId: z.string().uuid().optional().nullable(),
    startTime: z.string().datetime({ message: "Data e hora de início inválidas" }),
    endTime: z.string().datetime({ message: "Data e hora de término inválidas" }),
    notes: z.string().optional().nullable(),
  })
  .refine(
    (data) => new Date(data.endTime) > new Date(data.startTime),
    {
      message: "O horário de término deve ser posterior ao horário de início",
      path: ["endTime"],
    }
  );

export const appointmentStatusSchema = z
  .object({
    appointmentId: z.string().uuid("ID do agendamento inválido"),
    status: z.enum([
      "AGENDADO",
      "CONFIRMADO",
      "EM_ATENDIMENTO",
      "CONCLUIDO",
      "REMARCADO",
      "CANCELADO",
      "FALTOU",
    ], {
      errorMap: () => ({ message: "Status de agendamento inválido" }),
    }),
    cancellationReason: z.string().optional().nullable(),
  })
  .refine(
    (data) => {
      if (data.status === "CANCELADO" && (!data.cancellationReason || !data.cancellationReason.trim())) {
        return false;
      }
      return true;
    },
    {
      message: "Motivo do cancelamento é obrigatório ao cancelar uma consulta",
      path: ["cancellationReason"],
    }
  );

export type AppointmentInput = z.infer<typeof appointmentSchema>;
export type AppointmentStatusInput = z.infer<typeof appointmentStatusSchema>;
