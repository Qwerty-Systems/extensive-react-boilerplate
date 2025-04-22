/***************************  MENU ITEMS - APPLICATIONS  ***************************/

const uiElements = {
  id: "group-ui-elements",
  title: "Users",
  icon: "Home",
  type: "group",
  children: [
    {
      id: "components",
      title: "Tenants",
      type: "item",
      icon: "Home",
      url: "/admin-panel/tenants",
    },
    {
      id: "components",
      title: "Users",
      type: "item",
      icon: "Home",
      url: "/admin-panel/users",
    },
  ],
};

export default uiElements;
