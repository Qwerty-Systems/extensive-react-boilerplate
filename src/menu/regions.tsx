/***************************  MENU ITEMS - PAGES  ***************************/

const pages = {
  id: "group-page",
  title: "Regions",
  icon: "IconDotsVertical",
  type: "group",
  roles: [],
  children: [
    {
      id: "sample-page",
      title: "Regions",
      type: "item",
      url: "/admin-panel/regions",
      icon: "ShareLocation",
      roles: [],
    },
    {
      id: "components",
      title: "Residence",
      type: "item",
      icon: "MapsHomeWork",
      url: "/admin-panel/residence",
      roles: [],
    },
  ],
};

export default pages;
