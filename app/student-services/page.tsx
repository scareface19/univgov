"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardNav } from "@/components/dashboard-nav";
import { 
  BookOpen, 
  CreditCard, 
  Calendar, 
  FileText, 
  MessageCircle,
  GraduationCap,
  Download,
  Clock
} from "lucide-react";

export default function StudentServicesPage() {
  const [selectedTab, setSelectedTab] = useState("enrollment");

  const courses = [
    {
      code: "CS101",
      name: "Introduction à l'Informatique",
      nameAr: "مقدمة في علوم الحاسوب",
      credits: 6,
      professor: "Dr. Karim Mansouri",
      schedule: "Lun-Mer 10:00-12:00",
      available: 15,
      status: "open",
    },
    {
      code: "MATH201",
      name: "Algèbre Linéaire",
      nameAr: "الجبر الخطي",
      credits: 5,
      professor: "Dr. Amina Hadj",
      schedule: "Mar-Jeu 14:00-16:00",
      available: 8,
      status: "open",
    },
    {
      code: "PHY101",
      name: "Physique Générale",
      nameAr: "الفيزياء العامة",
      credits: 6,
      professor: "Dr. Omar Benali",
      schedule: "Lun-Mer 08:00-10:00",
      available: 0,
      status: "full",
    },
  ];

  const myEnrollments = [
    {
      code: "CS100",
      name: "Programmation I",
      grade: 85,
      attendance: 95,
      status: "completed",
    },
    {
      code: "MATH101",
      name: "Mathématiques I",
      grade: 78,
      attendance: 88,
      status: "completed",
    },
  ];

  const documents = [
    { name: "Certificat de Scolarité", status: "available", date: "2025-01-15" },
    { name: "Relevé de Notes S1", status: "available", date: "2025-02-01" },
    { name: "Attestation de Stage", status: "processing", date: "En cours" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Services Étudiants
        </h1>
        <p className="text-gray-600 text-lg">
          Portail intelligent pour tous vos besoins académiques
        </p>
        <p className="text-sm font-cairo text-gray-500 mt-1" dir="rtl">
          بوابة ذكية لجميع احتياجاتك الأكاديمية
        </p>
      </div>

      <Tabs defaultValue="enrollment" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm shadow-md">
          <TabsTrigger value="enrollment">Inscription</TabsTrigger>
          <TabsTrigger value="grades">Notes & Suivi</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
        </TabsList>

        {/* Course Enrollment */}
        <TabsContent value="enrollment" className="space-y-4">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Cours Disponibles - Semestre 2</CardTitle>
                <CardDescription>
                  Inscrivez-vous aux cours disponibles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {courses.map((course) => (
                    <div
                      key={course.code}
                      className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{course.code}</Badge>
                            <h3 className="font-semibold">{course.name}</h3>
                            {course.status === "full" && (
                              <Badge variant="destructive">Complet</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2" dir="rtl">
                            {course.nameAr}
                          </p>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Professeur: </span>
                              {course.professor}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Crédits: </span>
                              {course.credits}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Horaire: </span>
                              {course.schedule}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Places: </span>
                              {course.available} disponibles
                            </div>
                          </div>
                        </div>
                        <Button
                          disabled={course.status === "full"}
                          className="ml-4"
                        >
                          {course.status === "full" ? "Complet" : "S'inscrire"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

        {/* Grades & Progress */}
        <TabsContent value="grades" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">GPA Actuel</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">3.42</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Crédits Obtenus</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">45</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Taux de Réussite</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-600">92%</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Relevé de Notes</CardTitle>
                <CardDescription>Vos cours terminés et notes obtenues</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {myEnrollments.map((course) => (
                    <div
                      key={course.code}
                      className="flex justify-between items-center p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <GraduationCap className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-semibold">{course.name}</p>
                          <p className="text-sm text-muted-foreground">{course.code}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Note</p>
                          <p className="text-lg font-bold text-primary">
                            {course.grade}/100
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Présence</p>
                          <p className="text-lg font-semibold">{course.attendance}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

        {/* Documents */}
        <TabsContent value="documents" className="space-y-4">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Mes Documents</CardTitle>
                <CardDescription>
                  Téléchargez vos certificats et attestations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {documents.map((doc, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <FileText className="h-8 w-8 text-primary" />
                        <div>
                          <p className="font-semibold">{doc.name}</p>
                          <p className="text-sm text-muted-foreground">{doc.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {doc.status === "available" ? (
                          <>
                            <Badge variant="default">Disponible</Badge>
                            <Button size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              Télécharger
                            </Button>
                          </>
                        ) : (
                          <Badge variant="secondary">
                            <Clock className="h-3 w-3 mr-1" />
                            En traitement
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Demander un Document</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Besoin d'un nouveau document? Faites une demande en ligne
                  </p>
                  <Button>
                    <FileText className="h-4 w-4 mr-2" />
                    Nouvelle Demande
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

        {/* Support */}
        <TabsContent value="support" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="cursor-pointer hover:shadow-2xl transition-all border-0 shadow-lg bg-white/80 backdrop-blur-sm group">
              <CardHeader>
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-xl w-fit mb-3 group-hover:scale-110 transition-transform">
                  <Calendar className="h-10 w-10 text-white" />
                </div>
                <CardTitle>Prendre Rendez-vous</CardTitle>
                  <CardDescription>
                    Réservez un créneau avec un conseiller
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Réserver</Button>
                </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-2xl transition-all border-0 shadow-lg bg-white/80 backdrop-blur-sm group">
              <CardHeader>
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl w-fit mb-3 group-hover:scale-110 transition-transform">
                  <MessageCircle className="h-10 w-10 text-white" />
                </div>
                <CardTitle>Chat en Direct</CardTitle>
                  <CardDescription>
                    Assistance immédiate avec notre chatbot
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    Démarrer le Chat
              </Button>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  </div>
);
}
