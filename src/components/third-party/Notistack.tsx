"use client";
// @mui
import { styled } from "@mui/material/styles";
import Fade from "@mui/material/Fade";
import Grow, { GrowProps } from "@mui/material/Grow";
import Slide, { SlideProps } from "@mui/material/Slide";
import Zoom, { ZoomProps } from "@mui/material/Zoom";

// @third-party
import { SnackbarProvider } from "notistack";

// @project
import { useGetSnackbar } from "@/states/snackbar";

import Loader from "@/components/Loader";
import { JSX } from "react";

// @mui/icons-material
import WarningAmberIcon from "@mui/icons-material/WarningAmber"; // replaces IconAlertTriangle
import BugReportIcon from "@mui/icons-material/BugReport"; // replaces IconBug
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // replaces IconChecks
import InfoIcon from "@mui/icons-material/Info"; // replaces IconInfoCircle
import CampaignIcon from "@mui/icons-material/Campaign";
// custom styles
const StyledSnackbarProvider = styled(SnackbarProvider)(({ theme }) => ({
  "&.notistack-MuiContent": {
    color: theme.palette.background.default,
  },
  "&.notistack-MuiContent-default": {
    backgroundColor: theme.palette.primary.main,
  },
  "&.notistack-MuiContent-error": {
    backgroundColor: theme.palette.error.main,
  },
  "&.notistack-MuiContent-success": {
    backgroundColor: theme.palette.success.main,
  },
  "&.notistack-MuiContent-info": {
    backgroundColor: theme.palette.info.main,
  },
  "&.notistack-MuiContent-warning": {
    backgroundColor: theme.palette.warning.main,
  },
  "& #notistack-snackbar": {
    gap: 8,
  },
}));

/***************************  SNACKBAR - ANIMATION  ***************************/

function TransitionSlideLeft(props: JSX.IntrinsicAttributes & SlideProps) {
  return <Slide {...props} direction="left" />;
}

function TransitionSlideUp(props: JSX.IntrinsicAttributes & SlideProps) {
  return <Slide {...props} direction="up" />;
}

function TransitionSlideRight(props: JSX.IntrinsicAttributes & SlideProps) {
  return <Slide {...props} direction="right" />;
}

function TransitionSlideDown(props: JSX.IntrinsicAttributes & SlideProps) {
  return <Slide {...props} direction="down" />;
}

function GrowTransition(props: JSX.IntrinsicAttributes & GrowProps) {
  return <Grow {...props} />;
}

function ZoomTransition(props: JSX.IntrinsicAttributes & ZoomProps) {
  return <Zoom {...props} />;
}

const animation = {
  SlideLeft: TransitionSlideLeft,
  SlideUp: TransitionSlideUp,
  SlideRight: TransitionSlideRight,
  SlideDown: TransitionSlideDown,
  Grow: GrowTransition,
  Zoom: ZoomTransition,
  Fade,
};

type TransitionType = keyof typeof animation;
// eslint-disable-next-line no-restricted-syntax
const iconSX = { marginRight: 8, fontSize: "1.15rem" };

/***************************  SNACKBAR - NOTISTACK  ***************************/

export default function Notistack({ children }: any) {
  const { snackbar } = useGetSnackbar();

  if (snackbar === undefined) return <Loader />;

  return (
    <StyledSnackbarProvider
      maxSnack={snackbar.maxStack}
      dense={snackbar.dense}
      anchorOrigin={snackbar.anchorOrigin}
      TransitionComponent={
        animation[snackbar.transition as TransitionType] // type assertion here
      }
      iconVariant={
        snackbar.iconVariant === "useemojis"
          ? {
              default: <WarningAmberIcon style={iconSX} />,
              success: <CheckCircleIcon style={iconSX} />,
              error: <BugReportIcon style={iconSX} />,
              warning: <CampaignIcon style={iconSX} />,
              info: <InfoIcon style={iconSX} />,
            }
          : undefined
      }
      // eslint-disable-next-line no-restricted-syntax
      hideIconVariant={snackbar.iconVariant === "hide" ? true : false}
    >
      {children}
    </StyledSnackbarProvider>
  );
}
