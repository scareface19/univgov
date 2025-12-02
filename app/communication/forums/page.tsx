"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Users, MessageSquare, Plus, TrendingUp, Pin, Search } from "lucide-react";

export default function ForumsPage() {
  const forums = [
    {
      id: 1,
      title: "Débat sur le nouveau règlement intérieur",
      titleAr: "نقاش حول النظام الداخلي الجديد",
      category: "Réglementation",
      categoryAr: "تنظيمي",
      isPinned: true,
      participants: 145,
      messages: 328,
      lastActivity: "Il y a 5 min",
      author: "Administration",
      tags: ["Important", "Règlement", "Vote"],
    },
    {
      id: 2,
      title: "Suggestions pour la rentrée 2025-2026",
      titleAr: "اقتراحات للعودة الدراسية 2025-2026",
      category: "Pédagogie",
      categoryAr: "تربوي",
      isPinned: true,
      participants: 89,
      messages: 203,
      lastActivity: "Il y a 20 min",
      author: "Conseil Pédagogique",
      tags: ["Rentrée", "Innovation"],
    },
    {
      id: 3,
      title: "Amélioration des services de bibliothèque",
      titleAr: "تحسين خدمات المكتبة",
      category: "Services",
      categoryAr: "خدمات",
      isPinned: false,
      participants: 56,
      messages: 142,
      lastActivity: "Il y a 1h",
      author: "Dr. Sarah L.",
      tags: ["Bibliothèque", "Services"],
    },
    {
      id: 4,
      title: "Projets de recherche collaboratifs",
      titleAr: "مشاريع بحثية تعاونية",
      category: "Recherche",
      categoryAr: "بحث",
      isPinned: false,
      participants: 34,
      messages: 87,
      lastActivity: "Il y a 2h",
      author: "Ahmed B.",
      tags: ["Recherche", "Collaboration"],
    },
  ];

  const categories = [
    { name: "Réglementation", nameAr: "تنظيمي", count: 12, color: "bg-red-100 text-red-700" },
    { name: "Pédagogie", nameAr: "تربوي", count: 23, color: "bg-blue-100 text-blue-700" },
    { name: "Services", nameAr: "خدمات", count: 18, color: "bg-green-100 text-green-700" },
    { name: "Recherche", nameAr: "بحث", count: 15, color: "bg-purple-100 text-purple-700" },
    { name: "Innovation", nameAr: "ابتكار", count: 9, color: "bg-orange-100 text-orange-700" },
  ];

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Forums & Débats Académiques
        </h1>
        <p className="text-gray-600 text-lg">Espaces de discussion et d'échange d'idées</p>
        <p className="text-sm font-cairo text-gray-500 mt-1" dir="rtl">
          منتديات النقاش وتبادل الأفكار
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Forums Actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {forums.length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Participants</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">
              {forums.reduce((sum, f) => sum + f.participants, 0)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              {forums.reduce((sum, f) => sum + f.messages, 0)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Catégories</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-600">{categories.length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Forums List */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl">Tous les Forums</CardTitle>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau Forum
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {forums.map((forum) => (
                <div
                  key={forum.id}
                  className="p-5 border-2 rounded-lg hover:shadow-xl transition-all cursor-pointer bg-white group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {forum.isPinned && (
                          <Pin className="h-4 w-4 text-red-500" />
                        )}
                        <h3 className="font-bold text-lg group-hover:text-blue-600 transition-colors">
                          {forum.title}
                        </h3>
                      </div>
                      <p className="text-sm font-cairo text-gray-600 mb-3" dir="rtl">
                        {forum.titleAr}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge className={getCategoryColor(forum.category)}>
                          {forum.category} / {forum.categoryAr}
                        </Badge>
                        {forum.tags.map((tag, idx) => (
                          <Badge key={idx} variant="outline">{tag}</Badge>
                        ))}
                      </div>
                      <div className="flex gap-6 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {forum.participants} participants
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          {forum.messages} messages
                        </span>
                        <span>•</span>
                        <span className="text-gray-500">{forum.lastActivity}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t">
                    <p className="text-sm text-gray-600">Par: <span className="font-semibold">{forum.author}</span></p>
                    <Button size="sm" variant="outline" className="group-hover:bg-blue-50">
                      Voir la Discussion →
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Search */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">Rechercher</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Rechercher un forum..." className="pl-10" />
              </div>
            </CardContent>
          </Card>

          {/* Categories */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">Catégories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {categories.map((cat, index) => (
                <button
                  key={index}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-blue-50 transition-colors border"
                >
                  <div>
                    <p className="font-semibold text-sm">{cat.name}</p>
                    <p className="text-xs font-cairo text-gray-600" dir="rtl">{cat.nameAr}</p>
                  </div>
                  <Badge className={cat.color}>{cat.count}</Badge>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Trending */}
          <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-500 to-red-500 text-white">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Topics Tendance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {["Nouveau Règlement", "Bibliothèque 24/7", "WiFi Campus"].map((topic, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-sm p-2 rounded-lg text-sm">
                  #{topic}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function getCategoryColor(category: string) {
  const colors: Record<string, string> = {
    "Réglementation": "bg-red-100 text-red-700",
    "Pédagogie": "bg-blue-100 text-blue-700",
    "Services": "bg-green-100 text-green-700",
    "Recherche": "bg-purple-100 text-purple-700",
    "Innovation": "bg-orange-100 text-orange-700",
  };
  return colors[category] || "bg-gray-100 text-gray-700";
}
