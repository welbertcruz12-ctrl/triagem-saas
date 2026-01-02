import { createServerSupabaseClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  MessageSquare,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Car,
} from "lucide-react";
import { formatDate, getDecisionLabel, formatPhone } from "@/lib/utils";

export default async function CandidateDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createServerSupabaseClient();

  const { data: candidate, error } = await supabase
    .from("candidates")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !candidate) {
    notFound();
  }

  // Parse dos resultados dos agentes
  const watson = candidate.watson_result || {};
  const laszlo = candidate.laszlo_result || {};
  const adamGrant = candidate.adam_grant_result || {};
  const deming = candidate.deming_result || {};
  const drucker = candidate.drucker_result || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/candidates">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">
            {candidate.name || "Candidato"}
          </h1>
          <p className="text-muted-foreground">
            Recebido em {formatDate(candidate.created_at)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant={
              candidate.source_channel === "whatsapp" ? "whatsapp" : "email"
            }
          >
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
              className="text-lg px-4 py-1"
            >
              {getDecisionLabel(candidate.final_decision)}
            </Badge>
          )}
        </div>
      </div>

      {/* Score e Decisão */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">
                {candidate.final_score?.toFixed(0) || "-"}%
              </div>
              <p className="text-sm text-muted-foreground">Score Final</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-xl font-bold">
                {candidate.recommended_department || "-"}
              </div>
              <p className="text-sm text-muted-foreground">
                Departamento Recomendado
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-xl font-bold">
                {adamGrant.perfil_dominante || "-"}
              </div>
              <p className="text-sm text-muted-foreground">Perfil Comportamental</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              {candidate.response_sent ? (
                <CheckCircle className="mx-auto h-8 w-8 text-green-500" />
              ) : (
                <AlertCircle className="mx-auto h-8 w-8 text-yellow-500" />
              )}
              <p className="mt-2 text-sm text-muted-foreground">
                {candidate.response_sent ? "Resposta Enviada" : "Aguardando Resposta"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Dados Pessoais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Dados Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{candidate.name || watson?.dados_pessoais?.nome_completo || "Não informado"}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{candidate.email || watson?.dados_pessoais?.email || "Não informado"}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>
                {candidate.phone
                  ? formatPhone(candidate.phone)
                  : watson?.dados_pessoais?.telefone || "Não informado"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>
                {candidate.city && candidate.state
                  ? `${candidate.city}, ${candidate.state}`
                  : watson?.dados_pessoais?.cidade
                  ? `${watson.dados_pessoais.cidade}, ${watson.dados_pessoais.estado}`
                  : "Não informado"}
              </span>
            </div>
            {watson?.cnh && (
              <div className="flex items-center gap-3">
                <Car className="h-4 w-4 text-muted-foreground" />
                <span>
                  CNH: {watson.cnh.possui ? `Categoria ${watson.cnh.categoria}` : "Não possui"}
                </span>
                {laszlo?.cnh_compativel !== undefined && (
                  <Badge variant={laszlo.cnh_compativel ? "success" : "danger"}>
                    {laszlo.cnh_compativel ? "Compatível" : "Incompatível"}
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Análise Laszlo (Notas) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Análise Estrutural (Laszlo)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {laszlo?.notas ? (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Experiência</span>
                    <span className="font-medium">{laszlo.notas.experiencia}/10</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{ width: `${(laszlo.notas.experiencia / 10) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Formação</span>
                    <span className="font-medium">{laszlo.notas.formacao}/10</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{ width: `${(laszlo.notas.formacao / 10) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Habilidades</span>
                    <span className="font-medium">{laszlo.notas.habilidades}/10</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{ width: `${(laszlo.notas.habilidades / 10) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Estabilidade</span>
                    <span className="font-medium">{laszlo.notas.estabilidade}/10</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{ width: `${(laszlo.notas.estabilidade / 10) * 100}%` }}
                    />
                  </div>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground">Análise não disponível</p>
            )}
          </CardContent>
        </Card>

        {/* Experiências */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Experiências Profissionais
            </CardTitle>
          </CardHeader>
          <CardContent>
            {watson?.experiencias_profissionais?.length > 0 ? (
              <div className="space-y-4">
                {watson.experiencias_profissionais.map((exp: any, index: number) => (
                  <div key={index} className="border-l-2 border-primary pl-4">
                    <p className="font-medium">{exp.cargo}</p>
                    <p className="text-sm text-muted-foreground">{exp.empresa}</p>
                    <p className="text-xs text-muted-foreground">{exp.periodo}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Nenhuma experiência registrada</p>
            )}
          </CardContent>
        </Card>

        {/* Formação */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Formação Acadêmica
            </CardTitle>
          </CardHeader>
          <CardContent>
            {watson?.formacao_academica?.length > 0 ? (
              <div className="space-y-4">
                {watson.formacao_academica.map((form: any, index: number) => (
                  <div key={index} className="border-l-2 border-primary pl-4">
                    <p className="font-medium">{form.curso || form.nivel}</p>
                    <p className="text-sm text-muted-foreground">{form.instituicao}</p>
                    <Badge variant="outline" className="mt-1">
                      {form.situacao}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Nenhuma formação registrada</p>
            )}
          </CardContent>
        </Card>

        {/* Perfil Comportamental */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Perfil Comportamental (Adam Grant)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {adamGrant?.percentuais ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-blue-50 p-3 text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {adamGrant.percentuais.comunicador}%
                    </p>
                    <p className="text-sm text-blue-600">Comunicador</p>
                  </div>
                  <div className="rounded-lg bg-green-50 p-3 text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {adamGrant.percentuais.executor}%
                    </p>
                    <p className="text-sm text-green-600">Executor</p>
                  </div>
                  <div className="rounded-lg bg-yellow-50 p-3 text-center">
                    <p className="text-2xl font-bold text-yellow-600">
                      {adamGrant.percentuais.planejador}%
                    </p>
                    <p className="text-sm text-yellow-600">Planejador</p>
                  </div>
                  <div className="rounded-lg bg-purple-50 p-3 text-center">
                    <p className="text-2xl font-bold text-purple-600">
                      {adamGrant.percentuais.analista}%
                    </p>
                    <p className="text-sm text-purple-600">Analista</p>
                  </div>
                </div>
                {adamGrant.fit_cultural && (
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-sm text-muted-foreground">Fit Cultural</p>
                    <p className="text-xl font-bold">{adamGrant.fit_cultural}%</p>
                  </div>
                )}
              </>
            ) : (
              <p className="text-muted-foreground">Análise não disponível</p>
            )}
          </CardContent>
        </Card>

        {/* Decisão Drucker */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Decisão Final (Drucker)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {drucker?.justificativa ? (
              <>
                <p className="text-sm">{drucker.justificativa}</p>
                {drucker.proximos_passos?.length > 0 && (
                  <div>
                    <p className="font-medium mb-2">Próximos Passos:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {drucker.proximos_passos.map((passo: string, index: number) => (
                        <li key={index}>{passo}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {drucker.riscos_identificados?.length > 0 && (
                  <div>
                    <p className="font-medium mb-2 text-red-600">Riscos:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-red-600">
                      {drucker.riscos_identificados.map((risco: string, index: number) => (
                        <li key={index}>{risco}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <p className="text-muted-foreground">Análise não disponível</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Red Flags e Pontos Fortes */}
      {(laszlo?.red_flags?.length > 0 || laszlo?.pontos_fortes?.length > 0) && (
        <div className="grid gap-6 md:grid-cols-2">
          {laszlo?.pontos_fortes?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  Pontos Fortes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {laszlo.pontos_fortes.map((ponto: string, index: number) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      {ponto}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
          {laszlo?.red_flags?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <XCircle className="h-5 w-5" />
                  Red Flags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {laszlo.red_flags.map((flag: string, index: number) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <XCircle className="h-4 w-4 text-red-500" />
                      {flag}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Texto do Currículo */}
      {candidate.resume_text && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Texto Extraído do Currículo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap rounded-lg bg-muted p-4 text-sm">
              {candidate.resume_text}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
