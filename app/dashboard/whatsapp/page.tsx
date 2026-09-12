import React from "react";
import Link from "next/link";
import { getCurrentUserSession } from "@/lib/auth/rbac";
import { redirect } from "next/navigation";
import { listWhatsAppMessages } from "@/services/whatsapp.service";
import { listAppointments } from "@/services/appointment.service";
import {
  MessageSquare,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  Phone,
  Calendar,
  Sparkles,
  RefreshCw,
  UserCheck,
  ChevronLeft,
} from "lucide-react";
import { JRLogo } from "@/components/ui/jr-logo";
import SendReminderFormModal from "./send-reminder-modal";

export default async function WhatsAppDashboardPage() {
  const session = await getCurrentUserSession();
  if (!session) redirect("/login");

  const tenantId = session.profile.tenantId;

  const [messages, appointments] = await Promise.all([
    listWhatsAppMessages(tenantId),
    listAppointments(tenantId, {}),
  ]);

  // Filtra agendamentos elegíveis para lembrete
  const eligibleAppointments = appointments.map((a) => ({
    id: a.id,
    patientName: a.patientName || "Paciente",
    patientPhone: a.patientPhone || "(61) 99999-9999",
    serviceName: a.serviceName || "Consulta",
    startTime: a.startTime,
    status: a.status,
  }));

  const totalSent = messages.length;
  const totalDelivered = messages.filter((m) => m.status === "SENT" || m.status === "DELIVERED" || m.status === "READ").length;
  const totalConfirmed = messages.filter((m) => m.status === "READ").length;

  return (
    <main className="min-h-screen bg-[#000A1B] text-[#E3DCBE] pb-16">
      {/* Header Bar */}
      <header className="border-b border-[#011733] bg-[#010F25]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="p-2 rounded-xl bg-[#011733] hover:bg-[#011733]/80 text-[#E3DCBE] transition-colors flex items-center justify-center"
                title="Voltar ao Dashboard"
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <JRLogo size="md" subtitle="WhatsApp Business API & Lembretes Automáticos" />
            </div>

            <SendReminderFormModal appointments={eligibleAppointments} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6 animate-in fade-in">
        {/* Banner Status API */}
        <div className="p-4 rounded-2xl bg-[#010F25] border border-[#C1801F]/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              API Conectada & Ativa
            </span>
            <span className="text-xs text-[#E3DCBE]/70">Cloud API Official (JR FISIOTERAPIA)</span>
          </div>
        </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#010F25] border border-[#C1801F]/30 shadow-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-[#E3DCBE]/60 font-medium">Lembretes Disparados</p>
            <h3 className="text-2xl font-black text-white mt-1 font-mono">{totalSent}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#E5A838]/10 text-[#F5CD67] border border-[#C1801F]/30 flex items-center justify-center">
            <Send className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#010F25] border border-[#C1801F]/30 shadow-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-[#E3DCBE]/60 font-medium">Entregues no Celular</p>
            <h3 className="text-2xl font-black text-emerald-400 mt-1 font-mono">{totalDelivered}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#010F25] border border-[#C1801F]/30 shadow-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-[#E3DCBE]/60 font-medium">Consultas Confirmadas</p>
            <h3 className="text-2xl font-black text-[#F5CD67] mt-1 font-mono">{totalConfirmed}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#E5A838]/10 text-[#F5CD67] border border-[#C1801F]/30 flex items-center justify-center">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-[#010F25] border border-[#C1801F]/30 rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#011733] pb-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#E5A838]" />
            Histórico de Disparos e Respostas
          </h2>
          <span className="text-xs text-[#E3DCBE]/60">Total: {messages.length} envios</span>
        </div>

        {messages.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#E3DCBE]/60 space-y-3">
            <MessageSquare className="w-10 h-10 mx-auto text-[#E3DCBE]/30" />
            <p>Nenhuma mensagem enviada ainda. Clique no botão acima para disparar um lembrete de teste!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#011733] text-[#E3DCBE]/60 font-semibold uppercase text-[10px] tracking-wider">
                  <th className="pb-3 px-3">Paciente / Celular</th>
                  <th className="pb-3 px-3">Tipo de Mensagem</th>
                  <th className="pb-3 px-3">Conteúdo Enviado</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">Data de Envio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#011733]">
                {messages.map((m) => (
                  <tr key={m.id} className="hover:bg-[#000A1B]/50 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-white">{m.patientName}</div>
                      <div className="text-[11px] text-[#E3DCBE]/60 font-mono flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-[#E5A838]" />
                        {m.phoneNumber}
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#000A1B] text-[#E3DCBE] border border-[#011733]">
                        {m.messageType === "REMINDER_1DAY" ? "Lembrete (1 Dia Antes)" : m.messageType}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 max-w-xs">
                      <p className="line-clamp-2 text-[11px] text-[#E3DCBE]/80 bg-[#000A1B]/60 p-2 rounded-xl border border-[#011733]">
                        {m.content}
                      </p>
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${
                          m.status === "READ"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : m.status === "SENT" || m.status === "DELIVERED"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                            : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                        }`}
                      >
                        {m.status === "READ" ? "Confirmado" : m.status === "SENT" ? "Enviado" : m.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-[11px] text-[#E3DCBE]/70">
                      {new Date(m.createdAt).toLocaleDateString("pt-BR")} às{" "}
                      {new Date(m.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
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
