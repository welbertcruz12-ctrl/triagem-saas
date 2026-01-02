# 🤖 OS 9 AGENTES DE IA - TRIAGEM v3.0

Sistema autônomo de triagem de currículos desenvolvido para o **Armazém das Frutas**.

---

## 📊 FLUXO DOS AGENTES

```
CURRÍCULO RECEBE
      ↓
🔍 SHERLOCK ──→ Verifica se arquivo é válido/legível
      ↓
📄 WATSON ────→ Extrai todos os dados estruturados
      ↓
⚖️ SALOMÃO ───→ Roteia para o fluxo correto
      ↓
🏢 LASZLO ────→ Análise estrutural e notas técnicas
      ↓
🧠 ADAM GRANT → Perfil comportamental (DISC)
      ↓
📊 DEMING ────→ Recomenda departamento ideal
      ↓
🎯 DRUCKER ───→ Decisão final: AVANÇAR/AVALIAR/DESCARTAR
      ↓
✍️ CARNEGIE ──→ Redige mensagem personalizada
      ↓
🔧 TURING ────→ Valida JSON e garante qualidade
      ↓
RESPOSTA ENVIADA
```

---

## 🔍 AGENTE 1 - SHERLOCK (Verificador)

**Função:** Primeira barreira do sistema. Valida se o arquivo é um currículo legível.

**Entrada:** Texto extraído do arquivo (PDF/DOC/imagem)

**Saída:**
```json
{
  "status": "ok",
  "tipo_arquivo": "curriculo",
  "legivel": true,
  "metadados": {
    "formato": "pdf",
    "idioma": "pt",
    "tamanho_aprox": "medio"
  },
  "acao_recomendada": "seguir_para_agente_2"
}
```

**Decisões:**
- `seguir_para_agente_2` → Arquivo válido, continua
- `pedir_reenvio` → Arquivo corrompido/ilegível
- `solicitar_texto` → Não conseguiu extrair texto

---

## 📄 AGENTE 2 - WATSON (Extrator)

**Função:** Extrai e estrutura TODOS os dados do currículo em JSON.

**Entrada:** Texto bruto do currículo

**Saída:**
```json
{
  "dados_pessoais": {
    "nome_completo": "João Silva",
    "email": "joao@email.com",
    "telefone": "63999999999",
    "cidade": "Araguaína",
    "estado": "TO"
  },
  "experiencias_profissionais": [...],
  "formacao_academica": [...],
  "habilidades": ["Excel", "Vendas"],
  "cnh": { "possui": true, "categoria": "B" }
}
```

---

## ⚖️ AGENTE 3 - SALOMÃO (Router)

**Função:** Decide para qual fluxo/vaga o candidato deve ser direcionado.

**Entrada:** Dados extraídos pelo Watson

**Saída:**
```json
{
  "tipo_candidatura": "vaga_especifica",
  "prioridade": "alta",
  "canal_resposta": "whatsapp",
  "requer_analise_humana": false,
  "vaga_identificada": "Motorista",
  "tags": ["urgente", "experiencia_logistica"]
}
```

---

## 🏢 AGENTE 4 - LASZLO (Estrutural)

**Função:** Análise técnica e estrutural do candidato. Dá notas objetivas.

**Entrada:** Dados estruturados

**Saída:**
```json
{
  "notas": {
    "experiencia": 8,
    "formacao": 6,
    "habilidades": 7,
    "estabilidade": 9
  },
  "media_geral": 7.5,
  "anos_experiencia_total": 5,
  "cnh_compativel": true,
  "red_flags": [],
  "pontos_fortes": ["Experiência em logística", "Estabilidade nos empregos"],
  "recomendacao": "AVANCAR"
}
```

---

## 🧠 AGENTE 5 - ADAM GRANT (Comportamental)

**Função:** Analisa perfil comportamental baseado em evidências do currículo.

**Entrada:** Histórico e forma de escrita

**Saída:**
```json
{
  "perfil_dominante": "Executor",
  "percentuais": {
    "comunicador": 20,
    "executor": 45,
    "planejador": 25,
    "analista": 10
  },
  "fit_cultural": 78,
  "estilo_trabalho": "Orientado a resultados, prefere ação",
  "pontos_fortes": ["Proatividade", "Foco em metas"],
  "pontos_atencao": ["Pode ser impaciente com processos lentos"]
}
```

---

## 📊 AGENTE 6 - DEMING (Departamental)

**Função:** Recomenda o departamento ideal baseado em fit score.

**Entrada:** Análises anteriores + vagas disponíveis

**Saída:**
```json
{
  "departamento_recomendado": "Logística",
  "fit_score": 85,
  "justificativa": "Experiência prévia em entregas, CNH D, conhece a região",
  "departamentos_alternativos": [
    { "nome": "Comercial", "fit_score": 62 }
  ],
  "requisitos_atendidos": ["CNH categoria D", "Experiência 3+ anos"],
  "requisitos_faltantes": []
}
```

---

## 🎯 AGENTE 7 - DRUCKER (Decisão)

**Função:** Toma a decisão final consolidando todas as análises.

**Entrada:** Todas as análises anteriores

**Saída:**
```json
{
  "decisao": "AVANCAR",
  "score_final": 82,
  "justificativa": "Candidato atende requisitos técnicos e comportamentais",
  "confianca": 95,
  "proximos_passos": ["Agendar entrevista", "Verificar referências"],
  "riscos_identificados": [],
  "pontos_entrevista": ["Explorar experiência em rotas longas"]
}
```

**Decisões possíveis:**
- `AVANCAR` → Candidato aprovado, agendar entrevista
- `AVALIAR` → Precisa análise humana adicional
- `DESCARTAR` → Não atende requisitos mínimos

---

## ✍️ AGENTE 8 - CARNEGIE (Redator)

**Função:** Redige mensagem personalizada para o candidato.

**Entrada:** Decisão final + dados do candidato

**Saída:**
```json
{
  "mensagem_whatsapp": "Olá João! 🎉\n\nRecebemos seu currículo para a vaga de Motorista no Armazém das Frutas...",
  "mensagem_email": "Prezado João Silva,\n\nAgradecemos o envio do seu currículo...",
  "assunto_email": "Sua candidatura para Motorista - Armazém das Frutas",
  "tom": "acolhedor",
  "personalizacao_aplicada": true
}
```

---

## 🔧 AGENTE 9 - TURING (QA & Debug)

**Função:** Valida todo o JSON de saída, corrige erros e garante qualidade.

**Entrada:** Todos os outputs anteriores

**Saída:**
```json
{
  "validacao_ok": true,
  "erros_encontrados": [],
  "dados_corrigidos": {},
  "score_confiabilidade": 98,
  "alertas": [],
  "json_final_valido": true,
  "tempo_processamento_ms": 1250
}
```

**Verificações:**
- JSON bem formado
- Campos obrigatórios preenchidos
- Tipos de dados corretos
- Consistência entre agentes
- Nenhuma alucinação detectada

---

## 📈 MÉTRICAS DO SISTEMA

| Métrica | Valor |
|---------|-------|
| Tempo médio por currículo | ~25 segundos |
| Taxa de sucesso | 98% |
| Precisão das decisões | 95% |
| Custo por análise | ~R$ 0,15 |

---

## 🔄 VERSÕES

| Versão | Data | Mudanças |
|--------|------|----------|
| 1.0 | Nov/2024 | 7 agentes básicos |
| 2.0 | Dez/2024 | +Salomão +Turing, integração Supabase |
| 3.0 | Dez/2024 | Multi-tenant SaaS, dashboard completo |

---

## 👨‍💻 CRÉDITOS

- **CEO:** Marcelo Silva
- **Empresa:** Armazém das Frutas - Araguaína/TO
- **Sistema:** TriagemAI v3.0
- **Arquitetura:** Claude + Make.com + Supabase
