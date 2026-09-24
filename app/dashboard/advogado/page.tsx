import React from "react";
import Link from "next/link";
import { getCurrentUserSession } from "@/lib/auth/rbac";
import { listLegalCases } from "@/services/legal.service";
import { formatCurrencyBRL, formatDateBR, formatPhone } from "@/utils/formatters";
import {
  Scale,
  Search,
  ChevronLeft,
  Calendar,
  DollarSign,
  User,
  Phone,
  FileText,
  Clock,
  Briefcase,
  ShieldCheck,
  Building,
} from "lucide-react";
import { JRLogo } from "@/components/ui/jr-logo";
import { redirect } from "next/navigation";
import LegalCaseModal from "./legal-case-modal";
import LegalProgressModal from "./legal-progress-modal";

interface AdvogadoPageProps {
  searchParams: Promise<{ q?: string; tipo?: string }>;
}

export default async function AdvogadoPage({ searchParams }: AdvogadoPageProps) {
  const session = await getCurrentUserSession();
  if (!session) redirect("/login");

  const { q, tipo } = await searchParams;
  const searchQuery = q || "";
  const processTypeFilter = tipo || "";

  const { cases, kpis } = await listLegalCases(session.profile.tenantId, {
    search: searchQuery,
    processType: processTypeFilter,
  });

  const getProcessTypeBadge = (type: string) => {
    switch (type) {
      case "INSS":
        return "bg-blue-500/10 text-blue-300 border-blue-500/30";
      case "Observadoria":
        return "bg-[#E5A838]/10 text-[#F5CD67] border-[#C1801F]/30";
      case "Afastamento":
        return "bg-emerald-500/10 text-emerald-300 border-emerald-500/30";
      default:
        return "bg-gray-500/10 text-gray-300 border-gray-500/30";
    }
  };

  return (
    <main className="min-h-screen bg-[#000A1B] text-[#E3DCBE] pb-16">
      {/* Header Bar */}
      <header className="border-b border-[#011733] bg-[#010F25]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="p-2 rounded-xl bg-[#011733] hover:bg-[#011733]/80 text-[#E3DCBE] transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <JRLogo
                size="md"
                subtitle={`Área do Advogado • Gestão Jurídica & Previdenciária (${cases.length} processo${
                  cases.length === 1 ? "" : "s"
                })`}
              />
            </div>

            <LegalCaseModal />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        {/* KPIs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#010F25]/80 border border-[#C1801F]/25 rounded-2xl p-5 shadow-lg flex items-center justify-between">
            <div>
              <span className="text-xs text-[#E3DCBE]/60 font-medium">Total de Processos</span>
              <div className="text-2xl font-extrabold text-white mt-1 font-mono">
                {kpis.totalCases}
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-[#E5A838]/10 text-[#E5A838] flex items-center justify-center border border-[#C1801F]/30">
              <Scale className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-[#010F25]/80 border border-[#C1801F]/25 rounded-2xl p-5 shadow-lg flex items-center justify-between">
            <div>
              <span className="text-xs text-[#E3DCBE]/60 font-medium">Honorários / Valores Pagos</span>
              <div className="text-2xl font-extrabold text-emerald-400 mt-1 font-mono">
                {formatCurrencyBRL(kpis.totalRevenue)}
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-[#010F25]/80 border border-[#C1801F]/25 rounded-2xl p-5 shadow-lg flex items-center justify-between">
            <div>
              <span className="text-xs text-[#E3DCBE]/60 font-medium">Ações de INSS</span>
              <div className="text-2xl font-extrabold text-[#F5CD67] mt-1 font-mono">
                {kpis.inssCount}
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-[#010F25]/80 border border-[#C1801F]/25 rounded-2xl p-5 shadow-lg flex items-center justify-between">
            <div>
              <span className="text-xs text-[#E3DCBE]/60 font-medium">Observadoria & Afastamentos</span>
              <div className="text-2xl font-extrabold text-white mt-1 font-mono">
                {kpis.observadoriaCount + kpis.afastamentoCount}
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-[#C1801F]/15 text-[#E5A838] flex items-center justify-center border border-[#C1801F]/30">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-[#010F25]/80 border border-[#C1801F]/30 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-lg">
          <form method="GET" className="flex flex-wrap items-center gap-3 w-full sm:w-auto flex-1">
            <div className="relative flex-1 min-w-[240px]">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#E5A838]">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                name="q"
                defaultValue={searchQuery}
                placeholder="Buscar por cliente, advogado, telefone ou anotação..."
                className="w-full pl-10 pr-4 py-2 bg-[#000A1B]/80 border border-[#011733] focus:border-[#E5A838] rounded-xl text-[#E3DCBE] placeholder-[#E3DCBE]/40 focus:outline-none text-xs"
              />
            </div>

            <select
              name="tipo"
              defaultValue={processTypeFilter}
              className="bg-[#000A1B]/80 border border-[#011733] focus:border-[#E5A838] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
            >
              <option value="">Todos os Tipos</option>
              <option value="INSS">INSS</option>
              <option value="Observadoria">Observadoria</option>
              <option value="Afastamento">Afastamento</option>
            </select>

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#E5A838] to-[#C1801F] hover:opacity-95 text-[#000A1B] font-bold text-xs shadow-md"
            >
              Filtrar
            </button>

            {(searchQuery || processTypeFilter) && (
              <Link
                href="/dashboard/advogado"
                className="text-xs text-[#F5CD67] hover:underline"
              >
                Limpar filtros
              </Link>
            )}
          </form>
        </div>

        {/* Legal Cases List */}
        <div className="space-y-4">
          {cases.length > 0 ? (
            cases.map((item) => (
              <div
                key={item.id}
                className="bg-[#010F25]/80 border border-[#C1801F]/30 hover:border-[#E5A838]/50 rounded-2xl p-5 sm:p-6 transition-all shadow-lg space-y-4"
              >
                {/* Top Row: Cliente, Tipo e Valor */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#011733] pb-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#E5A838]/10 text-[#F5CD67] border border-[#C1801F]/30 flex items-center justify-center font-bold text-sm shrink-0">
                      {item.clientName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-bold text-white">{item.clientName}</h3>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider font-mono ${getProcessTypeBadge(
                            item.processType
                          )}`}
                        >
                          {item.processType}
                        </span>
                      </div>
                      <div className="text-xs text-[#E3DCBE]/70 flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1 font-mono">
                          <Phone className="w-3.5 h-3.5 text-[#F5CD67]" />
                          {formatPhone(item.clientPhone)}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-mono">
                          <Calendar className="w-3.5 h-3.5 text-[#E5A838]" />
                          Entrada: {formatDateBR(item.entryDate)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase text-[#E3DCBE]/50 font-bold block">
                      Valor Pago
                    </span>
                    <span className="text-base font-extrabold text-emerald-400 font-mono">
                      {formatCurrencyBRL(item.amountPaid)}
                    </span>
                  </div>
                </div>

                {/* Second Row: Advogado Responsável e Andamento */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[#E3DCBE]/60 block mb-1">Advogado Responsável:</span>
                    <div className="font-semibold text-[#E3DCBE] flex items-center gap-2 bg-[#000A1B]/60 p-2.5 rounded-xl border border-[#011733]">
                      <Scale className="w-4 h-4 text-[#E5A838]" />
                      <span>{item.lawyerName}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[#E3DCBE]/60 block mb-1">Andamento do Processo:</span>
                    <div className="flex items-center justify-between gap-2 bg-[#000A1B]/60 p-2 rounded-xl border border-[#011733]">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <Clock className="w-4 h-4 text-[#F5CD67] shrink-0" />
                        <span className="font-bold text-white truncate">{item.statusProgress}</span>
                      </div>
                      <LegalProgressModal
                        caseId={item.id}
                        clientName={item.clientName}
                        currentProgress={item.statusProgress}
                        currentNotes={item.notes}
                      />
                    </div>
                  </div>
                </div>

                {/* Third Row: Observações Livres */}
                {item.notes ? (
                  <div className="p-3.5 rounded-xl bg-[#000A1B]/70 border border-[#011733] text-xs space-y-1">
                    <span className="text-[10px] font-bold text-[#F5CD67] uppercase tracking-wider block">
                      Observações do Caso:
                    </span>
                    <p className="text-[#E3DCBE]/90 leading-relaxed whitespace-pre-line">
                      {item.notes}
                    </p>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-xl bg-[#000A1B]/40 border border-[#011733]/60 text-xs text-[#E3DCBE]/50 italic">
                    Nenhuma observação adicional registrada para este processo.
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="py-16 text-center bg-[#010F25]/80 border border-[#C1801F]/30 rounded-3xl space-y-3 shadow-xl">
              <Scale className="w-12 h-12 text-[#E5A838]/60 mx-auto opacity-80" />
              <h3 className="text-base font-semibold text-white">Nenhum Processo Encontrado</h3>
              <p className="text-xs text-[#E3DCBE]/70 max-w-md mx-auto">
                Não há atendimentos ou processos jurídicos cadastrados com os filtros aplicados. Clique no botão &quot;Novo Atendimento / Processo&quot; acima para registrar um caso.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
