import { createClient } from "@/lib/supabase/server";

export interface FinancialReportData {
  grossRevenue: number;
  totalExpenses: number;
  netRevenue: number;
  pendingReceivables: number;
  paymentMethodBreakdown: { method: string; total: number; count: number }[];
}

export interface ProfessionalProductivity {
  professionalId: string;
  professionalName: string;
  specialty: string;
  completedAppointments: number;
  canceledAppointments: number;
  totalAppointments: number;
  occupancyRate: number;
}

export interface ClubAnalyticsData {
  activeSubscriptions: number;
  extraCreditsPurchased: number;
  vouchersIssued: number;
  totalClubRevenue: number;
}

/**
 * Gera relatório consolidado financeiro do tenant
 */
export async function getFinancialReport(
  tenantId: string,
  startDate?: string,
  endDate?: string
): Promise<FinancialReportData> {
  try {
    const supabase = await createClient();

    // 1. Busca Contas a Receber (Pagas)
    let receivablesQuery = supabase
      .from("receivables")
      .select("amount, status, payment_method")
      .eq("tenant_id", tenantId);

    if (startDate) receivablesQuery = receivablesQuery.gte("due_date", startDate);
    if (endDate) receivablesQuery = receivablesQuery.lte("due_date", endDate);

    const { data: receivables } = await receivablesQuery;

    let grossRevenue = 0;
    let pendingReceivables = 0;
    const methodMap = new Map<string, { total: number; count: number }>();

    (receivables || []).forEach((r: any) => {
      const amt = Number(r.amount) || 0;
      if (r.status === "PAGO") {
        grossRevenue += amt;
        const method = r.payment_method || "OUTRO";
        const current = methodMap.get(method) || { total: 0, count: 0 };
        methodMap.set(method, {
          total: current.total + amt,
          count: current.count + 1,
        });
      } else if (r.status === "PENDENTE") {
        pendingReceivables += amt;
      }
    });

    // 2. Busca Despesas (Pagas)
    let expensesQuery = supabase
      .from("expenses")
      .select("amount, status")
      .eq("tenant_id", tenantId);

    if (startDate) expensesQuery = expensesQuery.gte("due_date", startDate);
    if (endDate) expensesQuery = expensesQuery.lte("due_date", endDate);

    const { data: expenses } = await expensesQuery;
    let totalExpenses = 0;

    (expenses || []).forEach((e: any) => {
      if (e.status === "PAGO") {
        totalExpenses += Number(e.amount) || 0;
      }
    });

    const netRevenue = grossRevenue - totalExpenses;

    const paymentMethodBreakdown = Array.from(methodMap.entries()).map(([method, data]) => ({
      method,
      total: data.total,
      count: data.count,
    }));

    return {
      grossRevenue,
      totalExpenses,
      netRevenue,
      pendingReceivables,
      paymentMethodBreakdown,
    };
  } catch (err: any) {
    console.warn("Erro ao gerar relatório financeiro:", err?.message || String(err));
    return {
      grossRevenue: 0,
      totalExpenses: 0,
      netRevenue: 0,
      pendingReceivables: 0,
      paymentMethodBreakdown: [],
    };
  }
}

/**
 * Gera relatório de produtividade por profissional da saúde
 */
export async function getProductivityReport(
  tenantId: string,
  startDate?: string,
  endDate?: string
): Promise<ProfessionalProductivity[]> {
  try {
    const supabase = await createClient();

    // 1. Busca Profissionais
    const { data: profs } = await supabase
      .from("professionals")
      .select("id, full_name, specialty")
      .eq("tenant_id", tenantId);

    if (!profs || profs.length === 0) return [];

    // 2. Busca Agendamentos
    let apptsQuery = supabase
      .from("appointments")
      .select("professional_id, status")
      .eq("tenant_id", tenantId);

    if (startDate) apptsQuery = apptsQuery.gte("start_time", startDate);
    if (endDate) apptsQuery = apptsQuery.lte("start_time", endDate);

    const { data: appts } = await apptsQuery;

    const profMap = new Map<
      string,
      { completed: number; canceled: number; total: number }
    >();

    (appts || []).forEach((a: any) => {
      if (!a.professional_id) return;
      const current = profMap.get(a.professional_id) || {
        completed: 0,
        canceled: 0,
        total: 0,
      };

      current.total += 1;
      if (a.status === "CONCLUIDO" || a.status === "EM_ATENDIMENTO") {
        current.completed += 1;
      } else if (a.status === "CANCELADO") {
        current.canceled += 1;
      }
      profMap.set(a.professional_id, current);
    });

    return profs.map((p: any) => {
      const stats = profMap.get(p.id) || { completed: 0, canceled: 0, total: 0 };
      const occupancyRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

      return {
        professionalId: p.id,
        professionalName: p.full_name,
        specialty: p.specialty || "Fisioterapia",
        completedAppointments: stats.completed,
        canceledAppointments: stats.canceled,
        totalAppointments: stats.total,
        occupancyRate,
      };
    });
  } catch (err: any) {
    console.warn("Erro ao gerar relatório de produtividade:", err?.message || String(err));
    return [];
  }
}

/**
 * Gera indicadores do programa JR Club
 */
export async function getClubAnalytics(tenantId: string): Promise<ClubAnalyticsData> {
  try {
    const supabase = await createClient();

    const [subsRes, vouchersRes, extraCreditsRes] = await Promise.all([
      supabase.from("club_subscriptions").select("status").eq("tenant_id", tenantId),
      supabase.from("club_vouchers").select("id").eq("tenant_id", tenantId),
      supabase.from("club_credit_purchases").select("amount_paid").eq("tenant_id", tenantId),
    ]);

    const activeSubscriptions = (subsRes.data || []).filter(
      (s: any) => s.status === "ATIVA"
    ).length;

    const vouchersIssued = (vouchersRes.data || []).length;

    let extraCreditsPurchased = 0;
    let totalClubRevenue = 0;

    (extraCreditsRes.data || []).forEach((c: any) => {
      const paid = Number(c.amount_paid) || 0;
      totalClubRevenue += paid;
      extraCreditsPurchased += 1;
    });

    return {
      activeSubscriptions,
      extraCreditsPurchased,
      vouchersIssued,
      totalClubRevenue,
    };
  } catch (err: any) {
    console.warn("Erro ao gerar indicadores do JR Club:", err?.message || String(err));
    return {
      activeSubscriptions: 0,
      extraCreditsPurchased: 0,
      vouchersIssued: 0,
      totalClubRevenue: 0,
    };
  }
}
