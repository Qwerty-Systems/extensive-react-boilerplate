// app/admin-panel/payment-methods/payment-method-filter-types.ts
import { PaymentMethodEntity } from "@/services/api/services/payment-methods";
import { SortEnum } from "@/services/api/types/sort-type";

export type PaymentMethodFilterType = {
  processorType?: string;
  tenantId?: string;
  name?: string;
  isActive?: boolean;
};

export type PaymentMethodSortType = {
  orderBy: keyof PaymentMethodEntity;
  order: SortEnum;
};
