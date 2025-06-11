// menu-items/index.ts
import manage from "./manage";
import other from "./other";
import customerManagement from "./customer-management";
import users from "./users";
import finance from "./finance";

const menuItems = {
  items: [manage, users, customerManagement, finance, other],
};

export default menuItems;
