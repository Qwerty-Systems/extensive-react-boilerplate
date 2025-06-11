import { useCallback } from "react";
import useFetch from "../use-fetch";
import { API_URL } from "../config";
import wrapperFetchJsonResponse from "../wrapper-fetch-json-response";
import { InfinityPaginationType } from "../types/infinity-pagination";
import { SortEnum } from "../types/sort-type";
import { RequestConfigType } from "./types/request-config";
import { Tenant } from "../types/tenant";

export type Inventory = {
  id: string;
  itemName?: string;
  itemDescription?: string;
  quantity: number;
  purchasePrice: number;
  salePrice?: number;
  materialType?: string;
  unitOfMeasure?: string;
  accountType: string;
  tenant: Tenant;
  createdAt: Date;
  updatedAt: Date;
};

export type InventoriesRequest = {
  page: number;
  limit: number;
  filters?: {
    tenantId?: string;
    itemName?: string;
    materialType?: string;
    accountType?: string;
    minQuantity?: number;
    maxQuantity?: number;
  };
  sort?: Array<{
    orderBy: keyof Inventory;
    order: SortEnum;
  }>;
};

export type InventoriesResponse = InfinityPaginationType<Inventory>;

export function useGetInventoriesService() {
  const fetch = useFetch();

  return useCallback(
    (data: InventoriesRequest, requestConfig?: RequestConfigType) => {
      const requestUrl = new URL(`${API_URL}/v1/inventories`);
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
      }).then(wrapperFetchJsonResponse<InventoriesResponse>);
    },
    [fetch]
  );
}

export type InventoryRequest = {
  id: Inventory["id"];
};

export type InventoryResponse = Inventory;

export function useGetInventoryService() {
  const fetch = useFetch();

  return useCallback(
    (data: InventoryRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/inventories/${data.id}`, {
        method: "GET",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<InventoryResponse>);
    },
    [fetch]
  );
}

export type InventoryPostRequest = Pick<
  Inventory,
  | "itemName"
  | "itemDescription"
  | "quantity"
  | "purchasePrice"
  | "salePrice"
  | "materialType"
  | "unitOfMeasure"
  | "accountType"
> & {
  tenantId: string;
};

export type InventoryPostResponse = Inventory;

export function usePostInventoryService() {
  const fetch = useFetch();

  return useCallback(
    (data: InventoryPostRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/inventories`, {
        method: "POST",
        body: JSON.stringify(data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<InventoryPostResponse>);
    },
    [fetch]
  );
}

export type InventoryPatchRequest = {
  id: Inventory["id"];
  data: Partial<InventoryPostRequest>;
};

export type InventoryPatchResponse = Inventory;

export function usePatchInventoryService() {
  const fetch = useFetch();

  return useCallback(
    (data: InventoryPatchRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/inventories/${data.id}`, {
        method: "PATCH",
        body: JSON.stringify(data.data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<InventoryPatchResponse>);
    },
    [fetch]
  );
}

export type InventoryDeleteRequest = {
  id: Inventory["id"];
};

export type InventoryDeleteResponse = undefined;

export function useDeleteInventoryService() {
  const fetch = useFetch();

  return useCallback(
    (data: InventoryDeleteRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/inventories/${data.id}`, {
        method: "DELETE",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<InventoryDeleteResponse>);
    },
    [fetch]
  );
}
