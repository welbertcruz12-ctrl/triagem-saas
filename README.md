# 🚀 TriagemAI - SaaS de Triagem de Currículos

Sistema multi-tenant para triagem automática de currículos usando Inteligência Artificial.

## ✨ Funcionalidades

- 📱 **WhatsApp + Email**: Receba currículos por qualquer canal
- 🤖 **8 Agentes de IA**: Análise completa do candidato
- ⚡ **Resposta Automática**: Candidato recebe feedback em segundos
- 📊 **Dashboard Completo**: Visualize todos os candidatos
- 🏢 **Multi-tenant**: Um sistema para vários clientes
- 💳 **Billing Integrado**: Stripe para cobrança automática

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Supabase
- **Database**: PostgreSQL (Supabase)
- **Auth**: Supabase Auth
- **Automação**: Make.com
- **WhatsApp**: Z-API
- **IA**: OpenRouter (Gemini, Claude)

## 📦 Instalação

### 1. Clone e instale dependências

```bash
git clone <seu-repo>
cd triagem-saas
npm install
```

### 2. Configure o Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Vá em SQL Editor e execute o arquivo `supabase_schema.sql`
3. Copie as credenciais

### 3. Configure variáveis de ambiente

```bash
cp .env.example .env.local
```

Preencha as variáveis:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
```

### 4. Execute o projeto

```bash
npm run dev
```

Acesse: http://localhost:3000

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── auth/
│   │   ├── login/           # Login
│   │   └── register/        # Cadastro
│   ├── dashboard/
│   │   ├── page.tsx         # Dashboard principal
│   │   ├── candidates/      # Lista de candidatos
│   │   ├── jobs/            # Gerenciar vagas
│   │   ├── settings/        # Configurações
│   │   └── reports/         # Relatórios
│   ├── onboarding/          # Wizard inicial
│   └── api/
│       └── webhook/         # Webhook para Make.com
├── components/
│   ├── ui/                  # Componentes shadcn
│   └── dashboard/           # Componentes do dashboard
├── lib/
│   └── supabase/           # Cliente Supabase
├── types/                   # TypeScript types
└── utils/                   # Funções utilitárias
```

## 🔧 Configuração Make.com

1. Importe o blueprint do Make.com
2. Configure o webhook para apontar para `/api/webhook`
3. Configure as credenciais do Supabase nos módulos HTTP

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy!

```bash
vercel --prod
```

## 💰 Modelo de Negócio

| Plano | Preço | Currículos/mês |
|-------|-------|----------------|
| Starter | R$ 197 | 100 |
| Pro | R$ 497 | 500 |
| Enterprise | R$ 997 | Ilimitado |

## 📞 Suporte

- Email: suporte@triagemAI.com.br
- WhatsApp: (63) 99999-9999

## 📄 Licença

Proprietário. Todos os direitos reservados.
