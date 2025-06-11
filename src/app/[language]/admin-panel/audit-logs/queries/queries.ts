import {
  AuditLog,
  useGetAuditLogsService,
} from "@/services/api/services/audit-logs";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { createQueryKeys } from "@/services/react-query/query-key-factory";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  AuditLogFilterType,
  AuditLogSortType,
} from "../audit-log-filter-types";

export const auditLogsQueryKeys = createQueryKeys(["audit-logs"], {
  list: () => ({
    key: [],
    sub: {
      by: ({
        sort,
        filter,
      }: {
        filter: AuditLogFilterType | undefined;
        sort?: AuditLogSortType | undefined;
      }) => ({
        key: [sort, filter],
      }),
    },
  }),
});

export const useGetAuditLogsQuery = ({
  sort,
  filter,
}: {
  filter?: AuditLogFilterType | undefined;
  sort?: AuditLogSortType | undefined;
} = {}) => {
  const fetch = useGetAuditLogsService();

  const query = useInfiniteQuery({
    queryKey: auditLogsQueryKeys.list().sub.by({ sort, filter }).key,
    initialPageParam: 1,
    queryFn: async ({ pageParam, signal }) => {
      const { status, data } = await fetch(
        {
          page: pageParam,
          limit: 10,
          filters: filter,
          sort: sort
            ? [
                {
                  ...sort,
                  orderBy: sort.orderBy as keyof AuditLog,
                },
              ]
            : undefined,
        },
        {
          signal,
        }
      );

      if (status === HTTP_CODES_ENUM.OK) {
        return {
          data: data.data,
          nextPage: data.hasNextPage ? pageParam + 1 : undefined,
        };
      }
    },
    getNextPageParam: (lastPage) => {
      return lastPage?.nextPage;
    },
    gcTime: 0,
  });

  return query;
};
