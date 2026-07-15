"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export type Currency = "JOD" | "USD";

export interface CurrencyOption {
  code: Currency;
  label: string;
  labelAr: string;
  symbol: string;
  symbolAr: string;
  flagCode: "jo" | "us";
  flagAlt: string;
}

/** USD/JOD rate: 1 USD = 0.71 JOD → 1 JOD ≈ 1.40845 USD */
const JOD_TO_USD = 1 / 0.71;

/**
 * Round USD so the fractional part is only .0 or .5:
 * - 0.00–0.19 → .0
 * - 0.20–0.69 → .5
 * - 0.70–0.99 → next whole (.0)
 */
function roundUsdPrice(amount: number): number {
  const whole = Math.floor(amount + 1e-9);
  const fraction = amount - whole;

  if (fraction >= 0.7) return whole + 1;
  if (fraction >= 0.2) return whole + 0.5;
  return whole;
}

export const CURRENCY_OPTIONS: CurrencyOption[] = [
  {
    code: "JOD",
    label: "Jordanian Dinar",
    labelAr: "دينار أردني",
    symbol: "JD",
    symbolAr: "دينار",
    flagCode: "jo",
    flagAlt: "Jordan",
  },
  {
    code: "USD",
    label: "US Dollar",
    labelAr: "دولار أمريكي",
    symbol: "USD",
    symbolAr: "دولار",
    flagCode: "us",
    flagAlt: "United States",
  },
];

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  options: CurrencyOption[];
  currentOption: CurrencyOption;
  /** Convert a price stored in JOD to the selected currency */
  convertFromJod: (amountJod: number) => number;
  /** Format a JOD-based price for display in the selected currency */
  formatPrice: (amountJod: number | null | undefined) => {
    value: string | number;
    symbol: string;
    showCurrency: boolean;
    isFree: boolean;
  };
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined
);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("JOD");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("currency");
    if (stored === "JOD" || stored === "USD") {
      setCurrencyState(stored);
    }
    setHydrated(true);
  }, []);

  const setCurrency = (next: Currency) => {
    setCurrencyState(next);
    localStorage.setItem("currency", next);
  };

  const currentOption =
    CURRENCY_OPTIONS.find((o) => o.code === currency) ?? CURRENCY_OPTIONS[0];

  const convertFromJod = (amountJod: number) => {
    if (currency === "USD") {
      return roundUsdPrice(amountJod * JOD_TO_USD);
    }
    return amountJod;
  };

  const formatPrice = (amountJod: number | null | undefined) => {
    const numeric = Number(amountJod);
    const isFree =
      amountJod != null && Number.isFinite(numeric) && numeric === 0;

    if (isFree) {
      return {
        value: "Free",
        symbol: "",
        showCurrency: false,
        isFree: true,
      };
    }

    if (amountJod == null || !Number.isFinite(numeric)) {
      return {
        value: "",
        symbol: currentOption.symbol,
        showCurrency: false,
        isFree: false,
      };
    }

    const converted = convertFromJod(numeric);
    const displayValue =
      currency === "USD"
        ? Number.isInteger(converted)
          ? converted
          : converted.toFixed(1)
        : converted;

    return {
      value: displayValue,
      symbol: currentOption.symbol,
      showCurrency: true,
      isFree: false,
    };
  };

  // Avoid hydration mismatch: keep JOD until client reads localStorage
  const value: CurrencyContextType = {
    currency: hydrated ? currency : "JOD",
    setCurrency,
    options: CURRENCY_OPTIONS,
    currentOption: hydrated
      ? currentOption
      : CURRENCY_OPTIONS[0],
    convertFromJod,
    formatPrice,
  };

  return (
    <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
