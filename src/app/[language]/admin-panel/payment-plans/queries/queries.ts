import { useGetPaymentPlansService } from "@/services/api/services/payment-plan";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { createQueryKeys } from "@/services/react-query/query-key-factory";
import { useInfiniteQuery } from "@tanstack/react-query";

export const paymentPlansQueryKeys = createQueryKeys(["paymentPlans"], {
  list: () => ({
    key: [],
    sub: {
      by: ({
        sort,
        filter,
      }: {
        filter?: /**PaymentPlanFilterType**/ any | undefined;
        sort?: /**PaymentPlanSortType**/ any | undefined;
      }) => ({
        key: [sort, filter],
      }),
    },
  }),
});

export const useGetPaymentPlansQuery = ({
  sort,
  filter,
}: {
  filter?: /**PaymentPlanFilterType**/ any | undefined;
  sort?: /**PaymentPlanSortType**/ any | undefined;
} = {}) => {
  const fetch = useGetPaymentPlansService();

  const query = useInfiniteQuery({
    queryKey: paymentPlansQueryKeys.list().sub.by({ sort, filter }).key,
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
