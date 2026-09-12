"use client";

import React, { useState, useTransition } from "react";
import { createPortal } from "react-dom";
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
        className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#E5A838] via-[#F5CD67] to-[#C1801F] hover:opacity-95 text-[#000A1B] text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-sm"
      >
        <DollarSign className="w-3.5 h-3.5" />
        <span>Dar Baixa</span>
      </button>

      {isOpen && createPortal(
        <div style={{position:'fixed',inset:0,zIndex:99999,background:'rgba(0,10,27,0.85)',backdropFilter:'blur(8px)',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{position:'fixed',inset:0}} onClick={() => setIsOpen(false)} />
          <div style={{position:'relative',zIndex:10000,background:'#010F25',border:'1px solid rgba(193,128,31,0.35)',borderRadius:'1.5rem',width:'100%',maxWidth:'384px',boxShadow:'0 25px 50px rgba(0,0,0,0.6)',padding:'1.5rem',color:'#E3DCBE',margin:'0 16px'}}>
            <div className="flex items-center justify-between border-b border-[#011733] pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#F5CD67]" />
                Confirmar Recebimento
              </h3>
              <button type="button" onClick={() => setIsOpen(false)} className="text-[#E3DCBE]/60 hover:text-white p-1 rounded-lg hover:bg-[#011733]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="block text-[#E3DCBE]/80 font-medium">Forma de Pagamento</label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value as any)}
                  className="w-full p-2.5 bg-[#000A1B]/80 border border-[#011733] focus:border-[#E5A838] rounded-xl text-white focus:outline-none"
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
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-3.5 py-2 rounded-xl bg-[#011733] text-[#E3DCBE] font-semibold hover:bg-[#011733]/80"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isPending}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#E5A838] via-[#F5CD67] to-[#C1801F] text-[#000A1B] font-extrabold shadow-md hover:opacity-95"
              >
                {isPending ? "Efetuando..." : "Confirmar Recebimento"}
              </button>
            </div>
          </div>
        </div>
      , document.body)}
    </>
  );
}
