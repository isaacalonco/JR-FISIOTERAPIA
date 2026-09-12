"use server";

import { getCurrentUserSession } from "@/lib/auth/rbac";
import { createAppointment, updateAppointmentStatus } from "@/services/appointment.service";
import { appointmentSchema, appointmentStatusSchema } from "@/utils/validators/appointment.schema";
import { revalidatePath } from "next/cache";

export interface ActionResult {
  success: boolean;
  error?: string;
  message?: string;
}

export async function createAppointmentAction(
  prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getCurrentUserSession();

  if (!session) {
    return { success: false, error: "Sessão expirada. Faça login novamente." };
  }

  const rawData = {
    patientId: formData.get("patientId"),
    professionalId: formData.get("professionalId"),
    serviceId: formData.get("serviceId"),
    roomId: formData.get("roomId") || null,
    startTime: formData.get("startTime"),
    endTime: formData.get("endTime"),
    notes: formData.get("notes") || null,
  };

  const validation = appointmentSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || "Dados de agendamento inválidos.",
    };
  }

  const result = await createAppointment(
    session.profile.tenantId,
    session.profile.unitId || session.profile.clinicId,
    validation.data
  );

  if (!result.success) {
    return { success: false, error: result.error };
  }

  revalidatePath("/dashboard/agenda");
  revalidatePath("/dashboard");
  return { success: true, message: "Consulta agendada com sucesso!" };
}

export async function updateAppointmentStatusAction(
  appointmentId: string,
  newStatus: string,
  cancellationReason?: string
): Promise<ActionResult> {
  const session = await getCurrentUserSession();

  if (!session) {
    return { success: false, error: "Sessão expirada." };
  }

  const validation = appointmentStatusSchema.safeParse({
    appointmentId,
    status: newStatus,
    cancellationReason,
  });

  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || "Status ou motivo inválido.",
    };
  }

  const result = await updateAppointmentStatus(validation.data);

  if (!result.success) {
    return { success: false, error: result.error };
  }

  revalidatePath("/dashboard/agenda");
  return { success: true, message: "Status atualizado com sucesso!" };
}
