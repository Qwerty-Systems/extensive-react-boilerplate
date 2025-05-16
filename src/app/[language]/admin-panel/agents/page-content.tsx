"use client";

import { RoleEnum } from "@/services/api/types/role";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import { useTranslation } from "@/services/i18n/client";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useMemo, useState } from "react";
import { useGetUsersQuery } from "./queries/queries";
import { User } from "@/services/api/types/user";
import Link from "@/components/link";
import useAuth from "@/services/auth/use-auth";
import useConfirmDialog from "@/components/confirm-dialog/use-confirm-dialog";
import { useDeleteUsersService } from "@/services/api/services/users";
import removeDuplicatesFromArrayObjects from "@/services/helpers/remove-duplicates-from-array-of-objects";
import { useQueryClient } from "@tanstack/react-query";
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
import UserFilter from "../users/user-filter";
import Chip from "@mui/material/Chip";
import MuiLink from "@mui/material/Link";
type UsersKeys = keyof User;

function Actions({ user }: { user: User }) {
  const { user: authUser } = useAuth();
  const { confirmDialog } = useConfirmDialog();
  const fetchUserDelete = useDeleteUsersService();
  const queryClient = useQueryClient();
  const { t: tUsers } = useTranslation("admin-panel-agents");
  const canDelete = user.id !== authUser?.id;

  const handleDelete = async () => {
    const isConfirmed = await confirmDialog({
      title: tUsers("admin-panel-agents:confirm.delete.title"),
      message: tUsers("admin-panel-agents:confirm.delete.message"),
    });

    if (isConfirmed) {
      const searchParams = new URLSearchParams(window.location.search);
      const filter = searchParams.get("filter");
      const sort = searchParams.get("sort");

      const previousData = queryClient.getQueryData<any>([
        "users",
        { sort, filter },
      ]);

      queryClient.setQueryData(["users", { sort, filter }], {
        ...previousData,
        pages: previousData?.pages.map((page: any) => ({
          ...page,
          data: page?.data.filter((item: User) => item.id !== user.id),
        })),
      });

      await fetchUserDelete({ id: user.id });
    }
  };

  return (
    <Box display="flex" gap={1}>
      <Tooltip title={tUsers("admin-panel-agents:actions.edit")}>
        <IconButton
          size="small"
          LinkComponent={Link}
          href={`/admin-panel/users/edit/${user.id}`}
          color="primary"
        >
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      {canDelete && (
        <Tooltip title={tUsers("admin-panel-agents:actions.delete")}>
          <IconButton size="small" onClick={handleDelete} color="error">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
}

function Users() {
  const { t: tUsers } = useTranslation("admin-panel-agents");
  const { t: tRoles } = useTranslation("admin-panel-roles");
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
    useGetUsersQuery({
      filter,
      sort: {
        order: (sortModel[0]?.sort?.toUpperCase() as SortEnum) || SortEnum.DESC,
        orderBy: (sortModel[0]?.field as UsersKeys) || "id",
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
    const allData = data?.pages.flatMap((page: any) => page?.data) || [];
    return removeDuplicatesFromArrayObjects<User>(allData as User[], "id");
  }, [data]);
  console.log("result", result);
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
    {
      field: "id",
      headerName: tUsers("admin-panel-agents:table.column1"),
      width: 120,
    },
    {
      field: "name",
      headerName: tUsers("admin-panel-agents:table.column2"),
      width: 200,
      valueGetter: (params: any) =>
        `${params?.row?.firstName} ${params?.row?.lastName}`,
      renderCell: (params: any) => (
        <Box
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {`${params?.row?.firstName} ${params?.row?.lastName}`}
        </Box>
      ),
    },
    {
      field: "email",
      headerName: tUsers("admin-panel-agents:table.column3"),
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
      field: "role",
      headerName: tUsers("admin-panel-agents:table.column4"),
      width: 150,
      valueGetter: (params: any) => tRoles(`role.${params?.name}`),
    },
    {
      field: "regions",
      headerName: tUsers("admin-panel-agents:table.column5"), // Occupants
      flex: 1,
      minWidth: 200,
      renderCell: (params: any) => {
        const regions = params.row.regions || [];
        const count = regions.length;

        return (
          <Tooltip
            title={
              <Box>
                {regions.slice(0, 5).map((region: any) => (
                  <Typography key={region.id} variant="body2">
                    {region?.name}
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
              href={`/admin-panel/regions?regionId=${params.row.id}`}
              underline="hover"
            >
              <Chip
                label={`${count} Region${count !== 1 ? "s" : ""}`}
                clickable
              />
            </MuiLink>
          </Tooltip>
        );
      },
    },
    {
      field: "actions",
      headerName: "",
      width: 120,
      renderCell: (params: any) => <Actions user={params.row} />,
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
              {tUsers("admin-panel-agents:title")}
            </Typography>
          </Grid>
          <Grid container size="auto" wrap="nowrap" spacing={2}>
            <Grid size="auto">
              <UserFilter />
            </Grid>
            <Grid size="auto">
              <Button
                variant="contained"
                LinkComponent={Link}
                href="/admin-panel/users/create"
                color="success"
              >
                {tUsers("admin-panel-agents:actions.create")}
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
                    {tUsers("admin-panel-agents:loadMore")}
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

export default withPageRequiredAuth(Users, { roles: [RoleEnum.ADMIN] });
