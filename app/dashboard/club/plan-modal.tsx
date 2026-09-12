"use client";

import React, { useState } from "react";
import { Plus, Award, CheckCircle2, AlertCircle, X } from "lucide-react";
import { createClubPlanAction, ActionResult } from "@/app/actions/subscription.actions";

export default function PlanModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState<ActionResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setState(null);
    const formData = new FormData(e.currentTarget);

    const result = await createClubPlanAction(null, formData);
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
        className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg shadow-purple-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
      >
        <Plus className="w-4 h-4" />
        Novo Plano do Clube
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Criar Plano JR Saúde Club</h3>
                  <p className="text-xs text-slate-400">Configure modalidade, créditos mensais e recarga avulsa</p>
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
                <label className="block text-xs font-medium text-slate-300 mb-1">Nome do Plano</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Ex: Plano Fit 2 Créditos / Plano Família 3 Créditos"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Valor Mensal (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="monthlyPrice"
                    required
                    placeholder="69.00"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Créditos por Mês</label>
                  <input
                    type="number"
                    name="creditsPerMonth"
                    required
                    defaultValue={2}
                    min={1}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Preço por Crédito Extra Avulso (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="extraCreditPrice"
                  required
                  placeholder="35.00"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Valor promocional caso o cliente deseje abastecer créditos adicionais no mês.
                </span>
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
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-purple-500/20 transition-all disabled:opacity-50"
                >
                  {loading ? "Salvando..." : "Salvar Plano"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
