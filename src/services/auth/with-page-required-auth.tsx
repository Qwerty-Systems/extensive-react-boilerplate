"use client";
import { useRouter } from "next/navigation";
import useAuth from "./use-auth";
import React, { FunctionComponent, useEffect, useState } from "react";
import useLanguage from "../i18n/use-language";
import { RoleEnum } from "../api/types/role";
import LoadingSpinner from "@/components/loading-spinner";
import UnauthorizedScreen from "@/components/unauthorized-screen";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "@/components/error-fallback";

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

function withPageRequiredAuth(
  Component: FunctionComponent<PropsType>,
  options?: OptionsType
) {
  return function WithPageRequiredAuth(props: PropsType) {
    const { user, isLoaded } = useAuth();
    const router = useRouter();
    const language = useLanguage();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
      if (!isLoaded) return;

      const checkAuthorization = () => {
        try {
          // User is not authenticated
          if (!user) {
            const returnTo = encodeURIComponent(window.location.pathname);
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
            ? options.roles.includes(userRole)
            : true;
          console.log("hasValidRole", hasValidRole);
          if (!hasValidRole) {
            router.replace(`/${language}/403-unauthorized`);
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
    }, [user, isLoaded, router, language]);

    if (!isLoaded || isChecking) {
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
        {options?.roles?.includes(user?.role?.name as RoleEnum) ? (
          <Component {...props} />
        ) : (
          <UnauthorizedScreen />
        )}
      </ErrorBoundary>
    );
  };
}

export default withPageRequiredAuth;
