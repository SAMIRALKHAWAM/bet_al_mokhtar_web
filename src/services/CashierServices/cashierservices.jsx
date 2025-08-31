import { BASE_URL } from "../../utils/api";
import axios from "axios";

export const fetchInvoicesByStatus = async (branchId, status,page = 1) => {
  const response = await fetch(`${BASE_URL}/get_invoices?branchId=${branchId}&status=${status}&page=${page}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "فشل في جلب الفواتير");
  }
  return await response.json();
};

export const getInvoiceDetails = (invoiceId) => {
  return axios.get(`${BASE_URL}/print_invoice/${invoiceId}`);
};

export const getDiscounts = () => {
  return axios.get(`${BASE_URL}/get_discounts`);
};


export const changeInvoiceStatus = (invoiceId, payload) => {
  return axios.post(`${BASE_URL}/change_invoice_status/${invoiceId}`, payload);
};


 export const fetchInvoiceById = async (invoiceId) => {
  const res = await fetch(`${BASE_URL}/print_invoice/${invoiceId}`);
  const result = await res.json();
  if (!res.ok || !result.success) throw new Error(result.message || "فشل جلب الفاتورة");
  return result.data; 
};

export const fetchAllReservations = async (branchId) => {
  let allReservations = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const response = await fetch(`${BASE_URL}/get_table_reservations?branchId=${branchId}&page=${page}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "فشل في جلب الحجوزات");
    }
    const result = await response.json();
    if (result.success && result.data.length > 0) {
      allReservations = [...allReservations, ...result.data];
      page++;
      if (result.meta && page > result.meta.last_page) hasMore = false;
    } else {
      hasMore = false;
    }
  }

  return allReservations;
};

export const deleteReservation = async (reservationId) => {
  const response = await fetch(`${BASE_URL}/delete_table_reservation/${reservationId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "فشل في حذف الحجز");
  }
  return await response.json();
};
