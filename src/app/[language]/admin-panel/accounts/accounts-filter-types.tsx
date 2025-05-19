import { Account } from "@/services/api/types/account";
import { SortEnum } from "@/services/api/types/sort-type";
import {
  AccountTypeEnum,
  NotificationChannelEnum,
} from "@/utils/enum/account-type.enum";

export type AccountFilterType = {
  types?: AccountTypeEnum[]; // filter by account types
  active?: boolean; // filter by active/inactive
  notificationChannel?: NotificationChannelEnum[]; // filter by notification channels
};

export type AccountSortType = {
  orderBy: keyof Account; // e.g. "name" | "balance" | "createdAt" etc.
  order: SortEnum;
};
