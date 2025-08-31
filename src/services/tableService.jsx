import { BASE_URL } from "../utils/api";

export const getTables = async (branchId) => {
  const res = await fetch(`${BASE_URL}/get_tables?branchId=${branchId}`);
  console.log("${branchId}"+branchId);
  if (!res.ok) throw new Error("فشل جلب الطاولات");
  return res.json();
};

export const createTable = async (payload) => {
  const res = await fetch(`${BASE_URL}/create_table`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
};

export const updateTable = async (id, payload) => {
  const res = await fetch(`${BASE_URL}/update_one_table/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
};

export const deleteTable = async (id) => {
  const res = await fetch(`${BASE_URL}/delete_one_table/${id}`, {
    method: "DELETE",
  });
  return res.json();
};