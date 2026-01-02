import { createServerSupabaseClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import {
  Users,
  Filter,
  Download,
  Search,
  Eye,
  MessageSquare,
  Mail,
} from "lucide-react";
import { formatDate, getDecisionLabel, formatPhone } from "@/lib/utils";

export default async function CandidatesPage({
  searchParams,
}: {
  searchParams: { decision?: string; channel?: string; search?: string };
}) {
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

  // Query base
  let query = supabase
    .from("candidates")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });

  // Filtros
  if (searchParams.decision) {
    query = query.eq("final_decision", searchParams.decision.toUpperCase());
  }

  if (searchParams.channel) {
    query = query.eq("source_channel", searchParams.channel);
  }

  if (searchParams.search) {
    query = query.or(
      `name.ilike.%${searchParams.search}%,email.ilike.%${searchParams.search}%,phone.ilike.%${searchParams.search}%`
    );
  }

  const { data: candidates } = await query;

  // Contadores para filtros
  const { count: totalCount } = await supabase
    .from("candidates")
    .select("*", { count: "exact", head: true })
    .eq("tenant_id", tenantId);

  const { count: avancarCount } = await supabase
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

  const filters = [
    { label: "Todos", value: "", count: totalCount },
    { label: "Avançar", value: "avancar", count: avancarCount },
    { label: "Avaliar", value: "avaliar", count: avaliarCount },
    { label: "Descartar", value: "descartar", count: descartarCount },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Candidatos</h1>
          <p className="text-muted-foreground">
            Gerencie todos os currículos recebidos
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Decision Filter */}
            <div className="flex gap-2">
              {filters.map((filter) => (
                <Link
                  key={filter.value}
                  href={`/dashboard/candidates${filter.value ? `?decision=${filter.value}` : ""}`}
                >
                  <Button
                    variant={
                      searchParams.decision === filter.value ||
                      (!searchParams.decision && !filter.value)
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                  >
                    {filter.label}
                    <Badge variant="secondary" className="ml-2">
                      {filter.count || 0}
                    </Badge>
                  </Button>
                </Link>
              ))}
            </div>

            {/* Channel Filter */}
            <div className="flex gap-2 border-l pl-4">
              <Link
                href={`/dashboard/candidates${searchParams.decision ? `?decision=${searchParams.decision}&channel=whatsapp` : "?channel=whatsapp"}`}
              >
                <Button
                  variant={searchParams.channel === "whatsapp" ? "default" : "outline"}
                  size="sm"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  WhatsApp
                </Button>
              </Link>
              <Link
                href={`/dashboard/candidates${searchParams.decision ? `?decision=${searchParams.decision}&channel=email` : "?channel=email"}`}
              >
                <Button
                  variant={searchParams.channel === "email" ? "default" : "outline"}
                  size="sm"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Email
                </Button>
              </Link>
            </div>

            {/* Search */}
            <div className="ml-auto">
              <form>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    name="search"
                    placeholder="Buscar por nome, email ou telefone..."
                    defaultValue={searchParams.search}
                    className="h-9 w-64 rounded-md border bg-background pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {candidates && candidates.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidato</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Canal</TableHead>
                  <TableHead>Decisão</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidates.map((candidate) => (
                  <TableRow key={candidate.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-medium">
                          {candidate.name?.charAt(0) || "?"}
                        </div>
                        <div>
                          <p className="font-medium">
                            {candidate.name || "Nome não extraído"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {candidate.city && candidate.state
                              ? `${candidate.city}, ${candidate.state}`
                              : "Local não informado"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {candidate.email && <p>{candidate.email}</p>}
                        {candidate.phone && (
                          <p className="text-muted-foreground">
                            {formatPhone(candidate.phone)}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          candidate.source_channel === "whatsapp"
                            ? "whatsapp"
                            : "email"
                        }
                      >
                        {candidate.source_channel === "whatsapp" ? (
                          <>
                            <MessageSquare className="mr-1 h-3 w-3" />
                            WhatsApp
                          </>
                        ) : (
                          <>
                            <Mail className="mr-1 h-3 w-3" />
                            Email
                          </>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {candidate.final_decision ? (
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
                      ) : (
                        <Badge variant="secondary">Processando...</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {candidate.final_score ? (
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-16 rounded-full bg-muted">
                            <div
                              className={`h-2 rounded-full ${
                                candidate.final_score >= 70
                                  ? "bg-green-500"
                                  : candidate.final_score >= 40
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                              style={{ width: `${candidate.final_score}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">
                            {candidate.final_score.toFixed(0)}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(candidate.created_at)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {candidate.response_sent ? (
                        <Badge variant="outline" className="text-green-600">
                          Respondido
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-yellow-600">
                          Pendente
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/dashboard/candidates/${candidate.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="mr-2 h-4 w-4" />
                          Ver Detalhes
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Users className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-medium">Nenhum candidato encontrado</h3>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                {searchParams.decision || searchParams.channel || searchParams.search
                  ? "Nenhum candidato corresponde aos filtros selecionados"
                  : "Os candidatos aparecerão aqui quando enviarem currículos"}
              </p>
              {(searchParams.decision || searchParams.channel || searchParams.search) && (
                <Link href="/dashboard/candidates" className="mt-4">
                  <Button variant="outline">Limpar Filtros</Button>
                </Link>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
