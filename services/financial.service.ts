import { createClient } from "@/lib/supabase/server";
import {
  ReceivableInput,
  ExpenseInput,
  PaymentInput,
  PayoutInput,
} from "@/utils/validators/financial.schema";

export interface FinancialSummary {
  totalReceived: number;
  totalExpenses: number;
  netBalance: number;
  pendingReceivables: number;
  pendingExpenses: number;
}

export interface ReceivableRecord {
  id: string;
  tenantId: string;
  unitId: string;
  patientId?: string | null;
  patientName?: string;
  description: string;
  category: string;
  amount: number;
  dueDate: string;
  status: string;
  createdAt: string;
}

export interface ExpenseRecord {
  id: string;
  tenantId: string;
  unitId: string;
  description: string;
  category: string;
  amount: number;
  dueDate: string;
  paymentDate?: string | null;
  status: string;
  createdAt: string;
}

/**
 * Resumo do Fluxo de Caixa Consolidado.
 */
export async function getFinancialSummary(tenantId: string): Promise<FinancialSummary> {
  const supabase = await createClient();

  const [receivablesRes, expensesRes, paymentsRes] = await Promise.all([
    supabase.from("receivables").select("amount, status").eq("tenant_id", tenantId),
    supabase.from("expenses").select("amount, status").eq("tenant_id", tenantId),
    supabase.from("payments").select("amount_paid").eq("tenant_id", tenantId),
  ]);

  let totalReceived = 0;
  if (paymentsRes.data) {
    totalReceived = paymentsRes.data.reduce((acc: number, item: any) => acc + Number(item.amount_paid || 0), 0);
  }

  let totalExpenses = 0;
  let pendingExpenses = 0;
  if (expensesRes.data) {
    expensesRes.data.forEach((exp: any) => {
      const amt = Number(exp.amount || 0);
      if (exp.status === "PAGO") {
        totalExpenses += amt;
      } else {
        pendingExpenses += amt;
      }
    });
  }

  let pendingReceivables = 0;
  if (receivablesRes.data) {
    receivablesRes.data.forEach((rec: any) => {
      if (rec.status === "PENDENTE" || rec.status === "ATRASADO") {
        pendingReceivables += Number(rec.amount || 0);
      }
    });
  }

  const netBalance = totalReceived - totalExpenses;

  return {
    totalReceived,
    totalExpenses,
    netBalance,
    pendingReceivables,
    pendingExpenses,
  };
}

/**
 * Listagem de Contas a Receber.
 */
export async function listReceivables(
  tenantId: string,
  status?: string
): Promise<ReceivableRecord[]> {
  const supabase = await createClient();

  let query = supabase
    .from("receivables")
    .select("*, patients(full_name)")
    .eq("tenant_id", tenantId)
    .order("due_date", { ascending: true });

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;
  if (error || !data) return [];

  return data.map((item: any) => ({
    id: item.id,
    tenantId: item.tenant_id,
    unitId: item.unit_id,
    patientId: item.patient_id,
    patientName: item.patients?.full_name || "Geral",
    description: item.description,
    category: item.category,
    amount: Number(item.amount),
    dueDate: item.due_date,
    status: item.status,
    createdAt: item.created_at,
  }));
}

/**
 * Listagem de Despesas Operacionais (Contas a Pagar).
 */
export async function listExpenses(
  tenantId: string,
  status?: string
): Promise<ExpenseRecord[]> {
  const supabase = await createClient();

  let query = supabase
    .from("expenses")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("due_date", { ascending: true });

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;
  if (error || !data) return [];

  return data.map((item: any) => ({
    id: item.id,
    tenantId: item.tenant_id,
    unitId: item.unit_id,
    description: item.description,
    category: item.category,
    amount: Number(item.amount),
    dueDate: item.due_date,
    paymentDate: item.payment_date,
    status: item.status,
    createdAt: item.created_at,
  }));
}

/**
 * Cadastra um novo título a receber.
 */
export async function createReceivable(
  tenantId: string,
  unitId: string,
  input: ReceivableInput
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const { error } = await supabase.from("receivables").insert({
    tenant_id: tenantId,
    unit_id: unitId,
    patient_id: input.patientId || null,
    appointment_id: input.appointmentId || null,
    subscription_id: input.subscriptionId || null,
    description: input.description,
    category: input.category,
    amount: input.amount,
    due_date: input.dueDate,
    status: "PENDENTE",
  });

  if (error) {
    return { success: false, error: "Falha ao registrar conta a receber." };
  }

  return { success: true };
}

/**
 * Cadastra uma nova despesa operacional (Contas a pagar).
 */
export async function createExpense(
  tenantId: string,
  unitId: string,
  input: ExpenseInput
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const { error } = await supabase.from("expenses").insert({
    tenant_id: tenantId,
    unit_id: unitId,
    description: input.description,
    category: input.category,
    amount: input.amount,
    due_date: input.dueDate,
    payment_date: input.paymentDate || null,
    status: input.paymentDate ? "PAGO" : "PENDENTE",
  });

  if (error) {
    return { success: false, error: "Falha ao registrar despesa." };
  }

  return { success: true };
}

/**
 * Registra baixa/pagamento de um título a receber.
 */
export async function registerPayment(
  tenantId: string,
  input: PaymentInput
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  // 1. Registra o pagamento na tabela de transações
  const { error: payError } = await supabase.from("payments").insert({
    tenant_id: tenantId,
    receivable_id: input.receivableId,
    payment_method: input.paymentMethod,
    amount_paid: input.amountPaid,
    transaction_code: input.transactionCode || null,
  });

  if (payError) {
    return { success: false, error: "Falha ao registrar a transação de pagamento." };
  }

  // 2. Atualiza o status do título a receber para PAGO
  const { error: recError } = await supabase
    .from("receivables")
    .update({ status: "PAGO", updated_at: new Date().toISOString() })
    .eq("id", input.receivableId);

  if (recError) {
    return { success: false, error: "Falha ao atualizar o status do título." };
  }

  return { success: true };
}

/**
 * Calculadora de Repasses Profissionais por Período.
 */
export async function calculateProfessionalPayout(
  tenantId: string,
  input: PayoutInput
): Promise<{
  professionalName: string;
  commissionRate: number;
  totalServiceVolume: number;
  payoutAmount: number;
  completedAppointmentsCount: number;
}> {
  const supabase = await createClient();

  // Busca o profissional e sua taxa de comissão padrão
  const { data: prof } = await supabase
    .from("professionals")
    .select("commission_rate_default, profiles(full_name)")
    .eq("id", input.professionalId)
    .single();

  const commissionRate = Number(prof?.commission_rate_default || 0);
  const professionalName = (prof as any)?.profiles?.full_name || "Profissional";

  // Busca consultas concluídas no período
  const startISO = `${input.periodStart}T00:00:00.000Z`;
  const endISO = `${input.periodEnd}T23:59:59.999Z`;

  const { data: appts } = await supabase
    .from("appointments")
    .select("services(price)")
    .eq("tenant_id", tenantId)
    .eq("professional_id", input.professionalId)
    .eq("status", "CONCLUIDO")
    .gte("start_time", startISO)
    .lte("start_time", endISO);

  let totalServiceVolume = 0;
  let count = 0;

  if (appts) {
    count = appts.length;
    totalServiceVolume = appts.reduce((acc, item: any) => acc + Number(item.services?.price || 0), 0);
  }

  const payoutAmount = (totalServiceVolume * commissionRate) / 100;

  return {
    professionalName,
    commissionRate,
    totalServiceVolume,
    payoutAmount,
    completedAppointmentsCount: count,
  };
}
