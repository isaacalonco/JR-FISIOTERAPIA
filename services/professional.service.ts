import { createClient } from "@/lib/supabase/server";

export interface ProfessionalRecord {
  id: string;
  tenantId: string;
  profileId: string;
  specialtyId: string;
  fullName: string;
  email: string;
  specialtyName: string;
  councilCode: string;
  councilNumber: string;
  councilState: string;
  commissionRateDefault: number;
  isActive: boolean;
}

export async function listProfessionals(tenantId: string): Promise<ProfessionalRecord[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("professionals")
    .select(`
      id,
      tenant_id,
      profile_id,
      specialty_id,
      council_number,
      council_state,
      commission_rate_default,
      is_active,
      profiles ( full_name, email ),
      specialties ( name, council_code )
    `)
    .eq("tenant_id", tenantId)
    .order("is_active", { ascending: false });

  if (error || !data) return [];

  return data.map((item: any) => ({
    id: item.id,
    tenantId: item.tenant_id,
    profileId: item.profile_id,
    specialtyId: item.specialty_id,
    fullName: item.profiles?.full_name || "Sem Nome",
    email: item.profiles?.email || "",
    specialtyName: item.specialties?.name || "Geral",
    councilCode: item.specialties?.council_code || "CONSELHO",
    councilNumber: item.council_number,
    councilState: item.council_state,
    commissionRateDefault: Number(item.commission_rate_default || 0),
    isActive: item.is_active,
  }));
}
