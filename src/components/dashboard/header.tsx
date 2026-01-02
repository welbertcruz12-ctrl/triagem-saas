"use client";

import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import type { Tenant, User } from "@/types";
import {
  Bell,
  Search,
  LogOut,
  User as UserIcon,
  Settings,
  ChevronDown,
} from "lucide-react";

interface HeaderProps {
  tenant: Tenant;
  user: User;
}

export function Header({ tenant, user }: HeaderProps) {
  const router = useRouter();
  const supabase = createBrowserSupabaseClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar candidatos..."
            className="h-10 w-64 rounded-lg border bg-muted/50 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Connection Status */}
        <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-1.5 text-sm">
          <span
            className={`h-2 w-2 rounded-full ${
              tenant.whatsapp_instance_id ? "bg-green-500" : "bg-yellow-500"
            }`}
          />
          <span className="text-muted-foreground">
            {tenant.whatsapp_instance_id ? "WhatsApp Conectado" : "WhatsApp Pendente"}
          </span>
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
        </Button>

        {/* User Menu */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium">{tenant.company_name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <UserIcon className="h-5 w-5" />
          </div>
          <div className="relative group">
            <Button variant="ghost" size="icon">
              <ChevronDown className="h-4 w-4" />
            </Button>
            <div className="absolute right-0 top-full z-50 mt-2 hidden w-48 rounded-lg border bg-background py-2 shadow-lg group-hover:block">
              <button
                onClick={() => router.push("/dashboard/settings")}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-muted"
              >
                <Settings className="h-4 w-4" />
                Configurações
              </button>
              <hr className="my-2" />
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-muted"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
