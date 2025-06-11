import styled from "@emotion/styled";
import { css } from "@emotion/react";
// eslint-disable-next-line no-restricted-imports
import { Paper as MUIPaper, Typography } from "@mui/material";

export const Paper = styled(MUIPaper)`
  padding: 8px 0;
  margin-bottom: 16px;
`;

export const Title = styled(Typography)`
  margin-bottom: 8px;
`;

export const Wrapper = styled("div")<{ contained?: boolean }>`
  ${({ contained }) =>
    !!contained &&
    css`
      padding: 0 16px;
    `}
`;
