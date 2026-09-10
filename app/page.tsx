import React from "react";
import {
  ShieldCheck,
  Database,
  Users,
  Activity,
  Calendar,
  CreditCard,
  Scale,
  Sparkles,
  Layers,
  CheckCircle2,
  Lock,
  Building2,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50/50 pb-16">
      {/* Top Notification Bar */}
      <div className="bg-sky-900 text-sky-100 text-xs py-2 px-4 border-b border-sky-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Sistema JR SAÚDE 1.0 &bull; Ambiente Operacional Ativo</span>
          </div>
          <div className="flex items-center gap-4 text-sky-200">
            <span>Next.js 15 App Router</span>
            <span>&bull;</span>
            <span>TypeScript Estrito</span>
            <span>&bull;</span>
            <span>PostgreSQL / Supabase RLS</span>
          </div>
        </div>
      </div>

      {/* Hero Header */}
      <header className="bg-white border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white font-bold text-2xl shadow-md shadow-sky-500/20">
                  JR
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                    JR SAÚDE
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 border border-sky-200">
                      v1.0.0
                    </span>
                  </h1>
                  <p className="text-sm text-slate-500 mt-0.5">
                    Sistema de Gestão Clínica, Fisioterapia & Prontuário Multidisciplinar
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="success">
                <CheckCircle2 className="w-3.5 h-3.5" />
                FASE 1 Concluída
              </Badge>
              <Badge variant="default">
                <Building2 className="w-3.5 h-3.5" />
                Multiunidade Pronto
              </Badge>
              <Badge variant="outline">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                LGPD & RLS Habilitado
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Status Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-sky-600 via-sky-700 to-teal-700 p-6 sm:p-8 text-white shadow-lg shadow-sky-900/10 mb-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 text-sky-100 backdrop-blur-sm border border-white/20 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Arquitetura de Engenharia Estabelecida
            </span>
            <h2 className="text-xl sm:text-2xl font-bold mb-2">
              Fundação de Alta Performance e Isolamento de Dados
            </h2>
            <p className="text-sky-100 text-sm sm:text-base leading-relaxed">
              O ecossistema JR SAÚDE 1.0 foi estruturado com Next.js 15, TypeScript em modo
              estrito, Tailwind CSS, modelos de banco relacionais no Supabase com Row Level
              Security (RLS), controle de acesso RBAC granular e headers de segurança HTTP ativos.
            </p>
          </div>
        </div>

        {/* Modules & Architecture Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: RBAC */}
          <Card>
            <CardHeader>
              <div className="w-10 h-10 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center mb-2">
                <Users className="w-5 h-5" />
              </div>
              <CardTitle>RBAC com 9 Perfis Nativos</CardTitle>
              <CardDescription>
                Controle de acesso rigoroso baseado no menor privilégio.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1.5 text-xs text-slate-600">
                <span className="px-2 py-1 bg-slate-100 rounded">ADMIN</span>
                <span className="px-2 py-1 bg-slate-100 rounded">RECEPCAO</span>
                <span className="px-2 py-1 bg-slate-100 rounded">FISIOTERAPEUTA</span>
                <span className="px-2 py-1 bg-slate-100 rounded">MEDICO</span>
                <span className="px-2 py-1 bg-slate-100 rounded">PSICOLOGO</span>
                <span className="px-2 py-1 bg-slate-100 rounded">PILATES</span>
                <span className="px-2 py-1 bg-slate-100 rounded">FINANCEIRO</span>
                <span className="px-2 py-1 bg-slate-100 rounded">ADVOGADO</span>
                <span className="px-2 py-1 bg-slate-100 rounded">PACIENTE</span>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Fisioterapia & Prontuário */}
          <Card>
            <CardHeader>
              <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center mb-2">
                <Activity className="w-5 h-5" />
              </div>
              <CardTitle>Módulo de Fisioterapia</CardTitle>
              <CardDescription>
                Prontuário especializado com foco em reabilitação física.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-slate-600 space-y-2">
              <p>&bull; Anamnese e Avaliação Biomecânica Estruturada</p>
              <p>&bull; Evoluções por sessão com escala de dor</p>
              <p>&bull; Planos terapêuticos e emissão de laudos técnicos</p>
            </CardContent>
          </Card>

          {/* Card 3: Banco de Dados & RLS */}
          <Card>
            <CardHeader>
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2">
                <Database className="w-5 h-5" />
              </div>
              <CardTitle>PostgreSQL & Supabase</CardTitle>
              <CardDescription>
                Modelagem relacional completa e migrações versionadas.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-slate-600 space-y-2">
              <p>&bull; DDL em <code className="text-sky-700 bg-sky-50 px-1 rounded">001_initial_schema.sql</code></p>
              <p>&bull; Seed inicial com especialidades e serviços padrão</p>
              <p>&bull; Isolamento por <code className="text-sky-700 bg-sky-50 px-1 rounded">tenant_id</code> e RLS ativo</p>
            </CardContent>
          </Card>

          {/* Card 4: Agenda & Multiunidade */}
          <Card>
            <CardHeader>
              <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center mb-2">
                <Calendar className="w-5 h-5" />
              </div>
              <CardTitle>Agenda Multiunidade</CardTitle>
              <CardDescription>
                Gestão inteligente de consultas, salas e profissionais.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-slate-600 space-y-2">
              <p>&bull; Prevenção ativa de conflitos de horário</p>
              <p>&bull; Rastreio de faltas, cancelamentos e confirmações</p>
              <p>&bull; Salas e unidades parametrizadas</p>
            </CardContent>
          </Card>

          {/* Card 5: Financeiro & Club */}
          <Card>
            <CardHeader>
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-2">
                <CreditCard className="w-5 h-5" />
              </div>
              <CardTitle>Financeiro & JR Saúde Club</CardTitle>
              <CardDescription>
                Fluxo de caixa, comissões flexíveis e assinaturas.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-slate-600 space-y-2">
              <p>&bull; Regras de comissão e repasse configuráveis</p>
              <p>&bull; Assinaturas individuais, familiares e empresariais</p>
              <p>&bull; Contas a pagar, a receber e conciliação</p>
            </CardContent>
          </Card>

          {/* Card 6: Módulo Jurídico e LGPD */}
          <Card>
            <CardHeader>
              <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center mb-2">
                <Scale className="w-5 h-5" />
              </div>
              <CardTitle>Módulo Jurídico & Segurança</CardTitle>
              <CardDescription>
                Separação lógica, autonomia de advogados e sigilo.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-slate-600 space-y-2">
              <p>&bull; Compartilhamento de dados apenas com consentimento</p>
              <p>&bull; Auditoria de acessos em <code className="text-sky-700 bg-sky-50 px-1 rounded">audit_logs</code></p>
              <p>&bull; Cookies HttpOnly, SameSite=Lax e Headers HSTS</p>
            </CardContent>
          </Card>
        </div>

        {/* Technical Summary Footer Section */}
        <div className="mt-8 bg-white border border-slate-200/80 rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
            <div>
              <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-sky-600" />
                Status da Infraestrutura & Hardening
              </h3>
              <p className="text-xs text-slate-500">
                Verificação dos requisitos de segurança da FASE 1
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">
              SHA-256 Validated &bull; Zero Leaks
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl">
              <div className="text-slate-400 mb-1">Row Level Security</div>
              <div className="font-semibold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Habilitado em todas
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl">
              <div className="text-slate-400 mb-1">Isolamento de Secrets</div>
              <div className="font-semibold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Protegido (.gitignore)
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl">
              <div className="text-slate-400 mb-1">Tipagem Estrita</div>
              <div className="font-semibold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> TypeScript 5.7+
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl">
              <div className="text-slate-400 mb-1">Próxima Etapa</div>
              <div className="font-semibold text-sky-700 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" /> FASE 2: Auth & RBAC
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
