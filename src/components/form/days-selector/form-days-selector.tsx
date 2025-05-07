import { Controller } from "react-hook-form";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

const DAYS = [
  { value: "mon", label: "Monday" },
  { value: "tue", label: "Tuesday" },
  { value: "wed", label: "Wednesday" },
  { value: "thu", label: "Thursday" },
  { value: "fri", label: "Friday" },
  { value: "sat", label: "Saturday" },
  { value: "sun", label: "Sunday" },
];

export default function FormDaysSelector({
  name,
  label,
}: {
  name: string;
  label: string;
}) {
  return (
    <Controller
      name={name}
      render={({ field, fieldState }) => (
        <FormControl component="fieldset" error={!!fieldState.error} fullWidth>
          <FormLabel component="legend">{label}</FormLabel>
          <FormGroup>
            <Box display="flex" flexWrap="wrap">
              {DAYS.map((day) => (
                <FormControlLabel
                  key={day.value}
                  control={
                    <Checkbox
                      checked={field.value?.includes(day.value)}
                      onChange={(e) => {
                        const newValue = e.target.checked
                          ? [...field.value, day.value]
                          : field.value.filter((v: string) => v !== day.value);
                        field.onChange(newValue);
                      }}
                    />
                  }
                  label={day.label}
                />
              ))}
            </Box>
          </FormGroup>
        </FormControl>
      )}
    />
  );
}
