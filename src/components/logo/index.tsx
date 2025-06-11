"use client";

import { generateFocusStyle } from "@/utils/generateFocusStyle";
import ButtonBase from "@mui/material/ButtonBase";
import Link from "@mui/material/Link";
import { useTheme } from "@mui/material/styles";
import LogoIcon from "./LogoIcon";
import LogoMain from "./LogoMain";
import { APP_DEFAULT_PATH } from "@/config";
// @next

// import Link from "../link";
/***************************  MAIN - LOGO  ***************************/

interface LogoSectionProps {
  isIcon?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sx?: any;
  to?: string;
}

export default function LogoSection({ isIcon, sx, to }: LogoSectionProps) {
  const theme = useTheme();
  return (
    <Link href={!to ? APP_DEFAULT_PATH : to}>
      <ButtonBase
        disableRipple
        sx={{
          ...sx,
          "&:focus-visible": generateFocusStyle(theme.palette.primary.main),
        }}
        aria-label="logo"
      >
        {isIcon ? <LogoIcon /> : <LogoMain />}
      </ButtonBase>
    </Link>
  );
}
