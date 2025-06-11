import { useCallback } from "react";
import useFetch from "../use-fetch";
import { API_URL } from "../config";
import wrapperFetchJsonResponse from "../wrapper-fetch-json-response";
import { InfinityPaginationType } from "../types/infinity-pagination";
import { SortEnum } from "../types/sort-type";
import { RequestConfigType } from "./types/request-config";
import { Tenant } from "../types/tenant";
import { User } from "../types/user";
export enum AuditAction {
  // CRUD actions
  CREATE = "create",
  READ = "read",
  UPDATE = "update",
  DELETE = "delete",

  // Onboarding-specific actions
  COMPLETE_STEP = "complete_step",
  SKIP_STEP = "skip_step",
  RESTART_STEP = "restart_step",

  // Auth-related actions
  LOGIN = "login",
  LOGOUT = "logout",
  PASSWORD_CHANGE = "password_change",
  PASSWORD_RESET_REQUEST = "password_reset_request",
  PASSWORD_RESET_COMPLETE = "password_reset_complete",

  // Permission & Role changes
  ASSIGN_ROLE = "assign_role",
  REMOVE_ROLE = "remove_role",
  UPDATE_PERMISSIONS = "update_permissions",

  // User-related
  INVITE_USER = "invite_user",
  ACTIVATE_USER = "activate_user",
  DEACTIVATE_USER = "deactivate_user",

  // Tenant-related
  CREATE_TENANT = "create_tenant",
  UPDATE_TENANT = "update_tenant",
  DELETE_TENANT = "delete_tenant",
  SWITCH_TENANT = "switch_tenant",

  // File or data operations
  UPLOAD = "upload",
  DOWNLOAD = "download",
  EXPORT = "export",
  IMPORT = "import",

  // Settings and configuration
  UPDATE_SETTINGS = "update_settings",
  RESET_SETTINGS = "reset_settings",

  // Audit & logs
  VIEW_AUDIT_LOG = "view_audit_log",
  EXPORT_AUDIT_LOG = "export_audit_log",

  // System events
  SYSTEM_START = "system_start",
  SYSTEM_SHUTDOWN = "system_shutdown",
  SYSTEM_ERROR = "system_error",

  // Notification
  SEND_NOTIFICATION = "send_notification",
  READ_NOTIFICATION = "read_notification",

  // Misc
  ARCHIVE = "archive",
  RESTORE = "restore",
  TAG = "tag",
  UNTAG = "untag",
}
export type AuditLog = {
  id: string;
  action: AuditAction;
  entityType: string;
  entityId?: string;
  performedByUser?: User;
  performedByTenant?: Tenant;
  beforeState?: Record<string, any>;
  afterState?: Record<string, any>;
  status?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type AuditLogsRequest = {
  page: number;
  limit: number;
  filters?: {
    entityType?: string;
    action?: AuditAction;
    performedByUserId?: string;
    performedByTenantId?: string;
    dateFrom?: string;
    dateTo?: string;
  };
  sort?: Array<{
    orderBy: keyof AuditLog;
    order: SortEnum;
  }>;
};

export type AuditLogsResponse = InfinityPaginationType<AuditLog>;

export function useGetAuditLogsService() {
  const fetch = useFetch();

  return useCallback(
    (data: AuditLogsRequest, requestConfig?: RequestConfigType) => {
      const requestUrl = new URL(`${API_URL}/v1/audit-logs`);
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
      }).then(wrapperFetchJsonResponse<AuditLogsResponse>);
    },
    [fetch]
  );
}
