import { useCallback } from "react";
import useFetch from "../use-fetch";
import { API_URL } from "../config";
import wrapperFetchJsonResponse from "../wrapper-fetch-json-response";
import { InfinityPaginationType } from "../types/infinity-pagination";
import { SortEnum } from "../types/sort-type";
import { RequestConfigType } from "./types/request-config";
import { Account, AccountTypeEnum } from "./accounts";
import { Tenant } from "../types/tenant";
import { User } from "../types/user";
export enum TransactionTypeEnum {
  INVOICE = "INVOICE",
  PAYMENT = "PAYMENT",
  ADJUSTMENT = "ADJUSTMENT",
}

export type AccountsReceivable = {
  id: string;
  amount: number;
  accountType?: AccountTypeEnum;
  transactionType: TransactionTypeEnum;
  tenant: Tenant;
  account?: Account[];
  owner?: User[];
  createdAt: Date;
  updatedAt: Date;
};

export type AccountsReceivablesRequest = {
  page: number;
  limit: number;
  filters?: {
    tenantId?: string;
    accountType?: AccountTypeEnum;
    transactionType?: TransactionTypeEnum;
  };
  sort?: Array<{
    orderBy: keyof AccountsReceivable;
    order: SortEnum;
  }>;
};

export type AccountsReceivablesResponse =
  InfinityPaginationType<AccountsReceivable>;

export function useGetAccountsReceivablesService() {
  const fetch = useFetch();

  return useCallback(
    (data: AccountsReceivablesRequest, requestConfig?: RequestConfigType) => {
      const requestUrl = new URL(`${API_URL}/v1/accounts-receivables`);
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
      }).then(wrapperFetchJsonResponse<AccountsReceivablesResponse>);
    },
    [fetch]
  );
}

export type AccountsReceivableRequest = {
  id: AccountsReceivable["id"];
};

export type AccountsReceivableResponse = AccountsReceivable;

export function useGetAccountsReceivableService() {
  const fetch = useFetch();

  return useCallback(
    (data: AccountsReceivableRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/accounts-receivables/${data.id}`, {
        method: "GET",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<AccountsReceivableResponse>);
    },
    [fetch]
  );
}

export type AccountsReceivablePostRequest = Pick<
  AccountsReceivable,
  "amount" | "accountType" | "transactionType"
> & {
  tenantId: string;
  accountIds?: string[];
  ownerIds?: string[];
};

export type AccountsReceivablePostResponse = AccountsReceivable;

export function usePostAccountsReceivableService() {
  const fetch = useFetch();

  return useCallback(
    (
      data: AccountsReceivablePostRequest,
      requestConfig?: RequestConfigType
    ) => {
      return fetch(`${API_URL}/v1/accounts-receivables`, {
        method: "POST",
        body: JSON.stringify(data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<AccountsReceivablePostResponse>);
    },
    [fetch]
  );
}

export type AccountsReceivablePatchRequest = {
  id: AccountsReceivable["id"];
  data: Partial<AccountsReceivablePostRequest>;
};

export type AccountsReceivablePatchResponse = AccountsReceivable;

export function usePatchAccountsReceivableService() {
  const fetch = useFetch();

  return useCallback(
    (
      data: AccountsReceivablePatchRequest,
      requestConfig?: RequestConfigType
    ) => {
      return fetch(`${API_URL}/v1/accounts-receivables/${data.id}`, {
        method: "PATCH",
        body: JSON.stringify(data.data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<AccountsReceivablePatchResponse>);
    },
    [fetch]
  );
}

export type AccountsReceivableDeleteRequest = {
  id: AccountsReceivable["id"];
};

export type AccountsReceivableDeleteResponse = undefined;

export function useDeleteAccountsReceivableService() {
  const fetch = useFetch();

  return useCallback(
    (
      data: AccountsReceivableDeleteRequest,
      requestConfig?: RequestConfigType
    ) => {
      return fetch(`${API_URL}/v1/accounts-receivables/${data.id}`, {
        method: "DELETE",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<AccountsReceivableDeleteResponse>);
    },
    [fetch]
  );
}
