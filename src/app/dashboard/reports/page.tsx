import { createServerSupabaseClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  TrendingUp,
  Users,
  Clock,
  MessageSquare,
  Mail,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react";

export default async function ReportsPage() {
  const supabase = await createServerSupabaseClient();

  // Buscar tenant
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: userData } = await supabase
    .from("users")
    .select("tenant_id")
    .eq("auth_id", user?.id)
    .single();

  const tenantId = userData?.tenant_id;

  // Datas
  const today = new Date();
  const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

  // Estatísticas do mês atual
  const { count: thisMonthCount } = await supabase
    .from("candidates")
    .select("*", { count: "exact", head: true })
    .eq("tenant_id", tenantId)
    .gte("created_at", thisMonth.toISOString());

  // Estatísticas do mês passado
  const { count: lastMonthCount } = await supabase
    .from("candidates")
    .select("*", { count: "exact", head: true })
    .eq("tenant_id", tenantId)
    .gte("created_at", lastMonth.toISOString())
    .lte("created_at", lastMonthEnd.toISOString());

  // Por decisão (este mês)
  const { count: avancarThisMonth } = await supabase
    .from("candidates")
    .select("*", { count: "exact", head: true })
    .eq("tenant_id", tenantId)
    .eq("final_decision", "AVANCAR")
    .gte("created_at", thisMonth.toISOString());

  const { count: avaliarThisMonth } = await supabase
    .from("candidates")
    .select("*", { count: "exact", head: true })
    .eq("tenant_id", tenantId)
    .eq("final_decision", "AVALIAR")
    .gte("created_at", thisMonth.toISOString());

  const { count: descartarThisMonth } = await supabase
    .from("candidates")
    .select("*", { count: "exact", head: true })
    .eq("tenant_id", tenantId)
    .eq("final_decision", "DESCARTAR")
    .gte("created_at", thisMonth.toISOString());

  // Por canal (este mês)
  const { count: whatsappThisMonth } = await supabase
    .from("candidates")
    .select("*", { count: "exact", head: true })
    .eq("tenant_id", tenantId)
    .eq("source_channel", "whatsapp")
    .gte("created_at", thisMonth.toISOString());

  const { count: emailThisMonth } = await supabase
    .from("candidates")
    .select("*", { count: "exact", head: true })
    .eq("tenant_id", tenantId)
    .eq("source_channel", "email")
    .gte("created_at", thisMonth.toISOString());

  // Respostas enviadas (este mês)
  const { count: respondidosThisMonth } = await supabase
    .from("candidates")
    .select("*", { count: "exact", head: true })
    .eq("tenant_id", tenantId)
    .eq("response_sent", true)
    .gte("created_at", thisMonth.toISOString());

  // Calcular variação
  const variation =
    lastMonthCount && lastMonthCount > 0
      ? Math.round(((thisMonthCount || 0) - lastMonthCount) / lastMonthCount * 100)
      : 0;

  // Taxa de aprovação
  const taxaAprovacao =
    thisMonthCount && thisMonthCount > 0
      ? Math.round(((avancarThisMonth || 0) / thisMonthCount) * 100)
      : 0;

  // Taxa de resposta
  const taxaResposta =
    thisMonthCount && thisMonthCount > 0
      ? Math.round(((respondidosThisMonth || 0) / thisMonthCount) * 100)
      : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Relatórios</h1>
        <p className="text-muted-foreground">
          Análise de desempenho da triagem de currículos
        </p>
      </div>

      {/* Período */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <span className="font-medium">
                Período: {thisMonth.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
              </span>
            </div>
            <Badge variant="outline">Mês Atual</Badge>
          </div>
        </CardContent>
      </Card>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Currículos Recebidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold">{thisMonthCount || 0}</span>
              <Badge variant={variation >= 0 ? "success" : "danger"}>
                {variation >= 0 ? "+" : ""}{variation}%
              </Badge>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              vs. mês anterior ({lastMonthCount || 0})
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Taxa de Aprovação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold">{taxaAprovacao}%</span>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {avancarThisMonth || 0} candidatos para avançar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Taxa de Resposta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold">{taxaResposta}%</span>
              <MessageSquare className="h-8 w-8 text-blue-500" />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {respondidosThisMonth || 0} respostas enviadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tempo Médio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold">&lt;30s</span>
              <Clock className="h-8 w-8 text-purple-500" />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Por currículo processado
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Distribuição */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Por Decisão */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Decisão</CardTitle>
            <CardDescription>Como os currículos foram classificados</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Avançar</span>
                </div>
                <span className="font-bold">{avancarThisMonth || 0}</span>
              </div>
              <div className="h-3 rounded-full bg-muted">
                <div
                  className="h-3 rounded-full bg-green-500"
                  style={{
                    width: `${thisMonthCount ? ((avancarThisMonth || 0) / thisMonthCount) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                  <span>Avaliar</span>
                </div>
                <span className="font-bold">{avaliarThisMonth || 0}</span>
              </div>
              <div className="h-3 rounded-full bg-muted">
                <div
                  className="h-3 rounded-full bg-yellow-500"
                  style={{
                    width: `${thisMonthCount ? ((avaliarThisMonth || 0) / thisMonthCount) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span>Descartar</span>
                </div>
                <span className="font-bold">{descartarThisMonth || 0}</span>
              </div>
              <div className="h-3 rounded-full bg-muted">
                <div
                  className="h-3 rounded-full bg-red-500"
                  style={{
                    width: `${thisMonthCount ? ((descartarThisMonth || 0) / thisMonthCount) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Por Canal */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Canal</CardTitle>
            <CardDescription>De onde vêm os currículos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-emerald-500" />
                  <span>WhatsApp</span>
                </div>
                <span className="font-bold">{whatsappThisMonth || 0}</span>
              </div>
              <div className="h-3 rounded-full bg-muted">
                <div
                  className="h-3 rounded-full bg-emerald-500"
                  style={{
                    width: `${thisMonthCount ? ((whatsappThisMonth || 0) / thisMonthCount) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-blue-500" />
                  <span>Email</span>
                </div>
                <span className="font-bold">{emailThisMonth || 0}</span>
              </div>
              <div className="h-3 rounded-full bg-muted">
                <div
                  className="h-3 rounded-full bg-blue-500"
                  style={{
                    width: `${thisMonthCount ? ((emailThisMonth || 0) / thisMonthCount) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            <div className="mt-6 rounded-lg bg-muted p-4">
              <p className="text-sm font-medium">💡 Dica</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Divulgue seu WhatsApp em anúncios de vagas para aumentar o volume
                de candidatos pelo canal mais rápido.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resumo */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo do Período</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-green-50 p-4">
              <p className="text-sm text-green-600">Economia de Tempo</p>
              <p className="text-2xl font-bold text-green-700">
                {Math.round((thisMonthCount || 0) * 5 / 60)}h
              </p>
              <p className="text-xs text-green-600">
                vs. triagem manual (~5min/currículo)
              </p>
            </div>
            <div className="rounded-lg bg-blue-50 p-4">
              <p className="text-sm text-blue-600">Custo por Currículo</p>
              <p className="text-2xl font-bold text-blue-700">
                R$ {(0.17).toFixed(2)}
              </p>
              <p className="text-xs text-blue-600">IA + infraestrutura</p>
            </div>
            <div className="rounded-lg bg-purple-50 p-4">
              <p className="text-sm text-purple-600">Custo Total Estimado</p>
              <p className="text-2xl font-bold text-purple-700">
                R$ {((thisMonthCount || 0) * 0.17).toFixed(2)}
              </p>
              <p className="text-xs text-purple-600">Este mês</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
