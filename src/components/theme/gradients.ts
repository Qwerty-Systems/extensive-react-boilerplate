// gradients.ts

// eslint-disable-next-line no-restricted-imports
import { alpha } from "@mui/material";

/*************************** THEME GRADIENTS ***************************/
export default function gradients(theme: any) {
  const primaryMain = theme.palette.primary.main;
  const primaryDark = theme.palette.primary.dark;

  // Different gradients for different theme modes
  if (theme.palette.mode === "dark") {
    return {
      hero: `linear-gradient(135deg, #003d1a 0%, #005c24 100%)`,
      features: `linear-gradient(135deg, #002211 0%, #003d1a 50%, #005c24 100%)`,
      cardHover: `linear-gradient(135deg, ${alpha(primaryMain, 0.8)} 0%, ${alpha(primaryDark, 0.8)} 100%)`,
    };
  }

  if (theme.palette.mode === "admin") {
    return {
      hero: `linear-gradient(135deg, #1a237e 0%, #283593 100%)`,
      features: `linear-gradient(135deg, #0d47a1 0%, #1976d2 100%)`,
      cardHover: `linear-gradient(135deg, ${alpha(primaryMain, 0.8)} 0%, ${alpha("#7b1fa2", 0.8)} 100%)`,
    };
  }

  if (theme.palette.mode === "marketplace") {
    return {
      hero: `linear-gradient(135deg, #00c853 0%, #00e676 100%)`,
      features: `linear-gradient(135deg, #00b248 0%, #00c853 100%)`,
      cardHover: `linear-gradient(135deg, ${alpha(primaryMain, 0.8)} 0%, ${alpha("#ff6d00", 0.8)} 100%)`,
    };
  }

  // Default light mode gradients
  return {
    hero: `linear-gradient(135deg, ${primaryMain} 0%, ${primaryDark} 100%)`,
    features: `linear-gradient(135deg, #003d1a 0%, #005c24 50%, ${primaryMain} 100%)`,
    cardHover: `linear-gradient(135deg, ${alpha(primaryMain, 0.8)} 0%, ${alpha(theme.palette.secondary.main, 0.8)} 100%)`,
  };
}
