"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Zap,
  MessageSquare,
  Building,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  ExternalLink,
} from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Dados da Empresa",
    description: "Configure informações básicas",
    icon: Building,
  },
  {
    id: 2,
    title: "Conectar WhatsApp",
    description: "Integre com Z-API",
    icon: MessageSquare,
  },
  {
    id: 3,
    title: "Pronto!",
    description: "Comece a receber currículos",
    icon: CheckCircle,
  },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    cnpj: "",
    whatsappInstanceId: "",
    whatsappToken: "",
  });
  const router = useRouter();
  const supabase = createBrowserSupabaseClient();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      // Salvar dados da empresa
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const { data: userData } = await supabase
          .from("users")
          .select("tenant_id")
          .eq("auth_id", user?.id)
          .single();

        await supabase
          .from("tenants")
          .update({
            phone: formData.phone,
            cnpj: formData.cnpj,
          })
          .eq("id", userData?.tenant_id);

        setCurrentStep(2);
      } catch (error) {
        console.error("Erro:", error);
      } finally {
        setLoading(false);
      }
    } else if (currentStep === 2) {
      // Salvar credenciais WhatsApp
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const { data: userData } = await supabase
          .from("users")
          .select("tenant_id")
          .eq("auth_id", user?.id)
          .single();

        await supabase
          .from("tenants")
          .update({
            whatsapp_instance_id: formData.whatsappInstanceId,
            whatsapp_token: formData.whatsappToken,
          })
          .eq("id", userData?.tenant_id);

        setCurrentStep(3);
      } catch (error) {
        console.error("Erro:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSkipWhatsApp = async () => {
    setCurrentStep(3);
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: userData } = await supabase
        .from("users")
        .select("tenant_id")
        .eq("auth_id", user?.id)
        .single();

      // Marcar onboarding como completo
      await supabase
        .from("tenants")
        .update({ onboarding_completed: true })
        .eq("id", userData?.tenant_id);

      // Criar departamentos padrão
      const defaultDepartments = [
        { tenant_id: userData?.tenant_id, name: "Logística", description: "Motoristas, entregadores, estoquistas" },
        { tenant_id: userData?.tenant_id, name: "Comercial", description: "Vendedores, representantes" },
        { tenant_id: userData?.tenant_id, name: "Administrativo", description: "Financeiro, RH, recepção" },
        { tenant_id: userData?.tenant_id, name: "Operacional", description: "Produção, manutenção" },
      ];

      await supabase.from("departments").insert(defaultDepartments);

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
      <div className="w-full max-w-2xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                    currentStep >= step.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground text-muted-foreground"
                  }`}
                >
                  {currentStep > step.id ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`mx-2 h-0.5 w-16 ${
                      currentStep > step.id ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="mb-4 flex items-center justify-center gap-2">
              <Zap className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">TriagemAI</span>
            </div>
            <CardTitle>{steps[currentStep - 1].title}</CardTitle>
            <CardDescription>{steps[currentStep - 1].description}</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Step 1: Dados da Empresa */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone da Empresa</Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="(00) 00000-0000"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ (opcional)</Label>
                  <Input
                    id="cnpj"
                    name="cnpj"
                    placeholder="00.000.000/0000-00"
                    value={formData.cnpj}
                    onChange={handleChange}
                  />
                </div>
                <Button onClick={handleNext} className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      Continuar
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Step 2: WhatsApp */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="rounded-lg bg-muted p-4">
                  <h4 className="font-medium">Como conectar o WhatsApp?</h4>
                  <ol className="mt-2 list-inside list-decimal space-y-1 text-sm text-muted-foreground">
                    <li>Crie uma conta na Z-API (clique no link abaixo)</li>
                    <li>Crie uma nova instância</li>
                    <li>Conecte seu WhatsApp Business</li>
                    <li>Copie o Instance ID e Token</li>
                    <li>Cole nos campos abaixo</li>
                  </ol>
                  <a
                    href="https://www.z-api.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center text-sm text-primary hover:underline"
                  >
                    Criar conta na Z-API
                    <ExternalLink className="ml-1 h-4 w-4" />
                  </a>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsappInstanceId">Instance ID</Label>
                  <Input
                    id="whatsappInstanceId"
                    name="whatsappInstanceId"
                    placeholder="Cole o Instance ID da Z-API"
                    value={formData.whatsappInstanceId}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsappToken">Token</Label>
                  <Input
                    id="whatsappToken"
                    name="whatsappToken"
                    type="password"
                    placeholder="Cole o Token da Z-API"
                    value={formData.whatsappToken}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar
                  </Button>
                  <Button onClick={handleNext} className="flex-1" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        Continuar
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>

                <button
                  onClick={handleSkipWhatsApp}
                  className="w-full text-center text-sm text-muted-foreground hover:text-foreground"
                >
                  Pular por agora (configurar depois)
                </button>
              </div>
            )}

            {/* Step 3: Pronto */}
            {currentStep === 3 && (
              <div className="space-y-6 text-center">
                <div className="flex justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold">Tudo pronto!</h3>
                  <p className="mt-2 text-muted-foreground">
                    Sua conta está configurada. Agora você pode começar a receber
                    currículos automaticamente.
                  </p>
                </div>

                <div className="rounded-lg bg-muted p-4 text-left">
                  <h4 className="font-medium">Próximos passos:</h4>
                  <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      {formData.whatsappInstanceId
                        ? "WhatsApp configurado"
                        : "Configurar WhatsApp (em Configurações)"}
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Departamentos padrão criados
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full border-2" />
                      Criar sua primeira vaga
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full border-2" />
                      Divulgar WhatsApp para candidatos
                    </li>
                  </ul>
                </div>

                <Button onClick={handleFinish} className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Finalizando...
                    </>
                  ) : (
                    <>
                      Ir para o Dashboard
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
