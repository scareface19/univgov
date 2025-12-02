"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  Send, 
  Users, 
  Lightbulb, 
  TrendingUp,
  CheckCircle,
  Clock,
  Vote,
  Sparkles,
  Filter,
  BarChart3,
  Plus
} from "lucide-react";

export default function CommunicationPage() {
  const [newMessage, setNewMessage] = useState("");
  const [newSuggestion, setNewSuggestion] = useState("");

  const conversations = [
    {
      id: 1,
      participant: "Dr. Karim Mansouri",
      lastMessage: "Réunion demain à 10h pour discuter du projet",
      time: "Il y a 5 min",
      unread: 2,
      avatar: "KM"
    },
    {
      id: 2,
      participant: "Groupe Informatique S5",
      lastMessage: "Les slides du cours sont disponibles",
      time: "Il y a 15 min",
      unread: 0,
      avatar: "GI"
    },
    {
      id: 3,
      participant: "Administration - Scolarité",
      lastMessage: "Votre demande a été traitée",
      time: "Il y a 1h",
      unread: 1,
      avatar: "AS"
    },
  ];

  const suggestions = [
    {
      id: 1,
      title: "Améliorer les horaires de la bibliothèque",
      titleAr: "تحسين أوقات المكتبة",
      author: "Ahmed B.",
      category: "Infrastructure",
      votes: 156,
      status: "en_cours",
      impact: "high",
      date: "2025-01-15"
    },
    {
      id: 2,
      title: "Créer un espace coworking étudiant",
      titleAr: "إنشاء مساحة عمل مشتركة للطلاب",
      author: "Amina H.",
      category: "Innovation",
      votes: 89,
      status: "validee",
      impact: "medium",
      date: "2025-01-10"
    },
    {
      id: 3,
      title: "Digitaliser le processus de prêt de livres",
      titleAr: "رقمنة عملية استعارة الكتب",
      author: "Youcef M.",
      category: "Digital",
      votes: 234,
      status: "recue",
      impact: "high",
      date: "2025-01-20"
    },
  ];

  const forums = [
    {
      id: 1,
      title: "Débat sur le nouveau règlement intérieur",
      titleAr: "نقاش حول النظام الداخلي الجديد",
      category: "Réglementation",
      participants: 45,
      messages: 128,
      lastActivity: "Il y a 10 min"
    },
    {
      id: 2,
      title: "Suggestions pour la rentrée 2025-2026",
      titleAr: "اقتراحات للعودة الدراسية 2025-2026",
      category: "Pédagogie",
      participants: 67,
      messages: 203,
      lastActivity: "Il y a 25 min"
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "validee": return "bg-green-100 text-green-700";
      case "en_cours": return "bg-blue-100 text-blue-700";
      case "recue": return "bg-yellow-100 text-yellow-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "validee": return "Validée";
      case "en_cours": return "En cours";
      case "recue": return "Reçue";
      default: return status;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high": return "text-red-600";
      case "medium": return "text-orange-600";
      case "low": return "text-green-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Communication Participative
        </h1>
        <p className="text-gray-600 text-lg">
          Espace d'interaction et de collaboration universitaire
        </p>
        <p className="text-sm font-cairo text-gray-500 mt-1" dir="rtl">
          فضاء التواصل والتعاون الجامعي
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-blue-600" />
              Messages Actifs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {conversations.length}
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-yellow-600" />
              Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-600">{suggestions.length}</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4 text-green-600" />
              Forums Actifs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{forums.length}</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              Taux de Traitement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-600">87%</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="messaging" className="space-y-6">
        <TabsList className="bg-white/80 backdrop-blur-sm shadow-md">
          <TabsTrigger value="messaging">
            <MessageSquare className="h-4 w-4 mr-2" />
            Messagerie
          </TabsTrigger>
          <TabsTrigger value="suggestions">
            <Lightbulb className="h-4 w-4 mr-2" />
            Boîte à Suggestions
          </TabsTrigger>
          <TabsTrigger value="forums">
            <Users className="h-4 w-4 mr-2" />
            Forums
          </TabsTrigger>
          <TabsTrigger value="votes">
            <Vote className="h-4 w-4 mr-2" />
            Votes Participatifs
          </TabsTrigger>
        </TabsList>

        {/* Messagerie */}
        <TabsContent value="messaging" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Liste des conversations */}
            <Card className="lg:col-span-1 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Conversations</CardTitle>
                <CardDescription>Vos discussions récentes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {conversations.map((conv) => (
                    <div
                      key={conv.id}
                      className="p-3 rounded-lg border hover:bg-blue-50 cursor-pointer transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                          {conv.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <p className="font-semibold text-sm truncate">{conv.participant}</p>
                            {conv.unread > 0 && (
                              <Badge className="ml-2 bg-red-500">{conv.unread}</Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 truncate">{conv.lastMessage}</p>
                          <p className="text-xs text-gray-400 mt-1">{conv.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Zone de chat */}
            <Card className="lg:col-span-2 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Dr. Karim Mansouri</CardTitle>
                <CardDescription>En ligne</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 border rounded-lg p-4 mb-4 overflow-y-auto bg-gray-50">
                  <div className="space-y-4">
                    <div className="flex justify-end">
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-lg max-w-xs">
                        <p className="text-sm">Bonjour, pouvez-vous m'envoyer le planning ?</p>
                        <p className="text-xs opacity-75 mt-1">10:30</p>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-white p-3 rounded-lg border max-w-xs">
                        <p className="text-sm">Bien sûr ! Je vous l'envoie dans quelques minutes.</p>
                        <p className="text-xs text-gray-500 mt-1">10:32</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Tapez votre message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Boîte à Suggestions */}
        <TabsContent value="suggestions" className="space-y-4">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl">Proposer une Idée</CardTitle>
                  <CardDescription>Votre voix compte pour améliorer l'université</CardDescription>
                </div>
                <Button className="bg-gradient-to-r from-yellow-500 to-orange-500">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Nouvelle Suggestion
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <textarea
                  className="w-full p-3 border rounded-lg resize-none"
                  rows={3}
                  placeholder="Décrivez votre suggestion..."
                  value={newSuggestion}
                  onChange={(e) => setNewSuggestion(e.target.value)}
                />
                <div className="flex gap-2 mt-3">
                  <select className="border rounded-lg px-3 py-2">
                    <option>Infrastructure</option>
                    <option>Pédagogie</option>
                    <option>Digital</option>
                    <option>Innovation</option>
                  </select>
                  <Button className="ml-auto bg-gradient-to-r from-blue-600 to-purple-600">
                    <Send className="h-4 w-4 mr-2" />
                    Soumettre
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="p-4 border-2 rounded-lg hover:shadow-lg transition-all bg-white"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-lg">{suggestion.title}</h3>
                          <Badge className={getStatusColor(suggestion.status)}>
                            {getStatusLabel(suggestion.status)}
                          </Badge>
                        </div>
                        <p className="text-sm font-cairo text-gray-600 mb-2" dir="rtl">
                          {suggestion.titleAr}
                        </p>
                        <div className="flex gap-3 text-sm text-gray-600">
                          <span>Par {suggestion.author}</span>
                          <span>•</span>
                          <span>{suggestion.category}</span>
                          <span>•</span>
                          <span>{suggestion.date}</span>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-3 rounded-lg">
                          <TrendingUp className={`h-6 w-6 mx-auto ${getImpactColor(suggestion.impact)}`} />
                          <p className="text-2xl font-bold mt-1">{suggestion.votes}</p>
                          <p className="text-xs text-gray-600">votes</p>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Voter pour cette idée
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tableau de transparence */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <BarChart3 className="h-6 w-6" />
                Tableau de Transparence
              </CardTitle>
              <CardDescription>Suivi du traitement des suggestions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                  <CheckCircle className="h-8 w-8 text-green-600 mb-2" />
                  <p className="text-3xl font-bold text-green-700">45</p>
                  <p className="text-sm text-gray-600">Suggestions Validées</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                  <Clock className="h-8 w-8 text-blue-600 mb-2" />
                  <p className="text-3xl font-bold text-blue-700">23</p>
                  <p className="text-sm text-gray-600">En Cours de Traitement</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                  <Lightbulb className="h-8 w-8 text-yellow-600 mb-2" />
                  <p className="text-3xl font-bold text-yellow-700">12</p>
                  <p className="text-sm text-gray-600">En Attente</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Forums */}
        <TabsContent value="forums" className="space-y-4">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl">Forums Thématiques</CardTitle>
                  <CardDescription>Débats et discussions par thème</CardDescription>
                </div>
                <Button className="bg-gradient-to-r from-green-500 to-emerald-500">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau Forum
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {forums.map((forum) => (
                  <div
                    key={forum.id}
                    className="p-4 border-2 rounded-lg hover:shadow-lg transition-all bg-white cursor-pointer"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1">{forum.title}</h3>
                        <p className="text-sm font-cairo text-gray-600 mb-3" dir="rtl">
                          {forum.titleAr}
                        </p>
                        <div className="flex gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {forum.participants} participants
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            {forum.messages} messages
                          </span>
                          <span>•</span>
                          <span>{forum.lastActivity}</span>
                        </div>
                      </div>
                      <Badge variant="outline">{forum.category}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Votes Participatifs */}
        <TabsContent value="votes" className="space-y-4">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Vote className="h-6 w-6" />
                Vote Participatif - E-Gouvernance Étudiante
              </CardTitle>
              <CardDescription className="text-blue-100">
                Système de vote sécurisé basé sur la blockchain
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                <h3 className="font-bold text-xl mb-4">Vote en Cours</h3>
                <p className="mb-4">Nouveau règlement des activités extra-scolaires</p>
                <div className="space-y-3">
                  <Button className="w-full bg-white text-blue-600 hover:bg-gray-100">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Pour (234 votes)
                  </Button>
                  <Button variant="outline" className="w-full border-white text-white hover:bg-white/10">
                    Contre (89 votes)
                  </Button>
                </div>
                <p className="text-sm text-blue-100 mt-4 text-center">
                  Fin du vote: 25 Janvier 2025
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
