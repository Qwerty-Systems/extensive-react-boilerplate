export interface KycSubmission {
  verifiedBy?: number;
  verifiedAt?: Date;
  submittedAt?: Date;
  status?: StatusEnum;
  documentData?: DocumentData;
  documentNumber?: Address;
  documentType?: Address;
  subjectType?: SubjectType;
  tenant?: KycSubmissionTenant;
  user?: Address;
  id?: Address;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DocumentData {
  frontUrl?: string;
  backUrl?: string;
  expiryDate?: Date;
}

export enum StatusEnum {
  Pending = "pending",
}

export enum SubjectType {
  User = "user",
}

export interface KycSubmissionTenant {
  domain?: Address;
  regions?: Address[];
  settings?: Address[];
  schemaName?: Address;
  logo?: Logo;
  address?: Address;
  primaryPhone?: Address;
  primaryEmail?: Address;
  name?: Address;
  type?: Type;
  kycSubmissions?: Address[];
  users?: Address[];
  isActive?: boolean;
  id?: Address;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Logo {
  id?: string;
  path?: string;
}

export interface Type {
  description?: Address;
  code?: Code;
  name?: Address;
  id?: Address;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum Code {
  PlatformOwner = "platform_owner",
}

export interface Config {
  currency?: string;
  notificationPreferences?: NotificationPreferences;
}

export interface NotificationPreferences {
  email?: boolean;
  sms?: boolean;
}

export interface SettingTenant {
  domain?: Address;
  regions?: Address[];
  settings?: Address[];
  schemaName?: Address;
  logo?: Logo;
  address?: Address;
  primaryPhone?: Address;
  primaryEmail?: Address;
  name?: Address;
  type?: Type;
  kycSubmissions?: KycSubmission[];
  users?: Address[];
  isActive?: boolean;
  id?: Address;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface User {
  regions?: Region[];
  settings?: Setting[];
  kycSubmissions?: KycSubmission[];
  tenant?: RoleTenant;
  id?: number;
  email?: string;
  provider?: string;
  socialId?: string;
  firstName?: string;
  lastName?: string;
  photo?: Logo;
  role?: Role;
  status?: StatusClass;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface Role {
  tenant?: RoleTenant;
  id?: number;
  name?: string;
}

export interface RoleTenant {
  domain?: Address;
  regions?: Region[];
  settings?: Setting[];
  schemaName?: Address;
  logo?: Logo;
  address?: Address;
  primaryPhone?: Address;
  primaryEmail?: Address;
  name?: Address;
  type?: Type;
  kycSubmissions?: KycSubmission[];
  users?: Address[];
  isActive?: boolean;
  id?: Address;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface StatusClass {
  id?: number;
  name?: string;
}
export interface Boundary {
  type?: string;
  coordinates?: Array<Array<number[]>>;
}

export interface OperatingHours {
  days?: Day[];
  startTime?: string;
  endTime?: string;
}

export enum Day {
  Fri = "fri",
  Mon = "mon",
  Wed = "wed",
}
export enum Address {
  String = "string",
}
