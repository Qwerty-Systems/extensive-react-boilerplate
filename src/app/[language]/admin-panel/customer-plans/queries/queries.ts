import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { createQueryKeys } from "@/services/react-query/query-key-factory";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  CustomerPlanFilterType,
  CustomerPlanSortType,
} from "../customer-plan-filter-types";
import { useGetCustomerPlansService } from "@/services/api/services/customer-payment-plan";
import { PlanStatusEnum } from "@/services/api/types/other";

export const customerPlansQueryKeys = createQueryKeys(["customer-plans"], {
  list: () => ({
    key: [],
    sub: {
      by: ({
        sort,
        filter,
      }: {
        filter: CustomerPlanFilterType | undefined;
        sort?: CustomerPlanSortType | undefined;
      }) => ({
        key: [sort, filter],
      }),
    },
  }),
});

export const useGetCustomerPlansQuery = ({
  sort,
  filter,
}: {
  filter?: CustomerPlanFilterType | undefined;
  sort?: CustomerPlanSortType | undefined;
} = {}) => {
  const fetch = useGetCustomerPlansService();

  const query = useInfiniteQuery({
    queryKey: customerPlansQueryKeys.list().sub.by({ sort, filter }).key,
    initialPageParam: 1,
    queryFn: async ({ pageParam, signal }) => {
      const mappedFilter = filter
        ? {
            ...filter,
            status: filter.status as PlanStatusEnum | undefined,
          }
        : undefined;

      const { status, data } = await fetch(
        {
          page: pageParam,
          limit: 10,
          filters: mappedFilter,
          sort: sort ? [sort] : undefined,
        },
        {
          signal,
        }
      );
      console.log("status, data ", status, data);
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
