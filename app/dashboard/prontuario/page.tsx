import React from "react";
import Link from "next/link";
import { getCurrentUserSession } from "@/lib/auth/rbac";
import { listPatients } from "@/services/patient.service";
import { formatCPF } from "@/utils/formatters";
import {
  ChevronLeft,
  Search,
  ChevronRight,
  HeartPulse,
} from "lucide-react";
import { JRLogo } from "@/components/ui/jr-logo";

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
    <main className="min-h-screen bg-[#000A1B] text-[#E3DCBE] pb-16">
      {/* Header */}
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
              <JRLogo size="md" subtitle="Prontuário Eletrônico & Fisioterapia" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        {/* Search */}
        <div className="bg-[#010F25]/80 border border-[#C1801F]/30 rounded-2xl p-4 shadow-lg">
          <form method="GET" className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#E5A838]">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              name="q"
              defaultValue={searchQuery}
              placeholder="Digite o nome ou CPF do paciente para selecionar o prontuário..."
              className="w-full pl-10 pr-4 py-3 bg-[#000A1B]/80 border border-[#011733] focus:border-[#E5A838] rounded-xl text-[#E3DCBE] placeholder-[#E3DCBE]/40 focus:outline-none text-sm transition-all"
            />
          </form>
        </div>

        {/* Patient Selection Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {patients.length > 0 ? (
            patients.map((pt) => (
              <Link key={pt.id} href={`/dashboard/prontuario/${pt.id}`}>
                <div className="bg-[#010F25]/80 border border-[#C1801F]/30 hover:border-[#E5A838]/60 rounded-2xl p-5 transition-all cursor-pointer group flex items-center justify-between shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#E5A838]/10 text-[#F5CD67] border border-[#C1801F]/30 flex items-center justify-center font-bold text-sm group-hover:scale-105 transition-transform">
                      {pt.fullName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-[#F5CD67] transition-colors">
                        {pt.fullName}
                      </h3>
                      <div className="text-xs font-mono text-[#E3DCBE]/70">
                        CPF: {formatCPF(pt.cpf)}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#E3DCBE]/40 group-hover:text-[#F5CD67] transition-colors" />
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-16 text-center bg-[#010F25]/80 border border-[#C1801F]/30 rounded-3xl space-y-3 shadow-xl">
              <HeartPulse className="w-10 h-10 text-[#E5A838] mx-auto opacity-80" />
              <h3 className="text-base font-semibold text-white">Nenhum Paciente Encontrado</h3>
              <p className="text-xs text-[#E3DCBE]/70">
                Altere o termo da busca para selecionar o prontuário desejado.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
