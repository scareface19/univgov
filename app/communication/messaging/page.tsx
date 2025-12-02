"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, Search, Users, Phone, Video, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MessagingPage() {
  const [selectedConv, setSelectedConv] = useState(1);
  const [newMessage, setNewMessage] = useState("");

  const conversations = [
    {
      id: 1,
      participant: "Dr. Karim Mansouri",
      participantAr: "د. كريم منصوري",
      role: "Professeur",
      lastMessage: "Réunion demain à 10h pour discuter du projet",
      time: "Il y a 5 min",
      unread: 2,
      avatar: "KM",
      online: true,
    },
    {
      id: 2,
      participant: "Groupe Informatique S5",
      participantAr: "مجموعة المعلوماتية S5",
      role: "Groupe",
      lastMessage: "Les slides du cours sont disponibles",
      time: "Il y a 15 min",
      unread: 0,
      avatar: "GI",
      online: true,
    },
    {
      id: 3,
      participant: "Administration - Scolarité",
      participantAr: "الإدارة - الدراسة",
      role: "Service",
      lastMessage: "Votre demande a été traitée",
      time: "Il y a 1h",
      unread: 1,
      avatar: "AS",
      online: false,
    },
    {
      id: 4,
      participant: "Amina Hadj",
      participantAr: "أمينة حاج",
      role: "Étudiante",
      lastMessage: "Merci pour ton aide !",
      time: "Il y a 3h",
      unread: 0,
      avatar: "AH",
      online: true,
    },
  ];

  const messages = [
    { id: 1, sender: "me", content: "Bonjour, pouvez-vous m'envoyer le planning ?", time: "10:30" },
    { id: 2, sender: "them", content: "Bien sûr ! Je vous l'envoie dans quelques minutes.", time: "10:32" },
    { id: 3, sender: "them", content: "Voici le planning pour cette semaine", time: "10:35" },
    { id: 4, sender: "me", content: "Parfait, merci beaucoup !", time: "10:36" },
    { id: 5, sender: "them", content: "De rien. N'hésitez pas si vous avez des questions.", time: "10:37" },
  ];

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Messagerie Sécurisée
        </h1>
        <p className="text-gray-600 text-lg">Chat temps réel entre tous les acteurs universitaires</p>
        <p className="text-sm font-cairo text-gray-500 mt-1" dir="rtl">
          دردشة آمنة في الوقت الفعلي
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" style={{ height: 'calc(100vh - 250px)' }}>
        {/* Conversations List */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden flex flex-col">
          <CardHeader className="border-b">
            <CardTitle className="text-lg">Conversations</CardTitle>
            <div className="mt-3 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Rechercher..." className="pl-10" />
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-0">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConv(conv.id)}
                className={cn(
                  "w-full p-4 border-b hover:bg-blue-50 transition-all text-left",
                  selectedConv === conv.id && "bg-blue-100 border-l-4 border-l-blue-600"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                      {conv.avatar}
                    </div>
                    {conv.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{conv.participant}</p>
                        <p className="text-[10px] font-cairo text-gray-500 truncate" dir="rtl">
                          {conv.participantAr}
                        </p>
                      </div>
                      {conv.unread > 0 && (
                        <Badge className="ml-2 bg-red-500 text-white h-5 min-w-5 flex items-center justify-center">
                          {conv.unread}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 truncate">{conv.lastMessage}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{conv.time}</p>
                  </div>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2 border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden flex flex-col">
          {/* Chat Header */}
          <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                  {conversations[selectedConv - 1]?.avatar}
                </div>
                <div>
                  <p className="font-bold">{conversations[selectedConv - 1]?.participant}</p>
                  <p className="text-xs font-cairo text-gray-600" dir="rtl">
                    {conversations[selectedConv - 1]?.participantAr}
                  </p>
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    {conversations[selectedConv - 1]?.online && (
                      <>
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        En ligne
                      </>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Video className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          {/* Messages */}
          <CardContent className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-br from-gray-50 to-blue-50/30">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex",
                  msg.sender === "me" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-md",
                    msg.sender === "me"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-sm"
                      : "bg-white border border-gray-200 rounded-bl-sm"
                  )}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p className={cn(
                    "text-xs mt-1",
                    msg.sender === "me" ? "text-blue-100" : "text-gray-500"
                  )}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>

          {/* Input Area */}
          <div className="p-4 border-t bg-white">
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Input
                placeholder="Tapez votre message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && setNewMessage("")}
                className="flex-1"
              />
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 px-6">
                <Send className="h-4 w-4 mr-2" />
                Envoyer
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Messages chiffrés de bout en bout 🔒
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
