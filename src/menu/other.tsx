/***************************  MENU ITEMS - APPLICATIONS  ***************************/

const other = {
  id: "group-other",
  title: "Other",
  icon: "IconDotsVertical",
  type: "group",
  roles: ["Admin", "PlatformOwner"],
  children: [
    {
      id: "changelog",
      title: "Audit log",
      type: "item",
      url: "/admin-panel/audit-logs",
      target: false,
      icon: "IconHistory",
      roles: ["Admin", "PlatformOwner"],
    },
    {
      id: "changelog",
      title: "Changelog",
      type: "item",
      url: "https://phoenixcoded.gitbook.io/saasable/changelog",
      target: true,
      icon: "IconHistory",
      roles: ["Admin", "PlatformOwner"],
    },
    {
      id: "documentation",
      title: "Documentation",
      type: "item",
      url: "https://phoenixcoded.gitbook.io/saasable",
      target: true,
      icon: "IconNotes",
      roles: ["Admin", "PlatformOwner"],
    },
    {
      id: "support",
      title: "Support",
      type: "item",
      url: "https://support.phoenixcoded.net",
      target: true,
      icon: "IconLifebuoy",
      roles: ["Admin", "PlatformOwner"],
    },
  ],
};

export default other;
