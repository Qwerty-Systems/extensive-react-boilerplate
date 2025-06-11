import styled from "@emotion/styled";
import Typography from "@mui/material/Typography";

export const Container = styled("div")`
  display: inline-flex;
`;

export const Picker = styled("div")`
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

export const Swatch = styled("div")<{ color: string }>`
  background-color: ${({ color }) => color};
  width: 24px;
  height: 24px;
  border-radius: 5px;
  border: 3px solid #fff;
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.1),
    inset 0 0 0 1px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  margin-top: 8px;
`;

export const Popover = styled("div")`
  position: absolute;
  bottom: calc(100% + 8px);
  left: calc(-50% - 56px);
  border-radius: 9px;
  z-index: 2;
  background: rgba(225, 225, 225, 0.9);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
`;

export const DefaultColors = styled("div")`
  display: flex;
  flex-direction: column;
  margin: 8px 0;
`;

export const DefaultColorRow = styled("div")`
  display: flex;
  justify-content: space-between;
  margin: 4px 16px;
`;

export const Box = styled("div")<{ color: string }>`
  width: 20px;
  height: 20px;
  background-color: ${({ color }) => color};
  border-radius: 5px;
  border: 2px solid #fff;
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.1),
    inset 0 0 0 1px rgba(0, 0, 0, 0.1);

  &:hover {
    cursor: pointer;
  }
`;

export const StyledTypography = styled(Typography)`
  margin-left: 16px;
  margin-top: 8px;
`;
