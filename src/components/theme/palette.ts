import { alpha, PaletteMode } from "@mui/material/styles";

export type InterfaceType = "default" | "landing" | "portal" | "marketplace";

interface PaletteOptions {
  mode: PaletteMode;
  interfaceType?: InterfaceType;
}

export default function palette(options: PaletteOptions) {
  const { mode, interfaceType = "default" } = options;

  // Base brand colors
  const baseColors = {
    deepGreen: "#008037",
    warmYellow: "#FFC107",
    skyBlue: "#0099CC",
    charcoalGray: "#333333",
    lightGray: "#F2F2F2",
  };

  // Recycling categories
  const recycleColors = {
    paper: "#2196F3",
    plastic: "#FF9800",
    glass: "#4CAF50",
    metal: "#9E9E9E",
    organic: "#008037",
    ewaste: "#9C27B0",
  };

  // Interface-specific palette bases
  const interfacePalettes = {
    default: {
      primary: baseColors.deepGreen,
      secondary: baseColors.warmYellow,
      action: baseColors.skyBlue,
    },
    landing: {
      primary: "#1A237E",
      secondary: "#FF4081",
      action: "#00BCD4",
    },
    portal: {
      primary: "#3F51B5",
      secondary: "#FF9800",
      action: "#4CAF50",
    },
    marketplace: {
      primary: "#00C853",
      secondary: "#FF6D00",
      action: "#2962FF",
    },
  };

  // Get base colors for current interface
  const interfaceBase = interfaceType
    ? interfacePalettes[interfaceType]
    : interfacePalettes.default;
  const light_config = {
    mode: "light",
    brand: baseColors,
    recycle: recycleColors,
    landing: {
      main: "#008037",
      light: "#00a044",
      dark: "#003d1a",
      contrastText: "#FFFFFF",
      sections: {
        hero: {
          gradientFrom: "#008037",
          gradientTo: "#00a044",
          text: "#FFFFFF",
        },
        features: {
          background: "#F8F8F8",
          cardBackgroundFrom: "#E0F2E9",
          cardBackgroundTo: "#C5EBD6",
          text: "#333333",
          cardTitle: "#FFC107",
        },
        about: {
          gradientFrom: "#008037",
          gradientTo: "#00a044",
          text: "#FFFFFF",
        },
        partners: {
          background: "#E8F5E9",
          text: "#003d1a",
          highlight: "#FFC107",
        },
        footer: {
          background: "#F2F2F2",
          sectionBackground: "#FFFFFF",
          text: "#333333",
          border: "rgba(0, 128, 55, 0.1)",
          accent: "#FFC107",
        },
        buttons: {
          background: "linear-gradient(45deg, #FFC107, #ffb300)",
          text: "#003d1a",
          hoverShadow: "0 20px 40px rgba(255,193,7,0.6)",
        },
      },
    },
    landingGradient: {
      from: "#008037",
      to: "#00a044",
    },
    primary: {
      main: interfaceBase.primary,
      light: alpha(interfaceBase.primary, 0.8),
      dark: alpha(interfaceBase.primary, 0.9),
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: interfaceBase.secondary,
      light: alpha(interfaceBase.secondary, 0.8),
      dark: alpha(interfaceBase.secondary, 0.9),
      contrastText: baseColors.charcoalGray,
    },
    action: {
      main: interfaceBase.action,
      light: alpha(interfaceBase.action, 0.8),
      dark: alpha(interfaceBase.action, 0.9),
      contrastText: "#FFFFFF",
    },
    background: {
      default: baseColors.lightGray,
      paper: "#FFFFFF",
      neutral: "#F8F8F8",
    },
    text: {
      primary: baseColors.charcoalGray,
      secondary: alpha(baseColors.charcoalGray, 0.75),
      disabled: alpha(baseColors.charcoalGray, 0.38),
    },
  };

  const dark_config = {
    mode: "dark",
    brand: baseColors,
    recycle: recycleColors,
    landing: {
      main: "#008037",
      light: "#00a044",
      dark: "#003d1a",
      contrastText: "#FFFFFF",
      sections: {
        hero: {
          gradientFrom: "#003d1a",
          gradientTo: "#005c24",
          text: "#FFFFFF",
        },
        features: {
          background: "#003d1a",
          cardBackgroundFrom: "#005c24",
          cardBackgroundTo: "#008037",
          text: "#FFFFFF",
          cardTitle: "#FFC107",
        },
        about: {
          gradientFrom: "#00411b",
          gradientTo: "#007430",
          text: "#FFFFFF",
        },
        partners: {
          background: "#005c24",
          text: "#FFFFFF",
          highlight: "#FFC107",
        },
        footer: {
          background: "#003d1a",
          sectionBackground: "#002e13",
          text: "rgba(255,255,255,0.8)",
          border: "rgba(255,193,7,0.2)",
          accent: "#FFC107",
        },
        buttons: {
          background: "linear-gradient(45deg, #FFC107, #ffb300)",
          text: "#003d1a",
          hoverShadow: "0 20px 40px rgba(255,193,7,0.8)",
        },
      },
    },
    landingGradient: {
      from: "#008037",
      to: "#005c24",
    },
    primary: {
      main: alpha(interfaceBase.primary, 0.8),
      light: alpha(interfaceBase.primary, 0.6),
      dark: alpha(interfaceBase.primary, 0.9),
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: alpha(interfaceBase.secondary, 0.8),
      light: alpha(interfaceBase.secondary, 0.6),
      dark: alpha(interfaceBase.secondary, 0.9),
      contrastText: "#FFFFFF",
    },
    action: {
      main: alpha(interfaceBase.action, 0.8),
      light: alpha(interfaceBase.action, 0.6),
      dark: alpha(interfaceBase.action, 0.9),
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#121212",
      paper: baseColors.charcoalGray,
      neutral: alpha(baseColors.charcoalGray, 0.8),
    },
    text: {
      primary: "#FFFFFF",
      secondary: alpha("#FFFFFF", 0.7),
      disabled: alpha("#FFFFFF", 0.38),
    },
  };

  // Light mode configuration
  if (mode === "dark") {
    console.log("return dark", dark_config);
    return dark_config as PaletteOptions;
  }
  console.log("return light", light_config);
  return light_config as PaletteOptions;

  // Dark mode configuration
}
