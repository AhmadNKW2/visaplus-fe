"use client";

import { useEffect, useState, useRef } from "react";
import { publicService, PublicCountry } from "../../services/public/public.service";
import { useLanguage } from "../../contexts/language.context";
import { ContactRequestModal } from "./ContactRequestModal";
import CountryCard from "./CountryCard";
import { HeroSection } from "./HeroSection";
import { SiteHeader } from "../layout/SiteHeader";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";

export default function LandingPage() {
  const { language, t } = useLanguage();
  const isRtl = language === 'ar';
  const applicationFeesIncludes = [
    t("Document translation", "ترجمة الوثائق"),
    t("Travel insurance", "تأمين السفر"),
    t("Hotel reservation", "حجز فندق"),
    t("Flight booking", "تذكرة طائرة"),
    t("Embassy appointment booking", "حجز موعد سفارة"),
    t("Service fees", "رسوم الخدمة"),
  ];
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
  const countryGridRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close expanded country card
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (openCountryId === null) return;

      const target = e.target as HTMLElement;

      // Find the currently open card element
      const openCard = document.querySelector(`[data-country-id="${openCountryId}"]`);

      // If click is outside the open card, close it
      if (openCard && !openCard.contains(target)) {
        setOpenCountryId(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openCountryId]);

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
        const response = await publicService.getCountries(debouncedSearch, 100);
        if (response.success) {
          const sorted = response.data.sort((a, b) => a.order - b.order);
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

      <SiteHeader
        logoHref="https://www.visaplusjo.com"
        showStickySearch={showStickySearch}
        manageContactModal={false}
        onContactClick={() => {
          setSelectedCountry(undefined);
          setIsModalOpen(true);
        }}
        stickySearch={
          <div className="relative">
            <Search
              className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 ${
                isRtl ? "right-3" : "left-3"
              }`}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
              placeholder={t("Search countries...", "وين حابب تسافر؟")}
              className={`w-full rounded-full border-none bg-gray-100 py-3 text-sm focus:ring-2 focus:ring-blue-500 sm:py-3.5 ${
                isRtl ? "pr-10 pl-4" : "pl-10 pr-4"
              }`}
              dir={isRtl ? "rtl" : "ltr"}
            />
          </div>
        }
      />

      {/* Hero Section - Pass the searchRef here */}
        <HeroSection
          searchQuery={search}
          setSearchQuery={setSearch}
          searchRef={searchRef}
          onSearchSubmit={handleSearchSubmit}
        />

      {/* Main Content */}
      <main ref={resultsRef} className="max-w-7xl w-full mx-auto px-6 py-4 sm:py-10 scroll-mt-24">
        {/* ... (Rest of the component remains the same) ... */}
        <section
          className="sm:mb-10 mb-5 rounded-rounded1 border border-[#00205b]/10 bg-linear-to-br from-white via-[#f7f9ff] to-[#eef3ff] p-3 shadow-sm sm:p-5"
          dir={isRtl ? 'rtl' : 'ltr'}
        >
          <div className={`mb-3 ${isRtl ? 'text-right' : 'text-left'}`}>
            <h3 className="text-xl font-extrabold text-[#00205b]">
              {t("Application Fees Include", "رسوم التقديم تشمل")}
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {applicationFeesIncludes.map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 rounded-rounded1 border border-white/70 bg-white/90 px-3 py-2 text-sm font-semibold text-gray-800 shadow-xs"
              >
                <span className="text-base leading-none" aria-hidden="true">✅</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              {t("Available Destinations", "الوجهات المتاحة")}
            </h2>
            <p className="text-gray-500 mt-2">
              {t("Tap a flag for details or start your application instantly.", "اضغط على العلم للتفاصيل أو ابدأ طلبك مباشرة.")}
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
            ref={countryGridRef}
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-20"
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
            <p className="text-gray-500 mb-6">
              {t("Try adjusting your search terms.", "حاول تعديل مصطلحات البحث.")}
            </p>
            <button
              onClick={() => setSearch("")}
              className="min-w-37.5 px-4 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200 font-medium text-sm"
            >
              {t("Show All Countries", "عرض جميع الدول")}
            </button>
          </div>
        )}

        {!loading && filteredCountries.length > 0 && search && (
          <div className="flex justify-center mt-12">
            <button
              onClick={() => setSearch("")}
              className="min-w-37.5 px-4 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200 font-medium text-sm"
            >
              {t("Show All Countries", "عرض جميع الدول")}
            </button>
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