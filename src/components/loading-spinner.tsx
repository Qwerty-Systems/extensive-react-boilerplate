// components/loading-spinner.tsx
"use client";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  size?: number;
  color?: "primary" | "secondary" | "inherit";
}

export default function LoadingSpinner({
  fullScreen = false,
  size = 40,
  color = "primary",
}: LoadingSpinnerProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        ...(fullScreen && { minHeight: "100vh" }),
      }}
    >
      <CircularProgress size={size} color={color} />
    </Box>
  );
}
