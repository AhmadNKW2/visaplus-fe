"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { PublicCountry } from "../../services/public/public.service";
import { useLanguage } from "../../contexts/language.context";
import { Button } from "../ui/button";

interface CountryCardProps {
  country: PublicCountry;
  isOpen: boolean;
  onToggle: () => void;
  onApply: () => void;
}

export default function CountryCard({ country, isOpen, onToggle, onApply }: CountryCardProps) {
  const { language, t } = useLanguage();
  const isRtl = language === 'ar';

  const sortedAttributes = [...country.attributes]
    .sort((a, b) => a.attribute.order - b.attribute.order)
    .slice(0, 3);

  // ADDED "as const" HERE TO FIX THE TYPE ERROR
  const springTransition = {
    type: "spring" as const,
    stiffness: 300,
    damping: 30
  };

  return (
    <div
      className={`
        relative w-full transition-all duration-300 ease-in-out
        ${isOpen ? 'h-auto sm:h-[150px]' : 'h-[150px]'}
        ${isOpen ? 'z-50' : 'z-0 delay-200'} 
      `}
    >
      <motion.div
        layout
        onClick={onToggle}
        transition={springTransition}
        className={`
          w-full bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer group
          ${isOpen
            ? 'relative sm:absolute sm:top-0 sm:left-0 sm:w-full sm:shadow-lg'
            : 'relative h-full hover:shadow-lg transition-shadow duration-300'
          }
        `}
      >
        <motion.div
          layout="position"
          className="relative w-full h-[150px] shrink-0 overflow-hidden"
        >
          <Image
            src={country.countryWorld.image_url}
            alt={isRtl ? country.countryWorld.name_ar : country.countryWorld.name_en}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-80" />

          <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-10">
            <h3 className={`text-2xl font-bold ${isRtl ? 'font-almarai' : ''}`}>
              {isRtl ? country.countryWorld.name_ar : country.countryWorld.name_en}
            </h3>
          </div>
        </motion.div>

        <AnimatePresence mode="sync">
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={springTransition}
              className="bg-white overflow-hidden"
            >
              <div className="p-6 pt-4 border-t border-gray-100">
                <div className="flex flex-col flex-wrap gap-2 mb-4">
                  {sortedAttributes.length > 0 ? sortedAttributes.map((attr) => (
                    <div key={attr.id} className="flex flex-col items-start text-sm bg-gray-100 px-2 py-1 rounded-md">
                      <span className="text-gray-500 ltr:mr-1 rtl:ml-1">
                        {isRtl ? attr.attribute.name_ar : attr.attribute.name_en}:
                      </span>
                      <span className="font-semibold text-gray-900">
                        {isRtl ? attr.value_ar : attr.value_en}
                      </span>
                    </div>
                  )) : (
                    <p className="text-sm text-gray-400 italic">
                      {t("Click to view details", "انقر لعرض التفاصيل")}
                    </p>
                  )}
                </div>

                <Button
                  className="w-full gap-2 group/btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onApply();
                  }}
                  color="#c02033"
                >
                  {t("Start Application", "ابدأ الطلب")}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}