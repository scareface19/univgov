"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Lock, 
  Bell, 
  Globe, 
  Shield,
  Palette,
  Database,
  Mail,
  Smartphone,
  Key,
  Download,
  Upload,
  CheckCircle
} from "lucide-react";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    announcements: true,
    messages: true,
    grades: true,
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Paramètres
        </h1>
        <p className="text-gray-600 text-lg">
          Gérez vos préférences et paramètres de compte
        </p>
        <p className="text-sm font-cairo text-gray-500 mt-1" dir="rtl">
          إدارة تفضيلاتك وإعدادات الحساب
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-white/80 backdrop-blur-sm shadow-md">
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="security">
            <Lock className="h-4 w-4 mr-2" />
            Sécurité
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="preferences">
            <Palette className="h-4 w-4 mr-2" />
            Préférences
          </TabsTrigger>
          <TabsTrigger value="data">
            <Database className="h-4 w-4 mr-2" />
            Données
          </TabsTrigger>
        </TabsList>

        {/* Profile */}
        <TabsContent value="profile" className="space-y-4">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Informations Personnelles</CardTitle>
              <CardDescription>Modifiez vos informations de profil</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-6 mb-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                  AB
                </div>
                <div>
                  <Button variant="outline">Changer la photo</Button>
                  <p className="text-sm text-gray-500 mt-2">JPG, PNG ou GIF. Max 2MB</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input id="firstName" defaultValue="Ahmed" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input id="lastName" defaultValue="Benali" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="ahmed.benali@university.dz" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input id="phone" type="tel" defaultValue="+213 XXX XXX XXX" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Biographie</Label>
                <textarea
                  id="bio"
                  className="w-full p-3 border rounded-lg resize-none"
                  rows={4}
                  placeholder="Parlez-nous de vous..."
                />
              </div>

              <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                <CheckCircle className="h-4 w-4 mr-2" />
                Enregistrer les Modifications
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-4">
          {/* Change Password */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Lock className="h-6 w-6" />
                Changer le Mot de Passe
              </CardTitle>
              <CardDescription>Mettez à jour votre mot de passe régulièrement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <Input id="confirmPassword" type="password" />
              </div>
              <Button className="bg-gradient-to-r from-green-500 to-emerald-500">
                Mettre à Jour le Mot de Passe
              </Button>
            </CardContent>
          </Card>

          {/* Two-Factor Authentication */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Shield className="h-6 w-6" />
                Authentification à Deux Facteurs (2FA)
              </CardTitle>
              <CardDescription>Renforcez la sécurité de votre compte</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="font-semibold">SMS</p>
                    <p className="text-sm text-gray-600">Recevoir un code par SMS</p>
                  </div>
                </div>
                <Button variant="outline">Activer</Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Mail className="h-6 w-6 text-purple-600" />
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-sm text-gray-600">Recevoir un code par email</p>
                  </div>
                </div>
                <Badge className="bg-green-500">Actif</Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Key className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="font-semibold">Application Authenticator</p>
                    <p className="text-sm text-gray-600">Google Authenticator, Authy, etc.</p>
                  </div>
                </div>
                <Button variant="outline">Configurer</Button>
              </div>
            </CardContent>
          </Card>

          {/* Active Sessions */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Sessions Actives</CardTitle>
              <CardDescription>Gérez vos connexions actives</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-semibold">Windows PC - Chrome</p>
                  <p className="text-sm text-gray-600">IP: 192.168.1.1 • Alger, Algeria</p>
                  <p className="text-xs text-gray-500">Dernière activité: Maintenant</p>
                </div>
                <Badge className="bg-green-500">Actuel</Badge>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-semibold">iPhone - Safari</p>
                  <p className="text-sm text-gray-600">IP: 192.168.1.5 • Alger, Algeria</p>
                  <p className="text-xs text-gray-500">Dernière activité: Il y a 2h</p>
                </div>
                <Button variant="outline" size="sm">Déconnecter</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-4">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Bell className="h-6 w-6" />
                Préférences de Notification
              </CardTitle>
              <CardDescription>Choisissez comment vous voulez être notifié</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Email Notifications */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Canaux de Notification</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-sm text-gray-600">Notifications par email</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.email}
                      onChange={(e) => setNotifications({...notifications, email: e.target.checked})}
                      className="w-5 h-5"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">SMS</p>
                        <p className="text-sm text-gray-600">Notifications par SMS</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.sms}
                      onChange={(e) => setNotifications({...notifications, sms: e.target.checked})}
                      className="w-5 h-5"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="font-medium">Push</p>
                        <p className="text-sm text-gray-600">Notifications push sur appareil</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.push}
                      onChange={(e) => setNotifications({...notifications, push: e.target.checked})}
                      className="w-5 h-5"
                    />
                  </div>
                </div>
              </div>

              {/* Type of Notifications */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Types de Notifications</h3>
                <div className="space-y-3">
                  {[
                    { key: 'announcements', label: 'Annonces', desc: 'Nouvelles annonces importantes' },
                    { key: 'messages', label: 'Messages', desc: 'Nouveaux messages et discussions' },
                    { key: 'grades', label: 'Notes', desc: 'Résultats et évaluations' },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{item.label}</p>
                        <p className="text-sm text-gray-600">{item.desc}</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications[item.key as keyof typeof notifications]}
                        onChange={(e) => setNotifications({
                          ...notifications,
                          [item.key]: e.target.checked
                        })}
                        className="w-5 h-5"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                Enregistrer les Préférences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences */}
        <TabsContent value="preferences" className="space-y-4">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Globe className="h-6 w-6" />
                Langue et Région
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">Langue de l'Interface</Label>
                <select
                  id="language"
                  className="w-full p-3 border rounded-lg"
                >
                  <option value="fr">Français</option>
                  <option value="ar">العربية</option>
                  <option value="en">English</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Fuseau Horaire</Label>
                <select
                  id="timezone"
                  className="w-full p-3 border rounded-lg"
                >
                  <option value="africa/algiers">Alger (GMT+1)</option>
                  <option value="europe/paris">Paris (GMT+1)</option>
                  <option value="africa/cairo">Le Caire (GMT+2)</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateFormat">Format de Date</Label>
                <select
                  id="dateFormat"
                  className="w-full p-3 border rounded-lg"
                >
                  <option value="dd/mm/yyyy">JJ/MM/AAAA</option>
                  <option value="mm/dd/yyyy">MM/JJ/AAAA</option>
                  <option value="yyyy-mm-dd">AAAA-MM-JJ</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Palette className="h-6 w-6" />
                Apparence
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Thème</Label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 border-2 border-blue-500 rounded-lg cursor-pointer bg-white">
                    <div className="w-full h-20 bg-gradient-to-r from-blue-50 to-purple-50 rounded mb-2"></div>
                    <p className="text-sm font-medium text-center">Clair</p>
                  </div>
                  <div className="p-4 border-2 rounded-lg cursor-pointer hover:border-gray-400">
                    <div className="w-full h-20 bg-gray-800 rounded mb-2"></div>
                    <p className="text-sm font-medium text-center">Sombre</p>
                  </div>
                  <div className="p-4 border-2 rounded-lg cursor-pointer hover:border-gray-400">
                    <div className="w-full h-20 bg-gradient-to-r from-blue-100 to-gray-800 rounded mb-2"></div>
                    <p className="text-sm font-medium text-center">Auto</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data */}
        <TabsContent value="data" className="space-y-4">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Database className="h-6 w-6" />
                Exportation des Données
              </CardTitle>
              <CardDescription>Téléchargez une copie de vos données</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Télécharger mes Données (JSON)
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Télécharger mes Documents
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Télécharger mon Historique
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-red-50 border-2 border-red-200">
            <CardHeader>
              <CardTitle className="text-2xl text-red-700">Zone Dangereuse</CardTitle>
              <CardDescription>Actions irréversibles sur votre compte</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border-2 border-red-200">
                <div>
                  <p className="font-semibold text-red-700">Supprimer le Compte</p>
                  <p className="text-sm text-gray-600">Cette action est irréversible</p>
                </div>
                <Button variant="destructive">Supprimer</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
