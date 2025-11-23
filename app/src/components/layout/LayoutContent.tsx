/**
 * Layout Content - Conditionally renders sidebar based on route
 */

"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "../sidebar/app-sidebar";
import { sidebarConfig } from "../sidebar/sidebar.config";

export const LayoutContent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  if (isLoginPage) {
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
