"use client";

import React, { useState, useActionState } from "react";
import { createPortal } from "react-dom";
import { Plus, X, CheckCircle2, AlertCircle, Building2 } from "lucide-react";
import { createUnitAction } from "@/app/actions/reports.actions";

export default function NewUnitModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(createUnitAction, null);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#E5A838] via-[#F5CD67] to-[#C1801F] hover:opacity-95 text-[#000A1B] font-extrabold text-xs shadow-lg shadow-[#E5A838]/20 transition-all flex items-center gap-2"
      >
        <Plus className="w-4 h-4 text-[#000A1B]" />
        <span>Nova Unidade / Filial</span>
      </button>

      {isOpen && createPortal(
        <div style={{position:'fixed',inset:0,zIndex:99999,background:'rgba(0,10,27,0.85)',backdropFilter:'blur(8px)',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{position:'fixed',inset:0}} onClick={() => setIsOpen(false)} />
          <div style={{position:'relative',zIndex:10000,width:'100%',maxWidth:'512px',maxHeight:'85vh',display:'flex',flexDirection:'column',background:'#010F25',border:'1px solid rgba(193,128,31,0.35)',borderRadius:'1.5rem',boxShadow:'0 25px 50px rgba(0,0,0,0.6)',overflow:'hidden',color:'#E3DCBE',margin:'0 16px'}}>
            <div className="p-5 sm:p-6 border-b border-[#011733] flex items-center justify-between shrink-0 bg-[#010F25]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E5A838]/10 text-[#F5CD67] border border-[#C1801F]/30 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Cadastrar Nova Filial</h2>
                  <p className="text-xs text-[#E3DCBE]/70">Unidade de atendimento da clínica.</p>
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

            <div className="p-5 sm:p-6 overflow-y-auto flex-1 text-xs space-y-4">
              {state?.success && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{state.message}</span>
                </div>
              )}

              {state?.error && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{state.error}</span>
                </div>
              )}

              <form action={formAction} className="space-y-4">
                <div className="space-y-1">
                  <label className="block font-semibold text-[#E3DCBE]/80">Nome da Unidade / Filial *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Ex: Unidade Matriz - Asa Sul"
                    className="w-full p-2.5 bg-[#000A1B]/80 border border-[#011733] focus:border-[#E5A838] rounded-xl text-[#E3DCBE] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-[#E3DCBE]/80">Endereço Completo</label>
                  <input
                    type="text"
                    name="address"
                    placeholder="Ex: SEPS 709/909 Bloco A Sala 204 - Brasília/DF"
                    className="w-full p-2.5 bg-[#000A1B]/80 border border-[#011733] focus:border-[#E5A838] rounded-xl text-[#E3DCBE] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-semibold text-[#E3DCBE]/80">Telefone / WhatsApp</label>
                    <input
                      type="text"
                      name="phone"
                      placeholder="(61) 3344-5566"
                      className="w-full p-2.5 bg-[#000A1B]/80 border border-[#011733] focus:border-[#E5A838] rounded-xl text-[#E3DCBE] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-semibold text-[#E3DCBE]/80">Status da Filial</label>
                    <select
                      name="is_active"
                      defaultValue="true"
                      className="w-full p-2.5 bg-[#000A1B]/80 border border-[#011733] focus:border-[#E5A838] rounded-xl text-[#E3DCBE] focus:outline-none"
                    >
                      <option value="true">Ativa / Operacional</option>
                      <option value="false">Inativa</option>
                    </select>
                  </div>
                </div>

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
                    {isPending ? "Salvando..." : "Cadastrar Unidade"}
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
