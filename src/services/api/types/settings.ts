import { Address, Config } from "./other";
import { Tenant } from "./tenant";

export interface Setting {
  config?: Config;
  settingsType?: string;
  subjectType?: string;
  tenant?: Tenant;
  user?: Address;
  id?: Address;
  createdAt?: Date;
  updatedAt?: Date;
}
