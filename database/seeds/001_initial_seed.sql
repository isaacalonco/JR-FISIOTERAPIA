-- ==============================================================================
-- JR SAÚDE 1.0 - SEED INICIAL DE DESENVOLVIMENTO (001_initial_seed.sql)
-- Popula perfis do sistema, especialidades, serviços e tenant de demonstração
-- ==============================================================================

-- 1. PAPEIS DO SISTEMA (RBAC - OS 9 PERFIS OBRIGATÓRIOS)
INSERT INTO roles (name, description, is_system) VALUES
    ('ADMIN', 'Acesso total a todas as unidades, cadastros, configurações e financeiro', TRUE),
    ('RECEPCAO', 'Gestão de pacientes, agenda, triagem, check-in e recebimentos administrativos', TRUE),
    ('FISIOTERAPEUTA', 'Acesso aos seus pacientes, avaliações físicas, planos de tratamento e evoluções', TRUE),
    ('MEDICO', 'Acesso aos seus pacientes, consultas, prontuário médico e prescrições', TRUE),
    ('PSICOLOGO', 'Acesso aos seus atendimentos e prontuário psicológico com sigilo', TRUE),
    ('PILATES', 'Gestão de aulas, turmas, frequência e evolução de alunos', TRUE),
    ('FINANCEIRO', 'Contas a pagar/receber, conciliação, fluxo de caixa e repasses profissionais', TRUE),
    ('ADVOGADO', 'Acesso exclusivo ao módulo jurídico, processos, contratos e honorários', TRUE),
    ('PACIENTE', 'Acesso via portal do paciente a seus agendamentos, recibos e documentos liberados', TRUE)
ON CONFLICT (name) DO NOTHING;

-- 2. STATUS DE AGENDAMENTO
INSERT INTO appointment_statuses (code, name, color) VALUES
    ('AGENDADO', 'Agendado', '#0284c7'),
    ('CONFIRMADO', 'Confirmado pelo Paciente', '#059669'),
    ('EM_ATENDIMENTO', 'Em Atendimento', '#d97706'),
    ('CONCLUIDO', 'Atendimento Concluído', '#16a34a'),
    ('REMARCADO', 'Remarcado', '#6366f1'),
    ('CANCELADO', 'Cancelado', '#dc2626'),
    ('FALTOU', 'Falta Registrada', '#9ca3af')
ON CONFLICT (code) DO NOTHING;

-- 3. TENANT E CLÍNICA INICIAL
DO $$
DECLARE
    v_tenant_id UUID;
    v_clinic_id UUID;
    v_unit_id UUID;
    v_spec_fisio UUID;
    v_spec_med UUID;
    v_spec_psico UUID;
    v_spec_pilates UUID;
BEGIN
    -- Inserir Tenant Matriz JR Saúde
    INSERT INTO tenants (name, slug, cnpj, is_active)
    VALUES ('JR Saúde Serviços Médicos e Fisioterapia', 'jr-saude', '00.000.000/0001-00', TRUE)
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
    RETURNING id INTO v_tenant_id;

    -- Inserir Clínica Matriz
    INSERT INTO clinics (tenant_id, name, trade_name, cnpj, is_active)
    VALUES (v_tenant_id, 'JR Saúde Matriz', 'JR Saúde Clínica Multidisciplinar', '00.000.000/0001-00', TRUE)
    RETURNING id INTO v_clinic_id;

    -- Inserir Unidade Principal
    INSERT INTO units (tenant_id, clinic_id, name, code, address_city, address_state, is_active)
    VALUES (v_tenant_id, v_clinic_id, 'Unidade Central', 'UC-01', 'São Paulo', 'SP', TRUE)
    RETURNING id INTO v_unit_id;

    -- Inserir Salas da Unidade
    INSERT INTO rooms (tenant_id, unit_id, name, description, color) VALUES
        (v_tenant_id, v_unit_id, 'Consultório 01', 'Atendimento Médico e Avaliação', '#0284c7'),
        (v_tenant_id, v_unit_id, 'Sala Fisioterapia 01', 'Maca de Reabilitação e Cinesioterapia', '#0d9488'),
        (v_tenant_id, v_unit_id, 'Estúdio de Pilates', 'Aparelhos Reformer, Cadillac e Chair', '#059669');

    -- Inserir Especialidades
    INSERT INTO specialties (tenant_id, name, council_code, is_active)
    VALUES (v_tenant_id, 'Fisioterapia e Reabilitação', 'CREFITO', TRUE)
    RETURNING id INTO v_spec_fisio;

    INSERT INTO specialties (tenant_id, name, council_code, is_active)
    VALUES (v_tenant_id, 'Medica Geral / Ortopedia', 'CRM', TRUE)
    RETURNING id INTO v_spec_med;

    INSERT INTO specialties (tenant_id, name, council_code, is_active)
    VALUES (v_tenant_id, 'Psicologia Clínica', 'CRP', TRUE)
    RETURNING id INTO v_spec_psico;

    INSERT INTO specialties (tenant_id, name, council_code, is_active)
    VALUES (v_tenant_id, 'Pilates Clínico e Postural', 'CREFITO/CREF', TRUE)
    RETURNING id INTO v_spec_pilates;

    -- Inserir Serviços Padrão da JR Saúde
    INSERT INTO services (tenant_id, clinic_id, specialty_id, name, description, price, duration_minutes, is_active) VALUES
        (v_tenant_id, v_clinic_id, v_spec_fisio, 'Avaliação Fisioterapêutica Completa', 'Anamnese detalhada, testes funcionais e plano de tratamento', 150.00, 50, TRUE),
        (v_tenant_id, v_clinic_id, v_spec_fisio, 'Sessão de Fisioterapia Traumato-Ortopédica', 'Tratamento de reabilitação articular e muscular', 90.00, 45, TRUE),
        (v_tenant_id, v_clinic_id, v_spec_fisio, 'Quiropraxia e Terapia Manual', 'Ajuste biomecânico e alívio de dor vertebral', 130.00, 40, TRUE),
        (v_tenant_id, v_clinic_id, v_spec_fisio, 'Liberação Miofascial Instrumental', 'Terapia manual e instrumental para alívio de pontos gatilho', 110.00, 45, TRUE),
        (v_tenant_id, v_clinic_id, v_spec_pilates, 'Sessão de Pilates Clínico Personalizado', 'Exercícios terapêuticos de estabilização postural', 85.00, 50, TRUE),
        (v_tenant_id, v_clinic_id, v_spec_med, 'Consulta Médica Ortopédica', 'Diagnóstico médico e encaminhamento de exames', 250.00, 40, TRUE);

    -- Inserir Planos do JR Saúde Club
    INSERT INTO subscription_plans (tenant_id, name, plan_type, price_monthly, max_dependents, benefits_summary, is_active) VALUES
        (v_tenant_id, 'JR Saúde Club Individual', 'INDIVIDUAL', 99.00, 0, 'Descontos especiais de até 40% em sessões de fisioterapia, pilates e consultas parceiras', TRUE),
        (v_tenant_id, 'JR Saúde Club Familiar', 'FAMILIAR', 169.00, 3, 'Cobertura com descontos estendidos para titular e até 3 dependentes diretos', TRUE),
        (v_tenant_id, 'JR Saúde Corporativo', 'CORPORATIVO', 299.00, 10, 'Plano de saúde postural, ginástica laboral e ergonomia preventiva para empresas', TRUE);
END $$;
