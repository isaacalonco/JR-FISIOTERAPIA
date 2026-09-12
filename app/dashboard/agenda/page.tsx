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
  CheckCircle2,
  AlertCircle,
  Phone,
} from "lucide-react";
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
                  <CalendarIcon className="w-5 h-5 text-cyan-400" />
                  Agenda Médica & Multidisciplinar
                </h1>
                <span className="text-xs text-slate-400">
                  {appointments.length} consulta{appointments.length === 1 ? "" : "s"} listada{appointments.length === 1 ? "" : "s"}
                </span>
              </div>
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
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
          <form method="GET" className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300">
              <CalendarIcon className="w-4 h-4 text-cyan-400" />
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
              className="bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
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
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
            >
              Filtrar
            </button>

            {(date || status || prof) && (
              <Link
                href="/dashboard/agenda"
                className="text-xs text-slate-400 hover:text-cyan-400 underline"
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
                className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-all shadow-md space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/60 pb-3">
                  <div className="flex items-center gap-3">
                    <span
                      className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                      style={{ backgroundColor: apt.statusColor }}
                    />
                    <div className="font-mono text-sm font-bold text-white flex items-center gap-2">
                      <Clock className="w-4 h-4 text-cyan-400" />
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

                  <div className="text-xs font-mono text-amber-400 font-semibold">
                    {formatCurrencyBRL(apt.servicePrice || 0)}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 block mb-0.5">Paciente:</span>
                    <div className="font-semibold text-white flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{apt.patientName}</span>
                    </div>
                    {apt.patientPhone && (
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {apt.patientPhone}
                      </div>
                    )}
                  </div>

                  <div>
                    <span className="text-slate-500 block mb-0.5">Profissional:</span>
                    <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                      <Stethoscope className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{apt.professionalName}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-500 block mb-0.5">Procedimento:</span>
                    <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                      <span>{apt.serviceName}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-500 block mb-0.5">Sala / Local:</span>
                    <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{apt.roomName}</span>
                    </div>
                  </div>
                </div>

                {apt.notes && (
                  <div className="p-2.5 rounded-xl bg-slate-950/40 text-slate-400 text-xs italic">
                    &quot;{apt.notes}&quot;
                  </div>
                )}

                {apt.cancellationReason && (
                  <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-300 text-xs">
                    <strong>Motivo do Cancelamento:</strong> {apt.cancellationReason}
                  </div>
                )}

                {/* Status Quick Action Buttons */}
                <StatusUpdateButtons appointmentId={apt.id} currentStatus={apt.status} />
              </div>
            ))
          ) : (
            <div className="py-16 text-center bg-slate-900/40 border border-slate-800 rounded-3xl space-y-3">
              <CalendarIcon className="w-10 h-10 text-cyan-400 mx-auto opacity-80" />
              <h3 className="text-base font-semibold text-white">Nenhuma Consulta Encontrada</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Não há atendimentos agendados para os filtros aplicados. Clique no botão &quot;Novo Agendamento&quot; acima para registrar uma consulta.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
