import { useGetExemptionsService } from "@/services/api/services/exemptions";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { createQueryKeys } from "@/services/react-query/query-key-factory";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  ExemptionFilterType,
  ExemptionSortType,
} from "../exemption-filter-types";
export const exemptionsQueryKeys = createQueryKeys(["exemptions"], {
  list: () => ({
    key: [],
    sub: {
      by: ({
        sort,
        filter,
      }: {
        filter: ExemptionFilterType | undefined;
        sort?: ExemptionSortType | undefined;
      }) => ({
        key: [sort, filter],
      }),
    },
  }),
});

export const useGetExemptionsQuery = ({
  sort,
  filter,
}: {
  filter?: ExemptionFilterType | undefined;
  sort?: ExemptionSortType | undefined;
} = {}) => {
  const fetch = useGetExemptionsService();

  const query = useInfiniteQuery({
    queryKey: exemptionsQueryKeys.list().sub.by({ sort, filter }).key,
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
