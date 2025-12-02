"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardNav } from "@/components/dashboard-nav";
import { 
  Handshake, 
  Building2, 
  Briefcase, 
  GraduationCap,
  MapPin,
  Clock,
  Users,
  ExternalLink
} from "lucide-react";

export default function PartnershipsPage() {
  const [partnerships, setPartnerships] = useState<any[]>([]);
  const [internships, setInternships] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [partnershipsRes, internshipsRes] = await Promise.all([
        fetch("/api/partnerships?status=active"),
        fetch("/api/internships?status=open"),
      ]);

      const partnershipsData = await partnershipsRes.json();
      const internshipsData = await internshipsRes.json();

      setPartnerships(partnershipsData);
      setInternships(internshipsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const mockPartnerships = [
    {
      name: "Sonatrach",
      nameAr: "سوناطراك",
      sector: "Énergie",
      description: "Partenariat stratégique pour la formation et la recherche",
      opportunities: 12,
      status: "active",
    },
    {
      name: "Condor Electronics",
      nameAr: "كوندور إلكترونيكس",
      sector: "Technologies",
      description: "Collaboration en R&D et stages étudiants",
      opportunities: 8,
      status: "active",
    },
    {
      name: "Air Algérie",
      nameAr: "الخطوط الجوية الجزائرية",
      sector: "Transport",
      description: "Programme de formation continue",
      opportunities: 5,
      status: "active",
    },
  ];

  const mockInternships = [
    {
      title: "Stage en Développement Web",
      titleAr: "تدريب في تطوير الويب",
      company: "Condor Electronics",
      location: "Alger",
      duration: "6 mois",
      type: "internship",
      positions: 3,
      applications: 15,
      deadline: "2025-03-15",
    },
    {
      title: "Ingénieur DevOps Junior",
      titleAr: "مهندس DevOps مبتدئ",
      company: "Sonatrach Digital",
      location: "Oran",
      duration: "CDI",
      type: "job",
      positions: 2,
      applications: 23,
      deadline: "2025-03-20",
    },
    {
      title: "Projet de Recherche en IA",
      titleAr: "مشروع بحث في الذكاء الاصطناعي",
      company: "Université Partenaire",
      location: "Constantine",
      duration: "3 mois",
      type: "project",
      positions: 5,
      applications: 8,
      deadline: "2025-04-01",
    },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "internship":
        return "bg-blue-100 text-blue-700";
      case "job":
        return "bg-green-100 text-green-700";
      case "project":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "internship":
        return "Stage";
      case "job":
        return "Emploi";
      case "project":
        return "Projet";
      default:
        return type;
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Partenariats & Innovation
        </h1>
        <p className="text-gray-600 text-lg">
          Plateforme de collaboration avec le secteur économique
        </p>
        <p className="text-sm font-cairo text-gray-500 mt-1" dir="rtl">
          منصة التعاون مع القطاع الاقتصادي
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Handshake className="h-4 w-4" />
                Partenaires Actifs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">
                {partnerships.length || mockPartnerships.length}
              </p>
            </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Opportunités
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">
                {internships.length || mockInternships.length}
              </p>
            </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Users className="h-4 w-4" />
                Candidatures
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">156</p>
            </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Placements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-purple-600">89</p>
            </CardContent>
          </Card>
      </div>

      <Tabs defaultValue="opportunities" className="space-y-6">
        <TabsList className="bg-white/80 backdrop-blur-sm shadow-md">
          <TabsTrigger value="opportunities">Opportunités</TabsTrigger>
          <TabsTrigger value="partners">Partenaires</TabsTrigger>
          <TabsTrigger value="projects">Projets de Recherche</TabsTrigger>
        </TabsList>

        {/* Opportunities */}
        <TabsContent value="opportunities" className="space-y-4">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Offres Disponibles</CardTitle>
                <CardDescription>
                  Stages, emplois et projets avec nos partenaires
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockInternships.map((opportunity, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{opportunity.title}</h3>
                            <Badge className={getTypeColor(opportunity.type)}>
                              {getTypeLabel(opportunity.type)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2" dir="rtl">
                            {opportunity.titleAr}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Building2 className="h-4 w-4" />
                              {opportunity.company}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {opportunity.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {opportunity.duration}
                            </span>
                          </div>
                        </div>
                        <Button>Postuler</Button>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t">
                        <div className="flex gap-4 text-sm">
                          <span className="text-muted-foreground">
                            <strong>{opportunity.positions}</strong> postes
                          </span>
                          <span className="text-muted-foreground">
                            <strong>{opportunity.applications}</strong> candidatures
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          Date limite: {new Date(opportunity.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Partners */}
        <TabsContent value="partners" className="space-y-4">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl">Nos Partenaires</CardTitle>
                    <CardDescription>
                      Entreprises et organisations partenaires
                    </CardDescription>
                  </div>
                  <Button>
                    <Building2 className="h-4 w-4 mr-2" />
                    Proposer un Partenariat
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockPartnerships.map((partner, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <Building2 className="h-10 w-10 text-primary" />
                          <Badge variant="default">Actif</Badge>
                        </div>
                        <CardTitle className="mt-4">{partner.name}</CardTitle>
                        <CardDescription dir="rtl">
                          {partner.nameAr}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Secteur</p>
                            <Badge variant="secondary">{partner.sector}</Badge>
                          </div>
                          <p className="text-sm">{partner.description}</p>
                          <div className="pt-3 border-t">
                            <p className="text-sm font-semibold">
                              {partner.opportunities} opportunités disponibles
                            </p>
                          </div>
                          <Button variant="outline" className="w-full">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Voir le Profil
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Research Projects */}
        <TabsContent value="projects" className="space-y-4">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Projets de Recherche Collaboratifs</CardTitle>
                <CardDescription>
                  Initiatives de R&D avec nos partenaires industriels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-purple-50">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg mb-2">
                          Intelligence Artificielle pour l'Énergie
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Projet conjoint avec Sonatrach sur l'optimisation énergétique
                        </p>
                      </div>
                      <Badge className="bg-purple-600 text-white">En cours</Badge>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <span>Durée: 18 mois</span>
                      <span>Budget: 2M DA</span>
                      <span>5 Chercheurs</span>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg bg-blue-50">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg mb-2">
                          IoT pour l'Agriculture Intelligente
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Solutions IoT pour l'agriculture durable
                        </p>
                      </div>
                      <Badge className="bg-blue-600 text-white">En cours</Badge>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <span>Durée: 12 mois</span>
                      <span>Budget: 1.5M DA</span>
                      <span>8 Chercheurs</span>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg mb-2">
                          Blockchain pour la Traçabilité
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Application blockchain dans la chaîne d'approvisionnement
                        </p>
                      </div>
                      <Badge variant="outline">Planifié</Badge>
                    </div>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>Début prévu: Avril 2025</span>
                      <span>Budget: 1.2M DA</span>
                    </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
