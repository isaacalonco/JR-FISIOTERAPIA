import { createClient } from "@/lib/supabase/server";
import { ServiceInput } from "@/utils/validators/service.schema";

export interface ServiceItem {
  id: string;
  tenantId: string;
  clinicId: string;
  specialtyId?: string | null;
  specialtyName?: string | null;
  name: string;
  description?: string | null;
  price: number;
  durationMinutes: number;
  isActive: boolean;
}

export async function listServices(tenantId: string): Promise<ServiceItem[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("services")
    .select(`
      id,
      tenant_id,
      clinic_id,
      specialty_id,
      name,
      description,
      price,
      duration_minutes,
      is_active,
      specialties ( name )
    `)
    .eq("tenant_id", tenantId)
    .order("name", { ascending: true });

  if (error || !data) return [];

  return data.map((item: any) => ({
    id: item.id,
    tenantId: item.tenant_id,
    clinicId: item.clinic_id,
    specialtyId: item.specialty_id,
    specialtyName: item.specialties?.name || "Multidisciplinar",
    name: item.name,
    description: item.description,
    price: Number(item.price),
    durationMinutes: item.duration_minutes,
    isActive: item.is_active,
  }));
}

export async function createService(
  tenantId: string,
  clinicId: string,
  input: ServiceInput
): Promise<{ success: boolean; data?: ServiceItem; error?: string }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("services")
    .insert({
      tenant_id: tenantId,
      clinic_id: clinicId,
      specialty_id: input.specialtyId || null,
      name: input.name,
      description: input.description || null,
      price: input.price,
      duration_minutes: input.durationMinutes,
    })
    .select(`
      id,
      tenant_id,
      clinic_id,
      specialty_id,
      name,
      description,
      price,
      duration_minutes,
      is_active,
      specialties ( name )
    `)
    .single();

  if (error || !data) {
    return { success: false, error: "Falha ao adicionar procedimento ao catálogo." };
  }

  return {
    success: true,
    data: {
      id: data.id,
      tenantId: data.tenant_id,
      clinicId: data.clinic_id,
      specialtyId: data.specialty_id,
      specialtyName: (data as any).specialties?.name || "Multidisciplinar",
      name: data.name,
      description: data.description,
      price: Number(data.price),
      durationMinutes: data.duration_minutes,
      isActive: data.is_active,
    },
  };
}
