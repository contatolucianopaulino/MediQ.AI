# Configuração do Supabase para MediQ.AI

## Passo 1: Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Clique em "Start your project"
3. Crie uma conta ou faça login
4. Clique em "New Project"
5. Escolha sua organização
6. Preencha:
   - **Name**: MediQ-AI
   - **Database Password**: (crie uma senha forte)
   - **Region**: South America (São Paulo)
7. Clique em "Create new project"

## Passo 2: Obter Credenciais

1. No dashboard do projeto, vá para **Settings** > **API**
2. Copie:
   - **Project URL** (algo como: https://xxxxx.supabase.co)
   - **anon public** key (chave pública)

## Passo 3: Configurar o Projeto

1. Abra o arquivo `config/supabase.js`
2. Substitua:
   ```javascript
   const SUPABASE_URL = 'https://uifmnunesfevybpahahx.supabase.co';
   const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpZm1udW5lc2ZldnlicGFoYWh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4MTc1ODgsImV4cCI6MjA3NjM5MzU4OH0.J0eaMX0JEVch8gXDlZEVAhRddZd6-8wtZD5w4z4N20g';
   ```

## Passo 4: Criar Tabelas no Banco

1. No Supabase, vá para **SQL Editor**
2. Clique em "New query"
3. Copie e cole todo o conteúdo do arquivo `sql/create_tables.sql`
4. Clique em "Run" para executar

## Passo 5: Configurar Autenticação

1. Vá para **Authentication** > **Settings**
2. Em **Site URL**, adicione: `http://localhost:3000` (ou seu domínio)
3. Em **Redirect URLs**, adicione: `http://localhost:3000`
4. Salve as configurações

## Passo 6: Testar o Sistema

1. Abra o arquivo `public/index.html` no navegador
2. Teste o cadastro de uma nova clínica
3. Verifique se o login funciona
4. Teste a criação de usuários

## Estrutura das Tabelas

### `clinics`
- `id`: UUID (chave primária)
- `name`: Nome da clínica
- `email`: Email da clínica
- `phone`: Telefone
- `address`: Endereço
- `modules`: Array JSON dos módulos habilitados

### `profiles`
- `id`: UUID (referência ao auth.users)
- `name`: Nome do usuário
- `email`: Email do usuário
- `clinic_id`: Referência à clínica
- `permissions`: Array JSON das permissões
- `active`: Status ativo/inativo

## Segurança (RLS)

O sistema usa Row Level Security (RLS) para garantir que:
- Usuários só vejam dados da própria clínica
- Apenas admins possam criar/editar usuários
- Dados sejam isolados por clínica

## Próximos Passos

Após configurar o Supabase:
1. Implementar módulos de IA
2. Adicionar prontuário eletrônico
3. Integrar com N8N para processamento
4. Adicionar conformidade LGPD/HIPAA