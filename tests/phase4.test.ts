import { describe, it } from "node:test";
import assert from "node:assert";
import { appointmentSchema, appointmentStatusSchema } from "../utils/validators/appointment.schema";

describe("JR SAÚDE 1.0 - Testes da FASE 4 (Agenda Médica & Prevenção de Conflitos)", () => {
  it("deve validar agendamento com intervalo de horário válido no appointmentSchema", () => {
    const validAppointment = {
      patientId: "123e4567-e89b-12d3-a456-426614174000",
      professionalId: "123e4567-e89b-12d3-a456-426614174001",
      serviceId: "123e4567-e89b-12d3-a456-426614174002",
      startTime: "2026-10-15T14:00:00.000Z",
      endTime: "2026-10-15T14:45:00.000Z",
      notes: "Primeira consulta de avaliação",
    };

    const result = appointmentSchema.safeParse(validAppointment);
    assert.strictEqual(result.success, true);
  });

  it("deve rejeitar agendamento cujo horário de término seja anterior ao horário de início", () => {
    const invalidAppointment = {
      patientId: "123e4567-e89b-12d3-a456-426614174000",
      professionalId: "123e4567-e89b-12d3-a456-426614174001",
      serviceId: "123e4567-e89b-12d3-a456-426614174002",
      startTime: "2026-10-15T14:45:00.000Z",
      endTime: "2026-10-15T14:00:00.000Z", // Término antes do início!
    };

    const result = appointmentSchema.safeParse(invalidAppointment);
    assert.strictEqual(result.success, false);
  });

  it("deve exigi-lo motivo do cancelamento ao alterar status para CANCELADO", () => {
    const cancelWithoutReason = {
      appointmentId: "123e4567-e89b-12d3-a456-426614174000",
      status: "CANCELADO",
      cancellationReason: "", // Motivo vazio!
    };

    const result = appointmentStatusSchema.safeParse(cancelWithoutReason);
    assert.strictEqual(result.success, false);

    const cancelWithReason = {
      appointmentId: "123e4567-e89b-12d3-a456-426614174000",
      status: "CANCELADO",
      cancellationReason: "Paciente solicitou desmarcar por motivo pessoal",
    };

    const validResult = appointmentStatusSchema.safeParse(cancelWithReason);
    assert.strictEqual(validResult.success, true);
  });

  it("deve validar matematicamente o algoritmo de sobreposição de horários (Overlap Check)", () => {
    // Existente: 14:00 às 15:00
    const existingStart = new Date("2026-10-15T14:00:00Z").getTime();
    const existingEnd = new Date("2026-10-15T15:00:00Z").getTime();

    // Caso 1: Novo agendamento das 14:30 às 15:30 -> CHOQUE! (start < existingEnd && end > existingStart)
    const newStart1 = new Date("2026-10-15T14:30:00Z").getTime();
    const newEnd1 = new Date("2026-10-15T15:30:00Z").getTime();
    const isOverlap1 = newStart1 < existingEnd && newEnd1 > existingStart;
    assert.strictEqual(isOverlap1, true);

    // Caso 2: Novo agendamento das 15:00 às 16:00 -> SEM CHOQUE (começa exatamente quando o anterior termina)
    const newStart2 = new Date("2026-10-15T15:00:00Z").getTime();
    const newEnd2 = new Date("2026-10-15T16:00:00Z").getTime();
    const isOverlap2 = newStart2 < existingEnd && newEnd2 > existingStart;
    assert.strictEqual(isOverlap2, false);
  });
});
