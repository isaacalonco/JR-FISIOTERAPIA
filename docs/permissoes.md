# Matriz de Permissões e Perfis (RBAC) - JR SAÚDE 1.0

## 1. Visão Geral
O sistema adota um modelo de Controle de Acesso Baseado em Papéis (**RBAC - Role-Based Access Control**), garantindo o princípio do menor privilégio e o isolamento obrigatório de informações sensíveis (especialmente registros médicos e casos jurídicos).

---

## 2. Matriz de Perfis e Escopos de Acesso

| Perfil | Escopo Principal | Prontuários | Agenda | Financeiro | Módulo Jurídico | Gestão / Config |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **ADMIN** | Acesso irrestrito a todas as áreas operacionais | Total | Total | Total | Parametrização | Total |
| **RECEPCAO** | Gestão de pacientes, triagem e agendamento | Bloqueado | Total | Recebimentos Balcão | Bloqueado | Bloqueado |
| **FISIOTERAPEUTA** | Avaliações físicas, conduta, evolução e laudos | Seus Pacientes | Seus Horários | Suas Comissões | Bloqueado | Bloqueado |
| **MEDICO** | Atendimento médico, diagnósticos e prescrições | Seus Pacientes | Seus Horários | Suas Comissões | Bloqueado | Bloqueado |
| **PSICOLOGO** | Sessões terapêuticas com sigilo profissional | Seus Pacientes | Seus Horários | Suas Comissões | Bloqueado | Bloqueado |
| **PILATES** | Aulas de pilates, evolução postural e turmas | Ficha Postural | Turmas Pilates | Apenas Próprio | Bloqueado | Bloqueado |
| **FINANCEIRO** | Contas a pagar/receber, conciliação e repasses | Bloqueado | Leitura | Total | Honorários | Config. Financeira |
| **ADVOGADO** | Processos, defesas, contratos e eventos | Bloqueado* | Seus Prazos | Honorários Próprios | Total (Autônomo) | Bloqueado |
| **PACIENTE** | Visualização de seus agendamentos e documentos | Somente Liberados | Agendar Próprio | Suas Faturas | Bloqueado | Bloqueado |

> **Nota sobre o Módulo Jurídico e Prontuários (*):**
> O módulo jurídico não tem acesso irrestrito aos prontuários clínicos. Qualquer compartilhamento de documento médico ou laudo com a assessoria jurídica exige **consentimento formal, explícito e auditável do paciente** registrado no sistema.
