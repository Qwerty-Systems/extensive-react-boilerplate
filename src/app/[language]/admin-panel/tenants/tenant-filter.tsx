"use client";

import FormMultipleSelectInput from "@/components/form/multiple-select/form-multiple-select";
import { useTranslation } from "@/services/i18n/client";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Popover from "@mui/material/Popover";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { TenantFilterType } from "./tenant-filter-types";
import { TenantType } from "@/services/api/types/tenant";
import { SortEnum } from "@/services/api/types/sort-type";
import removeDuplicatesFromArrayObjects from "@/services/helpers/remove-duplicates-from-array-of-objects";
import { useGetTenantTypesQuery } from "./queries/queries";

type TenantFilterFormData = TenantFilterType;

function TenantFilter() {
  const { t } = useTranslation("admin-panel-users");
  const router = useRouter();
  const searchParams = useSearchParams();
  const methods = useForm<TenantFilterFormData>({
    defaultValues: {
      type: [],
    },
  });

  const { handleSubmit, reset } = methods;
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "tenant-filter-popover" : undefined;
  const { data } = useGetTenantTypesQuery({
    filter: undefined,
    sort: {
      order: SortEnum.ASC,
      orderBy: "name",
    },
  });
  const tenantTypes = useMemo(() => {
    const allData = data?.pages.flatMap((page) => page?.data) || [];
    return removeDuplicatesFromArrayObjects<TenantType>(
      allData as unknown as TenantType[],
      "id"
    );
  }, [data]);

  useEffect(() => {
    const filter = searchParams.get("filter");
    if (filter) {
      handleClose();
      const filterParsed = JSON.parse(filter);
      reset(filterParsed);
    }
  }, [searchParams, reset]);

  return (
    <FormProvider {...methods}>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Container sx={{ minWidth: 300 }}>
          <form
            onSubmit={handleSubmit((data) => {
              const searchParams = new URLSearchParams(window.location.search);
              searchParams.set("filter", JSON.stringify(data));
              router.push(`${window.location.pathname}?${searchParams}`);
            })}
          >
            <Grid container spacing={2} mb={3} mt={3}>
              <Grid sx={{ xs: 12 }}>
                <FormMultipleSelectInput<
                  TenantFilterFormData,
                  Pick<TenantType, "code" | "name">
                >
                  name="type"
                  testId="tenant-type"
                  label={t("admin-panel-users:filter.inputs.tenantType.label")}
                  options={tenantTypes || []}
                  keyValue="code"
                  renderOption={(option) => option.name}
                  renderValue={(values) => values.map((v) => v.name).join(", ")}
                />
              </Grid>
              <Grid sx={{ xs: 12 }}>
                <Button variant="contained" type="submit">
                  {t("admin-panel-users:filter.actions.apply")}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Container>
      </Popover>

      <Button aria-describedby={id} variant="contained" onClick={handleClick}>
        {t("admin-panel-users:filter.actions.filter")}
      </Button>
    </FormProvider>
  );
}

export default TenantFilter;
