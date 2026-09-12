import { createClient } from "@/lib/supabase/server";
import { AppointmentInput, AppointmentStatusInput } from "@/utils/validators/appointment.schema";

export interface AppointmentRecord {
  id: string;
  tenantId: string;
  unitId: string;
  roomId?: string | null;
  patientId: string;
  professionalId: string;
  serviceId: string;
  startTime: string;
  endTime: string;
  status: string;
  notes?: string | null;
  cancellationReason?: string | null;
  createdAt: string;
  updatedAt: string;
  // Relacionamentos expandidos
  patientName?: string;
  patientPhone?: string;
  professionalName?: string;
  serviceName?: string;
  servicePrice?: number;
  roomName?: string;
  statusColor?: string;
}

export interface ConflictCheckResult {
  hasConflict: boolean;
  type?: "PROFESSIONAL" | "ROOM";
  message?: string;
}

/**
 * Algoritmo Anti-Colisão: Verifica se o profissional ou a sala possuem compromissos sobrepostos.
 */
export async function checkScheduleConflict(
  tenantId: string,
  professionalId: string,
  roomId: string | null | undefined,
  startTime: string,
  endTime: string,
  excludeAppointmentId?: string
): Promise<ConflictCheckResult> {
  const supabase = await createClient();

  // 1. Verifica conflito na agenda do Profissional
  let profQuery = supabase
    .from("appointments")
    .select("id, start_time, end_time")
    .eq("tenant_id", tenantId)
    .eq("professional_id", professionalId)
    .not("status", "in", '("CANCELADO","FALTOU")')
    .lt("start_time", endTime)
    .gt("end_time", startTime);

  if (excludeAppointmentId) {
    profQuery = profQuery.neq("id", excludeAppointmentId);
  }

  const { data: profConflicts } = await profQuery;

  if (profConflicts && profConflicts.length > 0) {
    return {
      hasConflict: true,
      type: "PROFESSIONAL",
      message: "O profissional já possui uma consulta agendada para este mesmo horário.",
    };
  }

  // 2. Verifica conflito na Sala (se informada)
  if (roomId) {
    let roomQuery = supabase
      .from("appointments")
      .select("id, start_time, end_time")
      .eq("tenant_id", tenantId)
      .eq("room_id", roomId)
      .not("status", "in", '("CANCELADO","FALTOU")')
      .lt("start_time", endTime)
      .gt("end_time", startTime);

    if (excludeAppointmentId) {
      roomQuery = roomQuery.neq("id", excludeAppointmentId);
    }

    const { data: roomConflicts } = await roomQuery;

    if (roomConflicts && roomConflicts.length > 0) {
      return {
        hasConflict: true,
        type: "ROOM",
        message: "A sala selecionada já está ocupada por outro atendimento neste horário.",
      };
    }
  }

  return { hasConflict: false };
}

/**
 * Listagem de Agendamentos por Data ou Filtros no Tenant.
 */
export async function listAppointments(
  tenantId: string,
  options?: {
    date?: string; // Formato AAAA-MM-DD
    professionalId?: string;
    patientId?: string;
    status?: string;
  }
): Promise<AppointmentRecord[]> {
  const supabase = await createClient();

  let query = supabase
    .from("appointments")
    .select(`
      *,
      patients ( full_name, phone ),
      professionals ( profiles ( full_name ) ),
      services ( name, price ),
      rooms ( name ),
      appointment_statuses ( color )
    `)
    .eq("tenant_id", tenantId)
    .order("start_time", { ascending: true });

  if (options?.date) {
    const startOfDay = `${options.date}T00:00:00.000Z`;
    const endOfDay = `${options.date}T23:59:59.999Z`;
    query = query.gte("start_time", startOfDay).lte("start_time", endOfDay);
  }

  if (options?.professionalId) {
    query = query.eq("professional_id", options.professionalId);
  }

  if (options?.patientId) {
    query = query.eq("patient_id", options.patientId);
  }

  if (options?.status) {
    query = query.eq("status", options.status);
  }

  const { data, error } = await query;

  if (error || !data) return [];

  return data.map((item: any) => ({
    id: item.id,
    tenantId: item.tenant_id,
    unitId: item.unit_id,
    roomId: item.room_id,
    patientId: item.patient_id,
    professionalId: item.professional_id,
    serviceId: item.service_id,
    startTime: item.start_time,
    endTime: item.end_time,
    status: item.status,
    notes: item.notes,
    cancellationReason: item.cancellation_reason,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
    patientName: item.patients?.full_name || "Paciente sem nome",
    patientPhone: item.patients?.phone || "",
    professionalName: item.professionals?.profiles?.full_name || "Profissional",
    serviceName: item.services?.name || "Consulta",
    servicePrice: Number(item.services?.price || 0),
    roomName: item.rooms?.name || "Sem Sala",
    statusColor: item.appointment_statuses?.color || "#0284c7",
  }));
}

/**
 * Criação de Agendamento com Verificação de Conflitos.
 */
export async function createAppointment(
  tenantId: string,
  unitId: string,
  input: AppointmentInput
): Promise<{ success: boolean; data?: AppointmentRecord; error?: string }> {
  // 1. Executa algoritmo anti-colisão
  const conflict = await checkScheduleConflict(
    tenantId,
    input.professionalId,
    input.roomId,
    input.startTime,
    input.endTime
  );

  if (conflict.hasConflict) {
    return { success: false, error: conflict.message };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("appointments")
    .insert({
      tenant_id: tenantId,
      unit_id: unitId,
      room_id: input.roomId || null,
      patient_id: input.patientId,
      professional_id: input.professionalId,
      service_id: input.serviceId,
      start_time: input.startTime,
      end_time: input.endTime,
      status: "AGENDADO",
      notes: input.notes || null,
    })
    .select()
    .single();

  if (error || !data) {
    return { success: false, error: "Falha ao gravar o agendamento no banco de dados." };
  }

  return {
    success: true,
    data: {
      id: data.id,
      tenantId: data.tenant_id,
      unitId: data.unit_id,
      roomId: data.room_id,
      patientId: data.patient_id,
      professionalId: data.professional_id,
      serviceId: data.service_id,
      startTime: data.start_time,
      endTime: data.end_time,
      status: data.status,
      notes: data.notes,
      cancellationReason: data.cancellation_reason,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    },
  };
}

/**
 * Transição de Status da Consulta (AGENDADO -> CONFIRMADO -> EM_ATENDIMENTO, etc.)
 */
export async function updateAppointmentStatus(
  input: AppointmentStatusInput
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const updatePayload: any = {
    status: input.status,
    updated_at: new Date().toISOString(),
  };

  if (input.status === "CANCELADO" && input.cancellationReason) {
    updatePayload.cancellation_reason = input.cancellationReason;
  }

  const { error } = await supabase
    .from("appointments")
    .update(updatePayload)
    .eq("id", input.appointmentId);

  if (error) {
    return { success: false, error: "Falha ao atualizar o status do agendamento." };
  }

  return { success: true };
}
