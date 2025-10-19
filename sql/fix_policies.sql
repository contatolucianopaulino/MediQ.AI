-- Script para corrigir políticas RLS com recursão infinita
-- Execute este script no SQL Editor do Supabase

-- 1. Remover todas as políticas existentes
DROP POLICY IF EXISTS "Usuários podem ver apenas sua própria clínica" ON clinics;
DROP POLICY IF EXISTS "Apenas admins podem atualizar clínica" ON clinics;
DROP POLICY IF EXISTS "Usuários podem ver perfis da mesma clínica" ON profiles;
DROP POLICY IF EXISTS "Usuários podem atualizar próprio perfil" ON profiles;
DROP POLICY IF EXISTS "Apenas admins podem inserir novos usuários" ON profiles;
DROP POLICY IF EXISTS "Apenas admins podem deletar usuários" ON profiles;

-- 2. Desabilitar RLS temporariamente para inserir dados
ALTER TABLE clinics DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- 3. Inserir dados de teste sem RLS
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

-- 4. Reabilitar RLS
ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 5. Criar políticas mais simples e sem recursão

-- Políticas para clinics
CREATE POLICY "Permitir leitura de clínicas" ON clinics
    FOR SELECT USING (true);

CREATE POLICY "Permitir inserção de clínicas" ON clinics
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir atualização de clínicas" ON clinics
    FOR UPDATE USING (true);

-- Políticas para profiles
CREATE POLICY "Permitir leitura de perfis" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "Permitir inserção de perfis" ON profiles
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir atualização de perfis" ON profiles
    FOR UPDATE USING (true);

CREATE POLICY "Permitir exclusão de perfis" ON profiles
    FOR DELETE USING (true);

-- 6. Verificar se os dados foram inseridos
SELECT 'Clínicas cadastradas:' as info;
SELECT id, name, email, phone FROM clinics;

SELECT 'Tabelas e políticas configuradas com sucesso!' as status;