"use client";

import { useEffect, useState, useRef } from "react";
import { publicService, PublicCountry } from "../../services/public/public.service";
import { useLanguage } from "../../contexts/language.context";
import { Button } from "../ui/button";
import { ContactRequestModal } from "./ContactRequestModal";
import CountryCard from "./CountryCard";
import { HeroSection } from "./HeroSection";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Phone, Mail, MapPin } from "lucide-react";
import Image from "next/image";

export default function LandingPage() {
  const { language, setLanguage, t } = useLanguage();
  const isRtl = language === 'ar';
  const [countries, setCountries] = useState<PublicCountry[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<PublicCountry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<PublicCountry | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openCountryId, setOpenCountryId] = useState<number | null>(null);
  const [showStickySearch, setShowStickySearch] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Create a ref specific to the search input container
  const searchRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleSearchSubmit = () => {
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const handleScroll = () => {
      if (searchRef.current) {
        // Get the position of the search input
        const searchRect = searchRef.current.getBoundingClientRect();

        // The Navigation bar is h-20 (approx 80px).
        // We want the sticky search to appear when the original search
        // slides UNDER the navigation bar.
        // So, if the bottom of the search input is less than 80px from top of screen:
        const navHeight = 80;
        setShowStickySearch(searchRect.bottom < navHeight);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(true);
      try {
        const response = await publicService.getCountries(debouncedSearch);
        if (response.success) {
          const sorted = response.data.sort((a, b) => a.order - b.order);
          setCountries(sorted);
          setFilteredCountries(sorted);
        }
      } catch (error) {
        console.error("Failed to fetch countries", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCountries();
  }, [debouncedSearch]);

  const handleApply = (country: PublicCountry) => {
    setSelectedCountry(country);
    setIsModalOpen(true);
  };

  return (
    <div className={`min-h-screen bg-gray-50 font-lato ${language === 'ar' ? 'font-almarai' : ''}`}>

      {/* Navigation Bar (Glassmorphic) */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/60 backdrop-blur-sm border-b border-gray-200/50 transition-all duration-300 h-auto min-h-[80px]">
        <div className={`max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between ${showStickySearch ? 'gap-4' : ''}`}>
          <div className="relative w-37 h-10 max-[400]:w-30">
            <Image
              fill
              src="/Logo.svg"
              alt="VisaPlus Logo"
            />
          </div>

          {/* Sticky Search Bar - Visibility controlled by showStickySearch */}
          <div className={`order-3 sm:order-none w-full sm:w-auto sm:flex-1 max-w-md transition-all duration-500 ease-in-out ${showStickySearch ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8 pointer-events-none h-0 sm:h-auto overflow-hidden'}`}>
            <div className="relative">
              <Search className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400`} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
                placeholder={t("Search countries...", "وين حابب تسافر؟")}
                className={`w-full py-3.5 rounded-full bg-gray-100 border-none focus:ring-2 focus:ring-blue-500 text-sm ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
                dir={isRtl ? 'rtl' : 'ltr'}
              />
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0 order-1 sm:order-none sm:ml-0">
            <button
              onClick={() => setLanguage(language === "en" ? "ar" : "en")}
              className="text-sm font-medium text-gray-600 hover:text-black active:text-black transition-colors duration-300"
            >
              {language === "en" ? "العربية" : "English"}
            </button>
            <Button
              onClick={() => { setSelectedCountry(undefined); setIsModalOpen(true); }}
              color="#c02033"
            >
              {t("Contact Us", "اتصل بنا")}
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Pass the searchRef here */}
      <div className="pt-20">
        <HeroSection
          searchQuery={search}
          setSearchQuery={setSearch}
          searchRef={searchRef}
          onSearchSubmit={handleSearchSubmit}
        />
      </div>

      {/* Main Content */}
      <main ref={resultsRef} className="max-w-7xl w-full mx-auto px-6 py-16 scroll-mt-24">
        {/* ... (Rest of the component remains the same) ... */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              {t("Available Destinations", "الوجهات المتاحة")}
            </h2>
            <p className="text-gray-500 mt-2">
              {t("Select a country to view and apply.", "اختر الدولة لعرض المعلومات.")}
            </p>
          </div>
          <div className="hidden md:block text-sm text-gray-400">
            {filteredCountries.length} {t("Countries", "دول")}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            <AnimatePresence>
              {filteredCountries.map((country) => (
                <CountryCard
                  key={country.id}
                  country={country}
                  isOpen={openCountryId === country.id}
                  onToggle={() => setOpenCountryId(openCountryId === country.id ? null : country.id)}
                  onApply={() => handleApply(country)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!loading && filteredCountries.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 opacity-50">
            <div className="text-6xl mb-4">🌍</div>
            <h3 className="text-xl font-medium text-gray-900">
              {t("No countries found", "لم يتم العثور على دول")}
            </h3>
            <p className="text-gray-500">
              {t("Try adjusting your search terms.", "حاول تعديل مصطلحات البحث.")}
            </p>
          </div>
        )}
      </main>

      <ContactRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedCountry={selectedCountry}
      />
    </div>
  );
}