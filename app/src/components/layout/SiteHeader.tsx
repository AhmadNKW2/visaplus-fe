"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useLanguage } from "../../contexts/language.context";
import { Button } from "../ui/button";
import { ContactRequestModal } from "../landing/ContactRequestModal";
import { CurrencySelect } from "./CurrencySelect";

type SiteHeaderProps = {
  stickySearch?: ReactNode;
  showStickySearch?: boolean;
  onContactClick?: () => void;
  logoHref?: string;
  manageContactModal?: boolean;
};

export const SiteHeader: React.FC<SiteHeaderProps> = ({
  stickySearch,
  showStickySearch = false,
  onContactClick,
  logoHref,
  manageContactModal = true,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const homeHref = logoHref ?? `/${language}`;
  const aboutHref = `/${language}/about-us`;
  const faqsHref = `/${language}/faqs`;

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileMenuOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [language]);

  const handleContact = () => {
    setIsMobileMenuOpen(false);
    if (onContactClick) {
      onContactClick();
      return;
    }
    if (manageContactModal) {
      setIsModalOpen(true);
    }
  };

  const navLinks = [
    { href: aboutHref, label: t("About Us", "من نحن") },
    { href: faqsHref, label: t("FAQs", "الأسئلة الشائعة") },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200/50 bg-white/60 backdrop-blur-sm transition-all duration-300">
        <div
          className={`mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-2 gap-y-3 px-3 py-3 sm:px-6 sm:py-4 ${
            showStickySearch ? "sm:gap-4" : ""
          }`}
        >
          {/* Logo */}
          <div className="relative h-10 w-28 shrink-0 max-[360px]:w-24 sm:h-15 sm:w-45">
            <a href={homeHref} aria-label="VisaPlus Home">
              <Image fill src="/Logo.svg" alt="VisaPlus Logo" priority />
            </a>
          </div>

          {/* Sticky search (landing) */}
          {stickySearch && (
            <div
              className={`order-3 w-full transition-all duration-500 ease-in-out sm:order-0 sm:w-auto sm:max-w-md sm:flex-1 ${
                showStickySearch
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none h-0 -translate-y-8 overflow-hidden opacity-0 sm:h-auto"
              }`}
            >
              {stickySearch}
            </div>
          )}

          {/* Desktop nav + actions */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-3 md:gap-4">
            <div className="hidden items-center gap-1 md:flex">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="rounded-full px-3 py-1.5 text-sm font-medium text-gray-600 transition-all hover:bg-blue-50 hover:text-blue-600"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="hidden h-5 w-px bg-gray-200 md:block" />

            <CurrencySelect />

            <button
              type="button"
              onClick={() => setLanguage(language === "en" ? "ar" : "en")}
              className="hidden shrink-0 text-sm font-bold text-[#00205b] transition-colors duration-300 hover:text-blue-600 active:text-black md:inline"
            >
              {language === "en" ? "العربية" : "English"}
            </button>

            <Button
              onClick={handleContact}
              color="#c02033"
              className="h-9! px-3! text-sm! md:h-11! md:px-5! md:text-base!"
            >
              <span className="md:hidden">{t("Call Us", "اتصل بنا")}</span>
              <span className="hidden md:inline">{t("Contact Us", "اتصل بنا")}</span>
            </Button>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#00205b]/10 bg-white/80 text-[#00205b] shadow-sm transition-colors hover:bg-[#00205b]/5 md:hidden"
              aria-label={
                isMobileMenuOpen
                  ? t("Close menu", "إغلاق القائمة")
                  : t("Open menu", "فتح القائمة")
              }
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-site-menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu panel */}
        <div
          id="mobile-site-menu"
          className={`overflow-hidden border-t border-gray-200/60 bg-white/95 backdrop-blur-md transition-all duration-300 ease-out md:hidden ${
            isMobileMenuOpen
              ? "max-h-80 opacity-100"
              : "pointer-events-none max-h-0 opacity-0"
          }`}
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-3 py-3 sm:px-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-base font-semibold text-[#00205b] transition-colors hover:bg-blue-50 hover:text-blue-600"
              >
                {link.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => setLanguage(language === "en" ? "ar" : "en")}
              className="rounded-xl px-4 py-3 text-start text-base font-semibold text-[#00205b] transition-colors hover:bg-blue-50 hover:text-blue-600"
            >
              {language === "en" ? "العربية" : "English"}
            </button>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed nav */}
      <div
        className={`transition-[height] duration-300 ${
          showStickySearch ? "h-28 sm:h-20" : "h-16 sm:h-20"
        }`}
      />

      {manageContactModal && !onContactClick && (
        <ContactRequestModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};
