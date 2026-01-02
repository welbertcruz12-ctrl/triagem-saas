# 🏗️ ARQUITETURA MAKE.COM MULTI-TENANT

## 🎯 CONCEITO

**UM único cenário Make.com processa TODOS os clientes.**

```
┌─────────────────────────────────────────────────────────────────┐
│                     MAKE.COM - CENÁRIO ÚNICO                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  CLIENTE A ───┐                                                │
│  CLIENTE B ───┼──► [WEBHOOK CENTRAL] ──► [IDENTIFICAR TENANT]  │
│  CLIENTE C ───┘           │                      │             │
│                           │                      ▼             │
│                           │            [SUPABASE: Buscar       │
│                           │             configs do tenant]     │
│                           │                      │             │
│                           ▼                      ▼             │
│                    [8 AGENTES IA com config dinâmica]          │
│                           │                                    │
│                           ▼                                    │
│            [RESPONDER via WhatsApp/Email DO CLIENTE]           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 FLUXO DETALHADO

### [1] WEBHOOK CENTRAL
```
Recebe de qualquer WhatsApp/Email
Dados: { phone, documentUrl, instanceId }
```

### [2] IDENTIFICAR TENANT
```http
GET https://SEU_PROJETO.supabase.co/rest/v1/tenants
?whatsapp_instance_id=eq.{{1.instanceId}}
&select=*

Headers:
  apikey: {{SUPABASE_ANON_KEY}}
```

### [3] VERIFICAR LIMITE
```
Se tenant.plan_used >= tenant.plan_limit → PARA
```

### [4] VERIFICAR DUPLICATA
```http
GET https://SEU_PROJETO.supabase.co/rest/v1/candidates
?tenant_id=eq.{{2.id}}
&identifier=eq.{{1.phone}}
```

### [5] REGISTRAR CANDIDATO
```http
POST https://SEU_PROJETO.supabase.co/rest/v1/candidates
Body: {
  "tenant_id": "{{2.id}}",
  "identifier": "{{1.phone}}",
  "source_channel": "whatsapp",
  "status": "processing"
}
```

### [6] CARREGAR CONFIGS
```http
GET https://SEU_PROJETO.supabase.co/rest/v1/agent_configs
?tenant_id=eq.{{2.id}}
```

### [7-13] AGENTES IA
```
Cada agente usa:
- Prompt padrão OU custom do tenant
- Departamentos do tenant
- Vagas ativas do tenant
```

### [14] SALVAR RESULTADOS
```http
PATCH https://SEU_PROJETO.supabase.co/rest/v1/candidates
?id=eq.{{5.id}}
Body: {
  "watson_result": {{watson.output}},
  "drucker_result": {{drucker.output}},
  "final_decision": "{{drucker.decisao}}",
  "status": "completed"
}
```

### [15-17] RESPONDER
```
WhatsApp: Usa instance_id/token DO TENANT
Email: Usa SMTP DO TENANT (ou centralizado)
```

---

## 🔑 IDENTIFICAÇÃO DO TENANT

### Por WhatsApp (Z-API)
```
Cada cliente tem sua própria instância Z-API
instanceId identifica qual cliente é
```

### Por Email
```
Cada cliente usa email próprio (rh@cliente.com)
OU subdomínio (cliente.seutriagem.com)
```

---

## 💰 MODELO DE CUSTOS

| Plano | Preço | Currículos | Margem |
|-------|-------|------------|--------|
| Starter | R$197/mês | 100 | ~91% |
| Pro | R$497/mês | 500 | ~83% |
| Enterprise | R$997/mês | Ilimitado | ~80% |

### Custo por currículo: ~R$0,17
- IA: R$0,15
- Infra: R$0,02

---

## 🚀 COMO O CLIENTE CONFIGURA

### No seu Dashboard:

1. **Criar conta** → Supabase cria tenant
2. **Conectar WhatsApp** → Z-API OAuth ou manual
3. **Cadastrar departamentos** → Formulário simples
4. **Criar vagas** → Formulário com critérios
5. **Ativar** → Webhook configurado automaticamente

### Automático:

- Z-API do cliente aponta para SEU webhook
- Quando currículo chega, você identifica pelo instanceId
- Processa com configs do cliente
- Responde pelo WhatsApp do cliente

---

## 📋 CHECKLIST PARA MULTI-TENANT

### Make.com:
- [ ] Webhook central único
- [ ] Módulo HTTP → Supabase para identificar tenant
- [ ] Módulo HTTP → Supabase para verificar duplicata
- [ ] Módulo HTTP → Supabase para salvar candidato
- [ ] Agentes com prompts dinâmicos
- [ ] Módulo HTTP → Z-API com credenciais dinâmicas

### Supabase:
- [ ] Tabela tenants com credenciais WhatsApp
- [ ] Tabela candidates com tenant_id
- [ ] Tabela agent_configs por tenant
- [ ] Row Level Security ativado
- [ ] Funções de deduplicação

### Dashboard:
- [ ] Onboarding de WhatsApp
- [ ] CRUD de departamentos/vagas
- [ ] Visualização de candidatos
- [ ] Configuração de mensagens
