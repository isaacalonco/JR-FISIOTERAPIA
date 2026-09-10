-- Script de verificação rápida da integridade do banco de dados JR SAÚDE
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- Contagem de tabelas criadas
SELECT count(*) as total_tabelas_publicas 
FROM pg_tables 
WHERE schemaname = 'public';

-- Verificar perfis RBAC cadastrados
SELECT name, description, is_system FROM roles ORDER BY name;

-- Verificar serviços cadastrados
SELECT name, price, duration_minutes, is_active FROM services ORDER BY name;
