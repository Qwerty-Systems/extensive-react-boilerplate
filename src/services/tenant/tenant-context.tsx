"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export const TenantContext = createContext<{
  tenant: any | null;
  setTenant: (tenant: any | null) => void;
}>({
  tenant: null,
  setTenant: () => {},
});

export const useTenant = () => useContext(TenantContext);

export default function TenantProvider({ children }: { children: ReactNode }) {
  const [tenant, setTenant] = useState<any | null>(null);

  return (
    <TenantContext.Provider value={{ tenant, setTenant }}>
      {children}
    </TenantContext.Provider>
  );
}
