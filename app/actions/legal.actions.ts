"use server";

import { getCurrentUserSession } from "@/lib/auth/rbac";
import { createLegalCase, updateLegalProgress } from "@/services/legal.service";
import { legalCaseSchema, updateLegalProgressSchema } from "@/utils/validators/legal.schema";
import { revalidatePath } from "next/cache";

export interface ActionResult {
  success: boolean;
  error?: string;
  message?: string;
}

export async function createLegalCaseAction(
  prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getCurrentUserSession();

  if (!session) {
    return { success: false, error: "Sessão expirada. Faça login novamente." };
  }

  const rawData = {
    lawyerName: formData.get("lawyerName"),
    clientName: formData.get("clientName"),
    clientPhone: formData.get("clientPhone"),
    entryDate: formData.get("entryDate"),
    amountPaid: formData.get("amountPaid"),
    processType: formData.get("processType"),
    notes: formData.get("notes") || null,
    statusProgress: formData.get("statusProgress"),
  };

  const validation = legalCaseSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || "Dados do processo inválidos.",
    };
  }

  const result = await createLegalCase(session.profile.tenantId, validation.data);

  if (!result.success) {
    return { success: false, error: result.error || "Falha ao registrar processo." };
  }

  revalidatePath("/dashboard/advogado");
  return { success: true, message: "Processo cadastrado com sucesso!" };
}

export async function updateLegalProgressAction(
  prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getCurrentUserSession();

  if (!session) {
    return { success: false, error: "Sessão expirada. Faça login novamente." };
  }

  const rawData = {
    id: formData.get("id"),
    statusProgress: formData.get("statusProgress"),
    notes: formData.get("notes") !== null ? formData.get("notes") : undefined,
  };

  const validation = updateLegalProgressSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || "Dados de andamento inválidos.",
    };
  }

  const result = await updateLegalProgress(session.profile.tenantId, validation.data);

  if (!result.success) {
    return { success: false, error: result.error || "Falha ao atualizar andamento." };
  }

  revalidatePath("/dashboard/advogado");
  return { success: true, message: "Andamento atualizado com sucesso!" };
}
