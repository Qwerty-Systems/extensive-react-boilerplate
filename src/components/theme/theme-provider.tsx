"use client";

import useConfig from "@/hooks/useConfig";
import {
  createTheme,
  Direction,
  ThemeProvider as MuiThemeProvider,
  PaletteMode,
  responsiveFontSizes,
} from "@mui/material/styles";
import { useMemo, PropsWithChildren } from "react";
import palette from "./palette";
import typography from "./typography";
import Shadows from "./shadow";
import CssBaseline from "@mui/material/CssBaseline";

import componentsOverride from "./overrides";
import gradients from "./gradients";
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
  const { mode, themeDirection, interfaceType } = useConfig();
  // Validate and fallback to safe values
  const validatedMode: PaletteMode = mode === "dark" ? "dark" : "light";
  const validatedDirection: Direction =
    themeDirection === "rtl" ? "rtl" : "ltr";

  // Create base theme with validated types
  const themePalette = useMemo(
    () =>
      palette({
        mode: validatedMode,
        interfaceType,
      }),
    [validatedMode, interfaceType]
  );

  // Create base theme without custom properties
  const baseTheme = useMemo(
    () =>
      createTheme({
        breakpoints: {
          values: {
            xs: 0,
            sm: 768,
            md: 1024,
            lg: 1266,
            xl: 1440,
          },
        },
        direction: validatedDirection,
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
        zIndex: {
          appBar: 1200,
          drawer: 1100,
          modal: 1300,
          tooltip: 1500,
        },
      }),
    [validatedDirection, themePalette]
  );

  // Step 2: Compute derived theme properties
  const customShadows = useMemo(() => Shadows(baseTheme), [baseTheme]);
  const themeGradients = useMemo(() => gradients(baseTheme), [baseTheme]);

  // Step 3: Create complete theme with all properties
  let theme = useMemo(
    () =>
      createTheme(baseTheme, {
        typography: typography(baseTheme),
        customShadows,
        gradients: themeGradients,
      }),
    [baseTheme, customShadows, themeGradients]
  );

  // Step 4: Apply component overrides
  theme = useMemo(() => {
    theme.components = componentsOverride(theme);
    return responsiveFontSizes(theme);
  }, [theme]);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      {children}
    </MuiThemeProvider>
  );
}

export default ThemeProvider;
