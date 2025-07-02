// app/admin-panel/payment-aggregators/page.tsx
"use client";

import { useGetPaymentAggregatorsQuery } from "./queries/queries";
import { RoleEnum } from "@/services/api/types/role";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import { useTranslation } from "@/services/i18n/client";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Link from "@/components/link";
import useConfirmDialog from "@/components/confirm-dialog/use-confirm-dialog";
import {
  PaymentAggregatorEntity,
  useDeletePaymentAggregatorService,
} from "@/services/api/services/payment-aggregators";
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
import { useMemo, useState } from "react";

type PaymentAggregatorsKeys = keyof PaymentAggregatorEntity;

function Actions({ aggregator }: { aggregator: PaymentAggregatorEntity }) {
  const { confirmDialog } = useConfirmDialog();
  const fetchPaymentAggregatorDelete = useDeletePaymentAggregatorService();
  const queryClient = useQueryClient();
  const { t: tPaymentAggregators } = useTranslation(
    "admin-panel-payment-aggregators"
  );

  const handleDelete = async () => {
    const isConfirmed = await confirmDialog({
      title: tPaymentAggregators(
        "admin-panel-payment-aggregators:confirm.delete.title"
      ),
      message: tPaymentAggregators(
        "admin-panel-payment-aggregators:confirm.delete.message"
      ),
    });

    if (isConfirmed) {
      const searchParams = new URLSearchParams(window.location.search);
      const filter = searchParams.get("filter");
      const sort = searchParams.get("sort");

      const previousData = queryClient.getQueryData<any>([
        "payment-aggregators",
        { sort, filter },
      ]);

      queryClient.setQueryData(["payment-aggregators", { sort, filter }], {
        ...previousData,
        pages: previousData?.pages.map((page: any) => ({
          ...page,
          data: page?.data.filter(
            (item: PaymentAggregatorEntity) => item.id !== aggregator.id
          ),
        })),
      });

      await fetchPaymentAggregatorDelete({ id: aggregator.id });
    }
  };

  return (
    <Box display="flex" gap={1}>
      <Tooltip
        title={tPaymentAggregators(
          "admin-panel-payment-aggregators:actions.edit"
        )}
      >
        <IconButton
          size="small"
          LinkComponent={Link}
          href={`/admin-panel/payment-aggregators/edit/${aggregator.id}`}
          color="primary"
        >
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip
        title={tPaymentAggregators(
          "admin-panel-payment-aggregators:actions.delete"
        )}
      >
        <IconButton size="small" onClick={handleDelete} color="error">
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

function PaymentAggregators() {
  const { t: tPaymentAggregators } = useTranslation(
    "admin-panel-payment-aggregators"
  );
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
    useGetPaymentAggregatorsQuery({
      filter,
      sort: {
        order: (sortModel[0]?.sort?.toUpperCase() as SortEnum) || SortEnum.DESC,
        orderBy: (sortModel[0]?.field as PaymentAggregatorsKeys) || "id",
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
    return removeDuplicatesFromArrayObjects<PaymentAggregatorEntity>(
      allData as PaymentAggregatorEntity[],
      "id"
    );
  }, [data]);

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: tPaymentAggregators(
        "admin-panel-payment-aggregators:table.column2"
      ),
      flex: 1,
      minWidth: 200,
    },
    {
      field: "config",
      headerName: tPaymentAggregators(
        "admin-panel-payment-aggregators:table.column3"
      ),
      width: 200,
      valueGetter: (params: any) => params?.webhookUrl || "-",
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
      field: "isActive",
      headerName: tPaymentAggregators(
        "admin-panel-payment-aggregators:table.column4"
      ),
      width: 120,
      renderCell: (params) => (
        <Chip
          label={
            params?.value
              ? tPaymentAggregators(
                  "admin-panel-payment-aggregators:status.active"
                )
              : tPaymentAggregators(
                  "admin-panel-payment-aggregators:status.inactive"
                )
          }
          color={params?.value ? "success" : "error"}
          size="small"
        />
      ),
    },
    {
      field: "actions",
      headerName: "",
      width: 120,
      renderCell: (params) => <Actions aggregator={params?.row} />,
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
              {tPaymentAggregators("admin-panel-payment-aggregators:title")}
            </Typography>
          </Grid>
          <Grid container size="auto" wrap="nowrap" spacing={2}>
            <Grid size="auto">{/* <PaymentAggregatorFilter /> */}</Grid>
            <Grid size="auto">
              <Button
                variant="contained"
                LinkComponent={Link}
                href="/admin-panel/payment-aggregators/create"
                color="success"
              >
                {tPaymentAggregators(
                  "admin-panel-payment-aggregators:actions.create"
                )}
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
                    {tPaymentAggregators(
                      "admin-panel-payment-aggregators:loadMore"
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

export default withPageRequiredAuth(PaymentAggregators, {
  roles: [RoleEnum.ADMIN, RoleEnum.PLATFORM_OWNER],
});
