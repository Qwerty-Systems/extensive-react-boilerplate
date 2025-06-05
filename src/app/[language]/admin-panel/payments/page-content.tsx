"use client";

import { RoleEnum } from "@/services/api/types/role";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

function Xs() {
  return (
    <Container maxWidth="xl">
      <Grid container spacing={3} pt={3}>
        <Grid size={{ xs: 12 }} mb={2}>
          <Typography variant="h4" component="h1">
            Payments Page
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
}

export default withPageRequiredAuth(Xs, { roles: [RoleEnum.ADMIN] });
