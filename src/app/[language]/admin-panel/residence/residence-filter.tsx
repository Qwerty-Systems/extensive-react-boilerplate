"use client";

import FormMultipleSelectInput from "@/components/form/multiple-select/form-multiple-select";
import { useTranslation } from "@/services/i18n/client";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Popover from "@mui/material/Popover";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ResidenceFilterType } from "./residence-filter-types";
import { ResidenceType } from "@/services/api/types/residence";

type ResidenceFilterFormData = ResidenceFilterType;

function ResidenceFilter() {
  const { t } = useTranslation("admin-panel-residences");
  const router = useRouter();
  const searchParams = useSearchParams();

  const methods = useForm<ResidenceFilterFormData>({
    defaultValues: {
      types: [], // Adjust key based on actual filter shape
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
  const id = open ? "residence-filter-popover" : undefined;

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
        <Container
          sx={{
            minWidth: 300,
          }}
        >
          <form
            onSubmit={handleSubmit((data) => {
              const searchParams = new URLSearchParams(window.location.search);
              searchParams.set("filter", JSON.stringify(data));
              router.push(
                window.location.pathname + "?" + searchParams.toString()
              );
            })}
          >
            <Grid container spacing={2} mb={3} mt={3}>
              <Grid sx={{ xs: 12 }}>
                <FormMultipleSelectInput<
                  ResidenceFilterFormData,
                  { id: ResidenceType }
                >
                  name="types"
                  testId="types"
                  label={t("admin-panel-residences:filter.inputs.type.label")}
                  options={Object.values(ResidenceType).map((type) => ({
                    id: type,
                  }))}
                  keyValue="id"
                  renderOption={(option) =>
                    t(
                      `admin-panel-residences:filter.inputs.type.options.${option.id}`
                    )
                  }
                  renderValue={(values) =>
                    values
                      .map((value) =>
                        t(
                          `admin-panel-residences:filter.inputs.type.options.${value.id}`
                        )
                      )
                      .join(", ")
                  }
                />
              </Grid>
              <Grid sx={{ xs: 12 }}>
                <Button variant="contained" type="submit">
                  {t("admin-panel-residences:filter.actions.apply")}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Container>
      </Popover>
      <Button aria-describedby={id} variant="contained" onClick={handleClick}>
        {t("admin-panel-residences:filter.actions.filter")}
      </Button>
    </FormProvider>
  );
}

export default ResidenceFilter;
