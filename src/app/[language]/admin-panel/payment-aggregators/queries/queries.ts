// app/admin-panel/payment-aggregators/queries/queries.ts
import { useGetPaymentAggregatorsService } from "@/services/api/services/payment-aggregators";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { createQueryKeys } from "@/services/react-query/query-key-factory";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  PaymentAggregatorFilterType,
  PaymentAggregatorSortType,
} from "../payment-aggregator-filter-types";

export const paymentAggregatorsQueryKeys = createQueryKeys(
  ["payment-aggregators"],
  {
    list: () => ({
      key: [],
      sub: {
        by: ({
          sort,
          filter,
        }: {
          filter: PaymentAggregatorFilterType | undefined;
          sort?: PaymentAggregatorSortType | undefined;
        }) => ({
          key: [sort, filter],
        }),
      },
    }),
  }
);

export const useGetPaymentAggregatorsQuery = ({
  sort,
  filter,
}: {
  filter?: PaymentAggregatorFilterType | undefined;
  sort?: PaymentAggregatorSortType | undefined;
} = {}) => {
  const fetch = useGetPaymentAggregatorsService();

  const query = useInfiniteQuery({
    queryKey: paymentAggregatorsQueryKeys.list().sub.by({ sort, filter }).key,
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
