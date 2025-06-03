/***************************  MENU ITEMS - APPLICATIONS  ***************************/

const uiElements = {
  id: "group-ui-elements",
  title: "Finance",
  icon: "Home",
  type: "group",
  children: [
    {
      id: "components",
      title: "Accounts",
      type: "item",
      icon: "AccountBalanceWallet",
      url: "/admin-panel/accounts",
    },
    // {
    //   id: "components",
    //   title: "Transactions",
    //   type: "item",
    //   icon: "Badge",
    //   url: "/admin-panel/transactions",
    // },
    // {
    //   id: "components",
    //   title: "Accounts Payable",
    //   type: "item",
    //   icon: "Badge",
    //   url: "/admin-panel/transactions",
    // },
    // {
    //   id: "components",
    //   title: "Accounts Receivable",
    //   type: "item",
    //   icon: "Badge",
    //   url: "/admin-panel/transactions",
    // },
  ],
};

export default uiElements;
