"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Vote, 
  CheckCircle, 
  Lock,
  Calendar,
  Users,
  BarChart3,
  Shield,
  TrendingUp,
  Award
} from "lucide-react";

export default function VotingPage() {
  const activeVotes = [
    {
      id: 1,
      title: "Adoption du nouveau règlement des activités extra-scolaires",
      titleAr: "اعتماد النظام الجديد للأنشطة اللامنهجية",
      description: "Vote sur l'adoption du nouveau règlement concernant les clubs et associations étudiantes",
      category: "Gouvernance",
      deadline: "2025-01-25",
      totalVotes: 468,
      quorum: 300,
      quorumReached: true,
      options: [
        { id: 1, label: "Pour", labelAr: "مع", votes: 312, percentage: 67 },
        { id: 2, label: "Contre", labelAr: "ضد", votes: 109, percentage: 23 },
        { id: 3, label: "Abstention", labelAr: "امتناع", votes: 47, percentage: 10 },
      ],
      hasVoted: false,
      isActive: true,
    },
    {
      id: 2,
      title: "Allocation du budget des clubs étudiants",
      titleAr: "تخصيص ميزانية الأندية الطلابية",
      description: "Choisissez la répartition budgétaire entre activités sportives et culturelles",
      category: "Budget",
      deadline: "2025-02-01",
      totalVotes: 523,
      quorum: 250,
      quorumReached: true,
      options: [
        { id: 1, label: "60% Sports / 40% Culture", labelAr: "60% رياضة / 40% ثقافة", votes: 178, percentage: 34 },
        { id: 2, label: "50% Sports / 50% Culture", labelAr: "50% رياضة / 50% ثقافة", votes: 268, percentage: 51 },
        { id: 3, label: "40% Sports / 60% Culture", labelAr: "40% رياضة / 60% ثقافة", votes: 77, percentage: 15 },
      ],
      hasVoted: true,
      userVote: 2,
      isActive: true,
    },
  ];

  const pastVotes = [
    {
      id: 3,
      title: "Horaires d'ouverture de la bibliothèque",
      result: "Adopté à 78%",
      date: "2025-01-10",
      impact: "Bibliothèque ouverte jusqu'à 22h en période d'examens",
    },
    {
      id: 4,
      title: "Programme de mentorat étudiant",
      result: "Adopté à 85%",
      date: "2024-12-15",
      impact: "Programme lancé avec 50 mentors",
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Vote Électronique (E-Voting)
        </h1>
        <p className="text-gray-600 text-lg">Participez aux décisions universitaires de manière sécurisée</p>
        <p className="text-sm font-cairo text-gray-500 mt-1" dir="rtl">
          شارك في القرارات الجامعية بشكل آمن
        </p>
      </div>

      {/* Security Banner */}
      <Card className="mb-6 border-0 shadow-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-xl">
              <Shield className="h-10 w-10" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-1">Système Sécurisé par Blockchain</h3>
              <p className="text-green-100 text-sm">
                Vos votes sont anonymes, chiffrés et infalsifiables grâce à la technologie blockchain
              </p>
              <p className="text-xs font-cairo mt-1" dir="rtl">
                أصواتك مجهولة ومشفرة وغير قابلة للتزوير
              </p>
            </div>
            <Lock className="h-12 w-12 opacity-50" />
          </div>
        </CardContent>
      </Card>

      {/* Active Votes */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Votes en Cours</h2>
        <div className="space-y-4">
          {activeVotes.map((vote) => (
            <Card key={vote.id} className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
              <div className={`h-2 ${vote.quorumReached ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-orange-500 to-red-500'}`}></div>
              
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-2xl font-bold">{vote.title}</h3>
                      {vote.hasVoted && (
                        <Badge className="bg-green-500">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Voté
                        </Badge>
                      )}
                    </div>
                    <p className="text-lg font-cairo text-gray-600 mb-3" dir="rtl">{vote.titleAr}</p>
                    <p className="text-gray-700 mb-4">{vote.description}</p>
                    
                    <div className="flex gap-6 text-sm">
                      <span className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        Date limite: <span className="font-semibold">{vote.deadline}</span>
                      </span>
                      <span className="flex items-center gap-2 text-gray-600">
                        <Users className="h-4 w-4" />
                        <span className="font-semibold">{vote.totalVotes}</span> votes
                      </span>
                      <Badge className={vote.quorumReached ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}>
                        Quorum {vote.quorumReached ? 'Atteint' : 'Non atteint'} ({vote.quorum} requis)
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  {vote.options.map((option) => (
                    <div key={option.id} className="relative">
                      <button
                        disabled={vote.hasVoted}
                        className={`w-full p-4 rounded-lg border-2 transition-all ${
                          vote.hasVoted && vote.userVote === option.id
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-blue-600'
                            : vote.hasVoted
                            ? 'bg-gray-50 border-gray-200 cursor-not-allowed'
                            : 'bg-white border-gray-300 hover:border-blue-500 hover:shadow-lg'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              vote.hasVoted && vote.userVote === option.id
                                ? 'border-white bg-white'
                                : 'border-gray-400'
                            }`}>
                              {vote.hasVoted && vote.userVote === option.id && (
                                <CheckCircle className="h-4 w-4 text-blue-600" />
                              )}
                            </div>
                            <div className="text-left">
                              <p className="font-bold">{option.label}</p>
                              <p className="text-sm font-cairo" dir="rtl">{option.labelAr}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold">{option.percentage}%</p>
                            <p className="text-xs">{option.votes} votes</p>
                          </div>
                        </div>
                        {/* Progress bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div
                            className={`h-2 rounded-full ${
                              vote.hasVoted && vote.userVote === option.id
                                ? 'bg-white'
                                : 'bg-gradient-to-r from-blue-500 to-purple-500'
                            }`}
                            style={{ width: `${option.percentage}%` }}
                          />
                        </div>
                      </button>
                    </div>
                  ))}
                </div>

                {!vote.hasVoted && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                    <p className="text-sm text-blue-900 text-center font-semibold">
                      ⚡ Sélectionnez une option ci-dessus pour voter de manière sécurisée
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Past Votes */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Votes Passés & Impacts</h2>
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="space-y-4">
              {pastVotes.map((vote) => (
                <div key={vote.id} className="flex items-start gap-4 p-4 border rounded-lg bg-gradient-to-r from-green-50 to-emerald-50">
                  <div className="bg-green-500 p-3 rounded-lg">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">{vote.title}</h3>
                    <div className="flex gap-4 text-sm">
                      <Badge className="bg-green-500">{vote.result}</Badge>
                      <span className="text-gray-600">• {vote.date}</span>
                    </div>
                    <div className="mt-2 p-3 bg-white rounded-lg border-2 border-green-200">
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold text-green-700">Impact réel:</span> {vote.impact}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
