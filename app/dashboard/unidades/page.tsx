import React from "react";
import Link from "next/link";
import { getCurrentUserSession } from "@/lib/auth/rbac";
import { redirect } from "next/navigation";
import { listUnits } from "@/services/unit.service";
import NewUnitModal from "./unit-modal";
import {
  ChevronLeft,
  Building2,
  MapPin,
  Phone,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default async function UnitsDashboardPage() {
  const session = await getCurrentUserSession();
  if (!session) {
    redirect("/login");
  }

  const units = await listUnits(session.profile.tenantId);

  return (
    <main className="min-h-screen bg-[#000A1B] text-[#E3DCBE] pb-16">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-[#010F25]/90 backdrop-blur-md border-b border-[#011733] px-4 sm:px-8 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="p-2 rounded-xl bg-[#011733] hover:bg-[#011733]/80 text-[#E3DCBE] transition-colors flex items-center justify-center border border-[#C1801F]/20"
            title="Voltar ao Dashboard"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#F5CD67]" />
              <h1 className="text-lg font-black text-white tracking-wide">
                Gestão de Filiais & Multiunidades
              </h1>
            </div>
            <p className="text-xs text-[#E3DCBE]/70">
              Gerencie os pontos de atendimento e unidades físicas da clínica.
            </p>
          </div>
        </div>

        <NewUnitModal />
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {units.length === 0 ? (
            <div className="col-span-full p-12 bg-[#010F25] border border-[#011733] rounded-3xl text-center text-[#E3DCBE]/60 space-y-2">
              <Building2 className="w-10 h-10 mx-auto text-[#E3DCBE]/30" />
              <p className="text-sm font-semibold">Nenhuma filial cadastrada.</p>
              <p className="text-xs">Utilize o botão "Nova Unidade / Filial" para adicionar unidades de atendimento.</p>
            </div>
          ) : (
            units.map((u) => (
              <div
                key={u.id}
                className="p-6 rounded-3xl bg-[#010F25] border border-[#011733] hover:border-[#C1801F]/40 transition-all space-y-4 shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#E5A838]/10 text-[#F5CD67] flex items-center justify-center border border-[#C1801F]/30">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">{u.name}</h3>
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                          u.isActive
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : "bg-slate-500/10 text-slate-400 border-slate-500/30"
                        }`}
                      >
                        {u.isActive ? (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            Ativa
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            Inativa
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-[#E3DCBE]/80 pt-2 border-t border-[#011733]">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#F5CD67] shrink-0 mt-0.5" />
                    <span>{u.address || "Endereço não informado"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#F5CD67] shrink-0" />
                    <span>{u.phone || "Telefone não informado"}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
