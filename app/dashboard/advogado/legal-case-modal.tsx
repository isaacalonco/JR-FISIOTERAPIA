"use client";

import React, { useState, useActionState, useEffect } from "react";
import { createPortal } from "react-dom";
import { createLegalCaseAction } from "@/app/actions/legal.actions";
import { Plus, X, Scale, CheckCircle2, AlertCircle, Calendar, Phone, DollarSign, User, ShieldCheck } from "lucide-react";

export default function LegalCaseModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(createLegalCaseAction, null);

  useEffect(() => {
    if (state?.success) {
      const timer = setTimeout(() => {
        setIsOpen(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [state]);

  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#E5A838] via-[#F5CD67] to-[#C1801F] hover:opacity-95 text-[#000A1B] font-extrabold text-xs shadow-lg shadow-[#E5A838]/20 transition-all flex items-center gap-2"
      >
        <Plus className="w-4 h-4 text-[#000A1B]" />
        <span>Novo Atendimento / Processo</span>
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
                maxWidth: "680px",
                maxHeight: "88vh",
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
              <div className="flex items-center justify-between p-5 sm:p-6 border-b border-[#011733] bg-[#010F25] shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E5A838]/10 text-[#F5CD67] border border-[#C1801F]/30 flex items-center justify-center">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Cadastrar Processo Jurídico</h2>
                    <p className="text-xs text-[#E3DCBE]/70">
                      Registro de cliente, advogado responsável, tipo de processo e honorários.
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

                <form action={formAction} className="space-y-4 text-xs">
                  {/* Linha 1: Advogado e Cliente */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block font-semibold text-[#E3DCBE]/80 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#E5A838]" />
                        <span>Nome do Advogado *</span>
                      </label>
                      <input
                        type="text"
                        name="lawyerName"
                        required
                        placeholder="Ex: Dr. Marcos Vinícius Prado"
                        className="w-full p-2.5 bg-[#000A1B]/80 border border-[#011733] focus:border-[#E5A838] rounded-xl text-white placeholder-[#E3DCBE]/40 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block font-semibold text-[#E3DCBE]/80 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#F5CD67]" />
                        <span>Nome do Cliente *</span>
                      </label>
                      <input
                        type="text"
                        name="clientName"
                        required
                        placeholder="Ex: Gabriel Henrique Alves"
                        className="w-full p-2.5 bg-[#000A1B]/80 border border-[#011733] focus:border-[#E5A838] rounded-xl text-white placeholder-[#E3DCBE]/40 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Linha 2: Telefone e Data de Entrada */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block font-semibold text-[#E3DCBE]/80 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#E5A838]" />
                        <span>Telefone do Cliente *</span>
                      </label>
                      <input
                        type="text"
                        name="clientPhone"
                        required
                        placeholder="(61) 99999-9999"
                        className="w-full p-2.5 bg-[#000A1B]/80 border border-[#011733] focus:border-[#E5A838] rounded-xl text-white placeholder-[#E3DCBE]/40 focus:outline-none font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block font-semibold text-[#E3DCBE]/80 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#F5CD67]" />
                        <span>Data de Entrada / Início *</span>
                      </label>
                      <input
                        type="date"
                        name="entryDate"
                        required
                        defaultValue={today}
                        className="w-full p-2.5 bg-[#000A1B]/80 border border-[#011733] focus:border-[#E5A838] rounded-xl text-white focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  {/* Linha 3: Valor Pago e Função/Tipo do Processo */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block font-semibold text-[#E3DCBE]/80 flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Valor Pago pelo Cliente (R$) *</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        name="amountPaid"
                        required
                        placeholder="0.00"
                        className="w-full p-2.5 bg-[#000A1B]/80 border border-[#011733] focus:border-[#E5A838] rounded-xl text-white placeholder-[#E3DCBE]/40 focus:outline-none font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block font-semibold text-[#E3DCBE]/80 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#E5A838]" />
                        <span>Função / Tipo de Processo *</span>
                      </label>
                      <select
                        name="processType"
                        required
                        defaultValue="INSS"
                        className="w-full p-2.5 bg-[#000A1B]/80 border border-[#011733] focus:border-[#E5A838] rounded-xl text-white focus:outline-none"
                      >
                        <option value="INSS">INSS (Previdenciário / Benefício)</option>
                        <option value="Observadoria">Observadoria (Monitoramento / Perícia)</option>
                        <option value="Afastamento">Afastamento (Acidente / Doença do Trabalho)</option>
                      </select>
                    </div>
                  </div>

                  {/* Linha 4: Andamento do Processo */}
                  <div className="space-y-1">
                    <label className="block font-semibold text-[#E3DCBE]/80">
                      Andamento do Processo (Status / Fase Atual) *
                    </label>
                    <input
                      type="text"
                      name="statusProgress"
                      required
                      placeholder="Ex: Inicial Distribuída, Perícia Médica Agendada, Aguardando Sentença..."
                      defaultValue="Em Análise Inicial"
                      className="w-full p-2.5 bg-[#000A1B]/80 border border-[#011733] focus:border-[#E5A838] rounded-xl text-white placeholder-[#E3DCBE]/40 focus:outline-none"
                    />
                  </div>

                  {/* Linha 5: Observação Livre */}
                  <div className="space-y-1">
                    <label className="block font-semibold text-[#E3DCBE]/80">
                      Observações Livres do Advogado
                    </label>
                    <textarea
                      name="notes"
                      rows={3}
                      placeholder="Escreva livremente informações específicas do caso, número do processo, detalhes do laudo pericial, prazos, etc..."
                      className="w-full p-2.5 bg-[#000A1B]/80 border border-[#011733] focus:border-[#E5A838] rounded-xl text-[#E3DCBE] placeholder-[#E3DCBE]/40 focus:outline-none"
                    />
                  </div>

                  {/* Botões */}
                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#011733]">
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-2.5 rounded-xl bg-[#011733] hover:bg-[#011733]/80 text-[#E3DCBE] font-semibold text-xs transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isPending}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E5A838] to-[#C1801F] hover:opacity-95 text-[#000A1B] font-bold text-xs shadow-md shadow-[#E5A838]/20 transition-all disabled:opacity-50"
                    >
                      {isPending ? "Cadastrando..." : "Gravar Atendimento"}
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
