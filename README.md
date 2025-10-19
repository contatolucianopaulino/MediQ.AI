# 🧠 MediQ.AI - SaaS de IA para Saúde

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/seu-usuario/mediq-ai)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/seu-usuario/mediq-ai)

Plataforma SaaS modular de Inteligência Artificial voltada para médicos e clínicas, com foco em auxiliar durante o atendimento clínico.

## 🚀 Demo Online

- **Demo**: [mediq-ai.vercel.app](https://mediq-ai.vercel.app)
- **Login de Teste**: `demo@mediq.ai` / `123456`

## ✨ Características Principais

- 🎨 **Design Premium**: Interface intuitiva com cores que remetem à saúde e confiança
- 🧩 **Sistema Modular**: Módulos podem ser habilitados/desabilitados por clínica
- 👥 **Gestão de Perfis**: Sistema completo de permissões para diferentes tipos de usuários
- 📈 **Arquitetura Escalável**: Preparado para crescimento e novas funcionalidades
- 🔒 **Segurança**: Row Level Security (RLS) + Políticas do Supabase
- ⚡ **Performance**: CDN global + Edge Functions

## Perfis e Permissões

### Perfil Clínica
- Espaço onde a clínica é cadastrada
- Container para todos os usuários da clínica

### Perfil Pessoa (com permissões específicas)
- **Médico**: Acesso aos módulos de IA e prontuários
- **Secretária**: Gestão de agendamentos e cadastros
- **Faturamento**: Controle financeiro e cobrança
- **Clínica Admin**: Criação de usuários e gestão de permissões

## Módulos Disponíveis

1. **Prescrição Inteligente por IA**
   - Análise de texto do médico
   - Sugestões de diagnóstico
   - Validação de interações medicamentosas

2. **Transcrição e Resumo de Áudio**
   - Transcrição automática de consultas
   - Geração de resumos estruturados
   - Identificação de pontos-chave

3. **Análise de Histórico do Paciente** (Roadmap)
   - Análise de padrões clínicos
   - Alertas de risco
   - Sugestões de exames

4. **Análise de Resultados de Exames** (Roadmap)
   - Interpretação de laudos
   - Correlação com diagnósticos
   - Referências clínicas

## Instalação e Configuração

### Pré-requisitos
- Conta no [Supabase](https://supabase.com) (gratuita)
- Navegador web moderno

### Configuração Rápida

1. **Criar projeto no Supabase**:
   - Acesse [supabase.com](https://supabase.com)
   - Crie um novo projeto
   - Anote a URL e chave anônima

2. **Configurar credenciais**:
   - Abra `config/supabase.js`
   - Substitua `SUPABASE_URL` e `SUPABASE_ANON_KEY`

3. **Criar tabelas**:
   - No Supabase, vá para SQL Editor
   - Execute o script `sql/create_tables.sql`

4. **Testar**:
   - Abra `public/index.html` no navegador
   - Cadastre uma clínica e teste o login

📖 **Instruções detalhadas**: Veja `SUPABASE_SETUP.md`

## Uso

1. **Cadastro de Clínica**: Acesse a tela de registro para criar uma nova clínica
2. **Login**: Use as credenciais do administrador para acessar o sistema
3. **Gestão de Usuários**: Adicione novos usuários e configure suas permissões
4. **Módulos**: Configure quais módulos estão disponíveis para sua clínica

## Tecnologias

- **Backend**: Supabase (PostgreSQL + Auth + APIs)
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Autenticação**: Supabase Auth (JWT automático)
- **Segurança**: Row Level Security (RLS) + Políticas do Supabase

## Roadmap

- [ ] Integração com N8N para processamento de IA
- [ ] Módulo de análise de histórico
- [ ] Módulo de análise de exames
- [ ] Prontuário eletrônico completo
- [ ] Conformidade LGPD/HIPAA
- [ ] API para integrações externas

## Contribuição

Este é um MVP focado nos perfis principais. Funcionalidades adicionais serão implementadas conforme roadmap.

## Licença

Proprietary - AnalisAI 2024