"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  TrendingUp, 
  Package, 
  Leaf,
  PieChart,
  AlertTriangle,
  CheckCircle,
  Download,
  Upload,
  Zap
} from "lucide-react";

export default function ResourcesPage() {
  const budgetData = {
    total: 45000000,
    faculties: [
      { name: "Sciences", budget: 12000000, spent: 8500000, percentage: 71 },
      { name: "Technologies", budget: 15000000, spent: 11200000, percentage: 75 },
      { name: "Médecine", budget: 10000000, spent: 7800000, percentage: 78 },
      { name: "Lettres", budget: 5000000, spent: 3200000, percentage: 64 },
      { name: "Économie", budget: 3000000, spent: 2100000, percentage: 70 },
    ],
  };

  const scholarships = [
    { id: 1, student: "Ahmed B.", amount: 15000, type: "Excellence", status: "active" },
    { id: 2, student: "Amina H.", amount: 12000, type: "Mérite", status: "active" },
    { id: 3, student: "Youcef M.", amount: 18000, type: "Sociale", status: "pending" },
    { id: 4, student: "Sarah L.", amount: 15000, type: "Excellence", status: "active" },
  ];

  const inventory = [
    { id: 1, item: "Ordinateurs Portables", quantity: 150, status: "good", location: "Salle Info A" },
    { id: 2, item: "Projecteurs", quantity: 45, status: "maintenance", location: "Amphi 1-5" },
    { id: 3, item: "Microscopes", quantity: 30, status: "good", location: "Labo Bio" },
    { id: 4, item: "Imprimantes", quantity: 25, status: "good", location: "Administration" },
  ];

  const energyData = {
    electricity: { current: 45000, last: 48000, percentage: -6.25 },
    water: { current: 12000, last: 11500, percentage: 4.35 },
    gas: { current: 8000, last: 8500, percentage: -5.88 },
    carbon: 125.5,
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Gestion des Ressources
        </h1>
        <p className="text-gray-600 text-lg">
          Suivi transparent et optimisation des ressources universitaires
        </p>
        <p className="text-sm font-cairo text-gray-500 mt-1" dir="rtl">
          إدارة وتحسين الموارد الجامعية
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              Budget Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              {(budgetData.total / 1000000).toFixed(1)}M DA
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Package className="h-4 w-4 text-blue-600" />
              Équipements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{inventory.length}</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              Bourses Actives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-600">
              {scholarships.filter(s => s.status === 'active').length}
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Leaf className="h-4 w-4 text-emerald-600" />
              Empreinte Carbone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-emerald-600">{energyData.carbon}T</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="budget" className="space-y-6">
        <TabsList className="bg-white/80 backdrop-blur-sm shadow-md">
          <TabsTrigger value="budget">
            <DollarSign className="h-4 w-4 mr-2" />
            Visualisation Budgétaire
          </TabsTrigger>
          <TabsTrigger value="scholarships">
            <TrendingUp className="h-4 w-4 mr-2" />
            Bourses & Aides
          </TabsTrigger>
          <TabsTrigger value="inventory">
            <Package className="h-4 w-4 mr-2" />
            Inventaire
          </TabsTrigger>
          <TabsTrigger value="energy">
            <Leaf className="h-4 w-4 mr-2" />
            Suivi Énergétique
          </TabsTrigger>
        </TabsList>

        {/* Budget */}
        <TabsContent value="budget" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Budget Overview */}
            <Card className="lg:col-span-2 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl">Répartition Budgétaire par Faculté</CardTitle>
                    <CardDescription>Budget alloué vs dépensé</CardDescription>
                  </div>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Exporter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {budgetData.faculties.map((faculty, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold">{faculty.name}</h3>
                        <Badge variant={faculty.percentage > 80 ? "destructive" : "default"}>
                          {faculty.percentage}% utilisé
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Budget: {(faculty.budget / 1000000).toFixed(1)}M DA</span>
                          <span>Dépensé: {(faculty.spent / 1000000).toFixed(1)}M DA</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full ${
                              faculty.percentage > 80 ? 'bg-red-500' :
                              faculty.percentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${faculty.percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Actions Rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start bg-gradient-to-r from-green-500 to-emerald-500">
                  <Upload className="h-4 w-4 mr-2" />
                  Soumettre Budget
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <PieChart className="h-4 w-4 mr-2" />
                  Rapport Financier
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Alertes Budget
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Open Data Section */}
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardHeader>
              <CardTitle className="text-2xl">Open Data Universitaire</CardTitle>
              <CardDescription className="text-blue-100">
                Accès public aux données de performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                  <p className="text-sm text-blue-100 mb-2">Taux d'Exécution</p>
                  <p className="text-3xl font-bold">72%</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                  <p className="text-sm text-blue-100 mb-2">Économies Réalisées</p>
                  <p className="text-3xl font-bold">2.5M DA</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                  <p className="text-sm text-blue-100 mb-2">Efficience</p>
                  <p className="text-3xl font-bold">94%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scholarships */}
        <TabsContent value="scholarships" className="space-y-4">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl">Gestion des Bourses</CardTitle>
                  <CardDescription>Attributions et suivi des aides financières</CardDescription>
                </div>
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500">
                  <Upload className="h-4 w-4 mr-2" />
                  Nouvelle Bourse
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {scholarships.map((scholarship) => (
                  <div
                    key={scholarship.id}
                    className="p-4 border-2 rounded-lg hover:shadow-lg transition-all bg-white"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-lg">{scholarship.student}</h3>
                          <Badge variant={scholarship.status === 'active' ? 'default' : 'secondary'}>
                            {scholarship.status === 'active' ? 'Active' : 'En attente'}
                          </Badge>
                          <Badge variant="outline">{scholarship.type}</Badge>
                        </div>
                        <p className="text-2xl font-bold text-green-600">
                          {scholarship.amount.toLocaleString()} DA
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Détails</Button>
                        <Button size="sm">Valider</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                  <TrendingUp className="h-8 w-8 text-green-600 mb-2" />
                  <p className="text-3xl font-bold text-green-700">
                    {scholarships.reduce((sum, s) => sum + s.amount, 0).toLocaleString()} DA
                  </p>
                  <p className="text-sm text-gray-600">Montant Total</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                  <CheckCircle className="h-8 w-8 text-blue-600 mb-2" />
                  <p className="text-3xl font-bold text-blue-700">
                    {scholarships.filter(s => s.status === 'active').length}
                  </p>
                  <p className="text-sm text-gray-600">Bourses Actives</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                  <AlertTriangle className="h-8 w-8 text-yellow-600 mb-2" />
                  <p className="text-3xl font-bold text-yellow-700">
                    {scholarships.filter(s => s.status === 'pending').length}
                  </p>
                  <p className="text-sm text-gray-600">En Attente</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inventory */}
        <TabsContent value="inventory" className="space-y-4">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl">Inventaire Numérique</CardTitle>
                  <CardDescription>Gestion des équipements et matériels</CardDescription>
                </div>
                <Button className="bg-gradient-to-r from-blue-500 to-cyan-500">
                  <Upload className="h-4 w-4 mr-2" />
                  Ajouter Équipement
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {inventory.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 border-2 rounded-lg hover:shadow-lg transition-all bg-white"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-3 rounded-lg">
                          <Package className="h-8 w-8 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{item.item}</h3>
                          <p className="text-sm text-gray-600">{item.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-2xl font-bold">{item.quantity}</p>
                          <p className="text-xs text-gray-600">unités</p>
                        </div>
                        <Badge variant={item.status === 'good' ? 'default' : 'secondary'}>
                          {item.status === 'good' ? 'Bon état' : 'Maintenance'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Energy */}
        <TabsContent value="energy" className="space-y-4">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Leaf className="h-6 w-6 text-green-600" />
                Suivi Énergétique & Écologique
              </CardTitle>
              <CardDescription>Consommations et empreinte environnementale</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className={`p-6 rounded-lg border-2 ${
                  energyData.electricity.percentage < 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <Zap className={`h-8 w-8 ${energyData.electricity.percentage < 0 ? 'text-green-600' : 'text-red-600'}`} />
                    <Badge variant={energyData.electricity.percentage < 0 ? 'default' : 'destructive'}>
                      {energyData.electricity.percentage > 0 ? '+' : ''}{energyData.electricity.percentage.toFixed(1)}%
                    </Badge>
                  </div>
                  <h3 className="font-bold text-lg mb-1">Électricité</h3>
                  <p className="text-3xl font-bold mb-1">{energyData.electricity.current.toLocaleString()} kWh</p>
                  <p className="text-sm text-gray-600">vs {energyData.electricity.last.toLocaleString()} kWh (mois dernier)</p>
                </div>

                <div className={`p-6 rounded-lg border-2 ${
                  energyData.water.percentage < 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <Package className={`h-8 w-8 ${energyData.water.percentage < 0 ? 'text-green-600' : 'text-red-600'}`} />
                    <Badge variant={energyData.water.percentage < 0 ? 'default' : 'destructive'}>
                      {energyData.water.percentage > 0 ? '+' : ''}{energyData.water.percentage.toFixed(1)}%
                    </Badge>
                  </div>
                  <h3 className="font-bold text-lg mb-1">Eau</h3>
                  <p className="text-3xl font-bold mb-1">{energyData.water.current.toLocaleString()} m³</p>
                  <p className="text-sm text-gray-600">vs {energyData.water.last.toLocaleString()} m³ (mois dernier)</p>
                </div>

                <div className="p-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg border-0">
                  <Leaf className="h-8 w-8 mb-3" />
                  <h3 className="font-bold text-lg mb-1">Empreinte Carbone</h3>
                  <p className="text-4xl font-bold mb-1">{energyData.carbon}T</p>
                  <p className="text-sm text-green-100">CO₂ ce mois</p>
                </div>
              </div>

              {/* IA Predictions */}
              <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-6 w-6" />
                    Prédictions IA - Optimisation Énergétique
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                      <p className="font-semibold mb-2">💡 Recommandation : Installer panneaux solaires</p>
                      <p className="text-sm text-purple-100">
                        Économies estimées : 15,000 kWh/mois | ROI : 3.2 ans
                      </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                      <p className="font-semibold mb-2">📊 Prédiction : Pic de consommation</p>
                      <p className="text-sm text-purple-100">
                        Semaine prochaine : +12% | Action : Optimiser planning climatisation
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
