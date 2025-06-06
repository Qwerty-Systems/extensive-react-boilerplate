"use client";

import { User } from "@/services/api/types/user";
import { Tenant } from "@/services/api/types/tenant";
import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  AuthActionsContext,
  AuthContext,
  AuthTokensContext,
  TokensInfo,
} from "./auth-context";
import useFetch from "@/services/api/use-fetch";
import { AUTH_LOGOUT_URL, AUTH_ME_URL } from "@/services/api/config";
import HTTP_CODES_ENUM from "../api/types/http-codes";
import {
  getTokensInfo,
  setTokensInfo as setTokensInfoToStorage,
} from "./auth-tokens-info";
import useLanguage from "@/services/i18n/use-language";
import { AUTH_TOKEN_KEY } from "./config";

function AuthProvider(props: PropsWithChildren<{}>) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [authMethod, setAuthMethod] = useState<"local" | "keycloak" | null>(
    null
  );
  const [onboardingState, setOnboardingState] = useState({
    userOnboarded: false,
    tenantOnboarded: false,
  });

  const fetchBase = useFetch();
  const language = useLanguage();

  const setTokensInfo = useCallback((tokensInfo: TokensInfo) => {
    setTokensInfoToStorage(tokensInfo);

    if (!tokensInfo) {
      setUser(null);
      setTenant(null);
      setOnboardingState({
        userOnboarded: false,
        tenantOnboarded: false,
      });
    }
  }, []);

  const logOut = useCallback(async () => {
    const tokens = getTokensInfo();

    if (tokens?.token) {
      await fetchBase(AUTH_LOGOUT_URL, {
        method: "POST",
      });
    }

    setTokensInfo(null);
    localStorage.removeItem(AUTH_TOKEN_KEY);

    // Force full redirect to clear state
    window.location.href = `/${language}/sign-in`;
  }, [setTokensInfo, fetchBase, language]);

  const loadData = useCallback(async () => {
    const tokens = getTokensInfo();

    try {
      if (tokens?.token) {
        const response = await fetchBase(AUTH_ME_URL, {
          method: "GET",
        });

        if (response.status === HTTP_CODES_ENUM.UNAUTHORIZED) {
          logOut();
          return;
        }

        const data = await response.json();
        setUser(data.user);
        setTenant(data.tenant);

        // Update onboarding state
        setOnboardingState({
          userOnboarded: data.user?.fullyOnboarded || false,
          tenantOnboarded: data.tenant?.fullyOnboarded || false,
        });
      }
    } finally {
      setIsInitialized(true);
    }
  }, [fetchBase, logOut]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (user && tenant) {
      setOnboardingState({
        userOnboarded: user.fullyOnboarded || false,
        tenantOnboarded: tenant.fullyOnboarded || false,
      });
    }
  }, [user, tenant]);
  //Session Timeout:
  useEffect(() => {
    const timeout = setTimeout(
      () => {
        if (user) logOut();
      },
      60 * 60 * 1000
    ); // 1 hour

    return () => clearTimeout(timeout);
  }, [user, logOut]);
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === AUTH_TOKEN_KEY) {
        if (!event.newValue) logOut();
        else loadData();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [logOut, loadData]);
  const contextValue = useMemo(
    () => ({
      isInitialized,
      isLoaded: isInitialized,
      user,
      tenant,
      authMethod,
      onboardingState,
    }),
    [isInitialized, user, tenant, authMethod, onboardingState]
  );

  const contextActionsValue = useMemo(
    () => ({
      setUser,
      setTenant,
      logOut,
      setAuthMethod,
    }),
    [logOut]
  );

  const contextTokensValue = useMemo(
    () => ({
      setTokensInfo,
    }),
    [setTokensInfo]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      <AuthActionsContext.Provider value={contextActionsValue}>
        <AuthTokensContext.Provider value={contextTokensValue}>
          {props.children}
        </AuthTokensContext.Provider>
      </AuthActionsContext.Provider>
    </AuthContext.Provider>
  );
}

export default AuthProvider;
