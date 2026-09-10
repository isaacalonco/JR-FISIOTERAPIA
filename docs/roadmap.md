# Cronograma e Roadmap de Desenvolvimento - JR SAÚDE 1.0

Este documento sintetiza as 10 fases ordenadas de implementação, respeitando a regra mandatória de desenvolvimento incremental e estabilidade funcional contínua.

---

## Fases do Projeto

### ✅ FASE 1: Fundação, Arquitetura e Configuração Base (CONCLUÍDA)
- Inicialização do projeto Next.js com App Router, React, TypeScript e Tailwind CSS.
- Configuração de Git, `.gitignore` seguro e `.env.example`.
- Estrutura completa de pastas da aplicação.
- Modelagem das tabelas do PostgreSQL e migrações SQL com suporte a RLS.
- Seed de desenvolvimento com os 9 perfis RBAC, especialidades e serviços padrão.
- Hardening de segurança inicial (headers HTTP, cookies HttpOnly, isolamento de secrets).
- Documentação técnica abrangente em `/docs` e `README.md`.

---

### ⏳ FASE 2: Autenticação, Usuários e RBAC Server-Side
- Integração ativa com Supabase Auth.
- Fluxo de login, recuperação de senha e alteração de credenciais.
- Gestão de perfis e atribuição de papéis (User Roles).
- Guardas de rota e verificação de permissões em Server Components e Server Actions.

---

### ⏳ FASE 3: Dashboard Administrativo, Pacientes e Serviços
- Dashboard administrativo com indicadores-chave (faturamento, atendimentos, novos pacientes).
- Módulo completo de Pacientes (cadastro, validação de CPF, contatos de emergência).
- Módulo de Profissionais e Especialidades.
- Catálogo de Serviços e configuração de preços.

---

### ⏳ FASE 4: Agenda Médica e Multidisciplinar
- Visualização diária, semanal e mensal de consultas.
- Agendamento por profissional, unidade e sala.
- Prevenção ativa de conflitos de horário.
- Fluxo de status (Agendado, Confirmado, Em Atendimento, Concluído, Cancelado, Falta).

---

### ⏳ FASE 5: Prontuário Eletrônico e Módulo de Fisioterapia
- Ficha de avaliação fisioterapêutica completa e histórico cronológico.
- Anamnese, exame físico e plano terapêutico.
- Registro de evolução diária por sessão com escala de dor.
- Emissão e assinatura de laudos e relatórios.

---

### ⏳ FASE 6: Gestão Financeira e Repasses Profissionais
- Contas a Pagar e a Receber.
- Fluxo de caixa diário e mensal.
- Regras dinâmicas e configuráveis de comissão e repasse por serviço/profissional.
- Relatórios de fechamento de repasse.

---

### ⏳ FASE 7: JR Saúde Club (Assinaturas e Fidelidade)
- Gestão de planos de assinatura (Individual, Familiar, Corporativo).
- Vínculo de titulares e dependentes.
- Controle de cobranças recorrentes, vencimentos e inadimplência.
- Auditoria de benefícios e utilização de descontos.

---

### ⏳ FASE 8: WhatsApp Business API e Módulo de Inteligência Artificial
- Integração oficial com WhatsApp Business Cloud API.
- Lembretes automáticos de consulta e confirmação ativa.
- Módulo de IA para transcrição de áudios de pacientes e organização de dados preliminares.
- Validação humana obrigatória para qualquer informação clínica.

---

### ⏳ FASE 9: Módulo Jurídico e Auditoria Avançada
- Módulo com segregação lógica e autonomia do profissional de direito.
- Gestão de processos, contratos e prazos.
- Protocolo de compartilhamento consentido de dados de pacientes.
- Trilha avançada de auditoria com exportação legal.

---

### ⏳ FASE 10: Relatórios Executivos, Indicadores e Multiunidade Avançado
- Relatórios consolidados de faturamento, produtividade e marketing.
- Painel de controle para múltiplas filiais e expansão para outras unidades.
- Exportação em PDF, Excel e CSV.
- Preparação final para o modelo SaaS comercial.
