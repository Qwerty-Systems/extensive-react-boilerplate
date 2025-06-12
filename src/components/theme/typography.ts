import { FONT_ARCHIVO } from "@/config";

/*************************** THEME TYPOGRAPHY ***************************/
export default function typography(_theme: any) {
  return {
    fontFamily: FONT_ARCHIVO,
    letterSpacing: 0,
    button: {
      textTransform: "none",
      fontWeight: 600,
      letterSpacing: 0.5,
    },
    h1: {
      fontWeight: 700,
      fontSize: "3rem", // 48px
      lineHeight: 1.2,
      letterSpacing: -0.5,
      "@media (min-width:600px)": {
        fontSize: "4rem", // Responsive sizing
      },
    },
    h2: {
      fontWeight: 700,
      fontSize: "2.25rem", // 36px
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.75rem", // 28px
      lineHeight: 1.4,
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.5rem", // 24px
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.25rem", // 20px
      lineHeight: 1.5,
    },
    h6: {
      fontWeight: 600,
      fontSize: "1.125rem", // 18px
      lineHeight: 1.5,
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: "1rem", // 16px
      lineHeight: 1.6,
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: "0.875rem", // 14px
      lineHeight: 1.6,
    },
    body1: {
      fontWeight: 400,
      fontSize: "1rem", // 16px
      lineHeight: 1.6,
    },
    body2: {
      fontWeight: 400,
      fontSize: "0.875rem", // 14px
      lineHeight: 1.6,
    },
    caption: {
      fontWeight: 400,
      fontSize: "0.75rem", // 12px
      lineHeight: 1.5,
    },
    overline: {
      fontWeight: 600,
      fontSize: "0.75rem", // 12px
      lineHeight: 1.5,
      textTransform: "uppercase",
    },
    // Special components
    ecoBadge: {
      fontWeight: 700,
      fontSize: "0.625rem", // 10px
      lineHeight: 1.2,
      textTransform: "uppercase",
      letterSpacing: 0.8,
    },
    recycleLabel: {
      fontWeight: 600,
      fontSize: "0.8125rem", // 13px
      lineHeight: 1.4,
    },
  };
}
