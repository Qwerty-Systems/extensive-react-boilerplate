import { useCallback } from "react";
import useFetch from "../use-fetch";
import { API_URL } from "../config";
import wrapperFetchJsonResponse from "../wrapper-fetch-json-response";
import { InfinityPaginationType } from "../types/infinity-pagination";
import { SortEnum } from "../types/sort-type";
import { RequestConfigType } from "./types/request-config";

export type ExemptionEntity = {
  id: string;
  description?: string | null;
  tenant: { id: string };
  invoice?: { id: string } | null;
  residence?: { id: string } | null;
  region?: { id: string } | null;
  customer?: { id: string } | null;
  endDate: Date;
  startDate: Date;
  reason?: string | null;
  createdAt: Date;
  updated极At: Date;
};

export type ExemptionsRequest = {
  page: number;
  limit: number;
  filters?: {
    tenantId?: string;
    customerId?: string;
    regionId?: string;
    residenceId?: string;
    startDateFrom?: Date;
    startDateTo?: Date;
    endDateFrom?: Date;
    endDateTo?: Date;
  };
  sort?: Array<{
    orderBy: keyof ExemptionEntity;
    order: SortEnum;
  }>;
};

export type ExemptionsResponse = InfinityPaginationType<ExemptionEntity>;

export function useGetExemptionsService() {
  const fetch = useFetch();

  return useCallback(
    (data: ExemptionsRequest, requestConfig?: RequestConfigType) => {
      const requestUrl = new URL(`${API_URL}/v1/exemptions`);
      requestUrl.searchParams.append("page", data.page.toString());
      requestUrl.searchParams.append("limit", data.limit.toString());

      if (data.filters) {
        if (data.filters.tenantId) {
          requestUrl.searchParams.append("tenantId", data.filters.tenantId);
        }
        if (data.filters.customerId) {
          requestUrl.searchParams.append("customerId", data.filters.customerId);
        }
        if (data.filters.regionId) {
          requestUrl.searchParams.append("regionId", data.filters.regionId);
        }
        if (data.filters.residenceId) {
          requestUrl.searchParams.append(
            "residenceId",
            data.filters.residenceId
          );
        }
        if (data.filters.startDateFrom) {
          requestUrl.searchParams.append(
            "startDateFrom",
            data.filters.startDateFrom.toISOString()
          );
        }
        if (data.filters.startDateTo) {
          requestUrl.searchParams.append(
            "startDateTo",
            data.filters.startDateTo.toISOString()
          );
        }
        if (data.filters.endDateFrom) {
          requestUrl.searchParams.append(
            "endDateFrom",
            data.filters.endDateFrom.toISOString()
          );
        }
        if (data.filters.endDateTo) {
          requestUrl.searchParams.append(
            "endDateTo",
            data.filters.endDateTo.toISOString()
          );
        }
      }

      if (data.sort) {
        requestUrl.searchParams.append("sort", JSON.stringify(data.sort));
      }

      return fetch(requestUrl, {
        method: "GET",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<ExemptionsResponse>);
    },
    [fetch]
  );
}

export type ExemptionRequest = {
  id: ExemptionEntity["id"];
};

export type ExemptionResponse = ExemptionEntity;

export function useGetExemptionService() {
  const fetch = useFetch();

  return useCallback(
    (data: ExemptionRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/exemptions/${data.id}`, {
        method: "GET",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<ExemptionResponse>);
    },
    [fetch]
  );
}

export type ExemptionPostRequest = Omit<
  ExemptionEntity,
  | "id"
  | "createdAt"
  | "updatedAt"
  | "tenant"
  | "invoice"
  | "residence"
  | "region"
  | "customer"
> & {
  tenantId: string;
  invoiceId?: string;
  residenceId?: string;
  regionId?: string;
  customerId?: string;
};

export type ExemptionPostResponse = ExemptionEntity;

export function usePostExemptionService() {
  const fetch = useFetch();

  return useCallback(
    (data: ExemptionPostRequest, requestConfig?: RequestConfigType) => {
      const {
        tenantId,
        invoiceId,
        residenceId,
        regionId,
        customerId,
        ...restData
      } = data;

      const requestBody = {
        ...restData,
        tenant: { id: tenantId },
        invoice: invoiceId ? { id: invoiceId } : null,
        residence: residenceId ? { id: residenceId } : null,
        region: regionId ? { id: regionId } : null,
        customer: customerId ? { id: customerId } : null,
      };

      return fetch(`${API_URL}/v1/exemptions`, {
        method: "POST",
        body: JSON.stringify(requestBody),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<ExemptionPostResponse>);
    },
    [fetch]
  );
}

export type ExemptionPatchRequest = {
  id: ExemptionEntity["id"];
  data: Partial<ExemptionPostRequest>;
};

export type ExemptionPatchResponse = ExemptionEntity;

export function usePatchExemptionService() {
  const fetch = useFetch();

  return useCallback(
    (data: ExemptionPatchRequest, requestConfig?: RequestConfigType) => {
      const {
        tenantId,
        invoiceId,
        residenceId,
        regionId,
        customerId,
        ...restData
      } = data.data;

      const requestBody: any = { ...restData };

      if (tenantId) requestBody.tenant = { id: tenantId };
      if (invoiceId) requestBody.invoice = { id: invoiceId };
      if (residenceId) requestBody.residence = { id: residenceId };
      if (regionId) requestBody.region = { id: regionId };
      if (customerId) requestBody.customer = { id: customerId };

      return fetch(`${API_URL}/v1/exemptions/${data.id}`, {
        method: "PATCH",
        body: JSON.stringify(requestBody),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<ExemptionPatchResponse>);
    },
    [fetch]
  );
}

export type ExemptionDeleteRequest = {
  id: ExemptionEntity["id"];
};

export type ExemptionDeleteResponse = undefined;

export function useDeleteExemptionService() {
  const fetch = useFetch();

  return useCallback(
    (data: ExemptionDeleteRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/exemptions/${data.id}`, {
        method: "DELETE",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<ExemptionDeleteResponse>);
    },
    [fetch]
  );
}
