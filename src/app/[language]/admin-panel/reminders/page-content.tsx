"use client";

import { RoleEnum } from "@/services/api/types/role";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import { useTranslation } from "@/services/i18n/client";
import { useGetRemindersQuery } from "./queries/queries";
import useConfirmDialog from "@/components/confirm-dialog/use-confirm-dialog";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { SortEnum } from "@/services/api/types/sort-type";
import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Link from "@/components/link";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import {
  Reminder,
  useDeleteReminderService,
} from "@/services/api/services/reminders";

function Actions({ reminder }: { reminder: Reminder }) {
  const { confirmDialog } = useConfirmDialog();
  const fetchReminderDelete = useDeleteReminderService();
  const queryClient = useQueryClient();
  const { t } = useTranslation("admin-panel-reminders");

  const handleDelete = async () => {
    const isConfirmed = await confirmDialog({
      title: t("confirm.delete.title"),
      message: t("confirm.delete.message"),
    });

    if (isConfirmed) {
      const searchParams = new URLSearchParams(window.location.search);
      const filter = searchParams.get("filter");
      const sort = searchParams.get("sort");

      const previousData = queryClient.getQueryData<any>([
        "reminders",
        { sort, filter },
      ]);

      queryClient.setQueryData(["reminders", { sort, filter }], {
        ...previousData,
        pages: previousData?.pages.map((page: any) => ({
          ...page,
          data: page?.data.filter((item: Reminder) => item.id !== reminder.id),
        })),
      });

      await fetchReminderDelete({ id: reminder.id! });
    }
  };

  return (
    <Box display="flex" gap={1}>
      <Tooltip title={t("actions.edit")}>
        <IconButton
          size="small"
          LinkComponent={Link}
          href={`/admin-panel/reminders/edit/${reminder.id}`}
          color="primary"
        >
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title={t("actions.delete")}>
        <IconButton size="small" onClick={handleDelete} color="error">
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

function Reminders() {
  const { t } = useTranslation("admin-panel-reminders");
  const searchParams = useSearchParams();
  const router = useRouter();

  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: "scheduledAt", sort: "desc" },
  ]);

  const filter = useMemo(() => {
    const searchParamsFilter = searchParams.get("filter");
    return searchParamsFilter ? JSON.parse(searchParamsFilter) : undefined;
  }, [searchParams]);

  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useGetRemindersQuery({
      filter,
      sort: {
        order: (sortModel[0]?.sort?.toUpperCase() as SortEnum) || SortEnum.DESC,
        orderBy: (sortModel[0]?.field as keyof Reminder) || "scheduledAt",
      },
    });

  const handleSortModelChange = (newModel: GridSortModel) => {
    setSortModel(newModel);
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set(
      "sort",
      JSON.stringify({
        order: newModel[0]?.sort?.toUpperCase() || SortEnum.DESC,
        orderBy: newModel[0]?.field || "scheduledAt",
      })
    );
    router.replace(window.location.pathname + "?" + searchParams.toString());
  };

  const result = useMemo(() => {
    const allData = data?.pages.flatMap((page) => page?.data) || [];
    return allData.filter(
      (reminder: any, index, self) =>
        index === self.findIndex((r: any) => r.id === reminder.id)
    ) as Reminder[];
  }, [data]);

  const columns: GridColDef[] = [
    {
      field: "message",
      headerName: t("table.message"),
      flex: 1,
      minWidth: 250,
    },
    {
      field: "channel",
      headerName: t("table.channel"),
      flex: 1,
      minWidth: 120,
      valueGetter: (params: any) => t(`reminder.channel.${params.row.channel}`),
    },
    {
      field: "status",
      headerName: t("table.status"),
      flex: 1,
      minWidth: 150,
      valueGetter: (params: any) => t(`reminder.status.${params.row.status}`),
    },
    {
      field: "scheduledAt",
      headerName: t("table.scheduledAt"),
      flex: 1,
      minWidth: 180,
      valueGetter: (params: any) =>
        format(new Date(params.row.scheduledAt), "PPpp"),
    },
    {
      field: "sentAt",
      headerName: t("table.sentAt"),
      flex: 1,
      minWidth: 180,
      valueGetter: (params: any) =>
        params.row.sentAt ? format(new Date(params.row.sentAt), "PPpp") : "",
    },
    {
      field: "actions",
      headerName: "",
      width: 120,
      renderCell: (params) => <Actions reminder={params.row} />,
      sortable: false,
    },
  ];

  return (
    <Container maxWidth="xl">
      <Grid container spacing={3} pt={3}>
        <Grid sx={{ xs: 12 }}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid>
              <Typography variant="h3" gutterBottom>
                {t("title")}
              </Typography>
            </Grid>
            <Grid>
              <Grid container spacing={2}>
                <Grid>{/* <ReminderFilter /> */}</Grid>
                <Grid>
                  <Button
                    variant="contained"
                    LinkComponent={Link}
                    href="/admin-panel/reminders/create"
                    color="success"
                  >
                    {t("actions.create")}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid sx={{ xs: 12 }}>
          <DataGrid
            rows={result}
            columns={columns}
            loading={isFetchingNextPage}
            sortModel={sortModel}
            onSortModelChange={handleSortModelChange}
            slots={{
              footer: () => (
                <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
                  <Button
                    onClick={() => fetchNextPage()}
                    disabled={!hasNextPage || isFetchingNextPage}
                    variant="outlined"
                  >
                    {t("loadMore")}
                  </Button>
                  {isFetchingNextPage && (
                    <CircularProgress size={24} sx={{ ml: 2 }} />
                  )}
                </Box>
              ),
            }}
            disableRowSelectionOnClick
            disableColumnMenu
            hideFooterPagination
            rowHeight={60}
            sx={{
              border: 1,
              borderColor: "divider",
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "background.paper",
              },
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
}

export default withPageRequiredAuth(Reminders, {
  roles: [RoleEnum.ADMIN, RoleEnum.PLATFORM_OWNER],
});
