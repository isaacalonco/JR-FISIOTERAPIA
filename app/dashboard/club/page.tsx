import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUserSession } from "@/lib/auth/rbac";
import {
  listClubPlans,
  listSubscriptions,
  listAuthorizations,
} from "@/services/subscription.service";
import { formatCurrencyBRL, formatDateBR } from "@/utils/formatters";
import {
  Sparkles,
  ChevronLeft,
  Crown,
  Users,
  Ticket,
  DollarSign,
  Gift,
  Zap,
  CreditCard,
} from "lucide-react";
import { JRLogo } from "@/components/ui/jr-logo";

import RedeemVoucherButton from "./redeem-voucher-button";

export default async function ClubPage() {
  const session = await getCurrentUserSession();
  if (!session) redirect("/login");

  const tenantId = session.profile.tenantId;

  const [plans, subscriptions, authorizations] = await Promise.all([
    listClubPlans(tenantId),
    listSubscriptions(tenantId),
    listAuthorizations(),
  ]);

  // KPIs de Acompanhamento
  const activeSubs = subscriptions.filter((s) => s.status === "ATIVO");
  const totalCreditsAvailable = activeSubs.reduce((acc, s) => acc + s.monthlyCreditsRemaining, 0);
  const mrr = activeSubs.reduce((acc, s) => {
    const plan = plans.find((p) => p.id === s.planId);
    return acc + (plan ? plan.monthlyPrice : 0);
  }, 0);
  const vouchersGenerated = authorizations.length;

  return (
    <main className="min-h-screen bg-[#000A1B] text-[#E3DCBE] pb-16">
      {/* Header */}
      <header className="border-b border-[#011733] bg-[#010F25]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="p-2 rounded-xl bg-[#011733] hover:bg-[#011733]/80 text-[#E3DCBE] transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <JRLogo size="md" subtitle="JR Saúde Club - Monitoramento" />
            </div>

            <div className="px-3.5 py-1.5 rounded-xl bg-[#011733]/80 border border-[#C1801F]/30 text-xs text-[#F5CD67] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E5A838] animate-pulse" />
              Modo Acompanhamento Operacional
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Assinantes Ativos */}
          <div className="bg-[#010F25]/80 border border-[#C1801F]/30 rounded-3xl p-6 flex items-center justify-between shadow-lg">
            <div>
              <span className="text-xs text-[#E3DCBE]/70 font-medium">Assinantes Ativos</span>
              <div className="text-2xl font-extrabold text-[#F5CD67] font-mono mt-1">
                {activeSubs.length}
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#E5A838]/10 text-[#E5A838] flex items-center justify-center border border-[#C1801F]/30">
              <Users className="w-6 h-6" />
            </div>
          </div>

          {/* Saldo Total de Créditos */}
          <div className="bg-[#010F25]/80 border border-[#C1801F]/30 rounded-3xl p-6 flex items-center justify-between shadow-lg">
            <div>
              <span className="text-xs text-[#E3DCBE]/70 font-medium">Créditos em Circulação</span>
              <div className="text-2xl font-extrabold text-[#F5CD67] font-mono mt-1">
                {totalCreditsAvailable}
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#E5A838]/10 text-[#F5CD67] flex items-center justify-center border border-[#C1801F]/30">
              <Zap className="w-6 h-6" />
            </div>
          </div>

          {/* MRR (Receita Recorrente Mensal) */}
          <div className="bg-[#010F25]/80 border border-[#C1801F]/30 rounded-3xl p-6 flex items-center justify-between shadow-lg">
            <div>
              <span className="text-xs text-[#E3DCBE]/70 font-medium">Faturamento Recorrente (MRR)</span>
              <div className="text-2xl font-extrabold text-[#F5CD67] font-mono mt-1">
                {formatCurrencyBRL(mrr)}
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#E5A838]/10 text-[#E5A838] flex items-center justify-center border border-[#C1801F]/30">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>

          {/* Vouchers Emitidos */}
          <div className="bg-[#010F25]/80 border border-[#C1801F]/30 rounded-3xl p-6 flex items-center justify-between shadow-lg">
            <div>
              <span className="text-xs text-[#E3DCBE]/70 font-medium">Vouchers Presente Emitidos</span>
              <div className="text-2xl font-extrabold text-[#F5CD67] font-mono mt-1">
                {vouchersGenerated}
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#E5A838]/10 text-[#F5CD67] flex items-center justify-center border border-[#C1801F]/30">
              <Ticket className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Section 1: Assinantes & Créditos Ativos */}
        <section className="bg-[#010F25]/80 border border-[#C1801F]/30 rounded-3xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#011733] pb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Crown className="w-5 h-5 text-[#E5A838]" />
                Acompanhamento de Assinantes
              </h2>
              <p className="text-xs text-[#E3DCBE]/70">
                Lista de pacientes titulares com plano ativo, saldo de créditos e período de renovação
              </p>
            </div>
          </div>

          {subscriptions.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-[#011733] rounded-2xl bg-[#000A1B]/40">
              <Crown className="w-10 h-10 text-[#E5A838]/40 mx-auto mb-3" />
              <p className="text-[#E3DCBE]/80 text-sm font-medium">Nenhum assinante ativo no momento.</p>
              <p className="text-[#E3DCBE]/50 text-xs mt-1">
                As novas assinaturas realizadas pelos clientes na Landing Page aparecerão aqui automaticamente.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-[#E3DCBE]">
                <thead className="bg-[#000A1B] text-[#F5CD67] text-xs uppercase font-mono border-b border-[#011733]">
                  <tr>
                    <th className="px-4 py-3">Paciente Titular</th>
                    <th className="px-4 py-3">Plano</th>
                    <th className="px-4 py-3">Créditos Restantes</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Vigência</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#011733]">
                  {subscriptions.map((s) => (
                    <tr key={s.id} className="hover:bg-[#011733]/40 transition-colors">
                      <td className="px-4 py-4 font-semibold text-white">
                        {s.patientName}
                        <span className="block text-[11px] text-[#E3DCBE]/60 font-normal">
                          {s.patientPhone || "Sem telefone"}
                        </span>
                      </td>
                      <td className="px-4 py-4 font-medium text-[#F5CD67]">{s.planName}</td>
                      <td className="px-4 py-4 font-mono font-bold">
                        <span className="px-3 py-1 bg-[#E5A838]/10 text-[#F5CD67] border border-[#C1801F]/30 rounded-full text-xs inline-flex items-center gap-1">
                          <Zap className="w-3.5 h-3.5" />
                          {s.monthlyCreditsRemaining} crédito(s)
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-semibold">
                          {s.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-xs font-mono text-[#E3DCBE]/70">
                        {formatDateBR(s.currentPeriodStart.split("T")[0])} até{" "}
                        {formatDateBR(s.currentPeriodEnd.split("T")[0])}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Section 2: Vouchers / Autorizações de Terceiros */}
        <section className="bg-[#010F25]/80 border border-[#C1801F]/30 rounded-3xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#011733] pb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Ticket className="w-5 h-5 text-[#F5CD67]" />
                Vouchers de Autorização Emitidos (Presentes)
              </h2>
              <p className="text-xs text-[#E3DCBE]/70">
                Acompanhamento dos códigos de autorização para terceiros com validação da recepção
              </p>
            </div>
          </div>

          {authorizations.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-[#011733] rounded-2xl bg-[#000A1B]/40">
              <Gift className="w-10 h-10 text-[#E5A838]/40 mx-auto mb-3" />
              <p className="text-[#E3DCBE]/80 text-sm font-medium">Nenhum voucher emitido até o momento.</p>
              <p className="text-[#E3DCBE]/50 text-xs mt-1">
                Os vouchers gerados pelos assinantes na Landing Page aparecerão aqui para conferência da recepção.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-[#E3DCBE]">
                <thead className="bg-[#000A1B] text-[#F5CD67] text-xs uppercase font-mono border-b border-[#011733]">
                  <tr>
                    <th className="px-4 py-3">Código Voucher</th>
                    <th className="px-4 py-3">Beneficiário (Amigo)</th>
                    <th className="px-4 py-3">Contato / CPF</th>
                    <th className="px-4 py-3">Créditos</th>
                    <th className="px-4 py-3">Ação Recepção</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#011733]">
                  {authorizations.map((auth) => (
                    <tr key={auth.id} className="hover:bg-[#011733]/40 transition-colors">
                      <td className="px-4 py-4 font-mono font-extrabold text-[#F5CD67] tracking-wider">
                        {auth.authorizationCode}
                      </td>
                      <td className="px-4 py-4 font-semibold text-white">{auth.beneficiaryName}</td>
                      <td className="px-4 py-4 text-xs font-mono text-[#E3DCBE]/80">
                        {auth.beneficiaryCpfOrPhone}
                      </td>
                      <td className="px-4 py-4 font-mono font-bold text-[#E5A838]">
                        {auth.creditsReserved} crédito(s)
                      </td>
                      <td className="px-4 py-4">
                        <RedeemVoucherButton
                          authorizationCode={auth.authorizationCode}
                          status={auth.status}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Section 3: Catálogo Vigente de Planos do Clube */}
        <section className="bg-[#010F25]/80 border border-[#C1801F]/30 rounded-3xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#011733] pb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#E5A838]" />
                Catálogo Vigente do JR Saúde Club
              </h2>
              <p className="text-xs text-[#E3DCBE]/70">
                Planos ativos configurados para exibição na Landing Page
              </p>
            </div>
          </div>

          {plans.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-[#011733] rounded-2xl bg-[#000A1B]/40">
              <CreditCard className="w-10 h-10 text-[#E5A838]/40 mx-auto mb-3" />
              <p className="text-[#E3DCBE]/80 text-sm font-medium">Nenhum plano ativo cadastrado.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((pl) => (
                <div
                  key={pl.id}
                  className="bg-[#000A1B]/80 border border-[#C1801F]/30 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#E5A838]/10 rounded-full blur-2xl pointer-events-none" />

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 bg-[#E5A838]/10 text-[#F5CD67] border border-[#C1801F]/30 rounded-full text-xs font-semibold">
                        Assinatura Mensal
                      </span>
                      <span className="text-xs font-mono text-[#F5CD67] font-bold">
                        {pl.creditsPerMonth} créditos/mês
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white">{pl.name}</h3>

                    <div className="mt-4 mb-6">
                      <span className="text-3xl font-extrabold text-white font-mono">
                        {formatCurrencyBRL(pl.monthlyPrice)}
                      </span>
                      <span className="text-xs text-[#E3DCBE]/60"> /mês</span>
                    </div>

                    <div className="space-y-2 border-t border-[#011733] pt-4 text-xs text-[#E3DCBE]">
                      <div className="flex items-center justify-between">
                        <span className="text-[#E3DCBE]/60">Cota Mensal:</span>
                        <span className="font-semibold text-[#F5CD67]">{pl.creditsPerMonth} Crédito(s)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#E3DCBE]/60">Crédito Extra Avulso:</span>
                        <span className="font-semibold text-[#E5A838] font-mono">
                          {formatCurrencyBRL(pl.extraCreditPrice)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#E3DCBE]/60">Transferência para Amigos:</span>
                        <span className="font-semibold text-[#F5CD67]">Habilitada</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
