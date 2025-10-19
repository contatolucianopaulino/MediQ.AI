-- Tabela de clínicas
CREATE TABLE IF NOT EXISTS clinics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    modules JSONB DEFAULT '["prescricao_ia", "transcricao_audio"]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de usuários (integrada com auth.users do Supabase)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE,
    permissions JSONB DEFAULT '[]'::jsonb,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança para clinics
CREATE POLICY "Usuários podem ver apenas sua própria clínica" ON clinics
    FOR SELECT USING (
        id IN (
            SELECT clinic_id FROM profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Apenas admins podem atualizar clínica" ON clinics
    FOR UPDATE USING (
        id IN (
            SELECT clinic_id FROM profiles 
            WHERE id = auth.uid() 
            AND permissions ? 'clinica_admin'
        )
    );

-- Políticas de segurança para profiles
CREATE POLICY "Usuários podem ver perfis da mesma clínica" ON profiles
    FOR SELECT USING (
        clinic_id IN (
            SELECT clinic_id FROM profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Usuários podem atualizar próprio perfil" ON profiles
    FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Apenas admins podem inserir novos usuários" ON profiles
    FOR INSERT WITH CHECK (
        clinic_id IN (
            SELECT clinic_id FROM profiles 
            WHERE id = auth.uid() 
            AND permissions ? 'clinica_admin'
        )
    );

CREATE POLICY "Apenas admins podem deletar usuários" ON profiles
    FOR DELETE USING (
        clinic_id IN (
            SELECT clinic_id FROM profiles 
            WHERE id = auth.uid() 
            AND permissions ? 'clinica_admin'
        )
    );

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_clinics_updated_at BEFORE UPDATE ON clinics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Inserir dados de exemplo (opcional)
INSERT INTO clinics (name, email, phone, address) VALUES 
('Clínica Exemplo', 'admin@clinicaexemplo.com', '(11) 99999-9999', 'Rua das Flores, 123 - São Paulo, SP')
ON CONFLICT (email) DO NOTHING;