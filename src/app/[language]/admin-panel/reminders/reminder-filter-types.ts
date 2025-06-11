import { Reminder } from "@/services/api/services/reminders";
import { SortEnum } from "@/services/api/types/sort-type";

export type ReminderFilterType = {
  tenantId?: string;
  userId?: string;
  invoiceId?: string;
  status?: string;
  channel?: string;
  scheduledFrom?: string;
  scheduledTo?: string;
};

export type ReminderSortType = {
  orderBy: keyof Reminder;
  order: SortEnum;
};
