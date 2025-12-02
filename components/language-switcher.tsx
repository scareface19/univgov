"use client";

import { useLanguage } from "@/lib/language-context";
import { Button } from "./ui/button";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2 p-2 bg-white/50 rounded-lg">
      <Globe className="h-4 w-4 text-gray-600" />
      <div className="flex gap-1">
        <button
          onClick={() => setLanguage('fr')}
          className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
            language === 'fr'
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          FR
        </button>
        <button
          onClick={() => setLanguage('ar')}
          className={`px-3 py-1 rounded text-xs font-semibold font-cairo transition-all ${
            language === 'ar'
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          عربي
        </button>
      </div>
    </div>
  );
}
