"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  BookOpen, 
  CreditCard, 
  TrendingUp,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react";
import { useLanguage } from "@/lib/language-context";

export default function DashboardPage() {
  const { t } = useLanguage();
  const [analytics, setAnalytics] = useState<any>(null);
  const [announcements, setAnnouncements] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [analyticsRes, announcementsRes] = await Promise.all([
        fetch("/api/analytics?type=academic"),
        fetch("/api/announcements"),
      ]);

      const analyticsData = await analyticsRes.json();
      const announcementsData = await announcementsRes.json();

      setAnalytics(analyticsData);
      setAnnouncements(announcementsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const stats = [
    {
      title: t("Étudiants Totaux", "إجمالي الطلاب"),
      value: analytics?.metrics?.totalStudents || 0,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: t("Cours Disponibles", "الدورات المتاحة"),
      value: analytics?.metrics?.totalCourses || 0,
      icon: BookOpen,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: t("Inscriptions", "التسجيلات"),
      value: analytics?.metrics?.totalEnrollments || 0,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: t("Taux de Remplissage", "معدل الملء"),
      value: `${Math.round((analytics?.metrics?.averageEnrollmentPerCourse || 0) * 100) / 100}`,
      icon: Calendar,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "destructive";
      case "high":
        return "default";
      case "medium":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {t("Tableau de Bord", "لوحة القيادة")}
        </h1>
        <p className="text-gray-600 text-lg">
          {t("Vue d'ensemble de votre plateforme universitaire", "نظرة عامة على منصة الجامعة")}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                {stat.title}
              </CardTitle>
              <div className={`p-3 rounded-xl ${stat.bgColor} shadow-md`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="announcements" className="space-y-4">
        <TabsList className="bg-white/80 backdrop-blur-sm shadow-md">
          <TabsTrigger value="announcements">{t("Annonces", "الإعلانات")}</TabsTrigger>
          <TabsTrigger value="activity">{t("Activité Récente", "النشاط الأخير")}</TabsTrigger>
          <TabsTrigger value="quick-actions">{t("Actions Rapides", "إجراءات سريعة")}</TabsTrigger>
        </TabsList>

        <TabsContent value="announcements" className="space-y-4">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">{t("Annonces Récentes", "الإعلانات الأخيرة")}</CardTitle>
              <CardDescription>{t("Dernières communications importantes", "آخر الاتصالات المهمة")}</CardDescription>
            </CardHeader>
            <CardContent>
              {announcements.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  {t("Aucune annonce pour le moment", "لا توجد إعلانات في الوقت الحالي")}
                </p>
              ) : (
                <div className="space-y-4">
                  {announcements.slice(0, 5).map((announcement) => (
                    <div
                      key={announcement._id}
                      className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{announcement.title}</h4>
                          <Badge variant={getPriorityColor(announcement.priority)}>
                            {announcement.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {announcement.content}
                        </p>
                        <p className="text-xs text-muted-foreground" dir="rtl">
                          {announcement.titleAr}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground ml-4">
                        {new Date(announcement.publishedAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">{t("Activité Récente", "النشاط الأخير")}</CardTitle>
              <CardDescription>{t("Dernières actions sur la plateforme", "آخر الإجراءات على المنصة")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-green-100">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{t("Nouveau cours ajouté", "تمت إضافة دورة جديدة")}</p>
                    <p className="text-xs text-muted-foreground">{t("Il y a 2 heures", "منذ ساعتين")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{t("15 nouvelles inscriptions", "15 تسجيل جديد")}</p>
                    <p className="text-xs text-muted-foreground">{t("Il y a 5 heures", "منذ 5 ساعات")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-purple-100">
                    <CreditCard className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{t("Paiements traités", "المدفوعات المعالجة")}</p>
                    <p className="text-xs text-muted-foreground">{t("Il y a 1 jour", "منذ يوم")}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quick-actions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="cursor-pointer hover:shadow-2xl transition-all border-0 shadow-lg bg-white/80 backdrop-blur-sm group">
              <CardHeader>
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-xl w-fit mb-2 group-hover:scale-110 transition-transform">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <CardTitle>{t("Ajouter un Cours", "إضافة دورة")}</CardTitle>
                <CardDescription>{t("Créer un nouveau cours", "إنشاء دورة جديدة")}</CardDescription>
              </CardHeader>
            </Card>
            <Card className="cursor-pointer hover:shadow-2xl transition-all border-0 shadow-lg bg-white/80 backdrop-blur-sm group">
              <CardHeader>
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl w-fit mb-2 group-hover:scale-110 transition-transform">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle>{t("Gérer les Utilisateurs", "إدارة المستخدمين")}</CardTitle>
                <CardDescription>{t("Ajouter ou modifier", "إضافة أو تعديل")}</CardDescription>
              </CardHeader>
            </Card>
            <Card className="cursor-pointer hover:shadow-2xl transition-all border-0 shadow-lg bg-white/80 backdrop-blur-sm group">
              <CardHeader>
                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-xl w-fit mb-2 group-hover:scale-110 transition-transform">
                  <AlertCircle className="h-8 w-8 text-white" />
                </div>
                <CardTitle>{t("Crée une Annonce", "إنشاء إعلان")}</CardTitle>
                <CardDescription>{t("Nouvelle communication", "اتصال جديد")}</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
