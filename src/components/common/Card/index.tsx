import Grid from "@mui/material/Grid2";
import { Paper, Title, Wrapper } from "./styles";
import React from "react";

interface CardProps {
  title?: React.ReactNode;
  children?: React.ReactNode;
  contained?: boolean;
}

export const Card: React.FC<CardProps> = ({ title, children, contained }) => (
  <Paper>
    {!!title && (
      <Grid size={{ xs: 12 }} marginX={2}>
        <Title variant="h6">{title}</Title>
      </Grid>
    )}
    <Grid size={{ xs: 12 }}>
      <Wrapper contained={contained}>{children}</Wrapper>
    </Grid>
  </Paper>
);
