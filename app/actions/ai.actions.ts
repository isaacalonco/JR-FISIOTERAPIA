"use server";

import { getCurrentUserSession } from "@/lib/auth/rbac";
import { aiTranscriptionInputSchema, humanVerificationSchema } from "@/utils/validators/whatsapp-ai.schema";
import { processAIAudioTranscription, verifyAndCommitAITranscription } from "@/services/ai.service";
import { revalidatePath } from "next/cache";

export async function submitAITranscriptionAction(prevState: any, formData: FormData) {
  try {
    const session = await getCurrentUserSession();
    if (!session) {
      return { error: "Sessão expirada. Faça login novamente." };
    }

    const rawData = {
      patientId: formData.get("patientId") as string,
      appointmentId: (formData.get("appointmentId") as string) || undefined,
      audioUrl: (formData.get("audioUrl") as string) || undefined,
      rawText: formData.get("rawText") as string,
    };

    const validated = aiTranscriptionInputSchema.parse(rawData);

    const result = await processAIAudioTranscription(
      session.profile.tenantId,
      validated.patientId,
      validated.appointmentId,
      validated.audioUrl,
      validated.rawText
    );

    revalidatePath("/dashboard/ia");

    return {
      success: true,
      message: "Transcrição e síntese por Inteligência Artificial concluídas com sucesso! Aguardando Validação Humana.",
      transcription: result,
    };
  } catch (err: any) {
    return { error: err.message || "Falha ao processar áudio com IA." };
  }
}

export async function verifyAndCommitAIAction(prevState: any, formData: FormData) {
  try {
    const session = await getCurrentUserSession();
    if (!session) {
      return { error: "Sessão expirada. Faça login novamente." };
    }

    const rawData = {
      transcriptionId: formData.get("transcriptionId") as string,
      chiefComplaint: formData.get("chiefComplaint") as string,
      painLevel: Number(formData.get("painLevel")),
      conductOrNotes: (formData.get("conductOrNotes") as string) || undefined,
    };

    const validated = humanVerificationSchema.parse(rawData);

    const result = await verifyAndCommitAITranscription(
      session.profile.tenantId,
      session.profile.id,
      validated
    );

    revalidatePath("/dashboard/ia");
    revalidatePath("/dashboard/prontuario");

    return {
      success: true,
      message: result.message,
      medicalRecordId: result.medicalRecordId,
    };
  } catch (err: any) {
    return { error: err.message || "Falha na validação clínica humana." };
  }
}
