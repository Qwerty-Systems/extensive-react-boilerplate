// components/error-fallback.tsx
"use client";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export default function ErrorFallback({
  error,
  resetErrorBoundary,
}: ErrorFallbackProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        textAlign: "center",
        p: 3,
      }}
    >
      <ReportGmailerrorredIcon
        sx={{ fontSize: 80, mb: 2, color: "error.main" }}
      />
      <Typography variant="h4" gutterBottom>
        Something Went Wrong
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        {error.message}
      </Typography>
      <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
        <Button
          variant="contained"
          onClick={resetErrorBoundary}
          color="primary"
        >
          Try Again
        </Button>
        <Button variant="outlined" href="/" color="secondary">
          Return Home
        </Button>
      </Box>
    </Box>
  );
}
