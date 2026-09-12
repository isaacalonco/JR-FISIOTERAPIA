import React from "react";
import Link from "next/link";
import { getCurrentUserSession } from "@/lib/auth/rbac";
import { listAppointments } from "@/services/appointment.service";
import { listPatients } from "@/services/patient.service";
import { listProfessionals } from "@/services/professional.service";
import { listServices } from "@/services/catalog.service";
import { createClient } from "@/lib/supabase/server";
import { formatCurrencyBRL, formatDateTimeBR } from "@/utils/formatters";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  Clock,
  User,
  Stethoscope,
  BookOpen,
  Building,
  Phone,
} from "lucide-react";
import { JRLogo } from "@/components/ui/jr-logo";
import AppointmentFormModal from "./appointment-form-modal";
import StatusUpdateButtons from "./status-update-buttons";

import { redirect } from "next/navigation";

interface AgendaPageProps {
  searchParams: Promise<{ date?: string; prof?: string; status?: string }>;
}

export default async function AgendaPage({ searchParams }: AgendaPageProps) {
  const session = await getCurrentUserSession();
  if (!session) redirect("/login");

  const { date, prof, status } = await searchParams;
  const tenantId = session.profile.tenantId;

  // Carrega agendamentos
  const appointments = await listAppointments(tenantId, {
    date,
    professionalId: prof,
    status,
  });

  // Carrega relacionamentos para o modal de novo agendamento
  const [patientsData, profsData, servicesData] = await Promise.all([
    listPatients(tenantId, "", 100),
    listProfessionals(tenantId),
    listServices(tenantId),
  ]);

  const supabase = await createClient();
  const { data: roomsData } = await supabase
    .from("rooms")
    .select("id, name")
    .eq("tenant_id", tenantId);

  const patientOptions = patientsData.patients.map((p) => ({ id: p.id, name: p.fullName }));
  const profOptions = profsData.map((p) => ({
    id: p.id,
    name: p.fullName,
    specialtyName: p.specialtyName,
  }));
  const serviceOptions = servicesData.map((s) => ({
    id: s.id,
    name: s.name,
    durationMinutes: s.durationMinutes,
  }));
  const roomOptions = roomsData || [];

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
              <JRLogo size="md" subtitle={`Agenda Médica & Multidisciplinar (${appointments.length} consulta${appointments.length === 1 ? "" : "s"})`} />
            </div>

            <AppointmentFormModal
              patients={patientOptions}
              professionals={profOptions}
              services={serviceOptions}
              rooms={roomOptions}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        {/* Filters Bar */}
        <div className="bg-[#010F25]/80 border border-[#C1801F]/30 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-lg">
          <form method="GET" className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 bg-[#000A1B]/80 border border-[#011733] rounded-xl px-3 py-1.5 text-xs text-[#E3DCBE]">
              <CalendarIcon className="w-4 h-4 text-[#F5CD67]" />
              <input
                type="date"
                name="date"
                defaultValue={date || ""}
                className="bg-transparent text-white focus:outline-none"
              />
            </div>

            <select
              name="status"
              defaultValue={status || ""}
              className="bg-[#000A1B]/80 border border-[#011733] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
            >
              <option value="">Todos os Status</option>
              <option value="AGENDADO">Agendado</option>
              <option value="CONFIRMADO">Confirmado</option>
              <option value="EM_ATENDIMENTO">Em Atendimento</option>
              <option value="CONCLUIDO">Concluído</option>
              <option value="REMARCADO">Remarcado</option>
              <option value="CANCELADO">Cancelado</option>
              <option value="FALTOU">Falta</option>
            </select>

            <button
              type="submit"
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#E5A838] to-[#C1801F] hover:opacity-95 text-[#000A1B] font-bold text-xs shadow-md"
            >
              Filtrar
            </button>

            {(date || status || prof) && (
              <Link
                href="/dashboard/agenda"
                className="text-xs text-[#F5CD67] hover:underline"
              >
                Limpar filtros
              </Link>
            )}
          </form>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {appointments.length > 0 ? (
            appointments.map((apt) => (
              <div
                key={apt.id}
                className="bg-[#010F25]/80 border border-[#C1801F]/30 hover:border-[#E5A838]/50 rounded-2xl p-5 transition-all shadow-lg space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#011733] pb-3">
                  <div className="flex items-center gap-3">
                    <span
                      className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                      style={{ backgroundColor: apt.statusColor }}
                    />
                    <div className="font-mono text-sm font-bold text-white flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#F5CD67]" />
                      <span>{formatDateTimeBR(apt.startTime)}</span>
                    </div>
                    <span
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono border"
                      style={{
                        color: apt.statusColor,
                        borderColor: `${apt.statusColor}40`,
                        backgroundColor: `${apt.statusColor}15`,
                      }}
                    >
                      {apt.status}
                    </span>
                  </div>

                  <div className="text-xs font-mono text-[#F5CD67] font-semibold">
                    {formatCurrencyBRL(apt.servicePrice || 0)}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-[#E3DCBE]/60 block mb-0.5">Paciente:</span>
                    <div className="font-semibold text-white flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#E5A838]" />
                      <span>{apt.patientName}</span>
                    </div>
                    {apt.patientPhone && (
                      <div className="text-[11px] text-[#E3DCBE]/70 font-mono mt-0.5 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-[#F5CD67]" /> {apt.patientPhone}
                      </div>
                    )}
                  </div>

                  <div>
                    <span className="text-[#E3DCBE]/60 block mb-0.5">Profissional:</span>
                    <div className="font-semibold text-[#E3DCBE] flex items-center gap-1.5">
                      <Stethoscope className="w-3.5 h-3.5 text-[#F5CD67]" />
                      <span>{apt.professionalName}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[#E3DCBE]/60 block mb-0.5">Procedimento:</span>
                    <div className="font-semibold text-[#E3DCBE] flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-[#E5A838]" />
                      <span>{apt.serviceName}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[#E3DCBE]/60 block mb-0.5">Sala / Local:</span>
                    <div className="font-semibold text-[#E3DCBE] flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-[#F5CD67]" />
                      <span>{apt.roomName}</span>
                    </div>
                  </div>
                </div>

                {apt.notes && (
                  <div className="p-2.5 rounded-xl bg-[#000A1B]/60 border border-[#011733] text-[#E3DCBE]/80 text-xs italic">
                    &quot;{apt.notes}&quot;
                  </div>
                )}

                {apt.cancellationReason && (
                  <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-300 text-xs border border-rose-500/20">
                    <strong>Motivo do Cancelamento:</strong> {apt.cancellationReason}
                  </div>
                )}

                {/* Status Quick Action Buttons */}
                <StatusUpdateButtons appointmentId={apt.id} currentStatus={apt.status} />
              </div>
            ))
          ) : (
            <div className="py-16 text-center bg-[#010F25]/80 border border-[#C1801F]/30 rounded-3xl space-y-3 shadow-xl">
              <CalendarIcon className="w-10 h-10 text-[#E5A838] mx-auto opacity-80" />
              <h3 className="text-base font-semibold text-white">Nenhuma Consulta Encontrada</h3>
              <p className="text-xs text-[#E3DCBE]/70 max-w-sm mx-auto">
                Não há atendimentos agendados para os filtros aplicados. Clique no botão &quot;Novo Agendamento&quot; acima para registrar uma consulta.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
