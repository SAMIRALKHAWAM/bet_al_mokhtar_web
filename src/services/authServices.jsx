import { BASE_URL } from "../utils/api";
export const login = async (username, password) => {
  const loginBody = JSON.stringify({ user_name: username, password });

  const tryLogin = async (url) => {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: loginBody,
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || "فشل تسجيل الدخول");
    }
    return result.data;
  };

  try {
    const adminData = await tryLogin("/admin_login");
    return {
      id: adminData.id,
      name: adminData.name,
      username: adminData.user_name,
      type: adminData.type, // admin / subadmin
      token: adminData.token,
       branchId: adminData.branch_id,
    };
  } catch {
    try {
      const empData = await tryLogin("/employee_login");
      return {
        id: empData.id,
        name: empData.name,
        username: empData.user_name,
        type: empData.type, // cashier / warehouseman / accountant ...
        token: empData.token,
        branchId: empData.branch_id,
        branchName: empData.branch_name,
      };
    } catch {
      throw new Error("اسم المستخدم أو كلمة المرور غير صحيحة");
    }
  }
};
