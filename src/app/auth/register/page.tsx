"use client";

import { Suspense } from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Loader2, Check } from "lucide-react";

function RegisterContent() {
  const searchParams = useSearchParams();
  const planFromUrl = searchParams.get("plan") || "starter";

  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createBrowserSupabaseClient();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validações
    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      setLoading(false);
      return;
    }

    try {
      // 1. Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            company_name: formData.companyName,
          },
        },
      });

      if (authError) {
        if (authError.message.includes("already registered")) {
          setError("Este email já está cadastrado");
        } else {
          setError(authError.message);
        }
        return;
      }

      if (!authData.user) {
        setError("Erro ao criar conta. Tente novamente.");
        return;
      }

      // 2. Criar tenant (empresa)
      const { data: tenant, error: tenantError } = await supabase
        .from("tenants")
        .insert({
          company_name: formData.companyName,
          email: formData.email,
          plan: planFromUrl,
          plan_limit: planFromUrl === "starter" ? 100 : planFromUrl === "pro" ? 500 : 10000,
        })
        .select()
        .single();

      if (tenantError) {
        console.error("Erro ao criar tenant:", tenantError);
        setError("Erro ao criar empresa. Tente novamente.");
        return;
      }

      // 3. Criar user vinculado ao tenant
      const { error: userError } = await supabase.from("users").insert({
        tenant_id: tenant.id,
        email: formData.email,
        name: formData.companyName,
        role: "owner",
        auth_id: authData.user.id,
      });

      if (userError) {
        console.error("Erro ao criar user:", userError);
      }

      // 4. Redirecionar para onboarding
      router.push("/onboarding");
      router.refresh();
    } catch (err) {
      console.error("Erro:", err);
      setError("Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const planDetails: Record<string, { name: string; price: string; features: string[] }> = {
    starter: {
      name: "Starter",
      price: "R$ 197/mês",
      features: ["100 currículos/mês", "WhatsApp + Email", "Dashboard básico"],
    },
    pro: {
      name: "Pro",
      price: "R$ 497/mês",
      features: ["500 currículos/mês", "Relatórios avançados", "Multi-usuário"],
    },
    enterprise: {
      name: "Enterprise",
      price: "R$ 997/mês",
      features: ["Currículos ilimitados", "Prompts customizados", "API"],
    },
  };

  const currentPlan = planDetails[planFromUrl] || planDetails.starter;

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="mb-4 flex items-center justify-center gap-2">
            <Zap className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">TriagemAI</span>
          </Link>
          <CardTitle>Criar conta grátis</CardTitle>
          <CardDescription>
            14 dias grátis • Cancele quando quiser
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleRegister}>
          <CardContent className="space-y-4">
            {/* Plano selecionado */}
            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Plano {currentPlan.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {currentPlan.price}
                  </p>
                </div>
                <Link
                  href="/#pricing"
                  className="text-sm text-primary hover:underline"
                >
                  Trocar plano
                </Link>
              </div>
              <ul className="mt-2 space-y-1">
                {currentPlan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <Check className="h-3 w-3 text-green-600" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="companyName">Nome da Empresa</Label>
              <Input
                id="companyName"
                name="companyName"
                placeholder="Sua Empresa Ltda"
                value={formData.companyName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando conta...
                </>
              ) : (
                "Criar Conta Grátis"
              )}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Ao criar uma conta, você concorda com nossos{" "}
              <Link href="/termos" className="text-primary hover:underline">
                Termos de Uso
              </Link>{" "}
              e{" "}
              <Link href="/privacidade" className="text-primary hover:underline">
                Política de Privacidade
              </Link>
            </p>
            <p className="text-center text-sm text-muted-foreground">
              Já tem uma conta?{" "}
              <Link href="/auth/login" className="text-primary hover:underline">
                Entrar
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
} 

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <RegisterContent />
    </Suspense>
  );
}
