"use server";

import { getCurrentUserSession } from "@/lib/auth/rbac";
import { createService } from "@/services/catalog.service";
import { serviceSchema } from "@/utils/validators/service.schema";
import { revalidatePath } from "next/cache";

export interface ActionResult {
  success: boolean;
  error?: string;
  message?: string;
}

export async function createServiceAction(
  prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getCurrentUserSession();

  if (!session) {
    return { success: false, error: "Sessão expirada. Faça login novamente." };
  }

  const rawData = {
    specialtyId: formData.get("specialtyId") || null,
    name: formData.get("name"),
    description: formData.get("description") || null,
    price: Number(formData.get("price") || 0),
    durationMinutes: Number(formData.get("durationMinutes") || 30),
  };

  const validation = serviceSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || "Dados de serviço inválidos.",
    };
  }

  const result = await createService(
    session.profile.tenantId,
    session.profile.clinicId,
    validation.data
  );

  if (!result.success) {
    return { success: false, error: result.error };
  }

  revalidatePath("/dashboard/servicos");
  return { success: true, message: "Procedimento cadastrado no catálogo com sucesso!" };
}
