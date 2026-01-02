// =====================================================
// TIPOS PRINCIPAIS DO SAAS - TRIAGEM DE CURRÍCULOS
// =====================================================

// =====================================================
// TENANT (Cliente)
// =====================================================
export interface Tenant {
  id: string;
  created_at: string;
  updated_at: string;
  
  // Dados da empresa
  company_name: string;
  cnpj?: string;
  email: string;
  phone?: string;
  
  // Plano
  plan: 'starter' | 'pro' | 'enterprise';
  plan_limit: number;
  plan_used: number;
  subscription_status: 'trialing' | 'active' | 'canceled' | 'past_due';
  trial_ends_at?: string;
  
  // WhatsApp
  whatsapp_instance_id?: string;
  whatsapp_token?: string;
  whatsapp_number?: string;
  whatsapp_connected: boolean;
  
  // Email
  email_configured: boolean;
  
  // Status
  is_active: boolean;
  onboarding_completed: boolean;
}

// =====================================================
// USER
// =====================================================
export interface User {
  id: string;
  tenant_id: string;
  email: string;
  name?: string;
  role: 'owner' | 'admin' | 'member';
  created_at: string;
}

// =====================================================
// DEPARTMENT
// =====================================================
export interface Department {
  id: string;
  tenant_id: string;
  name: string;
  description?: string;
  requirements?: string;
  is_active: boolean;
  created_at: string;
}

// =====================================================
// JOB (Vaga)
// =====================================================
export interface Job {
  id: string;
  tenant_id: string;
  department_id?: string;
  department?: Department;
  
  title: string;
  description?: string;
  requirements?: string;
  
  // Critérios
  requires_cnh: boolean;
  cnh_categories?: string[];
  min_experience_years: number;
  required_skills?: string[];
  preferred_skills?: string[];
  
  // Config
  is_active: boolean;
  auto_response: boolean;
  max_candidates?: number;
  current_candidates: number;
  
  created_at: string;
}

// =====================================================
// CANDIDATE (Candidato/Currículo)
// =====================================================
export interface Candidate {
  id: string;
  tenant_id: string;
  job_id?: string;
  job?: Job;
  
  // Identificação
  identifier: string;
  source_channel: 'whatsapp' | 'email';
  
  // Dados extraídos
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
  state?: string;
  
  // Currículo
  resume_url?: string;
  resume_text?: string;
  resume_json?: Record<string, any>;
  
  // Análises dos 9 Agentes
  sherlock_result?: SherlockResult;
  watson_result?: WatsonResult;
  salomao_result?: SalomaoResult;
  laszlo_result?: LaszloResult;
  adam_grant_result?: AdamGrantResult;
  deming_result?: DemingResult;
  drucker_result?: DruckerResult;
  carnegie_result?: CarnegieResult;
  turing_result?: TuringResult;
  
  // Resultado Final
  final_decision?: 'AVANCAR' | 'AVALIAR' | 'DESCARTAR';
  final_score?: number;
  recommended_department?: string;
  
  // Status
  status: 'pending' | 'processing' | 'completed' | 'error';
  response_sent: boolean;
  response_sent_at?: string;
  response_channel?: string;
  
  // Deduplicação
  is_duplicate: boolean;
  duplicate_of?: string;
  
  created_at: string;
  updated_at: string;
}

// =====================================================
// RESULTADOS DOS AGENTES
// =====================================================

export interface SherlockResult {
  is_valid: boolean;
  file_type: string;
  has_text: boolean;
  confidence: number;
  issues?: string[];
}

export interface WatsonResult {
  dados_pessoais: {
    nome_completo?: string;
    telefone?: string;
    email?: string;
    cidade?: string;
    estado?: string;
  };
  objetivo?: string;
  experiencias_profissionais: Array<{
    cargo: string;
    empresa: string;
    periodo: string;
    descricao?: string;
  }>;
  formacao_academica: Array<{
    nivel: string;
    curso?: string;
    instituicao: string;
    situacao: string;
  }>;
  certificacoes: Array<{
    nome: string;
    instituicao?: string;
  }>;
  habilidades: string[];
  cnh?: {
    possui: boolean;
    categoria?: string;
  };
}

export interface SalomaoResult {
  rota_selecionada: string;
  confianca: number;
  justificativa: string;
  dados_validados: boolean;
  proximo_agente: string;
}

export interface LaszloResult {
  nota_geral: number;
  notas: {
    experiencia: number;
    formacao: number;
    habilidades: number;
    estabilidade: number;
  };
  competencias_identificadas: string[];
  cnh_verificada: boolean;
  cnh_compativel: boolean;
  red_flags: string[];
  pontos_fortes: string[];
}

export interface AdamGrantResult {
  perfil_dominante: 'Comunicador' | 'Executor' | 'Planejador' | 'Analista';
  percentuais: {
    comunicador: number;
    executor: number;
    planejador: number;
    analista: number;
  };
  evidencias: string[];
  fit_cultural: number;
  recomendacoes: string[];
}

export interface DemingResult {
  departamento_recomendado: string;
  fit_score: number;
  justificativa: string;
  departamentos_alternativos: Array<{
    nome: string;
    fit_score: number;
  }>;
  plano_integracao?: string;
}

export interface DruckerResult {
  decisao_final: 'AVANCAR' | 'AVALIAR' | 'DESCARTAR';
  score_final: number;
  justificativa: string;
  proximos_passos: string[];
  riscos_identificados: string[];
  potencial_crescimento: string;
}

export interface CarnegieResult {
  mensagem: string;
  tom: 'positivo' | 'neutro' | 'construtivo';
  personalizacao_aplicada: boolean;
}

export interface TuringResult {
  validacao_ok: boolean;
  erros_encontrados: string[];
  dados_corrigidos: boolean;
  qualidade_score: number;
  formato_valido: boolean;
  campos_obrigatorios_preenchidos: boolean;
  recomendacoes_qa: string[];
}

// =====================================================
// AGENT CONFIG
// =====================================================
export interface AgentConfig {
  id: string;
  tenant_id: string;
  agent_name: 
    | 'sherlock'    // 🔍 Verificador
    | 'watson'      // 📄 Extrator
    | 'salomao'     // ⚖️ Router
    | 'laszlo'      // 🏢 Estrutural
    | 'adam_grant'  // 🧠 Comportamental
    | 'deming'      // 📊 Departamental
    | 'drucker'     // 🎯 Decisão
    | 'carnegie'    // ✍️ Redator
    | 'turing';     // 🔧 QA & Debug
  model: string;
  temperature: number;
  max_tokens: number;
  custom_prompt?: string;
  config: Record<string, any>;
  is_active: boolean;
}

// =====================================================
// MESSAGE TEMPLATE
// =====================================================
export interface MessageTemplate {
  id: string;
  tenant_id: string;
  decision_type: 'AVANCAR' | 'AVALIAR' | 'DESCARTAR';
  channel: 'whatsapp' | 'email';
  subject?: string;
  template: string;
  is_active: boolean;
}

// =====================================================
// ACTIVITY LOG
// =====================================================
export interface ActivityLog {
  id: string;
  tenant_id: string;
  candidate_id?: string;
  action: string;
  details?: Record<string, any>;
  make_execution_id?: string;
  error_message?: string;
  created_at: string;
}

// =====================================================
// USAGE RECORD
// =====================================================
export interface UsageRecord {
  id: string;
  tenant_id: string;
  period_start: string;
  period_end: string;
  candidates_processed: number;
  ai_tokens_used: number;
  whatsapp_messages_sent: number;
  emails_sent: number;
  ai_cost: number;
  total_cost: number;
}

// =====================================================
// API RESPONSES
// =====================================================
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// =====================================================
// WEBHOOK PAYLOADS
// =====================================================
export interface WhatsAppWebhookPayload {
  phone: string;
  senderName?: string;
  instanceId: string;
  document?: {
    documentUrl: string;
    fileName?: string;
    mimeType?: string;
  };
  message?: string;
}

export interface EmailWebhookPayload {
  from: {
    address: string;
    name?: string;
  };
  subject: string;
  attachments?: Array<{
    fileName: string;
    url?: string;
    data?: string; // base64
  }>;
}

// =====================================================
// DASHBOARD STATS
// =====================================================
export interface DashboardStats {
  total_candidates: number;
  candidates_today: number;
  candidates_this_week: number;
  candidates_this_month: number;
  
  by_decision: {
    avancar: number;
    avaliar: number;
    descartar: number;
  };
  
  by_channel: {
    whatsapp: number;
    email: number;
  };
  
  avg_score: number;
  avg_response_time_minutes: number;
  
  plan_usage: {
    used: number;
    limit: number;
    percentage: number;
  };
}
