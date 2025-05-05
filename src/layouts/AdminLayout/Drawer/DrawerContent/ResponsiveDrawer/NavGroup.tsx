// @mui
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";

// @project
import NavCollapse from "./NavCollapse";
import NavItem from "./NavItem";

/***************************  RESPONSIVE DRAWER - GROUP  ***************************/

export default function NavGroup({ item }: any) {
  const renderNavItem = (menuItem: any) => {
    // Render items based on the type
    // Create unique key by combining parent and child IDs
    const uniqueKey = `${item.id}-${menuItem.id}`;
    switch (menuItem.type) {
      case "collapse":
        return <NavCollapse key={uniqueKey} item={menuItem} />;
      case "item":
        return <NavItem key={uniqueKey} item={menuItem} />;
      default:
        return (
          <Typography key={uniqueKey} variant="h6" color="error" align="center">
            Fix - Group Collapse or Items
          </Typography>
        );
    }
  };

  return (
    <List
      component="div"
      subheader={
        <Typography
          component="div"
          variant="caption"
          sx={{ mb: 0.75, color: "grey.700" }}
        >
          {item.title}
        </Typography>
      }
      sx={{
        "&:not(:first-of-type)": {
          pt: 1,
          borderTop: "1px solid",
          borderColor: "divider",
        },
      }}
    >
      {item.children?.map((menuItem: any) => renderNavItem(menuItem))}
    </List>
  );
}
