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

  if (error || !data) {
    return { patients: [], count: 0 };
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
