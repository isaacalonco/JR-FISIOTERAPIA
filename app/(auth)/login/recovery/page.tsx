"use client";

import React, { useActionState } from "react";
import Link from "next/link";
import { requestPasswordResetAction } from "@/app/actions/auth.actions";
import { Activity, Mail, ArrowLeft, CheckCircle2, AlertCircle, Send } from "lucide-react";

export default function RecoveryPage() {
  const [state, formAction, isPending] = useActionState(requestPasswordResetAction, null);

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-slate-950 text-slate-100 overflow-hidden px-4 py-12">
      {/* Background Glows */}
      <div className="absolute top-1/4 -right-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none animate-pulse delay-1000" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(15,23,42,0.6)_0%,rgba(2,6,23,0.95)_100%)] pointer-events-none" />

      {/* Main Glass Card */}
      <div className="relative w-full max-w-md bg-slate-900/70 border border-slate-800/80 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl shadow-cyan-950/30">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-cyan-400 mb-6 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Voltar para o Login
        </Link>

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-400 p-0.5 shadow-lg shadow-cyan-500/20 mb-4">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Activity className="w-7 h-7 text-cyan-400" />
            </div>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Recuperação de Acesso
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
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
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                E-mail Cadastrado
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="seu.email@jrsaude.com.br"
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-semibold text-sm rounded-xl shadow-lg shadow-cyan-500/20 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all flex items-center justify-center gap-2"
            >
              {isPending ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
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
