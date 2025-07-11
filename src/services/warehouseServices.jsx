// warehouseServices.jsx
import axios from 'axios';
import { BASE_URL } from '../utils/api';

// ترجع مستودع واحد فقط
export const fetchWarehouses = (branchId) =>
  axios.get(`${BASE_URL}/get_one_warehouse/${branchId}`);

// ترجع عناصر المستودع
export const fetchWarehouseItems = (warehouseId) => 
  axios.get(`${BASE_URL}/get_warehouse_materials`, { params: { warehouse_id: warehouseId } });
