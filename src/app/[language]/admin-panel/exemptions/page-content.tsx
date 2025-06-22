// app/admin-panel/exemptions/page.tsx
"use client";

import { useGetExemptionsQuery } from "./queries/queries";
import { RoleEnum } from "@/services/api/types/role";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import { useTranslation } from "@/services/i18n/client";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Link from "@/components/link";
import useConfirmDialog from "@/components/confirm-dialog/use-confirm-dialog";
import {
  ExemptionEntity,
  useDeleteExemptionService,
} from "@/services/api/services/exemptions";
import removeDuplicatesFromArrayObjects from "@/services/helpers/remove-duplicates-from-array-of-objects";
import { useQueryClient } from "@tanstack/react-query";
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
import { format } from "date-fns";
import { useMemo, useState } from "react";

type ExemptionsKeys = keyof ExemptionEntity;

function Actions({ exemption }: { exemption: ExemptionEntity }) {
  const { confirmDialog } = useConfirmDialog();
  const fetchExemptionDelete = useDeleteExemptionService();
  const queryClient = useQueryClient();
  const { t: tExemptions } = useTranslation("admin-panel-exemptions");

  const handleDelete = async () => {
    const isConfirmed = await confirmDialog({
      title: tExemptions("admin-panel-exemptions:confirm.delete.title"),
      message: tExemptions("admin-panel-exemptions:confirm.delete.message"),
    });

    if (isConfirmed) {
      const searchParams = new URLSearchParams(window.location.search);
      const filter = searchParams.get("filter");
      const sort = searchParams.get("sort");

      const previousData = queryClient.getQueryData<any>([
        "exemptions",
        { sort, filter },
      ]);

      queryClient.setQueryData(["exemptions", { sort, filter }], {
        ...previousData,
        pages: previousData?.pages.map((page: any) => ({
          ...page,
          data: page?.data.filter(
            (item: ExemptionEntity) => item.id !== exemption.id
          ),
        })),
      });

      await fetchExemptionDelete({ id: exemption.id });
    }
  };

  return (
    <Box display="flex" gap={1}>
      <Tooltip title={tExemptions("admin-panel-exemptions:actions.edit")}>
        <IconButton
          size="small"
          LinkComponent={Link}
          href={`/admin-panel/exemptions/edit/${exemption.id}`}
          color="primary"
        >
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title={tExemptions("admin-panel-exemptions:actions.delete")}>
        <IconButton size="small" onClick={handleDelete} color="error">
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

function Exemptions() {
  const { t: tExemptions } = useTranslation("admin-panel-exemptions");
  const searchParams = useSearchParams();
  const router = useRouter();

  const [sortModel, setSortModel] = useState<GridSortModel>([
    {
      field: "id",
      sort: "desc",
    },
  ]);

  const filter = useMemo(() => {
    const searchParamsFilter = searchParams.get("filter");
    return searchParamsFilter ? JSON.parse(searchParamsFilter) : undefined;
  }, [searchParams]);

  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useGetExemptionsQuery({
      filter,
      sort: {
        order: (sortModel[0]?.sort?.toUpperCase() as SortEnum) || SortEnum.DESC,
        orderBy: (sortModel[0]?.field as ExemptionsKeys) || "id",
      },
    });

  const handleSortModelChange = (newModel: GridSortModel) => {
    setSortModel(newModel);
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set(
      "sort",
      JSON.stringify({
        order: newModel[0]?.sort?.toUpperCase() || SortEnum.DESC,
        orderBy: newModel[0]?.field || "id",
      })
    );
    router.replace(window.location.pathname + "?" + searchParams.toString());
  };

  const result = useMemo(() => {
    const allData = data?.pages.flatMap((page) => page?.data) || [];
    return removeDuplicatesFromArrayObjects<ExemptionEntity>(
      allData as ExemptionEntity[],
      "id"
    );
  }, [data]);

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: tExemptions("admin-panel-exemptions:table.column1"),
      width: 120,
    },
    {
      field: "reason",
      headerName: tExemptions("admin-panel-exemptions:table.column2"),
      flex: 1,
      minWidth: 200,
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
      field: "customer",
      headerName: tExemptions("admin-panel-exemptions:table.column3"),
      width: 200,
      valueGetter: (params: any) =>
        params?.row?.customer
          ? `${params?.row?.customer?.firstName} ${params?.row?.customer?.lastName}`
          : "-",
      renderCell: (params) => (
        <Box
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {params?.value}
        </Box>
      ),
    },
    {
      field: "dateRange",
      headerName: tExemptions("admin-panel-exemptions:table.column4"),
      width: 250,
      valueGetter: (params: any) =>
        params?.row?.startDate
          ? `${format(new Date(params?.row?.startDate), "dd/MM/yyyy")} - ${format(new Date(params?.row?.endDate), "dd/MM/yyyy")}`
          : "-",
    },
    {
      field: "actions",
      headerName: "",
      width: 120,
      renderCell: (params) => <Actions exemption={params?.row} />,
      sortable: false,
      filterable: false,
    },
  ];

  return (
    <Container maxWidth="xl">
      <Grid container spacing={3} pt={3}>
        <Grid container spacing={3} size={{ xs: 12 }}>
          <Grid size="grow">
            <Typography variant="h3">
              {tExemptions("admin-panel-exemptions:title")}
            </Typography>
          </Grid>
          <Grid container size="auto" wrap="nowrap" spacing={2}>
            <Grid size="auto">{/* <ExemptionFilter /> */}</Grid>
            <Grid size="auto">
              <Button
                variant="contained"
                LinkComponent={Link}
                href="/admin-panel/exemptions/create"
                color="success"
              >
                {tExemptions("admin-panel-exemptions:actions.create")}
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12 }} mb={2}>
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
                    {tExemptions("admin-panel-exemptions:loadMore")}
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

export default withPageRequiredAuth(Exemptions, {
  roles: [RoleEnum.ADMIN, RoleEnum.PLATFORM_OWNER],
});
