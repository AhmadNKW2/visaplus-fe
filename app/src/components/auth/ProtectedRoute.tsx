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
    if (!isLoading && !isAuthenticated && pathname !== "/login") {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  // Don't render protected content if not authenticated
  if (!isAuthenticated && pathname !== "/login") {
    return null;
  }

  return <>{children}</>;
};
