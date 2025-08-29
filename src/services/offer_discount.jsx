import axios from 'axios'
import { BASE_URL } from '../utils/api'

/* 🔹 دوال مشتركة */
export const fetchBranches = () => axios.get(`${BASE_URL}/get_branches`)
export const fetchItems = () => axios.get(`${BASE_URL}/get_items`)

/* 🔹 دوال مدير المطعم (Restaurant Manager) */
export const fetchAllOffers = () => axios.get(`${BASE_URL}/get_offers`) // بيجيب كل العروض لكل الفروع
export const createOffer = (offerData) => axios.post(`${BASE_URL}/create_offer`, offerData)

export const fetchAllDiscounts = () => axios.get(`${BASE_URL}/get_discounts`) // كل الخصومات
export const createDiscount = (discountData) => axios.post(`${BASE_URL}/create_discount`, discountData)


export const fetchBranchOffers = (branchId) => {
  console.log("📍 branchId for offer: " + branchId)
  return axios.get(`${BASE_URL}/get_offers?branchId=${branchId}`)
}

export const fetchBranchDiscounts = (branchId) => {
  console.log("📍 branchId for discount: " + branchId)
  return axios.get(`${BASE_URL}/get_discounts?branchId=${branchId}`)
}

export const createBranchDiscount = (discountData) => axios.post(`${BASE_URL}/create_discount`, discountData)
