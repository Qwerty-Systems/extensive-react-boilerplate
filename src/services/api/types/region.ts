import { Tenant } from "./tenant";

export interface Region {
  zipCodes?: string[] | string;
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
