import useConfig from "@/hooks/useConfig";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

const ThemeSelector = () => {
  const { tenantTheme, availableThemes, setTenantTheme } = useConfig();

  return (
    <FormControl fullWidth size="small">
      <InputLabel>Tenant Theme</InputLabel>
      <Select
        value={tenantTheme?.id || ""}
        onChange={(e) => setTenantTheme(e.target.value as string)}
        label="Tenant Theme"
      >
        {availableThemes.map((theme: any) => (
          <MenuItem key={theme.id} value={theme.id}>
            {theme.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default ThemeSelector;
