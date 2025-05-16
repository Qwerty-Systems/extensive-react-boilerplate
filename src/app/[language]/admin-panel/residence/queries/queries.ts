import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { createQueryKeys } from "@/services/react-query/query-key-factory";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  ResidenceFilterType,
  ResidenceSortType,
} from "../residence-filter-types";
import { useGetResidencesService } from "@/services/api/services/residence";

export const residencesQueryKeys = createQueryKeys(["residences"], {
  list: () => ({
    key: [],
    sub: {
      by: ({
        sort,
        filter,
      }: {
        filter: ResidenceFilterType | undefined | any;
        sort?: ResidenceSortType | undefined;
      }) => ({
        key: [sort, filter],
      }),
    },
  }),
});

export const useGetResidencesQuery = ({
  sort,
  filter,
}: {
  filter?: ResidenceFilterType | undefined;
  sort?: ResidenceSortType | undefined;
} = {}) => {
  const fetch = useGetResidencesService();

  const query = useInfiniteQuery({
    queryKey: residencesQueryKeys.list().sub.by({ sort, filter }).key,
    initialPageParam: 1,
    queryFn: async ({ pageParam, signal }) => {
      const { status, data } = await fetch(
        {
          page: pageParam,
          limit: 10,
          //TODO
          // filters: filter,
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
