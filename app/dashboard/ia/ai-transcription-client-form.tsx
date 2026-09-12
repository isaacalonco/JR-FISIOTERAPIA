"use client";

import React, { useState, useActionState } from "react";
import {
  BrainCircuit,
  Mic,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Flame,
  UserCheck,
  FileText,
} from "lucide-react";
import { submitAITranscriptionAction, verifyAndCommitAIAction } from "@/app/actions/ai.actions";

interface AITranscriptionClientFormProps {
  patients: Array<{ id: string; name: string }>;
  transcriptions: Array<{
    id: string;
    patientName?: string;
    rawTranscription: string;
    aiSummary: string;
    suggestedChiefComplaint?: string | null;
    suggestedPainLevel?: number | null;
    isVerified: boolean;
    verifiedByName?: string | null;
    createdAt: string;
  }>;
}

export default function AITranscriptionClientForm({
  patients,
  transcriptions,
}: AITranscriptionClientFormProps) {
  const [submitState, submitFormAction, isSubmitting] = useActionState(
    submitAITranscriptionAction,
    null
  );
  const [verifyState, verifyFormAction, isVerifying] = useActionState(
    verifyAndCommitAIAction,
    null
  );

  const [activeTab, setActiveTab] = useState<"NEW" | "PENDING">("NEW");

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="flex border-b border-[#011733] gap-4 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab("NEW")}
          className={`pb-3 transition-colors flex items-center gap-2 ${
            activeTab === "NEW"
              ? "text-[#F5CD67] border-b-2 border-[#E5A838]"
              : "text-[#E3DCBE]/60 hover:text-white"
          }`}
        >
          <Mic className="w-4 h-4" />
          Submeter Novo Áudio / Relato
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("PENDING")}
          className={`pb-3 transition-colors flex items-center gap-2 ${
            activeTab === "PENDING"
              ? "text-[#F5CD67] border-b-2 border-[#E5A838]"
              : "text-[#E3DCBE]/60 hover:text-white"
          }`}
        >
          <UserCheck className="w-4 h-4" />
          Fila de Validação Clínica ({transcriptions.filter((t) => !t.isVerified).length})
        </button>
      </div>

      {activeTab === "NEW" && (
        <div className="bg-[#010F25] border border-[#C1801F]/30 rounded-3xl p-6 shadow-2xl space-y-5">
          <div className="flex items-center gap-3 border-b border-[#011733] pb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Transcrição & Triagem de Áudio do Paciente</h2>
              <p className="text-xs text-[#E3DCBE]/70">
                Insira a transcrição do áudio de WhatsApp do paciente para síntese imediata dos sintomas.
              </p>
            </div>
          </div>

          {submitState?.success && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{submitState.message}</span>
              </div>
              {submitState.transcription && (
                <div className="p-3 bg-[#000A1B] rounded-xl border border-[#011733] space-y-1 font-mono text-[11px] text-[#E3DCBE]/90">
                  <p><strong className="text-[#F5CD67]">Resumo IA:</strong> {submitState.transcription.aiSummary}</p>
                  <p><strong className="text-[#F5CD67]">Queixa Sugerida:</strong> {submitState.transcription.suggestedChiefComplaint}</p>
                  <p><strong className="text-[#F5CD67]">Dor Estimada:</strong> EVA Nível {submitState.transcription.suggestedPainLevel}/10</p>
                </div>
              )}
            </div>
          )}

          {submitState?.error && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{submitState.error}</span>
            </div>
          )}

          <form action={submitFormAction} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="block font-semibold text-[#E3DCBE]/80">Selecione o Paciente Titular *</label>
              <select
                name="patientId"
                required
                className="w-full p-2.5 bg-[#000A1B]/80 border border-[#011733] focus:border-[#E5A838] rounded-xl text-[#E3DCBE] focus:outline-none"
              >
                <option value="">-- Selecione o Paciente --</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block font-semibold text-[#E3DCBE]/80">
                Relato de Voz / Transcrição Bruta do Paciente *
              </label>
              <textarea
                name="rawText"
                required
                rows={4}
                placeholder="Ex: 'Doutor, estou com uma dor forte na coluna lombar que começou ontem quando levantei peso. Não consigo sentar sem dor...'"
                className="w-full p-3 bg-[#000A1B]/80 border border-[#011733] focus:border-[#E5A838] rounded-xl text-[#E3DCBE] placeholder-[#E3DCBE]/40 focus:outline-none"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E5A838] via-[#F5CD67] to-[#C1801F] hover:opacity-95 text-[#000A1B] font-extrabold text-xs shadow-md transition-all flex items-center gap-2"
              >
                <BrainCircuit className="w-4 h-4 text-[#000A1B]" />
                {isSubmitting ? "Sintetizando com IA..." : "Sintetizar Achados Clínicos (IA)"}
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === "PENDING" && (
        <div className="space-y-4">
          {verifyState?.success && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{verifyState.message}</span>
            </div>
          )}

          {verifyState?.error && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{verifyState.error}</span>
            </div>
          )}

          {transcriptions.length === 0 ? (
            <div className="p-12 text-center text-xs text-[#E3DCBE]/60 bg-[#010F25] border border-[#C1801F]/30 rounded-3xl">
              <BrainCircuit className="w-10 h-10 mx-auto text-[#E3DCBE]/30 mb-2" />
              Nenhum relato de voz registrado até o momento.
            </div>
          ) : (
            transcriptions.map((t) => (
              <div
                key={t.id}
                className={`p-6 rounded-3xl border shadow-xl transition-all space-y-4 ${
                  t.isVerified
                    ? "bg-[#010F25]/60 border-emerald-500/30 text-[#E3DCBE]"
                    : "bg-[#010F25] border-[#C1801F]/40 text-[#E3DCBE]"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#011733] pb-3">
                  <div>
                    <span className="text-xs text-[#E3DCBE]/60">Paciente:</span>
                    <h3 className="text-base font-bold text-white">{t.patientName}</h3>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-extrabold border ${
                      t.isVerified
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                    }`}
                  >
                    {t.isVerified ? `Aprovado por ${t.verifiedByName || "Profissional"}` : "Aguardando Validação Humana"}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 rounded-2xl bg-[#000A1B]/80 border border-[#011733] space-y-1">
                    <span className="text-[10px] font-bold text-[#E3DCBE]/60 uppercase">Transcrição Bruta (Áudio)</span>
                    <p className="text-[#E3DCBE]/90 italic">"{t.rawTranscription}"</p>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#000A1B]/80 border border-[#011733] space-y-1">
                    <span className="text-[10px] font-bold text-[#F5CD67] uppercase">Síntese Inteligente (IA)</span>
                    <p className="text-white font-medium">{t.aiSummary}</p>
                  </div>
                </div>

                {!t.isVerified && (
                  <form action={verifyFormAction} className="pt-3 border-t border-[#011733] space-y-4 text-xs">
                    <input type="hidden" name="transcriptionId" value={t.id} />

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2 space-y-1">
                        <label className="block font-semibold text-[#E3DCBE]/90">
                          Queixa Principal Aprovada *
                        </label>
                        <input
                          type="text"
                          name="chiefComplaint"
                          required
                          defaultValue={t.suggestedChiefComplaint || ""}
                          className="w-full p-2.5 bg-[#000A1B] border border-[#011733] focus:border-[#E5A838] rounded-xl text-[#E3DCBE] focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block font-semibold text-[#E3DCBE]/90">Escala de Dor EVA (0-10) *</label>
                        <input
                          type="number"
                          name="painLevel"
                          min={0}
                          max={10}
                          required
                          defaultValue={t.suggestedPainLevel ?? 5}
                          className="w-full p-2.5 bg-[#000A1B] border border-[#011733] focus:border-[#E5A838] rounded-xl text-[#E3DCBE] focus:outline-none font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block font-semibold text-[#E3DCBE]/90">Notas Clínicas Adicionais</label>
                      <input
                        type="text"
                        name="conductOrNotes"
                        placeholder="Ex: Confirmado durante anamnese. Solicitado raio-X prévio."
                        className="w-full p-2.5 bg-[#000A1B] border border-[#011733] focus:border-[#E5A838] rounded-xl text-[#E3DCBE] focus:outline-none"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isVerifying}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:opacity-95 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2"
                      >
                        <UserCheck className="w-4 h-4" />
                        {isVerifying ? "Gravando no Prontuário..." : "Aprovar & Inserir no Prontuário"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
