// services/api/services/invoices.ts
import { useCallback } from "react";
import useFetch from "../use-fetch";
import { API_URL } from "../config";
import wrapperFetchJsonResponse from "../wrapper-fetch-json-response";
import { InfinityPaginationType } from "../types/infinity-pagination";
import { SortEnum } from "../types/sort-type";
import { RequestConfigType } from "./types/request-config";

export enum InvoiceStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  CANCELLED = "CANCELLED",
  OVERDUE = "OVERDUE",
  FAILED = "FAILED",
}
export type InvoiceEntity = {
  id: string;
  invoiceNumber: string;
  tenant: { id: string };
  exemption?: { id: string } | null;
  discount?: { id: string } | null;
  accountsReceivable?: { id: string } | null;
  amountDue?: number | null;
  amountPaid?: number | null;
  plan?: Array<{ id: string }> | null;
  breakdown?: {
    baseAmount: number;
    discounts: number;
    tax: number;
    adjustments: number;
  } | null;
  status: InvoiceStatus;
  dueDate?: Date | null;
  amount: number;
  customer?: { id: string } | null;
  createdAt: Date;
  updatedAt: Date;
};

export type InvoicesRequest = {
  page: number;
  limit: number;
  filters?: {
    status?: InvoiceStatus;
    tenantId?: string;
    customerId?: string;
    planId?: string;
    dueDateFrom?: Date;
    dueDateTo?: Date;
    amountMin?: number;
    amountMax?: number;
  };
  sort?: Array<{
    orderBy: keyof InvoiceEntity;
    order: SortEnum;
  }>;
};

export type InvoicesResponse = InfinityPaginationType<InvoiceEntity>;

export function useGetInvoicesService() {
  const fetch = useFetch();

  return useCallback(
    (data: InvoicesRequest, requestConfig?: RequestConfigType) => {
      const requestUrl = new URL(`${API_URL}/v1/invoices`);
      requestUrl.searchParams.append("page", data.page.toString());
      requestUrl.searchParams.append("limit", data.limit.toString());

      if (data.filters) {
        if (data.filters.status) {
          requestUrl.searchParams.append("status", data.filters.status);
        }
        if (data.filters.tenantId) {
          requestUrl.searchParams.append("tenantId", data.filters.tenantId);
        }
        if (data.filters.customerId) {
          requestUrl.searchParams.append("customerId", data.filters.customerId);
        }
        if (data.filters.planId) {
          requestUrl.searchParams.append("planId", data.filters.planId);
        }
        if (data.filters.dueDateFrom) {
          requestUrl.searchParams.append(
            "dueDateFrom",
            data.filters.dueDateFrom.toISOString()
          );
        }
        if (data.filters.dueDateTo) {
          requestUrl.searchParams.append(
            "dueDateTo",
            data.filters.dueDateTo.toISOString()
          );
        }
        if (data.filters.amountMin !== undefined) {
          requestUrl.searchParams.append(
            "amountMin",
            data.filters.amountMin.toString()
          );
        }
        if (data.filters.amountMax !== undefined) {
          requestUrl.searchParams.append(
            "amountMax",
            data.filters.amountMax.toString()
          );
        }
      }

      if (data.sort) {
        requestUrl.searchParams.append("sort", JSON.stringify(data.sort));
      }

      return fetch(requestUrl, {
        method: "GET",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<InvoicesResponse>);
    },
    [fetch]
  );
}

export type InvoiceRequest = {
  id: InvoiceEntity["id"];
};

export type InvoiceResponse = InvoiceEntity;

export function useGetInvoiceService() {
  const fetch = useFetch();

  return useCallback(
    (data: InvoiceRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/invoices/${data.id}`, {
        method: "GET",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<InvoiceResponse>);
    },
    [fetch]
  );
}

export type InvoicePostRequest = Omit<
  InvoiceEntity,
  | "id"
  | "createdAt"
  | "updatedAt"
  | "tenant"
  | "exemption"
  | "discount"
  | "accountsReceivable"
  | "plan"
  | "customer"
> & {
  tenantId: string;
  exemptionId?: string;
  discountId?: string;
  accountsReceivableId?: string;
  planIds?: string[];
  customerId?: string;
};

export type InvoicePostResponse = InvoiceEntity;

export function usePostInvoiceService() {
  const fetch = useFetch();

  return useCallback(
    (data: InvoicePostRequest, requestConfig?: RequestConfigType) => {
      const {
        tenantId,
        exemptionId,
        discountId,
        accountsReceivableId,
        planIds,
        customerId,
        ...restData
      } = data;

      const requestBody = {
        ...restData,
        tenant: { id: tenantId },
        exemption: exemptionId ? { id: exemptionId } : null,
        discount: discountId ? { id: discountId } : null,
        accountsReceivable: accountsReceivableId
          ? { id: accountsReceivableId }
          : null,
        plan: planIds ? planIds.map((id) => ({ id })) : null,
        customer: customerId ? { id: customerId } : null,
      };

      return fetch(`${API_URL}/v1/invoices`, {
        method: "POST",
        body: JSON.stringify(requestBody),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<InvoicePostResponse>);
    },
    [fetch]
  );
}

export type InvoicePatchRequest = {
  id: InvoiceEntity["id"];
  data: Partial<InvoicePostRequest>;
};

export type InvoicePatchResponse = InvoiceEntity;

export function usePatchInvoiceService() {
  const fetch = useFetch();

  return useCallback(
    (data: InvoicePatchRequest, requestConfig?: RequestConfigType) => {
      const {
        tenantId,
        exemptionId,
        discountId,
        accountsReceivableId,
        planIds,
        customerId,
        ...restData
      } = data.data;

      const requestBody: any = { ...restData };

      if (tenantId) requestBody.tenant = { id: tenantId };
      if (exemptionId) requestBody.exemption = { id: exemptionId };
      if (discountId) requestBody.discount = { id: discountId };
      if (accountsReceivableId)
        requestBody.accountsReceivable = { id: accountsReceivableId };
      if (planIds) requestBody.plan = planIds.map((id) => ({ id }));
      if (customerId) requestBody.customer = { id: customerId };

      return fetch(`${API_URL}/v1/invoices/${data.id}`, {
        method: "PATCH",
        body: JSON.stringify(requestBody),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<InvoicePatchResponse>);
    },
    [fetch]
  );
}

export type InvoiceDeleteRequest = {
  id: InvoiceEntity["id"];
};

export type InvoiceDeleteResponse = undefined;

export function useDeleteInvoiceService() {
  const fetch = useFetch();

  return useCallback(
    (data: InvoiceDeleteRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/invoices/${data.id}`, {
        method: "DELETE",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<InvoiceDeleteResponse>);
    },
    [fetch]
  );
}
