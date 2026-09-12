-- ==============================================================================
-- JR FISIOTERAPIA 1.0 - MIGRAÇÃO FASE 8: WHATSAPP BUSINESS API E INTELIGÊNCIA ARTIFICIAL
-- ==============================================================================

-- 1. Tabela de Mensagens do WhatsApp
CREATE TABLE IF NOT EXISTS whatsapp_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    phone_number VARCHAR(30) NOT NULL,
    message_type VARCHAR(50) NOT NULL DEFAULT 'REMINDER_1DAY', -- REMINDER_1DAY, CONFIRMATION_REPLY, AI_TRIAGE, MANUAL
    content TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'QUEUED', -- QUEUED, SENT, DELIVERED, READ, FAILED
    confirmation_token VARCHAR(100) UNIQUE,
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

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

-- 5. Políticas de Segurança (RLS) por Tenant
CREATE POLICY whatsapp_messages_tenant_isolation ON whatsapp_messages
    FOR ALL USING (tenant_id = (SELECT tenant_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY ai_intake_transcriptions_tenant_isolation ON ai_intake_transcriptions
    FOR ALL USING (tenant_id = (SELECT tenant_id FROM profiles WHERE id = auth.uid()));
