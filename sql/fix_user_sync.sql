-- Script para corrigir sincronização entre auth.users e profiles
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar usuários no auth.users que não têm perfil
SELECT 
    au.id,
    au.email,
    au.created_at,
    'SEM PERFIL' as status
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
WHERE p.id IS NULL
ORDER BY au.created_at DESC;

-- 2. Criar perfis para usuários que não têm (incluindo Shena)
INSERT INTO profiles (id, name, email, clinic_id, permissions, active)
SELECT 
    au.id,
    COALESCE(au.raw_user_meta_data->>'name', 
             SPLIT_PART(au.email, '@', 1)) as name,
    au.email,
    '550e8400-e29b-41d4-a716-446655440000' as clinic_id,
    CASE 
        WHEN au.email LIKE '%admin%' THEN '["clinica_admin"]'::jsonb
        WHEN au.email LIKE '%medico%' THEN '["medico"]'::jsonb
        WHEN au.email LIKE '%secretaria%' THEN '["secretaria"]'::jsonb
        WHEN au.email LIKE '%faturamento%' THEN '["faturamento"]'::jsonb
        ELSE '["medico"]'::jsonb
    END as permissions,
    true as active
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    clinic_id = EXCLUDED.clinic_id,
    permissions = EXCLUDED.permissions;

-- 3. Verificar todos os usuários após correção
SELECT 
    p.name,
    p.email,
    p.permissions,
    p.active,
    au.email_confirmed_at,
    au.created_at
FROM profiles p
JOIN auth.users au ON p.id = au.id
WHERE p.clinic_id = '550e8400-e29b-41d4-a716-446655440000'
ORDER BY au.created_at DESC;

-- 4. Contar usuários por tipo
SELECT 
    jsonb_array_elements_text(permissions) as permission_type,
    COUNT(*) as total
FROM profiles 
WHERE clinic_id = '550e8400-e29b-41d4-a716-446655440000'
GROUP BY jsonb_array_elements_text(permissions);

-- 5. Verificar se há usuários duplicados
SELECT email, COUNT(*) as total
FROM profiles 
WHERE clinic_id = '550e8400-e29b-41d4-a716-446655440000'
GROUP BY email
HAVING COUNT(*) > 1;