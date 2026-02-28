"use client";

import { useState } from "react";
import Image from "next/image";
import { useLanguage } from "../../contexts/language.context";
import { Button } from "../ui/button";
import { ContactRequestModal } from "../landing/ContactRequestModal";

export const SiteHeader: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/60 backdrop-blur-sm border-b border-gray-200/50 transition-all duration-300 h-auto min-h-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between">
          {/* Logo */}
          <div className="relative w-45 h-15 max-[400px]:w-30">
            <a href={`/${language}`}>
              <Image fill src="/Logo.svg" alt="VisaPlus Logo" />
            </a>
          </div>

          {/* Right-side actions */}
          <div className="flex items-center gap-4 shrink-0 order-1 sm:order-0 sm:ml-0">
            <nav className="hidden md:flex items-center gap-1">
              <a
                href={`/${language}/about-us`}
                className="px-3 py-1.5 rounded-full text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all"
              >
                {t("About Us", "من نحن")}
              </a>
              <a
                href={`/${language}/faqs`}
                className="px-3 py-1.5 rounded-full text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all"
              >
                {t("FAQs", "الأسئلة الشائعة")}
              </a>
            </nav>
            <div className="w-px h-5 bg-gray-200 hidden md:block" />
            <button
              onClick={() => setLanguage(language === "en" ? "ar" : "en")}
              className="text-sm font-bold text-[#00205b] hover:text-blue-600 active:text-black transition-colors duration-300"
            >
              {language === "en" ? "العربية" : "English"}
            </button>
            <Button onClick={() => setIsModalOpen(true)} color="#c02033">
              {t("Contact Us", "اتصل بنا")}
            </Button>
          </div>
        </div>
      </nav>

      {/* Spacer to push content below fixed nav */}
      <div className="min-h-20" />

      <ContactRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
