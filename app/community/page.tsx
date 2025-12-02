"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DashboardNav } from "@/components/dashboard-nav";
import { 
  MessageSquare, 
  ThumbsUp, 
  MessageCircle,
  Share2,
  Send,
  Plus,
  Search,
  TrendingUp,
  Users,
  Lightbulb
} from "lucide-react";

export default function CommunityPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/community");
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const mockPosts = [
    {
      id: 1,
      author: "Dr. Karim Mansouri",
      role: "Professeur",
      type: "announcement",
      content: "Nouvelle conférence sur l'IA appliquée à la santé - Vendredi 14h, Amphi A",
      contentAr: "محاضرة جديدة حول الذكاء الاصطناعي المطبق على الصحة - الجمعة 14:00، قاعة A",
      likes: 45,
      comments: 12,
      timestamp: "Il y a 2 heures",
      tags: ["Conférence", "IA", "Santé"],
    },
    {
      id: 2,
      author: "Ahmed Benali",
      role: "Étudiant",
      type: "question",
      content: "Quelqu'un peut recommander des ressources pour apprendre React Native?",
      contentAr: "هل يمكن لأحد أن يوصي بموارد لتعلم React Native؟",
      likes: 23,
      comments: 18,
      timestamp: "Il y a 5 heures",
      tags: ["Programmation", "React Native"],
    },
    {
      id: 3,
      author: "Amina Hadj",
      role: "Étudiante",
      type: "idea",
      content: "Projet: Créer une app mobile pour gérer les clubs étudiants. Cherche collaborateurs!",
      contentAr: "مشروع: إنشاء تطبيق جوال لإدارة النوادي الطلابية. أبحث عن متعاونين!",
      likes: 67,
      comments: 24,
      timestamp: "Il y a 1 jour",
      tags: ["Projet", "Collaboration", "Mobile"],
    },
    {
      id: 4,
      author: "Service Scolarité",
      role: "Administration",
      type: "announcement",
      content: "Rappel: Les inscriptions pédagogiques se terminent le 25 mars. N'oubliez pas!",
      contentAr: "تذكير: تنتهي التسجيلات التعليمية في 25 مارس. لا تنسوا!",
      likes: 89,
      comments: 5,
      timestamp: "Il y a 3 heures",
      tags: ["Important", "Inscription"],
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "announcement":
        return <MessageSquare className="h-5 w-5 text-blue-600" />;
      case "question":
        return <MessageCircle className="h-5 w-5 text-orange-600" />;
      case "idea":
        return <Lightbulb className="h-5 w-5 text-purple-600" />;
      case "discussion":
        return <Users className="h-5 w-5 text-green-600" />;
      default:
        return <MessageSquare className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "announcement":
        return "bg-blue-100 text-blue-700";
      case "question":
        return "bg-orange-100 text-orange-700";
      case "idea":
        return "bg-purple-100 text-purple-700";
      case "discussion":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      announcement: "Annonce",
      question: "Question",
      idea: "Idée",
      discussion: "Discussion",
    };
    return labels[type] || type;
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Communauté Universitaire
        </h1>
        <p className="text-gray-600 text-lg">
          Échangez, partagez et collaborez avec la communauté
        </p>
        <p className="text-sm font-cairo text-gray-500 mt-1" dir="rtl">
          تبادل ومشاركة والتعاون مع المجتمع
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Publications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary">
                  {posts.length || mockPosts.length}
                </p>
              </CardContent>
          </Card>
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Membres Actifs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">342</p>
              </CardContent>
          </Card>
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <ThumbsUp className="h-4 w-4" />
                  Interactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-600">1,256</p>
              </CardContent>
          </Card>
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Cette Semaine
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-purple-600">+89</p>
              </CardContent>
            </Card>
          </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-4">
          {/* New Post */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">Créer une publication</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <textarea
                      className="w-full min-h-[100px] p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Partagez vos idées, questions ou annonces..."
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                    />
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Annonce
                        </Button>
                        <Button variant="outline" size="sm">
                          Question
                        </Button>
                        <Button variant="outline" size="sm">
                          Idée
                        </Button>
                      </div>
                      <Button>
                        <Send className="h-4 w-4 mr-2" />
                        Publier
                      </Button>
                    </div>
                </div>
              </CardContent>
            </Card>

          {/* Posts Feed */}
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList className="bg-white/80 backdrop-blur-sm shadow-md">
              <TabsTrigger value="all">Tout</TabsTrigger>
              <TabsTrigger value="announcement">Annonces</TabsTrigger>
              <TabsTrigger value="question">Questions</TabsTrigger>
              <TabsTrigger value="idea">Idées</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {mockPosts.map((post) => (
                <Card key={post.id} className="border-0 shadow-lg hover:shadow-2xl transition-all bg-white/80 backdrop-blur-sm">
                      <CardContent className="pt-6">
                        <div className="flex gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                              {getTypeIcon(post.type)}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-semibold">{post.author}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {post.role} · {post.timestamp}
                                </p>
                              </div>
                              <Badge className={getTypeColor(post.type)}>
                                {getTypeLabel(post.type)}
                              </Badge>
                            </div>
                            <p className="mb-2">{post.content}</p>
                            <p className="text-sm text-muted-foreground mb-3" dir="rtl">
                              {post.contentAr}
                            </p>
                            <div className="flex flex-wrap gap-2 mb-3">
                              {post.tags.map((tag: string, index: number) => (
                                <Badge key={index} variant="outline">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex gap-6 pt-3 border-t">
                              <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                                <ThumbsUp className="h-4 w-4" />
                                {post.likes}
                              </button>
                              <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                                <MessageCircle className="h-4 w-4" />
                                {post.comments}
                              </button>
                              <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                                <Share2 className="h-4 w-4" />
                                Partager
                              </button>
                            </div>
                          </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Search */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">Rechercher</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher des publications..."
                      className="pl-10"
                    />
                  </div>
            </CardContent>
          </Card>

          {/* Trending Topics */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Sujets Tendances
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { tag: "Intelligence Artificielle", count: 45 },
                      { tag: "Projets Étudiants", count: 38 },
                      { tag: "Stage 2025", count: 32 },
                      { tag: "Clubs Universitaires", count: 28 },
                      { tag: "Examens", count: 24 },
                    ].map((topic, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-2 hover:bg-accent rounded-lg cursor-pointer transition-colors"
                      >
                        <span className="font-medium">#{topic.tag}</span>
                        <Badge variant="secondary">{topic.count}</Badge>
                      </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Active Users */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Membres Actifs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: "Dr. Karim M.", role: "Professeur", status: "online" },
                      { name: "Amina H.", role: "Étudiante", status: "online" },
                      { name: "Omar B.", role: "Étudiant", status: "online" },
                      { name: "Sarah L.", role: "Étudiante", status: "away" },
                    ].map((user, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div
                            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                              user.status === "online"
                                ? "bg-green-500"
                                : "bg-yellow-500"
                            }`}
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
