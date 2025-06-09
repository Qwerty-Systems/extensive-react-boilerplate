import { useCallback } from "react";
import useFetch from "../use-fetch";
import { API_URL } from "../config";
import wrapperFetchJsonResponse from "../wrapper-fetch-json-response";
import { InfinityPaginationType } from "../types/infinity-pagination";
import { SortEnum } from "../types/sort-type";
import { RequestConfigType } from "./types/request-config";
import { Tenant } from "../types/tenant";
import { User } from "../types/user";
import { Account, AccountTypeEnum } from "./accounts";

export enum TransactionTypeEnum {
  PURCHASE = "PURCHASE",
  SALE = "SALE",
  CREDIT = "CREDIT",
  DEBIT = "DEBIT",
  TRANSFER = "TRANSFER",
  REFUND = "REFUND",
  WRITE_OFF = "WRITE_OFF",
  LATE_FEE = "LATE_FEE",
  ADJUSTMENT = "ADJUSTMENT",
  CREDIT_MEMO = "CREDIT_MEMO",
  INVOICE_PAYMENT = "INVOICE_PAYMENT",
  CHARGEBACK = "CHARGEBACK",
  PAYMENT = "PAYMENT",
  DISCOUNT = "DISCOUNT",
  FEE = "FEE",
  TAX = "TAX",
  INTEREST = "INTEREST",
  REVERSAL = "REVERSAL",
  PREPAYMENT = "PREPAYMENT",
  OVERPAYMENT = "OVERPAYMENT",
  UNDERPAYMENT = "UNDERPAYMENT",
  ESCALATION_CHARGE = "ESCALATION_CHARGE",
  SERVICE_CHARGE = "SERVICE_CHARGE",
  PENALTY = "PENALTY",
  CASH_RECEIPT = "CASH_RECEIPT",
  ALLOCATION = "ALLOCATION",
  MANUAL_ENTRY = "MANUAL_ENTRY",
}
export type AccountsPayable = {
  id: string;
  itemName: string;
  itemDescription?: string;
  quantity: number;
  purchasePrice?: number;
  salePrice?: number;
  accountType?: AccountTypeEnum;
  transactionType: TransactionTypeEnum;
  amount: number;
  tenant: Tenant;
  account?: Account[];
  owner?: User[];
  createdAt: Date;
  updatedAt: Date;
};
export type AccountsPayablesRequest = {
  page: number;
  limit: number;
  filters?: {
    tenantId?: string;
    accountType?: AccountTypeEnum;
    transactionType?: TransactionTypeEnum;
    itemName?: string;
  };
  sort?: Array<{
    orderBy: keyof AccountsPayable;
    order: SortEnum;
  }>;
};

export type AccountsPayablesResponse = InfinityPaginationType<AccountsPayable>;

export function useGetAccountsPayablesService() {
  const fetch = useFetch();

  return useCallback(
    (data: AccountsPayablesRequest, requestConfig?: RequestConfigType) => {
      const requestUrl = new URL(`${API_URL}/v1/accounts-payables`);
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
      }).then(wrapperFetchJsonResponse<AccountsPayablesResponse>);
    },
    [fetch]
  );
}

export type AccountsPayableRequest = {
  id: AccountsPayable["id"];
};

export type AccountsPayableResponse = AccountsPayable;

export function useGetAccountsPayableService() {
  const fetch = useFetch();

  return useCallback(
    (data: AccountsPayableRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/accounts-payables/${data.id}`, {
        method: "GET",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<AccountsPayableResponse>);
    },
    [fetch]
  );
}

export type AccountsPayablePostRequest = Pick<
  AccountsPayable,
  | "itemName"
  | "itemDescription"
  | "quantity"
  | "purchasePrice"
  | "salePrice"
  | "accountType"
  | "transactionType"
  | "amount"
> & {
  tenantId: string;
  accountIds?: string[];
  ownerIds?: string[];
};

export type AccountsPayablePostResponse = AccountsPayable;

export function usePostAccountsPayableService() {
  const fetch = useFetch();

  return useCallback(
    (data: AccountsPayablePostRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/accounts-payables`, {
        method: "POST",
        body: JSON.stringify(data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<AccountsPayablePostResponse>);
    },
    [fetch]
  );
}

export type AccountsPayablePatchRequest = {
  id: AccountsPayable["id"];
  data: Partial<AccountsPayablePostRequest>;
};

export type AccountsPayablePatchResponse = AccountsPayable;

export function usePatchAccountsPayableService() {
  const fetch = useFetch();

  return useCallback(
    (data: AccountsPayablePatchRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/accounts-payables/${data.id}`, {
        method: "PATCH",
        body: JSON.stringify(data.data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<AccountsPayablePatchResponse>);
    },
    [fetch]
  );
}

export type AccountsPayableDeleteRequest = {
  id: AccountsPayable["id"];
};

export type AccountsPayableDeleteResponse = undefined;

export function useDeleteAccountsPayableService() {
  const fetch = useFetch();

  return useCallback(
    (data: AccountsPayableDeleteRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/accounts-payables/${data.id}`, {
        method: "DELETE",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<AccountsPayableDeleteResponse>);
    },
    [fetch]
  );
}
