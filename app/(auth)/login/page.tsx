"use client";

import React, { useActionState, useState } from "react";
import Link from "next/link";
import { loginAction } from "@/app/actions/auth.actions";
import { Lock, Mail, Eye, EyeOff, ShieldCheck, AlertCircle, ArrowRight } from "lucide-react";
import { JRLogo } from "@/components/ui/jr-logo";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[#000A1B] text-[#E3DCBE] overflow-hidden px-4 py-12">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#E5A838]/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#C1801F]/15 rounded-full blur-3xl pointer-events-none animate-pulse delay-1000" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(1,15,37,0.7)_0%,rgba(0,10,27,0.98)_100%)] pointer-events-none" />

      {/* Main Glass Card */}
      <div className="relative w-full max-w-md bg-[#010F25]/85 border border-[#C1801F]/35 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl shadow-[#E5A838]/10 transition-all duration-300">
        {/* Header / Official Brand Logo */}
        <div className="flex flex-col items-center text-center mb-8">
          <JRLogo size="lg" className="mb-2" />
        </div>

        {/* Error Alert */}
        {state?.error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <span>{state.error}</span>
          </div>
        )}

        {/* Form */}
        <form action={formAction} className="space-y-5">
          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#E3DCBE]/80">
              E-mail Profissional
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

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#E3DCBE]/80">
                Senha de Acesso
              </label>
              <Link
                href="/login/recovery"
                className="text-xs text-[#F5CD67] hover:text-[#E5A838] transition-colors"
              >
                Esqueceu a senha?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#E5A838]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-3 bg-[#000A1B]/80 border border-[#011733] focus:border-[#E5A838] rounded-xl text-[#E3DCBE] placeholder-[#E3DCBE]/40 focus:outline-none text-sm transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#E3DCBE]/50 hover:text-[#E3DCBE] transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs text-[#E3DCBE]/70 hover:text-[#E3DCBE] transition-colors">
              <input
                type="checkbox"
                name="rememberMe"
                className="w-4 h-4 rounded border-[#011733] bg-[#000A1B] text-[#E5A838] focus:ring-[#E5A838] cursor-pointer"
              />
              Lembrar deste dispositivo
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-[#E5A838] via-[#F5CD67] to-[#C1801F] hover:opacity-95 text-[#000A1B] font-extrabold text-sm rounded-xl shadow-lg shadow-[#E5A838]/20 focus:outline-none transition-all transform active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
          >
            {isPending ? (
              <div className="w-5 h-5 border-2 border-[#000A1B] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Acessar o Sistema JR SAÚDE</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-8 pt-6 border-t border-[#011733] flex items-center justify-between text-xs text-[#E3DCBE]/60">
          <div className="flex items-center gap-1.5 text-[#F5CD67]">
            <ShieldCheck className="w-4 h-4" />
            <span>Conexão Segura 256-bit</span>
          </div>
          <span>RLS & RBAC Habilitados</span>
        </div>
      </div>
    </div>
  );
}
