import { BASE_URL } from "../utils/api";
import axios from "axios";

export const fetchMaterials = async () => {
  const res = await axios.get(`${BASE_URL}/get_materials`);
  if (!res.data.success) throw new Error(res.data.message || "فشل جلب المواد");
  return res.data.data;
};


export const createMaterial = async (payload) => {
  const res = await axios.post(`${BASE_URL}/create_material`, payload);
  if (!res.data.success) throw new Error(res.data.message || "فشل إنشاء المادة");
  return res.data.data;
};


export const updateMaterial = async (id, payload) => {
  const res = await axios.post(`${BASE_URL}/update_one_material/${id}`, payload);
  if (!res.data.success) throw new Error(res.data.message || "فشل تحديث المادة");
  return res.data.data;
};


export const deleteMaterial = async (id) => {
  const res = await axios.delete(`${BASE_URL}/delete_one_material/${id}`);
  if (!res.data.success) throw new Error(res.data.message || "فشل حذف المادة");
  return res.data.data;
};
