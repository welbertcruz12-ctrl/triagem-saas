import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Cliente para uso no browser
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Alias para compatibilidade
export function createBrowserSupabaseClient() {
  return supabase
}

// Cliente para server (usa mesma instância por enquanto)
export async function createServerSupabaseClient() {
  return supabase
}

// Cliente admin com service role
export function createAdminSupabaseClient() {
  return createClient(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}
    
  if (!userData) return false;
  
  const roleHierarchy = { owner: 3, admin: 2, member: 1 };
  return roleHierarchy[userData.role] >= roleHierarchy[requiredRole];
}
