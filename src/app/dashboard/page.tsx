import { createServerSupabaseClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  TrendingUp,
  MessageSquare,
  Mail,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { formatDate, getDecisionLabel } from "@/lib/utils";

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();

  // Buscar user e tenant
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: userData } = await supabase
    .from("users")
    .select("tenant_id")
    .eq("auth_id", user?.id)
    .single();

  const tenantId = userData?.tenant_id;

  // Buscar estatísticas
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const monthAgo = new Date();
  monthAgo.setMonth(monthAgo.getMonth() - 1);

  // Total de candidatos
  const { count: totalCandidates } = await supabase
    .from("candidates")
    .select("*", { count: "exact", head: true })
    .eq("tenant_id", tenantId);

  // Candidatos hoje
  const { count: todayCandidates } = await supabase
    .from("candidates")
    .select("*", { count: "exact", head: true })
    .eq("tenant_id", tenantId)
    .gte("created_at", today.toISOString());

  // Candidatos esta semana
  const { count: weekCandidates } = await supabase
    .from("candidates")
    .select("*", { count: "exact", head: true })
    .eq("tenant_id", tenantId)
    .gte("created_at", weekAgo.toISOString());

  // Por decisão
  const { count: avancerCount } = await supabase
    .from("candidates")
    .select("*", { count: "exact", head: true })
    .eq("tenant_id", tenantId)
    .eq("final_decision", "AVANCAR");

  const { count: avaliarCount } = await supabase
    .from("candidates")
    .select("*", { count: "exact", head: true })
    .eq("tenant_id", tenantId)
    .eq("final_decision", "AVALIAR");

  const { count: descartarCount } = await supabase
    .from("candidates")
    .select("*", { count: "exact", head: true })
    .eq("tenant_id", tenantId)
    .eq("final_decision", "DESCARTAR");

  // Por canal
  const { count: whatsappCount } = await supabase
    .from("candidates")
    .select("*", { count: "exact", head: true })
    .eq("tenant_id", tenantId)
    .eq("source_channel", "whatsapp");

  const { count: emailCount } = await supabase
    .from("candidates")
    .select("*", { count: "exact", head: true })
    .eq("tenant_id", tenantId)
    .eq("source_channel", "email");

  // Últimos candidatos
  const { data: recentCandidates } = await supabase
    .from("candidates")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false })
    .limit(5);

  // Vagas ativas
  const { count: activeJobs } = await supabase
    .from("jobs")
    .select("*", { count: "exact", head: true })
    .eq("tenant_id", tenantId)
    .eq("is_active", true);

  const stats = [
    {
      title: "Total de Candidatos",
      value: totalCandidates || 0,
      icon: Users,
      change: "+12%",
      trend: "up",
    },
    {
      title: "Hoje",
      value: todayCandidates || 0,
      icon: Clock,
      change: `+${todayCandidates || 0}`,
      trend: "up",
    },
    {
      title: "Esta Semana",
      value: weekCandidates || 0,
      icon: TrendingUp,
      change: "+23%",
      trend: "up",
    },
    {
      title: "Para Avançar",
      value: avancerCount || 0,
      icon: UserCheck,
      change: `${Math.round(((avancerCount || 0) / (totalCandidates || 1)) * 100)}%`,
      trend: "up",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral da triagem de currículos
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/candidates">
            <Button>
              Ver Todos os Candidatos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {stat.trend === "up" ? (
                  <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                )}
                <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>
                  {stat.change}
                </span>
                <span className="ml-1">vs. período anterior</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Middle Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Por Decisão */}
        <Card>
          <CardHeader>
            <CardTitle>Por Decisão</CardTitle>
            <CardDescription>Distribuição dos candidatos triados</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <span>Avançar</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">{avancerCount || 0}</span>
                <Badge variant="success">
                  {Math.round(((avancerCount || 0) / (totalCandidates || 1)) * 100)}%
                </Badge>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <span>Avaliar</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">{avaliarCount || 0}</span>
                <Badge variant="warning">
                  {Math.round(((avaliarCount || 0) / (totalCandidates || 1)) * 100)}%
                </Badge>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <span>Descartar</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">{descartarCount || 0}</span>
                <Badge variant="danger">
                  {Math.round(((descartarCount || 0) / (totalCandidates || 1)) * 100)}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Por Canal */}
        <Card>
          <CardHeader>
            <CardTitle>Por Canal</CardTitle>
            <CardDescription>De onde vêm os currículos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-emerald-500" />
                <span>WhatsApp</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">{whatsappCount || 0}</span>
                <Badge variant="whatsapp">
                  {Math.round(((whatsappCount || 0) / (totalCandidates || 1)) * 100)}%
                </Badge>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-500" />
                <span>Email</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">{emailCount || 0}</span>
                <Badge variant="email">
                  {Math.round(((emailCount || 0) / (totalCandidates || 1)) * 100)}%
                </Badge>
              </div>
            </div>
            <div className="mt-4 rounded-lg bg-muted p-4">
              <p className="text-sm font-medium">Vagas Ativas</p>
              <p className="text-2xl font-bold">{activeJobs || 0}</p>
              <Link
                href="/dashboard/jobs"
                className="mt-2 inline-flex items-center text-sm text-primary hover:underline"
              >
                Gerenciar vagas
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Candidates */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Últimos Candidatos</CardTitle>
            <CardDescription>Candidatos recebidos recentemente</CardDescription>
          </div>
          <Link href="/dashboard/candidates">
            <Button variant="outline" size="sm">
              Ver Todos
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentCandidates && recentCandidates.length > 0 ? (
            <div className="space-y-4">
              {recentCandidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      {candidate.name?.charAt(0) || "?"}
                    </div>
                    <div>
                      <p className="font-medium">{candidate.name || "Nome não extraído"}</p>
                      <p className="text-sm text-muted-foreground">
                        {candidate.email || candidate.phone || candidate.identifier}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={candidate.source_channel === "whatsapp" ? "whatsapp" : "email"}>
                      {candidate.source_channel === "whatsapp" ? "WhatsApp" : "Email"}
                    </Badge>
                    {candidate.final_decision && (
                      <Badge
                        variant={
                          candidate.final_decision === "AVANCAR"
                            ? "success"
                            : candidate.final_decision === "AVALIAR"
                            ? "warning"
                            : "danger"
                        }
                      >
                        {getDecisionLabel(candidate.final_decision)}
                      </Badge>
                    )}
                    {candidate.final_score && (
                      <span className="text-sm font-medium">
                        {candidate.final_score.toFixed(0)}%
                      </span>
                    )}
                    <span className="text-sm text-muted-foreground">
                      {formatDate(candidate.created_at)}
                    </span>
                    <Link href={`/dashboard/candidates/${candidate.id}`}>
                      <Button variant="ghost" size="sm">
                        Ver Detalhes
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-medium">Nenhum candidato ainda</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Os candidatos aparecerão aqui quando enviarem currículos
              </p>
              <Link href="/dashboard/settings" className="mt-4">
                <Button>Configurar WhatsApp</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
