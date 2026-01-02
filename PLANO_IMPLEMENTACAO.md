# 🚀 PLANO DE IMPLEMENTAÇÃO - SAAS TRIAGEM DE CURRÍCULOS

## 📋 SEU PLANO ORIGINAL (ATUALIZADO)

```
ETAPA 1: Configuração base ✅ (.cursorrules, .env, tipos)
ETAPA 2: Supabase ✅ (client + schema)
ETAPA 3: Estrutura de pastas ✅
ETAPA 4: Componentes UI (shadcn) ⏳
ETAPA 5: Dashboard principal ⏳
ETAPA 6: Configuração dos 9 agentes ⏳
ETAPA 7: Integração Make.com ⏳
ETAPA 8: Deploy Vercel ⏳
```

---

## 🎯 O QUE JÁ FOI CRIADO

### ✅ Arquivos Prontos:

| Arquivo | Descrição |
|---------|-----------|
| `supabase_schema.sql` | Schema completo do banco multi-tenant |
| `src/types/index.ts` | Todos os tipos TypeScript |
| `src/lib/supabase/client.ts` | Cliente Supabase (browser + server) |
| `.env.example` | Template de variáveis de ambiente |
| `ARQUITETURA_MAKE_MULTITENANT.md` | Documentação da arquitetura |

### ✅ Estrutura de Pastas:

```
saas_triagem/
├── src/
│   ├── app/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── dashboard/
│   │   │   ├── candidates/    ← Lista de currículos
│   │   │   ├── jobs/          ← Gerenciar vagas
│   │   │   ├── settings/      ← Configurações
│   │   │   └── reports/       ← Relatórios
│   │   ├── onboarding/        ← Wizard inicial
│   │   └── api/
│   │       └── webhook/       ← Recebe do Make.com
│   ├── components/
│   │   ├── ui/               ← shadcn components
│   │   ├── dashboard/        ← Componentes específicos
│   │   └── forms/            ← Formulários
│   ├── lib/
│   │   ├── supabase/         ← Cliente Supabase
│   │   └── stripe/           ← Integração billing
│   ├── hooks/                ← React hooks customizados
│   ├── types/                ← TypeScript types
│   └── utils/                ← Funções utilitárias
└── public/
```

---

## 📝 PRÓXIMOS PASSOS DETALHADOS

### ETAPA 4: Componentes UI (1-2 dias)

```bash
# Instalar shadcn/ui
npx shadcn@latest init
npx shadcn@latest add button card input label table badge dialog dropdown-menu
```

Componentes necessários:
- [ ] `CandidateCard` - Card de candidato
- [ ] `CandidateTable` - Tabela de candidatos
- [ ] `StatsCard` - Card de estatísticas
- [ ] `DecisionBadge` - Badge AVANÇAR/AVALIAR/DESCARTAR
- [ ] `ChannelBadge` - Badge WhatsApp/Email

### ETAPA 5: Dashboard (2-3 dias)

Páginas a criar:
- [ ] `/dashboard` - Overview com stats
- [ ] `/dashboard/candidates` - Lista de candidatos
- [ ] `/dashboard/candidates/[id]` - Detalhe do candidato
- [ ] `/dashboard/jobs` - Gerenciar vagas
- [ ] `/dashboard/settings` - Configurações gerais
- [ ] `/dashboard/settings/whatsapp` - Conectar WhatsApp
- [ ] `/dashboard/settings/agents` - Configurar agentes

### ETAPA 6: Agentes (1-2 dias)

- [ ] Criar interface para customizar prompts
- [ ] Sistema de templates padrão
- [ ] Preview do prompt final

### ETAPA 7: Make.com Multi-tenant (2-3 dias)

- [ ] Adaptar webhook para identificar tenant
- [ ] Módulos de consulta ao Supabase
- [ ] Resposta dinâmica por tenant
- [ ] Logging de execuções

### ETAPA 8: Deploy (1 dia)

- [ ] Configurar Vercel
- [ ] Variáveis de ambiente
- [ ] Domínio customizado
- [ ] SSL

---

## 🔧 COMANDOS PARA COMEÇAR

```bash
# 1. Criar projeto Next.js
npx create-next-app@latest triagem-saas --typescript --tailwind --eslint --app

# 2. Entrar na pasta
cd triagem-saas

# 3. Instalar dependências
npm install @supabase/supabase-js @supabase/ssr
npm install @stripe/stripe-js stripe
npm install lucide-react
npm install date-fns
npm install zod react-hook-form @hookform/resolvers

# 4. Instalar shadcn
npx shadcn@latest init

# 5. Copiar arquivos que criei
# (copiar src/types, src/lib/supabase, etc)

# 6. Configurar .env.local
cp .env.example .env.local

# 7. Rodar
npm run dev
```

---

## 💰 MODELO DE NEGÓCIO SUGERIDO

### Planos:

| Plano | Preço | Currículos/mês | Features |
|-------|-------|----------------|----------|
| **Starter** | R$ 197/mês | 100 | WhatsApp, Email, Dashboard básico |
| **Pro** | R$ 497/mês | 500 | + Relatórios, Multi-usuário |
| **Enterprise** | R$ 997/mês | Ilimitado | + Prompts custom, API, Suporte priority |

### Custos (por currículo):

| Item | Custo |
|------|-------|
| IA (OpenRouter) | ~R$ 0,15 |
| WhatsApp (Z-API) | Cliente paga |
| Infra (Supabase/Vercel) | ~R$ 0,02 |
| **Total** | ~R$ 0,17/currículo |

### Margem:

| Plano | Receita | Custo max | Margem |
|-------|---------|-----------|--------|
| Starter | R$ 197 | R$ 17 | **91%** |
| Pro | R$ 497 | R$ 85 | **83%** |
| Enterprise | R$ 997 | R$ 200* | **80%** |

*Estimando 1000 currículos

---

## 🎯 MVP MÍNIMO PARA VENDER

Para começar a vender, você precisa APENAS de:

1. ✅ **Landing page** - Explica o produto
2. ✅ **Cadastro/Login** - Supabase Auth
3. ✅ **Onboarding** - Conectar WhatsApp
4. ✅ **Dashboard básico** - Ver candidatos
5. ✅ **Make.com funcionando** - Processar currículos
6. ✅ **Cobrança** - Stripe Checkout

**Tempo estimado: 2-3 semanas**

---

## 🚨 PRINCIPAIS RISCOS E MITIGAÇÕES

| Risco | Mitigação |
|-------|-----------|
| Z-API mudar API | Abstrair em camada própria |
| Custo IA aumentar | Ter fallback para modelo mais barato |
| Make.com cair | Monitoramento + retry |
| Cliente não pagar | Stripe auto-cancela |
| Concorrência copiar | Velocidade + relacionamento |

---

## 📞 SUPORTE INICIAL

Nas primeiras semanas:
- WhatsApp direto com você para suporte
- Onboarding manual dos primeiros 10 clientes
- Coletar feedback agressivamente

Depois:
- Base de conhecimento
- Chat no dashboard
- Email suporte

---

**Quer que eu continue com alguma etapa específica?**
