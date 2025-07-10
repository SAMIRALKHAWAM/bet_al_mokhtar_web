import axios from 'axios'

import { BASE_URL } from '../utils/api'


export const fetchWarehouses = () => axios.get(`${BASE_URL}/get_warehouses`)

export const fetchWarehouseItems = (warehouseId) => 
  axios.get(`${BASE_URL}/get_warehouse_materials`, { params: { warehouse_id: warehouseId } })


