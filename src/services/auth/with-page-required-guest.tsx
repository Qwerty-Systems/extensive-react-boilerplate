"use client";
import { usePathname, useRouter } from "next/navigation";
import useAuth from "./use-auth";
import React, { FunctionComponent, useEffect } from "react";
import useLanguage from "@/services/i18n/use-language";
import { APP_DEFAULT_PATH } from "@/config";

type PropsType = {
  params?: { [key: string]: string | string[] | undefined };
  searchParams?: { [key: string]: string | string[] | undefined };
};

function isAdminRole(roleName: string): boolean {
  return ["Admin", "PlatformOwner"].includes(roleName);
}

function withPageRequiredGuest(Component: FunctionComponent<PropsType>) {
  return function PageRequiredGuest(props: PropsType) {
    const { user, isInitialized, onboardingState } = useAuth();
    const router = useRouter();
    const language = useLanguage();
    const pathname = usePathname();
    useEffect(() => {
      // const check = () => {
      //   if (!user || !isLoaded) return;

      //   const params = new URLSearchParams(window.location.search);
      //   const returnTo = params.get("returnTo") ?? `/${language}`;
      //   router.replace(returnTo);
      // };

      // check();
      if (!isInitialized) return;

      if (user) {
        const userRole = user?.role?.name;
        // Onboarding redirection logic
        const isAdmin = isAdminRole(userRole ?? "");
        const isOnboardingRoute =
          pathname.includes("/onboarding/tenant") ||
          pathname.includes("/onboarding/user");

        const targetPath = `/${language}${APP_DEFAULT_PATH}`;

        // Skip onboarding redirection for these routes
        const isAllowedRoute =
          isOnboardingRoute || pathname.includes("/sign-out");

        if (!isAllowedRoute) {
          // Tenant onboarding for admins
          if (isAdmin && !onboardingState.tenantOnboarded) {
            router.replace(`/${language}/onboarding/tenant`);
            return;
          }

          // User onboarding for regular users
          if (!isAdmin && !onboardingState.userOnboarded) {
            router.replace(`/${language}/onboarding/user`);
            return;
          }
        }

        // Redirect away from onboarding if completed
        if (isOnboardingRoute) {
          if (
            (isAdmin && onboardingState.tenantOnboarded) ||
            (!isAdmin && onboardingState.userOnboarded)
          ) {
            router.replace(targetPath);
            return;
          }
        }
        // Redirect root path to default app path
        if (pathname === `/${language}/`) {
          router.replace(`/${language}${APP_DEFAULT_PATH}`);
          return;
        }
      }
    }, [user, isInitialized, router, language]);

    return !user && isInitialized ? <Component {...props} /> : null;
  };
}

export default withPageRequiredGuest;
