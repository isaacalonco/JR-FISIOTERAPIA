import React from "react";
import Link from "next/link";
import { getCurrentUserSession } from "@/lib/auth/rbac";
import { logoutAction } from "@/app/actions/auth.actions";
import { getDashboardKPIs } from "@/services/dashboard.service";
import {
  Users,
  Stethoscope,
  BookOpen,
  Calendar,
  LogOut,
  UserCheck,
  ChevronRight,
  Crown,
  DollarSign,
  FileText,
} from "lucide-react";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { JRLogo } from "@/components/ui/jr-logo";

export default async function DashboardPage() {
  const session = await getCurrentUserSession();

  if (!session) {
    redirect("/login");
  }

  const { profile, activeRole } = session;
  const kpis = await getDashboardKPIs(profile.tenantId);

  return (
    <main className="min-h-screen bg-[#000A1B] text-[#E3DCBE] pb-16">
      {/* Navbar */}
      <header className="border-b border-[#011733] bg-[#010F25]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/dashboard">
                <JRLogo size="md" />
              </Link>

              {/* Module Nav Links */}
              <nav className="hidden md:flex items-center gap-1 text-xs font-medium text-[#E3DCBE]/70">
                <Link
                  href="/dashboard"
                  className="px-3 py-1.5 rounded-lg bg-[#011733] text-[#F5CD67] font-semibold border border-[#C1801F]/30"
                >
                  Visão Geral
                </Link>
                <Link
                  href="/dashboard/agenda"
                  className="px-3 py-1.5 rounded-lg hover:text-[#E3DCBE] hover:bg-[#011733]/60 transition-colors"
                >
                  Agenda
                </Link>
                <Link
                  href="/dashboard/prontuario"
                  className="px-3 py-1.5 rounded-lg hover:text-[#E3DCBE] hover:bg-[#011733]/60 transition-colors"
                >
                  Prontuários
                </Link>
                <Link
                  href="/dashboard/financeiro"
                  className="px-3 py-1.5 rounded-lg hover:text-[#E3DCBE] hover:bg-[#011733]/60 transition-colors"
                >
                  Financeiro
                </Link>
                <Link
                  href="/dashboard/pacientes"
                  className="px-3 py-1.5 rounded-lg hover:text-[#E3DCBE] hover:bg-[#011733]/60 transition-colors"
                >
                  Pacientes
                </Link>
                <Link
                  href="/dashboard/profissionais"
                  className="px-3 py-1.5 rounded-lg hover:text-[#E3DCBE] hover:bg-[#011733]/60 transition-colors"
                >
                  Profissionais
                </Link>
                <Link
                  href="/dashboard/servicos"
                  className="px-3 py-1.5 rounded-lg hover:text-[#E3DCBE] hover:bg-[#011733]/60 transition-colors"
                >
                  Serviços
                </Link>
                <Link
                  href="/dashboard/club"
                  className="px-3 py-1.5 rounded-lg text-[#F5CD67] hover:text-[#E5A838] hover:bg-[#011733]/60 transition-colors font-bold flex items-center gap-1"
                >
                  <Crown className="w-3.5 h-3.5" />
                  JR Club
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-[#011733]/60 border border-[#C1801F]/30">
                <div className="w-8 h-8 rounded-full bg-[#E5A838]/20 text-[#F5CD67] flex items-center justify-center font-bold text-xs border border-[#C1801F]/40">
                  {profile.fullName.charAt(0)}
                </div>
                <div className="text-left">
                  <div className="text-xs font-semibold text-white">{profile.fullName}</div>
                  <div className="text-[10px] text-[#F5CD67] font-mono">{activeRole}</div>
                </div>
              </div>

              <form action={logoutAction}>
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-xl bg-[#011733] hover:bg-rose-500/10 hover:border-rose-500/30 border border-[#011733] text-[#E3DCBE]/80 hover:text-rose-400 text-xs font-medium transition-all flex items-center gap-2"
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
        <div className="rounded-3xl bg-gradient-to-r from-[#010F25] via-[#010F25] to-[#011733] p-6 sm:p-8 border border-[#C1801F]/30 shadow-2xl shadow-[#E5A838]/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#E5A838]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#E5A838]/10 text-[#F5CD67] border border-[#C1801F]/30">
              <UserCheck className="w-3.5 h-3.5" />
              Ambiente Operacional Ativo • JR FISIOTERAPIA 1.0
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Painel de Gestão da Clínica
            </h2>
            <p className="text-[#E3DCBE]/70 text-sm leading-relaxed">
              Bem-vindo(a), <span className="text-gold-gradient font-bold">{profile.fullName}</span>. Acompanhe os indicadores integrados de pacientes, consultas, prontuários multidisciplinares e saúde financeira.
            </p>
          </div>
        </div>

        {/* Live KPIs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* KPI 1: Pacientes */}
          <Link href="/dashboard/pacientes">
            <Card className="bg-[#010F25]/80 border-[#C1801F]/25 hover:border-[#E5A838]/60 transition-all cursor-pointer group shadow-lg">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#E3DCBE]/60 font-medium">Pacientes Cadastrados</span>
                  <div className="text-3xl font-extrabold text-white mt-1 group-hover:text-[#F5CD67] transition-colors">
                    {kpis.totalPatients}
                  </div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#E5A838]/10 text-[#E5A838] flex items-center justify-center border border-[#C1801F]/30">
                  <Users className="w-6 h-6" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* KPI 2: Profissionais */}
          <Link href="/dashboard/profissionais">
            <Card className="bg-[#010F25]/80 border-[#C1801F]/25 hover:border-[#E5A838]/60 transition-all cursor-pointer group shadow-lg">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#E3DCBE]/60 font-medium">Profissionais da Saúde</span>
                  <div className="text-3xl font-extrabold text-white mt-1 group-hover:text-[#F5CD67] transition-colors">
                    {kpis.totalProfessionals}
                  </div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#F5CD67]/10 text-[#F5CD67] flex items-center justify-center border border-[#C1801F]/30">
                  <Stethoscope className="w-6 h-6" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* KPI 3: Serviços */}
          <Link href="/dashboard/servicos">
            <Card className="bg-[#010F25]/80 border-[#C1801F]/25 hover:border-[#E5A838]/60 transition-all cursor-pointer group shadow-lg">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#E3DCBE]/60 font-medium">Procedimentos / Serviços</span>
                  <div className="text-3xl font-extrabold text-white mt-1 group-hover:text-[#F5CD67] transition-colors">
                    {kpis.totalServices}
                  </div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#C1801F]/15 text-[#E5A838] flex items-center justify-center border border-[#C1801F]/30">
                  <BookOpen className="w-6 h-6" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* KPI 4: Consultas */}
          <Link href="/dashboard/agenda">
            <Card className="bg-[#010F25]/80 border-[#C1801F]/25 hover:border-[#E5A838]/60 transition-all cursor-pointer group shadow-lg">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#E3DCBE]/60 font-medium">Consultas Agendadas</span>
                  <div className="text-3xl font-extrabold text-white mt-1 group-hover:text-[#F5CD67] transition-colors">
                    {kpis.totalAppointments}
                  </div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#E5A838]/10 text-[#F5CD67] flex items-center justify-center border border-[#C1801F]/30">
                  <Calendar className="w-6 h-6" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Quick Access Modules Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Agenda & Consultas */}
          <Card className="bg-[#010F25]/80 border-[#C1801F]/25 hover:bg-[#010F25] transition-all shadow-lg">
            <CardHeader>
              <div className="w-10 h-10 rounded-xl bg-[#E5A838]/10 text-[#E5A838] flex items-center justify-center mb-2 border border-[#C1801F]/30">
                <Calendar className="w-5 h-5" />
              </div>
              <CardTitle className="text-base text-white">Agenda Multidisciplinar</CardTitle>
              <CardDescription className="text-[#E3DCBE]/60 text-xs">
                Visualização de horários, salas, profissionais e prevenção de conflitos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/dashboard/agenda"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#F5CD67] hover:text-[#E5A838] transition-colors"
              >
                <span>Acessar Agenda Médica</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </CardContent>
          </Card>

          {/* Prontuário Eletrônico */}
          <Card className="bg-[#010F25]/80 border-[#C1801F]/25 hover:bg-[#010F25] transition-all shadow-lg">
            <CardHeader>
              <div className="w-10 h-10 rounded-xl bg-[#E5A838]/10 text-[#F5CD67] flex items-center justify-center mb-2 border border-[#C1801F]/30">
                <FileText className="w-5 h-5" />
              </div>
              <CardTitle className="text-base text-white">Prontuário & Fisioterapia</CardTitle>
              <CardDescription className="text-[#E3DCBE]/60 text-xs">
                Avaliações postural/biomecânica, evoluções diárias SOAP e laudos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/dashboard/prontuario"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#F5CD67] hover:text-[#E5A838] transition-colors"
              >
                <span>Abrir Prontuários</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </CardContent>
          </Card>

          {/* Gestão Financeira */}
          <Card className="bg-[#010F25]/80 border-[#C1801F]/25 hover:bg-[#010F25] transition-all shadow-lg">
            <CardHeader>
              <div className="w-10 h-10 rounded-xl bg-[#E5A838]/10 text-[#E5A838] flex items-center justify-center mb-2 border border-[#C1801F]/30">
                <DollarSign className="w-5 h-5" />
              </div>
              <CardTitle className="text-base text-white">Gestão Financeira & Repasses</CardTitle>
              <CardDescription className="text-[#E3DCBE]/60 text-xs">
                Contas a pagar/receber, baixas, fluxo de caixa e repasses a profissionais.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/dashboard/financeiro"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#F5CD67] hover:text-[#E5A838] transition-colors"
              >
                <span>Acessar Financeiro</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
