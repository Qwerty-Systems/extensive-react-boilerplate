"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { RoleEnum } from "@/services/api/types/role";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import {
  TENANT_ONBOARDING_STEPS,
  OnboardingStepDefinition,
} from "@/utils/constant";
import {
  useCompleteStep,
  useGetOnboardingStatus,
  useInitializeOnboarding,
  useSkipStep,
} from "@/services/api/services/onboarding";
import {
  OnboardingEntityType,
  OnboardingStepStatus,
} from "@/services/api/types/onboarding";
import useAuth from "@/services/auth/use-auth";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {
  useForm,
  Controller,
  useFormState,
  FormProvider,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSnackbar } from "@/hooks/use-snackbar";
import { saveAs } from "file-saver";
import { Region } from "@/services/api/types/region";
import Switch from "@mui/material/Switch";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import IconButton from "@mui/material/IconButton";
import Close from "@mui/icons-material/Close";
import ListItemText from "@mui/material/ListItemText";
import RadioGroup from "@mui/material/RadioGroup";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {
  ArrowForward,
  CheckCircleOutline,
  CloudUpload,
  Description,
  Download,
  Info,
  ListAlt,
  MapOutlined,
  PeopleAltOutlined,
  Preview,
} from "@mui/icons-material";
import CheckCircle from "@mui/icons-material/CheckCircle";
import Radio from "@mui/material/Radio";
import CardHeader from "@mui/material/CardHeader";
import { useTheme } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import { ColorPicker } from "@/components/common/ColorPicker";
import FormSelectInput from "@/components/form/select/form-select";
import InputAdornment from "@mui/material/InputAdornment";
import Chip from "@mui/material/Chip";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
// Configuration flag from environment variables
const SHOW_ONLY_REQUIRED_STEPS =
  process.env.NEXT_PUBLIC_ONBOARDING_SHOW_ONLY_REQUIRED === "true";

/**
 * Filter steps based on environment configuration
 * @param steps All onboarding steps
 * @returns Filtered steps based on SHOW_ONLY_REQUIRED_STEPS flag
 */
const filterSteps = (steps: OnboardingStepDefinition[]) => {
  return SHOW_ONLY_REQUIRED_STEPS
    ? steps.filter((step) => step.isRequired)
    : steps;
};

// Mock languages and timezones for the demo
const LANGUAGES = [
  { value: "en", label: "English" }, // Widely spoken across Southern, Eastern, and parts of West Africa
  { value: "sw", label: "Swahili" }, // East and Central Africa (Kenya, Tanzania, Uganda, DRC)
  { value: "fr", label: "French" }, // West and Central Africa (Ivory Coast, Senegal, Cameroon, etc.)
  { value: "ar", label: "Arabic" }, // North Africa (Egypt, Sudan, Algeria, Morocco, Tunisia)
  { value: "am", label: "Amharic" }, // Ethiopia
  { value: "ha", label: "Hausa" }, // Nigeria, Niger, Ghana (widely spoken in West Africa)
  { value: "yo", label: "Yoruba" }, // Nigeria, Benin, Togo
  { value: "ig", label: "Igbo" }, // Nigeria
  { value: "zu", label: "Zulu" }, // South Africa
  { value: "xh", label: "Xhosa" }, // South Africa
  { value: "pt", label: "Portuguese" }, // Mozambique, Angola, Guinea-Bissau
];

const TIMEZONES = [
  { value: "UTC+0", label: "UTC+00:00 (Accra, Dakar, Abidjan)" },
  { value: "UTC+1", label: "UTC+01:00 (Lagos, Algiers, Kinshasa)" },
  { value: "UTC+2", label: "UTC+02:00 (Johannesburg, Cairo, Harare)" },
  { value: "UTC+3", label: "UTC+03:00 (Nairobi, Mogadishu, Addis Ababa)" },
  { value: "UTC+4", label: "UTC+04:00 (Mauritius, Seychelles)" },
];
interface PlanFeature {
  name: string;
  included: boolean;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  isTrial: boolean;
  features: PlanFeature[];
  modules: {
    module: string;
    submodules: string[];
  }[];
}

/**
 * Validation schemas for each step
 */
const validationSchemas = {
  tenant_registration: yup.object().shape({
    tenantName: yup.string().required("Tenant name is required"),
    contactEmail: yup
      .string()
      .email("Invalid email")
      .required("Contact email is required"),
  }),
  admin_creation: yup.object().shape({
    adminFirstName: yup.string().required("First name is required"),
    adminLastName: yup.string().required("Last name is required"),
    adminEmail: yup
      .string()
      .email("Invalid email")
      .required("Email is required"),
    adminPassword: yup
      .string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
  }),
  payment_setup: yup.object().shape({
    cardName: yup.string().required("Cardholder name is required"),
    cardNumber: yup
      .string()
      .matches(/^\d{16}$/, "Card number must be 16 digits")
      .required("Card number is required"),
    cardExpiry: yup
      .string()
      .matches(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, "Invalid expiry date (MM/YY)")
      .required("Expiry date is required"),
    cardCvv: yup
      .string()
      .matches(/^\d{3,4}$/, "Invalid CVV")
      .required("CVV is required"),
  }),
  initial_settings: yup.object().shape({
    language: yup.object().required("Language is required"),
    timezone: yup.object().required("Timezone is required"),
  }),
  data_import: yup.object().shape({
    regionsFile: yup.mixed().required("Regions file is required"),
    customersFile: yup.mixed().required("Customers file is required"),
  }),
  plan_selection: yup.object().shape({
    planId: yup.string().required("Plan selection is required"),
  }),
};
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

/**
 * Main tenant onboarding component
 */
function TenantOnboarding() {
  const { t } = useTranslation("onboarding-tenant");
  const { enqueueSnackbar } = useSnackbar();
  const [activeStepKey, setActiveStepKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [skippedSteps, setSkippedSteps] = useState<string[]>([]);
  const { user } = useAuth();
  const getOnboardingStatus = useGetOnboardingStatus();
  const [onboardingStatus, setOnboardingStatus] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  // Form state per step
  const [stepFormData, setStepFormData] = useState<Record<string, any>>({});
  const formRef = useRef<HTMLFormElement>(null);

  // Filter steps based on configuration
  const filteredSteps = useMemo(() => filterSteps(TENANT_ONBOARDING_STEPS), []);

  // Create a map of steps by key for quick lookup
  const stepsByKey = useMemo(() => {
    return filteredSteps.reduce(
      (acc, step) => {
        acc[step.key] = step;
        return acc;
      },
      {} as Record<string, (typeof filteredSteps)[0]>
    );
  }, [filteredSteps]);

  // Get ordered step keys
  const orderedStepKeys = useMemo(() => {
    return filteredSteps.map((step) => step.key);
  }, [filteredSteps]);

  // Find step index by key
  const getStepIndex = (key: string) => orderedStepKeys.indexOf(key);

  /**
   * Fetch onboarding status from API
   */
  const refetch = useCallback(async () => {
    if (user?.tenant?.id) {
      setLoading(true);
      try {
        const result = await getOnboardingStatus({
          entityType: OnboardingEntityType.TENANT,
          entityId: user?.tenant?.id,
        });

        if (
          result?.data &&
          "steps" in result.data &&
          Array.isArray(result.data.steps)
        ) {
          setOnboardingStatus(result);

          const completed: string[] = [];
          const skipped: string[] = [];

          result.data.steps.forEach((step: any) => {
            if (step.status === OnboardingStepStatus.COMPLETED.toLowerCase()) {
              completed.push(step.stepKey);
            } else if (
              step.status === OnboardingStepStatus.SKIPPED.toLowerCase()
            ) {
              skipped.push(step.stepKey);
            }
          });

          setCompletedSteps(completed);
          setSkippedSteps(skipped);

          // Find first incomplete step by order
          const firstIncomplete = filteredSteps.find(
            (step) =>
              !completed.includes(step.key) && !skipped.includes(step.key)
          );

          setActiveStepKey(firstIncomplete ? firstIncomplete.key : null);
        } else {
          console.warn("Unexpected onboarding status response:", result);
          setError(t("errorLoadingStatus"));
        }
      } catch (err: any) {
        console.error("Error fetching onboarding status:", err);
        setError(err.message || t("errorLoadingStatus"));
      } finally {
        setLoading(false);
      }
    }
  }, [user, getOnboardingStatus, t, filteredSteps]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const initializeOnboarding = useInitializeOnboarding();
  const completeStep = useCompleteStep();
  const skipStep = useSkipStep();

  // Initialize onboarding if not already done
  useEffect(() => {
    if (user?.tenant?.id && !onboardingStatus) {
      initializeOnboarding({
        entityId: user.tenant.id!,
        entityType: OnboardingEntityType.TENANT,
      })
        .then(() => refetch())
        .catch((err) => {
          setError(err.message);
          enqueueSnackbar(t("initializationError"), { variant: "error" });
        });
    }
  }, [
    user?.tenant?.id,
    onboardingStatus,
    initializeOnboarding,
    refetch,
    t,
    enqueueSnackbar,
  ]);

  /**
   * Handle moving to the next step
   */
  const handleNext = useCallback(async () => {
    if (!user?.tenant?.id || !user?.id || !onboardingStatus || !activeStepKey) {
      return;
    }

    const currentStep = onboardingStatus.data.steps.find(
      (step: any) => step.stepKey === activeStepKey
    );

    if (!currentStep) return;

    try {
      setLoading(true);

      await completeStep({
        entityType: OnboardingEntityType.TENANT,
        entityId: user.tenant.id,
        stepId: currentStep.id,
        metadata: stepFormData[activeStepKey] || {},
        performedBy: { userId: user.id?.toString() ?? "" },
      });

      refetch();
      enqueueSnackbar(t("stepCompletedSuccess"), { variant: "success" });
    } catch (err: any) {
      setError(err.message || t("errorCompletingStep"));
      enqueueSnackbar(t("stepCompletionError"), { variant: "error" });
    } finally {
      setLoading(false);
    }
  }, [
    user,
    onboardingStatus,
    activeStepKey,
    stepFormData,
    completeStep,
    refetch,
    t,
    enqueueSnackbar,
  ]);

  /**
   * Handle moving to the previous step
   */
  const handleBack = () => {
    if (!activeStepKey) return;

    const currentIndex = getStepIndex(activeStepKey);
    if (currentIndex > 0) {
      setActiveStepKey(orderedStepKeys[currentIndex - 1]);
    }
  };

  /**
   * Handle skipping the current step
   */
  const handleSkip = useCallback(async () => {
    if (!user?.tenant?.id || !user?.id || !onboardingStatus || !activeStepKey) {
      return;
    }

    try {
      setLoading(true);

      await skipStep({
        entityType: OnboardingEntityType.TENANT,
        entityId: user.tenant.id,
        stepKey: activeStepKey,
        performedBy: { userId: user.id.toString() },
      });

      refetch();
      enqueueSnackbar(t("stepSkippedSuccess"), { variant: "info" });
    } catch (err: any) {
      setError(err.message || t("errorSkippingStep"));
      enqueueSnackbar(t("stepSkipError"), { variant: "error" });
    } finally {
      setLoading(false);
    }
  }, [
    user,
    onboardingStatus,
    activeStepKey,
    skipStep,
    refetch,
    t,
    enqueueSnackbar,
  ]);

  /**
   * Handle form submission for the entire onboarding
   */
  const handleSubmit = useCallback(async () => {
    if (!user?.tenant?.id || !user?.id || !onboardingStatus) return;

    try {
      setLoading(true);

      await Promise.all(
        onboardingStatus.data.steps
          .filter(
            (step: any) =>
              step.status === OnboardingStepStatus.PENDING.toLocaleLowerCase()
          )
          .map((step: any) => {
            console.log("Completing step:", step);
            return completeStep({
              entityType: OnboardingEntityType.TENANT,
              entityId: user?.tenant?.id || "",
              stepId: step.id,
              metadata: stepFormData[step.stepKey] || {},
              performedBy: { userId: user?.id?.toString() ?? "" },
            });
          })
      );

      await refetch();
      setConfirmDialogOpen(false);
      enqueueSnackbar(t("onboardingCompleteSuccess"), { variant: "success" });

      // Check if all required steps are completed or final step is completed
      const steps = onboardingStatus.data.steps;
      const requiredSteps = filteredSteps.filter((s) => s.isRequired);
      const allRequiredCompleted = requiredSteps.every((s) =>
        steps.some(
          (step: any) =>
            step.stepKey === s.key &&
            step.status === OnboardingStepStatus.COMPLETED.toLowerCase()
        )
      );
      console.log("All required steps completed:", allRequiredCompleted);
      const lastStepKey = filteredSteps[filteredSteps.length - 1]?.key;
      const lastStep = steps.find((step: any) => step.stepKey === lastStepKey);
      console.log("Last step:", lastStep);
      const lastStepCompleted =
        lastStep &&
        lastStep.status === OnboardingStepStatus.COMPLETED.toLowerCase();
      console.log(
        "All required completed:",
        allRequiredCompleted,
        "Last step completed:",
        lastStepCompleted
      );
      if (allRequiredCompleted || lastStepCompleted) {
        window.location.href = "/admin-panel";
      }
    } catch (err: any) {
      setError(err.message || t("errorSubmitting"));
      enqueueSnackbar(t("onboardingCompletionError"), { variant: "error" });
    } finally {
      setLoading(false);
    }
  }, [
    user?.tenant?.id,
    user?.id,
    onboardingStatus,
    refetch,
    enqueueSnackbar,
    t,
    completeStep,
    stepFormData,
    filteredSteps,
  ]);

  /**
   * Update form data for a specific step
   */
  const handleStepDataChange = (stepKey: string, data: any) => {
    setStepFormData((prev) => ({
      ...prev,
      [stepKey]: { ...prev[stepKey], ...data },
    }));
  };

  const isStepOptional = (stepKey: string) => {
    return stepsByKey[stepKey]?.isSkippable;
  };

  const isStepCompleted = (stepKey: string) => {
    return completedSteps.includes(stepKey);
  };

  const isStepSkipped = (stepKey: string) => {
    return skippedSteps.includes(stepKey);
  };

  /**
   * Step Components - Each step is now a separate component
   * with its own validation and form handling
   */

  const TenantRegistrationStep = ({ stepKey }: { stepKey: string }) => {
    const { register, handleSubmit, control } = useForm({
      resolver: yupResolver(validationSchemas.tenant_registration),
      defaultValues: stepFormData[stepKey] || {},
    });

    // eslint-disable-next-line no-restricted-syntax
    // Error display moved to a separate component to avoid re-rendering the whole form
    const TenantRegistrationErrors = ({ control }: { control: any }) => {
      const { errors } = useFormState({ control });
      return (
        <>
          <Grid sx={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label={t("tenantNamePlaceholder")}
              {...register("tenantName")}
              error={!!errors.tenantName}
              helperText={errors.tenantName?.message as string}
              variant="outlined"
              required
            />
          </Grid>
          <Grid sx={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label={t("contactEmailPlaceholder")}
              type="email"
              {...register("contactEmail")}
              error={!!errors.contactEmail}
              helperText={errors.contactEmail?.message as string}
              variant="outlined"
              required
            />
          </Grid>
        </>
      );
    };

    const onSubmit = (data: any) => {
      handleStepDataChange(stepKey, data);
      handleNext();
    };

    return (
      <form onSubmit={handleSubmit(onSubmit)} ref={formRef}>
        <Grid container spacing={3}>
          <TenantRegistrationErrors control={control} />
        </Grid>
      </form>
    );
  };

  const AdminAccountSetupStep = ({ stepKey }: { stepKey: string }) => {
    const { register, handleSubmit, control } = useForm({
      resolver: yupResolver(validationSchemas.admin_creation),
      defaultValues: stepFormData[stepKey] || {},
    });

    // eslint-disable-next-line no-restricted-syntax
    const { errors } = useFormState({ control });

    const onSubmit = (data: any) => {
      handleStepDataChange(stepKey, data);
      handleNext();
    };

    return (
      <form onSubmit={handleSubmit(onSubmit)} ref={formRef}>
        <Grid container spacing={3}>
          <Grid sx={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label={t("adminFirstNamePlaceholder")}
              {...register("adminFirstName")}
              error={!!errors.adminFirstName}
              helperText={errors.adminFirstName?.message as string}
              variant="outlined"
              required
            />
          </Grid>
          <Grid sx={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label={t("adminLastNamePlaceholder")}
              {...register("adminLastName")}
              error={!!errors.adminLastName}
              helperText={errors.adminLastName?.message as string}
              variant="outlined"
              required
            />
          </Grid>
          <Grid sx={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label={t("adminEmailPlaceholder")}
              type="email"
              {...register("adminEmail")}
              error={!!errors.adminEmail}
              helperText={errors.adminEmail?.message as string}
              variant="outlined"
              required
            />
          </Grid>
          <Grid sx={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label={t("adminPasswordPlaceholder")}
              type="password"
              {...register("adminPassword")}
              error={!!errors.adminPassword}
              helperText={errors.adminPassword?.message as string}
              variant="outlined"
              required
            />
          </Grid>
        </Grid>
      </form>
    );
  };

  const DomainConfigurationStep = ({ stepKey }: { stepKey: string }) => {
    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "example.com";
    const tenantName = stepFormData["tenant_registration"]?.tenantName || "";

    const defaultSubdomain = useMemo(() => {
      return tenantName
        ? tenantName
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "")
        : "";
    }, [tenantName]);

    const { register, watch, setValue } = useForm({
      defaultValues: {
        subdomain: stepFormData[stepKey]?.subdomain || defaultSubdomain,
      },
    });

    // eslint-disable-next-line no-restricted-syntax
    const subdomain = watch("subdomain");
    const fullDomain = useMemo(() => {
      return subdomain ? `${subdomain}.${rootDomain}` : "";
    }, [subdomain, rootDomain]);

    const updateParentForm = useCallback(() => {
      handleStepDataChange(stepKey, {
        subdomain,
        customDomain: fullDomain,
      });
    }, [subdomain, fullDomain, stepKey]);

    const prevSubdomain = useRef(subdomain);
    useEffect(() => {
      if (prevSubdomain.current !== subdomain) {
        updateParentForm();
        prevSubdomain.current = subdomain;
      }
    }, [subdomain, updateParentForm]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
      setValue("subdomain", value);
    };

    return (
      <form ref={formRef}>
        <Grid container spacing={3}>
          <Grid sx={{ xs: 12 }}>
            <TextField
              fullWidth
              label={t("subdomainPlaceholder")}
              value={subdomain}
              {...register("subdomain")}
              onChange={handleInputChange}
              helperText={t("domainHelperText", { domain: fullDomain })}
              variant="outlined"
            />
          </Grid>
          <Grid sx={{ xs: 12 }}>
            <Alert severity="info">
              {t("domainOptionalMessage")}
              <Box component="span" fontWeight="bold">
                {t("domainExample", { domain: fullDomain })}
              </Box>
            </Alert>
          </Grid>
        </Grid>
      </form>
    );
  };

  const SchemaInitializationStep = () => {
    useEffect(() => {
      // Simulate schema initialization
      const timer = setTimeout(() => {
        handleNext();
      }, 2000);

      return () => clearTimeout(timer);
    }, []);

    return (
      <Box textAlign="center" py={4}>
        <CircularProgress size={60} />
        <Typography variant="h6" mt={2}>
          {t("schemaInitializationTitle")}
        </Typography>
        <Typography variant="body2" color="textSecondary" mt={1}>
          {t("schemaInitializationDescription")}
        </Typography>
      </Box>
    );
  };

  const PaymentSetupStep = ({ stepKey }: { stepKey: string }) => {
    const { register, handleSubmit, control } = useForm({
      resolver: yupResolver(validationSchemas.payment_setup),
      defaultValues: stepFormData[stepKey] || {},
    });

    // eslint-disable-next-line no-restricted-syntax
    const { errors } = useFormState({ control });

    const onSubmit = (data: any) => {
      handleStepDataChange(stepKey, data);
      handleNext();
    };

    return (
      <form onSubmit={handleSubmit(onSubmit)} ref={formRef}>
        <Grid container spacing={3}>
          <Grid sx={{ xs: 12 }}>
            <TextField
              fullWidth
              label={t("cardholderNamePlaceholder")}
              {...register("cardName")}
              error={!!errors.cardName}
              helperText={errors.cardName?.message as string}
              variant="outlined"
              required
            />
          </Grid>
          <Grid sx={{ xs: 12 }}>
            <TextField
              fullWidth
              label={t("creditCardNumberPlaceholder")}
              {...register("cardNumber")}
              error={!!errors.cardNumber}
              helperText={errors.cardNumber?.message as string}
              variant="outlined"
              required
            />
          </Grid>
          <Grid sx={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label={t("expiryDatePlaceholder")}
              {...register("cardExpiry")}
              error={!!errors.cardExpiry}
              helperText={errors.cardExpiry?.message as string}
              placeholder="MM/YY"
              variant="outlined"
              required
            />
          </Grid>
          <Grid sx={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label={t("cvvPlaceholder")}
              {...register("cardCvv")}
              error={!!errors.cardCvv}
              helperText={errors.cardCvv?.message as string}
              variant="outlined"
              required
            />
          </Grid>
        </Grid>
      </form>
    );
  };

  const BrandingConfigurationStep = ({ stepKey }: { stepKey: string }) => {
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    // Create preview URL when logo changes
    useEffect(() => {
      if (stepFormData[stepKey]?.logo) {
        const url = URL.createObjectURL(stepFormData[stepKey].logo);
        setLogoPreview(url);
        return () => URL.revokeObjectURL(url);
      } else {
        setLogoPreview(null);
      }
    }, [stepKey]);

    return (
      <Grid container spacing={3}>
        {/* Color Pickers */}
        <Grid sx={{ xs: 12, md: 6 }}>
          <ColorPicker
            label={t("primaryColorPlaceholder")}
            color={stepFormData[stepKey]?.primaryColor || "#ffffff"}
            onChange={(newColor) =>
              handleStepDataChange(stepKey, { primaryColor: newColor })
            }
          />

          <ColorPicker
            label={t("secondaryColorPlaceholder")}
            color={stepFormData[stepKey]?.secondaryColor || "#000000"}
            onChange={(newColor) =>
              handleStepDataChange(stepKey, { secondaryColor: newColor })
            }
          />

          {/* Logo Upload */}
          <Grid sx={{ xs: 12, mt: 2 }}>
            <input
              accept="image/*"
              type="file"
              id="logo-upload"
              hidden
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleStepDataChange(stepKey, { logo: e.target.files[0] });
                }
              }}
            />
            <label htmlFor="logo-upload">
              <Button variant="outlined" component="span">
                {t("uploadLogoButton")}
              </Button>
            </label>
          </Grid>
        </Grid>

        {/* Preview Section */}
        <Grid sx={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              p: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" gutterBottom>
              {t("brandPreview")}
            </Typography>

            {/* Logo Preview */}
            {logoPreview ? (
              <Avatar
                src={logoPreview}
                variant="square"
                sx={{
                  width: 120,
                  height: 120,
                  mb: 3,
                  bgcolor: "transparent",
                }}
              />
            ) : (
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  mb: 3,
                  bgcolor: "action.hover",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px dashed",
                  borderColor: "divider",
                }}
              >
                <Typography variant="caption">
                  {t("logoPlaceholder")}
                </Typography>
              </Box>
            )}

            {/* Color Preview */}
            <Box
              sx={{
                width: "100%",
                borderRadius: 1,
                overflow: "hidden",
                mb: 2,
              }}
            >
              <Box
                sx={{
                  height: 40,
                  bgcolor: stepFormData[stepKey]?.primaryColor || "#ffffff",
                }}
              />
              <Box
                sx={{
                  height: 40,
                  bgcolor: stepFormData[stepKey]?.secondaryColor || "#000000",
                }}
              />
            </Box>

            {/* Sample UI Elements */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                width: "100%",
                justifyContent: "center",
              }}
            >
              <Button
                variant="contained"
                sx={{
                  bgcolor: stepFormData[stepKey]?.primaryColor,
                  "&:hover": {
                    bgcolor: stepFormData[stepKey]?.primaryColor,
                  },
                }}
              >
                {t("primaryButton")}
              </Button>

              <Button
                variant="outlined"
                sx={{
                  color: stepFormData[stepKey]?.secondaryColor,
                  borderColor: stepFormData[stepKey]?.secondaryColor,
                  "&:hover": {
                    borderColor: stepFormData[stepKey]?.secondaryColor,
                  },
                }}
              >
                {t("secondaryButton")}
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    );
  };

  const InitialSettingsStep = ({ stepKey }: { stepKey: string }) => {
    const methods = useForm({
      resolver: yupResolver(validationSchemas.initial_settings),
      defaultValues: stepFormData[stepKey] || {},
    });

    const { handleSubmit, control } = methods;

    const onSubmit = (data: any) => {
      handleStepDataChange(stepKey, data);
      handleNext();
    };

    const languageOptions = LANGUAGES.map(({ value, label }) => ({
      value,
      label,
    }));
    const timezoneOptions = TIMEZONES.map(({ value, label }) => ({
      value,
      label,
    }));

    return (
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} ref={formRef}>
          <Grid container spacing={3}>
            <Grid sx={{ xs: 12, md: 6 }}>
              <Box sx={{ width: 1 }}>
                <Controller
                  name="language"
                  control={control}
                  render={({ field, fieldState }) => (
                    <FormSelectInput
                      {...field}
                      label={t("languagePlaceholder")}
                      options={languageOptions}
                      error={fieldState.error?.message || ""}
                      keyValue="value"
                      renderOption={(option: {
                        value: string;
                        label: string;
                      }) => option.label}
                    />
                  )}
                />
              </Box>
            </Grid>

            <Grid sx={{ xs: 12, md: 6 }}>
              <Box sx={{ width: 1 }}>
                <Controller
                  name="timezone"
                  control={control}
                  render={({ field, fieldState }) => (
                    <FormSelectInput
                      {...field}
                      label={t("timezonePlaceholder")}
                      options={timezoneOptions}
                      error={fieldState.error?.message || ""}
                      keyValue="value"
                      renderOption={(option: {
                        value: string;
                        label: string;
                      }) => option.label}
                    />
                  )}
                />
              </Box>
            </Grid>
            <Grid sx={{ xs: 12 }}>
              <Typography variant="h6" gutterBottom>
                {t("notificationSettings.title")}
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!stepFormData[stepKey]?.notification_email}
                    onChange={(e) =>
                      handleStepDataChange(stepKey, {
                        notification_email: e.target.checked,
                      })
                    }
                    name="notification_email"
                  />
                }
                label={t("notificationSettings.emailNotifications")}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!stepFormData[stepKey]?.notification_sms}
                    onChange={(e) =>
                      handleStepDataChange(stepKey, {
                        notification_sms: e.target.checked,
                      })
                    }
                    name="notification_sms"
                  />
                }
                label={t("notificationSettings.smsNotifications")}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!stepFormData[stepKey]?.notification_sms}
                    onChange={(e) =>
                      handleStepDataChange(stepKey, {
                        notification_whatsapp: e.target.checked,
                      })
                    }
                    name="notification_whatsapp"
                  />
                }
                label={t("notificationSettings.whatsappNotifications")}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!stepFormData[stepKey]?.notification_push}
                    onChange={(e) =>
                      handleStepDataChange(stepKey, {
                        notification_push: e.target.checked,
                      })
                    }
                    name="notification_push"
                  />
                }
                label={t("notificationSettings.pushNotifications")}
              />
            </Grid>
          </Grid>
        </form>
      </FormProvider>
    );
  };

  const GoLiveCheckStep = ({ stepKey }: { stepKey: string }) => {
    const checkboxes = [
      { name: "verifiedSettings", label: t("verifiedSettingsLabel") },
      { name: "testedRegistration", label: t("testedRegistrationLabel") },
      { name: "reviewedCompliance", label: t("reviewedComplianceLabel") },
      { name: "backedUpConfig", label: t("backedUpConfigLabel") },
    ];

    return (
      <Grid container spacing={3}>
        {checkboxes.map((checkbox) => (
          <Grid sx={{ xs: 12 }} key={checkbox.name}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={!!stepFormData[stepKey]?.[checkbox.name]}
                  onChange={(e) =>
                    handleStepDataChange(stepKey, {
                      [checkbox.name]: e.target.checked,
                    })
                  }
                  name={checkbox.name}
                />
              }
              label={checkbox.label}
            />
          </Grid>
        ))}
      </Grid>
    );
  };

  const DataImportStep = ({ stepKey }: { stepKey: string }) => {
    const { t } = useTranslation("onboarding-tenant");
    const [downloadingType, setDownloadingType] = useState<
      "regions" | "customers" | null
    >(null);
    const [regions, setRegions] = useState<Region[]>([]);
    const [previewData, setPreviewData] = useState<{
      regions: { name: string; zipCodes: string[] }[] | null;
      customers: { name: string; email: string; region: string }[] | null;
    }>({ regions: null, customers: null });

    const {
      handleSubmit,
      control,
      setValue,
      // formState: { errors }, // Remove this line
    } = useForm({
      resolver: yupResolver(validationSchemas.data_import),
      defaultValues: stepFormData[stepKey] || {},
    });
    // eslint-disable-next-line no-restricted-syntax
    const { errors } = useFormState({ control });

    // Fetch regions when component mounts
    useEffect(() => {
      const fetchRegions = async () => {
        try {
          // Actual API call would go here
          setRegions([
            {
              id: "1",
              name: "North Region",
              zipCodes: ["10001", "10002", "10003"],
            },
            {
              id: "2",
              name: "South Region",
              zipCodes: ["20001", "20002", "20003"],
            },
            { id: "3", name: "East Region", zipCodes: ["30001", "30002"] },
            {
              id: "4",
              name: "West Region",
              zipCodes: ["40001", "40002", "40003", "40004"],
            },
          ]);
        } catch (error) {
          console.error("Failed to fetch regions", error);
        }
      };

      fetchRegions();
    }, []);

    const downloadTemplate = async (type: "regions" | "customers") => {
      setDownloadingType(type);
      try {
        enqueueSnackbar(t("templateDownloadStarted", { type }), {
          variant: "success",
        });

        // Simulate download delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const fileName = `${type}_template.xlsx`;
        const dummyContent = new Uint8Array([80, 75, 3, 4]);
        saveAs(
          new Blob([dummyContent], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          }),
          fileName
        );

        enqueueSnackbar(t("templateDownloadSuccess", { type }), {
          variant: "success",
        });
      } catch (error) {
        console.error(`Failed to download ${type} template`, error);
        enqueueSnackbar(t("templateDownloadError"), { variant: "error" });
      } finally {
        setDownloadingType(null);
      }
    };

    const handleFileChange = async (
      fieldName: string,
      files: FileList | null
    ) => {
      if (!files || files.length === 0) return;

      const file = files[0];
      setValue(fieldName, file);
      handleStepDataChange(stepKey, { [fieldName]: file });

      try {
        // Simulate file parsing and preview
        enqueueSnackbar(t("fileProcessing", { file: file.name }), {
          variant: "success",
        });

        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (fieldName === "regionsFile") {
          setPreviewData((prev) => ({
            ...prev,
            regions: [
              { name: "Imported Region 1", zipCodes: ["11001", "11002"] },
              { name: "Imported Region 2", zipCodes: ["21001"] },
            ],
          }));
        } else {
          setPreviewData((prev) => ({
            ...prev,
            customers: [
              { name: "John Doe", email: "john@example.com", region: "North" },
              {
                name: "Jane Smith",
                email: "jane@example.com",
                region: "South",
              },
              { name: "Bob Johnson", email: "bob@example.com", region: "West" },
            ],
          }));
        }

        enqueueSnackbar(t("filePreviewReady", { file: file.name }), {
          variant: "success",
        });
      } catch (error) {
        console.error("Error processing file", error);
        enqueueSnackbar(t("fileProcessingError"), { variant: "error" });
      }
    };

    const removeFile = (fieldName: string) => {
      setValue(fieldName, null);
      handleStepDataChange(stepKey, { [fieldName]: null });

      if (fieldName === "regionsFile") {
        setPreviewData((prev) => ({ ...prev, regions: null }));
      } else {
        setPreviewData((prev) => ({ ...prev, customers: null }));
      }
    };

    const onSubmit = (data: any) => {
      handleStepDataChange(stepKey, data);
      handleNext();
    };

    return (
      <form onSubmit={handleSubmit(onSubmit)} ref={formRef}>
        <Grid container spacing={4}>
          {/* Regions Section */}
          <Grid sx={{ xs: 12, md: 6 }}>
            <Card variant="outlined" sx={{ borderRadius: 2, height: "100%" }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <MapOutlined
                    sx={{ fontSize: 28, color: "primary.main", mr: 1.5 }}
                  />
                  <Typography variant="h6" fontWeight={600}>
                    {t("importRegionsTitle")}
                  </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" mb={3}>
                  {t("regionsImportDescription")}
                </Typography>

                <Box mb={3}>
                  <Button
                    variant="outlined"
                    onClick={() => downloadTemplate("regions")}
                    disabled={!!downloadingType}
                    startIcon={
                      downloadingType === "regions" ? (
                        <CircularProgress size={20} />
                      ) : (
                        <Download />
                      )
                    }
                    fullWidth
                    sx={{ py: 1.5, mb: 1.5 }}
                  >
                    {downloadingType === "regions"
                      ? t("downloadingTemplate")
                      : t("downloadRegionsTemplate")}
                  </Button>

                  <Typography variant="caption" color="text.secondary">
                    {t("templateIncludes", {
                      content: t("regionTemplateContent"),
                    })}
                  </Typography>
                </Box>
                {/* eslint-disable-next-line no-restricted-syntax */}
                <Controller
                  name="regionsFile"
                  control={control}
                  render={({ field }) => (
                    <Box>
                      <input
                        type="file"
                        id="regions-file"
                        accept=".xlsx, .xls"
                        onChange={(e) => {
                          handleFileChange("regionsFile", e.target.files);
                          field.onChange(e.target.files?.[0]);
                        }}
                        hidden
                      />

                      {field.value ? (
                        <Paper
                          variant="outlined"
                          sx={{ p: 2, borderRadius: 1, mb: 2 }}
                        >
                          <Box display="flex" alignItems="center">
                            <Description
                              sx={{ mr: 1.5, color: "success.main" }}
                            />
                            <Box flexGrow={1}>
                              <Typography variant="subtitle2">
                                {field.value.name}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {formatFileSize(field.value.size)}
                              </Typography>
                            </Box>
                            <IconButton
                              onClick={() => removeFile("regionsFile")}
                            >
                              <Close fontSize="small" />
                            </IconButton>
                          </Box>
                        </Paper>
                      ) : (
                        <label htmlFor="regions-file">
                          <Button
                            variant="contained"
                            component="span"
                            fullWidth
                            startIcon={<CloudUpload />}
                            sx={{ py: 1.5 }}
                          >
                            {t("uploadRegionsFile")}
                          </Button>
                        </label>
                      )}

                      {errors.regionsFile && (
                        <Typography
                          variant="caption"
                          color="error"
                          mt={1}
                          display="block"
                        >
                          {typeof errors?.regionsFile?.message === "string"
                            ? errors.regionsFile.message
                            : ""}
                        </Typography>
                      )}
                    </Box>
                  )}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Customers Section */}
          <Grid sx={{ xs: 12, md: 6 }}>
            <Card variant="outlined" sx={{ borderRadius: 2, height: "100%" }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <PeopleAltOutlined
                    sx={{ fontSize: 28, color: "primary.main", mr: 1.5 }}
                  />
                  <Typography variant="h6" fontWeight={600}>
                    {t("importCustomersTitle")}
                  </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" mb={3}>
                  {t("customersImportDescription")}
                </Typography>

                <Box mb={3}>
                  <Button
                    variant="outlined"
                    onClick={() => downloadTemplate("customers")}
                    disabled={!!downloadingType}
                    startIcon={
                      downloadingType === "customers" ? (
                        <CircularProgress size={20} />
                      ) : (
                        <Download />
                      )
                    }
                    fullWidth
                    sx={{ py: 1.5, mb: 1.5 }}
                  >
                    {downloadingType === "customers"
                      ? t("downloadingTemplate")
                      : t("downloadCustomersTemplate")}
                  </Button>

                  <Typography variant="caption" color="text.secondary">
                    {t("templateIncludes", {
                      content: t("customerTemplateContent"),
                    })}
                  </Typography>
                </Box>

                {/* eslint-disable-next-line no-restricted-syntax */}
                <Controller
                  name="customersFile"
                  control={control}
                  render={({ field }) => (
                    <Box>
                      <input
                        type="file"
                        id="customers-file"
                        accept=".xlsx, .xls"
                        onChange={(e) => {
                          handleFileChange("customersFile", e.target.files);
                          field.onChange(e.target.files?.[0]);
                        }}
                        hidden
                      />

                      {field.value ? (
                        <Paper
                          variant="outlined"
                          sx={{ p: 2, borderRadius: 1, mb: 2 }}
                        >
                          <Box display="flex" alignItems="center">
                            <Description
                              sx={{ mr: 1.5, color: "success.main" }}
                            />
                            <Box flexGrow={1}>
                              <Typography variant="subtitle2">
                                {field.value.name}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {formatFileSize(field.value.size)}
                              </Typography>
                            </Box>
                            <IconButton
                              onClick={() => removeFile("customersFile")}
                            >
                              <Close fontSize="small" />
                            </IconButton>
                          </Box>
                        </Paper>
                      ) : (
                        <label htmlFor="customers-file">
                          <Button
                            variant="contained"
                            component="span"
                            fullWidth
                            startIcon={<CloudUpload />}
                            sx={{ py: 1.5 }}
                          >
                            {t("uploadCustomersFile")}
                          </Button>
                        </label>
                      )}

                      {errors.customersFile && (
                        <Typography
                          variant="caption"
                          color="error"
                          mt={1}
                          display="block"
                        >
                          {typeof errors?.customersFile?.message === "string"
                            ? errors.customersFile.message
                            : ""}
                        </Typography>
                      )}
                    </Box>
                  )}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Preview Sections */}
          {previewData.regions && (
            <Grid sx={{ xs: 12, md: 6 }}>
              <Card variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Preview sx={{ mr: 1.5, color: "info.main" }} />
                    <Typography variant="subtitle1" fontWeight={600}>
                      {t("regionsPreview")} ({previewData.regions.length})
                    </Typography>
                  </Box>

                  <List dense sx={{ maxHeight: 300, overflow: "auto" }}>
                    {previewData.regions.map((region, index) => (
                      <ListItem key={index} divider>
                        <ListItemText
                          primary={region.name}
                          secondary={
                            <Box
                              component="span"
                              display="flex"
                              flexWrap="wrap"
                              gap={0.5}
                            >
                              {region.zipCodes.map((zip, idx) => (
                                <Chip
                                  key={idx}
                                  label={zip}
                                  size="small"
                                  sx={{ borderRadius: 1 }}
                                />
                              ))}
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          )}

          {previewData.customers && (
            <Grid sx={{ xs: 12, md: 6 }}>
              <Card variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Preview sx={{ mr: 1.5, color: "info.main" }} />
                    <Typography variant="subtitle1" fontWeight={600}>
                      {t("customersPreview")} ({previewData.customers.length})
                    </Typography>
                  </Box>

                  <TableContainer sx={{ maxHeight: 300 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>{t("name")}</TableCell>
                          <TableCell>{t("email")}</TableCell>
                          <TableCell>{t("region")}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {previewData.customers.map((customer, index) => (
                          <TableRow key={index}>
                            <TableCell>{customer.name}</TableCell>
                            <TableCell>{customer.email}</TableCell>
                            <TableCell>
                              <Chip
                                label={customer.region}
                                size="small"
                                sx={{ borderRadius: 1 }}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Available Regions */}
          {regions.length > 0 && (
            <Grid sx={{ xs: 12 }}>
              <Card variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <ListAlt sx={{ mr: 1.5, color: "primary.main" }} />
                    <Typography variant="subtitle1" fontWeight={600}>
                      {t("availableRegionsTitle")} ({regions.length})
                    </Typography>
                  </Box>

                  <Grid container spacing={2}>
                    {regions.map((region) => (
                      <Grid sx={{ xs: 12, sm: 6, md: 3 }} key={region.id}>
                        <Card variant="outlined" sx={{ borderRadius: 2 }}>
                          <CardContent sx={{ pb: "16px !important" }}>
                            <Typography variant="subtitle2" gutterBottom>
                              {region.name}
                            </Typography>
                            <Box display="flex" flexWrap="wrap" gap={0.5}>
                              {region.zipCodes
                                ?.slice(0, 4)
                                .map((zip, idx) => (
                                  <Chip
                                    key={idx}
                                    label={zip}
                                    size="small"
                                    sx={{ borderRadius: 1 }}
                                  />
                                ))}
                              {(region.zipCodes?.length ?? 0) > 4 && (
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  +{(region.zipCodes?.length ?? 0) - 4} more
                                </Typography>
                              )}
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Form Submission */}
          <Grid sx={{ xs: 12 }}>
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button
                variant="contained"
                type="submit"
                size="large"
                endIcon={<ArrowForward />}
              >
                {t("completeSetup")}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    );
  };

  const ComplianceSetupStep = ({ stepKey }: { stepKey: string }) => {
    return (
      <Grid container spacing={3}>
        <Grid sx={{ xs: 12 }}>
          <Typography variant="h6" gutterBottom>
            {t("complianceSetupTitle")}
          </Typography>
        </Grid>

        <Grid sx={{ xs: 12 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={!!stepFormData[stepKey]?.gdprCompliance}
                onChange={(e) =>
                  handleStepDataChange(stepKey, {
                    gdprCompliance: e.target.checked,
                  })
                }
              />
            }
            label={t("gdprComplianceLabel")}
          />
        </Grid>

        <Grid sx={{ xs: 12 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={!!stepFormData[stepKey]?.hipaaCompliance}
                onChange={(e) =>
                  handleStepDataChange(stepKey, {
                    hipaaCompliance: e.target.checked,
                  })
                }
              />
            }
            label={t("hipaaComplianceLabel")}
          />
        </Grid>

        <Grid sx={{ xs: 12 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={!!stepFormData[stepKey]?.pciDssCompliance}
                onChange={(e) =>
                  handleStepDataChange(stepKey, {
                    pciDssCompliance: e.target.checked,
                  })
                }
              />
            }
            label={t("pciDssComplianceLabel")}
          />
        </Grid>

        <Grid sx={{ xs: 12 }}>
          <TextField
            fullWidth
            label={t("complianceOfficerEmail")}
            value={stepFormData[stepKey]?.complianceOfficerEmail || ""}
            onChange={(e) =>
              handleStepDataChange(stepKey, {
                complianceOfficerEmail: e.target.value,
              })
            }
            variant="outlined"
          />
        </Grid>
      </Grid>
    );
  };

  const SecurityConfigurationStep = ({ stepKey }: { stepKey: string }) => {
    return (
      <Grid container spacing={3}>
        <Grid sx={{ xs: 12 }}>
          <Typography variant="h6" gutterBottom>
            {t("securityConfigurationTitle")}
          </Typography>
        </Grid>

        <Grid sx={{ xs: 12 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={!!stepFormData[stepKey]?.twoFactorAuth}
                onChange={(e) =>
                  handleStepDataChange(stepKey, {
                    twoFactorAuth: e.target.checked,
                  })
                }
              />
            }
            label={t("enableTwoFactorAuth")}
          />
        </Grid>

        <Grid sx={{ xs: 12 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={!!stepFormData[stepKey]?.passwordComplexity}
                onChange={(e) =>
                  handleStepDataChange(stepKey, {
                    passwordComplexity: e.target.checked,
                  })
                }
              />
            }
            label={t("enablePasswordComplexity")}
          />
        </Grid>

        <Grid sx={{ xs: 12 }}>
          <TextField
            fullWidth
            label={t("sessionTimeout")}
            value={stepFormData[stepKey]?.sessionTimeout || 30}
            onChange={(e) =>
              handleStepDataChange(stepKey, {
                sessionTimeout: parseInt(e.target.value) || 30,
              })
            }
            type="number"
            variant="outlined"
            InputProps={{ endAdornment: "minutes" }}
          />
        </Grid>

        <Grid sx={{ xs: 12 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={!!stepFormData[stepKey]?.ipWhitelisting}
                onChange={(e) =>
                  handleStepDataChange(stepKey, {
                    ipWhitelisting: e.target.checked,
                  })
                }
              />
            }
            label={t("enableIpWhitelisting")}
          />
          {stepFormData[stepKey]?.ipWhitelisting && (
            <TextField
              fullWidth
              label={t("allowedIps")}
              value={stepFormData[stepKey]?.allowedIps || ""}
              onChange={(e) =>
                handleStepDataChange(stepKey, { allowedIps: e.target.value })
              }
              variant="outlined"
              placeholder="e.g., 192.168.1.1, 10.0.0.0/8"
              helperText={t("ipWhitelistingHelper")}
            />
          )}
        </Grid>
      </Grid>
    );
  };
  const TeamInvitationStep = ({ stepKey }: { stepKey: string }) => {
    const [emails, setEmails] = useState<string[]>([]);
    const [newEmail, setNewEmail] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
      if (stepFormData[stepKey]?.invitedEmails) {
        setEmails(stepFormData[stepKey].invitedEmails);
      }
    }, [stepKey]);

    const validateEmail = (email: string) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    };

    const addEmail = () => {
      if (!newEmail.trim()) {
        setError(t("emailRequired"));
        return;
      }

      if (!validateEmail(newEmail)) {
        setError(t("invalidEmailFormat"));
        return;
      }

      if (emails.includes(newEmail)) {
        setError(t("emailAlreadyAdded"));
        return;
      }

      const updatedEmails = [...emails, newEmail.trim()];
      setEmails(updatedEmails);
      setNewEmail("");
      setError("");
      handleStepDataChange(stepKey, { invitedEmails: updatedEmails });
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        addEmail();
      }
    };

    const removeEmail = (emailToRemove: string) => {
      const updatedEmails = emails.filter((email) => email !== emailToRemove);
      setEmails(updatedEmails);
      handleStepDataChange(stepKey, { invitedEmails: updatedEmails });
    };

    return (
      <Grid container spacing={3}>
        <Grid sx={{ xs: 12 }}>
          <Typography variant="h5" gutterBottom fontWeight={600}>
            {t("teamInvitationTitle")}
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            {t("teamInvitationDescription")}
          </Typography>
        </Grid>

        <Grid sx={{ xs: 12 }}>
          <TextField
            fullWidth
            label={t("emailPlaceholder")}
            value={newEmail}
            onChange={(e) => {
              setNewEmail(e.target.value);
              if (error) setError("");
            }}
            onKeyDown={handleKeyPress}
            variant="outlined"
            type="email"
            error={!!error}
            helperText={error}
            placeholder="name@company.com"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    variant="contained"
                    onClick={addEmail}
                    disabled={!newEmail.trim()}
                    sx={{ ml: 1 }}
                  >
                    {t("addEmailButton")}
                  </Button>
                </InputAdornment>
              ),
            }}
          />
          <Typography
            variant="caption"
            color="text.secondary"
            mt={1}
            display="block"
          >
            {t("pressEnterToAdd")}
          </Typography>
        </Grid>

        <Grid sx={{ xs: 12 }}>
          {emails.length > 0 ? (
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Box display="flex" alignItems="center" mb={1}>
                {/* <PeopleIcon color="action" sx={{ mr: 1 }} /> */}
                <Typography variant="subtitle1" fontWeight={500}>
                  {t("invitedTeamMembers")} ({emails.length})
                </Typography>
              </Box>

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {emails.map((email) => (
                  <Chip
                    key={email}
                    label={email}
                    onDelete={() => removeEmail(email)}
                    sx={{
                      borderRadius: 1,
                      py: 1,
                      "& .MuiChip-deleteIcon": {
                        fontSize: 18,
                        color: "error.main",
                      },
                    }}
                    deleteIcon={<Close />}
                  />
                ))}
              </Box>
            </Paper>
          ) : (
            <Paper
              variant="outlined"
              sx={{ p: 4, textAlign: "center", borderRadius: 2 }}
            >
              {/* <GroupAddIcon
                sx={{ fontSize: 48, color: "action.disabled", mb: 1 }}
              /> */}
              <Typography variant="body1" color="text.secondary">
                {t("noInvitationsAdded")}
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                {t("addMembersInstruction")}
              </Typography>
            </Paper>
          )}
        </Grid>

        {emails.length > 0 && (
          <Grid sx={{ xs: 12 }}>
            <Alert severity="info" icon={<Info />} sx={{ borderRadius: 2 }}>
              <Typography variant="body2">
                {t("invitationNotice", { count: emails.length })}
              </Typography>
            </Alert>
          </Grid>
        )}
      </Grid>
    );
  };

  // Integration field component for use with Controller
  const IntegrationField = ({
    value,
    onChange,
    t,
  }: {
    value: any[];
    onChange: (val: any[]) => void;
    t: any;
  }) => {
    const DEFAULT_INTEGRATIONS: any[] = [
      { id: "google", name: "Google Workspace", enabled: false },
      { id: "Mpesa", name: "Mpesa Payment Notification", enabled: false },
      { id: "SMS", name: "SMS Notification", enabled: false },
      { id: "Whats App", name: "Whats App Notification", enabled: false },
    ];
    const [integrations, setIntegrations] = useState<any[]>(
      value?.length ? value : DEFAULT_INTEGRATIONS
    );

    useEffect(() => {
      onChange(integrations);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [integrations]);

    const toggleIntegration = (id: string) => {
      setIntegrations((prev) =>
        prev.map((integration) =>
          integration.id === id
            ? { ...integration, enabled: !integration.enabled }
            : integration
        )
      );
    };

    const handleApiKeyChange = (id: string, apiKey: string) => {
      setIntegrations((prev) =>
        prev.map((integration) =>
          integration.id === id ? { ...integration, apiKey } : integration
        )
      );
    };

    return (
      <Grid container spacing={3}>
        <Grid sx={{ xs: 12 }}>
          <Typography variant="h6" gutterBottom>
            {t("integrationSetupTitle")}
          </Typography>
          <Typography variant="body1" color="textSecondary" mb={2}>
            {t("integrationSetupDescription")}
          </Typography>
        </Grid>

        {integrations.map((integration) => (
          <Grid sx={{ xs: 12, md: 6 }} key={integration.id}>
            <Paper sx={{ p: 2 }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="subtitle1">{integration.name}</Typography>
                <Switch
                  checked={integration.enabled}
                  onChange={() => toggleIntegration(integration.id)}
                />
              </Box>

              {integration.enabled && (
                <Box mt={2}>
                  <TextField
                    fullWidth
                    label={`${integration.name} API Key`}
                    type="password"
                    value={integration.apiKey ?? ""}
                    onChange={(e) =>
                      handleApiKeyChange(integration.id, e.target.value)
                    }
                    variant="outlined"
                    size="small"
                  />
                </Box>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
    );
  };

  // IntegrationSetupStep using Controller
  const IntegrationSetupStep = ({ stepKey }: { stepKey: string }) => {
    const { control } = useForm({
      defaultValues: {
        integrations: stepFormData[stepKey]?.integrations || [],
      },
    });

    return (
      <Controller
        name="integrations"
        control={control}
        render={({ field }) => (
          <IntegrationField
            value={field.value}
            onChange={(val) => {
              field.onChange(val);
              handleStepDataChange(stepKey, { integrations: val });
            }}
            t={t}
          />
        )}
      />
    );
  };
  // Plan Selection Step Component
  // Separate component for displaying errors to avoid re-rendering the whole form
  const PlanSelectionErrors = ({ control }: { control: any }) => {
    const { errors } = useFormState({ control });
    return (
      <>
        {errors.planId && (
          <Typography color="error" variant="body2" mt={1}>
            {errors.planId.message as string}
          </Typography>
        )}
      </>
    );
  };

  const PlanSelectionStep = ({ stepKey }: { stepKey: string }) => {
    const { t } = useTranslation("onboarding-tenant");
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [loadingPlans, setLoadingPlans] = useState(true);
    const { handleSubmit, control, setValue } = useForm({
      resolver: yupResolver(validationSchemas.plan_selection),
      defaultValues: stepFormData[stepKey] || {},
    });
    const currency = "$"; // Replace with actual currency from context or props
    // Fetch plans from backend
    useEffect(() => {
      const fetchPlans = async () => {
        try {
          setLoadingPlans(true);
          // This would be an API call in a real app
          const mockPlans: SubscriptionPlan[] = [
            {
              id: "lite",
              name: "Lite",
              description: "For Pilots, Startups & Solo Operators",
              price: 10,
              isTrial: false,
              features: [
                { name: "Up to 2 agents", included: true },
                { name: "≤100 households", included: true },
                { name: "Accept cash & mobile payments", included: true },
                { name: "Send SMS/email reminders manually", included: true },
                { name: "Access to reports/analytics", included: false },
                { name: "Inventory or procurement", included: false },
                { name: "Multi-region support", included: false },
              ],
              modules: [
                {
                  module: "Waste Collection",
                  submodules: [
                    "Field app for tracking",
                    "Real-time payment tracking",
                  ],
                },
                {
                  module: "Communication",
                  submodules: ["Manual broadcast updates"],
                },
              ],
            },
            {
              id: "starter",
              name: "Starter",
              description: "For Growing Teams & Community Groups",
              price: 50,
              isTrial: false,
              features: [
                { name: "Up to 10 agents", included: true },
                { name: "≤1,000 households", included: true },
                { name: "In-app performance reporting", included: true },
                { name: "Waste categorization", included: true },
                { name: "Export government reports", included: true },
                { name: "Manual & Auto SMS/email reminders", included: true },
                { name: "White Labelling", included: true },
                {
                  name: "Vendor procurement or finance tools",
                  included: false,
                },
                { name: "Insights dashboard", included: false },
              ],
              modules: [
                {
                  module: "Waste Collection",
                  submodules: [
                    "Field app for tracking",
                    "Real-time payment tracking",
                    "Collection agent records",
                  ],
                },
                {
                  module: "Business Management",
                  submodules: ["Basic financial monitoring"],
                },
                {
                  module: "Communication",
                  submodules: [
                    "Instant broadcast updates",
                    "Real-time issue reporting",
                  ],
                },
                {
                  module: "Payment System",
                  submodules: [
                    "Mobile money, cash, invoices",
                    "Automatic payment reminders",
                  ],
                },
              ],
            },
            {
              id: "pro",
              name: "Pro",
              description: "For Mid-Sized Operators & Co-ops",
              price: 150,
              isTrial: false,
              features: [
                { name: "Up to 30 agents", included: true },
                { name: "≤5,000 households", included: true },
                { name: "Debt tracking, payment plans", included: true },
                { name: "Access to procurement & inventory", included: true },
                { name: "QuickBooks integration (basic sync)", included: true },
                { name: "Exportable reports (Excel/PDF)", included: true },
                { name: "White-labelling", included: true },
                { name: "Financial reports (P&L, Cash Flow)", included: false },
                { name: "Multi-region insights", included: false },
              ],
              modules: [
                {
                  module: "Waste Collection",
                  submodules: [
                    "Field app for tracking",
                    "Real-time payment tracking",
                    "Collection agent records",
                    "Location visibility",
                  ],
                },
                {
                  module: "Business Management",
                  submodules: [
                    "Inventory tracking",
                    "Procurement management",
                    "Financial monitoring",
                  ],
                },
                {
                  module: "Communication",
                  submodules: [
                    "Instant broadcast updates",
                    "Real-time issue reporting",
                  ],
                },
                {
                  module: "Payment System",
                  submodules: [
                    "Mobile money, cash, invoices",
                    "Automatic payment reminders",
                    "Debt management",
                  ],
                },
                {
                  module: "Recycling Marketplace",
                  submodules: [
                    "Buyer-seller platform",
                    "Quality assurance system",
                  ],
                },
              ],
            },
            {
              id: "enterprise",
              name: "Enterprise",
              description: "For Regional Waste Operators",
              price: 300,
              isTrial: false,
              features: [
                { name: "Unlimited agents", included: true },
                { name: ">5,000 households", included: true },
                {
                  name: "Inventory + procurement + vendor mgmt",
                  included: true,
                },
                {
                  name: "Financial reports (P&L, Cash Flow, Balance Sheet)",
                  included: true,
                },
                {
                  name: "Multi-region & multi-tenant insights",
                  included: true,
                },
                {
                  name: "Full QuickBooks & general ledger integration",
                  included: true,
                },
                { name: "Customer payment plan automation", included: true },
                { name: "White-labeling (logo, SMS ID, etc.)", included: true },
              ],
              modules: [
                {
                  module: "Waste Collection",
                  submodules: [
                    "Field app for tracking",
                    "Real-time payment tracking",
                    "Collection agent records",
                    "Location visibility",
                    "Multi-region management",
                  ],
                },
                {
                  module: "Business Management",
                  submodules: [
                    "Inventory tracking",
                    "Procurement management",
                    "Vendor management",
                    "Financial reports",
                  ],
                },
                {
                  module: "Communication",
                  submodules: [
                    "Instant broadcast updates",
                    "Real-time issue reporting",
                    "Multi-tenant communication",
                  ],
                },
                {
                  module: "Payment System",
                  submodules: [
                    "Mobile money, cash, invoices",
                    "Automatic payment reminders",
                    "Debt management",
                    "Payment plan automation",
                  ],
                },
                {
                  module: "Recycling Marketplace",
                  submodules: [
                    "Buyer-seller platform",
                    "Quality assurance system",
                    "Bulk order aggregation",
                    "Compliance reporting",
                  ],
                },
                {
                  module: "Compliance",
                  submodules: [
                    "Regulatory reporting",
                    "Environmental compliance",
                  ],
                },
              ],
            },
          ];

          setPlans(mockPlans);

          // Auto-select trial plan
          if (!stepFormData[stepKey]?.planId) {
            setValue("planId", "trial");
            handleStepDataChange(stepKey, { planId: "trial" });
          }
        } catch (error) {
          console.error("Failed to fetch plans", error);
          enqueueSnackbar(t("planLoadError"), { variant: "error" });
        } finally {
          setLoadingPlans(false);
        }
      };

      fetchPlans();
    }, [setValue, stepKey, t]);

    const onSubmit = (data: any) => {
      handleStepDataChange(stepKey, data);
      handleNext();
    };

    const handlePlanChange = (planId: string) => {
      setValue("planId", planId);
      handleStepDataChange(stepKey, { planId });
    };

    return (
      <form onSubmit={handleSubmit(onSubmit)} ref={formRef}>
        <Grid container spacing={3}>
          <Grid sx={{ xs: 12 }}>
            <Typography variant="h6" gutterBottom>
              {t("selectPlanTitle")}
            </Typography>
            <Typography variant="body1" color="textSecondary" mb={3}>
              {t("selectPlanDescription")}
            </Typography>
          </Grid>

          {loadingPlans ? (
            <Grid sx={{ xs: 12 }} textAlign="center">
              <CircularProgress />
              <Typography>{t("loadingPlans")}</Typography>
            </Grid>
          ) : (
            <Grid sx={{ xs: 12 }}>
              <FormControl component="fieldset" fullWidth>
                <RadioGroup
                  aria-label="subscription-plan"
                  name="planId"
                  value={stepFormData[stepKey]?.planId || "trial"}
                  onChange={(e) => handlePlanChange(e.target.value)}
                >
                  <Grid container spacing={3}>
                    {plans.map((plan) => (
                      <Grid sx={{ xs: 12, md: 4 }} key={plan.id}>
                        <Card
                          variant="outlined"
                          sx={{
                            height: "100%",
                            borderColor:
                              stepFormData[stepKey]?.planId === plan.id
                                ? theme.palette.primary.main
                                : "divider",
                            borderWidth:
                              stepFormData[stepKey]?.planId === plan.id ? 2 : 1,
                            boxShadow:
                              stepFormData[stepKey]?.planId === plan.id
                                ? theme.shadows[4]
                                : "none",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              boxShadow: theme.shadows[6],
                              transform: "translateY(-5px)",
                            },
                          }}
                        >
                          <CardHeader
                            title={plan.name}
                            subheader={plan.description}
                            titleTypographyProps={{
                              variant: "h6",
                              color: plan.isTrial ? "primary" : "textPrimary",
                            }}
                            action={
                              <Radio
                                value={plan.id}
                                checked={
                                  stepFormData[stepKey]?.planId === plan.id
                                }
                                color="primary"
                              />
                            }
                          />
                          <CardContent>
                            <Box mb={2}>
                              <Typography variant="h4" component="div">
                                {plan.price > 0
                                  ? `${currency}${plan.price}/mo`
                                  : t("freeLabel")}
                              </Typography>
                              {plan.isTrial && (
                                <Typography
                                  variant="caption"
                                  color="textSecondary"
                                >
                                  {t("trialDuration")}
                                </Typography>
                              )}
                            </Box>

                            <Typography variant="subtitle1" gutterBottom>
                              {t("includedFeatures")}
                            </Typography>

                            <Box mb={2}>
                              {plan.features.map((feature, idx) => (
                                <Box
                                  key={idx}
                                  display="flex"
                                  alignItems="center"
                                  mb={1}
                                >
                                  {feature.included ? (
                                    <CheckCircle
                                      color="success"
                                      fontSize="small"
                                    />
                                  ) : (
                                    <CheckCircleOutline
                                      color="disabled"
                                      fontSize="small"
                                    />
                                  )}
                                  <Typography
                                    variant="body2"
                                    ml={1}
                                    sx={{
                                      textDecoration: feature.included
                                        ? "none"
                                        : "line-through",
                                      color: feature.included
                                        ? "text.primary"
                                        : "text.disabled",
                                    }}
                                  >
                                    {feature.name}
                                  </Typography>
                                </Box>
                              ))}
                            </Box>

                            <Typography variant="subtitle1" gutterBottom>
                              {t("includedModules")}
                            </Typography>

                            {plan.modules.map((module, idx) => (
                              <Box key={idx} mb={1}>
                                <Typography variant="body2" fontWeight="bold">
                                  {module.module}
                                </Typography>
                                <Box pl={2}>
                                  {module.submodules.map(
                                    (submodule, subIdx) => (
                                      <Typography key={subIdx} variant="body2">
                                        • {submodule}
                                      </Typography>
                                    )
                                  )}
                                </Box>
                              </Box>
                            ))}
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </RadioGroup>
                <PlanSelectionErrors control={control} />
              </FormControl>

              {/* {errors.planId && (
                <Typography color="error" variant="body2" mt={1}>
                  {errors.planId.message as string}
                </Typography>
              )} */}
            </Grid>
          )}
        </Grid>
      </form>
    );
  };
  /**
   * Get content for the current step
   */
  const getStepContent = (stepKey: string) => {
    switch (stepKey) {
      case "tenant_registration":
        return <TenantRegistrationStep stepKey={stepKey} />;
      case "admin_creation":
        return <AdminAccountSetupStep stepKey={stepKey} />;
      case "domain_configuration":
        return <DomainConfigurationStep stepKey={stepKey} />;
      case "schema_initialization":
        return <SchemaInitializationStep />;
      case "payment_setup":
        return <PaymentSetupStep stepKey={stepKey} />;
      case "branding_configuration":
        return <BrandingConfigurationStep stepKey={stepKey} />;
      case "initial_settings":
        return <InitialSettingsStep stepKey={stepKey} />;
      case "team_invitation":
        return <TeamInvitationStep stepKey={stepKey} />;
      case "compliance_setup":
        return <ComplianceSetupStep stepKey={stepKey} />;
      case "integration_setup":
        return <IntegrationSetupStep stepKey={stepKey} />;
      case "data_import":
        return <DataImportStep stepKey={stepKey} />;
      case "security_configuration":
        return <SecurityConfigurationStep stepKey={stepKey} />;
      case "go_live_check":
        return <GoLiveCheckStep stepKey={stepKey} />;
      case "plan_selection":
        return <PlanSelectionStep stepKey={stepKey} />;
      default:
        return `Unknown step: ${stepKey}`;
    }
  };

  /**
   * Render step navigation buttons
   */
  const renderStepActions = () => {
    if (!activeStepKey) {
      return (
        <Box mt={4}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => (window.location.href = "/")}
          >
            {t("backToHomeButton")}
          </Button>
        </Box>
      );
    }

    const currentStepIndex = getStepIndex(activeStepKey);
    const isLastStep = currentStepIndex === filteredSteps.length - 1;

    return (
      <Box mt={4} display="flex" justifyContent="space-between">
        <Button disabled={currentStepIndex === 0} onClick={handleBack}>
          {t("previousButton")}
        </Button>

        <Box>
          {isStepOptional(activeStepKey) && (
            <Button
              variant="outlined"
              onClick={handleSkip}
              sx={{ mr: 2 }}
              disabled={loading}
            >
              {t("skipButton")}
            </Button>
          )}

          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              if (formRef.current) {
                // Trigger form submission if form exists
                formRef.current.dispatchEvent(
                  new Event("submit", { cancelable: true, bubbles: true })
                );
              } else if (isLastStep) {
                setConfirmDialogOpen(true);
              } else {
                handleNext();
              }
            }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : isLastStep ? (
              t("finishButton")
            ) : (
              t("nextButton")
            )}
          </Button>
        </Box>
      </Box>
    );
  };

  /**
   * Render completion screen
   */
  const renderCompletionScreen = () => (
    <Box textAlign="center" py={6}>
      <Box mb={3}>
        <svg width="100" height="100" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="12" fill="#4CAF50" />
          <path fill="none" stroke="#FFF" strokeWidth="2" d="M7 13l3 3 7-7" />
        </svg>
      </Box>
      <Typography variant="h4" gutterBottom>
        {t("tenantOnboardingSuccessTitle")}
      </Typography>
      <Typography variant="body1" color="textSecondary">
        {t("completionMessage")}
      </Typography>
      <Box mt={4}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => (window.location.href = "/admin-panel")}
        >
          {t("backToHomeButton")}
        </Button>
      </Box>
    </Box>
  );

  if (loading) {
    return (
      <Container maxWidth="xl">
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          style={{ minHeight: "80vh" }}
        >
          <Grid sx={{ xs: 12 }} textAlign="center">
            <CircularProgress size={60} />
            <Typography variant="h6" mt={2}>
              {t("loadingMessage")}
            </Typography>
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl">
        <Grid container spacing={3} pt={3}>
          <Grid sx={{ xs: 12 }}>
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
            <Button
              variant="contained"
              onClick={() => window.location.reload()}
            >
              {t("retryButton")}
            </Button>
            <Button variant="outlined" sx={{ ml: 2 }} href="/support">
              {t("contactSupportButton")}
            </Button>
          </Grid>
        </Grid>
      </Container>
    );
  }

  // Calculate active step index for stepper
  const activeStepIndex = activeStepKey
    ? getStepIndex(activeStepKey)
    : filteredSteps.length;

  return (
    <Container maxWidth="xl">
      <Grid container spacing={3} pt={3}>
        <Grid sx={{ xs: 12 }} mb={2}>
          <Typography variant="h4" component="h1" gutterBottom>
            <strong>{t("title")}</strong>
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {t("description")}
          </Typography>
        </Grid>

        <Grid sx={{ xs: 12 }}>
          <Stepper
            activeStep={activeStepIndex}
            alternativeLabel
            sx={{
              mb: 4,
              overflowX: "auto",
              "& .MuiStepLabel-label": {
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
              },
            }}
          >
            {filteredSteps.map((step) => (
              <Step
                key={step.key}
                completed={
                  isStepCompleted(step.key) ||
                  activeStepIndex > getStepIndex(step.key)
                }
              >
                <StepLabel
                  optional={
                    step.isSkippable && (
                      <Typography variant="caption">
                        {t("optionalLabel")}
                      </Typography>
                    )
                  }
                  error={isStepSkipped(step.key)}
                >
                  {step.name}
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          <Paper elevation={2} sx={{ p: 3 }}>
            {!activeStepKey ? (
              renderCompletionScreen()
            ) : (
              <>
                <Typography variant="h5" gutterBottom>
                  {stepsByKey[activeStepKey]?.name || ""}
                </Typography>
                <Typography variant="body1" color="textSecondary" mb={3}>
                  {stepsByKey[activeStepKey]?.description || ""}
                </Typography>

                {getStepContent(activeStepKey)}

                {renderStepActions()}
              </>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>{t("confirmationTitle")}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t("confirmationDescription")}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmDialogOpen(false)}
            disabled={loading}
          >
            {t("cancelButton")}
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : t("confirmButton")}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default withPageRequiredAuth(TenantOnboarding, {
  roles: [RoleEnum.ADMIN, RoleEnum.PLATFORM_OWNER, RoleEnum.MANAGER],
});
