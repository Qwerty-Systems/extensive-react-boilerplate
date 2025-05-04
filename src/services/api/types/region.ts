import { Address, Boundary, OperatingHours } from "./other";
import { Tenant } from "./tenant";

export interface Region {
  zipCodes?: string[];
  operatingHours?: OperatingHours;
  serviceTypes?: string[];
  centroidLon?: number;
  centroidLat?: number;
  boundary?: Boundary;
  name?: Address;
  tenant?: Tenant;
  id?: Address;
  createdAt?: Date;
  updatedAt?: Date;
}
