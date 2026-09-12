"use client";

import React, { useState, useActionState, useEffect } from "react";
import { createExpenseAction } from "@/app/actions/financial.actions";
import { Plus, X, CreditCard, CheckCircle2, AlertCircle } from "lucide-react";

export default function ExpenseModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(createExpenseAction, null);

  useEffect(() => {
    if (state?.success) {
      const timer = setTimeout(() => {
        setIsOpen(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [state]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#E5A838] via-[#F5CD67] to-[#C1801F] hover:opacity-95 text-[#000A1B] font-extrabold text-xs shadow-lg shadow-[#E5A838]/20 transition-all flex items-center gap-2"
      >
        <Plus className="w-4 h-4 text-[#000A1B]" />
        <span>Nova Despesa (A Pagar)</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#000A1B]/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#010F25] border border-[#C1801F]/35 rounded-3xl w-full max-w-lg shadow-2xl p-6 relative text-[#E3DCBE]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#011733] pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E5A838]/10 text-[#F5CD67] border border-[#C1801F]/30 flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Lançar Nova Despesa Operacional</h2>
                  <p className="text-xs text-[#E3DCBE]/70">
                    Custos fixos, variáveis, insumos e infraestrutura.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-[#E3DCBE]/60 hover:text-white rounded-lg hover:bg-[#011733] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Alert State */}
            {state?.success && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{state.message}</span>
              </div>
            )}

            {state?.error && (
              <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{state.error}</span>
              </div>
            )}

            {/* Form */}
            <form action={formAction} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="block font-semibold text-[#E3DCBE]/80">Descrição da Despesa *</label>
                <input
                  type="text"
                  name="description"
                  required
                  placeholder="Ex: Aluguel da Unidade, Fatura de Energia, Insumos de Fisioterapia"
                  className="w-full p-2.5 bg-[#000A1B]/80 border border-[#011733] focus:border-[#E5A838] rounded-xl text-[#E3DCBE] placeholder-[#E3DCBE]/40 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-semibold text-[#E3DCBE]/80">Categoria *</label>
                  <select
                    name="category"
                    required
                    className="w-full p-2.5 bg-[#000A1B]/80 border border-[#011733] focus:border-[#E5A838] rounded-xl text-[#E3DCBE] focus:outline-none"
                  >
                    <option value="ALUGUEL">Aluguel / Imóvel</option>
                    <option value="ENERGIA">Energia / Água / Internet</option>
                    <option value="MATERIAIS">Materiais & Insumos Clínicos</option>
                    <option value="SALARIOS">Folha de Pagamento / Salários</option>
                    <option value="MANUTENCAO">Manutenção de Aparelhos</option>
                    <option value="TAXAS">Taxas & Impostos</option>
                    <option value="OUTROS">Outros</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-[#E3DCBE]/80">Valor (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    name="amount"
                    required
                    placeholder="250.00"
                    className="w-full p-2.5 bg-[#000A1B]/80 border border-[#011733] focus:border-[#E5A838] rounded-xl text-[#E3DCBE] font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-semibold text-[#E3DCBE]/80">Data de Vencimento *</label>
                  <input
                    type="date"
                    name="dueDate"
                    required
                    className="w-full p-2.5 bg-[#000A1B]/80 border border-[#011733] focus:border-[#E5A838] rounded-xl text-[#E3DCBE] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-[#E3DCBE]/80">Data de Pagamento (Se Pago)</label>
                  <input
                    type="date"
                    name="paymentDate"
                    className="w-full p-2.5 bg-[#000A1B]/80 border border-[#011733] focus:border-[#E5A838] rounded-xl text-[#E3DCBE] focus:outline-none"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-[#011733] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#011733] hover:bg-[#011733]/80 text-[#E3DCBE] font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E5A838] via-[#F5CD67] to-[#C1801F] hover:opacity-95 text-[#000A1B] font-extrabold shadow-md"
                >
                  {isPending ? "Gravando..." : "Lançar Despesa"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
