"use client";

import { Tokens } from "@/services/api/types/tokens";
import { User } from "@/services/api/types/user";
import { Tenant } from "@/services/api/types/tenant";
import { createContext } from "react";

export type AuthMethod = "local" | "keycloak" | null;
export type TokensInfo = Tokens | null;

export const AuthContext = createContext<{
  user: User | null;
  tenant: Tenant | null;
  isInitialized: boolean;
  authMethod: AuthMethod;
  onboardingState: {
    userOnboarded: boolean;
    tenantOnboarded: boolean;
  };
}>({
  user: null,
  tenant: null,
  isInitialized: false,
  authMethod: null,
  onboardingState: {
    userOnboarded: false,
    tenantOnboarded: false,
  },
});

export const AuthActionsContext = createContext<{
  setUser: (user: User | null) => void;
  setTenant: (tenant: Tenant | null) => void;
  logOut: () => Promise<void>;
  setAuthMethod: (method: AuthMethod) => void;
}>({
  setUser: () => {},
  setTenant: () => {},
  logOut: async () => {},
  setAuthMethod: () => {},
});

export const AuthTokensContext = createContext<{
  setTokensInfo: (tokensInfo: TokensInfo) => void;
}>({
  setTokensInfo: () => {},
});
