import { useCallback } from "react";
import useFetch from "../use-fetch";
import { API_URL } from "../config";
import wrapperFetchJsonResponse from "../wrapper-fetch-json-response";
import { InfinityPaginationType } from "../types/infinity-pagination";
import { SortEnum } from "../types/sort-type";
import { RequestConfigType } from "./types/request-config";
import { PlanStatusEnum } from "../types/other";

export type CustomerPlanEntity = {
  id: string;
  tenant: { id: string };
  customSchedule?: {
    lastPaymentDate: Date;
    paymentCount: number;
    nextPaymentDates?: Date[];
  } | null;
  nextPaymentDate?: Date | null;
  assignedBy?: { id: string } | null;
  status: PlanStatusEnum;
  customRates: Record<string, any>;
  endDate?: Date | null;
  startDate: Date;
  plan: Array<{ id: string }>;
  customer: Array<{ id: string }>;
  createdAt: Date;
  updatedAt: Date;
};

export type CustomerPlansRequest = {
  page: number;
  limit: number;
  filters?: {
    status?: PlanStatusEnum;
    tenantId?: string;
    customerId?: string;
    planId?: string;
    startDateFrom?: Date;
    startDateTo?: Date;
  };
  sort?: Array<{
    orderBy: keyof CustomerPlanEntity;
    order: SortEnum;
  }>;
};

export type CustomerPlansResponse = InfinityPaginationType<CustomerPlanEntity>;

export function useGetCustomerPlansService() {
  const fetch = useFetch();

  return useCallback(
    (data: CustomerPlansRequest, requestConfig?: RequestConfigType) => {
      const requestUrl = new URL(`${API_URL}/v1/customer-plans`);
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
        if (data.filters.startDateFrom) {
          requestUrl.searchParams.append(
            "startDateFrom",
            data.filters.startDateFrom.toISOString()
          );
        }
        if (data.filters.startDateTo) {
          requestUrl.searchParams.append(
            "startDateTo",
            data.filters.startDateTo.toISOString()
          );
        }
      }

      if (data.sort) {
        requestUrl.searchParams.append("sort", JSON.stringify(data.sort));
      }

      return fetch(requestUrl, {
        method: "GET",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<CustomerPlansResponse>);
    },
    [fetch]
  );
}

export type CustomerPlanRequest = {
  id: CustomerPlanEntity["id"];
};

export type CustomerPlanResponse = CustomerPlanEntity;

export function useGetCustomerPlanService() {
  const fetch = useFetch();

  return useCallback(
    (data: CustomerPlanRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/customer-plans/${data.id}`, {
        method: "GET",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<CustomerPlanResponse>);
    },
    [fetch]
  );
}

export type CustomerPlanPostRequest = Omit<
  CustomerPlanEntity,
  "id" | "createdAt" | "updatedAt"
> & {
  tenantId: string;
  planIds: string[];
  customerIds: string[];
  assignedById?: string;
};

export type CustomerPlanPostResponse = CustomerPlanEntity;

export function usePostCustomerPlanService() {
  const fetch = useFetch();

  return useCallback(
    (data: CustomerPlanPostRequest, requestConfig?: RequestConfigType) => {
      const { tenantId, planIds, customerIds, assignedById, ...restData } =
        data;

      const requestBody = {
        ...restData,
        tenant: { id: tenantId },
        plan: planIds.map((id) => ({ id })),
        customer: customerIds.map((id) => ({ id })),
        assignedBy: assignedById ? { id: assignedById } : null,
      };

      return fetch(`${API_URL}/v1/customer-plans`, {
        method: "POST",
        body: JSON.stringify(requestBody),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<CustomerPlanPostResponse>);
    },
    [fetch]
  );
}

export type CustomerPlanPatchRequest = {
  id: CustomerPlanEntity["id"];
  data: Partial<
    Omit<CustomerPlanPostRequest, "tenantId" | "planIds" | "customerIds"> & {
      tenantId?: string;
      planIds?: string[];
      customerIds?: string[];
    }
  >;
};

export type CustomerPlanPatchResponse = CustomerPlanEntity;

export function usePatchCustomerPlanService() {
  const fetch = useFetch();

  return useCallback(
    (data: CustomerPlanPatchRequest, requestConfig?: RequestConfigType) => {
      const { tenantId, planIds, customerIds, ...restData } = data.data;
      const requestBody: any = { ...restData };

      if (tenantId) {
        requestBody.tenant = { id: tenantId };
      }
      if (planIds) {
        requestBody.plan = planIds.map((id) => ({ id }));
      }
      if (customerIds) {
        requestBody.customer = customerIds.map((id) => ({ id }));
      }

      return fetch(`${API_URL}/v1/customer-plans/${data.id}`, {
        method: "PATCH",
        body: JSON.stringify(requestBody),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<CustomerPlanPatchResponse>);
    },
    [fetch]
  );
}

export type CustomerPlanDeleteRequest = {
  id: CustomerPlanEntity["id"];
};

export type CustomerPlanDeleteResponse = undefined;

export function useDeleteCustomerPlanService() {
  const fetch = useFetch();

  return useCallback(
    (data: CustomerPlanDeleteRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/customer-plans/${data.id}`, {
        method: "DELETE",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<CustomerPlanDeleteResponse>);
    },
    [fetch]
  );
}
