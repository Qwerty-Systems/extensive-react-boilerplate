import { Vendor } from "@/services/api/services/vendors";
import { SortEnum } from "@/services/api/types/sort-type";

export type VendorFilterType = {
  tenantId?: string;
  name?: string;
  contactEmail?: string;
};

export type VendorSortType = {
  orderBy: keyof Vendor;
  order: SortEnum;
};
