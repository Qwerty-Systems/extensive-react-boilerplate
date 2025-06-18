export type DashboardWidget = {
  id: string;
  type: string;
  title: string;
  config: any;
  x: number;
  y: number;
  w: number;
  h: number;
};

export type DashboardConfig = {
  widgets: DashboardWidget[];
  layout: "grid" | "list" | "freeform";
};

export type DashboardSettings = {
  settingsType: "dashboard";
  subjectType: "user" | "tenant";
  config: DashboardConfig;
  user?: { id: string };
  tenant?: { id: string };
};
