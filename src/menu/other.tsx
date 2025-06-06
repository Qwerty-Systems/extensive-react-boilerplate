/***************************  MENU ITEMS - APPLICATIONS  ***************************/

const other = {
  id: "group-other",
  title: "Other",
  icon: "IconDotsVertical",
  type: "group",
  roles: [],
  children: [
    {
      id: "changelog",
      title: "Changelog",
      type: "item",
      url: "https://phoenixcoded.gitbook.io/saasable/changelog",
      target: true,
      icon: "IconHistory",
      roles: [],
    },
    {
      id: "documentation",
      title: "Documentation",
      type: "item",
      url: "https://phoenixcoded.gitbook.io/saasable",
      target: true,
      icon: "IconNotes",
      roles: [],
    },
    {
      id: "support",
      title: "Support",
      type: "item",
      url: "https://support.phoenixcoded.net",
      target: true,
      icon: "IconLifebuoy",
      roles: [],
    },
  ],
};

export default other;
