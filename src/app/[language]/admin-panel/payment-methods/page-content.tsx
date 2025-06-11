"use client";

import { useGetPaymentMethodsQuery } from "./queries/queries";
import { RoleEnum } from "@/services/api/types/role";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import { useTranslation } from "@/services/i18n/client";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Link from "@/components/link";
import useConfirmDialog from "@/components/confirm-dialog/use-confirm-dialog";
import {
  PaymentMethodEntity,
  useDeletePaymentMethodService,
} from "@/services/api/services/payment-methods";
import removeDuplicatesFromArrayObjects from "@/services/helpers/remove-duplicates-from-array-of-objects";
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
import { useQueryClient } from "@tanstack/react-query";

type PaymentMethodsKeys = keyof PaymentMethodEntity;

function Actions({ paymentMethod }: { paymentMethod: PaymentMethodEntity }) {
  const { confirmDialog } = useConfirmDialog();
  const fetchPaymentMethodDelete = useDeletePaymentMethodService();
  const queryClient = useQueryClient();
  const { t: tPaymentMethods } = useTranslation("admin-panel-payment-methods");

  const handleDelete = async () => {
    const isConfirmed = await confirmDialog({
      title: tPaymentMethods(
        "admin-panel-payment-methods:confirm.delete.title"
      ),
      message: tPaymentMethods(
        "admin-panel-payment-methods:confirm.delete.message"
      ),
    });

    if (isConfirmed) {
      const searchParams = new URLSearchParams(window.location.search);
      const filter = searchParams.get("filter");
      const sort = searchParams.get("sort");

      const previousData = queryClient.getQueryData<any>([
        "payment-methods",
        { sort, filter },
      ]);

      queryClient.setQueryData(["payment-methods", { sort, filter }], {
        ...previousData,
        pages: previousData?.pages.map((page: any) => ({
          ...page,
          data: page?.data.filter(
            (item: PaymentMethodEntity) => item.id !== paymentMethod.id
          ),
        })),
      });

      await fetchPaymentMethodDelete({ id: paymentMethod.id });
    }
  };

  return (
    <Box display="flex" gap={1}>
      <Tooltip
        title={tPaymentMethods("admin-panel-payment-methods:actions.edit")}
      >
        <IconButton
          size="small"
          LinkComponent={Link}
          href={`/admin-panel/payment-methods/edit/${paymentMethod.id}`}
          color="primary"
        >
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip
        title={tPaymentMethods("admin-panel-payment-methods:actions.delete")}
      >
        <IconButton size="small" onClick={handleDelete} color="error">
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

function PaymentMethods() {
  const { t: tPaymentMethods } = useTranslation("admin-panel-payment-methods");
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
    useGetPaymentMethodsQuery({
      filter,
      sort: {
        order: (sortModel[0]?.sort?.toUpperCase() as SortEnum) || SortEnum.DESC,
        orderBy: (sortModel[0]?.field as PaymentMethodsKeys) || "id",
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
    return removeDuplicatesFromArrayObjects<PaymentMethodEntity>(
      allData as PaymentMethodEntity[],
      "id"
    );
  }, [data]);

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: tPaymentMethods("admin-panel-payment-methods:table.column1"),
      width: 120,
    },
    {
      field: "name",
      headerName: tPaymentMethods("admin-panel-payment-methods:table.column2"),
      flex: 1,
      minWidth: 200,
    },
    {
      field: "processorType",
      headerName: tPaymentMethods("admin-panel-payment-methods:table.column3"),
      width: 150,
    },
    {
      field: "config",
      headerName: tPaymentMethods("admin-panel-payment-methods:table.column4"),
      width: 200,
      valueGetter: (params: any) => params?.value?.provider || "-",
      renderCell: (params) => (
        <Box
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {params?.value?.provider || "-"}
        </Box>
      ),
    },
    {
      field: "sandbox",
      headerName: tPaymentMethods("admin-panel-payment-methods:table.column5"),
      width: 120,
      valueGetter: (params: any) => params?.row?.config?.sandboxMode ?? false,
      renderCell: (params) => (
        <Chip
          label={
            params?.value
              ? tPaymentMethods("admin-panel-payment-methods:status.sandbox")
              : tPaymentMethods("admin-panel-payment-methods:status.live")
          }
          color={params?.value ? "warning" : "success"}
          size="small"
        />
      ),
    },
    {
      field: "actions",
      headerName: "",
      width: 120,
      renderCell: (params) => <Actions paymentMethod={params?.row} />,
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
              {tPaymentMethods("admin-panel-payment-methods:title")}
            </Typography>
          </Grid>
          <Grid container size="auto" wrap="nowrap" spacing={2}>
            <Grid size="auto">{/* <PaymentMethodFilter /> */}</Grid>
            <Grid size="auto">
              <Button
                variant="contained"
                LinkComponent={Link}
                href="/admin-panel/payment-methods/create"
                color="success"
              >
                {tPaymentMethods("admin-panel-payment-methods:actions.create")}
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
                    {tPaymentMethods("admin-panel-payment-methods:loadMore")}
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

export default withPageRequiredAuth(PaymentMethods, {
  roles: [RoleEnum.ADMIN, RoleEnum.PLATFORM_OWNER],
});
