"use client";

import Dashboard from "@/components/dashboard/Dashboard";
import { RoleEnum } from "@/services/api/types/role";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";

function DashboardPanel() {
  return (
    // <Container>
    //   <Grid container spacing={{ xs: 2, md: 3 }}>
    //     <Grid size={12}>
    //       <AnalyticsOverviewCard />
    //     </Grid>
    //     <Grid size={12}>
    //       <AnalyticsOverviewChart />
    //     </Grid>
    //   </Grid>
    // </Container>
    <Dashboard />
  );
}

export default withPageRequiredAuth(DashboardPanel, {
  roles: [RoleEnum.ADMIN, RoleEnum.PLATFORM_OWNER],
});
