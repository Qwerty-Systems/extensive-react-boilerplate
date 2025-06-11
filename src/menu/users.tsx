/***************************  MENU ITEMS - APPLICATIONS  ***************************/

const uiElements = {
  id: "group-ui-elements",
  title: "Users Management",
  icon: "Home",
  type: "group",
  roles: ["Admin", "PlatformOwner"],
  children: [
    {
      id: "menu-levels",
      title: "Users",
      type: "collapse",
      icon: "IconMenu2",
      roles: ["Admin", "PlatformOwner"],
      children: [
        {
          id: "components",
          title: "Users",
          type: "item",
          icon: "Contacts",
          url: "/admin-panel/users",
          roles: ["Admin", "PlatformOwner"],
        },
        {
          id: "components",
          title: "Customers",
          type: "item",
          icon: "Badge",
          url: "/admin-panel/customers",
          roles: ["Admin", "PlatformOwner"],
        },
        {
          id: "components",
          title: "Agents",
          type: "item",
          icon: "Badge",
          url: "/admin-panel/agents",
          roles: ["Admin", "PlatformOwner"],
        },
      ],
    },
  ],
};

export default uiElements;
