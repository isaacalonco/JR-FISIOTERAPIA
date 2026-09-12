import { createClient } from "@/lib/supabase/server";
import { UnitInput } from "@/utils/validators/reports-unit.schema";

export interface UnitRecord {
  id: string;
  tenantId: string;
  name: string;
  address?: string | null;
  phone?: string | null;
  isActive: boolean;
  createdAt: string;
}

/**
 * Lista as filiais/unidades físicas do tenant
 */
export async function listUnits(tenantId: string): Promise<UnitRecord[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("units")
      .select("*")
      .eq("tenant_id", tenantId)
      .order("name", { ascending: true });

    if (error) {
      console.warn("Erro ao listar unidades:", error);
      return [];
    }

    return (data || []).map((u: any) => ({
      id: u.id,
      tenantId: u.tenant_id,
      name: u.name,
      address: u.address,
      phone: u.phone,
      isActive: u.is_active,
      createdAt: u.created_at,
    }));
  } catch (err) {
    console.warn("Erro em listUnits:", err);
    return [];
  }
}

/**
 * Cadastra uma nova unidade/filial
 */
export async function createUnit(
  tenantId: string,
  input: UnitInput
): Promise<{ success: boolean; data?: UnitRecord; error?: string }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("units")
      .insert({
        tenant_id: tenantId,
        name: input.name,
        address: input.address || null,
        phone: input.phone || null,
        is_active: input.is_active ?? true,
      })
      .select()
      .single();

    if (error || !data) {
      return { success: false, error: error?.message || "Erro ao cadastrar unidade." };
    }

    return {
      success: true,
      data: {
        id: data.id,
        tenantId: data.tenant_id,
        name: data.name,
        address: data.address,
        phone: data.phone,
        isActive: data.is_active,
        createdAt: data.created_at,
      },
    };
  } catch (err: any) {
    return { success: false, error: err.message || "Erro interno ao cadastrar unidade." };
  }
}
