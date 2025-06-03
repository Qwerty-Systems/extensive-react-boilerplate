"use client";

import {
  useState,
  useEffect,
  useCallback,
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
} from "react";
import { useTranslation } from "react-i18next";
import { RoleEnum } from "@/services/api/types/role";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
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
import { TENANT_ONBOARDING_STEPS } from "@/utils/constant";
import {
  useCompleteStep,
  useGetOnboardingStatus,
  useInitializeTenantOnboarding,
  useSkipStep,
} from "@/services/api/services/onboarding";
import {
  OnboardingEntityType,
  OnboardingStepStatus,
} from "@/services/api/types/onboarding";
import useAuth from "@/services/auth/use-auth";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

// Mock languages and timezones for the demo
const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
];

const TIMEZONES = [
  { value: "UTC-12", label: "UTC-12:00" },
  { value: "UTC-8", label: "UTC-08:00 (PST)" },
  { value: "UTC-5", label: "UTC-05:00 (EST)" },
  { value: "UTC", label: "UTC" },
  { value: "UTC+1", label: "UTC+01:00 (CET)" },
  { value: "UTC+8", label: "UTC+08:00 (CST)" },
];

function TenantOnboarding() {
  const { t } = useTranslation("onboarding-tenant");
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [skippedSteps, setSkippedSteps] = useState<number[]>([]);
  const { user } = useAuth();
  const getOnboardingStatus = useGetOnboardingStatus();
  const [onboardingStatus, setOnboardingStatus] = useState<any>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (user?.tenant?.id) {
      setLoading(true);
      try {
        const result = await getOnboardingStatus({
          entityType: OnboardingEntityType.TENANT,
          entityId: user.tenant.id,
        });

        // Ensure it’s the success type
        if ("steps" in result && Array.isArray(result.steps)) {
          setOnboardingStatus(result);

          const completed: number[] = [];
          const skipped: number[] = [];

          result.steps.forEach((step: any, index: number) => {
            if (step.status === OnboardingStepStatus.COMPLETED) {
              completed.push(index);
            } else if (step.status === OnboardingStepStatus.SKIPPED) {
              skipped.push(index);
            }
          });

          setCompletedSteps(completed);
          setSkippedSteps(skipped);

          const firstIncomplete = result.steps.findIndex(
            (step: any) => step.status === OnboardingStepStatus.PENDING
          );

          setActiveStep(
            firstIncomplete >= 0 ? firstIncomplete : result.steps.length
          );
        } else {
          console.warn("Unexpected onboarding status response:", result);
          setError(t("errorLoadingStatus"));
        }
      } catch (err: any) {
        setError(err.message || t("errorLoadingStatus"));
      } finally {
        setLoading(false);
      }
    }
  }, [user, getOnboardingStatus, t]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const initializeOnboarding = useInitializeTenantOnboarding();
  const completeStep = useCompleteStep();
  const skipStep = useSkipStep();

  // Initialize onboarding if not exists
  useEffect(() => {
    if (user?.tenant?.id && !onboardingStatus) {
      initializeOnboarding({ tenantId: user.tenant.id })
        .then(() => refetch())
        .catch((err) => setError(err.message));
    }
  }, [user?.tenant?.id, onboardingStatus, initializeOnboarding, refetch]);

  const handleNext = useCallback(async () => {
    if (!user?.tenant?.id || !user?.id || !onboardingStatus) return;

    const currentStep = onboardingStatus.steps[activeStep];
    if (!currentStep) return;

    try {
      setLoading(true);

      await completeStep({
        entityType: OnboardingEntityType.TENANT,
        entityId: user.tenant.id,
        stepKey: currentStep.stepKey,
        metadata: formData,
        performedBy: { userId: user.id?.toString() ?? "" },
      });

      refetch();
    } catch (err: any) {
      setError(err.message || t("errorCompletingStep"));
    } finally {
      setLoading(false);
    }
  }, [user, onboardingStatus, activeStep, formData, completeStep, refetch, t]);

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleSkip = useCallback(async () => {
    if (!user?.tenant?.id || !user?.id || !onboardingStatus) return;

    const currentStep = onboardingStatus.steps[activeStep];
    if (!currentStep) return;

    try {
      setLoading(true);

      await skipStep({
        entityType: OnboardingEntityType.TENANT,
        entityId: user.tenant.id,
        stepKey: currentStep.stepKey,
        performedBy: { userId: user.id.toString() },
      });

      refetch();
    } catch (err: any) {
      setError(err.message || t("errorSkippingStep"));
    } finally {
      setLoading(false);
    }
  }, [user, onboardingStatus, activeStep, skipStep, refetch, t]);

  const handleSubmit = useCallback(async () => {
    if (!user?.tenant?.id || !user?.id || !onboardingStatus) return;

    try {
      setLoading(true);

      // Complete all remaining steps
      await Promise.all(
        onboardingStatus.steps
          .filter((step: any) => step.status === OnboardingStepStatus.PENDING)
          .map((step: any) =>
            completeStep({
              entityType: OnboardingEntityType.TENANT,
              // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
              entityId: user?.tenant?.id!,
              stepKey: step.stepKey,
              metadata: formData,
              performedBy: { userId: user?.id?.toString() },
            })
          )
      );

      refetch();
      setConfirmDialogOpen(false);
    } catch (err: any) {
      setError(err.message || t("errorSubmitting"));
    } finally {
      setLoading(false);
    }
  }, [user, onboardingStatus, formData, completeStep, refetch, t]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isStepOptional = (step: number) => {
    return TENANT_ONBOARDING_STEPS[step]?.isSkippable;
  };

  const isStepCompleted = (step: number) => {
    return completedSteps.includes(step);
  };

  const isStepSkipped = (step: number) => {
    return skippedSteps.includes(step);
  };

  // const getStepContent = (step: number) => {
  //   // ... (same as before, but using formData directly)
  //   switch (step) {
  //     case 0: // Tenant Registration
  //       return (
  //         <Grid container spacing={3}>
  //           <Grid sx={{ xs: 12 }} md={6}>
  //             <TextField
  //               fullWidth
  //               label={t("tenantNamePlaceholder")}
  //               name="tenantName"
  //               value={formData.tenantName || ""}
  //               onChange={handleInputChange}
  //               variant="outlined"
  //               required
  //             />
  //           </Grid>
  //           <Grid sx={{ xs: 12 }} md={6}>
  //             <TextField
  //               fullWidth
  //               label={t("contactEmailPlaceholder")}
  //               name="contactEmail"
  //               type="email"
  //               value={formData.contactEmail || ""}
  //               onChange={handleInputChange}
  //               variant="outlined"
  //               required
  //             />
  //           </Grid>
  //         </Grid>
  //       );

  //     // ... other steps remain the same

  //     default:
  //       return `Unknown step: ${step + 1}`;
  //   }
  // };
  const getStepContent = (step: number) => {
    switch (step) {
      case 0: // Tenant Registration
        return (
          <Grid container spacing={3}>
            <Grid sx={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label={t("tenantNamePlaceholder")}
                name="tenantName"
                value={formData.tenantName || ""}
                onChange={handleInputChange}
                variant="outlined"
                required
              />
            </Grid>
            <Grid sx={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label={t("contactEmailPlaceholder")}
                name="contactEmail"
                type="email"
                value={formData.contactEmail || ""}
                onChange={handleInputChange}
                variant="outlined"
                required
              />
            </Grid>
          </Grid>
        );
      case 1: // Admin Account Setup
        return (
          <Grid container spacing={3}>
            <Grid sx={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Admin First Name"
                name="adminFirstName"
                variant="outlined"
                required
              />
            </Grid>
            <Grid sx={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Admin Last Name"
                name="adminLastName"
                variant="outlined"
                required
              />
            </Grid>
            <Grid sx={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Admin Email"
                name="adminEmail"
                type="email"
                variant="outlined"
                required
              />
            </Grid>
            <Grid sx={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Admin Password"
                name="adminPassword"
                type="password"
                variant="outlined"
                required
              />
            </Grid>
          </Grid>
        );

      case 2: // Domain Configuration
        return (
          <Grid container spacing={3}>
            <Grid sx={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Custom Domain"
                name="customDomain"
                placeholder="yourdomain.example.com"
                variant="outlined"
              />
            </Grid>
            <Grid sx={{ xs: 12 }}>
              <Alert severity="info">
                This step is optional. You can configure your domain later in
                settings.
              </Alert>
            </Grid>
          </Grid>
        );

      case 3: // Schema Initialization
        return (
          <Box textAlign="center" py={4}>
            <CircularProgress size={60} />
            <Typography variant="h6" mt={2}>
              Initializing database schema...
            </Typography>
            <Typography variant="body2" color="textSecondary" mt={1}>
              This may take a few moments. Please don&apos;t close this window.
            </Typography>
          </Box>
        );

      case 4: // Payment Setup
        return (
          <Grid container spacing={3}>
            <Grid sx={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Cardholder Name"
                name="cardName"
                variant="outlined"
                required
              />
            </Grid>
            <Grid sx={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Credit Card Number"
                name="cardNumber"
                variant="outlined"
                required
              />
            </Grid>
            <Grid sx={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Expiry Date"
                name="cardExpiry"
                placeholder="MM/YY"
                variant="outlined"
                required
              />
            </Grid>
            <Grid sx={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="CVV"
                name="cardCvv"
                variant="outlined"
                required
              />
            </Grid>
          </Grid>
        );

      case 5: // Branding Configuration
        return (
          <Grid container spacing={3}>
            <Grid sx={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Primary Color"
                name="primaryColor"
                variant="outlined"
              />
            </Grid>
            <Grid sx={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Secondary Color"
                name="secondaryColor"
                variant="outlined"
              />
            </Grid>
            <Grid sx={{ xs: 12 }}>
              <input accept="image/*" type="file" id="logo-upload" hidden />
              <label htmlFor="logo-upload">
                <Button variant="outlined" component="span">
                  Upload Logo
                </Button>
              </label>
            </Grid>
          </Grid>
        );

      case 6: // Initial Settings
        return (
          <Grid container spacing={3}>
            <Grid sx={{ xs: 12, md: 6 }}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>{t("languagePlaceholder")}</InputLabel>
                <Select
                  name="language"
                  value={formData.language}
                  onChange={handleSelectChange}
                  label={t("languagePlaceholder")}
                >
                  {LANGUAGES.map((lang) => (
                    <MenuItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid sx={{ xs: 12, md: 6 }}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>{t("timezonePlaceholder")}</InputLabel>
                <Select
                  name="timezone"
                  value={formData.timezone}
                  onChange={handleSelectChange}
                  label={t("timezonePlaceholder")}
                >
                  {TIMEZONES.map((tz) => (
                    <MenuItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid sx={{ xs: 12 }}>
              <Typography variant="h6" gutterBottom>
                {t("notificationSettings.title")}
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.notifications.email}
                    onChange={handleInputChange}
                    name="notification_email"
                  />
                }
                label={t("notificationSettings.emailNotifications")}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.notifications.sms}
                    onChange={handleInputChange}
                    name="notification_sms"
                  />
                }
                label={t("notificationSettings.smsNotifications")}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.notifications.push}
                    onChange={handleInputChange}
                    name="notification_push"
                  />
                }
                label={t("notificationSettings.pushNotifications")}
              />
            </Grid>
          </Grid>
        );

      case 12: // Go-Live Checklist
        return (
          <Grid container spacing={3}>
            <Grid sx={{ xs: 12 }}>
              <FormControlLabel
                control={<Checkbox />}
                label="I have verified all tenant settings"
              />
            </Grid>
            <Grid sx={{ xs: 12 }}>
              <FormControlLabel
                control={<Checkbox />}
                label="I have tested user registration"
              />
            </Grid>
            <Grid sx={{ xs: 12 }}>
              <FormControlLabel
                control={<Checkbox />}
                label="I have reviewed compliance requirements"
              />
            </Grid>
            <Grid sx={{ xs: 12 }}>
              <FormControlLabel
                control={<Checkbox />}
                label="I have backed up initial configuration"
              />
            </Grid>
          </Grid>
        );

      default:
        return `Unknown step: ${step + 1}`;
    }
  };

  const renderStepActions = () => {
    if (activeStep >= TENANT_ONBOARDING_STEPS.length) {
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

    return (
      <Box mt={4} display="flex" justifyContent="space-between">
        <Button disabled={activeStep === 0} onClick={handleBack}>
          {t("previousButton")}
        </Button>

        <Box>
          {isStepOptional(activeStep) && (
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
            onClick={
              activeStep === TENANT_ONBOARDING_STEPS.length - 1
                ? () => setConfirmDialogOpen(true)
                : handleNext
            }
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : activeStep === TENANT_ONBOARDING_STEPS.length - 1 ? (
              t("finishButton")
            ) : (
              t("nextButton")
            )}
          </Button>
        </Box>
      </Box>
    );
  };

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
          onClick={() => (window.location.href = "/")}
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

  return (
    <Container maxWidth="xl">
      <Grid container spacing={3} pt={3}>
        <Grid sx={{ xs: 12, mb: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            <strong>{t("title")}</strong>
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {t("description")}
          </Typography>
        </Grid>

        <Grid sx={{ xs: 12 }}>
          <Stepper
            activeStep={activeStep}
            alternativeLabel
            sx={{
              mb: 4,
              overflowX: "auto",
              "& .MuiStepLabel-label": {
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
              },
            }}
          >
            {TENANT_ONBOARDING_STEPS.map(
              (
                step: {
                  key: Key | null | undefined;
                  name:
                    | string
                    | number
                    | boolean
                    | ReactElement<unknown, string | JSXElementConstructor<any>>
                    | Iterable<ReactNode>
                    | ReactPortal
                    | null
                    | undefined;
                },
                index: number
              ) => (
                <Step
                  key={step.key}
                  completed={isStepCompleted(index) || activeStep > index}
                  sx={{ minWidth: 120 }}
                >
                  <StepLabel
                    optional={
                      isStepOptional(index) && (
                        <Typography variant="caption">
                          {t("optionalLabel")}
                        </Typography>
                      )
                    }
                    error={isStepSkipped(index)}
                  >
                    {step.name}
                  </StepLabel>
                </Step>
              )
            )}
          </Stepper>

          <Paper elevation={2} sx={{ p: 3 }}>
            {activeStep >= TENANT_ONBOARDING_STEPS.length ? (
              renderCompletionScreen()
            ) : (
              <>
                <Typography variant="h5" gutterBottom>
                  {TENANT_ONBOARDING_STEPS[activeStep]?.name || ""}
                </Typography>
                <Typography variant="body1" color="textSecondary" mb={3}>
                  {TENANT_ONBOARDING_STEPS[activeStep]?.description || ""}
                </Typography>

                {getStepContent(activeStep)}

                {renderStepActions()}
              </>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Confirmation Dialog */}
      {confirmDialogOpen && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1300,
          }}
        >
          <Paper sx={{ p: 4, maxWidth: 500, width: "100%" }}>
            <Typography variant="h6" gutterBottom>
              {t("confirmationMessage")}
            </Typography>
            <Typography variant="body1" mb={3}>
              {t("confirmationDescription")}
            </Typography>
            <Box display="flex" justifyContent="flex-end">
              <Button
                onClick={() => setConfirmDialogOpen(false)}
                sx={{ mr: 2 }}
                disabled={loading}
              >
                {t("cancelConfirmationButton")}
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : t("confirmButton")}
              </Button>
            </Box>
          </Paper>
        </Box>
      )}
    </Container>
  );
}

export default withPageRequiredAuth(TenantOnboarding, {
  roles: [RoleEnum.ADMIN, RoleEnum.PLATFORM_OWNER, RoleEnum.MANAGER],
});
