import {
  CreditBalance,
  useGetCreditBalancesService,
} from "@/services/api/services/credit-balances";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { createQueryKeys } from "@/services/react-query/query-key-factory";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  CreditBalanceFilterType,
  CreditBalanceSortType,
} from "../credit-balance-filter-types";

export const creditBalancesQueryKeys = createQueryKeys(["credit-balances"], {
  list: () => ({
    key: [],
    sub: {
      by: ({
        sort,
        filter,
      }: {
        filter: CreditBalanceFilterType | undefined;
        sort?: CreditBalanceSortType | undefined;
      }) => ({
        key: [sort, filter],
      }),
    },
  }),
});

export const useGetCreditBalancesQuery = ({
  sort,
  filter,
}: {
  filter?: CreditBalanceFilterType | undefined;
  sort?: CreditBalanceSortType | undefined;
} = {}) => {
  const fetch = useGetCreditBalancesService();

  const query = useInfiniteQuery({
    queryKey: creditBalancesQueryKeys.list().sub.by({ sort, filter }).key,
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
                  orderBy: sort.orderBy as keyof CreditBalance,
                  order: sort.order,
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
