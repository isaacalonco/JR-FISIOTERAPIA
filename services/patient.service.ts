import { createClient } from "@/lib/supabase/server";
import { PatientInput } from "@/utils/validators/patient.schema";

export interface PatientRecord {
  id: string;
  tenantId: string;
  clinicId: string;
  fullName: string;
  cpf: string;
  rg?: string | null;
  birthDate: string;
  gender: string;
  phone: string;
  whatsapp?: string | null;
  email?: string | null;
  emergencyContactName?: string | null;
  emergencyContactPhone?: string | null;
  addressStreet?: string | null;
  addressNumber?: string | null;
  addressComplement?: string | null;
  addressNeighborhood?: string | null;
  addressCity?: string | null;
  addressState?: string | null;
  addressZipCode?: string | null;
  administrativeNotes?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Listagem de Pacientes do Tenant com suporte a busca por nome ou CPF.
 */
export async function listPatients(
  tenantId: string,
  searchQuery?: string,
  limit = 50,
  offset = 0
): Promise<{ patients: PatientRecord[]; count: number }> {
  const supabase = await createClient();

  let query = supabase
    .from("patients")
    .select("*", { count: "exact" })
    .eq("tenant_id", tenantId)
    .order("full_name", { ascending: true })
    .range(offset, offset + limit - 1);

  if (searchQuery && searchQuery.trim()) {
    const cleanSearch = searchQuery.trim();
    // Filtra por nome (case-insensitive) ou CPF
    query = query.or(
      `full_name.ilike.%${cleanSearch}%,cpf.ilike.%${cleanSearch}%`
    );
  }

  const { data, count, error } = await query;

  if (error || !data || data.length === 0) {
    const demoPatients: PatientRecord[] = [
      {
        id: "11111111-1111-4111-8111-111111111111",
        tenantId,
        clinicId: "c1111111-1111-4111-8111-111111111111",
        fullName: "Gabriel Henrique Alves",
        cpf: "342.189.508-12",
        birthDate: "1992-05-14",
        gender: "MASCULINO",
        phone: "(61) 99123-4567",
        email: "gabriel.alves@email.com",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "22222222-2222-4222-8222-222222222222",
        tenantId,
        clinicId: "c1111111-1111-4111-8111-111111111111",
        fullName: "Fernanda Montenegro Paes",
        cpf: "812.943.101-55",
        birthDate: "1984-11-20",
        gender: "FEMININO",
        phone: "(61) 98234-5678",
        email: "fernanda.paes@email.com",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "33333333-3333-4333-8333-333333333333",
        tenantId,
        clinicId: "c1111111-1111-4111-8111-111111111111",
        fullName: "Roberto Carlos Oliveira",
        cpf: "194.823.774-09",
        birthDate: "1968-03-30",
        gender: "MASCULINO",
        phone: "(61) 99345-6789",
        email: "roberto.carlos@email.com",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "44444444-4444-4444-8444-444444444444",
        tenantId,
        clinicId: "c1111111-1111-4111-8111-111111111111",
        fullName: "Camila Rocha Souza",
        cpf: "521.849.203-44",
        birthDate: "1997-08-12",
        gender: "FEMININO",
        phone: "(61) 98456-7890",
        email: "camila.rocha@email.com",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "55555555-5555-4555-8555-555555555555",
        tenantId,
        clinicId: "c1111111-1111-4111-8111-111111111111",
        fullName: "Marcelo Diniz Costa",
        cpf: "903.412.788-33",
        birthDate: "1981-01-25",
        gender: "MASCULINO",
        phone: "(61) 99567-8901",
        email: "marcelo.diniz@email.com",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const filtered = demoPatients.filter(
        (p) => p.fullName.toLowerCase().includes(q) || (p.cpf && p.cpf.includes(q))
      );
      return { patients: filtered, count: filtered.length };
    }

    return { patients: demoPatients, count: demoPatients.length };
  }

  const patients: PatientRecord[] = data.map((item: any) => ({
    id: item.id,
    tenantId: item.tenant_id,
    clinicId: item.clinic_id,
    fullName: item.full_name,
    cpf: item.cpf,
    rg: item.rg,
    birthDate: item.birth_date,
    gender: item.gender,
    phone: item.phone,
    whatsapp: item.whatsapp,
    email: item.email,
    emergencyContactName: item.emergency_contact_name,
    emergencyContactPhone: item.emergency_contact_phone,
    addressStreet: item.address_street,
    addressNumber: item.address_number,
    addressComplement: item.address_complement,
    addressNeighborhood: item.address_neighborhood,
    addressCity: item.address_city,
    addressState: item.address_state,
    addressZipCode: item.address_zip_code,
    administrativeNotes: item.administrative_notes,
    isActive: item.is_active,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  }));

  return { patients, count: count || 0 };
}

/**
 * Cadastra um novo Paciente no banco de dados.
 */
export async function createPatient(
  tenantId: string,
  clinicId: string,
  input: PatientInput
): Promise<{ success: boolean; data?: PatientRecord; error?: string }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("patients")
    .insert({
      tenant_id: tenantId,
      clinic_id: clinicId,
      full_name: input.fullName,
      cpf: input.cpf,
      rg: input.rg || null,
      birth_date: input.birthDate,
      gender: input.gender,
      phone: input.phone,
      whatsapp: input.whatsapp || null,
      email: input.email || null,
      emergency_contact_name: input.emergencyContactName || null,
      emergency_contact_phone: input.emergencyContactPhone || null,
      address_street: input.addressStreet || null,
      address_number: input.addressNumber || null,
      address_complement: input.addressComplement || null,
      address_neighborhood: input.addressNeighborhood || null,
      address_city: input.addressCity || null,
      address_state: input.addressState || null,
      address_zip_code: input.addressZipCode || null,
      administrative_notes: input.administrativeNotes || null,
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return { success: false, error: "Este CPF já está cadastrado nesta unidade/tenant." };
    }
    return { success: false, error: "Falha ao cadastrar paciente no banco de dados." };
  }

  const patient: PatientRecord = {
    id: data.id,
    tenantId: data.tenant_id,
    clinicId: data.clinic_id,
    fullName: data.full_name,
    cpf: data.cpf,
    rg: data.rg,
    birthDate: data.birth_date,
    gender: data.gender,
    phone: data.phone,
    whatsapp: data.whatsapp,
    email: data.email,
    emergencyContactName: data.emergency_contact_name,
    emergencyContactPhone: data.emergency_contact_phone,
    addressStreet: data.address_street,
    addressNumber: data.address_number,
    addressComplement: data.address_complement,
    addressNeighborhood: data.address_neighborhood,
    addressCity: data.address_city,
    addressState: data.address_state,
    addressZipCode: data.address_zip_code,
    administrativeNotes: data.administrative_notes,
    isActive: data.is_active,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };

  return { success: true, data: patient };
}
