-- ==============================================================================
-- JR SAÚDE 1.0 - MÓDULO DO ADVOGADO / GESTÃO JURÍDICA E PREVIDENCIÁRIA
-- Migração: 011_legal_module.sql
-- ==============================================================================

CREATE TABLE IF NOT EXISTS legal_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    lawyer_name VARCHAR(255) NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    client_phone VARCHAR(50) NOT NULL,
    entry_date DATE NOT NULL,
    amount_paid NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    process_type VARCHAR(50) NOT NULL CHECK (process_type IN ('INSS', 'Observadoria', 'Afastamento')),
    notes TEXT,
    status_progress VARCHAR(255) NOT NULL DEFAULT 'Em Análise Inicial',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Índices para buscas rápidas e relatórios
CREATE INDEX IF NOT EXISTS idx_legal_cases_tenant ON legal_cases(tenant_id);
CREATE INDEX IF NOT EXISTS idx_legal_cases_process_type ON legal_cases(tenant_id, process_type);
CREATE INDEX IF NOT EXISTS idx_legal_cases_entry_date ON legal_cases(tenant_id, entry_date);
CREATE INDEX IF NOT EXISTS idx_legal_cases_client_name ON legal_cases(tenant_id, client_name);

-- Trigger de updated_at
CREATE OR REPLACE TRIGGER trg_legal_cases_updated_at
    BEFORE UPDATE ON legal_cases
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security (RLS)
ALTER TABLE legal_cases ENABLE ROW LEVEL SECURITY;

-- Políticas de isolamento Multi-Tenant
CREATE POLICY "legal_cases_tenant_isolation_select"
    ON legal_cases FOR SELECT
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID);

CREATE POLICY "legal_cases_tenant_isolation_insert"
    ON legal_cases FOR INSERT
    WITH CHECK (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID);

CREATE POLICY "legal_cases_tenant_isolation_update"
    ON legal_cases FOR UPDATE
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID);

CREATE POLICY "legal_cases_tenant_isolation_delete"
    ON legal_cases FOR DELETE
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID);
