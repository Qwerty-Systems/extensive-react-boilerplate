export interface Tenant {
  fullyOnboarded?: boolean;
  databaseConfig?: string;
  domain?: string;
  regions?: string[];
  settings?: string[];
  schemaName?: string;
  logo?: FileEntity;
  address?: string;
  primaryPhone?: string;
  primaryEmail?: string;
  name?: string;
  type?: TenantType;
  kycSubmissions?: string[];
  users?: string[];
  isActive?: boolean;
  id?: string;
  createdAt?: string;
  updatedAt?: string;
}
export interface FileEntity {
  id?: string;
  path?: string;
}
export interface TenantType {
  description?: string;
  code?: string;
  name?: string;
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export enum TenantTypeCode {
  PLATFORM_OWNER = "platform_owner",
  // add other variants as needed
}
