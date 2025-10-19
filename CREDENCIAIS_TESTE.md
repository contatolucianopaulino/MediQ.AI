# 🔐 Credenciais de Teste - MediQ.AI

## 📋 **Como Criar Usuários de Teste**

### **Opção 1: Cadastro pela Interface (Recomendado)**

1. **Abra o sistema**: `public/index.html`
2. **Clique em "Cadastre sua clínica"**
3. **Preencha os dados**:
   - **Nome da Clínica**: Clínica MediQ Teste
   - **Nome do Administrador**: Dr. João Silva
   - **Email**: admin@mediqteste.com
   - **Senha**: MediQ2024!
   - **Telefone**: (11) 99999-9999
   - **Endereço**: Rua da Saúde, 123 - São Paulo, SP

4. **Clique em "Cadastrar Clínica"**
5. **Verifique seu email** (pode ir para spam)
6. **Confirme a conta** clicando no link
7. **Faça login** com as credenciais

### **Opção 2: Dados de Exemplo no SQL**

Execute o script `sql/insert_test_data.sql` no Supabase para criar dados de exemplo.

## 👥 **Usuários de Teste Sugeridos**

### **🏥 Administrador da Clínica**
- **Email**: admin@mediqteste.com
- **Senha**: MediQ2024!
- **Nome**: Dr. João Silva
- **Permissões**: Clínica Admin (pode criar usuários)

### **👨‍⚕️ Médico**
- **Email**: medico@mediqteste.com
- **Senha**: Medico123!
- **Nome**: Dra. Maria Santos
- **Permissões**: Médico (acesso aos módulos de IA)

### **👩‍💼 Secretária**
- **Email**: secretaria@mediqteste.com
- **Senha**: Secret123!
- **Nome**: Ana Costa
- **Permissões**: Secretária (gestão administrativa)

### **💰 Faturamento**
- **Email**: faturamento@mediqteste.com
- **Senha**: Fatur123!
- **Nome**: Carlos Oliveira
- **Permissões**: Faturamento (controle financeiro)

## 🚀 **Fluxo de Teste Completo**

### **1. Primeiro Acesso (Admin)**
```
1. Cadastrar clínica com admin@mediqteste.com
2. Confirmar email
3. Fazer login
4. Acessar dashboard
5. Ir para "Usuários"
6. Adicionar novos usuários da equipe
```

### **2. Teste de Permissões**
```
1. Logout do admin
2. Login com medico@mediqteste.com
3. Verificar acesso aos módulos de IA
4. Logout e testar outros usuários
```

### **3. Teste de Funcionalidades**
```
1. Visão Geral: Estatísticas da clínica
2. Usuários: Gestão da equipe (apenas admin)
3. Módulos: Visualizar módulos disponíveis
4. Logout: Sair do sistema
```

## 🔧 **Resolução de Problemas**

### **Erro: "Email já cadastrado"**
- Use um email diferente ou delete o usuário no Supabase

### **Erro: "Credenciais inválidas"**
- Verifique se confirmou o email
- Tente resetar a senha no Supabase

### **Erro: "Dados do usuário não encontrados"**
- Execute o script `sql/insert_test_data.sql`
- Verifique se as tabelas foram criadas

### **Erro de conexão**
- Verifique se as credenciais do Supabase estão corretas
- Abra o console do navegador (F12) para ver erros

## 📱 **Testando no Navegador**

1. **Abra**: `public/index.html`
2. **Console**: Pressione F12 para ver logs
3. **Network**: Verifique chamadas para o Supabase
4. **Application**: Veja dados salvos no localStorage

## 🎯 **Próximos Passos Após Teste**

1. ✅ Confirmar que login/logout funciona
2. ✅ Testar criação de usuários
3. ✅ Verificar permissões por tipo de usuário
4. ✅ Validar interface responsiva
5. 🔄 Implementar módulos de IA
6. 🔄 Integrar com N8N
7. 🔄 Adicionar prontuário eletrônico

## 💡 **Dicas**

- **Sempre confirme o email** após cadastro
- **Use senhas fortes** para teste
- **Teste em modo incógnito** para simular usuários diferentes
- **Verifique o console** para debugar problemas