import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["en", "ar"];
const defaultLocale = "ar"; // Default to Arabic for landing page

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. If path starts with /admin, do NOT redirect (it uses the (dashboard) layout)
  if (pathname.startsWith("/admin")) {
    return;
  }

  // 2. Check if the pathname already starts with a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // 3. Redirect if there is no locale (for landing page)
  const locale = defaultLocale;
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    "/((?!_next|api|favicon.ico|.*\\..*).*)",
  ],
};
