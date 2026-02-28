import type { Metadata } from "next";
import "../globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, Slide } from "react-toastify";
import { QueryProvider } from "../src/providers/query-provider";
import { AuthProvider } from "../src/contexts/auth.context";
import { ProtectedRoute } from "../src/components/auth/ProtectedRoute";
import { LayoutContent } from "../src/components/layout/LayoutContent";


export const metadata: Metadata = {
  title: "Visaplus Admin Dashboard",
  description: "Admin dashboard for Visaplus management system",
  icons: {
    icon: "/Logo-Icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" className="bg-primary" suppressHydrationWarning>
      <body className="antialiased">
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
              <LayoutContent>{children}</LayoutContent>
            </ProtectedRoute>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
