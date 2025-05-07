import { SortEnum } from "@/services/api/types/sort-type";
import { Region } from "@/services/api/types/region";

export type RegionFilterType = {
  tenantId?: string;
  serviceTypes?: string[];
  active?: boolean;
};

export type RegionSortType = {
  orderBy: keyof Region;
  order: SortEnum;
};
