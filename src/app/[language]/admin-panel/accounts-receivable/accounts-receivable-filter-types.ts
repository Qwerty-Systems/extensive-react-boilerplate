import { AccountsReceivable } from "@/services/api/services/accounts-receivables";
import { SortEnum } from "@/services/api/types/sort-type";

export type AccountsReceivableFilterType = {
  tenantId?: string;
  accountType?: string;
  transactionType?: string;
};

export type AccountsReceivableSortType = {
  orderBy: keyof AccountsReceivable;
  order: SortEnum;
};
