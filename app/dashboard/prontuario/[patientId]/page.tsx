import React from "react";
import Link from "next/link";
import { getCurrentUserSession } from "@/lib/auth/rbac";
import { getPatientTimeline } from "@/services/clinical.service";
import { createClient } from "@/lib/supabase/server";
import { formatCPF, formatPhone, formatDateTimeBR } from "@/utils/formatters";
import {
  FileText,
  ChevronLeft,
  Activity,
  HeartPulse,
  Award,
  Calendar,
  Flame,
  User,
  Clock,
  CheckCircle2,
} from "lucide-react";
import EvolutionModal from "./evolution-modal";
import { savePhysiotherapyRecordAction } from "@/app/actions/clinical.actions";

import { redirect } from "next/navigation";

interface ProntuarioPageProps {
  params: Promise<{ patientId: string }>;
}

export default async function PatientClinicalPage({ params }: ProntuarioPageProps) {
  const session = await getCurrentUserSession();
  if (!session) redirect("/login");

  const { patientId } = await params;
  const tenantId = session.profile.tenantId;

  // Busca dados do paciente
  const supabase = await createClient();
  const { data: patient } = await supabase
    .from("patients")
    .select("*")
    .eq("id", patientId)
    .eq("tenant_id", tenantId)
    .single();

  if (!patient) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h1 className="text-xl font-bold text-rose-400">Paciente Não Encontrado</h1>
          <Link href="/dashboard/prontuario" className="text-cyan-400 underline text-sm">
            Voltar para Seleção de Prontuário
          </Link>
        </div>
      </main>
    );
  }

  // Carrega histórico clínico completo
  const { physioRecord, evolutions, timeline } = await getPatientTimeline(tenantId, patientId);

  const getPainBadgeColor = (val: number) => {
    if (val <= 3) return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    if (val <= 6) return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    return "bg-rose-500/10 text-rose-400 border-rose-500/20";
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      {/* Header Bar */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard/prontuario"
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-lg font-bold text-white flex items-center gap-2">
                  <HeartPulse className="w-5 h-5 text-emerald-400" />
                  Prontuário: {patient.full_name}
                </h1>
                <span className="text-xs text-slate-400 font-mono">
                  CPF: {formatCPF(patient.cpf)} • Tel: {formatPhone(patient.phone)}
                </span>
              </div>
            </div>

            <EvolutionModal patientId={patientId} />
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        {/* Patient Summary Banner */}
        <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-6 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center font-bold text-xl">
              {patient.full_name.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{patient.full_name}</h2>
              <div className="text-xs text-slate-400 flex flex-wrap items-center gap-3 mt-0.5">
                <span>Nascimento: {patient.birth_date}</span>
                <span>•</span>
                <span>Gênero: {patient.gender}</span>
                <span>•</span>
                <span>Status: <strong className="text-emerald-400">Ativo</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 uppercase block">Evoluções</span>
              <span className="text-lg font-extrabold text-cyan-400 font-mono">
                {evolutions.length}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 uppercase block">Dor Inicial</span>
              <span className="text-lg font-extrabold text-amber-400 font-mono">
                {physioRecord?.pain_scale_initial ?? "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Section 1: Avaliação Fisioterapêutica Base */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              Avaliação Fisioterapêutica Inicial (Anamnese & Diagnóstico)
            </h3>
          </div>

          <form action={savePhysiotherapyRecordAction} className="space-y-4 text-xs">
            <input type="hidden" name="patientId" value={patientId} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block font-semibold text-slate-300">
                  Histórico Clínico & Anamnese *
                </label>
                <textarea
                  name="clinicalHistory"
                  required
                  rows={3}
                  defaultValue={physioRecord?.clinical_history || ""}
                  placeholder="Queixa principal, história da doença atual, patologias prévias..."
                  className="w-full p-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-slate-300">
                  Diagnóstico Cinesiológico-Funcional *
                </label>
                <textarea
                  name="functionalDiagnosis"
                  required
                  rows={3}
                  defaultValue={physioRecord?.functional_diagnosis || ""}
                  placeholder="Disfunções biomecânicas, limitações de ADM, déficits de força muscular..."
                  className="w-full p-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="block font-semibold text-slate-300">
                  Escala de Dor Inicial (0-10)
                </label>
                <input
                  type="number"
                  name="painScaleInitial"
                  min="0"
                  max="10"
                  defaultValue={physioRecord?.pain_scale_initial || 0}
                  className="w-full p-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-white font-mono focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="block font-semibold text-slate-300">
                  Avaliação Postural / Biomecânica
                </label>
                <input
                  type="text"
                  name="posturalEvaluation"
                  defaultValue={physioRecord?.postural_evaluation?.notes || ""}
                  placeholder="Escoliose, hiperlordose, assimetria de escápulas..."
                  className="w-full p-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 font-semibold text-xs border border-slate-700 transition-colors"
              >
                Salvar Avaliação Inicial
              </button>
            </div>
          </form>
        </div>

        {/* Section 2: Linha do Tempo de Evoluções (SOAP) */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-400" />
            Histórico Cronológico & Evoluções das Sessões
          </h3>

          <div className="space-y-4">
            {timeline.length > 0 ? (
              timeline.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 space-y-3 shadow-md"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/60 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="p-2 rounded-xl bg-slate-800 text-cyan-400">
                        <Activity className="w-4 h-4" />
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-white">{item.title}</h4>
                        <span className="text-[11px] text-slate-400">
                          {formatDateTimeBR(item.date)} • Profissional: {item.professionalName}
                        </span>
                      </div>
                    </div>

                    {item.type === "EVOLUTION" && (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold font-mono border ${getPainBadgeColor(
                          item.details.pain_level
                        )}`}
                      >
                        Dor: {item.details.pain_level} / 10
                      </span>
                    )}
                  </div>

                  {item.type === "EVOLUTION" && (
                    <div className="space-y-2 text-xs text-slate-300">
                      <p className="leading-relaxed">
                        <strong className="text-slate-200">Evolução (SOAP):</strong>{" "}
                        {item.details.evolution_notes}
                      </p>
                      {item.details.conduct && (
                        <p className="leading-relaxed text-slate-400">
                          <strong className="text-slate-300">Conduta Aplicada:</strong>{" "}
                          {item.details.conduct}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="py-12 text-center bg-slate-900/40 border border-slate-800 rounded-3xl space-y-2">
                <FileText className="w-8 h-8 text-slate-500 mx-auto opacity-70" />
                <p className="text-xs text-slate-400">
                  Nenhuma evolução diária ou atendimento registrado até o momento.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
