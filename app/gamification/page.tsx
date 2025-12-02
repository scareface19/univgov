"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Trophy, 
  Star, 
  Award,
  Zap,
  TrendingUp,
  Gift,
  Target,
  Crown,
  Flame
} from "lucide-react";

export default function GamificationPage() {
  const userPoints = {
    total: 2450,
    rank: 12,
    level: 8,
    nextLevel: 3000,
  };

  const badges = [
    {
      id: 1,
      name: "Innovateur",
      nameAr: "المبتكر",
      description: "50+ suggestions approuvées",
      icon: "💡",
      earned: true,
      rarity: "gold",
    },
    {
      id: 2,
      name: "Ambassadeur",
      nameAr: "السفير",
      description: "100+ votes participatifs",
      icon: "🌟",
      earned: true,
      rarity: "silver",
    },
    {
      id: 3,
      name: "Contributeur",
      nameAr: "المساهم",
      description: "50+ posts sur les forums",
      icon: "📚",
      earned: true,
      rarity: "bronze",
    },
    {
      id: 4,
      name: "Volontaire",
      nameAr: "المتطوع",
      description: "10+ activités bénévoles",
      icon: "🤝",
      earned: false,
      rarity: "silver",
    },
    {
      id: 5,
      name: "Génie",
      nameAr: "العبقري",
      description: "Projet primé",
      icon: "🏆",
      earned: false,
      rarity: "platinum",
    },
    {
      id: 6,
      name: "Mentor",
      nameAr: "الموجه",
      description: "Aide 20+ étudiants",
      icon: "👨‍🏫",
      earned: false,
      rarity: "gold",
    },
  ];

  const leaderboard = [
    { rank: 1, name: "Amina Hadj", points: 5240, badge: "🏆", level: 12 },
    { rank: 2, name: "Karim Mansouri", points: 4890, badge: "🥈", level: 11 },
    { rank: 3, name: "Youcef Maamar", points: 4520, badge: "🥉", level: 11 },
    { rank: 4, name: "Sarah Larbi", points: 3980, badge: "⭐", level: 10 },
    { rank: 5, name: "Omar Benali", points: 3650, badge: "⭐", level: 9 },
    { rank: 12, name: "Vous", points: userPoints.total, badge: "🎯", level: userPoints.level, isUser: true },
  ];

  const activities = [
    { type: "suggestion", action: "Suggestion validée", points: 50, date: "Il y a 2h" },
    { type: "vote", action: "Vote participatif", points: 5, date: "Il y a 5h" },
    { type: "forum", action: "Post sur forum", points: 15, date: "Hier" },
    { type: "help", action: "Aide à un étudiant", points: 25, date: "Il y a 2 jours" },
  ];

  const rewards = [
    { id: 1, name: "Café Gratuit", nameAr: "قهوة مجانية", cost: 100, icon: "☕", available: true },
    { id: 2, name: "Repas Restaurant U", nameAr: "وجبة في المطعم", cost: 250, icon: "🍽️", available: true },
    { id: 3, name: "Livre au Choix", nameAr: "كتاب من اختيارك", cost: 500, icon: "📚", available: true },
    { id: 4, name: "T-shirt UniGov", nameAr: "قميص UniGov", cost: 750, icon: "👕", available: true },
    { id: 5, name: "Accès VIP Événements", nameAr: "وصول VIP للفعاليات", cost: 1000, icon: "🎫", available: true },
    { id: 6, name: "Stage Prioritaire", nameAr: "تدريب ذو أولوية", cost: 2000, icon: "🎓", available: false },
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "platinum": return "from-purple-600 to-pink-600";
      case "gold": return "from-yellow-500 to-orange-500";
      case "silver": return "from-gray-400 to-gray-600";
      case "bronze": return "from-orange-700 to-yellow-700";
      default: return "from-blue-500 to-purple-500";
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Gamification & Récompenses
        </h1>
        <p className="text-gray-600 text-lg">
          Gagnez des points et débloquez des récompenses
        </p>
        <p className="text-sm font-cairo text-gray-500 mt-1" dir="rtl">
          اكسب النقاط واحصل على المكافآت
        </p>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="border-0 shadow-lg bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Points Totaux
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{userPoints.total}</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Classement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">#{userPoints.rank}</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Star className="h-4 w-4" />
              Niveau
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{userPoints.level}</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Target className="h-4 w-4" />
              Prochain Niveau
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{userPoints.nextLevel - userPoints.total}</p>
            <p className="text-xs text-green-100">points restants</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card className="mb-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <span className="font-bold">Niveau {userPoints.level}</span>
            </div>
            <span className="text-sm text-gray-600">
              {userPoints.total} / {userPoints.nextLevel}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-4 rounded-full transition-all"
              style={{ width: `${(userPoints.total / userPoints.nextLevel) * 100}%` }}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Badges */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Award className="h-6 w-6" />
                Mes Badges
              </CardTitle>
              <CardDescription>Collection de badges débloqués</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {badges.map((badge) => (
                  <div
                    key={badge.id}
                    className={`p-4 rounded-lg border-2 ${
                      badge.earned
                        ? `bg-gradient-to-r ${getRarityColor(badge.rarity)} text-white shadow-lg`
                        : 'bg-gray-100 border-gray-300 opacity-50'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-2">{badge.icon}</div>
                      <h3 className="font-bold mb-1">{badge.name}</h3>
                      <p className="text-xs font-cairo mb-2" dir="rtl">{badge.nameAr}</p>
                      <p className={`text-xs ${badge.earned ? 'text-white/80' : 'text-gray-600'}`}>
                        {badge.description}
                      </p>
                      {badge.earned && (
                        <Badge className="mt-2 bg-white/20">{badge.rarity.toUpperCase()}</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Activité Récente</CardTitle>
              <CardDescription>Vos dernières actions récompensées</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-white">
                    <div className="flex-1">
                      <p className="font-semibold">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.date}</p>
                    </div>
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500">
                      +{activity.points} pts
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Leaderboard & Rewards */}
        <div className="space-y-6">
          {/* Leaderboard */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                Classement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {leaderboard.map((user) => (
                  <div
                    key={user.rank}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      user.isUser
                        ? 'bg-gradient-to-r from-blue-100 to-purple-100 border-2 border-blue-300'
                        : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        user.rank === 1 ? 'bg-yellow-500 text-white' :
                        user.rank === 2 ? 'bg-gray-400 text-white' :
                        user.rank === 3 ? 'bg-orange-700 text-white' :
                        'bg-gray-200 text-gray-700'
                      }`}>
                        {user.rank}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{user.name}</p>
                        <p className="text-xs text-gray-600">Niveau {user.level}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">{user.points}</p>
                      <p className="text-xs text-gray-500">pts</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Rewards Shop */}
          <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Boutique de Récompenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {rewards.slice(0, 3).map((reward) => (
                  <div
                    key={reward.id}
                    className="bg-white/10 backdrop-blur-sm p-3 rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{reward.icon}</span>
                        <div>
                          <p className="font-semibold text-sm">{reward.name}</p>
                          <p className="text-xs text-purple-100">{reward.cost} points</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="secondary"
                        disabled={userPoints.total < reward.cost}
                      >
                        Échanger
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="secondary" className="w-full">
                  Voir Toutes les Récompenses
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* How to Earn Points */}
      <Card className="mt-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Comment Gagner des Points</CardTitle>
          <CardDescription>Participez et soyez récompensé</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { action: "Proposer une suggestion", points: 10, icon: "💡" },
              { action: "Voter sur une idée", points: 5, icon: "🗳️" },
              { action: "Publier sur le forum", points: 15, icon: "📝" },
              { action: "Activité bénévole", points: 50, icon: "🤝" },
              { action: "Terminer un projet", points: 100, icon: "🎯" },
              { action: "Aider un étudiant", points: 25, icon: "👥" },
            ].map((item, index) => (
              <div
                key={index}
                className="p-4 border-2 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 hover:shadow-lg transition-all"
              >
                <div className="text-3xl mb-2">{item.icon}</div>
                <p className="font-semibold mb-1">{item.action}</p>
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500">
                  +{item.points} points
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
