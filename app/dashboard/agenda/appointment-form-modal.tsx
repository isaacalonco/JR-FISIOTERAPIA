"use client";

import React, { useState, useActionState, useEffect } from "react";
import { createAppointmentAction } from "@/app/actions/appointment.actions";
import { Plus, X, Calendar, CheckCircle2, AlertCircle } from "lucide-react";

interface PatientOption {
  id: string;
  name: string;
}

interface ProfessionalOption {
  id: string;
  name: string;
  specialtyName: string;
}

interface ServiceOption {
  id: string;
  name: string;
  durationMinutes: number;
}

interface RoomOption {
  id: string;
  name: string;
}

interface AppointmentFormModalProps {
  patients: PatientOption[];
  professionals: ProfessionalOption[];
  services: ServiceOption[];
  rooms: RoomOption[];
}

export default function AppointmentFormModal({
  patients,
  professionals,
  services,
  rooms,
}: AppointmentFormModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(createAppointmentAction, null);

  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [startDateTime, setStartDateTime] = useState<string>("");
  const [computedEndTime, setComputedEndTime] = useState<string>("");

  useEffect(() => {
    if (!startDateTime || !selectedServiceId) return;

    const selectedService = services.find((s) => s.id === selectedServiceId);
    const duration = selectedService ? selectedService.durationMinutes : 45;

    const start = new Date(startDateTime);
    if (isNaN(start.getTime())) return;

    const end = new Date(start.getTime() + duration * 60 * 1000);
    setComputedEndTime(end.toISOString().slice(0, 16));
  }, [startDateTime, selectedServiceId, services]);

  useEffect(() => {
    if (state?.success) {
      const timer = setTimeout(() => {
        setIsOpen(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [state]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#E5A838] via-[#F5CD67] to-[#C1801F] hover:opacity-95 text-[#000A1B] font-extrabold text-xs shadow-lg shadow-[#E5A838]/20 transition-all flex items-center gap-2"
      >
        <Plus className="w-4 h-4 text-[#000A1B]" />
        <span>Novo Agendamento</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#000A1B]/85 backdrop-blur-md animate-in fade-in">
          <div className="fixed inset-0" onClick={() => setIsOpen(false)} />
          <div className="relative z-10 w-full max-w-xl max-h-[85vh] flex flex-col bg-[#010F25] border border-[#C1801F]/35 rounded-3xl shadow-2xl overflow-hidden text-[#E3DCBE]">
            {/* Header */}
            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-[#011733] bg-[#010F25] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E5A838]/10 text-[#F5CD67] border border-[#C1801F]/30 flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Agendar Nova Consulta</h2>
                  <p className="text-xs text-[#E3DCBE]/70">
                    Prevenção ativa contra choque de horários e salas.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 text-[#E3DCBE]/60 hover:text-white rounded-lg hover:bg-[#011733] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="p-5 sm:p-6 overflow-y-auto flex-1">
              {/* Alert Messages */}
              {state?.success && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{state.message}</span>
                </div>
              )}

              {state?.error && (
                <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{state.error}</span>
                </div>
              )}

              {/* Form */}
              <form action={formAction} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="block font-semibold text-[#E3DCBE]/80">Paciente *</label>
                  <select
                    name="patientId"
                    required
                    className="w-full p-2.5 bg-[#000A1B]/80 border border-[#011733] focus:border-[#E5A838] rounded-xl text-[#E3DCBE] focus:outline-none"
                  >
                    <option value="">-- Selecione o Paciente --</option>
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-semibold text-[#E3DCBE]/80">Profissional da Saúde *</label>
                    <select
                      name="professionalId"
                      required
                      className="w-full p-2.5 bg-[#000A1B]/80 border border-[#011733] focus:border-[#E5A838] rounded-xl text-[#E3DCBE] focus:outline-none"
                    >
                      <option value="">-- Selecione o Profissional --</option>
                      {professionals.map((pr) => (
                        <option key={pr.id} value={pr.id}>
                          {pr.name} ({pr.specialtyName})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block font-semibold text-[#E3DCBE]/80">Procedimento / Serviço *</label>
                    <select
                      name="serviceId"
                      required
                      value={selectedServiceId}
                      onChange={(e) => setSelectedServiceId(e.target.value)}
                      className="w-full p-2.5 bg-[#000A1B]/80 border border-[#011733] focus:border-[#E5A838] rounded-xl text-[#E3DCBE] focus:outline-none"
                    >
                      <option value="">-- Selecione o Serviço --</option>
                      {services.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.durationMinutes} min)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-semibold text-[#E3DCBE]/80">Data e Hora de Início *</label>
                    <input
                      type="datetime-local"
                      name="startTime"
                      required
                      value={startDateTime}
                      onChange={(e) => setStartDateTime(e.target.value)}
                      className="w-full p-2.5 bg-[#000A1B]/80 border border-[#011733] focus:border-[#E5A838] rounded-xl text-[#E3DCBE] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-semibold text-[#E3DCBE]/80">Término Estimado *</label>
                    <input
                      type="datetime-local"
                      name="endTime"
                      required
                      value={computedEndTime}
                      onChange={(e) => setComputedEndTime(e.target.value)}
                      className="w-full p-2.5 bg-[#000A1B]/80 border border-[#011733] focus:border-[#E5A838] rounded-xl text-[#E3DCBE] focus:outline-none"
                    />
                  </div>
                </div>

                {rooms.length > 0 && (
                  <div className="space-y-1">
                    <label className="block font-semibold text-[#E3DCBE]/80">Sala / Consultório</label>
                    <select
                      name="roomId"
                      className="w-full p-2.5 bg-[#000A1B]/80 border border-[#011733] focus:border-[#E5A838] rounded-xl text-[#E3DCBE] focus:outline-none"
                    >
                      <option value="">-- Nenhuma sala atribuída --</option>
                      {rooms.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="block font-semibold text-[#E3DCBE]/80">Observações Clínicas / Triagem</label>
                  <textarea
                    name="notes"
                    rows={2}
                    placeholder="Queixa inicial ou preferências do paciente..."
                    className="w-full p-2.5 bg-[#000A1B]/80 border border-[#011733] focus:border-[#E5A838] rounded-xl text-[#E3DCBE] placeholder-[#E3DCBE]/40 focus:outline-none"
                  />
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-[#011733] flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-[#011733] hover:bg-[#011733]/80 text-[#E3DCBE] font-semibold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E5A838] via-[#F5CD67] to-[#C1801F] hover:opacity-95 text-[#000A1B] font-extrabold shadow-md"
                  >
                    {isPending ? "Validando Horários..." : "Confirmar Agendamento"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
