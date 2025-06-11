// app/admin-panel/payment-notifications/queries/queries.ts
import { useGetPaymentNotificationsService } from "@/services/api/services/payment-notifications";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { createQueryKeys } from "@/services/react-query/query-key-factory";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  PaymentNotificationFilterType,
  PaymentNotificationSortType,
} from "../payment-notification-filter-types";

export const paymentNotificationsQueryKeys = createQueryKeys(
  ["payment-notifications"],
  {
    list: () => ({
      key: [],
      sub: {
        by: ({
          sort,
          filter,
        }: {
          filter: PaymentNotificationFilterType | undefined;
          sort?: PaymentNotificationSortType | undefined;
        }) => ({
          key: [sort, filter],
        }),
      },
    }),
  }
);

export const useGetPaymentNotificationsQuery = ({
  sort,
  filter,
}: {
  filter?: PaymentNotificationFilterType | undefined;
  sort?: PaymentNotificationSortType | undefined;
} = {}) => {
  const fetch = useGetPaymentNotificationsService();

  const query = useInfiniteQuery({
    queryKey: paymentNotificationsQueryKeys.list().sub.by({ sort, filter }).key,
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
