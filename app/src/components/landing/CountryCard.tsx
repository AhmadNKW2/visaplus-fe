"use client";

import Image from "next/image";
import { useRef, useState, useLayoutEffect, useEffect } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { PublicCountry } from "../../services/public/public.service";
import { useLanguage } from "../../contexts/language.context";
import { Button } from "../ui/button";

interface CountryCardProps {
  country: PublicCountry;
  isOpen: boolean;
  onToggle: () => void;
  onApply: () => void;
}

const SCHENGEN_COUNTRIES = [
  "Austria", "Belgium", "Bulgaria", "Croatia", "Czech Republic", "Czechia", 
  "Denmark", "Estonia", "Finland", "France", "Germany", "Greece", "Hungary", 
  "Iceland", "Italy", "Latvia", "Liechtenstein", "Lithuania", "Luxembourg", 
  "Malta", "Netherlands", "Norway", "Poland", "Portugal", "Romania", 
  "Slovakia", "Slovenia", "Spain", "Sweden", "Switzerland"
];

export default function CountryCard({ country, isOpen, onToggle, onApply }: CountryCardProps) {
  const { language, t } = useLanguage();
  const isRtl = language === 'ar';
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const countryName = isRtl ? country.countryWorld.name_ar : country.countryWorld.name_en;
  const hasPricing = country.applyPrice != null || country.visaPrice != null;

  const getPriceDisplay = (price?: number | null) => {
    const numericPrice = Number(price);
    const isFree = price != null && Number.isFinite(numericPrice) && numericPrice === 0;

    return {
      label: isFree ? t("Free", "مجانا") : price,
      showCurrency: !isFree,
    };
  };

  const applyPriceDisplay = getPriceDisplay(country.applyPrice);
  const visaPriceDisplay = getPriceDisplay(country.visaPrice);
  const detailsLabel = isOpen ? t("Hide details", "إخفاء التفاصيل") : t("View details", "عرض التفاصيل");

  const isSchengen = SCHENGEN_COUNTRIES.some(
    c => country.countryWorld.name_en.toLowerCase().includes(c.toLowerCase())
  );

  const sortedAttributes = [...country.attributes]
    .filter((attr) => attr.isActive)
    .sort((a, b) => a.attribute.order - b.attribute.order);

  // Measure content height whenever the card opens/closes or attributes change
  useLayoutEffect(() => {
    if (contentRef.current) {
      const height = contentRef.current.scrollHeight;
      setContentHeight(height);
    }
  }, [sortedAttributes, isOpen]);

  // Force remeasure on next frame when opening
  useEffect(() => {
    if (isOpen && contentRef.current) {
      requestAnimationFrame(() => {
        if (contentRef.current) {
          setContentHeight(contentRef.current.scrollHeight);
        }
      });
    }
  }, [isOpen]);

  return (
    <div
      data-country-id={country.id}
      className={`
        relative w-full transition-all duration-300 ease-in-out
        h-auto ${hasPricing ? 'sm:h-80' : 'sm:h-68'}
        ${isOpen ? 'z-10' : 'z-0 delay-300'} 
      `}
    >
      <article
        className={`
          w-full overflow-hidden border border-gray-100/80 bg-white shadow-md transition-all duration-300 group
          ${isOpen
            ? 'relative sm:absolute sm:top-0 sm:left-0 sm:w-full sm:shadow-xl'
            : 'relative hover:-translate-y-1 hover:shadow-xl'
          }
        `}
        style={{
          borderRadius: 'var(--radius-rounded1)',
          transition: 'all 300ms ease-out',
        }}
      >
        <div className="block w-full">
          <div
            className="relative h-37.5 w-full shrink-0 overflow-hidden"
            style={{
              borderRadius: isOpen ? 'var(--radius-rounded1) var(--radius-rounded1) 0 0' : 'var(--radius-rounded1)',
              transition: 'border-radius 300ms ease-out',
            }}
          >
            <Image
              src={country.countryWorld.image_url}
              alt={countryName}
              fill
              className={`object-cover transition-transform duration-700 ${isOpen ? 'scale-105' : 'group-hover:scale-110'}`}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/25 to-black/5 opacity-90" />

            {isSchengen && (
              <div className={`absolute top-3 ${isRtl ? 'right-3' : 'left-3'} flex items-center gap-1.5 rounded-sm border border-blue-400/30 bg-blue-900/90 px-2 py-1 text-white shadow-md backdrop-blur-sm z-10`}>
                <span className="text-[10px] font-bold tracking-widest uppercase">
                  {t("Schengen", "شنغن")}
                </span>
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 z-10 w-full whitespace-normal px-4 py-3 text-white">
              <h3 className={`text-2xl font-bold leading-tight drop-shadow-md ${isRtl ? 'font-almarai' : ''}`}>
                {countryName}
              </h3>
            </div>
          </div>
        </div>

        {/* Pricing Layout - Modern Split View */}
        {hasPricing && (
          <div className="bg-white px-2 py-2 flex gap-5 items-center justify-evenly border-b border-gray-100 relative z-10">
            {country.applyPrice != null && (
              <div className="flex flex-col gap-1 justify-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  {t("Office Fees", "رسوم المكتب")}
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-black text-[#c02033] tracking-tight leading-none">
                    {applyPriceDisplay.label}
                  </span>
                  {applyPriceDisplay.showCurrency && (
                    <span className="text-sm font-bold text-[#c02033]/80 leading-none">
                      {isRtl ? 'دينار' : 'JD'}
                    </span>
                  )}
                </div>
              </div>
            )}
            
            {(country.applyPrice != null && country.visaPrice != null) && (
              <div className="w-px h-10 bg-gray-200 opacity-70"></div>
            )}

            {country.visaPrice != null && (
              <div className="flex flex-col gap-1 justify-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  {t("Visa Fees", "رسوم السفارة")}
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-black text-gray-800 tracking-tight leading-none">
                    {visaPriceDisplay.label}
                  </span>
                  {visaPriceDisplay.showCurrency && (
                    <span className="text-sm font-bold text-gray-500 leading-none">
                      {isRtl ? 'دينار' : 'JD'}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="border-b border-gray-100 bg-white px-3 py-3">
          <div className="flex flex-col gap-2">
            <Button
              className="inline-flex h-12! w-full items-center justify-center gap-2"
              onClick={(e) => {
                e.stopPropagation();
                onApply();
              }}
              color="#c02033"
            >
              {t("Start Application", "ابدأ الطلب")}
              <ArrowRight className={`h-4 w-4 ${isRtl ? 'rotate-180' : ''}`} />
            </Button>

            <button
              type="button"
              onClick={onToggle}
              aria-expanded={isOpen}
              className="inline-flex min-h-11 w-full items-center justify-between rounded-rounded1 border border-[#00205b]/10 bg-[#00205b]/3 px-4 py-2 text-left text-sm font-semibold text-[#00205b] transition-colors duration-200 hover:border-[#00205b]/20 hover:bg-[#00205b]/6"
            >
              <span className="flex flex-col items-start leading-tight">
                <span>{detailsLabel}</span>
                <span className="text-[11px] font-medium text-[#00205b]/65">
                  {t("Requirements, fees and notes", "المتطلبات والرسوم والملاحظات")}
                </span>
              </span>

              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#00205b] shadow-sm">
                <ChevronDown className={`h-4 w-4 transition-transform duration-300 ease-out ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
              </span>
            </button>
          </div>
        </div>

        <div
          className="bg-white overflow-hidden transition-[height,opacity] duration-300 ease-out"
          style={{
            height: isOpen ? `${contentHeight}px` : '0px',
            opacity: isOpen ? 1 : 0,
          }}
        >
          <div ref={contentRef} className="p-2 py-4 border-t border-gray-100">
            <div className="flex flex-col gap-2 mb-4 overflow-y-auto">
              {sortedAttributes.length > 0 ? sortedAttributes.map((attr) => (
                <div key={attr.id} className="flex flex-col items-start text-sm bg-gray-100 p-2 rounded-rounded1">
                  <span className="text-gray-500 ltr:mr-1 rtl:ml-1">
                    {isRtl ? attr.attribute.name_ar : attr.attribute.name_en}:
                  </span>
                  <span className="font-semibold text-gray-900">
                    {isRtl ? attr.value_ar : attr.value_en}
                  </span>
                </div>
              )) : (
                <p className="text-sm text-gray-400 italic">
                  {t("More application details will be available soon.", "ستتوفر المزيد من تفاصيل الطلب قريبًا.")}
                </p>
              )}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}