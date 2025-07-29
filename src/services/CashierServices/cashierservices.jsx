
import { BASE_URL } from "../../utils/api";
import axios from "axios";

export const fetchInvoicesByStatus = async (branchId, status) => {
  const response = await fetch(
    `${BASE_URL}/get_invoices?branchId=${branchId}&status=${status}`
  );
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
