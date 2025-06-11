import { useCallback } from "react";
import useFetch from "../use-fetch";
import { API_URL } from "../config";
import wrapperFetchJsonResponse from "../wrapper-fetch-json-response";
import { InfinityPaginationType } from "../types/infinity-pagination";
import { SortEnum } from "../types/sort-type";
import { RequestConfigType } from "./types/request-config";

export type PaymentMethodConfig = {
  provider: string;
  apiKey: string;
  sandboxMode: boolean;
};

export type PaymentMethodEntity = {
  id: string;
  tenant: { id: string };
  config?: PaymentMethodConfig | null;
  processorType: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type PaymentMethodsRequest = {
  page: number;
  limit: number;
  filters?: {
    processorType?: string;
    tenantId?: string;
    name?: string;
    isActive?: boolean;
  };
  sort?: Array<{
    orderBy: keyof PaymentMethodEntity;
    order: SortEnum;
  }>;
};

export type PaymentMethodsResponse =
  InfinityPaginationType<PaymentMethodEntity>;

export function useGetPaymentMethodsService() {
  const fetch = useFetch();

  return useCallback(
    (data: PaymentMethodsRequest, requestConfig?: RequestConfigType) => {
      const requestUrl = new URL(`${API_URL}/v1/payment-methods`);
      requestUrl.searchParams.append("page", data.page.toString());
      requestUrl.searchParams.append("limit", data.limit.toString());

      if (data.filters) {
        if (data.filters.processorType) {
          requestUrl.searchParams.append(
            "processorType",
            data.filters.processorType
          );
        }
        if (data.filters.tenantId) {
          requestUrl.searchParams.append("tenantId", data.filters.tenantId);
        }
        if (data.filters.name) {
          requestUrl.searchParams.append("name", data.filters.name);
        }
        if (data.filters.isActive !== undefined) {
          requestUrl.searchParams.append(
            "isActive",
            String(data.filters.isActive)
          );
        }
      }

      if (data.sort) {
        requestUrl.searchParams.append("sort", JSON.stringify(data.sort));
      }

      return fetch(requestUrl, {
        method: "GET",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<PaymentMethodsResponse>);
    },
    [fetch]
  );
}

export type PaymentMethodRequest = {
  id: PaymentMethodEntity["id"];
};

export type PaymentMethodResponse = PaymentMethodEntity;

export function useGetPaymentMethodService() {
  const fetch = useFetch();

  return useCallback(
    (data: PaymentMethodRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/payment-methods/${data.id}`, {
        method: "GET",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<PaymentMethodResponse>);
    },
    [fetch]
  );
}

export type PaymentMethodPostRequest = Omit<
  PaymentMethodEntity,
  "id" | "createdAt" | "updatedAt" | "tenant"
> & {
  tenantId: string;
};

export type PaymentMethodPostResponse = PaymentMethodEntity;

export function usePostPaymentMethodService() {
  const fetch = useFetch();

  return useCallback(
    (data: PaymentMethodPostRequest, requestConfig?: RequestConfigType) => {
      const { tenantId, ...restData } = data;

      const requestBody = {
        ...restData,
        tenant: { id: tenantId },
      };

      return fetch(`${API_URL}/v1/payment-methods`, {
        method: "POST",
        body: JSON.stringify(requestBody),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<PaymentMethodPostResponse>);
    },
    [fetch]
  );
}

export type PaymentMethodPatchRequest = {
  id: PaymentMethodEntity["id"];
  data: Partial<PaymentMethodPostRequest>;
};

export type PaymentMethodPatchResponse = PaymentMethodEntity;

export function usePatchPaymentMethodService() {
  const fetch = useFetch();

  return useCallback(
    (data: PaymentMethodPatchRequest, requestConfig?: RequestConfigType) => {
      const { tenantId, ...restData } = data.data;
      const requestBody: any = { ...restData };

      if (tenantId) {
        requestBody.tenant = { id: tenantId };
      }

      return fetch(`${API_URL}/v1/payment-methods/${data.id}`, {
        method: "PATCH",
        body: JSON.stringify(requestBody),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<PaymentMethodPatchResponse>);
    },
    [fetch]
  );
}

export type PaymentMethodDeleteRequest = {
  id: PaymentMethodEntity["id"];
};

export type PaymentMethodDeleteResponse = undefined;

export function useDeletePaymentMethodService() {
  const fetch = useFetch();

  return useCallback(
    (data: PaymentMethodDeleteRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/payment-methods/${data.id}`, {
        method: "DELETE",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<PaymentMethodDeleteResponse>);
    },
    [fetch]
  );
}
