"use client";

import React, { useState, useActionState, useEffect } from "react";
import { createPortal } from "react-dom";
import { updateLegalProgressAction } from "@/app/actions/legal.actions";
import { X, RefreshCw, CheckCircle2, AlertCircle, Clock } from "lucide-react";

interface LegalProgressModalProps {
  caseId: string;
  clientName: string;
  currentProgress: string;
  currentNotes?: string | null;
}

export default function LegalProgressModal({
  caseId,
  clientName,
  currentProgress,
  currentNotes,
}: LegalProgressModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(updateLegalProgressAction, null);

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
        className="px-3 py-1.5 rounded-lg bg-[#011733] hover:bg-[#E5A838]/20 border border-[#C1801F]/30 hover:border-[#E5A838]/50 text-[#F5CD67] text-[11px] font-semibold transition-all flex items-center gap-1.5 shrink-0"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        <span>Atualizar Andamento</span>
      </button>

      {isOpen &&
        createPortal(
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 99999,
              background: "rgba(0,10,27,0.85)",
              backdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{ position: "fixed", inset: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <div
              style={{
                position: "relative",
                zIndex: 10000,
                width: "100%",
                maxWidth: "540px",
                maxHeight: "85vh",
                display: "flex",
                flexDirection: "column",
                background: "#010F25",
                border: "1px solid rgba(193,128,31,0.35)",
                borderRadius: "1.5rem",
                boxShadow: "0 25px 50px rgba(0,0,0,0.6)",
                overflow: "hidden",
                color: "#E3DCBE",
                margin: "0 16px",
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-[#011733] bg-[#010F25] shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#E5A838]/10 text-[#F5CD67] border border-[#C1801F]/30 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white">Evolução do Processo</h2>
                    <p className="text-xs text-[#E3DCBE]/70">
                      Cliente: <span className="text-[#F5CD67] font-semibold">{clientName}</span>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-[#E3DCBE]/60 hover:text-white rounded-lg hover:bg-[#011733] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Body */}
              <div className="p-5 overflow-y-auto flex-1">
                {state?.success && (
                  <div className="mb-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{state.message}</span>
                  </div>
                )}

                {state?.error && (
                  <div className="mb-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{state.error}</span>
                  </div>
                )}

                <form action={formAction} className="space-y-4 text-xs">
                  <input type="hidden" name="id" value={caseId} />

                  <div className="space-y-1">
                    <label className="block font-semibold text-[#E3DCBE]/80">
                      Novo Andamento / Fase Atual do Processo *
                    </label>
                    <input
                      type="text"
                      name="statusProgress"
                      required
                      defaultValue={currentProgress}
                      placeholder="Ex: Sentença Procedente, Recurso Interposto, Perícia Realizada..."
                      className="w-full p-2.5 bg-[#000A1B]/80 border border-[#011733] focus:border-[#E5A838] rounded-xl text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-semibold text-[#E3DCBE]/80">
                      Observações Adicionais / Atualização Livre
                    </label>
                    <textarea
                      name="notes"
                      rows={4}
                      defaultValue={currentNotes || ""}
                      placeholder="Espaço livre para detalhes do caso, datas importantes, petições protocoladas..."
                      className="w-full p-2.5 bg-[#000A1B]/80 border border-[#011733] focus:border-[#E5A838] rounded-xl text-[#E3DCBE] focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#011733]">
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="px-3.5 py-2 rounded-xl bg-[#011733] hover:bg-[#011733]/80 text-[#E3DCBE] font-semibold text-xs transition-colors"
                    >
                      Fechar
                    </button>
                    <button
                      type="submit"
                      disabled={isPending}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#E5A838] to-[#C1801F] hover:opacity-95 text-[#000A1B] font-bold text-xs shadow-md shadow-[#E5A838]/20 transition-all disabled:opacity-50"
                    >
                      {isPending ? "Salvando..." : "Salvar Andamento"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
