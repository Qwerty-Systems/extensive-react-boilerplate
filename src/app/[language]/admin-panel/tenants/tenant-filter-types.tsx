import { SortEnum } from "@/services/api/types/sort-type";
import { Tenant, TenantType } from "@/services/api/types/tenant";

export type TenantFilterType = {
  isActive?: boolean;
  type?: string[]; // Array of tenant type codes
};

export type TenantSortType = {
  orderBy: keyof Tenant;
  order: SortEnum;
};
export type TenantTypeFilterType = {
  code?: string[];
};

export type TenantTypeSortType = {
  orderBy: keyof TenantType;
  order: SortEnum;
};
