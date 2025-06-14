import { Role } from "@/services/api/types/role";
import { SortEnum } from "@/services/api/types/sort-type";
import { User } from "@/services/api/types/user";

export type UserFilterType = {
  roles?: Role[];
  tenantId?: String;
};

export type UserSortType = {
  orderBy: keyof User;
  order: SortEnum;
};
