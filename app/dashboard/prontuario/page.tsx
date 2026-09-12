import React from "react";
import Link from "next/link";
import { getCurrentUserSession } from "@/lib/auth/rbac";
import { listPatients } from "@/services/patient.service";
import { formatCPF, formatPhone } from "@/utils/formatters";
import {
  FileText,
  ChevronLeft,
  Search,
  UserCheck,
  ChevronRight,
  Activity,
  HeartPulse,
} from "lucide-react";

import { redirect } from "next/navigation";

interface ProntuarioSelectorProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function ProntuarioSelectorPage({ searchParams }: ProntuarioSelectorProps) {
  const session = await getCurrentUserSession();
  if (!session) redirect("/login");

  const { q } = await searchParams;
  const searchQuery = q || "";
  const { patients } = await listPatients(session.profile.tenantId, searchQuery, 50);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      {/* Header */}
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
                  <FileText className="w-5 h-5 text-cyan-400" />
                  Prontuário Eletrônico & Fisioterapia
                </h1>
                <span className="text-xs text-slate-400">
                  Selecione um paciente para abrir o prontuário e histórico clínico
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        {/* Search */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
          <form method="GET" className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              name="q"
              defaultValue={searchQuery}
              placeholder="Digite o nome ou CPF do paciente..."
              className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 text-sm"
            />
          </form>
        </div>

        {/* Patient Selection Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {patients.length > 0 ? (
            patients.map((pt) => (
              <Link key={pt.id} href={`/dashboard/prontuario/${pt.id}`}>
                <div className="bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-5 transition-all cursor-pointer group flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center font-bold text-sm group-hover:scale-105 transition-transform">
                      {pt.fullName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                        {pt.fullName}
                      </h3>
                      <div className="text-xs font-mono text-slate-400">
                        CPF: {formatCPF(pt.cpf)}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-16 text-center bg-slate-900/40 border border-slate-800 rounded-3xl space-y-3">
              <HeartPulse className="w-10 h-10 text-cyan-400 mx-auto opacity-80" />
              <h3 className="text-base font-semibold text-white">Nenhum Paciente Encontrado</h3>
              <p className="text-xs text-slate-400">
                Altere o termo da busca para selecionar o prontuário desejado.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
