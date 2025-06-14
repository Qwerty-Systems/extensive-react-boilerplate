import { useGetRegionsService } from "@/services/api/services/regions";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { createQueryKeys } from "@/services/react-query/query-key-factory";
import { useInfiniteQuery } from "@tanstack/react-query";
import { RegionFilterType, RegionSortType } from "../region-filter-types";

export const regionsQueryKeys = createQueryKeys(["regions"], {
  list: () => ({
    key: [],
    sub: {
      by: ({
        sort,
        filter,
      }: {
        filter: RegionFilterType | undefined | any;
        sort?: RegionSortType | undefined;
      }) => ({
        key: [sort, filter],
      }),
    },
  }),
});

export const useGetRegionsQuery = ({
  sort,
  filter,
}: {
  filter?: RegionFilterType | undefined;
  sort?: RegionSortType | undefined;
} = {}) => {
  const fetch = useGetRegionsService();

  const query = useInfiniteQuery({
    queryKey: regionsQueryKeys.list().sub.by({ sort, filter }).key,
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
