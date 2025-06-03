"use client";
import { useRouter } from "next/navigation";
import useAuth from "./use-auth";
import React, { FunctionComponent, useEffect, useState } from "react";
import useLanguage from "../i18n/use-language";
import { RoleEnum } from "../api/types/role";
import LoadingSpinner from "@/components/loading-spinner";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "@/components/error-fallback";
import { usePathname } from "next/navigation";
import { APP_DEFAULT_PATH } from "@/config";
import { ALLOW_ONBOARDING } from "../api/config";
type PropsType = {
  params?: { [key: string]: string | string[] | undefined };
  searchParams?: { [key: string]: string | string[] | undefined };
};

type OptionsType = {
  roles: RoleEnum[];
};

function isRole(role: string): role is RoleEnum {
  return Object.values(RoleEnum).includes(role as RoleEnum);
}

function isAdminRole(roleName: string): boolean {
  return ["Admin", "PlatformOwner"].includes(roleName);
}

function withPageRequiredAuth(
  Component: FunctionComponent<PropsType>,
  options?: OptionsType
) {
  return function WithPageRequiredAuth(props: PropsType) {
    const { user, tenant, isInitialized, onboardingState } = useAuth();
    const router = useRouter();
    const language = useLanguage();
    const pathname = usePathname();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
      if (!isInitialized) return;

      const checkAuthorization = () => {
        console.log(" ###########checkAuthorization .......");
        try {
          console.log("user", user);
          // User is not authenticated
          if (!user) {
            const returnTo = encodeURIComponent(
              window.location.pathname + window.location.search
            );
            router.replace(`/${language}/sign-in?returnTo=${returnTo}`);
            return;
          }

          // Get normalized role name
          const userRole = user?.role?.name;
          if (!userRole || !isRole(userRole)) {
            router.replace(`/${language}/403-unauthorized`);
            return;
          }

          // Check if user has required role
          const hasValidRole = options?.roles
            ? options.roles.includes(userRole as RoleEnum)
            : true;

          if (!hasValidRole) {
            router.replace(`/${language}/403-unauthorized`);
            return;
          }

          // Redirect root path to default app path
          if (pathname === `/${language}/`) {
            router.replace(`/${language}${APP_DEFAULT_PATH}`);
            return;
          }

          // Onboarding redirection logic
          const isAdmin = isAdminRole(userRole);
          const isOnboardingRoute =
            pathname.includes("/onboarding/tenant") ||
            pathname.includes("/onboarding/user");

          const targetPath = `/${language}${APP_DEFAULT_PATH}`;

          // Skip onboarding redirection for these routes
          const isAllowedRoute =
            isOnboardingRoute || pathname.includes("/sign-out");
          if (ALLOW_ONBOARDING) {
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
          }
        } catch (error) {
          console.error("Authorization check failed:", error);
          router.replace(`/${language}/error`);
        } finally {
          setIsChecking(false);
        }
      };

      setIsChecking(true);
      checkAuthorization();
    }, [
      user,
      tenant,
      isInitialized,
      onboardingState,
      router,
      language,
      pathname,
    ]);

    if (!isInitialized || isChecking) {
      return <LoadingSpinner fullScreen />;
    }

    if (!user) {
      return null; // Already redirected in useEffect
    }

    return (
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => router.refresh()}
      >
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}

export default withPageRequiredAuth;
