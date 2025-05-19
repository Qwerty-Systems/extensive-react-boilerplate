"use client";

import FormMultipleSelectInput from "@/components/form/multiple-select/form-multiple-select";
import { AccountFilterType } from "./accounts-filter-types";
import {
  AccountTypeEnum,
  NotificationChannelEnum,
} from "@/utils/enum/account-type.enum";
import { useTranslation } from "@/services/i18n/client";
// eslint-disable-next-line no-restricted-imports
import {
  Button,
  Container,
  Grid,
  Popover,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

type FormData = AccountFilterType;

export default function AccountFilter() {
  const { t } = useTranslation("admin-panel-accounts");
  const router = useRouter();
  const searchParams = useSearchParams();

  const methods = useForm<FormData>({
    defaultValues: {
      types: [],
      notificationChannel: [],
      active: undefined,
    },
  });
  const { handleSubmit, reset, register, getValues } = methods;

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const id = open ? "account-filter-popover" : undefined;

  useEffect(() => {
    const filter = searchParams.get("filter");
    if (filter) {
      setAnchorEl(null);
      reset(JSON.parse(filter));
    }
  }, [searchParams, reset]);

  return (
    <FormProvider {...methods}>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Container sx={{ minWidth: 320, p: 2 }}>
          <form
            onSubmit={handleSubmit((data) => {
              const params = new URLSearchParams(window.location.search);
              params.set("filter", JSON.stringify(data));
              router.push(window.location.pathname + "?" + params.toString());
            })}
          >
            <Grid container spacing={2}>
              <Grid sx={{ xs: 12 }}>
                <FormMultipleSelectInput<FormData, { id: AccountTypeEnum }>
                  name="types"
                  label={t("filter.inputs.types.label", "Account Types")}
                  options={Object.values(AccountTypeEnum).map((type) => ({
                    id: type,
                  }))}
                  keyValue="id"
                  renderOption={(opt) => t(`accountTypes.${opt.id}`, opt.id)}
                  renderValue={(vals) =>
                    vals.map((v) => t(`accountTypes.${v.id}`, v.id)).join(", ")
                  }
                />
              </Grid>

              <Grid sx={{ xs: 12 }}>
                <FormMultipleSelectInput<
                  FormData,
                  { id: NotificationChannelEnum }
                >
                  name="notificationChannel"
                  label={t(
                    "filter.inputs.channel.label",
                    "Notification Channels"
                  )}
                  options={Object.values(NotificationChannelEnum).map((ch) => ({
                    id: ch,
                  }))}
                  keyValue="id"
                  renderOption={(opt) =>
                    t(`notificationChannels.${opt.id}`, opt.id)
                  }
                  renderValue={(vals) =>
                    vals
                      .map((v) => t(`notificationChannels.${v.id}`, v.id))
                      .join(", ")
                  }
                />
              </Grid>

              <Grid sx={{ xs: 12 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      {...register("active")}
                      defaultChecked={getValues("active") ?? false}
                    />
                  }
                  label={t("filter.inputs.active.label", "Active")}
                />
              </Grid>

              <Grid sx={{ xs: 12 }}>
                <Button variant="contained" type="submit">
                  {t("filter.actions.apply", "Apply")}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Container>
      </Popover>

      <Button
        aria-describedby={id}
        variant="outlined"
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        {t("filter.actions.filter", "Filter")}
      </Button>
    </FormProvider>
  );
}
