import React from "react";
import Link from "next/link";
import { getCurrentUserSession } from "@/lib/auth/rbac";
import { listServices } from "@/services/catalog.service";
import { formatBRL } from "@/utils/formatters";
import {
  ChevronLeft,
  Clock,
} from "lucide-react";
import { JRLogo } from "@/components/ui/jr-logo";
import ServiceFormModal from "./service-form-modal";

import { redirect } from "next/navigation";

export default async function ServicosPage() {
  const session = await getCurrentUserSession();
  if (!session) redirect("/login");

  const services = await listServices(session.profile.tenantId);

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
              <JRLogo size="md" subtitle="Catálogo de Serviços & Procedimentos" />
            </div>

            <ServiceFormModal />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((item) => (
            <div
              key={item.id}
              className="bg-[#010F25]/80 border border-[#C1801F]/30 rounded-3xl p-6 hover:border-[#E5A838]/60 transition-all flex flex-col justify-between space-y-4 shadow-lg"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#C1801F]/20 text-[#F5CD67] border border-[#C1801F]/40">
                    {item.specialtyName}
                  </span>
                  <div className="flex items-center gap-1 text-[#E3DCBE]/60 text-xs font-mono">
                    <Clock className="w-3.5 h-3.5 text-[#F5CD67]" />
                    <span>{item.durationMinutes} min</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white tracking-tight">{item.name}</h3>
                {item.description && (
                  <p className="text-xs text-[#E3DCBE]/70 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-[#011733] flex items-center justify-between">
                <span className="text-xs text-[#E3DCBE]/60">Valor da Sessão:</span>
                <div className="text-lg font-extrabold text-[#F5CD67] font-mono">
                  {formatBRL(item.price)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
