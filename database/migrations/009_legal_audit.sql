-- Migration 009: Legal Module & Audit Trail
-- JR FISIOTERAPIA 1.0

-- Create legal_cases table
CREATE TABLE IF NOT EXISTS public.legal_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  case_number VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  case_type VARCHAR(50) NOT NULL, -- 'processo', 'notificacao', 'acordo', 'consultoria'
  status VARCHAR(50) NOT NULL DEFAULT 'em_andamento', -- 'em_andamento', 'concluido', 'arquivado', 'pendente'
  patient_id UUID REFERENCES public.patients(id) ON DELETE SET NULL,
  lawyer_name VARCHAR(200),
  description TEXT,
  due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create legal_contracts table
CREATE TABLE IF NOT EXISTS public.legal_contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  title VARCHAR(255) NOT NULL,
  contract_type VARCHAR(50) NOT NULL, -- 'prestacao_servico', 'termo_lgpd', 'parceria', 'trabalhista'
  status VARCHAR(50) NOT NULL DEFAULT 'rascunho', -- 'rascunho', 'vigente', 'encerrado', 'cancelado'
  patient_id UUID REFERENCES public.patients(id) ON DELETE SET NULL,
  content TEXT,
  signed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  user_id UUID,
  user_email VARCHAR(255),
  action VARCHAR(100) NOT NULL, -- e.g., 'CREATE_CASE', 'UPDATE_CONTRACT', 'DELETE_PATIENT', 'ACCESS_PATIENT_PRONTUARIO'
  entity_type VARCHAR(50) NOT NULL, -- e.g., 'legal_case', 'patient', 'appointment', 'prontuario'
  entity_id VARCHAR(100),
  ip_address VARCHAR(45),
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for fast filtering
CREATE INDEX IF NOT EXISTS idx_legal_cases_tenant ON public.legal_cases(tenant_id);
CREATE INDEX IF NOT EXISTS idx_legal_contracts_tenant ON public.legal_contracts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant ON public.audit_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
