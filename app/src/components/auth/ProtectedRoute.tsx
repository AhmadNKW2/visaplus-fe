/**
 * Protected Route Wrapper - redirects to login if not authenticated
 */

"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../../contexts/auth.context";

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Remove locale prefix if present (though admin routes shouldn't have it now)
    const pathWithoutLocale = pathname.replace(/^\/(en|ar)/, "") || "/";
    
    const isLoginPage = pathWithoutLocale === "/admin/login" || pathname === "/admin/login";
    const isProtected = (pathWithoutLocale.startsWith("/admin") || pathname.startsWith("/admin")) && !isLoginPage;

    if (!isLoading && !isAuthenticated && isProtected) {
      router.push("/admin/login");
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  // Don't render protected content if not authenticated
  const pathWithoutLocale = pathname.replace(/^\/(en|ar)/, "") || "/";
  const isLoginPage = pathWithoutLocale === "/admin/login" || pathname === "/admin/login";
  const isProtected = (pathWithoutLocale.startsWith("/admin") || pathname.startsWith("/admin")) && !isLoginPage;
  
  if (!isAuthenticated && isProtected) {
    return null;
  }

  return <>{children}</>;
};
