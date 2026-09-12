import { createClient } from "@/lib/supabase/server";
import {
  PhysiotherapyRecordInput,
  ClinicalEvolutionInput,
  TreatmentPlanInput,
  ClinicalReportInput,
} from "@/utils/validators/clinical.schema";

export interface ClinicalTimelineItem {
  id: string;
  type: "EVOLUTION" | "PHYSIOTHERAPY_BASE" | "TREATMENT_PLAN" | "REPORT";
  date: string;
  title: string;
  professionalName: string;
  details: any;
}

/**
 * Resgata a linha do tempo clínica consolidada de um paciente.
 */
export async function getPatientTimeline(
  tenantId: string,
  patientId: string
): Promise<{
  physioRecord?: any;
  evolutions: any[];
  treatmentPlans: any[];
  reports: any[];
  timeline: ClinicalTimelineItem[];
}> {
  const supabase = await createClient();

  const [physioRes, evolutionsRes, plansRes, reportsRes] = await Promise.all([
    supabase
      .from("physiotherapy_records")
      .select("*, professionals(profiles(full_name))")
      .eq("tenant_id", tenantId)
      .eq("patient_id", patientId)
      .maybeSingle(),
    supabase
      .from("clinical_evolutions")
      .select("*, professionals(profiles(full_name))")
      .eq("tenant_id", tenantId)
      .eq("patient_id", patientId)
      .order("created_at", { ascending: false }),
    supabase
      .from("treatment_plans")
      .select("*, professionals(profiles(full_name))")
      .eq("tenant_id", tenantId)
      .eq("patient_id", patientId)
      .order("created_at", { ascending: false }),
    supabase
      .from("reports")
      .select("*, professionals(profiles(full_name))")
      .eq("tenant_id", tenantId)
      .eq("patient_id", patientId)
      .order("created_at", { ascending: false }),
  ]);

  const timeline: ClinicalTimelineItem[] = [];

  if (physioRes.data) {
    timeline.push({
      id: physioRes.data.id,
      type: "PHYSIOTHERAPY_BASE",
      date: physioRes.data.created_at,
      title: "Ficha de Avaliação Fisioterapêutica Inicial",
      professionalName: physioRes.data.professionals?.profiles?.full_name || "Profissional",
      details: physioRes.data,
    });
  }

  if (evolutionsRes.data) {
    evolutionsRes.data.forEach((ev: any) => {
      timeline.push({
        id: ev.id,
        type: "EVOLUTION",
        date: ev.created_at,
        title: `Evolução de Atendimento (Dor: ${ev.pain_level}/10)`,
        professionalName: ev.professionals?.profiles?.full_name || "Profissional",
        details: ev,
      });
    });
  }

  if (plansRes.data) {
    plansRes.data.forEach((pl: any) => {
      timeline.push({
        id: pl.id,
        type: "TREATMENT_PLAN",
        date: pl.created_at,
        title: `Plano Terapêutico (${pl.estimated_sessions} sessões)`,
        professionalName: pl.professionals?.profiles?.full_name || "Profissional",
        details: pl,
      });
    });
  }

  if (reportsRes.data) {
    reportsRes.data.forEach((rep: any) => {
      timeline.push({
        id: rep.id,
        type: "REPORT",
        date: rep.created_at,
        title: `Laudo / Relatório: ${rep.title}`,
        professionalName: rep.professionals?.profiles?.full_name || "Profissional",
        details: rep,
      });
    });
  }

  // Ordena cronologicamente por data descendente (mais recentes primeiro)
  timeline.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return {
    physioRecord: physioRes.data,
    evolutions: evolutionsRes.data || [],
    treatmentPlans: plansRes.data || [],
    reports: reportsRes.data || [],
    timeline,
  };
}

/**
 * Cadastra ou atualiza a ficha fisioterapêutica base.
 */
export async function savePhysiotherapyRecord(
  tenantId: string,
  professionalId: string,
  input: PhysiotherapyRecordInput
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const { error } = await supabase.from("physiotherapy_records").upsert(
    {
      tenant_id: tenantId,
      patient_id: input.patientId,
      professional_id: professionalId,
      clinical_history: input.clinicalHistory,
      functional_diagnosis: input.functionalDiagnosis,
      pain_scale_initial: input.painScaleInitial,
      biomechanical_assessment: input.biomechanicalAssessment
        ? JSON.stringify({ notes: input.biomechanicalAssessment })
        : null,
      postural_evaluation: input.posturalEvaluation
        ? JSON.stringify({ notes: input.posturalEvaluation })
        : null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "patient_id" }
  );

  if (error) {
    return { success: false, error: "Falha ao salvar a avaliação fisioterapêutica." };
  }

  return { success: true };
}

/**
 * Registra evolução diária por sessão (SOAP).
 */
export async function createClinicalEvolution(
  tenantId: string,
  professionalId: string,
  input: ClinicalEvolutionInput
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const { error } = await supabase.from("clinical_evolutions").insert({
    tenant_id: tenantId,
    patient_id: input.patientId,
    professional_id: professionalId,
    appointment_id: input.appointmentId || null,
    evolution_notes: input.evolutionNotes,
    conduct: input.conduct || null,
    pain_level: input.painLevel || 0,
  });

  if (error) {
    return { success: false, error: "Falha ao salvar a evolução da sessão." };
  }

  return { success: true };
}

/**
 * Registra plano terapêutico.
 */
export async function createTreatmentPlan(
  tenantId: string,
  professionalId: string,
  input: TreatmentPlanInput
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const { error } = await supabase.from("treatment_plans").insert({
    tenant_id: tenantId,
    patient_id: input.patientId,
    professional_id: professionalId,
    short_term_goals: input.shortTermGoals,
    long_term_goals: input.longTermGoals,
    estimated_sessions: input.estimatedSessions,
    status: "EM_ANDAMENTO",
  });

  if (error) {
    return { success: false, error: "Falha ao salvar o plano de tratamento." };
  }

  return { success: true };
}
