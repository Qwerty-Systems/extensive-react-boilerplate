import { KycSubmission } from "./kyc";
import { Logo } from "./other";
import { Region } from "./region";
import { Role } from "./role";
import { Setting } from "./settings";
import { Tenant } from "./tenant";

export type Residence = {
  type?: string;
  occupants?: Occupant[];
  region?: Region;
  tenant?: Tenant;
  isActive?: boolean;
  charge?: number;
  name?: "string";
  id?: "string";
  createdAt?: Date;
  updatedAt?: Date;
};

export type Occupant = {
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
  photo?: Logo;
  role?: Role;
  status?: any;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};

export enum ResidenceType {
  APARTMENT = "APARTMENT",
  HOUSE = "HOUSE",
  DUPLEX = "DUPLEX",
  CONDO = "CONDO",
  TOWNHOUSE = "TOWNHOUSE",
  OTHER = "OTHER",
}
