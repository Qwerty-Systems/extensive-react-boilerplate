import { FileEntity } from "./file-entity";
import { Role } from "./role";

export enum UserProviderEnum {
  EMAIL = "email",
  GOOGLE = "google",
}

// export type User = {
//   id: string;
//   email: string;
//   firstName?: string;
//   username?: string;
//   phone?: string;
//   lastName?: string;
//   photo?: FileEntity;
//   provider?: UserProviderEnum;
//   socialId?: string;
//   role?: Role;
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   roles?: any;
// };

export interface User {
  regions?: Region[];
  settings?: Setting[];
  kycSubmissions?: KycSubmission[];
  tenant?: Tenant;
  id?: number;
  email?: string;
  provider?: string;
  socialId?: string;
  firstName?: string;
  lastName?: string;
  photo?: FileEntity;
  role?: Role;
  status?: Status;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface KycSubmission {
  verifiedBy?: number;
  verifiedAt?: Date;
  submittedAt?: Date;
  status?: string;
  documentData?: DocumentData;
  documentNumber?: string;
  documentType?: string;
  subjectType?: string;
  tenant?: Tenant;
  user?: string;
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DocumentData {
  frontUrl?: string;
  backUrl?: string;
  expiryDate?: Date;
}

export interface Tenant {
  domain?: string;
  regions?: string[];
  settings?: string[];
  schemaName?: string;
  logo?: Photo;
  address?: string;
  primaryPhone?: string;
  primaryEmail?: string;
  name?: string;
  type?: Type;
  kycSubmissions?: string[];
  users?: string[];
  isActive?: boolean;
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Photo {
  id?: string;
  path?: string;
}

export interface Type {
  description?: string;
  code?: string;
  name?: string;
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Region {
  zipCodes?: string[];
  operatingHours?: OperatingHours;
  serviceTypes?: string[];
  centroidLon?: number;
  centroidLat?: number;
  boundary?: Boundary;
  name?: string;
  tenant?: Tenant;
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
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

export interface Setting {
  config?: Config;
  settingsType?: string;
  subjectType?: string;
  tenant?: Tenant;
  user?: string;
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

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
