"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, ArrowLeft, Sparkles, CheckCircle } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError(t("Les mots de passe ne correspondent pas", "كلمات المرور غير متطابقة"));
      return;
    }

    if (formData.password.length < 6) {
      setError(t("Le mot de passe doit contenir au moins 6 caractères", "يجب أن تحتوي كلمة المرور على 6 أحرف على الأقل"));
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || t("Une erreur s'est produite", "حدث خطأ"));
        return;
      }

      router.push("/auth/signin?registered=true");
    } catch (err) {
      setError(t("Une erreur s'est produite", "حدث خطأ"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-purple-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
      </div>

      {/* Back to home button */}
      <Link href="/" className="absolute top-6 left-6 z-10">
        <Button variant="ghost" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          {t("Retour", "رجوع")}
        </Button>
      </Link>

      <Card className="w-full max-w-lg relative shadow-2xl border-0">
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
              {t("Créer un Compte", "إنشاء حساب")}
            </CardTitle>
            <p className="text-gray-600 mt-2">{t("Rejoignez UniGov gratuitement", "انضم إلى UniGov مجاناً")}</p>
          </div>

          {/* Benefits */}
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>{t("Gratuit", "مجاني")}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>{t("Rapide", "سريع")}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>{t("Sécurisé", "آمن")}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg">
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-gray-700 font-medium">
                  {t("Prénom", "الاسم الأول")}
                </Label>
                <Input
                  id="firstName"
                  placeholder={t("Ahmed", "أحمد")}
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                  className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-gray-700 font-medium">
                  {t("Nom", "الاسم الأخير")}
                </Label>
                <Input
                  id="lastName"
                  placeholder={t("Benali", "بن علي")}
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                  className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">
                {t("Email", "البريد الإلكتروني")}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder={t("votre.email@university.dz", "بريدك.الإلكتروني@university.dz")}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-gray-700 font-medium">
                {t("Type de compte", "نوع الحساب")}
              </Label>
              <select
                id="role"
                className="flex h-11 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="student">🎓 {t("Étudiant", "طالب")}</option>
                <option value="professor">👨‍🏫 {t("Professeur", "أستاذ")}</option>
                <option value="staff">💼 {t("Personnel", "موظف")}</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">
                {t("Mot de passe", "كلمة المرور")}
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500">{t("Minimum 6 caractères", "6 أحرف على الأقل")}</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                {t("Confirmer le mot de passe", "تأكيد كلمة المرور")}
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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
                  {t("Création du compte...", "جاري إنشاء الحساب...")}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  {t("Créer mon compte", "إنشاء حسابي")}
                </span>
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-gray-500">{t("Déjà inscrit?", "مسجل بالفعل؟")}</span>
            </div>
          </div>

          <Link href="/auth/signin">
            <Button 
              variant="outline" 
              className="w-full h-11 border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 font-medium"
            >
              {t("Se connecter", "تسجيل الدخول")}
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
