import { useCallback } from "react";
import useFetch from "../use-fetch";
import { API_URL } from "../config";
import wrapperFetchJsonResponse from "../wrapper-fetch-json-response";
import { InfinityPaginationType } from "../types/infinity-pagination";
import { SortEnum } from "../types/sort-type";
import { RequestConfigType } from "./types/request-config";

export interface TenantType {
  id: string;
  code: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export type TenantTypesRequest = {
  page: number;
  limit: number;
  filters?: {
    code?: string[];
  };
  sort?: Array<{
    orderBy: keyof TenantType;
    order: SortEnum;
  }>;
};

export type TenantTypesResponse = InfinityPaginationType<TenantType>;

export function useGetTenantTypesService() {
  const fetch = useFetch();

  return useCallback(
    (data: TenantTypesRequest, requestConfig?: RequestConfigType) => {
      const requestUrl = new URL(`${API_URL}/v1/tenant-types`);
      requestUrl.searchParams.append("page", data.page.toString());
      requestUrl.searchParams.append("limit", data.limit.toString());

      if (data.filters) {
        requestUrl.searchParams.append("filters", JSON.stringify(data.filters));
      }
      if (data.sort) {
        requestUrl.searchParams.append("sort", JSON.stringify(data.sort));
      }

      return fetch(requestUrl, {
        method: "GET",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<TenantTypesResponse>);
    },
    [fetch]
  );
}

export type TenantTypeRequest = {
  id: TenantType["id"];
};

export type TenantTypeResponse = TenantType;

export function useGetTenantTypeService() {
  const fetch = useFetch();

  return useCallback(
    (data: TenantTypeRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/tenant-types/${data.id}`, {
        method: "GET",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<TenantTypeResponse>);
    },
    [fetch]
  );
}

export type TenantTypePostRequest = Pick<
  TenantType,
  "code" | "name" | "description"
>;

export type TenantTypePostResponse = TenantType;

export function usePostTenantTypeService() {
  const fetch = useFetch();

  return useCallback(
    (data: TenantTypePostRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/tenant-types`, {
        method: "POST",
        body: JSON.stringify(data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<TenantTypePostResponse>);
    },
    [fetch]
  );
}

export type TenantTypePatchRequest = {
  id: TenantType["id"];
  data: Partial<Pick<TenantType, "code" | "name" | "description">>;
};

export type TenantTypePatchResponse = TenantType;

export function usePatchTenantTypeService() {
  const fetch = useFetch();

  return useCallback(
    (data: TenantTypePatchRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/tenant-types/${data.id}`, {
        method: "PATCH",
        body: JSON.stringify(data.data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<TenantTypePatchResponse>);
    },
    [fetch]
  );
}

export type TenantTypeDeleteRequest = {
  id: TenantType["id"];
};

export type TenantTypeDeleteResponse = undefined;

export function useDeleteTenantTypeService() {
  const fetch = useFetch();

  return useCallback(
    (data: TenantTypeDeleteRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/tenant-types/${data.id}`, {
        method: "DELETE",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<TenantTypeDeleteResponse>);
    },
    [fetch]
  );
}
