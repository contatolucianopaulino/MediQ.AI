-- Script para verificar e corrigir o usuário Shena
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar se Shena existe no auth.users
SELECT 
    id,
    email,
    email_confirmed_at,
    created_at,
    raw_user_meta_data
FROM auth.users 
WHERE email ILIKE '%shena%' OR raw_user_meta_data->>'name' ILIKE '%shena%'
ORDER BY created_at DESC;

-- 2. Verificar se Shena tem perfil
SELECT 
    p.id,
    p.name,
    p.email,
    p.permissions,
    p.active,
    p.created_at
FROM profiles p
WHERE p.name ILIKE '%shena%' OR p.email ILIKE '%shena%'
ORDER BY p.created_at DESC;

-- 3. Se Shena existe no auth mas não tem perfil, criar o perfil
-- (Substitua o ID pelo resultado da primeira query)
INSERT INTO profiles (id, name, email, clinic_id, permissions, active)
SELECT 
    au.id,
    COALESCE(au.raw_user_meta_data->>'name', 'Shena') as name,
    au.email,
    '550e8400-e29b-41d4-a716-446655440000' as clinic_id,
    '["medico"]'::jsonb as permissions,
    true as active
FROM auth.users au
WHERE (au.email ILIKE '%shena%' OR au.raw_user_meta_data->>'name' ILIKE '%shena%')
  AND NOT EXISTS (SELECT 1 FROM profiles p WHERE p.id = au.id)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    clinic_id = EXCLUDED.clinic_id,
    permissions = EXCLUDED.permissions;

-- 4. Verificar resultado final
SELECT 
    p.name,
    p.email,
    p.permissions,
    p.active,
    au.email_confirmed_at,
    'PERFIL CRIADO' as status
FROM profiles p
JOIN auth.users au ON p.id = au.id
WHERE p.name ILIKE '%shena%' OR p.email ILIKE '%shena%'
ORDER BY p.created_at DESC;

-- 5. Listar todos os usuários da clínica para verificar
SELECT 
    p.name,
    p.email,
    p.permissions,
    p.active,
    p.created_at
FROM profiles p
WHERE p.clinic_id = '550e8400-e29b-41d4-a716-446655440000'
ORDER BY p.created_at DESC;