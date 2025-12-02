"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lightbulb, Send, TrendingUp, CheckCircle, Clock, XCircle, Filter, ThumbsUp, BarChart3 } from "lucide-react";

export default function SuggestionsPage() {
  const [newSuggestion, setNewSuggestion] = useState("");
  const [category, setCategory] = useState("infrastructure");

  const suggestions = [
    {
      id: 1,
      title: "Améliorer les horaires de la bibliothèque",
      titleAr: "تحسين أوقات المكتبة",
      description: "Proposer une ouverture plus tardive en période d'examens jusqu'à 22h",
      author: "Ahmed Benali",
      category: "Infrastructure",
      status: "en_cours",
      votes: 256,
      impact: "high",
      feasibility: 85,
      cost: "medium",
      date: "2025-01-15",
      aiAnalysis: "Forte demande étudiante (78% approbation). Impact estimé sur 450 étudiants.",
    },
    {
      id: 2,
      title: "Créer un espace coworking étudiant",
      titleAr: "إنشاء مساحة عمل مشتركة للطلاب",
      description: "Aménager une salle dédiée au travail collaboratif avec équipements modernes",
      author: "Amina Hadj",
      category: "Innovation",
      status: "validee",
      votes: 189,
      impact: "high",
      feasibility: 72,
      cost: "high",
      date: "2025-01-10",
      aiAnalysis: "Tendance observée dans 12 universités. ROI positif estimé.",
    },
    {
      id: 3,
      title: "Digitaliser le processus de prêt de livres",
      titleAr: "رقمنة عملية استعارة الكتب",
      description: "Système automatisé pour emprunter et retourner les livres",
      author: "Youcef Maamar",
      category: "Digital",
      status: "recue",
      votes: 334,
      impact: "high",
      feasibility: 90,
      cost: "low",
      date: "2025-01-20",
      aiAnalysis: "Faisabilité technique élevée. Économie de temps estimée: 60%.",
    },
    {
      id: 4,
      title: "Programme de mentorat étudiant",
      titleAr: "برنامج التوجيه الطلابي",
      description: "Connecter les nouveaux étudiants avec des mentors expérimentés",
      author: "Sarah Larbi",
      category: "Pédagogie",
      status: "en_cours",
      votes: 145,
      impact: "medium",
      feasibility: 95,
      cost: "low",
      date: "2025-01-18",
      aiAnalysis: "Programme testé avec succès dans 8 universités similaires.",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "validee": return "bg-green-100 text-green-700 border-green-300";
      case "en_cours": return "bg-blue-100 text-blue-700 border-blue-300";
      case "recue": return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "rejetee": return "bg-red-100 text-red-700 border-red-300";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "validee": return <CheckCircle className="h-4 w-4" />;
      case "en_cours": return <Clock className="h-4 w-4" />;
      case "recue": return <Lightbulb className="h-4 w-4" />;
      case "rejetee": return <XCircle className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "validee": return "Validée";
      case "en_cours": return "En cours";
      case "recue": return "Reçue";
      case "rejetee": return "Rejetée";
      default: return status;
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Boîte à Suggestions Intelligente
        </h1>
        <p className="text-gray-600 text-lg">Proposez vos idées pour améliorer l'université</p>
        <p className="text-sm font-cairo text-gray-500 mt-1" dir="rtl">
          اقترح أفكارك لتحسين الجامعة
        </p>
      </div>

      {/* New Suggestion Card */}
      <Card className="mb-6 border-0 shadow-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Lightbulb className="h-6 w-6" />
            Proposer une Nouvelle Idée
          </CardTitle>
          <CardDescription className="text-blue-100">
            Votre voix compte ! Partagez vos suggestions pour améliorer l'université
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
            <textarea
              className="w-full bg-white text-gray-900 p-4 rounded-lg border-0 resize-none focus:ring-2 focus:ring-white"
              rows={4}
              placeholder="Décrivez votre suggestion en détail..."
              value={newSuggestion}
              onChange={(e) => setNewSuggestion(e.target.value)}
            />
            <div className="flex gap-3 mt-3">
              <select
                className="bg-white text-gray-900 px-4 py-2 rounded-lg border-0"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="infrastructure">Infrastructure</option>
                <option value="pedagogie">Pédagogie</option>
                <option value="digital">Digital</option>
                <option value="innovation">Innovation</option>
                <option value="services">Services</option>
              </select>
              <Button className="ml-auto bg-white text-blue-600 hover:bg-blue-50">
                <Send className="h-4 w-4 mr-2" />
                Soumettre la Suggestion
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tableau de Transparence */}
      <Card className="mb-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            Tableau de Transparence
          </CardTitle>
          <CardDescription>Suivi du traitement des suggestions citoyennes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200 text-center">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-green-700">58</p>
              <p className="text-sm text-gray-600">Validées</p>
              <p className="text-xs font-cairo text-gray-500 mt-1" dir="rtl">تم التحقق</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200 text-center">
              <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-blue-700">34</p>
              <p className="text-sm text-gray-600">En Cours</p>
              <p className="text-xs font-cairo text-gray-500 mt-1" dir="rtl">قيد التنفيذ</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200 text-center">
              <Lightbulb className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-yellow-700">23</p>
              <p className="text-sm text-gray-600">En Attente</p>
              <p className="text-xs font-cairo text-gray-500 mt-1" dir="rtl">في الانتظار</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200 text-center">
              <BarChart3 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-purple-700">87%</p>
              <p className="text-sm text-gray-600">Taux Traitement</p>
              <p className="text-xs font-cairo text-gray-500 mt-1" dir="rtl">معدل المعالجة</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Suggestions List */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="bg-white/80 backdrop-blur-sm shadow-md">
          <TabsTrigger value="all">Toutes ({suggestions.length})</TabsTrigger>
          <TabsTrigger value="validee">Validées</TabsTrigger>
          <TabsTrigger value="en_cours">En Cours</TabsTrigger>
          <TabsTrigger value="recue">En Attente</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {suggestions.map((suggestion) => (
            <Card key={suggestion.id} className="border-0 shadow-lg hover:shadow-2xl transition-all bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-xl">{suggestion.title}</h3>
                      <Badge className={getStatusColor(suggestion.status) + " border-2 font-semibold"}>
                        {getStatusIcon(suggestion.status)}
                        <span className="ml-1">{getStatusLabel(suggestion.status)}</span>
                      </Badge>
                    </div>
                    <p className="text-sm font-cairo text-gray-600 mb-3" dir="rtl">
                      {suggestion.titleAr}
                    </p>
                    <p className="text-gray-700 mb-4">{suggestion.description}</p>

                    {/* AI Analysis */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border-2 border-purple-200 mb-4">
                      <div className="flex items-start gap-2">
                        <Brain className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-purple-900 mb-1">Analyse IA (NLP)</p>
                          <p className="text-sm text-purple-800">{suggestion.aiAnalysis}</p>
                        </div>
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Impact</p>
                        <Badge className={
                          suggestion.impact === 'high' ? 'bg-red-100 text-red-700' :
                          suggestion.impact === 'medium' ? 'bg-orange-100 text-orange-700' :
                          'bg-green-100 text-green-700'
                        }>
                          {suggestion.impact.toUpperCase()}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Faisabilité</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                              style={{ width: `${suggestion.feasibility}%` }}
                            />
                          </div>
                          <span className="text-sm font-bold">{suggestion.feasibility}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Coût</p>
                        <Badge variant="outline" className="capitalize">{suggestion.cost}</Badge>
                      </div>
                    </div>

                    <div className="flex gap-3 text-sm text-gray-600 mt-4">
                      <span>Par: <span className="font-semibold">{suggestion.author}</span></span>
                      <span>•</span>
                      <span>{suggestion.category}</span>
                      <span>•</span>
                      <span>{suggestion.date}</span>
                    </div>
                  </div>

                  {/* Votes Section */}
                  <div className="text-center ml-6">
                    <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-6 rounded-xl shadow-md">
                      <TrendingUp className="h-10 w-10 text-blue-600 mx-auto mb-2" />
                      <p className="text-4xl font-bold text-blue-700 mb-1">{suggestion.votes}</p>
                      <p className="text-sm text-gray-700 mb-3">votes</p>
                      <Button className="bg-gradient-to-r from-blue-600 to-purple-600 w-full">
                        <ThumbsUp className="h-4 w-4 mr-2" />
                        Voter
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
