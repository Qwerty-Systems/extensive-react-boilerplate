import { ComponentProps } from "react";
import { Spinner } from "../Spinner";
import Box from "@mui/material/Box";

type Props = ComponentProps<typeof Box>;

export function Loading({ sx, ...props }: Props) {
  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
        color: "primary.main",
        ...sx,
      }}
      {...props}
    >
      <Spinner />
    </Box>
  );
}
