import {
  Reminder,
  ReminderChannel,
  ReminderStatus,
  useGetRemindersService,
} from "@/services/api/services/reminders";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { createQueryKeys } from "@/services/react-query/query-key-factory";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ReminderFilterType, ReminderSortType } from "../reminder-filter-types";

export const remindersQueryKeys = createQueryKeys(["reminders"], {
  list: () => ({
    key: [],
    sub: {
      by: ({
        sort,
        filter,
      }: {
        filter: ReminderFilterType | undefined;
        sort?: ReminderSortType | undefined;
      }) => ({
        key: [sort, filter],
      }),
    },
  }),
});

export const useGetRemindersQuery = ({
  sort,
  filter,
}: {
  filter?: ReminderFilterType | undefined;
  sort?: ReminderSortType | undefined;
} = {}) => {
  const fetch = useGetRemindersService();

  const query = useInfiniteQuery({
    queryKey: remindersQueryKeys.list().sub.by({ sort, filter }).key,
    initialPageParam: 1,
    queryFn: async ({ pageParam, signal }) => {
      // Ensure filter.status is of type ReminderStatus if present
      const mappedFilter = filter
        ? {
            ...filter,
            status: filter.status as ReminderStatus | undefined,
            channel: filter.channel as ReminderChannel | undefined,
          }
        : undefined;

      const { status, data } = await fetch(
        {
          page: pageParam,
          limit: 10,
          filters: mappedFilter,
          sort: sort
            ? [
                {
                  orderBy: sort.orderBy as keyof Reminder,
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
