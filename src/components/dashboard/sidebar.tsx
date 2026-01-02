"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { Tenant, User } from "@/types";
import {
  Zap,
  LayoutDashboard,
  Users,
  Briefcase,
  Settings,
  BarChart3,
  MessageSquare,
  HelpCircle,
} from "lucide-react";

interface SidebarProps {
  tenant: Tenant;
  user: User;
}

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Candidatos",
    href: "/dashboard/candidates",
    icon: Users,
  },
  {
    title: "Vagas",
    href: "/dashboard/jobs",
    icon: Briefcase,
  },
  {
    title: "Relatórios",
    href: "/dashboard/reports",
    icon: BarChart3,
  },
  {
    title: "Configurações",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function Sidebar({ tenant, user }: SidebarProps) {
  const pathname = usePathname();

  const usagePercentage = Math.round(
    (tenant.plan_used / tenant.plan_limit) * 100
  );

  return (
    <aside className="flex w-64 flex-col border-r bg-background">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <Zap className="h-8 w-8 text-primary" />
        <span className="text-xl font-bold">TriagemAI</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.title}
            </Link>
          );
        })}
      </nav>

      {/* Usage */}
      <div className="border-t p-4">
        <div className="rounded-lg bg-muted p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Uso do Plano</span>
            <span className="text-muted-foreground">
              {tenant.plan_used}/{tenant.plan_limit}
            </span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-background">
            <div
              className={cn(
                "h-2 rounded-full transition-all",
                usagePercentage > 90
                  ? "bg-red-500"
                  : usagePercentage > 70
                  ? "bg-yellow-500"
                  : "bg-green-500"
              )}
              style={{ width: `${Math.min(usagePercentage, 100)}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Plano {tenant.plan.charAt(0).toUpperCase() + tenant.plan.slice(1)}
          </p>
        </div>
      </div>

      {/* Help */}
      <div className="border-t p-4">
        <Link
          href="/dashboard/help"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <HelpCircle className="h-5 w-5" />
          Ajuda e Suporte
        </Link>
      </div>
    </aside>
  );
}
