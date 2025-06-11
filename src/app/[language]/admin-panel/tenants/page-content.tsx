"use client";

import { RoleEnum } from "@/services/api/types/role";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import { useTranslation } from "@/services/i18n/client";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useMemo, useState } from "react";
import { useGetTenantsQuery } from "./queries/queries";
import { Tenant } from "@/services/api/types/tenant";
import Link from "@/components/link";
import useAuth from "@/services/auth/use-auth";
import useConfirmDialog from "@/components/confirm-dialog/use-confirm-dialog";
import { useDeleteTenantsService } from "@/services/api/services/tenants";
import removeDuplicatesFromArrayObjects from "@/services/helpers/remove-duplicates-from-array-of-objects";
import { useQueryClient } from "@tanstack/react-query";
import TenantFilter from "./tenant-filter";
import { useRouter, useSearchParams } from "next/navigation";
import { SortEnum } from "@/services/api/types/sort-type";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";
import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

type TenantsKeys = keyof Tenant;

function Actions({ tenant }: { tenant: Tenant }) {
  const { user: authUser } = useAuth();
  const { confirmDialog } = useConfirmDialog();
  const fetchTenantDelete = useDeleteTenantsService();
  const queryClient = useQueryClient();
  const { t: tTenants } = useTranslation("admin-panel-tenants");
  const canDelete = tenant.id !== authUser?.id;

  const handleDelete = async () => {
    const isConfirmed = await confirmDialog({
      title: tTenants("admin-panel-tenants:confirm.delete.title"),
      message: tTenants("admin-panel-tenants:confirm.delete.message"),
    });

    if (isConfirmed) {
      const searchParams = new URLSearchParams(window.location.search);
      const filter = searchParams.get("filter");
      const sort = searchParams.get("sort");

      const previousData = queryClient.getQueryData<any>([
        "tenants",
        { sort, filter },
      ]);

      queryClient.setQueryData(["tenants", { sort, filter }], {
        ...previousData,
        pages: previousData?.pages.map((page: any) => ({
          ...page,
          data: page?.data.filter((item: Tenant) => item.id !== tenant.id),
        })),
      });

      await fetchTenantDelete({ id: tenant.id });
    }
  };

  return (
    <Box display="flex" gap={1}>
      <Tooltip title={tTenants("admin-panel-tenants:actions.edit")}>
        <IconButton
          size="small"
          LinkComponent={Link}
          href={`/admin-panel/tenants/edit/${tenant.id}`}
          color="primary"
        >
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      {canDelete && (
        <Tooltip title={tTenants("admin-panel-tenants:actions.delete")}>
          <IconButton size="small" onClick={handleDelete} color="error">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
}

function Tenants() {
  const { t: tTenants } = useTranslation("admin-panel-tenants");
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
    useGetTenantsQuery({
      filter,
      sort: {
        order: (sortModel[0]?.sort?.toUpperCase() as SortEnum) || SortEnum.DESC,
        orderBy: (sortModel[0]?.field as TenantsKeys) || "id",
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
    return removeDuplicatesFromArrayObjects<Tenant>(allData as Tenant[], "id");
  }, [data]);

  const columns: GridColDef[] = [
    {
      field: "avatar",
      headerName: "",
      width: 60,
      renderCell: (params: any) => (
        <Avatar
          alt={`${params.row.firstName} ${params.row.lastName}`}
          src={params.row.photo?.path}
          sx={{ width: 32, height: 32 }}
        />
      ),
      sortable: false,
    },
    // {
    //   field: "id",
    //   headerName: tTenants("admin-panel-tenants:table.column1"),
    //   width: 120,
    // },
    {
      field: "name",
      headerName: tTenants("admin-panel-tenants:table.column2"),
      width: 200,
      // valueGetter: (params: any) =>
      //   `${params?.row?.firstName} ${params?.row?.lastName}`,
      renderCell: (params: any) => (
        <Box
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {/* {`${params?.row?.firstName} ${params?.row?.lastName}`} */}
          {`${params?.value} `}
        </Box>
      ),
    },
    {
      field: "domain",
      headerName: tTenants("admin-panel-tenants:table.column3"),
      flex: 1,
      minWidth: 250,
      renderCell: (params: any) => (
        <Box
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "primaryPhone",
      headerName: tTenants("admin-panel-tenants:table.column4"),
      flex: 1,
      minWidth: 250,
      renderCell: (params: any) => (
        <Box
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "primaryEmail",
      headerName: tTenants("admin-panel-tenants:table.column5"),
      flex: 1,
      minWidth: 250,
      renderCell: (params: any) => (
        <Box
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {params.value}
        </Box>
      ),
    },
    // {
    //   field: "TenantType",
    //   headerName: tTenants("admin-panel-tenants:table.column3"),
    //   flex: 1,
    //   minWidth: 250,
    //   renderCell: (params: any) => (
    //     <Box
    //       sx={{
    //         whiteSpace: "nowrap",
    //         overflow: "hidden",
    //         textOverflow: "ellipsis",
    //       }}
    //     >
    //       {params.value}
    //     </Box>
    //   ),
    // },
    // {
    //   field: "isActive",
    //   headerName: tTenants("admin-panel-tenants:table.column3"),
    //   flex: 1,
    //   minWidth: 250,
    //   renderCell: (params: any) => (
    //     <Box
    //       sx={{
    //         whiteSpace: "nowrap",
    //         overflow: "hidden",
    //         textOverflow: "ellipsis",
    //       }}
    //     >
    //       {params.value}
    //     </Box>
    //   ),
    // },
    {
      field: "actions",
      headerName: "",
      width: 120,
      renderCell: (params: any) => <Actions tenant={params.row} />,
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
              {tTenants("admin-panel-tenants:title")}
            </Typography>
          </Grid>
          <Grid container size="auto" wrap="nowrap" spacing={2}>
            <Grid size="auto">
              <TenantFilter />
            </Grid>
            <Grid size="auto">
              <Button
                variant="contained"
                LinkComponent={Link}
                href="/admin-panel/tenants/create"
                color="success"
              >
                {tTenants("admin-panel-tenants:actions.create")}
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
                    {tTenants("admin-panel-tenants:loadMore")}
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

export default withPageRequiredAuth(Tenants, {
  roles: [RoleEnum.ADMIN, RoleEnum.PLATFORM_OWNER],
});
