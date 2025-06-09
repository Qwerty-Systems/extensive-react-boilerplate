import { useCallback } from "react";
import useFetch from "../use-fetch";
import { API_URL } from "../config";
import wrapperFetchJsonResponse from "../wrapper-fetch-json-response";
import { InfinityPaginationType } from "../types/infinity-pagination";
import { SortEnum } from "../types/sort-type";
import { RequestConfigType } from "./types/request-config";
import { Tenant } from "../types/tenant";
import { User } from "../types/user";

export type CreditBalance = {
  id: string;
  amount: number;
  tenant: Tenant;
  user: User;
  createdAt: Date;
  updatedAt: Date;
};
export type CreditBalancesRequest = {
  page: number;
  limit: number;
  filters?: {
    tenantId?: string;
    userId?: string;
    minAmount?: number;
    maxAmount?: number;
  };
  sort?: Array<{
    orderBy: keyof CreditBalance;
    order: SortEnum;
  }>;
};

export type CreditBalancesResponse = InfinityPaginationType<CreditBalance>;

export function useGetCreditBalancesService() {
  const fetch = useFetch();

  return useCallback(
    (data: CreditBalancesRequest, requestConfig?: RequestConfigType) => {
      const requestUrl = new URL(`${API_URL}/v1/credit-balances`);
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
      }).then(wrapperFetchJsonResponse<CreditBalancesResponse>);
    },
    [fetch]
  );
}

export type CreditBalanceRequest = {
  id: CreditBalance["id"];
};

export type CreditBalanceResponse = CreditBalance;

export function useGetCreditBalanceService() {
  const fetch = useFetch();

  return useCallback(
    (data: CreditBalanceRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/credit-balances/${data.id}`, {
        method: "GET",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<CreditBalanceResponse>);
    },
    [fetch]
  );
}

export type CreditBalancePostRequest = {
  amount: number;
  tenantId: string;
  userId: string;
};

export type CreditBalancePostResponse = CreditBalance;

export function usePostCreditBalanceService() {
  const fetch = useFetch();

  return useCallback(
    (data: CreditBalancePostRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/credit-balances`, {
        method: "POST",
        body: JSON.stringify(data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<CreditBalancePostResponse>);
    },
    [fetch]
  );
}

export type CreditBalancePatchRequest = {
  id: CreditBalance["id"];
  data: Partial<CreditBalancePostRequest>;
};

export type CreditBalancePatchResponse = CreditBalance;

export function usePatchCreditBalanceService() {
  const fetch = useFetch();

  return useCallback(
    (data: CreditBalancePatchRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/credit-balances/${data.id}`, {
        method: "PATCH",
        body: JSON.stringify(data.data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<CreditBalancePatchResponse>);
    },
    [fetch]
  );
}

export type CreditBalanceDeleteRequest = {
  id: CreditBalance["id"];
};

export type CreditBalanceDeleteResponse = undefined;

export function useDeleteCreditBalanceService() {
  const fetch = useFetch();

  return useCallback(
    (data: CreditBalanceDeleteRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/credit-balances/${data.id}`, {
        method: "DELETE",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<CreditBalanceDeleteResponse>);
    },
    [fetch]
  );
}
