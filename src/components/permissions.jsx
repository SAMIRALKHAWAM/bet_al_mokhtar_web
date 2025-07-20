// permissions.js

export const getPermissions = (type) => {
  switch (type) {
    case "manager":
      return ["view_all_branches", "manage_employees", "view_reports"];
    case "branch_manager":
      return ["view_branch", "view_orders", "view_tables"];
    case "cashier":
      return ["create_invoice", "view_payments"];
    case "warehouseman":
      return ["manage_inventory"];
    case "accountant":
      return ["view_finance", "view_reports"];
    default:
      return [];
  }
};
