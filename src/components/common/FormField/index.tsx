import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import { SxProps } from "@mui/material/styles";
import React from "react";

interface FormFieldProps {
  label?: string;
  htmlFor: string;
  children: React.ReactNode;
  error?: string | string[];
  touched?: boolean;
  sx?: SxProps;
}

export const FormField: React.FC<FormFieldProps> = ({
  children,
  label,
  touched,
  error,
  htmlFor,
  sx,
}) => {
  return (
    <FormControl
      error={!!error && !!touched}
      variant="standard"
      sx={{ display: "flex", ...sx }}
    >
      {label && <InputLabel htmlFor={htmlFor}>{label}</InputLabel>}
      {children}
      {!!error && touched && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};
