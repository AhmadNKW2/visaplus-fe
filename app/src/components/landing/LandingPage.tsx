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

  // Create a ref specific to the search input container
  const searchRef = useRef<HTMLDivElement>(null);

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
      try {
        const response = await publicService.getCountries();
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
  }, []);

  useEffect(() => {
    const filtered = countries.filter((c) =>
      c.countryWorld.name_en.toLowerCase().includes(search.toLowerCase()) ||
      c.countryWorld.name_ar.includes(search)
    );
    setFilteredCountries(filtered);
  }, [search, countries]);

  const handleApply = (country: PublicCountry) => {
    setSelectedCountry(country);
    setIsModalOpen(true);
  };

  return (
    <div className={`min-h-screen bg-gray-50 font-lato ${language === 'ar' ? 'font-almarai' : ''}`}>

      {/* Navigation Bar (Glassmorphic) */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/60 backdrop-blur-sm border-b border-gray-200/50 transition-all duration-300 h-20">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">V</div>
            <span className="text-xl font-bold text-slate-900 tracking-tight hidden sm:block">VisaPlus</span>
          </div>

          {/* Sticky Search Bar - Visibility controlled by showStickySearch */}
          <div className={`flex-1 max-w-md transition-all duration-500 ease-in-out ${showStickySearch ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8 pointer-events-none'}`}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("Search countries...", "ابحث عن دول...")}
                className="w-full h-10 pl-10 pr-4 rounded-full bg-gray-100 border-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={() => setLanguage(language === "en" ? "ar" : "en")}
              className="text-sm font-medium text-gray-600 hover:text-black transition-colors duration-300"
            >
              {language === "en" ? "العربية" : "English"}
            </button>
            <Button
              onClick={() => { setSelectedCountry(undefined); setIsModalOpen(true); }}
              className="bg-slate-900 hover:bg-slate-800 transition-colors duration-300 rounded-full px-6"
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
        />
      </div>

      {/* Main Content */}
      <main className="max-w-7xl w-full mx-auto px-6 py-16">
        {/* ... (Rest of the component remains the same) ... */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              {t("Available Destinations", "الوجهات المتاحة")}
            </h2>
            <p className="text-gray-500 mt-2">
              {t("Select a country to view requirements and apply.", "اختر دولة لعرض المتطلبات والتقديم.")}
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

      {/* Footer */}
      <footer className="bg-slate-900 text-white p-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">V</div>
                <span className="text-xl font-bold tracking-tight">VisaPlus</span>
              </div>
              <p className="text-blue-200 text-sm leading-relaxed max-w-xs">
                {t(
                  "Your trusted partner for visa assistance. We make your travel dreams a reality with professional and fast service.",
                  "شريكك الموثوق للمساعدة في التأشيرة. نجعل أحلام سفرك حقيقة بخدمة احترافية وسريعة."
                )}
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold">{t("Contact Us", "اتصل بنا")}</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-4 group">
                  <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-blue-600 transition-colors duration-300">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-blue-300 uppercase tracking-wider mb-0.5">{t("Phone", "الهاتف")}</p>
                    <p className="font-medium hover:text-blue-200 transition-colors duration-300" dir="ltr">+965 1234 5678</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 group">
                  <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-blue-600 transition-colors duration-300">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-blue-300 uppercase tracking-wider mb-0.5">{t("Email", "البريد")}</p>
                    <p className="font-medium hover:text-blue-200 transition-colors duration-300">info@visaplus.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 group">
                  <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-blue-600 transition-colors duration-300">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-blue-300 uppercase tracking-wider mb-0.5">{t("Location", "الموقع")}</p>
                    <p className="font-medium hover:text-blue-200 transition-colors duration-300">{t("Kuwait City, Kuwait", "مدينة الكويت، الكويت")}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links or Newsletter (Optional placeholder) */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold">{t("Quick Links", "روابط سريعة")}</h4>
              <ul className="space-y-3 text-blue-200 text-sm">
                <li><a href="#" className="hover:text-white transition-colors duration-300">{t("About Us", "من نحن")}</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300">{t("Privacy Policy", "سياسة الخصوصية")}</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300">{t("Terms of Service", "شروط الخدمة")}</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 text-center text-blue-300/60 text-sm">
            <p>&copy; {new Date().getFullYear()} VisaPlus. {t("All rights reserved.", "جميع الحقوق محفوظة.")}</p>
          </div>
        </div>
      </footer>

      <ContactRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedCountry={selectedCountry}
      />
    </div>
  );
}