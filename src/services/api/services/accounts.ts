import { useCallback } from "react";
import useFetch from "../use-fetch";
import { API_URL } from "../config";
import wrapperFetchJsonResponse from "../wrapper-fetch-json-response";
import { InfinityPaginationType } from "../types/infinity-pagination";
import { SortEnum } from "../types/sort-type";
import { RequestConfigType } from "./types/request-config";
import { Tenant } from "../types/tenant";
import { User } from "../types/user";

export enum AccountTypeEnum {
  ASSET = "ASSET",
  LIABILITY = "LIABILITY",
  EQUITY = "EQUITY",
  REVENUE = "REVENUE",
  EXPENSE = "EXPENSE",
}

export enum NotificationChannelEnum {
  EMAIL = "EMAIL",
  SMS = "SMS",
  PUSH = "PUSH",
}

export enum NotificationTypeEnum {
  BALANCE_ALERT = "BALANCE_ALERT",
  TRANSACTION_ALERT = "TRANSACTION_ALERT",
  MONTHLY_SUMMARY = "MONTHLY_SUMMARY",
}

export type Account = {
  id: string;
  name: string;
  description: string;
  type: AccountTypeEnum;
  balance: number;
  active: boolean;
  callbackUrl?: string;
  notificationChannel?: NotificationChannelEnum;
  notificationType?: NotificationTypeEnum;
  receiveNotification: boolean;
  tenant: Tenant;
  owner?: User[];
  createdAt: Date;
  updatedAt: Date;
};

export type AccountsRequest = {
  page: number;
  limit: number;
  filters?: {
    type?: AccountTypeEnum;
    active?: boolean;
    tenantId?: string;
  };
  sort?: Array<{
    orderBy: keyof Account;
    order: SortEnum;
  }>;
};

export type AccountsResponse = InfinityPaginationType<Account>;

export function useGetAccountsService() {
  const fetch = useFetch();

  return useCallback(
    (data: AccountsRequest, requestConfig?: RequestConfigType) => {
      const requestUrl = new URL(`${API_URL}/v1/accounts`);
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
      }).then(wrapperFetchJsonResponse<AccountsResponse>);
    },
    [fetch]
  );
}

export type AccountRequest = {
  id: Account["id"];
};

export type AccountResponse = Account;

export function useGetAccountService() {
  const fetch = useFetch();

  return useCallback(
    (data: AccountRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/accounts/${data.id}`, {
        method: "GET",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<AccountResponse>);
    },
    [fetch]
  );
}

export type AccountPostRequest = Pick<
  Account,
  | "name"
  | "description"
  | "type"
  | "balance"
  | "active"
  | "callbackUrl"
  | "notificationChannel"
  | "notificationType"
  | "receiveNotification"
> & {
  tenantId: string;
  ownerIds?: string[];
};

export type AccountPostResponse = Account;

export function usePostAccountService() {
  const fetch = useFetch();

  return useCallback(
    (data: AccountPostRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/accounts`, {
        method: "POST",
        body: JSON.stringify(data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<AccountPostResponse>);
    },
    [fetch]
  );
}

export type AccountPatchRequest = {
  id: Account["id"];
  data: Partial<AccountPostRequest>;
};

export type AccountPatchResponse = Account;

export function usePatchAccountService() {
  const fetch = useFetch();

  return useCallback(
    (data: AccountPatchRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/accounts/${data.id}`, {
        method: "PATCH",
        body: JSON.stringify(data.data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<AccountPatchResponse>);
    },
    [fetch]
  );
}

export type AccountDeleteRequest = {
  id: Account["id"];
};

export type AccountDeleteResponse = undefined;

export function useDeleteAccountService() {
  const fetch = useFetch();

  return useCallback(
    (data: AccountDeleteRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/accounts/${data.id}`, {
        method: "DELETE",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<AccountDeleteResponse>);
    },
    [fetch]
  );
}
