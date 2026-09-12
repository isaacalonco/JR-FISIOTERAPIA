import { createClient } from "@/lib/supabase/server";
import { LegalCaseInput, LegalContractInput } from "@/utils/validators/legal-audit.schema";
import { logAuditEvent } from "@/services/audit.service";

export interface LegalCaseRecord {
  id: string;
  tenantId: string;
  caseNumber: string;
  title: string;
  caseType: string;
  status: string;
  patientId?: string | null;
  patientName?: string | null;
  lawyerName?: string | null;
  description?: string | null;
  dueDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LegalContractRecord {
  id: string;
  tenantId: string;
  title: string;
  contractType: string;
  status: string;
  patientId?: string | null;
  patientName?: string | null;
  content?: string | null;
  signedAt?: string | null;
  expiresAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Lista todos os processos/casos jurídicos do tenant
 */
export async function listLegalCases(tenantId: string): Promise<LegalCaseRecord[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("legal_cases")
      .select("*, patients(full_name)")
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Erro ao listar casos jurídicos:", error);
      return [];
    }

    return (data || []).map((row: any) => ({
      id: row.id,
      tenantId: row.tenant_id,
      caseNumber: row.case_number,
      title: row.title,
      caseType: row.case_type,
      status: row.status,
      patientId: row.patient_id,
      patientName: row.patients?.full_name || null,
      lawyerName: row.lawyer_name,
      description: row.description,
      dueDate: row.due_date,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  } catch (err) {
    console.warn("Erro em listLegalCases:", err);
    return [];
  }
}

/**
 * Cria um novo processo/caso jurídico e gera evento na auditoria
 */
export async function createLegalCase(
  tenantId: string,
  input: LegalCaseInput,
  userEmail?: string
): Promise<{ success: boolean; data?: LegalCaseRecord; error?: string }> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("legal_cases")
      .insert({
        tenant_id: tenantId,
        case_number: input.case_number,
        title: input.title,
        case_type: input.case_type,
        status: input.status || "em_andamento",
        patient_id: input.patient_id || null,
        lawyer_name: input.lawyer_name || null,
        description: input.description || null,
        due_date: input.due_date || null,
      })
      .select("*, patients(full_name)")
      .single();

    if (error || !data) {
      return { success: false, error: error?.message || "Erro ao criar caso jurídico." };
    }

    // Registrar Auditoria
    await logAuditEvent({
      tenantId,
      userEmail,
      action: "CREATE_LEGAL_CASE",
      entityType: "legal_case",
      entityId: data.id,
      details: { caseNumber: data.case_number, title: data.title },
    });

    return {
      success: true,
      data: {
        id: data.id,
        tenantId: data.tenant_id,
        caseNumber: data.case_number,
        title: data.title,
        caseType: data.case_type,
        status: data.status,
        patientId: data.patient_id,
        patientName: data.patients?.full_name || null,
        lawyerName: data.lawyer_name,
        description: data.description,
        dueDate: data.due_date,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      },
    };
  } catch (err: any) {
    return { success: false, error: err.message || "Erro interno ao criar caso jurídico." };
  }
}

/**
 * Atualiza status de um caso jurídico
 */
export async function updateLegalCaseStatus(
  tenantId: string,
  caseId: string,
  status: string,
  userEmail?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("legal_cases")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", caseId)
      .eq("tenant_id", tenantId);

    if (error) {
      return { success: false, error: error.message };
    }

    await logAuditEvent({
      tenantId,
      userEmail,
      action: "UPDATE_LEGAL_CASE_STATUS",
      entityType: "legal_case",
      entityId: caseId,
      details: { newStatus: status },
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Lista todos os contratos jurídicos do tenant
 */
export async function listLegalContracts(tenantId: string): Promise<LegalContractRecord[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("legal_contracts")
      .select("*, patients(full_name)")
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Erro ao listar contratos jurídicos:", error);
      return [];
    }

    return (data || []).map((row: any) => ({
      id: row.id,
      tenantId: row.tenant_id,
      title: row.title,
      contractType: row.contract_type,
      status: row.status,
      patientId: row.patient_id,
      patientName: row.patients?.full_name || null,
      content: row.content,
      signedAt: row.signed_at,
      expiresAt: row.expires_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  } catch (err) {
    console.warn("Erro em listLegalContracts:", err);
    return [];
  }
}

/**
 * Cria um novo contrato jurídico e gera evento auditável
 */
export async function createLegalContract(
  tenantId: string,
  input: LegalContractInput,
  userEmail?: string
): Promise<{ success: boolean; data?: LegalContractRecord; error?: string }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("legal_contracts")
      .insert({
        tenant_id: tenantId,
        title: input.title,
        contract_type: input.contract_type,
        status: input.status || "rascunho",
        patient_id: input.patient_id || null,
        content: input.content || null,
        signed_at: input.signed_at || null,
        expires_at: input.expires_at || null,
      })
      .select("*, patients(full_name)")
      .single();

    if (error || !data) {
      return { success: false, error: error?.message || "Erro ao criar contrato." };
    }

    await logAuditEvent({
      tenantId,
      userEmail,
      action: "CREATE_LEGAL_CONTRACT",
      entityType: "legal_contract",
      entityId: data.id,
      details: { title: data.title, contractType: data.contract_type },
    });

    return {
      success: true,
      data: {
        id: data.id,
        tenantId: data.tenant_id,
        title: data.title,
        contractType: data.contract_type,
        status: data.status,
        patientId: data.patient_id,
        patientName: data.patients?.full_name || null,
        content: data.content,
        signedAt: data.signed_at,
        expiresAt: data.expires_at,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      },
    };
  } catch (err: any) {
    return { success: false, error: err.message || "Erro interno ao criar contrato." };
  }
}

/**
 * Atualiza o status de um contrato
 */
export async function updateLegalContractStatus(
  tenantId: string,
  contractId: string,
  status: string,
  userEmail?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const updateData: any = { status, updated_at: new Date().toISOString() };
    if (status === "vigente") {
      updateData.signed_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from("legal_contracts")
      .update(updateData)
      .eq("id", contractId)
      .eq("tenant_id", tenantId);

    if (error) {
      return { success: false, error: error.message };
    }

    await logAuditEvent({
      tenantId,
      userEmail,
      action: "UPDATE_LEGAL_CONTRACT_STATUS",
      entityType: "legal_contract",
      entityId: contractId,
      details: { newStatus: status },
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
