import React from "react";
import Link from "next/link";
import { getCurrentUserSession } from "@/lib/auth/rbac";
import { listProfessionals } from "@/services/professional.service";
import {
  Stethoscope,
  ChevronLeft,
  Award,
  Percent,
  CheckCircle2,
  Mail,
  ShieldAlert,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

import { redirect } from "next/navigation";

export default async function ProfissionaisPage() {
  const session = await getCurrentUserSession();
  if (!session) redirect("/login");

  const professionals = await listProfessionals(session.profile.tenantId);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      {/* Header Bar */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-lg font-bold text-white flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-emerald-400" />
                  Profissionais da Saúde & Especialidades
                </h1>
                <span className="text-xs text-slate-400">
                  Corpo clínico e especialidades multidisciplinares
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {professionals.length > 0 ? (
            professionals.map((prof) => (
              <Card
                key={prof.id}
                className="bg-slate-900/60 border-slate-800 text-slate-100 hover:border-emerald-500/50 transition-all"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm">
                      {prof.fullName.charAt(0)}
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {prof.councilCode} {prof.councilNumber}/{prof.councilState}
                    </span>
                  </div>
                  <CardTitle className="text-base text-white mt-3">{prof.fullName}</CardTitle>
                  <CardDescription className="text-slate-400 text-xs flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{prof.specialtyName}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-xs pt-0">
                  <div className="flex items-center justify-between py-1 border-t border-slate-800/60">
                    <span className="text-slate-500">Taxa de Comissão:</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <Percent className="w-3 h-3" /> {prof.commissionRateDefault.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-t border-slate-800/60">
                    <span className="text-slate-500">Contato / E-mail:</span>
                    <span className="text-slate-300 font-mono text-[11px] truncate max-w-[160px]">
                      {prof.email}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full py-16 text-center bg-slate-900/40 border border-slate-800 rounded-3xl space-y-3">
              <ShieldAlert className="w-10 h-10 text-amber-400 mx-auto opacity-80" />
              <h3 className="text-base font-semibold text-white">Nenhum Profissional Registrado</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Para vincular profissionais, cadastre o usuário em `profiles` e associe seu número de conselho regional (CREFITO/CRM/CRP).
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
