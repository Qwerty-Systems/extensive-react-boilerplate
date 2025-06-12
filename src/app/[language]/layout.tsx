import ResponsiveAppBar from "@/components/app-bar";
import AuthProvider from "@/services/auth/auth-provider";
import "../globals.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import CssBaseline from "@mui/material/CssBaseline";
import { dir } from "i18next";
import "@/services/i18n/config";
import { languages } from "@/services/i18n/config";
import type { Metadata } from "next";
import ToastContainer from "@/components/snackbar-provider";
import { getServerTranslation } from "@/services/i18n";
import StoreLanguageProvider from "@/services/i18n/store-language-provider";
import ThemeProvider from "@/components/theme/theme-provider";
import LeavePageProvider from "@/services/leave-page/leave-page-provider";
import QueryClientProvider from "@/services/react-query/query-client-provider";
import queryClient from "@/services/react-query/query-client";
import ReactQueryDevtools from "@/services/react-query/react-query-devtools";
import GoogleAuthProvider from "@/services/social-auth/google/google-auth-provider";
import FacebookAuthProvider from "@/services/social-auth/facebook/facebook-auth-provider";
import ConfirmDialogProvider from "@/components/confirm-dialog/confirm-dialog-provider";
import InitColorSchemeScript from "@/components/theme/init-color-scheme-script";
// import KeycloakProvider from "@/services/social-auth/keycloak/keycloak-provider";
import ClientProviders from "../../services/locale/locale-provider";
import TenantProvider from "../../services/tenant/tenant-context";
import ConfigProvider from "@/contexts/ConfigContext";
// Client-side providers wrapper
const AuthProviders = ({ children }: { children: React.ReactNode }) => (
  // <KeycloakProvider>
  <AuthProvider>
    <GoogleAuthProvider>
      <FacebookAuthProvider>
        <LeavePageProvider>{children}</LeavePageProvider>
      </FacebookAuthProvider>
    </GoogleAuthProvider>
  </AuthProvider>
  // </KeycloakProvider>
);

type Props = {
  params: Promise<{ language: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { t } = await getServerTranslation(params.language, "common");

  return {
    title: t("title"),
  };
}

export function generateStaticParams() {
  return languages.map((language) => ({ language }));
}

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ language: string }>;
}) {
  const params = await props.params;
  const { language } = params;
  const { children } = props;
  // const { isLoading } = useAuth();

  // if (isLoading)
  //   return (
  //     <AppSkeleton
  //       primaryCount={6}
  //       secondaryCount={1}
  //       topbarCount={3}
  //       itemSize={36}
  //     />
  //   );
  return (
    <html lang={language} dir={dir(language)} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <InitColorSchemeScript />
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} />
          <ConfigProvider>
            <ThemeProvider>
              <CssBaseline />
              <StoreLanguageProvider>
                <ConfirmDialogProvider>
                  <AuthProviders>
                    <TenantProvider>
                      <ResponsiveAppBar />
                      <ClientProviders>{children}</ClientProviders>
                      <ToastContainer position="bottom-left" hideProgressBar />
                    </TenantProvider>
                  </AuthProviders>
                </ConfirmDialogProvider>
              </StoreLanguageProvider>
            </ThemeProvider>
          </ConfigProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
