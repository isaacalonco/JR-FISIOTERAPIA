-- ==============================================================================
-- JR FISIOTERAPIA 1.0 - SEED COMPLETO DE DEMONSTRAÇÃO E APRESENTAÇÃO A CLIENTES
-- Popula Tenancy, Unidades, Profissionais, Serviços, Pacientes, Agendamentos,
-- Prontuários SOAP, Lançamentos Financeiros e JR Club para uma apresentação perfeita!
-- ==============================================================================

DO $$
DECLARE
    v_tenant_id UUID;
    v_clinic_id UUID;
    v_unit_matriz UUID;
    v_unit_aguas_claras UUID;
    
    -- IDs de Especialidades
    v_spec_fisio UUID;
    v_spec_quiropraxia UUID;
    v_spec_med UUID;
    v_spec_pilates UUID;

    -- IDs de Profissionais
    v_prof_lucas UUID;
    v_prof_amanda UUID;
    v_prof_rodrigo UUID;
    v_prof_beatriz UUID;

    -- IDs de Serviços
    v_serv_eval UUID;
    v_serv_fisio UUID;
    v_serv_quiro UUID;
    v_serv_pilates UUID;
    v_serv_med UUID;

    -- IDs de Pacientes
    v_pac_gabriel UUID;
    v_pac_fernanda UUID;
    v_pac_roberto UUID;
    v_pac_camila UUID;
    v_pac_marcelo UUID;

    -- ID de Agendamento
    v_appt_1 UUID;
    v_appt_2 UUID;
BEGIN

    -- 1. BUSCAR OU CRIAR TENANT E CLÍNICA
    SELECT id INTO v_tenant_id FROM tenants WHERE slug = 'jr-saude' LIMIT 1;
    IF v_tenant_id IS NULL THEN
        INSERT INTO tenants (name, slug, cnpj, is_active)
        VALUES ('JR Fisioterapia & Saúde Multidisciplinar', 'jr-saude', '12.345.678/0001-99', TRUE)
        RETURNING id INTO v_tenant_id;
    END IF;

    SELECT id INTO v_clinic_id FROM clinics WHERE tenant_id = v_tenant_id LIMIT 1;
    IF v_clinic_id IS NULL THEN
        INSERT INTO clinics (tenant_id, name, trade_name, cnpj, is_active)
        VALUES (v_tenant_id, 'JR Fisioterapia Matriz', 'JR Fisioterapia & Reabilitação', '12.345.678/0001-99', TRUE)
        RETURNING id INTO v_clinic_id;
    END IF;

    -- 2. CRIAR FILIAIS / UNIDADES FÍSICAS
    INSERT INTO units (tenant_id, clinic_id, name, code, address_street, address_city, address_state, phone, is_active)
    VALUES (v_tenant_id, v_clinic_id, 'Unidade Matriz - Asa Sul', 'MATRIZ-01', 'SEPS 709/909 Bloco A Sala 204', 'Brasília', 'DF', '(61) 3344-5566', TRUE)
    RETURNING id INTO v_unit_matriz;

    INSERT INTO units (tenant_id, clinic_id, name, code, address_street, address_city, address_state, phone, is_active)
    VALUES (v_tenant_id, v_clinic_id, 'Unidade Filial - Águas Claras', 'FILIAL-02', 'Rua das Pitangueiras Lote 5 Ed. Manhattan', 'Brasília', 'DF', '(61) 3567-8900', TRUE)
    RETURNING id INTO v_unit_aguas_claras;

    -- 3. ESPECIALIDADES
    INSERT INTO specialties (tenant_id, name, council_code, is_active)
    VALUES (v_tenant_id, 'Fisioterapia e Traumatologia', 'CREFITO', TRUE)
    RETURNING id INTO v_spec_fisio;

    INSERT INTO specialties (tenant_id, name, council_code, is_active)
    VALUES (v_tenant_id, 'Quiropraxia & Terapia Manual', 'CREFITO', TRUE)
    RETURNING id INTO v_spec_quiropraxia;

    INSERT INTO specialties (tenant_id, name, council_code, is_active)
    VALUES (v_tenant_id, 'Ortopedia e Medicina Esportiva', 'CRM', TRUE)
    RETURNING id INTO v_spec_med;

    INSERT INTO specialties (tenant_id, name, council_code, is_active)
    VALUES (v_tenant_id, 'Pilates Clínico & Postural', 'CREFITO', TRUE)
    RETURNING id INTO v_spec_pilates;

    -- 4. PROFISSIONAIS DA SAÚDE
    INSERT INTO professionals (tenant_id, clinic_id, specialty_id, full_name, council_number, email, phone, commission_rate, is_active)
    VALUES (v_tenant_id, v_clinic_id, v_spec_fisio, 'Dr. Lucas Silveira', 'CREFITO-3/88492-F', 'lucas.silveira@jrfisioterapia.com.br', '(61) 99111-2233', 60.00, TRUE)
    RETURNING id INTO v_prof_lucas;

    INSERT INTO professionals (tenant_id, clinic_id, specialty_id, full_name, council_number, email, phone, commission_rate, is_active)
    VALUES (v_tenant_id, v_clinic_id, v_spec_quiropraxia, 'Dra. Amanda Vasconcelos', 'CREFITO-3/94120-F', 'amanda.vasconcelos@jrfisioterapia.com.br', '(61) 99222-3344', 65.00, TRUE)
    RETURNING id INTO v_prof_amanda;

    INSERT INTO professionals (tenant_id, clinic_id, specialty_id, full_name, council_number, email, phone, commission_rate, is_active)
    VALUES (v_tenant_id, v_clinic_id, v_spec_med, 'Dr. Rodrigo Fontes', 'CRM-DF 45210', 'rodrigo.fontes@jrfisioterapia.com.br', '(61) 99333-4455', 70.00, TRUE)
    RETURNING id INTO v_prof_rodrigo;

    INSERT INTO professionals (tenant_id, clinic_id, specialty_id, full_name, council_number, email, phone, commission_rate, is_active)
    VALUES (v_tenant_id, v_clinic_id, v_spec_pilates, 'Profª. Beatriz Lima', 'CREFITO-3/10234-F', 'beatriz.lima@jrfisioterapia.com.br', '(61) 99444-5566', 55.00, TRUE)
    RETURNING id INTO v_prof_beatriz;

    -- 5. SERVIÇOS E PROCEDIMENTOS
    INSERT INTO services (tenant_id, clinic_id, specialty_id, name, description, price, duration_minutes, is_active)
    VALUES (v_tenant_id, v_clinic_id, v_spec_fisio, 'Avaliação Fisioterapêutica e Biomecânica', 'Anamnese profunda, testes de amplitude articular, força e plano terapêutico', 180.00, 60, TRUE)
    RETURNING id INTO v_serv_eval;

    INSERT INTO services (tenant_id, clinic_id, specialty_id, name, description, price, duration_minutes, is_active)
    VALUES (v_tenant_id, v_clinic_id, v_spec_fisio, 'Sessão de Fisioterapia Traumato-Ortopédica', 'Reabilitação articular, cinesioterapia e recursos eletroterapêuticos', 120.00, 45, TRUE)
    RETURNING id INTO v_serv_fisio;

    INSERT INTO services (tenant_id, clinic_id, specialty_id, name, description, price, duration_minutes, is_active)
    VALUES (v_tenant_id, v_clinic_id, v_spec_quiropraxia, 'Quiropraxia & Terapia Manual Intensiva', 'Ajuste vertebrais, descompressão articular e liberação miofascial', 160.00, 40, TRUE)
    RETURNING id INTO v_serv_quiro;

    INSERT INTO services (tenant_id, clinic_id, specialty_id, name, description, price, duration_minutes, is_active)
    VALUES (v_tenant_id, v_clinic_id, v_spec_pilates, 'Sessão de Pilates Clínico Terapêutico', 'Exercícios no Reformer, Cadillac e Chair focado em estabilização postural', 95.00, 50, TRUE)
    RETURNING id INTO v_serv_pilates;

    INSERT INTO services (tenant_id, clinic_id, specialty_id, name, description, price, duration_minutes, is_active)
    VALUES (v_tenant_id, v_clinic_id, v_spec_med, 'Consulta Médica Ortopédica', 'Avaliação diagnóstica especializada, laudo e prescrição médica', 300.00, 45, TRUE)
    RETURNING id INTO v_serv_med;

    -- 6. PACIENTES
    INSERT INTO patients (tenant_id, full_name, cpf, birth_date, gender, phone, email, is_active)
    VALUES (v_tenant_id, 'Gabriel Henrique Alves', '342.189.508-12', '1992-05-14', 'MASCULINO', '(61) 99123-4567', 'gabriel.alves@email.com', TRUE)
    RETURNING id INTO v_pac_gabriel;

    INSERT INTO patients (tenant_id, full_name, cpf, birth_date, gender, phone, email, is_active)
    VALUES (v_tenant_id, 'Fernanda Montenegro Paes', '812.943.101-55', '1984-11-20', 'FEMININO', '(61) 98234-5678', 'fernanda.paes@email.com', TRUE)
    RETURNING id INTO v_pac_fernanda;

    INSERT INTO patients (tenant_id, full_name, cpf, birth_date, gender, phone, email, is_active)
    VALUES (v_tenant_id, 'Roberto Carlos Oliveira', '194.823.774-09', '1968-03-30', 'MASCULINO', '(61) 99345-6789', 'roberto.carlos@email.com', TRUE)
    RETURNING id INTO v_pac_roberto;

    INSERT INTO patients (tenant_id, full_name, cpf, birth_date, gender, phone, email, is_active)
    VALUES (v_tenant_id, 'Camila Rocha Souza', '521.849.203-44', '1997-08-12', 'FEMININO', '(61) 98456-7890', 'camila.rocha@email.com', TRUE)
    RETURNING id INTO v_pac_camila;

    INSERT INTO patients (tenant_id, full_name, cpf, birth_date, gender, phone, email, is_active)
    VALUES (v_tenant_id, 'Marcelo Diniz Costa', '903.412.788-33', '1981-01-25', 'MASCULINO', '(61) 99567-8901', 'marcelo.diniz@email.com', TRUE)
    RETURNING id INTO v_pac_marcelo;

    -- 7. AGENDAMENTOS / CONSULTAS
    INSERT INTO appointments (tenant_id, clinic_id, unit_id, patient_id, professional_id, service_id, start_time, end_time, status)
    VALUES (v_tenant_id, v_clinic_id, v_unit_matriz, v_pac_gabriel, v_prof_lucas, v_serv_fisio, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '1 hour', 'CONCLUIDO')
    RETURNING id INTO v_appt_1;

    INSERT INTO appointments (tenant_id, clinic_id, unit_id, patient_id, professional_id, service_id, start_time, end_time, status)
    VALUES (v_tenant_id, v_clinic_id, v_unit_matriz, v_pac_fernanda, v_prof_amanda, v_serv_quiro, NOW(), NOW() + INTERVAL '45 minutes', 'EM_ATENDIMENTO')
    RETURNING id INTO v_appt_2;

    INSERT INTO appointments (tenant_id, clinic_id, unit_id, patient_id, professional_id, service_id, start_time, end_time, status)
    VALUES (v_tenant_id, v_clinic_id, v_unit_matriz, v_pac_roberto, v_prof_rodrigo, v_serv_med, NOW() + INTERVAL '2 hours', NOW() + INTERVAL '3 hours', 'CONFIRMADO');

    INSERT INTO appointments (tenant_id, clinic_id, unit_id, patient_id, professional_id, service_id, start_time, end_time, status)
    VALUES (v_tenant_id, v_clinic_id, v_unit_aguas_claras, v_pac_camila, v_prof_beatriz, v_serv_pilates, NOW() + INTERVAL '4 hours', NOW() + INTERVAL '5 hours', 'AGENDADO');

    -- 8. PRONTUÁRIOS & AVALIAÇÃO FISIOTERAPÊUTICA (SOAP)
    INSERT INTO physiotherapy_records (tenant_id, patient_id, professional_id, chief_complaint, pain_level, posture_analysis, clinical_goals, estimated_sessions)
    VALUES (v_tenant_id, v_pac_gabriel, v_prof_lucas, 'Dor aguda no joelho direito pós-reconstrução de LCA ao realizar flexão completa.', 7, 'Leve assimetria de quadril e fraqueza de quadríceps direito.', 'Restabelecer amplitude de movimento articular e ganho de força de quadríceps em 15 sessões.', 15);

    INSERT INTO clinical_evolutions (tenant_id, patient_id, professional_id, appointment_id, subjective, objective, assessment, plan, pain_level)
    VALUES (v_tenant_id, v_pac_gabriel, v_prof_lucas, v_appt_1, 'Paciente relata melhora gradativa da dor após exercícios de cinesioterapia.', 'ADM de flexão de joelho atingiu 110º sem compensações. Força grau 4 em quadríceps.', 'Evolução clínica positiva. Excelente aderência ao tratamento.', 'Manter fortalecimento isométrico e progredir para treino proprioceptivo.', 4);

    -- 9. LANÇAMENTOS FINANCEIROS (CONTAS A RECEBER E DESPESAS)
    INSERT INTO receivables (tenant_id, patient_id, description, amount, due_date, status, payment_method) VALUES
        (v_tenant_id, v_pac_gabriel, 'Sessão de Fisioterapia - Gabriel Alves', 120.00, CURRENT_DATE, 'PAGO', 'PIX'),
        (v_tenant_id, v_pac_fernanda, 'Quiropraxia Intensiva - Fernanda Paes', 160.00, CURRENT_DATE, 'PAGO', 'CARTAO_CREDITO'),
        (v_tenant_id, v_pac_roberto, 'Consulta Ortopédica - Roberto Carlos', 300.00, CURRENT_DATE, 'PENDENTE', 'PIX'),
        (v_tenant_id, v_pac_camila, 'Pacote Mensal Pilates - Camila Rocha', 380.00, CURRENT_DATE + INTERVAL '5 days', 'PENDENTE', 'CARTAO_CREDITO');

    INSERT INTO expenses (tenant_id, description, category, amount, due_date, status) VALUES
        (v_tenant_id, 'Aluguel do Imóvel - Unidade Matriz Asa Sul', 'ALUGUEL', 4500.00, CURRENT_DATE - INTERVAL '2 days', 'PAGO'),
        (v_tenant_id, 'Insumos Clínicos (Agulhas Dry Needling e Kinesio Tape)', 'MATERIAL_MEDICO', 850.00, CURRENT_DATE - INTERVAL '1 day', 'PAGO'),
        (v_tenant_id, 'Manutenção Preventiva de Aparelhos de Pilates', 'MANUTENCAO', 600.00, CURRENT_DATE + INTERVAL '10 days', 'PENDENTE');

    -- 10. JR CLUB & VOUCHERS
    INSERT INTO club_subscriptions (tenant_id, patient_id, plan_id, status, monthly_credits, current_credits, start_date)
    VALUES (v_tenant_id, v_pac_fernanda, (SELECT id FROM subscription_plans LIMIT 1), 'ATIVA', 4, 3, CURRENT_DATE - INTERVAL '15 days');

    RAISE NOTICE 'Seed de demonstração do JR FISIOTERAPIA 1.0 inserido com sucesso!';
END $$;
