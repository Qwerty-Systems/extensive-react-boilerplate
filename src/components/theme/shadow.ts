// @mui
import { alpha } from "@mui/material/styles";

/***************************  DEFAULT THEME - SHADOWS  ***************************/

export default function Shadows(theme: any) {
  const shadowColor = theme.palette.text.primary;
  const primaryColor = theme.palette.primary.main;

  return {
    button: `0px 0.711px 1.422px 0px ${alpha(shadowColor, 0.05)}`,
    section: `0px 1px 2px 0px ${alpha(shadowColor, 0.07)}`,
    tooltip: `0px 12px 16px -4px ${alpha(shadowColor, 0.08)}, 0px 4px 6px -2px ${alpha(shadowColor, 0.03)}`,
    focus: `0px 0px 0px 3px ${alpha(primaryColor, 0.2)}`,
  };
}

// // @mui
// import { alpha } from "@mui/material/styles";

// /***************************  DEFAULT THEME - SHADOWS  ***************************/

// export default function Shadows(theme: any) {
//   const shadowColor = theme.palette.text.primary;
//   // const primaryColor = theme.palette.primary.main;
//   const actionColor = theme.palette.action.main;
//   const ecoColor = theme.palette.primary.main;

//   return {
//     button: `0px 1px 2px 0px ${alpha(shadowColor, 0.1)}`,
//     card: `0px 4px 8px ${alpha(shadowColor, 0.08)}`,
//     navbar: `0px 2px 10px ${alpha(shadowColor, 0.05)}`,
//     ecoCard: `0px 4px 12px ${alpha(ecoColor, 0.2)}`,
//     actionButton: `0px 4px 6px ${alpha(actionColor, 0.2)}`,
//     focus: `0px 0px 0px 3px ${alpha(actionColor, 0.3)}`,
//     depth: `0px 8px 24px ${alpha(shadowColor, 0.15)}`,
//   };
// }
