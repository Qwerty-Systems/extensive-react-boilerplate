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
import { useEffect, useMemo } from "react";
import { useSnackbar } from "@/hooks/use-snackbar";
import Link from "@/components/link";
import FormAvatarInput from "@/components/form/avatar-input/form-avatar-input";
import { FileEntity } from "@/services/api/types/file-entity";
import useLeavePage from "@/services/leave-page/use-leave-page";
import Box from "@mui/material/Box";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { useTranslation } from "@/services/i18n/client";
import {
  useGetTenantService,
  usePatchTenantService,
} from "@/services/api/services/tenants";
import { useParams } from "next/navigation";
import { TenantType } from "@/services/api/types/tenant";
// import FormCheckboxInput from "@/components/form/checkbox/form-checkbox";
import { SortEnum } from "@/services/api/types/sort-type";
import removeDuplicatesFromArrayObjects from "@/services/helpers/remove-duplicates-from-array-of-objects";
import { useGetTenantTypesQuery } from "../../queries/queries";
import { RoleEnum } from "@/services/api/types/role";
// import FormSelectInput from "@/components/form/select/form-select";

type EditTenantFormData = {
  name: string;
  domain: string;
  schemaName: string;
  primaryPhone: string;
  primaryEmail: string;
  logo?: FileEntity;
  type: {
    id: string;
  };
  isActive: boolean;
};

const useValidationEditTenantSchema = () => {
  const { t } = useTranslation("admin-panel-tenants-edit");

  return yup.object().shape({
    name: yup
      .string()
      .required(t("admin-panel-tenants-edit:inputs.name.validation.required")),
    domain: yup
      .string()
      .required(
        t("admin-panel-tenants-edit:inputs.domain.validation.required")
      ),
    schemaName: yup
      .string()
      .required(
        t("admin-panel-tenants-edit:inputs.schemaName.validation.required")
      ),
    primaryPhone: yup
      .string()
      .required(
        t("admin-panel-tenants-edit:inputs.primaryPhone.validation.required")
      ),
    primaryEmail: yup
      .string()
      .email(
        t("admin-panel-tenants-edit:inputs.primaryEmail.validation.invalid")
      )
      .required(
        t("admin-panel-tenants-edit:inputs.primaryEmail.validation.required")
      ),
    type: yup.object().shape({
      id: yup
        .string()
        .required(
          t("admin-panel-tenants-edit:inputs.type.validation.required")
        ),
    }),
    isActive: yup
      .boolean()
      .required(
        t("admin-panel-tenants-edit:inputs.isActive.validation.required")
      ),
  });
};

function EditTenantFormActions() {
  const { t } = useTranslation("admin-panel-tenants-edit");
  const { isSubmitting, isDirty } = useFormState();
  useLeavePage(isDirty);

  return (
    <Button
      variant="contained"
      color="primary"
      type="submit"
      disabled={isSubmitting}
    >
      {t("admin-panel-tenants-edit:actions.submit")}
    </Button>
  );
}

function FormEditTenant() {
  const params = useParams<{ id: string }>();
  const tenantId = params.id as string; // Type assertion for string
  const fetchGetTenant = useGetTenantService();
  const fetchPatchTenant = usePatchTenantService();
  const { t } = useTranslation("admin-panel-tenants-edit");
  const validationSchema = useValidationEditTenantSchema();

  const { enqueueSnackbar } = useSnackbar();

  const methods = useForm<EditTenantFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: "",
      domain: "",
      schemaName: "",
      primaryPhone: "",
      primaryEmail: "",
      type: {
        id: "",
      },
      isActive: true,
    },
  });

  const { handleSubmit, setError, reset } = methods;

  const onSubmit = handleSubmit(async (formData) => {
    const { data, status } = await fetchPatchTenant({
      id: tenantId,
      data: {
        ...formData,
        logo: formData.logo?.id,
        type: {
          id: formData.type.id,
        },
      },
    });

    if (status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
      (Object.keys(data.errors) as Array<keyof EditTenantFormData>).forEach(
        (key) => {
          setError(key, {
            type: "manual",
            message: t(
              `admin-panel-tenants-edit:inputs.${key}.validation.server.${data.errors[key]}`
            ),
          });
        }
      );
      return;
    }

    if (status === HTTP_CODES_ENUM.OK) {
      reset(formData);
      enqueueSnackbar(t("admin-panel-tenants-edit:alerts.tenant.success"), {
        variant: "success",
      });
    }
  });
  // Fetch tenant types on mount
  const { data, isLoading: isLoadingTenantTypes } = useGetTenantTypesQuery({
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
  useEffect(() => {
    const getInitialDataForEdit = async () => {
      if (isLoadingTenantTypes) return;
      const { status, data: tenant } = await fetchGetTenant({ id: tenantId });

      if (status === HTTP_CODES_ENUM.OK && tenant) {
        reset({
          name: tenant.name ?? "",
          domain: tenant.domain ?? "",
          schemaName: tenant.schemaName ?? "",
          primaryPhone: tenant.primaryPhone ?? "",
          primaryEmail: tenant.primaryEmail ?? "",
          type: {
            id: tenantTypes.find((t) => t.id === tenant.type?.id)?.id ?? "",
          },
          logo: tenant.logo,
          isActive: tenant.isActive ?? true,
        });
      }
    };
    getInitialDataForEdit();
  }, [tenantId, reset, fetchGetTenant, isLoadingTenantTypes, tenantTypes]);

  return (
    <FormProvider {...methods}>
      <Container maxWidth="xs">
        <form onSubmit={onSubmit}>
          <Grid container spacing={2} mb={3} mt={3}>
            <Grid sx={{ xs: 12 }}>
              <Typography variant="h6">
                {t("admin-panel-tenants-edit:title1")}
              </Typography>
            </Grid>
            <Grid sx={{ xs: 12 }}>
              <FormAvatarInput<EditTenantFormData> name="logo" testId="logo" />
            </Grid>

            <Grid sx={{ xs: 12 }}>
              <FormTextInput<EditTenantFormData>
                name="name"
                label={t("admin-panel-tenants-edit:inputs.name.label")}
              />
            </Grid>

            <Grid sx={{ xs: 12 }}>
              <FormTextInput<EditTenantFormData>
                name="domain"
                label={t("admin-panel-tenants-edit:inputs.domain.label")}
              />
            </Grid>

            <Grid sx={{ xs: 12 }}>
              <FormTextInput<EditTenantFormData>
                name="schemaName"
                label={t("admin-panel-tenants-edit:inputs.schemaName.label")}
              />
            </Grid>

            <Grid sx={{ xs: 12 }}>
              <FormTextInput<EditTenantFormData>
                name="primaryPhone"
                label={t("admin-panel-tenants-edit:inputs.primaryPhone.label")}
              />
            </Grid>

            <Grid sx={{ xs: 12 }}>
              <FormTextInput<EditTenantFormData>
                name="primaryEmail"
                label={t("admin-panel-tenants-edit:inputs.primaryEmail.label")}
              />
            </Grid>

            <Grid sx={{ xs: 12 }}>
              {/* <FormSelectInput<EditTenantFormData>
                name="type.id"
                label={t("admin-panel-tenants-edit:inputs.type.label")}
                options={tenantTypes}
                // keyValue="id"
                renderOption={(type: TenantType) => type.name}
                getOptionValue={(type: TenantType) => type.name}
              /> */}
            </Grid>

            <Grid sx={{ xs: 12 }}>
              {/* <FormCheckboxInput<EditTenantFormData>
                name="isActive"
                label={t("admin-panel-tenants-edit:inputs.isActive.label")}
                keyValue={[]}
                options={[]}
                keyExtractor={function (_option: unknown): string {
                  throw new Error("Function not implemented.");
                }}
                renderOption={function (_option: unknown): React.ReactNode {
                  throw new Error("Function not implemented.");
                }}
              /> */}
            </Grid>

            <Grid sx={{ xs: 12 }}>
              <EditTenantFormActions />
              <Box ml={1} component="span">
                <Button
                  variant="contained"
                  color="inherit"
                  LinkComponent={Link}
                  href="/admin-panel/tenants"
                >
                  {t("admin-panel-tenants-edit:actions.cancel")}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Container>
    </FormProvider>
  );
}

function EditTenant() {
  return (
    <>
      <FormEditTenant />
    </>
  );
}

export default withPageRequiredAuth(EditTenant, {
  roles: [RoleEnum.ADMIN, RoleEnum.PLATFORM_OWNER],
});
