"use client";

// Core React and Next imports
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";

import { useTranslation } from "@/services/i18n/client";
import Typography from "@mui/material/Typography";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";

/**
 * Main form component for customer creation
 */
function FormCreatecustomer() {
  const { t } = useTranslation("admin-panel-customers-create");
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t("admin-panel-customers-create:title")}
      </Typography>
      <Paper elevation={3} sx={{ p: 4 }}></Paper>
    </Container>
  );
}

/**
 * Main component for customer creation page
 */
function Createcustomer() {
  return <FormCreatecustomer />;
}

// Export with authentication requirement
export default withPageRequiredAuth(Createcustomer);
