"use client";

import { createContext, useCallback, useState } from "react";
import defaultConfig from "@/config";
import useLocalStorage from "@/hooks/useLocalStorage";
import { InterfaceType } from "@/components/theme/palette";

const initialState = { ...defaultConfig };

type ConfigContextProps = {
  i18n: any;
  mode: "light" | "dark";
  setColorMode: (mode: "light" | "dark") => void;
  tenantTheme: any;
  setTenantTheme: (theme: any) => void;
  availableThemes: any[];
  themeDirection: "ltr" | "rtl";
  interfaceType?: InterfaceType; // Add new property
  setInterfaceType?: (type: InterfaceType) => void; // Optional setter
};

export const ConfigContext = createContext<ConfigContextProps>({
  ...initialState,
  mode: "light",
  themeDirection: "ltr",
  setColorMode: () => {},
  tenantTheme: {},
  setTenantTheme: () => {},
  availableThemes: [],
});

export default function ConfigProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [config, setConfig] = useLocalStorage("theme-config", {
    ...initialState,
    mode: "light",
    themeDirection: "ltr" as const,
  });

  const [tenantTheme, setTenantTheme] = useState<string>("default");
  const [availableThemes] = useState<any[]>([
    { id: "default", name: "Default Theme" },
  ]);
  const [interfaceType, setInterfaceType] = useState<InterfaceType>("default");

  const setColorMode = useCallback(
    (mode: "light" | "dark") => {
      setConfig((prev: any) => ({ ...prev, mode }));
    },
    [setConfig]
  );

  const contextValue = {
    ...config,
    i18n: config.i18n,
    mode: config.mode || "light", // Ensure fallback
    themeDirection: config.themeDirection || "ltr", // Ensure fallback
    tenantTheme,
    availableThemes,
    interfaceType,
    setTenantTheme,
    setColorMode,
    setInterfaceType,
  };

  return (
    <ConfigContext.Provider value={contextValue}>
      {children}
    </ConfigContext.Provider>
  );
}
