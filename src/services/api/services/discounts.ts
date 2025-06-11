// services/api/services/discounts.ts
import { useCallback } from "react";
import useFetch from "../use-fetch";
import { API_URL } from "../config";
import wrapperFetchJsonResponse from "../wrapper-fetch-json-response";
import { InfinityPaginationType } from "../types/infinity-pagination";
import { SortEnum } from "../types/sort-type";
import { RequestConfigType } from "./types/request-config";
// Add the following import or definition for DiscountTypeEnum:
export enum DiscountTypeEnum {
  PERCENTAGE = "PERCENTAGE",
  FIXED = "FIXED",
}

export type DiscountEntity = {
  id: string;
  description?: string | null;
  minVolume?: number | null;
  tenant: { id: string };
  region?: { id: string } | null;
  customer?: { id: string } | null;
  plan?: { id: string } | null;
  isActive: boolean;
  validTo: Date;
  validFrom: Date;
  value: number;
  type: DiscountTypeEnum;
  createdAt: Date;
  updatedAt: Date;
};

export type DiscountsRequest = {
  page: number;
  limit: number;
  filters?: {
    isActive?: boolean;
    type?: DiscountTypeEnum;
    tenantId?: string;
    regionId?: string;
    customerId?: string;
    planId?: string;
    validFrom?: Date;
    validTo?: Date;
  };
  sort?: Array<{
    orderBy: keyof DiscountEntity;
    order: SortEnum;
  }>;
};

export type DiscountsResponse = InfinityPaginationType<DiscountEntity>;

export function useGetDiscountsService() {
  const fetch = useFetch();

  return useCallback(
    (data: DiscountsRequest, requestConfig?: RequestConfigType) => {
      const requestUrl = new URL(`${API_URL}/v1/discounts`);
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
        if (data.filters.regionId) {
          requestUrl.searchParams.append("regionId", data.filters.regionId);
        }
        if (data.filters.customerId) {
          requestUrl.searchParams.append("customerId", data.filters.customerId);
        }
        if (data.filters.planId) {
          requestUrl.searchParams.append("planId", data.filters.planId);
        }
        if (data.filters.validFrom) {
          requestUrl.searchParams.append(
            "validFrom",
            data.filters.validFrom.toISOString()
          );
        }
        if (data.filters.validTo) {
          requestUrl.searchParams.append(
            "validTo",
            data.filters.validTo.toISOString()
          );
        }
      }

      if (data.sort) {
        requestUrl.searchParams.append("sort", JSON.stringify(data.sort));
      }

      return fetch(requestUrl, {
        method: "GET",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<DiscountsResponse>);
    },
    [fetch]
  );
}

export type DiscountRequest = {
  id: DiscountEntity["id"];
};

export type DiscountResponse = DiscountEntity;

export function useGetDiscountService() {
  const fetch = useFetch();

  return useCallback(
    (data: DiscountRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/discounts/${data.id}`, {
        method: "GET",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<DiscountResponse>);
    },
    [fetch]
  );
}

export type DiscountPostRequest = Omit<
  DiscountEntity,
  "id" | "createdAt" | "updatedAt" | "tenant" | "region" | "customer" | "plan"
> & {
  tenantId: string;
  regionId?: string;
  customerId?: string;
  planId?: string;
};

export type DiscountPostResponse = DiscountEntity;

export function usePostDiscountService() {
  const fetch = useFetch();

  return useCallback(
    (data: DiscountPostRequest, requestConfig?: RequestConfigType) => {
      const { tenantId, regionId, customerId, planId, ...restData } = data;

      const requestBody = {
        ...restData,
        tenant: { id: tenantId },
        region: regionId ? { id: regionId } : null,
        customer: customerId ? { id: customerId } : null,
        plan: planId ? { id: planId } : null,
      };

      return fetch(`${API_URL}/v1/discounts`, {
        method: "POST",
        body: JSON.stringify(requestBody),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<DiscountPostResponse>);
    },
    [fetch]
  );
}

export type DiscountPatchRequest = {
  id: DiscountEntity["id"];
  data: Partial<DiscountPostRequest>;
};

export type DiscountPatchResponse = DiscountEntity;

export function usePatchDiscountService() {
  const fetch = useFetch();

  return useCallback(
    (data: DiscountPatchRequest, requestConfig?: RequestConfigType) => {
      const { tenantId, regionId, customerId, planId, ...restData } = data.data;
      const requestBody: any = { ...restData };

      if (tenantId) requestBody.tenant = { id: tenantId };
      if (regionId) requestBody.region = { id: regionId };
      if (customerId) requestBody.customer = { id: customerId };
      if (planId) requestBody.plan = { id: planId };

      return fetch(`${API_URL}/v1/discounts/${data.id}`, {
        method: "PATCH",
        body: JSON.stringify(requestBody),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<DiscountPatchResponse>);
    },
    [fetch]
  );
}

export type DiscountDeleteRequest = {
  id: DiscountEntity["id"];
};

export type DiscountDeleteResponse = undefined;

export function useDeleteDiscountService() {
  const fetch = useFetch();

  return useCallback(
    (data: DiscountDeleteRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/discounts/${data.id}`, {
        method: "DELETE",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<DiscountDeleteResponse>);
    },
    [fetch]
  );
}
