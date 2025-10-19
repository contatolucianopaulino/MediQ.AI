-- Script para criar perfil do usuário DrJoao
-- Execute este script no SQL Editor do Supabase

-- 1. Primeiro, vamos buscar o ID do usuário criado
-- (Execute esta query para ver o ID do usuário)
SELECT id, email, created_at FROM auth.users WHERE email = 'llllllluciano@gmail.com';

-- 2. Criar perfil para o usuário (substitua o ID pelo resultado da query acima)
-- IMPORTANTE: Substitua 'USER_ID_AQUI' pelo ID real do usuário da query acima

INSERT INTO profiles (id, name, email, clinic_id, permissions, active) VALUES 
(
    (SELECT id FROM auth.users WHERE email = 'llllllluciano@gmail.com'),
    'DrJoao',
    'llllllluciano@gmail.com',
    '550e8400-e29b-41d4-a716-446655440000',
    '["clinica_admin"]'::jsonb,
    true
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    clinic_id = EXCLUDED.clinic_id,
    permissions = EXCLUDED.permissions,
    active = EXCLUDED.active;

-- 3. Verificar se o perfil foi criado
SELECT 
    p.id,
    p.name,
    p.email,
    p.permissions,
    c.name as clinic_name
FROM profiles p
LEFT JOIN clinics c ON p.clinic_id = c.id
WHERE p.email = 'llllllluciano@gmail.com';

-- 4. Verificar se a clínica existe
SELECT id, name, email FROM clinics WHERE id = '550e8400-e29b-41d4-a716-446655440000';