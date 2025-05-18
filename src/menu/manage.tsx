/***************************  MENU ITEMS - APPLICATIONS  ***************************/

const manage = {
  id: "group-manage",
  title: "Manage",
  icon: "IconBrandAsana",
  type: "group",
  children: [
    {
      id: "dashboard",
      title: "Dashboard",
      type: "item",
      url: "/admin-panel",
      icon: "Dashboard",
    },
    {
      id: "components",
      title: "Tenants",
      type: "item",
      icon: "AdminPanelSettings",
      url: "/admin-panel/tenants",
    },
  ],
};

export default manage;
