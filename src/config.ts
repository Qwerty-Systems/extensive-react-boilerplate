// @next
import { Archivo } from "next/font/google";
import { RoleEnum } from "./services/api/types/role";
import { DashboardConfig } from "./types/dashboard";

/***************************  THEME CONSTANT  ***************************/

export const APP_DEFAULT_PATH = "/admin-panel"; /* "/dashboard */

export const DRAWER_WIDTH = 254;
export const MINI_DRAWER_WIDTH = 76 + 1; // 1px - for right-side border

/***************************  THEME ENUM  ***************************/

export let Themes: { THEME_HOSTING?: any } = {};

(function (Themes) {
  Themes["THEME_HOSTING"] = "hosting";
})(Themes || (Themes = {}));

export let ThemeMode: { LIGHT?: any } = {};

(function (ThemeMode) {
  ThemeMode["LIGHT"] = "light";
})(ThemeMode || (ThemeMode = {}));

export let ThemeDirection: { LTR?: any } = {};

(function (ThemeDirection) {
  ThemeDirection["LTR"] = "ltr";
})(ThemeDirection || (ThemeDirection = {}));

export let ThemeI18n: { EN?: any; SW?: any; FR?: any; RO?: any; ZH?: any } = {};

(function (ThemeI18n) {
  ThemeI18n["EN"] = "en";
  ThemeI18n["SW"] = "sw";
  ThemeI18n["FR"] = "fr";
  ThemeI18n["RO"] = "ro";
  ThemeI18n["ZH"] = "zh";
})(ThemeI18n || (ThemeI18n = {}));

/***************************  CONFIG  ***************************/

const config = {
  currentTheme: Themes.THEME_HOSTING,
  mode: ThemeMode.LIGHT,
  themeDirection: ThemeDirection.LTR,
  miniDrawer: false,
  i18n: ThemeI18n.EN,
};

export default config;

/***************************  THEME - FONT FAMILY  ***************************/

const fontArchivo = Archivo({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const defaultWidgets: Record<RoleEnum, DashboardConfig> = {
  [RoleEnum.ADMIN]: {
    layout: "grid",
    widgets: [
      {
        id: "system-health",
        type: "metric",
        title: "System Health",
        x: 0,
        y: 0,
        w: 3,
        h: 2,
        config: undefined,
      },
      {
        id: "revenue",
        type: "metric",
        title: "Monthly Revenue",
        x: 3,
        y: 0,
        w: 3,
        h: 2,
        config: undefined,
      },
      {
        id: "transactions",
        type: "chart",
        title: "Transaction Trends",
        x: 6,
        y: 0,
        w: 6,
        h: 4,
        config: undefined,
      },
      {
        id: "user-growth",
        type: "chart",
        title: "User Growth",
        x: 0,
        y: 2,
        w: 6,
        h: 4,
        config: undefined,
      },
      {
        id: "pending-issues",
        type: "table",
        title: "Pending Issues",
        x: 0,
        y: 6,
        w: 12,
        h: 4,
        config: undefined,
      },
    ],
  },
  [RoleEnum.PLATFORM_OWNER]: {
    layout: "grid",
    widgets: [
      {
        id: "revenue",
        type: "metric",
        title: "Platform Revenue",
        x: 0,
        y: 0,
        w: 4,
        h: 2,
        config: undefined,
      },
      {
        id: "market-share",
        type: "metric",
        title: "Market Share",
        x: 4,
        y: 0,
        w: 4,
        h: 2,
        config: undefined,
      },
      {
        id: "growth",
        type: "chart",
        title: "Platform Growth",
        x: 8,
        y: 0,
        w: 4,
        h: 4,
        config: undefined,
      },
      {
        id: "top-tenants",
        type: "table",
        title: "Top Tenants",
        x: 0,
        y: 2,
        w: 8,
        h: 4,
        config: undefined,
      },
    ],
  },
  [RoleEnum.CUSTOMER]: {
    layout: "grid",
    widgets: [
      {
        id: "pickups-scheduled",
        type: "metric",
        title: "Scheduled Pickups",
        x: 0,
        y: 0,
        w: 4,
        h: 2,
        config: undefined,
      },
      {
        id: "waste-diverted",
        type: "metric",
        title: "Waste Diverted",
        x: 4,
        y: 0,
        w: 4,
        h: 2,
        config: undefined,
      },
      {
        id: "savings",
        type: "metric",
        title: "Cost Savings",
        x: 8,
        y: 0,
        w: 4,
        h: 2,
        config: undefined,
      },
      {
        id: "history",
        type: "table",
        title: "Transaction History",
        x: 0,
        y: 2,
        w: 12,
        h: 4,
        config: undefined,
      },
      {
        id: "impact",
        type: "chart",
        title: "Environmental Impact",
        x: 0,
        y: 6,
        w: 12,
        h: 4,
        config: undefined,
      },
    ],
  },
  [RoleEnum.AGENT]: {
    layout: "grid",
    widgets: [
      {
        id: "assigned-pickups",
        type: "metric",
        title: "Assigned Pickups",
        x: 0,
        y: 0,
        w: 4,
        h: 2,
        config: undefined,
      },
      {
        id: "completed-pickups",
        type: "metric",
        title: "Completed Pickups",
        x: 4,
        y: 0,
        w: 4,
        h: 2,
        config: undefined,
      },
      {
        id: "pickup-map",
        type: "map",
        title: "Pickup Locations",
        x: 0,
        y: 2,
        w: 12,
        h: 5,
        config: undefined,
      },
      {
        id: "schedule",
        type: "table",
        title: "Upcoming Schedule",
        x: 0,
        y: 7,
        w: 12,
        h: 4,
        config: undefined,
      },
    ],
  },
  [RoleEnum.USER]: {
    layout: "grid",
    widgets: [
      {
        id: "my-orders",
        type: "table",
        title: "My Marketplace Orders",
        x: 0,
        y: 0,
        w: 8,
        h: 4,
        config: undefined,
      },
      {
        id: "my-wallet",
        type: "metric",
        title: "Wallet Balance",
        x: 8,
        y: 0,
        w: 4,
        h: 2,
        config: undefined,
      },
      {
        id: "waste-dropped",
        type: "metric",
        title: "Waste Dropped",
        x: 8,
        y: 2,
        w: 4,
        h: 2,
        config: undefined,
      },
      {
        id: "recommendations",
        type: "list",
        title: "Recommended Products/Services",
        x: 0,
        y: 4,
        w: 12,
        h: 4,
        config: undefined,
      },
    ],
  },
  [RoleEnum.MANAGER]: {
    layout: "grid",
    widgets: [
      {
        id: "region-performance",
        type: "chart",
        title: "Regional Performance",
        x: 0,
        y: 0,
        w: 6,
        h: 4,
        config: undefined,
      },
      {
        id: "agent-status",
        type: "table",
        title: "Agent Status Overview",
        x: 6,
        y: 0,
        w: 6,
        h: 4,
        config: undefined,
      },
      {
        id: "escalations",
        type: "table",
        title: "Escalated Issues",
        x: 0,
        y: 4,
        w: 12,
        h: 4,
        config: undefined,
      },
    ],
  },
  [RoleEnum.FINANCE]: {
    layout: "grid",
    widgets: [
      {
        id: "monthly-finance",
        type: "chart",
        title: "Monthly Financial Report",
        x: 0,
        y: 0,
        w: 6,
        h: 4,
        config: undefined,
      },
      {
        id: "invoices",
        type: "table",
        title: "Pending Invoices",
        x: 6,
        y: 0,
        w: 6,
        h: 4,
        config: undefined,
      },
      {
        id: "expenditures",
        type: "metric",
        title: "Expenditure Overview",
        x: 0,
        y: 4,
        w: 6,
        h: 2,
        config: undefined,
      },
      {
        id: "revenues",
        type: "metric",
        title: "Total Revenue",
        x: 6,
        y: 4,
        w: 6,
        h: 2,
        config: undefined,
      },
    ],
  },
  [RoleEnum.GUEST]: {
    layout: "grid",
    widgets: [
      {
        id: "intro",
        type: "text",
        title: "Welcome to the Platform",
        x: 0,
        y: 0,
        w: 12,
        h: 2,
        config: {
          content:
            "Explore services and marketplace offerings. Sign up to get started.",
        },
      },
      {
        id: "overview-video",
        type: "media",
        title: "Platform Overview",
        x: 0,
        y: 2,
        w: 12,
        h: 5,
        config: {
          url: "https://example.com/overview-video.mp4",
        },
      },
    ],
  },
};
export const metricConfigs: Record<string, any> = {
  "system-health": {
    value: "99.98%",
    label: "Uptime",
    change: "+0.02%",
    positive: true,
  },
  "monthly-revenue": {
    value: "$12,540",
    label: "Monthly Revenue",
    change: "+4.5%",
    positive: true,
  },
  "platform-revenue": {
    value: "$45,320",
    label: "Total Revenue",
    change: "+6.1%",
    positive: true,
  },
  "market-share": {
    value: "27%",
    label: "Market Share",
    change: "+1.7%",
    positive: true,
  },
  "pickups-scheduled": {
    value: "154",
    label: "Scheduled Pickups",
    change: "+12%",
    positive: true,
  },
  "waste-diverted": {
    value: "1.2 Tons",
    label: "Waste Diverted",
    change: "+9.4%",
    positive: true,
  },
  savings: {
    value: "$980",
    label: "Cost Savings",
    change: "+2.8%",
    positive: true,
  },
  "assigned-pickups": {
    value: "87",
    label: "Assigned Pickups",
    change: "+3%",
    positive: true,
  },
  "completed-pickups": {
    value: "80",
    label: "Completed Pickups",
    change: "+5%",
    positive: true,
  },
  "my-wallet": {
    value: "$150",
    label: "Wallet Balance",
    change: "+$20",
    positive: true,
  },
  "waste-dropped": {
    value: "320 kg",
    label: "Waste Dropped",
    change: "+3%",
    positive: true,
  },
  expenditures: {
    value: "$7,200",
    label: "Expenditure Overview",
    change: "-1.2%",
    positive: false,
  },
  revenues: {
    value: "$18,300",
    label: "Total Revenue",
    change: "+3.7%",
    positive: true,
  },
};

export const FONT_ARCHIVO = fontArchivo.style.fontFamily;
