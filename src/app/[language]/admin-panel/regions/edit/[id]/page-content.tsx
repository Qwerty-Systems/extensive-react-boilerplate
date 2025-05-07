"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useForm, FormProvider, useFormState } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import { useSnackbar } from "@/hooks/use-snackbar";
import useLeavePage from "@/services/leave-page/use-leave-page";

import {
  useGetRegionService,
  usePatchRegionService,
} from "@/services/api/services/regions";
import { RoleEnum } from "@/services/api/types/role";
import { FileEntity } from "@/services/api/types/file-entity";

import { useTranslation } from "@/services/i18n/client";

import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import FormTextInput from "@/components/form/text-input/form-text-input";
import FormAvatarInput from "@/components/form/avatar-input/form-avatar-input";
import FormSelectInput from "@/components/form/select/form-select";
import Link from "@/components/link";

// --- Types ---
type EditRegionFormData = {
  name: string;
  zipCodes?: string[]; // array of strings, validated individually
  operatingHours?: {
    days: string[]; // Ensure this is always an array
    startTime: string;
    endTime: string;
  };
  serviceTypes?: string[];
  boundary?: {
    type: string;
    coordinates: Array<Array<number[]>>;
  };
  tenant?: {
    id: string;
    name?: string;
  };
  photo?: FileEntity;
};

// --- Validation Schema ---
const useValidationEditRegionSchema = () => {
  const { t } = useTranslation("admin-panel-regions-create");

  return yup.object().shape({
    name: yup
      .string()
      .required(
        t("admin-panel-regions-create:inputs.name.validation.required")
      ),

    tenant: yup
      .object()
      .shape({
        id: yup
          .string()
          .required(
            t("admin-panel-regions-create:inputs.tenant.validation.required")
          ),
        name: yup.string(), // Optional or required as needed
      })
      .optional(),

    serviceTypes: yup
      .array()
      .of(yup.string().required())
      .min(
        1,
        t("admin-panel-regions-create:inputs.serviceTypes.validation.required")
      )
      .optional(),

    // zipCodes: yup
    //   .array()
    //   .of(
    //     yup
    //       .string()
    //       .matches(
    //         /^\d+$/,
    //         t("admin-panel-regions-create:inputs.zipCodes.validation.invalid")
    //       )
    //   )
    //   .min(1)
    //   .optional(),

    // operatingHours: yup
    //   .object()
    //   .shape({
    //     days: yup
    //       .array()
    //       .of(yup.string().required())
    //       .min(
    //         1,
    //         t("admin-panel-regions-create:inputs.days.validation.required")
    //       )
    //       .optional(),
    //     startTime: yup.string().optional(),
    //     endTime: yup.string().optional(),
    //   })
    //   .optional(),
  });
};

// --- Form Submit Button ---
function EditRegionFormActions() {
  const { t } = useTranslation("admin-panel-regions-edit");
  const { isSubmitting, isDirty } = useFormState();
  useLeavePage(isDirty);

  return (
    <Button
      type="submit"
      variant="contained"
      color="primary"
      disabled={isSubmitting}
    >
      {t("actions.submit")}
    </Button>
  );
}

// --- Main Form ---
function FormEditRegion() {
  const { t } = useTranslation("admin-panel-regions-edit");
  const params = useParams<{ id: string }>();
  const regionId = params.id;

  const fetchGetRegion = useGetRegionService();
  const fetchPatchRegion = usePatchRegionService();
  const { enqueueSnackbar } = useSnackbar();

  const validationSchema = useValidationEditRegionSchema();

  const methods = useForm<EditRegionFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: "",
      zipCodes: [], // array of strings
      operatingHours: {
        days: [], // initialized as an empty array
        startTime: "",
        endTime: "",
      },
      serviceTypes: [],
      boundary: {
        type: "",
        coordinates: [],
      },
      tenant: {
        id: "", // always a defined string
      },
      photo: undefined,
    },
  });

  const { handleSubmit, setError, reset } = methods;

  // --- Submit Logic ---
  const onSubmit = handleSubmit(async (formData) => {
    const { status, data } = await fetchPatchRegion({
      id: regionId,
      data: formData,
    });

    if (status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
      Object.entries(data.errors).forEach(([key, errorMsg]) => {
        setError(key as keyof EditRegionFormData, {
          type: "manual",
          message: t(`inputs.${key}.validation.server.${errorMsg}`),
        });
      });
      return;
    }

    if (status === HTTP_CODES_ENUM.OK) {
      reset(formData);
      enqueueSnackbar(t("alerts.region.success"), { variant: "success" });
    }
  });

  // --- Load Region Data ---
  useEffect(() => {
    const loadRegion = async () => {
      //TODO // const { status, data } = await fetchGetRegion({ id: regionId });
      // if (status === HTTP_CODES_ENUM.OK) reset(data);
    };

    loadRegion();
  }, [regionId, reset, fetchGetRegion]);

  return (
    <FormProvider {...methods}>
      <Container maxWidth="sm">
        <form onSubmit={onSubmit}>
          <Grid container spacing={2} mt={3} mb={3}>
            <Grid sx={{ xs: 12 }}>
              <Typography variant="h6">{t("title1")}</Typography>
            </Grid>

            <Grid sx={{ xs: 12 }}>
              <FormAvatarInput name="photo" testId="photo" helperText="" />
            </Grid>
            <Grid sx={{ xs: 12 }}>
              <FormTextInput
                name="name"
                testId="name"
                label={t("inputs.name.label")}
              />
            </Grid>
            <Grid sx={{ xs: 12 }}>
              <FormTextInput
                name="zipCodes"
                testId="zipCodes"
                label={t("inputs.zipCodes.label")}
                multiline
              />
            </Grid>
            <Grid sx={{ xs: 12 }}>
              <FormTextInput
                name="operatingHours.days"
                testId="days"
                label={t("inputs.operatingHours.days.label")}
                multiline
              />
            </Grid>
            <Grid sx={{ xs: 12 }}>
              <FormTextInput
                name="operatingHours.startTime"
                testId="startTime"
                label={t("inputs.operatingHours.startTime.label")}
              />
            </Grid>
            <Grid sx={{ xs: 12 }}>
              <FormTextInput
                name="operatingHours.endTime"
                testId="endTime"
                label={t("inputs.operatingHours.endTime.label")}
              />
            </Grid>
            <Grid sx={{ xs: 12 }}>
              <FormTextInput
                name="serviceTypes"
                testId="serviceTypes"
                label={t("inputs.serviceTypes.label")}
                multiline
              />
            </Grid>
            <Grid sx={{ xs: 12 }}>
              <FormTextInput
                name="centroidLat"
                testId="centroidLat"
                label={t("inputs.centroidLat.label")}
                type="number"
              />
            </Grid>
            <Grid sx={{ xs: 12 }}>
              <FormTextInput
                name="centroidLon"
                testId="centroidLon"
                label={t("inputs.centroidLon.label")}
                type="number"
              />
            </Grid>
            <Grid sx={{ xs: 12 }}>
              <FormTextInput
                name="boundary.type"
                testId="boundaryType"
                label={t("inputs.boundary.type.label")}
              />
            </Grid>
            <Grid sx={{ xs: 12 }}>
              <FormTextInput
                name="boundary.coordinates"
                testId="boundaryCoordinates"
                label={t("inputs.boundary.coordinates.label")}
                multiline
              />
            </Grid>
            <Grid sx={{ xs: 12 }}>
              <FormTextInput
                name="tenant.id"
                testId="tenantId"
                label={t("inputs.tenant.id.label")}
              />
            </Grid>
            <Grid sx={{ xs: 12 }}>
              <FormTextInput
                name="tenant.name"
                testId="tenantName"
                label={t("inputs.tenant.name.label")}
              />
            </Grid>

            <Grid sx={{ xs: 12 }}>
              <FormSelectInput
                name="role"
                testId="role"
                label={t("inputs.role.label")}
                options={[
                  { id: RoleEnum.ADMIN },
                  { id: RoleEnum.USER },
                  { id: RoleEnum.AGENT },
                  { id: RoleEnum.CUSTOMER },
                  { id: RoleEnum.MANAGER },
                ]}
                keyValue="id"
                renderOption={(option) => t(`inputs.role.options.${option.id}`)}
              />
            </Grid>

            <Grid sx={{ xs: 12 }}>
              <EditRegionFormActions />
              <Box ml={1} component="span">
                <Button
                  variant="contained"
                  color="inherit"
                  LinkComponent={Link}
                  href="/admin-panel/regions"
                >
                  {t("actions.cancel")}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Container>
    </FormProvider>
  );
}

// --- Exported Page ---
function EditRegionPage() {
  return <FormEditRegion />;
}

export default withPageRequiredAuth(EditRegionPage, {
  roles: [RoleEnum.ADMIN, RoleEnum.PLATFORM_OWNER],
});
