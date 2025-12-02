"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  UserPlus, 
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  Shield,
  Edit,
  Trash2,
  MoreVertical,
  GraduationCap,
  Briefcase,
  UserCheck
} from "lucide-react";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const mockUsers = [
    {
      id: 1,
      firstName: "Ahmed",
      lastName: "Benali",
      email: "ahmed.benali@university.dz",
      role: "student",
      digitalId: "DID-2025-STU001",
      department: "Informatique",
      status: "active",
      lastActive: "Il y a 5 min"
    },
    {
      id: 2,
      firstName: "Amina",
      lastName: "Hadj",
      email: "amina.hadj@university.dz",
      role: "professor",
      digitalId: "DID-2025-PROF001",
      department: "Mathématiques",
      status: "active",
      lastActive: "Il y a 1h"
    },
    {
      id: 3,
      firstName: "Karim",
      lastName: "Mansouri",
      email: "karim.mansouri@university.dz",
      role: "professor",
      digitalId: "DID-2025-PROF002",
      department: "Informatique",
      status: "active",
      lastActive: "Il y a 30 min"
    },
    {
      id: 4,
      firstName: "Sarah",
      lastName: "Larbi",
      email: "sarah.larbi@university.dz",
      role: "staff",
      digitalId: "DID-2025-STAFF001",
      department: "Administration",
      status: "active",
      lastActive: "Il y a 2h"
    },
    {
      id: 5,
      firstName: "Youcef",
      lastName: "Maamar",
      email: "youcef.maamar@university.dz",
      role: "student",
      digitalId: "DID-2025-STU002",
      department: "Physique",
      status: "inactive",
      lastActive: "Il y a 3 jours"
    },
  ];

  const stats = [
    { label: "Total Utilisateurs", value: mockUsers.length, icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Étudiants", value: mockUsers.filter(u => u.role === 'student').length, icon: GraduationCap, color: "text-purple-600", bg: "bg-purple-100" },
    { label: "Professeurs", value: mockUsers.filter(u => u.role === 'professor').length, icon: UserCheck, color: "text-green-600", bg: "bg-green-100" },
    { label: "Personnel", value: mockUsers.filter(u => u.role === 'staff').length, icon: Briefcase, color: "text-orange-600", bg: "bg-orange-100" },
  ];

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'student': return <GraduationCap className="h-4 w-4" />;
      case 'professor': return <UserCheck className="h-4 w-4" />;
      case 'staff': return <Briefcase className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'student': return 'Étudiant';
      case 'professor': return 'Professeur';
      case 'staff': return 'Personnel';
      case 'admin': return 'Admin';
      default: return role;
    }
  };

  const getRoleLabelAr = (role: string) => {
    switch (role) {
      case 'student': return 'طالب';
      case 'professor': return 'أستاذ';
      case 'staff': return 'موظف';
      case 'admin': return 'مدير';
      default: return role;
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Gestion des Utilisateurs
        </h1>
        <p className="text-gray-600 text-lg">
          Gérez tous les comptes de la plateforme
        </p>
        <p className="text-sm font-cairo text-gray-500 mt-1" dir="rtl">
          إدارة جميع حسابات المنصة
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">{stat.label}</CardTitle>
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filters */}
      <Card className="mb-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher par nom, email, ou Digital ID..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filtrer
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Exporter
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 gap-2">
              <UserPlus className="h-4 w-4" />
              Nouvel Utilisateur
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="bg-white/80 backdrop-blur-sm shadow-md">
          <TabsTrigger value="all">Tous ({mockUsers.length})</TabsTrigger>
          <TabsTrigger value="students">
            Étudiants ({mockUsers.filter(u => u.role === 'student').length})
          </TabsTrigger>
          <TabsTrigger value="professors">
            Professeurs ({mockUsers.filter(u => u.role === 'professor').length})
          </TabsTrigger>
          <TabsTrigger value="staff">
            Personnel ({mockUsers.filter(u => u.role === 'staff').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-0">
              <div className="divide-y">
                {mockUsers.map((user) => (
                  <div
                    key={user.id}
                    className="p-4 hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                          {user.firstName[0]}{user.lastName[0]}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-lg">
                              {user.firstName} {user.lastName}
                            </h3>
                            <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                              {user.status === 'active' ? 'Actif' : 'Inactif'}
                            </Badge>
                            <Badge variant="outline" className="gap-1">
                              {getRoleIcon(user.role)}
                              {getRoleLabel(user.role)}
                            </Badge>
                          </div>
                          <div className="flex gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {user.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Shield className="h-3 w-3" />
                              {user.digitalId}
                            </span>
                            <span>{user.department}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{user.lastActive}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Modifier
                        </Button>
                        <Button variant="outline" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <GraduationCap className="h-6 w-6" />
                Liste des Étudiants
              </CardTitle>
              <CardDescription>
                {mockUsers.filter(u => u.role === 'student').length} étudiants enregistrés
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockUsers.filter(u => u.role === 'student').map((user) => (
                  <div key={user.id} className="p-4 border rounded-lg bg-white hover:shadow-lg transition-all">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold">{user.firstName} {user.lastName}</h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <p className="text-xs text-gray-500">{user.digitalId}</p>
                      </div>
                      <Button size="sm">Voir Profil</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="professors">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <UserCheck className="h-6 w-6" />
                Liste des Professeurs
              </CardTitle>
              <CardDescription>
                {mockUsers.filter(u => u.role === 'professor').length} professeurs enregistrés
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockUsers.filter(u => u.role === 'professor').map((user) => (
                  <div key={user.id} className="p-4 border rounded-lg bg-white hover:shadow-lg transition-all">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold">Dr. {user.firstName} {user.lastName}</h3>
                        <p className="text-sm text-gray-600">{user.department}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <Button size="sm">Voir Profil</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staff">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Briefcase className="h-6 w-6" />
                Liste du Personnel
              </CardTitle>
              <CardDescription>
                {mockUsers.filter(u => u.role === 'staff').length} membres du personnel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockUsers.filter(u => u.role === 'staff').map((user) => (
                  <div key={user.id} className="p-4 border rounded-lg bg-white hover:shadow-lg transition-all">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold">{user.firstName} {user.lastName}</h3>
                        <p className="text-sm text-gray-600">{user.department}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <Button size="sm">Voir Profil</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
