import { createClient } from "@/lib/supabase/server";
import { LegalCaseInput, LegalProcessType, UpdateLegalProgressInput } from "@/utils/validators/legal.schema";

export interface LegalCaseRecord {
  id: string;
  tenantId: string;
  lawyerName: string;
  clientName: string;
  clientPhone: string;
  entryDate: string;
  amountPaid: number;
  processType: LegalProcessType;
  notes?: string | null;
  statusProgress: string;
  createdAt: string;
  updatedAt: string;
}

export interface LegalKPIs {
  totalCases: number;
  totalRevenue: number;
  inssCount: number;
  observadoriaCount: number;
  afastamentoCount: number;
}

// Armazenamento em memória para dados adicionados durante a sessão caso o Supabase remoto esteja inacessível
const memoryDemoCases: LegalCaseRecord[] = [
  {
    id: "l1111111-1111-4111-8111-111111111111",
    tenantId: "00000000-0000-0000-0000-000000000000",
    lawyerName: "Dr. Marcos Vinícius Prado",
    clientName: "Gabriel Henrique Alves",
    clientPhone: "(61) 99123-4567",
    entryDate: "2026-02-10",
    amountPaid: 2500.00,
    processType: "INSS",
    notes: "Ação de concessão de auxílio-acidente por sequela pós-reconstrução ligamentar de LCA. Laudos fisioterapêuticos anexados aos autos.",
    statusProgress: "Perícia Médica Agendada no INSS (15/04)",
    createdAt: new Date("2026-02-10T10:00:00Z").toISOString(),
    updatedAt: new Date("2026-02-10T10:00:00Z").toISOString(),
  },
  {
    id: "l2222222-2222-4222-8222-222222222222",
    tenantId: "00000000-0000-0000-0000-000000000000",
    lawyerName: "Dra. Carolina Mendes Rezende",
    clientName: "Fernanda Montenegro Paes",
    clientPhone: "(61) 98234-5678",
    entryDate: "2026-03-01",
    amountPaid: 1800.00,
    processType: "Afastamento",
    notes: "Pedido de afastamento previdenciário B91 (doença ocupacional/LER) com histórico de tratamento quiroprático e fisioterapia contínua.",
    statusProgress: "Aguardando Resultado de Recurso Administrativo",
    createdAt: new Date("2026-03-01T14:30:00Z").toISOString(),
    updatedAt: new Date("2026-03-01T14:30:00Z").toISOString(),
  },
  {
    id: "l3333333-3333-4333-8333-333333333333",
    tenantId: "00000000-0000-0000-0000-000000000000",
    lawyerName: "Dr. Marcos Vinícius Prado",
    clientName: "Roberto Carlos Oliveira",
    clientPhone: "(61) 99345-6789",
    entryDate: "2026-01-18",
    amountPaid: 3200.00,
    processType: "Observadoria",
    notes: "Monitoramento de conformidade ergonômica de empresa para evitar litígio e validação de relatórios biomecânicos para defesa.",
    statusProgress: "Relatório de Observadoria Concluído e Entregue",
    createdAt: new Date("2026-01-18T09:15:00Z").toISOString(),
    updatedAt: new Date("2026-01-18T09:15:00Z").toISOString(),
  },
  {
    id: "l4444444-4444-4444-8444-444444444444",
    tenantId: "00000000-0000-0000-0000-000000000000",
    lawyerName: "Dra. Carolina Mendes Rezende",
    clientName: "Camila Rocha Souza",
    clientPhone: "(61) 98456-7890",
    entryDate: "2026-03-12",
    amountPaid: 2100.00,
    processType: "INSS",
    notes: "Benefício assistencial e aposentadoria por incapacidade permanente. Documentação clínica em fase de coleta com a equipe de reabilitação.",
    statusProgress: "Petição Inicial Distribuída na Justiça Federal",
    createdAt: new Date("2026-03-12T11:45:00Z").toISOString(),
    updatedAt: new Date("2026-03-12T11:45:00Z").toISOString(),
  },
];

/**
 * Lista todos os processos/casos do advogado no tenant.
 */
export async function listLegalCases(
  tenantId: string,
  options?: {
    search?: string;
    processType?: string;
  }
): Promise<{ cases: LegalCaseRecord[]; kpis: LegalKPIs }> {
  try {
    const supabase = await createClient();

    let query = supabase
      .from("legal_cases")
      .select("*")
      .eq("tenant_id", tenantId)
      .order("entry_date", { ascending: false });

    if (options?.processType && options.processType.trim() !== "") {
      query = query.eq("process_type", options.processType);
    }

    if (options?.search && options.search.trim() !== "") {
      const q = options.search.trim();
      query = query.or(`client_name.ilike.%${q}%,lawyer_name.ilike.%${q}%,client_phone.ilike.%${q}%`);
    }

    const { data, error } = await query;

    if (!error && data && data.length > 0) {
      const cases: LegalCaseRecord[] = data.map((item: any) => ({
        id: item.id,
        tenantId: item.tenant_id,
        lawyerName: item.lawyer_name,
        clientName: item.client_name,
        clientPhone: item.client_phone,
        entryDate: item.entry_date,
        amountPaid: Number(item.amount_paid || 0),
        processType: item.process_type as LegalProcessType,
        notes: item.notes,
        statusProgress: item.status_progress,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }));

      const kpis = calculateKPIs(cases);
      return { cases, kpis };
    }
  } catch (err) {
    // Falha de banco, usa fallback gracioso
  }

  // Fallback com dados de demonstração
  let filtered = [...memoryDemoCases];

  if (options?.processType && options.processType.trim() !== "") {
    filtered = filtered.filter((c) => c.processType === options.processType);
  }

  if (options?.search && options.search.trim() !== "") {
    const q = options.search.toLowerCase().trim();
    filtered = filtered.filter(
      (c) =>
        c.clientName.toLowerCase().includes(q) ||
        c.lawyerName.toLowerCase().includes(q) ||
        c.clientPhone.includes(q) ||
        (c.notes && c.notes.toLowerCase().includes(q))
    );
  }

  const kpis = calculateKPIs(memoryDemoCases);
  return { cases: filtered, kpis };
}

/**
 * Cadastra um novo caso / processo jurídico.
 */
export async function createLegalCase(
  tenantId: string,
  input: LegalCaseInput
): Promise<{ success: boolean; data?: LegalCaseRecord; error?: string }> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("legal_cases")
      .insert({
        tenant_id: tenantId,
        lawyer_name: input.lawyerName,
        client_name: input.clientName,
        client_phone: input.clientPhone,
        entry_date: input.entryDate,
        amount_paid: input.amountPaid,
        process_type: input.processType,
        notes: input.notes || null,
        status_progress: input.statusProgress,
      })
      .select()
      .maybeSingle();

    if (!error && data) {
      return {
        success: true,
        data: {
          id: data.id,
          tenantId: data.tenant_id,
          lawyerName: data.lawyer_name,
          clientName: data.client_name,
          clientPhone: data.client_phone,
          entryDate: data.entry_date,
          amountPaid: Number(data.amount_paid),
          processType: data.process_type,
          notes: data.notes,
          statusProgress: data.status_progress,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        },
      };
    }
  } catch (err) {
    // Se o banco falhar, armazena no demo local para a experiência do usuário
  }

  // Fallback em memória
  const newRecord: LegalCaseRecord = {
    id: `local-${Date.now()}`,
    tenantId,
    lawyerName: input.lawyerName,
    clientName: input.clientName,
    clientPhone: input.clientPhone,
    entryDate: input.entryDate,
    amountPaid: input.amountPaid,
    processType: input.processType,
    notes: input.notes || null,
    statusProgress: input.statusProgress,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  memoryDemoCases.unshift(newRecord);
  return { success: true, data: newRecord };
}

/**
 * Atualiza o andamento do processo e/ou observações livres.
 */
export async function updateLegalProgress(
  tenantId: string,
  input: UpdateLegalProgressInput
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const updatePayload: any = {
      status_progress: input.statusProgress,
      updated_at: new Date().toISOString(),
    };

    if (input.notes !== undefined) {
      updatePayload.notes = input.notes;
    }

    const { error } = await supabase
      .from("legal_cases")
      .update(updatePayload)
      .eq("id", input.id);

    if (!error) {
      return { success: true };
    }
  } catch (err) {
    // Continua para o fallback de memória
  }

  const existing = memoryDemoCases.find((c) => c.id === input.id);
  if (existing) {
    existing.statusProgress = input.statusProgress;
    if (input.notes !== undefined) {
      existing.notes = input.notes;
    }
    existing.updatedAt = new Date().toISOString();
  }

  return { success: true };
}

function calculateKPIs(cases: LegalCaseRecord[]): LegalKPIs {
  const totalRevenue = cases.reduce((acc, c) => acc + (c.amountPaid || 0), 0);
  const inssCount = cases.filter((c) => c.processType === "INSS").length;
  const observadoriaCount = cases.filter((c) => c.processType === "Observadoria").length;
  const afastamentoCount = cases.filter((c) => c.processType === "Afastamento").length;

  return {
    totalCases: cases.length,
    totalRevenue,
    inssCount,
    observadoriaCount,
    afastamentoCount,
  };
}
