# 🚀 Guia de Deploy - MediQ.AI

## 📋 Pré-requisitos

1. **Conta no Supabase**: [supabase.com](https://supabase.com)
2. **Conta no GitHub**: [github.com](https://github.com)
3. **Conta na plataforma de deploy** (Vercel, Netlify, ou Railway)

## 🔧 Configuração Inicial

### 1. Configurar Supabase

1. Crie um projeto no Supabase
2. Execute os scripts SQL na seguinte ordem:
   ```sql
   -- 1. Criar tabelas
   sql/create_tables.sql
   
   -- 2. Corrigir políticas
   sql/fix_policies.sql
   
   -- 3. Sincronizar usuários (opcional)
   sql/fix_user_sync.sql
   ```

3. Anote suas credenciais:
   - **Project URL**: `https://seu-projeto.supabase.co`
   - **Anon Key**: `sua-chave-anonima`

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` (local) ou configure nas variáveis da plataforma:

```env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua-chave-anonima-aqui
NODE_ENV=production
```

## 🌐 Deploy nas Plataformas

### 🥇 Vercel (Recomendado)

1. **Fork/Clone** este repositório
2. **Conecte ao Vercel**: https://vercel.com
3. **Import Project** do GitHub
4. **Configure Environment Variables**:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
5. **Deploy** automático!

**URL**: `https://seu-projeto.vercel.app`

### 🥈 Netlify

1. **Fork/Clone** este repositório
2. **Conecte ao Netlify**: https://netlify.com
3. **Deploy Settings**:
   - Build command: `echo "Build completed"`
   - Publish directory: `public`
4. **Environment Variables**:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
5. **Deploy**!

**URL**: `https://seu-projeto.netlify.app`

### 🥉 Railway

1. **Fork/Clone** este repositório
2. **Conecte ao Railway**: https://railway.app
3. **Deploy from GitHub**
4. **Environment Variables**:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
5. **Deploy**!

**URL**: `https://seu-projeto.up.railway.app`

## 🔒 Configuração de Segurança

### Supabase Auth Settings

1. **Site URL**: `https://seu-dominio.com`
2. **Redirect URLs**: 
   - `https://seu-dominio.com`
   - `https://seu-dominio.com/dashboard`

### Content Security Policy

Os arquivos de configuração já incluem CSP otimizado:
- `vercel.json` - Headers para Vercel
- `netlify.toml` - Headers para Netlify
- `server-hybrid.js` - Headers para Railway/Node.js

## 🧪 Teste Pós-Deploy

1. **Acesse sua URL**
2. **Cadastre uma clínica** ou use login de teste
3. **Teste funcionalidades**:
   - Login/Logout
   - Criação de usuários
   - Navegação entre seções
4. **Verifique console** para erros

## 🐛 Troubleshooting

### Erro: "Failed to load resource"
- ✅ Verifique variáveis de ambiente
- ✅ Confirme URLs do Supabase

### Erro: "CSP violation"
- ✅ Use `index-production.html` para produção
- ✅ Verifique headers nas configurações

### Erro: "Auth error"
- ✅ Configure Redirect URLs no Supabase
- ✅ Verifique Site URL

### Usuários não aparecem
- ✅ Execute `sql/fix_user_sync.sql`
- ✅ Verifique RLS policies

## 📞 Suporte

- **Issues**: [GitHub Issues](https://github.com/seu-usuario/mediq-ai/issues)
- **Docs**: [Supabase Docs](https://supabase.com/docs)
- **Deploy**: [Vercel Docs](https://vercel.com/docs)