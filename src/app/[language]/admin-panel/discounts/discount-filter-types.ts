import {
  DiscountTypeEnum,
  DiscountEntity,
} from "@/services/api/services/discounts";
import { SortEnum } from "@/services/api/types/sort-type";

export type DiscountFilterType = {
  isActive?: boolean;
  type?: DiscountTypeEnum;
  tenantId?: string;
  regionId?: string;
  customerId?: string;
  planId?: string;
  validFrom?: Date;
  validTo?: Date;
};

export type DiscountSortType = {
  orderBy: keyof DiscountEntity;
  order: SortEnum;
};
