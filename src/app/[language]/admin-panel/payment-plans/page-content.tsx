"use client";
import { useMemo, useState } from "react";
import {
  Create as CreateIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";
import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import { useTranslation } from "@/services/i18n/client";
import { RoleEnum } from "@/services/api/types/role";
import useConfirmDialog from "@/components/confirm-dialog/use-confirm-dialog";
import Link from "@/components/link";
import { PaymentPlanEntity, PlanType } from "@/services/api/types/payment-plan";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { SortEnum } from "@/services/api/types/sort-type";
import useAuth from "@/services/auth/use-auth";
import removeDuplicatesFromArrayObjects from "@/services/helpers/remove-duplicates-from-array-of-objects";
import { useGetPaymentPlansQuery } from "./queries/queries";
import { useSearchParams } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";

// // Mock service - replace with actual implementation
// const useGetPaymentPlansService = () => {
//   return async () => {
//     return {
//       status: 200,
//       data: {
//         data: [
//           {
//             id: "1",
//             name: "Basic Monthly",
//             description: "Flat monthly fee",
//             isActive: true,
//             type: PlanType.FLAT_MONTHLY,
//             minimumCharge: 29.99,
//             unit: "month",
//             rateStructure: { type: "FLAT", amount: 29.99 },
//             createdAt: new Date("2025-01-01"),
//             updatedAt: new Date("2025-01-01"),
//             tenant: { id: "t1", name: "Tenant A" },
//           },
//           {
//             id: "2",
//             name: "Per Weight Plan",
//             description: "Pay per kilogram",
//             isActive: true,
//             type: PlanType.PER_WEIGHT,
//             minimumCharge: 10.0,
//             unit: "kg",
//             rateStructure: { type: "PER_UNIT", rate: 0.5 },
//             createdAt: new Date("2025-02-15"),
//             updatedAt: new Date("2025-02-15"),
//             tenant: { id: "t1", name: "Tenant A" },
//           },
//         ],
//         hasNextPage: false,
//       },
//     };
//   };
// };

const formatRateStructure = (rateStructure: any) => {
  if (!rateStructure) return "-";

  switch (rateStructure.type) {
    case "FLAT":
      return `Flat: ${rateStructure.amount.toFixed(2)}`;
    case "PER_UNIT":
      return `${rateStructure.rate.toFixed(2)}/unit`;
    case "TIERED":
      return `Tiered (${rateStructure.tiers.length} tiers)`;
    case "PREPAID":
      return `Prepaid: ${rateStructure.creditRate.toFixed(2)}/credit`;
    case "CREDIT_RATE":
      return `Credit: ${rateStructure.rate.toFixed(2)}/unit`;
    default:
      return "-";
  }
};

const PlanActions = ({ plan }: { plan: PaymentPlanEntity }) => {
  const { t } = useTranslation("admin-panel-payment-plans");
  const { confirmDialog } = useConfirmDialog();

  //const queryClient = useQueryClient();
  //const router = useRouter();

  const handleDelete = async () => {
    const isConfirmed = await confirmDialog({
      title: t("admin-panel-customers:confirm.delete.title"),
      message: t("admin-panel-customers:confirm.delete.message"),
    });

    if (isConfirmed) {
      // const searchParams = new URLSearchParams(window.location.search);
      // const filter = searchParams.get("filter");
      // const sort = searchParams.get("sort");
      // const previousData = queryClient.getQueryData<any>([
      //   "users",
      //   { sort, filter },
      // ]);
      // queryClient.setQueryData(["users", { sort, filter }], {
      //   ...previousData,
      //   pages: previousData?.pages.map((page: any) => ({
      //     ...page,
      //     data: page?.data.filter(
      //       (item: PaymentPlanEntity) => item.id !== user.id
      //     ),
      //   })),
      // });
      //await fetchUserDelete({ id: user.id });
    }
  };

  return (
    <Box display="flex" gap={1}>
      <Tooltip title={t("actions.edit")}>
        <IconButton
          size="small"
          LinkComponent={Link}
          href={`/admin-panel/payment-plans/edit/${plan.id}`}
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
};

function PaymentPlans() {
  const { t } = useTranslation("admin-panel-payment-plans");
  const { tenant } = useAuth();
  const searchParams = useSearchParams();
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
    useGetPaymentPlansQuery({
      filter: {
        ...(filter || {}),
        roles: [{ id: 6 }],
        tenantId: tenant?.id,
      },
      sort: {
        order: SortEnum.ASC,
        orderBy: undefined,
      },
    });

  // const handleSortModelChange = (newModel: GridSortModel) => {
  //   setSortModel(newModel);
  //   const searchParams = new URLSearchParams(window.location.search);
  //   searchParams.set(
  //     "sort",
  //     JSON.stringify({
  //       order: newModel[0]?.sort?.toUpperCase() || SortEnum.DESC,
  //       orderBy: newModel[0]?.field || "id",
  //     })
  //   );
  //   router.replace(window.location.pathname + "?" + searchParams.toString());
  // };
  const plans = useMemo(() => {
    const allData = data?.pages.flatMap((page: any) => page?.data) || [];
    return removeDuplicatesFromArrayObjects<PaymentPlanEntity>(
      allData as PaymentPlanEntity[],
      "id"
    );
  }, [data]);
  const columns: GridColDef<PaymentPlanEntity>[] = [
    {
      field: "name",
      headerName: t("table.column1"),
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Box fontWeight="medium">
          {params.value}
          {params.row.description && (
            <Typography variant="body2" color="text.secondary">
              {params.row.description}
            </Typography>
          )}
        </Box>
      ),
    },
    {
      field: "isActive",
      headerName: t("table.column2"),
      width: 120,
      renderCell: (params) =>
        params.value ? (
          <Chip
            icon={<CheckCircle fontSize="small" />}
            label={t("status.active")}
            color="success"
            size="small"
          />
        ) : (
          <Chip
            icon={<Cancel fontSize="small" />}
            label={t("status.inactive")}
            color="error"
            size="small"
          />
        ),
    },
    {
      field: "type",
      headerName: t("table.column3"),
      width: 150,
      valueGetter: (params: any) => {
        switch (params.value) {
          case PlanType.FLAT_MONTHLY:
            return t("types.flatMonthly");
          case PlanType.PER_WEIGHT:
            return t("types.perWeight");
          case PlanType.TIERED:
            return t("types.tiered");
          case PlanType.PREPAID:
            return t("types.prepaid");
          case PlanType.CREDIT:
            return t("types.credit");
          default:
            return params.value;
        }
      },
    },
    {
      field: "rateStructure",
      headerName: t("table.column4"),
      flex: 1,
      minWidth: 200,
      valueGetter: (params: any) =>
        formatRateStructure(params?.row?.rateStructure),
      renderCell: (params) => (
        console.log("params.row.rateStructure", params),
        (
          <Box>
            <Typography variant="body2">
              {formatRateStructure(params?.row?.rateStructure)}
            </Typography>
            {params.row.minimumCharge > 0 && (
              <Typography variant="body2" color="text.secondary">
                {t("table.minCharge", {
                  amount:
                    typeof params?.row?.minimumCharge === "number"
                      ? params.row.minimumCharge.toFixed(2)
                      : params.row.minimumCharge,
                })}
              </Typography>
            )}
          </Box>
        )
      ),
    },
    {
      field: "unit",
      headerName: t("table.column5"),
      width: 100,
    },
    {
      field: "actions",
      headerName: "",
      width: 120,
      renderCell: (params) => <PlanActions plan={params.row} />,
      sortable: false,
      filterable: false,
    },
  ];

  return (
    <Container maxWidth="xl">
      <Grid container spacing={3} pt={3}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid>
            <Typography variant="h3">{t("title")}</Typography>
            <Typography color="text.secondary" mt={1}>
              {t("subtitle")}
            </Typography>
          </Grid>
          <Grid>
            <Button
              variant="contained"
              startIcon={<CreateIcon />}
              LinkComponent={Link}
              href="/admin-panel/payment-plans/create"
            >
              {t("actions.create")}
            </Button>
          </Grid>
        </Grid>

        <Grid sx={{ xs: 12 }}>
          <DataGrid
            rows={plans}
            columns={columns}
            loading={isFetchingNextPage}
            sortModel={sortModel}
            onSortModelChange={setSortModel}
            disableRowSelectionOnClick
            disableColumnMenu
            hideFooterPagination
            rowHeight={70}
            autoHeight
            sx={{
              border: 1,
              borderColor: "divider",
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "background.paper",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "none",
              },
            }}
            slots={{
              footer: () => (
                <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
                  <Button
                    onClick={() => fetchNextPage()}
                    disabled={!hasNextPage || isFetchingNextPage}
                    variant="outlined"
                  >
                    {t("admin-panel-payment-plan:loadMore")}
                  </Button>
                  {isFetchingNextPage && (
                    <CircularProgress size={24} sx={{ ml: 2 }} />
                  )}
                </Box>
              ),
              noRowsOverlay: () => (
                <Box sx={{ py: 10, textAlign: "center" }}>
                  <Typography variant="body1" color="text.secondary">
                    {t("noPlans")}
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{ mt: 2 }}
                    component={Link}
                    href="/admin-panel/payment-plans/create"
                  >
                    {t("createFirstPlan")}
                  </Button>
                </Box>
              ),
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
}

export default withPageRequiredAuth(PaymentPlans, { roles: [RoleEnum.ADMIN] });
