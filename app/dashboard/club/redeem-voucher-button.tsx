"use client";

import React, { useState } from "react";
import { CheckCircle2, Ticket, AlertCircle } from "lucide-react";
import { redeemAuthorizationAction } from "@/app/actions/subscription.actions";

interface RedeemVoucherButtonProps {
  authorizationCode: string;
  status: string;
}

export default function RedeemVoucherButton({ authorizationCode, status }: RedeemVoucherButtonProps) {
  const [loading, setLoading] = useState(false);
  const [isDone, setIsDone] = useState(status === "UTILIZADO");

  async function handleRedeem() {
    if (isDone) return;
    const confirm = window.confirm(
      `Confirmar validação do voucher ${authorizationCode} na recepção da clínica?`
    );
    if (!confirm) return;

    setLoading(true);
    const res = await redeemAuthorizationAction(authorizationCode);
    setLoading(false);

    if (res.success) {
      setIsDone(true);
      alert("Voucher validado com sucesso!");
    } else {
      alert(`Erro ao validar voucher: ${res.error}`);
    }
  }

  if (isDone) {
    return (
      <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-semibold flex items-center gap-1.5 w-fit">
        <CheckCircle2 className="w-3.5 h-3.5" />
        Utilizado na Recepção
      </span>
    );
  }

  return (
    <button
      onClick={handleRedeem}
      disabled={loading}
      className="px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
    >
      <Ticket className="w-3.5 h-3.5" />
      {loading ? "Validando..." : "Validar na Recepção"}
    </button>
  );
}
