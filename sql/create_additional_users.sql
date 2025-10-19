-- Script para criar usuários adicionais de teste
-- Execute este script no SQL Editor do Supabase

-- IMPORTANTE: Estes usuários precisam ser criados primeiro no Supabase Auth
-- Vá para Authentication > Users e crie os usuários manualmente, depois execute este script

-- 1. Criar perfis para usuários que você criar manualmente no Supabase Auth

-- Exemplo: Médico
-- (Substitua o email pelo que você criar no Auth)
INSERT INTO profiles (id, name, email, clinic_id, permissions, active) VALUES 
(
    (SELECT id FROM auth.users WHERE email = 'medico@teste.com'),
    'Dra. Maria Santos',
    'medico@teste.com',
    '550e8400-e29b-41d4-a716-446655440000',
    '["medico"]'::jsonb,
    true
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    clinic_id = EXCLUDED.clinic_id,
    permissions = EXCLUDED.permissions;

-- Exemplo: Secretária
INSERT INTO profiles (id, name, email, clinic_id, permissions, active) VALUES 
(
    (SELECT id FROM auth.users WHERE email = 'secretaria@teste.com'),
    'Ana Costa',
    'secretaria@teste.com',
    '550e8400-e29b-41d4-a716-446655440000',
    '["secretaria"]'::jsonb,
    true
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    clinic_id = EXCLUDED.clinic_id,
    permissions = EXCLUDED.permissions;

-- Exemplo: Faturamento
INSERT INTO profiles (id, name, email, clinic_id, permissions, active) VALUES 
(
    (SELECT id FROM auth.users WHERE email = 'faturamento@teste.com'),
    'Carlos Oliveira',
    'faturamento@teste.com',
    '550e8400-e29b-41d4-a716-446655440000',
    '["faturamento"]'::jsonb,
    true
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    clinic_id = EXCLUDED.clinic_id,
    permissions = EXCLUDED.permissions;

-- Verificar usuários criados
SELECT 
    p.name,
    p.email,
    p.permissions,
    p.active,
    au.email_confirmed_at
FROM profiles p
JOIN auth.users au ON p.id = au.id
WHERE p.clinic_id = '550e8400-e29b-41d4-a716-446655440000'
ORDER BY p.created_at;