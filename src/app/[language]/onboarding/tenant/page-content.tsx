// "use client";

// import { useState, useEffect, useCallback, useMemo } from "react";
// import { useTranslation } from "react-i18next";
// import { RoleEnum } from "@/services/api/types/role";
// import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
// import Container from "@mui/material/Container";
// import Typography from "@mui/material/Typography";
// import Stepper from "@mui/material/Stepper";
// import Step from "@mui/material/Step";
// import StepLabel from "@mui/material/StepLabel";
// import Button from "@mui/material/Button";
// import Box from "@mui/material/Box";
// import Paper from "@mui/material/Paper";
// import TextField from "@mui/material/TextField";
// import Alert from "@mui/material/Alert";
// import CircularProgress from "@mui/material/CircularProgress";
// import { TENANT_ONBOARDING_STEPS } from "@/utils/constant";
// import {
//   useCompleteStep,
//   useGetOnboardingStatus,
//   useInitializeOnboarding,
//   useSkipStep,
// } from "@/services/api/services/onboarding";
// import {
//   OnboardingEntityType,
//   OnboardingStepStatus,
// } from "@/services/api/types/onboarding";
// import useAuth from "@/services/auth/use-auth";
// import FormControl from "@mui/material/FormControl";
// import InputLabel from "@mui/material/InputLabel";
// import Select from "@mui/material/Select";
// import MenuItem from "@mui/material/MenuItem";
// import FormControlLabel from "@mui/material/FormControlLabel";
// import Checkbox from "@mui/material/Checkbox";
// import Grid from "@mui/material/Grid";

// // Mock languages and timezones for the demo
// const LANGUAGES = [
//   { value: "en", label: "English" },
//   { value: "es", label: "Spanish" },
//   { value: "fr", label: "French" },
//   { value: "de", label: "German" },
// ];

// const TIMEZONES = [
//   { value: "UTC-12", label: "UTC-12:00" },
//   { value: "UTC-8", label: "UTC-08:00 (PST)" },
//   { value: "UTC-5", label: "UTC-05:00 (EST)" },
//   { value: "UTC", label: "UTC" },
//   { value: "UTC+1", label: "UTC+01:00 (CET)" },
//   { value: "UTC+8", label: "UTC+08:00 (CST)" },
// ];

// function TenantOnboarding() {
//   const { t } = useTranslation("onboarding-tenant");
//   const [activeStepKey, setActiveStepKey] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
//   const [completedSteps, setCompletedSteps] = useState<string[]>([]);
//   const [skippedSteps, setSkippedSteps] = useState<string[]>([]);
//   const { user } = useAuth();
//   const getOnboardingStatus = useGetOnboardingStatus();
//   const [onboardingStatus, setOnboardingStatus] = useState<any>(null);
//   const [formData, setFormData] = useState<Record<string, any>>({});
//   const [error, setError] = useState<string | null>(null);

//   // Create a map of steps by key for quick lookup
//   const stepsByKey = useMemo(() => {
//     return TENANT_ONBOARDING_STEPS.reduce(
//       (acc, step) => {
//         acc[step.key] = step;
//         return acc;
//       },
//       {} as Record<string, (typeof TENANT_ONBOARDING_STEPS)[0]>
//     );
//   }, []);

//   // Get ordered step keys
//   const orderedStepKeys = useMemo(() => {
//     return TENANT_ONBOARDING_STEPS.map((step) => step.key);
//   }, []);

//   // Find step index by key
//   const getStepIndex = (key: string) => orderedStepKeys.indexOf(key);

//   const refetch = useCallback(async () => {
//     if (user?.tenant?.id) {
//       setLoading(true);
//       try {
//         const result = await getOnboardingStatus({
//           entityType: OnboardingEntityType.TENANT,
//           entityId: user?.tenant?.id,
//         });

//         if (
//           result?.data &&
//           "steps" in result.data &&
//           Array.isArray(result.data.steps)
//         ) {
//           setOnboardingStatus(result);

//           const completed: string[] = [];
//           const skipped: string[] = [];

//           result.data.steps.forEach((step: any) => {
//             if (step.status === OnboardingStepStatus.COMPLETED.toLowerCase()) {
//               completed.push(step.stepKey);
//             } else if (
//               step.status === OnboardingStepStatus.SKIPPED.toLowerCase()
//             ) {
//               skipped.push(step.stepKey);
//             }
//           });

//           setCompletedSteps(completed);
//           setSkippedSteps(skipped);

//           // Find first incomplete step by order
//           const firstIncomplete = result.data.steps.find(
//             (step: any) =>
//               step.status === OnboardingStepStatus.PENDING.toLowerCase()
//           );

//           setActiveStepKey(firstIncomplete ? firstIncomplete.stepKey : null);
//         } else {
//           console.warn("Unexpected onboarding status response:", result);
//           setError(t("errorLoadingStatus"));
//         }
//       } catch (err: any) {
//         console.error("Error fetching onboarding status:", err);
//         setError(err.message || t("errorLoadingStatus"));
//       } finally {
//         setLoading(false);
//       }
//     }
//   }, [user, getOnboardingStatus, t]);

//   useEffect(() => {
//     refetch();
//   }, [refetch]);

//   const initializeOnboarding = useInitializeOnboarding();
//   const completeStep = useCompleteStep();
//   const skipStep = useSkipStep();

//   useEffect(() => {
//     if (user?.tenant?.id && !onboardingStatus) {
//       initializeOnboarding({
//         entityId: user.tenant.id!,
//         entityType: OnboardingEntityType.TENANT,
//       })
//         .then(() => refetch())
//         .catch((err) => setError(err.message));
//     }
//   }, [user?.tenant?.id, onboardingStatus, initializeOnboarding, refetch]);

//   const handleNext = useCallback(async () => {
//     if (!user?.tenant?.id || !user?.id || !onboardingStatus || !activeStepKey)
//       return;

//     const currentStep = onboardingStatus.data.steps.find(
//       (step: any) => step.stepKey === activeStepKey
//     );

//     if (!currentStep) return;

//     try {
//       setLoading(true);

//       await completeStep({
//         entityType: OnboardingEntityType.TENANT,
//         entityId: user.tenant.id,
//         stepId: currentStep.id,
//         metadata: formData,
//         performedBy: { userId: user.id?.toString() ?? "" },
//       });

//       refetch();
//     } catch (err: any) {
//       setError(err.message || t("errorCompletingStep"));
//     } finally {
//       setLoading(false);
//     }
//   }, [
//     user,
//     onboardingStatus,
//     activeStepKey,
//     formData,
//     completeStep,
//     refetch,
//     t,
//   ]);

//   const handleBack = () => {
//     if (!activeStepKey) return;

//     const currentIndex = getStepIndex(activeStepKey);
//     if (currentIndex > 0) {
//       setActiveStepKey(orderedStepKeys[currentIndex - 1]);
//     }
//   };

//   const handleSkip = useCallback(async () => {
//     if (!user?.tenant?.id || !user?.id || !onboardingStatus || !activeStepKey)
//       return;

//     try {
//       setLoading(true);

//       await skipStep({
//         entityType: OnboardingEntityType.TENANT,
//         entityId: user.tenant.id,
//         stepKey: activeStepKey,
//         performedBy: { userId: user.id.toString() },
//       });

//       refetch();
//     } catch (err: any) {
//       setError(err.message || t("errorSkippingStep"));
//     } finally {
//       setLoading(false);
//     }
//   }, [user, onboardingStatus, activeStepKey, skipStep, refetch, t]);

//   const handleSubmit = useCallback(async () => {
//     if (!user?.tenant?.id || !user?.id || !onboardingStatus) return;

//     try {
//       setLoading(true);

//       await Promise.all(
//         onboardingStatus.data.steps
//           .filter((step: any) => step.status === OnboardingStepStatus.PENDING)
//           .map((step: any) =>
//             completeStep({
//               entityType: OnboardingEntityType.TENANT,
//               entityId: user?.tenant?.id || "",
//               stepId: step.id,
//               metadata: formData,
//               performedBy: { userId: user?.id?.toString() ?? "" },
//             })
//           )
//       );

//       refetch();
//       setConfirmDialogOpen(false);
//     } catch (err: any) {
//       setError(err.message || t("errorSubmitting"));
//     } finally {
//       setLoading(false);
//     }
//   }, [user, onboardingStatus, formData, completeStep, refetch, t]);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleSelectChange = (e: any) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const isStepOptional = (stepKey: string) => {
//     return stepsByKey[stepKey]?.isSkippable;
//   };

//   const isStepCompleted = (stepKey: string) => {
//     return completedSteps.includes(stepKey);
//   };

//   const isStepSkipped = (stepKey: string) => {
//     return skippedSteps.includes(stepKey);
//   };

//   const getStepContent = (stepKey: string) => {
//     switch (stepKey) {
//       case "tenant_registration": // Tenant Registration
//         return (
//           <Grid container spacing={3}>
//             <Grid sx={{ xs: 12, md: 6 }}>
//               <TextField
//                 fullWidth
//                 label={t("tenantNamePlaceholder")}
//                 name="tenantName"
//                 value={formData.tenantName || ""}
//                 onChange={handleInputChange}
//                 variant="outlined"
//                 required
//               />
//             </Grid>
//             <Grid sx={{ xs: 12, md: 6 }}>
//               <TextField
//                 fullWidth
//                 label={t("contactEmailPlaceholder")}
//                 name="contactEmail"
//                 type="email"
//                 value={formData.contactEmail || ""}
//                 onChange={handleInputChange}
//                 variant="outlined"
//                 required
//               />
//             </Grid>
//           </Grid>
//         );

//       case "admin_creation": // Admin Account Setup
//         return (
//           <Grid container spacing={3}>
//             <Grid sx={{ xs: 12, md: 6 }}>
//               <TextField
//                 fullWidth
//                 label={t("adminFirstNamePlaceholder")}
//                 name="adminFirstName"
//                 value={formData.adminFirstName || ""}
//                 onChange={handleInputChange}
//                 variant="outlined"
//                 required
//               />
//             </Grid>
//             <Grid sx={{ xs: 12, md: 6 }}>
//               <TextField
//                 fullWidth
//                 label={t("adminLastNamePlaceholder")}
//                 name="adminLastName"
//                 value={formData.adminLastName || ""}
//                 onChange={handleInputChange}
//                 variant="outlined"
//                 required
//               />
//             </Grid>
//             <Grid sx={{ xs: 12, md: 6 }}>
//               <TextField
//                 fullWidth
//                 label={t("adminEmailPlaceholder")}
//                 name="adminEmail"
//                 type="email"
//                 value={formData.adminEmail || ""}
//                 onChange={handleInputChange}
//                 variant="outlined"
//                 required
//               />
//             </Grid>
//             <Grid sx={{ xs: 12, md: 6 }}>
//               <TextField
//                 fullWidth
//                 label={t("adminPasswordPlaceholder")}
//                 name="adminPassword"
//                 type="password"
//                 value={formData.adminPassword || ""}
//                 onChange={handleInputChange}
//                 variant="outlined"
//                 required
//               />
//             </Grid>
//           </Grid>
//         );

//       case "domain_configuration": // Domain Configuration
//         return (
//           <Grid container spacing={3}>
//             <Grid sx={{ xs: 12 }}>
//               <TextField
//                 fullWidth
//                 label={t("customDomainPlaceholder")}
//                 name="customDomain"
//                 value={formData.customDomain || ""}
//                 onChange={handleInputChange}
//                 placeholder="yourdomain.example.com"
//                 variant="outlined"
//               />
//             </Grid>
//             <Grid sx={{ xs: 12 }}>
//               <Alert severity="info">{t("domainOptionalMessage")}</Alert>
//             </Grid>
//           </Grid>
//         );

//       case "schema_initialization": // Schema Initialization
//         return (
//           <Box textAlign="center" py={4}>
//             <CircularProgress size={60} />
//             <Typography variant="h6" mt={2}>
//               {t("schemaInitializationTitle")}
//             </Typography>
//             <Typography variant="body2" color="textSecondary" mt={1}>
//               {t("schemaInitializationDescription")}
//             </Typography>
//           </Box>
//         );

//       case "payment_setup": // Payment Setup
//         return (
//           <Grid container spacing={3}>
//             <Grid sx={{ xs: 12 }}>
//               <TextField
//                 fullWidth
//                 label={t("cardholderNamePlaceholder")}
//                 name="cardName"
//                 value={formData.cardName || ""}
//                 onChange={handleInputChange}
//                 variant="outlined"
//                 required
//               />
//             </Grid>
//             <Grid sx={{ xs: 12 }}>
//               <TextField
//                 fullWidth
//                 label={t("creditCardNumberPlaceholder")}
//                 name="cardNumber"
//                 value={formData.cardNumber || ""}
//                 onChange={handleInputChange}
//                 variant="outlined"
//                 required
//               />
//             </Grid>
//             <Grid sx={{ xs: 12, md: 4 }}>
//               <TextField
//                 fullWidth
//                 label={t("expiryDatePlaceholder")}
//                 name="cardExpiry"
//                 value={formData.cardExpiry || ""}
//                 onChange={handleInputChange}
//                 placeholder="MM/YY"
//                 variant="outlined"
//                 required
//               />
//             </Grid>
//             <Grid sx={{ xs: 12, md: 4 }}>
//               <TextField
//                 fullWidth
//                 label={t("cvvPlaceholder")}
//                 name="cardCvv"
//                 value={formData.cardCvv || ""}
//                 onChange={handleInputChange}
//                 variant="outlined"
//                 required
//               />
//             </Grid>
//           </Grid>
//         );

//       case "branding_configuration": // Branding Configuration
//         return (
//           <Grid container spacing={3}>
//             <Grid sx={{ xs: 12 }}>
//               <TextField
//                 fullWidth
//                 label={t("primaryColorPlaceholder")}
//                 name="primaryColor"
//                 value={formData.primaryColor || ""}
//                 onChange={handleInputChange}
//                 variant="outlined"
//               />
//             </Grid>
//             <Grid sx={{ xs: 12 }}>
//               <TextField
//                 fullWidth
//                 label={t("secondaryColorPlaceholder")}
//                 name="secondaryColor"
//                 value={formData.secondaryColor || ""}
//                 onChange={handleInputChange}
//                 variant="outlined"
//               />
//             </Grid>
//             <Grid sx={{ xs: 12 }}>
//               <input
//                 accept="image/*"
//                 type="file"
//                 id="logo-upload"
//                 hidden
//                 onChange={(e) => {
//                   if (e.target.files && e.target.files[0]) {
//                     setFormData((prev) => ({
//                       ...prev,
//                       logo: e.target.files?.[0],
//                     }));
//                   }
//                 }}
//               />
//               <label htmlFor="logo-upload">
//                 <Button variant="outlined" component="span">
//                   {t("uploadLogoButton")}
//                 </Button>
//               </label>
//               {formData.logo && (
//                 <Typography variant="body2" mt={1}>
//                   {formData.logo.name}
//                 </Typography>
//               )}
//             </Grid>
//           </Grid>
//         );

//       case "initial_settings": // Initial Settings
//         return (
//           <Grid container spacing={3}>
//             <Grid sx={{ xs: 12, md: 6 }}>
//               <FormControl fullWidth variant="outlined">
//                 <InputLabel>{t("languagePlaceholder")}</InputLabel>
//                 <Select
//                   name="language"
//                   value={formData.language || ""}
//                   onChange={handleSelectChange}
//                   label={t("languagePlaceholder")}
//                 >
//                   {LANGUAGES.map((lang) => (
//                     <MenuItem key={lang.value} value={lang.value}>
//                       {lang.label}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </Grid>
//             <Grid sx={{ xs: 12, md: 6 }}>
//               <FormControl fullWidth variant="outlined">
//                 <InputLabel>{t("timezonePlaceholder")}</InputLabel>
//                 <Select
//                   name="timezone"
//                   value={formData.timezone || ""}
//                   onChange={handleSelectChange}
//                   label={t("timezonePlaceholder")}
//                 >
//                   {TIMEZONES.map((tz) => (
//                     <MenuItem key={tz.value} value={tz.value}>
//                       {tz.label}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </Grid>
//             <Grid sx={{ xs: 12 }}>
//               <Typography variant="h6" gutterBottom>
//                 {t("notificationSettings.title")}
//               </Typography>
//               <FormControlLabel
//                 control={
//                   <Checkbox
//                     checked={!!formData.notification_email}
//                     onChange={handleInputChange}
//                     name="notification_email"
//                   />
//                 }
//                 label={t("notificationSettings.emailNotifications")}
//               />
//               <FormControlLabel
//                 control={
//                   <Checkbox
//                     checked={!!formData.notification_sms}
//                     onChange={handleInputChange}
//                     name="notification_sms"
//                   />
//                 }
//                 label={t("notificationSettings.smsNotifications")}
//               />
//               <FormControlLabel
//                 control={
//                   <Checkbox
//                     checked={!!formData.notification_push}
//                     onChange={handleInputChange}
//                     name="notification_push"
//                   />
//                 }
//                 label={t("notificationSettings.pushNotifications")}
//               />
//             </Grid>
//           </Grid>
//         );

//       case "go_live_check": // Go-Live Checklist
//         return (
//           <Grid container spacing={3}>
//             <Grid sx={{ xs: 12 }}>
//               <FormControlLabel
//                 control={<Checkbox name="verifiedSettings" />}
//                 label={t("verifiedSettingsLabel")}
//               />
//             </Grid>
//             <Grid sx={{ xs: 12 }}>
//               <FormControlLabel
//                 control={<Checkbox name="testedRegistration" />}
//                 label={t("testedRegistrationLabel")}
//               />
//             </Grid>
//             <Grid sx={{ xs: 12 }}>
//               <FormControlLabel
//                 control={<Checkbox name="reviewedCompliance" />}
//                 label={t("reviewedComplianceLabel")}
//               />
//             </Grid>
//             <Grid sx={{ xs: 12 }}>
//               <FormControlLabel
//                 control={<Checkbox name="backedUpConfig" />}
//                 label={t("backedUpConfigLabel")}
//               />
//             </Grid>
//           </Grid>
//         );

//       default:
//         return `Unknown step: ${stepKey}`;
//     }
//   };

//   const renderStepActions = () => {
//     if (!activeStepKey) {
//       return (
//         <Box mt={4}>
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={() => (window.location.href = "/")}
//           >
//             {t("backToHomeButton")}
//           </Button>
//         </Box>
//       );
//     }

//     const currentStepIndex = getStepIndex(activeStepKey);
//     const isLastStep = currentStepIndex === TENANT_ONBOARDING_STEPS.length - 1;

//     return (
//       <Box mt={4} display="flex" justifyContent="space-between">
//         <Button disabled={currentStepIndex === 0} onClick={handleBack}>
//           {t("previousButton")}
//         </Button>

//         <Box>
//           {isStepOptional(activeStepKey) && (
//             <Button
//               variant="outlined"
//               onClick={handleSkip}
//               sx={{ mr: 2 }}
//               disabled={loading}
//             >
//               {t("skipButton")}
//             </Button>
//           )}

//           <Button
//             variant="contained"
//             color="primary"
//             onClick={isLastStep ? () => setConfirmDialogOpen(true) : handleNext}
//             disabled={loading}
//           >
//             {loading ? (
//               <CircularProgress size={24} />
//             ) : isLastStep ? (
//               t("finishButton")
//             ) : (
//               t("nextButton")
//             )}
//           </Button>
//         </Box>
//       </Box>
//     );
//   };

//   const renderCompletionScreen = () => (
//     <Box textAlign="center" py={6}>
//       <Box mb={3}>
//         <svg width="100" height="100" viewBox="0 0 24 24">
//           <circle cx="12" cy="12" r="12" fill="#4CAF50" />
//           <path fill="none" stroke="#FFF" strokeWidth="2" d="M7 13l3 3 7-7" />
//         </svg>
//       </Box>
//       <Typography variant="h4" gutterBottom>
//         {t("tenantOnboardingSuccessTitle")}
//       </Typography>
//       <Typography variant="body1" color="textSecondary">
//         {t("completionMessage")}
//       </Typography>
//       <Box mt={4}>
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={() => (window.location.href = "/")}
//         >
//           {t("backToHomeButton")}
//         </Button>
//       </Box>
//     </Box>
//   );

//   if (loading) {
//     return (
//       <Container maxWidth="xl">
//         <Grid
//           container
//           justifyContent="center"
//           alignItems="center"
//           style={{ minHeight: "80vh" }}
//         >
//           <Grid sx={{ xs: 12 }} textAlign="center">
//             <CircularProgress size={60} />
//             <Typography variant="h6" mt={2}>
//               {t("loadingMessage")}
//             </Typography>
//           </Grid>
//         </Grid>
//       </Container>
//     );
//   }

//   if (error) {
//     return (
//       <Container maxWidth="xl">
//         <Grid container spacing={3} pt={3}>
//           <Grid sx={{ xs: 12 }}>
//             <Alert severity="error" sx={{ mb: 3 }}>
//               {error}
//             </Alert>
//             <Button
//               variant="contained"
//               onClick={() => window.location.reload()}
//             >
//               {t("retryButton")}
//             </Button>
//             <Button variant="outlined" sx={{ ml: 2 }} href="/support">
//               {t("contactSupportButton")}
//             </Button>
//           </Grid>
//         </Grid>
//       </Container>
//     );
//   }

//   // Calculate active step index for stepper
//   const activeStepIndex = activeStepKey
//     ? getStepIndex(activeStepKey)
//     : TENANT_ONBOARDING_STEPS.length;

//   return (
//     <Container maxWidth="xl">
//       <Grid container spacing={3} pt={3}>
//         <Grid sx={{ xs: 12 }} mb={2}>
//           <Typography variant="h4" component="h1" gutterBottom>
//             <strong>{t("title")}</strong>
//           </Typography>
//           <Typography variant="subtitle1" color="textSecondary">
//             {t("description")}
//           </Typography>
//         </Grid>

//         <Grid sx={{ xs: 12 }}>
//           <Stepper
//             activeStep={activeStepIndex}
//             alternativeLabel
//             sx={{
//               mb: 4,
//               overflowX: "auto",
//               "& .MuiStepLabel-label": {
//                 fontSize: { xs: "0.75rem", sm: "0.875rem" },
//               },
//             }}
//           >
//             {TENANT_ONBOARDING_STEPS.map((step) => (
//               <Step
//                 key={step.key}
//                 completed={
//                   isStepCompleted(step.key) ||
//                   activeStepIndex > getStepIndex(step.key)
//                 }
//               >
//                 <StepLabel
//                   optional={
//                     step.isSkippable && (
//                       <Typography variant="caption">
//                         {t("optionalLabel")}
//                       </Typography>
//                     )
//                   }
//                   error={isStepSkipped(step.key)}
//                 >
//                   {step.name}
//                 </StepLabel>
//               </Step>
//             ))}
//           </Stepper>

//           <Paper elevation={2} sx={{ p: 3 }}>
//             {!activeStepKey ? (
//               renderCompletionScreen()
//             ) : (
//               <>
//                 <Typography variant="h5" gutterBottom>
//                   {stepsByKey[activeStepKey]?.name || ""}
//                 </Typography>
//                 <Typography variant="body1" color="textSecondary" mb={3}>
//                   {stepsByKey[activeStepKey]?.description || ""}
//                 </Typography>

//                 {getStepContent(activeStepKey)}

//                 {renderStepActions()}
//               </>
//             )}
//           </Paper>
//         </Grid>
//       </Grid>

//       {/* Confirmation Dialog */}
//       {confirmDialogOpen && (
//         <Box
//           sx={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             width: "100%",
//             height: "100%",
//             backgroundColor: "rgba(0,0,0,0.5)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             zIndex: 1300,
//           }}
//         >
//           <Paper sx={{ p: 4, maxWidth: 500, width: "100%" }}>
//             <Typography variant="h6" gutterBottom>
//               {t("confirmationMessage")}
//             </Typography>
//             <Typography variant="body1" mb={3}>
//               {t("confirmationDescription")}
//             </Typography>
//             <Box display="flex" justifyContent="flex-end">
//               <Button
//                 onClick={() => setConfirmDialogOpen(false)}
//                 sx={{ mr: 2 }}
//                 disabled={loading}
//               >
//                 {t("cancelConfirmationButton")}
//               </Button>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handleSubmit}
//                 disabled={loading}
//               >
//                 {loading ? <CircularProgress size={24} /> : t("confirmButton")}
//               </Button>
//             </Box>
//           </Paper>
//         </Box>
//       )}
//     </Container>
//   );
// }

// export default withPageRequiredAuth(TenantOnboarding, {
//   roles: [RoleEnum.ADMIN, RoleEnum.PLATFORM_OWNER, RoleEnum.MANAGER],
// });
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
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useForm, Controller, useFormState } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSnackbar } from "notistack";

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
    language: yup.string().required("Language is required"),
    timezone: yup.string().required("Timezone is required"),
  }),
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
          .filter((step: any) => step.status === OnboardingStepStatus.PENDING)
          .map((step: any) =>
            completeStep({
              entityType: OnboardingEntityType.TENANT,
              entityId: user?.tenant?.id || "",
              stepId: step.id,
              metadata: stepFormData[step.stepKey] || {},
              performedBy: { userId: user?.id?.toString() ?? "" },
            })
          )
      );

      refetch();
      setConfirmDialogOpen(false);
      enqueueSnackbar(t("onboardingCompleteSuccess"), { variant: "success" });
    } catch (err: any) {
      setError(err.message || t("errorSubmitting"));
      enqueueSnackbar(t("onboardingCompletionError"), { variant: "error" });
    } finally {
      setLoading(false);
    }
  }, [
    user,
    onboardingStatus,
    stepFormData,
    completeStep,
    refetch,
    t,
    enqueueSnackbar,
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
    return (
      <Grid container spacing={3}>
        <Grid sx={{ xs: 12 }}>
          <TextField
            fullWidth
            label={t("customDomainPlaceholder")}
            name="customDomain"
            value={stepFormData[stepKey]?.customDomain || ""}
            onChange={(e) =>
              handleStepDataChange(stepKey, { customDomain: e.target.value })
            }
            placeholder="yourdomain.example.com"
            variant="outlined"
          />
        </Grid>
        <Grid sx={{ xs: 12 }}>
          <Alert severity="info">{t("domainOptionalMessage")}</Alert>
        </Grid>
      </Grid>
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
    return (
      <Grid container spacing={3}>
        <Grid sx={{ xs: 12 }}>
          <TextField
            fullWidth
            label={t("primaryColorPlaceholder")}
            name="primaryColor"
            value={stepFormData[stepKey]?.primaryColor || ""}
            onChange={(e) =>
              handleStepDataChange(stepKey, { primaryColor: e.target.value })
            }
            variant="outlined"
          />
        </Grid>
        <Grid sx={{ xs: 12 }}>
          <TextField
            fullWidth
            label={t("secondaryColorPlaceholder")}
            name="secondaryColor"
            value={stepFormData[stepKey]?.secondaryColor || ""}
            onChange={(e) =>
              handleStepDataChange(stepKey, { secondaryColor: e.target.value })
            }
            variant="outlined"
          />
        </Grid>
        <Grid sx={{ xs: 12 }}>
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
          {stepFormData[stepKey]?.logo && (
            <Typography variant="body2" mt={1}>
              {stepFormData[stepKey].logo.name}
            </Typography>
          )}
        </Grid>
      </Grid>
    );
  };

  const InitialSettingsStep = ({ stepKey }: { stepKey: string }) => {
    const { control, handleSubmit } = useForm({
      resolver: yupResolver(validationSchemas.initial_settings),
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
            <FormControl fullWidth variant="outlined">
              <InputLabel>{t("languagePlaceholder")}</InputLabel>
              <Controller
                name="language"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label={t("languagePlaceholder")}
                    error={!!errors.language}
                  >
                    {LANGUAGES.map((lang) => (
                      <MenuItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.language && (
                <Typography color="error" variant="body2">
                  {errors.language.message as string}
                </Typography>
              )}
            </FormControl>
          </Grid>
          <Grid sx={{ xs: 12, md: 6 }}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>{t("timezonePlaceholder")}</InputLabel>
              <Controller
                name="timezone"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label={t("timezonePlaceholder")}
                    error={!!errors.timezone}
                  >
                    {TIMEZONES.map((tz) => (
                      <MenuItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.timezone && (
                <Typography color="error" variant="body2">
                  {errors.timezone.message as string}
                </Typography>
              )}
            </FormControl>
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
      case "go_live_check":
        return <GoLiveCheckStep stepKey={stepKey} />;
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
