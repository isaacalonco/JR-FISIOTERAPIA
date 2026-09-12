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

  if (error || !data || data.length === 0) {
    return [
      {
        id: "s1111111-1111-4111-8111-111111111111",
        tenantId,
        clinicId: "c1111111-1111-4111-8111-111111111111",
        name: "Avaliação Fisioterapêutica e Biomecânica",
        specialtyName: "Fisioterapia e Traumatologia",
        description: "Anamnese profunda, testes de amplitude articular, força e plano terapêutico personalizado.",
        price: 180,
        durationMinutes: 60,
        isActive: true,
      },
      {
        id: "s2222222-2222-4222-8222-222222222222",
        tenantId,
        clinicId: "c1111111-1111-4111-8111-111111111111",
        name: "Sessão de Fisioterapia Traumato-Ortopédica",
        specialtyName: "Fisioterapia e Traumatologia",
        description: "Reabilitação articular, cinesioterapia e recursos eletroterapêuticos avançados.",
        price: 120,
        durationMinutes: 45,
        isActive: true,
      },
      {
        id: "s3333333-3333-4333-8333-333333333333",
        tenantId,
        clinicId: "c1111111-1111-4111-8111-111111111111",
        name: "Quiropraxia & Terapia Manual Intensiva",
        specialtyName: "Quiropraxia & Terapia Manual",
        description: "Ajuste vertebrais, descompressão articular e liberação de pontos gatilho.",
        price: 160,
        durationMinutes: 40,
        isActive: true,
      },
      {
        id: "s4444444-4444-4444-8444-444444444444",
        tenantId,
        clinicId: "c1111111-1111-4111-8111-111111111111",
        name: "Sessão de Pilates Clínico Terapêutico",
        specialtyName: "Pilates Clínico & Postural",
        description: "Exercícios no Reformer, Cadillac e Chair focados na estabilização postural.",
        price: 95,
        durationMinutes: 50,
        isActive: true,
      },
      {
        id: "s5555555-5555-4555-8555-555555555555",
        tenantId,
        clinicId: "c1111111-1111-4111-8111-111111111111",
        name: "Consulta Médica Ortopédica",
        specialtyName: "Ortopedia e Medicina Esportiva",
        description: "Avaliação diagnóstica especializada, laudo médico e prescrição de exames.",
        price: 300,
        durationMinutes: 45,
        isActive: true,
      },
    ];
  }

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
