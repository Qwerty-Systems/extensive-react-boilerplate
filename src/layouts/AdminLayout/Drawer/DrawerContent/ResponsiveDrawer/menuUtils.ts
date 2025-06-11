export type NavItemType = {
  id: string;
  title: string;
  icon?: string;
  type: "group" | "collapse" | "item";
  url?: string;
  target?: boolean;
  disabled?: boolean;
  roles?: string[];
  children?: NavItemType[];
};
export const filterMenuItems = (
  items: NavItemType[],
  userRoles: string[]
): NavItemType[] => {
  return items
    .map((item) => {
      if (item.roles && !item.roles.some((role) => userRoles.includes(role))) {
        return null;
      }

      if (item.children) {
        const filteredChildren = filterMenuItems(item.children, userRoles);
        if (filteredChildren.length === 0) {
          return null;
        }

        return { ...item, children: filteredChildren };
      }

      return item;
    })
    .filter((item): item is NavItemType => item !== null);
};
