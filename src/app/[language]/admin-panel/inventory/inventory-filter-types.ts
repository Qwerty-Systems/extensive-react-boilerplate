import { Inventory } from "@/services/api/services/inventories";
import { SortEnum } from "@/services/api/types/sort-type";

export type InventoryFilterType = {
  tenantId?: string;
  itemName?: string;
  materialType?: string;
  accountType?: string;
  minQuantity?: number;
  maxQuantity?: number;
};

export type InventorySortType = {
  orderBy: keyof Inventory;
  order: SortEnum;
};
