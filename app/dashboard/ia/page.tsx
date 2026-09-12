import React from "react";
import Link from "next/link";
import { getCurrentUserSession } from "@/lib/auth/rbac";
import { redirect } from "next/navigation";
import { listPatients } from "@/services/patient.service";
import { listAITranscriptions } from "@/services/ai.service";
import {
  Sparkles,
  Mic,
  BrainCircuit,
  FileCheck2,
  ShieldAlert,
  User,
  Activity,
  CheckCircle2,
  Clock,
} from "lucide-react";
import AITranscriptionClientForm from "./ai-transcription-client-form";

export default async function IADashboardPage() {
  const session = await getCurrentUserSession();
  if (!session) redirect("/login");

  const tenantId = session.profile.tenantId;

  const [patientsData, transcriptions] = await Promise.all([
    listPatients(tenantId, "", 100),
    listAITranscriptions(tenantId),
  ]);

  const patientOptions = patientsData.patients.map((p) => ({
    id: p.id,
    name: p.fullName,
  }));

  const pendingCount = transcriptions.filter((t) => !t.isVerified).length;
  const verifiedCount = transcriptions.filter((t) => t.isVerified).length;

  return (
    <div className="space-y-6 text-[#E3DCBE] animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#011733] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-purple-500/10 text-purple-400 border border-purple-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 animate-pulse" />
              Módulo de IA Clínica
            </span>
            <span className="text-xs text-[#E3DCBE]/50">• Validação Humana Obrigatória</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mt-1 flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-[#F5CD67]" />
            Transcrição & Síntese Clínica por IA
          </h1>
          <p className="text-xs text-[#E3DCBE]/70">
            Processamento automatizado de áudios de pacientes e triagem com confirmação do fisioterapeuta.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/prontuario"
            className="px-4 py-2.5 rounded-xl bg-[#011733] hover:bg-[#011733]/80 text-[#E3DCBE] text-xs font-semibold flex items-center gap-2 transition-all"
          >
            <FileCheck2 className="w-4 h-4 text-[#F5CD67]" />
            Ver Prontuários Integrados
          </Link>
        </div>
      </div>

      {/* Warning Alert banner on mandatory human verification */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-white">Diretriz Ética & Segurança Médica Regulatória</h4>
          <p className="text-amber-200/80 mt-0.5 leading-relaxed">
            As sugestões e transcrições geradas pela IA são exclusivamente ferramentas auxiliares de triagem. Nenhuma informação é gravada no prontuário oficial sem antes passar pela **revisão, ajuste e aprovação explícita** do profissional de saúde.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-[#010F25] border border-[#C1801F]/30 shadow-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-[#E3DCBE]/60 font-medium">Aguardando Validação Humana</p>
            <h3 className="text-2xl font-black text-amber-400 mt-1 font-mono">{pendingCount}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#010F25] border border-[#C1801F]/30 shadow-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-[#E3DCBE]/60 font-medium">Validadas e Salvas no Prontuário</p>
            <h3 className="text-2xl font-black text-emerald-400 mt-1 font-mono">{verifiedCount}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Interactive Form Component */}
      <AITranscriptionClientForm
        patients={patientOptions}
        transcriptions={transcriptions}
      />
    </div>
  );
}
