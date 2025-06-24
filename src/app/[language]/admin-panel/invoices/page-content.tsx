"use client";

import { useGetInvoicesQuery } from "./queries/queries";
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
  InvoiceEntity,
  InvoiceStatus,
  useDeleteInvoiceService,
} from "@/services/api/services/invoices";

type InvoicesKeys = keyof InvoiceEntity;

function Actions({ invoice }: { invoice: InvoiceEntity }) {
  const { confirmDialog } = useConfirmDialog();
  const fetchInvoiceDelete = useDeleteInvoiceService();
  const queryClient = useQueryClient();
  const { t: tInvoices } = useTranslation("admin-panel-invoices");

  const handleDelete = async () => {
    const isConfirmed = await confirmDialog({
      title: tInvoices("admin-panel-invoices:confirm.delete.title"),
      message: tInvoices("admin-panel-invoices:confirm.delete.message"),
    });

    if (isConfirmed) {
      const searchParams = new URLSearchParams(window.location.search);
      const filter = searchParams.get("filter");
      const sort = searchParams.get("sort");

      const previousData = queryClient.getQueryData<any>([
        "invoices",
        { sort, filter },
      ]);

      queryClient.setQueryData(["invoices", { sort, filter }], {
        ...previousData,
        pages: previousData?.pages.map((page: any) => ({
          ...page,
          data: page?.data.filter(
            (item: InvoiceEntity) => item.id !== invoice.id
          ),
        })),
      });

      await fetchInvoiceDelete({ id: invoice.id });
    }
  };

  return (
    <Box display="flex" gap={1}>
      <Tooltip title={tInvoices("admin-panel-invoices:actions.edit")}>
        <IconButton
          size="small"
          LinkComponent={Link}
          href={`/admin-panel/invoices/edit/${invoice.id}`}
          color="primary"
        >
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title={tInvoices("admin-panel-invoices:actions.delete")}>
        <IconButton size="small" onClick={handleDelete} color="error">
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

function Invoices() {
  const { t: tInvoices } = useTranslation("admin-panel-invoices");
  const { t: tStatus } = useTranslation("invoice-status");
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
    useGetInvoicesQuery({
      filter,
      sort: {
        order: (sortModel[0]?.sort?.toUpperCase() as SortEnum) || SortEnum.DESC,
        orderBy: (sortModel[0]?.field as InvoicesKeys) || "id",
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
    return removeDuplicatesFromArrayObjects<InvoiceEntity>(
      allData as InvoiceEntity[],
      "id"
    );
  }, [data]);

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: tInvoices("admin-panel-invoices:table.column1"),
      width: 120,
    },
    {
      field: "invoiceNumber",
      headerName: tInvoices("admin-panel-invoices:table.column2"),
      width: 150,
    },
    {
      field: "customer",
      headerName: tInvoices("admin-panel-invoices:table.column3"),
      width: 200,
      valueGetter: (params: any) =>
        params.row.customer
          ? `${params.row.customer.firstName} ${params.row.customer.lastName}`
          : "-",
      renderCell: (params) => (
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
      field: "amount",
      headerName: tInvoices("admin-panel-invoices:table.column4"),
      width: 120,
      renderCell: (params) => formatCurrency(params.value),
    },
    {
      field: "amountDue",
      headerName: tInvoices("admin-panel-invoices:table.column5"),
      width: 120,
      valueGetter: (params: any) => params.row.amountDue ?? params.row.amount,
      renderCell: (params) => formatCurrency(params.value),
    },
    {
      field: "dueDate",
      headerName: tInvoices("admin-panel-invoices:table.column6"),
      width: 150,
      valueGetter: (params: any) =>
        params.value ? format(new Date(params.value), "dd/MM/yyyy") : "-",
    },
    {
      field: "status",
      headerName: tInvoices("admin-panel-invoices:table.column7"),
      width: 120,
      renderCell: (params) => {
        const statusColors: Record<
          InvoiceStatus,
          | "warning"
          | "success"
          | "default"
          | "error"
          | "primary"
          | "secondary"
          | "info"
        > = {
          [InvoiceStatus.PENDING]: "warning",
          [InvoiceStatus.PAID]: "success",
          [InvoiceStatus.CANCELLED]: "default",
          [InvoiceStatus.OVERDUE]: "error",
          [InvoiceStatus.FAILED]: "error",
        };

        return (
          <Chip
            label={tStatus(`invoice-status:${params.value}`)}
            color={statusColors[params.value as InvoiceStatus]}
            size="small"
          />
        );
      },
    },
    {
      field: "actions",
      headerName: "",
      width: 120,
      renderCell: (params) => <Actions invoice={params.row} />,
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
              {tInvoices("admin-panel-invoices:title")}
            </Typography>
          </Grid>
          <Grid container size="auto" wrap="nowrap" spacing={2}>
            <Grid size="auto">{/* <InvoiceFilter /> */}</Grid>
            <Grid size="auto">
              <Button
                variant="contained"
                LinkComponent={Link}
                href="/admin-panel/invoices/create"
                color="success"
              >
                {tInvoices("admin-panel-invoices:actions.create")}
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
                    {tInvoices("admin-panel-invoices:loadMore")}
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

export default withPageRequiredAuth(Invoices, {
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
