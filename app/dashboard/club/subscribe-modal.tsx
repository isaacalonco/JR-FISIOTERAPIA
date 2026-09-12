"use client";

import React, { useState } from "react";
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

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Adicionar Assinante</h3>
                  <p className="text-xs text-slate-400">Vincular paciente titular a um plano de créditos</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
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
              {state?.success && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  {state.message}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Paciente Titular</label>
                <select
                  name="patientId"
                  required
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
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
                <label className="block text-xs font-medium text-slate-300 mb-1">Plano do Clube</label>
                <select
                  name="planId"
                  required
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
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
                  className="rounded border-slate-800 bg-slate-950 text-purple-600 focus:ring-purple-500 w-4 h-4"
                />
                <label htmlFor="autoRenew" className="text-xs text-slate-300">
                  Renovação mensal automática dos créditos
                </label>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50"
                >
                  {loading ? "Processando..." : "Confirmar Assinatura"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
