// @project
import { FONT_ARCHIVO } from "@/config";

/***************************  RECYCLING THEME - TYPOGRAPHY  ***************************/

export default function typography(_theme: any) {
  return {
    fontFamily: FONT_ARCHIVO,
    letterSpacing: 0,
    button: {
      textTransform: "none",
      fontWeight: 600,
      letterSpacing: 0.5,
    },

    // Recycling headers
    h1: {
      fontWeight: 700,
      fontSize: 48,
      lineHeight: 1.2,
      letterSpacing: -0.5,
    },
    h2: {
      fontWeight: 700,
      fontSize: 36,
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 600,
      fontSize: 28,
      lineHeight: 1.4,
    },
    h4: {
      fontWeight: 600,
      fontSize: 24,
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: 20,
      lineHeight: 1.5,
    },
    h6: {
      fontWeight: 600,
      fontSize: 18,
      lineHeight: 1.5,
    },

    // Subtitles
    subtitle1: {
      fontWeight: 500,
      fontSize: 16,
      lineHeight: 1.6,
      color: "text.secondary",
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: 14,
      lineHeight: 1.6,
      color: "text.secondary",
    },

    // Body text
    body1: {
      fontWeight: 400,
      fontSize: 16,
      lineHeight: 1.6,
    },
    body2: {
      fontWeight: 400,
      fontSize: 14,
      lineHeight: 1.6,
    },

    // Captions
    caption: {
      fontWeight: 400,
      fontSize: 12,
      lineHeight: 1.5,
    },
    captionBold: {
      fontWeight: 600,
      fontSize: 12,
      lineHeight: 1.5,
    },

    // Special recycling components
    ecoBadge: {
      fontWeight: 700,
      fontSize: 10,
      lineHeight: 1.2,
      textTransform: "uppercase",
      letterSpacing: 0.8,
    },
    recycleLabel: {
      fontWeight: 600,
      fontSize: 13,
      lineHeight: 1.4,
    },
  };
}
