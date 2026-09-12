import { createClient } from "@/lib/supabase/server";
import {
  ClubPlanInput,
  ClubSubscriptionInput,
  CreateAuthorizationInput,
  BuyExtraCreditsInput,
} from "@/utils/validators/subscription.schema";

export interface ClubPlanItem {
  id: string;
  tenantId: string;
  name: string;
  monthlyPrice: number;
  creditsPerMonth: number;
  extraCreditPrice: number;
  active: boolean;
  createdAt: string;
}

export interface ClubSubscriptionItem {
  id: string;
  tenantId: string;
  planId: string;
  planName?: string;
  patientId: string;
  patientName?: string;
  patientPhone?: string;
  status: "ATIVO" | "INADIMPLENTE" | "CANCELADO" | "SUSPENSO";
  currentPeriodStart: string;
  currentPeriodEnd: string;
  monthlyCreditsRemaining: number;
  autoRenew: boolean;
  createdAt: string;
}

export interface ClubAuthorizationItem {
  id: string;
  subscriptionId: string;
  authorizationCode: string;
  beneficiaryName: string;
  beneficiaryCpfOrPhone: string;
  creditsReserved: number;
  status: "PENDENTE" | "UTILIZADO" | "CANCELADO" | "EXPIRADO";
  appointmentId?: string | null;
  createdAt: string;
  usedAt?: string | null;
}

export async function listClubPlans(tenantId: string): Promise<ClubPlanItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("club_plans")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((item: any) => ({
    id: item.id,
    tenantId: item.tenant_id,
    name: item.name,
    monthlyPrice: Number(item.monthly_price),
    creditsPerMonth: item.credits_per_month,
    extraCreditPrice: Number(item.extra_credit_price),
    active: item.active,
    createdAt: item.created_at,
  }));
}

export async function createClubPlan(
  tenantId: string,
  input: ClubPlanInput
): Promise<{ success: boolean; data?: ClubPlanItem; error?: string }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("club_plans")
    .insert({
      tenant_id: tenantId,
      name: input.name,
      monthly_price: input.monthlyPrice,
      credits_per_month: input.creditsPerMonth,
      extra_credit_price: input.extraCreditPrice,
    })
    .select("*")
    .single();

  if (error || !data) {
    return { success: false, error: error?.message || "Erro ao criar plano do clube." };
  }

  return {
    success: true,
    data: {
      id: data.id,
      tenantId: data.tenant_id,
      name: data.name,
      monthlyPrice: Number(data.monthly_price),
      creditsPerMonth: data.credits_per_month,
      extraCreditPrice: Number(data.extra_credit_price),
      active: data.active,
      createdAt: data.created_at,
    },
  };
}

export async function listSubscriptions(tenantId: string): Promise<ClubSubscriptionItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("club_subscriptions")
    .select(`
      *,
      club_plans ( name ),
      patients ( full_name, phone )
    `)
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((item: any) => ({
    id: item.id,
    tenantId: item.tenant_id,
    planId: item.plan_id,
    planName: item.club_plans?.name || "Plano JR Saúde Club",
    patientId: item.patient_id,
    patientName: item.patients?.full_name || "Paciente N/A",
    patientPhone: item.patients?.phone || "",
    status: item.status,
    currentPeriodStart: item.current_period_start,
    currentPeriodEnd: item.current_period_end,
    monthlyCreditsRemaining: item.monthly_credits_remaining,
    autoRenew: item.auto_renew,
    createdAt: item.created_at,
  }));
}

export async function createSubscription(
  tenantId: string,
  input: ClubSubscriptionInput
): Promise<{ success: boolean; data?: ClubSubscriptionItem; error?: string }> {
  const supabase = await createClient();

  // Buscar plano para saber créditos
  const { data: plan, error: planError } = await supabase
    .from("club_plans")
    .select("*")
    .eq("id", input.planId)
    .single();

  if (planError || !plan) {
    return { success: false, error: "Plano do clube não encontrado." };
  }

  const now = new Date();
  const periodEnd = new Date(now);
  periodEnd.setMonth(periodEnd.getMonth() + 1);

  const { data, error } = await supabase
    .from("club_subscriptions")
    .insert({
      tenant_id: tenantId,
      plan_id: input.planId,
      patient_id: input.patientId,
      status: "ATIVO",
      current_period_start: now.toISOString(),
      current_period_end: periodEnd.toISOString(),
      monthly_credits_remaining: plan.credits_per_month,
      auto_renew: input.autoRenew,
    })
    .select(`
      *,
      club_plans ( name ),
      patients ( full_name, phone )
    `)
    .single();

  if (error || !data) {
    return { success: false, error: error?.message || "Erro ao assinar plano." };
  }

  // Registrar transação de crédito inicial
  await supabase.from("club_credit_transactions").insert({
    subscription_id: data.id,
    type: "RENOVACAO_MENSAL",
    credits_amount: plan.credits_per_month,
    description: `Carga de créditos iniciais do plano ${plan.name}`,
  });

  return {
    success: true,
    data: {
      id: data.id,
      tenantId: data.tenant_id,
      planId: data.plan_id,
      planName: (data as any).club_plans?.name || plan.name,
      patientId: data.patient_id,
      patientName: (data as any).patients?.full_name,
      patientPhone: (data as any).patients?.phone,
      status: data.status,
      currentPeriodStart: data.current_period_start,
      currentPeriodEnd: data.current_period_end,
      monthlyCreditsRemaining: data.monthly_credits_remaining,
      autoRenew: data.auto_renew,
      createdAt: data.created_at,
    },
  };
}

export async function generateAuthorization(
  input: CreateAuthorizationInput
): Promise<{ success: boolean; data?: ClubAuthorizationItem; error?: string }> {
  const supabase = await createClient();

  // Verificar saldo de créditos da assinatura
  const { data: sub, error: subError } = await supabase
    .from("club_subscriptions")
    .select("monthly_credits_remaining, status")
    .eq("id", input.subscriptionId)
    .single();

  if (subError || !sub) {
    return { success: false, error: "Assinatura do clube não encontrada." };
  }

  if (sub.status !== "ATIVO") {
    return { success: false, error: "Apenas assinaturas com status ATIVO podem gerar autorizações." };
  }

  if (sub.monthly_credits_remaining < input.creditsReserved) {
    return {
      success: false,
      error: `Saldo de créditos insuficiente. Disponível: ${sub.monthly_credits_remaining}, Solicitado: ${input.creditsReserved}`,
    };
  }

  // Gerar código único de voucher (Ex: JRCLUB-8X9A2)
  const code = `JRCLUB-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

  // Abater créditos da assinatura
  const newBalance = sub.monthly_credits_remaining - input.creditsReserved;
  const { error: updateError } = await supabase
    .from("club_subscriptions")
    .update({ monthly_credits_remaining: newBalance })
    .eq("id", input.subscriptionId);

  if (updateError) {
    return { success: false, error: "Falha ao debitar créditos da assinatura." };
  }

  // Criar registro da autorização
  const { data: auth, error: authError } = await supabase
    .from("club_authorizations")
    .insert({
      subscription_id: input.subscriptionId,
      authorization_code: code,
      beneficiary_name: input.beneficiaryName,
      beneficiary_cpf_or_phone: input.beneficiaryCpfOrPhone,
      credits_reserved: input.creditsReserved,
      status: "PENDENTE",
    })
    .select("*")
    .single();

  if (authError || !auth) {
    // Reverter débito se falhar
    await supabase
      .from("club_subscriptions")
      .update({ monthly_credits_remaining: sub.monthly_credits_remaining })
      .eq("id", input.subscriptionId);

    return { success: false, error: "Falha ao registrar código de autorização." };
  }

  // Registrar transação
  await supabase.from("club_credit_transactions").insert({
    subscription_id: input.subscriptionId,
    type: "CONSUMO_TERCEIRO",
    credits_amount: -input.creditsReserved,
    description: `Autorização/Voucher ${code} gerado para ${input.beneficiaryName}`,
  });

  return {
    success: true,
    data: {
      id: auth.id,
      subscriptionId: auth.subscription_id,
      authorizationCode: auth.authorization_code,
      beneficiaryName: auth.beneficiary_name,
      beneficiaryCpfOrPhone: auth.beneficiary_cpf_or_phone,
      creditsReserved: auth.credits_reserved,
      status: auth.status,
      createdAt: auth.created_at,
    },
  };
}

export async function redeemAuthorization(
  authorizationCode: string,
  appointmentId?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const { data: auth, error } = await supabase
    .from("club_authorizations")
    .select("*")
    .eq("authorization_code", authorizationCode.trim().toUpperCase())
    .single();

  if (error || !auth) {
    return { success: false, error: "Código de autorização/voucher não encontrado." };
  }

  if (auth.status !== "PENDENTE") {
    return { success: false, error: `Este voucher já está ${auth.status.toLowerCase()}.` };
  }

  const { error: updateError } = await supabase
    .from("club_authorizations")
    .update({
      status: "UTILIZADO",
      used_at: new Date().toISOString(),
      appointment_id: appointmentId || null,
    })
    .eq("id", auth.id);

  if (updateError) {
    return { success: false, error: "Erro ao resgatar autorização." };
  }

  return { success: true };
}

export async function buyExtraCredits(
  input: BuyExtraCreditsInput
): Promise<{ success: boolean; newBalance?: number; error?: string }> {
  const supabase = await createClient();

  const { data: sub, error: subError } = await supabase
    .from("club_subscriptions")
    .select("id, monthly_credits_remaining, club_plans(extra_credit_price)")
    .eq("id", input.subscriptionId)
    .single();

  if (subError || !sub) {
    return { success: false, error: "Assinatura não encontrada." };
  }

  const newBalance = sub.monthly_credits_remaining + input.creditsQuantity;

  const { error: updateError } = await supabase
    .from("club_subscriptions")
    .update({ monthly_credits_remaining: newBalance })
    .eq("id", input.subscriptionId);

  if (updateError) {
    return { success: false, error: "Falha ao adicionar créditos extras." };
  }

  await supabase.from("club_credit_transactions").insert({
    subscription_id: input.subscriptionId,
    type: "COMPRA_AVULSA",
    credits_amount: input.creditsQuantity,
    description: `Compra avulsa de ${input.creditsQuantity} crédito(s) extra(s)`,
  });

  return { success: true, newBalance };
}

export async function listAuthorizations(subscriptionId?: string): Promise<ClubAuthorizationItem[]> {
  const supabase = await createClient();
  let query = supabase.from("club_authorizations").select("*").order("created_at", { ascending: false });

  if (subscriptionId) {
    query = query.eq("subscription_id", subscriptionId);
  }

  const { data, error } = await query;
  if (error || !data) return [];

  return data.map((item: any) => ({
    id: item.id,
    subscriptionId: item.subscription_id,
    authorizationCode: item.authorization_code,
    beneficiaryName: item.beneficiary_name,
    beneficiaryCpfOrPhone: item.beneficiary_cpf_or_phone,
    creditsReserved: item.credits_reserved,
    status: item.status,
    appointmentId: item.appointment_id,
    createdAt: item.created_at,
    usedAt: item.used_at,
  }));
}
