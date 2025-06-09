import { PaymentAggregatorEntity } from "@/services/api/services/payment-aggregators";
import { SortEnum } from "@/services/api/types/sort-type";

export type PaymentAggregatorFilterType = {
  isActive?: boolean;
  tenantId?: string;
  name?: string;
};

export type PaymentAggregatorSortType = {
  orderBy: keyof PaymentAggregatorEntity;
  order: SortEnum;
};
