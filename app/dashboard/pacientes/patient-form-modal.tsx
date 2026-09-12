"use client";

import React, { useState, useActionState, useEffect } from "react";
import { createPatientAction } from "@/app/actions/patient.actions";
import { Plus, X, UserPlus, CheckCircle2, AlertCircle } from "lucide-react";

export default function PatientFormModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(createPatientAction, null);

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
        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-semibold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        <span>Novo Paciente</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative text-slate-100">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Cadastrar Novo Paciente</h2>
                  <p className="text-xs text-slate-400">
                    Insira os dados cadastrais do paciente com validação de CPF.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-semibold text-slate-300">Nome Completo *</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder="Ex: Maria Oliveira Silva"
                    className="w-full p-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-slate-300">CPF *</label>
                  <input
                    type="text"
                    name="cpf"
                    required
                    placeholder="000.000.000-00"
                    className="w-full p-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-slate-300">Data de Nascimento *</label>
                  <input
                    type="date"
                    name="birthDate"
                    required
                    className="w-full p-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-slate-300">Gênero *</label>
                  <select
                    name="gender"
                    required
                    className="w-full p-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  >
                    <option value="FEMININO">Feminino</option>
                    <option value="MASCULINO">Masculino</option>
                    <option value="OUTRO">Outro / Prefiro não informar</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-slate-300">Telefone Celular *</label>
                  <input
                    type="text"
                    name="phone"
                    required
                    placeholder="(11) 99999-9999"
                    className="w-full p-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-slate-300">E-mail</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="paciente@email.com"
                    className="w-full p-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Endereço */}
              <div className="pt-2 border-t border-slate-800/60 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="block font-semibold text-slate-300">Rua / Logradouro</label>
                  <input
                    type="text"
                    name="addressStreet"
                    placeholder="Av. Paulista"
                    className="w-full p-2 bg-slate-950/60 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-semibold text-slate-300">Número</label>
                  <input
                    type="text"
                    name="addressNumber"
                    placeholder="1000"
                    className="w-full p-2 bg-slate-950/60 border border-slate-800 rounded-xl text-white"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold"
                >
                  {isPending ? "Salvando..." : "Cadastrar Paciente"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
