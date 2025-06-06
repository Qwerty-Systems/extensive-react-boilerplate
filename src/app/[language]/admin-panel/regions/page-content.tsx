"use client";

import { RoleEnum } from "@/services/api/types/role";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import { useTranslation } from "@/services/i18n/client";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useMemo, useState } from "react";
import { useGetRegionsQuery } from "./queries/queries";
import { Region } from "@/services/api/types/region";
import Link from "@/components/link";
import useConfirmDialog from "@/components/confirm-dialog/use-confirm-dialog";
import { useDeleteRegionService } from "@/services/api/services/regions";
import removeDuplicatesFromArrayObjects from "@/services/helpers/remove-duplicates-from-array-of-objects";
import { useQueryClient } from "@tanstack/react-query";
import RegionFilter from "./region-filter";
import { useRouter, useSearchParams } from "next/navigation";
import { SortEnum } from "@/services/api/types/sort-type";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";
import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { Tenant } from "@/services/api/types/tenant";

type RegionKeys = keyof Region;

function Actions({ region }: { region: Region }) {
  const { confirmDialog } = useConfirmDialog();
  const fetchRegionDelete = useDeleteRegionService();
  const queryClient = useQueryClient();
  const { t } = useTranslation("admin-panel-regions");

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
        "regions",
        { sort, filter },
      ]);
      queryClient.setQueryData(["regions", { sort, filter }], {
        ...previousData,
        pages: previousData?.pages.map((page: any) => ({
          ...page,
          data: page?.data.filter((item: Tenant) => item.id !== region.id),
        })),
      });

      await fetchRegionDelete({ id: region.id! });
    }
  };

  return (
    <Box display="flex" gap={1}>
      <Tooltip title={t("actions.edit")}>
        <IconButton
          size="small"
          LinkComponent={Link}
          href={`/admin-panel/regions/edit/${region.id}`}
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

function Regions() {
  const { t } = useTranslation("admin-panel-regions");
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
    useGetRegionsQuery({
      filter,
      sort: {
        order: (sortModel[0]?.sort?.toUpperCase() as SortEnum) || SortEnum.DESC,
        orderBy: (sortModel[0]?.field as RegionKeys) || "createdAt",
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
    return removeDuplicatesFromArrayObjects<Region>(allData as Region[], "id");
  }, [data]);
  console.log("result", result);
  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: t("table.column2"),
      flex: 1,
      minWidth: 200,
    },
    {
      field: "tenant",
      headerName: t("table.column3"),
      valueGetter: (params: any) => (params?.row?.tenant as Tenant)?.name,
      flex: 1,
      minWidth: 200,
    },
    {
      field: "serviceTypes",
      headerName: t("table.column4"),
      valueGetter: (params: any) => params?.row?.serviceTypes?.join(", "),
      flex: 1,
      minWidth: 250,
    },
    {
      field: "zipCodes",
      headerName: t("table.column5"),
      valueGetter: (params: any) => params?.row?.zipCodes?.join(", "),
      flex: 1,
      minWidth: 200,
    },
    {
      field: "operatingHours",
      headerName: t("table.column6"),
      valueGetter: (params: any) => {
        const oh = params?.row?.operatingHours;
        return oh ? `${oh.days?.join(", ")} ${oh.startTime}-${oh.endTime}` : "";
      },
      flex: 1,
      minWidth: 300,
    },
    {
      field: "actions",
      headerName: "",
      width: 120,
      renderCell: (params: any) => <Actions region={params?.row} />,
      sortable: false,
    },
  ];

  return (
    <Container maxWidth="xl">
      <Grid container spacing={3} pt={3}>
        <Grid sx={{ xs: 12 }} spacing={3}>
          <Grid>
            <Typography variant="h3">{t("title")}</Typography>
          </Grid>
          <Grid container sx={{ xs: "auto" }} spacing={2}>
            <Grid>
              <RegionFilter />
            </Grid>
            <Grid>
              <Button
                variant="contained"
                LinkComponent={Link}
                href="/admin-panel/regions/create"
                color="success"
              >
                {t("actions.create")}
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid sx={{ xs: 12, mb: 2 }}>
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

export default withPageRequiredAuth(Regions, {
  roles: [RoleEnum.ADMIN, RoleEnum.PLATFORM_OWNER],
});
