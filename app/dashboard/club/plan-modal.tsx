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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#000A1B]/85 backdrop-blur-md animate-in fade-in">
          <div className="fixed inset-0" onClick={() => setIsOpen(false)} />
          <div className="relative z-10 w-full max-w-lg max-h-[85vh] flex flex-col bg-[#010F25] border border-[#C1801F]/35 rounded-3xl shadow-2xl overflow-hidden text-[#E3DCBE]">
            <div className="p-5 sm:p-6 border-b border-[#011733] flex items-center justify-between shrink-0 bg-[#010F25]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#E5A838]/10 text-[#F5CD67] flex items-center justify-center border border-[#C1801F]/30">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Criar Plano JR FISIOTERAPIA Club</h3>
                  <p className="text-xs text-[#E3DCBE]/70">Configure modalidade, créditos mensais e recarga avulsa</p>
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
                <label className="block text-xs font-semibold text-[#E3DCBE]/80 mb-1">Nome do Plano</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Ex: Plano Fit 2 Créditos / Plano Família 3 Créditos"
                  className="w-full p-2.5 bg-[#000A1B]/80 border border-[#011733] focus:border-[#E5A838] rounded-xl text-xs text-[#E3DCBE] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#E3DCBE]/80 mb-1">Valor Mensal (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="monthlyPrice"
                    required
                    placeholder="69.00"
                    className="w-full p-2.5 bg-[#000A1B]/80 border border-[#011733] focus:border-[#E5A838] rounded-xl text-xs text-[#E3DCBE] focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#E3DCBE]/80 mb-1">Créditos por Mês</label>
                  <input
                    type="number"
                    name="creditsPerMonth"
                    required
                    defaultValue={2}
                    min={1}
                    className="w-full p-2.5 bg-[#000A1B]/80 border border-[#011733] focus:border-[#E5A838] rounded-xl text-xs text-[#E3DCBE] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#E3DCBE]/80 mb-1">
                  Preço por Crédito Extra Avulso (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="extraCreditPrice"
                  required
                  placeholder="35.00"
                  className="w-full p-2.5 bg-[#000A1B]/80 border border-[#011733] focus:border-[#E5A838] rounded-xl text-xs text-[#E3DCBE] focus:outline-none font-mono"
                />
                <span className="text-[10px] text-[#E3DCBE]/50 mt-1 block">
                  Valor promocional caso o cliente deseje abastecer créditos adicionais no mês.
                </span>
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
                  {loading ? "Gravando..." : "Criar Plano"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
