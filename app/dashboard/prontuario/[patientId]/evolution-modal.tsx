"use client";

import React, { useState, useActionState, useEffect } from "react";
import { createPortal } from "react-dom";
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
        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#E5A838] via-[#F5CD67] to-[#C1801F] hover:opacity-95 text-[#000A1B] font-extrabold text-xs shadow-lg shadow-[#E5A838]/20 transition-all flex items-center gap-2"
      >
        <Plus className="w-4 h-4 text-[#000A1B]" />
        <span>Nova Evolução (SOAP)</span>
      </button>

      {isOpen && createPortal(
        <div style={{position:'fixed',inset:0,zIndex:99999,background:'rgba(0,10,27,0.85)',backdropFilter:'blur(8px)',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{position:'fixed',inset:0}} onClick={() => setIsOpen(false)} />
          <div style={{position:'relative',zIndex:10000,width:'100%',maxWidth:'576px',maxHeight:'85vh',display:'flex',flexDirection:'column',background:'#010F25',border:'1px solid rgba(193,128,31,0.35)',borderRadius:'1.5rem',boxShadow:'0 25px 50px rgba(0,0,0,0.6)',overflow:'hidden',color:'#E3DCBE',margin:'0 16px'}}>
            {/* Header */}
            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-[#011733] bg-[#010F25] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E5A838]/10 text-[#F5CD67] border border-[#C1801F]/30 flex items-center justify-center">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Registrar Evolução de Sessão</h2>
                  <p className="text-xs text-[#E3DCBE]/70">
                    Acompanhamento do estado funcional e escala analógica de dor.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 text-[#E3DCBE]/60 hover:text-white rounded-lg hover:bg-[#011733] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="p-5 sm:p-6 overflow-y-auto flex-1">
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
                <div className="space-y-2 p-4 rounded-2xl bg-[#000A1B]/80 border border-[#011733]">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-[#E3DCBE]/90 flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-[#E5A838]" />
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
                    className="w-full h-2 bg-[#011733] rounded-lg appearance-none cursor-pointer accent-[#E5A838]"
                  />
                  <div className="flex justify-between text-[10px] text-[#E3DCBE]/50">
                    <span>0 - Sem Dor</span>
                    <span>5 - Dor Moderada</span>
                    <span>10 - Dor Insuportável</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-[#E3DCBE]/80">
                    Evolução Clínica / Notas de Atendimento (SOAP) *
                  </label>
                  <textarea
                    name="evolutionNotes"
                    required
                    rows={4}
                    placeholder="Relato do paciente, queixas do dia, amplitudes de movimento observadas..."
                    className="w-full p-2.5 bg-[#000A1B]/80 border border-[#011733] focus:border-[#E5A838] rounded-xl text-[#E3DCBE] placeholder-[#E3DCBE]/40 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-[#E3DCBE]/80">
                    Conduta Terapêutica Aplicada
                  </label>
                  <textarea
                    name="conduct"
                    rows={3}
                    placeholder="Procedimentos realizados: Cinesioterapia, Ultrassom, Liberação Miofascial, Alongamentos..."
                    className="w-full p-2.5 bg-[#000A1B]/80 border border-[#011733] focus:border-[#E5A838] rounded-xl text-[#E3DCBE] placeholder-[#E3DCBE]/40 focus:outline-none"
                  />
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
                    {isPending ? "Salvando..." : "Registrar Evolução"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      , document.body)}
    </>
  );
}
