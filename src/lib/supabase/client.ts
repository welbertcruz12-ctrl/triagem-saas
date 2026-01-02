import { createClient } from '@supabase/supabase-js';
import { createBrowserClient, createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// =====================================================
// TIPOS DO DATABASE
// =====================================================
import type { 
  Tenant, 
  User, 
  Candidate, 
  Job, 
  Department,
  AgentConfig,
  MessageTemplate,
  ActivityLog,
  UsageRecord
} from '@/types';

export type Database = {
  public: {
    Tables: {
      tenants: {
        Row: Tenant;
        Insert: Partial<Tenant>;
        Update: Partial<Tenant>;
      };
      users: {
        Row: User;
        Insert: Partial<User>;
        Update: Partial<User>;
      };
      candidates: {
        Row: Candidate;
        Insert: Partial<Candidate>;
        Update: Partial<Candidate>;
      };
      jobs: {
        Row: Job;
        Insert: Partial<Job>;
        Update: Partial<Job>;
      };
      departments: {
        Row: Department;
        Insert: Partial<Department>;
        Update: Partial<Department>;
      };
      agent_configs: {
        Row: AgentConfig;
        Insert: Partial<AgentConfig>;
        Update: Partial<AgentConfig>;
      };
      message_templates: {
        Row: MessageTemplate;
        Insert: Partial<MessageTemplate>;
        Update: Partial<MessageTemplate>;
      };
      activity_logs: {
        Row: ActivityLog;
        Insert: Partial<ActivityLog>;
        Update: Partial<ActivityLog>;
      };
      usage_records: {
        Row: UsageRecord;
        Insert: Partial<UsageRecord>;
        Update: Partial<UsageRecord>;
      };
    };
  };
};

// =====================================================
// CLIENTE BROWSER (para componentes client-side)
// =====================================================
export function createBrowserSupabaseClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// =====================================================
// CLIENTE SERVER (para Server Components e API Routes)
// =====================================================
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();
  
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignore - chamado de Server Component
          }
        },
      },
    }
  );
}

// =====================================================
// CLIENTE ADMIN (com service role - para operações privilegiadas)
// =====================================================
export function createAdminSupabaseClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
}

// =====================================================
// HELPER: Obter tenant do usuário logado
// =====================================================
export async function getCurrentTenant() {
  const supabase = await createServerSupabaseClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  const { data: userData } = await supabase
    .from('users')
    .select('tenant_id, tenants(*)')
    .eq('auth_id', user.id)
    .single();
    
  return userData?.tenants as Tenant | null;
}

// =====================================================
// HELPER: Verificar se usuário tem permissão
// =====================================================
export async function checkUserRole(requiredRole: 'owner' | 'admin' | 'member') {
  const supabase = await createServerSupabaseClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  
  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('auth_id', user.id)
    .single();
    
  if (!userData) return false;
  
  const roleHierarchy = { owner: 3, admin: 2, member: 1 };
  return roleHierarchy[userData.role] >= roleHierarchy[requiredRole];
}
