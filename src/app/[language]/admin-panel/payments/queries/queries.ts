// app/admin-panel/payment-methods/queries/queries.ts
import { useGetPaymentMethodsService } from "@/services/api/services/payment-methods";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { createQueryKeys } from "@/services/react-query/query-key-factory";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  PaymentMethodFilterType,
  PaymentMethodSortType,
} from "../payment-method-filter-types";

export const paymentMethodsQueryKeys = createQueryKeys(["payment-methods"], {
  list: () => ({
    key: [],
    sub: {
      by: ({
        sort,
        filter,
      }: {
        filter: PaymentMethodFilterType | undefined;
        sort?: PaymentMethodSortType | undefined;
      }) => ({
        key: [sort, filter],
      }),
    },
  }),
});

export const useGetPaymentMethodsQuery = ({
  sort,
  filter,
}: {
  filter?: PaymentMethodFilterType | undefined;
  sort?: PaymentMethodSortType | undefined;
} = {}) => {
  const fetch = useGetPaymentMethodsService();

  const query = useInfiniteQuery({
    queryKey: paymentMethodsQueryKeys.list().sub.by({ sort, filter }).key,
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
