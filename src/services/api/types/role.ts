import { Tenant } from "./tenant";

export enum RoleEnum {
  ADMIN = "Admin",
  PLATFORM_OWNER = "PlatformOwner",
  AGENT = "Agent",
  USER = "User",
  CUSTOMER = "Customer",
  MANAGER = "Manager",
  FINANCE = "Finance",
  GUEST = "Guest",
}

export interface Role {
  tenant?: Tenant;
  id?: number;
  name?: string;
}
