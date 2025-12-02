"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  GraduationCap, 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  CreditCard, 
  Calendar,
  BarChart3,
  Handshake,
  MessageSquare,
  Settings,
  Shield,
  Building2,
  LogOut
} from "lucide-react";
import { Button } from "./ui/button";
import { signOut } from "next-auth/react";

const navigation = [
  { name: "Tableau de Bord", href: "/dashboard", icon: LayoutDashboard },
  { name: "Identité Digitale", href: "/digital-id", icon: Shield },
  { name: "Services Étudiants", href: "/student-services", icon: GraduationCap },
  { name: "Communication", href: "/communication", icon: MessageSquare },
  { name: "Ressources", href: "/resources", icon: Building2 },
  { name: "Analyses", href: "/analytics", icon: BarChart3 },
  { name: "Partenariats", href: "/partnerships", icon: Handshake },
  { name: "Communauté", href: "/community", icon: Users },
  { name: "Gamification", href: "/gamification", icon: BarChart3 },
  { name: "Paramètres", href: "/settings", icon: Settings },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col bg-white/80 backdrop-blur-md border-r border-gray-200 shadow-lg">
      <div className="flex h-16 items-center gap-2 border-b border-gray-200 px-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-75"></div>
          <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
        </div>
        <div>
          <h1 className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">UniGov</h1>
          <p className="text-xs text-gray-500">Platform</p>
        </div>
      </div>
      
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="border-t border-gray-200 p-4">
        <Button 
          variant="outline" 
          className="w-full justify-start border-2 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Déconnexion
        </Button>
      </div>
    </div>
  );
}
