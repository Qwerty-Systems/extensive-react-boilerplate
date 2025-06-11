// // // @mui
// import { alpha } from "@mui/material/styles";

// /***************************  DEFAULT - PALETTE  ***************************/

// export default function palette(mode: "light" | "dark") {
//   // Brand colors
//   const lizardGreen = "#B1EA37"; // Primary
//   const deepGreen = "#008037"; // Secondary
//   const earthBeige = "#D9C7A1"; // Tertiary/Accent
//   const boldBlack = "#000000"; // Text/Contrast

//   const isLight = mode === "light";

//   // Common colors
//   /*  const common = {
//     brand: {
//       lizardGreen,
//       deepGreen,
//       earthBeige,
//       boldBlack,
//     },
//   }; */

//   // Light/dark specific colors
//   const light = {
//     text: {
//       primary: boldBlack,
//       secondary: "#4A4A4A",
//       disabled: "#757575",
//     },
//     background: {
//       default: "#FFFFFF",
//       paper: "#F9F9F9",
//       neutral: earthBeige,
//     },
//     divider: alpha(boldBlack, 0.12),
//     action: {
//       hover: alpha(lizardGreen, 0.08),
//       selected: alpha(deepGreen, 0.16),
//       disabled: alpha(boldBlack, 0.26),
//       disabledBackground: alpha(boldBlack, 0.12),
//     },
//   };

//   const dark = {
//     text: {
//       primary: "#FFFFFF",
//       secondary: earthBeige,
//       disabled: "#9E9E9E",
//     },
//     background: {
//       default: "#121212",
//       paper: "#1E1E1E",
//       neutral: "#2B2B2B",
//     },
//     divider: alpha(earthBeige, 0.24),
//     action: {
//       hover: alpha(lizardGreen, 0.16),
//       selected: alpha(deepGreen, 0.32),
//       disabled: alpha(earthBeige, 0.38),
//       disabledBackground: alpha(earthBeige, 0.16),
//     },
//   };

//   return {
//     mode,
//     /*  common, */
//     primary: {
//       main: isLight ? lizardGreen : "#C8FF5A",
//       light: isLight ? "#D9F2B3" : "#E0FF8C",
//       dark: isLight ? "#8EB82B" : "#95CC2B",
//       contrastText: isLight ? boldBlack : "#000000",
//     },
//     secondary: {
//       main: isLight ? deepGreen : "#00994D",
//       light: isLight ? "#99C9A8" : "#4CDB8F",
//       dark: isLight ? "#006029" : "#004D26",
//       contrastText: "#FFFFFF",
//     },
//     tertiary: {
//       main: earthBeige,
//       light: isLight ? "#EEE6D8" : "#C5B89E",
//       dark: isLight ? "#B8A98A" : "#94876D",
//       contrastText: isLight ? boldBlack : "#FFFFFF",
//     },
//     error: {
//       main: "#D32F2F",
//       light: "#FF6666",
//       dark: "#9A0000",
//       contrastText: "#FFFFFF",
//     },
//     warning: {
//       main: "#F57C00",
//       light: "#FFB74D",
//       dark: "#E65100",
//       contrastText: isLight ? boldBlack : "#FFFFFF",
//     },
//     success: {
//       main: "#4CAF50",
//       light: "#81C784",
//       dark: "#388E3C",
//       contrastText: isLight ? boldBlack : "#FFFFFF",
//     },
//     info: {
//       main: "#0297D5",
//       light: "#4FC3F7",
//       dark: "#01579B",
//       contrastText: "#FFFFFF",
//     },
//     grey: {
//       50: isLight ? "#FAFAFA" : "#2B2B2B",
//       100: isLight ? "#F5F5F5" : "#3D3D3D",
//       200: isLight ? "#EEEEEE" : "#4F4F4F",
//       300: isLight ? earthBeige : "#616161",
//       400: isLight ? "#BDBDBD" : "#757575",
//       500: isLight ? "#9E9E9E" : "#9E9E9E",
//       600: isLight ? "#757575" : "#BDBDBD",
//       700: isLight ? "#616161" : earthBeige,
//       800: isLight ? "#424242" : "#EEEEEE",
//       900: isLight ? boldBlack : "#F5F5F5",
//     },
//     ...(isLight ? light : dark),
//   } as const;
// }
// @mui
import { alpha } from "@mui/material/styles";

/***************************  RECYCLING PLATFORM PALETTE  ***************************/

export default function palette(mode: "light" | "dark") {
  // Brand colors from guide
  const deepGreen = "#008037"; // Main Brand Green
  const warmYellow = "#FFC107"; // Secondary Accent
  const skyBlue = "#0099CC"; // Call-to-Action
  const charcoalGray = "#333333"; // Neutral Dark
  const lightGray = "#F2F2F2"; // Neutral Light

  const isLight = mode === "light";

  // Common colors
  const brandColors = {
    deepGreen,
    warmYellow,
    skyBlue,
    charcoalGray,
    lightGray,
  };

  // Light/dark specific colors
  const light = {
    text: {
      primary: charcoalGray,
      secondary: alpha(charcoalGray, 0.75),
      disabled: alpha(charcoalGray, 0.38),
    },
    background: {
      default: lightGray,
      paper: "#FFFFFF",
      neutral: "#F8F8F8",
    },
    divider: alpha(charcoalGray, 0.12),
    action: {
      active: deepGreen,
      hover: alpha(deepGreen, 0.08),
      selected: alpha(skyBlue, 0.16),
      disabled: alpha(charcoalGray, 0.26),
      disabledBackground: alpha(charcoalGray, 0.12),
      focus: alpha(skyBlue, 0.24),
    },
    status: {
      eco: deepGreen,
      warning: warmYellow,
      error: "#E53935",
    },
  };

  const dark = {
    text: {
      primary: "#FFFFFF",
      secondary: alpha("#FFFFFF", 0.7),
      disabled: alpha("#FFFFFF", 0.38),
    },
    background: {
      default: "#121212",
      paper: charcoalGray,
      neutral: alpha(charcoalGray, 0.8),
    },
    divider: alpha("#FFFFFF", 0.12),
    action: {
      active: skyBlue,
      hover: alpha(skyBlue, 0.16),
      selected: alpha(deepGreen, 0.32),
      disabled: alpha("#FFFFFF", 0.26),
      disabledBackground: alpha("#FFFFFF", 0.12),
      focus: alpha(warmYellow, 0.24),
    },
    status: {
      eco: "#4CAF50",
      warning: warmYellow,
      error: "#EF5350",
    },
  };

  return {
    mode,
    brand: brandColors,
    primary: {
      main: deepGreen,
      light: "#33995c",
      dark: "#005624",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: warmYellow,
      light: "#FFD54F",
      dark: "#FF8F00",
      contrastText: charcoalGray,
    },
    // action: {
    //   main: skyBlue,
    //   light: "#4FC3F7",
    //   dark: "#0288D1",
    //   contrastText: "#FFFFFF",
    // },
    error: {
      main: "#E53935",
      light: "#FF6666",
      dark: "#B71C1C",
      contrastText: "#FFFFFF",
    },
    warning: {
      main: warmYellow,
      light: "#FFD54F",
      dark: "#FF8F00",
      contrastText: charcoalGray,
    },
    success: {
      main: deepGreen,
      light: "#4CAF50",
      dark: "#2E7D32",
      contrastText: "#FFFFFF",
    },
    info: {
      main: skyBlue,
      light: "#4FC3F7",
      dark: "#0288D1",
      contrastText: "#FFFFFF",
    },
    grey: {
      50: isLight ? "#FFFFFF" : "#1E1E1E",
      100: isLight ? lightGray : "#2B2B2B",
      200: isLight ? "#E6E6E6" : "#3D3D3D",
      300: isLight ? "#CCCCCC" : "#4F4F4F",
      400: isLight ? "#B3B3B3" : "#707070",
      500: isLight ? "#999999" : "#9E9E9E",
      600: isLight ? "#707070" : "#B3B3B3",
      700: isLight ? "#4F4F4F" : "#CCCCCC",
      800: isLight ? "#3D3D3D" : "#E6E6E6",
      900: isLight ? charcoalGray : "#FFFFFF",
    },
    ...(isLight ? light : dark),
    // Recycling-specific status colors
    recycle: {
      paper: "#2196F3",
      plastic: "#FF9800",
      glass: "#4CAF50",
      metal: "#9E9E9E",
      organic: deepGreen,
      ewaste: "#9C27B0",
    },
  } as const;
}
