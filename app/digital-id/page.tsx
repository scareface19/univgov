"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, QrCode, Key, CheckCircle, XCircle } from "lucide-react";
import { DashboardNav } from "@/components/dashboard-nav";
import { useLanguage } from "@/lib/language-context";

export default function DigitalIDPage() {
  const { t } = useLanguage();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Mock user data - in real app, get from session
    setUser({
      digitalId: "DID-2024-ABC123XYZ",
      firstName: "Ahmed",
      lastName: "Benali",
      role: "student",
      email: "ahmed.benali@university.dz",
      department: "Informatique",
      permissions: ["library", "cafeteria", "dormitory", "transport"],
      isActive: true,
    });
  }, []);

  const allServices = [
    { id: "library", name: "Bibliothèque", nameAr: "المكتبة", icon: "📚" },
    { id: "cafeteria", name: "Restaurant", nameAr: "المطعم", icon: "🍽️" },
    { id: "dormitory", name: "Résidence", nameAr: "السكن", icon: "🏠" },
    { id: "transport", name: "Transport", nameAr: "النقل", icon: "🚌" },
    { id: "sports", name: "Sports", nameAr: "الرياضة", icon: "⚽" },
    { id: "health", name: "Santé", nameAr: "الصحة", icon: "🏥" },
  ];

  if (!user) {
    return (
      <div className="flex h-screen">
        <DashboardNav />
        <div className="flex-1 flex items-center justify-center">
          <p>{t("Chargement...", "جاري التحميل...")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {t("Identité Numérique", "الهوية الرقمية")}
        </h1>
        <p className="text-gray-600 text-lg">
          {t("Votre carte d'identité digitale universitaire", "بطاقة الهوية الرقمية الجامعية")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Digital ID Card */}
        <div className="lg:col-span-2">
          <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white border-0 shadow-2xl">
              <CardContent className="p-8">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Shield className="h-6 w-6" />
                      <span className="font-bold text-lg">UniGov University</span>
                    </div>
                    <h2 className="text-3xl font-bold mb-2">
                      {user.firstName} {user.lastName}
                    </h2>
                    <p className="text-white/80">{user.email}</p>
                    <Badge className="mt-2 bg-white/20 text-white border-white/30">
                      {user.role.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <QrCode className="h-24 w-24 text-blue-600" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/20">
                  <div>
                    <p className="text-white/60 text-sm">{t("Digital ID", "الهوية الرقمية")}</p>
                    <p className="font-mono font-bold">{user.digitalId}</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">{t("Département", "القسم")}</p>
                    <p className="font-semibold">{user.department}</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">{t("Status", "الحالة")}</p>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      <span className="font-semibold">{t("Actif", "نشط")}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">{t("Services", "الخدمات")}</p>
                    <p className="font-semibold">{user.permissions.length} {t("autorisés", "مسموح")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">{t("Actions Rapides", "إجراءات سريعة")}</CardTitle>
            </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start" variant="outline">
                  <QrCode className="h-4 w-4 mr-2" />
                  {t("Afficher QR Code", "عرض رمز QR")}
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Key className="h-4 w-4 mr-2" />
                  {t("Réinitialiser Mot de Passe", "إعادة تعيين كلمة المرور")}
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Shield className="h-4 w-4 mr-2" />
                  {t("Historique d'Accès", "سجل الوصول")}
                </Button>
              </CardContent>
          </Card>
        </div>
      </div>

      {/* Service Access Permissions */}
      <Card className="mt-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl">{t("Autorisations d'Accès aux Services", "أذونات الوصول إلى الخدمات")}</CardTitle>
            <CardDescription>
              {t("Services universitaires auxquels vous avez accès", "الخدمات الجامعية التي يمكنك الوصول إليها")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allServices.map((service) => {
                const hasAccess = user.permissions.includes(service.id);
                return (
                  <div
                    key={service.id}
                    className={`p-4 rounded-lg border-2 ${
                      hasAccess
                        ? "border-green-200 bg-green-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{service.icon}</span>
                      {hasAccess ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                    <h3 className="font-semibold mb-1">{t(service.name, service.nameAr)}</h3>
                    <Badge
                      variant={hasAccess ? "default" : "secondary"}
                      className="mt-2"
                    >
                      {hasAccess ? t("Autorisé", "مسموح") : t("Non autorisé", "غير مسموح")}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

      {/* SSO Information */}
      <Card className="mt-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl">{t("Authentification Unique (SSO)", "المصادقة الموحدة (SSO)")}</CardTitle>
            <CardDescription>
              {t("Utilisez votre identité digitale pour accéder à tous les services", "استخدم هويتك الرقمية للوصول إلى جميع الخدمات")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
                <Key className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">{t("Connexion Simplifiée", "تسجيل دخول مبسط")}</h4>
                  <p className="text-sm text-muted-foreground">
                    {t("Un seul identifiant pour tous les services universitaires. Plus besoin de mémoriser plusieurs mots de passe.", "معرف واحد لجميع الخدمات الجامعية. لا حاجة لحفظ عدة كلمات مرور.")}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg">
                <Shield className="h-6 w-6 text-green-600 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">{t("Sécurité Renforcée", "أمان محسّن")}</h4>
                  <p className="text-sm text-muted-foreground">
                    {t("Protection avancée de vos données personnelles avec chiffrement de bout en bout.", "حماية متقدمة لبياناتك الشخصية مع التشفير من طرف إلى طرف.")}
                  </p>
                </div>
              </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
