"use client";

import React, { useTransition } from "react";
import { updateAppointmentStatusAction } from "@/app/actions/appointment.actions";
import { Check, Play, CheckCircle, XCircle } from "lucide-react";

interface StatusUpdateButtonsProps {
  appointmentId: string;
  currentStatus: string;
}

export default function StatusUpdateButtons({
  appointmentId,
  currentStatus,
}: StatusUpdateButtonsProps) {
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (newStatus: string) => {
    let cancellationReason: string | undefined = undefined;
    if (newStatus === "CANCELADO") {
      const reason = prompt("Informe o motivo do cancelamento:");
      if (!reason || !reason.trim()) return;
      cancellationReason = reason.trim();
    }

    startTransition(async () => {
      await updateAppointmentStatusAction(appointmentId, newStatus, cancellationReason);
    });
  };

  if (currentStatus === "CONCLUIDO" || currentStatus === "CANCELADO") {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#011733] text-[11px]">
      {currentStatus === "AGENDADO" && (
        <button
          onClick={() => handleStatusChange("CONFIRMADO")}
          disabled={isPending}
          className="px-2.5 py-1 rounded-lg bg-[#E5A838]/10 hover:bg-[#E5A838]/20 text-[#F5CD67] border border-[#C1801F]/30 flex items-center gap-1 transition-colors"
        >
          <Check className="w-3 h-3" /> Confirmar
        </button>
      )}

      {(currentStatus === "AGENDADO" || currentStatus === "CONFIRMADO") && (
        <button
          onClick={() => handleStatusChange("EM_ATENDIMENTO")}
          disabled={isPending}
          className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#E5A838] to-[#C1801F] text-[#000A1B] font-bold flex items-center gap-1 transition-all shadow-sm"
        >
          <Play className="w-3 h-3" /> Iniciar Atendimento
        </button>
      )}

      {currentStatus === "EM_ATENDIMENTO" && (
        <button
          onClick={() => handleStatusChange("CONCLUIDO")}
          disabled={isPending}
          className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 flex items-center gap-1 transition-colors"
        >
          <CheckCircle className="w-3 h-3" /> Finalizar
        </button>
      )}

      <button
        onClick={() => handleStatusChange("FALTOU")}
        disabled={isPending}
        className="px-2 py-1 rounded-lg bg-[#011733] hover:bg-[#011733]/80 text-[#E3DCBE]/80 hover:text-white transition-colors"
      >
        Falta
      </button>

      <button
        onClick={() => handleStatusChange("CANCELADO")}
        disabled={isPending}
        className="px-2 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 flex items-center gap-1 transition-colors"
      >
        <XCircle className="w-3 h-3" /> Cancelar
      </button>
    </div>
  );
}
