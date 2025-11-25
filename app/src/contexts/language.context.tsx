"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

type Language = "en" | "ar";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (en: string, ar: string) => string;
  dir: "ltr" | "rtl";
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children, initialLang = "en" }: { children: ReactNode; initialLang?: Language }) {
  const [language, setLanguage] = useState<Language>(initialLang);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Sync state with initialLang if it changes (e.g. navigation)
    setLanguage(initialLang);
  }, [initialLang]);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
    
    // Use Next.js router for client-side navigation
    const segments = pathname.split('/');
    // segments[0] is empty, segments[1] is locale
    if (segments[1] === 'en' || segments[1] === 'ar') {
      segments[1] = lang;
      const newPath = segments.join('/');
      router.push(newPath);
    }
  };

  // Helper to return correct string based on language
  const t = (en: string, ar: string) => {
    return language === "ar" ? ar : en;
  };

  const dir = language === "ar" ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
