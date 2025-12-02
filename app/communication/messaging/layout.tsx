"use client";

import { SessionProvider } from "next-auth/react";
import { DashboardNavV2 } from "@/components/dashboard-nav-v2";
import { ChatbotWidget } from "@/components/chatbot-widget";

export default function MessagingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <DashboardNavV2 />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
        <ChatbotWidget />
      </div>
    </SessionProvider>
  );
}
