/***************************  MENU ITEMS - APPLICATIONS  ***************************/

const uiElements = {
  id: "group-ui-elements",
  title: "Users Management",
  icon: "Home",
  type: "group",
  roles: [],
  children: [
    {
      id: "components",
      title: "Users",
      type: "item",
      icon: "Contacts",
      url: "/admin-panel/users",
      roles: [],
    },
    {
      id: "components",
      title: "Agents",
      type: "item",
      icon: "Badge",
      url: "/admin-panel/agents",
      roles: [],
    },
  ],
};

export default uiElements;
