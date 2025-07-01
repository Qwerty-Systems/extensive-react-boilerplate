"use client";
import Button from "@mui/material/Button";
import withPageRequiredGuest from "@/services/auth/with-page-required-guest";
import { useForm, FormProvider, useFormState } from "react-hook-form";
import {
  useAuthLoginService,
  useAuthSignUpService,
  useAuthTenantSignUpService,
} from "@/services/api/services/auth";
import useAuthActions from "@/services/auth/use-auth-actions";
import useAuthTokens from "@/services/auth/use-auth-tokens";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FormTextInput from "@/components/form/text-input/form-text-input";
import FormCheckboxInput from "@/components/form/checkbox/form-checkbox";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "@/components/link";
import Box from "@mui/material/Box";
import MuiLink from "@mui/material/Link";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { useTranslation } from "@/services/i18n/client";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import SocialAuth from "@/services/social-auth/social-auth";
import { isGoogleAuthEnabled } from "@/services/social-auth/google/google-config";
import { isFacebookAuthEnabled } from "@/services/social-auth/facebook/facebook-config";
import { isKeycloakAuthEnabled } from "@/services/social-auth/keycloak/keycloak-config";
import { useEffect, useState } from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import {
  TenantType,
  useGetTenantTypesService,
} from "@/services/api/services/tenant-types";
import CircularProgress from "@mui/material/CircularProgress";
import FormSelectInput from "@/components/form/select/form-select";
import { APP_DEFAULT_PATH } from "@/config";
import { useRouter } from "next/navigation";
import { useSnackbar } from "@/hooks/use-snackbar";
type TPolicy = {
  id: string;
  name: string;
};

type SignUpFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  policy: TPolicy[];
  tenantName?: string; // New field
  tenantType?: any; // New field
};

const useValidationSchema = (isTenantSignup: boolean) => {
  const { t } = useTranslation("sign-up");

  return yup.object().shape({
    firstName: yup
      .string()
      .required(t("sign-up:inputs.firstName.validation.required")),
    lastName: yup
      .string()
      .required(t("sign-up:inputs.lastName.validation.required")),
    phone: yup.string().optional(),
    // phone: yup.string().required(t("sign-up:inputs.phone.validation.required")),
    // .matches(
    //   /^\+?[1-9]\d{1,14}$/,
    //   t("sign-up:inputs.phone.validation.invalid")
    // ),
    email: yup
      .string()
      .email(t("sign-up:inputs.email.validation.invalid"))
      .required(t("sign-up:inputs.email.validation.required")),
    password: yup
      .string()
      .min(6, t("sign-up:inputs.password.validation.min"))
      .required(t("sign-up:inputs.password.validation.required")),
    policy: yup
      .array()
      .min(1, t("sign-up:inputs.policy.validation.required"))
      .required(),
    ...(isTenantSignup && {
      tenantName: yup
        .string()
        .required(t("sign-up:inputs.tenantName.validation.required")),
      tenantType: yup
        .object()
        .required(t("sign-up:inputs.tenantType.validation.required")),
    }),
  });
};

function FormActions() {
  const { t } = useTranslation("sign-up");
  const { isSubmitting } = useFormState();

  return (
    <Button
      variant="contained"
      color="primary"
      type="submit"
      disabled={isSubmitting}
      data-testid="sign-up-submit"
    >
      {t("sign-up:actions.submit")}
    </Button>
  );
}

function Form() {
  const [isTenantSignup, setIsTenantSignup] = useState(true);
  const { setUser, setTenant } = useAuthActions();
  const { setTokensInfo } = useAuthTokens();
  const fetchAuthLogin = useAuthLoginService();
  const fetchAuthSignUp = useAuthSignUpService();
  const fetchAuthTenantSignUp = useAuthTenantSignUpService(); // New service
  const [tenantTypes, setTenantTypes] = useState<TenantType[]>([]);
  const [isLoadingTenantTypes, setIsLoadingTenantTypes] = useState(false);
  const fetchTenantTypes = useGetTenantTypesService();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const { t } = useTranslation("sign-up");
  const validationSchema = useValidationSchema(
    isTenantSignup
  ) as yup.ObjectSchema<SignUpFormData>;
  const policyOptions = [
    { id: "policy", name: t("sign-up:inputs.policy.agreement") },
  ];

  const methods = useForm<SignUpFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      policy: [],
      tenantName: "",
      tenantType: "",
    },
  });

  const { handleSubmit, setError } = methods;

  const onSubmit = handleSubmit(async (formData) => {
    if (isTenantSignup) {
      const { data: dataSignUp, status: statusSignUp } =
        await fetchAuthTenantSignUp({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          name: formData.tenantName!,
          type: { id: formData.tenantType!.id },
        });
      if (statusSignUp === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
        (Object.keys(dataSignUp.errors) as Array<keyof SignUpFormData>).forEach(
          (key) => {
            setError(key, {
              type: "manual",
              message: t(
                `sign-up:inputs.${key}.validation.server.${dataSignUp.errors[key]}`
              ),
            });
          }
        );

        return;
      }
      if (
        statusSignUp === HTTP_CODES_ENUM.OK ||
        statusSignUp === HTTP_CODES_ENUM.NO_CONTENT
      ) {
        const { data: dataSignIn, status: statusSignIn } = await fetchAuthLogin(
          {
            email: formData.email,
            password: formData.password,
          }
        );

        if (statusSignIn === HTTP_CODES_ENUM.OK) {
          setTokensInfo({
            token: dataSignIn.token,
            refreshToken: dataSignIn.refreshToken,
            tokenExpires: dataSignIn.tokenExpires,
          });
          setUser(dataSignIn.user);
          setTenant(dataSignIn.user.tenant ?? null);
          // const urlParams = new URLSearchParams(window.location.search);
          // const returnTo =
          //   urlParams.get("returnTo") || `/en/${APP_DEFAULT_PATH}`;
          //TODO: Fix language handling
          //`/${language}${APP_DEFAULT_PATH}`;
          //router.push(returnTo);
          enqueueSnackbar(
            t(
              "registrationSuccess",
              "Registration successful! Please check your email to verify your account."
            ),
            {
              variant: "success",
            }
          );
          router.replace(`/en/${APP_DEFAULT_PATH}`);
        } else {
          setError("email", {
            type: "manual",
            message: t("sign-up:inputs.email.validation.loginFailed"),
          });
          setError("password", {
            type: "manual",
            message: t("sign-up:inputs.password.validation.loginFailed"),
          });
        }
      }
    } else {
      const { data: dataSignUp, status: statusSignUp } = await fetchAuthSignUp({
        // firstName: formData.firstName,
        // lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });
      if (statusSignUp === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
        (Object.keys(dataSignUp.errors) as Array<keyof SignUpFormData>).forEach(
          (key) => {
            setError(key, {
              type: "manual",
              message: t(
                `sign-up:inputs.${key}.validation.server.${dataSignUp.errors[key]}`
              ),
            });
          }
        );

        return;
      }

      const { data: dataSignIn, status: statusSignIn } = await fetchAuthLogin({
        email: formData.email,
        password: formData.password,
      });

      if (statusSignIn === HTTP_CODES_ENUM.OK) {
        setTokensInfo(
          {
            token: dataSignIn.token,
            refreshToken: dataSignIn.refreshToken,
            tokenExpires: dataSignIn.tokenExpires,
          }
          /*  "local" */
        );
        setUser(dataSignIn.user);
      }
    }
  });
  // Fetch tenant types on component mount
  useEffect(() => {
    const loadTenantTypes = async () => {
      setIsLoadingTenantTypes(true);
      try {
        const { data } = await fetchTenantTypes({ page: 1, limit: 100 });
        if (data && "data" in data) {
          setTenantTypes(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch tenant types:", error);
      } finally {
        setIsLoadingTenantTypes(false);
      }
    };

    loadTenantTypes();
  }, [fetchTenantTypes]);

  return (
    <FormProvider {...methods}>
      <Container maxWidth="xs">
        <form onSubmit={onSubmit}>
          <Grid container spacing={2} mb={2}>
            <Grid size={{ xs: 12 }} mt={3}>
              <Typography variant="h6">{t("sign-up:title")}</Typography>
            </Grid>
            {/* Tenant Signup Toggle */}
            <Grid sx={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isTenantSignup}
                    onChange={(e) => setIsTenantSignup(e.target.checked)}
                    color="primary"
                  />
                }
                label={t("sign-up:inputs.isTenantSignup.label")}
              />
            </Grid>

            {/* Tenant Fields - Conditionally shown */}
            {isTenantSignup && (
              <>
                <Grid sx={{ xs: 12 }}>
                  <FormTextInput<SignUpFormData>
                    name="phone"
                    label={t("sign-up:inputs.phone.label")}
                    testId="tenant-phone"
                  />
                </Grid>
                <Grid sx={{ xs: 12 }}>
                  <FormTextInput<SignUpFormData>
                    name="tenantName"
                    label={t("sign-up:inputs.tenantName.label")}
                    testId="tenant-name"
                  />
                </Grid>
                <Grid sx={{ xs: 12 }}>
                  {isLoadingTenantTypes ? (
                    <Box display="flex" justifyContent="center">
                      <CircularProgress size={24} />
                    </Box>
                  ) : (
                    <FormSelectInput<SignUpFormData, TenantType>
                      name="tenantType"
                      label={t("sign-up:inputs.tenantType.label")}
                      options={tenantTypes}
                      testId="tenant-type"
                      keyValue="id"
                      renderOption={(option) => option.name}
                    />
                  )}
                </Grid>
              </>
            )}
            {[!isKeycloakAuthEnabled].some(Boolean) && (
              <>
                <Grid size={{ xs: 12 }}>
                  <FormTextInput<SignUpFormData>
                    name="firstName"
                    label={t("sign-up:inputs.firstName.label")}
                    type="text"
                    autoFocus
                    testId="first-name"
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <FormTextInput<SignUpFormData>
                    name="lastName"
                    label={t("sign-up:inputs.lastName.label")}
                    type="text"
                    testId="last-name"
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <FormTextInput<SignUpFormData>
                    name="email"
                    label={t("sign-up:inputs.email.label")}
                    type="email"
                    testId="email"
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <FormTextInput<SignUpFormData>
                    name="password"
                    label={t("sign-up:inputs.password.label")}
                    type="password"
                    testId="password"
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FormCheckboxInput
                    name="policy"
                    label=""
                    testId="privacy"
                    options={policyOptions}
                    keyValue="id"
                    keyExtractor={(option) => option.id.toString()}
                    renderOption={(option) => (
                      <span>
                        {option.name}
                        <MuiLink href="/privacy-policy" target="_blank">
                          {t("sign-up:inputs.policy.label")}
                        </MuiLink>
                      </span>
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <FormActions />
                  <Box ml={1} component="span">
                    <Button
                      variant="contained"
                      color="inherit"
                      LinkComponent={Link}
                      data-testid="login"
                      href="/sign-in"
                    >
                      {t("sign-up:actions.accountAlreadyExists")}
                    </Button>
                  </Box>
                </Grid>
              </>
            )}

            {[isGoogleAuthEnabled, isFacebookAuthEnabled].some(Boolean) && (
              <Grid size={{ xs: 12 }}>
                <Divider sx={{ mb: 2 }}>
                  {!isKeycloakAuthEnabled && <Chip label={t("sign-up:or")} />}
                </Divider>
                <SocialAuth />
              </Grid>
            )}
          </Grid>
        </form>
      </Container>
    </FormProvider>
  );
}

function SignUp() {
  return <Form />;
}

export default withPageRequiredGuest(SignUp);
