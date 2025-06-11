import { CreditBalance } from "@/services/api/services/credit-balances";
import { SortEnum } from "@/services/api/types/sort-type";

export type CreditBalanceFilterType = {
  tenantId?: string;
  userId?: string;
  minAmount?: number;
  maxAmount?: number;
};

export type CreditBalanceSortType = {
  orderBy: keyof CreditBalance;
  order: SortEnum;
};
