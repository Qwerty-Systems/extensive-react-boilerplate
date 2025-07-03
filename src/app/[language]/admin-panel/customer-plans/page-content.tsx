"use client";

import { RoleEnum } from "@/services/api/types/role";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import { useTranslation } from "@/services/i18n/client";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Link from "@/components/link";
import useConfirmDialog from "@/components/confirm-dialog/use-confirm-dialog";
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
import Chip from "@mui/material/Chip";
import { format } from "date-fns";
import { useMemo, useState } from "react";
import {
  CustomerPlanEntity,
  useDeleteCustomerPlanService,
} from "@/services/api/services/customer-payment-plan";
import { PlanStatusEnum } from "@/services/api/types/other";
import { useGetCustomerPlansQuery } from "./queries/queries";
import CustomerPlanFilter from "./customer-plan-filter";

type CustomerPlansKeys = keyof CustomerPlanEntity;

function Actions({ plan }: { plan: CustomerPlanEntity }) {
  // const { user: authUser } = useAuth();
  const { confirmDialog } = useConfirmDialog();
  const fetchCustomerPlanDelete = useDeleteCustomerPlanService();
  const queryClient = useQueryClient();
  const { t: tCustomerPlans } = useTranslation("admin-panel-customer-plans");

  const handleDelete = async () => {
    const isConfirmed = await confirmDialog({
      title: tCustomerPlans("admin-panel-customer-plans:confirm.delete.title"),
      message: tCustomerPlans(
        "admin-panel-customer-plans:confirm.delete.message"
      ),
    });

    if (isConfirmed) {
      const searchParams = new URLSearchParams(window.location.search);
      const filter = searchParams.get("filter");
      const sort = searchParams.get("sort");

      const previousData = queryClient.getQueryData<any>([
        "customer-plans",
        { sort, filter },
      ]);

      queryClient.setQueryData(["customer-plans", { sort, filter }], {
        ...previousData,
        pages: previousData?.pages.map((page: any) => ({
          ...page,
          data: page?.data.filter(
            (item: CustomerPlanEntity) => item.id !== plan.id
          ),
        })),
      });

      await fetchCustomerPlanDelete({ id: plan.id });
    }
  };

  return (
    <Box display="flex" gap={1}>
      <Tooltip
        title={tCustomerPlans("admin-panel-customer-plans:actions.edit")}
      >
        <IconButton
          size="small"
          LinkComponent={Link}
          href={`/admin-panel/customer-plans/edit/${plan.id}`}
          color="primary"
        >
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip
        title={tCustomerPlans("admin-panel-customer-plans:actions.delete")}
      >
        <IconButton size="small" onClick={handleDelete} color="error">
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

function CustomerPlans() {
  const { t: tCustomerPlans } = useTranslation("admin-panel-customer-plans");
  const { t: tStatus } = useTranslation("plan-status");
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
    useGetCustomerPlansQuery({
      filter,
      sort: {
        order: (sortModel[0]?.sort?.toUpperCase() as SortEnum) || SortEnum.DESC,
        orderBy: (sortModel[0]?.field as CustomerPlansKeys) || "id",
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
    return removeDuplicatesFromArrayObjects<CustomerPlanEntity>(
      allData as CustomerPlanEntity[],
      "id"
    );
  }, [data]);

  const columns: GridColDef[] = [
    {
      field: "customer",
      headerName: tCustomerPlans("admin-panel-customer-plans:table.column2"),
      width: 250,
      valueGetter: (params: any) => {
        const customers = params.row?.customer || [];
        return customers
          .map((c: any) => `${c.firstName} ${c.lastName}`)
          .join(", ");
      },
      renderCell: (params: any) => {
        const customers = params.row?.customer || [];
        return (
          <Box
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "flex",
              gap: 1,
            }}
          >
            {customers.map((c: any) => (
              // <Link
              //   key={c.id}
              //   href={`/admin/customers/${c.id}`} // Adjust your route if needed
              //   style={{ textDecoration: "none", color: "#1976d2" }}
              // >
              <>{`${c.firstName} ${c.lastName}`}</>
              // </Link>
            ))}
          </Box>
        );
      },
    },
    {
      field: "plan",
      headerName: tCustomerPlans("admin-panel-customer-plans:table.column3"),
      flex: 1,
      minWidth: 200,
      valueGetter: (params: any) => {
        const plans = params.row?.plan || [];
        return plans.map((p: any) => p.name).join(", ");
      },
      renderCell: (params) => {
        const plans = params.row?.plan || [];
        return (
          <Box
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {plans.map((p: any) => p.name).join(", ")}
          </Box>
        );
      },
    },
    {
      field: "startDate",
      headerName: tCustomerPlans("admin-panel-customer-plans:table.column4"),
      width: 150,
      valueGetter: (params: any) =>
        params ? format(new Date(params), "dd/MM/yyyy") : "-",
    },
    {
      field: "endDate",
      headerName: tCustomerPlans("admin-panel-customer-plans:table.column5"),
      width: 150,
      valueGetter: (params: any) =>
        params ? format(new Date(params), "dd/MM/yyyy") : "-",
    },
    {
      field: "status",
      headerName: tCustomerPlans("admin-panel-customer-plans:table.column6"),
      width: 120,
      renderCell: (params) => {
        const statusColors: Record<
          PlanStatusEnum,
          "success" | "error" | "warning" | "default"
        > = {
          [PlanStatusEnum.ACTIVE]: "success",
          [PlanStatusEnum.INACTIVE]: "error",
          [PlanStatusEnum.PENDING]: "warning",
          [PlanStatusEnum.EXPIRED]: "default",
          [PlanStatusEnum.TRIAL]: "warning",
          [PlanStatusEnum.SUSPENDED]: "warning",
          [PlanStatusEnum.CANCELLED]: "error",
          [PlanStatusEnum.COMPLETED]: "success",
          [PlanStatusEnum.ARCHIVED]: "default",
          [PlanStatusEnum.DELETED]: "error",
          [PlanStatusEnum.UNKNOWN]: "default",
        };

        return (
          <Chip
            label={tStatus(`plan-status:${params.value}`)}
            color={statusColors[params.value as keyof typeof statusColors]}
            size="small"
          />
        );
      },
    },
    {
      field: "actions",
      headerName: "",
      width: 120,
      renderCell: (params) => <Actions plan={params.row} />,
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
              {tCustomerPlans("admin-panel-customer-plans:title")}
            </Typography>
          </Grid>
          <Grid container size="auto" wrap="nowrap" spacing={2}>
            <Grid size="auto">
              <CustomerPlanFilter />
            </Grid>
            <Grid size="auto">
              <Button
                variant="contained"
                LinkComponent={Link}
                href="/admin-panel/customer-plans/create"
                color="success"
              >
                {tCustomerPlans("admin-panel-customer-plans:actions.create")}
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
                    {tCustomerPlans("admin-panel-customer-plans:loadMore")}
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

export default withPageRequiredAuth(CustomerPlans, {
  roles: [RoleEnum.ADMIN, RoleEnum.PLATFORM_OWNER],
});
