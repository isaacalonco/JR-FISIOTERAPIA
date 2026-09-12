"use client";

import React, { useState, useActionState, useEffect } from "react";
import { createClinicalEvolutionAction } from "@/app/actions/clinical.actions";
import { Plus, X, Activity, CheckCircle2, AlertCircle, Flame } from "lucide-react";

interface EvolutionModalProps {
  patientId: string;
}

export default function EvolutionModal({ patientId }: EvolutionModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [painLevel, setPainLevel] = useState<number>(3);
  const [state, formAction, isPending] = useActionState(createClinicalEvolutionAction, null);

  useEffect(() => {
    if (state?.success) {
      const timer = setTimeout(() => {
        setIsOpen(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [state]);

  const getPainBadgeColor = (val: number) => {
    if (val <= 3) return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    if (val <= 6) return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    return "bg-rose-500/20 text-rose-400 border-rose-500/30";
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-semibold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        <span>Nova Evolução (SOAP)</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl shadow-2xl p-6 relative text-slate-100">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Registrar Evolução de Sessão</h2>
                  <p className="text-xs text-slate-400">
                    Acompanhamento do estado funcional e escala analógica de dor.
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
              <input type="hidden" name="patientId" value={patientId} />
              <input type="hidden" name="painLevel" value={painLevel} />

              {/* Pain Scale Selector */}
              <div className="space-y-2 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-amber-400" />
                    Escala Analógica de Dor (EVA):
                  </label>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold font-mono border ${getPainBadgeColor(
                      painLevel
                    )}`}
                  >
                    Nível {painLevel} / 10
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={painLevel}
                  onChange={(e) => setPainLevel(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>0 - Sem Dor</span>
                  <span>5 - Dor Moderada</span>
                  <span>10 - Dor Insuportável</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-slate-300">
                  Evolução Clínica / Notas de Atendimento (SOAP) *
                </label>
                <textarea
                  name="evolutionNotes"
                  required
                  rows={4}
                  placeholder="Relato do paciente, queixas do dia, amplitudes de movimento observadas..."
                  className="w-full p-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-slate-300">
                  Conduta Terapêutica Aplicada
                </label>
                <textarea
                  name="conduct"
                  rows={3}
                  placeholder="Procedimentos realizados: Cinesioterapia, Ultrassom, Liberação Miofascial, Alongamentos..."
                  className="w-full p-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
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
                  {isPending ? "Salvando..." : "Registrar Evolução"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
