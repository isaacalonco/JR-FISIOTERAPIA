import React from "react";
import Link from "next/link";
import { getCurrentUserSession } from "@/lib/auth/rbac";
import { listPatients } from "@/services/patient.service";
import { formatCPF, formatPhone } from "@/utils/formatters";
import {
  Activity,
  Users,
  Search,
  Plus,
  UserCheck,
  Phone,
  Mail,
  Calendar,
  ShieldCheck,
  ChevronLeft,
} from "lucide-react";
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
                  <Users className="w-5 h-5 text-cyan-400" />
                  Gestão de Pacientes
                </h1>
                <span className="text-xs text-slate-400">
                  {count} paciente{count === 1 ? "" : "s"} registrado{count === 1 ? "" : "s"}
                </span>
              </div>
            </div>

            <PatientFormModal />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        {/* Search Bar */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Search className="w-4 h-4" />
            </div>
            <form method="GET">
              <input
                type="text"
                name="q"
                defaultValue={searchQuery}
                placeholder="Buscar paciente por nome ou CPF..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
              />
            </form>
          </div>
        </div>

        {/* Patients Table */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Nome Completo</th>
                  <th className="py-3.5 px-4">CPF</th>
                  <th className="py-3.5 px-4">Gênero</th>
                  <th className="py-3.5 px-4">Nascimento</th>
                  <th className="py-3.5 px-4">Telefone</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {patients.length > 0 ? (
                  patients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 px-4 font-semibold text-white flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center font-bold text-xs shrink-0">
                          {patient.fullName.charAt(0)}
                        </div>
                        <div>
                          <div>{patient.fullName}</div>
                          {patient.email && (
                            <div className="text-[10px] text-slate-400 font-normal">
                              {patient.email}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 font-mono text-slate-300">
                        {formatCPF(patient.cpf)}
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300">
                          {patient.gender}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-300">
                        {patient.birthDate}
                      </td>
                      <td className="py-4 px-4 text-slate-300 font-mono">
                        {formatPhone(patient.phone)}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {patient.isActive ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Ativo
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            Inativo
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500 text-sm">
                      Nenhum paciente encontrado para os critérios informados.
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
