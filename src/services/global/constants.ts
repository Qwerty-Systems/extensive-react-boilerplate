export const MODULES = {
  MAINTENANCE: "maintenance",
} as const;

export const SUB_MODULES = {
  MAINTENANCE_WORK_ORDERS: "maintenance.work-orders",
} as const;

export type MODULES = (typeof MODULES)[keyof typeof MODULES];
export type SUB_MODULES = (typeof SUB_MODULES)[keyof typeof SUB_MODULES];
