/**
 * Layout Content - Conditionally renders sidebar based on route
 */

"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "../sidebar/app-sidebar";
import { sidebarConfig } from "../sidebar/sidebar.config";
import { SiteHeader } from "./SiteHeader";

export const LayoutContent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const pathname = usePathname();
  
  // Remove locale prefix (e.g. /en or /ar) to check routes
  const pathWithoutLocale = pathname.replace(/^\/(en|ar)/, "") || "/";
  
  const isLoginPage = pathWithoutLocale === "/admin/login";
  const isLandingPage = pathWithoutLocale === "/";
  const showSidebar = pathWithoutLocale.startsWith("/admin") && !isLoginPage;

  // Non-admin site pages (about-us, faqs, etc.) get the shared SiteHeader
  if (!showSidebar && !isLandingPage && !isLoginPage) {
    return (
      <>
        <SiteHeader />
        {children}
      </>
    );
  }

  if (!showSidebar) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-primary">
      <AppSidebar
        groups={sidebarConfig.groups}
        header={sidebarConfig.header}
        footer={sidebarConfig.footer}
      />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
};
