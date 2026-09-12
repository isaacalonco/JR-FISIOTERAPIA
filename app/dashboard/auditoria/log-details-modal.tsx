"use client";

import React, { useState } from "react";
import { Eye, X, Code, ShieldCheck } from "lucide-react";
import { AuditLogRecord } from "@/services/audit.service";

interface LogDetailsModalProps {
  log: AuditLogRecord;
}

export default function LogDetailsModal({ log }: LogDetailsModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="px-2.5 py-1.5 rounded-lg bg-[#011733] hover:bg-[#011733]/80 text-[#E3DCBE] hover:text-white transition-colors text-xs flex items-center gap-1 ml-auto border border-[#C1801F]/20 font-medium"
      >
        <Eye className="w-3.5 h-3.5 text-[#F5CD67]" />
        <span>Ver JSON</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#000A1B]/85 backdrop-blur-md animate-in fade-in text-left">
          <div className="fixed inset-0" onClick={() => setIsOpen(false)} />
          <div className="relative z-10 w-full max-w-lg max-h-[85vh] flex flex-col bg-[#010F25] border border-[#C1801F]/35 rounded-3xl shadow-2xl overflow-hidden text-[#E3DCBE]">
            <div className="p-5 sm:p-6 border-b border-[#011733] flex items-center justify-between shrink-0 bg-[#010F25]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E5A838]/10 text-[#F5CD67] border border-[#C1801F]/30 flex items-center justify-center">
                  <Code className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Detalhes Auditáveis (JSON)</h2>
                  <p className="text-xs text-[#E3DCBE]/70">Evento #{log.id.substring(0, 8)}</p>
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
              <div className="grid grid-cols-2 gap-3 p-3 bg-[#000A1B] border border-[#011733] rounded-xl font-mono text-[11px]">
                <div>
                  <span className="text-[#E3DCBE]/60 block">Ação:</span>
                  <span className="text-[#F5CD67] font-bold">{log.action}</span>
                </div>
                <div>
                  <span className="text-[#E3DCBE]/60 block">Entidade:</span>
                  <span className="text-cyan-400 font-bold">{log.entityType}</span>
                </div>
                <div>
                  <span className="text-[#E3DCBE]/60 block">Usuário:</span>
                  <span className="text-white">{log.userEmail || "Sistema"}</span>
                </div>
                <div>
                  <span className="text-[#E3DCBE]/60 block">Data/Hora:</span>
                  <span className="text-white">{new Date(log.createdAt).toLocaleString("pt-BR")}</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#E3DCBE]/80 mb-1">Payload de Detalhes:</label>
                <pre className="p-4 bg-[#000A1B] border border-[#011733] rounded-xl font-mono text-[11px] text-[#E3DCBE]/90 overflow-x-auto whitespace-pre-wrap">
                  {log.details ? JSON.stringify(log.details, null, 2) : "Nenhum detalhe adicional fornecido."}
                </pre>
              </div>

              <div className="pt-4 border-t border-[#011733] flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#011733] hover:bg-[#011733]/80 text-[#E3DCBE] font-semibold text-xs"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
