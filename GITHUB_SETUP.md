# 📚 Como Subir o MediQ.AI para o GitHub

## 🔧 Pré-requisitos

1. **Instalar Git**: https://git-scm.com/download/win
2. **Conta no GitHub**: https://github.com
3. **Git configurado** com seu nome e email

## 📋 Passo a Passo

### 1. Instalar Git (se não tiver)

1. Baixe: https://git-scm.com/download/win
2. Instale com configurações padrão
3. Reinicie o terminal/PowerShell

### 2. Configurar Git (primeira vez)

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"
```

### 3. Criar Repositório no GitHub

1. Acesse: https://github.com
2. Clique em **"New repository"**
3. Nome: `mediq-ai`
4. Descrição: `🧠 SaaS de IA para Saúde - Plataforma modular para médicos e clínicas`
5. **Público** ou **Privado** (sua escolha)
6. ❌ **NÃO** marque "Add a README file"
7. Clique em **"Create repository"**

### 4. Subir o Código

#### Opção A: Usando o Script (Recomendado)

**Windows:**
```cmd
setup-git.bat
```

**Linux/Mac:**
```bash
chmod +x setup-git.sh
./setup-git.sh
```

#### Opção B: Comandos Manuais

```bash
# Inicializar Git
git init

# Adicionar arquivos
git add .

# Primeiro commit
git commit -m "🎉 Initial commit: MediQ.AI - SaaS de IA para Saúde"

# Conectar ao GitHub (substitua SEU-USUARIO)
git remote add origin https://github.com/contatolucianopaulino/MediQ.AI.git

# Definir branch principal
git branch -M main

# Enviar para GitHub
git push -u origin main
```

### 5. Verificar Upload

1. Acesse seu repositório no GitHub
2. Deve ver todos os arquivos
3. README.md deve aparecer formatado

## 🚀 Deploy Automático

Após subir para GitHub:

### Vercel (Recomendado)
1. Acesse: https://vercel.com
2. **"Import Project"**
3. Conecte GitHub
4. Selecione `mediq-ai`
5. Configure variáveis:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
6. **Deploy**!

### Netlify
1. Acesse: https://netlify.com
2. **"New site from Git"**
3. Conecte GitHub
4. Selecione `mediq-ai`
5. Build settings:
   - Build command: `echo "Build completed"`
   - Publish directory: `public`
6. Configure variáveis de ambiente
7. **Deploy**!

## 📁 Estrutura do Repositório

```
mediq-ai/
├── 📁 public/              # Frontend files
│   ├── index.html          # Versão desenvolvimento
│   ├── index-production.html # Versão produção
│   ├── app.js             # JavaScript principal
│   ├── app-production.js  # JS otimizado
│   └── styles.css         # Estilos CSS
├── 📁 sql/                # Scripts do banco
│   ├── create_tables.sql  # Criar tabelas
│   ├── fix_policies.sql   # Corrigir RLS
│   └── fix_user_sync.sql  # Sincronizar usuários
├── 📁 config/             # Configurações
│   └── supabase.js        # Config Supabase
├── server-hybrid.js       # Servidor Node.js
├── vercel.json           # Config Vercel
├── netlify.toml          # Config Netlify
├── package.json          # Dependências
├── .gitignore           # Arquivos ignorados
├── README.md            # Documentação
├── DEPLOY.md            # Guia de deploy
└── GITHUB_SETUP.md      # Este arquivo
```

## 🔄 Atualizações Futuras

Para enviar mudanças:

```bash
git add .
git commit -m "✨ Descrição da mudança"
git push
```

## 🐛 Problemas Comuns

### "Git não reconhecido"
- ✅ Instale Git: https://git-scm.com
- ✅ Reinicie terminal

### "Permission denied"
- ✅ Configure SSH keys ou use HTTPS
- ✅ Verifique credenciais GitHub

### "Repository not found"
- ✅ Verifique nome do repositório
- ✅ Confirme permissões

## 📞 Próximos Passos

1. ✅ Subir código para GitHub
2. ✅ Fazer deploy no Vercel/Netlify
3. ✅ Configurar domínio personalizado
4. ✅ Implementar módulos de IA
5. ✅ Adicionar analytics

**Boa sorte! 🚀**