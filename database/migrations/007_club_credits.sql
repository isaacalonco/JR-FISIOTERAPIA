-- ==============================================================================
-- JR SAÚDE 1.0 - FASE 7: MIGRAÇÃO 007 - JR SAÚDE CLUB (CRÉDITOS E ASSINATURAS)
-- ==============================================================================

-- 1. TABELA DE PLANOS DO CLUBE (club_plans)
CREATE TABLE IF NOT EXISTS public.club_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    monthly_price NUMERIC(10,2) NOT NULL CHECK (monthly_price >= 0),
    credits_per_month INTEGER NOT NULL CHECK (credits_per_month > 0),
    extra_credit_price NUMERIC(10,2) NOT NULL CHECK (extra_credit_price >= 0),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABELA DE ASSINATURAS DOS PACIENTES (club_subscriptions)
CREATE TABLE IF NOT EXISTS public.club_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES public.club_plans(id) ON DELETE RESTRICT,
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'ATIVO' CHECK (status IN ('ATIVO', 'INADIMPLENTE', 'CANCELADO', 'SUSPENSO')),
    current_period_start TIMESTAMPTZ NOT NULL,
    current_period_end TIMESTAMPTZ NOT NULL,
    monthly_credits_remaining INTEGER NOT NULL DEFAULT 0 CHECK (monthly_credits_remaining >= 0),
    auto_renew BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABELA DE TRANSAÇÕES DE CRÉDITOS (club_credit_transactions)
CREATE TABLE IF NOT EXISTS public.club_credit_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID NOT NULL REFERENCES public.club_subscriptions(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('RENOVACAO_MENSAL', 'COMPRA_AVULSA', 'CONSUMO_TITULAR', 'CONSUMO_TERCEIRO', 'EXPIRACAO', 'ESTORNO')),
    credits_amount INTEGER NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABELA DE VOUCHERS / AUTORIZAÇÕES PARA TERCEIROS (club_authorizations)
CREATE TABLE IF NOT EXISTS public.club_authorizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID NOT NULL REFERENCES public.club_subscriptions(id) ON DELETE CASCADE,
    authorization_code VARCHAR(50) UNIQUE NOT NULL,
    beneficiary_name VARCHAR(150) NOT NULL,
    beneficiary_cpf_or_phone VARCHAR(50) NOT NULL,
    credits_reserved INTEGER NOT NULL DEFAULT 1 CHECK (credits_reserved > 0),
    status VARCHAR(50) NOT NULL DEFAULT 'PENDENTE' CHECK (status IN ('PENDENTE', 'UTILIZADO', 'CANCELADO', 'EXPIRADO')),
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    used_at TIMESTAMPTZ
);

-- HABILITAR RLS NAS TABELAS
ALTER TABLE public.club_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_authorizations ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS DE SEGURANÇA MULTI-TENANT (RLS)
CREATE POLICY club_plans_tenant_isolation ON public.club_plans
    FOR ALL USING (tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY club_subscriptions_tenant_isolation ON public.club_subscriptions
    FOR ALL USING (tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY club_credit_transactions_tenant_isolation ON public.club_credit_transactions
    FOR ALL USING (
        subscription_id IN (
            SELECT id FROM public.club_subscriptions 
            WHERE tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
        )
    );

CREATE POLICY club_authorizations_tenant_isolation ON public.club_authorizations
    FOR ALL USING (
        subscription_id IN (
            SELECT id FROM public.club_subscriptions 
            WHERE tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
        )
    );

-- ÍNDICES PARA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_club_plans_tenant ON public.club_plans(tenant_id);
CREATE INDEX IF NOT EXISTS idx_club_subscriptions_patient ON public.club_subscriptions(patient_id);
CREATE INDEX IF NOT EXISTS idx_club_subscriptions_status ON public.club_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_club_authorizations_code ON public.club_authorizations(authorization_code);
