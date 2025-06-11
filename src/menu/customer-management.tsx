/***************************  MENU ITEMS - PAGES  ***************************/

const pages = {
  id: "group-page",
  title: "Customer Management",
  icon: "IconDotsVertical",
  type: "group",
  roles: ["Admin", "PlatformOwner"],
  children: [
    {
      id: "menu-levels",
      title: "Residence",
      type: "collapse",
      icon: "IconMenu2",
      roles: ["Admin", "PlatformOwner"],
      children: [
        {
          id: "sample-page",
          title: "Regions",
          type: "item",
          url: "/admin-panel/regions",
          icon: "ShareLocation",
          roles: ["Admin", "PlatformOwner"],
        },
        {
          id: "components",
          title: "Residence",
          type: "item",
          icon: "MapsHomeWork",
          url: "/admin-panel/residence",
          roles: ["Admin", "PlatformOwner"],
        },
      ],
    },
    {
      id: "menu-levels",
      title: "Payments",
      type: "collapse",
      icon: "IconMenu2",
      roles: ["Admin", "PlatformOwner"],
      children: [
        {
          id: "components",
          title: "Customer Plans",
          type: "item",
          icon: "Badge",
          url: "/admin-panel/customer-plans",
          roles: ["Admin", "PlatformOwner"],
        },
        {
          id: "components",
          title: "Invoices",
          type: "item",
          icon: "Badge",
          url: "/admin-panel/invoices",
          roles: ["Admin", "PlatformOwner"],
        },
      ],
    },
  ],
};

export default pages;
