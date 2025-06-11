"use client";

import { RoleEnum } from "@/services/api/types/role";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import { useTranslation } from "@/services/i18n/client";
import { useGetCreditBalancesQuery } from "./queries/queries";
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
import {
  CreditBalance,
  useDeleteCreditBalanceService,
} from "@/services/api/services/credit-balances";

function Actions({ creditBalance }: { creditBalance: CreditBalance }) {
  const { confirmDialog } = useConfirmDialog();
  const fetchCreditBalanceDelete = useDeleteCreditBalanceService();
  const queryClient = useQueryClient();
  const { t } = useTranslation("admin-panel-credit-balances");

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
        "credit-balances",
        { sort, filter },
      ]);

      queryClient.setQueryData(["credit-balances", { sort, filter }], {
        ...previousData,
        pages: previousData?.pages.map((page: any) => ({
          ...page,
          data: page?.data.filter(
            (item: CreditBalance) => item.id !== creditBalance.id
          ),
        })),
      });

      await fetchCreditBalanceDelete({ id: creditBalance.id! });
    }
  };

  return (
    <Box display="flex" gap={1}>
      <Tooltip title={t("actions.edit")}>
        <IconButton
          size="small"
          LinkComponent={Link}
          href={`/admin-panel/credit-balances/edit/${creditBalance.id}`}
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

function CreditBalances() {
  const { t } = useTranslation("admin-panel-credit-balances");
  const searchParams = useSearchParams();
  const router = useRouter();

  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: "createdAt", sort: "desc" },
  ]);

  const filter = useMemo(() => {
    const searchParamsFilter = searchParams.get("filter");
    return searchParamsFilter ? JSON.parse(searchParamsFilter) : undefined;
  }, [searchParams]);

  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useGetCreditBalancesQuery({
      filter,
      sort: {
        order: (sortModel[0]?.sort?.toUpperCase() as SortEnum) || SortEnum.DESC,
        orderBy: (sortModel[0]?.field as keyof CreditBalance) || "createdAt",
      },
    });

  const handleSortModelChange = (newModel: GridSortModel) => {
    setSortModel(newModel);
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set(
      "sort",
      JSON.stringify({
        order: newModel[0]?.sort?.toUpperCase() || SortEnum.DESC,
        orderBy: newModel[0]?.field || "createdAt",
      })
    );
    router.replace(window.location.pathname + "?" + searchParams.toString());
  };

  const result = useMemo(() => {
    const allData = data?.pages.flatMap((page) => page?.data) || [];
    return allData.filter(
      (balance: any, index, self) =>
        index === self.findIndex((b: any) => b.id === balance.id)
    ) as CreditBalance[];
  }, [data]);

  const columns: GridColDef[] = [
    {
      field: "user",
      headerName: t("table.user"),
      flex: 1,
      minWidth: 200,
      valueGetter: (params: any) =>
        `${params.row.user?.firstName} ${params.row.user?.lastName}`,
    },
    {
      field: "amount",
      headerName: t("table.amount"),
      type: "number",
      flex: 1,
      minWidth: 150,
      valueFormatter: (params: any) => `$${params.value.toFixed(2)}`,
    },
    {
      field: "tenant",
      headerName: t("table.tenant"),
      flex: 1,
      minWidth: 200,
      valueGetter: (params: any) => params.row.tenant?.name,
    },
    {
      field: "createdAt",
      headerName: t("table.createdAt"),
      flex: 1,
      minWidth: 180,
      valueGetter: (params: any) =>
        new Date(params.row.createdAt).toLocaleDateString(),
    },
    {
      field: "actions",
      headerName: "",
      width: 120,
      renderCell: (params) => <Actions creditBalance={params.row} />,
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
                <Grid>{/* <CreditBalanceFilter /> */}</Grid>
                <Grid>
                  <Button
                    variant="contained"
                    LinkComponent={Link}
                    href="/admin-panel/credit-balances/create"
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

export default withPageRequiredAuth(CreditBalances, {
  roles: [RoleEnum.ADMIN, RoleEnum.PLATFORM_OWNER],
});
