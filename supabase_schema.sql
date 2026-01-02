-- =====================================================
-- SCHEMA SUPABASE - SAAS TRIAGEM DE CURRÍCULOS
-- Multi-tenant: Cada cliente tem suas configurações
-- =====================================================

-- EXTENSÕES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. TABELA DE CLIENTES (TENANTS)
-- =====================================================
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Dados da empresa
    company_name VARCHAR(255) NOT NULL,
    cnpj VARCHAR(18) UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    
    -- Plano e billing
    plan VARCHAR(50) DEFAULT 'starter', -- starter, pro, enterprise
    plan_limit INTEGER DEFAULT 100, -- currículos por mês
    plan_used INTEGER DEFAULT 0,
    stripe_customer_id VARCHAR(255),
    subscription_status VARCHAR(50) DEFAULT 'trialing',
    trial_ends_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '14 days'),
    
    -- Configurações WhatsApp (Z-API)
    whatsapp_instance_id VARCHAR(255),
    whatsapp_token VARCHAR(255),
    whatsapp_number VARCHAR(20),
    
    -- Configurações Email
    email_host VARCHAR(255),
    email_port INTEGER,
    email_user VARCHAR(255),
    email_password VARCHAR(255),
    email_from VARCHAR(255),
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    onboarding_completed BOOLEAN DEFAULT false
);

-- =====================================================
-- 2. TABELA DE USUÁRIOS
-- =====================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'member', -- owner, admin, member
    auth_id UUID, -- ID do Supabase Auth
    
    UNIQUE(tenant_id, email)
);

-- =====================================================
-- 3. TABELA DE DEPARTAMENTOS
-- =====================================================
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    name VARCHAR(100) NOT NULL,
    description TEXT,
    requirements TEXT,
    is_active BOOLEAN DEFAULT true,
    
    UNIQUE(tenant_id, name)
);

-- =====================================================
-- 4. TABELA DE VAGAS
-- =====================================================
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    department_id UUID REFERENCES departments(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    title VARCHAR(255) NOT NULL,
    description TEXT,
    requirements TEXT,
    
    requires_cnh BOOLEAN DEFAULT false,
    cnh_categories VARCHAR(50)[],
    min_experience_years INTEGER DEFAULT 0,
    required_skills TEXT[],
    preferred_skills TEXT[],
    
    is_active BOOLEAN DEFAULT true,
    auto_response BOOLEAN DEFAULT true,
    max_candidates INTEGER,
    current_candidates INTEGER DEFAULT 0
);

-- =====================================================
-- 5. TABELA DE CANDIDATOS
-- =====================================================
CREATE TABLE candidates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    job_id UUID REFERENCES jobs(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Identificação
    identifier VARCHAR(255) NOT NULL,
    source_channel VARCHAR(50) NOT NULL, -- 'whatsapp' ou 'email'
    
    -- Dados extraídos
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    city VARCHAR(100),
    state VARCHAR(2),
    
    -- Currículo
    resume_url TEXT,
    resume_text TEXT,
    resume_json JSONB,
    
    -- Análises dos 9 Agentes
    sherlock_result JSONB,    -- 🔍 Verificador
    watson_result JSONB,      -- 📄 Extrator
    salomao_result JSONB,     -- ⚖️ Router
    laszlo_result JSONB,      -- 🏢 Estrutural
    adam_grant_result JSONB,  -- 🧠 Comportamental
    deming_result JSONB,      -- 📊 Departamental
    drucker_result JSONB,     -- 🎯 Decisão
    carnegie_result JSONB,    -- ✍️ Redator
    turing_result JSONB,      -- 🔧 QA & Debug
    
    -- Resultado Final
    final_decision VARCHAR(50), -- AVANCAR, AVALIAR, DESCARTAR
    final_score DECIMAL(5,2),
    recommended_department VARCHAR(100),
    
    -- Status
    status VARCHAR(50) DEFAULT 'pending',
    response_sent BOOLEAN DEFAULT false,
    response_sent_at TIMESTAMP WITH TIME ZONE,
    response_channel VARCHAR(50),
    
    -- Deduplicação
    is_duplicate BOOLEAN DEFAULT false,
    duplicate_of UUID REFERENCES candidates(id),
    
    UNIQUE(tenant_id, identifier)
);

-- =====================================================
-- 6. CONFIGURAÇÕES DOS AGENTES
-- =====================================================
CREATE TABLE agent_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    agent_name VARCHAR(50) NOT NULL,
    model VARCHAR(100) DEFAULT 'google/gemini-flash-1.5',
    temperature DECIMAL(2,1) DEFAULT 0.3,
    max_tokens INTEGER DEFAULT 2000,
    custom_prompt TEXT,
    config JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    
    UNIQUE(tenant_id, agent_name)
);

-- =====================================================
-- 7. TEMPLATES DE MENSAGEM
-- =====================================================
CREATE TABLE message_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    decision_type VARCHAR(50) NOT NULL, -- AVANCAR, AVALIAR, DESCARTAR
    channel VARCHAR(50) NOT NULL, -- whatsapp, email
    subject VARCHAR(255),
    template TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    
    UNIQUE(tenant_id, decision_type, channel)
);

-- =====================================================
-- 8. LOGS
-- =====================================================
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    candidate_id UUID REFERENCES candidates(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    action VARCHAR(100) NOT NULL,
    details JSONB,
    make_execution_id VARCHAR(255),
    error_message TEXT
);

-- =====================================================
-- 9. USO/BILLING
-- =====================================================
CREATE TABLE usage_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    candidates_processed INTEGER DEFAULT 0,
    ai_tokens_used INTEGER DEFAULT 0,
    whatsapp_messages_sent INTEGER DEFAULT 0,
    emails_sent INTEGER DEFAULT 0,
    ai_cost DECIMAL(10,4) DEFAULT 0,
    total_cost DECIMAL(10,4) DEFAULT 0
);

-- =====================================================
-- ÍNDICES
-- =====================================================
CREATE INDEX idx_candidates_tenant ON candidates(tenant_id);
CREATE INDEX idx_candidates_identifier ON candidates(identifier);
CREATE INDEX idx_candidates_status ON candidates(status);
CREATE INDEX idx_candidates_created ON candidates(created_at DESC);
CREATE INDEX idx_candidates_decision ON candidates(final_decision);

-- =====================================================
-- FUNÇÕES ÚTEIS
-- =====================================================

-- Verificar duplicata
CREATE OR REPLACE FUNCTION check_duplicate_candidate(
    p_tenant_id UUID,
    p_identifier VARCHAR
)
RETURNS TABLE(is_duplicate BOOLEAN, existing_id UUID) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        TRUE as is_duplicate,
        c.id as existing_id
    FROM candidates c
    WHERE c.tenant_id = p_tenant_id
    AND c.identifier = p_identifier
    AND c.created_at > NOW() - INTERVAL '30 days'
    LIMIT 1;
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT FALSE, NULL::UUID;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Identificar tenant pelo WhatsApp
CREATE OR REPLACE FUNCTION get_tenant_by_whatsapp(p_whatsapp VARCHAR)
RETURNS UUID AS $$
BEGIN
    RETURN (
        SELECT id FROM tenants 
        WHERE whatsapp_instance_id = p_whatsapp 
        AND is_active = TRUE
        LIMIT 1
    );
END;
$$ LANGUAGE plpgsql;

-- Incrementar uso do plano
CREATE OR REPLACE FUNCTION increment_plan_usage(p_tenant_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    v_limit INTEGER;
    v_used INTEGER;
BEGIN
    SELECT plan_limit, plan_used INTO v_limit, v_used
    FROM tenants WHERE id = p_tenant_id;
    
    IF v_used >= v_limit THEN
        RETURN FALSE;
    END IF;
    
    UPDATE tenants SET plan_used = plan_used + 1 WHERE id = p_tenant_id;
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;

-- Usuário só vê dados do seu tenant
CREATE POLICY tenant_isolation ON candidates
    FOR ALL
    USING (tenant_id IN (
        SELECT tenant_id FROM users WHERE auth_id = auth.uid()
    ));
