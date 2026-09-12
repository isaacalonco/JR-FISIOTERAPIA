import React from "react";
import Link from "next/link";
import { processWhatsAppConfirmationToken } from "@/services/whatsapp.service";
import { CheckCircle2, XCircle, Calendar, ArrowRight, ShieldCheck } from "lucide-react";
import { JRLogo } from "@/components/ui/jr-logo";

interface ConfirmPageProps {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ action?: string; reason?: string }>;
}

export default async function WhatsAppConfirmPage({ params, searchParams }: ConfirmPageProps) {
  const { token } = await params;
  const { action, reason } = await searchParams;

  const targetAction = (action === "CANCEL" ? "CANCEL" : "CONFIRM") as "CONFIRM" | "CANCEL";

  const result = await processWhatsAppConfirmationToken(token, targetAction, reason);

  return (
    <div className="min-h-screen bg-[#000A1B] text-[#E3DCBE] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#C1801F]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md bg-[#010F25] border border-[#C1801F]/35 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 text-center space-y-6">
        <div className="flex justify-center">
          <JRLogo size="lg" />
        </div>

        {result.success ? (
          <div className="space-y-4 animate-in fade-in">
            {targetAction === "CONFIRM" ? (
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-10 h-10" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
                <XCircle className="w-10 h-10" />
              </div>
            )}

            <div className="space-y-1">
              <h1 className="text-xl font-extrabold text-white">
                {targetAction === "CONFIRM" ? "Consulta Confirmada!" : "Solicitação Recebida"}
              </h1>
              <p className="text-xs text-[#E3DCBE]/70">{result.message}</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#000A1B]/80 border border-[#011733] text-left text-xs space-y-2">
              <div className="flex items-center gap-2 text-[#F5CD67] font-semibold">
                <Calendar className="w-4 h-4 shrink-0" />
                <span>Atualização de Status na Agenda</span>
              </div>
              <p className="text-[#E3DCBE]/80">
                {targetAction === "CONFIRM"
                  ? "Sua vaga na agenda médica foi garantida. Nossa equipe médica e recepção aguardam sua chegada no horário agendado!"
                  : "Aviso enviado para a recepção. Entraremos em contato via WhatsApp para sugerir novos horários disponíveis."}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto">
              <XCircle className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h1 className="text-xl font-extrabold text-white">Link Inválido ou Expirado</h1>
              <p className="text-xs text-rose-300/80">{result.message}</p>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-[#011733] flex items-center justify-between text-[11px] text-[#E3DCBE]/50">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#E5A838]" />
            JR FISIOTERAPIA 1.0
          </span>
          <span>WhatsApp Secure Confirm</span>
        </div>
      </div>
    </div>
  );
}
