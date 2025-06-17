"use client";

import { useTranslation } from "@/services/i18n/client";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { TrendingUp, Group, PersonAdd } from "@mui/icons-material";

export default function AuditLogHeader() {
  const { t } = useTranslation("admin-panel-auditLogs");

  // Mock stats data - in real app, fetch from API
  const stats = {
    total: 1248,
    active: 1183,
    newThisMonth: 65,
  };

  const statItems = [
    {
      label: t("stats.total"),
      value: stats.total,
      icon: <Group color="primary" />,
    },
    {
      label: t("stats.active"),
      value: stats.active,
      icon: <TrendingUp color="success" />,
    },
    {
      label: t("stats.new"),
      value: stats.newThisMonth,
      icon: <PersonAdd color="info" />,
    },
  ];

  return (
    <Grid container spacing={3} alignItems="center" sx={{ pb: 2 }}>
      <Grid sx={{ xs: 12, md: 6 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t("title")}
        </Typography>
      </Grid>

      <Grid sx={{ xs: 12, md: 6 }}>
        <Box
          display="flex"
          justifyContent={{ xs: "flex-start", md: "flex-end" }}
        >
          <Button variant="contained" color="success">
            {t("actions.create")}
          </Button>
        </Box>
      </Grid>

      <Grid sx={{ xs: 12 }}>
        <Grid container spacing={2}>
          {statItems.map((item, index) => (
            <Grid sx={{ xs: 12, sm: 4 }} key={index}>
              <Paper
                elevation={2}
                sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}
              >
                {item.icon}
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    {item.label}
                  </Typography>
                  <Typography variant="h6">{item.value}</Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
}
