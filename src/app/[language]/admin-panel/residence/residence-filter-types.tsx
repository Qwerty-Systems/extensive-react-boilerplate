import { SortEnum } from "@/services/api/types/sort-type";
import { Residence, ResidenceType } from "@/services/api/types/residence";

export type ResidenceFilterType = {
  tenantId: string | undefined;
  regionId?: string | undefined;
  active?: boolean | undefined;
  name?: string | undefined;
  types?: ResidenceType[];
};

export type ResidenceSortType = {
  orderBy: keyof Residence;
  order: SortEnum;
};
