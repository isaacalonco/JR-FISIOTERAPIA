"use server";

import { getCurrentUserSession } from "@/lib/auth/rbac";
import { createPatient } from "@/services/patient.service";
import { patientSchema } from "@/utils/validators/patient.schema";
import { revalidatePath } from "next/cache";

export interface ActionResult {
  success: boolean;
  error?: string;
  message?: string;
}

export async function createPatientAction(
  prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getCurrentUserSession();

  if (!session) {
    return { success: false, error: "Sessão expirada. Faça login novamente." };
  }

  const rawData = {
    fullName: formData.get("fullName"),
    cpf: formData.get("cpf"),
    rg: formData.get("rg") || null,
    birthDate: formData.get("birthDate"),
    gender: formData.get("gender"),
    phone: formData.get("phone"),
    whatsapp: formData.get("whatsapp") || null,
    email: formData.get("email") || null,
    emergencyContactName: formData.get("emergencyContactName") || null,
    emergencyContactPhone: formData.get("emergencyContactPhone") || null,
    addressStreet: formData.get("addressStreet") || null,
    addressNumber: formData.get("addressNumber") || null,
    addressComplement: formData.get("addressComplement") || null,
    addressNeighborhood: formData.get("addressNeighborhood") || null,
    addressCity: formData.get("addressCity") || null,
    addressState: formData.get("addressState") || null,
    addressZipCode: formData.get("addressZipCode") || null,
    administrativeNotes: formData.get("administrativeNotes") || null,
  };

  const validation = patientSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || "Dados de paciente inválidos.",
    };
  }

  const result = await createPatient(
    session.profile.tenantId,
    session.profile.clinicId,
    validation.data
  );

  if (!result.success) {
    return { success: false, error: result.error };
  }

  revalidatePath("/dashboard/pacientes");
  return { success: true, message: "Paciente cadastrado com sucesso!" };
}
