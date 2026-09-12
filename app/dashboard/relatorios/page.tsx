import React from "react";
import Link from "next/link";
import { getCurrentUserSession } from "@/lib/auth/rbac";
import { redirect } from "next/navigation";
import {
  getFinancialReport,
  getProductivityReport,
  getClubAnalytics,
} from "@/services/reports.service";
import { listUnits } from "@/services/unit.service";
import ExportReportButton from "./export-button";
import { formatCurrencyBRL } from "@/utils/formatters";
import {
  ChevronLeft,
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  Crown,
  Calendar,
  Building2,
  Search,
  CheckCircle,
  Percent,
} from "lucide-react";

interface ReportsPageProps {
  searchParams: Promise<{
    startDate?: string;
    endDate?: string;
    unitId?: string;
  }>;
}

export default async function ExecutiveReportsPage({ searchParams }: ReportsPageProps) {
  const session = await getCurrentUserSession();
  if (!session) {
    redirect("/login");
  }

  const resolvedParams = await searchParams;
  const tenantId = session.profile.tenantId;

  const [financial, productivity, club, units] = await Promise.all([
    getFinancialReport(tenantId, resolvedParams.startDate, resolvedParams.endDate),
    getProductivityReport(tenantId, resolvedParams.startDate, resolvedParams.endDate),
    getClubAnalytics(tenantId),
    listUnits(tenantId),
  ]);

  return (
    <main className="min-h-screen bg-[#000A1B] text-[#E3DCBE] pb-16">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-[#010F25]/90 backdrop-blur-md border-b border-[#011733] px-4 sm:px-8 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="p-2 rounded-xl bg-[#011733] hover:bg-[#011733]/80 text-[#E3DCBE] transition-colors flex items-center justify-center border border-[#C1801F]/20"
            title="Voltar ao Dashboard"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#F5CD67]" />
              <h1 className="text-lg font-black text-white tracking-wide">
                Relatórios Executivos & DRE Consolidado
              </h1>
            </div>
            <p className="text-xs text-[#E3DCBE]/70">
              Análise financeira, inteligência de negócios e produtividade da equipe.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ExportReportButton reportType="FINANCIAL" label="Exportar Financeiro (CSV)" />
          <ExportReportButton reportType="PRODUCTIVITY" label="Exportar Equipe (CSV)" />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 space-y-8">
        {/* Filter Bar */}
        <form method="GET" className="p-4 rounded-2xl bg-[#010F25] border border-[#011733] grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-[11px] font-semibold text-[#E3DCBE]/70 mb-1">
              Data Inicial
            </label>
            <input
              type="date"
              name="startDate"
              defaultValue={resolvedParams.startDate || ""}
              className="w-full p-2.5 bg-[#000A1B] border border-[#011733] focus:border-[#E5A838] rounded-xl text-xs text-[#E3DCBE] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#E3DCBE]/70 mb-1">
              Data Final
            </label>
            <input
              type="date"
              name="endDate"
              defaultValue={resolvedParams.endDate || ""}
              className="w-full p-2.5 bg-[#000A1B] border border-[#011733] focus:border-[#E5A838] rounded-xl text-xs text-[#E3DCBE] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="w-full p-2.5 rounded-xl bg-gradient-to-r from-[#E5A838] via-[#F5CD67] to-[#C1801F] hover:opacity-95 text-[#000A1B] font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <Search className="w-4 h-4" />
              <span>Filtrar Período</span>
            </button>
          </div>
        </form>

        {/* Section 1: Indicadores Financeiros */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-[#F5CD67]" />
            <span>Resultado Financeiro Consolidado</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#010F25] border border-[#011733] flex items-center justify-between">
              <div>
                <p className="text-xs text-[#E3DCBE]/60 font-medium">Faturamento Bruto</p>
                <p className="text-2xl font-black text-emerald-400 mt-1">
                  {formatCurrencyBRL(financial.grossRevenue)}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#010F25] border border-[#011733] flex items-center justify-between">
              <div>
                <p className="text-xs text-[#E3DCBE]/60 font-medium">Despesas Operacionais</p>
                <p className="text-2xl font-black text-rose-400 mt-1">
                  {formatCurrencyBRL(financial.totalExpenses)}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#010F25] border border-[#011733] flex items-center justify-between">
              <div>
                <p className="text-xs text-[#E3DCBE]/60 font-medium">Lucro Líquido</p>
                <p
                  className={`text-2xl font-black mt-1 ${
                    financial.netRevenue >= 0 ? "text-[#F5CD67]" : "text-rose-400"
                  }`}
                >
                  {formatCurrencyBRL(financial.netRevenue)}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#E5A838]/10 text-[#F5CD67] flex items-center justify-center border border-[#C1801F]/20">
                <BarChart3 className="w-5 h-5" />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#010F25] border border-[#011733] flex items-center justify-between">
              <div>
                <p className="text-xs text-[#E3DCBE]/60 font-medium">A Receber (Pendente)</p>
                <p className="text-2xl font-black text-amber-300 mt-1">
                  {formatCurrencyBRL(financial.pendingReceivables)}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Produtividade da Equipe Fisioterapêutica */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-[#F5CD67]" />
            <span>Produtividade & Ocupação de Agenda por Profissional</span>
          </h2>

          <div className="bg-[#010F25] border border-[#011733] rounded-2xl overflow-hidden shadow-md">
            {productivity.length === 0 ? (
              <div className="p-12 text-center text-[#E3DCBE]/60 space-y-2">
                <Users className="w-8 h-8 mx-auto text-[#E3DCBE]/30" />
                <p className="text-sm font-semibold">Nenhum dado de profissional encontrado.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#000A1B]/60 border-b border-[#011733] text-[#E3DCBE]/70 uppercase font-semibold">
                    <tr>
                      <th className="p-4">Profissional</th>
                      <th className="p-4">Especialidade</th>
                      <th className="p-4">Consultas Concluídas</th>
                      <th className="p-4">Cancelamentos</th>
                      <th className="p-4">Total Agendamentos</th>
                      <th className="p-4">Taxa de Ocupação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#011733]/60 text-[#E3DCBE]">
                    {productivity.map((p) => (
                      <tr key={p.professionalId} className="hover:bg-[#011733]/40 transition-colors">
                        <td className="p-4 font-bold text-white">{p.professionalName}</td>
                        <td className="p-4 text-[#F5CD67] font-semibold">{p.specialty}</td>
                        <td className="p-4 font-mono font-bold text-emerald-400">
                          {p.completedAppointments}
                        </td>
                        <td className="p-4 font-mono text-rose-400">
                          {p.canceledAppointments}
                        </td>
                        <td className="p-4 font-mono text-white">{p.totalAppointments}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-[#000A1B] h-2 rounded-full overflow-hidden border border-[#011733]">
                              <div
                                className="bg-gradient-to-r from-[#E5A838] to-[#F5CD67] h-full"
                                style={{ width: `${Math.min(100, p.occupancyRate)}%` }}
                              />
                            </div>
                            <span className="font-mono font-bold text-[#F5CD67]">
                              {p.occupancyRate}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Section 3: Indicadores JR Club */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Crown className="w-5 h-5 text-[#F5CD67]" />
            <span>Desempenho do Programa JR Club</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#010F25] border border-[#011733]">
              <p className="text-xs text-[#E3DCBE]/60 font-medium">Assinaturas Ativas</p>
              <p className="text-2xl font-black text-[#F5CD67] mt-1">{club.activeSubscriptions}</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#010F25] border border-[#011733]">
              <p className="text-xs text-[#E3DCBE]/60 font-medium">Recargas de Crédito</p>
              <p className="text-2xl font-black text-cyan-400 mt-1">{club.extraCreditsPurchased}</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#010F25] border border-[#011733]">
              <p className="text-xs text-[#E3DCBE]/60 font-medium">Vouchers Emitidos</p>
              <p className="text-2xl font-black text-amber-300 mt-1">{club.vouchersIssued}</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#010F25] border border-[#011733]">
              <p className="text-xs text-[#E3DCBE]/60 font-medium">Receita Adicional do Clube</p>
              <p className="text-2xl font-black text-emerald-400 mt-1">
                {formatCurrencyBRL(club.totalClubRevenue)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
