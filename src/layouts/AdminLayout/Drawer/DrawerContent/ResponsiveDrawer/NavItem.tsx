// NavItem.tsx
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { handlerActiveItem, handlerDrawerOpen } from "@/states/menu";
import DynamicIcon from "@/components/DynamicIcon";
// eslint-disable-next-line no-restricted-imports
import Link from "next/link";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { NavItemType } from "./menuUtils";
import * as MuiIcons from "@mui/icons-material";
export default function NavItem({
  item,
  level = 0,
}: {
  item: NavItemType;
  level?: number;
}) {
  const theme = useTheme();
  const downMD = useMediaQuery(theme.breakpoints.down("md"));
  const pathname = usePathname();
  const isActive = pathname === item.url;

  useEffect(() => {
    if (isActive) handlerActiveItem(item.id);
  }, [isActive, item.id]);

  const handleClick = () => {
    if (downMD) handlerDrawerOpen(false);
  };

  return (
    <Link href={item.url || "#"} passHref legacyBehavior>
      <ListItemButton
        component="a"
        selected={isActive}
        onClick={handleClick}
        sx={{
          borderRadius: 1,
          mx: 1,
          mb: 0.5,
          pl: 2 + level * 2, // Indentation based on level
          "&.Mui-selected": {
            backgroundColor: "primary.light",
            color: "primary.main",
            "&:hover": {
              backgroundColor: "primary.lighter",
            },
            "& .MuiListItemIcon-root": {
              color: "primary.main",
            },
          },
        }}
      >
        {/* Always show icon regardless of level */}
        <ListItemIcon sx={{ minWidth: 36 }}>
          {item.icon && (
            <DynamicIcon
              name={item.icon as keyof typeof MuiIcons}
              size={20}
              color={isActive ? "primary.main" : "text.secondary"}
            />
          )}
        </ListItemIcon>
        <ListItemText
          primary={item.title}
          primaryTypographyProps={{
            variant: "body2",
            fontWeight: isActive ? 600 : 500,
            color: isActive ? "primary.main" : "text.primary",
          }}
        />
      </ListItemButton>
    </Link>
  );
}
