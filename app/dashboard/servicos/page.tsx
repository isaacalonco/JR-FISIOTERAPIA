import React from "react";
import Link from "next/link";
import { getCurrentUserSession } from "@/lib/auth/rbac";
import { listServices } from "@/services/catalog.service";
import { formatBRL } from "@/utils/formatters";
import {
  BookOpen,
  ChevronLeft,
  Clock,
  DollarSign,
  Tag,
  Sparkles,
} from "lucide-react";
import ServiceFormModal from "./service-form-modal";

import { redirect } from "next/navigation";

export default async function ServicosPage() {
  const session = await getCurrentUserSession();
  if (!session) redirect("/login");

  const services = await listServices(session.profile.tenantId);

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
                  <BookOpen className="w-5 h-5 text-amber-400" />
                  Catálogo de Serviços & Procedimentos
                </h1>
                <span className="text-xs text-slate-400">
                  Tabela de procedimentos clínicos e valores padrão
                </span>
              </div>
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
              className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 hover:border-amber-500/50 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {item.specialtyName}
                  </span>
                  <div className="flex items-center gap-1 text-slate-400 text-xs font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{item.durationMinutes} min</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white tracking-tight">{item.name}</h3>
                {item.description && (
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-500">Valor da Sessão:</span>
                <div className="text-lg font-extrabold text-amber-400 font-mono">
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
