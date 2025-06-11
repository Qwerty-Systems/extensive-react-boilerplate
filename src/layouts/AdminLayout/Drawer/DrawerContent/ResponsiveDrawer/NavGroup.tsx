// // @mui
// import List from "@mui/material/List";
// import Typography from "@mui/material/Typography";

// // @project
// import NavCollapse from "./NavCollapse";
// import NavItem from "./NavItem";
// import { AuthContext } from "@/services/auth/auth-context";
// import { useContext, useMemo } from "react";

// /***************************  RESPONSIVE DRAWER - GROUP  ***************************/

// export default function NavGroup({ item }: any) {
//   const { user } = useContext(AuthContext);

//   const filteredChildren = useMemo(() => {
//     const userRoles = user?.role?.name ? [user.role.name] : [];

//     const filterItems = (items: any[]): any[] => {
//       return items.filter((menuItem) => {
//         // Check if item has children (recursive)
//         if (menuItem.children) {
//           menuItem.children = filterItems(menuItem.children);
//           return menuItem.children.length > 0;
//         }
//         // Check role permissions
//         return (
//           !menuItem.roles ||
//           menuItem.roles.some((r: string) => userRoles.includes(r))
//         );
//       });
//     };

//     return item.children ? filterItems([...item.children]) : [];
//   }, [item.children, user]);
//   const renderNavItem = (menuItem: any) => {
//     // Render items based on the type
//     // Create unique key by combining parent and child IDs
//     const uniqueKey = `${item.id}-${menuItem.id}`;
//     switch (menuItem.type) {
//       case "collapse":
//         return <NavCollapse key={uniqueKey} item={menuItem} />;
//       case "item":
//         return <NavItem key={uniqueKey} item={menuItem} />;
//       default:
//         return (
//           <Typography key={uniqueKey} variant="h6" color="error" align="center">
//             Fix - Group Collapse or Items
//           </Typography>
//         );
//     }
//   };

//   return (
//     <List
//       component="div"
//       subheader={
//         filteredChildren.length > 0 && (
//           <Typography
//             component="div"
//             variant="caption"
//             sx={{ mb: 0.75, color: "grey.700" }}
//           >
//             {item.title}
//           </Typography>
//         )
//       }
//       sx={{
//         "&:not(:first-of-type)": {
//           pt: 1,
//           borderTop: "1px solid",
//           borderColor: "divider",
//         },
//       }}
//     >
//       {filteredChildren.map(renderNavItem)}
//     </List>
//   );
// }
// NavGroup.tsx
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import NavCollapse from "./NavCollapse";
import NavItem from "./NavItem";
import { NavItemType } from "./menuUtils";

export default function NavGroup({ item }: { item: NavItemType }) {
  return (
    <List
      component="div"
      subheader={
        item?.children &&
        item?.children?.length > 0 && (
          <Typography
            component="div"
            variant="subtitle2"
            sx={{
              px: 2,
              py: 1,
              color: "text.secondary",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {item.title}
          </Typography>
        )
      }
      sx={{
        "&:not(:first-of-type)": {
          mt: 2,
        },
      }}
    >
      {item.children?.map((child, index) => {
        const key = `${item.id}-child-${index}`;

        return child.type === "collapse" ? (
          <NavCollapse key={key} item={child} />
        ) : (
          <NavItem key={key} item={child} />
        );
      })}
    </List>
  );
}
