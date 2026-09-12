"use client";

import React, { useActionState } from "react";
import Link from "next/link";
import { requestPasswordResetAction } from "@/app/actions/auth.actions";
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, Send } from "lucide-react";
import { JRLogo } from "@/components/ui/jr-logo";

export default function RecoveryPage() {
  const [state, formAction, isPending] = useActionState(requestPasswordResetAction, null);

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[#000A1B] text-[#E3DCBE] overflow-hidden px-4 py-12">
      {/* Background Glows */}
      <div className="absolute top-1/4 -right-32 w-96 h-96 bg-[#E5A838]/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-[#C1801F]/15 rounded-full blur-3xl pointer-events-none animate-pulse delay-1000" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(1,15,37,0.7)_0%,rgba(0,10,27,0.98)_100%)] pointer-events-none" />

      {/* Main Glass Card */}
      <div className="relative w-full max-w-md bg-[#010F25]/85 border border-[#C1801F]/35 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl shadow-[#E5A838]/10">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-xs text-[#E3DCBE]/70 hover:text-[#F5CD67] mb-6 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Voltar para o Login
        </Link>

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <JRLogo size="md" className="mb-3" />
          <h1 className="text-xl font-bold tracking-tight text-white mt-2">
            Recuperação de Acesso
          </h1>
          <p className="text-xs text-[#E3DCBE]/70 mt-1 max-w-xs">
            Informe seu e-mail cadastrado para receber as instruções de redefinição de senha.
          </p>
        </div>

        {/* Feedback Messages */}
        {state?.success && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <span>{state.message}</span>
          </div>
        )}

        {state?.error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <span>{state.error}</span>
          </div>
        )}

        {/* Form */}
        {!state?.success && (
          <form action={formAction} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#E3DCBE]/80">
                E-mail Cadastrado
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#E5A838]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="seu.email@jrsaude.com.br"
                  className="w-full pl-10 pr-4 py-3 bg-[#000A1B]/80 border border-[#011733] focus:border-[#E5A838] rounded-xl text-[#E3DCBE] placeholder-[#E3DCBE]/40 focus:outline-none text-sm transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-[#E5A838] via-[#F5CD67] to-[#C1801F] hover:opacity-95 text-[#000A1B] font-extrabold text-sm rounded-xl shadow-lg shadow-[#E5A838]/20 focus:outline-none transition-all flex items-center justify-center gap-2"
            >
              {isPending ? (
                <div className="w-5 h-5 border-2 border-[#000A1B] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Enviar E-mail de Recuperação</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
