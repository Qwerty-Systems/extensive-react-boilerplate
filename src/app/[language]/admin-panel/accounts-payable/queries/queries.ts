import { useGetAccountsPayablesService } from "@/services/api/services/accounts-payables";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { createQueryKeys } from "@/services/react-query/query-key-factory";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  AccountsPayableFilterType,
  AccountsPayableSortType,
} from "../accounts-payable-filter-types";

export const accountsPayablesQueryKeys = createQueryKeys(
  ["accounts-payables"],
  {
    list: () => ({
      key: [],
      sub: {
        by: ({
          sort,
          filter,
        }: {
          filter: AccountsPayableFilterType | undefined;
          sort?: AccountsPayableSortType | undefined;
        }) => ({
          key: [sort, filter],
        }),
      },
    }),
  }
);

export const useGetAccountsPayablesQuery = ({
  sort,
  filter,
}: {
  filter?: AccountsPayableFilterType | undefined;
  sort?: AccountsPayableSortType | undefined;
} = {}) => {
  const fetch = useGetAccountsPayablesService();

  const query = useInfiniteQuery({
    queryKey: accountsPayablesQueryKeys.list().sub.by({ sort, filter }).key,
    initialPageParam: 1,
    queryFn: async ({ pageParam, signal }) => {
      const { status, data } = await fetch(
        {
          page: pageParam,
          limit: 10,
          //   filters: filter
          //     ? {
          //         ...filter,
          //         accountType: filter.accountType as AccountTypeEnum | undefined,
          //       }
          //     : undefined,
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
