-- ==============================================================================
-- JR FISIOTERAPIA 1.0 - MIGRAÇÃO FASE 8: WHATSAPP BUSINESS API E INTELIGÊNCIA ARTIFICIAL
-- ==============================================================================

-- 1. Tabela de Mensagens do WhatsApp (Garante que existe com todas as colunas necessárias)
CREATE TABLE IF NOT EXISTS whatsapp_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    phone_number VARCHAR(30),
    message_type VARCHAR(50) DEFAULT 'REMINDER_1DAY', -- REMINDER_1DAY, CONFIRMATION_REPLY, AI_TRIAGE, MANUAL
    content TEXT,
    status VARCHAR(30) DEFAULT 'QUEUED', -- QUEUED, SENT, DELIVERED, READ, FAILED
    confirmation_token VARCHAR(100) UNIQUE,
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Garante a adição de colunas caso a tabela whatsapp_messages tenha sido criada sem elas anteriormente
ALTER TABLE whatsapp_messages ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
ALTER TABLE whatsapp_messages ADD COLUMN IF NOT EXISTS appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL;
ALTER TABLE whatsapp_messages ADD COLUMN IF NOT EXISTS patient_id UUID REFERENCES patients(id) ON DELETE CASCADE;
ALTER TABLE whatsapp_messages ADD COLUMN IF NOT EXISTS phone_number VARCHAR(30);
ALTER TABLE whatsapp_messages ADD COLUMN IF NOT EXISTS message_type VARCHAR(50) DEFAULT 'REMINDER_1DAY';
ALTER TABLE whatsapp_messages ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE whatsapp_messages ADD COLUMN IF NOT EXISTS confirmation_token VARCHAR(100);

-- 2. Tabela de Transcrições de IA & Triagem Clínica (com Validação Humana)
CREATE TABLE IF NOT EXISTS ai_intake_transcriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    audio_url TEXT,
    raw_transcription TEXT NOT NULL,
    ai_summary TEXT NOT NULL,
    suggested_chief_complaint TEXT,
    suggested_pain_level INT CHECK (suggested_pain_level >= 0 AND suggested_pain_level <= 10),
    is_verified BOOLEAN DEFAULT FALSE NOT NULL,
    verified_by_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Atualizações na tabela de Agendamentos (Campos de rastreamento do WhatsApp)
ALTER TABLE appointments 
ADD COLUMN IF NOT EXISTS whatsapp_reminder_sent_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS whatsapp_confirmation_token VARCHAR(100);

-- 4. Habilitar RLS (Row Level Security)
ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_intake_transcriptions ENABLE ROW LEVEL SECURITY;

-- 5. Políticas de Segurança (RLS) por Tenant (Idempotentes)
DROP POLICY IF EXISTS whatsapp_messages_tenant_isolation ON whatsapp_messages;
CREATE POLICY whatsapp_messages_tenant_isolation ON whatsapp_messages
    FOR ALL USING (tenant_id = (SELECT tenant_id FROM profiles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS ai_intake_transcriptions_tenant_isolation ON ai_intake_transcriptions;
CREATE POLICY ai_intake_transcriptions_tenant_isolation ON ai_intake_transcriptions
    FOR ALL USING (tenant_id = (SELECT tenant_id FROM profiles WHERE user_id = auth.uid()));
