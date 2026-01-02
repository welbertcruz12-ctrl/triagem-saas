import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Mail,
  Zap,
  Users,
  BarChart3,
  Shield,
  ArrowRight,
  Check,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">TriagemAI</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="#features" className="text-sm font-medium hover:text-primary">
              Funcionalidades
            </Link>
            <Link href="#pricing" className="text-sm font-medium hover:text-primary">
              Preços
            </Link>
            <Link href="/auth/login">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Começar Grátis</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="container flex flex-col items-center justify-center gap-8 py-24 text-center">
        <div className="flex items-center gap-2 rounded-full border bg-muted px-4 py-1.5 text-sm">
          <span className="text-green-600">●</span>
          <span>+500 currículos triados este mês</span>
        </div>
        <h1 className="max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl">
          Triagem de Currículos com{" "}
          <span className="text-primary">Inteligência Artificial</span>
        </h1>
        <p className="max-w-2xl text-xl text-muted-foreground">
          Receba currículos pelo WhatsApp ou Email. Nossa IA analisa, classifica
          e responde automaticamente. Você só vê os melhores candidatos.
        </p>
        <div className="flex gap-4">
          <Link href="/auth/register">
            <Button size="lg" className="gap-2">
              Começar Grátis <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="#demo">
            <Button size="lg" variant="outline">
              Ver Demonstração
            </Button>
          </Link>
        </div>
        <p className="text-sm text-muted-foreground">
          14 dias grátis • Sem cartão de crédito • Cancele quando quiser
        </p>
      </section>

      {/* Stats */}
      <section className="border-y bg-muted/50">
        <div className="container grid grid-cols-2 gap-8 py-12 md:grid-cols-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary">8</div>
            <div className="text-sm text-muted-foreground">Agentes de IA</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary">&lt;30s</div>
            <div className="text-sm text-muted-foreground">Tempo de Análise</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary">98%</div>
            <div className="text-sm text-muted-foreground">Precisão</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary">24/7</div>
            <div className="text-sm text-muted-foreground">Disponibilidade</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container py-24">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold">Como Funciona</h2>
          <p className="mt-2 text-muted-foreground">
            Automatize todo o processo de triagem em 3 passos
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-lg border p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">1. Receba</h3>
            <p className="text-muted-foreground">
              Candidatos enviam currículo pelo WhatsApp ou Email da sua empresa.
              Sem formulários, sem fricção.
            </p>
          </div>
          <div className="rounded-lg border p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">2. Analise</h3>
            <p className="text-muted-foreground">
              8 agentes de IA analisam experiência, perfil comportamental,
              fit cultural e recomendam departamento.
            </p>
          </div>
          <div className="rounded-lg border p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">3. Responda</h3>
            <p className="text-muted-foreground">
              Candidato recebe resposta personalizada automaticamente. Você só
              vê os classificados para AVANÇAR.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-y bg-muted/50 py-24">
        <div className="container">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold">
                Por que empresas escolhem o TriagemAI?
              </h2>
              <p className="mt-4 text-muted-foreground">
                Economize tempo, reduza custos e encontre os melhores candidatos
                sem esforço manual.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  "Economia de 80% do tempo do RH",
                  "Resposta instantânea 24/7",
                  "Análise imparcial e consistente",
                  "Integração com WhatsApp Business",
                  "Dashboard completo de candidatos",
                  "Relatórios e métricas detalhadas",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center justify-center">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border bg-background p-6 text-center">
                  <Users className="mx-auto mb-2 h-8 w-8 text-primary" />
                  <div className="text-2xl font-bold">500+</div>
                  <div className="text-sm text-muted-foreground">
                    Currículos/mês
                  </div>
                </div>
                <div className="rounded-lg border bg-background p-6 text-center">
                  <BarChart3 className="mx-auto mb-2 h-8 w-8 text-primary" />
                  <div className="text-2xl font-bold">3x</div>
                  <div className="text-sm text-muted-foreground">
                    Mais eficiência
                  </div>
                </div>
                <div className="rounded-lg border bg-background p-6 text-center">
                  <Shield className="mx-auto mb-2 h-8 w-8 text-primary" />
                  <div className="text-2xl font-bold">LGPD</div>
                  <div className="text-sm text-muted-foreground">
                    Compliance
                  </div>
                </div>
                <div className="rounded-lg border bg-background p-6 text-center">
                  <Zap className="mx-auto mb-2 h-8 w-8 text-primary" />
                  <div className="text-2xl font-bold">30s</div>
                  <div className="text-sm text-muted-foreground">
                    Por currículo
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="container py-24">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold">Planos Simples e Transparentes</h2>
          <p className="mt-2 text-muted-foreground">
            Escolha o plano ideal para o tamanho da sua operação
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {/* Starter */}
          <div className="rounded-lg border p-8">
            <h3 className="text-xl font-semibold">Starter</h3>
            <p className="mt-2 text-muted-foreground">
              Para pequenas empresas
            </p>
            <div className="mt-4">
              <span className="text-4xl font-bold">R$ 197</span>
              <span className="text-muted-foreground">/mês</span>
            </div>
            <ul className="mt-6 space-y-3">
              {[
                "100 currículos/mês",
                "WhatsApp + Email",
                "Dashboard básico",
                "Suporte por email",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-600" />
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/auth/register?plan=starter" className="mt-6 block">
              <Button className="w-full" variant="outline">
                Começar Grátis
              </Button>
            </Link>
          </div>

          {/* Pro */}
          <div className="relative rounded-lg border-2 border-primary p-8">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
              POPULAR
            </div>
            <h3 className="text-xl font-semibold">Pro</h3>
            <p className="mt-2 text-muted-foreground">
              Para empresas em crescimento
            </p>
            <div className="mt-4">
              <span className="text-4xl font-bold">R$ 497</span>
              <span className="text-muted-foreground">/mês</span>
            </div>
            <ul className="mt-6 space-y-3">
              {[
                "500 currículos/mês",
                "WhatsApp + Email",
                "Dashboard completo",
                "Relatórios avançados",
                "Multi-usuário (3)",
                "Suporte prioritário",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-600" />
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/auth/register?plan=pro" className="mt-6 block">
              <Button className="w-full">Começar Grátis</Button>
            </Link>
          </div>

          {/* Enterprise */}
          <div className="rounded-lg border p-8">
            <h3 className="text-xl font-semibold">Enterprise</h3>
            <p className="mt-2 text-muted-foreground">
              Para grandes operações
            </p>
            <div className="mt-4">
              <span className="text-4xl font-bold">R$ 997</span>
              <span className="text-muted-foreground">/mês</span>
            </div>
            <ul className="mt-6 space-y-3">
              {[
                "Currículos ilimitados",
                "WhatsApp + Email",
                "Dashboard completo",
                "Prompts customizados",
                "Multi-usuário (10)",
                "API de integração",
                "Suporte dedicado",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-600" />
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/auth/register?plan=enterprise" className="mt-6 block">
              <Button className="w-full" variant="outline">
                Falar com Vendas
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-primary py-16 text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl font-bold">
            Pronto para automatizar sua triagem?
          </h2>
          <p className="mx-auto mt-4 max-w-xl opacity-90">
            Comece grátis por 14 dias. Sem cartão de crédito. Configure em
            minutos e veja resultados imediatos.
          </p>
          <Link href="/auth/register" className="mt-8 inline-block">
            <Button
              size="lg"
              variant="secondary"
              className="gap-2 text-primary"
            >
              Criar Conta Grátis <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-primary" />
              <span className="font-semibold">TriagemAI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 TriagemAI. Todos os direitos reservados.
            </p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <Link href="/termos" className="hover:text-foreground">
                Termos de Uso
              </Link>
              <Link href="/privacidade" className="hover:text-foreground">
                Privacidade
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
