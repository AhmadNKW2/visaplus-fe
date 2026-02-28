"use client";

import { useState, useEffect } from "react";
import { publicService, PublicFaqItem, PublicFaqs } from "../../../src/services/public/public.service";
import { useLanguage } from "../../../src/contexts/language.context";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, Search, Phone } from "lucide-react";
import { ContactRequestModal } from "../../../src/components/landing/ContactRequestModal";

function FaqAccordion({
  item,
  index,
  isRtl,
}: {
  item: PublicFaqItem;
  index: number;
  isRtl: boolean;
}) {
  const [open, setOpen] = useState(false);
  const question = isRtl ? item.questionAr : item.questionEn;
  const answer = isRtl ? item.answerAr : item.answerEn;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-shadow ${
        open ? "border-fourth/40 shadow-md" : "border-gray-100 hover:shadow-md"
      }`}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-4 px-6 py-5 text-start hover:bg-gray-50/60 transition-colors"
      >
        {/* Number badge */}
        <span
          className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
            open ? "bg-fourth text-white" : "bg-fourth/10 text-fourth"
          }`}
        >
          {index + 1}
        </span>

        <span className="flex-1 text-gray-800 font-semibold text-sm leading-relaxed">
          {question}
        </span>

        <ChevronDown
          className={`w-5 h-5 shrink-0 text-fourth transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-0">
              <div className={`ms-12 ${isRtl ? "me-0" : "me-8"}`}>
                <div className="h-px bg-gray-100 mb-4" />
                <div
                  className={`rich-content text-gray-600 text-sm leading-relaxed ${
                    isRtl ? "font-[Almarai,sans-serif]" : ""
                  }`}
                  dangerouslySetInnerHTML={{ __html: answer }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FaqsPage() {
  const { language, t } = useLanguage();
  const isRtl = language === "ar";
  const [data, setData] = useState<PublicFaqs | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    publicService
      .getFaqs()
      .then((res) => {
        const payload = (res as any)?.data?.data ?? (res as any)?.data ?? null;
        setData(payload);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = (data?.items ?? []).filter((item) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      item.questionEn.toLowerCase().includes(q) ||
      item.questionAr.toLowerCase().includes(q) ||
      item.answerEn.toLowerCase().includes(q) ||
      item.answerAr.toLowerCase().includes(q)
    );
  });

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
    <main className="min-h-screen bg-gray-50" dir={isRtl ? "rtl" : "ltr"}>
      {/* Hero */}
      <section className="relative w-full overflow-hidden bg-slate-900 px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-blue-600/20 rounded-full blur-[100px]" />
          <div className="absolute top-[20%] -right-[10%] w-[50%] h-[60%] bg-purple-600/20 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
                <HelpCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-5 leading-tight">
              {t("Frequently Asked", "الأسئلة")}
              <br />
              <span className="text-blue-300">{t("Questions", "الشائعة")}</span>
            </h1>
            <p className="text-blue-100 text-lg max-w-xl mx-auto leading-relaxed">
              {t(
                "Find answers to the most common questions about our visa services.",
                "اعثر على إجابات لأكثر الأسئلة شيوعاً حول خدمات التأشيرة لدينا."
              )}
            </p>

            {/* Search */}
            <div className="mt-10 max-w-lg mx-auto relative">
              <Search
                className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 ${
                  isRtl ? "right-4" : "left-4"
                }`}
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("Search questions...", "ابحث في الأسئلة...")}
                className={`w-full py-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md text-white placeholder-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/20 shadow-lg transition-all ${
                  isRtl ? "pr-12 pl-5 text-right" : "pl-12 pr-5"
                }`}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ List */}
      <section className="max-w-3xl mx-auto px-6 py-20">
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
              <HelpCircle className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-gray-500 text-lg font-medium">
              {search
                ? t("No results found.", "لم يتم العثور على نتائج.")
                : t("No FAQs available yet.", "لا توجد أسئلة شائعة بعد.")}
            </p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="mt-4 text-fourth text-sm hover:underline"
              >
                {t("Clear search", "مسح البحث")}
              </button>
            )}
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filtered.map((item, i) => (
              <FaqAccordion key={i} item={item} index={i} isRtl={isRtl} />
            ))}
          </div>
        )}
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden bg-slate-900 rounded-3xl p-12 text-white shadow-2xl"
          >
            {/* Blobs */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
              <div className="absolute -top-[30%] -left-[10%] w-[60%] h-[120%] bg-blue-600/20 rounded-full blur-[80px]" />
              <div className="absolute top-[10%] -right-[10%] w-[50%] h-full bg-purple-600/20 rounded-full blur-[80px]" />
            </div>
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-6">
                <Phone className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                {t("Still have questions?", "هل لا تزال لديك أسئلة؟")}
              </h2>
              <p className="text-blue-100 mb-8 leading-relaxed max-w-md mx-auto">
                {t(
                  "Our team is ready to help you with any questions you may have about our visa services.",
                  "فريقنا مستعد لمساعدتك في أي أسئلة قد تكون لديك حول خدمات التأشيرة لدينا."
                )}
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2.5 bg-white text-slate-900 font-semibold px-8 py-3.5 rounded-2xl hover:bg-blue-50 active:bg-blue-100 transition-colors shadow-lg"
              >
                <Phone className="w-4 h-4 text-blue-600" />
                {t("Contact Us", "اتصل بنا")}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <ContactRequestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  );
}
