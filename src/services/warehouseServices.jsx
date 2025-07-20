import axios from 'axios';
import { BASE_URL } from '../utils/api';

export const fetchBranches = () =>
  axios.get(`${BASE_URL}/get_branches`);

export const fetchWarehouseByBranch = (branchId) =>
  axios.get(`${BASE_URL}/get_one_warehouse/${branchId}`);

export const getMaterials = () =>
  axios.get(`${BASE_URL}/get_materials`);

export const createMaterial = (data) =>
  axios.post(`${BASE_URL}/add_material`, data);

export const deleteMaterial = (id) =>
  axios.delete(`${BASE_URL}/delete_material/${id}`);

export const handleWarehouseAction = (type, data) =>
  axios.post(`${BASE_URL}/${type}_warehouse_materials`, data);