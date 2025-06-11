// app/admin-panel/discounts/queries/queries.ts
import { useGetDiscountsService } from "@/services/api/services/discounts";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { createQueryKeys } from "@/services/react-query/query-key-factory";
import { useInfiniteQuery } from "@tanstack/react-query";
import { DiscountFilterType, DiscountSortType } from "../discount-filter-types";
export const discountsQueryKeys = createQueryKeys(["discounts"], {
  list: () => ({
    key: [],
    sub: {
      by: ({
        sort,
        filter,
      }: {
        filter: DiscountFilterType | undefined;
        sort?: DiscountSortType | undefined;
      }) => ({
        key: [sort, filter],
      }),
    },
  }),
});

export const useGetDiscountsQuery = ({
  sort,
  filter,
}: {
  filter?: DiscountFilterType | undefined;
  sort?: DiscountSortType | undefined;
} = {}) => {
  const fetch = useGetDiscountsService();

  const query = useInfiniteQuery({
    queryKey: discountsQueryKeys.list().sub.by({ sort, filter }).key,
    initialPageParam: 1,
    queryFn: async ({ pageParam, signal }) => {
      const { status, data } = await fetch(
        {
          page: pageParam,
          limit: 10,
          filters: filter,
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
