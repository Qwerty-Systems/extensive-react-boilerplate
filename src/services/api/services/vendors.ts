import { useCallback } from "react";
import useFetch from "../use-fetch";
import { API_URL } from "../config";
import wrapperFetchJsonResponse from "../wrapper-fetch-json-response";
import { InfinityPaginationType } from "../types/infinity-pagination";
import { SortEnum } from "../types/sort-type";
import { RequestConfigType } from "./types/request-config";
import { Tenant } from "../types/tenant";
import { VendorBill } from "./vendor-bills";

export type Vendor = {
  id: string;
  name: string;
  contactEmail?: string;
  paymentTerms?: string;
  tenant: Tenant;
  bills?: VendorBill[];
  createdAt: Date;
  updatedAt: Date;
};
export type VendorsRequest = {
  page: number;
  limit: number;
  filters?: {
    tenantId?: string;
    name?: string;
    contactEmail?: string;
  };
  sort?: Array<{
    orderBy: keyof Vendor;
    order: SortEnum;
  }>;
};

export type VendorsResponse = InfinityPaginationType<Vendor>;

export function useGetVendorsService() {
  const fetch = useFetch();

  return useCallback(
    (data: VendorsRequest, requestConfig?: RequestConfigType) => {
      const requestUrl = new URL(`${API_URL}/v1/vendors`);
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
      }).then(wrapperFetchJsonResponse<VendorsResponse>);
    },
    [fetch]
  );
}

export type VendorRequest = {
  id: Vendor["id"];
};

export type VendorResponse = Vendor;

export function useGetVendorService() {
  const fetch = useFetch();

  return useCallback(
    (data: VendorRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/vendors/${data.id}`, {
        method: "GET",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<VendorResponse>);
    },
    [fetch]
  );
}

export type VendorPostRequest = Pick<
  Vendor,
  "name" | "contactEmail" | "paymentTerms"
> & {
  tenantId: string;
};

export type VendorPostResponse = Vendor;

export function usePostVendorService() {
  const fetch = useFetch();

  return useCallback(
    (data: VendorPostRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/vendors`, {
        method: "POST",
        body: JSON.stringify(data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<VendorPostResponse>);
    },
    [fetch]
  );
}

export type VendorPatchRequest = {
  id: Vendor["id"];
  data: Partial<VendorPostRequest>;
};

export type VendorPatchResponse = Vendor;

export function usePatchVendorService() {
  const fetch = useFetch();

  return useCallback(
    (data: VendorPatchRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/vendors/${data.id}`, {
        method: "PATCH",
        body: JSON.stringify(data.data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<VendorPatchResponse>);
    },
    [fetch]
  );
}

export type VendorDeleteRequest = {
  id: Vendor["id"];
};

export type VendorDeleteResponse = undefined;

export function useDeleteVendorService() {
  const fetch = useFetch();

  return useCallback(
    (data: VendorDeleteRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/vendors/${data.id}`, {
        method: "DELETE",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<VendorDeleteResponse>);
    },
    [fetch]
  );
}
