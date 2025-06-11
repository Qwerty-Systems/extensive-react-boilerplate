"use client";

import Button from "@mui/material/Button";
import { useForm, FormProvider, useFormState } from "react-hook-form";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FormTextInput from "@/components/form/text-input/form-text-input";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import { useSnackbar } from "@/hooks/use-snackbar";
import Link from "@/components/link";
import useLeavePage from "@/services/leave-page/use-leave-page";
import Box from "@mui/material/Box";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { useTranslation } from "@/services/i18n/client";
import { usePostRegionService } from "@/services/api/services/regions";
import { useRouter } from "next/navigation";
import FormSelectInput from "@/components/form/select/form-select";
import { Tenant } from "@/services/api/types/tenant";
import FormDaysSelector from "@/components/form/days-selector/form-days-selector";
import Paper from "@mui/material/Paper";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import FormMultipleSelectExtendedInput from "@/components/form/multiple-select-extended/form-multiple-select-extended";
import FormTimeInput from "@/components/form/time-input/form-time-input";
import { useGetTenantsQuery } from "../../tenants/queries/queries";
import { useState } from "react";
import { RoleEnum } from "@/services/api/types/role";

interface CreateFormData {
  name: string;
  tenantId: string;
  serviceTypes: string[];
  zipCodes: string;
  operatingHours: {
    days: string[];
    startTime: string;
    endTime: string;
  };
}

const useValidationSchema = () => {
  const { t } = useTranslation("admin-panel-regions-create");

  return yup.object().shape({
    name: yup
      .string()
      .required(
        t("admin-panel-regions-create:inputs.name.validation.required")
      ),
    tenantId: yup
      .string()
      .required(
        t("admin-panel-regions-create:inputs.tenant.validation.required")
      ),
    serviceTypes: yup
      .array()
      .of(yup.string().required()) // Add element validation
      .required() // Mark array as required
      .min(
        1,
        t("admin-panel-regions-create:inputs.serviceTypes.validation.required")
      ),
    zipCodes: yup
      .string()
      .required(
        t("admin-panel-regions-create:inputs.zipCodes.validation.required")
      )
      .test(
        "valid-zip-codes",
        t("admin-panel-regions-create:inputs.zipCodes.validation.invalid"),
        (value) =>
          !!value && value.split(",").every((zip) => /^\d+$/.test(zip.trim()))
      ),
    operatingHours: yup.object().shape({
      days: yup
        .array()
        .of(yup.string().required()) // Add element validation
        .required() // Mark array as required
        .min(
          1,
          t("admin-panel-regions-create:inputs.days.validation.required")
        ),
      startTime: yup
        .string()
        .required(
          t("admin-panel-regions-create:inputs.startTime.validation.required")
        ),
      endTime: yup
        .string()
        .required(
          t("admin-panel-regions-create:inputs.endTime.validation.required")
        ),
    }),
  });
};

function CreateRegionFormActions() {
  const { t } = useTranslation("admin-panel-regions-create");
  const { isSubmitting, isDirty } = useFormState();
  useLeavePage(isDirty);

  return (
    <LoadingButton
      variant="contained"
      color="primary"
      type="submit"
      loading={isSubmitting}
      loadingPosition="start"
      startIcon={<SaveIcon />}
    >
      {isSubmitting
        ? t("admin-panel-regions-create:actions.submitting")
        : t("admin-panel-regions-create:actions.submit")}
    </LoadingButton>
  );
}

function FormCreateRegion() {
  const router = useRouter();
  const fetchPostRegion = usePostRegionService();
  const { t } = useTranslation("admin-panel-regions-create");
  const validationSchema = useValidationSchema();
  const { data: tenants } = useGetTenantsQuery();
  const { enqueueSnackbar } = useSnackbar();
  const [serviceTypesSearch, setServiceTypesSearch] = useState("");
  const methods = useForm<CreateFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: "",
      tenantId: "",
      serviceTypes: [],
      zipCodes: "",
      operatingHours: {
        days: [],
        startTime: "09:00",
        endTime: "17:00",
      },
    },
  });

  const { handleSubmit, setError } = methods;

  const onSubmit = handleSubmit(async (formData) => {
    const payload = {
      ...formData,
      tenantId: formData.tenantId,
      zipCodes: formData.zipCodes.split(",").map((zip: string) => zip.trim()),
      serviceTypes: formData.serviceTypes,
    };

    const { data, status } = await fetchPostRegion(payload);

    if (status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
      Object.entries(data.errors).forEach(([field, error]) => {
        setError(field as keyof CreateFormData, {
          type: "manual",
          message: t(
            `admin-panel-regions-create:inputs.${field}.validation.server.${error}`
          ),
        });
      });
      return;
    }

    if (status === HTTP_CODES_ENUM.CREATED) {
      enqueueSnackbar(t("admin-panel-regions-create:alerts.region.success"), {
        variant: "success",
      });
      router.push("/admin-panel/regions");
    }
  });

  return (
    <FormProvider {...methods}>
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
          <form onSubmit={onSubmit}>
            <Grid container spacing={3}>
              <Grid sx={{ xs: 12 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                  {t("admin-panel-regions-create:title")}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {t("admin-panel-regions-create:subtitle")}
                </Typography>
              </Grid>

              {/* Basic Information Section */}
              <Grid sx={{ xs: 12 }}>
                <Typography variant="h6" gutterBottom>
                  {t("admin-panel-regions-create:sections.basic")}
                </Typography>
              </Grid>

              <Grid sx={{ xs: 12, md: 6 }}>
                <FormTextInput<CreateFormData>
                  name="name"
                  label={t("admin-panel-regions-create:inputs.name.label")}
                  // fullWidth
                />
              </Grid>

              <Grid sx={{ xs: 12, md: 6 }}>
                <FormSelectInput<CreateFormData, Tenant>
                  name="tenantId"
                  label={t("admin-panel-regions-create:inputs.tenant.label")}
                  options={
                    tenants?.pages.flatMap((page: any) => page.data) || []
                  }
                  keyValue="id"
                  renderOption={(option) => option.name}
                  // fullWidth
                />
              </Grid>

              {/* Service Information Section */}
              <Grid sx={{ xs: 12 }}>
                <Typography variant="h6" gutterBottom>
                  {t("admin-panel-regions-create:sections.service")}
                </Typography>
              </Grid>

              <Grid sx={{ xs: 12, md: 6 }}>
                <FormMultipleSelectExtendedInput
                  name="serviceTypes"
                  label={t(
                    "admin-panel-regions-create:inputs.serviceTypes.label"
                  )}
                  options={[
                    { value: "delivery", label: t("services.delivery") },
                    { value: "pickup", label: t("services.pickup") },
                    {
                      value: "installation",
                      label: t("services.installation"),
                    },
                  ]}
                  keyExtractor={(option) => option.value}
                  renderSelected={(selected) =>
                    selected.map((s) => s.label).join(", ")
                  }
                  renderOption={(option) => option.label}
                  isSearchable
                  search={serviceTypesSearch} // Add this
                  onSearchChange={setServiceTypesSearch} // Update this
                  searchLabel={t("common:search")}
                  searchPlaceholder={t("common:searchPlaceholder")}
                />
              </Grid>

              <Grid sx={{ xs: 12, md: 6 }}>
                <FormTextInput<CreateFormData>
                  name="zipCodes"
                  label={t("admin-panel-regions-create:inputs.zipCodes.label")}
                  helperText={t(
                    "admin-panel-regions-create:inputs.zipCodes.helperText"
                  )}
                  // fullWidth
                />
              </Grid>

              {/* Operating Hours Section */}
              <Grid sx={{ xs: 12 }}>
                <Typography variant="h6" gutterBottom>
                  {t("admin-panel-regions-create:sections.operatingHours")}
                </Typography>
              </Grid>

              <Grid sx={{ xs: 12, md: 4 }}>
                <FormDaysSelector
                  name="operatingHours.days"
                  label={t("admin-panel-regions-create:inputs.days.label")}
                />
              </Grid>

              <Grid sx={{ xs: 6, md: 4 }}>
                <FormTimeInput
                  name="operatingHours.startTime"
                  label={t("admin-panel-regions-create:inputs.startTime.label")}
                  fullWidth
                />
              </Grid>

              <Grid sx={{ xs: 6, md: 4 }}>
                <FormTimeInput
                  name="operatingHours.endTime"
                  label={t("admin-panel-regions-create:inputs.endTime.label")}
                  fullWidth
                />
              </Grid>

              {/* Form Actions */}
              <Grid sx={{ xs: 12, mt: 4 }}>
                <Box display="flex" gap={2}>
                  <CreateRegionFormActions />
                  <Button
                    variant="outlined"
                    color="inherit"
                    LinkComponent={Link}
                    href="/admin-panel/regions"
                  >
                    {t("admin-panel-regions-create:actions.cancel")}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </FormProvider>
  );
}

function CreateRegion() {
  return <FormCreateRegion />;
}

export default withPageRequiredAuth(CreateRegion, {
  roles: [RoleEnum.ADMIN, RoleEnum.PLATFORM_OWNER],
});
