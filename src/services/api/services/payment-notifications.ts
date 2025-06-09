// services/api/services/payment-notifications.ts
import { useCallback } from "react";
import useFetch from "../use-fetch";
import { API_URL } from "../config";
import wrapperFetchJsonResponse from "../wrapper-fetch-json-response";
import { InfinityPaginationType } from "../types/infinity-pagination";
import { SortEnum } from "../types/sort-type";
import { RequestConfigType } from "./types/request-config";

export enum PaymentStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
  CANCELLED = "cancelled",
  REVERSED = "reversed",
  REFUNDED = "refunded",
  PROCESSING = "processing",
  DECLINED = "declined",
  ON_HOLD = "on_hold",
  EXPIRED = "expired",
  PARTIALLY_REFUNDED = "partially_refunded",
  AUTHORIZED = "authorized",
  DECLINED_BY_BANK = "declined_by_bank",
  DECLINED_BY_USER = "declined_by_user",
  DECLINED_BY_PROVIDER = "declined_by_provider",
  DECLINED_BY_FRAUD_CHECK = "declined_by_fraud_check",
  DECLINED_BY_LIMIT = "declined_by_limit",
  DECLINED_BY_RISK_CHECK = "declined_by_risk_check",
  DECLINED_BY_INSUFFICIENT_FUNDS = "declined_by_insufficient_funds",
  DECLINED_BY_CURRENCY_NOT_SUPPORTED = "declined_by_currency_not_supported",
  DECLINED_BY_PAYMENT_METHOD_NOT_SUPPORTED = "declined_by_payment_method_not_supported",
  DECLINED_BY_PAYMENT_GATEWAY = "declined_by_payment_gateway",
  DECLINED_BY_BANK_ISSUER = "declined_by_bank_issuer",
  DECLINED_BY_BANK_NETWORK = "declined_by_bank_network",
  DECLINED_BY_BANK_FRAUD_CHECK = "declined_by_bank_fraud_check",
  DECLINED_BY_BANK_LIMIT = "declined_by_bank_limit",
  DECLINED_BY_BANK_RISK_CHECK = "declined_by_bank_risk_check",
  DECLINED_BY_BANK_INSUFFICIENT_FUNDS = "declined_by_bank_insufficient_funds",
  DECLINED_BY_BANK_CURRENCY_NOT_SUPPORTED = "declined_by_bank_currency_not_supported",
  DECLINED_BY_BANK_PAYMENT_METHOD_NOT_SUPPORTED = "declined_by_bank_payment_method_not_supported",
  DECLINED_BY_BANK_PAYMENT_GATEWAY = "declined_by_bank_payment_gateway",
  DECLINED_BY_BANK_BANK_ISSUER = "declined_by_bank_bank_issuer",
  DECLINED_BY_BANK_BANK_NETWORK = "declined_by_bank_bank_network",
  DECLINED_BY_BANK_BANK_FRAUD_CHECK = "declined_by_bank_bank_fraud_check",
}

export enum PaymentMethod {
  MOBILE_MONEY = "mobile_money",
  CREDIT_CARD = "credit_card",
  DEBIT_CARD = "debit_card",
  PAYPAL = "paypal",
  BANK_TRANSFER = "bank_transfer",
  CRYPTO = "crypto",
  USSD = "ussd",
  AGENCY_BANKING = "agency_banking",
}

export enum Currency {
  KES = "KES",
  USD = "USD",
  EUR = "EUR",
  GBP = "GBP",
  NGN = "NGN",
  ZAR = "ZAR",
  UGX = "UGX",
  TZS = "TZS",
  RWF = "RWF",
}

export enum PaymentProvider {
  MPESA = "mpesa",
  AIRTEL_MONEY = "airtel_money",
  EQUITY_BANK = "equity_bank",
  KCB_BANK = "kcb_bank",
  COOPERATIVE_BANK = "cooperative_bank",
  ABSA = "absa",
  NCBA = "ncba",
  SAFARICOM = "safaricom", // for M-PESA APIs, merchant integrations
  PAYPAL = "paypal",
  FLUTTERWAVE = "flutterwave",
  PAYSTACK = "paystack",
  STRIPE = "stripe",
  COINBASE = "coinbase",
}

export type PaymentNotificationEntity = {
  id: string;
  tenant: { id: string };
  aggregator: { id: string };
  processed_at?: Date | null;
  processed: boolean;
  raw_payload: object;
  status: PaymentStatus;
  received_at: Date;
  payment_method: PaymentMethod;
  currency: Currency;
  amount: number;
  external_txn_id: string;
  provider: PaymentProvider;
  createdAt: Date;
  updatedAt: Date;
};

export type PaymentNotificationsRequest = {
  page: number;
  limit: number;
  filters?: {
    status?: PaymentStatus;
    tenantId?: string;
    aggregatorId?: string;
    provider?: PaymentProvider;
    payment_method?: PaymentMethod;
    received_atFrom?: Date;
    received_atTo?: Date;
    amountMin?: number;
    amountMax?: number;
    processed?: boolean;
  };
  sort?: Array<{
    orderBy: keyof PaymentNotificationEntity;
    order: SortEnum;
  }>;
};

export type PaymentNotificationsResponse =
  InfinityPaginationType<PaymentNotificationEntity>;

export function useGetPaymentNotificationsService() {
  const fetch = useFetch();

  return useCallback(
    (data: PaymentNotificationsRequest, requestConfig?: RequestConfigType) => {
      const requestUrl = new URL(`${API_URL}/v1/payment-notifications`);
      requestUrl.searchParams.append("page", data.page.toString());
      requestUrl.searchParams.append("limit", data.limit.toString());

      if (data.filters) {
        if (data.filters.status) {
          requestUrl.searchParams.append("status", data.filters.status);
        }
        if (data.filters.tenantId) {
          requestUrl.searchParams.append("tenantId", data.filters.tenantId);
        }
        if (data.filters.aggregatorId) {
          requestUrl.searchParams.append(
            "aggregatorId",
            data.filters.aggregatorId
          );
        }
        if (data.filters.provider) {
          requestUrl.searchParams.append("provider", data.filters.provider);
        }
        if (data.filters.payment_method) {
          requestUrl.searchParams.append(
            "payment_method",
            data.filters.payment_method
          );
        }
        if (data.filters.received_atFrom) {
          requestUrl.searchParams.append(
            "received_atFrom",
            data.filters.received_atFrom.toISOString()
          );
        }
        if (data.filters.received_atTo) {
          requestUrl.searchParams.append(
            "received_atTo",
            data.filters.received_atTo.toISOString()
          );
        }
        if (data.filters.amountMin !== undefined) {
          requestUrl.searchParams.append(
            "amountMin",
            data.filters.amountMin.toString()
          );
        }
        if (data.filters.amountMax !== undefined) {
          requestUrl.searchParams.append(
            "amountMax",
            data.filters.amountMax.toString()
          );
        }
        if (data.filters.processed !== undefined) {
          requestUrl.searchParams.append(
            "processed",
            String(data.filters.processed)
          );
        }
      }

      if (data.sort) {
        requestUrl.searchParams.append("sort", JSON.stringify(data.sort));
      }

      return fetch(requestUrl, {
        method: "GET",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<PaymentNotificationsResponse>);
    },
    [fetch]
  );
}

export type PaymentNotificationRequest = {
  id: PaymentNotificationEntity["id"];
};

export type PaymentNotificationResponse = PaymentNotificationEntity;

export function useGetPaymentNotificationService() {
  const fetch = useFetch();

  return useCallback(
    (data: PaymentNotificationRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/payment-notifications/${data.id}`, {
        method: "GET",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<PaymentNotificationResponse>);
    },
    [fetch]
  );
}
