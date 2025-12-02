"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  GraduationCap, 
  LayoutDashboard, 
  MessageSquare,
  Lightbulb,
  Vote,
  Users as UsersIcon,
  Building2,
  DollarSign,
  Package,
  BarChart3,
  AlertTriangle,
  Brain,
  Handshake,
  Briefcase,
  Heart,
  Trophy,
  Star,
  Gift,
  Shield,
  Lock,
  Key,
  Cloud,
  Bot,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  TrendingUp
} from "lucide-react";
import { Button } from "./ui/button";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { useLanguage } from "@/lib/language-context";
import { LanguageSwitcher } from "./language-switcher";

interface NavSection {
  title: string;
  titleAr: string;
  icon: any;
  items: NavItem[];
}

interface NavItem {
  name: string;
  nameAr: string;
  href: string;
  icon: any;
}

const navigationSections: NavSection[] = [
  {
    title: "Vue d'ensemble",
    titleAr: "نظرة عامة",
    icon: LayoutDashboard,
    items: [
      { name: "Tableau de Bord", nameAr: "لوحة القيادة", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "Communication Participative",
    titleAr: "التواصل التشاركي",
    icon: MessageSquare,
    items: [
      { name: "Messagerie", nameAr: "المراسلة", href: "/communication/messaging", icon: MessageSquare },
      { name: "Forums & Débats", nameAr: "المنتديات والنقاشات", href: "/communication/forums", icon: UsersIcon },
      { name: "Boîte à Suggestions", nameAr: "صندوق الاقتراحات", href: "/communication/suggestions", icon: Lightbulb },
      { name: "Réclamations (E-Recours)", nameAr: "الشكاوى", href: "/communication/complaints", icon: AlertTriangle },
      { name: "Vote Électronique", nameAr: "التصويت الإلكتروني", href: "/communication/voting", icon: Vote },
      { name: "Chatbot Assistant", nameAr: "المساعد الذكي", href: "/communication/chatbot", icon: Bot },
    ],
  },
  {
    title: "Gestion Ressources & Transparence",
    titleAr: "إدارة الموارد والشفافية",
    icon: Building2,
    items: [
      { name: "Open Data Portal", nameAr: "بوابة البيانات المفتوحة", href: "/resources/opendata", icon: Cloud },
      { name: "Suivi Projets", nameAr: "تتبع المشاريع", href: "/resources/projects", icon: Package },
      { name: "Bourses & RH", nameAr: "المنح والموارد البشرية", href: "/resources/scholarships", icon: DollarSign },
      { name: "Budget Interactif", nameAr: "الميزانية التفاعلية", href: "/resources/budget", icon: BarChart3 },
      { name: "Allocation Intelligente", nameAr: "التخصيص الذكي", href: "/resources/allocation", icon: Brain },
    ],
  },
  {
    title: "Partenariat Communautaire",
    titleAr: "الشراكة المجتمعية",
    icon: Handshake,
    items: [
      { name: "Espace Entreprises", nameAr: "مساحة الشركات", href: "/partnerships/companies", icon: Briefcase },
      { name: "Initiatives Citoyennes", nameAr: "المبادرات المدنية", href: "/partnerships/civic", icon: Heart },
      { name: "Opportunités", nameAr: "الفرص", href: "/partnerships/opportunities", icon: Star },
      { name: "Matching IA", nameAr: "المطابقة الذكية", href: "/partnerships/matching", icon: Brain },
      { name: "Hub Partenariat Ouvert", nameAr: "مركز الشراكة المفتوحة", href: "/partnerships/hub", icon: Cloud },
    ],
  },
  {
    title: "Analyse & Intelligence IA",
    titleAr: "التحليل والذكاء الاصطناعي",
    icon: Brain,
    items: [
      { name: "Dashboard Décisionnel", nameAr: "لوحة القرارات", href: "/intelligence/dashboard", icon: BarChart3 },
      { name: "Système d'Alerte", nameAr: "نظام الإنذار", href: "/intelligence/alerts", icon: AlertTriangle },
      { name: "Analytique Prédictive", nameAr: "التحليلات التنبؤية", href: "/intelligence/predictive", icon: TrendingUp },
      { name: "Analyse Sentiment", nameAr: "تحليل المشاعر", href: "/intelligence/sentiment", icon: Heart },
      { name: "Aide à la Décision", nameAr: "دعم القرار", href: "/intelligence/decision", icon: Brain },
    ],
  },
  {
    title: "Gamification & Gouvernance",
    titleAr: "التحفيز والحوكمة",
    icon: Trophy,
    items: [
      { name: "Points & Badges", nameAr: "النقاط والشارات", href: "/gamification", icon: Trophy },
      { name: "Classements", nameAr: "التصنيفات", href: "/gamification/leaderboard", icon: Star },
      { name: "Récompenses", nameAr: "المكافآت", href: "/gamification/rewards", icon: Gift },
    ],
  },
  {
    title: "Sécurité & Identité",
    titleAr: "الأمن والهوية",
    icon: Shield,
    items: [
      { name: "Identité Digitale (SSO)", nameAr: "الهوية الرقمية", href: "/digital-id", icon: Shield },
      { name: "Gestion Accès", nameAr: "إدارة الوصول", href: "/security/access", icon: Key },
      { name: "Blockchain Archive", nameAr: "أرشيف البلوكشين", href: "/security/blockchain", icon: Lock },
    ],
  },
  {
    title: "Services Étudiants",
    titleAr: "الخدمات الطلابية",
    icon: GraduationCap,
    items: [
      { name: "Mes Cours", nameAr: "دوراتي", href: "/student-services", icon: GraduationCap },
      { name: "Communauté", nameAr: "المجتمع", href: "/community", icon: UsersIcon },
    ],
  },
];

export function DashboardNavV2() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [expandedSections, setExpandedSections] = useState<string[]>(['Vue d\'ensemble']);

  const toggleSection = (title: string) => {
    if (expandedSections.includes(title)) {
      setExpandedSections(expandedSections.filter(s => s !== title));
    } else {
      setExpandedSections([...expandedSections, title]);
    }
  };

  return (
    <div className="flex h-screen w-72 flex-col bg-white/90 backdrop-blur-md border-r border-gray-200 shadow-xl">
      {/* Header */}
      <div className="border-b border-gray-200 px-4 py-3 space-y-3">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-75"></div>
            <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
          </div>
          <div>
            <h1 className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              UniGov
            </h1>
            <p className="text-xs text-gray-500">Platform v2.0</p>
          </div>
        </div>
        
        {/* Language Switcher */}
        <LanguageSwitcher />
      </div>
      
      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navigationSections.map((section) => {
          const isExpanded = expandedSections.includes(section.title);
          
          return (
            <div key={section.title} className="space-y-1">
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <section.icon className="h-4 w-4 text-gray-600 group-hover:text-blue-600 transition-colors" />
                  <p className="text-xs font-semibold text-gray-700 group-hover:text-blue-700">
                    {t(section.title, section.titleAr)}
                  </p>
                </div>
                {isExpanded ? (
                  <ChevronDown className="h-3 w-3 text-gray-400" />
                ) : (
                  <ChevronRight className="h-3 w-3 text-gray-400" />
                )}
              </button>

              {/* Section Items */}
              {isExpanded && (
                <div className="ml-3 space-y-1 border-l-2 border-gray-200 pl-3">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all",
                          isActive
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                            : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                        )}
                      >
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        <p className="text-xs font-medium truncate flex-1">
                          {t(item.name, item.nameAr)}
                        </p>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Settings at bottom of navigation */}
        <div className="pt-2 border-t border-gray-200 mt-2">
          <Link
            href="/settings"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
              pathname === "/settings"
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
            )}
          >
            <Settings className="h-4 w-4" />
            <span>{t("Paramètres", "الإعدادات")}</span>
          </Link>
        </div>
      </nav>
      
      {/* Footer */}
      <div className="border-t border-gray-200 p-4">
        <Button 
          variant="outline" 
          className="w-full justify-start border-2 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="h-5 w-5 mr-3" />
          {t("Déconnexion", "تسجيل الخروج")}
        </Button>
      </div>
    </div>
  );
}
