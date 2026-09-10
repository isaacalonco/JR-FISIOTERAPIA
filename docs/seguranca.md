# Diretrizes de Segurança da Informação e LGPD - JR SAÚDE 1.0

## 1. Princípios Fundamentais
Como sistema de gestão médica e de saúde, o **JR SAÚDE 1.0** opera sob as exigências da Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018), do Código de Ética Médica e do Código de Ética e Deontologia da Fisioterapia (Resoluções COFFITO).

---

## 2. Medidas de Proteção Implementadas

### 2.1 Isolamento e Gestão de Segredos
- **Separação de Chaves**: A chave pública `NEXT_PUBLIC_SUPABASE_ANON_KEY` opera restrita às políticas de RLS no PostgreSQL. A `SUPABASE_SERVICE_ROLE_KEY` é estritamente privada do backend e nunca é injetada em código client-side.
- **Git Shield**: O `.gitignore` bloqueia qualquer versão de arquivos `.env`, certificados, chaves privadas ou credenciais locais.

### 2.2 Headers HTTP de Hardening
Configurados centralmente em `next.config.ts`:
- `Strict-Transport-Security` (HSTS): Garante comunicação exclusiva via HTTPS com preload.
- `X-Frame-Options: DENY`: Impede ataques de clickjacking.
- `X-Content-Type-Options: nosniff`: Evita MIME sniffing malicioso.
- `Referrer-Policy: strict-origin-when-cross-origin`: Oculta dados sensíveis de URLs de referência.
- `Permissions-Policy`: Restringe recursos de hardware (câmera/microfone/geolocalização).

### 2.3 Proteção de Sessão e Cookies
- Cookies gerenciados via `@supabase/ssr` utilizando atributos:
  - `HttpOnly`: Impede leitura via scripts JavaScript maliciosos (anti-XSS).
  - `Secure`: Transmissão obrigatória por canal criptografado TLS/HTTPS.
  - `SameSite=Lax`: Proteção robusta contra CSRF (Cross-Site Request Forgery).

### 2.4 Sanitização e Prevenção de SQL Injection
- Todo acesso ao banco de dados ocorre através de queries parametrizadas do Supabase Client / ORM.
- Nenhuma query SQL crua com concatenação de strings de usuário é permitida.
- Schemas Zod sanitizam strings, números e tipos na entrada do servidor.

### 2.5 Trilha de Auditoria (Audit Logs)
- Registra criação, leitura confidencial, atualização ou exclusão de prontuários, dados financeiros e dados pessoais sensíveis.
- Registros em `audit_logs` contêm identificador de usuário, endereço IP, timestamp UTC, entidade e diff de dados.
