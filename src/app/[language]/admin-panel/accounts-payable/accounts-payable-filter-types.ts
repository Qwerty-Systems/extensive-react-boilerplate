import { AccountsPayable } from "@/services/api/services/accounts-payables";
import { SortEnum } from "@/services/api/types/sort-type";

export type AccountsPayableFilterType = {
  tenantId?: string;
  accountType?: string;
  transactionType?: string;
  itemName?: string;
};

export type AccountsPayableSortType = {
  orderBy: keyof AccountsPayable;
  order: SortEnum;
};
