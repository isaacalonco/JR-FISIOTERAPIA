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

### ✅ FASE 2: Autenticação, Usuários e RBAC Server-Side (CONCLUÍDA)
- Integração ativa com Supabase Auth.
- Fluxo de login, recuperação de senha e alteração de credenciais.
- Gestão de perfis e atribuição de papéis (User Roles).
- Guardas de rota e verificação de permissões em Server Components e Server Actions.

---

### ✅ FASE 3: Dashboard Administrativo, Pacientes e Serviços (CONCLUÍDA)
- Dashboard administrativo com indicadores-chave (faturamento, atendimentos, novos pacientes).
- Módulo completo de Pacientes (cadastro, validação de CPF, contatos de emergência).
- Módulo de Profissionais e Especialidades.
- Catálogo de Serviços e configuração de preços.

---

### ✅ FASE 4: Agenda Médica e Multidisciplinar (CONCLUÍDA)
- Visualização diária, semanal e mensal de consultas.
- Agendamento por profissional, unidade e sala.
- Prevenção ativa de conflitos de horário.
- Fluxo de status (Agendado, Confirmado, Em Atendimento, Concluído, Cancelado, Falta).

---

### ✅ FASE 5: Prontuário Eletrônico e Módulo de Fisioterapia (CONCLUÍDA)
- Ficha de avaliação fisioterapêutica completa e histórico cronológico.
- Anamnese, exame físico e plano terapêutico.
- Registro de evolução diária por sessão com escala de dor.
- Emissão e assinatura de laudos e relatórios.

---

### ✅ FASE 6: Gestão Financeira e Repasses Profissionais (CONCLUÍDA)
- Contas a Pagar e a Receber.
- Fluxo de caixa diário e mensal.
- Regras dinâmicas e configuráveis de comissão e repasse por serviço/profissional.
- Relatórios de fechamento de repasse.

---

### ✅ FASE 7: JR Saúde Club (Assinaturas, Créditos & Fidelidade) (CONCLUÍDA)
- Gestão de planos de assinatura baseados em pacotes de créditos mensais recorrentes.
- Sistema de Vouchers/Autorizações de uso transferíveis para presentearem amigos/parentes.
- Controle de recargas avulsas e validador de recepção de vouchers.
- Auditoria de benefícios e consumo de créditos por atendimento.

---

### ✅ FASE 8: WhatsApp Business API e Módulo de Inteligência Artificial (CONCLUÍDA)
- Integração com WhatsApp Business API (Lembrete 1 dia antes com botões de ação).
- Links interativos de confirmação com atualização automática do status da Agenda Médica.
- Módulo de IA para transcrição de relatos de voz de pacientes e extração de sintomas.
- Trava de segurança clínica com validação e aprovação humana obrigatória antes de gravar no prontuário.

---

### 🚫 FASE 9: Módulo Jurídico e Auditoria Avançada (REMOVIDA A PEDIDO DO CLIENTE)
- Módulo dispensado conforme solicitação direta do cliente.

---

### ⏳ FASE 10: Relatórios Executivos, Indicadores e Multiunidade Avançado
- Relatórios consolidados de faturamento, produtividade e marketing.
- Painel de controle para múltiplas filiais e expansão para outras unidades.
- Exportação em PDF, Excel e CSV.
- Preparação final para o modelo SaaS comercial.
