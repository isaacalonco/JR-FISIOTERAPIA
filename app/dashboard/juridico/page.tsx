import React from "react";
import Link from "next/link";
import { getCurrentUserSession } from "@/lib/auth/rbac";
import { JRLogo } from "@/components/ui/jr-logo";
import { redirect } from "next/navigation";
import { listLegalCases, listLegalContracts } from "@/services/legal.service";
import { listPatients } from "@/services/patient.service";
import NewCaseModal from "./case-modal";
import NewContractModal from "./contract-modal";
import {
  ChevronLeft,
  Scale,
  FileText,
  ShieldCheck,
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
} from "lucide-react";

export default async function LegalDashboardPage() {
  const session = await getCurrentUserSession();
  if (!session) {
    redirect("/login");
  }

  const tenantId = session.profile.tenantId;

  const [cases, contracts, { patients }] = await Promise.all([
    listLegalCases(tenantId),
    listLegalContracts(tenantId),
    listPatients(tenantId, "", 100),
  ]);

  const mappedPatients = patients.map((p) => ({
    id: p.id,
    fullName: p.fullName,
  }));

  // KPI Calculations
  const totalCases = cases.length;
  const activeCases = cases.filter((c) => c.status === "em_andamento").length;
  const activeContracts = contracts.filter((c) => c.status === "vigente").length;
  const lgpdContracts = contracts.filter((c) => c.contractType === "termo_lgpd").length;

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
              <Scale className="w-5 h-5 text-[#F5CD67]" />
              <h1 className="text-lg font-black text-white tracking-wide">
                Módulo Jurídico & Conformidade LGPD
              </h1>
            </div>
            <p className="text-xs text-[#E3DCBE]/70">
              Gestão de contenciosos, pareceres técnicos e instrumentos contratuais.
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#010F25] border border-[#011733] flex items-center justify-between">
            <div>
              <p className="text-xs text-[#E3DCBE]/60 font-medium">Total de Casos</p>
              <p className="text-2xl font-black text-white mt-1">{totalCases}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#E5A838]/10 text-[#F5CD67] flex items-center justify-center border border-[#C1801F]/20">
              <Scale className="w-5 h-5" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#010F25] border border-[#011733] flex items-center justify-between">
            <div>
              <p className="text-xs text-[#E3DCBE]/60 font-medium">Casos Em Andamento</p>
              <p className="text-2xl font-black text-[#F5CD67] mt-1">{activeCases}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#010F25] border border-[#011733] flex items-center justify-between">
            <div>
              <p className="text-xs text-[#E3DCBE]/60 font-medium">Contratos Vigentes</p>
              <p className="text-2xl font-black text-emerald-400 mt-1">{activeContracts}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#010F25] border border-[#011733] flex items-center justify-between">
            <div>
              <p className="text-xs text-[#E3DCBE]/60 font-medium">Termos LGPD</p>
              <p className="text-2xl font-black text-cyan-400 mt-1">{lgpdContracts}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#010F25] border border-[#011733]">
          <div>
            <h2 className="text-sm font-bold text-white">Ações Rápidas Jurídicas</h2>
            <p className="text-xs text-[#E3DCBE]/70">Registre processos ou novos modelos contratuais.</p>
          </div>
          <div className="flex items-center gap-3">
            <NewCaseModal patients={mappedPatients} />
            <NewContractModal patients={mappedPatients} />
          </div>
        </div>

        {/* Section 1: Processos e Casos Jurídicos */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-[#F5CD67]" />
              <span>Processos & Notificações ({cases.length})</span>
            </h2>
          </div>

          <div className="bg-[#010F25] border border-[#011733] rounded-2xl overflow-hidden shadow-md">
            {cases.length === 0 ? (
              <div className="p-12 text-center text-[#E3DCBE]/60 space-y-2">
                <Scale className="w-8 h-8 mx-auto text-[#E3DCBE]/30" />
                <p className="text-sm font-semibold">Nenhum caso jurídico registrado.</p>
                <p className="text-xs">Utilize o botão "Novo Caso / Processo" para cadastrar.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#000A1B]/60 border-b border-[#011733] text-[#E3DCBE]/70 uppercase font-semibold">
                    <tr>
                      <th className="p-4">Nº Processo</th>
                      <th className="p-4">Título / Assunto</th>
                      <th className="p-4">Tipo</th>
                      <th className="p-4">Paciente</th>
                      <th className="p-4">Advogado</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Prazo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#011733]/60 text-[#E3DCBE]">
                    {cases.map((c) => (
                      <tr key={c.id} className="hover:bg-[#011733]/40 transition-colors">
                        <td className="p-4 font-mono font-bold text-white">{c.caseNumber}</td>
                        <td className="p-4 font-semibold text-white">{c.title}</td>
                        <td className="p-4 uppercase text-[11px] font-bold text-[#F5CD67]">
                          {c.caseType}
                        </td>
                        <td className="p-4">
                          {c.patientName ? (
                            <span className="flex items-center gap-1 text-xs">
                              <User className="w-3.5 h-3.5 text-[#E5A838]" />
                              {c.patientName}
                            </span>
                          ) : (
                            <span className="text-[#E3DCBE]/40 italic">Sem vínculo</span>
                          )}
                        </td>
                        <td className="p-4">{c.lawyerName || "-"}</td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                              c.status === "em_andamento"
                                ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                                : c.status === "concluido"
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                : "bg-slate-500/10 text-slate-400 border-slate-500/30"
                            }`}
                          >
                            {c.status.replace("_", " ")}
                          </span>
                        </td>
                        <td className="p-4 text-[#E3DCBE]/70">
                          {c.dueDate
                            ? new Date(c.dueDate).toLocaleDateString("pt-BR")
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Contratos & Termos LGPD */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#F5CD67]" />
              <span>Contratos & Termos LGPD ({contracts.length})</span>
            </h2>
          </div>

          <div className="bg-[#010F25] border border-[#011733] rounded-2xl overflow-hidden shadow-md">
            {contracts.length === 0 ? (
              <div className="p-12 text-center text-[#E3DCBE]/60 space-y-2">
                <FileText className="w-8 h-8 mx-auto text-[#E3DCBE]/30" />
                <p className="text-sm font-semibold">Nenhum contrato ou termo registrado.</p>
                <p className="text-xs">Clique em "Novo Contrato / Termo" para criar um instrumento contratual.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#000A1B]/60 border-b border-[#011733] text-[#E3DCBE]/70 uppercase font-semibold">
                    <tr>
                      <th className="p-4">Título</th>
                      <th className="p-4">Tipo</th>
                      <th className="p-4">Paciente Vinculado</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Data Assinatura</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#011733]/60 text-[#E3DCBE]">
                    {contracts.map((ct) => (
                      <tr key={ct.id} className="hover:bg-[#011733]/40 transition-colors">
                        <td className="p-4 font-semibold text-white">{ct.title}</td>
                        <td className="p-4 font-mono text-[11px] text-[#F5CD67] uppercase">
                          {ct.contractType}
                        </td>
                        <td className="p-4">
                          {ct.patientName ? (
                            <span className="flex items-center gap-1 text-xs">
                              <User className="w-3.5 h-3.5 text-[#E5A838]" />
                              {ct.patientName}
                            </span>
                          ) : (
                            <span className="text-[#E3DCBE]/40 italic">Geral / Sem vínculo</span>
                          )}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                              ct.status === "vigente"
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                : ct.status === "rascunho"
                                ? "bg-slate-500/10 text-slate-400 border-slate-500/30"
                                : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                            }`}
                          >
                            {ct.status}
                          </span>
                        </td>
                        <td className="p-4 text-[#E3DCBE]/70">
                          {ct.signedAt
                            ? new Date(ct.signedAt).toLocaleDateString("pt-BR")
                            : "Pendente"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
