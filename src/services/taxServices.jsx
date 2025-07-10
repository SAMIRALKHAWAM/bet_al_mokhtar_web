import axios from 'axios'

import { BASE_URL } from '../utils/api'


export const fetchTaxes = () => axios.get(`${BASE_URL}/get_taxes`)
export const createTax = (data) => axios.post(`${BASE_URL}/create_tax`, data)
export const updateTax = (id, data) => axios.post(`${BASE_URL}/update_one_tax/${id}`, data)
export const deleteTax = (id) => axios.delete(`${BASE_URL}/delete_one_tax/${id}`)
