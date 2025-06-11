// components/unauthorized-screen.tsx
"use client";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import useLanguage from "@/services/i18n/use-language";
import LockPersonIcon from "@mui/icons-material/LockPerson";

export default function UnauthorizedScreen() {
  const language = useLanguage();

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
      <LockPersonIcon sx={{ fontSize: 80, mb: 2, color: "error.main" }} />
      <Typography variant="h4" gutterBottom>
        Access Denied
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        You don&apos;t have permission to view this page. Please contact the
        administrator if you believe this is an error.
      </Typography>
      <Button variant="contained" href={`/${language}`} size="large">
        Return to Home
      </Button>
    </Box>
  );
}
