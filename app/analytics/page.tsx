"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardNav } from "@/components/dashboard-nav";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  BookOpen, 
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart
} from "lucide-react";

export default function AnalyticsPage() {
  const [academicData, setAcademicData] = useState<any>(null);
  const [financialData, setFinancialData] = useState<any>(null);
  const [engagementData, setEngagementData] = useState<any>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [academic, financial, engagement] = await Promise.all([
        fetch("/api/analytics?type=academic").then(r => r.json()),
        fetch("/api/analytics?type=financial").then(r => r.json()),
        fetch("/api/analytics?type=engagement").then(r => r.json()),
      ]);

      setAcademicData(academic);
      setFinancialData(financial);
      setEngagementData(engagement);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  const performanceMetrics = [
    {
      label: "Taux de Réussite Global",
      value: "87.5%",
      change: "+2.3%",
      trend: "up",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      label: "Taux de Présence Moyen",
      value: "92.1%",
      change: "+1.8%",
      trend: "up",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      label: "Risque d'Abandon",
      value: "5.2%",
      change: "-0.5%",
      trend: "down",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      label: "Satisfaction Étudiante",
      value: "4.3/5",
      change: "+0.2",
      trend: "up",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  const atRiskStudents = [
    {
      name: "Student A",
      id: "STU001",
      gpa: 2.1,
      attendance: 65,
      risk: "high",
    },
    {
      name: "Student B",
      id: "STU002",
      gpa: 2.5,
      attendance: 72,
      risk: "medium",
    },
    {
      name: "Student C",
      id: "STU003",
      gpa: 2.3,
      attendance: 68,
      risk: "high",
    },
  ];

  const topPerformers = [
    { name: "Student X", id: "STU101", gpa: 3.95, courses: 6 },
    { name: "Student Y", id: "STU102", gpa: 3.89, courses: 7 },
    { name: "Student Z", id: "STU103", gpa: 3.85, courses: 6 },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Analyse & Évaluation Académique
        </h1>
        <p className="text-gray-600 text-lg">
          Tableaux de bord analytiques et prédictifs
        </p>
        <p className="text-sm font-cairo text-gray-500 mt-1" dir="rtl">
          لوحات التحكم التحليلية والتنبؤية
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-white/80 backdrop-blur-sm shadow-md">
          <TabsTrigger value="overview">Vue d'Ensemble</TabsTrigger>
          <TabsTrigger value="academic">Performance Académique</TabsTrigger>
          <TabsTrigger value="financial">Finances</TabsTrigger>
          <TabsTrigger value="predictions">Prédictions IA</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {performanceMetrics.map((metric, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      {metric.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold mb-1">{metric.value}</div>
                    <div className={`flex items-center text-sm ${metric.color}`}>
                      {metric.trend === "up" ? (
                        <TrendingUp className="h-4 w-4 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-1" />
                      )}
                      {metric.change}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl">Statistiques Générales</CardTitle>
                  <CardDescription>Métriques clés du système</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-blue-600" />
                        <span>Étudiants Actifs</span>
                      </div>
                      <span className="font-bold">{academicData?.metrics?.totalStudents || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <BookOpen className="h-5 w-5 text-green-600" />
                        <span>Cours Disponibles</span>
                      </div>
                      <span className="font-bold">{academicData?.metrics?.totalCourses || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <BarChart3 className="h-5 w-5 text-purple-600" />
                        <span>Inscriptions Totales</span>
                      </div>
                      <span className="font-bold">{academicData?.metrics?.totalEnrollments || 0}</span>
                    </div>
                  </div>
                </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl">Répartition par Faculté</CardTitle>
                  <CardDescription>Distribution des étudiants</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: "Sciences", count: 450, percentage: 30 },
                      { name: "Technologies", count: 380, percentage: 25 },
                      { name: "Médecine", count: 320, percentage: 21 },
                      { name: "Économie", count: 250, percentage: 17 },
                      { name: "Lettres", count: 100, percentage: 7 },
                    ].map((faculty, index) => (
                      <div key={index}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{faculty.name}</span>
                          <span className="font-semibold">{faculty.count} étudiants</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${faculty.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

        {/* Academic Performance */}
        <TabsContent value="academic" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    Étudiants à Risque
                  </CardTitle>
                  <CardDescription>
                    Étudiants nécessitant un accompagnement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {atRiskStudents.map((student) => (
                      <div
                        key={student.id}
                        className="p-3 border rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold">{student.name}</p>
                            <p className="text-sm text-muted-foreground">{student.id}</p>
                          </div>
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              student.risk === "high"
                                ? "bg-red-100 text-red-700"
                                : "bg-orange-100 text-orange-700"
                            }`}
                          >
                            {student.risk === "high" ? "Risque Élevé" : "Risque Moyen"}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">GPA: </span>
                            <span className="font-semibold">{student.gpa}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Présence: </span>
                            <span className="font-semibold">{student.attendance}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Meilleurs Étudiants
                  </CardTitle>
                  <CardDescription>
                    Performances exceptionnelles
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topPerformers.map((student, index) => (
                      <div
                        key={student.id}
                        className="p-3 border rounded-lg bg-green-50 border-green-200"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-semibold">{student.name}</p>
                              <p className="text-sm text-muted-foreground">{student.id}</p>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">GPA: </span>
                            <span className="font-bold text-green-700">{student.gpa}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Cours: </span>
                            <span className="font-semibold">{student.courses}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

        {/* Financial */}
        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Revenus Totaux</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-green-600">
                    {financialData?.metrics?.totalRevenue?.toLocaleString()} DA
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Paiements en Attente</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-orange-600">
                    {financialData?.metrics?.pendingPayments || 0}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-blue-600">
                    {financialData?.metrics?.totalTransactions || 0}
                  </p>
                </CardContent>
              </Card>
          </div>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Analyse Financière</CardTitle>
                <CardDescription>Aperçu des revenus et dépenses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg">
                  <div className="text-center">
                    <PieChart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Graphique de données financières
                    </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

        {/* Predictions */}
        <TabsContent value="predictions" className="space-y-6">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Prédictions IA</CardTitle>
                <CardDescription>
                  Analyses prédictives basées sur l'intelligence artificielle
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Taux de Réussite Prévu - Semestre Prochain
                  </h4>
                  <p className="text-2xl font-bold text-blue-600 mb-2">89.2%</p>
                  <p className="text-sm text-muted-foreground">
                    Augmentation prévue de 1.7% basée sur les tendances actuelles
                  </p>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    Risque d'Abandon Prévu
                  </h4>
                  <p className="text-2xl font-bold text-orange-600 mb-2">23 étudiants</p>
                  <p className="text-sm text-muted-foreground">
                    Intervention recommandée pour 23 étudiants identifiés à risque
                  </p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Capacité d'Accueil Optimale
                  </h4>
                  <p className="text-2xl font-bold text-green-600 mb-2">+150 étudiants</p>
                  <p className="text-sm text-muted-foreground">
                    Capacité supplémentaire recommandée pour le prochain semestre
                  </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
