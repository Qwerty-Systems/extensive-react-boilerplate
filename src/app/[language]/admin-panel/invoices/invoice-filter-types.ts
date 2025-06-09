// app/admin-panel/invoices/invoice-filter-types.ts
import { InvoiceEntity, InvoiceStatus } from "@/services/api/services/invoices";
import { SortEnum } from "@/services/api/types/sort-type";

export type InvoiceFilterType = {
  status?: InvoiceStatus;
  tenantId?: string;
  customerId?: string;
  planId?: string;
  dueDateFrom?: Date;
  dueDateTo?: Date;
  amountMin?: number;
  amountMax?: number;
};

export type InvoiceSortType = {
  orderBy: keyof InvoiceEntity;
  order: SortEnum;
};
