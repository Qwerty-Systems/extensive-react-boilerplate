import { useGetUsersService } from "@/services/api/services/users";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { createQueryKeys } from "@/services/react-query/query-key-factory";
import { useInfiniteQuery } from "@tanstack/react-query";
import { UserFilterType, UserSortType } from "../user-filter-types";

export const usersQueryKeys = createQueryKeys(["users"], {
  list: () => ({
    key: [],
    sub: {
      by: ({
        sort,
        filter,
      }: {
        filter: UserFilterType | undefined;
        sort?: UserSortType | undefined;
      }) => ({
        key: [sort, filter],
      }),
    },
  }),
});

export const useGetUsersQuery = ({
  sort,
  filter,
}: {
  filter?: UserFilterType | undefined;
  sort?: UserSortType | undefined;
} = {}) => {
  const fetch = useGetUsersService();

  const query = useInfiniteQuery({
    queryKey: usersQueryKeys.list().sub.by({ sort, filter }).key,
    initialPageParam: 1,
    queryFn: async ({ pageParam, signal }) => {
      try {
        const { status, data } = await fetch(
          {
            page: pageParam,
            limit: 10,
            filters: filter,
            sort: sort ? [sort] : undefined,
          },
          { signal }
        );

        if (status === HTTP_CODES_ENUM.OK) {
          return {
            data: data.data,
            nextPage: data.hasNextPage ? pageParam + 1 : undefined,
          };
        } else {
          // Throw a structured error for non-OK responses
          throw {
            status,
            message: `Request failed with status ${status}`,
          };
        }
      } catch (error: any) {
        // Handle errors from fetch or wrapperFetchJsonResponse
        throw {
          status: error?.response?.status || 500,
          message: error.message || "An unknown error occurred",
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
