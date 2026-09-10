# Modelagem e Estrutura de Banco de Dados - JR SAÚDE 1.0

## 1. Visão Geral
O banco de dados do JR SAÚDE é hospedado em PostgreSQL através do Supabase. Ele foi projetado para alta integridade referencial, garantia de tipos e conformidade com o princípio do menor privilégio através de Row Level Security (RLS).

---

## 2. Grupos de Tabelas

### 2.1 Multi-tenant e Estrutura Organizacional
- `tenants`: Instâncias da organização (preparado para multi-tenant futuro).
- `clinics`: Estabelecimentos de saúde com CNPJ e CNES.
- `units`: Unidades operacionais e filiais.
- `rooms`: Salas de atendimento e consultórios com identificação visual.

### 2.2 Autenticação e RBAC
- `roles`: 9 perfis nativos (`ADMIN`, `RECEPCAO`, `FISIOTERAPEUTA`, `MEDICO`, `PSICOLOGO`, `PILATES`, `FINANCEIRO`, `ADVOGADO`, `PACIENTE`).
- `permissions`: Permissões granulares divididas por módulo de sistema.
- `role_permissions`: Associação de permissões a papéis.
- `profiles`: Cadastro unificado de usuários vinculado a `auth.users(id)` do Supabase.
- `user_roles`: Associação de perfis de usuário aos papéis operacionais.

### 2.3 Profissionais, Especialidades e Serviços
- `specialties`: Especialidades clínicas (CREFITO, CRM, CRP).
- `professionals`: Registro profissional, número de conselho e percentual padrão de repasse.
- `services`: Catálogo de procedimentos com preço, duração e especialidade associada.

### 2.4 Pacientes e Agendamento
- `patients`: Cadastro completo com CPF único por tenant, contatos de emergência e histórico.
- `patient_dependents`: Vínculo entre titular e dependentes (útil para clubes de assinatura e menores).
- `appointment_statuses`: Status padronizados de agendamento.
- `appointments`: Agendamentos com prevenção de sobreposição de horários e rastreamento de faltas.

### 2.5 Prontuário Eletrônico e Fisioterapia
- `medical_records`: Prontuário médico com queixa principal, anamnese e conduta.
- `physiotherapy_records`: Ficha especializada de fisioterapia com diagnóstico biomecânico, escala de dor e avaliação postural.
- `clinical_evaluations`: Avaliações periódicas e de alta clínica.
- `clinical_evolutions`: Evolução diária/por sessão dos tratamentos.
- `treatment_plans`: Objetivos terapêuticos de curto e longo prazo.
- `documents`, `reports`, `prescriptions`: Arquivos anexados, laudos assinados e receituários.

### 2.6 JR Saúde Club e Financeiro
- `subscription_plans`: Planos de assinatura (Individual, Familiar, Corporativo).
- `subscriptions`: Contratos de assinatura ativos, inadimplentes ou cancelados.
- `receivables`: Contas a receber categorizadas.
- `expenses`: Despesas operacionais e custos fixos.
- `payments`: Registro de transações efetivadas (PIX, Cartão, Boleto, Dinheiro).
- `commissions` e `professional_payouts`: Regras configuráveis de rateio e fechamento de repasses.

### 2.7 Módulo Jurídico Isolado
- `legal_cases`: Processos e encaminhamentos jurídicos com estrita confidencialidade.
- `legal_documents`: Documentos jurídicos com consentimento e autorização expressa do paciente.
- `legal_events`: Prazos, audiências e movimentações do caso.

### 2.8 Trilha de Auditoria e Notificações
- `audit_logs`: Log imutável de ações críticas contendo usuário, entidade, ação, IP e payload anterior/novo.
- `notifications`: Notificações internas para profissionais e recepção.

---

## 3. Row Level Security (RLS)
Todas as tabelas possuem `ROW LEVEL SECURITY` habilitado. Nenhuma consulta do cliente acessa dados fora do seu respectivo `tenant_id` e permissões de perfil.
