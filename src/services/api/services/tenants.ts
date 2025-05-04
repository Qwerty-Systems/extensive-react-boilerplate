import { useCallback } from "react";
import useFetch from "../use-fetch";
import { API_URL } from "../config";
import wrapperFetchJsonResponse from "../wrapper-fetch-json-response";
import { Tenant, TenantType } from "../types/tenant";
import { InfinityPaginationType } from "../types/infinity-pagination";
import { SortEnum } from "../types/sort-type";
import { RequestConfigType } from "./types/request-config";
import { Region } from "../types/region";
import { Setting } from "../types/settings";

export type TenantsRequest = {
  page: number;
  limit: number;
  filters?: {
    isActive?: boolean;
    type?: string[];
  };
  sort?: Array<{
    orderBy: keyof Tenant;
    order: SortEnum;
  }>;
};

export type TenantsResponse = InfinityPaginationType<Tenant>;

export function useGetTenantsService() {
  const fetch = useFetch();

  return useCallback(
    (data: TenantsRequest, requestConfig?: RequestConfigType) => {
      const requestUrl = new URL(`${API_URL}/v1/tenants`);
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
      }).then(wrapperFetchJsonResponse<TenantsResponse>);
    },
    [fetch]
  );
}

export type TenantRequest = {
  id: Tenant["id"];
};

export type TenantResponse = Tenant;

export function useGetTenantService() {
  const fetch = useFetch();

  return useCallback(
    (data: TenantRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/tenants/${data.id}`, {
        method: "GET",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<TenantResponse>);
    },
    [fetch]
  );
}

export type TenantPostRequest = Pick<
  Tenant,
  "name" | "domain" | "schemaName" | "address" | "primaryPhone" | "primaryEmail"
> & {
  type: TenantType["code"]; // Use type code instead of full object
  logo?: File | string; // Allow file upload or existing photo ID
  regions?: Omit<Region, "id" | "tenant" | "createdAt" | "updatedAt">[]; // Region create payloads
};
export type TenantPostResponse = Tenant;

export function usePostTenantService() {
  const fetch = useFetch();

  return useCallback(
    (data: TenantPostRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/tenants`, {
        method: "POST",
        body: JSON.stringify(data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<TenantPostResponse>);
    },
    [fetch]
  );
}

export type TenantPatchRequest = {
  id: NonNullable<Tenant["id"]>;
  data: Partial<
    Pick<
      Tenant,
      | "name"
      | "domain"
      | "schemaName"
      | "address"
      | "primaryPhone"
      | "primaryEmail"
      | "isActive"
    > & {
      type?: {
        id: TenantType["id"];
      };
      logo?: File | string | null; // File for upload, string for existing ID, null for removal
      regions?: Array<
        Partial<Region> & {
          _action?: "update" | "create" | "delete";
          // Include minimum required fields for each action
          id?: string; // Required for update/delete
        }
      >;
      settings?: Array<
        Partial<Setting> & {
          _action?: "update" | "create" | "delete";
          id?: string;
        }
      >;
    }
  >;
};

export type TenantPatchResponse = Tenant;

export function usePatchTenantService() {
  const fetch = useFetch();

  return useCallback(
    (data: TenantPatchRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/tenants/${data.id}`, {
        method: "PATCH",
        body: JSON.stringify(data.data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<TenantPatchResponse>);
    },
    [fetch]
  );
}

export type TenantsDeleteRequest = {
  id: Tenant["id"];
};

export type TenantsDeleteResponse = undefined;

export function useDeleteTenantsService() {
  const fetch = useFetch();

  return useCallback(
    (data: TenantsDeleteRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/tenants/${data.id}`, {
        method: "DELETE",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<TenantsDeleteResponse>);
    },
    [fetch]
  );
}
