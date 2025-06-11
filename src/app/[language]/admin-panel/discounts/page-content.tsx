// app/admin-panel/discounts/page.tsx
"use client";

import { useGetDiscountsQuery } from "./queries/queries";
import { RoleEnum } from "@/services/api/types/role";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import { useTranslation } from "@/services/i18n/client";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Link from "@/components/link";
import useConfirmDialog from "@/components/confirm-dialog/use-confirm-dialog";
import {
  DiscountEntity,
  DiscountTypeEnum,
  useDeleteDiscountService,
} from "@/services/api/services/discounts";
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

type DiscountsKeys = keyof DiscountEntity;

function Actions({ discount }: { discount: DiscountEntity }) {
  const { confirmDialog } = useConfirmDialog();
  const fetchDiscountDelete = useDeleteDiscountService();
  const queryClient = useQueryClient();
  const { t: tDiscounts } = useTranslation("admin-panel-discounts");

  const handleDelete = async () => {
    const isConfirmed = await confirmDialog({
      title: tDiscounts("admin-panel-discounts:confirm.delete.title"),
      message: tDiscounts("admin-panel-discounts:confirm.delete.message"),
    });

    if (isConfirmed) {
      const searchParams = new URLSearchParams(window.location.search);
      const filter = searchParams.get("filter");
      const sort = searchParams.get("sort");

      const previousData = queryClient.getQueryData<any>([
        "discounts",
        { sort, filter },
      ]);

      queryClient.setQueryData(["discounts", { sort, filter }], {
        ...previousData,
        pages: previousData?.pages.map((page: any) => ({
          ...page,
          data: page?.data.filter(
            (item: DiscountEntity) => item.id !== discount.id
          ),
        })),
      });

      await fetchDiscountDelete({ id: discount.id });
    }
  };

  return (
    <Box display="flex" gap={1}>
      <Tooltip title={tDiscounts("admin-panel-discounts:actions.edit")}>
        <IconButton
          size="small"
          LinkComponent={Link}
          href={`/admin-panel/discounts/edit/${discount.id}`}
          color="primary"
        >
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title={tDiscounts("admin-panel-discounts:actions.delete")}>
        <IconButton size="small" onClick={handleDelete} color="error">
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

function Discounts() {
  const { t: tDiscounts } = useTranslation("admin-panel-discounts");
  const { t: tDiscountTypes } = useTranslation("discount-type");
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
    useGetDiscountsQuery({
      filter,
      sort: {
        order: (sortModel[0]?.sort?.toUpperCase() as SortEnum) || SortEnum.DESC,
        orderBy: (sortModel[0]?.field as DiscountsKeys) || "id",
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
    return removeDuplicatesFromArrayObjects<DiscountEntity>(
      allData as DiscountEntity[],
      "id"
    );
  }, [data]);

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: tDiscounts("admin-panel-discounts:table.column1"),
      width: 120,
    },
    {
      field: "description",
      headerName: tDiscounts("admin-panel-discounts:table.column2"),
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Box
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {params.value || "-"}
        </Box>
      ),
    },
    {
      field: "type",
      headerName: tDiscounts("admin-panel-discounts:table.column3"),
      width: 150,
      renderCell: (params) => (
        <Chip
          label={tDiscountTypes(`discount-type:${params.value}`)}
          color="primary"
          size="small"
        />
      ),
    },
    {
      field: "value",
      headerName: tDiscounts("admin-panel-discounts:table.column4"),
      width: 120,
      renderCell: (params) => (
        <span>
          {params.row.type === DiscountTypeEnum.PERCENTAGE
            ? `${params.value}%`
            : `$${params.value.toFixed(2)}`}
        </span>
      ),
    },
    {
      field: "validRange",
      headerName: tDiscounts("admin-panel-discounts:table.column5"),
      width: 250,
      valueGetter: (params: any) =>
        `${format(new Date(params.row.validFrom), "dd/MM/yyyy")} - ${format(new Date(params.row.validTo), "dd/MM/yyyy")}`,
    },
    {
      field: "isActive",
      headerName: tDiscounts("admin-panel-discounts:table.column6"),
      width: 120,
      renderCell: (params) => (
        <Chip
          label={
            params.value
              ? tDiscounts("admin-panel-discounts:status.active")
              : tDiscounts("admin-panel-discounts:status.inactive")
          }
          color={params.value ? "success" : "error"}
          size="small"
        />
      ),
    },
    {
      field: "actions",
      headerName: "",
      width: 120,
      renderCell: (params) => <Actions discount={params.row} />,
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
              {tDiscounts("admin-panel-discounts:title")}
            </Typography>
          </Grid>
          <Grid container size="auto" wrap="nowrap" spacing={2}>
            <Grid size="auto">{/* <DiscountFilter /> */}</Grid>
            <Grid size="auto">
              <Button
                variant="contained"
                LinkComponent={Link}
                href="/admin-panel/discounts/create"
                color="success"
              >
                {tDiscounts("admin-panel-discounts:actions.create")}
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
                    {tDiscounts("admin-panel-discounts:loadMore")}
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

export default withPageRequiredAuth(Discounts, {
  roles: [RoleEnum.ADMIN, RoleEnum.PLATFORM_OWNER],
});
