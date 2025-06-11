import { ExemptionEntity } from "@/services/api/services/exemptions";
import { SortEnum } from "@/services/api/types/sort-type";

export type ExemptionFilterType = {
  tenantId?: string;
  customerId?: string;
  regionId?: string;
  residenceId?: string;
  startDateFrom?: Date;
  startDateTo?: Date;
  endDateFrom?: Date;
  endDateTo?: Date;
};

export type ExemptionSortType = {
  orderBy: keyof ExemptionEntity;
  order: SortEnum;
};
