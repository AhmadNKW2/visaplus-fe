"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import {
  useCurrency,
  type Currency,
  type CurrencyOption,
} from "../../contexts/currency.context";
import { useLanguage } from "../../contexts/language.context";

function FlagBadge({
  option,
  size = 28,
  ring = false,
}: {
  option: CurrencyOption;
  size?: number;
  ring?: boolean;
}) {
  return (
    <span
      className={`
        relative inline-flex shrink-0 items-center justify-center overflow-hidden
        rounded-full bg-gray-100
        ${ring ? "ring-2 ring-white shadow-md" : "shadow-sm ring-1 ring-black/8"}
      `}
      style={{ width: size, height: size }}
    >
      <Image
        src={`/flags/${option.flagCode}.png`}
        alt={option.flagAlt}
        width={size}
        height={size}
        className="h-full w-full scale-125 object-cover"
        unoptimized
      />
    </span>
  );
}

export const CurrencySelect: React.FC = () => {
  const { currency, setCurrency, options, currentOption } = useCurrency();
  const { language, t } = useLanguage();
  const isRtl = language === "ar";
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);

      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const buttons = listRef.current?.querySelectorAll<HTMLButtonElement>(
          '[role="option"]'
        );
        if (!buttons?.length) return;

        const currentIndex = Array.from(buttons).findIndex(
          (btn) => btn === document.activeElement
        );
        const delta = e.key === "ArrowDown" ? 1 : -1;
        const nextIndex =
          currentIndex < 0
            ? 0
            : (currentIndex + delta + buttons.length) % buttons.length;
        buttons[nextIndex]?.focus();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const handleSelect = (code: Currency) => {
    setCurrency(code);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("Select currency", "اختر العملة")}
        className={`
          group relative inline-flex h-10 items-center gap-2
          rounded-full pl-1.5 pr-3
          bg-linear-to-b from-white to-[#f4f6fb]
          text-[#00205b]
          shadow-[0_1px_2px_rgba(0,32,91,0.06),0_0_0_1px_rgba(0,32,91,0.08)]
          transition-all duration-200 ease-out
          hover:shadow-[0_4px_12px_rgba(0,32,91,0.1),0_0_0_1px_rgba(0,32,91,0.14)]
          hover:-translate-y-px
          focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00205b]/25
          active:translate-y-0 active:scale-[0.98]
          ${open ? "shadow-[0_4px_14px_rgba(0,32,91,0.12),0_0_0_1px_rgba(0,32,91,0.18)] -translate-y-px" : ""}
        `}
      >
        <FlagBadge option={currentOption} size={28} ring />
        <span className="text-[13px] font-extrabold tracking-wide">
          {currentOption.code}
        </span>
        <ChevronDown
          className={`ml-0.5 h-3.5 w-3.5 text-[#00205b]/40 transition-transform duration-250 ease-out group-hover:text-[#00205b]/70 ${
            open ? "rotate-180 text-[#00205b]/70" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={listRef}
            role="listbox"
            aria-label={t("Currency", "العملة")}
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className={`
              absolute top-[calc(100%+10px)] z-60 w-56 origin-top
              overflow-hidden rounded-2xl
              border border-[#00205b]/8 bg-white/95 p-1.5
              shadow-[0_18px_40px_-12px_rgba(0,32,91,0.28),0_0_0_1px_rgba(0,32,91,0.04)]
              backdrop-blur-xl
              ${isRtl ? "left-0 origin-top-left" : "right-0 origin-top-right"}
            `}
          >
            <div className="px-3 pb-2 pt-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#00205b]/40">
                {t("Choose currency", "اختر العملة")}
              </p>
            </div>

            <div className="flex flex-col gap-0.5">
              {options.map((option) => {
                const selected = option.code === currency;
                const name = isRtl ? option.labelAr : option.label;

                return (
                  <button
                    key={option.code}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => handleSelect(option.code)}
                    className={`
                      group/item relative flex w-full items-center gap-3
                      rounded-xl px-2.5 py-2.5 text-left
                      transition-all duration-150
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00205b]/20
                      ${
                        selected
                          ? "bg-[#00205b] text-white shadow-sm"
                          : "text-[#00205b] hover:bg-[#00205b]/5"
                      }
                    `}
                  >
                    <FlagBadge option={option} size={34} ring={selected} />

                    <span className="flex min-w-0 flex-1 flex-col items-start gap-0.5 leading-tight">
                      <span className="text-sm font-extrabold tracking-wide">
                        {option.code}
                      </span>
                      <span
                        className={`truncate text-[11px] font-medium ${
                          selected ? "text-white/70" : "text-[#00205b]/50"
                        }`}
                      >
                        {name}
                      </span>
                    </span>

                    <span
                      className={`
                        flex h-6 w-6 shrink-0 items-center justify-center rounded-full
                        transition-all duration-150
                        ${
                          selected
                            ? "bg-[#c02033] text-white"
                            : "bg-transparent text-transparent group-hover/item:bg-[#00205b]/8 group-hover/item:text-[#00205b]/30"
                        }
                      `}
                    >
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
