export interface Setting {
  config?: Config;
  settingsType?: string;
  subjectType?: string;
  tenant?: SettingTenant;
  user?: Address;
  id?: Address;
  createdAt?: Date;
  updatedAt?: Date;
}
