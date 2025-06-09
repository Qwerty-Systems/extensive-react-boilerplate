import { AuditAction, AuditLog } from "@/services/api/services/audit-logs";
import { SortEnum } from "@/services/api/types/sort-type";

export type AuditLogFilterType = {
  entityType?: string;
  action?: AuditAction;
  performedByUserId?: string;
  performedByTenantId?: string;
  dateFrom?: string;
  dateTo?: string;
};

export type AuditLogSortType = {
  orderBy: keyof AuditLog;
  order: SortEnum;
};
