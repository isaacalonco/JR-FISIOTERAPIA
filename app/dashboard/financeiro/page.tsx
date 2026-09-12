import React from "react";
import Link from "next/link";
import { getCurrentUserSession } from "@/lib/auth/rbac";
import {
  getFinancialSummary,
  listReceivables,
  listExpenses,
} from "@/services/financial.service";
import { listProfessionals } from "@/services/professional.service";
import { formatCurrencyBRL, formatDateBR } from "@/utils/formatters";
import {
  DollarSign,
  ChevronLeft,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  TrendingUp,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  FileText,
} from "lucide-react";
import ExpenseModal from "./expense-modal";
import PaymentButton from "./payment-button";
import PayoutCalculator from "./payout-calculator";

import { redirect } from "next/navigation";

export default async function FinanceiroPage() {
  const session = await getCurrentUserSession();
  if (!session) redirect("/login");

  const tenantId = session.profile.tenantId;

  const [summary, receivables, expenses, profsData] = await Promise.all([
    getFinancialSummary(tenantId),
    listReceivables(tenantId),
    listExpenses(tenantId),
    listProfessionals(tenantId),
  ]);

  const profOptions = profsData.map((p) => ({
    id: p.id,
    name: p.fullName,
    specialtyName: p.specialtyName,
    commissionRate: p.commissionRateDefault,
  }));

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      {/* Header Bar */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-lg font-bold text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                  Gestão Financeira & Fluxo de Caixa
                </h1>
                <span className="text-xs text-slate-400">
                  Contas a Pagar/Receber, Baixas e Repasses Profissionais
                </span>
              </div>
            </div>

            <ExpenseModal />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Total Recebido */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-medium">Total Recebido (Entradas)</span>
              <div className="text-2xl font-extrabold text-emerald-400 font-mono mt-1">
                {formatCurrencyBRL(summary.totalReceived)}
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <ArrowUpRight className="w-6 h-6" />
            </div>
          </div>

          {/* Despesas Pagas */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-medium">Despesas Pagas (Saídas)</span>
              <div className="text-2xl font-extrabold text-rose-400 font-mono mt-1">
                {formatCurrencyBRL(summary.totalExpenses)}
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
              <ArrowDownRight className="w-6 h-6" />
            </div>
          </div>

          {/* Saldo Liquido */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-medium">Saldo Líquido em Caixa</span>
              <div
                className={`text-2xl font-extrabold font-mono mt-1 ${
                  summary.netBalance >= 0 ? "text-cyan-400" : "text-rose-400"
                }`}
              >
                {formatCurrencyBRL(summary.netBalance)}
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
              <Wallet className="w-6 h-6" />
            </div>
          </div>

          {/* A Receber Pendente */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-medium">A Receber (Pendente)</span>
              <div className="text-2xl font-extrabold text-amber-400 font-mono mt-1">
                {formatCurrencyBRL(summary.pendingReceivables)}
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Repasses Simulator */}
        {profOptions.length > 0 && <PayoutCalculator professionals={profOptions} />}

        {/* Contas a Receber Table */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden shadow-xl space-y-4 p-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ArrowUpRight className="w-5 h-5 text-emerald-400" />
            Contas a Receber & Pagamentos
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Descrição</th>
                  <th className="py-3 px-4">Paciente</th>
                  <th className="py-3 px-4">Categoria</th>
                  <th className="py-3 px-4">Vencimento</th>
                  <th className="py-3 px-4">Valor</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {receivables.length > 0 ? (
                  receivables.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-white">{rec.description}</td>
                      <td className="py-3.5 px-4 text-slate-300">{rec.patientName}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                          {rec.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-400">{rec.dueDate}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                        {formatCurrencyBRL(rec.amount)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {rec.status === "PAGO" ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            PAGO
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            PENDENTE
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {rec.status !== "PAGO" && (
                          <PaymentButton receivableId={rec.id} amount={rec.amount} />
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500 text-xs">
                      Nenhum título a receber registrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Despesas Operacionais Table */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden shadow-xl space-y-4 p-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ArrowDownRight className="w-5 h-5 text-rose-400" />
            Despesas Operacionais (Contas a Pagar)
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Descrição</th>
                  <th className="py-3 px-4">Categoria</th>
                  <th className="py-3 px-4">Vencimento</th>
                  <th className="py-3 px-4">Valor</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {expenses.length > 0 ? (
                  expenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-white">{exp.description}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                          {exp.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-400">{exp.dueDate}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-rose-400">
                        {formatCurrencyBRL(exp.amount)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {exp.status === "PAGO" ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            PAGO
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            PENDENTE
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500 text-xs">
                      Nenhuma despesa lançada no momento.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
