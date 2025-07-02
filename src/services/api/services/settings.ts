import { useCallback } from "react";
import useFetch from "../use-fetch";
import { API_URL } from "../config";
import wrapperFetchJsonResponse from "../wrapper-fetch-json-response";
import { RequestConfigType } from "./types/request-config";

export type SettingsRequest = {
  settingsType: string;
  subjectType: "user" | "tenant";
  userId?: string;
  tenantId?: string;
};

export type SettingsResponse = {
  id: string;
  settingsType: string;
  subjectType: string;
  subjectId: string;
  config: any;
  createdAt: string;
  updatedAt: string;
};

export type SaveSettingsRequest = {
  settingsType: string;
  subjectType: "user" | "tenant";
  config: any;
  userId?: string;
  tenantId?: string;
};

export function useGetSettingsService() {
  const fetch = useFetch();

  return useCallback(
    (data: SettingsRequest, requestConfig?: RequestConfigType) => {
      const requestUrl = new URL(`${API_URL}/v1/settings`);
      requestUrl.searchParams.append("settingsType", data.settingsType);
      requestUrl.searchParams.append("subjectType", data.subjectType);

      if (data.userId) {
        requestUrl.searchParams.append("userId", data.userId);
      }

      if (data.tenantId) {
        requestUrl.searchParams.append("tenantId", data.tenantId);
      }

      return fetch(requestUrl, {
        method: "GET",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<SettingsResponse | null>);
    },
    [fetch]
  );
}

export function useSaveSettingsService() {
  const fetch = useFetch();

  return useCallback(
    (data: SaveSettingsRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/settings`, {
        method: "POST",
        body: JSON.stringify({
          settingsType: data.settingsType,
          subjectType: data.subjectType,
          config: data.config,
          ...(data.userId && { userId: data.userId }),
          ...(data.tenantId && { tenantId: data.tenantId }),
        }),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<SettingsResponse>);
    },
    [fetch]
  );
}
