# 🚨 Solução Rápida - Problemas no Supabase

## 🔧 **Passo 1: Corrigir Políticas RLS**

1. **Acesse seu Supabase**: https://uifmnunesfevybpahahx.supabase.co
2. **Vá para SQL Editor**
3. **Execute o script**: `sql/fix_policies.sql`
4. **Aguarde a execução** (pode demorar alguns segundos)

## 👤 **Passo 2: Criar Usuário Manualmente**

### **Método Simples (Recomendado)**

1. **Abra o sistema**: `public/index.html`
2. **Clique em "Cadastre sua clínica"**
3. **Use dados válidos**:
   ```
   Nome da Clínica: Clinica Teste
   Nome do Admin: Dr João Silva
   Email: teste@gmail.com
   Senha: 123456789
   Telefone: 11999999999
   Endereço: Rua Teste 123
   ```
4. **Clique em "Cadastrar Clínica"**
5. **Aguarde confirmação**

### **Método Alternativo (Supabase Dashboard)**

1. **No Supabase, vá para Authentication > Users**
2. **Clique em "Add user"**
3. **Preencha**:
   - Email: `teste@gmail.com`
   - Password: `123456789`
   - Confirm: ✅
4. **Clique em "Create user"**

## 🧪 **Passo 3: Testar Login**

1. **Abra**: `public/index.html`
2. **Faça login com**:
   - Email: `teste@gmail.com`
   - Senha: `123456789`
3. **Deve funcionar!**

## 🔍 **Se Ainda Não Funcionar**

### **Verificar Tabelas**
```sql
-- Execute no SQL Editor
SELECT * FROM clinics;
SELECT * FROM profiles;
```

### **Recriar Tabelas (Último Recurso)**
```sql
-- Execute no SQL Editor
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS clinics CASCADE;

-- Depois execute novamente:
-- sql/create_tables.sql
-- sql/fix_policies.sql
```

## 📱 **Credenciais de Teste Simples**

- **Email**: `teste@gmail.com`
- **Senha**: `123456789`
- **Nome**: Dr João Silva
- **Clínica**: Clinica Teste

## 🎯 **Próximo Passo**

Após conseguir fazer login:
1. ✅ Testar dashboard
2. ✅ Criar novos usuários
3. ✅ Testar permissões
4. 🔄 Implementar módulos de IA

## 💡 **Dicas**

- **Use emails reais** (gmail, outlook, etc.)
- **Senhas com 8+ caracteres**
- **Evite caracteres especiais** nos nomes
- **Verifique o console** (F12) para erros