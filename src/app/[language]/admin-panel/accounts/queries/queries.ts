import { useGetAccountsService } from "@/services/api/services/accounts";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { createQueryKeys } from "@/services/react-query/query-key-factory";
import { useInfiniteQuery } from "@tanstack/react-query";
import { AccountFilterType, AccountSortType } from "../accounts-filter-types";

export const accountsQueryKeys = createQueryKeys(["accounts"], {
  list: () => ({
    key: [],
    sub: {
      by: ({
        sort,
        filter,
      }: {
        filter: AccountFilterType | undefined;
        sort?: AccountSortType | undefined;
      }) => ({
        key: [sort, filter],
      }),
    },
  }),
});

export const useGetAccountsQuery = ({
  sort,
  filter,
}: {
  filter?: AccountFilterType | undefined;
  sort?: AccountSortType | undefined;
} = {}) => {
  const fetch = useGetAccountsService();

  const query = useInfiniteQuery({
    queryKey: accountsQueryKeys.list().sub.by({ sort, filter }).key,
    initialPageParam: 1,
    queryFn: async ({ pageParam, signal }) => {
      const { status, data } = await fetch(
        {
          page: pageParam,
          limit: 10,
          filters: filter
            ? {
                type: Array.isArray(filter.type) ? filter.type[0] : filter.type,
                active: filter.active,
                tenantId: filter.tenantId,
              }
            : undefined,
          sort: sort ? [sort] : undefined,
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
