import React from "react";
import Link from "next/link";
import { getCurrentUserSession } from "@/lib/auth/rbac";
import { listProfessionals } from "@/services/professional.service";
import {
  ChevronLeft,
  Award,
  Percent,
  ShieldAlert,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { JRLogo } from "@/components/ui/jr-logo";

import { redirect } from "next/navigation";

export default async function ProfissionaisPage() {
  const session = await getCurrentUserSession();
  if (!session) redirect("/login");

  const professionals = await listProfessionals(session.profile.tenantId);

  return (
    <main className="min-h-screen bg-[#000A1B] text-[#E3DCBE] pb-16">
      {/* Header Bar */}
      <header className="border-b border-[#011733] bg-[#010F25]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="p-2 rounded-xl bg-[#011733] hover:bg-[#011733]/80 text-[#E3DCBE] transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <JRLogo size="md" subtitle="Profissionais da Saúde & Especialidades" />
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
                className="bg-[#010F25]/80 border-[#C1801F]/30 text-[#E3DCBE] hover:border-[#E5A838]/60 transition-all shadow-lg"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#E5A838]/10 text-[#F5CD67] flex items-center justify-center font-bold text-sm border border-[#C1801F]/30">
                      {prof.fullName.charAt(0)}
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-[#C1801F]/15 text-[#F5CD67] border border-[#C1801F]/40">
                      {prof.councilCode} {prof.councilNumber}/{prof.councilState}
                    </span>
                  </div>
                  <CardTitle className="text-base text-white mt-3">{prof.fullName}</CardTitle>
                  <CardDescription className="text-[#E3DCBE]/70 text-xs flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-[#E5A838]" />
                    <span>{prof.specialtyName}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-xs pt-0">
                  <div className="flex items-center justify-between py-1 border-t border-[#011733]">
                    <span className="text-[#E3DCBE]/60">Taxa de Comissão:</span>
                    <span className="text-[#F5CD67] font-bold flex items-center gap-1">
                      <Percent className="w-3 h-3" /> {prof.commissionRateDefault.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-t border-[#011733]">
                    <span className="text-[#E3DCBE]/60">Contato / E-mail:</span>
                    <span className="text-[#E3DCBE] font-mono text-[11px] truncate max-w-[160px]">
                      {prof.email}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full py-16 text-center bg-[#010F25]/80 border border-[#C1801F]/30 rounded-3xl space-y-3 shadow-xl">
              <ShieldAlert className="w-10 h-10 text-[#E5A838] mx-auto opacity-80" />
              <h3 className="text-base font-semibold text-white">Nenhum Profissional Registrado</h3>
              <p className="text-xs text-[#E3DCBE]/70 max-w-sm mx-auto">
                Para vincular profissionais, cadastre o usuário em `profiles` e associe seu número de conselho regional (CREFITO/CRM/CRP).
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
