import { createClient } from "@/lib/supabase/server";

export interface AuditLogRecord {
  id: string;
  tenantId: string;
  userId?: string | null;
  userEmail?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  ipAddress?: string | null;
  details?: Record<string, any> | null;
  createdAt: string;
}

export interface LogAuditEventParams {
  tenantId: string;
  userId?: string | null;
  userEmail?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  ipAddress?: string | null;
  details?: Record<string, any> | null;
}

/**
 * Registra um evento auditável no sistema
 */
export async function logAuditEvent(params: LogAuditEventParams): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("audit_logs").insert({
      tenant_id: params.tenantId,
      user_id: params.userId || null,
      user_email: params.userEmail || null,
      action: params.action,
      entity_type: params.entityType,
      entity_id: params.entityId || null,
      ip_address: params.ipAddress || null,
      details: params.details || null,
    });

    if (error) {
      console.warn("Erro ao registrar log de auditoria:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("Falha ao registrar log de auditoria:", err);
    return false;
  }
}

/**
 * Lista os logs de auditoria com suporte a filtros
 */
export async function listAuditLogs(
  tenantId: string,
  filters?: {
    action?: string;
    entityType?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
  }
): Promise<AuditLogRecord[]> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("audit_logs")
      .select("*")
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: false });

    if (filters?.action) {
      query = query.ilike("action", `%${filters.action}%`);
    }
    if (filters?.entityType) {
      query = query.eq("entity_type", filters.entityType);
    }
    if (filters?.startDate) {
      query = query.gte("created_at", filters.startDate);
    }
    if (filters?.endDate) {
      query = query.lte("created_at", filters.endDate);
    }

    const limit = filters?.limit || 50;
    query = query.limit(limit);

    const { data, error } = await query;

    if (error) {
      console.warn("Erro ao listar logs de auditoria:", error);
      return [];
    }

    return (data || []).map((row: any) => ({
      id: row.id,
      tenantId: row.tenant_id,
      userId: row.user_id,
      userEmail: row.user_email,
      action: row.action,
      entityType: row.entity_type,
      entityId: row.entity_id,
      ipAddress: row.ip_address,
      details: row.details,
      createdAt: row.created_at,
    }));
  } catch (err) {
    console.warn("Erro ao executar listAuditLogs:", err);
    return [];
  }
}
