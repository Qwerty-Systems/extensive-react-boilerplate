// @mui
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

// @project
import menuItems from "@/menu";
import NavGroup from "./NavGroup";
import { AuthContext } from "@/services/auth/auth-context";
import { useContext, useMemo } from "react";

/***************************  DRAWER CONTENT - RESPONSIVE DRAWER  ***************************/

export default function ResponsiveDrawer() {
  const { user } = useContext(AuthContext);
  const filteredItems = useMemo(() => {
    return menuItems.items.filter((item) => {
      // Show item if no roles defined or user has required role
      const userRoles = user?.role?.name ? [user.role.name] : [];
      return !item.roles || item.roles.some((role) => userRoles.includes(role));
    });
  }, [user]);
  const navGroups = filteredItems.map((item, index) => {
    switch (item.type) {
      case "group":
        return <NavGroup key={index} item={item} />;
      default:
        return (
          <Typography key={index} variant="h6" color="error" align="center">
            Fix - Navigation Group
          </Typography>
        );
    }
  });

  return (
    <Box sx={{ py: 1, transition: "all 0.3s ease-in-out" }}>{navGroups}</Box>
  );
}
