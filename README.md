# JR SAÚDE 1.0 - Sistema de Gestão Clínica e Multidisciplinar

Sistema profissional de gestão desenvolvido para a clínica **JR Saúde**, arquitetado desde a base para operação multiunidade e preparado para expansão futura como plataforma SaaS multi-tenant.

---

## 1. Stack Tecnológica

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript (modo estrito), Tailwind CSS.
- **Backend**: Next.js Server Actions & Route Handlers com validação via Zod.
- **Banco de Dados**: PostgreSQL através do Supabase com Row Level Security (RLS).
- **Autenticação**: Supabase Auth com RBAC (9 perfis nativos).
- **Versionamento & Deploy**: Git, GitHub e Vercel.

---

## 2. Estrutura de Diretórios

```text
jr-saude/
├── app/                  # Rotas, layouts e páginas (Next.js App Router)
├── components/           # Componentes UI reutilizáveis
├── lib/                  # Clientes Supabase (Browser, Server, Middleware) e utilitários
├── services/             # Regras de negócio desacopladas
├── types/                # Definições de tipos TypeScript (Entidades, DTOs, RBAC)
├── hooks/                # Hooks customizados
├── utils/                # Formatadores (CPF, Moeda BRL, Datas) e validadores
├── database/             # Scripts e modelagem do banco de dados
│   ├── migrations/       # 001_initial_schema.sql (DDL completo com RLS)
│   ├── seeds/            # 001_initial_seed.sql (Perfis RBAC, serviços, clínica matriz)
│   └── sql/              # Queries de verificação e rotinas de banco
├── public/               # Assets estáticos
├── docs/                 # Manuais de engenharia e governança
│   ├── arquitetura.md    # Visão geral da arquitetura em camadas
│   ├── banco-de-dados.md # Dicionário de dados e relacionamentos
│   ├── seguranca.md      # Hardening, LGPD e proteção de dados
│   ├── permissoes.md     # Matriz RBAC dos 9 perfis
│   ├── api.md            # Padrões de Server Actions e APIs
│   └── roadmap.md        # Cronograma das 10 fases do projeto
├── tests/                # Testes unitários e de integração
├── scripts/              # Scripts auxiliares
├── .env.example          # Modelo de configuração de variáveis
├── package.json          # Dependências e scripts npm
├── tsconfig.json         # Configuração estrita do TypeScript
└── .gitignore            # Proteção contra commit de dados sensíveis
```

---

## 3. Pré-requisitos

- **Node.js**: Versão 20.x ou superior (testado com Node v24.18.0)
- **npm**: 10.x ou superior (ou pnpm / yarn)
- **Git**: 2.x instalado
- **Conta Supabase**: Projeto PostgreSQL configurado

---

## 4. Instalação e Configuração

### 4.1 Clonar o repositório e instalar dependências
```bash
# Instalar pacotes necessários
npm install
```

### 4.2 Configurar variáveis de ambiente
Copie o modelo de ambiente e preencha suas chaves do Supabase:
```bash
cp .env.example .env.local
```

Abra o arquivo `.env.local` e configure:
```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-publica
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key-privada
SESSION_SECRET=uma-chave-secreta-forte-com-mais-de-32-caracteres
```

> **IMPORTANTE**: A chave `SUPABASE_SERVICE_ROLE_KEY` é de uso exclusivo no backend. Ela **NUNCA** deve ter o prefixo `NEXT_PUBLIC_` e jamais deve ser exposta no navegador.

---

## 5. Configuração do Banco de Dados (Supabase)

1. Acesse o **SQL Editor** do seu painel Supabase.
2. Execute o arquivo [`database/migrations/001_initial_schema.sql`](file:///c:/Users/isaac/Desktop/JR.FISO/database/migrations/001_initial_schema.sql) para criar todas as tabelas, índices e habilitar Row Level Security (RLS).
3. Execute o arquivo [`database/seeds/001_initial_seed.sql`](file:///c:/Users/isaac/Desktop/JR.FISO/database/seeds/001_initial_seed.sql) para alimentar o sistema com os 9 perfis RBAC, os dados da unidade inicial e os serviços padrão.
4. Para validar a integridade, execute [`database/sql/verify_schema.sql`](file:///c:/Users/isaac/Desktop/JR.FISO/database/sql/verify_schema.sql).

---

## 6. Execução Local

```bash
# Iniciar o servidor de desenvolvimento
npm run dev
```

A aplicação estará acessível em: [http://localhost:3000](http://localhost:3000)

### Comandos Disponíveis:
- `npm run dev`: Inicia o servidor local de desenvolvimento.
- `npm run build`: Executa o build de produção do Next.js.
- `npm run start`: Inicia o servidor com a build de produção compilada.
- `npm run typecheck`: Valida a tipagem estrita do TypeScript sem compilação.
- `npm run lint`: Executa a verificação de regras de código com ESLint.

---

## 7. Práticas de Segurança e Hardening Implementadas

- **Isolamento de Secrets**: Arquivos `.env` bloqueados pelo `.gitignore`.
- **Separação de Chaves**: Supabase Anon Key para o client vs. Service Role Key privada para o server.
- **Row Level Security**: Todas as tabelas possuem RLS habilitado nativamente no PostgreSQL.
- **Headers HTTP Rigorosos**: Configuração de HSTS, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff` e `Referrer-Policy`.
- **Proteção de Cookies**: Flags `HttpOnly`, `Secure` e `SameSite=Lax` configuradas via `@supabase/ssr`.
- **Validação Dupla**: Sanitização no frontend e validação estrita com Zod no backend.
- **Auditoria**: Tabela `audit_logs` para rastrear qualquer operação de dados sensíveis ou alterações críticas.

---

## 8. Licença e Direitos

Projeto proprietário desenvolvido exclusivamente para o ecossistema **JR SAÚDE**.
