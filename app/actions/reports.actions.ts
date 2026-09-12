"use server";

import { getCurrentUserSession } from "@/lib/auth/rbac";
import { unitSchema } from "@/utils/validators/reports-unit.schema";
import { createUnit } from "@/services/unit.service";
import { getFinancialReport, getProductivityReport } from "@/services/reports.service";
import { revalidatePath } from "next/cache";

export async function createUnitAction(prevState: any, formData: FormData) {
  try {
    const session = await getCurrentUserSession();
    if (!session) {
      return { error: "Sessão expirada. Faça login novamente." };
    }

    const rawData = {
      name: formData.get("name") as string,
      address: (formData.get("address") as string) || null,
      phone: (formData.get("phone") as string) || null,
      is_active: formData.get("is_active") === "true",
    };

    const validated = unitSchema.parse(rawData);

    const result = await createUnit(session.profile.tenantId, validated);

    if (!result.success) {
      return { error: result.error };
    }

    revalidatePath("/dashboard/unidades");
    revalidatePath("/dashboard/relatorios");
    return { success: true, message: "Unidade cadastrada com sucesso!" };
  } catch (err: any) {
    return { error: err.message || "Falha ao cadastrar unidade." };
  }
}

export async function exportReportCSVAction(reportType: "FINANCIAL" | "PRODUCTIVITY") {
  try {
    const session = await getCurrentUserSession();
    if (!session) {
      return { success: false, error: "Sessão expirada." };
    }

    const tenantId = session.profile.tenantId;

    if (reportType === "FINANCIAL") {
      const data = await getFinancialReport(tenantId);
      let csv = "Indicador,Valor (R$)\n";
      csv += `Faturamento Bruto,${data.grossRevenue.toFixed(2)}\n`;
      csv += `Total Despesas Operacionais,${data.totalExpenses.toFixed(2)}\n`;
      csv += `Faturamento Liquido,${data.netRevenue.toFixed(2)}\n`;
      csv += `Contas a Receber Pendentes,${data.pendingReceivables.toFixed(2)}\n`;

      return {
        success: true,
        filename: `relatorio_financeiro_${new Date().toISOString().split("T")[0]}.csv`,
        csvContent: csv,
      };
    } else {
      const profs = await getProductivityReport(tenantId);
      let csv = "Profissional,Especialidade,Consultas Concluidas,Cancelamentos,Total Agendamentos,Taxa Ocupacao (%)\n";
      profs.forEach((p) => {
        csv += `"${p.professionalName}","${p.specialty}",${p.completedAppointments},${p.canceledAppointments},${p.totalAppointments},${p.occupancyRate}%\n`;
      });

      return {
        success: true,
        filename: `relatorio_produtividade_${new Date().toISOString().split("T")[0]}.csv`,
        csvContent: csv,
      };
    }
  } catch (err: any) {
    return { success: false, error: err.message || "Erro ao gerar exportação CSV." };
  }
}
