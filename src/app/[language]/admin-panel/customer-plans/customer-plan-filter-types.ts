import { CustomerPlanEntity } from "@/services/api/services/customer-payment-plan";
import { SortEnum } from "@/services/api/types/sort-type";

export type CustomerPlanFilterType = {
  status?: string;
  tenantId?: string;
  customerId?: string;
  planId?: string;
  startDateFrom?: Date;
  startDateTo?: Date;
};

export type CustomerPlanSortType = {
  orderBy: keyof CustomerPlanEntity;
  order: SortEnum;
};
