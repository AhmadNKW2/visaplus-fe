"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useLanguage } from "../../contexts/language.context";
import { RefObject } from "react";

interface HeroSectionProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    // Updated type to allow null, matching standard useRef behavior
    searchRef: RefObject<HTMLDivElement | null>;
    onSearchSubmit?: () => void;
}

export const HeroSection = ({ searchQuery, setSearchQuery, searchRef, onSearchSubmit }: HeroSectionProps) => {
    const { t, language } = useLanguage();
    const isRtl = language === 'ar';

    return (
        <div className="mt-22 relative w-full overflow-hidden bg-slate-900 px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
            {/* Abstract Background Shapes */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-blue-600/20 rounded-full blur-[100px]" />
                <div className="absolute top-[20%] -right-[10%] w-[50%] h-[60%] bg-purple-600/20 rounded-full blur-[100px]" />
            </div>

            {/* Content */}
            <div className="relative z-10 mx-auto w-full max-w-5xl text-center space-y-6 sm:space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className={`text-3xl sm:text-4xl lg:text-6xl leading-tight font-bold text-white mb-3 sm:mb-4 ${isRtl ? 'font-almarai' : ''}`}>
                        {t("Travel the World With Ease", "سافر حول العالم بكل سهولة")}
                    </h1>
                    <p className="text-base sm:text-lg lg:text-xl text-blue-100 max-w-2xl mx-auto">
                        {t(
                            "Professional visa assistance for your next destination. Fast, reliable, and secure.",
                            "خدمات تأشيرة احترافية لوجهتك القادمة. سريع، موثوق، وآمن."
                        )}
                    </p>
                </motion.div>

                {/* Floating Search Bar */}
                <motion.div
                    ref={searchRef}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="relative mx-auto w-full max-w-2xl"
                >
                    <div className="relative">
                        <div className={`absolute inset-y-0 ${isRtl ? 'right-4' : 'left-4'} flex items-center pointer-events-none text-gray-400 z-10`}>
                            <Search className="w-5 h-5" />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && onSearchSubmit?.()}
                            placeholder={t("Where do you want to go?", "وين حابب تسافر؟")}
                            className={`w-full rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-gray-300 shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/20 py-3 sm:py-3.5 text-base sm:text-lg ${isRtl ? 'text-right pr-12 pl-5 sm:pl-32' : 'pl-12 pr-5 sm:pr-32'}`}
                            dir={isRtl ? 'rtl' : 'ltr'}
                        />

                        <button
                            onClick={onSearchSubmit}
                            className={`hidden sm:flex bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-full font-medium transition-colors duration-300 items-center justify-center gap-2 px-6 sm:absolute sm:top-2 sm:bottom-2 ${isRtl ? 'sm:left-2' : 'sm:right-2'}`}
                        >
                            {t("Search", "بحث")}
                        </button>
                    </div>

                    <button
                        onClick={onSearchSubmit}
                        className="sm:hidden bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-full font-medium transition-colors duration-300 flex items-center justify-center gap-2 px-6 py-3 mt-3 w-full"
                    >
                        {t("Search", "بحث")}
                    </button>
                </motion.div>
            </div>
        </div>
    );
};