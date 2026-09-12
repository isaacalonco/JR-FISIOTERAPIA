"use client";

import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Ticket, CheckCircle2, AlertCircle, X, Share2, Copy } from "lucide-react";
import { generateAuthorizationAction, ActionResult } from "@/app/actions/subscription.actions";

interface Option {
  id: string;
  patientName: string;
  planName: string;
  creditsRemaining: number;
}

interface AuthorizationModalProps {
  subscriptions: Option[];
}

export default function AuthorizationModal({ subscriptions }: AuthorizationModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState<ActionResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setState(null);
    const formData = new FormData(e.currentTarget);

    const result = await generateAuthorizationAction(null, formData);
    setState(result);
    setLoading(false);
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code);
    alert(`Código de Voucher ${code} copiado para a área de transferência!`);
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
      >
        <Ticket className="w-4 h-4" />
        Gerar Voucher / Presentear Amigo
      </button>

      {isOpen && createPortal(
        <div style={{position:'fixed',inset:0,zIndex:99999,background:'rgba(0,10,27,0.85)',backdropFilter:'blur(8px)',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{position:'fixed',inset:0}} onClick={() => { setIsOpen(false); setState(null); }} />
          <div style={{position:'relative',zIndex:10000,width:'100%',maxWidth:'512px',maxHeight:'85vh',display:'flex',flexDirection:'column',background:'#010F25',border:'1px solid rgba(193,128,31,0.35)',borderRadius:'1.5rem',boxShadow:'0 25px 50px rgba(0,0,0,0.6)',overflow:'hidden',color:'#E3DCBE',margin:'0 16px'}}>
            <div className="p-5 sm:p-6 border-b border-[#011733] flex items-center justify-between shrink-0 bg-[#010F25]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#E5A838]/10 text-[#F5CD67] flex items-center justify-center border border-[#C1801F]/30">
                  <Ticket className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Autorização / Voucher de Uso</h3>
                  <p className="text-xs text-[#E3DCBE]/70">Transferir créditos para consulta de amigo/parente</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setState(null);
                }}
                className="text-[#E3DCBE]/60 hover:text-white p-2 rounded-xl hover:bg-[#011733] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              {state?.error && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  {state.error}
                </div>
              )}
              {state?.success && state.code && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-3">
                  <div className="text-emerald-300 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Voucher de Autorização Gerado com Sucesso!
                  </div>
                  <div className="bg-[#000A1B] border border-[#011733] p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#E3DCBE]/60 block uppercase font-mono">Código do Voucher</span>
                      <span className="text-xl font-extrabold text-[#F5CD67] font-mono tracking-wider">
                        {state.code}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyCode(state.code!)}
                      className="p-2 bg-[#011733] hover:bg-[#011733]/80 text-[#E3DCBE] rounded-xl transition-colors flex items-center gap-1.5 text-xs font-medium"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      Copiar
                    </button>
                  </div>
                  <p className="text-[11px] text-[#E3DCBE]/70">
                    Envie este código para o paciente presenteado. Ao chegar na clínica, a recepção validará o código para liberar a consulta!
                  </p>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#E3DCBE]/80 mb-1">
                  Assinatura do Titular (Pagador)
                </label>
                <select
                  name="subscriptionId"
                  required
                  className="w-full p-2.5 bg-[#000A1B]/80 border border-[#011733] focus:border-[#E5A838] rounded-xl text-xs text-[#E3DCBE] focus:outline-none"
                >
                  <option value="">Selecione o titular assinante...</option>
                  {subscriptions.map((s) => (
                    <option key={s.id} value={s.id} disabled={s.creditsRemaining <= 0}>
                      {s.patientName} - {s.planName} ({s.creditsRemaining} crédito(s) restante(s))
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#E3DCBE]/80 mb-1">
                  Nome do Beneficiário (Amigo / Familiar)
                </label>
                <input
                  type="text"
                  name="beneficiaryName"
                  required
                  placeholder="Ex: Carlos Eduardo (Dor na coluna)"
                  className="w-full p-2.5 bg-[#000A1B]/80 border border-[#011733] focus:border-[#E5A838] rounded-xl text-xs text-[#E3DCBE] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#E3DCBE]/80 mb-1">
                    Telefone ou CPF do Amigo
                  </label>
                  <input
                    type="text"
                    name="beneficiaryCpfOrPhone"
                    required
                    placeholder="(61) 98888-7777"
                    className="w-full p-2.5 bg-[#000A1B]/80 border border-[#011733] focus:border-[#E5A838] rounded-xl text-xs text-[#E3DCBE] focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#E3DCBE]/80 mb-1">
                    Créditos Transferidos
                  </label>
                  <input
                    type="number"
                    name="creditsReserved"
                    required
                    defaultValue={1}
                    min={1}
                    className="w-full p-2.5 bg-[#000A1B]/80 border border-[#011733] focus:border-[#E5A838] rounded-xl text-xs text-[#E3DCBE] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#011733] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    setState(null);
                  }}
                  className="px-4 py-2.5 bg-[#011733] hover:bg-[#011733]/80 text-[#E3DCBE] text-xs font-semibold rounded-xl transition-colors"
                >
                  Fechar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#E5A838] via-[#F5CD67] to-[#C1801F] text-[#000A1B] text-xs font-extrabold rounded-xl shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? "Gerando..." : "Gerar Voucher"}
                </button>
              </div>
            </form>
          </div>
        </div>
      , document.body)}
    </>
  );
}
