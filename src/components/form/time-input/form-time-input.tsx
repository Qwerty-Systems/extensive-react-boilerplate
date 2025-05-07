import { Controller } from "react-hook-form";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";

export default function FormTimeInput({
  name,
  label,
  ...props
}: {
  name: string;
  label: string;
  [key: string]: any;
}) {
  return (
    <Controller
      name={name}
      render={({ field, fieldState }) => (
        <TimePicker
          {...field}
          label={label}
          value={field.value ? dayjs(field.value) : null}
          onChange={(time) => field.onChange(time)}
          slotProps={{
            textField: {
              fullWidth: true,
              error: !!fieldState.error,
              helperText: fieldState.error?.message,
            },
          }}
          {...props}
        />
      )}
    />
  );
}
