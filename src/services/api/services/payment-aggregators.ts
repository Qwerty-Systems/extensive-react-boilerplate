// services/api/services/payment-aggregators.ts
import { useCallback } from "react";
import useFetch from "../use-fetch";
import { API_URL } from "../config";
import wrapperFetchJsonResponse from "../wrapper-fetch-json-response";
import { InfinityPaginationType } from "../types/infinity-pagination";
import { SortEnum } from "../types/sort-type";
import { RequestConfigType } from "./types/request-config";

export type PaymentAggregatorConfig = {
  webhookUrl: string;
  authToken: string;
  reconciliationWindow: number;
};

export type PaymentAggregatorEntity = {
  id: string;
  logo?: string | null;
  isActive: boolean;
  tenant: { id: string };
  config?: PaymentAggregatorConfig | null;
  name?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type PaymentAggregatorsRequest = {
  page: number;
  limit: number;
  filters?: {
    isActive?: boolean;
    tenantId?: string;
    name?: string;
  };
  sort?: Array<{
    orderBy: keyof PaymentAggregatorEntity;
    order: SortEnum;
  }>;
};

export type PaymentAggregatorsResponse =
  InfinityPaginationType<PaymentAggregatorEntity>;

export function useGetPaymentAggregatorsService() {
  const fetch = useFetch();

  return useCallback(
    (data: PaymentAggregatorsRequest, requestConfig?: RequestConfigType) => {
      const requestUrl = new URL(`${API_URL}/v1/payment-aggregators`);
      requestUrl.searchParams.append("page", data.page.toString());
      requestUrl.searchParams.append("limit", data.limit.toString());

      if (data.filters) {
        if (data.filters.isActive !== undefined) {
          requestUrl.searchParams.append(
            "isActive",
            String(data.filters.isActive)
          );
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
      }).then(wrapperFetchJsonResponse<PaymentAggregatorsResponse>);
    },
    [fetch]
  );
}

export type PaymentAggregatorRequest = {
  id: PaymentAggregatorEntity["id"];
};

export type PaymentAggregatorResponse = PaymentAggregatorEntity;

export function useGetPaymentAggregatorService() {
  const fetch = useFetch();

  return useCallback(
    (data: PaymentAggregatorRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/payment-aggregators/${data.id}`, {
        method: "GET",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<PaymentAggregatorResponse>);
    },
    [fetch]
  );
}

export type PaymentAggregatorPostRequest = Omit<
  PaymentAggregatorEntity,
  "id" | "createdAt" | "updatedAt" | "tenant"
> & {
  tenantId: string;
};

export type PaymentAggregatorPostResponse = PaymentAggregatorEntity;

export function usePostPaymentAggregatorService() {
  const fetch = useFetch();

  return useCallback(
    (data: PaymentAggregatorPostRequest, requestConfig?: RequestConfigType) => {
      const { tenantId, ...restData } = data;

      const requestBody = {
        ...restData,
        tenant: { id: tenantId },
      };

      return fetch(`${API_URL}/v1/payment-aggregators`, {
        method: "POST",
        body: JSON.stringify(requestBody),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<PaymentAggregatorPostResponse>);
    },
    [fetch]
  );
}

export type PaymentAggregatorPatchRequest = {
  id: PaymentAggregatorEntity["id"];
  data: Partial<PaymentAggregatorPostRequest>;
};

export type PaymentAggregatorPatchResponse = PaymentAggregatorEntity;

export function usePatchPaymentAggregatorService() {
  const fetch = useFetch();

  return useCallback(
    (
      data: PaymentAggregatorPatchRequest,
      requestConfig?: RequestConfigType
    ) => {
      const { tenantId, ...restData } = data.data;
      const requestBody: any = { ...restData };

      if (tenantId) {
        requestBody.tenant = { id: tenantId };
      }

      return fetch(`${API_URL}/v1/payment-aggregators/${data.id}`, {
        method: "PATCH",
        body: JSON.stringify(requestBody),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<PaymentAggregatorPatchResponse>);
    },
    [fetch]
  );
}

export type PaymentAggregatorDeleteRequest = {
  id: PaymentAggregatorEntity["id"];
};

export type PaymentAggregatorDeleteResponse = undefined;

export function useDeletePaymentAggregatorService() {
  const fetch = useFetch();

  return useCallback(
    (
      data: PaymentAggregatorDeleteRequest,
      requestConfig?: RequestConfigType
    ) => {
      return fetch(`${API_URL}/v1/payment-aggregators/${data.id}`, {
        method: "DELETE",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<PaymentAggregatorDeleteResponse>);
    },
    [fetch]
  );
}
