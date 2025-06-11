import { Tenant } from "./tenant";

export interface Region {
  zipCodes?: string[];
  operatingHours?: OperatingHours;
  serviceTypes?: string[];
  centroidLon?: number;
  centroidLat?: number;
  boundary?: GeoJSONPolygon;
  name?: string;
  tenant?: Tenant;
  id?: string;
  createdAt?: string;
  updatedAt?: string;
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
export interface GeoJSONPolygon {
  type?: "Polygon";
  coordinates?: number[][][];
}
