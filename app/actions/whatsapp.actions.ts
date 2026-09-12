"use server";

import { getCurrentUserSession } from "@/lib/auth/rbac";
import { sendWhatsAppMessageSchema, whatsappConfirmationSchema } from "@/utils/validators/whatsapp-ai.schema";
import { sendAppointmentReminder, processWhatsAppConfirmationToken } from "@/services/whatsapp.service";
import { revalidatePath } from "next/cache";

export async function sendWhatsAppReminderAction(prevState: any, formData: FormData) {
  try {
    const session = await getCurrentUserSession();
    if (!session) {
      return { error: "Sessão expirada. Faça login novamente." };
    }

    const rawData = {
      appointmentId: formData.get("appointmentId") as string,
      phoneNumber: formData.get("phoneNumber") as string,
    };

    const validated = sendWhatsAppMessageSchema.parse(rawData);

    const result = await sendAppointmentReminder(
      session.profile.tenantId,
      validated.appointmentId
    );

    revalidatePath("/dashboard/whatsapp");
    revalidatePath("/dashboard/agenda");

    return {
      success: true,
      message: "Lembrete do WhatsApp disparado com sucesso!",
      content: result.content,
      token: result.token,
    };
  } catch (err: any) {
    return { error: err.message || "Falha ao enviar mensagem do WhatsApp." };
  }
}

export async function processWhatsAppTokenAction(token: string, action: "CONFIRM" | "CANCEL", reason?: string) {
  try {
    const validated = whatsappConfirmationSchema.parse({ token, action, reason });
    const result = await processWhatsAppConfirmationToken(
      validated.token,
      validated.action,
      validated.reason
    );
    return result;
  } catch (err: any) {
    return { success: false, message: err.message || "Erro ao processar confirmação do WhatsApp." };
  }
}
