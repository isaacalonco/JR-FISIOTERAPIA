import React from "react";
import Link from "next/link";
import { getCurrentUserSession } from "@/lib/auth/rbac";
import { redirect } from "next/navigation";
import { listAuditLogs } from "@/services/audit.service";
import {
  ChevronLeft,
  ShieldAlert,
  Search,
  Filter,
  User,
  Clock,
  Code,
  CheckCircle,
} from "lucide-react";
import LogDetailsModal from "./log-details-modal";

interface AuditPageProps {
  searchParams: Promise<{
    action?: string;
    entityType?: string;
    startDate?: string;
    endDate?: string;
  }>;
}

export default async function AuditDashboardPage({ searchParams }: AuditPageProps) {
  const session = await getCurrentUserSession();
  if (!session) {
    redirect("/login");
  }

  const resolvedParams = await searchParams;
  const tenantId = session.profile.tenantId;

  const logs = await listAuditLogs(tenantId, {
    action: resolvedParams.action,
    entityType: resolvedParams.entityType,
    startDate: resolvedParams.startDate,
    endDate: resolvedParams.endDate,
    limit: 100,
  });

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
              <ShieldAlert className="w-5 h-5 text-[#F5CD67]" />
              <h1 className="text-lg font-black text-white tracking-wide">
                Auditoria Avançada & Rastreabilidade LGPD
              </h1>
            </div>
            <p className="text-xs text-[#E3DCBE]/70">
              Trilha imutável de eventos de sistema, ações de usuários e acesso a dados sensíveis.
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 space-y-6">
        {/* Filter Bar */}
        <form method="GET" className="p-4 rounded-2xl bg-[#010F25] border border-[#011733] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-[#E3DCBE]/70 mb-1">
              Filtrar por Ação
            </label>
            <input
              type="text"
              name="action"
              defaultValue={resolvedParams.action || ""}
              placeholder="Ex: CREATE_LEGAL_CASE, UPDATE"
              className="w-full p-2.5 bg-[#000A1B] border border-[#011733] focus:border-[#E5A838] rounded-xl text-xs text-[#E3DCBE] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#E3DCBE]/70 mb-1">
              Entidade
            </label>
            <select
              name="entityType"
              defaultValue={resolvedParams.entityType || ""}
              className="w-full p-2.5 bg-[#000A1B] border border-[#011733] focus:border-[#E5A838] rounded-xl text-xs text-[#E3DCBE] focus:outline-none"
            >
              <option value="">Todas as Entidades</option>
              <option value="legal_case">Caso Jurídico</option>
              <option value="legal_contract">Contrato Jurídico</option>
              <option value="patient">Paciente</option>
              <option value="prontuario">Prontuário / SOAP</option>
              <option value="appointment">Agendamento</option>
              <option value="whatsapp">WhatsApp</option>
            </select>
          </div>

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

          <div className="flex items-end gap-2">
            <div className="flex-1">
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
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-gradient-to-r from-[#E5A838] via-[#F5CD67] to-[#C1801F] hover:opacity-95 text-[#000A1B] font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Search className="w-4 h-4" />
              <span>Filtrar</span>
            </button>
          </div>
        </form>

        {/* Audit Logs Table */}
        <div className="bg-[#010F25] border border-[#011733] rounded-2xl overflow-hidden shadow-md">
          {logs.length === 0 ? (
            <div className="p-12 text-center text-[#E3DCBE]/60 space-y-2">
              <ShieldAlert className="w-8 h-8 mx-auto text-[#E3DCBE]/30" />
              <p className="text-sm font-semibold">Nenhum evento auditável encontrado.</p>
              <p className="text-xs">Ajuste os filtros de pesquisa acima para visualizar registros.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#000A1B]/60 border-b border-[#011733] text-[#E3DCBE]/70 uppercase font-semibold">
                  <tr>
                    <th className="p-4">Data / Hora</th>
                    <th className="p-4">Usuário</th>
                    <th className="p-4">Ação</th>
                    <th className="p-4">Entidade</th>
                    <th className="p-4">ID da Entidade</th>
                    <th className="p-4">Endereço IP</th>
                    <th className="p-4 text-right">Detalhes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#011733]/60 text-[#E3DCBE]">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#011733]/40 transition-colors">
                      <td className="p-4 font-mono text-[11px] text-[#E3DCBE]/80">
                        {new Date(log.createdAt).toLocaleString("pt-BR")}
                      </td>
                      <td className="p-4 font-medium text-white">
                        {log.userEmail || "Sistema"}
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-[#E5A838]/10 text-[#F5CD67] border border-[#C1801F]/30">
                          {log.action}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-[11px] text-cyan-400">
                        {log.entityType}
                      </td>
                      <td className="p-4 font-mono text-[11px] text-[#E3DCBE]/60">
                        {log.entityId ? log.entityId.substring(0, 13) + "..." : "-"}
                      </td>
                      <td className="p-4 font-mono text-[11px] text-[#E3DCBE]/60">
                        {log.ipAddress || "127.0.0.1"}
                      </td>
                      <td className="p-4 text-right">
                        <LogDetailsModal log={log} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
