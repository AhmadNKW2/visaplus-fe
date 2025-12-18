"use client";

import Image from "next/image";
import { useRef, useState, useLayoutEffect, useEffect } from "react";
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
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  const sortedAttributes = [...country.attributes]
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
        h-auto sm:h-[150px]
        ${isOpen ? 'z-10' : 'z-0 delay-300'} 
      `}
    >
      <div
        onClick={onToggle}
        className={`
          w-full bg-white shadow-md cursor-pointer group
          ${isOpen
            ? 'relative sm:absolute sm:top-0 sm:left-0 sm:w-full sm:shadow-lg'
            : 'relative hover:shadow-lg'
          }
        `}
        style={{
          borderRadius: 'var(--radius-rounded1)',
          overflow: 'hidden',
          transition: 'all 300ms ease-out',
        }}
      >
        <div
          className="relative w-full h-[150px] shrink-0 overflow-hidden"
          style={{
            borderRadius: isOpen ? 'var(--radius-rounded1) var(--radius-rounded1) 0 0' : 'var(--radius-rounded1)',
            transition: 'border-radius 300ms ease-out',
          }}
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
        </div>
      </div>
    </div>
  );
}