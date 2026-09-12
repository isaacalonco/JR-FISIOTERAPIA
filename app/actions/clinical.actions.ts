"use server";

import { getCurrentUserSession } from "@/lib/auth/rbac";
import {
  savePhysiotherapyRecord,
  createClinicalEvolution,
  createTreatmentPlan,
} from "@/services/clinical.service";
import {
  physiotherapyRecordSchema,
  clinicalEvolutionSchema,
  treatmentPlanSchema,
} from "@/utils/validators/clinical.schema";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface ActionResult {
  success: boolean;
  error?: string;
  message?: string;
}

/**
 * Auxiliar para recuperar o ID de profissional do usuário logado (se não for admin puro).
 */
async function getLoggedProfessionalId(tenantId: string, profileId: string): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("professionals")
    .select("id")
    .eq("tenant_id", tenantId)
    .eq("profile_id", profileId)
    .maybeSingle();

  return data?.id || null;
}

export async function savePhysiotherapyRecordAction(
  formData: FormData
): Promise<void> {
  const session = await getCurrentUserSession();
  if (!session) return;

  const professionalId =
    (await getLoggedProfessionalId(session.profile.tenantId, session.profile.id)) ||
    session.profile.id;

  const rawData = {
    patientId: formData.get("patientId"),
    clinicalHistory: formData.get("clinicalHistory"),
    functionalDiagnosis: formData.get("functionalDiagnosis"),
    painScaleInitial: Number(formData.get("painScaleInitial") || 0),
    biomechanicalAssessment: formData.get("biomechanicalAssessment") || null,
    posturalEvaluation: formData.get("posturalEvaluation") || null,
  };

  const validation = physiotherapyRecordSchema.safeParse(rawData);
  if (!validation.success) {
    return;
  }

  const result = await savePhysiotherapyRecord(
    session.profile.tenantId,
    professionalId,
    validation.data
  );

  if (!result.success) return;

  revalidatePath(`/dashboard/prontuario/${validation.data.patientId}`);
}

export async function createClinicalEvolutionAction(
  prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getCurrentUserSession();
  if (!session) return { success: false, error: "Sessão expirada." };

  const professionalId =
    (await getLoggedProfessionalId(session.profile.tenantId, session.profile.id)) ||
    session.profile.id;

  const rawData = {
    patientId: formData.get("patientId"),
    appointmentId: formData.get("appointmentId") || null,
    evolutionNotes: formData.get("evolutionNotes"),
    conduct: formData.get("conduct") || null,
    painLevel: Number(formData.get("painLevel") || 0),
  };

  const validation = clinicalEvolutionSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || "Dados de evolução inválidos.",
    };
  }

  const result = await createClinicalEvolution(
    session.profile.tenantId,
    professionalId,
    validation.data
  );

  if (!result.success) return { success: false, error: result.error };

  revalidatePath(`/dashboard/prontuario/${validation.data.patientId}`);
  return { success: true, message: "Evolução de sessão registrada com sucesso!" };
}

export async function createTreatmentPlanAction(
  prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getCurrentUserSession();
  if (!session) return { success: false, error: "Sessão expirada." };

  const professionalId =
    (await getLoggedProfessionalId(session.profile.tenantId, session.profile.id)) ||
    session.profile.id;

  const rawData = {
    patientId: formData.get("patientId"),
    shortTermGoals: formData.get("shortTermGoals"),
    longTermGoals: formData.get("longTermGoals"),
    estimatedSessions: Number(formData.get("estimatedSessions") || 10),
  };

  const validation = treatmentPlanSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || "Dados do plano inválidos.",
    };
  }

  const result = await createTreatmentPlan(
    session.profile.tenantId,
    professionalId,
    validation.data
  );

  if (!result.success) return { success: false, error: result.error };

  revalidatePath(`/dashboard/prontuario/${validation.data.patientId}`);
  return { success: true, message: "Plano terapêutico cadastrado com sucesso!" };
}
