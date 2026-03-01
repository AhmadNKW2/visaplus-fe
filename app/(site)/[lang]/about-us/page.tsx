"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { publicService, PublicAboutUs } from "../../../src/services/public/public.service";
import { useLanguage } from "../../../src/contexts/language.context";
import { API_CONFIG } from "../../../src/lib/constants";
import { motion } from "framer-motion";

export default function AboutUsPage() {
  const { language, t } = useLanguage();
  const isRtl = language === "ar";
  const [data, setData] = useState<PublicAboutUs | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicService
      .getAboutUs()
      .then((res) => {
        // Handle nested data structure
        const payload = (res as any)?.data?.data ?? (res as any)?.data ?? null;
        setData(payload);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const imageUrl = data?.image
    ? `${API_CONFIG.baseUrl.replace("/api", "")}/${data.image}`
    : null;

  const content = data ? (isRtl ? data.contentAr : data.contentEn) : "";

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-fourth border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">{t("Loading...", "جارٍ التحميل...")}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-10" dir={isRtl ? "rtl" : "ltr"}>

      {/* ── Hero ── */}
      <section className="relative w-full overflow-hidden bg-slate-900 px-4 pb-32 pt-14 sm:px-6 sm:pt-20 lg:px-8">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-blue-600/20 rounded-full blur-[100px]" />
          <div className="absolute top-[20%] -right-[10%] w-[50%] h-[60%] bg-purple-600/20 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
          >
            <span className="inline-block px-5 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm font-medium mb-5 tracking-wide backdrop-blur-sm">
              {t("Our Story", "قصتنا")}
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-5 leading-tight tracking-tight">
              {t("About Us", "من نحن")}
            </h1>
            <p className="text-blue-100 text-lg max-w-xl mx-auto leading-relaxed">
              {t(
                "Learn more about VisaPlus and our mission to simplify your visa journey.",
                "تعرف على VisaPlus ومهمتنا لتبسيط رحلة تأشيرتك."
              )}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Profile card — overlaps hero ── */}
      <section className="max-w-3xl mx-auto px-6 -mt-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="bg-white rounded-3xl shadow-2xl shadow-fourth/10 overflow-hidden border border-gray-100"
        >

          <div className="p-8 md:p-12">
            {/* Profile image + name block */}
            <div className="flex flex-col items-center gap-4 mb-10">
              {imageUrl ? (
                <div className="relative w-28 h-28 shrink-0">
                  <div className="absolute inset-0 rounded-2xl bg-fourth/20 blur-sm scale-110" />
                  <div className="relative w-full h-full rounded-2xl overflow-hidden ring-4 ring-white shadow-lg border border-fourth/15">
                    <Image
                      src={imageUrl}
                      alt={t("Manar Abu Najem", "منار أبو نجم")}
                      fill
                      className="object-cover"
                      sizes="112px"
                    />
                  </div>
                </div>
              ) : (
                <div className="w-28 h-28 rounded-2xl bg-linear-to-br from-fourth/20 to-[#3b2599]/10 flex items-center justify-center ring-4 ring-white shadow-lg border border-fourth/15">
                  <span className="text-4xl">🌐</span>
                </div>
              )}
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  {t("Manar Abu Najem", "منار أبو نجم")}
                </h2>
                <p className="text-sm text-fourth font-medium mt-0.5">
                  {t("Your Trusted Visa Partner", "شريكك الموثوق للتأشيرات")}
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-8 justify-center">
              <div className="h-px flex-1 bg-gray-100" />
              <div className="flex gap-1.5">
                <div className="w-8 h-1 rounded-full bg-fourth" />
                <div className="w-3 h-1 rounded-full bg-fifth" />
              </div>
              <div className="h-px flex-1 bg-gray-100" />
            </div>

            {/* Content */}
            {content ? (
              <div
                dir={isRtl ? "rtl" : "ltr"}
                className={`rich-content text-gray-600 leading-[1.9] text-base md:text-[16.5px] ${
                  isRtl ? "text-right font-[Almarai,sans-serif]" : "text-left"
                }`}
                dangerouslySetInnerHTML={{ __html: content }}
              />
            ) : (
              <p className="text-gray-400 italic text-center">
                {t("Content coming soon.", "المحتوى قريباً.")}
              </p>
            )}

            {/* Feature chips */}
            <div className="mt-8 flex flex-wrap gap-2 justify-center">
              {[
                { label: t("Fast Processing", "معالجة سريعة"), emoji: "⚡" },
                { label: t("Expert Consultants", "استشاريون خبراء"), emoji: "🎓" },
                { label: t("24/7 Support", "دعم على مدار الساعة"), emoji: "🛟" },
                { label: t("Trusted Service", "خدمة موثوقة"), emoji: "🏅" },
              ].map((chip, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-fourth/8 border border-fourth/15 text-fourth text-sm font-medium"
                >
                  <span>{chip.emoji}</span>
                  {chip.label}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

    </main>
  );
}
