import { Role } from "@/services/api/types/role";
import { SortEnum } from "@/services/api/types/sort-type";
import { User } from "@/services/api/types/user";

export type CustomerFilterType = {
  roles?: Role[];
  tenantId?: String;
};

export type CustomerSortType = {
  orderBy: keyof User;
  order: SortEnum;
};
