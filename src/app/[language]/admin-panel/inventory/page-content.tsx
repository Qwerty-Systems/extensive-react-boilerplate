"use client";
import { RoleEnum } from "@/services/api/types/role";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import { useTranslation } from "@/services/i18n/client";
import { useGetInventoriesQuery } from "./queries/queries";
import useConfirmDialog from "@/components/confirm-dialog/use-confirm-dialog";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { SortEnum } from "@/services/api/types/sort-type";
import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid";
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
  Inventory,
  useDeleteInventoryService,
} from "@/services/api/services/inventories";
import Box from "@mui/material/Box";

function Actions({ inventory }: { inventory: Inventory }) {
  const { confirmDialog } = useConfirmDialog();
  const fetchInventoryDelete = useDeleteInventoryService();
  const queryClient = useQueryClient();
  const { t } = useTranslation("admin-panel-inventories");

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
        "inventories",
        { sort, filter },
      ]);

      queryClient.setQueryData(["inventories", { sort, filter }], {
        ...previousData,
        pages: previousData?.pages.map((page: any) => ({
          ...page,
          data: page?.data.filter(
            (item: Inventory) => item.id !== inventory.id
          ),
        })),
      });

      await fetchInventoryDelete({ id: inventory.id! });
    }
  };

  return (
    <Box display="flex" gap={1}>
      <Tooltip title={t("actions.edit")}>
        <IconButton
          size="small"
          LinkComponent={Link}
          href={`/admin-panel/inventories/edit/${inventory.id}`}
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

function Inventories() {
  const { t } = useTranslation("admin-panel-inventories");
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
    useGetInventoriesQuery({
      filter,
      // sort: {
      //   order: (sortModel[0]?.sort?.toUpperCase() as SortEnum) || SortEnum.DESC,
      //   orderBy: (sortModel[0]?.field as string as keyof Inventory) || "createdAt",
      // },
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
      (inventory: any, index, self) =>
        index === self.findIndex((i: any) => i.id === inventory.id)
    ) as Inventory[];
  }, [data]);

  const columns: GridColDef[] = [
    {
      field: "itemName",
      headerName: t("table.itemName"),
      flex: 1,
      minWidth: 200,
    },
    {
      field: "itemDescription",
      headerName: t("table.itemDescription"),
      flex: 1,
      minWidth: 250,
    },
    {
      field: "quantity",
      headerName: t("table.quantity"),
      type: "number",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "purchasePrice",
      headerName: t("table.purchasePrice"),
      type: "number",
      flex: 1,
      minWidth: 150,
      valueFormatter: (params: any) => `$${params.value.toFixed(2)}`,
    },
    {
      field: "salePrice",
      headerName: t("table.salePrice"),
      type: "number",
      flex: 1,
      minWidth: 150,
      valueFormatter: (params: any) => `$${params.value?.toFixed(2) || ""}`,
    },
    {
      field: "materialType",
      headerName: t("table.materialType"),
      flex: 1,
      minWidth: 150,
    },
    {
      field: "actions",
      headerName: "",
      width: 120,
      renderCell: (params) => <Actions inventory={params.row} />,
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
                <Grid>{/* <InventoryFilter /> */}</Grid>
                <Grid>
                  <Button
                    variant="contained"
                    LinkComponent={Link}
                    href="/admin-panel/inventories/create"
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

export default withPageRequiredAuth(Inventories, {
  roles: [RoleEnum.ADMIN, RoleEnum.PLATFORM_OWNER],
});
