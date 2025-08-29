import axios from 'axios';
import { BASE_URL } from '../utils/api';

// جلب كل الفواتير لكل الصفحات
export const getAllInvoices = async (branchId = null) => {
  let allInvoices = [];
  let page = 1;
  let lastPage = 1;

  try {
    do {
      const url = branchId
        ? `${BASE_URL}/get_invoices?branchId=${branchId}&status=done&page=${page}`
        : `${BASE_URL}/get_invoices?page=${page}`;
      
      const res = await axios.get(url);

      if (res.data.success) {
        allInvoices = [...allInvoices, ...res.data.data];
        lastPage = res.data.last_page;
        page++;
      } else {
        throw new Error(res.data.message || 'فشل في جلب الفواتير');
      }
    } while (page <= lastPage);

    return allInvoices;
  } catch (error) {
    throw new Error(error.message || 'خطأ أثناء الاتصال بالسيرفر');
  }
};

export const printInvoiceUrl = (id) => `${BASE_URL}/print_invoice/${id}`;
