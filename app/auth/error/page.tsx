"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, ArrowLeft, Home } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

function ErrorContent() {
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const error = searchParams.get("error");

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "Configuration":
        return {
          title: t("Erreur de configuration", "خطأ في الإعدادات"),
          message: t("Il y a un problème avec la configuration du serveur.", "هناك مشكلة في إعدادات الخادم."),
        };
      case "AccessDenied":
        return {
          title: t("Accès refusé", "تم رفض الوصول"),
          message: t("Vous n'avez pas la permission d'accéder à cette ressource.", "ليس لديك إذن للوصول إلى هذا المورد."),
        };
      case "Verification":
        return {
          title: t("Erreur de vérification", "خطأ في التحقق"),
          message: t("Le token de vérification a expiré ou est invalide.", "انتهت صلاحية رمز التحقق أو أنه غير صالح."),
        };
      case "CredentialsSignin":
        return {
          title: t("Identifiants incorrects", "بيانات اعتماد غير صحيحة"),
          message: t("L'email ou le mot de passe est incorrect.", "البريد الإلكتروني أو كلمة المرور غير صحيحة."),
        };
      default:
        return {
          title: t("Erreur d'authentification", "خطأ في المصادقة"),
          message: t("Une erreur s'est produite lors de la connexion. Veuillez réessayer.", "حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى."),
        };
    }
  };

  const errorInfo = getErrorMessage(error);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500 rounded-full blur opacity-75"></div>
              <div className="relative bg-red-500 p-4 rounded-full">
                <AlertCircle className="h-12 w-12 text-white" />
              </div>
            </div>
          </div>
          <div>
            <CardTitle className="text-3xl font-bold text-red-600">
              {errorInfo.title}
            </CardTitle>
            <CardDescription className="text-base mt-2">
              {errorInfo.message}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3">
            <Link href="/auth/signin">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t("Retour à la connexion", "العودة إلى تسجيل الدخول")}
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full">
                <Home className="h-4 w-4 mr-2" />
                {t("Retour à l'accueil", "العودة إلى الصفحة الرئيسية")}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  );
}

