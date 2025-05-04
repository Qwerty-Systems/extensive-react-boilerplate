import { KycSubmission } from "./kyc";
import { Address, Logo } from "./other";
import { Region } from "./region";
import { Setting } from "./settings";
import { User } from "./user";

export interface Tenant {
  domain?: string;
  regions?: Region[];
  settings?: Setting[];
  schemaName?: string;
  logo?: Logo;
  address?: Address;
  primaryPhone?: string;
  primaryEmail?: string;
  name?: string;
  type?: TenantType;
  kycSubmissions?: KycSubmission[];
  users?: User[];
  isActive?: boolean;
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
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
