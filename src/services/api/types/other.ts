export enum Address {
  String = "string",
}

export interface Logo {
  id?: string;
  path?: string;
}

export interface DocumentData {
  frontUrl?: string;
  backUrl?: string;
  expiryDate?: Date;
}
export interface Photo {
  id?: string;
  path?: string;
}
export interface Boundary {
  type?: string;
  coordinates?: Array<Array<number[]>>;
}

export interface OperatingHours {
  days?: string[];
  startTime?: string;
  endTime?: string;
}

// export interface Role {
//   tenant?: Tenant;
//   id?: number;
//   name?: string;
// }

export interface Config {
  currency?: string;
  notificationPreferences?: NotificationPreferences;
}

export interface NotificationPreferences {
  email?: boolean;
  sms?: boolean;
}

export interface Status {
  id?: number;
  name?: string;
}
