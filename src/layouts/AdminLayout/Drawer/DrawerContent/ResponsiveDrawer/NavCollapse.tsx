// NavCollapse.tsx
import { useState } from "react";
import { usePathname } from "next/navigation";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import DynamicIcon from "@/components/DynamicIcon";
import NavItem from "./NavItem";
import { NavItemType } from "./menuUtils";
import { useTheme } from "@mui/material/styles";
import useMenuCollapse from "@/hooks/useMenuCollapse";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import * as MuiIcons from "@mui/icons-material";
import List from "@mui/material/List";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
export default function NavCollapse({ item }: { item: NavItemType | any }) {
  const theme = useTheme();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [_selected, setSelected] = useState<string | any>(null);

  const isActive = pathname.includes(item.url || "");
  const hasChildren = item.children && item.children.length > 0;

  useMenuCollapse(item, pathname, false, setSelected, setOpen, undefined);

  const handleClick = () => setOpen(!open);

  const iconColor =
    open || isActive
      ? theme.palette.primary.main
      : theme.palette.text.secondary;

  return (
    <>
      <ListItemButton
        selected={open || isActive}
        onClick={handleClick}
        sx={{
          borderRadius: 1,
          mx: 1,
          my: 0.25,
          "&.Mui-selected": {
            backgroundColor: "action.selected",
            "&:hover": {
              backgroundColor: "action.hover",
            },
          },
        }}
      >
        {/* Always show icon */}
        <ListItemIcon sx={{ minWidth: 36 }}>
          {item.icon && (
            <DynamicIcon
              name={item.icon as keyof typeof MuiIcons}
              size={20}
              color={iconColor}
            />
          )}
        </ListItemIcon>

        <ListItemText
          primary={item.title}
          primaryTypographyProps={{
            variant: "body2",
            fontWeight: open || isActive ? 600 : 500,
            color: open || isActive ? "primary.secondary" : "text.primary",
          }}
        />

        {/* Show expand icon only if there are children */}
        {hasChildren &&
          (open ? (
            <ExpandLess fontSize="small" sx={{ color: iconColor }} />
          ) : (
            <ExpandMore fontSize="small" sx={{ color: iconColor }} />
          ))}
      </ListItemButton>

      {hasChildren && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box
            sx={{
              pl: 4.5,
              position: "relative",
              "&:before": {
                content: '""',
                position: "absolute",
                left: 28,
                top: 0,
                height: "100%",
                width: "1px",
                backgroundColor: "divider",
              },
            }}
          >
            <List disablePadding dense>
              {item.children?.map((child: any, index: any) => (
                <Box
                  key={`${item.id}-child-${index}`}
                  sx={{ position: "relative" }}
                >
                  {child.type === "collapse" ? (
                    <NavCollapse item={child} />
                  ) : (
                    <NavItem item={child} />
                  )}
                </Box>
              ))}
            </List>
          </Box>
        </Collapse>
      )}
    </>
  );
}
