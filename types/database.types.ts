/**
 * JR SAÚDE 1.0 - Tipos e Entidades do Banco de Dados Supabase (PostgreSQL)
 */

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  cnpj?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Clinic {
  id: string;
  tenantId: string;
  name: string;
  tradeName?: string | null;
  cnpj?: string | null;
  cnes?: string | null; // Cadastro Nacional de Estabelecimentos de Saúde
  phone?: string | null;
  email?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Unit {
  id: string;
  tenantId: string;
  clinicId: string;
  name: string;
  code: string;
  addressStreet?: string | null;
  addressNumber?: string | null;
  addressNeighborhood?: string | null;
  addressCity?: string | null;
  addressState?: string | null;
  addressZipCode?: string | null;
  phone?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Room {
  id: string;
  tenantId: string;
  unitId: string;
  name: string;
  description?: string | null;
  color?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Specialty {
  id: string;
  tenantId: string;
  name: string;
  councilCode?: string | null; // Ex: CREFITO, CRM, CRP
  isActive: boolean;
  createdAt: string;
}

export interface Professional {
  id: string;
  tenantId: string;
  profileId: string;
  specialtyId: string;
  councilNumber: string;
  councilState: string;
  bio?: string | null;
  commissionRateDefault: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Patient {
  id: string;
  tenantId: string;
  clinicId: string;
  fullName: string;
  cpf: string;
  rg?: string | null;
  birthDate: string;
  gender: "M" | "F" | "OUTRO";
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

export interface Service {
  id: string;
  tenantId: string;
  clinicId: string;
  name: string;
  description?: string | null;
  price: number;
  durationMinutes: number;
  specialtyId?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type AppointmentStatus =
  | "AGENDADO"
  | "CONFIRMADO"
  | "EM_ATENDIMENTO"
  | "CONCLUIDO"
  | "REMARCADO"
  | "CANCELADO"
  | "FALTOU";

export interface Appointment {
  id: string;
  tenantId: string;
  unitId: string;
  roomId?: string | null;
  patientId: string;
  professionalId: string;
  serviceId: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  notes?: string | null;
  cancellationReason?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  tenantId: string;
  userId?: string | null;
  action: string;
  entity: string;
  recordId?: string | null;
  oldData?: Record<string, unknown> | null;
  newData?: Record<string, unknown> | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: string;
}
