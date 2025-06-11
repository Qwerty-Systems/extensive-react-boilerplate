"use client";

import { useTranslation } from "@/services/i18n/client";
import { useGetUsersQuery } from "./queries/queries";
import { User } from "@/services/api/types/user";
import { RoleEnum } from "@/services/api/types/role";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import { useSearchParams } from "next/navigation";
import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Chip from "@mui/material/Chip";
import CustomerActions from "./customer-actions";
import CustomerFilter from "./customer-filter";
import { useEffect, useMemo, useState } from "react";
import { SortEnum } from "@/services/api/types/sort-type";
import removeDuplicatesFromArrayObjects from "@/services/helpers/remove-duplicates-from-array-of-objects";
import Button from "@mui/material/Button";
import { Index } from "@/components/common/PageCarded";
import CustomerHeader from "./customer-header";
import CustomerSidebar from "./customer-sidebar";
import useAuth from "@/services/auth/use-auth";
import Error404 from "@/images/maintenance/Error404";

type UsersKeys = keyof User;

function Customers({ onSelect }: { onSelect: (user: User) => void }) {
  const { t } = useTranslation("admin-panel-customers");
  const { tenant } = useAuth();
  const searchParams = useSearchParams();
  const [_selectedCustomer, setSelectedCustomer] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: "id", sort: "desc" },
  ]);

  const filter = useMemo(() => {
    const searchParamsFilter = searchParams.get("filter");
    return searchParamsFilter ? JSON.parse(searchParamsFilter) : undefined;
  }, [searchParams]);

  // const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
  //   useGetUsersQuery({
  //     filter: {
  //       ...(filter || {}),
  //       roles: [{ id: 6 }],
  //       tenantId: tenant?.id,
  //     },
  //     sort: {
  //       order: (sortModel[0]?.sort?.toUpperCase() as SortEnum) || SortEnum.DESC,
  //       orderBy: (sortModel[0]?.field as UsersKeys) || "id",
  //     },
  //   });

  const {
    data,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    error,
    isError,
  } = useGetUsersQuery({
    filter: {
      ...(filter || {}),
      roles: [{ id: 6 }],
      tenantId: tenant?.id,
    },
    sort: {
      order: (sortModel[0]?.sort?.toUpperCase() as SortEnum) || SortEnum.DESC,
      orderBy: (sortModel[0]?.field as UsersKeys) || "id",
    },
  });
  useEffect(() => {
    if (data) {
      setIsLoading(false);
    }
  }, [data]);

  const handleRowClick = (user: User) => {
    setSelectedCustomer(user);
    onSelect(user);
  };

  const result = useMemo(() => {
    if (!data?.pages) return [];

    const allData = data.pages.flatMap((page) => (page?.data ? page.data : []));

    return removeDuplicatesFromArrayObjects<User>(allData, "id");
  }, [data]);
  const columns: GridColDef[] = [
    {
      field: "avatar",
      headerName: "",
      width: 60,
      renderCell: (params) => (
        <Avatar
          alt={`${params?.row?.firstName} ${params?.row?.lastName}`}
          src={params?.row?.photo?.path}
          sx={{ width: 32, height: 32, mt: 2 }}
        />
      ),
      sortable: false,
    },
    // {
    //   field: "id",
    //   headerName: t("table.column1"),
    //   width: 120,
    // },
    {
      field: "firstName",
      headerName: t("table.column2"),
      width: 200,
      renderCell: (params) => (
        <>
          {params?.row?.firstName} {params?.row?.lastName}
        </>
      ),
      // valueGetter: (params: any) =>
      //   `${params.row} ${params?.row?.lastName}`,
    },
    {
      field: "email",
      headerName: t("table.column3"),
      flex: 1,
      minWidth: 250,
    },
    {
      field: "phoneNumber",
      headerName: t("table.column4"),
      flex: 1,
      minWidth: 250,
    },
    {
      field: "status",
      headerName: t("table.column5"),
      width: 120,
      renderCell: (params: any) => (
        <Chip
          label={
            params?.row?.status?.name === "Active"
              ? t("status.active")
              : t("status.inactive")
          }
          color={params?.row?.status?.name === "Active" ? "success" : "error"}
          size="small"
        />
      ),
    },
    {
      field: "residence",
      headerName: t("table.column6"),
      width: 150,
      renderCell: (params) => (
        <Chip
          label={`${params?.row?.residences?.length || 0}`}
          variant="outlined"
          size="small"
        />
      ),
    },
    {
      field: "actions",
      headerName: "",
      width: 120,
      renderCell: (params) => (
        <CustomerActions user={params?.row} onSelect={setSelectedCustomer} />
      ),
      sortable: false,
    },
  ];
  const isForbidden =
    isError && error?.message === "Request failed with status 403";
  if (isLoading) {
    return (
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          mt: "5",
        }}
      >
        <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
          <CircularProgress size={24} sx={{ ml: 2 }} />
        </Box>
      </Box>
    );
  }
  return (
    <>
      {isForbidden ? (
        <Box
          sx={{
            height: 400,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: 1,
            borderColor: "divider",
            borderRadius: 1,
            backgroundColor: "background.paper",
          }}
        >
          <Error404 />
        </Box>
      ) : (
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            m: 4,
          }}
        >
          <Box mb={2} mt={6}>
            <CustomerFilter />
          </Box>

          <Box flex={1} position="relative">
            <DataGrid
              rows={result}
              columns={columns}
              loading={isFetchingNextPage}
              sortModel={sortModel}
              onSortModelChange={setSortModel}
              onRowClick={(params) => handleRowClick(params.row)}
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
                "& .MuiDataGrid-row": {
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                },
              }}
            />

            <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
              <Button
                onClick={() => fetchNextPage()}
                disabled={!hasNextPage || isFetchingNextPage}
                variant="outlined"
              >
                {t("loadMore")}
                {isFetchingNextPage && (
                  <CircularProgress size={24} sx={{ ml: 2 }} />
                )}
              </Button>
            </Box>
          </Box>
        </Box>
      )}
      )
    </>
  );
}
function CustomersClient() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<User>();
  const handleSelect = (user: User) => {
    setSelectedItem(user);
    setIsDrawerOpen(true);
  };
  return (
    <Index
      header={<CustomerHeader />}
      content={<Customers onSelect={handleSelect} />}
      sidebarContent={
        <CustomerSidebar
          onClose={() => setIsDrawerOpen(false)}
          customer={selectedItem}
        />
      }
      sidebarWidth={500}
      scroll="normal"
      isOpen={isDrawerOpen}
      setIsOpen={setIsDrawerOpen}
    />
  );
}
export default withPageRequiredAuth(CustomersClient, {
  roles: [
    RoleEnum.ADMIN,
    RoleEnum.PLATFORM_OWNER,
    RoleEnum.AGENT,
    RoleEnum.MANAGER,
  ],
});
