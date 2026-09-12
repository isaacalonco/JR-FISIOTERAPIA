"use client";

import React, { useState } from "react";
import { createPortal } from "react-dom";
import { UserCheck, CheckCircle2, AlertCircle, X } from "lucide-react";
import { createSubscriptionAction, ActionResult } from "@/app/actions/subscription.actions";

interface Option {
  id: string;
  name: string;
  detail?: string;
}

interface SubscribeModalProps {
  plans: Option[];
  patients: Option[];
}

export default function SubscribeModal({ plans, patients }: SubscribeModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState<ActionResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setState(null);
    const formData = new FormData(e.currentTarget);

    const result = await createSubscriptionAction(null, formData);
    setState(result);
    setLoading(false);

    if (result.success) {
      setTimeout(() => {
        setIsOpen(false);
        setState(null);
      }, 1500);
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors"
      >
        <UserCheck className="w-4 h-4 text-purple-400" />
        Nova Assinatura de Paciente
      </button>

      {isOpen && createPortal(
        <div style={{position:'fixed',inset:0,zIndex:99999,background:'rgba(0,10,27,0.85)',backdropFilter:'blur(8px)',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{position:'fixed',inset:0}} onClick={() => setIsOpen(false)} />
          <div style={{position:'relative',zIndex:10000,width:'100%',maxWidth:'512px',maxHeight:'85vh',display:'flex',flexDirection:'column',background:'#010F25',border:'1px solid rgba(193,128,31,0.35)',borderRadius:'1.5rem',boxShadow:'0 25px 50px rgba(0,0,0,0.6)',overflow:'hidden',color:'#E3DCBE',margin:'0 16px'}}>
            <div className="p-5 sm:p-6 border-b border-[#011733] flex items-center justify-between shrink-0 bg-[#010F25]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#E5A838]/10 text-[#F5CD67] flex items-center justify-center border border-[#C1801F]/30">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Adicionar Assinante</h3>
                  <p className="text-xs text-[#E3DCBE]/70">Vincular paciente titular a um plano de créditos</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
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
              {state?.success && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  {state.message}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#E3DCBE]/80 mb-1">Paciente Titular</label>
                <select
                  name="patientId"
                  required
                  className="w-full p-2.5 bg-[#000A1B]/80 border border-[#011733] focus:border-[#E5A838] rounded-xl text-xs text-[#E3DCBE] focus:outline-none"
                >
                  <option value="">Selecione o paciente...</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} {p.detail ? `(${p.detail})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#E3DCBE]/80 mb-1">Plano do Clube</label>
                <select
                  name="planId"
                  required
                  className="w-full p-2.5 bg-[#000A1B]/80 border border-[#011733] focus:border-[#E5A838] rounded-xl text-xs text-[#E3DCBE] focus:outline-none"
                >
                  <option value="">Selecione o plano...</option>
                  {plans.map((pl) => (
                    <option key={pl.id} value={pl.id}>
                      {pl.name} {pl.detail ? `- ${pl.detail}` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="autoRenew"
                  name="autoRenew"
                  defaultChecked
                  className="rounded border-[#011733] bg-[#000A1B] text-[#E5A838] focus:ring-[#E5A838] w-4 h-4"
                />
                <label htmlFor="autoRenew" className="text-xs text-[#E3DCBE]/80">
                  Renovação mensal automática dos créditos
                </label>
              </div>

              <div className="pt-4 border-t border-[#011733] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2.5 bg-[#011733] hover:bg-[#011733]/80 text-[#E3DCBE] text-xs font-semibold rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#E5A838] via-[#F5CD67] to-[#C1801F] text-[#000A1B] text-xs font-extrabold rounded-xl shadow-lg transition-all disabled:opacity-50"
                >
                  {loading ? "Processando..." : "Confirmar Assinatura"}
                </button>
              </div>
            </form>
          </div>
        </div>
      , document.body)}
    </>
  );
}
