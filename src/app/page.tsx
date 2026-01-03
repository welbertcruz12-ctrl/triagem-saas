"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  Clock,
  Target,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Users,
  Brain,
  MessageSquare,
  BarChart3,
  Shield,
  Star,
  Calculator,
  Building,
  UserCheck,
  XCircle,
  Sparkles,
} from "lucide-react";

// Dados dos planos atualizados - Margem 300%+
const plans = [
  {
    name: "Essencial",
    price: "297",
    period: "/mês",
    description: "Para empresas iniciando a automação",
    curriculos: "100",
    custoComparado: "4.250",
    economia: "93%",
    pricePerCV: "2,97",
    features: [
      "100 currículos/mês",
      "9 Agentes de IA",
      "Análise em 30 segundos",
      "Dashboard básico",
      "Suporte por email",
      "Relatórios mensais",
    ],
    popular: false,
    cta: "Começar Agora",
  },
  {
    name: "Crescimento",
    price: "697",
    period: "/mês",
    description: "Para empresas em expansão",
    curriculos: "300",
    custoComparado: "6.800",
    economia: "90%",
    pricePerCV: "2,32",
    features: [
      "300 currículos/mês",
      "9 Agentes de IA",
      "Análise em 30 segundos",
      "Dashboard completo",
      "Suporte prioritário",
      "Relatórios semanais",
      "Integração WhatsApp",
      "Templates de vagas",
    ],
    popular: true,
    cta: "Mais Popular",
  },
  {
    name: "Escala",
    price: "1.497",
    period: "/mês",
    description: "Para alto volume de contratações",
    curriculos: "1.000",
    custoComparado: "11.050",
    economia: "86%",
    pricePerCV: "1,49",
    features: [
      "1.000 currículos/mês",
      "9 Agentes de IA",
      "Análise em 30 segundos",
      "Dashboard avançado",
      "Suporte 24/7 WhatsApp",
      "Relatórios em tempo real",
      "API de integração",
      "Múltiplos usuários",
      "Treinamento exclusivo",
    ],
    popular: false,
    cta: "Escalar Agora",
  },
];

// Agentes de IA
const agents = [
  { name: "Sherlock", role: "Análise de Experiência", icon: "🔍", description: "Detecta padrões e inconsistências" },
  { name: "Watson", role: "Extração de Dados", icon: "📊", description: "Estrutura informações do currículo" },
  { name: "Salomão", role: "Decisão Final", icon: "⚖️", description: "Pontuação e recomendação" },
  { name: "Laszlo", role: "Fit Cultural", icon: "🎯", description: "Compatibilidade com a empresa" },
  { name: "Adam Grant", role: "Soft Skills", icon: "💡", description: "Análise comportamental" },
  { name: "Deming", role: "Qualidade", icon: "✅", description: "Validação de dados" },
  { name: "Drucker", role: "Gestão", icon: "📈", description: "Potencial de liderança" },
  { name: "Carnegie", role: "Comunicação", icon: "🗣️", description: "Habilidades interpessoais" },
  { name: "Turing", role: "Técnico", icon: "💻", description: "Skills técnicas" },
];

export default function LandingPage() {
  const [showCalculator, setShowCalculator] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-8 w-8 text-emerald-600" />
            <span className="text-xl font-bold">TriagemAI</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#funcionalidades" className="text-sm text-muted-foreground hover:text-foreground">
              Funcionalidades
            </a>
            <a href="#precos" className="text-sm text-muted-foreground hover:text-foreground">
              Preços
            </a>
            <a href="#comparativo" className="text-sm text-muted-foreground hover:text-foreground">
              Comparativo
            </a>
            <Link href="/auth/login">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link href="/auth/register">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                Começar Grátis
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section - Headline Principal */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge de destaque */}
            <Badge className="mb-6 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
              <Sparkles className="w-3 h-3 mr-1" />
              +500 currículos triados este mês
            </Badge>
            
            {/* Headline Principal - Ancoragem de Valor */}
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Substitua uma Equipe de{" "}
              <span className="text-red-500 line-through">R$ 16.650/mês</span>
              <br />
              por{" "}
              <span className="text-emerald-600">R$ 697/mês</span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-muted-foreground mb-4">
              <strong>9 Especialistas de IA</strong> trabalhando 24/7 
              <br className="hidden md:block" />
              pelo preço de <strong>meio estagiário</strong>
            </p>
            
            {/* Prova Social Rápida */}
            <p className="text-lg text-muted-foreground mb-8">
              Enquanto seu concorrente gasta <strong>3 dias</strong> analisando currículos,
              <br className="hidden md:block" />
              você fecha a vaga em <strong className="text-emerald-600">30 segundos</strong>.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/auth/register">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-lg px-8 py-6">
                  Testar Grátis por 14 Dias
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                Ver Demonstração
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                Sem cartão de crédito
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                Cancele quando quiser
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                Suporte em português
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Métricas de Impacto */}
      <section className="py-12 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-emerald-400">9</div>
              <div className="text-sm text-slate-400">Agentes de IA</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-emerald-400">&lt;30s</div>
              <div className="text-sm text-slate-400">Tempo de Análise</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-emerald-400">98%</div>
              <div className="text-sm text-slate-400">Precisão</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-emerald-400">24/7</div>
              <div className="text-sm text-slate-400">Disponibilidade</div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Comparativo - FAÇA AS CONTAS */}
      <section id="comparativo" className="py-20 bg-gradient-to-b from-red-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-red-100 text-red-700">
              <Calculator className="w-3 h-3 mr-1" />
              Faça as Contas
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Quanto Você Gasta Hoje com Triagem?
            </h2>
            <p className="text-xl text-muted-foreground">
              Compare o custo real de uma equipe tradicional vs TriagemAI
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Custo Tradicional */}
              <Card className="border-red-200 bg-red-50/50">
                <CardHeader>
                  <div className="flex items-center gap-2 text-red-600 mb-2">
                    <XCircle className="h-6 w-6" />
                    <span className="font-semibold">MÉTODO TRADICIONAL</span>
                  </div>
                  <CardTitle className="text-2xl">Custo Mensal com RH</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between py-3 border-b">
                    <span>1 Analista de RH (CLT)</span>
                    <span className="font-semibold">R$ 6.800</span>
                  </div>
                  <div className="flex justify-between py-3 border-b">
                    <span>Softwares e ferramentas</span>
                    <span className="font-semibold">R$ 500</span>
                  </div>
                  <div className="flex justify-between py-3 border-b">
                    <span>Tempo de triagem (3-5 dias)</span>
                    <span className="font-semibold text-red-600">Lento</span>
                  </div>
                  <div className="flex justify-between py-3 border-b">
                    <span>Taxa de erro humano</span>
                    <span className="font-semibold text-red-600">~40%</span>
                  </div>
                  <div className="flex justify-between py-3 border-b">
                    <span>Disponibilidade</span>
                    <span className="font-semibold text-red-600">8h/dia</span>
                  </div>
                  <div className="flex justify-between py-4 bg-red-100 rounded-lg px-4 mt-4">
                    <span className="font-bold text-lg">TOTAL MENSAL</span>
                    <span className="font-bold text-2xl text-red-600">R$ 7.300+</span>
                  </div>
                  <p className="text-sm text-red-600 text-center">
                    * Sem contar férias, 13º, FGTS, INSS, vale transporte...
                  </p>
                </CardContent>
              </Card>

              {/* TriagemAI */}
              <Card className="border-emerald-200 bg-emerald-50/50 ring-2 ring-emerald-500">
                <CardHeader>
                  <div className="flex items-center gap-2 text-emerald-600 mb-2">
                    <CheckCircle className="h-6 w-6" />
                    <span className="font-semibold">TRIAGEMÂI</span>
                  </div>
                  <CardTitle className="text-2xl">Custo Mensal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between py-3 border-b">
                    <span>9 Agentes de IA especializados</span>
                    <span className="font-semibold text-emerald-600">Incluso</span>
                  </div>
                  <div className="flex justify-between py-3 border-b">
                    <span>Dashboard completo</span>
                    <span className="font-semibold text-emerald-600">Incluso</span>
                  </div>
                  <div className="flex justify-between py-3 border-b">
                    <span>Tempo de triagem</span>
                    <span className="font-semibold text-emerald-600">30 segundos</span>
                  </div>
                  <div className="flex justify-between py-3 border-b">
                    <span>Precisão da análise</span>
                    <span className="font-semibold text-emerald-600">98%</span>
                  </div>
                  <div className="flex justify-between py-3 border-b">
                    <span>Disponibilidade</span>
                    <span className="font-semibold text-emerald-600">24/7</span>
                  </div>
                  <div className="flex justify-between py-4 bg-emerald-100 rounded-lg px-4 mt-4">
                    <span className="font-bold text-lg">TOTAL MENSAL</span>
                    <span className="font-bold text-2xl text-emerald-600">R$ 697</span>
                  </div>
                  <p className="text-sm text-emerald-600 text-center font-semibold">
                    ✨ Economia de R$ 6.603/mês = R$ 79.236/ano
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Destaque de Economia */}
            <div className="mt-8 p-6 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl text-white text-center">
              <p className="text-lg mb-2">Com TriagemAI você economiza</p>
              <p className="text-5xl font-bold mb-2">R$ 79.236/ano</p>
              <p className="text-emerald-200">
                Isso paga o salário de mais um funcionário ou investe no crescimento da empresa
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 9 Agentes de IA */}
      <section id="funcionalidades" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-purple-100 text-purple-700">
              <Brain className="w-3 h-3 mr-1" />
              Inteligência Artificial
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              9 Especialistas Trabalhando Para Você
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Contratar 9 profissionais custaria <strong className="text-red-500">R$ 85.000/mês</strong>.
              <br />
              Você tem acesso a todos por <strong className="text-emerald-600">menos de R$ 700</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {agents.map((agent, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="text-4xl mb-2">{agent.icon}</div>
                  <CardTitle className="text-lg">{agent.name}</CardTitle>
                  <CardDescription className="text-emerald-600 font-medium">
                    {agent.role}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{agent.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simples de Usar, Poderoso nos Resultados
            </h2>
            <p className="text-xl text-muted-foreground">
              Em 3 passos você automatiza toda sua triagem
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Receba</h3>
              <p className="text-muted-foreground">
                Currículos chegam por WhatsApp ou Email automaticamente
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Analise</h3>
              <p className="text-muted-foreground">
                9 agentes de IA analisam em menos de 30 segundos
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCheck className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Contrate</h3>
              <p className="text-muted-foreground">
                Veja apenas os melhores candidatos, rankeados e prontos
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Preços */}
      <section id="precos" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-emerald-100 text-emerald-700">
              Preços Transparentes
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Menos que um Café por Currículo
            </h2>
            <p className="text-xl text-muted-foreground">
              A partir de <strong>R$ 1,49</strong> por análise completa.
              <br />
              Um headhunter cobra <strong className="text-red-500">R$ 50-100</strong> por currículo.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative ${plan.popular ? 'ring-2 ring-emerald-500 shadow-xl scale-105' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-emerald-600 text-white px-4 py-1">
                      <Star className="w-3 h-3 mr-1" />
                      Mais Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-sm text-muted-foreground">R$</span>
                    <span className="text-5xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-emerald-600 font-medium">
                      {plan.curriculos} currículos/mês
                    </p>
                    <p className="text-xs text-muted-foreground">
                      R$ {plan.pricePerCV} por currículo
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-emerald-50 rounded-lg p-3 mb-4 text-center">
                    <p className="text-xs text-muted-foreground">Comparado a RH tradicional</p>
                    <p className="text-sm">
                      <span className="line-through text-red-500">R$ {plan.custoComparado}</span>
                      {" → "}
                      <span className="font-bold text-emerald-600">R$ {plan.price}</span>
                    </p>
                    <p className="text-xs font-semibold text-emerald-600">
                      Economia de {plan.economia}
                    </p>
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href={`/auth/register?plan=${plan.name.toLowerCase()}`} className="w-full">
                    <Button 
                      className={`w-full ${plan.popular ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      {plan.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Garantia */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 bg-slate-100 rounded-full px-6 py-3">
              <Shield className="h-5 w-5 text-emerald-600" />
              <span>
                <strong>Garantia de 14 dias</strong> - Se não gostar, devolvemos seu dinheiro
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              O TriagemAI se Paga Sozinho
            </h2>
            <p className="text-xl text-slate-400 mb-8">
              Se você economizar apenas <strong className="text-white">1 contratação errada</strong> por ano
              <br />
              (custo médio: R$ 15.000), o sistema já se pagou <strong className="text-emerald-400">5x</strong>.
            </p>
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="bg-slate-800 rounded-lg p-4">
                <div className="text-3xl font-bold text-red-400">R$ 15k</div>
                <div className="text-sm text-slate-400">Custo de 1 contratação errada</div>
              </div>
              <div className="bg-slate-800 rounded-lg p-4">
                <div className="text-3xl font-bold text-emerald-400">R$ 2.9k</div>
                <div className="text-sm text-slate-400">TriagemAI por 1 ano</div>
              </div>
              <div className="bg-slate-800 rounded-lg p-4">
                <div className="text-3xl font-bold text-yellow-400">5x</div>
                <div className="text-sm text-slate-400">ROI garantido</div>
              </div>
            </div>
            <Link href="/auth/register">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-lg px-8">
                Começar a Economizar Agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Rápido */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Perguntas Frequentes
            </h2>
            <div className="space-y-6">
              <div className="border-b pb-6">
                <h3 className="font-semibold mb-2">Preciso instalar alguma coisa?</h3>
                <p className="text-muted-foreground">
                  Não! O TriagemAI é 100% online. Basta fazer login e começar a usar.
                </p>
              </div>
              <div className="border-b pb-6">
                <h3 className="font-semibold mb-2">Como os currículos chegam no sistema?</h3>
                <p className="text-muted-foreground">
                  Por WhatsApp, Email ou upload direto. Você escolhe a forma mais conveniente.
                </p>
              </div>
              <div className="border-b pb-6">
                <h3 className="font-semibold mb-2">Posso cancelar a qualquer momento?</h3>
                <p className="text-muted-foreground">
                  Sim! Sem fidelidade, sem multa. Cancele quando quiser pelo próprio painel.
                </p>
              </div>
              <div className="border-b pb-6">
                <h3 className="font-semibold mb-2">E se eu ultrapassar o limite de currículos?</h3>
                <p className="text-muted-foreground">
                  Você pode fazer upgrade a qualquer momento ou pagar avulso (R$ 2,50/currículo extra).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-emerald-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pare de Perder Tempo com Triagem Manual
          </h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Junte-se às empresas que já economizam <strong>+80%</strong> em triagem de currículos
          </p>
          <Link href="/auth/register">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
              Começar Teste Grátis de 14 Dias
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <p className="mt-4 text-emerald-200 text-sm">
            Sem cartão de crédito • Cancele quando quiser
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 text-slate-400">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Zap className="h-6 w-6 text-emerald-500" />
              <span className="text-white font-semibold">TriagemAI</span>
            </div>
            <div className="flex gap-6 text-sm">
              <Link href="/termos" className="hover:text-white">Termos de Uso</Link>
              <Link href="/privacidade" className="hover:text-white">Privacidade</Link>
              <a href="mailto:suporte@triagemai.com.br" className="hover:text-white">Suporte</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-800 text-center text-sm">
            © 2025 TriagemAI. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
