import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import acceptLanguage from "accept-language";
import {
  fallbackLanguage,
  languages,
  cookieName as i18nCookieName,
} from "./services/i18n/config";
import { APP_DEFAULT_PATH } from "@/config";
import { AUTH_TOKEN_KEY } from "./services/auth/config";
acceptLanguage.languages([...languages]);

const PUBLIC_FILE = /\.(.*)$/;

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|auth/|icons/).*)"],
};

function checkAuth(req: NextRequest): boolean {
  const token = req.cookies.get(AUTH_TOKEN_KEY)?.value;
  // Add proper token validation logic here
  return !!token;
}

export function middleware(req: NextRequest) {
  console.log("Middleware triggered for:", req.nextUrl.pathname);
  // Skip static files and API routes
  if (
    req.nextUrl.pathname.startsWith("/_next") ||
    req.nextUrl.pathname.includes("/api/") ||
    PUBLIC_FILE.test(req.nextUrl.pathname)
  ) {
    return NextResponse.next();
  }

  // Handle i18n detection
  const language =
    acceptLanguage.get(req.cookies.get(i18nCookieName)?.value) ||
    acceptLanguage.get(req.headers.get("Accept-Language")) ||
    fallbackLanguage;

  // Redirect if language in path is not supported
  if (!languages.some((loc) => req.nextUrl.pathname.startsWith(`/${loc}`))) {
    return NextResponse.redirect(
      new URL(
        `/${language}${req.nextUrl.pathname}${req.nextUrl.search}`,
        req.url
      )
    );
  }

  // Extract language from path
  const pathLanguage =
    languages.find((l) => req.nextUrl.pathname.startsWith(`/${l}/`)) ||
    fallbackLanguage;

  // Check authentication status
  const isAuthenticated = checkAuth(req);
  const { pathname } = req.nextUrl;

  // Define route types
  const isAuthRoute =
    pathname.startsWith(`/${pathLanguage}/sign-in`) ||
    pathname.startsWith(`/${pathLanguage}/sign-up`);
  const isPublicRoute = pathname === `/${pathLanguage}`; // Example: home page is public
  const isProtectedRoute = !isAuthRoute && !isPublicRoute;
  console.log(
    "isAuthenticated",
    isAuthenticated,
    "isProtectedRoute",
    isProtectedRoute
  );
  // Handle protected routes
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL(`/${pathLanguage}/sign-in`, req.url));
  }

  // Prevent authenticated users from accessing auth routes
  const targetPath = `/${pathLanguage}${APP_DEFAULT_PATH}`;

  // Handle authenticated users trying to access auth routes
  if (!isProtectedRoute && isAuthenticated) {
    console.log("should redirect ");
    return NextResponse.redirect(new URL(targetPath, req.url));
  }
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL(targetPath, req.url));
  }

  // Handle language cookie from referer
  if (req.headers.has("referer")) {
    const refererUrl = new URL(req.headers.get("referer") ?? "");
    const refererLanguage = languages.find((l) =>
      refererUrl.pathname.startsWith(`/${l}`)
    );

    if (refererLanguage) {
      const response = NextResponse.next();
      response.cookies.set(i18nCookieName, refererLanguage);
      return response;
    }
  }

  return NextResponse.next();
}
