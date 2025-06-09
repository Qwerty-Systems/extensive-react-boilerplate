import { VendorBill } from "@/services/api/services/vendor-bills";
import { SortEnum } from "@/services/api/types/sort-type";

export type VendorBillFilterType = {
  tenantId?: string;
  vendorId?: string;
};

export type VendorBillSortType = {
  orderBy: keyof VendorBill;
  order: SortEnum;
};
