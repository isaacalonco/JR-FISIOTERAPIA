"use client";

import React, { useState } from "react";
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

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                  <Ticket className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Autorização / Voucher de Uso</h3>
                  <p className="text-xs text-slate-400">Transferir créditos para consulta de amigo/parente</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setState(null);
                }}
                className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {state?.error && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {state.error}
                </div>
              )}
              {state?.success && state.code && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-3">
                  <div className="text-emerald-400 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Voucher de Autorização Gerado com Sucesso!
                  </div>
                  <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-mono">Código do Voucher</span>
                      <span className="text-xl font-extrabold text-emerald-400 font-mono tracking-wider">
                        {state.code}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyCode(state.code!)}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-medium"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      Copiar
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Envie este código para o paciente presentado. Ao chegar na clínica, a recepção validará o código para liberar a consulta!
                  </p>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Assinatura do Titular (Pagador)
                </label>
                <select
                  name="subscriptionId"
                  required
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
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
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Nome do Beneficiário (Amigo / Familiar)
                </label>
                <input
                  type="text"
                  name="beneficiaryName"
                  required
                  placeholder="Ex: Carlos Eduardo (Dor na coluna)"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Telefone ou CPF do Amigo
                  </label>
                  <input
                    type="text"
                    name="beneficiaryCpfOrPhone"
                    required
                    placeholder="(61) 98888-7777"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Créditos Transferidos
                  </label>
                  <input
                    type="number"
                    name="creditsReserved"
                    required
                    defaultValue={1}
                    min={1}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    setState(null);
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold rounded-xl transition-colors"
                >
                  Fechar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? "Gerando..." : "Gerar Voucher"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
