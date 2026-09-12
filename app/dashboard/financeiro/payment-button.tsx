"use client";

import React, { useState, useTransition } from "react";
import { registerPaymentAction } from "@/app/actions/financial.actions";
import { CheckCircle2, DollarSign, X } from "lucide-react";

interface PaymentButtonProps {
  receivableId: string;
  amount: number;
}

export default function PaymentButton({ receivableId, amount }: PaymentButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [method, setMethod] = useState<"PIX" | "CARTAO_CREDITO" | "CARTAO_DEBITO" | "DINHEIRO" | "BOLETO">("PIX");
  const [isPending, startTransition] = useTransition();

  const handleConfirm = () => {
    startTransition(async () => {
      const res = await registerPaymentAction(receivableId, method, amount);
      if (res.success) {
        setIsOpen(false);
      }
    });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs font-semibold flex items-center gap-1.5 transition-colors"
      >
        <DollarSign className="w-3.5 h-3.5" />
        <span>Dar Baixa</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm shadow-2xl p-6 relative text-slate-100 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Confirmar Recebimento
              </h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="block text-slate-400 font-medium">Forma de Pagamento</label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="PIX">PIX (Transferência Instantânea)</option>
                  <option value="CARTAO_CREDITO">Cartão de Crédito</option>
                  <option value="CARTAO_DEBITO">Cartão de Débito</option>
                  <option value="DINHEIRO">Dinheiro / Espécie</option>
                  <option value="BOLETO">Boleto Bancário</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 text-xs">
              <button
                onClick={() => setIsOpen(false)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                disabled={isPending}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold"
              >
                {isPending ? "Efetuando..." : "Confirmar Recebimento"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
