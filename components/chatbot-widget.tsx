"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  Send, 
  X, 
  Minimize2,
  Globe,
  Bot,
  User
} from "lucide-react";

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<'fr' | 'ar' | 'en'>('fr');
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<{role: 'user' | 'bot', content: string, contentAr?: string}>>([
    {
      role: 'bot',
      content: 'Bonjour ! Je suis votre assistant UniGov. Comment puis-je vous aider aujourd\'hui ?',
      contentAr: 'مرحبا! أنا مساعدك UniGov. كيف يمكنني مساعدتك اليوم؟'
    }
  ]);

  const handleSend = async () => {
    if (!message.trim()) return;

    // Add user message
    const newMessages = [...messages, { role: 'user' as const, content: message }];
    setMessages(newMessages);
    const userMessage = message;
    setMessage("");

    // Call chatbot API
    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, language }),
      });

      const data = await response.json();
      
      const botResponse = {
        role: 'bot' as const,
        content: data.response,
        contentAr: data.response
      };
      
      setMessages([...newMessages, botResponse]);
    } catch (error) {
      const errorResponse = {
        role: 'bot' as const,
        content: 'Désolé, une erreur s\'est produite. Veuillez réessayer.',
        contentAr: 'عذرا، حدث خطأ. يرجى المحاولة مرة أخرى.'
      };
      setMessages([...newMessages, errorResponse]);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-2xl hover:shadow-3xl transition-all flex items-center justify-center text-white hover:scale-110 z-50"
      >
        <MessageCircle className="h-8 w-8" />
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold animate-pulse">
          1
        </span>
      </button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[600px] shadow-2xl border-0 z-50 flex flex-col bg-white">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Bot className="h-6 w-6" />
            <div>
              <CardTitle className="text-lg">Assistant UniGov</CardTitle>
              <p className="text-xs text-blue-100">En ligne • Multi-langue</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setLanguage(language === 'fr' ? 'ar' : language === 'ar' ? 'en' : 'fr')}
              className="p-1 hover:bg-white/20 rounded"
            >
              <Globe className="h-4 w-4" />
            </button>
            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 rounded">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {/* Language indicator */}
        <div className="flex gap-2 mt-2">
          <Badge variant={language === 'fr' ? 'secondary' : 'outline'} className="text-xs cursor-pointer" onClick={() => setLanguage('fr')}>
            FR
          </Badge>
          <Badge variant={language === 'ar' ? 'secondary' : 'outline'} className="text-xs cursor-pointer" onClick={() => setLanguage('ar')}>
            العربية
          </Badge>
          <Badge variant={language === 'en' ? 'secondary' : 'outline'} className="text-xs cursor-pointer" onClick={() => setLanguage('en')}>
            EN
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'bot' && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                <Bot className="h-5 w-5 text-white" />
              </div>
            )}
            <div
              className={`max-w-[75%] p-3 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm">
                {language === 'ar' && msg.contentAr ? msg.contentAr : msg.content}
              </p>
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                <User className="h-5 w-5 text-gray-600" />
              </div>
            )}
          </div>
        ))}
      </CardContent>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={language === 'ar' ? 'اكتب رسالتك...' : language === 'en' ? 'Type your message...' : 'Tapez votre message...'}
            className="flex-1"
            dir={language === 'ar' ? 'rtl' : 'ltr'}
          />
          <Button
            onClick={handleSend}
            className="bg-gradient-to-r from-blue-600 to-purple-600"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          {language === 'ar' ? 'مدعوم بالذكاء الاصطناعي' : 'Powered by AI'}
        </p>
      </div>
    </Card>
  );
}
