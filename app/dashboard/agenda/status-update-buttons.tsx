"use client";

import React, { useTransition } from "react";
import { updateAppointmentStatusAction } from "@/app/actions/appointment.actions";
import { Check, Play, CheckCircle, XCircle, AlertCircle } from "lucide-react";

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
    <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800/60 text-[11px]">
      {currentStatus === "AGENDADO" && (
        <button
          onClick={() => handleStatusChange("CONFIRMADO")}
          disabled={isPending}
          className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 flex items-center gap-1 transition-colors"
        >
          <Check className="w-3 h-3" /> Confirmar
        </button>
      )}

      {(currentStatus === "AGENDADO" || currentStatus === "CONFIRMADO") && (
        <button
          onClick={() => handleStatusChange("EM_ATENDIMENTO")}
          disabled={isPending}
          className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 flex items-center gap-1 transition-colors"
        >
          <Play className="w-3 h-3" /> Iniciar Atendimento
        </button>
      )}

      {currentStatus === "EM_ATENDIMENTO" && (
        <button
          onClick={() => handleStatusChange("CONCLUIDO")}
          disabled={isPending}
          className="px-2.5 py-1 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 flex items-center gap-1 transition-colors"
        >
          <CheckCircle className="w-3 h-3" /> Finalizar
        </button>
      )}

      <button
        onClick={() => handleStatusChange("FALTOU")}
        disabled={isPending}
        className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
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
