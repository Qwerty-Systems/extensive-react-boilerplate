import {
  PaymentMethod,
  PaymentNotificationEntity,
  PaymentProvider,
  PaymentStatus,
} from "@/services/api/services/payment-notifications";
import { SortEnum } from "@/services/api/types/sort-type";

export type PaymentNotificationFilterType = {
  status?: PaymentStatus;
  tenantId?: string;
  aggregatorId?: string;
  provider?: PaymentProvider;
  payment_method?: PaymentMethod;
  received_atFrom?: Date;
  received_atTo?: Date;
  amountMin?: number;
  amountMax?: number;
  processed?: boolean;
};

export type PaymentNotificationSortType = {
  orderBy: keyof PaymentNotificationEntity;
  order: SortEnum;
};
