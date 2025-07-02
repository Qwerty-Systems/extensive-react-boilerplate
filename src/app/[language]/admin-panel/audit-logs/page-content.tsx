"use client";

import { RoleEnum } from "@/services/api/types/role";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import { useTranslation } from "@/services/i18n/client";
import { useGetAuditLogsQuery } from "./queries/queries";
import { useRouter, useSearchParams } from "next/navigation";
import { SortEnum } from "@/services/api/types/sort-type";
import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import Chip from "@mui/material/Chip";
import { AuditLog } from "@/services/api/services/audit-logs";

function AuditLogs() {
  const { t } = useTranslation("admin-panel-audit-logs");
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
    useGetAuditLogsQuery({
      filter,
      sort: {
        order: (sortModel[0]?.sort?.toUpperCase() as SortEnum) || SortEnum.DESC,
        orderBy: (sortModel[0]?.field as keyof AuditLog) || "createdAt",
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
      (log: any, index, self) =>
        index === self.findIndex((l: any) => l.id === log.id)
    ) as AuditLog[];
  }, [data]);

  const columns: GridColDef[] = [
    {
      field: "action",
      headerName: t("table.action"),
      flex: 1,
      minWidth: 150,
      renderCell: (params: any) => (
        <Chip label={params?.row?.action} color="primary" size="small" />
      ),
    },
    {
      field: "entityType",
      headerName: t("table.entityType"),
      flex: 1,
      minWidth: 150,
    },
    {
      field: "performedByUser",
      headerName: t("table.user"),
      flex: 1,
      minWidth: 200,
      valueGetter: (params: any) =>
        params ? `${params?.firstName} ${params?.lastName}` : "-",
    },
    {
      field: "performedByTenant",
      headerName: t("table.tenant"),
      flex: 1,
      minWidth: 200,
      valueGetter: (params: any) => params?.name || "-",
    },
    {
      field: "description",
      headerName: t("table.description"),
      flex: 1,
      minWidth: 300,
      renderCell: (params) => (
        <Box
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {params?.value || "-"}
        </Box>
      ),
    },
    {
      field: "createdAt",
      headerName: t("table.createdAt"),
      flex: 1,
      minWidth: 180,
      valueGetter: (params: any) =>
        params ? format(new Date(params), "PPpp") : "-",
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
            <Grid>{/* <AuditLogFilter /> */}</Grid>
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

export default withPageRequiredAuth(AuditLogs, {
  roles: [RoleEnum.ADMIN, RoleEnum.PLATFORM_OWNER],
});
