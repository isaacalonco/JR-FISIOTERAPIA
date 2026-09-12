"use server";

import { getCurrentUserSession } from "@/lib/auth/rbac";
import {
  createClubPlan,
  createSubscription,
  generateAuthorization,
  redeemAuthorization,
  buyExtraCredits,
} from "@/services/subscription.service";
import {
  clubPlanSchema,
  clubSubscriptionSchema,
  createAuthorizationSchema,
  buyExtraCreditsSchema,
} from "@/utils/validators/subscription.schema";
import { revalidatePath } from "next/cache";

export interface ActionResult {
  success: boolean;
  error?: string;
  message?: string;
  code?: string;
}

export async function createClubPlanAction(
  prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getCurrentUserSession();
  if (!session) return { success: false, error: "Sessão expirada." };

  const rawData = {
    name: formData.get("name"),
    monthlyPrice: Number(formData.get("monthlyPrice") || 0),
    creditsPerMonth: Number(formData.get("creditsPerMonth") || 0),
    extraCreditPrice: Number(formData.get("extraCreditPrice") || 0),
  };

  const validation = clubPlanSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || "Dados de plano inválidos.",
    };
  }

  const result = await createClubPlan(session.profile.tenantId, validation.data);
  if (!result.success) return { success: false, error: result.error };

  revalidatePath("/dashboard/club");
  return { success: true, message: "Plano do JR Saúde Club criado com sucesso!" };
}

export async function createSubscriptionAction(
  prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getCurrentUserSession();
  if (!session) return { success: false, error: "Sessão expirada." };

  const rawData = {
    planId: formData.get("planId"),
    patientId: formData.get("patientId"),
    autoRenew: formData.get("autoRenew") === "on" || formData.get("autoRenew") === "true",
  };

  const validation = clubSubscriptionSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || "Dados de assinatura inválidos.",
    };
  }

  const result = await createSubscription(session.profile.tenantId, validation.data);
  if (!result.success) return { success: false, error: result.error };

  revalidatePath("/dashboard/club");
  return { success: true, message: "Paciente inscrito no JR Saúde Club com sucesso!" };
}

export async function generateAuthorizationAction(
  prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getCurrentUserSession();
  if (!session) return { success: false, error: "Sessão expirada." };

  const rawData = {
    subscriptionId: formData.get("subscriptionId"),
    beneficiaryName: formData.get("beneficiaryName"),
    beneficiaryCpfOrPhone: formData.get("beneficiaryCpfOrPhone"),
    creditsReserved: Number(formData.get("creditsReserved") || 1),
  };

  const validation = createAuthorizationSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || "Dados da autorização inválidos.",
    };
  }

  const result = await generateAuthorization(validation.data);
  if (!result.success) return { success: false, error: result.error };

  revalidatePath("/dashboard/club");
  return {
    success: true,
    message: `Voucher gerado com sucesso! Código: ${result.data?.authorizationCode}`,
    code: result.data?.authorizationCode,
  };
}

export async function redeemAuthorizationAction(
  authorizationCode: string,
  appointmentId?: string
): Promise<ActionResult> {
  const session = await getCurrentUserSession();
  if (!session) return { success: false, error: "Sessão expirada." };

  if (!authorizationCode) return { success: false, error: "Código do voucher é obrigatório." };

  const result = await redeemAuthorization(authorizationCode, appointmentId);
  if (!result.success) return { success: false, error: result.error };

  revalidatePath("/dashboard/club");
  return { success: true, message: "Voucher resgatado e validado na recepção com sucesso!" };
}

export async function buyExtraCreditsAction(
  subscriptionId: string,
  creditsQuantity: number
): Promise<ActionResult> {
  const session = await getCurrentUserSession();
  if (!session) return { success: false, error: "Sessão expirada." };

  const validation = buyExtraCreditsSchema.safeParse({ subscriptionId, creditsQuantity });
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || "Dados de recarga inválidos.",
    };
  }

  const result = await buyExtraCredits(validation.data);
  if (!result.success) return { success: false, error: result.error };

  revalidatePath("/dashboard/club");
  return {
    success: true,
    message: `Recarga de ${creditsQuantity} crédito(s) efetuada com sucesso! Novo saldo: ${result.newBalance}`,
  };
}
