import { useCallback } from "react";
import useFetch from "../use-fetch";
import { API_URL } from "../config";
import wrapperFetchJsonResponse from "../wrapper-fetch-json-response";
import { InfinityPaginationType } from "../types/infinity-pagination";
import { SortEnum } from "../types/sort-type";
import { RequestConfigType } from "./types/request-config";
import { Region, Boundary, OperatingHours } from "../types/region";

export type RegionsRequest = {
  page: number;
  limit: number;
  filters?: {
    tenantId?: string;
    serviceTypes?: string[];
    active?: boolean;
  };
  sort?: Array<{
    orderBy: keyof Region;
    order: SortEnum;
  }>;
};

export type RegionsResponse = InfinityPaginationType<Region>;

export function useGetRegionsService() {
  const fetch = useFetch();

  return useCallback(
    (data: RegionsRequest, requestConfig?: RequestConfigType) => {
      const requestUrl = new URL(`${API_URL}/v1/regions`);
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
      }).then(wrapperFetchJsonResponse<RegionsResponse>);
    },
    [fetch]
  );
}

export type RegionRequest = {
  id: Region["id"];
};

export type RegionResponse = Region;

export function useGetRegionService() {
  const fetch = useFetch();

  return useCallback(
    (data: RegionRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/regions/${data.id}`, {
        method: "GET",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<RegionResponse>);
    },
    [fetch]
  );
}

export type RegionPostRequest = Omit<
  Region,
  "id" | "tenant" | "createdAt" | "updatedAt"
> & {
  tenantId: string;
};

export type RegionPostResponse = Region;

export function usePostRegionService() {
  const fetch = useFetch();

  return useCallback(
    (data: RegionPostRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/regions`, {
        method: "POST",
        body: JSON.stringify(data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<RegionPostResponse>);
    },
    [fetch]
  );
}

export type RegionPatchRequest = {
  id: NonNullable<Region["id"]>;
  data: Partial<RegionPostRequest> & {
    boundary?: Partial<Boundary>;
    operatingHours?: Partial<OperatingHours>;
    regions?: Array<
      Partial<Region> & {
        _action?: "update" | "create" | "delete";
        id?: string;
      }
    >;
  };
};

export type RegionPatchResponse = Region;

export function usePatchRegionService() {
  const fetch = useFetch();

  return useCallback(
    (data: RegionPatchRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/regions/${data.id}`, {
        method: "PATCH",
        body: JSON.stringify(data.data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<RegionPatchResponse>);
    },
    [fetch]
  );
}

export type RegionDeleteRequest = {
  id: Region["id"];
};

export type RegionDeleteResponse = undefined;

export function useDeleteRegionService() {
  const fetch = useFetch();

  return useCallback(
    (data: RegionDeleteRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/regions/${data.id}`, {
        method: "DELETE",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<RegionDeleteResponse>);
    },
    [fetch]
  );
}
