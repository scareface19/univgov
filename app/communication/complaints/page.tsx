"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertTriangle, 
  Send, 
  CheckCircle, 
  Clock, 
  Eye,
  FileText,
  Calendar,
  User,
  Hash
} from "lucide-react";

export default function ComplaintsPage() {
  const complaints = [
    {
      id: "REC-2025-001",
      title: "Retard dans le traitement de mon dossier de bourse",
      titleAr: "تأخر في معالجة ملف المنحة",
      category: "Bourses",
      priority: "high",
      status: "en_cours",
      submittedBy: "Ahmed Benali",
      submittedDate: "2025-01-20",
      lastUpdate: "2025-01-22",
      assignedTo: "Service Scolarité",
      description: "Mon dossier de bourse a été déposé depuis 3 mois sans réponse...",
      timeline: [
        { date: "2025-01-20", action: "Réclamation soumise", status: "done" },
        { date: "2025-01-21", action: "Assignée au service compétent", status: "done" },
        { date: "2025-01-22", action: "En cours de traitement", status: "current" },
        { date: "En attente", action: "Résolution", status: "pending" },
      ],
    },
    {
      id: "REC-2025-002",
      title: "Problème d'accès à la plateforme e-learning",
      titleAr: "مشكلة في الوصول إلى منصة التعلم الإلكتروني",
      category: "Technique",
      priority: "medium",
      status: "resolue",
      submittedBy: "Sarah Larbi",
      submittedDate: "2025-01-18",
      lastUpdate: "2025-01-19",
      assignedTo: "Support IT",
      description: "Impossible de me connecter depuis 2 jours",
      resolution: "Problème de mot de passe résolu. Nouveau mot de passe envoyé par email.",
    },
    {
      id: "REC-2025-003",
      title: "Désaccord sur la note d'examen",
      titleAr: "اعتراض على علامة الامتحان",
      category: "Pédagogique",
      priority: "medium",
      status: "en_attente",
      submittedBy: "Youcef Maamar",
      submittedDate: "2025-01-21",
      lastUpdate: "2025-01-21",
      assignedTo: "Commission Pédagogique",
      description: "Demande de révision de la note de l'examen de mathématiques",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolue": return "bg-green-100 text-green-700 border-green-300";
      case "en_cours": return "bg-blue-100 text-blue-700 border-blue-300";
      case "en_attente": return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "rejetee": return "bg-red-100 text-red-700 border-red-300";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500";
      case "medium": return "bg-orange-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Portail des Réclamations (E-Recours)
        </h1>
        <p className="text-gray-600 text-lg">Soumission et suivi transparent de vos réclamations</p>
        <p className="text-sm font-cairo text-gray-500 mt-1" dir="rtl">
          بوابة الشكاوى والمتابعة الشفافة
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Total Réclamations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {complaints.length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">En Cours</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">
              {complaints.filter(c => c.status === 'en_cours').length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Résolues</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              {complaints.filter(c => c.status === 'resolue').length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Temps Moyen</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-600">2.3j</p>
          </CardContent>
        </Card>
      </div>

      {/* New Complaint Button */}
      <Card className="mb-6 border-0 shadow-xl bg-gradient-to-r from-red-600 to-pink-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">Soumettre une Réclamation</h3>
              <p className="text-red-100">
                Votre satisfaction est notre priorité. Faites-nous part de vos préoccupations.
              </p>
              <p className="text-sm font-cairo mt-1" dir="rtl">
                رضاك هو أولويتنا. شاركنا مخاوفك
              </p>
            </div>
            <Button size="lg" className="bg-white text-red-600 hover:bg-red-50">
              <Send className="h-5 w-5 mr-2" />
              Nouvelle Réclamation
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Complaints List */}
      <div className="space-y-4">
        {complaints.map((complaint) => (
          <Card key={complaint.id} className="border-0 shadow-lg hover:shadow-2xl transition-all bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-1 h-12 ${getPriorityColor(complaint.priority)} rounded-full`}></div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Hash className="h-4 w-4 text-gray-400" />
                        <span className="font-mono text-sm text-gray-600">{complaint.id}</span>
                        <Badge className={getStatusColor(complaint.status) + " border-2"}>
                          {complaint.status === 'resolue' ? 'Résolue' :
                           complaint.status === 'en_cours' ? 'En cours' : 'En attente'}
                        </Badge>
                      </div>
                      <h3 className="font-bold text-xl mb-1">{complaint.title}</h3>
                      <p className="text-sm font-cairo text-gray-600" dir="rtl">{complaint.titleAr}</p>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4 ml-4">{complaint.description}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 ml-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <User className="h-4 w-4" />
                      <div>
                        <p className="text-xs text-gray-500">Soumis par</p>
                        <p className="font-semibold">{complaint.submittedBy}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <div>
                        <p className="text-xs text-gray-500">Date</p>
                        <p className="font-semibold">{complaint.submittedDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FileText className="h-4 w-4" />
                      <div>
                        <p className="text-xs text-gray-500">Catégorie</p>
                        <p className="font-semibold">{complaint.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <User className="h-4 w-4" />
                      <div>
                        <p className="text-xs text-gray-500">Assignée à</p>
                        <p className="font-semibold">{complaint.assignedTo}</p>
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  {complaint.timeline && (
                    <div className="mt-6 ml-4 border-l-2 border-gray-300 pl-6 space-y-4">
                      {complaint.timeline.map((step, idx) => (
                        <div key={idx} className="relative">
                          <div className={`absolute -left-[29px] w-4 h-4 rounded-full border-2 border-white ${
                            step.status === 'done' ? 'bg-green-500' :
                            step.status === 'current' ? 'bg-blue-500 animate-pulse' :
                            'bg-gray-300'
                          }`}></div>
                          <div>
                            <p className="font-semibold text-sm">{step.action}</p>
                            <p className="text-xs text-gray-500">{step.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Resolution */}
                  {complaint.status === 'resolue' && complaint.resolution && (
                    <div className="mt-4 ml-4 p-4 bg-green-50 rounded-lg border-2 border-green-200">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="font-semibold text-green-900 mb-1">Résolution</p>
                          <p className="text-sm text-green-800">{complaint.resolution}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Détails
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
