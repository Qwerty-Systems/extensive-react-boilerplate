import {
  TransactionTypeEnum,
  useGetAccountsReceivablesService,
} from "@/services/api/services/accounts-receivables";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { createQueryKeys } from "@/services/react-query/query-key-factory";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  AccountsReceivableFilterType,
  AccountsReceivableSortType,
} from "../accounts-receivable-filter-types";
import { AccountTypeEnum } from "@/services/api/services/accounts";

export const accountsReceivablesQueryKeys = createQueryKeys(
  ["accounts-receivables"],
  {
    list: () => ({
      key: [],
      sub: {
        by: ({
          sort,
          filter,
        }: {
          filter: AccountsReceivableFilterType | undefined;
          sort?: AccountsReceivableSortType | undefined;
        }) => ({
          key: [sort, filter],
        }),
      },
    }),
  }
);

export const useGetAccountsReceivablesQuery = ({
  sort,
  filter,
}: {
  filter?: AccountsReceivableFilterType | undefined;
  sort?: AccountsReceivableSortType | undefined;
} = {}) => {
  const fetch = useGetAccountsReceivablesService();

  const query = useInfiniteQuery({
    queryKey: accountsReceivablesQueryKeys.list().sub.by({ sort, filter }).key,
    initialPageParam: 1,
    queryFn: async ({ pageParam, signal }) => {
      // Convert filter.accountType and filter.transactionType to their respective enums if present
      const filters = filter
        ? {
            ...filter,
            accountType: filter.accountType as AccountTypeEnum | undefined,
            transactionType: filter.transactionType as
              | TransactionTypeEnum
              | undefined,
          }
        : undefined;

      const { status, data } = await fetch(
        {
          page: pageParam,
          limit: 10,
          filters,
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
