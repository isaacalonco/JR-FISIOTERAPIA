"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { JRLogo } from "@/components/ui/jr-logo";
import { logoutAction } from "@/app/actions/auth.actions";
import {
  LayoutDashboard,
  Calendar,
  FileText,
  DollarSign,
  Users,
  Stethoscope,
  BookOpen,
  Crown,
  MessageSquare,
  LogOut,
  Menu,
  X,
  UserCheck,
} from "lucide-react";

interface SidebarProps {
  userProfile: {
    fullName: string;
    email: string;
    role: string;
  };
}

export function Sidebar({ userProfile }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    {
      label: "Visão Geral",
      href: "/dashboard",
      icon: LayoutDashboard,
      highlight: false,
    },
    {
      label: "Agenda Médica",
      href: "/dashboard/agenda",
      icon: Calendar,
      highlight: false,
    },
    {
      label: "Prontuários & SOAP",
      href: "/dashboard/prontuario",
      icon: FileText,
      highlight: false,
    },
    {
      label: "Gestão Financeira",
      href: "/dashboard/financeiro",
      icon: DollarSign,
      highlight: false,
    },
    {
      label: "Pacientes",
      href: "/dashboard/pacientes",
      icon: Users,
      highlight: false,
    },
    {
      label: "Equipe Profissional",
      href: "/dashboard/profissionais",
      icon: Stethoscope,
      highlight: false,
    },
    {
      label: "Catálogo de Serviços",
      href: "/dashboard/servicos",
      icon: BookOpen,
      highlight: false,
    },
    {
      label: "JR Club (Recorrência)",
      href: "/dashboard/club",
      icon: Crown,
      highlight: "gold",
    },
    {
      label: "WhatsApp Business",
      href: "/dashboard/whatsapp",
      icon: MessageSquare,
      highlight: "emerald",
    },
  ];

  return (
    <>
      {/* Top Mobile Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#010F25]/95 backdrop-blur-md border-b border-[#011733] px-4 py-3 flex items-center justify-between">
        <Link href="/dashboard">
          <JRLogo size="sm" />
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl bg-[#011733] text-[#E3DCBE] hover:text-white border border-[#C1801F]/20"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Backdrop for Mobile */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-[#000A1B]/80 backdrop-blur-sm animate-in fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Desktop Vertical Sidebar & Mobile Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#010F25] border-r border-[#011733] flex flex-col justify-between transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header Section */}
        <div className="p-5 border-b border-[#011733] flex items-center justify-between">
          <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
            <JRLogo size="md" />
          </Link>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1.5 scrollbar-thin">
          <p className="px-3 text-[10px] uppercase font-bold text-[#E3DCBE]/50 tracking-wider mb-2">
            Módulos do Sistema
          </p>

          {navItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            const Icon = item.icon;

            let styleClass =
              "text-[#E3DCBE]/70 hover:text-white hover:bg-[#011733]/70 border-transparent";
            if (isActive) {
              styleClass =
                "bg-[#011733] text-[#F5CD67] font-extrabold border-[#C1801F]/50 shadow-md shadow-[#C1801F]/10";
            } else if (item.highlight === "gold") {
              styleClass =
                "text-[#F5CD67] bg-[#E5A838]/10 hover:bg-[#E5A838]/20 border-[#C1801F]/30 font-bold";
            } else if (item.highlight === "emerald") {
              styleClass =
                "text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30 font-bold";
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all border ${styleClass}`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#F5CD67]" : ""}`} />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Bottom User Profile Section */}
        <div className="p-4 border-t border-[#011733] bg-[#000A1B]/60 space-y-3">
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-9 h-9 rounded-xl bg-[#E5A838]/20 text-[#F5CD67] flex items-center justify-center font-bold text-xs border border-[#C1801F]/40 shrink-0">
              {userProfile.fullName.charAt(0)}
            </div>
            <div className="overflow-hidden text-left flex-1">
              <div className="text-xs font-bold text-white truncate">
                {userProfile.fullName}
              </div>
              <div className="text-[10px] text-[#F5CD67] font-mono truncate">
                {userProfile.role}
              </div>
            </div>
          </div>

          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full px-3 py-2 rounded-xl bg-[#011733] hover:bg-rose-500/10 hover:border-rose-500/30 border border-[#011733] text-[#E3DCBE]/80 hover:text-rose-400 text-xs font-semibold transition-all flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair do Sistema</span>
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
