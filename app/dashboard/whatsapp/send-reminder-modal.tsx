"use client";

import React, { useState, useActionState } from "react";
import { Send, X, CheckCircle2, AlertCircle, Phone, Calendar } from "lucide-react";
import { sendWhatsAppReminderAction } from "@/app/actions/whatsapp.actions";

interface SendReminderModalProps {
  appointments: Array<{
    id: string;
    patientName: string;
    patientPhone: string;
    serviceName: string;
    startTime: string;
    status: string;
  }>;
}

export default function SendReminderFormModal({ appointments }: SendReminderModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedApptId, setSelectedApptId] = useState("");
  const [state, formAction, isPending] = useActionState(sendWhatsAppReminderAction, null);

  const selectedAppt = appointments.find((a) => a.id === selectedApptId);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#E5A838] via-[#F5CD67] to-[#C1801F] hover:opacity-95 text-[#000A1B] font-extrabold text-xs shadow-lg shadow-[#E5A838]/20 transition-all flex items-center gap-2"
      >
        <Send className="w-4 h-4 text-[#000A1B]" />
        <span>Disparar Lembrete (WhatsApp)</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#000A1B]/85 backdrop-blur-md animate-in fade-in">
          <div className="fixed inset-0" onClick={() => setIsOpen(false)} />
          <div className="relative z-10 w-full max-w-lg max-h-[85vh] flex flex-col bg-[#010F25] border border-[#C1801F]/35 rounded-3xl shadow-2xl overflow-hidden text-[#E3DCBE]">
            <div className="p-5 sm:p-6 border-b border-[#011733] flex items-center justify-between shrink-0 bg-[#010F25]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E5A838]/10 text-[#F5CD67] border border-[#C1801F]/30 flex items-center justify-center">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Disparar Lembrete 1 Dia Antes</h2>
                  <p className="text-xs text-[#E3DCBE]/70">Envio de mensagem com botões de confirmação ativa.</p>
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

            <div className="p-5 sm:p-6 overflow-y-auto flex-1 text-xs space-y-4">
              {state?.success && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{state.message}</span>
                  </div>
                  {state.content && (
                    <div className="p-3 bg-[#000A1B] border border-[#011733] rounded-xl font-mono text-[11px] text-[#E3DCBE]/90 whitespace-pre-line">
                      {state.content}
                    </div>
                  )}
                </div>
              )}

              {state?.error && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{state.error}</span>
                </div>
              )}

              <form action={formAction} className="space-y-4">
                <div className="space-y-1">
                  <label className="block font-semibold text-[#E3DCBE]/80">Selecione o Agendamento *</label>
                  <select
                    name="appointmentId"
                    required
                    value={selectedApptId}
                    onChange={(e) => setSelectedApptId(e.target.value)}
                    className="w-full p-2.5 bg-[#000A1B]/80 border border-[#011733] focus:border-[#E5A838] rounded-xl text-[#E3DCBE] focus:outline-none"
                  >
                    <option value="">-- Escolha uma consulta --</option>
                    {appointments.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.patientName} - {a.serviceName} ({new Date(a.startTime).toLocaleString("pt-BR")})
                      </option>
                    ))}
                  </select>
                </div>

                {selectedAppt && (
                  <div className="space-y-1">
                    <label className="block font-semibold text-[#E3DCBE]/80">Número de Celular *</label>
                    <input
                      type="text"
                      name="phoneNumber"
                      required
                      defaultValue={selectedAppt.patientPhone}
                      className="w-full p-2.5 bg-[#000A1B]/80 border border-[#011733] focus:border-[#E5A838] rounded-xl text-[#E3DCBE] focus:outline-none font-mono"
                    />
                  </div>
                )}

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
                    {isPending ? "Enviando Lembrete..." : "Enviar no WhatsApp"}
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
