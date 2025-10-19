-- Script para inserir dados de teste no MediQ.AI
-- Execute este script no SQL Editor do Supabase após criar as tabelas

-- 1. Inserir clínica de teste
INSERT INTO clinics (id, name, email, phone, address, modules) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440000',
    'Clínica MediQ Teste',
    'admin@mediqteste.com',
    '(11) 99999-9999',
    'Rua da Saúde, 123 - São Paulo, SP',
    '["prescricao_ia", "transcricao_audio"]'::jsonb
)
ON CONFLICT (email) DO UPDATE SET
    name = EXCLUDED.name,
    phone = EXCLUDED.phone,
    address = EXCLUDED.address,
    modules = EXCLUDED.modules;

-- 2. Inserir usuários de teste na tabela auth.users (simulando cadastro)
-- IMPORTANTE: Estes usuários precisam ser criados via interface ou API do Supabase Auth
-- Este script apenas prepara os perfis para quando os usuários forem criados

-- Perfil do Administrador (será criado quando o usuário se cadastrar)
INSERT INTO profiles (id, name, email, clinic_id, permissions, active) VALUES 
(
    '11111111-1111-1111-1111-111111111111',
    'Dr. João Silva',
    'admin@mediqteste.com',
    '550e8400-e29b-41d4-a716-446655440000',
    '["clinica_admin"]'::jsonb,
    true
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    clinic_id = EXCLUDED.clinic_id,
    permissions = EXCLUDED.permissions;

-- Perfil do Médico
INSERT INTO profiles (id, name, email, clinic_id, permissions, active) VALUES 
(
    '22222222-2222-2222-2222-222222222222',
    'Dra. Maria Santos',
    'maria@mediqteste.com',
    '550e8400-e29b-41d4-a716-446655440000',
    '["medico"]'::jsonb,
    true
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    clinic_id = EXCLUDED.clinic_id,
    permissions = EXCLUDED.permissions;

-- Perfil da Secretária
INSERT INTO profiles (id, name, email, clinic_id, permissions, active) VALUES 
(
    '33333333-3333-3333-3333-333333333333',
    'Ana Costa',
    'ana@mediqteste.com',
    '550e8400-e29b-41d4-a716-446655440000',
    '["secretaria"]'::jsonb,
    true
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    clinic_id = EXCLUDED.clinic_id,
    permissions = EXCLUDED.permissions;

-- Perfil do Faturamento
INSERT INTO profiles (id, name, email, clinic_id, permissions, active) VALUES 
(
    '44444444-4444-4444-4444-444444444444',
    'Carlos Oliveira',
    'carlos@mediqteste.com',
    '550e8400-e29b-41d4-a716-446655440000',
    '["faturamento"]'::jsonb,
    true
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    clinic_id = EXCLUDED.clinic_id,
    permissions = EXCLUDED.permissions;

-- Verificar se os dados foram inseridos
SELECT 'Clínicas cadastradas:' as info;
SELECT id, name, email, phone FROM clinics;

SELECT 'Perfis cadastrados:' as info;
SELECT id, name, email, permissions FROM profiles;