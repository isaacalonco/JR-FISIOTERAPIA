"use server";

import { getCurrentUserSession } from "@/lib/auth/rbac";
import { legalCaseSchema, legalContractSchema } from "@/utils/validators/legal-audit.schema";
import {
  createLegalCase,
  updateLegalCaseStatus,
  createLegalContract,
  updateLegalContractStatus,
} from "@/services/legal.service";
import { revalidatePath } from "next/cache";

export async function createLegalCaseAction(prevState: any, formData: FormData) {
  try {
    const session = await getCurrentUserSession();
    if (!session) {
      return { error: "Sessão expirada. Faça login novamente." };
    }

    const rawData = {
      case_number: formData.get("case_number") as string,
      title: formData.get("title") as string,
      case_type: formData.get("case_type") as string,
      status: (formData.get("status") as string) || "em_andamento",
      patient_id: (formData.get("patient_id") as string) || null,
      lawyer_name: (formData.get("lawyer_name") as string) || null,
      description: (formData.get("description") as string) || null,
      due_date: (formData.get("due_date") as string) || null,
    };

    const validated = legalCaseSchema.parse(rawData);

    const result = await createLegalCase(
      session.profile.tenantId,
      validated,
      session.profile.email
    );

    if (!result.success) {
      return { error: result.error };
    }

    revalidatePath("/dashboard/juridico");
    return { success: true, message: "Caso jurídico cadastrado com sucesso!" };
  } catch (err: any) {
    return { error: err.message || "Falha ao salvar caso jurídico." };
  }
}

export async function updateCaseStatusAction(caseId: string, status: string) {
  try {
    const session = await getCurrentUserSession();
    if (!session) {
      return { success: false, error: "Sessão não encontrada." };
    }

    const result = await updateLegalCaseStatus(
      session.profile.tenantId,
      caseId,
      status,
      session.profile.email
    );

    if (result.success) {
      revalidatePath("/dashboard/juridico");
    }
    return result;
  } catch (err: any) {
    return { success: false, error: err.message || "Erro ao atualizar status." };
  }
}

export async function createLegalContractAction(prevState: any, formData: FormData) {
  try {
    const session = await getCurrentUserSession();
    if (!session) {
      return { error: "Sessão expirada. Faça login novamente." };
    }

    const rawData = {
      title: formData.get("title") as string,
      contract_type: formData.get("contract_type") as string,
      status: (formData.get("status") as string) || "rascunho",
      patient_id: (formData.get("patient_id") as string) || null,
      content: (formData.get("content") as string) || null,
      expires_at: (formData.get("expires_at") as string) || null,
    };

    const validated = legalContractSchema.parse(rawData);

    const result = await createLegalContract(
      session.profile.tenantId,
      validated,
      session.profile.email
    );

    if (!result.success) {
      return { error: result.error };
    }

    revalidatePath("/dashboard/juridico");
    return { success: true, message: "Contrato jurídico salvo com sucesso!" };
  } catch (err: any) {
    return { error: err.message || "Falha ao salvar contrato jurídico." };
  }
}

export async function updateContractStatusAction(contractId: string, status: string) {
  try {
    const session = await getCurrentUserSession();
    if (!session) {
      return { success: false, error: "Sessão não encontrada." };
    }

    const result = await updateLegalContractStatus(
      session.profile.tenantId,
      contractId,
      status,
      session.profile.email
    );

    if (result.success) {
      revalidatePath("/dashboard/juridico");
    }
    return result;
  } catch (err: any) {
    return { success: false, error: err.message || "Erro ao atualizar status do contrato." };
  }
}
