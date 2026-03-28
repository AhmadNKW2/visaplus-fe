import type { Metadata } from "next";
import { Lato, Almarai } from "next/font/google";
import { Organization, WebSite, WithContext } from "schema-dts";
import "../../globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, Slide } from "react-toastify";
import { QueryProvider } from "../../src/providers/query-provider";
import { AuthProvider } from "../../src/contexts/auth.context";
import { LanguageProvider } from "../../src/contexts/language.context";
import { ProtectedRoute } from "../../src/components/auth/ProtectedRoute";
import { LayoutContent } from "../../src/components/layout/LayoutContent";
import { FloatingContactButtons } from "../../src/components/layout/FloatingContactButtons";
import { Footer } from "../../src/components/layout/Footer";

const lato = Lato({
  variable: '--font-lato',
  subsets: ['latin'],
  weight: ['100', '300', '400', '700', '900'],
  display: 'swap',
});

const almarai = Almarai({
  variable: '--font-almarai',
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.visaplusjo.com"),
  title: {
    default: "VISA Plus Center | Visa Services",
    template: "%s | VISA Plus Center",
  },
  description: "سافر حول العالم بكل سهولة. خدمات تأشيرة احترافية لوجهتك القادمة. سريع، موثوق، وآمن. - Travel the world with ease. Professional visa services for your next destination.",
  keywords: ["visa", "travel services", "VISA Plus Center", "تأشيرة", "فيزا", "خدمات سفر"],
  authors: [{ name: "VISA Plus Center" }],
  creator: "VISA Plus Center",
  openGraph: {
    type: "website",
    title: "VISA Plus Center | Professional Visa Services",
    description: "سافر حول العالم بكل سهولة. خدمات تأشيرة احترافية لوجهتك القادمة.",
    siteName: "VISA Plus Center",
    images: [{ url: "https://www.visaplusjo.com/Logo-Icon.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "VISA Plus Center",
    description: "Travel the world with ease. Professional visa services.",
    images: ["https://www.visaplusjo.com/Logo-Icon.png"],

  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "L2PAwok68PQfIxmJGQnZa1CYq0",
  },
  alternates: {
    canonical: "https://www.visaplusjo.com",
    languages: {
      "en": "https://www.visaplusjo.com/en",
      "ar": "https://www.visaplusjo.com/ar",
    }
  },
  icons: {
    icon: "/Logo-Icon.svg",
    apple: "/Logo-Icon.svg",
  },
};

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'ar' }];
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const validLang = (lang === "ar" ? "ar" : "en") as "ar" | "en";
  const dir = validLang === "ar" ? "rtl" : "ltr";

  const jsonLd: WithContext<Organization> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    url: "https://www.visaplusjo.com",
    name: "VISA Plus Center",
    logo: "https://www.visaplusjo.com/Logo.svg",
    description: validLang === "ar" ? "سافر حول العالم بكل سهولة. خدمات تأشيرة احترافية لوجهتك القادمة." : "Travel the world with ease. Professional visa services for your next destination.",
  };

  return (
    <html lang={validLang} dir={dir} className="bg-primary" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${lato.variable} ${almarai.variable} antialiased`}
      >
        <LanguageProvider initialLang={validLang}>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
            transition={Slide}
          />
          <QueryProvider>
            <AuthProvider>
              <ProtectedRoute>
                <LayoutContent>
                  {children}
                  <FloatingContactButtons />
                  <Footer />
                </LayoutContent>
              </ProtectedRoute>
            </AuthProvider>
          </QueryProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
