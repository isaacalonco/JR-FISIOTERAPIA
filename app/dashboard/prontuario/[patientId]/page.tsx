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
  Clock,
} from "lucide-react";
import { JRLogo } from "@/components/ui/jr-logo";
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
      <main className="min-h-screen bg-[#000A1B] text-[#E3DCBE] p-8">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h1 className="text-xl font-bold text-rose-400">Paciente Não Encontrado</h1>
          <Link href="/dashboard/prontuario" className="text-[#F5CD67] underline text-sm">
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
    <main className="min-h-screen bg-[#000A1B] text-[#E3DCBE] pb-16">
      {/* Header Bar */}
      <header className="border-b border-[#011733] bg-[#010F25]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard/prontuario"
                className="p-2 rounded-xl bg-[#011733] hover:bg-[#011733]/80 text-[#E3DCBE] transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <JRLogo size="md" subtitle={`Prontuário: ${patient.full_name}`} />
            </div>

            <EvolutionModal patientId={patientId} />
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        {/* Patient Summary Banner */}
        <div className="rounded-3xl bg-[#010F25]/80 border border-[#C1801F]/30 p-6 flex flex-wrap items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#E5A838]/10 text-[#F5CD67] border border-[#C1801F]/30 flex items-center justify-center font-bold text-xl">
              {patient.full_name.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{patient.full_name}</h2>
              <div className="text-xs text-[#E3DCBE]/70 flex flex-wrap items-center gap-3 mt-0.5">
                <span>Nascimento: {patient.birth_date}</span>
                <span>•</span>
                <span>Gênero: {patient.gender}</span>
                <span>•</span>
                <span>Status: <strong className="text-emerald-400">Ativo</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-[#000A1B]/60 border border-[#011733] text-center">
              <span className="text-[10px] text-[#E3DCBE]/60 uppercase block">Evoluções</span>
              <span className="text-lg font-extrabold text-[#F5CD67] font-mono">
                {evolutions.length}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-[#000A1B]/60 border border-[#011733] text-center">
              <span className="text-[10px] text-[#E3DCBE]/60 uppercase block">Dor Inicial</span>
              <span className="text-lg font-extrabold text-[#E5A838] font-mono">
                {physioRecord?.pain_scale_initial ?? "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Section 1: Avaliação Fisioterapêutica Base */}
        <div className="bg-[#010F25]/80 border border-[#C1801F]/30 rounded-3xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#011733] pb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#E5A838]" />
              Avaliação Fisioterapêutica Inicial (Anamnese & Diagnóstico)
            </h3>
          </div>

          <form action={savePhysiotherapyRecordAction} className="space-y-4 text-xs">
            <input type="hidden" name="patientId" value={patientId} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block font-semibold text-[#E3DCBE]/80">
                  Histórico Clínico & Anamnese *
                </label>
                <textarea
                  name="clinicalHistory"
                  required
                  rows={3}
                  defaultValue={physioRecord?.clinical_history || ""}
                  placeholder="Queixa principal, história da doença atual, patologias prévias..."
                  className="w-full p-2.5 bg-[#000A1B]/80 border border-[#011733] focus:border-[#E5A838] rounded-xl text-[#E3DCBE] placeholder-[#E3DCBE]/40 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-[#E3DCBE]/80">
                  Diagnóstico Cinesiológico-Funcional *
                </label>
                <textarea
                  name="functionalDiagnosis"
                  required
                  rows={3}
                  defaultValue={physioRecord?.functional_diagnosis || ""}
                  placeholder="Disfunções biomecânicas, limitações de ADM, déficits de força muscular..."
                  className="w-full p-2.5 bg-[#000A1B]/80 border border-[#011733] focus:border-[#E5A838] rounded-xl text-[#E3DCBE] placeholder-[#E3DCBE]/40 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="block font-semibold text-[#E3DCBE]/80">
                  Escala de Dor Inicial (0-10)
                </label>
                <input
                  type="number"
                  name="painScaleInitial"
                  min="0"
                  max="10"
                  defaultValue={physioRecord?.pain_scale_initial || 0}
                  className="w-full p-2.5 bg-[#000A1B]/80 border border-[#011733] focus:border-[#E5A838] rounded-xl text-white font-mono focus:outline-none"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="block font-semibold text-[#E3DCBE]/80">
                  Avaliação Postural / Biomecânica
                </label>
                <input
                  type="text"
                  name="posturalEvaluation"
                  defaultValue={physioRecord?.postural_evaluation?.notes || ""}
                  placeholder="Escoliose, hiperlordose, assimetria de escápulas..."
                  className="w-full p-2.5 bg-[#000A1B]/80 border border-[#011733] focus:border-[#E5A838] rounded-xl text-[#E3DCBE] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#E5A838] to-[#C1801F] hover:opacity-95 text-[#000A1B] font-bold text-xs shadow-md transition-all"
              >
                Salvar Avaliação Inicial
              </button>
            </div>
          </form>
        </div>

        {/* Section 2: Linha do Tempo de Evoluções (SOAP) */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#F5CD67]" />
            Histórico Cronológico & Evoluções das Sessões
          </h3>

          <div className="space-y-4">
            {timeline.length > 0 ? (
              timeline.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#010F25]/80 border border-[#C1801F]/30 rounded-3xl p-5 space-y-3 shadow-lg"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#011733] pb-3">
                    <div className="flex items-center gap-3">
                      <span className="p-2 rounded-xl bg-[#011733] text-[#F5CD67]">
                        <Activity className="w-4 h-4" />
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-white">{item.title}</h4>
                        <span className="text-[11px] text-[#E3DCBE]/70">
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
                    <div className="space-y-2 text-xs text-[#E3DCBE]">
                      <p className="leading-relaxed">
                        <strong className="text-white">Evolução (SOAP):</strong>{" "}
                        {item.details.evolution_notes}
                      </p>
                      {item.details.conduct && (
                        <p className="leading-relaxed text-[#E3DCBE]/80">
                          <strong className="text-[#F5CD67]">Conduta Aplicada:</strong>{" "}
                          {item.details.conduct}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="py-12 text-center bg-[#010F25]/80 border border-[#C1801F]/30 rounded-3xl space-y-2 shadow-xl">
                <FileText className="w-8 h-8 text-[#E5A838]/60 mx-auto opacity-70" />
                <p className="text-xs text-[#E3DCBE]/70">
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
