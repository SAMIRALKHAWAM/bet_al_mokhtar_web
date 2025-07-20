import { BASE_URL } from "../../utils/api";

export const fetchMaterialsByBranch = async (branchId) => {
  const response = await fetch(`${BASE_URL}/get_warehouse_materials?branchId=${branchId}`);
  console.log(response.json);
  if (!response.ok) throw new Error("فشل في تحميل المواد");
  return await response.json();
};

export const addWarehouseMaterialQuantity = async (data) => {
  const response = await fetch(`${BASE_URL}/add_warehouse_materials`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "خطأ في الإضافة");
  }

  return await response.json();
};

export const removeWarehouseMaterialQuantity = async (data) => {
  const response = await fetch(`${BASE_URL}/remove_warehouse_materials`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "خطأ في الإخراج");
  }

  return await response.json();
};
