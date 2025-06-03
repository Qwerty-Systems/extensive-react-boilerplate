import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import acceptLanguage from "accept-language";
import {
  fallbackLanguage,
  languages,
  cookieName as i18nCookieName,
} from "./services/i18n/config";
import { AUTH_TOKEN_KEY } from "./services/auth/config";
acceptLanguage.languages([...languages]);

const PUBLIC_FILE = /\.(.*)$/;

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|auth/|icons/).*)"],
};

function checkAuth(req: NextRequest): boolean {
  // Check authentication status
  const token = req.cookies.get(AUTH_TOKEN_KEY)?.value;
  let isAuthenticated = false;
  // let user = null;

  if (token) {
    try {
      const decoded = decodeToken(token);
      // Validate token expiration
      if (decoded.exp && decoded.exp * 1000 > Date.now()) {
        isAuthenticated = true;
      }
      return isAuthenticated;
    } catch (e) {
      console.error("Token decoding error:", e);
    }
  }

  return !!token;
}

function decodeToken(token: string): any {
  try {
    const base64Payload = token.split(".")[1];
    const payload = Buffer.from(base64Payload, "base64").toString();
    return JSON.parse(payload);
  } catch (e) {
    console.error("Token decoding error:", e);
    return null;
  }
}

export function middleware(req: NextRequest) {
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
  const isPublicRoute =
    pathname === `/${pathLanguage}` ||
    pathname === `/${pathLanguage}/market` ||
    pathname === `/${pathLanguage}/collectors` ||
    pathname === `/${pathLanguage}/recycle` ||
    pathname === `/${pathLanguage}/community`;
  const isProtectedRoute = !isAuthRoute && !isPublicRoute;
  if (isPublicRoute) {
    return NextResponse.next();
  }
  // Handle protected routes
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL(`/${pathLanguage}/sign-in`, req.url));
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
