import { createClient } from "@/lib/supabase/server";
import { formatDateTimeBR } from "@/utils/formatters";

export interface WhatsAppMessageRecord {
  id: string;
  tenantId: string;
  appointmentId?: string | null;
  patientId: string;
  phoneNumber: string;
  messageType: string;
  content: string;
  status: string;
  confirmationToken?: string | null;
  sentAt?: string | null;
  createdAt: string;
  patientName?: string;
  professionalName?: string;
}

/**
 * Gera token único para confirmação de agendamento via link do WhatsApp
 */
export function generateConfirmationToken(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "jrfizio_";
  for (let i = 0; i < 24; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

/**
 * Dispara lembrete automatizado de consulta (1 dia antes) via WhatsApp
 */
export async function sendAppointmentReminder(tenantId: string, appointmentId: string) {
  const supabase = await createClient();

  // 1. Busca detalhes do agendamento
  const { data: appt, error: apptErr } = await supabase
    .from("appointments")
    .select(`
      id,
      tenant_id,
      start_time,
      patients ( id, full_name, phone ),
      professionals ( id, full_name ),
      services ( id, name )
    `)
    .eq("id", appointmentId)
    .eq("tenant_id", tenantId)
    .single();

  if (apptErr || !appt) {
    throw new Error("Agendamento não encontrado para envio de lembrete WhatsApp.");
  }

  const patient = appt.patients as unknown as { id: string; full_name: string; phone: string };
  const professional = appt.professionals as unknown as { id: string; full_name: string };
  const service = appt.services as unknown as { id: string; name: string };

  if (!patient || !patient.phone) {
    throw new Error("O paciente não possui número de celular cadastrado.");
  }

  const token = generateConfirmationToken();
  const formattedStart = formatDateTimeBR(appt.start_time);
  const timeOnly = formattedStart.split(" ")[1] || formattedStart;

  // Mensagem padronizada conforme especificação do cliente (Ronald Fizio)
  const messageText = `Olá ${patient.full_name}, você tem uma consulta de ${service.name} agendada com o(a) Dr(a). ${professional.full_name} amanhã às ${timeOnly}.\n\nPor favor, escolha uma opção abaixo para confirmar ou reagendar sua presença:\n✅ Confirmar: /confirm/${token}?action=CONFIRM\n❌ Cancelar: /confirm/${token}?action=CANCEL`;

  const now = new Date().toISOString();

  // 2. Atualiza agendamento com token e timestamp
  await supabase
    .from("appointments")
    .update({
      whatsapp_reminder_sent_at: now,
      whatsapp_confirmation_token: token,
    })
    .eq("id", appointmentId);

  // 3. Registra na log de mensagens
  const { data: messageRecord, error: msgErr } = await supabase
    .from("whatsapp_messages")
    .insert({
      tenant_id: tenantId,
      appointment_id: appointmentId,
      patient_id: patient.id,
      phone_number: patient.phone,
      message_type: "REMINDER_1DAY",
      content: messageText,
      status: "SENT",
      confirmation_token: token,
      sent_at: now,
    })
    .select()
    .single();

  if (msgErr) {
    throw new Error(`Erro ao registrar log de envio do WhatsApp: ${msgErr.message}`);
  }

  return {
    success: true,
    token,
    messageId: messageRecord.id,
    content: messageText,
  };
}

/**
 * Processa o clique do paciente no link de confirmação do WhatsApp
 */
export async function processWhatsAppConfirmationToken(
  token: string,
  action: "CONFIRM" | "CANCEL",
  reason?: string
) {
  const supabase = await createClient();

  // Busca agendamento por token
  const { data: appt, error: apptErr } = await supabase
    .from("appointments")
    .select("id, tenant_id, status, patients ( full_name )")
    .eq("whatsapp_confirmation_token", token)
    .single();

  if (apptErr || !appt) {
    return {
      success: false,
      message: "Token de confirmação inválido ou expirado.",
    };
  }

  const patientName = (appt.patients as any)?.full_name || "Paciente";

  if (action === "CONFIRM") {
    await supabase
      .from("appointments")
      .update({ status: "CONFIRMADO" })
      .eq("id", appt.id);

    await supabase
      .from("whatsapp_messages")
      .update({ status: "READ" })
      .eq("confirmation_token", token);

    return {
      success: true,
      action: "CONFIRM",
      patientName,
      message: `Consulta de ${patientName} confirmada com sucesso na Agenda!`,
    };
  } else {
    await supabase
      .from("appointments")
      .update({
        status: "CANCELADO",
        cancellation_reason: reason || "Cancelado pelo paciente via WhatsApp",
      })
      .eq("id", appt.id);

    await supabase
      .from("whatsapp_messages")
      .update({ status: "READ" })
      .eq("confirmation_token", token);

    return {
      success: true,
      action: "CANCEL",
      patientName,
      message: `Consulta de ${patientName} foi sinalizada para reagendamento/cancelamento.`,
    };
  }
}

/**
 * Lista o histórico de mensagens e lembretes enviados pelo WhatsApp
 */
export async function listWhatsAppMessages(tenantId: string): Promise<WhatsAppMessageRecord[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("whatsapp_messages")
      .select(`
        id,
        tenant_id,
        appointment_id,
        patient_id,
        phone_number,
        message_type,
        content,
        status,
        confirmation_token,
        sent_at,
        created_at,
        patients ( full_name )
      `)
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Aviso ao buscar mensagens do WhatsApp (migração pendente ou tabela vazia):", error.message || error);
      return [];
    }

    return (data || []).map((m: any) => ({
      id: m.id,
      tenantId: m.tenant_id,
      appointmentId: m.appointment_id,
      patientId: m.patient_id,
      phoneNumber: m.phone_number,
      messageType: m.message_type,
      content: m.content,
      status: m.status,
      confirmationToken: m.confirmation_token,
      sentAt: m.sent_at,
      createdAt: m.created_at,
      patientName: m.patients?.full_name || "Desconhecido",
    }));
  } catch (err: any) {
    console.warn("Exceção ao listar mensagens do WhatsApp:", err?.message || err);
    return [];
  }
}
