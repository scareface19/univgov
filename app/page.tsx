"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Users, Building2, BarChart3, Handshake, MessageSquare, Shield, Sparkles, TrendingUp, CheckCircle, Zap, Globe } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { LanguageSwitcher } from "@/components/language-switcher";

export default function Home() {
  const { t, language } = useLanguage();
  const features = [
    {
      icon: Shield,
      title: "Identité Numérique",
      titleAr: "الهوية الرقمية",
      description: "Système d'identité digitale unifiée avec SSO",
      descriptionAr: "نظام هوية رقمية موحد مع تسجيل دخول واحد",
      href: "/digital-id",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: GraduationCap,
      title: "Services Étudiants",
      titleAr: "الخدمات الطلابية",
      description: "Portail intelligent pour tous les services universitaires",
      descriptionAr: "بوابة ذكية لجميع الخدمات الجامعية",
      href: "/student-services",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: BarChart3,
      title: "Analyse Académique",
      titleAr: "التحليل الأكاديمي",
      description: "Tableaux de bord et analyses prédictives",
      descriptionAr: "لوحات معلومات وتحليلات تنبؤية",
      href: "/analytics",
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: Building2,
      title: "Gestion Financière",
      titleAr: "الإدارة المالية",
      description: "Suivi des ressources et budgets en temps réel",
      descriptionAr: "تتبع الموارد والميزانيات في الوقت الفعلي",
      href: "/finance",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: Handshake,
      title: "Partenariats",
      titleAr: "الشراكات",
      description: "Plateforme d'innovation et de collaboration",
      descriptionAr: "منصة الابتكار والتعاون",
      href: "/partnerships",
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      icon: Users,
      title: "Tableau de Bord",
      titleAr: "لوحة القيادة",
      description: "Dashboard de gouvernance pour l'administration",
      descriptionAr: "لوحة معلومات الحوكمة للإدارة",
      href: "/dashboard",
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      icon: MessageSquare,
      title: "Communauté",
      titleAr: "المجتمع الجامعي",
      description: "Réseau social universitaire interactif",
      descriptionAr: "شبكة اجتماعية جامعية تفاعلية",
      href: "/community",
      gradient: "from-pink-500 to-rose-500",
    },
  ];

  const benefits = [
    {
      icon: Zap,
      title: "Rapide & Efficace",
      titleAr: "سريع وفعال",
      description: "Optimisation des processus administratifs",
    },
    {
      icon: Shield,
      title: "100% Sécurisé",
      titleAr: "آمن 100%",
      description: "Protection avancée de vos données",
    },
    {
      icon: Globe,
      title: "Accessible Partout",
      titleAr: "متاح في كل مكان",
      description: "Accès 24/7 depuis n'importe quel appareil",
    },
    {
      icon: TrendingUp,
      title: "Évolutif",
      titleAr: "قابل للتطوير",
      description: "S'adapte à vos besoins croissants",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                UniGov
              </h1>
              <p className="text-xs text-muted-foreground">Plateforme Universitaire</p>
            </div>
          </Link>
          <div className="flex gap-3 items-center">
            <LanguageSwitcher />
            <Link href="/auth/signin">
              <Button variant="outline" className="font-medium">
                {t("Se Connecter", "تسجيل الدخول")}
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Sparkles className="h-4 w-4 mr-2" />
                {t("S'inscrire", "التسجيل")}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full text-blue-700 text-sm font-medium animate-pulse">
            <Sparkles className="h-4 w-4" />
            Phase Pilote - Innovation Universitaire
          </div>

          {/* Main Title */}
          <h1 className="text-6xl md:text-7xl font-extrabold leading-tight">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {t("Transformez", "حوّل")}
            </span>
            <br />
            <span className="text-gray-900">
              {t("Votre Université", "جامعتك إلى منصة ذكية")}
            </span>
          </h1>

          {/* Description */}
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t(
              "Une plateforme complète et intelligente qui digitalise et optimise la gestion universitaire. Rejoignez la révolution numérique de l'éducation supérieure.",
              "منصة شاملة وذكية تقوم برقمنة وتحسين الإدارة الجامعية. انضم إلى الثورة الرقمية في التعليم العالي."
            )}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link href="/auth/register">
              <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all">
                <Sparkles className="h-5 w-5 mr-2" />
                {t("Commencer Gratuitement", "ابدأ مجاناً")}
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2 hover:bg-gray-50">
                {t("Découvrir les Fonctionnalités", "اكتشف الميزات")}
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-8 pt-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>100% Gratuit</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>Installation Rapide</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>Support 24/7</span>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-100 group"
            >
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <benefit.icon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{benefit.title}</h3>
              <p className="text-sm font-cairo text-gray-600 mb-2" dir="rtl">
                {benefit.titleAr}
              </p>
              <p className="text-sm text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t("Fonctionnalités Principales", "الميزات الرئيسية")}
          </h2>
          <p className="text-xl text-gray-600 mb-2">
            {t("7 modules intégrés pour une gestion complète", "7 وحدات متكاملة للإدارة الشاملة")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Link key={index} href={feature.href}>
              <Card className="h-full hover:shadow-2xl transition-all cursor-pointer group border-2 border-transparent hover:border-blue-200 bg-white overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`bg-gradient-to-r ${feature.gradient} p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                    {t(feature.title, feature.titleAr)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-2">
                    {t(feature.description, feature.descriptionAr)}
                  </p>
                  <div className="mt-4 flex items-center text-blue-600 font-medium text-sm group-hover:gap-2 transition-all">
                    {t("Découvrir", "اكتشف")}
                    <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <h3 className="text-5xl font-bold">7</h3>
              <p className="text-blue-100">Modules Intégrés</p>
              <p className="text-sm font-cairo" dir="rtl">وحدات متكاملة</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-5xl font-bold">100%</h3>
              <p className="text-blue-100">Sécurisé</p>
              <p className="text-sm font-cairo" dir="rtl">آمن</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-5xl font-bold">24/7</h3>
              <p className="text-blue-100">Disponibilité</p>
              <p className="text-sm font-cairo" dir="rtl">متاح</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-5xl font-bold">∞</h3>
              <p className="text-blue-100">Évolutif</p>
              <p className="text-sm font-cairo" dir="rtl">قابل للتطوير</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white shadow-2xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Prêt à Commencer ?
          </h2>
          <p className="text-2xl font-cairo mb-8" dir="rtl">
            هل أنت مستعد للبدء؟
          </p>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Rejoignez les universités qui ont choisi l'innovation. 
            Créez votre compte gratuitement en moins de 2 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6 bg-white text-blue-600 hover:bg-gray-100">
                <Sparkles className="h-5 w-5 mr-2" />
                Créer un Compte Gratuit
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2 border-white text-white hover:bg-white/10">
                Se Connecter
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="h-6 w-6 text-blue-600" />
                <span className="font-bold text-lg">UniGov</span>
              </div>
              <p className="text-sm text-gray-600">
                Plateforme Universitaire Intelligente
              </p>
              <p className="text-sm font-cairo text-gray-600 mt-2" dir="rtl">
                منصة جامعية ذكية
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Modules</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/digital-id" className="hover:text-blue-600">Identité Numérique</Link></li>
                <li><Link href="/student-services" className="hover:text-blue-600">Services Étudiants</Link></li>
                <li><Link href="/analytics" className="hover:text-blue-600">Analyse Académique</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Ressources</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-blue-600">Documentation</a></li>
                <li><a href="#" className="hover:text-blue-600">API</a></li>
                <li><a href="#" className="hover:text-blue-600">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>support@unigov.dz</li>
                <li>+213 XXX XXX XXX</li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 text-center text-sm text-gray-600">
            <p>&copy; 2025 UniGov - Tous droits réservés</p>
            <p className="mt-2">Plateforme Universitaire Intelligente - Phase Pilote</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
