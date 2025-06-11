import {
  useGetVendorBillsService,
  VendorBill,
} from "@/services/api/services/vendor-bills";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { createQueryKeys } from "@/services/react-query/query-key-factory";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  VendorBillFilterType,
  VendorBillSortType,
} from "../vendor-bill-filter-types";

export const vendorBillsQueryKeys = createQueryKeys(["vendor-bills"], {
  list: () => ({
    key: [],
    sub: {
      by: ({
        sort,
        filter,
      }: {
        filter: VendorBillFilterType | undefined;
        sort?: VendorBillSortType | undefined;
      }) => ({
        key: [sort, filter],
      }),
    },
  }),
});

export const useGetVendorBillsQuery = ({
  sort,
  filter,
}: {
  filter?: VendorBillFilterType | undefined;
  sort?: VendorBillSortType | undefined;
} = {}) => {
  const fetch = useGetVendorBillsService();

  const query = useInfiniteQuery({
    queryKey: vendorBillsQueryKeys.list().sub.by({ sort, filter }).key,
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
                  orderBy: sort.orderBy as keyof VendorBill,
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
