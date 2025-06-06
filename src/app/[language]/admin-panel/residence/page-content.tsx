"use client";

import { RoleEnum } from "@/services/api/types/role";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import { useTranslation } from "@/services/i18n/client";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useMemo, useState } from "react";
import { useGetResidencesQuery } from "./queries/queries";
import { Residence } from "@/services/api/types/residence";
import Link from "@/components/link";
import useConfirmDialog from "@/components/confirm-dialog/use-confirm-dialog";
import removeDuplicatesFromArrayObjects from "@/services/helpers/remove-duplicates-from-array-of-objects";
import { useQueryClient } from "@tanstack/react-query";
import ResidenceFilter from "./residence-filter";
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
import { useDeleteResidenceService } from "@/services/api/services/residence";
import Chip from "@mui/material/Chip";
import MuiLink from "@mui/material/Link";
import useAuth from "@/services/auth/use-auth";
type ResidenceKeys = keyof Residence;

function Actions({ residence }: { residence: Residence }) {
  const { confirmDialog } = useConfirmDialog();
  const fetchDelete = useDeleteResidenceService();
  const queryClient = useQueryClient();
  const { t } = useTranslation("admin-panel-residences");

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
        "residences",
        { sort, filter },
      ]);

      queryClient.setQueryData(["residences", { sort, filter }], {
        ...previousData,
        pages: previousData?.pages.map((page: any) => ({
          ...page,
          data: page?.data.filter(
            (item: Residence) => item.id !== residence.id
          ),
        })),
      });

      await fetchDelete({ id: residence.id });
    }
  };

  return (
    <Box display="flex" gap={1}>
      <Tooltip title={t("actions.edit")}>
        <IconButton
          size="small"
          LinkComponent={Link}
          href={`/admin-panel/residences/edit/${residence.id}`}
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

function Residences() {
  const { t } = useTranslation("admin-panel-residences");
  const searchParams = useSearchParams();
  const router = useRouter();
  const { tenant } = useAuth();
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
    useGetResidencesQuery({
      filter: {
        ...(filter || {}),
        tenantId: tenant?.id,
      },
      sort: {
        order: (sortModel[0]?.sort?.toUpperCase() as SortEnum) || SortEnum.DESC,
        orderBy: (sortModel[0]?.field as ResidenceKeys) || "id",
      },
    });
  console.log("Residences data:", data);
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
    const allData = data?.pages.flatMap((page: any) => page?.data) || [];
    return removeDuplicatesFromArrayObjects<Residence>(
      allData as Residence[],
      "id"
    );
  }, [data]);
  console.log(result);
  const columns: GridColDef[] = [
    // {
    //   field: "id",
    //   headerName: t("table.column1"), // ID
    //   width: 120,
    // },
    {
      field: "name",
      headerName: t("table.column2"), // Residence Name
      width: 220,
      renderCell: (params) => (
        <Typography fontWeight="bold" noWrap>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "region",
      headerName: t("table.column3"), // Location
      flex: 1,
      minWidth: 200,
      renderCell: (params: any) => (
        <MuiLink
          component={Link}
          href={`/admin-panel/regions/${params.row.region?.id}`}
          underline="hover"
          sx={{ fontWeight: 500 }}
        >
          {params.row.region?.name || "-"}
        </MuiLink>
      ),
    },
    {
      field: "type",
      headerName: t("table.column4"), // Type
      width: 150,
      valueGetter: (params: any) => params || "-",
    },
    {
      field: "charge",
      headerName: t("table.column5"), // Add this translation key
      width: 150,
      valueFormatter: (params: any) =>
        new Intl.NumberFormat("en-KE", {
          style: "currency",
          currency: "KES",
          maximumFractionDigits: 0,
        }).format(params),
    },
    {
      field: "occupants",
      headerName: t("table.column6"), // Occupants
      flex: 1,
      minWidth: 200,
      renderCell: (params: any) => {
        const occupants = params.row.occupants || [];
        const count = occupants.length;

        return (
          <Tooltip
            title={
              <Box>
                {occupants.slice(0, 5).map((occ: any) => (
                  <Typography key={occ.id} variant="body2">
                    {occ.firstName} {occ.lastName}
                  </Typography>
                ))}
                {count > 5 && (
                  <Typography variant="body2" fontStyle="italic">
                    +{count - 5} more
                  </Typography>
                )}
              </Box>
            }
          >
            <MuiLink
              component={Link}
              href={`/admin-panel/occupants?residenceId=${params.row.id}`}
              underline="hover"
            >
              <Chip
                label={`${count} Occupant${count !== 1 ? "s" : ""}`}
                clickable
              />
            </MuiLink>
          </Tooltip>
        );
      },
    },
    {
      field: "isActive",
      headerName: t("table.column7"), // e.g. "Status"
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value ? "Active" : "Inactive"}
          color={params.value ? "success" : "default"}
          size="small"
        />
      ),
    },
    {
      field: "actions",
      headerName: "",
      width: 120,
      renderCell: (params) => <Actions residence={params.row as Residence} />,
      sortable: false,
      filterable: false,
    },
  ];

  return (
    <Container maxWidth="xl">
      <Grid container spacing={3} pt={3}>
        <Grid container spacing={3} sx={{ xs: 12 }}>
          <Grid sx={{ xs: 12 }}>
            <Typography variant="h3">{t("title")}</Typography>
          </Grid>
          <Grid>
            <Grid container spacing={2}>
              <Grid>
                <ResidenceFilter />
              </Grid>
              <Grid>
                <Button
                  variant="contained"
                  LinkComponent={Link}
                  href="/admin-panel/residences/create"
                  color="success"
                >
                  {t("actions.create")}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid sx={{ xs: 12 }} mb={2}>
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

export default withPageRequiredAuth(Residences, { roles: [RoleEnum.ADMIN] });
