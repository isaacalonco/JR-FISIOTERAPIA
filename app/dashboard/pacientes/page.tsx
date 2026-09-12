import React from "react";
import Link from "next/link";
import { getCurrentUserSession } from "@/lib/auth/rbac";
import { listPatients } from "@/services/patient.service";
import { formatCPF, formatPhone } from "@/utils/formatters";
import {
  Users,
  Search,
  ChevronLeft,
} from "lucide-react";
import { JRLogo } from "@/components/ui/jr-logo";
import PatientFormModal from "./patient-form-modal";

import { redirect } from "next/navigation";

interface PacientesPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function PacientesPage({ searchParams }: PacientesPageProps) {
  const session = await getCurrentUserSession();
  if (!session) redirect("/login");

  const { q } = await searchParams;
  const searchQuery = q || "";
  const { patients, count } = await listPatients(session.profile.tenantId, searchQuery);

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
              <JRLogo size="md" subtitle={`Gestão de Pacientes (${count} registrado${count === 1 ? "" : "s"})`} />
            </div>

            <PatientFormModal />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        {/* Search Bar */}
        <div className="bg-[#010F25]/80 border border-[#C1801F]/30 rounded-2xl p-4 flex items-center gap-3 shadow-lg">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#E5A838]">
              <Search className="w-4 h-4" />
            </div>
            <form method="GET">
              <input
                type="text"
                name="q"
                defaultValue={searchQuery}
                placeholder="Buscar paciente por nome ou CPF..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#000A1B]/80 border border-[#011733] focus:border-[#E5A838] rounded-xl text-[#E3DCBE] placeholder-[#E3DCBE]/40 focus:outline-none text-sm transition-all"
              />
            </form>
          </div>
        </div>

        {/* Patients Table */}
        <div className="bg-[#010F25]/80 border border-[#C1801F]/30 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#000A1B] border-b border-[#011733] text-[#F5CD67] font-semibold uppercase tracking-wider font-mono">
                <tr>
                  <th className="py-3.5 px-4">Nome Completo</th>
                  <th className="py-3.5 px-4">CPF</th>
                  <th className="py-3.5 px-4">Gênero</th>
                  <th className="py-3.5 px-4">Nascimento</th>
                  <th className="py-3.5 px-4">Telefone</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#011733] text-[#E3DCBE]">
                {patients.length > 0 ? (
                  patients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-[#011733]/40 transition-colors">
                      <td className="py-4 px-4 font-semibold text-white">
                        {patient.fullName}
                      </td>
                      <td className="py-4 px-4 font-mono font-medium text-[#F5CD67]">
                        {formatCPF(patient.cpf)}
                      </td>
                      <td className="py-4 px-4 capitalize">{patient.gender}</td>
                      <td className="py-4 px-4 font-mono">{patient.birthDate}</td>
                      <td className="py-4 px-4 font-mono">
                        {formatPhone(patient.phone)}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                            patient.isActive
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                          }`}
                        >
                          {patient.isActive ? "Ativo" : "Inativo"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-[#E3DCBE]/60">
                      Nenhum paciente encontrado para a busca informada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
