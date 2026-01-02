# 🚀 GUIA: RODAR O SAAS HOJE

## ⏱️ Tempo estimado: 30-45 minutos

---

## PASSO 1: SUPABASE (10 min)

### 1.1 Criar projeto
1. Acesse: https://supabase.com
2. Clique "Start your project"
3. Login com GitHub
4. "New Project"
5. Nome: `triagem-saas`
6. Senha do banco: **anote em algum lugar!**
7. Região: **South America (São Paulo)**
8. Aguarde criar (~2 min)

### 1.2 Criar tabelas
1. No menu lateral: **SQL Editor**
2. Clique "New query"
3. Cole TODO o conteúdo do arquivo `supabase_schema.sql`
4. Clique **RUN**
5. Deve aparecer "Success. No rows returned"

### 1.3 Copiar credenciais
1. Menu lateral: **Project Settings** (ícone engrenagem)
2. Clique em **API**
3. Copie e salve em um bloco de notas:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public**: `eyJhbGci...` (chave grande)
   - **service_role**: `eyJhbGci...` (outra chave, mais embaixo)

### 1.4 Configurar Auth
1. Menu: **Authentication** → **Providers**
2. Verifique se **Email** está habilitado (deve estar por padrão)
3. Menu: **Authentication** → **URL Configuration**
4. Site URL: `http://localhost:3000`

---

## PASSO 2: PROJETO LOCAL (10 min)

### 2.1 Extrair e entrar na pasta
```bash
# Extrair o zip
unzip saas_triagem_completo.zip
cd saas_triagem
```

### 2.2 Criar arquivo .env.local
```bash
cp .env.example .env.local
```

### 2.3 Editar .env.local
Abra com qualquer editor e preencha APENAS estas 3 linhas:

```env
NEXT_PUBLIC_SUPABASE_URL=https://SEU_PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci_COLE_SUA_ANON_KEY_AQUI
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci_COLE_SUA_SERVICE_KEY_AQUI
```

### 2.4 Instalar dependências
```bash
npm install
```

Aguarde baixar tudo (~2-3 min)

### 2.5 Rodar
```bash
npm run dev
```

### 2.6 Testar
1. Abra no navegador: **http://localhost:3000**
2. Você deve ver a landing page bonita
3. Clique **"Criar Conta Grátis"**
4. Preencha: nome da empresa, email, senha
5. Passe pelo onboarding (3 passos)
6. Chegou no dashboard? **FUNCIONOU!** 🎉

---

## PASSO 3: DEPLOY VERCEL (10 min)

### 3.1 Criar repositório no GitHub
1. Acesse: https://github.com/new
2. Nome: `triagem-saas`
3. Deixe público ou privado
4. **NÃO** marque "Add README"
5. Clique "Create repository"

### 3.2 Subir código
No terminal, dentro da pasta do projeto:

```bash
git init
git add .
git commit -m "primeiro commit"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/triagem-saas.git
git push -u origin main
```

### 3.3 Deploy na Vercel
1. Acesse: https://vercel.com
2. Login com GitHub
3. Clique **"Add New Project"**
4. Selecione o repo `triagem-saas`
5. **IMPORTANTE** - Clique em "Environment Variables" e adicione:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | https://xxx.supabase.co |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | eyJhbGci... |
| `SUPABASE_SERVICE_ROLE_KEY` | eyJhbGci... |

6. Clique **Deploy**
7. Aguarde (~2-3 min)
8. Vai aparecer sua URL: `https://triagem-saas-xxx.vercel.app`

### 3.4 Atualizar Supabase com URL do Vercel
1. Volte ao Supabase
2. **Authentication** → **URL Configuration**
3. Atualize:
   - **Site URL**: `https://SEU_PROJETO.vercel.app`
   - **Redirect URLs**: Adicione `https://SEU_PROJETO.vercel.app/**`

---

## PASSO 4: TESTAR PRODUÇÃO (5 min)

1. Acesse sua URL da Vercel
2. Crie uma conta nova
3. Complete o onboarding
4. Navegue pelo dashboard
5. Crie uma vaga
6. Veja as configurações

**Se tudo funcionou, seu SaaS está NO AR!** 🚀

---

## 📋 CHECKLIST FINAL

- [ ] Supabase criado e tabelas rodadas
- [ ] Projeto rodando local (localhost:3000)
- [ ] Código no GitHub
- [ ] Deploy na Vercel funcionando
- [ ] Consegue criar conta e fazer login
- [ ] Dashboard aparece corretamente

---

## ⚠️ PROBLEMAS COMUNS

### "Invalid API key"
→ Verifique se copiou as chaves do Supabase corretamente (sem espaços)

### "User not found" ao fazer login
→ O usuário foi criado mas o trigger não criou o tenant. Rode o SQL novamente.

### Página em branco
→ Abra o console do navegador (F12) e veja o erro

### "Module not found"
→ Rode `npm install` novamente

---

## 🔜 PRÓXIMOS PASSOS (depois de rodar)

1. **Conectar WhatsApp (Z-API)**
   - Criar conta em z-api.io
   - Configurar instância
   - Colar credenciais em Configurações

2. **Conectar Make.com**
   - Importar o blueprint que te dei antes
   - Apontar webhook para sua URL + `/api/webhook`

3. **Domínio próprio (opcional)**
   - Comprar domínio (ex: triagemcurriculos.com.br)
   - Configurar na Vercel

4. **Stripe para cobrança (opcional)**
   - Criar conta Stripe
   - Configurar produtos/preços
   - Integrar checkout

---

## 🆘 PRECISA DE AJUDA?

Se travar em algum passo, me manda:
1. Screenshot do erro
2. Em qual passo está
3. O que aparece no terminal

Vou te ajudar a resolver! 💪
