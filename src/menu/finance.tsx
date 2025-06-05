/***************************  MENU ITEMS - APPLICATIONS  ***************************/

const uiElements = {
  id: "group-ui-elements",
  title: "Finance",
  icon: "Home",
  type: "group",
  roles: [],
  children: [
    {
      id: "components",
      title: "Chart of Accounts",
      type: "item",
      icon: "AccountBalanceWallet",
      url: "/admin-panel/accounts",
      roles: [],
    },
    {
      id: "components",
      title: "Accounts payable",
      type: "item",
      icon: "Badge",
      url: "/admin-panel/transactions",
    },
    {
      id: "components",
      title: "Accounts Payable",
      type: "item",
      icon: "Badge",
      url: "/admin-panel/accounts-payable",
    },
    {
      id: "components",
      title: "Accounts Receivable",
      type: "item",
      icon: "Badge",
      url: "/admin-panel/accounts-receivable",
    },
    {
      id: "components",
      title: "Discounts",
      type: "item",
      icon: "Badge",
      url: "/admin-panel/discounts",
    },
    {
      id: "components",
      title: "Exceptions",
      type: "item",
      icon: "Badge",
      url: "/admin-panel/exceptions",
    },
    {
      id: "components",
      title: "Invoices",
      type: "item",
      icon: "Badge",
      url: "/admin-panel/invoices",
    },
    {
      id: "components",
      title: "Transactions",
      type: "item",
      icon: "Badge",
      url: "/admin-panel/transactions",
    },
    {
      id: "components",
      title: "Payments",
      type: "item",
      icon: "Badge",
      url: "/admin-panel/payments",
    },
    {
      id: "components",
      title: "Payment Plans",
      type: "item",
      icon: "Badge",
      url: "/admin-panel/payment-plans",
    },
  ],
};

export default uiElements;
