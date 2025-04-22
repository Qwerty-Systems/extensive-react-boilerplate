import * as MuiIcons from "@mui/icons-material"; // Import all MUI icons

interface DynamicIconProps {
  name: keyof typeof MuiIcons; // Enforce valid icon names
  size?: number | string;
  color?: string;
}

export default function DynamicIcon({
  name,
  size = 24,
  color = "black",
}: DynamicIconProps) {
  const IconComponent = MuiIcons[name];

  if (!IconComponent) {
    // Handle invalid icon names
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return <IconComponent style={{ fontSize: size, color }} />;
}
