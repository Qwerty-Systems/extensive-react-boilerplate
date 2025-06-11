import { Account, AccountTypeEnum } from "@/services/api/services/accounts";
import { SortEnum } from "@/services/api/types/sort-type";

export type AccountFilterType = {
  type?: AccountTypeEnum[];
  active?: boolean;
  tenantId?: string;
};

export type AccountSortType = {
  orderBy: keyof Account;
  order: SortEnum;
};
