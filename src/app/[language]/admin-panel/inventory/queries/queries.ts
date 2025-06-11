import {
  Inventory,
  useGetInventoriesService,
} from "@/services/api/services/inventories";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { createQueryKeys } from "@/services/react-query/query-key-factory";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  InventoryFilterType,
  InventorySortType,
} from "../inventory-filter-types";

export const inventoriesQueryKeys = createQueryKeys(["inventories"], {
  list: () => ({
    key: [],
    sub: {
      by: ({
        sort,
        filter,
      }: {
        filter: InventoryFilterType | undefined;
        sort?: InventorySortType | undefined;
      }) => ({
        key: [sort, filter],
      }),
    },
  }),
});

export const useGetInventoriesQuery = ({
  sort,
  filter,
}: {
  filter?: InventoryFilterType | undefined;
  sort?: InventorySortType | undefined;
} = {}) => {
  const fetch = useGetInventoriesService();

  const query = useInfiniteQuery({
    queryKey: inventoriesQueryKeys.list().sub.by({ sort, filter }).key,
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
                  orderBy: sort.orderBy as keyof Inventory,
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
