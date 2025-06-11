"use client";

import { useTranslation } from "@/services/i18n/client";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";

export default function CustomerHeader() {
  const { t } = useTranslation("admin-panel-customers");

  // Mock stats data - in real app, fetch from API
  const stats = {
    total: 1248,
    active: 1183,
    newThisMonth: 65,
  };

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid sx={{ xs: 12, md: 4 }}>
        <Typography variant="h4" component="h1">
          {t("title")}
        </Typography>
      </Grid>

      <Grid sx={{ xs: 12, md: 8 }}>
        <Box display="flex" justifyContent="flex-end" gap={2} flexWrap="wrap">
          <Box display="flex" gap={1} alignItems="center">
            <Chip
              label={t("stats.total", { count: stats.total })}
              color="default"
              size="small"
            />
            <Chip
              label={t("stats.active", { count: stats.active })}
              color="success"
              size="small"
            />
            <Chip
              label={t("stats.new", { count: stats.newThisMonth })}
              color="info"
              size="small"
            />
          </Box>

          <Button variant="contained" color="success">
            {t("actions.create")}
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
}
