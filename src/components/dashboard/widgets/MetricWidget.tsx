// File: src/components/dashboard/widgets/MetricWidget.tsx
import React from "react";

import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function MetricWidget({}: { config: any }) {
  // In real app, this would come from API based on config
  const data = {
    value: "1,876",
    label: "New Listings",
    change: "18.2%",
    positive: true,
  };

  return (
    <Box sx={{ textAlign: "center" }}>
      <Typography variant="h3">{data.value}</Typography>
      <Typography variant="subtitle1" color="textSecondary">
        {data.label}
      </Typography>
      <Box
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <ArrowUpwardIcon color={data.positive ? "success" : "error"} />
        <Typography
          variant="body2"
          color={data.positive ? "success.main" : "error.main"}
        >
          {data.change}
        </Typography>
      </Box>
    </Box>
  );
}
