/***************************  MENU ITEMS - APPLICATIONS  ***************************/

const uiElements = {
  id: "group-ui-elements",
  title: "Finance",
  icon: "Home",
  type: "group",
  roles: ["Admin", "PlatformOwner"],
  children: [
    {
      id: "menu-levels",
      title: "Accounts",
      type: "collapse",
      icon: "IconMenu2",
      roles: ["Admin", "PlatformOwner"],
      children: [
        {
          id: "components",
          title: "Chart of Accounts",
          type: "item",
          icon: "AccountBalanceWallet",
          url: "/admin-panel/accounts",
          roles: ["Admin", "PlatformOwner"],
        },
        {
          id: "components",
          title: "Accounts Payable",
          type: "item",
          icon: "Badge",
          url: "/admin-panel/accounts-payable",
          roles: ["Admin", "PlatformOwner"],
        },
        {
          id: "components",
          title: "Accounts Receivable",
          type: "item",
          icon: "Badge",
          url: "/admin-panel/accounts-receivable",
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
          title: "Payment Methods",
          type: "item",
          icon: "Badge",
          url: "/admin-panel/payment-methods",
          roles: ["Admin", "PlatformOwner"],
        },
        {
          id: "components",
          title: "Payment Aggregators",
          type: "item",
          icon: "Badge",
          url: "/admin-panel/payment-aggregators",
          roles: ["Admin", "PlatformOwner"],
        },
        {
          id: "components",
          title: "Payments",
          type: "item",
          icon: "Badge",
          url: "/admin-panel/payments",
          roles: ["Admin", "PlatformOwner"],
        },
        {
          id: "components",
          title: "Payment Plans",
          type: "item",
          icon: "Badge",
          url: "/admin-panel/payment-plans",
          roles: ["Admin", "PlatformOwner"],
        },
        {
          id: "components",
          title: "Payment Notifications",
          type: "item",
          icon: "Badge",
          url: "/admin-panel/payment-notifications",
          roles: ["Admin", "PlatformOwner"],
        },
      ],
    },
    {
      id: "menu-levels",
      title: "Finance",
      type: "collapse",
      icon: "IconMenu2",
      roles: ["Admin", "PlatformOwner"],
      children: [
        {
          id: "components",
          title: "Discounts",
          type: "item",
          icon: "Badge",
          url: "/admin-panel/discounts",
          roles: ["Admin", "PlatformOwner"],
        },
        {
          id: "components",
          title: "Exceptions",
          type: "item",
          icon: "Badge",
          url: "/admin-panel/exemptions",
          roles: ["Admin", "PlatformOwner"],
        },
      ],
    },

    {
      id: "components",
      title: "Transactions",
      type: "item",
      icon: "Badge",
      url: "/admin-panel/transactions",
      roles: ["Admin", "PlatformOwner"],
    },
  ],
};

export default uiElements;
