import { Role } from "@/services/api/types/role";
import { SortEnum } from "@/services/api/types/sort-type";
import { User } from "@/services/api/types/user";

export type AccountFilterType = {
  roles?: Role[];
};

export type AccountSortType = {
  orderBy: keyof User;
  order: SortEnum;
};
