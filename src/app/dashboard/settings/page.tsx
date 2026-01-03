"use client";

import { useState, useEffect } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Building,
  MessageSquare,
  Mail,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Copy,
  RefreshCw,
} from "lucide-react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tenant, setTenant] = useState<any>(null);
  const [formData, setFormData] = useState({
    company_name: "",
    phone: "",
    cnpj: "",
    whatsapp_instance_id: "",
    whatsapp_token: "",
    email_from: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    loadTenant();
  }, []);

  const loadTenant = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: userData } = await supabase
        .from("users")
.select("tenant_id, tenants(*)")
        .eq("auth_id", user?.id)
        .single();
      if (userData?.tenants) {
        const tenantData = Array.isArray(userData.tenants) ? userData.tenants[0] : userData.tenants;
        setTenant(tenantData);
        setFormData({
          company_name: tenantData?.company_name || "",
          phone: tenantData?.phone || "",
          cnpj: tenantData?.cnpj || "",
          whatsapp_instance_id: tenantData?.whatsapp_instance_id || "",
          whatsapp_token: tenantData?.whatsapp_token || "",
          email_from: tenantData?.email_from || "",
        });
      }
    } catch (error) {
      console.error("Erro ao carregar:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const { error } = await supabase
        .from("tenants")
        .update({
          company_name: formData.company_name,
          phone: formData.phone,
          cnpj: formData.cnpj,
          whatsapp_instance_id: formData.whatsapp_instance_id,
          whatsapp_token: formData.whatsapp_token,
          email_from: formData.email_from,
        })
        .eq("id", tenant.id);

      if (error) throw error;

      setMessage({ type: "success", text: "Configurações salvas com sucesso!" });
      loadTenant();
    } catch (error) {
      console.error("Erro ao salvar:", error);
      setMessage({ type: "error", text: "Erro ao salvar configurações" });
    } finally {
      setSaving(false);
    }
  };

  const copyWebhookUrl = () => {
    const url = `${window.location.origin}/api/webhook`;
    navigator.clipboard.writeText(url);
    setMessage({ type: "success", text: "URL copiada!" });
    setTimeout(() => setMessage({ type: "", text: "" }), 2000);
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações da sua conta
        </p>
      </div>

      {/* Message */}
      {message.text && (
        <div
          className={`rounded-lg p-4 ${
            message.type === "success"
              ? "bg-green-50 text-green-600"
              : "bg-red-50 text-red-600"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Plano */}
      <Card>
        <CardHeader>
          <CardTitle>Seu Plano</CardTitle>
          <CardDescription>Detalhes do seu plano atual</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-medium">
                Plano {tenant?.plan?.charAt(0).toUpperCase() + tenant?.plan?.slice(1)}
              </p>
              <p className="text-sm text-muted-foreground">
                {tenant?.plan_used || 0} de {tenant?.plan_limit || 0} currículos usados este mês
              </p>
            </div>
            <div className="text-right">
              <Badge
                variant={
                  tenant?.subscription_status === "active"
                    ? "success"
                    : tenant?.subscription_status === "trialing"
                    ? "warning"
                    : "danger"
                }
              >
                {tenant?.subscription_status === "active"
                  ? "Ativo"
                  : tenant?.subscription_status === "trialing"
                  ? "Teste Grátis"
                  : "Inativo"}
              </Badge>
              {tenant?.trial_ends_at && tenant?.subscription_status === "trialing" && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Teste termina em{" "}
                  {new Date(tenant.trial_ends_at).toLocaleDateString("pt-BR")}
                </p>
              )}
            </div>
          </div>
          <div className="mt-4 h-2 rounded-full bg-muted">
            <div
              className={`h-2 rounded-full ${
                (tenant?.plan_used / tenant?.plan_limit) * 100 > 90
                  ? "bg-red-500"
                  : (tenant?.plan_used / tenant?.plan_limit) * 100 > 70
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }`}
              style={{
                width: `${Math.min(
                  (tenant?.plan_used / tenant?.plan_limit) * 100,
                  100
                )}%`,
              }}
            />
          </div>
          <Button variant="outline" className="mt-4">
            Fazer Upgrade
          </Button>
        </CardContent>
      </Card>

      {/* Dados da Empresa */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Dados da Empresa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="company_name">Nome da Empresa</Label>
              <Input
                id="company_name"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(00) 00000-0000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input
                id="cnpj"
                name="cnpj"
                value={formData.cnpj}
                onChange={handleChange}
                placeholder="00.000.000/0000-00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email_from">Email de Resposta</Label>
              <Input
                id="email_from"
                name="email_from"
                value={formData.email_from}
                onChange={handleChange}
                placeholder="rh@suaempresa.com"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* WhatsApp */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Integração WhatsApp (Z-API)
          </CardTitle>
          <CardDescription>
            Configure a integração com WhatsApp Business via Z-API
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            {formData.whatsapp_instance_id ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-green-600">WhatsApp Conectado</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                <span className="text-yellow-600">WhatsApp não configurado</span>
              </>
            )}
          </div>

          <div className="rounded-lg bg-muted p-4">
            <h4 className="font-medium">Como configurar:</h4>
            <ol className="mt-2 list-inside list-decimal space-y-1 text-sm text-muted-foreground">
              <li>Acesse z-api.io e crie uma conta</li>
              <li>Crie uma nova instância</li>
              <li>Conecte seu WhatsApp Business escaneando o QR Code</li>
              <li>Copie o Instance ID e Token</li>
              <li>Cole nos campos abaixo</li>
              <li>Configure o Webhook na Z-API para apontar para sua URL</li>
            </ol>
            <a
              href="https://www.z-api.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center text-sm text-primary hover:underline"
            >
              Acessar Z-API
              <ExternalLink className="ml-1 h-4 w-4" />
            </a>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="whatsapp_instance_id">Instance ID</Label>
              <Input
                id="whatsapp_instance_id"
                name="whatsapp_instance_id"
                value={formData.whatsapp_instance_id}
                onChange={handleChange}
                placeholder="Cole o Instance ID"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp_token">Token</Label>
              <Input
                id="whatsapp_token"
                name="whatsapp_token"
                type="password"
                value={formData.whatsapp_token}
                onChange={handleChange}
                placeholder="Cole o Token"
              />
            </div>
          </div>

          {/* Webhook URL */}
          <div className="space-y-2">
            <Label>URL do Webhook (configure na Z-API)</Label>
            <div className="flex gap-2">
              <Input
                value={typeof window !== "undefined" ? `${window.location.origin}/api/webhook` : ""}
                readOnly
                className="bg-muted"
              />
              <Button variant="outline" onClick={copyWebhookUrl}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Configure esta URL no webhook da Z-API para receber os currículos
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Salvar */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Salvar Configurações
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
