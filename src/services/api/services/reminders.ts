import { useCallback } from "react";
import useFetch from "../use-fetch";
import { API_URL } from "../config";
import wrapperFetchJsonResponse from "../wrapper-fetch-json-response";
import { InfinityPaginationType } from "../types/infinity-pagination";
import { SortEnum } from "../types/sort-type";
import { RequestConfigType } from "./types/request-config";
import { Tenant } from "../types/tenant";
import { User } from "../types/user";
import { InvoiceEntity } from "./invoices";

export enum ReminderChannel {
  EMAIL = "EMAIL",
  SMS = "SMS",
  PUSH = "PUSH",
}

export enum ReminderStatus {
  SCHEDULED = "SCHEDULED",
  SENT = "SENT",
  FAILED = "FAILED",
}

export type Reminder = {
  id: string;
  message?: string;
  channel: ReminderChannel;
  status: ReminderStatus;
  scheduledAt: Date;
  sentAt?: Date;
  tenant: Tenant;
  user?: User;
  invoice?: InvoiceEntity;
  createdAt: Date;
  updatedAt: Date;
};
export type RemindersRequest = {
  page: number;
  limit: number;
  filters?: {
    tenantId?: string;
    userId?: string;
    invoiceId?: string;
    status?: ReminderStatus;
    channel?: ReminderChannel;
    scheduledFrom?: string;
    scheduledTo?: string;
  };
  sort?: Array<{
    orderBy: keyof Reminder;
    order: SortEnum;
  }>;
};

export type RemindersResponse = InfinityPaginationType<Reminder>;

export function useGetRemindersService() {
  const fetch = useFetch();

  return useCallback(
    (data: RemindersRequest, requestConfig?: RequestConfigType) => {
      const requestUrl = new URL(`${API_URL}/v1/reminders`);
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
      }).then(wrapperFetchJsonResponse<RemindersResponse>);
    },
    [fetch]
  );
}

export type ReminderRequest = {
  id: Reminder["id"];
};

export type ReminderResponse = Reminder;

export function useGetReminderService() {
  const fetch = useFetch();

  return useCallback(
    (data: ReminderRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/reminders/${data.id}`, {
        method: "GET",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<ReminderResponse>);
    },
    [fetch]
  );
}

export type ReminderPostRequest = Pick<
  Reminder,
  "message" | "scheduledAt" | "channel"
> & {
  tenantId: string;
  userId?: string;
  invoiceId?: string;
};

export type ReminderPostResponse = Reminder;

export function usePostReminderService() {
  const fetch = useFetch();

  return useCallback(
    (data: ReminderPostRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/reminders`, {
        method: "POST",
        body: JSON.stringify(data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<ReminderPostResponse>);
    },
    [fetch]
  );
}

export type ReminderPatchRequest = {
  id: Reminder["id"];
  data: Partial<ReminderPostRequest> & {
    status?: ReminderStatus;
    sentAt?: Date;
  };
};

export type ReminderPatchResponse = Reminder;

export function usePatchReminderService() {
  const fetch = useFetch();

  return useCallback(
    (data: ReminderPatchRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/reminders/${data.id}`, {
        method: "PATCH",
        body: JSON.stringify(data.data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<ReminderPatchResponse>);
    },
    [fetch]
  );
}

export type ReminderDeleteRequest = {
  id: Reminder["id"];
};

export type ReminderDeleteResponse = undefined;

export function useDeleteReminderService() {
  const fetch = useFetch();

  return useCallback(
    (data: ReminderDeleteRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/reminders/${data.id}`, {
        method: "DELETE",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<ReminderDeleteResponse>);
    },
    [fetch]
  );
}
