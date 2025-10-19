# 🧠 MediQ.AI - SaaS de IA para Saúde

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/contatolucianopaulino/MediQ.AI)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/contatolucianopaulino/MediQ.AI)
[![GitHub](https://img.shields.io/github/license/contatolucianopaulino/MediQ.AI)](https://github.com/contatolucianopaulino/MediQ.AI)
[![GitHub stars](https://img.shields.io/github/stars/contatolucianopaulino/MediQ.AI)](https://github.com/contatolucianopaulino/MediQ.AI/stargazers)

**Plataforma SaaS modular de Inteligência Artificial voltada para médicos e clínicas**, com foco em auxiliar durante o atendimento clínico através de ferramentas de IA integradas.

## 🚀 Demo Online

- **🌐 Demo**: [mediq-ai.vercel.app](https://mediq-ai.vercel.app)
- **👤 Login de Teste**: `llllllluciano@gmail.com` / `123456`
- **📊 Status**: ✅ Online e Funcional

## ✨ Características Principais

- 🎨 **Design Premium**: Interface intuitiva com cores que remetem à saúde e confiança
- 🧩 **Sistema Modular**: Módulos podem ser habilitados/desabilitados por clínica
- 👥 **Gestão de Perfis**: Sistema completo de permissões para diferentes tipos de usuários
- 📈 **Arquitetura Escalável**: Preparado para crescimento e novas funcionalidades
- 🔒 **Segurança**: Row Level Security (RLS) + Políticas do Supabase
- ⚡ **Performance**: CDN global via Vercel + Edge Functions
- 🌐 **Multi-tenant**: Isolamento completo de dados por clínica
- 📱 **Responsivo**: Interface adaptável para desktop, tablet e mobile

## 🎯 Objetivo do Projeto

O **MediQ.AI** foi desenvolvido para **democratizar o acesso à Inteligência Artificial na área médica**, oferecendo uma plataforma SaaS que permite a médicos e clínicas de qualquer porte utilizarem ferramentas avançadas de IA para:

- **Auxiliar no diagnóstico** através de análise de sintomas
- **Otimizar prescrições** com validação de interações medicamentosas
- **Automatizar transcrições** de consultas e exames
- **Analisar históricos** clínicos para identificar padrões
- **Interpretar resultados** de exames laboratoriais e de imagem

### 🏥 Público-Alvo
- **Clínicas médicas** de pequeno e médio porte
- **Médicos autônomos** que buscam ferramentas de IA
- **Consultórios especializados** (cardiologia, endocrinologia, etc.)
- **Telemedicina** e atendimento remoto

## ✅ Funcionalidades Implementadas

### 🔐 **Sistema de Autenticação**
- ✅ Login/logout com Supabase Auth
- ✅ Cadastro de clínicas com administrador
- ✅ Recuperação de senha
- ✅ Sessões persistentes

### 👥 **Gestão de Usuários e Permissões**
- ✅ **Clínica Admin**: Criação de usuários e gestão de permissões
- ✅ **Médico**: Acesso aos módulos de IA e prontuários
- ✅ **Secretária**: Gestão de agendamentos e cadastros
- ✅ **Faturamento**: Controle financeiro e cobrança
- ✅ Sistema multi-tenant com isolamento por clínica

### 🎨 **Interface e UX**
- ✅ Dashboard responsivo e intuitivo
- ✅ Design premium com cores da área de saúde
- ✅ Navegação fluida entre seções
- ✅ Notificações em tempo real
- ✅ Modo claro otimizado para uso médico

### 🏗️ **Arquitetura e Infraestrutura**
- ✅ Deploy automatizado na Vercel
- ✅ Banco PostgreSQL via Supabase
- ✅ Row Level Security (RLS) implementado
- ✅ CDN global para performance
- ✅ SSL/HTTPS automático

## 🚧 Funcionalidades em Desenvolvimento

### 🧠 **Módulos de IA (Roadmap)**

#### 1. **Prescrição Inteligente por IA** 🔄
- Análise de texto do médico durante consulta
- Sugestões de diagnóstico baseadas em sintomas
- Validação de interações medicamentosas
- Orientações sobre parâmetros vitais (PA, glicemia, etc.)

#### 2. **Transcrição e Resumo de Áudio** 🔄
- Transcrição automática de consultas médicas
- Geração de resumos estruturados (anamnese, evolução)
- Identificação de pontos-chave clínicos
- Edição e validação pelo médico

#### 3. **Análise de Histórico do Paciente** 📋
- Análise de padrões na evolução clínica
- Identificação de tendências e riscos
- Alertas para complicações potenciais
- Sugestões de exames complementares

#### 4. **Análise de Resultados de Exames** 📊
- Interpretação de laudos laboratoriais
- Análise de exames de imagem
- Correlação com diagnósticos sugeridos
- Referências clínicas contextualizadas

### 🔗 **Integrações Planejadas**
- **N8N**: Workflows de automação médica
- **OpenAI/GPT**: Processamento de linguagem natural
- **FHIR**: Padrão de interoperabilidade em saúde
- **Prontuário Eletrônico**: Sistema completo de gestão

## 🛠️ Tecnologias Utilizadas

### **Frontend**
- **HTML5, CSS3, JavaScript (Vanilla)**: Interface responsiva e moderna
- **Font Awesome**: Ícones profissionais
- **CSS Grid/Flexbox**: Layout responsivo avançado

### **Backend & Banco de Dados**
- **Supabase**: 
  - PostgreSQL gerenciado
  - Autenticação JWT automática
  - Row Level Security (RLS)
  - APIs REST automáticas
  - Real-time subscriptions

### **Deploy & Infraestrutura**
- **Vercel**: 
  - Deploy automático via GitHub
  - CDN global
  - SSL/HTTPS automático
  - Edge Functions
  - Analytics integrado

### **Controle de Versão**
- **GitHub**: 
  - Repositório: `contatolucianopaulino/MediQ.AI`
  - Actions para CI/CD
  - Issues e Project Management

## 🚀 Instalação e Deploy

### **Opção 1: Deploy Direto (Recomendado)**
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/contatolucianopaulino/MediQ.AI)

1. Clique no botão acima
2. Conecte sua conta GitHub
3. Configure as variáveis de ambiente (opcional)
4. Deploy automático!

### **Opção 2: Configuração Manual**

#### **Pré-requisitos**
- Conta no [Supabase](https://supabase.com) (gratuita)
- Conta no [GitHub](https://github.com) 
- Conta na [Vercel](https://vercel.com) (gratuita)

#### **Passo a Passo**

1. **📋 Fork do Repositório**
   ```bash
   git clone https://github.com/contatolucianopaulino/MediQ.AI.git
   cd MediQ.AI
   ```

2. **🗄️ Configurar Supabase**
   - Crie projeto no [Supabase](https://supabase.com)
   - Execute scripts SQL na ordem:
     - `sql/create_tables.sql`
     - `sql/fix_policies.sql`
   - Anote URL e chave anônima

3. **🚀 Deploy na Vercel**
   - Conecte repositório na [Vercel](https://vercel.com)
   - Configure variáveis (opcional):
     - `SUPABASE_URL`
     - `SUPABASE_ANON_KEY`
   - Deploy automático!

📖 **Guias Detalhados**:
- `SUPABASE_SETUP.md` - Configuração completa do Supabase
- `DEPLOY.md` - Deploy em múltiplas plataformas
- `GITHUB_SETUP.md` - Configuração do repositório

## 📱 Como Usar

### **1. 🏥 Cadastro de Clínica**
- Acesse a demo ou sua instância
- Clique em "Cadastre sua clínica"
- Preencha dados da clínica e administrador
- Confirme email recebido

### **2. 👤 Login e Dashboard**
- Faça login com credenciais criadas
- Acesse dashboard com visão geral
- Navegue pelas seções: Usuários, Módulos

### **3. 👥 Gestão de Usuários**
- **Admins** podem criar novos usuários
- Definir permissões por tipo:
  - Médico, Secretária, Faturamento, Admin
- Controle de acesso granular

### **4. 🧩 Módulos**
- Visualizar módulos disponíveis
- Status: Habilitado/Desabilitado
- Configuração por clínica

## 🗂️ Estrutura do Projeto

```
MediQ.AI/
├── 📁 public/              # Arquivos originais
├── 📁 sql/                 # Scripts do banco
│   ├── create_tables.sql   # Criar estrutura
│   ├── fix_policies.sql    # Configurar RLS
│   └── fix_user_sync.sql   # Sincronizar dados
├── 📁 config/              # Configurações
├── 📄 index.html           # Página principal
├── 📄 app.js              # JavaScript principal
├── 📄 styles.css          # Estilos CSS
├── ⚙️ vercel.json         # Config Vercel
└── 📚 README.md           # Este arquivo
```

## 🔄 Roadmap de Desenvolvimento

### **🎯 Fase 1: MVP (Concluído)**
- ✅ Sistema de autenticação
- ✅ Gestão de usuários e permissões
- ✅ Interface responsiva
- ✅ Deploy na Vercel

### **🚀 Fase 2: IA Básica (Em Desenvolvimento)**
- 🔄 Integração com OpenAI/GPT
- 🔄 Módulo de prescrição inteligente
- 🔄 Transcrição de áudio básica
- 🔄 Validação de interações medicamentosas

### **🏗️ Fase 3: IA Avançada (Planejado)**
- 📋 Análise de histórico clínico
- 📋 Interpretação de exames
- 📋 Alertas de risco automáticos
- 📋 Sugestões de diagnóstico

### **🏥 Fase 4: Prontuário Completo (Futuro)**
- 📋 Prontuário eletrônico integrado
- 📋 Agendamento de consultas
- 📋 Gestão financeira
- 📋 Relatórios e analytics

### **🔒 Fase 5: Conformidade (Futuro)**
- 📋 Adequação LGPD/HIPAA
- 📋 Auditoria de acessos
- 📋 Backup automático
- 📋 Certificações de segurança

## 🤝 Contribuição

Este projeto está em **desenvolvimento ativo**. Contribuições são bem-vindas!

### **Como Contribuir:**
1. Fork o repositório
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Abra um Pull Request

### **Áreas que Precisam de Ajuda:**
- 🧠 Integração com APIs de IA
- 🎨 Melhorias na interface
- 🔒 Implementação de segurança
- 📱 Otimização mobile
- 🧪 Testes automatizados

## 📞 Suporte e Contato

- **📧 Email**: contato.lucianopaulino@gmail.com
- **🐛 Issues**: [GitHub Issues](https://github.com/contatolucianopaulino/MediQ.AI/issues)
- **💬 Discussões**: [GitHub Discussions](https://github.com/contatolucianopaulino/MediQ.AI/discussions)

## 📄 Licença

**MIT License** - Veja [LICENSE](LICENSE) para detalhes.

---

**Desenvolvido com ❤️ para revolucionar a medicina através da IA**

[![GitHub](https://img.shields.io/badge/GitHub-contatolucianopaulino-blue)](https://github.com/contatolucianopaulino)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)](https://vercel.com)
[![Supabase](https://img.shields.io/badge/Database-Supabase-green)](https://supabase.com)