"use client";

import useConfig from "@/hooks/useConfig";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
  responsiveFontSizes,
} from "@mui/material/styles";
import { useMemo, PropsWithChildren } from "react";
import palette from "./palette";
import typography from "./typography";
import Shadows from "./shadow";
import CssBaseline from "@mui/material/CssBaseline";

import componentsOverride from "./overrides";
// function ThemeProvider(props: PropsWithChildren<{}>) {
//   const theme = useMemo(
//     () =>
//       createTheme({
//         cssVariables: {
//           colorSchemeSelector: "class",
//         },
//         colorSchemes: { light: true, dark: true },
//       }),
//     []
//   );

//   return <MuiThemeProvider theme={theme}>{props.children}</MuiThemeProvider>;
// }

function ThemeProvider({ children }: PropsWithChildren<{}>) {
  const { mode, themeDirection } = useConfig();

  const themePalette = useMemo(() => palette(mode), [mode]);

  let theme = createTheme({
    cssVariables: {
      colorSchemeSelector: "class",
    },
    colorSchemes: { light: true, dark: true },
    breakpoints: {
      values: {
        xs: 0,
        sm: 768,
        md: 1024,
        lg: 1266,
        xl: 1440,
      },
    },
    direction: themeDirection,
    palette: themePalette,
    shape: {
      borderRadius: 8,
    },
    transitions: {
      duration: {
        short: 250,
        standard: 300,
        complex: 375,
      },
    },
    customShadows: {},
  });

  // Add typography and responsive fonts
  theme = createTheme(theme, {
    typography: typography(theme),
    components: componentsOverride(theme),
    customShadows: Shadows(theme),
  });

  // Enable responsive font sizes
  theme = responsiveFontSizes(theme);
  theme.components = componentsOverride(theme);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      {children}
    </MuiThemeProvider>
  );
}

export default ThemeProvider;
