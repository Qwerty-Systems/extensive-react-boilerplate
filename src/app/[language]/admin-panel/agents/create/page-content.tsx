"use client";

// Core React and Next imports
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "@/components/link";

// Material UI components
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";

// Form handling libraries
import { useForm, FormProvider, useFormState } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// Custom form components
import FormTextInput from "@/components/form/text-input/form-text-input";
import FormAvatarInput from "@/components/form/avatar-input/form-avatar-input";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import { useSnackbar } from "@/hooks/use-snackbar";
import useLeavePage from "@/services/leave-page/use-leave-page";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { useTranslation } from "@/services/i18n/client";
import { usePostUserService } from "@/services/api/services/users";
import { Role, RoleEnum } from "@/services/api/types/role";
import { FileEntity } from "@/services/api/types/file-entity";
import { KycStatus, SettingsType } from "@/services/api/types/other";
import FormMultipleSelectInput from "@/components/form/multiple-select/form-multiple-select";
import FormDatePickerInput from "@/components/form/date-pickers/date-picker";
import FormSelectInput from "@/components/form/select/form-select";
import { useGetRegionsQuery } from "../../regions/queries/queries";
import removeDuplicatesFromArrayObjects from "@/services/helpers/remove-duplicates-from-array-of-objects";
import { Region } from "@/services/api/types/region";

/**
 * Form data structure for creating an agent
 */
type CreateAgentFormData = {
  // Basic information
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string | null;
  countryCode?: string | null;
  photo?: FileEntity;
  regions: string[]; // required, not optional or undefined

  // KYC details
  kycDocumentNumber?: string | null;
  kycDocumentType?: string | null;
  kycDocumentExpiryDate?: Date | null;
  kycStatus?: KycStatus | null;

  // Settings
  settingsCurrency: string;
};

/**
 * Validation schema hook for agent creation form
 */
const useValidationSchema = (): yup.ObjectSchema<CreateAgentFormData> => {
  const { t } = useTranslation("admin-panel-agents-create");

  return yup.object({
    email: yup
      .string()
      .email(t("admin-panel-agents-create:inputs.email.validation.invalid"))
      .required(
        t("admin-panel-agents-create:inputs.email.validation.required")
      ),
    firstName: yup
      .string()
      .required(
        t("admin-panel-agents-create:inputs.firstName.validation.required")
      ),
    lastName: yup
      .string()
      .required(
        t("admin-panel-agents-create:inputs.lastName.validation.required")
      ),
    phoneNumber: yup
      .string()
      .nullable()
      .matches(
        /^[0-9]{10,15}$/,
        t("admin-panel-agents-create:inputs.phoneNumber.validation.invalid")
      )
      .notRequired(),
    countryCode: yup.string().nullable().notRequired(),
    photo: yup.mixed<FileEntity>().notRequired(),
    regions: yup
      .array()
      .of(yup.string().required())
      .min(1, t("admin-panel-agents-create:inputs.regions.validation.required"))
      .required(
        t("admin-panel-agents-create:inputs.regions.validation.required")
      ),
    kycDocumentNumber: yup
      .string()
      .nullable()
      .notRequired()
      .min(
        5,
        t("admin-panel-agents-create:inputs.kycDocumentNumber.validation.min")
      ),
    kycDocumentType: yup
      .string()
      .nullable()
      .notRequired()
      .min(
        5,
        t(
          "admin-panel-agents-create:inputs.kycDocumentType.validation.required"
        )
      ),
    kycDocumentExpiryDate: yup
      .date()
      .nullable()
      .notRequired()
      .min(
        new Date(),
        t(
          "admin-panel-agents-create:inputs.kycDocumentExpiryDate.validation.future"
        )
      ),
    kycStatus: yup
      .mixed<KycStatus>()
      .oneOf(Object.values(KycStatus))
      .nullable()
      .notRequired(),
    settingsCurrency: yup
      .string()
      .required(
        t(
          "admin-panel-agents-create:inputs.settingsCurrency.validation.required"
        )
      ),
  }) as yup.ObjectSchema<CreateAgentFormData>;
};

/**
 * Form actions component with submit button
 */
function CreateAgentFormActions() {
  const { t } = useTranslation("admin-panel-agents-create");
  const { isSubmitting, isDirty } = useFormState();
  useLeavePage(isDirty);

  return (
    <Box display="flex" justifyContent="flex-end" gap={2} mt={4}>
      <Button
        variant="outlined"
        color="primary"
        LinkComponent={Link}
        href="/admin-panel/agents"
        data-testid="cancel-button"
      >
        {t("admin-panel-agents-create:actions.cancel")}
      </Button>
      <Button
        variant="contained"
        color="primary"
        type="submit"
        disabled={isSubmitting}
        data-testid="submit-button"
      >
        {t("admin-panel-agents-create:actions.submit")}
      </Button>
    </Box>
  );
}

/**
 * Main form component for agent creation
 */
function FormCreateAgent() {
  const router = useRouter();
  const fetchPostUser = usePostUserService();
  const { data } = useGetRegionsQuery();
  const regionsData = useMemo(() => {
    const allData = data?.pages.flatMap((page) => page?.data) || [];
    return removeDuplicatesFromArrayObjects<Region>(allData as Region[], "id");
  }, [data]);

  const { t } = useTranslation("admin-panel-agents-create");
  const validationSchema = useValidationSchema();
  const { enqueueSnackbar } = useSnackbar();

  // Initialize form methods with validation and default values
  const methods = useForm<CreateAgentFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      phoneNumber: null,
      countryCode: null,
      regions: [],
      photo: undefined,
      kycDocumentNumber: null,
      kycDocumentType: "",
      kycDocumentExpiryDate: null,
      kycStatus: KycStatus.PENDING,
      settingsCurrency: "KES",
      //settingsType: SettingsType.PREFERENCES,
    },
  });

  const { handleSubmit, setError } = methods;
  const [, setIsSubmitting] = useState(false);

  // KYC status options
  const kycStatusOptions = [
    {
      id: KycStatus.PENDING,
      name: t("admin-panel-agents-create:kycStatus.pending"),
    },
    {
      id: KycStatus.APPROVED,
      name: t("admin-panel-agents-create:kycStatus.approved"),
    },
    {
      id: KycStatus.REJECTED,
      name: t("admin-panel-agents-create:kycStatus.rejected"),
    },
    {
      id: KycStatus.REQUIRES_UPDATE,
      name: t("admin-panel-agents-create:kycStatus.requiresUpdate"),
    },
  ];
  // Settings type options
  const settingsTypeOptions = [
    {
      id: SettingsType.PREFERENCES,
      name: t("admin-panel-agents-create:settingsType.userPreferences"),
    },
    {
      id: SettingsType.NOTIFICATION,
      name: t("admin-panel-agents-create:settingsType.notification"),
    },
    {
      id: SettingsType.SECURITY,
      name: t("admin-panel-agents-create:settingsType.security"),
    },
  ];
  /**
   * Handle form submission
   * @param formData - Validated form data
   */
  const onSubmit = handleSubmit(async (formData) => {
    setIsSubmitting(true);

    try {
      // Prepare agent data for API
      const agentData = {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        photo: formData.photo,
        role: { id: RoleEnum.AGENT } as unknown as Role,
        password: "ChangeMe123!", // TODO: Replace with a secure password or collect from form
        phoneNumber: formData.phoneNumber,
        countryCode: formData.countryCode,
        regions: formData.regions,
        kycDetails: {
          documentNumber: formData.kycDocumentNumber,
          documentType: formData.kycDocumentType,
          documentExpiryDate: formData.kycDocumentExpiryDate,
          status: kycStatusOptions[0].name,
        },
        settings: {
          config: {
            currency: formData.settingsCurrency,
          },
          type: settingsTypeOptions[0].name,
        },
      };

      // Send request to create agent
      const { data, status } = await fetchPostUser(agentData);

      // Handle validation errors
      if (status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
        (Object.keys(data.errors) as Array<keyof CreateAgentFormData>).forEach(
          (key) => {
            setError(key, {
              type: "manual",
              message: t(
                `admin-panel-agents-create:inputs.${key}.validation.server.${data.errors[key]}`
              ),
            });
          }
        );
        return;
      }

      // Handle successful creation
      if (status === HTTP_CODES_ENUM.CREATED) {
        enqueueSnackbar(t("admin-panel-agents-create:alerts.agent.success"), {
          variant: "success",
          autoHideDuration: 3000,
        });
        router.push("/admin-panel/agents");
      }
    } catch (error) {
      enqueueSnackbar(t("admin-panel-agents-create:alerts.agent.error"), {
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  });

  // Fetch regions for multi-select
  const regions = regionsData || [];

  // Currency options
  const currencyOptions = [
    { id: "KES", name: t("admin-panel-agents-create:currency.kes") },
    { id: "USD", name: t("admin-panel-agents-create:currency.usd") },
    { id: "EUR", name: t("admin-panel-agents-create:currency.eur") },
  ];

  return (
    <FormProvider {...methods}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <form
          onSubmit={onSubmit}
          autoComplete="create-new-agent"
          data-testid="create-agent-form"
        >
          <Paper elevation={2} sx={{ p: { xs: 2, md: 4 }, borderRadius: 2 }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ fontWeight: 600, mb: 3 }}
            >
              {t("admin-panel-agents-create:title")}
            </Typography>

            <Grid container spacing={3}>
              {/* Profile Photo */}
              <Grid sx={{ xs: 12, md: 4 }}>
                <Box display="flex" justifyContent="center" mb={2}>
                  <FormAvatarInput<CreateAgentFormData>
                    name="photo"
                    testId="photo"
                    helperText={t(
                      "admin-panel-agents-create:inputs.photo.helperText"
                    )}
                  />
                </Box>
              </Grid>

              {/* Basic Information */}
              <Grid sx={{ xs: 12, md: 8 }}>
                <Grid container spacing={2}>
                  <Grid sx={{ xs: 12, sm: 6 }}>
                    <FormTextInput<CreateAgentFormData>
                      name="firstName"
                      testId="first-name"
                      label={t(
                        "admin-panel-agents-create:inputs.firstName.label"
                      )}
                      fullWidth
                    />
                  </Grid>

                  <Grid sx={{ xs: 12, sm: 6 }}>
                    <FormTextInput<CreateAgentFormData>
                      name="lastName"
                      testId="last-name"
                      label={t(
                        "admin-panel-agents-create:inputs.lastName.label"
                      )}
                      fullWidth
                    />
                  </Grid>

                  <Grid sx={{ xs: 12, sm: 6 }}>
                    <FormTextInput<CreateAgentFormData>
                      name="email"
                      testId="email"
                      label={t("admin-panel-agents-create:inputs.email.label")}
                      type="email"
                      fullWidth
                    />
                  </Grid>

                  <Grid sx={{ xs: 12, sm: 6 }}>
                    <FormTextInput<CreateAgentFormData>
                      name="countryCode"
                      testId="country-code"
                      label={t(
                        "admin-panel-agents-create:inputs.countryCode.label"
                      )}
                      placeholder="+1"
                      fullWidth
                    />
                  </Grid>

                  <Grid sx={{ xs: 12, sm: 6 }}>
                    <FormTextInput<CreateAgentFormData>
                      name="phoneNumber"
                      testId="phone-number"
                      label={t(
                        "admin-panel-agents-create:inputs.phoneNumber.label"
                      )}
                      placeholder="5551234567"
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* Regions */}
              <Grid sx={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle1" fontWeight={600} mb={1}>
                  {t("admin-panel-agents-create:inputs.regions.label")}
                </Typography>
                <FormMultipleSelectInput<
                  CreateAgentFormData,
                  { id: string; name: string }
                >
                  name="regions"
                  options={regions.map((region) => ({
                    id: region.id ?? "",
                    name: region.name ?? region.id ?? "",
                  }))}
                  keyValue="id"
                  renderOption={(option) => option.name || option.id}
                  renderValue={(selected) =>
                    selected.map((region) => region.name).join(", ")
                  }
                  fullWidth
                  label={"regions"}
                />
              </Grid>

              <Grid sx={{ xs: 12, sm: 6 }}>
                <Divider sx={{ my: 2 }} />
              </Grid>

              {/* KYC Details Section */}
              <Grid sx={{ xs: 12, sm: 6 }}>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  {t("admin-panel-agents-create:kycSection.title")}
                </Typography>
                <Grid container spacing={2}>
                  <Grid sx={{ xs: 12, sm: 6 }}>
                    <FormTextInput<CreateAgentFormData>
                      name="kycDocumentNumber"
                      testId="kyc-document-number"
                      label={t(
                        "admin-panel-agents-create:inputs.kycDocumentNumber.label"
                      )}
                      fullWidth
                    />
                  </Grid>

                  <Grid sx={{ xs: 12, sm: 6 }}>
                    <FormTextInput<CreateAgentFormData>
                      name="kycDocumentType"
                      testId="kyc-document-type"
                      label={t(
                        "admin-panel-agents-create:inputs.kycDocumentType.label"
                      )}
                      fullWidth
                    />
                  </Grid>

                  <Grid sx={{ xs: 12, sm: 6 }}>
                    <FormDatePickerInput<CreateAgentFormData>
                      name="kycDocumentExpiryDate"
                      testId="kyc-document-expiry"
                      label={t(
                        "admin-panel-agents-create:inputs.kycDocumentExpiryDate.label"
                      )}
                      disablePast
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid sx={{ xs: 12, sm: 6 }}>
                <Divider sx={{ my: 2 }} />
              </Grid>

              {/* Settings Section */}
              <Grid sx={{ xs: 12, sm: 6 }}>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  {t("admin-panel-agents-create:settingsSection.title")}
                </Typography>
                <Grid container spacing={2}>
                  <Grid sx={{ xs: 12, sm: 6 }}>
                    <FormSelectInput<
                      CreateAgentFormData,
                      { id: string; name: string }
                    >
                      name="settingsCurrency"
                      label={t(
                        "admin-panel-agents-create:inputs.settingsCurrency.label"
                      )}
                      options={currencyOptions}
                      keyValue="id"
                      renderOption={(option) => option.name}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* Form Actions */}
              <Grid sx={{ xs: 12, sm: 6 }}>
                <CreateAgentFormActions />
              </Grid>
            </Grid>
          </Paper>
        </form>
      </Container>
    </FormProvider>
  );
}

/**
 * Main component for agent creation page
 */
function CreateAgent() {
  return <FormCreateAgent />;
}

// Export with authentication requirement
export default withPageRequiredAuth(CreateAgent);
