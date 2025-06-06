/***************************  MENU ITEMS - APPLICATIONS  ***************************/

const manage = {
  id: "group-manage",
  title: "Manage",
  icon: "IconBrandAsana",
  type: "group",
  roles: ["PlatformOwner"],
  children: [
    {
      id: "dashboard",
      title: "Dashboard",
      type: "item",
      url: "/admin-panel",
      icon: "Dashboard",
      roles: ["PlatformOwner"],
    },
    {
      id: "components",
      title: "Tenants",
      type: "item",
      icon: "AdminPanelSettings",
      url: "/admin-panel/tenants",
      roles: ["PlatformOwner"],
    },
  ],
};

export default manage;
