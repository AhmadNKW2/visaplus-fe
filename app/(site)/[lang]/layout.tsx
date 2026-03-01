import type { Metadata } from "next";
import { Lato, Almarai } from "next/font/google";
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
  title: "Visaplus Admin Dashboard",
  description: "Admin dashboard for Visaplus management system",
  icons: {
    icon: "/Logo-Icon.svg",
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

  return (
    <html lang={validLang} dir={dir} className="bg-primary" suppressHydrationWarning>
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
