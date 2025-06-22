"use client";

import { useGetPaymentNotificationsQuery } from "./queries/queries";
import { RoleEnum } from "@/services/api/types/role";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import { useTranslation } from "@/services/i18n/client";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useRouter, useSearchParams } from "next/navigation";
import { SortEnum } from "@/services/api/types/sort-type";
import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Chip from "@mui/material/Chip";
import { format } from "date-fns";
import { useMemo, useState } from "react";
import removeDuplicatesFromArrayObjects from "@/services/helpers/remove-duplicates-from-array-of-objects";
import {
  PaymentNotificationEntity,
  PaymentStatus,
} from "@/services/api/services/payment-notifications";

function PaymentNotifications() {
  const { t: tPaymentNotifications } = useTranslation(
    "admin-panel-payment-notifications"
  );
  const { t: tStatus } = useTranslation("payment-status");
  const { t: tPaymentMethod } = useTranslation("payment-method");
  const { t: tCurrency } = useTranslation("currency");
  const { t: tProvider } = useTranslation("payment-provider");
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
    useGetPaymentNotificationsQuery({
      filter,
      // sort: {
      //   order: (sortModel[0]?.sort?.toUpperCase() as SortEnum) || SortEnum.DESC,
      //  // orderBy: (sortModel[0]?.field as keyof PaymentNotificationEntity) || "id",
      // },
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
    return removeDuplicatesFromArrayObjects<PaymentNotificationEntity>(
      allData as PaymentNotificationEntity[],
      "id"
    );
  }, [data]);

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: tPaymentNotifications(
        "admin-panel-payment-notifications:table.column1"
      ),
      width: 120,
    },
    {
      field: "external_txn_id",
      headerName: tPaymentNotifications(
        "admin-panel-payment-notifications:table.column2"
      ),
      width: 200,
    },
    {
      field: "amount",
      headerName: tPaymentNotifications(
        "admin-panel-payment-notifications:table.column3"
      ),
      width: 120,
      renderCell: (params) =>
        params?.value
          ? `${formatCurrency(params?.value)} ${tCurrency(`currency:${params?.row?.currency}`)}`
          : "-",
    },
    {
      field: "provider",
      headerName: tPaymentNotifications(
        "admin-panel-payment-notifications:table.column4"
      ),
      width: 120,
      renderCell: (params) => tProvider(`payment-provider:${params?.value}`),
    },
    {
      field: "payment_method",
      headerName: tPaymentNotifications(
        "admin-panel-payment-notifications:table.column5"
      ),
      width: 120,
      renderCell: (params) => tPaymentMethod(`payment-method:${params?.value}`),
    },
    {
      field: "status",
      headerName: tPaymentNotifications(
        "admin-panel-payment-notifications:table.column6"
      ),
      width: 120,
      renderCell: (params) => {
        const statusColors: Record<
          PaymentStatus,
          "warning" | "success" | "error" | "info"
        > = {
          [PaymentStatus.PENDING]: "warning",
          [PaymentStatus.COMPLETED]: "success",
          [PaymentStatus.FAILED]: "error",
          [PaymentStatus.REFUNDED]: "info",
          [PaymentStatus.CANCELLED]: "warning",
          [PaymentStatus.REVERSED]: "warning",
          [PaymentStatus.PROCESSING]: "warning",
          [PaymentStatus.DECLINED]: "warning",
          [PaymentStatus.ON_HOLD]: "warning",
          [PaymentStatus.EXPIRED]: "warning",
          [PaymentStatus.PARTIALLY_REFUNDED]: "warning",
          [PaymentStatus.AUTHORIZED]: "warning",
          [PaymentStatus.DECLINED_BY_BANK]: "warning",
          [PaymentStatus.DECLINED_BY_USER]: "warning",
          [PaymentStatus.DECLINED_BY_PROVIDER]: "warning",
          [PaymentStatus.DECLINED_BY_FRAUD_CHECK]: "warning",
          [PaymentStatus.DECLINED_BY_LIMIT]: "warning",
          [PaymentStatus.DECLINED_BY_RISK_CHECK]: "warning",
          [PaymentStatus.DECLINED_BY_INSUFFICIENT_FUNDS]: "warning",
          [PaymentStatus.DECLINED_BY_CURRENCY_NOT_SUPPORTED]: "warning",
          [PaymentStatus.DECLINED_BY_PAYMENT_METHOD_NOT_SUPPORTED]: "warning",
          [PaymentStatus.DECLINED_BY_PAYMENT_GATEWAY]: "warning",
          [PaymentStatus.DECLINED_BY_BANK_ISSUER]: "warning",
          [PaymentStatus.DECLINED_BY_BANK_NETWORK]: "warning",
          [PaymentStatus.DECLINED_BY_BANK_FRAUD_CHECK]: "warning",
          [PaymentStatus.DECLINED_BY_BANK_LIMIT]: "warning",
          [PaymentStatus.DECLINED_BY_BANK_RISK_CHECK]: "warning",
          [PaymentStatus.DECLINED_BY_BANK_INSUFFICIENT_FUNDS]: "warning",
          [PaymentStatus.DECLINED_BY_BANK_CURRENCY_NOT_SUPPORTED]: "warning",
          [PaymentStatus.DECLINED_BY_BANK_PAYMENT_METHOD_NOT_SUPPORTED]:
            "warning",
          [PaymentStatus.DECLINED_BY_BANK_PAYMENT_GATEWAY]: "warning",
          [PaymentStatus.DECLINED_BY_BANK_BANK_ISSUER]: "warning",
          [PaymentStatus.DECLINED_BY_BANK_BANK_NETWORK]: "warning",
          [PaymentStatus.DECLINED_BY_BANK_BANK_FRAUD_CHECK]: "warning",
        };

        return (
          <Chip
            label={tStatus(`payment-status:${params?.value}`)}
            color={statusColors[params?.value as PaymentStatus]}
            size="small"
          />
        );
      },
    },
    {
      field: "received_at",
      headerName: tPaymentNotifications(
        "admin-panel-payment-notifications:table.column7"
      ),
      width: 150,
      valueGetter: (params: any) =>
        params?.value
          ? format(new Date(params?.value), "dd/MM/yyyy HH:mm")
          : "-",
    },
    {
      field: "processed",
      headerName: tPaymentNotifications(
        "admin-panel-payment-notifications:table.column8"
      ),
      width: 120,
      renderCell: (params) => (
        <Chip
          label={
            params?.value
              ? tPaymentNotifications(
                  "admin-panel-payment-notifications:status.processed"
                )
              : tPaymentNotifications(
                  "admin-panel-payment-notifications:status.pending"
                )
          }
          color={params?.value ? "success" : "warning"}
          size="small"
        />
      ),
    },
  ];

  return (
    <Container maxWidth="xl">
      <Grid container spacing={3} pt={3}>
        <Grid container spacing={3} size={{ xs: 12 }}>
          <Grid size="grow">
            <Typography variant="h3">
              {tPaymentNotifications("admin-panel-payment-notifications:title")}
            </Typography>
          </Grid>
          <Grid size="auto">{/* <PaymentNotificationFilter /> */}</Grid>
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
                    {tPaymentNotifications(
                      "admin-panel-payment-notifications:loadMore"
                    )}
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

export default withPageRequiredAuth(PaymentNotifications, {
  roles: [RoleEnum.ADMIN, RoleEnum.PLATFORM_OWNER],
});
function formatCurrency(value: number | string) {
  if (typeof value === "string") value = parseFloat(value);
  if (isNaN(value)) return "";
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
