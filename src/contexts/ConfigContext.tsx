"use client";

import { createContext, useCallback, useEffect, useState } from "react";
import defaultConfig, { defaultWidgets } from "@/config";
import useLocalStorage from "@/hooks/useLocalStorage";
import { InterfaceType } from "@/components/theme/palette";
import { DashboardConfig, DashboardWidget } from "@/types/dashboard";
import useAuth from "@/services/auth/use-auth";
import { RoleEnum } from "@/services/api/types/role";

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
  widgets: DashboardWidget | any;
  layout: any;
  loading: boolean;
  saveDashboard: (config: DashboardConfig) => Promise<void>;
  resetToDefault: () => void;
};

export const ConfigContext = createContext<ConfigContextProps>({
  ...initialState,
  mode: "light",
  themeDirection: "ltr",
  setColorMode: () => {},
  tenantTheme: {},
  setTenantTheme: () => {},
  availableThemes: [],
  widgets: [
    {
      id: "",
      type: "",
      title: "",
      config: undefined,
      x: 0,
      y: 0,
      w: 0,
      h: 0,
    },
  ],
  layout: undefined,
  loading: false,
  saveDashboard: (): any => {},
  resetToDefault: (): any => {},
});

export default function ConfigProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ThemeConfig, setThemeConfig] = useLocalStorage("theme-config", {
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
      setThemeConfig((prev: any) => ({ ...prev, mode }));
    },
    [setThemeConfig]
  );
  const { user, tenant } = useAuth();
  const [dashboardConfig, setDashboardConfig] = useState<DashboardConfig>({
    widgets: [],
    layout: "grid",
  });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      try {
        //TODO
        // const settings = await fetchSettings({
        //   settingsType: "dashboard",
        //   userId: user?.id,
        //   tenantId: tenant?.id,
        // });
        const settings: any = null;
        if (settings) {
          console.log("appling default settings", settings.config);
          setDashboardConfig(settings.config);
        } else {
          console.log("appling default config", user);
          // Apply role-based default
          const role = user?.role?.name as unknown as RoleEnum;
          console.log("appling default config role", user);
          console.log(
            "appling default config config ",
            defaultWidgets[role] || defaultWidgets[RoleEnum.USER]
          );
          setDashboardConfig(
            defaultWidgets[role] || defaultWidgets[RoleEnum.ADMIN]
          );
        }
      } catch (error) {
        console.error("Failed to load dashboard", error);
        setDashboardConfig(defaultWidgets[RoleEnum.USER]);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [user, tenant]);

  const saveDashboard = async (newConfig: DashboardConfig) => {
    try {
      // TODO
      // await saveSettings({
      //   settingsType: "dashboard",
      //   subjectType: "user",
      //   config: newConfig,
      //   user: { id: user?.id },
      //   tenant: tenant ? { id: tenant.id } : undefined,
      // });
      setDashboardConfig(newConfig);
    } catch (error) {
      console.error("Failed to save dashboard", error);
    }
  };

  const resetToDefault = () => {
    const role = user?.role as unknown as RoleEnum;
    saveDashboard(defaultWidgets[role] || defaultWidgets[RoleEnum.USER]);
  };
  const contextValue = {
    ...ThemeConfig,
    ...dashboardConfig,
    loading,
    saveDashboard,
    resetToDefault,
    i18n: ThemeConfig.i18n,
    mode: ThemeConfig.mode || "light", // Ensure fallback
    themeDirection: ThemeConfig.themeDirection || "ltr", // Ensure fallback
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
