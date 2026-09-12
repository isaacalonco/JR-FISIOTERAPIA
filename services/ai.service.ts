import { createClient } from "@/lib/supabase/server";

export interface AITranscriptionRecord {
  id: string;
  tenantId: string;
  patientId: string;
  appointmentId?: string | null;
  audioUrl?: string | null;
  rawTranscription: string;
  aiSummary: string;
  suggestedChiefComplaint?: string | null;
  suggestedPainLevel?: number | null;
  isVerified: boolean;
  verifiedByUserId?: string | null;
  verifiedAt?: string | null;
  createdAt: string;
  patientName?: string;
  verifiedByName?: string;
}

/**
 * Módulo de Inteligência Artificial: Processa o áudio/texto de triagem e sintetiza os achados preliminares
 */
export async function processAIAudioTranscription(
  tenantId: string,
  patientId: string,
  appointmentId: string | undefined,
  audioUrl: string | undefined,
  rawText: string
) {
  const supabase = await createClient();

  // Simulação inteligente de IA NLU / NLP para extração de sintomas clínicos
  const lowerText = rawText.toLowerCase();

  let estimatedPain = 5;
  if (lowerText.includes("muita dor") || lowerText.includes("insuportável") || lowerText.includes("forte")) {
    estimatedPain = 8;
  } else if (lowerText.includes("leve") || lowerText.includes("pouca")) {
    estimatedPain = 3;
  } else if (lowerText.includes("sem dor")) {
    estimatedPain = 0;
  }

  let complaint = "Queixa motora e/ou postural relatada via áudio";
  if (lowerText.includes("coluna") || lowerText.includes("lombar")) {
    complaint = "Lombociatalgia / Dor na região lombar";
  } else if (lowerText.includes("joelho")) {
    complaint = "Gonalgia / Instabilidade articular no joelho";
  } else if (lowerText.includes("ombro")) {
    complaint = "Síndrome do impacto no ombro / Tendinopatia";
  } else if (lowerText.includes("pescoço") || lowerText.includes("cervical")) {
    complaint = "Cervicalgia / Rigidez na região cervical";
  }

  const aiSummary = `SÍNTESE IA: Paciente refere desconforto físico. Queixa sugerida: "${complaint}". Nível de dor estimado: ${estimatedPain}/10. Requer confirmação e palpação física em consulta.`;

  const { data, error } = await supabase
    .from("ai_intake_transcriptions")
    .insert({
      tenant_id: tenantId,
      patient_id: patientId,
      appointment_id: appointmentId || null,
      audio_url: audioUrl || null,
      raw_transcription: rawText,
      ai_summary: aiSummary,
      suggested_chief_complaint: complaint,
      suggested_pain_level: estimatedPain,
      is_verified: false,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Erro ao salvar transcrição da IA: ${error.message}`);
  }

  return {
    id: data.id,
    aiSummary,
    suggestedChiefComplaint: complaint,
    suggestedPainLevel: estimatedPain,
    isVerified: false,
  };
}

/**
 * Validação Humana Clínica Obrigatória: O profissional de saúde revisa e aprova antes de salvar no prontuário.
 */
export async function verifyAndCommitAITranscription(
  tenantId: string,
  professionalProfileId: string,
  data: {
    transcriptionId: string;
    chiefComplaint: string;
    painLevel: number;
    conductOrNotes?: string;
  }
) {
  const supabase = await createClient();

  // 1. Busca transcrição
  const { data: transcription, error: fetchErr } = await supabase
    .from("ai_intake_transcriptions")
    .select("id, patient_id, appointment_id, raw_transcription, is_verified")
    .eq("id", data.transcriptionId)
    .eq("tenant_id", tenantId)
    .single();

  if (fetchErr || !transcription) {
    throw new Error("Registro de transcrição IA não encontrado.");
  }

  if (transcription.is_verified) {
    throw new Error("Esta transcrição já foi revisada e validada anteriormente por um profissional.");
  }

  const now = new Date().toISOString();

  // 2. Marca a transcrição como VERIFICADA com autor responsável
  const { error: updateErr } = await supabase
    .from("ai_intake_transcriptions")
    .update({
      is_verified: true,
      verified_by_user_id: professionalProfileId,
      verified_at: now,
      suggested_chief_complaint: data.chiefComplaint,
      suggested_pain_level: data.painLevel,
    })
    .eq("id", data.transcriptionId);

  if (updateErr) {
    throw new Error(`Erro ao atualizar validação humana da IA: ${updateErr.message}`);
  }

  // 3. Insere registro verificado no Prontuário Eletrônico (medical_records)
  const { data: medicalRecord, error: medErr } = await supabase
    .from("medical_records")
    .insert({
      tenant_id: tenantId,
      patient_id: transcription.patient_id,
      professional_id: professionalProfileId,
      appointment_id: transcription.appointment_id,
      record_date: now,
      chief_complaint: data.chiefComplaint,
      anamnesis: `[TRIAGEM IA VERIFICADA POR PROFISSIONAL]: ${transcription.raw_transcription}\nNotas clínicas: ${data.conductOrNotes || "Sem observações adicionais."}`,
      physical_exam: `Escala EVA de Dor Aprovada: ${data.painLevel}/10`,
      diagnostic_hypothesis: data.chiefComplaint,
    })
    .select()
    .single();

  if (medErr) {
    throw new Error(`Erro ao gravar dados no Prontuário Eletrônico: ${medErr.message}`);
  }

  return {
    success: true,
    medicalRecordId: medicalRecord.id,
    message: "Triagem de IA verificada pelo profissional e integrada com sucesso ao Prontuário Eletrônico!",
  };
}

/**
 * Lista transcrições de IA com seus respectivos status de verificação humana
 */
export async function listAITranscriptions(tenantId: string): Promise<AITranscriptionRecord[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("ai_intake_transcriptions")
    .select(`
      id,
      tenant_id,
      patient_id,
      appointment_id,
      audio_url,
      raw_transcription,
      ai_summary,
      suggested_chief_complaint,
      suggested_pain_level,
      is_verified,
      verified_by_user_id,
      verified_at,
      created_at,
      patient:patients(full_name),
      verifier:profiles!ai_intake_transcriptions_verified_by_user_id_fkey(full_name)
    `)
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao listar transcrições da IA:", error);
    return [];
  }

  return (data || []).map((t: any) => ({
    id: t.id,
    tenantId: t.tenant_id,
    patientId: t.patient_id,
    appointmentId: t.appointment_id,
    audioUrl: t.audio_url,
    rawTranscription: t.raw_transcription,
    aiSummary: t.ai_summary,
    suggestedChiefComplaint: t.suggested_chief_complaint,
    suggestedPainLevel: t.suggested_pain_level,
    isVerified: t.is_verified,
    verifiedByUserId: t.verified_by_user_id,
    verifiedAt: t.verified_at,
    createdAt: t.created_at,
    patientName: t.patient?.full_name || "Desconhecido",
    verifiedByName: t.verifier?.full_name || null,
  }));
}
