import { useGetTenantsService } from "@/services/api/services/tenants";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { createQueryKeys } from "@/services/react-query/query-key-factory";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  TenantFilterType,
  TenantSortType,
  TenantTypeFilterType,
  TenantTypeSortType,
} from "../tenant-filter-types";
import { useGetTenantTypesService } from "@/services/api/services/tenant-types";

export const tenantsQueryKeys = createQueryKeys(["tenants"], {
  list: () => ({
    key: [],
    sub: {
      by: ({
        sort,
        filter,
      }: {
        filter: TenantFilterType | undefined;
        sort?: TenantSortType | undefined;
      }) => ({
        key: [sort, filter],
      }),
    },
  }),
});

export const useGetTenantsQuery = ({
  sort,
  filter,
}: {
  filter?: TenantFilterType | undefined;
  sort?: TenantSortType | undefined;
} = {}) => {
  const fetch = useGetTenantsService();

  const query = useInfiniteQuery({
    queryKey: tenantsQueryKeys.list().sub.by({ sort, filter }).key,
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

export const tenantTypesQueryKeys = createQueryKeys(["tenant-types"], {
  list: () => ({
    key: [],
    sub: {
      by: ({
        sort,
        filter,
      }: {
        filter: TenantTypeFilterType | undefined;
        sort?: TenantTypeSortType | undefined;
      }) => ({
        key: [sort, filter],
      }),
    },
  }),
});

export const useGetTenantTypesQuery = ({
  sort,
  filter,
}: {
  filter?: TenantTypeFilterType | undefined;
  sort?: TenantTypeSortType | undefined;
} = {}) => {
  const fetch = useGetTenantTypesService();

  const query = useInfiniteQuery({
    queryKey: tenantTypesQueryKeys.list().sub.by({ sort, filter }).key,
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
