import { Tenant } from "./tenant";

export interface Setting {
  config?: SettingConfig;
  settingsType?: string;
  subjectType?: string;
  tenant?: Tenant;
  user?: string;
  id?: string;
  createdAt?: string;
  updatedAt?: string;
}
export interface SettingConfig {
  currency?: string;
  notificationPreferences?: NotificationPreferences;
}
export interface NotificationPreferences {
  email?: boolean;
  sms?: boolean;
}
