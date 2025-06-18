"use client";
import Button from "@mui/material/Button";
import LinkItem from "@mui/material/Link";
import withPageRequiredGuest from "@/services/auth/with-page-required-guest";
import { useForm, FormProvider, useFormState } from "react-hook-form";
import { useAuthLoginService } from "@/services/api/services/auth";
import useAuthActions from "@/services/auth/use-auth-actions";
import useAuthTokens from "@/services/auth/use-auth-tokens";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FormTextInput from "@/components/form/text-input/form-text-input";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "@/components/link";
import Box from "@mui/material/Box";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { useTranslation } from "@/services/i18n/client";
import SocialAuth from "@/services/social-auth/social-auth";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import { isGoogleAuthEnabled } from "@/services/social-auth/google/google-config";
import { isFacebookAuthEnabled } from "@/services/social-auth/facebook/facebook-config";
import { IS_SIGN_UP_ENABLED } from "@/services/auth/config";
import { isKeycloakAuthEnabled } from "@/services/social-auth/keycloak/keycloak-config";
import { useRouter, useSearchParams } from "next/navigation";
import { useSnackbar } from "@/hooks/use-snackbar";
import useLanguage from "@/services/i18n/use-language";
import { APP_DEFAULT_PATH } from "@/config";

type SignInFormData = {
  email: string;
  password: string;
};

const useValidationSchema = () => {
  const { t } = useTranslation("sign-in");

  return yup.object().shape({
    email: yup
      .string()
      .email(t("sign-in:inputs.email.validation.invalid"))
      .required(t("sign-in:inputs.email.validation.required")),
    password: yup
      .string()
      .min(6, t("sign-in:inputs.password.validation.min"))
      .required(t("sign-in:inputs.password.validation.required")),
  });
};

function FormActions() {
  const { t } = useTranslation("sign-in");
  const { isSubmitting } = useFormState();

  return (
    <Button
      variant="contained"
      color="primary"
      type="submit"
      disabled={isSubmitting}
      data-testid="sign-in-submit"
    >
      {t("sign-in:actions.submit")}
    </Button>
  );
}

function Form() {
  const { setUser, setTenant } = useAuthActions();
  const { setTokensInfo } = useAuthTokens();
  const fetchAuthLogin = useAuthLoginService();
  const { t } = useTranslation("sign-in");
  const validationSchema = useValidationSchema();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const language = useLanguage();
  console.log("from", from);

  const methods = useForm<SignInFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { handleSubmit, setError } = methods;

  const onSubmit = handleSubmit(async (formData) => {
    const { data, status } = await fetchAuthLogin(formData);
    console.log("status 888", data);
    // Handle validation errors if present in the response
    if (
      data &&
      "errors" in data &&
      status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY
    ) {
      (Object.keys(data.errors) as Array<keyof SignInFormData>).forEach(
        (key) => {
          setError(key, {
            type: "manual",
            message: t(
              `sign-in:inputs.${key}.validation.server.${data.errors[key]}`
            ),
          });
        }
      );
      const x: any = data;
      console.log("x", x.message);
      const message = JSON.stringify(x.errors); /**t(
        JSON.stringify(x.errors) || "sign-in:errors.validationFailed"
      );**/
      enqueueSnackbar(message, {
        variant: "error",
        autoHideDuration: 5000,
        position: "top-right",
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      return;
    }
    if (status === HTTP_CODES_ENUM.OK) {
      setTokensInfo(
        {
          token: data.token,
          refreshToken: data.refreshToken,
          tokenExpires: data.tokenExpires,
        }
        // "local"
      );
      console.log("data.user", data);
      setUser(data.user);
      setTenant(data.user.tenant ?? null);
      const urlParams = new URLSearchParams(window.location.search);
      console.log(`APP_DEFAULT_PATH, /${language}${APP_DEFAULT_PATH}`);
      const returnTo =
        urlParams.get("returnTo") || `/${language}${APP_DEFAULT_PATH}`;
      router.push(returnTo);
    }
    if (status === HTTP_CODES_ENUM.INTERNAL_SERVER_ERROR) {
      if (status === HTTP_CODES_ENUM.INTERNAL_SERVER_ERROR) {
        enqueueSnackbar(t("errors:somethingWrong"), {
          variant: "error",
          autoHideDuration: 5000,
          position: "top-right",
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      }
    }
  });

  return (
    <FormProvider {...methods}>
      <Container maxWidth="xs">
        <form onSubmit={onSubmit}>
          <Grid container spacing={2} mb={2}>
            <Grid size={{ xs: 12 }} mt={3}>
              <Typography variant="h6">{t("sign-in:title")}</Typography>
            </Grid>
            {[!isKeycloakAuthEnabled].some(Boolean) && (
              <>
                <Grid size={{ xs: 12 }}>
                  <FormTextInput<SignInFormData>
                    name="email"
                    label={t("sign-in:inputs.email.label")}
                    type="email"
                    testId="email"
                    autoFocus
                    fullWidth={true}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <FormTextInput<SignInFormData>
                    name="password"
                    label={t("sign-in:inputs.password.label")}
                    type="password"
                    testId="password"
                    fullWidth={true}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <LinkItem
                    component={Link}
                    href="/forgot-password"
                    data-testid="forgot-password"
                  >
                    {t("sign-in:actions.forgotPassword")}
                  </LinkItem>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <FormActions />

                  {IS_SIGN_UP_ENABLED && (
                    <Box ml={1} component="span">
                      <Button
                        variant="contained"
                        color="inherit"
                        LinkComponent={Link}
                        href="/sign-up"
                        data-testid="create-account"
                      >
                        {t("sign-in:actions.createAccount")}
                      </Button>
                    </Box>
                  )}
                </Grid>
              </>
            )}
            {[isGoogleAuthEnabled, isFacebookAuthEnabled].some(Boolean) && (
              <Grid size={{ xs: 12 }}>
                <Divider sx={{ mb: 2 }}>
                  {!isKeycloakAuthEnabled && <Chip label={t("sign-in:or")} />}
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

function SignIn() {
  return <Form />;
}

export default withPageRequiredGuest(SignIn);
