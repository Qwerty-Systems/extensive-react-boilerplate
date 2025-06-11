// ResponsiveDrawer.tsx
import { useContext, useMemo } from "react";
import Box from "@mui/material/Box";
import { AuthContext } from "@/services/auth/auth-context";
import NavGroup from "./NavGroup";
import menuItems from "@/menu";
import { filterMenuItems, NavItemType } from "./menuUtils";

export default function ResponsiveDrawer() {
  const { user } = useContext(AuthContext);

  const filteredItems = useMemo(
    () =>
      filterMenuItems(
        menuItems.items as NavItemType[],
        user?.role?.name ? [user.role.name] : []
      ),
    [user]
  );

  return (
    <Box
      sx={{
        py: 1,
        maxHeight: "calc(100vh - 64px)",
        overflowY: "auto",
        "&::-webkit-scrollbar": { width: 8 },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "divider",
          borderRadius: 4,
        },
      }}
    >
      {filteredItems.map((item: any, index: any) => (
        <NavGroup key={`group-${index}`} item={item} />
      ))}
    </Box>
  );
}
