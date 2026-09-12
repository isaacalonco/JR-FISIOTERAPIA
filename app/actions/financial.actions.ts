"use server";

import { getCurrentUserSession } from "@/lib/auth/rbac";
import {
  createReceivable,
  createExpense,
  registerPayment,
} from "@/services/financial.service";
import {
  receivableSchema,
  expenseSchema,
  paymentSchema,
} from "@/utils/validators/financial.schema";
import { revalidatePath } from "next/cache";

export interface ActionResult {
  success: boolean;
  error?: string;
  message?: string;
}

export async function createReceivableAction(
  prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getCurrentUserSession();
  if (!session) return { success: false, error: "Sessão expirada." };

  const rawData = {
    patientId: formData.get("patientId") || null,
    description: formData.get("description"),
    category: formData.get("category"),
    amount: Number(formData.get("amount") || 0),
    dueDate: formData.get("dueDate"),
  };

  const validation = receivableSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || "Dados de cobrança inválidos.",
    };
  }

  const result = await createReceivable(
    session.profile.tenantId,
    session.profile.unitId || session.profile.clinicId,
    validation.data
  );

  if (!result.success) return { success: false, error: result.error };

  revalidatePath("/dashboard/financeiro");
  return { success: true, message: "Conta a receber cadastrada com sucesso!" };
}

export async function createExpenseAction(
  prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getCurrentUserSession();
  if (!session) return { success: false, error: "Sessão expirada." };

  const rawData = {
    description: formData.get("description"),
    category: formData.get("category"),
    amount: Number(formData.get("amount") || 0),
    dueDate: formData.get("dueDate"),
    paymentDate: formData.get("paymentDate") || null,
  };

  const validation = expenseSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || "Dados de despesa inválidos.",
    };
  }

  const result = await createExpense(
    session.profile.tenantId,
    session.profile.unitId || session.profile.clinicId,
    validation.data
  );

  if (!result.success) return { success: false, error: result.error };

  revalidatePath("/dashboard/financeiro");
  return { success: true, message: "Despesa lançada com sucesso!" };
}

export async function registerPaymentAction(
  receivableId: string,
  paymentMethod: "PIX" | "CARTAO_CREDITO" | "CARTAO_DEBITO" | "DINHEIRO" | "BOLETO",
  amountPaid: number,
  transactionCode?: string
): Promise<ActionResult> {
  const session = await getCurrentUserSession();
  if (!session) return { success: false, error: "Sessão expirada." };

  const validation = paymentSchema.safeParse({
    receivableId,
    paymentMethod,
    amountPaid,
    transactionCode,
  });

  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || "Dados de pagamento inválidos.",
    };
  }

  const result = await registerPayment(session.profile.tenantId, validation.data);

  if (!result.success) return { success: false, error: result.error };

  revalidatePath("/dashboard/financeiro");
  return { success: true, message: "Pagamento registrado e título baixado!" };
}
