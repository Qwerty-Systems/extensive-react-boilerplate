"use client";

import FormMultipleSelectInput from "@/components/form/multiple-select/form-multiple-select";
import FormSelectInput from "@/components/form/select/form-select";
import { useTranslation } from "@/services/i18n/client";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Popover from "@mui/material/Popover";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { AccountFilterType } from "./accounts-filter-types";
import { AccountTypeEnum } from "@/services/api/services/accounts";

type AccountFilterFormData = AccountFilterType;

function AccountFilter() {
  const { t } = useTranslation("admin-panel-accounts");
  const router = useRouter();
  const searchParams = useSearchParams();

  const methods = useForm<AccountFilterFormData>({
    defaultValues: {
      type: [],
      active: undefined,
      tenantId: "",
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
  const id = open ? "account-filter-popover" : undefined;

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
        <Container sx={{ minWidth: 300, py: 2 }}>
          <form
            onSubmit={handleSubmit((data) => {
              const searchParams = new URLSearchParams(window.location.search);
              searchParams.set("filter", JSON.stringify(data));
              router.push(
                window.location.pathname + "?" + searchParams.toString()
              );
            })}
          >
            <Grid container spacing={2}>
              <Grid sx={{ xs: 12 }}>
                <FormMultipleSelectInput<
                  AccountFilterFormData,
                  { value: AccountTypeEnum; label: string }
                >
                  name="type"
                  label={t("filter.type")}
                  options={Object.values(AccountTypeEnum).map((type) => ({
                    value: type,
                    label: t(`account.types.${type}`),
                  }))}
                  keyValue="value"
                  renderOption={(option) => option.label}
                  renderValue={(selected) =>
                    selected.map((s) => s.label).join(", ")
                  }
                />
              </Grid>
              <Grid sx={{ xs: 12 }}>
                <FormSelectInput<
                  AccountFilterFormData,
                  { value: boolean; label: string }
                >
                  name="active"
                  label={t("filter.status")}
                  options={[
                    { value: true, label: t("status.active") },
                    { value: false, label: t("status.inactive") },
                  ]}
                  keyValue="value"
                  renderOption={(option) => option.label}
                />
              </Grid>
              <Grid sx={{ xs: 12 }}>
                <Button fullWidth variant="contained" type="submit">
                  {t("actions.apply")}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Container>
      </Popover>
      <Button aria-describedby={id} variant="outlined" onClick={handleClick}>
        {t("actions.filter")}
      </Button>
    </FormProvider>
  );
}

export default AccountFilter;
