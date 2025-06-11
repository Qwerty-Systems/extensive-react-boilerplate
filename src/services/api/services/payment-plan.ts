import { useCallback } from "react";
import useFetch from "../use-fetch";
import { API_URL } from "../config";
import wrapperFetchJsonResponse from "../wrapper-fetch-json-response";
import { InfinityPaginationType } from "../types/infinity-pagination";
import { SortEnum } from "../types/sort-type";
import { RequestConfigType } from "./types/request-config";
import { PaymentPlanEntity, PlanType } from "../types/payment-plan";

export type PaymentPlansRequest = {
  page: number;
  limit: number;
  filters?: {
    isActive?: boolean;
    type?: PlanType;
    tenantId?: string;
    name?: string;
  };
  sort?: Array<{
    orderBy: keyof PaymentPlanEntity;
    order: SortEnum;
  }>;
};

export type PaymentPlansResponse = InfinityPaginationType<PaymentPlanEntity>;

export function useGetPaymentPlansService() {
  const fetch = useFetch();

  return useCallback(
    (data: PaymentPlansRequest, requestConfig?: RequestConfigType) => {
      const requestUrl = new URL(`${API_URL}/v1/payment-plans`);
      requestUrl.searchParams.append("page", data.page.toString());
      requestUrl.searchParams.append("limit", data.limit.toString());

      if (data.filters) {
        if (data.filters.isActive !== undefined) {
          requestUrl.searchParams.append(
            "isActive",
            String(data.filters.isActive)
          );
        }
        if (data.filters.type) {
          requestUrl.searchParams.append("type", data.filters.type);
        }
        if (data.filters.tenantId) {
          requestUrl.searchParams.append("tenantId", data.filters.tenantId);
        }
        if (data.filters.name) {
          requestUrl.searchParams.append("name", data.filters.name);
        }
      }

      if (data.sort) {
        requestUrl.searchParams.append("sort", JSON.stringify(data.sort));
      }

      return fetch(requestUrl, {
        method: "GET",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<PaymentPlansResponse>);
    },
    [fetch]
  );
}

export type PaymentPlanRequest = {
  id: PaymentPlanEntity["id"];
};

export type PaymentPlanResponse = PaymentPlanEntity;

export function useGetPaymentPlanService() {
  const fetch = useFetch();

  return useCallback(
    (data: PaymentPlanRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/payment-plans/${data.id}`, {
        method: "GET",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<PaymentPlanResponse>);
    },
    [fetch]
  );
}

export type PaymentPlanPostRequest = Omit<
  PaymentPlanEntity,
  "id" | "createdAt" | "updatedAt"
> & {
  tenantId: string;
};

export type PaymentPlanPostResponse = PaymentPlanEntity;

export function usePostPaymentPlanService() {
  const fetch = useFetch();

  return useCallback(
    (data: PaymentPlanPostRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/payment-plans`, {
        method: "POST",
        body: JSON.stringify({
          ...data,
          tenant: { id: data.tenantId },
        }),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<PaymentPlanPostResponse>);
    },
    [fetch]
  );
}

export type PaymentPlanPatchRequest = {
  id: PaymentPlanEntity["id"];
  data: Partial<
    Omit<PaymentPlanEntity, "id" | "createdAt" | "updatedAt" | "tenant"> & {
      tenantId?: string;
    }
  >;
};

export type PaymentPlanPatchResponse = PaymentPlanEntity;

export function usePatchPaymentPlanService() {
  const fetch = useFetch();

  return useCallback(
    (data: PaymentPlanPatchRequest, requestConfig?: RequestConfigType) => {
      const { tenantId, ...restData } = data.data;
      const requestBody: any = { ...restData };

      if (tenantId) {
        requestBody.tenant = { id: tenantId };
      }

      return fetch(`${API_URL}/v1/payment-plans/${data.id}`, {
        method: "PATCH",
        body: JSON.stringify(requestBody),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<PaymentPlanPatchResponse>);
    },
    [fetch]
  );
}

export type PaymentPlanDeleteRequest = {
  id: PaymentPlanEntity["id"];
};

export type PaymentPlanDeleteResponse = undefined;

export function useDeletePaymentPlanService() {
  const fetch = useFetch();

  return useCallback(
    (data: PaymentPlanDeleteRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/payment-plans/${data.id}`, {
        method: "DELETE",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<PaymentPlanDeleteResponse>);
    },
    [fetch]
  );
}
