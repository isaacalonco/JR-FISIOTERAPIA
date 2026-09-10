/**
 * JR SAÚDE 1.0 - Definições de Tipos e Perfis de Acesso (RBAC)
 */

export type UserRole =
  | "ADMIN"
  | "RECEPCAO"
  | "FISIOTERAPEUTA"
  | "MEDICO"
  | "PSICOLOGO"
  | "PILATES"
  | "FINANCEIRO"
  | "ADVOGADO"
  | "PACIENTE";

export interface UserProfile {
  id: string;
  userId: string;
  tenantId: string;
  clinicId: string;
  unitId?: string | null;
  fullName: string;
  email: string;
  phone?: string | null;
  cpf?: string | null;
  avatarUrl?: string | null;
  roles: UserRole[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PermissionDefinition {
  id: string;
  code: string;
  name: string;
  module:
    | "DASHBOARD"
    | "PATIENTS"
    | "APPOINTMENTS"
    | "CLINICAL"
    | "PHYSIOTHERAPY"
    | "FINANCIAL"
    | "SUBSCRIPTIONS"
    | "LEGAL"
    | "MARKETING"
    | "SETTINGS"
    | "AUDIT";
  description: string;
}

export interface SessionContext {
  userId: string;
  profile: UserProfile;
  activeRole: UserRole;
  permissions: string[];
}
