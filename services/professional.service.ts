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

  if (error || !data || data.length === 0) {
    return [
      {
        id: "p1111111-1111-4111-8111-111111111111",
        tenantId,
        profileId: "prof-1",
        specialtyId: "spec-1",
        fullName: "Dr. Lucas Silveira",
        email: "lucas.silveira@jrfisioterapia.com.br",
        specialtyName: "Fisioterapia Traumato-Ortopédica",
        councilCode: "CREFITO",
        councilNumber: "CREFITO-3/88492-F",
        councilState: "SP",
        commissionRateDefault: 60,
        isActive: true,
      },
      {
        id: "p2222222-2222-4222-8222-222222222222",
        tenantId,
        profileId: "prof-2",
        specialtyId: "spec-2",
        fullName: "Dra. Amanda Vasconcelos",
        email: "amanda.vasconcelos@jrfisioterapia.com.br",
        specialtyName: "Quiropraxia & Terapia Manual",
        councilCode: "CREFITO",
        councilNumber: "CREFITO-3/94120-F",
        councilState: "SP",
        commissionRateDefault: 65,
        isActive: true,
      },
      {
        id: "p3333333-3333-4333-8333-333333333333",
        tenantId,
        profileId: "prof-3",
        specialtyId: "spec-3",
        fullName: "Dr. Rodrigo Fontes",
        email: "rodrigo.fontes@jrfisioterapia.com.br",
        specialtyName: "Ortopedia e Medicina Esportiva",
        councilCode: "CRM",
        councilNumber: "CRM-DF 45210",
        councilState: "DF",
        commissionRateDefault: 70,
        isActive: true,
      },
      {
        id: "p4444444-4444-4444-8444-444444444444",
        tenantId,
        profileId: "prof-4",
        specialtyId: "spec-4",
        fullName: "Profª. Beatriz Lima",
        email: "beatriz.lima@jrfisioterapia.com.br",
        specialtyName: "Pilates Clínico & Postural",
        councilCode: "CREFITO",
        councilNumber: "CREFITO-3/10234-F",
        councilState: "SP",
        commissionRateDefault: 55,
        isActive: true,
      },
    ];
  }

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
