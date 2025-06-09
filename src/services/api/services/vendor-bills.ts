import { useCallback } from "react";
import useFetch from "../use-fetch";
import { API_URL } from "../config";
import wrapperFetchJsonResponse from "../wrapper-fetch-json-response";
import { InfinityPaginationType } from "../types/infinity-pagination";
import { SortEnum } from "../types/sort-type";
import { RequestConfigType } from "./types/request-config";
import { Tenant } from "../types/tenant";
import { Vendor } from "./vendors";
import { AccountsPayable } from "./accounts-payables";
export type VendorBill = {
  id: string;
  tenant: Tenant;
  vendor: Vendor;
  accountsPayable?: AccountsPayable;
  createdAt: Date;
  updatedAt: Date;
};

export type VendorBillsRequest = {
  page: number;
  limit: number;
  filters?: {
    tenantId?: string;
    vendorId?: string;
  };
  sort?: Array<{
    orderBy: keyof VendorBill;
    order: SortEnum;
  }>;
};

export type VendorBillsResponse = InfinityPaginationType<VendorBill>;

export function useGetVendorBillsService() {
  const fetch = useFetch();

  return useCallback(
    (data: VendorBillsRequest, requestConfig?: RequestConfigType) => {
      const requestUrl = new URL(`${API_URL}/v1/vendor-bills`);
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
      }).then(wrapperFetchJsonResponse<VendorBillsResponse>);
    },
    [fetch]
  );
}

export type VendorBillRequest = {
  id: VendorBill["id"];
};

export type VendorBillResponse = VendorBill;

export function useGetVendorBillService() {
  const fetch = useFetch();

  return useCallback(
    (data: VendorBillRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/vendor-bills/${data.id}`, {
        method: "GET",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<VendorBillResponse>);
    },
    [fetch]
  );
}

export type VendorBillPostRequest = {
  tenantId: string;
  vendorId: string;
  accountsPayableId?: string;
};

export type VendorBillPostResponse = VendorBill;

export function usePostVendorBillService() {
  const fetch = useFetch();

  return useCallback(
    (data: VendorBillPostRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/vendor-bills`, {
        method: "POST",
        body: JSON.stringify(data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<VendorBillPostResponse>);
    },
    [fetch]
  );
}

export type VendorBillPatchRequest = {
  id: VendorBill["id"];
  data: Partial<VendorBillPostRequest>;
};

export type VendorBillPatchResponse = VendorBill;

export function usePatchVendorBillService() {
  const fetch = useFetch();

  return useCallback(
    (data: VendorBillPatchRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/vendor-bills/${data.id}`, {
        method: "PATCH",
        body: JSON.stringify(data.data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<VendorBillPatchResponse>);
    },
    [fetch]
  );
}

export type VendorBillDeleteRequest = {
  id: VendorBill["id"];
};

export type VendorBillDeleteResponse = undefined;

export function useDeleteVendorBillService() {
  const fetch = useFetch();

  return useCallback(
    (data: VendorBillDeleteRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/vendor-bills/${data.id}`, {
        method: "DELETE",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<VendorBillDeleteResponse>);
    },
    [fetch]
  );
}
