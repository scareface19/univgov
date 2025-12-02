"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, ArrowLeft, Sparkles, User } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

export default function SignInPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/dashboard",
      });

      if (result?.error) {
        // Gérer les différents types d'erreurs
        let errorMessage = t("Email ou mot de passe incorrect", "البريد الإلكتروني أو كلمة المرور غير صحيحة");
        
        if (result.error === "CredentialsSignin") {
          errorMessage = t("Email ou mot de passe incorrect", "البريد الإلكتروني أو كلمة المرور غير صحيحة");
        } else if (result.error === "Configuration") {
          errorMessage = t("Erreur de configuration. Vérifiez les paramètres du serveur.", "خطأ في الإعدادات. تحقق من إعدادات الخادم.");
        }
        
        setError(errorMessage);
      } else if (result?.ok) {
        // Succès - rediriger vers le dashboard
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      console.error("Erreur de connexion:", err);
      setError(t("Une erreur s'est produite lors de la connexion", "حدث خطأ أثناء تسجيل الدخول"));
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError("");
    setLoading(true);
    const demoEmail = "demo@unigov.dz";
    const demoPassword = "demo123456";
    
    setEmail(demoEmail);
    setPassword(demoPassword);

    try {
      // D'abord, essayer de se connecter
      let result = await signIn("credentials", {
        email: demoEmail,
        password: demoPassword,
        redirect: false,
        callbackUrl: "/dashboard",
      });

      // Si la connexion échoue, créer le compte démo automatiquement
      if (result?.error && (result.error === "CredentialsSignin" || result.error.includes("not found") || result.error === "Configuration")) {
        try {
          console.log("Tentative de création du compte démo...");
          
          // Créer le compte démo via l'API
          const createResponse = await fetch("/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: demoEmail,
              password: demoPassword,
              firstName: "Demo",
              lastName: "Utilisateur",
              role: "student",
            }),
          });

          const createData = await createResponse.json();

          if (!createResponse.ok) {
            // Si le compte existe déjà, essayer de se connecter à nouveau
            if (createData.error?.includes("already exists") || createData.error?.includes("User already exists")) {
              console.log("Le compte existe déjà, nouvelle tentative de connexion...");
              // Attendre un peu pour que la base de données se synchronise
              await new Promise(resolve => setTimeout(resolve, 1000));
              result = await signIn("credentials", {
                email: demoEmail,
                password: demoPassword,
                redirect: false,
                callbackUrl: "/dashboard",
              });
            } else {
              throw new Error(createData.error || "Erreur lors de la création du compte");
            }
          } else {
            // Compte créé avec succès
            console.log("Compte démo créé avec succès, connexion en cours...");
            // Attendre un peu pour que la base de données se synchronise
            await new Promise(resolve => setTimeout(resolve, 1000));
            result = await signIn("credentials", {
              email: demoEmail,
              password: demoPassword,
              redirect: false,
              callbackUrl: "/dashboard",
            });
          }
        } catch (createErr: any) {
          console.error("Erreur lors de la création du compte démo:", createErr);
          setError(t(
            `Impossible de créer le compte démo: ${createErr.message}. Vérifiez la connexion à la base de données.`,
            `تعذر إنشاء حساب التجربة: ${createErr.message}. تحقق من اتصال قاعدة البيانات.`
          ));
          setLoading(false);
          return;
        }
      }

      // Vérifier le résultat final
      if (result?.error) {
        let errorMessage = "";
        
        if (result.error === "CredentialsSignin") {
          errorMessage = t(
            "Email ou mot de passe incorrect",
            "البريد الإلكتروني أو كلمة المرور غير صحيحة"
          );
        } else if (result.error === "Configuration") {
          errorMessage = t("Erreur de configuration. Vérifiez les paramètres du serveur.", "خطأ في الإعدادات. تحقق من إعدادات الخادم.");
        } else {
          errorMessage = t(
            `Erreur: ${result.error}`,
            `خطأ: ${result.error}`
          );
        }
        
        setError(errorMessage);
        console.error("Erreur de connexion démo:", result.error);
      } else if (result?.ok) {
        // Succès - rediriger vers le dashboard
        router.push("/dashboard");
        router.refresh();
      } else {
        setError(t("Erreur inconnue. Vérifiez la console pour plus de détails.", "خطأ غير معروف. تحقق من وحدة التحكم لمزيد من التفاصيل."));
        console.error("Résultat de connexion inattendu:", result);
      }
    } catch (err: any) {
      console.error("Erreur de connexion:", err);
      setError(t("Une erreur s'est produite lors de la connexion", "حدث خطأ أثناء تسجيل الدخول"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
      </div>

      {/* Back to home button */}
      <Link href="/" className="absolute top-6 left-6 z-10">
        <Button variant="ghost" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          {t("Retour", "رجوع")}
        </Button>
      </Link>

      <Card className="w-full max-w-md relative shadow-2xl border-0">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-75"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl">
                <GraduationCap className="h-12 w-12 text-white" />
              </div>
            </div>
          </div>
          <div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t("Connexion", "تسجيل الدخول")}
            </CardTitle>
            <p className="text-gray-600 mt-2">{t("Accédez à votre espace UniGov", "الوصول إلى حسابك")}</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">
                {t("Email", "البريد الإلكتروني")}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder={t("votre.email@university.dz", "بريدك.الإلكتروني@university.dz")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">
                {t("Mot de passe", "كلمة المرور")}
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all" 
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 animate-spin" />
                  {t("Connexion en cours...", "جاري تسجيل الدخول...")}
                </span>
              ) : (
                t("Se Connecter", "تسجيل الدخول")
              )}
            </Button>
          </form>

          <div className="text-center">
            <Link 
              href="/auth/forgot-password" 
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline font-medium"
            >
              {t("Mot de passe oublié?", "نسيت كلمة المرور؟")}
            </Link>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-gray-500">{t("Nouveau sur UniGov?", "جديد في UniGov؟")}</span>
            </div>
          </div>

          <Button
            onClick={handleDemoLogin}
            variant="outline"
            className="w-full h-11 border-2 border-green-300 hover:border-green-500 hover:bg-green-50 font-medium text-green-700 hover:text-green-800"
            disabled={loading}
          >
            <User className="h-4 w-4 mr-2" />
            {t("Se connecter avec le compte démo", "تسجيل الدخول بحساب تجريبي")}
          </Button>

          <Link href="/auth/register">
            <Button 
              variant="outline" 
              className="w-full h-11 border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 font-medium"
            >
              {t("Créer un compte", "إنشاء حساب")}
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
