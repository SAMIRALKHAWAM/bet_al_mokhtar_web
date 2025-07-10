import axios from 'axios'
import { BASE_URL } from '../utils/api'

export const fetchOffers = () => axios.get(`${BASE_URL}/get_offers`)
export const createOffer = (offerData) => axios.post(`${BASE_URL}/create_offer`, offerData)



export const fetchDiscounts = () => axios.get(`${BASE_URL}/get_discounts`)
export const createDiscount = (discountData) => axios.post(`${BASE_URL}/create_discount`, discountData)

export const fetchBranches = () => axios.get(`${BASE_URL}/get_branches`)

export const fetchItems = () => axios.get(`${BASE_URL}/get_items`)