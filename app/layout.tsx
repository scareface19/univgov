import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/language-context";
import { NoopServiceWorker } from "@/components/noop-service-worker";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

const cairo = Cairo({ 
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: "UniGov - Plateforme Universitaire Intelligente",
  description: "Système de gestion universitaire moderne et intelligent",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" suppressHydrationWarning>
      <body className={`${inter.variable} ${cairo.variable} font-sans`} suppressHydrationWarning>
        <NoopServiceWorker />
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
