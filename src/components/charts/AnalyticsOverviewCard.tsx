"use client";

// @mui
import { Theme, useTheme } from "@mui/material/styles";
import Grid from "@mui/material/Grid";

// @project
import OverviewCard from "@/components/cards/OverviewCard";
import { getRadiusStyles } from "@/utils/getRadiusStyles";

// @assets
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EnergySavingsLeafIcon from "@mui/icons-material/EnergySavingsLeaf";
import WarningIcon from "@mui/icons-material/Warning";
/***************************  CARDS - BORDER WITH RADIUS  ***************************/

export function applyBorderWithRadius(radius: number, theme: Theme) {
  return {
    overflow: "hidden",
    "--Grid-borderWidth": "1px",
    borderTop: "var(--Grid-borderWidth) solid",
    borderLeft: "var(--Grid-borderWidth) solid",
    borderColor: "divider",
    "& > div": {
      overflow: "hidden",
      borderRight: "var(--Grid-borderWidth) solid",
      borderBottom: "var(--Grid-borderWidth) solid",
      borderColor: "divider",
      [theme.breakpoints.down("md")]: {
        "&:nth-of-type(1)": getRadiusStyles(radius, "topLeft"),
        "&:nth-of-type(2)": getRadiusStyles(radius, "topRight"),
        "&:nth-of-type(3)": getRadiusStyles(radius, "bottomLeft"),
        "&:nth-of-type(4)": getRadiusStyles(radius, "bottomRight"),
      },
      [theme.breakpoints.up("md")]: {
        "&:first-of-type": getRadiusStyles(radius, "topLeft", "bottomLeft"),
        "&:last-of-type": getRadiusStyles(radius, "topRight", "bottomRight"),
      },
    },
  };
}

/***************************   OVERVIEW CARD -DATA  ***************************/

const overviewAnalytics = [
  /*   {
    title: "New Listings",
    value: "1,876",
    compare: "vs. last week",
    chip: {
      label: "18.2%",
      color: "success",
      avatar: <ArrowUpwardIcon />,
    },
  }, */
  {
    title: "Scheduled Pickups",
    value: "3,450",
    compare: "vs. previous month",
    chip: {
      label: "12.5%",
      color: "success",
      avatar: <ArrowUpwardIcon />,
    },
  },
  /*  {
    title: "Completed Transactions",
    value: "2,789",
    compare: "vs. last week",
    chip: {
      label: "4.3%",
      color: "error",
      avatar: <ArrowDownwardIcon />,
    },
  },
  {
    title: "Active Users",
    value: "4,687",
    compare: "vs. last month",
    chip: {
      label: "22.1%",
      color: "success",
      avatar: <ArrowUpwardIcon />,
    },
  }, */
  {
    title: "Waste Diverted (tons)",
    value: "2,345",
    compare: "Monthly target progress",
    chip: {
      label: "78%",
      color: "success",
      avatar: <CheckCircleIcon />,
    },
  },
  {
    title: "Carbon Offset (kg CO₂)",
    value: "1.2M",
    compare: "Equivalent to 25k trees planted",
    chip: {
      label: "34%↑",
      color: "success",
      avatar: <EnergySavingsLeafIcon />,
    },
  },
  {
    title: "Pending Disputes",
    value: "45",
    compare: "Need resolution",
    chip: {
      label: "+5 New",
      color: "warning",
      avatar: <WarningIcon />,
    },
  },
  /* {
    title: "Support Tickets",
    value: "89",
    compare: "vs. last week",
    chip: {
      label: "15%",
      color: "error",
      avatar: <ArrowDownwardIcon />,
    },
  }, */
];

/***************************   OVERVIEW - CARDS  ***************************/

export default function AnalyticsOverviewCard() {
  const theme = useTheme();

  return (
    <Grid
      container
      sx={{
        borderRadius: 4,
        /* boxShadow: theme.customShadows.section, */ ...applyBorderWithRadius(
          16,
          theme
        ),
      }}
    >
      {overviewAnalytics.map((item, index) => (
        <Grid key={index} size={{ xs: 6, sm: 6, md: 3 }}>
          <OverviewCard
            {...{
              ...item,
              cardProps: {
                sx: { border: "none", borderRadius: 0, boxShadow: "none" },
              },
            }}
          />
        </Grid>
      ))}
    </Grid>
  );
}
