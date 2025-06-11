import { useCallback } from "react";
import useFetch from "../use-fetch";
import { API_URL } from "../config";
import wrapperFetchJsonResponse from "../wrapper-fetch-json-response";
import { InfinityPaginationType } from "../types/infinity-pagination";
import { SortEnum } from "../types/sort-type";
import { RequestConfigType } from "./types/request-config";
import { Residence } from "../types/residence"; // Make sure this type is defined

// ===========================
// 1. GET MULTIPLE RESIDENCES
// ===========================

export type ResidencesRequest = {
  page: number;
  limit: number;
  filters?: {
    tenantId?: string;
    regionId?: string;
    active?: boolean;
    name?: string;
  };
  sort?: Array<{
    orderBy: keyof Residence;
    order: SortEnum;
  }>;
};

export type ResidencesResponse = InfinityPaginationType<Residence>;

export function useGetResidencesService() {
  const fetch = useFetch();

  return useCallback(
    (data: ResidencesRequest, requestConfig?: RequestConfigType) => {
      const requestUrl = new URL(`${API_URL}/v1/residences`);
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
      }).then(wrapperFetchJsonResponse<ResidencesResponse>);
    },
    [fetch]
  );
}

// ===========================
// 2. GET SINGLE RESIDENCE
// ===========================

export type ResidenceRequest = {
  id: Residence["id"];
};

export type ResidenceResponse = Residence;

export function useGetResidenceService() {
  const fetch = useFetch();

  return useCallback(
    (data: ResidenceRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/residences/${data.id}`, {
        method: "GET",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<ResidenceResponse>);
    },
    [fetch]
  );
}

// ===========================
// 3. CREATE RESIDENCE
// ===========================

export type ResidencePostRequest = Omit<
  Residence,
  "id" | "createdAt" | "updatedAt"
> & {
  tenantId: string;
  regionId: string;
};

export type ResidencePostResponse = Residence;

export function usePostResidenceService() {
  const fetch = useFetch();

  return useCallback(
    (data: ResidencePostRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/residences`, {
        method: "POST",
        body: JSON.stringify(data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<ResidencePostResponse>);
    },
    [fetch]
  );
}

// ===========================
// 4. UPDATE RESIDENCE
// ===========================

export type ResidencePatchRequest = {
  id: NonNullable<Residence["id"]>;
  data: Partial<ResidencePostRequest>;
};

export type ResidencePatchResponse = Residence;

export function usePatchResidenceService() {
  const fetch = useFetch();

  return useCallback(
    (data: ResidencePatchRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/residences/${data.id}`, {
        method: "PATCH",
        body: JSON.stringify(data.data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<ResidencePatchResponse>);
    },
    [fetch]
  );
}

// ===========================
// 5. DELETE RESIDENCE
// ===========================

export type ResidenceDeleteRequest = {
  id: Residence["id"];
};

export type ResidenceDeleteResponse = undefined;

export function useDeleteResidenceService() {
  const fetch = useFetch();

  return useCallback(
    (data: ResidenceDeleteRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/residences/${data.id}`, {
        method: "DELETE",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<ResidenceDeleteResponse>);
    },
    [fetch]
  );
}
