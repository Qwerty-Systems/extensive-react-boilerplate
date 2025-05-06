"use client";

import { useForm, FormProvider, useFormState } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import { useSnackbar } from "@/hooks/use-snackbar";
import useLeavePage from "@/services/leave-page/use-leave-page";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/services/i18n/client";

import { usePostTenantService } from "@/services/api/services/tenants";

import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { FileEntity } from "@/services/api/types/file-entity";
import { TenantType } from "@/services/api/services/tenant-types";
import { RoleEnum } from "@/services/api/types/role";

import FormTextInput from "@/components/form/text-input/form-text-input";
import FormAvatarInput from "@/components/form/avatar-input/form-avatar-input";
import FormSelectInput from "@/components/form/select/form-select";
import Link from "@/components/link";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import { useGetTenantTypesQuery } from "../queries/queries";
import { SortEnum } from "@/services/api/types/sort-type";
import { useMemo } from "react";
import removeDuplicatesFromArrayObjects from "@/services/helpers/remove-duplicates-from-array-of-objects";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import LoadingButton from "@mui/lab/LoadingButton";

type CreateTenantFormData = {
  domain: string;
  schemaName: string;
  logo?: FileEntity;
  primaryPhone: string;
  primaryEmail: string;
  name: string;
  type: { id: string };
  isActive?: boolean;
};

// type BooleanOption = { /* value: boolean; */ label: string };

const useValidationSchema = () => {
  const { t } = useTranslation("admin-panel-tenants-create");

  return yup.object().shape({
    domain: yup.string().required(t("inputs.domain.validation.required")),
    schemaName: yup
      .string()
      .required(t("inputs.schemaName.validation.required")),
    name: yup.string().required(t("inputs.name.validation.required")),
    primaryPhone: yup
      .string()
      .required(t("inputs.primaryPhone.validation.required")),
    primaryEmail: yup
      .string()
      .email(t("inputs.primaryEmail.validation.invalid"))
      .required(t("inputs.primaryEmail.validation.required")),
    logo: yup.mixed(),
    type: yup.object().shape({
      id: yup.string().required(t("inputs.type.validation.required")),
    }),
    isActive: yup.boolean().optional(),
  });
};

function CreateTenantFormActions() {
  const { t } = useTranslation("admin-panel-tenants-create");
  const { isSubmitting, isDirty } = useFormState();
  useLeavePage(isDirty);

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      justifyContent="space-between"
      mt={4}
    >
      <LoadingButton
        variant="contained"
        color="primary"
        type="submit"
        loading={isSubmitting}
        // fullWidth={{ xs: true, sm: false }}
      >
        {t("actions.submit")}
      </LoadingButton>
      <Button
        variant="outlined"
        color="inherit"
        LinkComponent={Link}
        href="/admin-panel/tenants"
        // fullWidth={{ xs: true, sm: false }}
      >
        {t("actions.cancel")}
      </Button>
    </Stack>
  );
}
function FormCreateTenant() {
  const router = useRouter();
  const fetchPostTenant = usePostTenantService();
  const { t } = useTranslation("admin-panel-tenants-create");
  const validationSchema = useValidationSchema();
  const { enqueueSnackbar } = useSnackbar();
  const { data } = useGetTenantTypesQuery({
    filter: undefined, // Add filters if needed
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
  const methods = useForm<CreateTenantFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      domain: "",
      schemaName: "",
      logo: undefined,
      primaryPhone: "",
      primaryEmail: "",
      name: "",
      type: { id: "" },
      isActive: true,
    },
  });

  const { handleSubmit, setError } = methods;

  const onSubmit = handleSubmit(async (formData) => {
    const { data, status } = await fetchPostTenant(formData);
    if (status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
      (Object.keys(data.errors) as Array<keyof CreateTenantFormData>).forEach(
        (key) => {
          setError(key, {
            type: "manual",
            message: t(`inputs.${key}.validation.server.${data.errors[key]}`),
          });
        }
      );
      return;
    }

    if (status === HTTP_CODES_ENUM.CREATED) {
      enqueueSnackbar(t("alerts.tenant.success"), { variant: "success" });
      router.push("/admin-panel/tenants");
    }
  });

  return (
    <FormProvider {...methods}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 4 }}>
          <Box mb={4}>
            <Typography variant="h4" component="h1" gutterBottom>
              {t("title")}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {t("subtitle")}
            </Typography>
          </Box>

          <form onSubmit={onSubmit} autoComplete="off">
            <Grid container spacing={3}>
              {/* Logo Upload */}
              <Grid sx={{ xs: 12 }}>
                <Box display="flex" justifyContent="center" mb={4}>
                  <FormAvatarInput<CreateTenantFormData>
                    name="logo"
                    testId="logo"
                    helperText={t("inputs.logo.helperText")}
                  />
                </Box>
              </Grid>

              {/* Main Form Fields */}
              <Grid sx={{ xs: 12, md: 6 }}>
                <FormTextInput<CreateTenantFormData>
                  name="name"
                  testId="tenant-name"
                  label={t("inputs.name.label")}
                  placeholder={t("inputs.name.placeholder")}
                />
              </Grid>

              <Grid sx={{ xs: 12, md: 6 }}>
                <FormTextInput<CreateTenantFormData>
                  name="domain"
                  testId="tenant-domain"
                  label={t("inputs.domain.label")}
                  placeholder="example.com"
                />
              </Grid>

              <Grid sx={{ xs: 12 }}>
                <FormTextInput<CreateTenantFormData>
                  name="schemaName"
                  testId="tenant-schemaName"
                  label={t("inputs.schemaName.label")}
                  placeholder="unique_schema_name"
                />
              </Grid>

              <Grid sx={{ xs: 12, md: 6 }}>
                <FormTextInput<CreateTenantFormData>
                  name="primaryPhone"
                  testId="tenant-primaryPhone"
                  label={t("inputs.primaryPhone.label")}
                  placeholder="+1 234 567 890"
                />
              </Grid>

              <Grid sx={{ xs: 12, md: 6 }}>
                <FormTextInput<CreateTenantFormData>
                  name="primaryEmail"
                  testId="tenant-primaryEmail"
                  label={t("inputs.primaryEmail.label")}
                  // placeholder="contact@example.com"
                />
              </Grid>

              <Grid sx={{ xs: 12, md: 6 }}>
                <FormSelectInput<CreateTenantFormData, TenantType>
                  name="type"
                  testId="type"
                  keyValue="id"
                  label={t("inputs.type.label")}
                  options={tenantTypes}
                  renderOption={(option) => option.name}
                  // placeholder={t("inputs.type.placeholder")}
                />
              </Grid>

              <Grid sx={{ xs: 12, md: 6 }}>
                {/* <FormSelectInput<CreateTenantFormData, BooleanOption>
                  name="isActive"
                  testId="tenant-isActive"
                  label={t("inputs.isActive.label")}
                  options={[
                    { label: t("options.active") },
                    { label: t("options.inactive") },
                  ]}
                  keyValue="label"
                  renderOption={(option) => option.label}
                /> */}
              </Grid>
            </Grid>

            <Alert severity="info" sx={{ mt: 3, mb: 2 }}>
              {t("form.requiredFieldsNote")}
            </Alert>

            <CreateTenantFormActions />
          </form>
        </Paper>
      </Container>
    </FormProvider>
  );
}

function CreateTenant() {
  return <FormCreateTenant />;
}

export default withPageRequiredAuth(CreateTenant, {
  roles: [RoleEnum.ADMIN, RoleEnum.PLATFORM_OWNER],
});
