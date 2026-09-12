import React from "react";
import Link from "next/link";
import { getCurrentUserSession } from "@/lib/auth/rbac";
import { logoutAction } from "@/app/actions/auth.actions";
import { getDashboardKPIs } from "@/services/dashboard.service";
import {
  Activity,
  Users,
  Stethoscope,
  BookOpen,
  Calendar,
  LogOut,
  UserCheck,
  Building,
  ShieldCheck,
  Key,
  ChevronRight,
  Plus,
} from "lucide-react";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default async function DashboardPage() {
  const session = await getCurrentUserSession();

  if (!session) {
    redirect("/login");
  }

  const { profile, activeRole, permissions } = session;
  const kpis = await getDashboardKPIs(profile.tenantId);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      {/* Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/dashboard" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 p-0.5 shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                  <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                    <Activity className="w-5 h-5 text-cyan-400" />
                  </div>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white leading-none">JR SAÚDE</h1>
                  <span className="text-xs text-slate-400">Painel Operacional</span>
                </div>
              </Link>

              {/* Module Nav Links */}
              <nav className="hidden md:flex items-center gap-1 text-xs font-medium text-slate-400">
                <Link
                  href="/dashboard"
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-white font-semibold"
                >
                  Visão Geral
                </Link>
                <Link
                  href="/dashboard/agenda"
                  className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-800/60 transition-colors"
                >
                  Agenda
                </Link>
                <Link
                  href="/dashboard/prontuario"
                  className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-800/60 transition-colors"
                >
                  Prontuários
                </Link>
                <Link
                  href="/dashboard/financeiro"
                  className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-800/60 transition-colors"
                >
                  Financeiro
                </Link>
                <Link
                  href="/dashboard/pacientes"
                  className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-800/60 transition-colors"
                >
                  Pacientes
                </Link>
                <Link
                  href="/dashboard/profissionais"
                  className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-800/60 transition-colors"
                >
                  Profissionais
                </Link>
                <Link
                  href="/dashboard/servicos"
                  className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-800/60 transition-colors"
                >
                  Catálogo de Serviços
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
                  {profile.fullName.charAt(0)}
                </div>
                <div className="text-left">
                  <div className="text-xs font-semibold text-white">{profile.fullName}</div>
                  <div className="text-[10px] text-cyan-400 font-mono">{activeRole}</div>
                </div>
              </div>

              <form action={logoutAction}>
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-rose-500/10 hover:border-rose-500/30 border border-slate-700 text-slate-300 hover:text-rose-400 text-xs font-medium transition-all flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sair</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        {/* Welcome Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 p-6 sm:p-8 border border-slate-800/80 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <UserCheck className="w-3.5 h-3.5" />
              Sessão Autenticada • FASE 3 Ativa
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Painel de Gestão da Clínica
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Bem-vindo(a), <span className="text-cyan-400 font-semibold">{profile.fullName}</span>. Acompanhe os principais indicadores de pacientes, profissionais da saúde e catálogo de serviços da unidade.
            </p>
          </div>
        </div>

        {/* Live KPIs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* KPI 1: Pacientes */}
          <Link href="/dashboard/pacientes">
            <Card className="bg-slate-900/60 border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer group">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 font-medium">Pacientes Cadastrados</span>
                  <div className="text-3xl font-extrabold text-white mt-1 group-hover:text-cyan-400 transition-colors">
                    {kpis.totalPatients}
                  </div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                  <Users className="w-6 h-6" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* KPI 2: Profissionais */}
          <Link href="/dashboard/profissionais">
            <Card className="bg-slate-900/60 border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer group">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 font-medium">Profissionais da Saúde</span>
                  <div className="text-3xl font-extrabold text-white mt-1 group-hover:text-emerald-400 transition-colors">
                    {kpis.totalProfessionals}
                  </div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                  <Stethoscope className="w-6 h-6" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* KPI 3: Serviços */}
          <Link href="/dashboard/servicos">
            <Card className="bg-slate-900/60 border-slate-800 hover:border-amber-500/50 transition-all cursor-pointer group">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 font-medium">Catálogo de Serviços</span>
                  <div className="text-3xl font-extrabold text-white mt-1 group-hover:text-amber-400 transition-colors">
                    {kpis.totalServices}
                  </div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                  <BookOpen className="w-6 h-6" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* KPI 4: Consultas */}
          <Card className="bg-slate-900/60 border-slate-800">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-medium">Total de Consultas</span>
                <div className="text-3xl font-extrabold text-white mt-1">
                  {kpis.totalAppointments}
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                <Calendar className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Access Modules Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pacientes Quick Access */}
          <Card className="bg-slate-900/60 border-slate-800 hover:bg-slate-900/90 transition-all">
            <CardHeader>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-2">
                <Users className="w-5 h-5" />
              </div>
              <CardTitle className="text-base text-white">Módulo de Pacientes</CardTitle>
              <CardDescription className="text-slate-400 text-xs">
                Cadastro com validação de CPF, dados de contato e ficha do paciente.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/dashboard/pacientes"
                className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <span>Acessar Gestão de Pacientes</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </CardContent>
          </Card>

          {/* Profissionais Quick Access */}
          <Card className="bg-slate-900/60 border-slate-800 hover:bg-slate-900/90 transition-all">
            <CardHeader>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2">
                <Stethoscope className="w-5 h-5" />
              </div>
              <CardTitle className="text-base text-white">Profissionais & Especialidades</CardTitle>
              <CardDescription className="text-slate-400 text-xs">
                Registro de conselhos (CREFITO, CRM, CRP) e taxas de comissão.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/dashboard/profissionais"
                className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <span>Ver Lista de Profissionais</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </CardContent>
          </Card>

          {/* Serviços Quick Access */}
          <Card className="bg-slate-900/60 border-slate-800 hover:bg-slate-900/90 transition-all">
            <CardHeader>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-2">
                <BookOpen className="w-5 h-5" />
              </div>
              <CardTitle className="text-base text-white">Catálogo de Procedimentos</CardTitle>
              <CardDescription className="text-slate-400 text-xs">
                Gestão de preços em BRL, especialidades e tempo estimado de sessão.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/dashboard/servicos"
                className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
              >
                <span>Gerenciar Catálogo</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
