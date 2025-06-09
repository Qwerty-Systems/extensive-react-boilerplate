import { useGetVendorsService, Vendor } from "@/services/api/services/vendors";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { createQueryKeys } from "@/services/react-query/query-key-factory";
import { useInfiniteQuery } from "@tanstack/react-query";
import { VendorFilterType, VendorSortType } from "../vendor-filter-types";

export const vendorsQueryKeys = createQueryKeys(["vendors"], {
  list: () => ({
    key: [],
    sub: {
      by: ({
        sort,
        filter,
      }: {
        filter: VendorFilterType | undefined;
        sort?: VendorSortType | undefined;
      }) => ({
        key: [sort, filter],
      }),
    },
  }),
});

export const useGetVendorsQuery = ({
  sort,
  filter,
}: {
  filter?: VendorFilterType | undefined;
  sort?: VendorSortType | undefined;
} = {}) => {
  const fetch = useGetVendorsService();

  const query = useInfiniteQuery({
    queryKey: vendorsQueryKeys.list().sub.by({ sort, filter }).key,
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
                  orderBy: sort.orderBy as keyof Vendor,
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
